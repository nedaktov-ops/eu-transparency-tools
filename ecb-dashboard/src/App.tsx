import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import IndicatorDetail from './pages/IndicatorDetail.tsx'
import About from './pages/About.tsx'

export default function App() {
  return (
    <Layout>
      <div className="bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/indicator/:seriesKey" element={<IndicatorDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  )
}
