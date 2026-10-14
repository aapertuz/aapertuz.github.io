import { describe, expect, test } from 'bun:test'

const nameTextSource = await Bun.file(new URL('./NameText.tsx', import.meta.url)).text()

describe('NameText hero composition', () => {
  test('renders the name as a single centered line', () => {
    expect(nameTextSource).not.toContain('Some problems have felt like closed doors.')
    expect(nameTextSource).not.toContain("import { Center, Text, Text3D }")
    expect(nameTextSource).not.toContain('<Line text="I\'m"')
    expect(nameTextSource).toContain('<Line text="Antonio Pertuz" size={0.84} y={1.35} />')
    expect(nameTextSource).not.toContain('<Line text="Lex Pertuz"')
    expect(nameTextSource).not.toContain('<Line text="Pertuz"')
  })
})
