# Preserve the animation quality and rebuild the expensive rendering path

Plan date: 2026-10-14. Audited revision: `b002fa1`.

## Summary

Target **stable 60 FPS on a physical Galaxy A54-class Android phone using Chrome**, at fixed `min(devicePixelRatio, 2)`. Preserve every visible animation, particle count, camera path, duration, easing, lighting effect, blur, and artwork resolution. Do not impose a frame-rate cap on faster displays.

The main recommendation is to **replace the general-purpose portal renderer with a compositor designed for this platform's image-based rooms**. This is the strongest optimization opportunity identified by source inspection; its actual benefit must be measured on-device.

The audit covered scene rendering, animation updates, shaders, assets, About, case studies, scrolling, media, and navigation. Existing validation passes: **51 tests, lint, and production build**. No physical Android device was connected, so there is no new on-device performance baseline yet.

## Findings and previous work

The earlier attempts were `20b5477` and `7d92045`, documented in the [previous audit](performance-audit.md). They addressed progressive loading, WebP transfer size, preload discovery, camera allocations, hidden rendering, and adaptive DPR. Retain the useful changes; do not repeat them as the proposed solution.

| Before: current implementation | After: proposed implementation | Why |
|---|---|---|
| Image-only rooms use `MeshPortalMaterial`, with viewport-sized preview targets and additional blend targets. | Sample artwork directly within doorway geometry; share one transition compositor. | Removes intermediate rendering, framebuffer traffic, and target storage. |
| Adaptive DPR lowers resolution when performance drops. | Fixed highest-quality DPR; monitoring reports performance without changing quality. | Meets the quality constraint and avoids repeated target resizing. |
| Each doorway builds identical frame geometry; the name and doors generate separate studio environments. | Share frame geometry and one environment per renderer. | Removes duplicate setup, GPU resources, and ownership complexity. |
| Settled camera, preview framing, reveal, and light calculations continue each frame. | Recalculate only while their inputs change. | Preserves visible motion while reducing CPU work. |
| Floor shading evaluates six spill fields and six contact-occlusion fields per fragment. | Profile separately; optimize equivalent shader arithmetic and zero-contribution branches. | Addresses a plausible remaining GPU bottleneck without simplifying the floor. |
| Case-study scrolling repeatedly measures section geometry. | Cache section positions, refresh on resize/content changes, and update the active chapter only when it changes. | Reduces main-thread competition during scrolling. |

The spatial About commit restored continuous rendering because its scene remains visible. Keep its animated background. The liquid-glass navbar is currently hidden, so rewriting it is not a priority.

## Implementation

### 1. Establish a trustworthy baseline

- Add an opt-in diagnostics mode recording animation phase, frame intervals, draw calls across **all passes**, target dimensions, estimated resource memory, and CPU update time.
- Capture Chrome performance traces and representative WebGL frames with [Spector.js](https://spector.babylonjs.com/). Use asynchronous [GPU timer queries](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/) when supported; discard disjoint results.
- Record startup, corridor, every project entrance/return, About, scrolling, image switching, and video playback. Use fixed DPR 2 for baseline and candidate.
- Collect Long Animation Frames for attribution, alongside frame timing: its 50 ms reporting threshold alone cannot detect every missed 60 FPS deadline. [Chrome documentation](https://developer.chrome.com/docs/web-platform/long-animation-frames)

### 2. Replace the portal pipeline

Refactor the behavior currently split between [Scene](../src/components/Scene.tsx) and [PortalWorld](../src/components/PortalWorld.tsx):

- Render each opening as ordinary doorway geometry whose fragment shader samples the original artwork using screen-space coordinates. Reuse the current crop, focal-point, pan, glare, reveal, and mipmap-blur equations.
- Preserve depth occlusion, fog behavior, color conversion, tone mapping, filtering, and antialiasing against reference captures.
- At blend zero, render the corridor directly to the canvas, with **no per-door render targets**.
- During entry/return blending, render the corridor into one shared full-resolution target, then combine it with the selected artwork in one fullscreen composite pass. Eliminate the separate artwork render target.
- At blend one, draw only the fullscreen artwork. Reuse the shared transition target across projects.
- Keep one render owner and an explicit internal phase model: corridor, entering, project, returning, profile journey, and profile.
- Preserve existing application callbacks and project data interfaces. Add no public API or backend.

### 3. Remove CPU contention and resource stalls

- Share geometry and environment resources with explicit disposal on renderer teardown.
- Cache viewport-dependent crop calculations and camera-dependent preview projections; stop finite animation calculations once settled.
- Precompile shader variants with `compileAsync` and initialize loaded textures before their first animated use. Schedule preparation so it does not block the introduction. [Three.js renderer APIs](https://threejs.org/docs/pages/WebGLRenderer.html)
- Keep rendering at browser cadence whenever visible stars, sparkles, camera motion, lighting, or transitions change. Use demand rendering only for a fully settled project interior, whose visible background is static; DOM animations and video continue independently.
- Preserve animation state through interruption, resize, and visibility changes. Demand rendering must explicitly invalidate on every relevant change. [R3F guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- Retain current CSS entrances and transitions. Verify compositing with paint/layer inspection; apply temporary layer promotion only where traces demonstrate a benefit. [Browser animation guidance](https://web.dev/articles/animations-guide)
- Cache case-study section measurements and decode the next selected screenshot before swapping it. Keep visible video playback unchanged.

### 4. Use larger architectural changes only when measurements justify them

- **OffscreenCanvas worker:** benchmark after the compositor rewrite only if main-thread rendering remains over **6 ms p95** while GPU time is below **10 ms p95**. Move scene updates/rendering into the worker; keep accessible HTML, media, focus, and navigation on the main thread. Transfer input, resize, visibility, and journey-state messages. Adopt only with visual parity and at least **20% lower p95 frame work**, including communication overhead. Workers cannot directly access the DOM. [Three.js worker guidance](https://threejs.org/manual/pages/offscreencanvas.html)
- **WebGPU:** defer from this implementation. The current custom `onBeforeCompile` shaders and shader materials require a TSL/node-material port, and Three.js explicitly notes that WebGL can still perform better for some scenes. Removing redundant rendering benefits either backend. [Three.js migration guidance](https://threejs.org/manual/pages/webgpurenderer)
- **KTX2/GPU compression:** defer because it introduces another lossy asset conversion. Preserve the current artwork rather than trade image quality for memory savings.

## Acceptance and rollout

- Benchmark production builds on the physical Android baseline at 60 Hz, plus desktop Chrome and physical iPhone Safari regression coverage. Emulation is supplementary.
- Run three repeatable passes and a ten-minute continuous interaction session. Target **under 1% missed presentation deadlines**, frame-interval p95 ≤18.5 ms, and no application-caused stalls ≥50 ms after asset preparation.
- Compare deterministic captures at startup, pan, partial blend, arrival, return, and About. Require SSIM ≥0.995 for scene captures plus frame-by-frame review of sharpness, edges, color, lighting, and motion.
- Exercise all six doors, interrupted journeys, rapid input, Escape, rotation, resize, hidden-tab resume, slow/failed assets, context restoration, case-study scrolling, screenshot switching, and visible video.
- Verify stable resource counts after 30 navigation cycles. Preserve existing reduced-motion accessibility behavior without using it as a performance fallback.
- Add automated journey/compositor regression checks and run the existing tests, lint, and production build. Record device details, traces, visual comparisons, and before/after results in the audit.
- Release the new renderer only after both performance and visual gates pass. If either fails, continue profiling the measured bottleneck; do not compensate by reducing quality.
