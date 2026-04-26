import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useResumeStore } from '@/store/resumeStore'

export default function UpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal, credits } = useResumeStore()

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <div className="py-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>

          <h3 className="font-h2 text-h2 mb-2">You've used all 3 free credits</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Free accounts include <strong>3 AI credits</strong> shared across Resume Builder, Cover Letter, and Interview Prep. Upgrade for unlimited access.
          </p>

          {/* What's included */}
          <div className="bg-surface-container-low rounded-xl p-4 mb-6 text-left space-y-2">
            {[
              'Unlimited AI bullet points & summaries',
              'Unlimited cover letter generation',
              'Unlimited interview prep sessions',
              'Priority AI response speed',
              'PDF export watermark-free',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-secondary flex-shrink-0"
                  style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="font-body-sm text-body-sm text-on-background">{feature}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="font-display-lg text-3xl font-black text-on-background">$9</span>
            <span className="font-body-md text-on-surface-variant"> / month</span>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Cancel any time. No hidden fees.</p>
          </div>

          <button
            className="ai-sparkle-button w-full py-3.5 rounded-xl font-body-sm font-bold text-white flex items-center justify-center gap-2 mb-3"
            onClick={() => {
              closeUpgradeModal()
              // TODO: wire to payment provider
              alert('Payment integration coming soon! Contact support@applyai.app for early access pricing.')
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
            Upgrade to Pro
          </button>

          <button
            onClick={closeUpgradeModal}
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors w-full py-2"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
