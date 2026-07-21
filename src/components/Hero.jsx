import { Suspense, lazy } from 'react'
import useFadeUp from '../hooks/useFadeUp'

const ThreeBackground = lazy(() => import('./ThreeBackground'))

export default function Hero() {
  const ref = useFadeUp()

  return (
    <section className="hero" id="home" aria-label="Hero section">
      {/* Three.js canvas */}
      <div className="hero-canvas">
        <Suspense fallback={null}>
          <ThreeBackground />
        </Suspense>
      </div>

      {/* Radial glow center */}
      <div
        className="glow-blob"
        style={{ width: 600, height: 600, top: '50%', left: '50%',
                 transform: 'translate(-50%,-50%)', zIndex: 1 }}
      />

      <div ref={ref} className="hero-content fade-up">
        <p className="hero-eyebrow">👋 Welcome to my digital space</p>

        <h1 className="hero-title">
          Hi, I'm{' '}
          <span className="text-gradient">Abdalrahman Ali</span>.<br />
          Frontend Developer<br />
          <span style={{ color: 'var(--clr-on-muted)', fontWeight: 500, fontSize: '0.72em' }}>
            &amp; CS Student
          </span>
        </h1>

        <p className="hero-subtitle">
          Building modern, responsive, and user-friendly web applications with
          React, Next.js, and TypeScript — always learning, always shipping.
        </p>

        <div className="hero-cta" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#projects" className="btn btn-primary" id="hero-cta-work">
            View My Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="/Abdalrahman_Ali_CV.pdf" download className="btn btn-outline" id="hero-cta-cv-download">
            Download CV
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </a>
          <a href="/Abdalrahman_Ali_CV.pdf" target="_blank" rel="noreferrer" className="btn btn-outline" id="hero-cta-cv-view">
            View CV
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <a href="#about" aria-label="Scroll to About section">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </a>
      </div>
    </section>
  )
}
