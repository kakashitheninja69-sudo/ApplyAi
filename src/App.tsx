import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage   from './pages/LandingPage'
import BuilderPage   from './pages/BuilderPage'
import TemplatesPage from './pages/TemplatesPage'
import PrivacyPage   from './pages/PrivacyPage'
import TermsPage     from './pages/TermsPage'
import SupportPage   from './pages/SupportPage'
import ApiPage       from './pages/ApiPage'
import AuthModal     from './components/auth/AuthModal'

export default function App() {
  return (
    <BrowserRouter>
      <AuthModal />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/builder"   element={<BuilderPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
        <Route path="/support"   element={<SupportPage />} />
        <Route path="/api"       element={<ApiPage />} />
      </Routes>
    </BrowserRouter>
  )
}
