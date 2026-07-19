# Open Door Frames — Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Simplify every project doorway so only its physical frame and warm interior glow
remain visible. Remove the swung-open door slab, its handle, and the project
title/subheadline displayed beside the doorway.

## Component changes

Update `src/components/Door.tsx` only:

- Keep the two vertical frame bars and top frame bar unchanged.
- Keep the emissive plane and point light that create the interior glow.
- Keep existing hover, selection, cursor, and click behavior. The glow plane
  remains the doorway's large pointer target.
- Remove the group containing the door slab and handle.
- Remove the group containing the project title and subheadline.
- Remove imports and constants used only by the labels.

No layout, camera, project data, lighting, or floor changes are included.

## Verification

- Add a focused source-level regression test that confirms the door component no
  longer renders label or slab geometry while retaining frame and glow geometry.
- Run the project test suite and production build.
- Visually verify that every doorway is an open glowing frame, without a slab,
  handle, title, or subheadline, and that hover/click interaction still works.
