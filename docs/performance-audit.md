# Animation performance audit — 2026-10-14

## Status

The direct artwork renderer and shared transition compositor are the default, following the user's explicit request after comparing the renderers. Use `?renderer=legacy` to inspect the previous renderer and `?perf=1` to enable diagnostics. Explicit `?renderer=direct` remains supported. Physical-device performance and visual-acceptance checks in the [implementation plan](animation-performance-plan.md) remain outstanding; changing the default does not establish that they have passed.

No phone was connected (`adb devices -l` returned no devices), and no Chrome Performance trace, Spector capture, or presentation-deadline trace was available. Desktop browser samples below are diagnostic observations, not evidence that the Galaxy A54 target has passed or that a stable 60 FPS gain has been achieved.

## Baseline and comparison method

Before changing the rendering path, I captured the legacy corridor in Chrome as a visual reference. That screenshot was viewed in-session but was not saved as a repository artifact, so there is no persistent image for an SSIM comparison. The previous audit also recorded a two-second legacy sample at DPR 1.5: 32 FPS and a 42 ms maximum frame interval. That was a short localhost observation, not a phone or production benchmark.

After implementing the candidate, I built production once and measured both renderers on the same local production preview, route, desktop browser, DPR 2, and 2645×1474 drawing buffer. The page was opened afresh for each short sample. The browser/GPU model and refresh rate were not recorded, the sample windows were not a controlled repeated benchmark, and the legacy capture call stalled for several minutes before returning. The diagnostics add instrumentation overhead. Treat these results as a retained desktop baseline path and a smoke comparison only.

| Production desktop sample | Legacy renderer | Direct candidate |
| --- | ---: | ---: |
| Frame-interval p95 | 31.80 ms | 9.10 ms |
| Intervals greater than 16.67 ms | 86.3% | 0.0% |
| Instrumented CPU update / render p95 | 0.20 / 1.70 ms | 1.20 / 0.90 ms |
| Async GPU timer p95 per sampled frame | 325.44 ms | 3.33 ms |
| Draw calls per frame | 24 | 18 |
| Canvas / current transition target | 2645×1474 / 2645×1474 | 2645×1474 / 1×1 while settled |
| Estimated known renderer resources | 77.8 MiB | 48.0 MiB |
| Samples | 219 | 360 |

The large legacy GPU p95 is an anomalous, likely cold-start/resource-preparation observation and is not a reliable steady-state comparison. The resource estimate covers registered artwork textures and render targets, not total GPU memory. “Intervals greater than 16.67 ms” is only an interval proxy; it does not count actual missed presentation deadlines. CPU update/render timings cover instrumented callbacks and `renderer.render`, not all main-thread work. GPU timer queries are asynchronous and disjoint samples are discarded. These limitations prevent performance claims from this table.

## Changes implemented

- Added a screen-space artwork shader for the candidate doorway geometry. It uses the existing crop, focal point, pan, glare, reveal, and mipmap blur behavior; the legacy `MeshPortalMaterial` route stays available for visual and timing comparison.
- Added one shared transition compositor. It draws the corridor directly at blend zero, renders to one shared full-resolution target only during partial blends, and draws the fullscreen artwork at blend one. It uses the existing context antialiasing settings and color pipeline.
- Shared doorway/frame geometry and the frame environment, while retaining the name's original dedicated studio-reflection environment and material settings. Added explicit scene resource cleanup and preserved the existing project data and callbacks.
- Reused crop and camera calculations, stopped settled camera and finite reveal calculations, combined equivalent floor-light arithmetic, and kept the existing About particle count and animation active.
- Added an explicit scene phase model and retained continuous browser-cadence rendering wherever the scene visibly animates. Settled project interiors use demand rendering with invalidation on relevant changes; hidden tabs stop rendering. DPR is fixed to `min(devicePixelRatio, 2)` and never adapts down.
- Preinitialized loaded artwork textures and scheduled asynchronous shader preparation after initial assets are ready. Cached case-study section positions, deduplicated active-section updates, and decode selected still images before swapping them; video playback remains unchanged.
- Added opt-in diagnostics for phase, frame intervals, draw calls across render passes, target size, estimated registered resources, CPU update/render, and asynchronous GPU timer queries. The diagnostics report timing and do not change quality.
- The existing reduced-motion path remains in place. Animation content, particle counts, camera route/timing/easing, artwork dimensions, effects, and antialiasing settings were preserved by implementation review and interaction checks.

The optimization work from commits `20b5477` and `7d92045` remains in place where useful: progressive loading, smaller WebP delivery with editable PNG sources, early image/font discovery, scene-ready handoff, camera allocation reduction, and floor noise reuse. The old adaptive DPR policy from `7d92045` was removed to meet the fixed-quality requirement. No new lossy conversion, WebGPU renderer, worker renderer, or frame-rate cap was introduced.

## Validation performed

- `bun test`: 57 tests passed, 0 failed, 2,472 assertions across 17 files.
- `pnpm lint`: passed.
- `pnpm build`: passed (TypeScript and Vite production build). Vite reports large lazy scene chunks; this work did not attempt a risky chunk-boundary rewrite.
- `git diff --check`: passed.
- On the local production preview, the candidate corridor was visually reviewed against the in-session legacy reference. The same six artwork openings, crop/framing, corridor, name, labels, and floor were visible; entry, partial blend, arrival, return, and About were manually checked. This was a visual review only: no saved deterministic capture set, pixel diff, or SSIM measurement exists.
- Exercised candidate entry and return for all six projects; Escape during an entry and after arrival; About open/close; project detail navigation; case-study chapter scrolling; Weft screenshot selection; and ByteForm video playback after scrolling its media into view. The video became unpaused and advanced with `readyState=4` while visible.
- A rapid alternate-door click during an in-flight entry did not demonstrate that the second selection supersedes the first; rapid-input behavior remains an acceptance item.
- A duplicate Three.js color-space shader chunk surfaced during candidate development and was removed. The fresh production candidate rendered after that fix. Development hot-reload logs from before the fix are stale; Three.js still emits its existing deprecated `THREE.Clock` warning.

## Remaining acceptance gates

The user requested making direct the default before these checks were completed. The following acceptance checks remain outstanding:

- Three repeatable production passes on a physical Galaxy A54-class Android phone in Chrome at 60 Hz, plus a ten-minute interaction session. Record device, browser, display refresh, traces, and actual missed presentation deadlines. Meet under 1% missed deadlines, frame-interval p95 ≤18.5 ms, and no application-caused ≥50 ms stalls after asset preparation.
- Repeatable Chrome desktop and physical iPhone Safari regression coverage.
- Deterministic captures for startup, pan, partial blend, arrival, return, and About, with SSIM ≥0.995 and frame-by-frame checks of edges, sharpness, color, lighting, and motion.
- Exercise rotation, resize, hidden-tab resume, slow and failed assets, WebGL context restoration, reduced motion, rapid/interrupted input, all case-study interactions, and visible video. Check resource counts after 30 navigation cycles.
- Run Chrome Performance/LoAF attribution and representative WebGL frame capture. The Long Animation Frames API's 50 ms threshold alone cannot detect every missed 60 FPS deadline, as [Chrome's documentation explains](https://developer.chrome.com/docs/web-platform/long-animation-frames).

An OffscreenCanvas worker remains deferred until the plan's measured gate is reached: main-thread rendering above 6 ms p95 while GPU time is below 10 ms p95, followed by a benchmark showing at least 20% lower p95 frame work including message overhead and visual parity. A worker cannot access the DOM directly ([Three.js worker guide](https://threejs.org/manual/pages/offscreencanvas.html)). WebGPU remains deferred because the current shader customizations need a TSL/node-material port and WebGPU is not an automatic improvement for this scene ([Three.js guidance](https://threejs.org/manual/pages/webgpurenderer)). GPU-compressed artwork remains deferred to avoid a new lossy conversion.

## Official documentation checked

- [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) — `initTexture` and `compileAsync` preparation APIs.
- [React Three Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — demand rendering requires invalidation for imperative changes; shared geometry/materials reduce duplicate resources.
- [Three.js OffscreenCanvas guide](https://threejs.org/manual/pages/offscreencanvas.html) — worker limitations and message-based input/resize handling.
- [Three.js WebGPU guide](https://threejs.org/manual/pages/webgpurenderer) — shader migration considerations and cases where WebGL can perform better.
- [Chrome Long Animation Frames](https://developer.chrome.com/docs/web-platform/long-animation-frames) — 50 ms attribution threshold and its limits for 60 FPS diagnostics.
