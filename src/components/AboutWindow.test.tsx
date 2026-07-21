import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { AboutWindow } from './AboutWindow'

const css = await Bun.file(new URL('../index.css', import.meta.url)).text()
const source = await Bun.file(new URL('./AboutWindow.tsx', import.meta.url)).text()

describe('AboutWindow', () => {
  test('renders the profile sections in an accessible dialog', () => {
    const markup = renderToStaticMarkup(<AboutWindow open onClose={() => undefined} />)
    expect(markup).toContain('role="dialog"')
    expect(markup).toContain('aria-modal="true"')
    expect(markup).toContain('Antonio')
    expect(markup).toContain('Technologies')
    expect(markup).toContain('Companies')
    expect(markup).toContain('Contact')
    expect(markup).toContain('aria-label="Close About"')
  })

  test('renders companies, technologies, and contact as logo-only marks', () => {
    const markup = renderToStaticMarkup(<AboutWindow open onClose={() => undefined} />)
    expect(markup).toContain('about-window__logo-grid')
    expect(markup).toContain('about-window__logo-mark')
    expect(markup).toContain('about-window__contact-link')
    expect(markup).toContain('<svg')
    expect(markup).not.toContain('>Technology 01<')
    expect(markup).not.toContain('>Company 01<')
    expect(markup).not.toContain('>Email<')
  })

  test('does not render when closed', () => {
    expect(renderToStaticMarkup(<AboutWindow open={false} onClose={() => undefined} />)).toBe('')
  })

  test('keeps the dialog mounted long enough to animate its exit', () => {
    expect(source).toContain('useState(open)')
    expect(source).toContain('data-state={open ? "open" : "closing"}')
    expect(source).toContain('onAnimationEnd={finishClosing}')
    expect(css).toContain(".about-window[data-state='closing']")
    expect(css).toContain('animation: about-window-exit 360ms')
  })

  test('uses panel-local glass with responsive and reduced-motion rules, without a backdrop', () => {
    expect(css).toContain('.about-window {')
    expect(css).toContain('backdrop-filter: blur(12px) saturate(155%)')
    expect(css).toContain('0 24px 80px rgb(0 0 0 / 48%)')
    expect(css).toContain('@media (max-width: 767px)')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('scale(0.94)')
    expect(css).toContain('blur(16px)')
    expect(css).toContain('animation: about-window-enter 680ms var(--gravity-ease)')
    expect(css).toContain('top: calc(50% + 32px)')
    expect(css).toContain('calc(-50% - 64px)')
    expect(css).toContain('.about-window__body { display: block;')
    expect(css).toContain('place-items: center')
    expect(css).not.toContain('.about-backdrop')
    expect(css).not.toContain('about-window::before')
  })
})
