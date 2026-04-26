export default function Footer() {
  const links = ['Privacy', 'Terms', 'Support', 'API']
  const socials = [
    { icon: 'public', label: 'Website' },
    { icon: 'alternate_email', label: 'Email' },
  ]

  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 px-8 max-w-[1920px] mx-auto gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-h1 text-lg font-black text-primary">ApplyAI</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 ApplyAI. Precision Career Tools.
          </p>
        </div>

        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map(({ icon, label }) => (
            <a
              key={icon}
              href="#"
              aria-label={label}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
