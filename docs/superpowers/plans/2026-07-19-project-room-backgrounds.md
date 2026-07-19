# Project Room Backgrounds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared yellow doorway glow with six textured, project-specific room interiors: four copied from `my-web` and two visually consistent placeholders.

**Architecture:** Expand the existing project records with room content and palette data, then generate one high-resolution `CanvasTexture` per project. `Door` keeps its existing geometry and interactions while consuming the generated texture and palette-derived light color; the existing alternating layout naturally places six records as three doors per side.

**Tech Stack:** React 19, TypeScript 6, React Three Fiber, Three.js `CanvasTexture`, Bun test, Vite

## Global Constraints

- Keep exactly six doors: Omoi, GigPilot, Weft, Ascent, Project Five, and Project Six.
- Arrange the doors through the existing alternating layout so three appear on each side.
- Preserve the reference content and gradient stops for Omoi, GigPilot, Weft, and Ascent.
- Give Project Five a violet palette and Project Six a deep-red palette using the same lighting, shading, and grain treatment.
- Preserve the existing open frames, pointer cursor, hover/selection response, and camera focus movement.
- Do not restore door slabs, handles, or exterior project labels.
- Remove all shared yellow room and light colors.
- Add no runtime dependency.
- Preserve all unrelated user changes already present in the worktree.

---

## File structure

- Modify `src/data/projects.ts` — define the six project records and their room palette/content contract.
- Create `src/data/projects.test.ts` — verify reference copy, project count, palette values, and three-per-side placement.
- Create `src/components/roomTexture.ts` — create/dispose-ready Three.js canvas textures, deterministic grain, wrapped room copy, and the solid-color fallback signal.
- Modify `src/components/Door.tsx` — apply the generated texture and project-derived lighting while preserving current interaction and frame geometry.
- Modify `src/components/Door.test.ts` — guard the native texture integration and removal of the shared yellow glow.

---

### Task 1: Six-project data model and layout

**Files:**
- Create: `src/data/projects.test.ts`
- Modify: `src/data/projects.ts`

**Interfaces:**
- Produces: `RoomPalette` with `base`, `gradient`, `text`, `nameText`, and `light` fields.
- Produces: `Project` with `index`, `status`, `discipline`, `title`, `subheadline`, `description`, `role`, `room`, and optional `url`.
- Consumes: `layoutDoors(projects: Project[]): DoorPlacement[]` without changing its signature.

- [ ] **Step 1: Write the failing data and layout tests**

Create `src/data/projects.test.ts`:

```ts
import { describe, expect, test } from 'bun:test'
import { layoutDoors } from '../scene/layout'
import { projects } from './projects'

describe('project rooms', () => {
  test('contains six rooms arranged three per side', () => {
    expect(projects).toHaveLength(6)

    const placements = layoutDoors(projects)
    expect(placements.filter(({ position }) => position[0] < 0)).toHaveLength(3)
    expect(placements.filter(({ position }) => position[0] > 0)).toHaveLength(3)
  })

  test('preserves the four reference projects and palette stops', () => {
    expect(projects.slice(0, 4).map(({ title }) => title)).toEqual([
      'Omoi',
      'GigPilot',
      'Weft',
      'Ascent',
    ])
    expect(projects[0].description).toStartWith('A memory layer')
    expect(projects[1].description).toStartWith('Finds gigs matched')
    expect(projects[2].description).toStartWith('Professional connection')
    expect(projects[3].description).toStartWith('Capital intelligence')
    expect(projects[0].room.gradient).toEqual(['#262019', '#141310', '#05040300'])
    expect(projects[1].room.gradient).toEqual(['#2036e6', '#1626c9', '#0d1a99'])
    expect(projects[2].room.gradient).toEqual(['#ff9a3d', '#f26a0a', '#b34700'])
    expect(projects[3].room.gradient).toEqual(['#35d17c', '#12a657', '#0a7a3d'])
  })

  test('uses distinct violet and deep-red placeholder palettes', () => {
    expect(projects[4].status).toBe('COMING SOON')
    expect(projects[4].room.gradient).toEqual(['#a978f2', '#7442c8', '#432477'])
    expect(projects[5].status).toBe('COMING SOON')
    expect(projects[5].room.gradient).toEqual(['#e05a64', '#b62d3d', '#681721'])
  })
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `rtk test bun test src/data/projects.test.ts`

Expected: FAIL because the current data has eight records and lacks room fields and reference content.

- [ ] **Step 3: Replace the project contract and records**

Replace `src/data/projects.ts` with:

```ts
export interface RoomPalette {
  base: string
  gradient: [string, string, string]
  text: string
  nameText: string
  light: string
}

export interface Project {
  index: string
  status: string
  discipline: string
  title: string
  subheadline: string
  description: string
  role: string
  room: RoomPalette
  url?: string
}

export const projects: Project[] = [
  {
    index: '01',
    status: 'BUILDING',
    discipline: 'MEMORY',
    title: 'Omoi',
    subheadline: 'Productivity and control over my work',
    description:
      'A memory layer for your AI coding assistant. It remembers the work already done, so you never pay to generate the same answer twice.',
    role: 'Builder',
    room: {
      base: '#17150f',
      gradient: ['#262019', '#141310', '#05040300'],
      text: '#c9c3b2',
      nameText: '#f4efe4',
      light: '#d8c9a8',
    },
  },
  {
    index: '02',
    status: 'SHIPPING',
    discipline: 'WORK',
    title: 'GigPilot',
    subheadline: 'The right work, found for me',
    description:
      'Finds gigs matched to your profile, scores each one honestly, and helps you apply. The hunt runs itself.',
    role: 'Builder',
    room: {
      base: '#1626c9',
      gradient: ['#2036e6', '#1626c9', '#0d1a99'],
      text: '#cdd3ff',
      nameText: '#ffffff',
      light: '#6f82ff',
    },
  },
  {
    index: '03',
    status: 'SHIPPING',
    discipline: 'CONNECTION',
    title: 'Weft',
    subheadline: 'A network built on values, not access',
    description:
      'Professional connection woven on values, not access. Know people worth knowing, without already knowing someone.',
    role: 'Cofounder, COO',
    room: {
      base: '#f26a0a',
      gradient: ['#ff9a3d', '#f26a0a', '#b34700'],
      text: '#ffe4cc',
      nameText: '#ffffff',
      light: '#ffae67',
    },
  },
  {
    index: '04',
    status: 'CLIMBING',
    discipline: 'CAPITAL',
    title: 'Ascent',
    subheadline: 'Funded for merit, not pedigree',
    description:
      'Capital intelligence that scores signal, not pedigree. Your metrics become your last name.',
    role: 'Cofounder',
    room: {
      base: '#12a657',
      gradient: ['#35d17c', '#12a657', '#0a7a3d'],
      text: '#d6ffe7',
      nameText: '#ffffff',
      light: '#6bea9d',
    },
  },
  {
    index: '05',
    status: 'COMING SOON',
    discipline: 'EXPERIMENT',
    title: 'Project Five',
    subheadline: 'A new room is taking shape',
    description: 'An upcoming project. The work is underway; details will appear when it is ready to share.',
    role: 'In progress',
    room: {
      base: '#7442c8',
      gradient: ['#a978f2', '#7442c8', '#432477'],
      text: '#eadfff',
      nameText: '#ffffff',
      light: '#c7a4ff',
    },
  },
  {
    index: '06',
    status: 'COMING SOON',
    discipline: 'EXPERIMENT',
    title: 'Project Six',
    subheadline: 'Another door is being built',
    description: 'An upcoming project. Its shape is still changing, so this room is holding the space for it.',
    role: 'In progress',
    room: {
      base: '#b62d3d',
      gradient: ['#e05a64', '#b62d3d', '#681721'],
      text: '#ffdce0',
      nameText: '#ffffff',
      light: '#ff929a',
    },
  },
]
```

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `rtk test bun test src/data/projects.test.ts`

Expected: 3 tests pass.

- [ ] **Step 5: Commit the data slice**

Run:

```bash
rtk git add src/data/projects.ts src/data/projects.test.ts
rtk git commit -m "feat: define six project rooms"
```

Expected: one commit containing only the project contract, records, and focused tests.

---

### Task 2: Native textured room renderer

**Files:**
- Create: `src/components/roomTexture.ts`
- Modify: `src/components/Door.test.ts`
- Modify: `src/components/Door.tsx`

**Interfaces:**
- Consumes: `Project` and `RoomPalette` from `src/data/projects.ts`.
- Produces: `createRoomTexture(project: Project): CanvasTexture | null`.
- Produces: `wrapRoomText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[]`.
- `Door` consumes the generated texture through `meshStandardMaterial.map` and disposes it on cleanup.

- [ ] **Step 1: Extend the door regression test and add the missing-texture-file assertion**

Replace `src/components/Door.test.ts` with:

```ts
import { describe, expect, test } from 'bun:test'

const doorSource = await Bun.file(new URL('./Door.tsx', import.meta.url)).text()
const textureFile = Bun.file(new URL('./roomTexture.ts', import.meta.url))

describe('Door visuals', () => {
  test('renders an open textured frame without a slab, handle, or labels', () => {
    expect(doorSource).toContain('<planeGeometry args={[OPENING_W, OPENING_H]} />')
    expect(doorSource).toContain('<pointLight')
    expect(doorSource.match(/<boxGeometry/g)).toHaveLength(3)
    expect(doorSource).toContain('createRoomTexture(placement.project)')
    expect(doorSource).toContain('color={placement.project.room.light}')
    expect(doorSource).not.toContain('#f0a24a')
    expect(doorSource).not.toContain('#ffb45e')
    expect(doorSource).not.toContain('<Text')
    expect(doorSource).not.toContain('<sphereGeometry')
    expect(doorSource).not.toContain('rotation-y={-1.2}')
  })

  test('provides a native canvas texture renderer', async () => {
    expect(await textureFile.exists()).toBe(true)
    const source = await textureFile.text()
    expect(source).toContain('new CanvasTexture(canvas)')
    expect(source).toContain('createLinearGradient')
    expect(source).toContain('createRadialGradient')
    expect(source).toContain('getImageData')
    expect(source).toContain('fillText')
  })
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `rtk test bun test src/components/Door.test.ts`

Expected: FAIL because `Door` still uses shared yellow colors, does not create a project texture, and `roomTexture.ts` does not exist.

- [ ] **Step 3: Create the room texture helper**

Create `src/components/roomTexture.ts` with:

```ts
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { Project } from '../data/projects'

const WIDTH = 768
const HEIGHT = 1344
const PAD_X = 92
const TEXT_WIDTH = WIDTH - PAD_X * 2

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function wrapRoomText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = []
  let line = ''

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }

  if (line) lines.push(line)
  return lines
}

function addGrain(context: CanvasRenderingContext2D, seed: number) {
  const image = context.getImageData(0, 0, WIDTH, HEIGHT)
  const random = mulberry32(seed)

  for (let index = 0; index < image.data.length; index += 4) {
    const grain = Math.round((random() - 0.5) * 9)
    image.data[index] = Math.max(0, Math.min(255, image.data[index] + grain))
    image.data[index + 1] = Math.max(0, Math.min(255, image.data[index + 1] + grain))
    image.data[index + 2] = Math.max(0, Math.min(255, image.data[index + 2] + grain))
  }

  context.putImageData(image, 0, 0)
}

function drawCopy(context: CanvasRenderingContext2D, project: Project) {
  context.textBaseline = 'top'
  context.fillStyle = project.room.text
  context.font = '500 27px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.fillText(
    `${project.index} · ${project.discipline} · ${project.status}`,
    PAD_X,
    360,
  )

  context.fillStyle = project.room.nameText
  context.font = '800 92px Arial, Helvetica, sans-serif'
  context.fillText(project.title, PAD_X, 430)

  context.fillStyle = project.room.text
  context.font = 'italic 500 43px Georgia, serif'
  const descriptionLines = wrapRoomText(context, project.description, TEXT_WIDTH).slice(0, 6)
  descriptionLines.forEach((line, index) => {
    context.fillText(line, PAD_X, 570 + index * 58)
  })

  context.font = '500 27px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.fillText(project.role.toUpperCase(), PAD_X, 1030)
}

export function createRoomTexture(project: Project): CanvasTexture | null {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = project.room.base
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, project.room.gradient[0])
  gradient.addColorStop(0.58, project.room.gradient[1])
  gradient.addColorStop(1, project.room.gradient[2])
  context.fillStyle = gradient
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const ceilingLight = context.createRadialGradient(110, 80, 0, 110, 80, 680)
  ceilingLight.addColorStop(0, 'rgba(255,255,255,0.24)')
  ceilingLight.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = ceilingLight
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const edgeShade = context.createLinearGradient(0, 0, WIDTH, 0)
  edgeShade.addColorStop(0, 'rgba(0,0,0,0.28)')
  edgeShade.addColorStop(0.18, 'rgba(0,0,0,0)')
  edgeShade.addColorStop(1, 'rgba(0,0,0,0.12)')
  context.fillStyle = edgeShade
  context.fillRect(0, 0, WIDTH, HEIGHT)

  addGrain(context, Number(project.index))
  drawCopy(context, project)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}
```

- [ ] **Step 4: Integrate the texture and project light into `Door`**

In `src/components/Door.tsx`:

1. Change the React import to include `useEffect` and `useMemo`:

```ts
import { useEffect, useMemo, useRef, useState } from 'react'
```

2. Add the helper import:

```ts
import { createRoomTexture } from './roomTexture'
```

3. Create and clean up the texture immediately after the refs:

```ts
const roomTexture = useMemo(
  () => createRoomTexture(placement.project),
  [placement.project],
)

useEffect(() => () => roomTexture?.dispose(), [roomTexture])
```

4. Reduce the material glow intensities so room colors stay faithful and update the local light intensity:

```ts
if (glow.current) easing.damp(glow.current, 'emissiveIntensity', lit ? 0.34 : 0.12, 0.2, delta)
if (light.current) easing.damp(light.current, 'intensity', lit ? 2.2 : 1.1, 0.2, delta)
```

5. Replace the opening material and light with:

```tsx
<meshStandardMaterial
  ref={glow}
  map={roomTexture ?? undefined}
  color={roomTexture ? '#ffffff' : placement.project.room.base}
  emissive={placement.project.room.light}
  emissiveIntensity={0.12}
  roughness={0.72}
/>
```

```tsx
<pointLight
  ref={light}
  position={[0, OPENING_H / 2, 0.6]}
  intensity={1.1}
  distance={5}
  color={placement.project.room.light}
/>
```

Keep all frame meshes and pointer handlers unchanged.

- [ ] **Step 5: Run the focused tests and confirm GREEN**

Run: `rtk test bun test src/components/Door.test.ts src/data/projects.test.ts`

Expected: 5 tests pass.

- [ ] **Step 6: Run static verification for the renderer slice**

Run:

```bash
rtk lint
rtk npm run build
```

Expected: lint reports no errors and the TypeScript/Vite build exits successfully.

- [ ] **Step 7: Commit the renderer slice**

Run:

```bash
rtk git add src/components/roomTexture.ts src/components/Door.tsx src/components/Door.test.ts
rtk git commit -m "feat: render textured project rooms"
```

Expected: one commit containing only the texture helper and door integration.

---

### Task 3: Browser verification and final regression pass

**Files:**
- Modify only if visual verification reveals a scoped defect in `src/components/roomTexture.ts` or `src/components/Door.tsx`.

**Interfaces:**
- Consumes: completed six-project data, room texture renderer, and unchanged camera interaction.
- Produces: verified desktop and narrow-screen presentation with no shared yellow glow.

- [ ] **Step 1: Start the development server**

Run: `rtk npm run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL and remains running without compile errors.

- [ ] **Step 2: Inspect the desktop scene**

At a viewport near `1440 × 900`, verify:

- six door frames render, with three on each side;
- Omoi, GigPilot, Weft, and Ascent use dark neutral, cobalt, orange, and green respectively;
- Project Five is violet and Project Six is deep red;
- each interior includes grain, upper-left soft light, edge shading, metadata, name, description, and role;
- no doorway uses the previous yellow surface or yellow local light;
- hover increases room/light intensity;
- selecting each doorway moves the camera to it and keeps the texture aligned inside the frame.

- [ ] **Step 3: Inspect the narrow scene**

At a viewport near `390 × 844`, verify all six doors remain reachable, the camera does not clip the frames, and project text stays within the opening.

- [ ] **Step 4: Correct only observed visual defects**

If copy overflows, adjust only `PAD_X`, font sizes, line height, or the `.slice(0, 6)` line cap in `src/components/roomTexture.ts`. If the room surface is too bright, adjust only the two emissive intensity targets in `Door.tsx`. Re-run the focused test after each correction:

Run: `rtk test bun test src/components/Door.test.ts src/data/projects.test.ts`

Expected: 5 tests pass after every correction.

- [ ] **Step 5: Run fresh full verification**

Run:

```bash
rtk test bun test
rtk lint
rtk npm run build
rtk git diff --check
```

Expected: all tests pass, lint has zero errors, production build exits successfully, and the diff contains no whitespace errors.

- [ ] **Step 6: Review the final diff against the approved design**

Run: `rtk git diff -- src/data/projects.ts src/data/projects.test.ts src/components/roomTexture.ts src/components/Door.tsx src/components/Door.test.ts`

Confirm the diff contains only six-project data, texture rendering, palette-derived lighting, and its tests. Confirm existing open-frame geometry and unrelated worktree files are untouched.

- [ ] **Step 7: Commit any visual corrections**

If Step 4 required changes, run:

```bash
rtk git add src/components/roomTexture.ts src/components/Door.tsx
rtk git commit -m "fix: tune project room presentation"
```

If no correction was required, do not create an empty commit.
