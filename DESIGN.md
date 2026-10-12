# Design System: Cinematic Liquid Glass

This file is the visual source of truth for every new interface, screen, and component in this project. Read it before designing or implementing UI. Preserve the system's atmosphere and interaction language while adapting the composition to the component's job. Do not copy the floating navbar mechanically into every surface.

## 1. Design Intent

The interface should feel like a dark gallery after hours: quiet, dimensional, reflective, and deliberate. Functional UI appears as precision-cut glass floating above a near-black environment. Warm light and restrained chroma guide attention. Motion gives materials weight; it must never feel like a generic SaaS dashboard or a collection of unrelated effects.

- **Density:** 4/10 — airy by default, compact only where the information requires it.
- **Variance:** 7/10 — asymmetry and negative space are encouraged, but alignment remains disciplined.
- **Motion:** 7/10 — tactile micro-interactions are constant; cinematic effects are reserved for meaningful state changes.
- **Dimensionality:** Layered 2D is the default. 3D is an optional storytelling layer, not a requirement for new components.
- **Emotional tone:** Mysterious, crafted, calm, technically precise, and quietly warm.

## 2. Non-Negotiable Rules for Generated Components

Every new component must:

1. Use semantic tokens from this document instead of inventing a new palette, radius, shadow, or timing scale.
2. Work as ordinary DOM/CSS UI unless spatial storytelling materially benefits from WebGL.
3. Include hover, pressed, focus-visible, selected, disabled, and reduced-motion behavior when those states apply.
4. Animate only `transform`, `opacity`, filter parameters used intentionally, or shader/material properties. Avoid layout animation through `top`, `left`, `width`, or `height`.
5. Meet a 44px minimum interactive target and remain keyboard-operable.
6. Use glass selectively. A glass component needs something visually meaningful behind it; otherwise use a quiet opaque surface.
7. Preserve negative space. Do not solve hierarchy by wrapping everything in cards.
8. Use one dominant material and one dominant motion idea per component.

## 3. Color System

### Core neutrals

- **Void Canvas — `#050505`:** Default page and scene background. Use instead of visible pure black.
- **Deep Stage — `#0A0A0B`:** Secondary background and large section differentiation.
- **Raised Charcoal — `#111113`:** Opaque panels, fallbacks, menus, and surfaces without useful content behind them.
- **Glass Tint — `rgb(18 18 18 / 34%)`:** Default liquid-glass fill over imagery or animated scenes.
- **Glass Dense — `rgb(20 20 20 / 72%)`:** Glass used above visually busy content or where text needs stronger contrast.
- **Warm White — `#F7F4EE`:** Primary text and high-emphasis icons.
- **Selector Ivory — `#F7EAD7`:** Selected pills and materialized active states.
- **Secondary Text — `rgb(255 255 255 / 62%)`:** Supporting copy and navigation at rest.
- **Muted Text — `rgb(255 255 255 / 42%)`:** Metadata, hints, inactive labels, and captions.
- **Disabled Ink — `rgb(255 255 255 / 26%)`:** Disabled content only.

### Structural colors

- **Whisper Border — `rgb(255 255 255 / 12%)`:** Default 1px edge.
- **Lit Edge — `rgb(255 255 255 / 28%)`:** Focused or strongly illuminated glass edge.
- **Inner Highlight — `rgb(255 255 255 / 72%)`:** Small directional inset reflection; never use as a full border.
- **Inner Shade — `rgb(0 0 0 / 70%)`:** Lower-depth inset shading.
- **Ambient Shadow — `rgb(0 0 0 / 24%)`:** External depth shadow.

### Accent

- **Doorlight Amber — `#E8A33D`:** The single system accent for focus, active structure, progress, and primary calls to action.
- **Amber Deep — `#5A3308`:** Dark text or focus detail shown on Selector Ivory or amber surfaces.

Use Doorlight Amber sparingly. It should occupy less than 10% of any viewport. Product/project colors may appear inside content artwork, visualizations, or spatial rooms, but must not become competing UI accents.

Pure `#000000` is allowed only as an invisible technical contrast canvas inside a gooey filter with `mix-blend-mode: lighten`. It must never appear as a visible authored surface.

## 4. Material System

### 4.1 Liquid glass

Liquid glass is the signature interactive material. Build it from several restrained layers:

- Fill: `rgb(18 18 18 / 34%)`.
- Backdrop: `blur(12px) saturate(155%)`.
- Optional displacement: subtle SVG displacement or refraction; never distort text.
- Outer edge: 1px Whisper Border.
- Top-left internal reflection: 1–2px Inner Highlight with negative spread.
- Bottom/right internal reflection: lower-opacity white and dark inset shading.
- External depth: `0 8px 26px rgb(0 0 0 / 24%)`.
- Surface sheen: one restrained radial highlight near the top-left plus a transparent vertical fade.

Glass must remain readable without `backdrop-filter`. Provide a Raised Charcoal fallback around 92% opacity. Do not combine glass with a neon glow, thick outline, or multiple colored gradients.

### 4.2 Solid corridor floor

The home corridor uses rough, dark stone with fine grain and restrained joints.

- High roughness and very low metalness keep the floor solid.
- Doorways cast short, soft pools of colored light.
- Do not mirror doorway artwork or typography on the floor.
- Recessed portal worlds, substantial frames, side walls, and ceiling ribs establish depth.

### 4.3 Warm active material

Use Selector Ivory for the solid active state. Text on it uses `#16120D` or Amber Deep. The active material can emerge from liquid particles or a scale/opacity materialization, but its settled state must be opaque, clean-edged, and readable.

### 4.4 Project chroma

Saturated project colors live inside framed content: recessed portal worlds, thumbnails, media, or charts. Surround them with neutral UI. Do not turn project colors into page-wide gradients or glowing button systems.

## 5. Shapes and Corner Language

Use a small, intentional radius family:

- **Micro — 4px:** Tiny tags, code tokens, miniature status marks.
- **Control — 10px:** Inputs, compact buttons, menus, and tooltips.
- **Soft — 14px:** Standard buttons, media, and small panels.
- **Panel — 22px:** Dialogs, sheets, significant containers.
- **Gallery — 30px:** Hero media or rare statement surfaces.
- **Capsule — 999px:** Segmented controls, navigation, badges, toggles, and selector pills.

Do not apply the largest radius everywhere. A component should use at most two radius sizes. Structural frames, dividers, and 3D doorways may remain sharp or use 2–6px radii to contrast the glass.

Preferred silhouettes are elongated capsules, clean rectangles, offset frames, vertical portals, and cropped planes. Avoid bubbly collections of identical rounded cards.

## 6. Borders, Dividers, and Shadows

### Borders

- Default border: `1px solid rgb(255 255 255 / 12%)`.
- Hover border: increase to 18–22% white; do not change thickness.
- Focus-visible: `2px solid rgb(255 255 255 / 88%)` or Doorlight Amber when it improves contrast.
- Borders on warm active surfaces use `rgb(90 51 8 / 28%)`.
- Never use thick white outlines as decoration.

### Dividers

Prefer spacing first. When a divider is needed, use a 1px line that fades toward one or both ends. In dense data views, border-top dividers are preferred over individual cards.

### Shadows

- Small control: `0 4px 14px rgb(0 0 0 / 18%)`.
- Floating control: `0 8px 26px rgb(0 0 0 / 24%)`.
- Modal/sheet: `0 24px 80px rgb(0 0 0 / 48%)`.
- Glass depth comes mainly from inset reflections, not a large outer glow.
- No neon shadows, colored bloom around text, or generic blue/purple glows.

## 7. Spacing System

Use a 4px base rhythm.

| Token | Value | Typical use |
| --- | ---: | --- |
| `space-1` | 4px | Optical nudge, tight icon gap |
| `space-2` | 8px | Compact control gap |
| `space-3` | 12px | Button padding, label gap |
| `space-4` | 16px | Standard internal gap |
| `space-5` | 24px | Panel padding, grouped fields |
| `space-6` | 32px | Component separation |
| `space-7` | 48px | Content-block separation |
| `space-8` | 64px | Mobile section spacing |
| `space-9` | 96px | Desktop section spacing |
| `space-10` | 128px | Major cinematic transition |

Rules:

- Compact controls use 8–12px internal gaps.
- Standard components use 16–24px internal padding.
- Panels use 24px on mobile and 32–48px on larger screens.
- Section rhythm uses `clamp(4rem, 9vw, 8rem)`.
- Do not introduce arbitrary spacing values unless required for optical alignment.
- Repetition must be consistent: the same relationship uses the same token.

## 8. Typography

### Font families

- **Primary sans:** `"Helvetica Neue", Helvetica, Arial, sans-serif` to match the current project. If the project intentionally adopts a bundled premium family, use Satoshi consistently rather than mixing families.
- **Monospace:** `ui-monospace, SFMono-Regular, Menlo, monospace` for indices, disciplines, statuses, timestamps, and technical metadata.
- **Optional editorial accent:** Instrument Serif only for rare narrative copy. Do not introduce it for software controls or data UI.
- **Banned:** Inter, generic decorative serifs, and mixing more than two visible font families in one view.

### Type scale

- Display XL: `clamp(3.5rem, 9vw, 8rem)`, 0.9–0.98 line-height, weight 700–800, tracking `-0.04em`.
- Display: `clamp(2.5rem, 6vw, 5rem)`, 0.95–1 line-height, weight 650–800, tracking `-0.035em`.
- Heading 1: `clamp(2rem, 4vw, 3.5rem)`, 1.02 line-height, weight 650–750.
- Heading 2: `clamp(1.5rem, 2.5vw, 2.25rem)`, 1.12 line-height, weight 600–700.
- Body large: `1.125rem`, 1.55 line-height.
- Body: `1rem`, 1.6 line-height.
- Small: `0.8125rem`, 1.45 line-height.
- Metadata: `0.6875–0.75rem`, uppercase monospace, tracking `0.08em`.

Body copy should not exceed 65 characters per line. Use weight, space, and opacity for hierarchy before making text dramatically larger. Avoid gradient-filled headlines and long centered paragraphs.

## 9. Layout and Composition

- Use CSS Grid for page composition and Flexbox for one-dimensional component alignment.
- Maximum content width: 1440px with responsive gutters `clamp(1rem, 4vw, 4rem)`.
- Reading width: 60–65ch.
- Desktop grids may use 12 columns; common spans are 7/5, 8/4, and asymmetric 5/7.
- Prefer left-aligned or offset hero compositions. A centered composition is acceptable only when a spatial scene already provides strong asymmetry, as on the current home experience.
- Avoid generic three-equal-card feature rows. Use staggered columns, editorial lists, framed media, split layouts, or one dominant item with supporting items.
- Full-height sections use `min-height: 100dvh`, never a fixed `100vh`.
- Never overlap functional text and imagery. Decorative layers may sit behind content when contrast remains stable.
- Maintain one obvious focal point per viewport.

## 10. Component Recipes

### Buttons

- Minimum height: 44px; primary controls commonly use 48–52px.
- Primary: Selector Ivory or Doorlight Amber fill, dark text, 14px or capsule radius.
- Secondary: dark glass or transparent fill with Whisper Border.
- Ghost: no container at rest; a faint glass tint appears on hover.
- Hover: lift 1px or scale to 1.015, increase edge light, 160–220ms.
- Pressed: scale to 0.97–0.985 for 100–160ms.
- Disabled: reduce opacity to 38%; remove lift and material effects.

### Icon buttons

- 44px minimum square target even when the visible glyph is smaller.
- Use simple line or filled icons with consistent 1.5–2px optical weight.
- Tooltip appears after a short delay and fades/scales from 0.98.

### Segmented controls and navigation

- Outer container uses liquid glass and a capsule silhouette.
- Active option becomes a solid Selector Ivory pill with dark text.
- State changes may use the gravity-particle materialization defined in the motion section.
- Inactive labels use Secondary Text; hover raises them toward Warm White.
- The selected pill must settle into a solid shape, not remain a blurred glow.

### Panels and cards

- Use a panel only when grouping or elevation communicates hierarchy.
- Default to Raised Charcoal or dense glass with a 22px radius and 1px Whisper Border.
- Do not nest multiple glass cards inside one another.
- Prefer border-top structure and negative space for lists of similar items.
- A featured item may be larger, more chromatic, or spatially offset; supporting items remain quieter.

### Inputs and forms

- Label above, input below, helper/error copy beneath.
- Height: 48–52px; radius 10–14px.
- Fill: `rgb(255 255 255 / 5%)`; border: Whisper Border.
- Hover: border moves to 18% white.
- Focus: 2px Doorlight Amber or high-contrast white focus ring; never rely on glow alone.
- Error: use a restrained warm red and explicit text, not color alone.
- No floating labels.

### Dialogs and sheets

- Use a dense glass or Raised Charcoal surface, 22px radius, and Modal shadow.
- Backdrop: `rgb(0 0 0 / 56%)` plus 6–10px blur when supported.
- Enter with opacity and a small translate/scale; do not fly across the entire viewport.
- Focus must be trapped and restored on close.

### Menus, popovers, and tooltips

- Prefer Raised Charcoal for small text-heavy overlays; use glass only when the background is calm.
- Radius: 10–14px; padding: 8px around menu items.
- Menu items are at least 40px high, ideally 44px on touch devices.
- Enter in 140–200ms with opacity plus 4–8px directional translation.

### Tags, badges, and status

- Use capsule shapes, 4–8px vertical padding, and monospace for technical status.
- Prefer neutral borders and text. Reserve Doorlight Amber for the single most important live state.
- Status must include readable text, not only a colored dot.

### Tables and dense lists

- Use flat rows with fading dividers, not individual cards.
- Metadata and numbers use monospace.
- Hover may add a 3–5% white surface tint.
- Keep column alignment rigid while allowing the overall composition to remain asymmetric.

### Loading, empty, and error states

- Loading uses layout-matched skeletons with a restrained sheen; no generic circular spinner for full sections.
- Empty states explain what belongs there and offer one clear action.
- Errors appear inline near the source and explain recovery. Never hide failure behind animation.

## 11. Motion Language

Motion should communicate mass, attraction, refraction, or illumination. It must feel physical rather than ornamental.

### Timing tokens

- **Instant:** 100–140ms — press feedback and tiny state acknowledgment.
- **Quick:** 160–220ms — hover, focus, tooltip, icon response.
- **Standard:** 260–360ms — menus, local content replacement, small panel changes.
- **Weighty:** 420–700ms — selector travel, sheet entry, emphasized component transition.
- **Cinematic:** 900–2000ms — particle materialization, scene transition, hero choreography only.

### Easing

- Micro-interactions: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Weighty motion: spring-like easing with approximately stiffness 100 and damping 20.
- Gravity materialization uses the project's `--gravity-ease` linear easing curve.
- Do not use plain linear easing for visible UI motion.

### Micro-interactions

- Every interactive component needs hover, press, and focus-visible feedback.
- Feedback begins within 100ms of input.
- Hover changes at most two properties, usually transform plus color/edge light.
- Press feedback compresses rather than bouncing outward.
- Icons may rotate 4–8 degrees, translate 1–3px, or morph when meaningfully connected to the action.
- Selected text may transition from Warm White to dark ink as the warm selector forms beneath it.
- Lists reveal with 30–60ms stagger, capped at 360ms total; long lists should not cascade every row.
- Ambient loops are rare: allow at most one subtle loop per visual region, lasting 4–8 seconds with minimal displacement. Never make every active component pulse.

### Gravity-particle selector

Use this signature animation for meaningful selection changes, not every click:

- Generate 15 particles around the destination.
- Begin near a 90px radius and converge toward roughly 10px.
- Base duration: 1200ms with up to ±300ms variance.
- Particle size: approximately 20px with small random scale variation.
- Apply `blur(7px) contrast(20)` to the particle group.
- Place the effect over an invisible pure-black contrast canvas extending about 75px beyond the selector.
- Use `mix-blend-mode: lighten` so the black canvas disappears while particles fuse.
- Particles and the destination pill overlap until they form one opaque Selector Ivory shape.
- The final selector must be solid, crisp, and stable at scale 1.
- Restart the burst on every actual selection change; do not replay when the already-selected option is pressed.

### Entrances and page transitions

- Reveal hierarchy in this order: environment, dominant content, supporting copy, controls.
- Prefer opacity plus 8–24px translation or slight scale. Avoid large fly-ins.
- Use cinematic transitions only at route, scene, or major mode boundaries.
- Do not block input longer than necessary for animation.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Remove particles, parallax, 3D camera travel, long staggers, and perpetual loops.
- Show selected materials immediately at opacity 1 and scale 1.
- Preserve color, focus, and state changes with durations near 0.01ms.
- Never remove essential feedback or hide state.

## 12. Responsive Behavior

- Design mobile-first and verify at 375px, 768px, and 1440px widths.
- No horizontal overflow at any viewport.
- Multi-column layouts collapse below 768px unless a compact two-column arrangement remains clearly readable.
- Touch targets remain at least 44px.
- Headlines use `clamp()` and must not create orphaned single words when avoidable.
- Section spacing reduces from 96–128px desktop to 64px mobile.
- Fixed controls respect `env(safe-area-inset-*)`.
- Navigation may remain a compact horizontal capsule when it fits; otherwise use a concise menu rather than squeezing labels.
- Heavy 3D or filter effects should reduce resolution, complexity, or frequency on constrained devices.

## 13. Optional 3D Extension

Use 3D when spatial metaphor, exploration, or project storytelling is the product—not as decoration behind routine forms.

- Materials remain physically restrained: dark metal, soft roughness, blurred reflection, controlled emissive light.
- Doorlight Amber may identify one structural focal point.
- Project rooms may use unique chroma, but surrounding navigation and typography stay neutral.
- Camera movement is damped and intentional. Never create motion sickness through constant orbiting or uncontrolled parallax.
- DOM controls stay accessible above the canvas; core actions must not require precision 3D picking.
- Provide a functional non-WebGL fallback.

## 14. Content and Voice

- Copy is concise, specific, and human.
- Prefer concrete verbs and honest statements.
- Avoid AI marketing clichés such as “elevate,” “seamless,” “unleash,” “revolutionary,” and “next-gen.”
- Avoid filler instructions such as “scroll to explore,” bouncing arrows, or decorative onboarding text.
- Use real project names and meaningful data. Do not invent “Acme,” “John Doe,” fake percentages, or empty vanity metrics.
- One primary call to action per region is usually enough.

## 15. Accessibility and Performance

- Meet WCAG AA contrast for functional text and controls.
- Keep visible focus states; never remove outlines without a stronger replacement.
- Use semantic HTML first. Buttons perform actions; links navigate.
- Communicate selected state with `aria-pressed`, `aria-selected`, or the correct native control semantics.
- Do not encode meaning by color, motion, or position alone.
- Use `aria-live` only for meaningful asynchronous updates, not decorative animation.
- Keep GPU animation to transform and opacity where possible.
- Isolate blur, grain, displacement, and blend-mode effects to the smallest practical region.
- Avoid stacking multiple large backdrop filters.
- Clean up animation timers, observers, WebGL resources, and generated textures.

## 16. Banned Patterns

Never generate:

- Generic purple/blue neon gradients or glowing AI aesthetics.
- Visible pure-black surfaces when Void Canvas will work.
- Inter or more than two visible font families.
- Large gradient-filled headlines.
- Thick decorative borders or neon outer glows.
- A generic three-equal-card feature row.
- Cards nested inside cards inside cards.
- Glass on every surface regardless of context.
- Identical large rounded corners on every object.
- Custom cursors, cursor-following blobs, or interactions that hide the native pointer.
- Motion that delays ordinary tasks, moves layout unexpectedly, or ignores reduced-motion preferences.
- Particle effects on routine buttons, destructive actions, or text entry.
- Overlapping functional text and imagery.
- Emoji as interface decoration.
- Generic placeholder content, fake metrics, or AI copywriting clichés.

## 17. Agent Workflow for a New Component

Before implementing a component, an agent must answer:

1. What is the component's primary job and focal state?
2. Should its dominant material be flat, opaque dark, liquid glass, reflective, warm active, or project chroma?
3. Which existing spacing, radius, border, and color tokens apply?
4. What are its hover, press, focus, selected, disabled, loading, empty, and error states?
5. What is the smallest meaningful motion idea? Is a signature gravity effect justified, or is a quick tactile response enough?
6. What does reduced motion show instead?
7. How does the component behave at 375px, 768px, and 1440px?
8. Can it be used by keyboard and screen-reader users?

Then verify:

- The component looks intentional on Void Canvas and over representative scene content.
- Text remains readable over the chosen material.
- The settled state is visually stable; blur never replaces solidity where solidity is required.
- Motion restarts correctly when state genuinely changes and does not replay unnecessarily.
- No arbitrary color, radius, shadow, spacing, or duration was introduced.
- No horizontal overflow, clipped focus ring, or sub-44px target exists.
- Reduced-motion behavior preserves meaning.

When a requirement conflicts with this file, preserve accessibility and task clarity first, then preserve the material and motion language as closely as the context permits.
