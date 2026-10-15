import { useTexture } from '@react-three/drei'
import { Color, SRGBColorSpace, Vector2, type MeshBasicMaterial } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { DoorPlacement } from '../scene/layout'
import { DARK_FRAME_HOLD, DOOR_STAGGER, revealProgress } from '../scene/entrance'
import { createPreviewFraming } from '../scene/previewFraming'
import { measureUpdateEnd, measureUpdateStart, registerTexture } from './performanceDiagnostics'

// The artwork stays fixed in screen space; the moving doorway reveals it.
export function PortalWorld({ placement, selected, returning, revealing, entranceOrder }: {
  placement: DoorPlacement
  selected: boolean
  returning: boolean
  revealing: boolean
  entranceOrder: number
}) {
  const { project } = placement
  const texture = useTexture(`/worlds/${project.title.toLowerCase()}.webp`)
  // Preserve the artwork aspect ratio; the doorway supplies the only crop.
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.colorSpace = SRGBColorSpace
  const image = texture.image as HTMLImageElement
  const elapsed = useRef(0)
  const pan = useRef({ elapsed: 0, progress: 0, returnElapsed: 0, returnStart: 0 })
  const framePreview = useMemo(() => createPreviewFraming(placement), [placement])
  const previousViewport = useRef({ width: 0, height: 0, imageWidth: 0, imageHeight: 0 })
  const previousCamera = useRef(new Float32Array(32))
  const previousPan = useRef(-1)
  const initializedCamera = useRef(false)
  const artwork = useMemo(() => ({
    blur: { value: 4.5 },
    reveal: { value: 0 },
    glare: { value: 1 },
    light: { value: new Color(project.room.light).lerp(new Color('#ffffff'), 0.48) },
    crop: { value: new Vector2(1, 1) },
    offset: { value: new Vector2() },
  }), [project.room.light])
  const revealArtwork = useMemo(() => (shader: Parameters<MeshBasicMaterial['onBeforeCompile']>[0]) => {
    shader.uniforms.artworkBlur = artwork.blur
    shader.uniforms.artworkReveal = artwork.reveal
    shader.uniforms.artworkCrop = artwork.crop
    shader.uniforms.artworkOffset = artwork.offset
    shader.uniforms.artworkGlare = artwork.glare
    shader.uniforms.artworkLight = artwork.light
    // Ignore both the camera and portal transforms. MeshPortalMaterial supplies
    // the doorway mask and samples this same fullscreen image during blending.
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>',
      'gl_Position = vec4(position.xy, 0.0, 1.0);')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float artworkBlur; uniform float artworkReveal; uniform float artworkGlare; uniform vec3 artworkLight; uniform vec2 artworkCrop; uniform vec2 artworkOffset;')
      .replace('#include <map_fragment>', `
        #ifdef USE_MAP
          // Blend existing mip levels to soften the artwork with one lookup.
          // Zero bias restores the ordinary material sampling after the reveal.
          diffuseColor *= texture2D(map, (vMapUv - 0.5) * artworkCrop + 0.5 + artworkOffset, artworkBlur);
          // Light washes out the preview while retaining faint silhouettes.
          // Clear the veil during entry so the interior artwork is readable.
          diffuseColor.rgb = mix(diffuseColor.rgb, artworkLight, artworkGlare * 0.5);
          diffuseColor.rgb *= artworkReveal;
        #endif
      `)
  }, [artwork])
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const { size } = useThree()
  useEffect(() => {
    registerTexture(texture)
  }, [texture])
  useFrame(({ camera }, frameDelta) => {
    const startedAt = measureUpdateStart()
    const viewport = previousViewport.current
    if (viewport.width !== size.width || viewport.height !== size.height
      || viewport.imageWidth !== image.width || viewport.imageHeight !== image.height) {
      const viewportAspect = size.width / size.height
      const imageAspect = image.width / image.height
      // Centered cover crop: preserve proportions and never expose empty edges.
      artwork.crop.value.set(Math.min(1, viewportAspect / imageAspect), Math.min(1, imageAspect / viewportAspect))
      viewport.width = size.width
      viewport.height = size.height
      viewport.imageWidth = image.width
      viewport.imageHeight = image.height
    }
    const delta = Math.min(frameDelta, 0.05)
    // Finish the pan before the portal starts its fullscreen blend. Scale
    // stays constant throughout, including arrival and the return journey.
    pan.current.elapsed = selected ? Math.min(1.5, pan.current.elapsed + delta) : 0
    if (selected) {
      pan.current.progress = reducedMotion ? 1 : Math.max(pan.current.progress, revealProgress(pan.current.elapsed, 0, 1.5))
      pan.current.returnElapsed = 0
      pan.current.returnStart = pan.current.progress
    } else {
      const distance = (camera.position.x - placement.position[0]) * Math.sin(placement.rotationY)
        + (camera.position.z - placement.position[2]) * Math.cos(placement.rotationY)
      // Keep the interior composition and light steady until the fullscreen
      // blend has ended; restore the preview while backing into the corridor.
      if ((!returning || distance >= 1.6) && pan.current.returnElapsed < 1.5) pan.current.returnElapsed = Math.min(1.5, pan.current.returnElapsed + delta)
      pan.current.progress = reducedMotion ? 0 : pan.current.returnStart * (1 - revealProgress(pan.current.returnElapsed, 0, 1.5))
    }
    const delay = DARK_FRAME_HOLD + entranceOrder * DOOR_STAGGER + 0.18
    if (revealing && elapsed.current < delay + 1.75) elapsed.current = Math.min(delay + 1.75, elapsed.current + delta)
    const glare = 1 - revealProgress(pan.current.progress, 0.25, 0.7)
    if (artwork.glare.value !== glare) artwork.glare.value = glare

    let cameraChanged = !initializedCamera.current
    const matrix = camera.matrixWorld.elements
    const projection = camera.projectionMatrix.elements
    for (let index = 0; index < 16; index++) {
      if (previousCamera.current[index] !== matrix[index] || previousCamera.current[index + 16] !== projection[index]) cameraChanged = true
      previousCamera.current[index] = matrix[index]
      previousCamera.current[index + 16] = projection[index]
    }
    initializedCamera.current = true
    if (cameraChanged || previousPan.current !== pan.current.progress) {
      framePreview(camera, artwork.crop.value, pan.current.progress, artwork.offset.value)
      previousPan.current = pan.current.progress
    }

    const immediate = reducedMotion || selected || returning
    const reveal = revealing ? (immediate ? 1 : revealProgress(elapsed.current, delay, 0.8)) : 0
    const blur = Math.max(artwork.glare.value * 1.2, immediate ? 0 : 4.5 * (1 - revealProgress(elapsed.current, delay, 1.75)))
    if (artwork.reveal.value !== reveal) artwork.reveal.value = reveal
    if (artwork.blur.value !== blur) artwork.blur.value = blur
    if (!cameraChanged && !selected && !returning && (!revealing || elapsed.current >= delay + 1.75) && pan.current.progress === 0) {
      measureUpdateEnd(startedAt)
      return
    }
    measureUpdateEnd(startedAt)
  }, -1)

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthTest={false} depthWrite={false} onBeforeCompile={revealArtwork} />
    </mesh>
  )
}
