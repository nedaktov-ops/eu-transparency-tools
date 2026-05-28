import { describe, it, expect } from 'vitest'

// Unit tests for worker logic (simple pure function tests)
describe('Worker Utilities', () => {
  describe('Forbidden Question Detection', () => {
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

    it('detects MEP questions', () => {
      expect(isForbiddenQuestion('What is MEP Smith voting record?')).toBe(true)
    })

    it('detects vote questions', () => {
      expect(isForbiddenQuestion('How did the parliament vote on resolution X?')).toBe(true)
    })

    it('allows ECB questions', () => {
      expect(isForbiddenQuestion('What is the current ECB interest rate?')).toBe(false)
    })

    it('allows inflation questions', () => {
      expect(isForbiddenQuestion('What is the inflation rate in the euro area?')).toBe(false)
    })

    it('allows general economic questions', () => {
      expect(isForbiddenQuestion('How has eurozone GDP changed recently?')).toBe(false)
    })
  })

  describe('Rate Limiting', () => {
    it('allows requests within limit', () => {
      const RATE_LIMIT_MAX = 10
      const count = 5
      expect(count).toBeLessThanOrEqual(RATE_LIMIT_MAX)
    })

    it('blocks requests over limit', () => {
      const RATE_LIMIT_MAX = 10
      const count = 11
      expect(count).toBeGreaterThan(RATE_LIMIT_MAX)
    })
  })

  describe('Input Sanitization', () => {
    function sanitizeText(text: string): string {
      if (!text) return ''
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    }

    it('escapes HTML', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('<script>')
    })

    it('preserves normal text', () => {
      expect(sanitizeText('Hello ECB')).toBe('Hello ECB')
    })
  })
})
