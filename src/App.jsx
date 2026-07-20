import { useEffect, useCallback, useRef } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // stable ref so useCallback doesn't need to change across renders
  const lenisRef = useRef(null)

  const handleAnchorClick = useCallback((e) => {
    const lenis = lenisRef.current
    if (!lenis) return

    const target = e.currentTarget.getAttribute('href')
    if (target && target.startsWith('#')) {
      e.preventDefault()
      if (target === '#') {
        lenis.scrollTo(0, { duration: 1.4 })
      } else {
        const targetEl = document.querySelector(target)
        if (targetEl) {
          lenis.scrollTo(targetEl, { offset: -72, duration: 1.4 })
        }
      }
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    })
    lenisRef.current = lenis

    // ── RAF loop — store id so cleanup can cancel it properly ──
    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Anchor intercept
    const anchors = document.querySelectorAll('a[href^="#"]')
    anchors.forEach((a) => a.addEventListener('click', handleAnchorClick))

    return () => {
      cancelAnimationFrame(rafId)   // ← was missing before
      lenis.destroy()
      lenisRef.current = null
      anchors.forEach((a) => a.removeEventListener('click', handleAnchorClick))
    }
  }, [handleAnchorClick])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
