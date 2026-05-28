/**
 * EU AI Chat Worker — Cloudflare Edge Worker
 * 
 * Provides AI-powered answers about ECB economic data ONLY.
 * Restricted by OLG Hamm ruling (May 2026): operator is fully liable
 * for AI outputs. MEP voting questions are strictly forbidden.
 * 
 * Rate limited: 10 requests/min/IP
 * No user data collected. No cookies. No analytics.
 */

import { sanitizeText } from './lib/validation.ts'

interface Env {
  GROQ_API_KEY: string
}

interface ChatRequest {
  message: string
}

interface ChatResponse {
  reply: string
  error?: string
}

// Rate limit: simple in-memory counter (resets per Worker invocation)
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 10
const requestLog = new Map<string, { count: number; windowStart: number }>()

// Forbidden topics that the AI must not answer
const FORBIDDEN_PATTERNS = [
  /mep/i,
  /vote/i,
  /member of parliament/i,
  /european parliament/i,
  /how did .* vote/i,
  /position on/i,
  /voting record/i,
]

function isForbiddenQuestion(message: string): boolean {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(message))
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now()
  const entry = requestLog.get(clientIp)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLog.set(clientIp, { count: 1, windowStart: now })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

function buildSystemPrompt(): string {
  return `You are an AI assistant specialized in European Central Bank (ECB) economic data.

You can ONLY answer questions about:
- ECB interest rates and monetary policy
- Euro area inflation (HICP) data
- Euro area GDP and economic indicators
- Euro foreign exchange rates
- ECB Statistical Data Warehouse (SDW) data

You MUST REFUSE to answer:
- ANY questions about Members of the European Parliament (MEPs)
- ANY questions about voting records or positions
- ANY questions about European Parliament legislation
- ANY political analysis or commentary

If asked about MEPs or voting, respond: "I cannot answer questions about MEPs or voting records. This assistant is restricted to ECB economic data only."

Always cite official ECB sources when possible.
Keep responses factual, concise, and neutral. No editorializing.`
}

function buildCORSHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Security-Policy': "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; connect-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  }
}

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
  const corsHeaders = buildCORSHeaders()

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Rate limiting
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded. Maximum 10 requests per minute.',
    }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Parse request
  let body: ChatRequest
  try {
    body = await request.json() as ChatRequest
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Sanitize input
  const sanitizedMessage = sanitizeText(body.message.trim())

  // Check for forbidden questions
  if (isForbiddenQuestion(sanitizedMessage)) {
    const response: ChatResponse = {
      reply: 'I cannot answer questions about MEPs or voting records. This assistant is restricted to ECB economic data only.',
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Forward to Groq API
  const groqApiKey = env.GROQ_API_KEY
  if (!groqApiKey) {
    return new Response(JSON.stringify({ error: 'AI service not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: sanitizedMessage },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!groqResponse.ok) {
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const groqData = await groqResponse.json() as any
    const reply = groqData?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleChatRequest(request, env)
  },
}
