# Performance audit — 2026-10-12

## Findings and changes

| Area | Finding | Implemented change |
| --- | --- | --- |
| Artwork transfer | Six PNGs totaled 12,894,020 bytes and loaded together during startup. | Same dimensions, WebP quality 82: 1,098,332 bytes total (91.5% smaller). Original PNGs moved to `assets/worlds` so they remain editable without being shipped. |
| Loading dependencies | One Suspense boundary hid the hero and all doorways until every room texture resolved. | Each room now suspends inside its portal; frames, labels and the hero can mount while artwork loads. |
| Initial requests | Artwork and the name font were discovered after the scene JS initialized. | Preload the nearest two images and name font from HTML, with matching credentials. |
| Scene handoff | `onCreated` hid the HTML introduction as soon as the renderer existed, before scene content appeared. | Signal readiness from the corridor’s first frame, independently of font and artwork boundaries. A `portfolio-scene-ready` performance mark records it; the opening title has a separate 950 ms minimum hold. |
| Text initialization | Font preprocessing did not know the manifesto's characters until its later synchronization pass. | Supply the actual characters to Drei's text preload. |
| GPU load | Six portals render at viewport resolution. Fixed maximum DPR can overload weaker devices. | Monitor frame timing and reduce DPR to 1 when performance declines; restore up to 1.5 when comfortable. After repeated quality changes, stay at 1. |
| Inactive rendering | The scene kept animating underneath About and while the document was hidden. | Stop the WebGL loop in both cases and resume when visible. Clamp camera frame deltas on resumption. |
| Floor shader | Two noise values were recomputed for each of six light pools. | Evaluate each once per fragment before the light loop; the mathematical result is unchanged. Compiler optimization may already eliminate some duplication, so no GPU speedup is claimed from this alone. |
| Camera allocations | Three vectors were allocated each frame during portal entry. | Memoize the doorway normal, threshold and inward direction per placement. |

## Validation and limits

- Production build and lint pass.
- 16 relevant checks pass, covering loading behavior, artwork files and transfer budget, production chunking, door behavior, camera framing and floor behavior.
- Chrome production preview visibly rendered the hero, all six artwork previews, frames and labels. Portal entry, project details, return to corridor, and About opening/closing were exercised successfully.
- A local reload recorded scene readiness at 1,079 ms. This is a localhost sample, not a throttled production benchmark or a measured before/after loading-time comparison.
- A two-second browser sample at DPR 1.5 measured 32 FPS and a 42 ms maximum frame interval. This motivated the adaptive quality thresholds; no cross-device FPS gain is claimed.
- Console inspection caught mismatched preload credentials; these were corrected. An unused worker-font preload was removed. Subsequent console inspection showed the dependency's deprecated Three.Clock warning and an existing About navigation aria-hidden focus warning.
- The current renderer still contains animated stars and portals. Demand rendering would require explicitly scheduling every camera, portal, artwork and particle update. Continuous rendering is retained while the scene is visible.
- The scene bundle is approximately 298 KB gzip, with the React entry approximately 67 KB gzip. The lazy boundary is retained. The prior custom size-based chunk groups caused a production initialization crash and are not reintroduced.
- WebP is lossy. Image dimensions and composition are preserved; original PNGs remain available.
- Two existing full-suite failures previously observed concern stale name-layout and project-description assertions, outside the performance changes.

## References

- [React Three Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Drei MeshPortalMaterial](https://drei.docs.pmnd.rs/portals/mesh-portal-material) — its `resolution` prop controls the SDF mask, not room render resolution. It should not be treated as a GPU quality setting when blur is zero.

## Rebuilding artwork

Run `cwebp -q 82 -m 6 assets/worlds/<name>.png -o public/worlds/<name>.webp` after editing an original. Run `bun test src/performance.test.ts` to validate all referenced images and the aggregate budget.

## Staged entrance

The large HTML title holds for 950 ms, then fades into the corridor when its renderer is available. Fonts and images do not gate that handoff. Dark frames hold for 650 ms after the scene appears; door lights then warm up over 1.25 seconds, staggered by 140 ms per doorway. Floor spill, the frame glow and the actual point lights share the same reveal progress. Each loaded room independently fades its artwork in over 800 ms and sharpens over 1.75 seconds. A slow room therefore enters later without hiding its neighbors.

The image softening uses the texture’s existing mipmaps with a single sampling lookup ([GLSL texture bias documentation](https://wikis.khronos.org/opengl/Sampler_%28GLSL%29)). Reduced motion skips the staged movement and sharpening. Selecting a doorway also clears its blur immediately so entering a project is responsive. Timelines pause with the WebGL loop while the scene is hidden.
