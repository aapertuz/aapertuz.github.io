export type RenderPhase =
  | 'corridor'
  | 'entering'
  | 'project'
  | 'returning'
  | 'profile-journey'
  | 'profile'

export type RendererMode = 'legacy' | 'direct'

export function getRendererMode(search: string): RendererMode {
  return new URLSearchParams(search).get('renderer') === 'legacy' ? 'legacy' : 'direct'
}
