export const NAV_ITEMS = ['home', 'about', 'blog'] as const
export type NavItem = (typeof NAV_ITEMS)[number]

const PARTICLE_COUNT = 15
const ANIMATION_TIME = 600
const TIME_VARIANCE = 300
const COLOR_SEQUENCE = [1, 2, 3, 1, 2, 3, 1, 4] as const

export interface GravityParticle {
  startX: number
  startY: number
  endX: number
  endY: number
  time: number
  scale: number
  color: number
  rotate: number
}

function noise(random: () => number, amount = 1) {
  return amount / 2 - random() * amount
}

function getPoint(
  random: () => number,
  distance: number,
  pointIndex: number,
  totalPoints: number,
) {
  const degrees = ((360 + noise(random, 8)) / totalPoints) * pointIndex
  const radians = degrees * Math.PI / 180
  return [distance * Math.cos(radians), distance * Math.sin(radians)] as const
}

export function createGravityParticles(
  random: () => number = Math.random,
): GravityParticle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const time = ANIMATION_TIME * 2 + noise(random, TIME_VARIANCE * 2)
    const rotationNoise = noise(random, 10)
    const start = getPoint(random, 90, PARTICLE_COUNT - index, PARTICLE_COUNT)
    const end = getPoint(
      random,
      10 + noise(random, 7),
      PARTICLE_COUNT - index,
      PARTICLE_COUNT,
    )
    const scale = 1 + noise(random, 0.2)
    const color = COLOR_SEQUENCE[Math.floor(random() * COLOR_SEQUENCE.length)]

    return {
      startX: start[0],
      startY: start[1],
      endX: end[0],
      endY: end[1],
      time,
      scale,
      color,
      rotate: rotationNoise > 0
        ? (rotationNoise + 5) * 10
        : (rotationNoise - 5) * 10,
    }
  })
}
