import { useEffect, useState, type CSSProperties } from 'react'
import {
  NAV_ITEMS,
  createGravityParticles,
  type GravityParticle,
  type NavItem,
} from './floatingNavModel'

type ParticleStyle = CSSProperties & Record<`--${string}`, string | number>

function getParticleStyle(particle: GravityParticle): ParticleStyle {
  return {
    '--start-x': `${particle.startX}px`,
    '--start-y': `${particle.startY}px`,
    '--end-x': `${particle.endX}px`,
    '--end-y': `${particle.endY}px`,
    '--particle-time': `${particle.time}ms`,
    '--particle-scale': particle.scale,
    '--particle-color': `var(--nav-particle-${particle.color})`,
    '--particle-rotate': `${particle.rotate}deg`,
  }
}

interface FloatingNavProps {
  active?: NavItem
  onSelect?: (item: NavItem) => void
  inert?: boolean
}

export function FloatingNav({ active = 'home', onSelect = () => undefined, inert = false }: FloatingNavProps) {
  const [selected, setSelected] = useState<NavItem>(active)
  const [effect, setEffect] = useState(() => ({
    cycle: 0,
    particles: createGravityParticles(),
  }))

  const select = (item: NavItem) => {
    if (item === selected) return
    setSelected(item)
    onSelect(item)
    setEffect((current) => ({
      cycle: current.cycle + 1,
      particles: createGravityParticles(),
    }))
  }

  useEffect(() => setSelected(active), [active])

  return (
    <nav
      className="floating-nav"
      aria-label="Primary navigation"
      data-selected={selected}
      aria-hidden={inert || undefined}
      style={inert ? { pointerEvents: 'none' } : undefined}
    >
      <svg className="floating-nav__filters" aria-hidden="true">
        <defs>
          <filter id="floating-nav-glass" primitiveUnits="objectBoundingBox">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.08"
              numOctaves="2"
              seed="8"
              result="noise"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.012" result="blur" />
            <feDisplacementMap
              in="blur"
              in2="noise"
              scale="0.035"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span
        key={effect.cycle}
        className="floating-nav__particle-effect"
        aria-hidden="true"
      >
        {effect.particles.map((particle, index) => (
          <span
            key={index}
            className="floating-nav__particle"
            style={getParticleStyle(particle)}
          >
            <span className="floating-nav__point" />
          </span>
        ))}
      </span>
      {NAV_ITEMS.map((item) => (
        <button
          key={item}
          className="floating-nav__item"
          type="button"
          aria-pressed={selected === item}
          onClick={() => select(item)}
        >
          {item[0].toUpperCase() + item.slice(1)}
        </button>
      ))}
    </nav>
  )
}
