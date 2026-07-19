# Stronger Door Reflections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the gallery doors cast stronger, recognizable, softly blurred reflections across the existing black floor.

**Architecture:** Keep the existing `MeshReflectorMaterial` and tune only its surface and reflection parameters. Add a focused source-level visual contract test following the repository's existing component-test pattern, then verify the perceptual result in rendered desktop and narrow viewports.

**Tech Stack:** React 19, React Three Fiber, Drei `MeshReflectorMaterial`, Three.js, Bun test runner, Vite

## Global Constraints

- Preserve the scene composition, door materials, lighting, camera behavior, interactions, and black environment.
- The reflection must remain blurred and atmospheric, not sharp or mirror-like.
- Do not add reflection geometry, post-processing effects, or dependencies.
- Do not modify the user's existing `CameraRig.tsx` or `CameraRig.test.ts` worktree changes.

---

### Task 1: Tune the Reflective Floor

**Files:**
- Create: `src/components/Floor.test.ts`
- Modify: `src/components/Floor.tsx`

**Interfaces:**
- Consumes: Drei's existing `MeshReflectorMaterial` JSX component.
- Produces: The unchanged `Floor(): JSX.Element` component with a stronger soft-reflection material configuration.

- [ ] **Step 1: Write the failing visual-contract test**

```ts
import { describe, expect, test } from 'bun:test'

const floorSource = await Bun.file(new URL('./Floor.tsx', import.meta.url)).text()

describe('Floor reflection', () => {
  test('uses a brighter polished surface with a strong blurred reflection', () => {
    expect(floorSource).toContain('blur={[220, 80]}')
    expect(floorSource).toContain('mixStrength={75}')
    expect(floorSource).toContain('roughness={0.72}')
    expect(floorSource).toContain('color="#101010"')
    expect(floorSource).toContain('mirror={0.9}')
  })
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `rtk test bun test src/components/Floor.test.ts`

Expected: FAIL because `Floor.tsx` still contains the original reflection values.

- [ ] **Step 3: Apply the minimal floor-material tuning**

Update the `MeshReflectorMaterial` properties in `src/components/Floor.tsx` to:

```tsx
<MeshReflectorMaterial
  blur={[220, 80]}
  resolution={1024}
  mixBlur={1}
  mixStrength={75}
  roughness={0.72}
  depthScale={1.2}
  minDepthThreshold={0.4}
  maxDepthThreshold={1.4}
  color="#101010"
  metalness={0.6}
  mirror={0.9}
/>
```

- [ ] **Step 4: Run focused and full automated verification**

Run: `rtk test bun test src/components/Floor.test.ts`

Expected: PASS.

Run: `rtk test bun test`

Expected: all tests pass.

Run: `rtk npm run build`

Expected: TypeScript and Vite build complete without errors.

- [ ] **Step 5: Verify rendered desktop and narrow scenes**

Run: `rtk npm run dev -- --host 127.0.0.1`

At a representative desktop viewport, confirm that each colored door casts a readable vertical reflection with softened edges and gradual falloff, the floor remains black, and the reflected name stays subordinate to the primary text. At a viewport no wider than 640px, confirm the stronger floor treatment does not obscure the doors or central name.

If the rendered result is too sharp, increase both blur values proportionally while retaining their approximate 2.75:1 ratio. If it is still too faint, raise `mixStrength` in increments of 5 without raising `mirror` above `0.95`. Update the visual-contract test to match the final visually verified values.

- [ ] **Step 6: Commit the focused implementation**

```bash
rtk git add src/components/Floor.tsx src/components/Floor.test.ts
rtk git commit -m "feat: strengthen blurred door reflections"
```
