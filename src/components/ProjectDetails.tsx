import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { techIcons } from '../data/techIcons'

export function ProjectDetails({ project, onClose, closing = false }: { project: Project; onClose: () => void; closing?: boolean }) {
  const panel = useRef<HTMLElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panel.current?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', escape)
    return () => { window.removeEventListener('keydown', escape); previous?.focus({ preventScroll: true }) }
  }, [onClose])
  return (
    <section ref={panel} tabIndex={-1} className="project-details" data-closing={closing || undefined} inert={closing} aria-labelledby="project-title">
      <aside className="project-details__sidebar">
        <button className="project-details__back" onClick={onClose}>← Back to corridor</button>
        <div><p className="project-details__identity">{project.title}</p><p className="project-details__meta">{project.industry}</p></div>
        <span className="project-details__chapter">01 / Overview</span>
      </aside>
      <div className="project-details__body">
        <div className="project-details__hero">
          <p className="project-details__meta">{project.index} / {project.industry} / {project.status}</p>
          <h2 id="project-title">{project.subheadline}</h2>
          <p className="project-details__description">{project.description}</p>
          {project.link ? <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">Visit project <span aria-hidden="true">↗</span></a> : <p className="project-details__soon">Coming soon</p>}
          <dl className="project-details__facts">
            <div><dt>Project</dt><dd>{project.title}</dd></div>
            <div><dt>My role</dt><dd>{project.role}</dd></div>
            <div><dt>Status</dt><dd>{project.status.toLowerCase()}</dd></div>
          </dl>
          <p className="project-details__scroll">Scroll to explore ↓</p>
        </div>
        <section className="project-details__build" aria-labelledby="project-build-title">
          <p className="project-details__meta">02 / Behind the project</p>
          <h3 id="project-build-title">Building {project.title}</h3>
          <p className="project-details__description">{project.description}</p>
          <div className="project-details__build-grid">
            <div><h4>My role</h4><p>{project.role}</p></div>
            <div><h4>Built with</h4><ul className="project-details__tools" aria-label="Built with">
              {project.tools.map((tool) => <li key={tool}><img src={techIcons[tool]} alt="" /><span>{tool.replaceAll('_', ' ')}</span></li>)}
            </ul></div>
          </div>
        </section>
      </div>
    </section>
  )
}
