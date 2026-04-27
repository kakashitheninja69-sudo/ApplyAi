import { useNavigate } from 'react-router-dom'
import Footer from '@/components/layout/Footer'

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/ai/bullet-points',
    description: 'Generate achievement-focused bullet points for a job role.',
    body: '{ "role": "string", "company": "string", "description": "string" }',
    response: '{ "bullets": ["string"] }',
  },
  {
    method: 'POST',
    path: '/ai/summary',
    description: 'Generate a professional summary for a given job title and experience.',
    body: '{ "title": "string", "experience": "string[]" }',
    response: '{ "summary": "string" }',
  },
  {
    method: 'POST',
    path: '/ai/cover-letter',
    description: 'Generate a tailored cover letter from a resume and job description.',
    body: '{ "resume": "object", "jobDescription": "string" }',
    response: '{ "coverLetter": "string" }',
  },
  {
    method: 'POST',
    path: '/ai/jd-match',
    description: 'Analyse a resume against a job description and return a match score with gap analysis.',
    body: '{ "resume": "object", "jobDescription": "string" }',
    response: '{ "score": number, "matched": "string[]", "missing": "string[]", "suggestions": "string[]" }',
  },
]

const METHOD_COLOR: Record<string, string> = {
  GET:    'bg-secondary-container text-secondary',
  POST:   'bg-primary/10 text-primary',
  PUT:    'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-error/10 text-error',
}

export default function ApiPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-on-background">
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-body-sm font-medium mb-8 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed rounded-full mb-5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>
                code
              </span>
              <span className="font-label-caps text-label-caps text-on-primary-fixed-variant uppercase tracking-widest">
                Developer API
              </span>
            </div>
            <h1 className="font-h1 text-h1 mb-3">ApplyAI API</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Integrate ApplyAI's resume intelligence directly into your product. Our REST API exposes the same AI engine powering the builder.
            </p>
          </div>

          {/* Access notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-12 flex gap-4">
            <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <div>
              <p className="font-body-md font-semibold text-on-background mb-1">API Access — Early Access</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                The ApplyAI API is currently in private beta. To request access, email{' '}
                <strong>api@applyai.app</strong> with your use case. We'll respond within 2 business days.
              </p>
            </div>
          </div>

          {/* Base URL */}
          <div className="mb-10">
            <h2 className="font-h2 text-h2 mb-4">Base URL</h2>
            <div className="bg-gray-900 rounded-xl px-5 py-4 font-mono text-sm text-green-400">
              https://api.applyai.app/v1
            </div>
          </div>

          {/* Authentication */}
          <div className="mb-10">
            <h2 className="font-h2 text-h2 mb-4">Authentication</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              All requests require a Bearer token in the Authorization header:
            </p>
            <div className="bg-gray-900 rounded-xl px-5 py-4 font-mono text-sm text-gray-300">
              <span className="text-blue-400">Authorization:</span>{' '}
              <span className="text-yellow-300">Bearer YOUR_API_KEY</span>
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <h2 className="font-h2 text-h2 mb-6">Endpoints</h2>
            <div className="space-y-6">
              {ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  className="border border-outline-variant rounded-xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-5 py-4 bg-surface-container-low border-b border-gray-100">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md font-mono ${METHOD_COLOR[ep.method] ?? ''}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm text-on-background">{ep.path}</span>
                  </div>
                  <div className="px-5 py-4 space-y-4">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{ep.description}</p>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">Request Body</p>
                      <div className="bg-gray-900 rounded-lg px-4 py-3 font-mono text-xs text-gray-300">
                        {ep.body}
                      </div>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-2">Response</p>
                      <div className="bg-gray-900 rounded-lg px-4 py-3 font-mono text-xs text-green-400">
                        {ep.response}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate limits */}
          <div className="mt-12 bg-surface-container-low border border-outline-variant rounded-xl p-6">
            <h2 className="font-h2 text-h2 mb-4">Rate Limits</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Free Tier', value: '100 req/day' },
                { label: 'Pro Tier', value: '5,000 req/day' },
                { label: 'Enterprise', value: 'Unlimited' },
              ].map((tier) => (
                <div key={tier.label} className="bg-white rounded-xl p-4 border border-outline-variant">
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">{tier.label}</p>
                  <p className="font-h2 text-primary">{tier.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
