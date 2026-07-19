# Project Room Backgrounds — Design

**Date:** 2026-07-19
**Status:** Approved

## Goal

Replace the shared yellow doorway glow with six project-specific room interiors.
Four interiors reproduce the project backgrounds and content from the neighboring
`my-web` project. Two additional interiors use placeholder content and new colors
that follow the same visual language.

## Scope

The scene will contain exactly six open-frame doors, arranged by the existing
alternating layout as three doors on the left and three on the right.

The first four project records will be copied from `my-web`:

1. Omoi — dark warm neutral room
2. GigPilot — cobalt blue room
3. Weft — orange room
4. Ascent — green room

Their names, disciplines, statuses, descriptions, and roles will match the
reference project. The final two records will use clearly identifiable
placeholder names and copy. Their room palettes will be violet and deep red so
they are distinct from the four reference rooms while remaining visually
consistent with them.

## Visual treatment

Each opening will use a generated canvas texture rendered on its existing room
plane. The texture will combine:

- the room's reference linear gradient and base color;
- a soft radial ceiling light from the upper-left;
- inset-style edge shading for depth;
- subtle monochromatic film grain;
- project metadata, name, description, and role arranged to match the hierarchy
  of the reference rooms.

The four reference palettes will preserve their source color stops. The two new
palettes will use the same gradient direction, contrast range, lighting, and
grain density.

Canvas textures keep the room surface inside the WebGL scene, so content remains
aligned, correctly occluded, and stable while the camera moves. Text will be
rendered into the high-resolution texture for a single coherent room surface.

## Interaction and lighting

The existing frame geometry, pointer cursor, hover behavior, selection behavior,
and camera focus movement remain unchanged. The yellow emissive color and yellow
point light will be replaced with each project's palette-derived light color.
Hovering or selecting a door will continue to intensify its room surface and
local light.

The previous open-frame work remains intact. This feature will not restore door
slabs, handles, or exterior project labels.

## Data and component boundaries

Project data will gain the room presentation fields needed by the renderer:
status, discipline, description, role, palette colors, text colors, and light
color. The data module will contain exactly six records.

The door component will derive its texture from the selected project record and
dispose generated textures when they are replaced or unmounted. Texture creation
will be isolated in a small helper so palette and content rendering can be tested
without changing scene or camera code.

No new runtime dependency is required.

## Error handling

Texture generation uses the browser canvas API. If a canvas context cannot be
created, the door will fall back to a solid project base color instead of
breaking the scene. Long project copy will be wrapped and clipped within the
opening bounds.

## Verification

- Add a failing regression test before implementation.
- Verify the data module contains exactly six projects and the four reference
  projects retain their required content and palette values.
- Verify the layout produces three placements on each side.
- Verify the door renderer uses project-derived textures and light colors rather
  than the shared yellow glow.
- Run the focused tests, complete test suite, lint, and production build.
- Inspect the running scene at desktop and narrow viewport sizes, confirming all
  six backgrounds remain legible and correctly aligned during hover, selection,
  and camera movement.

## Out of scope

- Restoring animated door leaves or handles
- Adding modals or destination links
- Changing the camera path, floor, star field, name sculpture, or global scene
  palette
- Copying the reference site's surrounding page layout
