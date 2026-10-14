import { useState } from 'react'
import {
  IconArrowDown, IconArrowRight, IconArrowsMaximize, IconBolt, IconComponents, IconDatabase, IconDeviceMobile, IconPhoneCall,
  IconHeartbeat, IconUsers, IconUserHeart,
} from '@tabler/icons-react'
import type { Project } from '../data/projects'
import { easymd } from '../data/easymd'
import { ProjectTechTable } from './ProjectTechTable'

const icons = {
  patient: IconUserHeart, team: IconUsers, architecture: IconComponents,
  performance: IconBolt, experience: IconDeviceMobile, reliability: IconHeartbeat,
  cache: IconDatabase, calling: IconPhoneCall,
}

function EasyMDIcon({ name }: { name: keyof typeof icons }) {
  const Icon = icons[name]
  return <Icon className="easymd-icon" size={24} stroke={1.5} aria-hidden="true" />
}

function EasyMDRedesign() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const screen = easymd.redesign.screens[selectedIndex]

  return (
    <section id="project-product" data-project-section className="project-details__story easymd-section easymd-redesign" aria-labelledby="project-product-title">
      <div className="easymd-section__inner easymd-redesign__layout">
        <div className="easymd-redesign__copy">
          <header>
            <p className="project-details__meta">04 / The product</p>
            <h3 id="project-product-title">{easymd.redesign.headline}</h3>
            <p className="project-details__story-copy">{easymd.redesign.description}</p>
          </header>
          <div className="easymd-redesign__selector" role="group" aria-label="Choose an example from the app redesign">
            {easymd.redesign.screens.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={selectedIndex === index} aria-controls="easymd-redesign-comparison" onClick={() => setSelectedIndex(index)}>
                <span className="easymd-redesign__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
                <IconArrowRight size={16} stroke={1.5} aria-hidden="true" />
              </button>
            ))}
          </div>
          <dl className="easymd-redesign__notes" aria-live="polite" aria-atomic="true">
            <div><dt>Before</dt><dd>{screen.beforeNote}</dd></div>
            <div><dt>After</dt><dd>{screen.afterNote}</dd></div>
          </dl>
        </div>
        <figure id="easymd-redesign-comparison" className="easymd-redesign__comparison" aria-label={`${screen.label}, before and after the redesign`}>
          <div key={screen.id} className="easymd-redesign__screens">
            {(['before', 'after'] as const).map((version) => (
              <div key={version} className="easymd-redesign__version" data-version={version}>
                <p className="easymd-redesign__caption"><span>{version === 'before' ? 'Before' : 'After'}</span><span>{version === 'before' ? 'Android' : 'iOS'}</span></p>
                <a className="easymd-redesign__screen" href={screen[version]} target="_blank" rel="noopener noreferrer" aria-label={`Open ${screen.label.toLowerCase()} screen ${version} the redesign at full size in a new tab`}>
                  <img src={screen[version]} alt={`EasyMD ${screen.label.toLowerCase()} screen ${version} the redesign`} width={version === 'before' ? 720 : 1206} height={version === 'before' ? 1600 : 2622} loading="lazy" decoding="async" />
                  <span className="easymd-redesign__expand"><IconArrowsMaximize size={18} stroke={1.5} aria-hidden="true" /></span>
                </a>
              </div>
            ))}
            <span className="easymd-redesign__arrow" aria-hidden="true"><IconArrowRight size={28} stroke={1.25} /></span>
          </div>
          <figcaption>{screen.label} <span aria-hidden="true">·</span> Open a screen to view full size <IconArrowsMaximize size={12} stroke={1.5} aria-hidden="true" /></figcaption>
        </figure>
      </div>
    </section>
  )
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
            <a className="project-details__visit" href={project.link} target="_blank" rel="noopener noreferrer">{project.linkLabel ?? 'Visit project'} <span aria-hidden="true">↗</span></a>
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

      <EasyMDRedesign />

      <section id="project-impact" data-project-section className="project-details__story easymd-section" aria-labelledby="project-impact-title">
        <div className="easymd-section__inner easymd-split">
          <header>
            <p className="project-details__meta">05 / Impact</p>
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
          <header className="project-engineering__header">
            <p className="project-details__meta">06 / The tech</p>
            <h3 id="project-tech-title">{easymd.tech.headline}</h3>
            <p className="project-details__story-copy">{easymd.tech.description}</p>
          </header>
          <ul className="project-engineering" aria-label="Mobile rearchitecture work">
            {easymd.tech.engineering.map((item) => (
              <li key={item.title}><EasyMDIcon name={item.icon} /><div><h4>{item.title}</h4><p>{item.description}</p></div></li>
            ))}
          </ul>
          <ProjectTechTable technologies={easymd.tech.technologies} caption="Technology stack" />
        </div>
      </section>

      <section id="project-journey" data-project-section className="project-details__story easymd-section easymd-journey" aria-labelledby="project-journey-title">
        <div className="easymd-section__inner">
          <p className="project-details__meta">07 / The journey</p>
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
