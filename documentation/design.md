# Design System — StarDust

> Learning platform · Space exploration · Delegua programming

This document describes the visual language and interaction patterns of StarDust.
It is a product-level guide for the Web App, the Challenge experience, and the
administrative Studio. It records the current implementation baseline and the
guardrails for new UI work.

The system is intentionally dark-first: the interface should feel like a calm
control room in space, while green, yellow, blue, and red communicate progress,
rewards, information, and problems.

Sources:

- Web styling and tokens: `apps/web/tailwind.config.js` and
  `apps/web/src/ui/global/styles/global.css`
- Studio styling and shadcn tokens: `apps/studio/src/ui/global/styles/global.css`
- Product architecture: `documentation/architecture.md` and
  `documentation/modules.md`
- UI structure: `documentation/rules/ui-layer-rules.md`
- Pencil references: `design/stardust.pen`

---

## 1. Product character

StarDust turns learning programming into a journey through space. The visual
system has two jobs:

1. Make the next learning action obvious.
2. Make progress feel tangible without turning the interface into a game HUD.

The space metaphor is expressed through dark canvases, stars, planets, rockets,
orbit-like motion, and glowing accents. It must support comprehension first:
decoration never competes with a lesson, code editor, challenge statement, or
progress metric.

### Principles

- **Learning before spectacle.** Content, instructions, and code are always more
  prominent than animation or ornament.
- **Dark space, bright signal.** Dark neutral surfaces establish hierarchy;
  saturated colors identify actions and meaningful states.
- **Progress is visible.** Completed stars, streaks, XP, coins, tiers, and
  achievements should be easy to scan and emotionally rewarding.
- **One clear next action.** Primary actions use the green accent and should be
  visually distinct from secondary and destructive actions.
- **Context determines density.** The learning journey can breathe; challenge
  and Studio screens may be dense because they support focused work and
  operations.
- **Motion explains change.** Transitions show navigation, unlocking, feedback,
  or continuity. Motion is not required for basic comprehension.
- **Accessible by default.** Color is never the only signal. Keyboard focus,
  readable contrast, labels, status text, and reduced-motion behavior are part
  of the design contract.
- **Portuguese is a first-class language.** User-facing content uses Brazilian
  Portuguese (`pt-BR`) unless a feature explicitly requires another locale.

---

## 2. Product surfaces

### Web App — student experience

The Web App serves the authenticated learning journey and public acquisition
surfaces. It includes:

- Landing page and authentication.
- Space map: planets, stars, locks, and the next available lesson.
- Lessons: story stages, quizzes, answers, feedback, and completion.
- Challenges: discovery, challenge details, solutions, comments, and execution.
- Challenge editor: description and code editor in a focused split layout.
- Playground: free experimentation with Delegua.
- Profile: identity, statistics, streak, achievements, and work history.
- Shop: starcoins, avatars, rockets, and insignias.
- Ranking, notes, manual, conversations, feedback, and notifications.

### Challenge workspace

The challenge route is a focused workspace rather than a standard content page.
It uses a full-height dark shell with:

- A compact top bar for return navigation and challenge context.
- A description panel with tabs, metadata, statement, rules, and actions.
- A code editor surface with toolbar, line numbers, execution controls, and
  output or feedback states.
- An optional challenge-navigation sidebar and filter popover.

### Studio — administrative experience

Studio is an operational admin panel for managing users, achievements, planets,
challenges, challenge sources, shop items, manuals, and feedback reports. It
shares StarDust's dark identity but is more information-dense and less
decorative than the student journey.

Current shell baseline:

- Header: approximately `48px` high, dark zinc surface, bottom border.
- Sidebar: approximately `192px` wide, dark zinc surface, grouped navigation.
- Main area: scrollable content with a rounded top-left edge and right padding.
- Components: existing shadcn/Radix primitives are the default building blocks.

The Web App and Studio may share semantic tokens, but their layout shells and
component implementations remain independent until a shared design-token layer
is introduced.

---

## 3. Tokens

Tokens below reflect the current Web App palette. Use token names in new code
and map them to the local Tailwind or shadcn implementation rather than
introducing arbitrary colors.

### Color palette

#### Neutrals

| Token | Hex | Usage |
| --- | --- | --- |
| `$gray-950` | `#0B0E0F` | Deep canvas, editor and challenge surfaces |
| `$gray-900` | `#141A1B` | Main Web App background, navigation surfaces |
| `$gray-800` | `#1E2626` | Cards, elevated controls, active dark surfaces |
| `$gray-700` | `#303030` | Borders, separators, secondary dark controls |
| `$gray-600` | `#595959` | Muted borders and dividers |
| `$gray-500` | `#868686` | Secondary text and icons |
| `$gray-400` | `#AFB6C2` | Placeholder and quiet text |
| `$gray-300` | `#D3D7E1` | Secondary readable text |
| `$gray-200` | `#EBEBEB` | Body copy on dark surfaces |
| `$gray-100` | `#F2F2F2` | Primary text on dark surfaces |

#### Green — primary action and progress

| Token | Hex | Usage |
| --- | --- | --- |
| `$green-900` | `#07303B` | Green-tinted dark surface |
| `$green-800` | `#027558` | Strong green surface and selected dark state |
| `$green-700` | `#20925D` | Secondary positive emphasis |
| `$green-600` | `#38C76D` | Positive status |
| `$green-500` | `#0FE983` | Primary accent and readable positive text |
| `$green-400` | `#00FF88` | Primary CTA, active navigation, focus, progress glow |
| `$green-300` | `#4AFFAB` | Soft bright accent |
| `$green-200` | `#ADFFD9` | Pale positive text or surface |
| `$green-100` | `#DAFFF0` | Very soft positive surface |

Green is the StarDust action color. It must not be used as decoration on every
element; reserve the brightest values for actions, active states, and progress.

#### Semantic accents

| Semantic role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Reward | `$yellow-400` | `#FFCE31` | Starcoins, streaks, unlocked stars, ranking rewards |
| Reward dark | `$yellow-700` | `#674F00` | Text over yellow or dark reward details |
| Information | `$blue-300` | `#00D1FF` | Informational state, links, editor context |
| Information dark | `$blue-700` | `#022F43` | Blue-tinted dark surface |
| Danger | `$red-700` | `#FF3737` | Errors, destructive actions, blocked progress |
| Danger soft | `$red-300` | `#FF8484` | Secondary danger text or illustration |
| Purple secondary | `$purple-700` | `#514869` | Focus-ring treatment and restrained secondary accent |

Studio currently uses the shadcn zinc palette (`zinc-950`, `zinc-900`,
`zinc-800`, and related values) in its shell. Keep that local mapping stable;
new Studio components should use shadcn semantic variables whenever available.

### Surface hierarchy

From deepest to most prominent:

1. **Canvas:** `$gray-950` or `$gray-900`.
2. **Base surface:** `$gray-900` or `$gray-800`.
3. **Elevated surface:** `$gray-800`, usually with a border.
4. **Active surface:** green-tinted surface such as `$green-900` or a green
   accent with dark text.
5. **Overlay:** dialog, popover, or menu with a clear border and shadow.

Avoid white cards, light SaaS backgrounds, and large saturated backgrounds in
authenticated product screens. Light surfaces may be used only when a feature
has a deliberate content or accessibility reason.

### Typography

#### Web App baseline

- **UI family:** Poppins, loaded through `apps/web/src/constants/fonts.ts`.
- **Code family:** Roboto Mono, used for Delegua and editor content.
- **Fallback:** the browser's system sans-serif or monospace fallback.

| Role | Typical size | Weight | Treatment |
| --- | ---: | ---: | --- |
| Landing hero | `48–72px` | 500 | Large, centered, gradient or green/gray emphasis |
| Page title | `24–36px` | 600–700 | Clear section entry point |
| Section title | `20–32px` | 700 | Often followed by a thin muted divider |
| Card title | `16–20px` | 600–700 | Compact and scannable |
| Body | `14–16px` | 400–600 | Relaxed line height for learning content |
| Supporting text | `12–14px` | 400–500 | Muted neutral color |
| Code | `12–16px` | 400–600 | Roboto Mono; preserve whitespace |

#### Studio baseline

Studio's current CSS contains both `Inter` and `Outfit` declarations, while
some screens import Lucide directly and others use the shared icon wrapper.
This is a known normalization gap. New Studio work should use the existing
shadcn typography contract and avoid adding another font. A future token pass
should choose one sans-serif family and remove the conflicting declaration.

### Shape and spacing

The existing Web App uses compact rounded controls and dark bordered surfaces.
Use this scale as the baseline:

| Token | Value | Usage |
| --- | ---: | --- |
| `$space-1` | `4px` | Icon/text micro-gap |
| `$space-2` | `8px` | Compact control padding |
| `$space-3` | `12px` | Input and card inner spacing |
| `$space-4` | `16px` | Standard gap and section padding |
| `$space-6` | `24px` | Card and page content padding |
| `$space-8` | `32px` | Major section separation |
| `$space-12` | `48px` | Hero and large breathing room |

| Token | Value | Usage |
| --- | ---: | --- |
| `$radius-sm` | `4–6px` | Dense controls, editor details |
| `$radius-md` | `6–8px` | Buttons, inputs, cards in dense views |
| `$radius-lg` | `12px` | Feature cards, challenge cards, popovers |
| `$radius-xl` | `16–20px` | Large sections and animated borders |
| `$radius-full` | `999px` | Badges, counters, circular controls |

Borders should normally be `1px`. Use `2px` only when it communicates an
active, selected, or high-priority state.

### Shadows and glow

StarDust uses restrained elevation. Prefer borders and surface contrast over
large shadows. Glow is reserved for the space metaphor and important feedback:

- Green active/progress glow: soft and local to the active object.
- Yellow star/reward glow: local to stars, coins, streaks, and podium rewards.
- Red error glow: avoid except for a clear destructive or blocked state.
- Animated border effects may be used on featured cards and CTAs, but must not
  make text difficult to read.

---

## 4. Components

### Brand and imagery

- The StarDust logo is the primary brand mark and should retain its aspect ratio.
- The rocket is the compact navigation mark and may represent movement or
  launch, not generic settings.
- Planets represent learning themes; stars represent individual learning
  stages.
- Avatars, rockets, insignias, and achievement artwork are product assets, not
  replacements for interface icons.
- Decorative imagery must have empty alternative text when it does not convey
  information. Meaningful imagery must have a Portuguese accessible name.

### Navigation

#### Web App

- Desktop uses the collapsible `Sidenav` with expanded and compact states.
- Mobile uses `HomeHeader` and a fixed bottom `TabNav`.
- The header surfaces starcoins, streak, account identity, and the achievement
  counter where relevant.
- Active navigation uses the green accent and a clear visual state; do not rely
  only on an icon or color change.
- The challenge route may replace the normal home shell with its dedicated
  workspace shell.

#### Studio

- Navigation is grouped by domain: dashboard, profile, space, challenges,
  shop, manual, and reports.
- Group labels are small and muted; links are compact, readable, and visibly
  active with a dark elevated surface.
- Keep the sidebar operational and scannable. Do not bring animated student-map
  decoration into the admin shell.

### Buttons and links

#### Primary button

- Green accent background, dark text, compact rounded shape.
- Used for the next learning action, sign-in, submit, execute, create, and
  confirm actions.
- Include an icon only when it improves recognition; the label remains the
  primary signal.
- Preserve the existing press feedback (`whileTap` where the component supports
  it) and disabled opacity.

#### Secondary button

- Dark or transparent surface with a neutral border and readable neutral text.
- Used for cancel, navigation, filters, and non-primary alternatives.

#### Destructive button

- Red surface or red border depending on action severity.
- Always states the destructive verb clearly and requires confirmation when the
  action cannot be undone.

#### Text link

- Green or blue accent, no filled background by default.
- Use for contextual navigation, recovery links, and supporting actions.
- Hover and focus must remain visible without shifting layout.

### Inputs and forms

- Inputs are dark or transparent against the surrounding surface.
- Default border is neutral; focus border is green; invalid border and message
  are red.
- Icons belong inside the control only when they clarify the field type.
- Labels are visible for all non-trivial fields. Placeholders are hints, not
  replacements for labels.
- Password visibility, loading, disabled, server error, and validation states
  must be represented explicitly.
- Use the shared Web `Input` component or the Studio shadcn input primitives
  instead of recreating field behavior inside a page.

### Cards and panels

Cards establish grouping on dark surfaces using border, radius, and modest
contrast. A card should answer what it contains and what the user can do next.

Common patterns:

- **Progress card:** title, current state, visual progress, and next action.
- **Metric card:** one important value with a label and optional context.
- **Content card:** readable lesson or challenge content with clear section
  rhythm.
- **Catalog card:** image or icon, name, metadata, price/status, and action.
- **Editor panel:** toolbar, code surface, status/output, and execution action.
- **Admin table card:** title/actions, filters, table, empty/loading/error state,
  and pagination when applicable.

### Badges, counters, and statuses

- Green: completed, active, available, successful.
- Yellow: starcoins, streak, rewards, attention.
- Blue: information, links, editor or documentation context.
- Red: invalid, failed, destructive, locked by an error.
- Neutral gray: unavailable, inactive, secondary metadata.

Badges should be short and compact. Pair them with text or icons when the
meaning is not obvious. A count badge must remain legible at small sizes and
must not be the only indication of an important notification.

### Dialogs and popovers

- Use Radix/shadcn dialog primitives in Studio and the shared Radix dialog in
  Web.
- Dialog title, supporting text, and close action must form one clear header.
- Keep the semantic icon beside the title when an icon is used; do not detach it
  as decoration.
- Destructive confirmations explain impact and provide a safe cancel action.
- Popovers and menus inherit the dark surface hierarchy and close predictably
  on escape or outside interaction.

### Tables and lists

- Use compact rows for operational data and more generous spacing for learning
  content.
- Header, row, hover, selected, loading, empty, and error states are distinct.
- Do not encode meaning only through row color; include text or icon status.
- Long names and code-related content should truncate or wrap intentionally,
  never overflow into adjacent columns.

### Code surfaces

- Use Roboto Mono in the Web App and preserve code indentation and whitespace.
- Keep line numbers, code, toolbar, execution status, and output visually
  separate.
- The execute action uses the primary green signal; errors use red and include
  actionable feedback.
- Editor chrome should be quieter than the code and challenge statement.

---

## 5. Screen patterns

### Public landing page

- Full-width dark background with stars, aurora, or restrained space imagery.
- Sections use a centered content measure and generous vertical rhythm.
- Hero communicates the promise quickly: learn programming by exploring space.
- Green accents identify calls to action and important words.
- Scroll-reveal and background motion are progressive enhancements.

### Authentication

- The current sign-in experience uses a split layout on large screens: form on
  one side and animated space/rocket content on the other.
- On smaller screens, the form is the priority and decorative animation yields
  space.
- Form title, social options, divider, fields, submit action, and account links
  follow a predictable vertical sequence.
- Errors remain adjacent to the field or action that caused them.

### Space map

- The map is a navigable progression, not a dashboard grid.
- Planets group themes; stars enumerate stages.
- Unlocked stars use yellow and glow; locked stars use neutral gray and remain
  visibly unavailable.
- The next available star may use rocket or reveal motion to establish a clear
  continuation point.
- Names and numbers must remain readable independently of artwork.

### Lesson

- Story content uses a calm reading surface and clear narrative progression.
- Quiz stages use one question at a time when possible.
- Selection, checkbox, drag-and-drop, and open-answer states need clear selected,
  correct, incorrect, disabled, and submitted treatments.
- Feedback should explain what happened and make the next action obvious.

### Challenge and playground

- Use the dedicated workspace shell when code and instructions must coexist.
- Description, tabs, metadata, rules, editor, execution, and feedback should
  remain discoverable without competing for the same visual priority.
- Preserve user code while changing layout or navigating between challenge
  sections; destructive navigation requires an explicit warning.

### Profile, shop, and ranking

- Profile prioritizes identity, level, streak, statistics, and achievements.
- Shop cards prioritize the item visual, name, cost, ownership, and purchase or
  equip action.
- Ranking emphasizes position, XP, tier, and reward context without hiding the
  user's own row.
- Yellow is the reward signal; green is completion/action. Do not conflate the
  two.

### Studio CRUD and reports

- Page title and purpose come first, followed by primary action.
- Tables and forms use shadcn/Radix primitives, with explicit loading, empty,
  validation, and error states.
- Filters should be close to the data they affect.
- Confirmation dialogs describe irreversible impact.
- Dense admin layouts should remain calm: no decorative starfield behind data
  tables or editors.

---

## 6. Motion and microinteractions

Motion is implemented with Motion and existing animation widgets where they
already exist.

Use motion for:

- Page and route transitions.
- Landing-page reveal and aurora effects.
- Star unlocking, rocket movement, achievement rescue, and streak feedback.
- Button press feedback and small state transitions.
- Loading transitions that clarify where content will appear.

Rules:

- Keep interaction feedback below the threshold of distraction.
- Do not delay a form, navigation, or code execution result only for animation.
- Use stable layout dimensions to prevent content jumping.
- Provide an equivalent usable experience when `prefers-reduced-motion` is set.
- Never use a glow, shine, or particle effect as the only indication of status.

---

## 7. Responsive behavior

The Web App currently uses these Tailwind breakpoints:

| Breakpoint | Width | Primary behavior |
| --- | ---: | --- |
| `xs` | `440px` | Small phone enhancements |
| `sm` | `640px` | Wide phone/small tablet layout |
| `md` | `768px` | Desktop navigation becomes available |
| `lg` | `1024px` | Split auth and wider content layouts |
| `xl` | `1280px` | Large desktop content measure |

Responsive rules:

- Mobile navigation must remain reachable with one hand and must not cover the
  active form or editor action.
- Desktop side navigation may collapse, but its icon-only state needs accessible
  labels and a clear expand control.
- Two-column layouts stack in content-priority order on narrow screens.
- Code editors may scroll horizontally; surrounding page content should not.
- Touch targets should remain large enough for reliable interaction even when
  visual controls are compact.

---

## 8. Accessibility and state contract

Every interactive component should account for:

- Default/resting state.
- Hover state where applicable.
- Keyboard focus with a visible ring.
- Pressed or selected state.
- Disabled state.
- Loading state.
- Success state.
- Validation or server-error state.
- Empty state.
- Reduced-motion behavior when animated.

Additional rules:

- Do not use color alone to identify completion, errors, locks, or selection.
- Preserve semantic HTML and accessible names for icon-only buttons.
- Dialogs must manage focus and support escape according to their primitive.
- Form errors must be associated with their fields and remain readable.
- Decorative images and animation must not create misleading accessible content.
- Keep `pt-BR` copy concise, direct, and consistent across Web and Studio.

---

## 9. Iconography and assets

The codebase currently has different icon systems per surface:

- **Web App:** the shared `Icon` component delegates to Phosphor icons.
- **Studio:** the shared icon component exists, while some screens currently
  import Lucide icons directly.
- **Pencil references:** contain Lucide, Phosphor, and a small number of other
  icon references.

Rules for new work:

- Use the existing icon wrapper for the surface being changed.
- Do not mix icon families inside one component without a strong reason.
- Do not use emoji as interface icons.
- Prefer icons that already exist in the local icon-name contract.
- Icon-only actions require an accessible label or tooltip.
- Product artwork is not a substitute for a semantic control icon.

This is a known convergence area. A future shared icon policy should choose one
canonical implementation per app and update the wrappers incrementally.

---

## 10. Implementation rules

- Prefer existing shared components before creating a one-off visual primitive.
- Web widgets follow the View + Hook + `index.tsx` entry-point pattern described
  in `documentation/rules/ui-layer-rules.md`.
- Studio uses existing shadcn components before adding new primitives.
- Keep styling close to the owning UI component, but put repeated values in
  Tailwind/shadcn tokens rather than scattered literals.
- UI code may use Core types and the app's REST/RPC edges; it must not import
  server internals or access the database directly.
- User-facing UI changes require browser validation in the appropriate local
  app, in addition to automated tests.
- New states should be designed and tested as part of the component, not added
  as page-specific exceptions.

### Recommended token aliases

When a shared token layer is introduced, prefer semantic names over app-specific
color names:

```css
:root {
  --color-canvas: #0b0e0f;
  --color-surface: #141a1b;
  --color-surface-elevated: #1e2626;
  --color-border: #303030;
  --color-text-primary: #f2f2f2;
  --color-text-secondary: #d3d7e1;
  --color-text-muted: #868686;
  --color-action: #00ff88;
  --color-action-foreground: #07303b;
  --color-reward: #ffce31;
  --color-info: #00d1ff;
  --color-danger: #ff3737;
  --color-focus: #514869;
}
```

The aliases are a design target, not a request to replace the current Tailwind
configuration without a migration plan.

---

## 11. Non-standard — do not use

- White, generic SaaS dashboards for the authenticated Web App.
- Purple as the main brand or page background; StarDust's primary signal is
  green, with purple currently reserved for a secondary focus treatment.
- A new font for an isolated component.
- Emoji or an unapproved icon library as interface controls.
- Decorative motion that delays learning, submission, navigation, or execution.
- Color-only error, lock, completion, or selection states.
- Thick borders, noisy gradients, or excessive neon glow.
- Giant artwork that reduces the readable area of a lesson, challenge, or table.
- Page-level navigation logic inside a presentational View.
- Direct imports from `apps/server` or direct database access from UI code.
- Copy that changes domain vocabulary casually: planet, star, streak, starcoin,
  challenge, lesson, tier, and achievement have distinct meanings.

---

## 12. Known gaps and maintenance

This document intentionally records the current state rather than claiming full
visual convergence.

- Web and Studio do not yet consume one shared token package.
- Studio's font declarations contain an unresolved Inter/Outfit conflict.
- Icon usage is not fully centralized in Studio.
- The Pencil file contains exploratory references from multiple icon and font
  families; it is not, by itself, a source of truth for production tokens.
- Existing screens contain historical one-off Tailwind values. New work should
  follow this document, and refactors should remove those values only when the
  behavior and visual result are understood.

When a design decision changes, update this file and the owning app's tokens or
shared component in the same change whenever practical. If the design and
implementation disagree, document the difference instead of silently creating
another visual convention.
