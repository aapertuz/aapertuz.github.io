import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from 'react'
import { aboutContent, type AboutLink, type AboutLogo } from '../data/about'

interface AboutWindowProps {
  open: boolean
  onClose: () => void
}

const logoShapes: Record<AboutLogo['mark'], ReactNode> = {
  brackets: <><path d="M9 7 5 12l4 5M15 7l4 5-4 5" /><path d="m13 5-2 14" /></>,
  cube: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  orbit: <><circle cx="12" cy="12" r="2.5" /><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(35 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-35 12 12)" /></>,
  layers: <><path d="m12 4 9 5-9 5-9-5 9-5Z" /><path d="m4 13 8 4 8-4M4 17l8 4 8-4" /></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m7 9 3 3-3 3M12 16h5" /></>,
  node: <><circle cx="6" cy="7" r="2.5" /><circle cx="18" cy="7" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="m8 8.5 3 7M16 8.5l-3 7M8.5 7h7" /></>,
  portal: <><path d="M5 20V7a7 7 0 0 1 14 0v13" /><path d="M9 20V8a3 3 0 0 1 6 0v12" /></>,
  weave: <><path d="M4 6c4 0 4 12 8 12s4-12 8-12" /><path d="M4 18c4 0 4-12 8-12s4 12 8 12" /></>,
  peak: <><path d="m3 20 7-14 4 8 2-4 5 10H3Z" /><path d="m8 20 4-8 4 8" /></>,
}

function LogoMark({ logo }: { logo: AboutLogo }) {
  return (
    <li className="about-window__logo-mark" aria-label={logo.label} title={logo.label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{logoShapes[logo.mark]}</svg>
    </li>
  )
}

function ContactIcon({ icon }: { icon: AboutLink['icon'] }) {
  if (icon === 'mail') return <path d="M3 6h18v12H3V6Zm1 1 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  if (icon === 'github') return <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1.1a9.6 9.6 0 0 1 5.1 0c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" fill="currentColor" />
  return <><rect x="4" y="9" width="4" height="11" /><circle cx="6" cy="5.5" r="2" /><path d="M12 20V9h4v1.7c.8-1.3 2-2 3.5-2 2.8 0 4.5 1.8 4.5 5.6V20h-4v-5.1c0-1.6-.6-2.6-2-2.6-1.5 0-2 1.1-2 2.6V20h-4Z" transform="translate(-2)" /></>
}

export function AboutWindow({ open, onClose }: AboutWindowProps) {
  const [rendered, setRendered] = useState(open)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) setRendered(true)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const dialog = dialogRef.current
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href]'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, onClose])

  const finishClosing = (event: AnimationEvent<HTMLDivElement>) => {
    if (!open && event.animationName === 'about-window-exit') setRendered(false)
  }

  if (!rendered) return null

  return (
    <div
      className="about-window"
      data-state={open ? 'open' : 'closing'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      ref={dialogRef}
      onAnimationEnd={finishClosing}
    >
      <header className="about-window__header">
        <div className="about-window__identity">
          <p className="about-window__eyebrow">{aboutContent.eyebrow}</p>
          <h1 id="about-title">{aboutContent.name}</h1>
          <p className="about-window__role">{aboutContent.role}</p>
        </div>
        <button ref={closeRef} className="about-window__close" type="button" aria-label="Close About" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
        </button>
      </header>
      <div className="about-window__body">
        <section className="about-window__intro" aria-labelledby="about-description">
          <h2 id="about-description">A little context</h2>
          <p>{aboutContent.description}</p>
        </section>
        <section aria-labelledby="about-technologies"><h2 id="about-technologies">Technologies</h2><ul className="about-window__logo-grid">{aboutContent.technologies.map((logo) => <LogoMark key={logo.label} logo={logo} />)}</ul></section>
        <section aria-labelledby="about-companies"><h2 id="about-companies">Companies</h2><ul className="about-window__logo-grid about-window__logo-grid--companies">{aboutContent.companies.map((logo) => <LogoMark key={logo.label} logo={logo} />)}</ul></section>
        <section className="about-window__projects" aria-labelledby="about-projects"><h2 id="about-projects">Projects</h2><ul>{aboutContent.projects.map((project) => <li key={project.name}><strong>{project.name}</strong><span>{project.detail}</span></li>)}</ul></section>
        <section aria-labelledby="about-contact"><h2 id="about-contact">Contact</h2><ul className="about-window__contact-list">{aboutContent.links.map((link) => <li key={link.label}><a className="about-window__contact-link" href={link.href} aria-label={link.label} title={link.label}><svg viewBox="0 0 24 24" aria-hidden="true"><ContactIcon icon={link.icon} /></svg></a></li>)}</ul></section>
      </div>
    </div>
  )
}
