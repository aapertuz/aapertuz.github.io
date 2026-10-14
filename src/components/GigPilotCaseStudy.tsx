import {
  IconArrowUpRight, IconBolt, IconBrain, IconCode,
  IconFilter, IconFolder, IconGitBranch, IconPlug, IconSearch,
  IconSend, IconShieldCheck, IconTarget, IconTerminal2, IconAdjustments,
} from '@tabler/icons-react'
import type { Project } from '../data/projects'
import { gigpilot } from '../data/gigpilot'
import { ProjectTechTable } from './ProjectTechTable'

const icons = {
  search: IconSearch, filter: IconFilter, evaluate: IconShieldCheck,
  apply: IconSend, target: IconTarget, efficiency: IconBolt,
  storage: IconFolder, ai: IconBrain, code: IconCode,
  config: IconAdjustments, git: IconGitBranch, terminal: IconTerminal2,
  plugins: IconPlug,
}

function GigPilotIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name]
  return <Icon className="gigpilot-icon" size={24} stroke={1.5} aria-hidden="true" />
}

export function GigPilotCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero gigpilot-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · GigPilot</p>
        <div className="gigpilot-overview__composition">
          <div className="gigpilot-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">Explore the source <IconArrowUpRight size={18} stroke={1.5} aria-hidden="true" /></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{gigpilot.category}</dd></div>
          <div><dt>Platform</dt><dd>{gigpilot.platform}</dd></div>
          <div><dt>Type</dt><dd>{gigpilot.type}</dd></div>
        </dl>
      </section>

      <section id="project-problem" data-project-section className="project-details__story gigpilot-section" aria-labelledby="project-problem-title">
        <div className="gigpilot-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{gigpilot.problem.headline}</h3>
          <p className="project-details__story-copy">{gigpilot.problem.description}</p>
          <ul className="gigpilot-obstacles" aria-label="The effort behind finding work">
            {gigpilot.problem.obstacles.map((obstacle) => <li key={obstacle.title}><GigPilotIcon name={obstacle.icon} /><div><h4>{obstacle.title}</h4><p>{obstacle.description}</p></div></li>)}
          </ul>
          <p className="gigpilot-motivation">{gigpilot.problem.motivation}</p>
          <p className="gigpilot-insight">{gigpilot.problem.insight}</p>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story gigpilot-section" aria-labelledby="project-solution-title">
        <div className="gigpilot-section__inner">
          <p className="project-details__meta">03 / The solution</p>
          <h3 id="project-solution-title">{gigpilot.solution.headline}</h3>
          <p className="project-details__story-copy">{gigpilot.solution.description}</p>
          <ol className="gigpilot-flow" aria-label="How GigPilot works">
            {gigpilot.solution.steps.map((step, index) => (
              <li key={step.label}>
                <div className="gigpilot-flow__heading"><GigPilotIcon name={step.icon} /><span className="gigpilot-label">{String(index + 1).padStart(2, '0')} / {step.label}</span></div>
                <h4>{step.title}</h4><p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="project-impact" data-project-section className="project-details__story gigpilot-section" aria-labelledby="project-impact-title">
        <div className="gigpilot-section__inner gigpilot-impact">
          <header>
            <p className="project-details__meta">04 / Impact</p>
            <h3 id="project-impact-title">{gigpilot.impact.headline}</h3>
            <p className="project-details__story-copy">{gigpilot.impact.description}</p>
          </header>
          <dl className="gigpilot-benefits">
            {gigpilot.impact.benefits.map((benefit) => <div key={benefit.title}><dt><GigPilotIcon name={benefit.icon} />{benefit.title}</dt><dd>{benefit.description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story gigpilot-section" aria-labelledby="project-tech-title">
        <div className="gigpilot-section__inner gigpilot-tech">
          <header>
            <p className="project-details__meta">05 / Tech</p>
            <h3 id="project-tech-title">{gigpilot.tech.headline}</h3>
            <p className="project-details__story-copy">{gigpilot.tech.description}</p>
            <p className="gigpilot-architecture">{gigpilot.tech.architecture}</p>
          </header>
          <ProjectTechTable technologies={gigpilot.tech.technologies} />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story gigpilot-section gigpilot-journey" aria-labelledby="project-journey-title">
        <div className="gigpilot-section__inner">
          <p className="project-details__meta">06 / The journey</p>
          <h3 id="project-journey-title">{gigpilot.journey.headline}</h3>
          <p className="project-details__story-copy">{gigpilot.journey.description}</p>
          <ol className="gigpilot-timeline" aria-label="Building GigPilot">
            {gigpilot.journey.milestones.map((milestone, index) => <li key={milestone.label}><span className="gigpilot-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><p className="gigpilot-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p></div></li>)}
          </ol>
          <aside className="gigpilot-contribution" aria-labelledby="gigpilot-contribution-title">
            <p className="gigpilot-label">Creator & Engineer</p>
            <h4 id="gigpilot-contribution-title">My contribution</h4>
            <p>{gigpilot.journey.contribution}</p>
            <ul aria-label="Areas of contribution">{gigpilot.journey.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
            <p className="gigpilot-contribution__idea">{gigpilot.journey.experiment}<strong>{gigpilot.journey.idea}</strong></p>
          </aside>
        </div>
      </section>
    </>
  )
}
