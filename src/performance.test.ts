import { describe, expect, test } from 'bun:test'
import { readdir, stat } from 'node:fs/promises'
import { projects } from './data/projects'

const worlds = new URL('../public/worlds/', import.meta.url)

describe('deployed artwork budget', () => {
  test('ships valid WebP artwork for every door within the transfer budget', async () => {
    let bytes = 0
    for (const project of projects) {
      const url = new URL(`${project.title.toLowerCase()}.webp`, worlds)
      const header = new Uint8Array(await Bun.file(url).slice(0, 12).arrayBuffer())
      expect(new TextDecoder().decode(header.slice(0, 4))).toBe('RIFF')
      expect(new TextDecoder().decode(header.slice(8, 12))).toBe('WEBP')
      bytes += (await stat(url)).size
    }
    expect(bytes).toBeLessThan(1_300_000)
    expect((await readdir(worlds)).filter(name => /\.(png|jpg)$/.test(name))).toEqual([])
  })
})
