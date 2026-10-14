import {
  IconArrowDown, IconBolt, IconComponents, IconDeviceMobile,
  IconHeartbeat, IconUsers, IconUserHeart,
} from '@tabler/icons-react'
import type { Project } from '../data/projects'
import { easymd } from '../data/easymd'
import { ProjectTechTable } from './ProjectTechTable'

const icons = {
  patient: IconUserHeart, team: IconUsers, architecture: IconComponents,
  performance: IconBolt, experience: IconDeviceMobile, reliability: IconHeartbeat,
}

function EasyMDIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name]
  return <Icon className="easymd-icon" size={24} stroke={1.5} aria-hidden="true" />
}

export function EasyMDCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero easymd-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · EasyMD</p>
        <div className="easymd-overview__composition">
          <div className="easymd-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="easymd-overview__next" href="#project-problem">Explore the rebuild <IconArrowDown size={18} stroke={1.5} aria-hidden="true" /></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{easymd.category}</dd></div>
          <div><dt>Platform</dt><dd>{easymd.platform}</dd></div>
          <div><dt>Focus</dt><dd>{easymd.focus}</dd></div>
        </dl>
      </section>

      <section id="project-problem" data-project-section className="project-details__story easymd-section" aria-labelledby="project-problem-title">
        <div className="easymd-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{easymd.problem.headline}</h3>
          <div className="easymd-problem__context">
            <p className="project-details__story-copy">{easymd.problem.description}</p>
            <p>{easymd.problem.context}</p>
          </div>
          <ul className="easymd-audiences" aria-label="Who the problems affected">
            {easymd.problem.audiences.map((audience) => <li key={audience.title}><EasyMDIcon name={audience.icon} /><div><h4>{audience.title}</h4><p>{audience.description}</p></div></li>)}
          </ul>
          <p className="easymd-insight">{easymd.problem.insight}</p>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story easymd-section" aria-labelledby="project-solution-title">
        <div className="easymd-section__inner easymd-split">
          <header>
            <p className="project-details__meta">03 / The solution</p>
            <h3 id="project-solution-title">{easymd.solution.headline}</h3>
            <p className="project-details__story-copy">{easymd.solution.description}</p>
          </header>
          <ol className="easymd-steps" aria-label="Reengineering, performance, and UX">
            {easymd.solution.steps.map((step, index) => (
              <li key={step.label}>
                <EasyMDIcon name={step.icon} />
                <div><p className="easymd-label">{String(index + 1).padStart(2, '0')} / {step.label}</p><h4>{step.title}</h4><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="project-impact" data-project-section className="project-details__story easymd-section" aria-labelledby="project-impact-title">
        <div className="easymd-section__inner easymd-split">
          <header>
            <p className="project-details__meta">04 / Impact</p>
            <h3 id="project-impact-title">{easymd.impact.headline}</h3>
            <p className="project-details__story-copy">{easymd.impact.description}</p>
          </header>
          <dl className="easymd-outcomes">
            {easymd.impact.outcomes.map((outcome) => <div key={outcome.title}><dt><EasyMDIcon name={outcome.icon} />{outcome.title}</dt><dd>{outcome.description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story easymd-section easymd-tech" aria-labelledby="project-tech-title">
        <div className="easymd-section__inner easymd-split">
          <header>
            <p className="project-details__meta">05 / The tech</p>
            <h3 id="project-tech-title">{easymd.tech.headline}</h3>
            <p className="project-details__story-copy">{easymd.tech.description}</p>
          </header>
          <ProjectTechTable technologies={easymd.tech.technologies} caption="Technology stack" />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story easymd-section easymd-journey" aria-labelledby="project-journey-title">
        <div className="easymd-section__inner">
          <p className="project-details__meta">06 / The journey</p>
          <h3 id="project-journey-title">{easymd.journey.headline}</h3>
          <p className="project-details__story-copy">{easymd.journey.description}</p>
          <ol className="easymd-timeline" aria-label="Rebuilding EasyMD progressively">
            {easymd.journey.milestones.map((milestone, index) => (
              <li key={milestone.label}>
                <span className="easymd-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="easymd-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p></div>
              </li>
            ))}
          </ol>
          <div className="easymd-journey__details">
            <aside className="easymd-contribution" aria-labelledby="easymd-contribution-title">
              <p className="easymd-label">{project.role}</p>
              <h4 id="easymd-contribution-title">My contribution</h4>
              <p>{easymd.journey.contribution}</p>
              <blockquote>{easymd.journey.reflection}</blockquote>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
