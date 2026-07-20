import { memo } from 'react'

// Fully static component — memo prevents any re-render from parent
const Footer = memo(function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: '1.3rem',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg,#acc7ff,#00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ABDALRAHMAN.DEV
        </span>

        <span className="footer-copy">
          © {year} Abdalrahman Ali. Built with precision &amp; Three.js.
        </span>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  )
})

export default Footer
