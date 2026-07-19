# Stronger Door Reflections Design

## Goal

Make the project doors produce more visible reflections on the black floor while retaining the soft, blurred character of polished dark stone shown in the supplied reference.

## Scope

Adjust only the existing reflective floor material in `src/components/Floor.tsx`. Preserve the scene composition, door materials, lighting, camera behavior, interactions, and black environment.

## Approach

Continue using `MeshReflectorMaterial` rather than adding duplicate reflected geometry or a screen-space glow. Tune its blur, roughness, mirror contribution, reflection strength, and floor color together so the reflected door silhouettes remain recognizable without becoming sharp or mirror-like.

The adjustment should favor broad vertical color shapes beneath the doors, with softened edges and a gradual fade into black. The central name reflection may become somewhat stronger as a consequence, but it must remain subordinate to the main name text.

## Verification

- Run the existing automated test suite.
- Render the home scene at a representative desktop viewport and compare it visually with the supplied reference.
- Confirm the doors create clearer, blurred reflections without washing out the floor or introducing sharp mirror detail.
- Check a narrow viewport to ensure the stronger material does not distract from the mobile composition.

## Non-goals

- No new reflection geometry.
- No post-processing effects.
- No changes to camera movement, project layout, door content, or interaction behavior.
