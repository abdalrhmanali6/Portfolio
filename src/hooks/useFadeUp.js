import { useRef, useEffect } from 'react'

/**
 * Returns a ref that adds .visible to the element when it enters the viewport,
 * triggering the .fade-up CSS animation.
 */
export default function useFadeUp() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          // trigger children with delay classes
          el.querySelectorAll('.fade-up').forEach(child => child.classList.add('visible'))
          io.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
