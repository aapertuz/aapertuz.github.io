// One opening sequence; each doorway can finish independently of its neighbors.
export interface DoorReveal {
  current: number
}

export const INTRO_DURATION_MS = 950
export const DARK_FRAME_HOLD = 0.65
export const DOOR_STAGGER = 0.14

export function revealProgress(elapsed: number, delay: number, duration: number) {
  const progress = Math.max(0, Math.min(1, (elapsed - delay) / duration))
  return progress * progress * (3 - 2 * progress)
}
