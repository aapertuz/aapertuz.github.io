import {
  IconArrowUpRight, IconBrandGithub, IconForms, IconMessageCircle, IconMicrophone,
  IconHeartHandshake, IconAdjustments, IconCheck,
} from '@tabler/icons-react'
import type { Project } from '../data/projects'
import { byteform } from '../data/byteform'
import { ProjectTechTable } from './ProjectTechTable'
import { ProjectShowcase } from './ProjectShowcase'
import { projectShowcases } from '../data/projectShowcases'

const icons = {
  form: IconForms, chat: IconMessageCircle, voice: IconMicrophone,
  engagement: IconHeartHandshake, flexibility: IconAdjustments, simplicity: IconCheck,
}

function ByteFormIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name]
  return <Icon className="byteform-icon" size={24} stroke={1.5} aria-hidden="true" />
}

export function ByteFormCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section id="project-overview" data-project-section className="project-details__hero byteform-overview" aria-labelledby="project-title">
        <p className="project-details__meta">01 / Overview · ByteForm</p>
        <div className="byteform-overview__composition">
          <div className="byteform-overview__copy">
            <h2 id="project-title">{project.subheadline}</h2>
            <p className="project-details__description">{project.description}</p>
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel ?? 'Explore'} <IconArrowUpRight size={18} stroke={1.5} aria-hidden="true" /></a>
          </div>
        </div>
        <dl className="project-details__facts">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Category</dt><dd>{byteform.category}</dd></div>
          <div><dt>Platform</dt><dd>{byteform.platform}</dd></div>
          <div><dt>Type</dt><dd>{byteform.type}</dd></div>
          {project.relatedLinks?.map((link) => <div key={link.url} className="byteform-overview__source"><dt>Source</dt><dd><a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}><IconBrandGithub size={22} stroke={1.75} aria-hidden="true" /></a></dd></div>)}
        </dl>
      </section>

      <section id="project-problem" data-project-section className="project-details__story byteform-section" aria-labelledby="project-problem-title">
        <div className="byteform-section__inner">
          <p className="project-details__meta">02 / The problem</p>
          <h3 id="project-problem-title">{byteform.problem.headline}</h3>
          <div className="byteform-problem__context">
            <p className="project-details__story-copy">{byteform.problem.description}</p>
            <p>{byteform.problem.motivation}</p>
          </div>
          <p className="byteform-insight">{byteform.problem.insight}</p>
        </div>
      </section>

      <section id="project-solution" data-project-section className="project-details__story byteform-section" aria-labelledby="project-solution-title">
        <div className="byteform-section__inner byteform-split">
          <header>
            <p className="project-details__meta">03 / The solution</p>
            <h3 id="project-solution-title">{byteform.solution.headline}</h3>
            <p className="project-details__story-copy">{byteform.solution.description}</p>
          </header>
          <ol className="byteform-experiences" aria-label="How ByteForm works">
            {byteform.solution.steps.map((step, index) => (
              <li key={step.label}>
                <ByteFormIcon name={step.icon} />
                <div><p className="byteform-label">{String(index + 1).padStart(2, '0')} / {step.label}</p><h4>{step.title}</h4><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProjectShowcase content={projectShowcases.ByteForm} projectName={project.title} />

      <section id="project-impact" data-project-section className="project-details__story byteform-section" aria-labelledby="project-impact-title">
        <div className="byteform-section__inner byteform-split">
          <header>
            <p className="project-details__meta">05 / Impact</p>
            <h3 id="project-impact-title">{byteform.impact.headline}</h3>
            <p className="project-details__story-copy">{byteform.impact.description}</p>
          </header>
          <dl className="byteform-benefits">
            {byteform.impact.benefits.map((benefit) => <div key={benefit.title}><dt><ByteFormIcon name={benefit.icon} />{benefit.title}</dt><dd>{benefit.description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section id="project-tech" data-project-section className="project-details__story byteform-section byteform-tech" aria-labelledby="project-tech-title">
        <div className="byteform-section__inner byteform-split">
          <header>
            <p className="project-details__meta">06 / The tech</p>
            <h3 id="project-tech-title">{byteform.tech.headline}</h3>
            <p className="project-details__story-copy">{byteform.tech.description}</p>
          </header>
          <ProjectTechTable technologies={byteform.tech.stack} />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story byteform-section byteform-journey" aria-labelledby="project-journey-title">
        <div className="byteform-section__inner">
          <p className="project-details__meta">07 / The journey</p>
          <h3 id="project-journey-title">{byteform.journey.headline}</h3>
          <p className="project-details__story-copy">{byteform.journey.description}</p>
          <ol className="byteform-timeline" aria-label="Building ByteForm">
            {byteform.journey.milestones.map((milestone, index) => (
              <li key={milestone.label}>
                <span className="byteform-timeline__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="byteform-label">{milestone.label}</p><h4>{milestone.title}</h4><p>{milestone.description}</p><p>{milestone.detail}</p></div>
              </li>
            ))}
          </ol>
          <div className="byteform-journey__details">
            <aside className="byteform-contribution" aria-labelledby="byteform-contribution-title">
              <p className="byteform-label">Creator & Engineer</p>
              <h4 id="byteform-contribution-title">My contribution</h4>
              <p>{byteform.journey.contribution}</p>
              <p className="byteform-contribution__reflection">{byteform.journey.reflection}<strong>{byteform.journey.idea}</strong></p>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
