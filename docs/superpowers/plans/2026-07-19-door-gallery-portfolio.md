# Door Gallery Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page 3D portfolio: a reflective walkway lined with open doors (one per project) leading to "I'm / Lex / Pertuz" in extruded white 3D text, against a black starfield.

**Architecture:** React Three Fiber scene inside the existing Vite + React 19 scaffold. Pure-function door layout (`src/scene/layout.ts`, unit-tested with `bun test`) feeds presentational components. Camera focus state lives in `Scene`; a `CameraRig` eases the camera toward the selected door with `maath/easing`. A class error boundary renders a plain HTML fallback if WebGL fails.

**Tech Stack:** Vite 8, React 19, TypeScript, bun, `three`, `@react-three/fiber` v9, `@react-three/drei`, `maath`, `bun:test`.

## Global Constraints

- Package manager is **bun** (`bun add`, `bun run`, `bun test`). Never npm/yarn.
- Spec: `docs/superpowers/specs/2026-07-19-door-gallery-portfolio-design.md`.
- Single page, no router. Black background throughout.
- All assets local (font JSON in `public/fonts`); no runtime network requests.
- Copy is exactly: `I'm` (small), `Lex` (medium), `Pertuz` (large) — three stacked lines, white, subtle extrusion (not flat, not chunky).
- Editing `src/data/projects.ts` must be the only step needed to change project content.
- Motion: damped easing (`maath/easing`), no springs/overshoot; hover states transition smoothly, never snap.
- Verification for visual tasks = `bun run build` passes + browser check of the dev server (`bun run dev`, default http://localhost:5173).

---

### Task 1: Repo init, dependencies, font asset

**Files:**
- Modify: `package.json` (via bun add)
- Create: `public/fonts/helvetiker_bold.typeface.json` (downloaded)
- Delete: `src/assets/react.svg`, `public/vite.svg`, `src/App.css` usage comes later (Task 3)

**Interfaces:**
- Produces: installed packages `three`, `@react-three/fiber`, `@react-three/drei`, `maath`, dev deps `@types/three`, `@types/bun`; font at public path `/fonts/helvetiker_bold.typeface.json`.

- [ ] **Step 1: Initialize git and commit the existing scaffold**

```bash
git init
git add -A
git commit -m "chore: existing vite react scaffold"
```

- [ ] **Step 2: Install dependencies**

```bash
bun add three @react-three/fiber @react-three/drei maath
bun add -d @types/three @types/bun
```

Expected: succeeds; `@react-three/fiber` resolves to v9.x (required for React 19).

- [ ] **Step 3: Download the Text3D font**

```bash
mkdir -p public/fonts
curl -fL -o public/fonts/helvetiker_bold.typeface.json https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json
```

Verify: `head -c 200 public/fonts/helvetiker_bold.typeface.json` shows JSON starting with `{"glyphs"`.

- [ ] **Step 4: Verify build still passes**

Run: `bun run build`
Expected: PASS (tsc + vite build, no errors).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add three/r3f/drei/maath deps and Text3D font"
```

---

### Task 2: Project data + door layout module (TDD)

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/scene/layout.ts`
- Test: `src/scene/layout.test.ts`

**Interfaces:**
- Produces:
  - `interface Project { title: string; subheadline: string; url?: string }`, `const projects: Project[]` (8 entries)
  - `interface DoorPlacement { project: Project; position: [number, number, number]; rotationY: number; focus: [number, number, number] }`
  - `function layoutDoors(projects: Project[]): DoorPlacement[]`

- [ ] **Step 1: Create the data file**

`src/data/projects.ts`:

```ts
export interface Project {
  title: string
  subheadline: string
  url?: string
}

// Edit this file to update the site's content — nothing else needs to change.
export const projects: Project[] = [
  { title: 'Aurora', subheadline: 'Realtime data visualization platform' },
  { title: 'Ledgerline', subheadline: 'Personal finance, beautifully simple' },
  { title: 'Nightwatch', subheadline: 'Uptime monitoring for small teams' },
  { title: 'Papertrail', subheadline: 'Notes that organize themselves' },
  { title: 'Signalbox', subheadline: 'Event streaming made approachable' },
  { title: 'Wayfinder', subheadline: 'Trip planning with friends' },
  { title: 'Forge', subheadline: 'CI pipelines without the YAML' },
  { title: 'Lumen', subheadline: 'A calmer reading experience' },
]
```

- [ ] **Step 2: Write the failing test**

`src/scene/layout.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'
import { projects } from '../data/projects'
import { layoutDoors } from './layout'

describe('layoutDoors', () => {
  const placements = layoutDoors(projects)

  test('one placement per project, order preserved', () => {
    expect(placements.length).toBe(projects.length)
    expect(placements.map((p) => p.project.title)).toEqual(projects.map((p) => p.title))
  })

  test('doors alternate sides: even indices left (x<0), odd right (x>0)', () => {
    for (const [i, p] of placements.entries()) {
      if (i % 2 === 0) expect(p.position[0]).toBeLessThan(0)
      else expect(p.position[0]).toBeGreaterThan(0)
    }
  })

  test('rows recede: z decreases every two doors', () => {
    for (let i = 2; i < placements.length; i++) {
      expect(placements[i].position[2]).toBeLessThan(placements[i - 2].position[2])
    }
  })

  test('doors face the path: outward normal points toward x=0', () => {
    for (const p of placements) {
      const nx = Math.sin(p.rotationY)
      // left door (x<0) must have normal with +x component, right door -x
      if (p.position[0] < 0) expect(nx).toBeGreaterThan(0)
      else expect(nx).toBeLessThan(0)
    }
  })

  test('focus point sits in front of the door at eye height', () => {
    for (const p of placements) {
      const nx = Math.sin(p.rotationY)
      const nz = Math.cos(p.rotationY)
      const dx = p.focus[0] - p.position[0]
      const dz = p.focus[2] - p.position[2]
      expect(dx * nx + dz * nz).toBeGreaterThan(0) // in front, not behind
      expect(p.focus[1]).toBe(1.5)
      // focus is between the door and the path center
      expect(Math.abs(p.focus[0])).toBeLessThan(Math.abs(p.position[0]))
    }
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test src/scene/layout.test.ts`
Expected: FAIL — cannot resolve `./layout`.

- [ ] **Step 4: Implement the layout module**

`src/scene/layout.ts`:

```ts
import type { Project } from '../data/projects'

export interface DoorPlacement {
  project: Project
  position: [number, number, number]
  rotationY: number
  focus: [number, number, number]
}

const SIDE_X = 3.4 // distance of each door row from the path center
const NEAR_Z = 4.5 // z of the doors closest to the viewer
const SPACING = 2.6 // z gap between rows
const INWARD = 0.32 // radians each door tilts toward the viewer
const FOCUS_DIST = 2.6 // how far in front of a door the camera stops
const FOCUS_HEIGHT = 1.5

export function layoutDoors(projects: Project[]): DoorPlacement[] {
  return projects.map((project, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const z = NEAR_Z - row * SPACING
    // -side flips the door's +z normal toward the path; INWARD tilts it toward the camera
    const rotationY = -side * (Math.PI / 2 - INWARD)
    const nx = Math.sin(rotationY)
    const nz = Math.cos(rotationY)
    return {
      project,
      position: [side * SIDE_X, 0, z],
      rotationY,
      focus: [side * SIDE_X + nx * FOCUS_DIST, FOCUS_HEIGHT, z + nz * FOCUS_DIST],
    }
  })
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test src/scene/layout.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Verify typecheck**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data/projects.ts src/scene/layout.ts src/scene/layout.test.ts
git commit -m "feat: project data and door layout module"
```

---

### Task 3: Scene shell — canvas, floor, stars, fallback

**Files:**
- Create: `src/components/Scene.tsx` (partial: no doors/name yet)
- Create: `src/components/Floor.tsx`
- Create: `src/components/StarField.tsx`
- Create: `src/components/SceneBoundary.tsx`
- Modify: `src/App.tsx` (full rewrite)
- Modify: `src/index.css` (full rewrite)
- Modify: `index.html` (title)
- Delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`, `src/assets/hero.png` (unused scaffold assets)

**Interfaces:**
- Consumes: `projects` from Task 2 (fallback list).
- Produces: `<Scene />` (renders the Canvas; Tasks 4–6 add children inside it), `<SceneBoundary>` error boundary.

- [ ] **Step 1: Write the components**

`src/components/Floor.tsx`:

```tsx
import { MeshReflectorMaterial } from '@react-three/drei'

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 2]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={60}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080808"
        metalness={0.6}
        mirror={0.75}
      />
    </mesh>
  )
}
```

`src/components/StarField.tsx`:

```tsx
import { Sparkles, Stars } from '@react-three/drei'

export function StarField() {
  return (
    <group>
      <Stars radius={80} depth={50} count={4000} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles
        count={60}
        scale={[40, 14, 40]}
        size={3}
        speed={0.3}
        opacity={0.6}
        color="#ffffff"
        position={[0, 6, -4]}
      />
    </group>
  )
}
```

`src/components/SceneBoundary.tsx`:

```tsx
import { Component, type ReactNode } from 'react'
import { projects } from '../data/projects'

interface State {
  failed: boolean
}

// Plain-HTML fallback so a WebGL failure never white-screens the site.
export class SceneBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="fallback">
        <h1>
          <span>I'm</span> Lex Pertuz
        </h1>
        <ul>
          {projects.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong> — {p.subheadline}
            </li>
          ))}
        </ul>
      </main>
    )
  }
}
```

`src/components/Scene.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { Floor } from './Floor'
import { StarField } from './StarField'

export function Scene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.7, 9.5], fov: 42 }}>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 34]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 8, 6]} intensity={0.6} />
      <pointLight position={[0, 2.5, -4]} intensity={8} />
      <StarField />
      <Floor />
    </Canvas>
  )
}
```

- [ ] **Step 2: Rewrite the app shell**

`src/App.tsx` (replace entirely):

```tsx
import { Scene } from './components/Scene'
import { SceneBoundary } from './components/SceneBoundary'

export default function App() {
  return (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  )
}
```

`src/index.css` (replace entirely):

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
}

body {
  background: #000;
  color: #fff;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: hidden;
}

canvas {
  display: block;
  touch-action: none;
}

.fallback {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 3rem;
  overflow: auto;
}

.fallback h1 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.fallback h1 span {
  display: block;
  font-size: 0.35em;
  font-weight: 400;
  color: #999;
}

.fallback ul {
  list-style: none;
  display: grid;
  gap: 0.75rem;
  max-width: 40rem;
}

.fallback li {
  color: #999;
}

.fallback strong {
  color: #fff;
  font-weight: 600;
}
```

In `index.html`, set the title and remove the vite icon link:

```html
<title>Lex Pertuz</title>
```

Delete unused scaffold files:

```bash
rm -f src/App.css src/assets/react.svg src/assets/hero.png public/vite.svg
```

Then remove any `import './App.css'` / `import viteLogo` remnants if present in `src/App.tsx` or `src/main.tsx` (the rewritten `App.tsx` above has none; `main.tsx` should only import `./index.css` and `./App`).

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 4: Visual check**

Run: `bun run dev` (background). Open http://localhost:5173 in the browser.
Expected: black scene, twinkling stars, dark reflective floor filling the lower half, no console errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scene shell with starfield, reflective floor, HTML fallback"
```

---

### Task 4: NameText — three-line extruded name

**Files:**
- Create: `src/components/NameText.tsx`
- Modify: `src/components/Scene.tsx` (add `<NameText />`)

**Interfaces:**
- Consumes: font at `/fonts/helvetiker_bold.typeface.json` (Task 1).
- Produces: `<NameText />` — positioned group at path's end (z = −6).

- [ ] **Step 1: Write the component**

`src/components/NameText.tsx`:

```tsx
import { Center, Text3D } from '@react-three/drei'

const FONT = '/fonts/helvetiker_bold.typeface.json'

function Line({ text, size, y }: { text: string; size: number; y: number }) {
  return (
    <Center position={[0, y, 0]}>
      <Text3D
        font={FONT}
        size={size}
        height={0.06}
        bevelEnabled
        bevelSize={size * 0.015}
        bevelThickness={0.015}
        bevelSegments={4}
        curveSegments={10}
      >
        {text}
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.15} />
      </Text3D>
    </Center>
  )
}

export function NameText() {
  return (
    <group position={[0, 0, -6]}>
      <Line text="I'm" size={0.3} y={3.05} />
      <Line text="Lex" size={0.7} y={2.15} />
      <Line text="Pertuz" size={1.1} y={0.85} />
      {/* dedicated light so the white faces read against the black background */}
      <pointLight position={[0, 2, 4]} intensity={14} distance={12} />
    </group>
  )
}
```

- [ ] **Step 2: Add to Scene**

In `src/components/Scene.tsx`, add the import and render it after `<Floor />`:

```tsx
import { NameText } from './NameText'
```

```tsx
      <Floor />
      <NameText />
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 4: Visual check**

Open http://localhost:5173.
Expected: "I'm" (small) / "Lex" (medium) / "Pertuz" (large) stacked centered in the distance, white with visible but subtle depth/bevel (relief, not flat, not blocky), reflected in the floor. Adjust `y` values only if lines overlap.

- [ ] **Step 5: Commit**

```bash
git add src/components/NameText.tsx src/components/Scene.tsx
git commit -m "feat: three-line extruded name at path's end"
```

---

### Task 5: Door component and door rows

**Files:**
- Create: `src/components/Door.tsx`
- Modify: `src/components/Scene.tsx` (render doors from layout; still no selection logic — pass `selected={false}` and a no-op `onSelect`)

**Interfaces:**
- Consumes: `DoorPlacement`, `layoutDoors`, `projects` (Task 2).
- Produces: `Door` component with props `{ placement: DoorPlacement; accent?: boolean; selected: boolean; onSelect: () => void }`. Hover glow is internal; Task 6 wires `selected`/`onSelect` for real.

- [ ] **Step 1: Write the Door component**

`src/components/Door.tsx`:

```tsx
import { Text, useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import type { DoorPlacement } from '../scene/layout'

const FRAME_W = 1.5
const FRAME_H = 2.7
const FRAME_T = 0.09 // frame bar thickness
const FRAME_D = 0.14 // frame depth
const OPENING_W = FRAME_W - FRAME_T * 2
const OPENING_H = FRAME_H - FRAME_T

interface DoorProps {
  placement: DoorPlacement
  accent?: boolean
  selected: boolean
  onSelect: () => void
}

export function Door({ placement, accent = false, selected, onSelect }: DoorProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const glow = useRef<MeshStandardMaterial>(null)
  const light = useRef<PointLight>(null)

  useFrame((_, delta) => {
    const lit = hovered || selected
    if (glow.current) easing.damp(glow.current, 'emissiveIntensity', lit ? 2.4 : 1.2, 0.2, delta)
    if (light.current) easing.damp(light.current, 'intensity', lit ? 3.2 : 1.6, 0.2, delta)
  })

  const frameColor = accent ? '#e8a33d' : '#141414'

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }
  const out = () => setHovered(false)
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect()
  }

  return (
    <group
      position={placement.position}
      rotation-y={placement.rotationY}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      {/* frame: two jambs + header */}
      <mesh position={[-(FRAME_W - FRAME_T) / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_H, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[(FRAME_W - FRAME_T) / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_H, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, FRAME_H - FRAME_T / 2, 0]}>
        <boxGeometry args={[FRAME_W, FRAME_T, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* glowing doorway */}
      <mesh position={[0, OPENING_H / 2, -0.02]}>
        <planeGeometry args={[OPENING_W, OPENING_H]} />
        <meshStandardMaterial ref={glow} color="#1a1206" emissive="#ffb45e" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, OPENING_H / 2, 0.6]} intensity={1.6} distance={5} color="#ffb45e" />

      {/* door panel, hinged on the left jamb, swung open ~68° toward the viewer */}
      <group position={[-OPENING_W / 2, 0, FRAME_D / 2]} rotation-y={-1.2}>
        <mesh position={[OPENING_W / 2, OPENING_H / 2, 0]}>
          <boxGeometry args={[OPENING_W, OPENING_H, 0.05]} />
          <meshStandardMaterial color="#0b0b0b" roughness={0.35} metalness={0.4} />
        </mesh>
        {/* handle */}
        <mesh position={[OPENING_W - 0.12, OPENING_H / 2, 0.05]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#8a8a8a" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* labels beside the doorway */}
      <group position={[FRAME_W / 2 + 0.22, 2.05, 0.02]}>
        <Text fontSize={0.13} anchorX="left" anchorY="top" color="#ffffff" letterSpacing={0.02}>
          {placement.project.title}
        </Text>
        <Text position={[0, -0.2, 0]} fontSize={0.07} anchorX="left" anchorY="top" color="#8f8f8f" maxWidth={1.1}>
          {placement.project.subheadline}
        </Text>
      </group>
    </group>
  )
}
```

- [ ] **Step 2: Render doors in Scene**

In `src/components/Scene.tsx`, add imports and render the doors after `<NameText />` (selection stays inert until Task 6):

```tsx
import { projects } from '../data/projects'
import { layoutDoors } from '../scene/layout'
import { Door } from './Door'

const placements = layoutDoors(projects)
```

```tsx
      <NameText />
      {placements.map((p, i) => (
        <Door
          key={p.project.title}
          placement={p}
          accent={i === placements.length - 1}
          selected={false}
          onSelect={() => {}}
        />
      ))}
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 4: Visual check**

Open http://localhost:5173.
Expected: four doors per side lining the walkway, panels visibly swung open, warm glow spilling from each doorway onto the reflective floor, title + subheadline legible beside each door, farthest door with the subtle amber accent frame, hover brightens a door's glow smoothly and shows a pointer cursor. Name remains visible at the center between the rows.

- [ ] **Step 5: Commit**

```bash
git add src/components/Door.tsx src/components/Scene.tsx
git commit -m "feat: open-door rows with glow and project labels"
```

---

### Task 6: Camera rig — click-to-glide and return

**Files:**
- Create: `src/components/CameraRig.tsx`
- Modify: `src/components/Scene.tsx` (selection state, `onPointerMissed`, wire `selected`/`onSelect`, mount rig)

**Interfaces:**
- Consumes: `DoorPlacement` (Task 2), `Door` props (Task 5).
- Produces: `<CameraRig focus={DoorPlacement | null} />`.

- [ ] **Step 1: Write the rig**

`src/components/CameraRig.tsx`:

```tsx
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef } from 'react'
import { Vector3 } from 'three'
import type { DoorPlacement } from '../scene/layout'

const HOME_POS = new Vector3(0, 1.7, 9.5)
const HOME_LOOK = new Vector3(0, 1.4, -6)

const targetPos = new Vector3()
const targetLook = new Vector3()

export function CameraRig({ focus }: { focus: DoorPlacement | null }) {
  const look = useRef(HOME_LOOK.clone())

  useFrame((state, delta) => {
    if (focus) {
      targetPos.set(...focus.focus)
      targetLook.set(focus.position[0], 1.4, focus.position[2])
    } else {
      // subtle pointer parallax at home — small and slow, never distracting
      targetPos.set(HOME_POS.x + state.pointer.x * 0.5, HOME_POS.y + state.pointer.y * 0.25, HOME_POS.z)
      targetLook.copy(HOME_LOOK)
    }
    easing.damp3(state.camera.position, targetPos, 0.45, delta)
    easing.damp3(look.current, targetLook, 0.45, delta)
    state.camera.lookAt(look.current)
  })

  return null
}
```

- [ ] **Step 2: Wire selection in Scene**

`src/components/Scene.tsx` (final form):

```tsx
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { projects } from '../data/projects'
import { layoutDoors } from '../scene/layout'
import { CameraRig } from './CameraRig'
import { Door } from './Door'
import { Floor } from './Floor'
import { NameText } from './NameText'
import { StarField } from './StarField'

const placements = layoutDoors(projects)

export function Scene() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.7, 9.5], fov: 42 }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 34]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 8, 6]} intensity={0.6} />
      <pointLight position={[0, 2.5, -4]} intensity={8} />
      <StarField />
      <Floor />
      <NameText />
      {placements.map((p, i) => (
        <Door
          key={p.project.title}
          placement={p}
          accent={i === placements.length - 1}
          selected={selected === i}
          onSelect={() => setSelected(i)}
        />
      ))}
      <CameraRig focus={selected === null ? null : placements[selected]} />
    </Canvas>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS.

- [ ] **Step 4: Visual check**

Open http://localhost:5173.
Expected: clicking a door glides the camera smoothly to face it (door + labels fill the view, glow held bright); clicking another door glides there; clicking empty space (floor/sky) returns to the home view. Moving the mouse at home view produces a barely-noticeable parallax. No overshoot or snapping anywhere.

- [ ] **Step 5: Commit**

```bash
git add src/components/CameraRig.tsx src/components/Scene.tsx
git commit -m "feat: click-to-glide camera with home return and pointer parallax"
```

---

### Task 7: Final verification and polish pass

**Files:**
- Modify: only if a check below fails (tuning constants in `Door.tsx`, `NameText.tsx`, `layout.ts`, `Scene.tsx`).

**Interfaces:** none new.

- [ ] **Step 1: Full test + build**

```bash
bun test
bun run build
bun run lint
```

Expected: all PASS.

- [ ] **Step 2: Browser walkthrough against the spec**

With `bun run dev` running, verify each spec point:

1. Black space background with twinkling stars and occasional brighter sparkles.
2. Reflective floor mirrors doors and name.
3. Name: `I'm` < `Lex` < `Pertuz`, white, subtle relief, reflected.
4. Doors read as *open* doors (panel visibly swung), warm glow, labels legible.
5. Doors line both sides of the path converging on the name.
6. Hover glow smooth; click glides; empty-space click returns.
7. Narrow viewport (~390px wide, responsive dev tools): scene still frames the path and name acceptably; nothing clipped in a way that breaks the composition. If the name is cropped, reduce `fov`-driven crop by raising camera z from 9.5 to ~11 at small aspect (only if needed — simplest acceptable fix: in `Scene.tsx`, compute `const isNarrow = window.matchMedia('(max-width: 640px)').matches` at module level and use `camera={{ position: [0, 1.7, isNarrow ? 12 : 9.5], fov: isNarrow ? 50 : 42 }}`).
8. Console free of errors/warnings from three/r3f.

- [ ] **Step 3: Fix anything that failed, re-verify**

Tune only the named constants (positions, intensities, sizes). Re-run Step 1 + Step 2 after changes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: final tuning pass against spec"
```
