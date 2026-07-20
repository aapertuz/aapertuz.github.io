import { useEffect, useRef } from 'react'
import { aboutContent } from '../data/about'

interface AboutWindowProps {
  open: boolean
  onClose: () => void
}

export function AboutWindow({ open, onClose }: AboutWindowProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

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

  if (!open) return null

  return (
    <div className="about-window" role="dialog" aria-modal="true" aria-labelledby="about-title" ref={dialogRef}>
      <header className="about-window__header">
        <div>
          <p className="about-window__eyebrow">{aboutContent.eyebrow}</p>
          <h1 id="about-title">{aboutContent.name}</h1>
          <p className="about-window__role">{aboutContent.role}</p>
        </div>
        <button ref={closeRef} className="about-window__close" type="button" aria-label="Close About" onClick={onClose}>×</button>
      </header>
      <div className="about-window__body">
        <section className="about-window__intro" aria-labelledby="about-description">
          <h2 id="about-description">A little context</h2>
          <p>{aboutContent.description}</p>
          <h2>Technologies</h2>
          <ul className="about-window__technology-list">
            {aboutContent.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        </section>
        <div className="about-window__lists">
          <section aria-labelledby="about-companies"><h2 id="about-companies">Companies</h2><ul>{aboutContent.companies.map((company) => <li key={company}>{company}</li>)}</ul></section>
          <section aria-labelledby="about-projects"><h2 id="about-projects">Projects</h2><ul>{aboutContent.projects.map((project) => <li key={project.name}><strong>{project.name}</strong><span>{project.detail}</span></li>)}</ul></section>
          <section aria-labelledby="about-contact"><h2 id="about-contact">Contact</h2><ul className="about-window__links">{aboutContent.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}<span aria-hidden="true">↗</span></a></li>)}</ul></section>
        </div>
      </div>
    </div>
  )
}
