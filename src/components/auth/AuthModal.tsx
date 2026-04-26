import { useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { useNavigate } from 'react-router-dom'

const FORMSPREE_FORM_ID = 'mlgavpae'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useResumeStore()
  const navigate = useNavigate()
  const [formState, submit] = useForm(FORMSPREE_FORM_ID)
  const [name, setName] = useState('')

  function handleSuccess() {
    closeAuthModal()
    navigate('/builder')
  }

  if (formState.succeeded) {
    return (
      <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
        <DialogContent className="text-center">
          <div className="py-4">
            <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-5">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h3 className="font-h2 text-h2 mb-2">You're in!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              No credit card. No commitment. Let's build your resume.
            </p>
            <Button onClick={handleSuccess} size="lg" className="w-full">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
              Continue to Builder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Free Account
            </span>
          </div>
          <DialogTitle>Create your free account</DialogTitle>
          <DialogDescription>
            3 free resume builds per month. No credit card, ever.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="auth-name">Full Name</Label>
            <Input
              id="auth-name"
              name="name"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email Address</Label>
            <Input
              id="auth-email"
              type="email"
              name="email"
              placeholder="alex@example.com"
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={formState.errors}
              className="font-body-sm text-body-sm text-error mt-1"
            />
          </div>

          <input type="hidden" name="source" value="applyai-signup" />

          <Button
            type="submit"
            disabled={formState.submitting}
            size="lg"
            className="w-full mt-2"
          >
            {formState.submitting ? (
              <>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  refresh
                </span>
                Creating account…
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  rocket_launch
                </span>
                Start Building Free
              </>
            )}
          </Button>

          <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
