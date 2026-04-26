import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Is ApplyAI really free?',
    a: 'Yes. ApplyAI is completely free to use — no credit card required, no hidden charges. You can build, edit, and export your resume at no cost.',
  },
  {
    q: 'Where is my resume data stored?',
    a: 'Your resume content is stored locally in your browser (localStorage). It never leaves your device unless you explicitly export it as a PDF.',
  },
  {
    q: 'How does the AI content generation work?',
    a: 'We use Claude by Anthropic to generate bullet points, summaries, and suggestions. The AI is given your job title and experience details and generates polished, achievement-focused content.',
  },
  {
    q: 'Can I change my template after starting?',
    a: 'Absolutely. You can switch templates at any time by returning to Step 1 — your content is preserved across all template changes.',
  },
  {
    q: 'How do I export my resume as a PDF?',
    a: "On the final step (Step 6), click \"Export PDF\". This opens your browser's print dialog — choose \"Save as PDF\" as the destination for a crisp A4 PDF.",
  },
  {
    q: 'What is ATS optimisation?',
    a: 'Applicant Tracking Systems (ATS) are software tools used by employers to filter resumes. Our templates use clean formatting and avoid graphics that ATS software struggles to parse.',
  },
  {
    q: 'I forgot my password. What should I do?',
    a: 'Currently, accounts are stored in your browser. If you\'ve cleared your browser data, create a new account. A password reset feature is coming soon.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email us at support@applyai.app. We respond within 24 hours on business days.',
  },
]

export default function SupportPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState<number | null>(null)
  const [formSent, setFormSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('message', form.message)
      fd.append('source', 'applyai-support')
      await fetch('https://formspree.io/f/mlgavpae', { method: 'POST', body: fd })
    } catch { /* non-critical */ }
    setFormSent(true)
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav />

      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-body-sm font-medium mb-8 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back
          </button>

          {/* Hero */}
          <div className="mb-14 text-center">
            <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
                support_agent
              </span>
            </div>
            <h1 className="font-h1 text-h1 mb-3">How can we help?</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Browse the FAQ below or send us a message — we respond within 24 hours.
            </p>
          </div>

          {/* FAQ accordion */}
          <div className="mb-16">
            <h2 className="font-h2 text-h2 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQS.map((item, i) => (
                <div
                  key={i}
                  className="border border-outline-variant rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-container transition-colors"
                  >
                    <span className="font-body-md font-semibold text-on-background pr-4">{item.q}</span>
                    <span
                      className={cn(
                        'material-symbols-outlined text-on-surface-variant flex-shrink-0 transition-transform duration-200',
                        open === i && 'rotate-180'
                      )}
                      style={{ fontSize: '20px' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
            <h2 className="font-h2 text-h2 mb-2">Still need help?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Send us a message and we'll get back to you within 24 hours.
            </p>

            {formSent ? (
              <div className="text-center py-8">
                <span
                  className="material-symbols-outlined text-secondary mb-3 block"
                  style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                >
                  mark_email_read
                </span>
                <p className="font-h2 text-h2 mb-2">Message sent!</p>
                <p className="font-body-md text-body-md text-on-surface-variant">We'll reply to {form.email} within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Name</label>
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Message</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white resize-none"
                    placeholder="Describe your issue or question…"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="ai-sparkle-button px-6 py-3 rounded-xl font-body-sm font-semibold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
