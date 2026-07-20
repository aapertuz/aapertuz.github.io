import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { AboutWindow } from './AboutWindow'

const css = await Bun.file(new URL('../index.css', import.meta.url)).text()

describe('AboutWindow', () => {
  test('renders the profile sections in an accessible dialog', () => {
    const markup = renderToStaticMarkup(<AboutWindow open onClose={() => undefined} />)
    expect(markup).toContain('role="dialog"')
    expect(markup).toContain('aria-modal="true"')
    expect(markup).toContain('Your Name')
    expect(markup).toContain('Technologies')
    expect(markup).toContain('Companies')
    expect(markup).toContain('Projects')
    expect(markup).toContain('Contact')
    expect(markup).toContain('aria-label="Close About"')
  })

  test('does not render when closed', () => {
    expect(renderToStaticMarkup(<AboutWindow open={false} onClose={() => undefined} />)).toBe('')
  })

  test('uses panel-local glass with responsive and reduced-motion rules, without a backdrop', () => {
    expect(css).toContain('.about-window {')
    expect(css).toContain('backdrop-filter: blur(12px) saturate(155%)')
    expect(css).toContain('0 24px 80px rgb(0 0 0 / 48%)')
    expect(css).toContain('@media (max-width: 767px)')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).not.toContain('.about-backdrop')
    expect(css).not.toContain('about-window::before')
  })
})
