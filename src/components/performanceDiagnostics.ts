import { Vector2, type WebGLRenderer, type WebGLRenderTarget } from 'three'
import type { Texture } from 'three'
import type { RenderPhase } from '../scene/rendererMode'

export interface PerformanceSnapshot {
  phase: RenderPhase
  dpr: number
  canvas: { width: number; height: number }
  target: { width: number; height: number }
  frameIntervalP95Ms: number
  intervalsOver16MsPercent: number
  drawCalls: number
  geometries: number
  textures: number
  estimatedResourceMiB: number
  cpuUpdateP95Ms: number
  cpuRenderP95Ms: number
  gpuP95Ms: number | null
  gpuTimerSupported: boolean
  samples: number
}

declare global {
  interface Window {
    __portfolioPerf?: PerformanceSnapshot
  }
}

const enabled = typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get('perf') === '1'

const INTERVAL_LIMIT = 360
const elapsedFrames: number[] = []
const missedFrameSamples: number[] = []
const updateSamples: number[] = []
const renderSamples: number[] = []
const gpuSamples: number[] = []
const knownTextureBytes = new Map<object, number>()
const loadedTextures = new Set<Texture>()

let frameUpdateMs = 0
let frameRenderMs = 0
let frameCount = 0
let lastSnapshotAt = 0
let lastDrawCalls = 0
let framesSinceSnapshot = 0
let frameOpen = false
let lastTarget = { width: 0, height: 0 }
let renderer: WebGLRenderer | null = null
let originalRender: WebGLRenderer['render'] | null = null
let renderDepth = 0
let renderStartedAt = 0
let activeQuery: WebGLQuery | null = null
type TimerExtension = {
  TIME_ELAPSED_EXT: number
  GPU_DISJOINT_EXT: number
}
let timerExtension: TimerExtension | null = null
const pendingQueries: Array<{ query: WebGLQuery; frame: number }> = []
const gpuFrameTotals = new Map<number, { started: number; completed: number; nanoseconds: number; closed: boolean; valid: boolean }>()
let previousAutoReset = true
let activeQueryFrame = 0

function percentile(values: number[], fraction: number) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)]
}

function remember<T extends number[]>(values: T, value: number) {
  values.push(value)
  if (values.length > INTERVAL_LIMIT) values.shift()
}

function pollGpuQueries() {
  if (!renderer || !timerExtension) return
  const gl = renderer.getContext() as WebGL2RenderingContext
  const disjoint = Boolean(gl.getParameter(timerExtension.GPU_DISJOINT_EXT))
  for (let index = pendingQueries.length - 1; index >= 0; index--) {
    const pending = pendingQueries[index]
    const query = pending.query
    if (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) continue
    const result = gpuFrameTotals.get(pending.frame)
    if (result) {
      result.completed++
      if (!disjoint) result.nanoseconds += Number(gl.getQueryParameter(query, gl.QUERY_RESULT))
      else result.valid = false
      finishGpuFrame(pending.frame, result)
    }
    gl.deleteQuery(query)
    pendingQueries.splice(index, 1)
  }
}

function finishGpuFrame(frame: number, result: { started: number; completed: number; nanoseconds: number; closed: boolean; valid: boolean }) {
  if (!result.closed || result.completed < result.started) return
  if (result.valid && result.started > 0) remember(gpuSamples, result.nanoseconds / 1_000_000)
  gpuFrameTotals.delete(frame)
}

function closeGpuFrame(frame: number) {
  const result = gpuFrameTotals.get(frame)
  if (!result) return
  result.closed = true
  finishGpuFrame(frame, result)
}

function startGpuQuery() {
  if (!renderer || !timerExtension || activeQuery || pendingQueries.length >= 12 || frameCount % 6 !== 0) return
  const gl = renderer.getContext() as WebGL2RenderingContext
  const query = gl.createQuery()
  if (!query) return
  activeQueryFrame = frameCount
  const result = gpuFrameTotals.get(activeQueryFrame) ?? { started: 0, completed: 0, nanoseconds: 0, closed: false, valid: true }
  result.started++
  gpuFrameTotals.set(activeQueryFrame, result)
  activeQuery = query
  gl.beginQuery(timerExtension.TIME_ELAPSED_EXT, query)
}

function endGpuQuery() {
  if (!renderer || !timerExtension || !activeQuery) return
  const gl = renderer.getContext() as WebGL2RenderingContext
  gl.endQuery(timerExtension.TIME_ELAPSED_EXT)
  pendingQueries.push({ query: activeQuery, frame: activeQueryFrame })
  activeQuery = null
}

export function isPerformanceDiagnosticsEnabled() {
  return enabled
}

export function measureUpdateStart() {
  return enabled ? performance.now() : 0
}

export function measureUpdateEnd(startedAt: number) {
  if (!enabled || startedAt === 0) return
  frameUpdateMs += performance.now() - startedAt
}

export function registerTexture(texture: { image?: unknown; source?: { data?: unknown } }) {
  loadedTextures.add(texture as Texture)
  const image = texture.image ?? texture.source?.data
  if (!image || typeof image !== 'object') return
  const candidate = image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number }
  const width = candidate.width ?? candidate.videoWidth ?? 0
  const height = candidate.height ?? candidate.videoHeight ?? 0
  if (width > 0 && height > 0) knownTextureBytes.set(texture, width * height * 4 * 4 / 3)
}

export function getRegisteredTextures() {
  return [...loadedTextures].filter((texture) => {
    const image = texture.image ?? texture.source.data
    if (!image || typeof image !== 'object') return false
    const candidate = image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number }
    return (candidate.width ?? candidate.videoWidth ?? 0) > 0 && (candidate.height ?? candidate.videoHeight ?? 0) > 0
  })
}

export function installRenderDiagnostics(value: WebGLRenderer) {
  if (!enabled || renderer === value) return
  uninstallRenderDiagnostics()
  renderer = value
  const gl = value.getContext() as WebGL2RenderingContext
  timerExtension = value.capabilities.isWebGL2
    ? gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension | null
    : null
  previousAutoReset = value.info.autoReset
  value.info.autoReset = false
  originalRender = value.render.bind(value)
  value.render = ((scene, camera) => {
    const isOuterRender = renderDepth === 0
    const target = value.getRenderTarget() as WebGLRenderTarget | null
    const targetSize = target ? { width: target.width, height: target.height } : value.getDrawingBufferSize(new Vector2())
    lastTarget = { width: targetSize.width, height: targetSize.height }
    if (isOuterRender) {
      renderStartedAt = performance.now()
      startGpuQuery()
    }
    renderDepth++
    try {
      return originalRender?.(scene, camera)
    } finally {
      renderDepth--
      if (isOuterRender) {
        frameRenderMs += performance.now() - renderStartedAt
        endGpuQuery()
      }
    }
  }) as WebGLRenderer['render']
}

function finishMeasuredFrame() {
  if (!frameOpen) return
  remember(updateSamples, frameUpdateMs)
  remember(renderSamples, frameRenderMs)
  frameUpdateMs = 0
  frameRenderMs = 0
  frameOpen = false
}

export function beginDiagnosticFrame(intervalMs: number, phase: RenderPhase, dpr: number, target?: WebGLRenderTarget | null) {
  if (!enabled || !renderer) return
  finishMeasuredFrame()
  closeGpuFrame(frameCount)
  frameCount++
  framesSinceSnapshot++
  if (intervalMs > 0 && intervalMs < 1000) {
    remember(elapsedFrames, intervalMs)
    remember(missedFrameSamples, intervalMs > 1000 / 60 ? 1 : 0)
  }
  pollGpuQueries()
  frameOpen = true

  const now = performance.now()
  const elapsed = now - lastSnapshotAt
  if (elapsed < 500) return
  lastSnapshotAt = now

  const gl = renderer.getContext() as WebGL2RenderingContext
  const canvasWidth = renderer.domElement.width
  const canvasHeight = renderer.domElement.height
  const targetWidth = target?.width ?? lastTarget.width
  const targetHeight = target?.height ?? lastTarget.height
  const targetSamples = target?.samples ?? 0
  const targetBytes = targetWidth * targetHeight * (4 + (targetSamples > 0 ? targetSamples * 8 : 4))
  const knownBytes = [...knownTextureBytes.values()].reduce((sum, bytes) => sum + bytes, 0)
  const snapshot: PerformanceSnapshot = {
    phase,
    dpr,
    canvas: { width: canvasWidth, height: canvasHeight },
    target: { width: targetWidth, height: targetHeight },
    frameIntervalP95Ms: percentile(elapsedFrames, 0.95),
    intervalsOver16MsPercent: missedFrameSamples.length ? missedFrameSamples.reduce((sum, missed) => sum + missed, 0) / missedFrameSamples.length * 100 : 0,
    drawCalls: framesSinceSnapshot ? renderer.info.render.calls / framesSinceSnapshot : lastDrawCalls,
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    estimatedResourceMiB: (targetBytes + knownBytes) / 1_048_576,
    cpuUpdateP95Ms: percentile(updateSamples, 0.95),
    cpuRenderP95Ms: percentile(renderSamples, 0.95),
    gpuP95Ms: gpuSamples.length ? percentile(gpuSamples, 0.95) : null,
    gpuTimerSupported: Boolean(timerExtension),
    samples: elapsedFrames.length,
  }
  window.__portfolioPerf = snapshot
  lastDrawCalls = renderer.info.render.calls
  framesSinceSnapshot = 0
  renderer.info.reset()
  if (gl.isContextLost()) return
}

export function uninstallRenderDiagnostics() {
  if (renderer && originalRender) {
    renderer.render = originalRender
    renderer.info.autoReset = previousAutoReset
    const gl = renderer.getContext() as WebGL2RenderingContext
    pendingQueries.forEach(({ query }) => gl.deleteQuery(query))
  }
  renderer = null
  originalRender = null
  activeQuery = null
  timerExtension = null
  pendingQueries.length = 0
  gpuFrameTotals.clear()
  frameOpen = false
  frameUpdateMs = 0
  frameRenderMs = 0
  if (typeof window !== 'undefined') delete window.__portfolioPerf
}
