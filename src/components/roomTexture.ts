import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Project } from '../data/projects'

const WIDTH = 768
const HEIGHT = 1344
const PAD_X = 92
const TEXT_WIDTH = WIDTH - PAD_X * 2

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function wrapRoomText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = []
  let line = ''

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }

  if (line) lines.push(line)
  return lines
}

function addGrain(context: CanvasRenderingContext2D, seed: number) {
  const image = context.getImageData(0, 0, WIDTH, HEIGHT)
  const random = mulberry32(seed)

  for (let index = 0; index < image.data.length; index += 4) {
    const grain = Math.round((random() - 0.5) * 9)
    image.data[index] = Math.max(0, Math.min(255, image.data[index] + grain))
    image.data[index + 1] = Math.max(0, Math.min(255, image.data[index + 1] + grain))
    image.data[index + 2] = Math.max(0, Math.min(255, image.data[index + 2] + grain))
  }

  context.putImageData(image, 0, 0)
}

function drawCopy(context: CanvasRenderingContext2D, project: Project) {
  context.textBaseline = 'top'
  context.fillStyle = project.room.text
  context.font = '500 27px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.fillText(
    `${project.index} · ${project.discipline} · ${project.status}`,
    PAD_X,
    360,
  )

  context.fillStyle = project.room.nameText
  context.font = '800 92px Arial, Helvetica, sans-serif'
  context.fillText(project.title, PAD_X, 430)

  context.fillStyle = project.room.text
  context.font = 'italic 500 43px Georgia, serif'
  const descriptionLines = wrapRoomText(context, project.description, TEXT_WIDTH).slice(0, 6)
  descriptionLines.forEach((line, index) => {
    context.fillText(line, PAD_X, 570 + index * 58)
  })

  context.font = '500 27px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.fillText(project.role.toUpperCase(), PAD_X, 1030)
}

export function createRoomTexture(project: Project): CanvasTexture | null {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = project.room.base
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, project.room.gradient[0])
  gradient.addColorStop(0.58, project.room.gradient[1])
  gradient.addColorStop(1, project.room.gradient[2])
  context.fillStyle = gradient
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const ceilingLight = context.createRadialGradient(110, 80, 0, 110, 80, 680)
  ceilingLight.addColorStop(0, 'rgba(255,255,255,0.24)')
  ceilingLight.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = ceilingLight
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const edgeShade = context.createLinearGradient(0, 0, WIDTH, 0)
  edgeShade.addColorStop(0, 'rgba(0,0,0,0.28)')
  edgeShade.addColorStop(0.18, 'rgba(0,0,0,0)')
  edgeShade.addColorStop(1, 'rgba(0,0,0,0.12)')
  context.fillStyle = edgeShade
  context.fillRect(0, 0, WIDTH, HEIGHT)

  addGrain(context, Number(project.index))
  drawCopy(context, project)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}
