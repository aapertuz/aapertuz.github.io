import { describe, expect, test } from 'bun:test'

const nameTextSource = await Bun.file(new URL('./NameText.tsx', import.meta.url)).text()

describe('NameText hero composition', () => {
  test('renders the name as a centered two-line hierarchy', () => {
    expect(nameTextSource).not.toContain('Some problems have felt like closed doors.')
    expect(nameTextSource).not.toContain("import { Center, Text, Text3D }")
    expect(nameTextSource).toContain('<Line text="I\'m" size={0.7} y={2.15} />')
    expect(nameTextSource).toContain('<Line text="Alexis Pertuz" size={0.78} y={0.85} />')
    expect(nameTextSource).not.toContain('<Line text="Lex Pertuz"')
    expect(nameTextSource).not.toContain('<Line text="Pertuz"')
  })
})
