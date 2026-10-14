import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { CanvasTexture, EquirectangularReflectionMapping, PMREMGenerator, SRGBColorSpace } from 'three'

// Locally generated studio reflections for the door metal and sculpted name.
// Broad soft sources keep the finish satin; the black gaps preserve contrast.
export function useFrameEnvironment() {
  const gl = useThree((state) => state.gl)
  const environment = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')!
    context.fillStyle = '#08090b'
    context.fillRect(0, 0, canvas.width, canvas.height)

    const softbox = (x: number, y: number, width: number, height: number, strength: number) => {
      context.save()
      context.translate(x, y)
      context.scale(width, height)
      const glow = context.createRadialGradient(0, 0, 0.12, 0, 0, 1)
      glow.addColorStop(0, `rgba(235,239,245,${strength})`)
      glow.addColorStop(0.45, `rgba(235,239,245,${strength * 0.7})`)
      glow.addColorStop(1, 'rgba(235,239,245,0)')
      context.fillStyle = glow
      context.fillRect(-1, -1, 2, 2)
      context.restore()
    }
    softbox(256, 220, 85, 195, 0.85)
    softbox(768, 220, 85, 195, 0.85)
    softbox(512, 100, 360, 75, 0.65)
    softbox(512, 260, 140, 145, 0.24)

    const source = new CanvasTexture(canvas)
    source.colorSpace = SRGBColorSpace
    source.mapping = EquirectangularReflectionMapping
    const generator = new PMREMGenerator(gl)
    const target = generator.fromEquirectangular(source)
    source.dispose()
    generator.dispose()
    return target
  }, [gl])
  useEffect(() => () => environment.dispose(), [environment])
  return environment.texture
}
