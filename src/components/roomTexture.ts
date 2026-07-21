import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Project } from '../data/projects'
import { techIcons } from '../data/techIcons'

const WIDTH = 768
const HEIGHT = 1344
const PAD_X = 92
const TEXT_WIDTH = WIDTH - PAD_X * 2
const TOOL_Y = 1124
const ACTION_Y = 1182

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

function drawTools(
  context: CanvasRenderingContext2D,
  project: Project,
  texture: CanvasTexture,
) {
  context.textBaseline = 'middle'
  const gap = 12
  const size = Math.min(76, (TEXT_WIDTH - gap * (project.tools.length - 1)) / project.tools.length)
  project.tools.forEach((tool, index) => {
    const x = PAD_X + index * (size + gap)
    context.fillStyle = 'rgba(17, 17, 19, 0.9)'
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    context.lineWidth = 2
    context.beginPath()
    context.roundRect(x, TOOL_Y - size / 2, size, size, 12)
    context.fill()
    context.stroke()

    const icon = new Image()
    icon.crossOrigin = 'anonymous'
    icon.onload = () => {
      const inset = Math.max(12, size * 0.18)
      context.drawImage(icon, x + inset, TOOL_Y - size / 2 + inset, size - inset * 2, size - inset * 2)
      texture.needsUpdate = true
    }
    icon.src = techIcons[tool]
  })
}

function drawVisitAction(context: CanvasRenderingContext2D, project: Project) {
  const available = Boolean(project.link)
  const actionLabel = project.link ? 'VISIT' : 'COMING SOON'
  context.fillStyle = available ? project.room.nameText : 'rgba(255, 255, 255, 0.32)'
  context.fillRect(PAD_X, ACTION_Y, TEXT_WIDTH, 2)
  context.font = '700 25px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textBaseline = 'top'
  context.fillText(available ? `${actionLabel}  ↗` : actionLabel, PAD_X, ACTION_Y + 22)
}

function drawCopy(context: CanvasRenderingContext2D, project: Project, texture: CanvasTexture) {
  context.textBaseline = 'top'
  context.fillStyle = project.room.text
  context.font = '500 27px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.fillText(
    `${project.index} · ${project.industry} · ${project.status}`,
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



  drawTools(context, project, texture)
  drawVisitAction(context, project)
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

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  addGrain(context, Number(project.index))
  drawCopy(context, project, texture)
  texture.needsUpdate = true
  return texture
}
