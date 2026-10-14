import type { ReactNode } from 'react'
import type { Project } from '../data/projects'
import { weft } from '../data/weft'
import { ProjectTechTable } from './ProjectTechTable'

const iconPaths: Record<string, ReactNode> = {
  person: <><circle cx="12" cy="7" r="3" /><path d="M5 21v-3a7 7 0 0 1 14 0v3M9 21v-4m6 4v-4" /></>,
  room: <><path d="M3 21V5h18v16M8 5V3h8v2M9 21v-6h6v6M7 9h2m6 0h2M7 12h2m6 0h2" /></>,
  conversation: <><path d="M4 4h16v12H9l-5 4V4Z" /><path d="M8 8h8m-8 4h5" /></>,
  match: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="19" r="2" /><path d="M7 6h10M6 8l5 9m7-9-5 9" /></>,
  connection: <><path d="m9 14 6-6M8 8 6 10a4 4 0 0 0 6 6l2-2M10 10l2-2a4 4 0 0 1 6 6l-2 2" /></>,
  voice: <path d="M4 10v4m4-7v10m4-14v18m4-14v10m4-7v4" />,
  server: <><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><path d="M7 6.5h.01M7 17.5h.01m5-11h5m-5 11h5" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>,
  browser: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01m0 6-3 2.5 3 2.5m4-5 3 2.5-3 2.5" /></>,
  storage: <><path d="M3 7h7l2 3h9v10H3V7Zm0 0V4h7l2 3h7v3" /></>,
}

function WeftIcon({ name }: { name: string }) {
  return <svg className="weft-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

export function WeftCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero weft-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · Weft</p>
        <div className="weft-overview__composition">
          <div className="weft-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">Explore Weft <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{weft.category}</dd></div>
          <div><dt>Website</dt><dd><a href={project.link} target="_blank" rel="noopener noreferrer">weftnow.com <span aria-hidden="true">↗</span></a></dd></div>
        </dl>
        <a className="project-details__scroll weft-overview__next" href="#project-problem">Explore the story <span aria-hidden="true">↓</span></a>
      </section>

      <section id="project-problem" data-project-section className="project-details__story weft-section" aria-labelledby="project-problem-title">
        <div className="weft-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{weft.problem.headline}</h3>
          <p className="project-details__story-copy">Networking events bring people together, but meaningful connections are often left to chance.</p>
          <div className="weft-audiences">
            {weft.problem.audiences.map((audience) => (
              <article key={audience.title} className="weft-audience">
                <WeftIcon name={audience.icon} />
                <div><h4>{audience.title}</h4><p>{audience.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story weft-section" aria-labelledby="project-solution-title">
        <div className="weft-section__inner weft-solution">
          <header>
            <p className="project-details__meta">03 / The solution</p>
            <h3 id="project-solution-title">{weft.solution.headline}</h3>
            <p className="project-details__story-copy">{project.story.solution}</p>
            <p className="weft-solution__note"><span aria-hidden="true" />AI matchmaking + human facilitation</p>
          </header>
          <ol className="weft-flow" aria-label="How Weft works">
            {weft.solution.steps.map((step, index) => (
              <li key={step.title}>
                <div className="weft-flow__icon"><WeftIcon name={step.icon} /></div>
                <div>
                  <span className="weft-label">{String(index + 1).padStart(2, '0')} / {step.label}</span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="project-impact" data-project-section className="project-details__story weft-section" aria-labelledby="project-impact-title">
        <div className="weft-section__inner">
          <p className="project-details__meta">04 / Impact</p>
          <h3 id="project-impact-title">{weft.impact.headline}</h3>
          <p className="project-details__story-copy">{weft.impact.description}</p>
          <dl className="weft-metrics">
            {weft.impact.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}<span>{metric.context}</span></dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story weft-section" aria-labelledby="project-tech-title">
        <div className="weft-section__inner weft-tech">
          <header>
            <p className="project-details__meta">05 / Tech</p>
            <h3 id="project-tech-title">The technology behind Weft.</h3>
            <p className="project-details__story-copy">{weft.tech.description}</p>
          </header>
          <ProjectTechTable technologies={weft.tech.technologies} />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story weft-section weft-journey" aria-labelledby="project-journey-title">
        <div className="weft-section__inner">
          <p className="project-details__meta">06 / The journey</p>
          <h3 id="project-journey-title">{weft.journey.headline}</h3>
          <p className="project-details__story-copy">{weft.journey.description}</p>
          <ol className="weft-timeline" aria-label="From Surnx to Weft">
            {weft.journey.milestones.map((milestone, index) => (
              <li key={milestone.label}>
                <span className="weft-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="weft-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p></div>
              </li>
            ))}
          </ol>
          <aside className="weft-contribution" aria-labelledby="weft-contribution-title">
              <p className="weft-label">Co-founder & COO</p>
              <h4 id="weft-contribution-title">My contribution</h4>
              <p>{weft.journey.contribution}</p>
              <ul aria-label="Areas of contribution">{weft.journey.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
          </aside>
        </div>
      </section>
    </>
  )
}
