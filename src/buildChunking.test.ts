import { describe, expect, test } from 'bun:test'

const viteConfig = await Bun.file(
  new URL('../vite.config.ts', import.meta.url),
).text()

describe('production dependency ordering', () => {
  test('lets the bundler split the lazy scene without forced renderer groups', () => {
    expect(viteConfig).not.toContain('codeSplitting')
    expect(viteConfig).not.toContain('maxSize')
    expect(viteConfig).not.toContain('chunkSizeWarningLimit')
    expect(viteConfig).toContain("dedupe: ['three']")
  })
})
