import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  LinearFilter,
  Mesh,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  Vector3,
  type WebGLRenderer,
  WebGLRenderTarget,
} from 'three'
import {
  beginDiagnosticFrame,
  getRegisteredTextures,
  installRenderDiagnostics,
  isPerformanceDiagnosticsEnabled,
  measureUpdateEnd,
  measureUpdateStart,
  uninstallRenderDiagnostics,
} from './performanceDiagnostics'
import { getCompositeMode } from './compositorMode'
import type { TransitionState } from './transitionTypes'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D corridorMap;
  uniform sampler2D artworkMap;
  uniform float blendAmount;
  uniform float artworkBlur;
  uniform float artworkReveal;
  uniform float artworkGlare;
  uniform vec3 artworkLight;
  uniform vec2 artworkCrop;
  uniform vec2 artworkOffset;
  varying vec2 vUv;
  #include <common>
  void main() {
    vec2 artworkUv = (vUv - 0.5) * artworkCrop + 0.5 + artworkOffset;
    vec4 artwork = texture2D(artworkMap, artworkUv, artworkBlur);
    artwork.rgb = mix(artwork.rgb, artworkLight, artworkGlare * 0.5);
    artwork.rgb *= artworkReveal;
    vec4 corridor = texture2D(corridorMap, vUv);
    gl_FragColor = mix(corridor, artwork, blendAmount);
    #include <colorspace_fragment>
  }
`

function createRenderTarget(renderer: WebGLRenderer) {
  const context = renderer.getContext() as WebGL2RenderingContext
  const contextAttributes = context.getContextAttributes()
  const samples = renderer.capabilities.isWebGL2 && contextAttributes?.antialias
    ? Math.min(context.getParameter(context.SAMPLES) || 4, context.getParameter(context.MAX_SAMPLES))
    : 0
  const target = new WebGLRenderTarget(1, 1, {
    format: RGBAFormat,
    type: UnsignedByteType,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: true,
    stencilBuffer: false,
    samples,
  })
  target.texture.colorSpace = NoColorSpace
  return target
}

export function PerformanceSampler({ transitionState, dpr, target }: {
  transitionState: TransitionState
  dpr: number
  target: WebGLRenderTarget | null
}) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    if (!isPerformanceDiagnosticsEnabled()) return
    // The query opt-in adds measurements only; it does not change render quality.
    installRenderDiagnostics(gl)
    return uninstallRenderDiagnostics
  }, [gl])
  useFrame((_, delta) => {
    const startedAt = measureUpdateStart()
    beginDiagnosticFrame(delta * 1000, transitionState.phase, dpr, target)
    measureUpdateEnd(startedAt)
  }, -100)
  return null
}

export function TransitionCompositor({ transitionState, dpr, expectedTextureCount }: { transitionState: TransitionState; dpr: number; expectedTextureCount: number }) {
  const { gl, scene, camera } = useThree()
  const target = useMemo(() => createRenderTarget(gl), [gl])
  const bufferSize = useMemo(() => new Vector2(), [])
  const lastSize = useRef({ width: 0, height: 0 })
  const fullscreen = useMemo(() => {
    const compositeScene = new Scene()
    const compositeCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new PlaneGeometry(2, 2)
    const material = new ShaderMaterial({
      uniforms: {
        corridorMap: { value: target.texture },
        artworkMap: { value: null },
        blendAmount: { value: 0 },
        artworkBlur: { value: 0 },
        artworkReveal: { value: 1 },
        artworkGlare: { value: 0 },
        artworkLight: { value: new Vector3() },
        artworkCrop: { value: new Vector2(1, 1) },
        artworkOffset: { value: new Vector2() },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const mesh = new Mesh(geometry, material)
    return { compositeScene, compositeCamera, geometry, material, mesh }
  }, [target])

  useEffect(() => {
    fullscreen.mesh.geometry = fullscreen.geometry
    fullscreen.mesh.material = fullscreen.material
    fullscreen.mesh.frustumCulled = false
    fullscreen.compositeScene.add(fullscreen.mesh)
    return () => {
      fullscreen.compositeScene.remove(fullscreen.mesh)
      fullscreen.geometry.dispose()
      fullscreen.material.dispose()
      target.dispose()
    }
  }, [fullscreen, target])

  useEffect(() => {
    let cancelled = false
    let timer: number | undefined
    let idleHandle: number | undefined
    let idleHandleIsTimer = false
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const requestIdle = (callback: () => void) => {
      if (idleWindow.requestIdleCallback) {
        idleHandleIsTimer = false
        idleHandle = idleWindow.requestIdleCallback(() => callback(), { timeout: 1800 })
      } else {
        idleHandleIsTimer = true
        idleHandle = window.setTimeout(callback, 180)
      }
    }
    const texturesReadySince = performance.now()
    const prepare = () => {
      if (cancelled) return
      const textures = getRegisteredTextures()
      if (textures.length < expectedTextureCount && performance.now() - texturesReadySince < 5000) {
        timer = window.setTimeout(prepare, 120)
        return
      }
      let textureIndex = 0
      const initializeNextTexture = () => {
        if (cancelled) return
        if (textureIndex < textures.length) {
          gl.initTexture(textures[textureIndex++])
          requestIdle(initializeNextTexture)
          return
        }
        // Three.js resolves this after its program-compile extension finishes;
        // running it from an idle callback keeps shader preparation off the intro.
        void Promise.all([
          gl.compileAsync(scene, camera),
          gl.compileAsync(fullscreen.compositeScene, fullscreen.compositeCamera),
        ]).catch(() => undefined)
      }
      requestIdle(initializeNextTexture)
    }
    prepare()
    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
      if (idleHandle !== undefined) {
        if (idleHandleIsTimer) window.clearTimeout(idleHandle)
        else idleWindow.cancelIdleCallback?.(idleHandle)
      }
    }
  }, [camera, expectedTextureCount, fullscreen, gl, scene])

  useFrame(() => {
    const startedAt = measureUpdateStart()
    if (gl.getContext().isContextLost()) {
      measureUpdateEnd(startedAt)
      return
    }
    const artwork = transitionState.artwork
    const blend = Math.max(0, Math.min(1, transitionState.blend))
    const mode = getCompositeMode(blend, Boolean(artwork))
    if (mode === 'blend') {
      gl.getDrawingBufferSize(bufferSize)
      if (lastSize.current.width !== bufferSize.x || lastSize.current.height !== bufferSize.y) {
        target.setSize(bufferSize.x, bufferSize.y)
        lastSize.current.width = bufferSize.x
        lastSize.current.height = bufferSize.y
      }
    } else if (lastSize.current.width !== 1 || lastSize.current.height !== 1) {
      // Keep the shared MSAA target allocated only while a partial transition
      // needs it; the opaque project and corridor are direct single-pass draws.
      target.setSize(1, 1)
      lastSize.current.width = 1
      lastSize.current.height = 1
    }
    if (mode === 'corridor') {
      gl.setRenderTarget(null)
      gl.render(scene, camera)
      measureUpdateEnd(startedAt)
      return
    }
    if (!artwork) {
      measureUpdateEnd(startedAt)
      return
    }

    const uniforms = fullscreen.material.uniforms
    uniforms.artworkMap.value = artwork.texture
    uniforms.artworkBlur.value = artwork.uniforms.blur.value
    uniforms.artworkReveal.value = artwork.uniforms.reveal.value
    uniforms.artworkGlare.value = artwork.uniforms.glare.value
    uniforms.artworkLight.value.set(
      artwork.uniforms.light.value.r,
      artwork.uniforms.light.value.g,
      artwork.uniforms.light.value.b,
    )
    uniforms.artworkCrop.value.copy(artwork.uniforms.crop.value)
    uniforms.artworkOffset.value.copy(artwork.uniforms.offset.value)
    uniforms.blendAmount.value = blend

    if (mode === 'blend') {
      gl.setRenderTarget(target)
      gl.render(scene, camera)
    }
    gl.setRenderTarget(null)
    gl.render(fullscreen.compositeScene, fullscreen.compositeCamera)
    measureUpdateEnd(startedAt)
  }, 1)

  return <PerformanceSampler transitionState={transitionState} dpr={dpr} target={target} />
}
