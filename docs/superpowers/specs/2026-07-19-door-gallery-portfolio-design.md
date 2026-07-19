# Door Gallery Portfolio — Design

**Date:** 2026-07-19
**Status:** Approved by user (conversation), pending spec review

## Purpose

A single-section 3D portfolio site for Lex Pertuz, based on the pmndrs
`image-gallery` demo (https://github.com/pmndrs/examples/tree/main/demos/image-gallery),
restyled: gallery frames become open doors lining a reflective path that leads
to Lex's name in 3D at the center. Space/starfield background. Sleek, elegant,
dark.

## Stack

- Existing scaffold: Vite 8 + React 19 + TypeScript + bun, react-compiler babel plugin.
- Add: `three`, `@react-three/fiber`, `@react-three/drei`.
- No router, no CMS — single page, single scene.

## Scene layout

- Black background, drei `Stars` + sparse `Sparkles` for occasional brighter twinkles.
- Dark reflective floor (`MeshReflectorMaterial`, as in the reference demo)
  forming a walkway that recedes from the camera.
- Doors line both sides of the walkway, angled slightly inward toward the path,
  perspective converging on the name at the far center.
- Name at the path's end, three stacked lines with increasing size:
  1. `I'm` (small)
  2. `Lex` (medium)
  3. `Pertuz` (large)
  Rendered with drei `Text3D` — extruded ~0.05 units with a slight bevel for
  subtle 3D relief, white material, lit so faces catch light, reflected in the
  floor like everything else. Font JSON served locally from `public/fonts`.

## Doors

- Each door: dark frame + door panel swung open ~65–70° on its hinge, soft warm
  glow emitting from the open doorway.
- Project title + subheadline as small elegant text beside each doorway
  (analogous to the hash labels in the original demo).
- Hover: subtle glow/emissive increase, pointer cursor.
- Click door: camera glides toward it (eased lerp in `useFrame`).
- Click empty space: camera returns to the center view.
- Optionally one accent-colored door (subtle), echoing the orange frame in the
  reference image.

## Content

`src/data/projects.ts` — the only file to edit for content updates:

```ts
interface Project {
  title: string
  subheadline: string
  url?: string
}
```

~8 placeholder entries shipped initially.

## Components

- `Scene` — Canvas, camera rig, lighting, background.
- `Floor` — reflective walkway.
- `StarField` — stars + sparkles.
- `Door` — single door (frame, panel, glow, labels, hover/click).
- `DoorRow` / door layout — positions doors along both sides of the path.
- `NameText` — three-line Text3D name.
- `App` wires it together; camera focus state lives in `Scene` (or small store).

## Motion & polish

- Camera glide: eased damping (e.g. `maath/easing` damp3), no springy overshoot —
  apply emil-design-eng animation philosophy (fast, subtle, interruptible).
- Hover transitions damped, not instant.

## Error handling / resilience

- Scene wrapped so a WebGL failure doesn't white-screen: minimal fallback text
  (name + project list) if Canvas errors.
- Font and assets local — no runtime network dependencies.

## Verification

- `bun run dev`, visual check in browser: layout, reflections, name relief,
  star flashes, hover glow, click glide/return, mobile-width viewport.
- `bun run build` passes (tsc + vite).

## Out of scope

- Real project content (placeholders only).
- Additional sections/pages, CMS, analytics, deployment.
