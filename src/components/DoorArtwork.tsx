import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, MeshBasicMaterial, SRGBColorSpace, Vector2 } from 'three'
import { useEffect, useMemo, useRef } from 'react'
import type { DoorPlacement } from '../scene/layout'
import { DARK_FRAME_HOLD, DOOR_STAGGER, revealProgress } from '../scene/entrance'
import { createPreviewFraming } from '../scene/previewFraming'
import { measureUpdateEnd, measureUpdateStart, registerTexture } from './performanceDiagnostics'
import type { ArtworkUniforms, TransitionState } from './transitionTypes'

export function DoorArtwork({ placement, selected, returning, revealing, entranceOrder, transitionState }: {
  placement: DoorPlacement
  selected: boolean
  returning: boolean
  revealing: boolean
  entranceOrder: number
  transitionState: TransitionState
}) {
  const { project } = placement
  const texture = useTexture(`/worlds/${project.title.toLowerCase()}.webp`)
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.colorSpace = SRGBColorSpace
  const image = texture.image as HTMLImageElement
  const elapsed = useRef(0)
  const pan = useRef({ elapsed: 0, progress: 0, returnElapsed: 0, returnStart: 0 })
  const framePreview = useMemo(() => createPreviewFraming(placement), [placement])
  const previousViewport = useRef({ width: 0, height: 0, imageWidth: 0, imageHeight: 0, bufferWidth: 0, bufferHeight: 0 })
  const previousCamera = useRef(new Float32Array(32))
  const previousPan = useRef(-1)
  const initializedCamera = useRef(false)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const { size, gl } = useThree()
  const uniforms = useMemo<ArtworkUniforms>(() => ({
    blur: { value: 4.5 },
    reveal: { value: 0 },
    glare: { value: 1 },
    light: { value: new Color(project.room.light).lerp(new Color('#ffffff'), 0.48) },
    crop: { value: new Vector2(1, 1) },
    offset: { value: new Vector2() },
    resolution: { value: new Vector2(1, 1) },
  }), [project.room.light])
  const configureScreenArtwork = useMemo(() => (shader: Parameters<MeshBasicMaterial['onBeforeCompile']>[0]) => {
    shader.uniforms.artworkBlur = uniforms.blur
    shader.uniforms.artworkReveal = uniforms.reveal
    shader.uniforms.artworkGlare = uniforms.glare
    shader.uniforms.artworkLight = uniforms.light
    shader.uniforms.artworkCrop = uniforms.crop
    shader.uniforms.artworkOffset = uniforms.offset
    shader.uniforms.artworkResolution = uniforms.resolution
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float artworkBlur;
        uniform float artworkReveal;
        uniform float artworkGlare;
        uniform vec3 artworkLight;
        uniform vec2 artworkCrop;
        uniform vec2 artworkOffset;
        uniform vec2 artworkResolution;
      `)
      .replace('#include <map_fragment>', `
        #ifdef USE_MAP
          vec2 artworkScreenUv = gl_FragCoord.xy / artworkResolution;
          vec2 artworkSampleUv = (artworkScreenUv - 0.5) * artworkCrop + 0.5 + artworkOffset;
          vec4 sampledDiffuseColor = texture2D(map, artworkSampleUv, artworkBlur);
          diffuseColor *= sampledDiffuseColor;
          diffuseColor.rgb = mix(diffuseColor.rgb, artworkLight, artworkGlare * 0.5);
          diffuseColor.rgb *= artworkReveal;
        #endif
      `)
  }, [uniforms])
  const material = useMemo(() => {
    const next = new MeshBasicMaterial({
      map: texture,
      toneMapped: false,
      fog: true,
      depthTest: true,
      depthWrite: true,
    })
    next.onBeforeCompile = configureScreenArtwork
    return next
  }, [configureScreenArtwork, texture])
  useEffect(() => {
    registerTexture(texture)
    return () => material.dispose()
  }, [material, texture])
  useEffect(() => {
    if (selected || returning) transitionState.artwork = { texture, uniforms }
    else if (transitionState.artwork?.texture === texture) transitionState.artwork = null
    return () => {
      if (transitionState.artwork?.texture === texture) transitionState.artwork = null
    }
  }, [selected, returning, texture, uniforms, transitionState])

  useFrame(({ camera }, frameDelta) => {
    const startedAt = measureUpdateStart()
    const viewport = previousViewport.current
    if (viewport.width !== size.width || viewport.height !== size.height
      || viewport.imageWidth !== image.width || viewport.imageHeight !== image.height
      || viewport.bufferWidth !== gl.domElement.width || viewport.bufferHeight !== gl.domElement.height) {
      const viewportAspect = size.width / size.height
      const imageAspect = image.width / image.height
      uniforms.crop.value.set(Math.min(1, viewportAspect / imageAspect), Math.min(1, imageAspect / viewportAspect))
      uniforms.resolution.value.set(gl.domElement.width, gl.domElement.height)
      viewport.width = size.width
      viewport.height = size.height
      viewport.imageWidth = image.width
      viewport.imageHeight = image.height
      viewport.bufferWidth = gl.domElement.width
      viewport.bufferHeight = gl.domElement.height
    }

    const delta = Math.min(frameDelta, 0.05)
    pan.current.elapsed = selected ? Math.min(1.5, pan.current.elapsed + delta) : 0
    if (selected) {
      pan.current.progress = reducedMotion ? 1 : Math.max(pan.current.progress, revealProgress(pan.current.elapsed, 0, 1.5))
      pan.current.returnElapsed = 0
      pan.current.returnStart = pan.current.progress
    } else {
      const distance = (camera.position.x - placement.position[0]) * Math.sin(placement.rotationY)
        + (camera.position.z - placement.position[2]) * Math.cos(placement.rotationY)
      if ((!returning || distance >= 1.6) && pan.current.returnElapsed < 1.5) {
        pan.current.returnElapsed = Math.min(1.5, pan.current.returnElapsed + delta)
      }
      pan.current.progress = reducedMotion ? 0 : pan.current.returnStart * (1 - revealProgress(pan.current.returnElapsed, 0, 1.5))
    }
    const delay = DARK_FRAME_HOLD + entranceOrder * DOOR_STAGGER + 0.18
    if (revealing && elapsed.current < delay + 1.75) elapsed.current = Math.min(delay + 1.75, elapsed.current + delta)
    const glare = 1 - revealProgress(pan.current.progress, 0.25, 0.7)
    if (uniforms.glare.value !== glare) uniforms.glare.value = glare

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
      framePreview(camera, uniforms.crop.value, pan.current.progress, uniforms.offset.value)
      previousPan.current = pan.current.progress
    }

    const immediate = reducedMotion || selected || returning
    const reveal = revealing ? (immediate ? 1 : revealProgress(elapsed.current, delay, 0.8)) : 0
    const blur = Math.max(uniforms.glare.value * 1.2, immediate ? 0 : 4.5 * (1 - revealProgress(elapsed.current, delay, 1.75)))
    if (uniforms.reveal.value !== reveal) uniforms.reveal.value = reveal
    if (uniforms.blur.value !== blur) uniforms.blur.value = blur
    if (!cameraChanged && !selected && !returning && (!revealing || elapsed.current >= delay + 1.75) && pan.current.progress === 0) {
      measureUpdateEnd(startedAt)
      return
    }
    measureUpdateEnd(startedAt)
  }, -1)

  return <primitive object={material} attach="material" />
}
