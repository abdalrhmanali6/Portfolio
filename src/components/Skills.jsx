import { useEffect, useRef, memo, useMemo } from 'react'
import useFadeUp from '../hooks/useFadeUp'

// Module-level constants — created once, never recreated
const SKILLS = [
  { name: 'React / Next.js',        pct: 92, color: 'blue' },
  { name: 'TypeScript / JavaScript', pct: 88, color: 'blue' },
  { name: 'Tailwind CSS / HTML',     pct: 90, color: 'cyan' },
  { name: 'Node.js / Express',       pct: 75, color: 'cyan' },
  { name: 'MongoDB / SQL Server',    pct: 70, color: 'grey' },
]

const EXTRA_TAGS = [
  'Redux', 'Zustand', 'Passport.js', 'Nodemailer', 'Stripe API',
  'Cloudinary', 'Google OAuth', 'Git', 'Figma', 'Postman', 'Python', 'Java',
]

// Memoised per-bar so only a bar whose pct changes will re-render
const SkillBar = memo(function SkillBar({ name, pct, color }) {
  const barRef = useRef(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.width = `${pct}%`
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pct])

  return (
    <div className="skill-item">
      <div className="skill-header">
        <span className="skill-name">{name}</span>
        <span className="skill-pct">{pct}%</span>
      </div>
      <div className="skill-track">
        <div ref={barRef} className={`skill-fill ${color}`} />
      </div>
    </div>
  )
})

// Tag badge style is static — memoised separately
const TAG_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  padding: '5px 14px',
  borderRadius: 'var(--radius-full)',
  background: 'rgba(80,143,248,0.08)',
  color: 'var(--clr-primary)',
  border: '1px solid rgba(80,143,248,0.2)',
  letterSpacing: '0.04em',
}

const Skills = memo(function Skills() {
  const ref = useFadeUp()

  // Stable rendered lists so they survive any future parent re-renders
  const bars = useMemo(
    () => SKILLS.map((s) => <SkillBar key={s.name} {...s} />),
    []
  )

  const extraTags = useMemo(
    () => EXTRA_TAGS.map((tag) => <span key={tag} style={TAG_STYLE}>{tag}</span>),
    []
  )

  return (
    <section className="section skills-bg" id="skills" aria-label="Skills section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="section-label">Expertise</p>
          <h2 className="section-title">Technical Proficiency</h2>
          <div className="section-divider" style={{ margin: '16px auto 16px' }} />
          <p className="body-md text-muted" style={{ maxWidth: 540, margin: '0 auto' }}>
            A snapshot of my current technical stack — built through real-world projects,
            coursework, and continuous self-driven learning.
          </p>
        </div>

        <div ref={ref} className="skills-grid fade-up">
          {bars}
        </div>

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <p className="section-label" style={{ marginBottom: 20 }}>Also familiar with</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {extraTags}
          </div>
        </div>
      </div>
    </section>
  )
})

export default Skills
