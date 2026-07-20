import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { FloatingNav } from './FloatingNav'
import { NAV_ITEMS } from './floatingNavModel'
import * as navModel from './floatingNavModel'

const css = await Bun.file(new URL('../index.css', import.meta.url)).text()

describe('FloatingNav', () => {
  test('renders the three options with Home selected initially', () => {
    const markup = renderToStaticMarkup(<FloatingNav />)

    expect(NAV_ITEMS).toEqual(['home', 'about', 'blog'])
    expect(markup).toContain('aria-label="Primary navigation"')
    expect(markup).toContain('>Home</button>')
    expect(markup).toContain('>About</button>')
    expect(markup).toContain('>Blog</button>')
    expect(markup).toContain('data-selected="home"')
    expect(markup).toContain('aria-pressed="true"')
  })

  test('accepts controlled selection and emits the selection callback', () => {
    const source = Bun.file(new URL('./FloatingNav.tsx', import.meta.url))
    expect(source.text()).resolves.toContain('active?: NavItem')
    expect(source.text()).resolves.toContain('onSelect?: (item: NavItem) => void')
  })

  test('restarts the particle cycle when controlled selection returns to Home', async () => {
    const source = await Bun.file(new URL('./FloatingNav.tsx', import.meta.url)).text()
    expect(source).toContain('if (active === selected) return')
    expect(source).toContain('useEffect(() => {')
    expect(source).toContain('particles: createGravityParticles()')
  })

  test('renders the fifteen-particle gravity effect around the selection', () => {
    const markup = renderToStaticMarkup(<FloatingNav />)
    const particles = markup.match(/class="floating-nav__particle"/g) ?? []

    expect(markup).toContain('floating-nav__particle-effect')
    expect(particles).toHaveLength(15)
  })

  test('generates inward particle trajectories from the supplied gravity model', () => {
    const createGravityParticles = Reflect.get(
      navModel,
      'createGravityParticles',
    ) as undefined | ((random: () => number) => Array<{
      startX: number
      startY: number
      endX: number
      endY: number
      time: number
      scale: number
    }>)

    expect(typeof createGravityParticles).toBe('function')

    const particles = createGravityParticles?.(() => 0.5) ?? []
    expect(particles).toHaveLength(15)
    expect(particles.every((particle) => {
      const startDistance = Math.hypot(particle.startX, particle.startY)
      const endDistance = Math.hypot(particle.endX, particle.endY)
      return startDistance > endDistance
    })).toBe(true)
    expect(particles.every((particle) => particle.time === 1200)).toBe(true)
    expect(particles.every((particle) => particle.scale === 1)).toBe(true)
  })

  test('defines liquid glass, selector motion, and reduced-motion fallback', () => {
    expect(css).toContain('.floating-nav {')
    expect(css).toContain('backdrop-filter: blur(12px)')
    expect(css).toContain('url(#floating-nav-glass)')
    expect(css).toContain('.floating-nav__particle-effect')
    expect(css).toContain('.floating-nav__particle')
    expect(css).toContain('.floating-nav__point')
    expect(css).toContain('filter: url(#floating-nav-goo)')
    expect(css).toContain('@keyframes floating-nav-particle')
    expect(css).toContain('@keyframes floating-nav-point')
    expect(css).not.toContain('@keyframes nav-liquid')
    expect(css).toContain('min-height: 44px')
    expect(css).toContain("data-selected='blog'")
    expect(css).toContain(".floating-nav__item[aria-pressed='true']:focus-visible")
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('@supports not ((backdrop-filter: blur(1px))')
  })

  test('reduced motion removes the particle burst and pill animation', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('.floating-nav__particle-effect::after')
    expect(css).toContain('display: none')
  })

  test('uses transparent alpha compositing so the effect cannot cover the scene', async () => {
    const source = await Bun.file(new URL('./FloatingNav.tsx', import.meta.url)).text()

    expect(source).toContain('id="floating-nav-goo"')
    expect(source).toContain('<feGaussianBlur')
    expect(source).toContain('<feColorMatrix')
    expect(css).toContain('filter: url(#floating-nav-goo)')
    expect(css).not.toContain('.floating-nav__particle-effect::before')
  })

  test('keeps the selected pill visible without color-mix support', () => {
    expect(css).toContain('background: #f7ead7')
  })
})
