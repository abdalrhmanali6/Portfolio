import { useEffect, useState, useCallback, memo } from 'react'

const links = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
]

// ── Throttle helper: limits fn to once every `limit` ms ──────────────────────
function throttle(fn, limit) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= limit) {
      last = now
      fn(...args)
    }
  }
}

const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('')

  const handleScroll = useCallback(
    throttle(() => setScrolled(window.scrollY > 40), 100),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Active section tracking via IntersectionObserver
    const sections = document.querySelectorAll('section[id]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach((s) => io.observe(s))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      io.disconnect()
    }
  }, [handleScroll])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <a href="#" className="nav-logo" aria-label="Abdalrahman Ali – home">ABDALRAHMAN.DEV</a>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={active === l.href ? 'active' : ''}>{l.label}</a>
            </li>
          ))}
        </ul>

        <a
          href="/Abdalrahman_Ali_CV.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
          style={{ padding: '9px 22px', fontSize: '0.75rem' }}
          aria-label="View Resume"
        >
          Resume ↗
        </a>
      </div>
    </nav>
  )
})

export default Navbar
