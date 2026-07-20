import { memo, useMemo } from 'react'
import useFadeUp from '../hooks/useFadeUp'
import Roomify from "../assets/Roomify.webp"
import CinemaVerse from "../assets/Movie.webp"
// ── Icons — module-level, created once ───────────────────────────────────────
const LiveIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const GithubIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)

// Module-level data — never re-allocated
const PROJECTS = [
  {
    title: 'Roomify',
    description: 'A full-stack furniture e-commerce platform built with React, Express, MongoDB, Stripe, Cloudinary, Google OAuth, and an AI Chat Assistant. Includes a 3D product viewer.',
    tags: [{ label: 'React', cls: 'tag-blue' }, { label: 'Express', cls: 'tag-cyan' }, { label: 'MongoDB', cls: 'tag-cyan' }, { label: 'Stripe', cls: 'tag-grey' }],
    img: Roomify,
    imgAlt: 'Roomify — E-commerce dashboard',
    glow: 'blue',
    liveHref: 'https://roomify-nu-henna.vercel.app/',
    gitHref: 'https://github.com/abdalrhmanali6/Roomify',
  },
  {
    title: 'Cinema Verse',
    description: 'A modern movie and TV discovery application built with React, TypeScript, Vite, and the TMDB API. Browse trending titles, view trailers, and search dynamically.',
    tags: [{ label: 'React', cls: 'tag-blue' }, { label: 'TypeScript', cls: 'tag-blue' }, { label: 'Vite', cls: 'tag-cyan' }, { label: 'TMDB API', cls: 'tag-grey' }],
    img: CinemaVerse,
    imgAlt: 'Cinema Verse movie platform screen',
    glow: 'cyan',
    liveHref: 'https://cinmaverse.vercel.app/',
    gitHref: 'https://github.com/abdalrhmanali6/Movie-Search-Website',
  },
  {
    title: 'Pet Marketplace',
    description: 'A full-stack pet marketplace platform enabling seamless trading, adopting, and connecting pet lovers. Coming soon.',
    tags: [{ label: 'Next.js', cls: 'tag-blue' }, { label: 'React', cls: 'tag-blue' }, { label: 'MongoDB', cls: 'tag-cyan' }],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvbnXMV5H9jsGkkygjD7461VKwwaSnB97KtI7NOPSaWTMnz4myfQSpPz2Ixyv5fHS7M-eUdh23Z9mQ0fxVCB36xtbe_plAFrOkEh0yzuIKQnvWi7VZdhygBCeMcTgAgK1cnoIGrB9XYODQIXx-fiocru8Dgv0oJjH71IyE-mVzOWnKOa98jNatBdftncrBAsvWfuLgPNpt--bp55kOo0gnBsSDgoEe2xsF-cDHDJdGtJNcqU8bGdrV4WTJf0smtfgIQltpvbXIuQ',
    imgAlt: 'Pet marketplace platform dashboard preview',
    glow: 'blue',
    liveHref: '#',
    gitHref: '#',
  },
]

// ── ProjectCard — memoised: only re-renders when props change ────────────────
const ProjectCard = memo(function ProjectCard({ project, delay }) {
  const isComingSoon = project.title === 'Pet Marketplace'

  // Memoize tag badges — they only depend on project.tags (stable module-level data)
  const tagBadges = useMemo(
    () => project.tags.map((t) => (
      <span key={t.label} className={`project-tag ${t.cls}`}>{t.label}</span>
    )),
    [project.tags]
  )

  return (
    <article
      className="project-card glass glass-top fade-up"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`project-card-glow-top ${project.glow === 'blue' ? 'blue-glow' : ''}`} />
      <div className="project-img">
        <img src={project.img} alt={project.imgAlt} loading="lazy" decoding="async" />
      </div>
      <div className="project-body">
        <div className="project-tags">
          {tagBadges}
          {isComingSoon && <span className="project-tag tag-grey">Coming Soon</span>}
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-links">
          {!isComingSoon ? (
            <>
              <a href={project.liveHref} target="_blank" rel="noreferrer" className="project-link" aria-label={`Live demo of ${project.title}`}>
                {LiveIcon} Live Demo
              </a>
              <a href={project.gitHref} target="_blank" rel="noreferrer" className="project-link" aria-label={`GitHub repository for ${project.title}`}>
                {GithubIcon} GitHub
              </a>
            </>
          ) : (
            <span className="project-link" style={{ opacity: 0.5, cursor: 'default' }}>
              🚧 Development in progress
            </span>
          )}
        </div>
      </div>
    </article>
  )
})

// ── Projects section ─────────────────────────────────────────────────────────
const Projects = memo(function Projects() {
  const ref = useFadeUp()

  const cards = useMemo(
    () => PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} delay={i * 100} />),
    []
  )

  return (
    <section className="section" id="projects" aria-label="Projects section">
      <div className="glow-blob" style={{ width: 500, height: 500, top: '20%', right: '-10%', opacity: 0.3 }} />

      <div className="container">
        <div className="projects-header">
          <div>
            <p className="section-label">Portfolio</p>
            <h2 className="section-title">Selected Works</h2>
            <div className="section-divider" />
            <p className="body-md text-muted" style={{ maxWidth: 500 }}>
              A showcase of my recent applications, platforms, and open-source projects.
            </p>
          </div>
          <a
            href="https://github.com/abdalrhmanali6"
            target="_blank"
            rel="noreferrer"
            className="label text-accent"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          >
            View GitHub Profile →
          </a>
        </div>

        <div ref={ref} className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {cards}
        </div>
      </div>
    </section>
  )
})

export default Projects
