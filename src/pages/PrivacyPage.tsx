import { useNavigate } from 'react-router-dom'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-on-background">
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <div className="mb-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-body-sm font-medium mb-6 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Back
            </button>
            <h1 className="font-h1 text-h1 mb-2">Privacy Policy</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: January 1, 2025</p>
          </div>

          <div className="space-y-10">
            <PolicySection title="1. Information We Collect">
              <p className="mb-3">We collect information you provide when you use ApplyAI, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your name and email address when you sign up</li>
                <li>Resume content you enter into the builder (stored locally in your browser)</li>
                <li>Usage analytics to improve our product (no personally identifiable information)</li>
              </ul>
            </PolicySection>

            <PolicySection title="2. How We Use Your Information">
              <p className="mb-3">Your information is used solely to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve the ApplyAI service</li>
                <li>Send product updates if you opt in</li>
                <li>Generate AI-powered resume suggestions via the Anthropic API</li>
              </ul>
            </PolicySection>

            <PolicySection title="3. Data Storage">
              <p>
                Your resume data is stored <strong>locally in your browser</strong> using localStorage. We do not store your resume content on our servers. Your email is processed securely via our form processor and is never sold to third parties.
              </p>
            </PolicySection>

            <PolicySection title="4. Third-Party Services">
              <p className="mb-3">We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Anthropic API</strong> — Powers AI suggestions. Content sent to generate suggestions is not retained by Anthropic beyond the API call.
                </li>
                <li>
                  <strong>Formspree</strong> — Handles email collection. See Formspree's privacy policy for their data practices.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Cookies">
              <p>
                We use minimal cookies necessary for the service to function. We do not use tracking or advertising cookies.
              </p>
            </PolicySection>

            <PolicySection title="6. Your Rights">
              <p>
                You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <strong>privacy@applyai.app</strong>.
              </p>
            </PolicySection>

            <PolicySection title="7. Contact">
              <p>
                For privacy-related questions, email us at <strong>privacy@applyai.app</strong>. We respond within 48 hours.
              </p>
            </PolicySection>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-8">
      <h2 className="font-h2 text-h2 text-on-background mb-4">{title}</h2>
      <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{children}</div>
    </div>
  )
}
