import { describe, expect, test } from 'bun:test'

const viteConfig = await Bun.file(
  new URL('../vite.config.ts', import.meta.url),
).text()

describe('WebGL production chunking', () => {
  test('splits heavy renderer dependencies without suppressing Vite warnings', () => {
    expect(viteConfig).not.toContain('chunkSizeWarningLimit')
    expect(viteConfig).toContain('codeSplitting')
    expect(viteConfig).toContain("name: 'three-core'")
    expect(viteConfig).toContain("name: 'three-addons'")
    expect(viteConfig).toContain("name: 'react-three'")
    expect(viteConfig).toContain('maxSize: 400_000')
  })
})
