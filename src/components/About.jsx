import { memo, useMemo } from 'react'
import useFadeUp from '../hooks/useFadeUp'
import PF from '../assets/me.jpg'

// ── Static icon definitions (module-level — created once) ────────────────────
const TECH_ICONS = {
  React: (
    <svg viewBox="0 0 24 24" fill="#61DAFB">
      <circle cx="12" cy="12" r="2.3"/>
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" cx="12" cy="12"/>
        <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(60 12 12)"/>
        <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(120 12 12)"/>
      </g>
    </svg>
  ),
  'Next.js': (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fff' }}>
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C23.73 4.515 20.517.73 16.168.083c-.327-.048-.437-.058-.976-.066-.098-.001-.195-.001-.29 0z"/>
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24">
      <rect width="24" height="24" rx="3" fill="#3178C6"/>
      <text x="3" y="18" fontSize="14" fontWeight="bold" fill="white" fontFamily="Arial">TS</text>
    </svg>
  ),
  'Tailwind CSS': (
    <svg viewBox="0 0 24 24" fill="#38BDF8">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 17 9.5 18.15 12 18.15c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z"/>
    </svg>
  ),
  'Node.js': (
    <svg viewBox="0 0 24 24" fill="#68A063">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 24 24" fill="#47A248">
      <path d="M12 2C7 2 7 12 7 12s0 10 5 10c5 0 5-10 5-10S17 2 12 2zm0 15c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41.36-.37.86-.59 1.41-.59s1.05.22 1.41.59c.37.36.59.86.59 1.41 0 1.1-.9 2-2 2z"/>
    </svg>
  ),
}

// Module-level constant — never recreated
const TECH_NAMES = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB']
const STATUS_ITEMS = [
  { emoji: '🌱', text: 'Learning Next.js & System Design' },
  { emoji: '🔭', text: 'Building a Pet Marketplace'      },
  { emoji: '🎯', text: 'Seeking Internship / Remote'     },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const TechChip = memo(function TechChip({ name }) {
  return (
    <div className="tech-chip glass glass-top">
      {TECH_ICONS[name]}
      <span className="label" style={{ color: 'var(--clr-on-surface)' }}>{name}</span>
    </div>
  )
})

const StatusChip = memo(function StatusChip({ emoji, text }) {
  return (
    <div
      className="glass glass-top"
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--clr-on-muted)' }}
    >
      <span>{emoji}</span>
      <span className="label" style={{ letterSpacing: '0.02em' }}>{text}</span>
    </div>
  )
})

// ── Main component ────────────────────────────────────────────────────────────
const About = memo(function About() {
  const ref = useFadeUp()

  // useMemo so these arrays are stable references even if the component
  // somehow re-renders in the future
  const techChips  = useMemo(() => TECH_NAMES.map((n) => <TechChip key={n} name={n} />), [])
  const statusChips = useMemo(
    () => STATUS_ITEMS.map((s) => <StatusChip key={s.text} {...s} />),
    []
  )

  return (
    <section className="section" id="about" aria-label="About section">
      <div className="glow-blob" style={{ width: 500, height: 500, top: '30%', left: '-10%', opacity: 0.4 }} />
      <div className="glow-blob glow-blob-cyan" style={{ width: 400, height: 400, bottom: '10%', right: '-8%', opacity: 0.3 }} />

      <div className="container">
        <div ref={ref} className="about-grid fade-up">

          {/* Left: image */}
          <div className="about-img-wrapper">
            <div className="about-img-frame glass glass-top">
              <img
                src={PF}
                alt="Abdalrahman Ali — developer coding animation"
                loading="lazy"
                decoding="async"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className="about-badge glass glass-top">
              <div className="badge-dot-wrapper">
                <span className="badge-dot-pulse" />
                <span className="badge-dot" />
              </div>
              <span className="label" style={{ color: 'var(--clr-on-surface)' }}>Open to opportunities</span>
            </div>
          </div>

          {/* Right: bio */}
          <div className="about-text">
            <p className="section-label">About Me</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--clr-on-surface)', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid rgba(80,143,248,0.2)', display: 'inline-block' }}>
              Abdalrahman Ali
            </h2>

            <p className="body-lg text-muted" style={{ marginBottom: 16 }}>
              Computer Science Student and Frontend Developer passionate about creating modern,
              responsive, and user-friendly web applications. I transform ideas into clean,
              intuitive, and performant user experiences.
            </p>
            <p className="body-lg text-muted" style={{ marginBottom: 16 }}>
              Experienced in building scalable frontend applications using{' '}
              <strong style={{ color: 'var(--clr-primary)' }}>React</strong>,{' '}
              <strong style={{ color: 'var(--clr-primary)' }}>Next.js</strong>,{' '}
              <strong style={{ color: 'var(--clr-primary)' }}>TypeScript</strong>, and{' '}
              <strong style={{ color: 'var(--clr-primary)' }}>Tailwind CSS</strong>, while expanding
              my full-stack skills with{' '}
              <strong style={{ color: 'var(--clr-cyan)' }}>Node.js</strong>,{' '}
              <strong style={{ color: 'var(--clr-cyan)' }}>Express</strong>, and{' '}
              <strong style={{ color: 'var(--clr-cyan)' }}>MongoDB</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              {statusChips}
            </div>

            <p className="tech-stack-label">Core Technologies</p>
            <div className="tech-chips">
              {techChips}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default About
