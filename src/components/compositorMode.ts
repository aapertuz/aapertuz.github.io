export type CompositeMode = 'corridor' | 'blend' | 'artwork'

export function getCompositeMode(blend: number, hasArtwork: boolean): CompositeMode {
  if (!hasArtwork || blend <= 0) return 'corridor'
  return blend >= 1 ? 'artwork' : 'blend'
}
