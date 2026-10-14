import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { techIcons } from '../data/techIcons'
import { WeftCaseStudy } from './WeftCaseStudy'
import { PolarCaseStudy } from './PolarCaseStudy'
import { GigPilotCaseStudy } from './GigPilotCaseStudy'
import { AscentCaseStudy } from './AscentCaseStudy'
import { ByteFormCaseStudy } from './ByteFormCaseStudy'
import { EasyMDCaseStudy } from './EasyMDCaseStudy'
import { projectShowcases } from '../data/projectShowcases'

const projectSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'impact', label: 'Impact' },
]

export function ProjectDetails({ project, onClose, closing = false }: { project: Project; onClose: () => void; closing?: boolean }) {
  const panel = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const sections = [
    ...projectSections.flatMap((section) => {
      if (section.id !== 'solution') return [section]
      if (project.title === 'EasyMD' || project.title in projectShowcases) return [section, { id: 'product', label: 'Product' }]
      return [section]
    }),
    ...(['Weft', 'Polar', 'GigPilot', 'EasyMD', 'ByteForm', 'Ascent'].includes(project.title) ? [{ id: 'tech', label: 'Tech' }] : []),
    { id: 'journey', label: 'Journey' },
  ]
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    panel.current?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', escape)
    return () => { window.removeEventListener('keydown', escape); previous?.focus({ preventScroll: true }) }
  }, [onClose])
  useEffect(() => {
    const root = panel.current
    if (!root) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-project-section]'))
    let frame: number | null = null
    const updateActiveSection = () => {
      frame = null
      // Track the chapter at the reading position, regardless of its height.
      const readingPosition = root.getBoundingClientRect().top + root.clientTop + root.clientHeight * 0.25
      let active: HTMLElement | undefined = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingPosition) break
        active = section
      }
      if (root.scrollTop > 0 && root.scrollTop + root.clientHeight >= root.scrollHeight - 1) {
        active = sections.at(-1)
      }
      if (active) setActiveSection(active.id.replace('project-', ''))
    }
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection)
    }
    root.addEventListener('scroll', scheduleUpdate, { passive: true })
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(root)
    sections.forEach((section) => observer.observe(section))
    updateActiveSection()
    return () => {
      root.removeEventListener('scroll', scheduleUpdate)
      observer.disconnect()
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [project.title])
  return (
    <section ref={panel} tabIndex={-1} className="project-details" data-project={project.title.toLowerCase()} data-closing={closing || undefined} inert={closing} aria-labelledby="project-title">
      <aside className="project-details__sidebar">
        <button className="project-details__back" onClick={onClose}>← Back to corridor</button>
        <div><p className="project-details__identity">{project.title}</p><p className="project-details__meta">{project.industry}</p></div>
        <nav className="project-details__chapters" aria-label="Project sections">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#project-${section.id}`}
              aria-current={activeSection === section.id ? 'location' : undefined}
            >
              {String(index + 1).padStart(2, '0')} / {section.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="project-details__body">
        {project.title === 'Weft' ? <WeftCaseStudy project={project} /> : project.title === 'Polar' ? <PolarCaseStudy project={project} /> : project.title === 'GigPilot' ? <GigPilotCaseStudy project={project} /> : project.title === 'ByteForm' ? <ByteFormCaseStudy project={project} /> : project.title === 'Ascent' ? <AscentCaseStudy project={project} /> : project.title === 'EasyMD' ? <EasyMDCaseStudy project={project} /> : <>
        <section id="project-overview" data-project-section className="project-details__hero" aria-labelledby="project-title">
          <p className="project-details__meta">01 / Overview · {project.index} / {project.industry} / {project.status}</p>
          <h2 id="project-title">{project.subheadline}</h2>
          <p className="project-details__description">{project.description}</p>
          {project.link ? <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">Visit project <span aria-hidden="true">↗</span></a> : <p className="project-details__soon">Coming soon</p>}
          <dl className="project-details__facts">
            <div><dt>Project</dt><dd>{project.title}</dd></div>
            <div><dt>My role</dt><dd>{project.role}</dd></div>
            <div><dt>Status</dt><dd>{project.status.toLowerCase()}</dd></div>
          </dl>
          <p className="project-details__scroll">Scroll to explore ↓</p>
        </section>
        <section id="project-problem" data-project-section className="project-details__story" aria-labelledby="project-problem-title">
          <p className="project-details__meta">02 / Problem</p>
          <h3 id="project-problem-title">The problem</h3>
          <p className="project-details__story-copy">{project.story.problem}</p>
        </section>
        <section id="project-solution" data-project-section className="project-details__story project-details__story--offset" aria-labelledby="project-solution-title">
          <p className="project-details__meta">03 / Solution</p>
          <h3 id="project-solution-title">The solution</h3>
          <p className="project-details__story-copy">{project.story.solution}</p>
        </section>
        <section id="project-impact" data-project-section className="project-details__story project-details__story--impact" aria-labelledby="project-impact-title">
          <p className="project-details__meta">04 / Impact</p>
          <h3 id="project-impact-title">The impact</h3>
          <p className="project-details__story-copy">{project.story.impact}</p>
        </section>
        <section id="project-journey" data-project-section className="project-details__story project-details__journey" aria-labelledby="project-journey-title">
          <p className="project-details__meta">05 / Journey</p>
          <h3 id="project-journey-title">The journey so far</h3>
          <p className="project-details__story-copy">{project.story.journey}</p>
          <div className="project-details__build-grid">
            <div><h4>My role</h4><p>{project.role}</p></div>
            <div><h4>Built with</h4><ul className="project-details__tools" aria-label="Built with">
              {project.tools.map((tool) => <li key={tool}><img src={techIcons[tool]} alt="" /><span>{tool.replaceAll('_', ' ')}</span></li>)}
            </ul></div>
          </div>
        </section>
        </>}
      </div>
    </section>
  )
}
