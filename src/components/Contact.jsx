import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import useFadeUp from '../hooks/useFadeUp'

const GmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const COOLDOWN_TIME = 60 // 60 seconds email cooldown

export default function Contact() {
  const ref = useFadeUp()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Retrieve existing cooldown on mount
  useEffect(() => {
    const lastSent = localStorage.getItem('lastEmailSentTime')
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent, 10)) / 1000)
      const remaining = COOLDOWN_TIME - elapsed
      if (remaining > 0) {
        setCooldown(remaining)
      }
    }
  }, [])

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (cooldown > 0) return

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Form inputs validation check
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    // Check if configuration is missing
    if (
      !serviceId ||
      !templateId ||
      !publicKey ||
      serviceId.includes('here') ||
      templateId.includes('here') ||
      publicKey.includes('here')
    ) {
      console.warn('EmailJS variables are not set in the .env file. Falling back to success mockup.')
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSent(true)
        // Store sent time to initialize cooldown
        localStorage.setItem('lastEmailSentTime', Date.now().toString())
        setCooldown(COOLDOWN_TIME)
        formRef.current.reset()
        setTimeout(() => setSent(false), 4000)
      }, 1000)
      return
    }

    setLoading(true)
    setError(false)

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      .then((result) => {
        console.log('Email sent successfully:', result.text)
        setSent(true)
        localStorage.setItem('lastEmailSentTime', Date.now().toString())
        setCooldown(COOLDOWN_TIME)
        formRef.current.reset()
        setTimeout(() => setSent(false), 5000)
      })
      .catch((err) => {
        console.error('EmailJS Error:', err)
        setError(true)
        setTimeout(() => setError(false), 6000)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section className="section" id="contact" aria-label="Contact section" style={{ overflow: 'hidden' }}>
      <div className="glow-blob glow-blob-cyan" style={{ width: 600, height: 600, bottom: '-10%', right: '-10%', opacity: 0.2 }} />
      <div className="glow-blob" style={{ width: 400, height: 400, top: '10%', left: '-8%', opacity: 0.25 }} />

      <div className="container">
        <div ref={ref} className="contact-inner fade-up">
          <p className="section-label">Get In Touch</p>
          <h2 className="display-lg" style={{ color: 'var(--clr-on-surface)', marginBottom: 16 }}>
            Let's Connect
          </h2>
          <div className="section-divider" style={{ margin: '0 auto 24px' }} />
          <p className="body-lg text-muted">
            Currently looking for **Internship** and **Remote** opportunities! Whether you have a question or just want to say hi, feel free to drop a message.
          </p>

          {/* Form */}
          <form ref={formRef} className="contact-form glass glass-top" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="from_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={loading || cooldown > 0}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="from_email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  disabled={loading || cooldown > 0}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="How can we collaborate?"
                required
                disabled={loading || cooldown > 0}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--clr-error)', marginBottom: 16, fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
                ⚠ Error sending message. Please check the developer console or try again.
              </p>
            )}

            <button
              type="submit"
              id="contact-submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading || cooldown > 0}
            >
              {loading ? (
                'Sending Message...'
              ) : cooldown > 0 ? (
                `Please wait ${cooldown}s`
              ) : sent ? (
                '✓ Message Sent!'
              ) : (
                <><SendIcon /> Send Message</>
              )}
            </button>
          </form>

          {/* Social links */}
          <div className="social-row">
            <a href="mailto:abdalrahman.ali.dev@gmail.com" className="social-link" id="social-email">
              <GmailIcon /> Gmail
            </a>
            <a href="https://www.linkedin.com/in/abdalrahman-ali/" target="_blank" rel="noreferrer" className="social-link" id="social-linkedin">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href="https://github.com/abdalrhmanali6" target="_blank" rel="noreferrer" className="social-link" id="social-github">
              <GithubIcon /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
