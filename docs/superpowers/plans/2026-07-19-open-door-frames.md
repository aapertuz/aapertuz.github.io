# Open Door Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render each portfolio doorway as an open glowing frame without a door slab, handle, or adjacent project labels.

**Architecture:** Keep `Door` as the interactive scene component and remove only the two obsolete JSX groups. Add a focused Bun source-regression test because mounting React Three Fiber components outside a Canvas would require a substantial test harness for this small geometry-only change.

**Tech Stack:** React 19, TypeScript 6, React Three Fiber, Drei, Three.js, Bun test

## Global Constraints

- Preserve the two vertical frame bars and top frame bar unchanged.
- Preserve the emissive opening plane, point light, hover/selection glow, pointer cursor, and click behavior.
- Remove the swung-open slab, handle, title, and subheadline.
- Do not change layout, camera, project data, scene lighting, or floor rendering.
- Do not commit documentation or implementation during this task unless the user asks later.

---

### Task 1: Simplify the Door Visuals

**Files:**
- Create: `src/components/Door.test.ts`
- Modify: `src/components/Door.tsx`

**Interfaces:**
- Consumes: existing `DoorProps` and `DoorPlacement` without changes.
- Produces: the existing `Door(props: DoorProps): JSX.Element` behavior with simplified geometry.

- [ ] **Step 1: Write the failing source-regression test**

Create `src/components/Door.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'

const source = await Bun.file(new URL('./Door.tsx', import.meta.url)).text()

describe('Door visuals', () => {
  test('renders an open glowing frame without a slab, handle, or labels', () => {
    expect(source).toContain('<planeGeometry args={[OPENING_W, OPENING_H]} />')
    expect(source).toContain('<pointLight')
    expect(source.match(/<boxGeometry/g)).toHaveLength(3)
    expect(source).not.toContain('<Text')
    expect(source).not.toContain('<sphereGeometry')
    expect(source).not.toContain('rotation-y={-1.2}')
  })
})
```

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
rtk test bun test src/components/Door.test.ts
```

Expected: FAIL because the current component has four `boxGeometry` nodes and still contains `Text`, `sphereGeometry`, and the rotated slab group.

- [ ] **Step 3: Remove the obsolete geometry and label JSX**

In `src/components/Door.tsx`, change the Drei import to:

```ts
import { useCursor } from '@react-three/drei'
```

Delete:

```ts
const LABEL_FONT = '/fonts/inter-medium.woff'
```

Delete the complete slab/handle group:

```tsx
<group position={[-OPENING_W / 2, 0, FRAME_D / 2]} rotation-y={-1.2}>
  <mesh position={[OPENING_W / 2, OPENING_H / 2, 0]}>
    <boxGeometry args={[OPENING_W, OPENING_H, 0.05]} />
    <meshStandardMaterial color="#0b0b0b" roughness={0.35} metalness={0.4} />
  </mesh>
  <mesh position={[OPENING_W - 0.12, OPENING_H / 2, 0.05]}>
    <sphereGeometry args={[0.03, 12, 12]} />
    <meshStandardMaterial color="#8a8a8a" roughness={0.2} metalness={0.9} />
  </mesh>
</group>
```

Delete the complete title/subheadline group:

```tsx
<group position={[FRAME_W / 2 + 0.22, 2.05, 0.02]}>
  <Text font={LABEL_FONT} fontSize={0.13} anchorX="left" anchorY="top" color="#ffffff" letterSpacing={0.02}>
    {placement.project.title}
  </Text>
  <Text
    font={LABEL_FONT}
    position={[0, -0.2, 0]}
    fontSize={0.07}
    anchorX="left"
    anchorY="top"
    color="#8f8f8f"
    maxWidth={1.1}
  >
    {placement.project.subheadline}
  </Text>
</group>
```

Do not alter the frame meshes, emissive plane, point light, event handlers, or animation logic.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run:

```bash
rtk test bun test src/components/Door.test.ts
```

Expected: 1 test passes.

- [ ] **Step 5: Run full automated verification**

Run:

```bash
rtk test bun test
rtk lint
rtk npm run build
```

Expected: all tests pass, lint reports no errors, and the TypeScript/Vite production build completes successfully.

- [ ] **Step 6: Visually verify the scene**

Run:

```bash
rtk npm run dev -- --host 127.0.0.1
```

Open the local Vite page and confirm every doorway has only three frame bars and the warm interior glow; no slab, handle, title, or subheadline is visible. Hover should intensify the glow, and clicking the opening should still focus the camera.
