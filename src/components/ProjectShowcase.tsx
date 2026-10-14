import { useState, type CSSProperties } from 'react'
import { IconArrowUpRight, IconArrowsMaximize } from '@tabler/icons-react'
import type { ProjectShowcaseContent } from '../data/projectShowcases'

export function ProjectShowcase({ content, projectName }: { content: ProjectShowcaseContent; projectName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const screen = content.screens[selectedIndex]

  return (
    <section id="project-product" data-project-section className="project-details__story project-showcase" data-layout={content.layout} aria-labelledby="project-product-title">
      <div className="project-showcase__layout">
        <div className="project-showcase__copy">
          <header className="project-showcase__header">
            <p className="project-details__meta">04 / The product</p>
            <h3 id="project-product-title">{content.headline}</h3>
            {content.description && <p className="project-details__story-copy">{content.description}</p>}
          </header>
          {content.screens.length > 1 && (
            <div className="project-showcase__selector" role="group" aria-label={`Choose a ${projectName} product view`}>
              {content.screens.map((item, index) => (
                <button key={item.id} type="button" aria-pressed={selectedIndex === index} aria-controls="project-product-view" onClick={() => setSelectedIndex(index)}>
                  {item.label}<IconArrowUpRight size={16} stroke={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
          <ol id="project-product-notes" className="project-showcase__notes" aria-label={`${screen.label} features`} aria-live={content.screens.length > 1 ? 'polite' : undefined} aria-atomic="true">
            {screen.details.map((detail, index) => (
              <li key={detail.title}>
                <span className="project-showcase__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><h4>{detail.title}</h4><p>{detail.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <figure id="project-product-view" className="project-showcase__figure" aria-label={`${projectName}: ${screen.label}`} aria-describedby="project-product-notes">
          <div className="project-showcase__stage">
            {screen.media === 'video' ? (
              <div className="project-showcase__media project-showcase__video" style={{ '--media-ratio': screen.width / screen.height } as CSSProperties}>
                <video autoPlay loop muted playsInline preload="auto" width={screen.width} height={screen.height} aria-label={screen.alt} aria-describedby="project-product-notes">
                  <source src={screen.src} type="video/webm" />
                  <a href={screen.src}>Download the {projectName} demo</a>
                </video>
              </div>
            ) : (
              <a key={screen.id} className="project-showcase__media" style={{ '--media-ratio': screen.width / screen.height } as CSSProperties} href={screen.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${projectName} ${screen.label.toLowerCase()} at full size in a new tab`}>
                <img src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} loading="lazy" decoding="async" />
                {screen.details.map((detail, index) => detail.x !== undefined && detail.y !== undefined ? (
                  <span key={detail.title} className="project-showcase__marker" style={{ left: `${detail.x}%`, top: `${detail.y}%` }} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                ) : null)}
                <span className="project-showcase__expand"><IconArrowsMaximize size={18} stroke={1.5} aria-hidden="true" /></span>
              </a>
            )}
          </div>
          <figcaption><span>{screen.label}</span>{screen.media === 'video' ? <a href={screen.src} target="_blank" rel="noopener noreferrer">Open video <IconArrowUpRight size={14} stroke={1.5} aria-hidden="true" /></a> : <span>Open full size <IconArrowUpRight size={14} stroke={1.5} aria-hidden="true" /></span>}</figcaption>
        </figure>
      </div>
    </section>
  )
}
