import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage   from './pages/LandingPage'
import BuilderPage   from './pages/BuilderPage'
import TemplatesPage from './pages/TemplatesPage'
import PrivacyPage   from './pages/PrivacyPage'
import TermsPage     from './pages/TermsPage'
import SupportPage   from './pages/SupportPage'
import ApiPage       from './pages/ApiPage'
import OnboardingPage  from './pages/OnboardingPage'
import DashboardPage   from './pages/DashboardPage'
import JobSearchPage  from './pages/JobSearchPage'
import SavedJobsPage  from './pages/SavedJobsPage'
import AuthModal     from './components/auth/AuthModal'
import UpgradeModal  from './components/ui/UpgradeModal'
import TopNav        from './components/layout/TopNav'

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
        <Route path="/onboarding"  element={<OnboardingPage />} />
        <Route path="/dashboard"   element={<DashboardPage />} />
        <Route path="/builder"     element={<BuilderPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
        <Route path="/support"   element={<SupportPage />} />
        <Route path="/api"       element={<ApiPage />} />
        <Route path="/jobs"        element={<JobSearchPage />} />
        <Route path="/saved-jobs"  element={<SavedJobsPage />} />
      </Routes>
    </div>
  )
}

// TopNav lives outside AnimatedRoutes so CSS transform on the page-transition
// div never breaks the nav's `position: fixed` containing block.
function AppShell() {
  const location = useLocation()
  const isBuilder = ['/builder', '/onboarding', '/dashboard', '/jobs', '/saved-jobs'].includes(location.pathname)
  return (
    <>
      <ScrollToTop />
      <AuthModal />
      <UpgradeModal />
      {!isBuilder && <TopNav />}
      <AnimatedRoutes />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}
