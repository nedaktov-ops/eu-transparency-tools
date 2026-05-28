import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import MEPProfile from './pages/MEPProfile.tsx'
import VoteDetail from './pages/VoteDetail.tsx'
import About from './pages/About.tsx'

export default function App() {
  return (
    <Layout>
      <div className="bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mep/:id" element={<MEPProfile />} />
          <Route path="/vote/:id" element={<VoteDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  )
}
