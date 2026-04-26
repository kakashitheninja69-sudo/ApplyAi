import { useEffect } from 'react'
import { HashRouter as BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage   from './pages/LandingPage'
import BuilderPage   from './pages/BuilderPage'
import TemplatesPage from './pages/TemplatesPage'
import PrivacyPage   from './pages/PrivacyPage'
import TermsPage     from './pages/TermsPage'
import SupportPage   from './pages/SupportPage'
import ApiPage       from './pages/ApiPage'
import AuthModal     from './components/auth/AuthModal'
import UpgradeModal  from './components/ui/UpgradeModal'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/builder"   element={<BuilderPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
        <Route path="/support"   element={<SupportPage />} />
        <Route path="/api"       element={<ApiPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthModal />
      <UpgradeModal />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
