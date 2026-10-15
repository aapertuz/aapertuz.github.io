import type { Color, Texture, Vector2 } from 'three'
import type { RenderPhase } from '../scene/rendererMode'

export interface ArtworkUniforms {
  blur: { value: number }
  reveal: { value: number }
  glare: { value: number }
  light: { value: Color }
  crop: { value: Vector2 }
  offset: { value: Vector2 }
  resolution: { value: Vector2 }
}

export interface ActiveArtwork {
  texture: Texture
  uniforms: ArtworkUniforms
}

export interface TransitionState {
  blend: number
  phase: RenderPhase
  artwork: ActiveArtwork | null
}
