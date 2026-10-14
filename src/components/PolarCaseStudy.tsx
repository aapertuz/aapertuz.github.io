import type { ReactNode } from 'react'
import type { Project } from '../data/projects'
import { polar } from '../data/polar'
import { ProjectTechTable } from './ProjectTechTable'
import { ProjectShowcase } from './ProjectShowcase'
import { projectShowcases } from '../data/projectShowcases'

const iconPaths: Record<string, ReactNode> = {
  mission: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3" /></>,
  plan: <><path d="M5 4h14v16H5zM9 2v4m6-4v4M9 11h6m-6 5h4" /></>,
  context: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="M14 6h4v4M6 14v4h4" /></>,
  adapt: <><path d="M20 10a8 8 0 0 0-14-4L3 9m0-5v5h5M4 14a8 8 0 0 0 14 4l3-3m0 5v-5h-5" /></>,
  clarity: <><path d="m3 12 5 5L21 4M3 5h5m7 15h6" /></>,
  focus: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /><circle cx="12" cy="12" r="3" /></>,
  desktop: <><rect x="3" y="4" width="18" height="13" rx="1" /><path d="M8 21h8m-4-4v4" /></>,
  native: <><rect x="6" y="6" width="12" height="12" rx="1" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M10 10h4v4h-4z" /></>,
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />,
  build: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
  server: <><rect x="3" y="3" width="18" height="7" rx="1" /><rect x="3" y="14" width="18" height="7" rx="1" /><path d="M7 6.5h.01M7 17.5h.01m5-11h5m-5 11h5" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>,
}

function PolarIcon({ name }: { name: string }) {
  return <svg className="polar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

export function PolarCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero polar-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · Polar</p>
        <div className="polar-overview__composition">
          <div className="polar-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel ?? 'Visit project'} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{polar.category}</dd></div>
          <div><dt>Platform</dt><dd>{polar.platform}</dd></div>
          <div><dt>Status</dt><dd className="polar-status"><span aria-hidden="true" />{polar.status}</dd></div>
        </dl>
        <a className="project-details__scroll polar-overview__next" href="#project-problem">Explore the story <span aria-hidden="true">↓</span></a>
      </section>

      <section id="project-problem" data-project-section className="project-details__story polar-section" aria-labelledby="project-problem-title">
        <div className="polar-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{polar.problem.headline}</h3>
          <div className="polar-problem__context">
            <p className="project-details__story-copy">{polar.problem.description}</p>
            <p>{polar.problem.context}</p>
          </div>
          <ul className="polar-symptoms" aria-label="The cost of managing work">
            {polar.problem.symptoms.map((symptom) => <li key={symptom.title}><PolarIcon name={symptom.icon} /><div><h4>{symptom.title}</h4><p>{symptom.description}</p></div></li>)}
          </ul>
          <p className="polar-insight">{polar.problem.insight}</p>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story polar-section" aria-labelledby="project-solution-title">
        <div className="polar-section__inner polar-solution">
          <header>
            <p className="project-details__meta">03 / The solution</p>
            <h3 id="project-solution-title">{polar.solution.headline}</h3>
            <p className="project-details__story-copy">{polar.solution.description}</p>
          </header>
          <ol className="polar-flow" aria-label="How Polar works">
            {polar.solution.steps.map((step, index) => (
              <li key={step.label}>
                <div className="polar-flow__icon"><PolarIcon name={step.icon} /></div>
                <div><span className="polar-label">{String(index + 1).padStart(2, '0')} / {step.label}</span><h4>{step.title}</h4><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProjectShowcase content={projectShowcases.Polar} projectName={project.title} />

      <section id="project-impact" data-project-section className="project-details__story polar-section" aria-labelledby="project-impact-title">
        <div className="polar-section__inner polar-impact">
          <header>
            <p className="project-details__meta">05 / Impact</p>
            <h3 id="project-impact-title">{polar.impact.headline}</h3>
            <p className="project-details__story-copy">{polar.impact.description}</p>
            <p className="polar-label polar-impact__note">What I’m working toward</p>
          </header>
          <dl className="polar-benefits">
            {polar.impact.benefits.map((benefit) => <div key={benefit.title}><dt><PolarIcon name={benefit.icon} />{benefit.title}</dt><dd>{benefit.description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story polar-section" aria-labelledby="project-tech-title">
        <div className="polar-section__inner polar-tech">
          <header>
            <p className="project-details__meta">06 / Tech</p>
            <h3 id="project-tech-title">The technology behind Polar.</h3>
            <p className="project-details__story-copy">The goal is to keep the architecture simple enough to evolve quickly, with room for more intelligent workflows.</p>
          </header>
          <ProjectTechTable technologies={polar.technologies} />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story polar-section polar-journey" aria-labelledby="project-journey-title">
        <div className="polar-section__inner">
          <p className="project-details__meta">07 / The journey</p>
          <h3 id="project-journey-title">{polar.journey.headline}</h3>
          <p className="project-details__story-copy">{polar.journey.description}</p>
          <ol className="polar-timeline" aria-label="Building Polar">
            {polar.journey.milestones.map((milestone, index) => <li key={milestone.label}><span className="polar-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><p className="polar-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p></div></li>)}
          </ol>
          <aside className="polar-contribution" aria-labelledby="polar-contribution-title">
              <p className="polar-label">Founder & Engineer</p>
              <h4 id="polar-contribution-title">My contribution</h4>
              <p>{polar.journey.contribution}</p>
              <ul aria-label="Areas of contribution">{polar.journey.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
              <p className="polar-contribution__question">It’s also an opportunity to explore something I’m genuinely curious about: <strong>{polar.journey.question}</strong></p>
          </aside>
        </div>
      </section>
    </>
  )
}
