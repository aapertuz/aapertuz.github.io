import {
  IconArrowUpRight, IconBrain, IconChartDots,
  IconChartLine, IconCompass, IconFileSearch, IconFocus2,
  IconLayoutGrid, IconListCheck, IconPackage, IconUsers, IconWorld,
} from '@tabler/icons-react'
import type { Project } from '../data/projects'
import { ascent } from '../data/ascent'
import { ProjectTechTable } from './ProjectTechTable'
import { ProjectShowcase } from './ProjectShowcase'
import { projectShowcases } from '../data/projectShowcases'

const icons = {
  founder: IconUsers, investor: IconChartDots, market: IconWorld,
  product: IconPackage, traction: IconChartLine, evaluate: IconListCheck,
  direction: IconCompass, connect: IconChartDots, clarity: IconFocus2,
  ai: IconBrain, evidence: IconFileSearch, scoring: IconLayoutGrid,
}

const ascentStack = [
  { category: 'Language', name: 'Python', icon: 'python' },
  { category: 'Frontend', name: 'React', icon: 'react' },
  { category: 'Build tooling', name: 'Vite', icon: 'vite' },
  { category: 'Database', name: 'PostgreSQL', icon: 'postgresql' },
  { category: 'Integration protocol', name: 'Model Context Protocol', icon: 'mcp' },
]

function AscentIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name]
  return <Icon className="ascent-icon" size={24} stroke={1.5} aria-hidden="true" />
}

export function AscentCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero ascent-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · Ascent</p>
        <div className="ascent-overview__composition">
          <div className="ascent-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">Visit Ascent <IconArrowUpRight size={18} stroke={1.5} aria-hidden="true" /></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{ascent.category}</dd></div>
          <div><dt>Platform</dt><dd>{ascent.platform}</dd></div>
          <div><dt>Project</dt><dd>{ascent.type}</dd></div>
        </dl>
      </section>

      <section id="project-problem" data-project-section className="project-details__story ascent-section" aria-labelledby="project-problem-title">
        <div className="ascent-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{ascent.problem.headline}</h3>
          <p className="project-details__story-copy">{ascent.problem.description}</p>
          <ul className="ascent-audiences" aria-label="The challenges on both sides of funding">
            {ascent.problem.audiences.map((audience) => <li key={audience.label}>
              <div className="ascent-audiences__label"><AscentIcon name={audience.icon} /><span className="ascent-label">{audience.label}</span></div>
              <h4>{audience.title}</h4><p>{audience.description}</p>
            </li>)}
          </ul>
          <p className="ascent-insight">{ascent.problem.goal}</p>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story ascent-section" aria-labelledby="project-solution-title">
        <div className="ascent-section__inner ascent-solution">
          <header>
            <p className="project-details__meta">03 / The solution</p>
            <h3 id="project-solution-title">{ascent.solution.headline}</h3>
            <p className="project-details__story-copy">{ascent.solution.description}</p>
          </header>
          <ol className="ascent-flow" aria-label="How Ascent works">
            {ascent.solution.steps.map((step, index) => <li key={step.label}>
              <div className="ascent-flow__icon"><AscentIcon name={step.icon} /></div>
              <div><span className="ascent-label">{String(index + 1).padStart(2, '0')} / {step.label}</span><h4>{step.title}</h4><p>{step.description}</p></div>
            </li>)}
          </ol>
        </div>
      </section>

      <ProjectShowcase content={projectShowcases.Ascent} projectName={project.title} />

      <section id="project-impact" data-project-section className="project-details__story ascent-section" aria-labelledby="project-impact-title">
        <div className="ascent-section__inner ascent-impact">
          <header>
            <p className="project-details__meta">05 / Impact</p>
            <h3 id="project-impact-title">{ascent.impact.headline}</h3>
            <p className="project-details__story-copy">{ascent.impact.description}</p>
          </header>
          <dl className="ascent-benefits">
            {ascent.impact.benefits.map((benefit) => <div key={benefit.title}><dt><AscentIcon name={benefit.icon} />{benefit.title}</dt><dd>{benefit.description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story ascent-section" aria-labelledby="project-tech-title">
        <div className="ascent-section__inner ascent-tech">
          <header className="project-engineering__header">
            <p className="project-details__meta">06 / Tech</p>
            <h3 id="project-tech-title">{ascent.tech.headline}</h3>
            <p className="project-details__story-copy">{ascent.tech.description}</p>
          </header>
          <ul className="project-engineering" aria-label="Startup evaluation algorithms">
            {ascent.tech.engineering.map((item) => (
              <li key={item.title}><AscentIcon name={item.icon} /><div><h4>{item.title}</h4><p>{item.description}</p></div></li>
            ))}
          </ul>
          <ProjectTechTable technologies={ascentStack} />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story ascent-section ascent-journey" aria-labelledby="project-journey-title">
        <div className="ascent-section__inner">
          <p className="project-details__meta">07 / The journey</p>
          <h3 id="project-journey-title">{ascent.journey.headline}</h3>
          <p className="project-details__story-copy">{ascent.journey.description}</p>
          <ol className="ascent-timeline" aria-label="Turning investment expertise into software">
            {ascent.journey.milestones.map((milestone, index) => <li key={milestone.label}>
              <span className="ascent-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div><p className="ascent-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p></div>
            </li>)}
          </ol>
          <div className="ascent-focus">
            <table className="ascent-technologies">
              <caption>Technical focus</caption>
              <thead><tr><th scope="col">Area</th><th scope="col">Focus</th></tr></thead>
              <tbody>{ascent.journey.technicalFocus.map((item) => <tr key={item.area}><th scope="row"><span><AscentIcon name={item.icon} />{item.area}</span></th><td>{item.focus}</td></tr>)}</tbody>
            </table>
            <aside className="ascent-contribution" aria-labelledby="ascent-contribution-title">
              <p className="ascent-label">Product & Engineering</p>
              <h4 id="ascent-contribution-title">My contribution</h4>
              <p>{ascent.journey.contribution}</p>
              <p>{ascent.journey.reflection}</p>
            </aside>
          </div>
          <p className="ascent-takeaway">{ascent.journey.takeaway}</p>
        </div>
      </section>
    </>
  )
}
