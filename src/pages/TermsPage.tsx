import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav />

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
            <h1 className="font-h1 text-h1 mb-2">Terms of Service</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: January 1, 2025</p>
          </div>

          <div className="space-y-10">
            <TermsSection title="1. Acceptance of Terms">
              <p>
                By creating an account or using ApplyAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </TermsSection>

            <TermsSection title="2. Description of Service">
              <p>
                ApplyAI provides an AI-powered resume builder that helps users create, edit, and export professional resumes. The service is provided free of charge with optional premium features.
              </p>
            </TermsSection>

            <TermsSection title="3. User Accounts">
              <p className="mb-3">When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activity under your account</li>
                <li>Notify us immediately of any unauthorised use</li>
              </ul>
            </TermsSection>

            <TermsSection title="4. Acceptable Use">
              <p className="mb-3">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit false or misleading information</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Attempt to reverse engineer or compromise the platform</li>
                <li>Use automated bots or scrapers without written permission</li>
              </ul>
            </TermsSection>

            <TermsSection title="5. Intellectual Property">
              <p>
                The content you create using ApplyAI (your resume) remains your property. ApplyAI retains ownership of the platform, templates, design assets, and underlying technology. You grant ApplyAI a limited licence to process your content solely to provide the Service.
              </p>
            </TermsSection>

            <TermsSection title="6. AI-Generated Content">
              <p>
                ApplyAI uses large language models to assist with content generation. AI-generated suggestions are provided as-is. You are responsible for reviewing, editing, and verifying all content before using it in job applications. ApplyAI makes no guarantee that AI-generated content is accurate or appropriate.
              </p>
            </TermsSection>

            <TermsSection title="7. Limitation of Liability">
              <p>
                ApplyAI is provided "as is" without warranties of any kind. To the maximum extent permitted by law, ApplyAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
              </p>
            </TermsSection>

            <TermsSection title="8. Termination">
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time by contacting support.
              </p>
            </TermsSection>

            <TermsSection title="9. Changes to Terms">
              <p>
                We may update these Terms periodically. Continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </TermsSection>

            <TermsSection title="10. Contact">
              <p>
                For questions about these Terms, contact us at <strong>legal@applyai.app</strong>.
              </p>
            </TermsSection>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-8">
      <h2 className="font-h2 text-h2 text-on-background mb-4">{title}</h2>
      <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{children}</div>
    </div>
  )
}
