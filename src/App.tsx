import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'
import AuthModal from './components/auth/AuthModal'

export default function App() {
  return (
    <BrowserRouter>
      <AuthModal />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </BrowserRouter>
  )
}
