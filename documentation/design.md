# Design System — StarDust

> Learning platform · Space exploration · Delegua programming

This document describes the visual language and interaction patterns of StarDust.
It is a product-level guide for the Web App, the Challenge experience, and the
administrative Studio. It records the visual direction, implementation baseline,
and reusable token contract for the interface and Monaco editor. Design targets
do not imply that application code already implements them.

The original visual reference is dark-first, but every selectable theme family
has both dark and light variants. The user selects StarDust, Orbit, Sakura, or
Glacial; the current application appearance determines the variant for both UI
and editor. Theme changes preserve clear actions, status meanings, and reading
comfort.

### Theme contract at a glance

| Setting | Values | Responsibility |
| --- | --- | --- |
| Theme family | `stardust`, `orbit`, `sakura`, `glacial` | User's persisted palette choice |
| Resolved appearance | `dark`, `light` | Current application mode |
| Resolved variant | `<family>-<mode>` | Supplies paired UI and Monaco palettes |
| Standard geometry | `8px` radius, `44px` controls | Shared across all variants |

For example, choosing Sakura in light mode resolves to `sakura-light`. Changing
to dark mode resolves to `sakura-dark` without changing the selected family.
There is no independent dark/light choice for the editor. See section 3 for
palette values, reference frames, tokenizer mapping, and remaining validation.

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
orbit-like motion, and restrained color accents. It must support comprehension first:
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

The refined palette preserves the original StarDust identity with calmer greens,
consistent neutrals, and distinct action, text, reward, and danger roles. These
values are approved design targets in Pencil, not a record of migrated app CSS.
Use semantic tokens rather than choosing colors directly from a primitive scale.

### Approved references

| Pencil node | Role |
| --- | --- |
| `Y9nmU` | Original challenge-list reference; retained for comparison |
| `uvsSQ` | Approved refined dark challenge list |
| `YGjln` | Refined light alternative |
| `vbxf1` | Profile using refined tokens |
| `P7adY` | Sign-in using refined tokens |
| `ifIsM` | Dark/light token board |
| `iJGU3` | Full-screen Poppins / Funnel Sans comparison; font decision pending |
| `UEcrD` | Four theme families, each with dark/light editor previews; beside `ifIsM` |

Other exploratory frames are alternatives, not approved token authority.

### Semantic colors

Pencil uses `$original-refined-<role>` for dark colors and
`$light-refined-<role>` for light colors. The shared names below describe the
intended app contract, independently of the local Tailwind or shadcn mapping.

| Role | Dark | Light | Usage |
| --- | --- | --- | --- |
| `canvas` | `#0B0E0F` | `#FFFFFF` | Deep canvas, inset controls, editor base |
| `background` | `#141A1B` | `#F2F5F4` | Page background |
| `surface` | `#1E2626` | `#FFFFFF` | Cards and grouped controls |
| `border` | `#667778` | `#7E8E90` | Visible control boundaries |
| `border-quiet` | `#354344` | `#D5DFDC` | Separators and non-interactive grouping |
| `text-primary` | `#F2F5F4` | `#141A1B` | Primary readable content |
| `text-secondary` | `#ADB8BA` | `#53636B` | Metadata and supporting copy |
| `tag-background` | `#A6B3B5` | `#DCE5E3` | Compact category tags |
| `tag-foreground` | `#141A1B` | `#314642` | Text on tags |
| `action` | `#32E995` | `#007849` | Primary actions and progress fills |
| `accent-text` | `#58DFA6` | `#007849` | Accent titles and links |
| `success` | `#58DFA6` | `#007849` | Positive state and easy difficulty |
| `reward` | `#FFCE31` | `#876100` | Rewards and medium difficulty |
| `danger` | `#FF7777` | `#BF3838` | Errors and hard difficulty |

Dark primary buttons pair `action` with `canvas` text. Light primary buttons pair
`action` with white text. Do not reuse a bright dark-mode green as text on white.

Green remains the action color; it should not fill every navigation item or
panel. Keep neutral surfaces dominant. Difficulty and status also need text or
icons so that color is not the only signal.

Information-blue and focus treatments have not been redefined in the refined
palette. Existing app treatments remain implementation references until those
roles and their interaction states are explicitly designed and validated.
Studio's existing shadcn semantic variables remain its local implementation
contract until a deliberate migration is made.

### Supporting color scales — provisional

The token board includes complete 50–950 proposals under
`$refined-scale-<family>-<step>`. Intermediate tones are not approved component
assignments. The green proposal, in particular, still needs a lightness-order
review before being treated as a graduated scale. Approved semantic values above
remain authoritative regardless of primitive numbering.

| Step | Neutral | Green | Yellow | Red |
| --- | --- | --- | --- | --- |
| 50 | `#F2F5F4` | `#ECFFF4` | `#FFFBEB` | `#FFF4F4` |
| 100 | `#E5ECEA` | `#D8FFE9` | `#FFF2C2` | `#FFE4E4` |
| 200 | `#DCE5E3` | `#B2F5D4` | `#FFE58A` | `#FFCACA` |
| 300 | `#ADB8BA` | `#78EEB5` | `#FFDB65` | `#FFA2A2` |
| 400 | `#8D9DA0` | `#32E995` | `#FFCE31` | `#FF7777` |
| 500 | `#667778` | `#58DFA6` | `#CFA518` | `#E35C5C` |
| 600 | `#53636B` | `#149F64` | `#A57B07` | `#CE4646` |
| 700 | `#354344` | `#007849` | `#876100` | `#BF3838` |
| 800 | `#1E2626` | `#065C39` | `#604402` | `#952929` |
| 900 | `#141A1B` | `#004329` | `#443102` | `#702525` |
| 950 | `#0B0E0F` | `#002819` | `#281B06` | `#431515` |

### Surface hierarchy and contrast

Dark mode progresses from canvas to page background to card surface. Light mode
uses the pale page background with white cards; quiet borders can clarify groups.
Use `border`, rather than `border-quiet`, when a boundary is necessary to identify
an interactive control. Overlay separation should be clear without decorative
shadows or glow.

Recorded contrast checks for the selected color pairs:

| Pair | Dark | Light |
| --- | ---: | ---: |
| Accent/success text on card surface | 9.20:1 | 5.55:1 |
| Secondary text on card surface | 7.60:1 | 6.24:1 |
| Tag foreground on tag background | 8.16:1 | 7.85:1 |
| Reward text on card surface | 10.38:1 | 5.61:1 |
| Danger text on card surface | 6.00:1 | 5.47:1 |
| Control border against page background | 3.75:1 | 3.11:1 |

These checks cover solid-color pairs in the references, not a complete
accessibility audit. Validate actual component states, opacity, images, focus,
and adjacent surfaces when implementing them. Normal text needs at least 4.5:1;
large text and necessary control boundaries need at least 3:1.

### Typography

#### Current reference and open decision

- **UI baseline:** Poppins in the refined references and existing Web font setup.
- **UI candidate:** Funnel Sans; not yet selected as a replacement.
- **Code family:** Roboto Mono for Delegua and editor content.
- **Fallback:** system sans-serif or monospace as appropriate.

The full-screen comparison `iJGU3` holds content, sizes, weights, and spacing
constant across challenge lists, profiles, and challenge statements. Only the UI
family changes; code typography remains separate. The earlier compact specimen
`xmAFO` is supporting material, not sufficient evidence to choose a family.

Choose the UI family by readability, fit, and identity together: compare long
Portuguese labels and accents, small metadata, numbers, ambiguous glyphs, and
sustained reading. Preserve one UI family unless a second family has a clear,
necessary role. Neither continuity alone nor a different appearance decides the
choice. Do not migrate production fonts before the comparison is resolved.

| Role | Reference size | Weight | Treatment |
| --- | ---: | ---: | --- |
| Page/profile title | `24–28px` | 600 | Clear entry point |
| Challenge-list title | `16px` | 500 | Accent text on neutral surface |
| Reading body | `16px` target | 400 | Comfortable line height and measure |
| Button/filter label | `14px` | 500 | Consistent across controls |
| Metadata/supporting copy | `14px` | 400 | Secondary text |
| Compact tag | `12px` | 600 | Contrasting tag foreground |
| Code | `12–16px` | 400–600 | Roboto Mono; preserve whitespace |

The reading-body target is guidance for implementation, not a claim that every
historical Pencil statement already uses it. Test paragraphs at roughly 45–75
characters per line and tune line height for the selected face and language.

Studio's existing Inter/Outfit conflict remains an implementation gap. The Web
comparison does not settle the Studio family; avoid adding another isolated font.

### Shape and spacing

**The standard border radius is 8 px.** Apply it consistently to buttons, inputs,
cards, panels, dialogs, popovers, badges, and tags. Circular avatars and artwork
retain their intended geometry; a circular treatment is not an alternate radius
for ordinary controls. Do not reintroduce a 4/6/12/16 px radius ladder.

| Token | Value | Usage |
| --- | ---: | --- |
| `radius-default` | `8px` | Standard component corners |
| `radius-circle` | `50%` | Circular avatars and circular shapes |
| `control-height` | `44px` | Standard buttons, inputs, and filters |
| `control-padding-x` | `12px` | Button/input horizontal padding |
| `control-gap` | `8px` | Icon and label spacing |
| `border-width` | `1px` | Standard component border |

Icon-only primary controls use a 44 × 44 px box. Content buttons fit their labels;
full-width actions follow their container. Compact workspace utilities may need
an explicit size exception, but keep the 8 px radius and adequate interaction
area. Button labels use 14 px / 500 in the current font baseline.

| Token | Value | Usage |
| --- | ---: | --- |
| `space-1` | `4px` | Micro-gap |
| `space-2` | `8px` | Compact spacing |
| `space-3` | `12px` | Control padding |
| `space-4` | `16px` | Standard gap |
| `space-6` | `24px` | Card and page padding |
| `space-8` | `32px` | Major section separation |
| `space-12` | `48px` | Large breathing room |

Use 2 px borders only for a deliberate selected or focus state; these states
still need definition before a component migration.

### Shadows and glow

Standard controls have no shadow or glow. Use surface contrast and a neutral
border for separation. Cards also prefer surface contrast or a quiet border.
Do not add animated border effects or green halos to ordinary CTAs.

Existing stars, coins, rockets, and achievement artwork may retain meaningful
space/reward effects. Those effects do not become component elevation tokens.


### Theme families and appearance mode

The StarDust dark/light pair remains the approved baseline. Orbit, Sakura, and
Glacial extend the same semantic contract with proposed palettes for review.
Each family supplies both modes; component layout, font roles, 8 px radius,
44 px controls, and status meanings stay consistent. Theme accents may change
while product artwork and brand assets retain their identity.

| Family | Visual direction | Dark page | Light page |
| --- | --- | --- | --- |
| Orbit | Blue neutrals and lavender accents | `VNL9p` | `EOEZh` |
| Sakura | Plum/rose neutrals and pink accents | `TOt7q` | `n1wKj` |
| Glacial | Blue-grey neutrals and cyan accents | `o4jxB` | `tDTFR` |

These challenge-list variants are arranged in three columns to the right of the
existing references, dark above light. UI variables use
`theme-proposal-<family>-<mode>-<role>`; editor variables remain separate.

#### Orbit UI palette

| Semantic role | Dark | Light |
| --- | --- | --- |
| `canvas` | `#0C1220` | `#FFFFFF` |
| `background` | `#111827` | `#F1F4FB` |
| `surface` | `#1B263B` | `#FFFFFF` |
| `border` | `#7586A2` | `#7A87A2` |
| `border-quiet` | `#34435E` | `#D8DFED` |
| `text-primary` | `#E7EDF7` | `#202A40` |
| `text-secondary` | `#9AAAC2` | `#536482` |
| `tag-background` | `#B8C6DC` | `#DDE4F3` |
| `tag-foreground` | `#111827` | `#354561` |
| `action` | `#A9B9FF` | `#4B58A7` |
| `accent-text` | `#A9B9FF` | `#4B58A7` |
| `success` | `#93D6B5` | `#2B7150` |
| `reward` | `#EAC48B` | `#805D10` |
| `danger` | `#FF9090` | `#B13C4B` |

#### Sakura UI palette

| Semantic role | Dark | Light |
| --- | --- | --- |
| `canvas` | `#120F14` | `#FFFFFF` |
| `background` | `#1B151B` | `#FAF2F6` |
| `surface` | `#2A202B` | `#FFFFFF` |
| `border` | `#917D8F` | `#91768A` |
| `border-quiet` | `#4E3B4B` | `#E6D5DF` |
| `text-primary` | `#F4EDF3` | `#30232D` |
| `text-secondary` | `#B7A6B4` | `#725969` |
| `tag-background` | `#D8BCCF` | `#EEDCE7` |
| `tag-foreground` | `#1B151B` | `#57394B` |
| `action` | `#F2A8C9` | `#9E3E70` |
| `accent-text` | `#F2A8C9` | `#9E3E70` |
| `success` | `#A9D5B2` | `#306F4C` |
| `reward` | `#EAC48B` | `#805900` |
| `danger` | `#FF9999` | `#B33D4D` |

#### Glacial UI palette

| Semantic role | Dark | Light |
| --- | --- | --- |
| `canvas` | `#091317` | `#FFFFFF` |
| `background` | `#0E1B20` | `#EFF7FA` |
| `surface` | `#172B33` | `#FFFFFF` |
| `border` | `#6E8D98` | `#6C8994` |
| `border-quiet` | `#2C4B58` | `#CFDFE5` |
| `text-primary` | `#EAF4F7` | `#183039` |
| `text-secondary` | `#A1B7C0` | `#506B76` |
| `tag-background` | `#B4D1DA` | `#D9EBF1` |
| `tag-foreground` | `#0E1B20` | `#294A56` |
| `action` | `#86D6E7` | `#006F87` |
| `accent-text` | `#86D6E7` | `#006F87` |
| `success` | `#9CD8BB` | `#256B50` |
| `reward` | `#E8CE91` | `#805D10` |
| `danger` | `#FF9999` | `#B13C4B` |

For these six UI variants, primary/secondary/accent/status text was checked
against page and card surfaces at 4.5:1 minimum, and control borders at 3:1.
Use the listed tag foreground/background pair. Dark action fills use dark canvas
text; light action fills use white text. Runtime states still require validation.

### Monaco editor themes

This guide also defines the design contract for several user-selectable editor
themes. Keep three layers separate: primitive palettes, semantic application
colors, and editor-specific colors/syntax roles. Sharing a palette does not make
an action green the correct color for a keyword or a string.

Each theme family provides paired UI and editor palettes. Syntax roles remain
separate from UI roles even when they share values. Orbit, Sakura, and Glacial
are explicit color alternatives; geometry, typography, and product assets stay
consistent across families.

#### Theme definition and adapter

Each theme should have a stable ID, display name, light/dark/high-contrast mode,
and a complete resolved set of editor and syntax roles. Keep this semantic
contract independent of Monaco's configuration keys, with an adapter responsible
for the mapping. This is an implementation target; no expanded multi-theme registry has been
implemented in this design pass.

Monaco's standalone theme definition separates `colors` from token `rules`, with
`base` and `inherit` controlling the built-in starting theme. Its built-in bases
include `vs`, `vs-dark`, `hc-black`, and `hc-light`.
[Official standalone theme contract](https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/standaloneTheme.ts)

Initial mapping targets:

| Design role | Monaco color key | Starting value/status |
| --- | --- | --- |
| `editor.background` | `editor.background` | Theme `canvas` |
| `editor.foreground` | `editor.foreground` | Theme `text-primary` |
| `editor.line-number` | `editorLineNumber.foreground` | Theme `text-secondary` |
| `editor.line-number-active` | `editorLineNumber.activeForeground` | Theme `text-primary` |
| `editor.cursor` | `editorCursor.foreground` | Define and validate per editor theme |
| `editor.selection` | `editor.selectionBackground` | Define and validate per editor theme |
| `editor.selection-inactive` | `editor.inactiveSelectionBackground` | Define and validate per editor theme |
| `editor.line-highlight` | `editor.lineHighlightBackground` | Define and validate per editor theme |
| `editor.error` | `editorError.foreground` | Theme `danger`; validate on editor background |
| `editor.warning` | `editorWarning.foreground` | Candidate: theme `reward`; validate separately |
| `editor.info` | `editorInfo.foreground` | Pending editor-theme value |
| `editor.widget-background` | `editorWidget.background` | Theme `surface` |
| `editor.widget-border` | `editorWidget.border` | Theme `border` |

Color-key meanings are documented in the
[official theme-color reference](https://code.visualstudio.com/api/references/theme-color).
Confirm supported keys against the Monaco version used by the app; workbench-only
colors do not belong in its editor adapter.

Also specify find-match highlights, bracket matching, indent guides, whitespace,
suggestion/hover widget text and selected rows, scrollbars, and any enabled
minimap or overview-ruler states. Pending values must be resolved before a theme
is presented as complete; do not silently depend on arbitrary inherited colors.

#### Syntax roles

Define a separate `syntax.*` set for plain text, comments, keywords, identifiers,
functions, types, strings, numbers, operators, delimiters, and invalid tokens.
These roles are a design vocabulary, not assumed Delegua tokenizer names. Inspect
the actual tokenizer output before mapping them into Monaco `rules`; unsupported
roles must not be represented as working highlighting.

The palettes below are proposals for visual review, not installed production
themes. Frame `UEcrD`, beside `ifIsM`, compares the same Delegua sample in four
family columns, with dark above light. It is a static preview. Pencil uses
`monaco-proposal-<family>-<mode>-<role>` color variables.

| Family ID | Display name | Dark resolved ID | Light resolved ID |
| --- | --- | --- | --- |
| `stardust` | StarDust | `stardust-dark` | `stardust-light` |
| `orbit` | Orbit | `orbit-dark` | `orbit-light` |
| `sakura` | Sakura | `sakura-dark` | `sakura-light` |
| `glacial` | Glacial | `glacial-dark` | `glacial-light` |

Dark variants use Monaco base `vs-dark`; light variants use `vs`. The selected
family and resolved appearance mode determine the concrete theme ID.

##### StarDust editor palette

| Role | Current category | Dark | Light |
| --- | --- | --- | --- |
| Plain text / identifiers / delimiters | `rest` | `#F2F5F4` | `#141A1B` |
| Keywords / currently grouped native functions | `keywords` | `#58DFA6` | `#007849` |
| Strings | `strings` | `#E8CD83` | `#805400` |
| Comments | `comments` | `#94A5A6` | `#5A6B68` |
| Operators | `operators` | `#CBD6D5` | `#40575B` |
| Numbers | `numbers` | `#8CC8FF` | `#1C5D99` |
| Boolean/null-like literals | `booleans` | `#D7ADFF` | `#7E3EB2` |
| Current type-keyword category (`var`) | `typeKeywords` | `#7DDBCF` | `#006E73` |
| Editor background | `editor` | `#0B0E0F` | `#FFFFFF` |
| Active selection | — | `#203D35` | `#E0EEE6` |
| Inactive selection | — | `#263B35` | `#E5ECE8` |
| Current line | — | `#141A1B` | `#F2F5F4` |
| Widget background | — | `#1E2626` | `#F2F5F4` |
| Widget / bracket-match border | — | `#667778` | `#7E8E90` |
| Error / invalid token | — | `#FF7777` | `#BF3838` |
| Warning | — | `#FFCE31` | `#876100` |
| Information / find-match border | — | `#8CC8FF` | `#1C5D99` |

##### Orbit editor palette

| Role | Current category | Dark | Light |
| --- | --- | --- | --- |
| Plain text / identifiers / delimiters | `rest` | `#E7EDF7` | `#202A40` |
| Keywords / currently grouped native functions | `keywords` | `#A9B9FF` | `#4B58A7` |
| Strings | `strings` | `#EAC48B` | `#805D10` |
| Comments | `comments` | `#9AAAC2` | `#586A86` |
| Operators | `operators` | `#C9D5E8` | `#445571` |
| Numbers | `numbers` | `#88D5EC` | `#006B82` |
| Boolean/null-like literals | `booleans` | `#C4ABF4` | `#784B9F` |
| Current type-keyword category (`var`) | `typeKeywords` | `#93D6B5` | `#286D53` |
| Editor background | `editor` | `#111827` | `#FFFFFF` |
| Active selection | — | `#293B59` | `#E6ECF7` |
| Inactive selection | — | `#243044` | `#EBEFF8` |
| Current line | — | `#192235` | `#F1F4FB` |
| Widget background | — | `#1B263B` | `#F1F4FB` |
| Widget / bracket-match border | — | `#7586A2` | `#7A87A2` |
| Error / invalid token | — | `#FF9090` | `#B13C4B` |
| Warning | — | `#EAC48B` | `#805D10` |
| Information / find-match border | — | `#88D5EC` | `#006B82` |

##### Sakura editor palette

| Role | Current category | Dark | Light |
| --- | --- | --- | --- |
| Plain text / identifiers / delimiters | `rest` | `#F4EDF3` | `#30232D` |
| Keywords / currently grouped native functions | `keywords` | `#F2A8C9` | `#9E3E70` |
| Strings | `strings` | `#EAC48B` | `#805900` |
| Comments | `comments` | `#B7A6B4` | `#725969` |
| Operators | `operators` | `#DCCBD7` | `#63485A` |
| Numbers | `numbers` | `#ACCAF0` | `#345F94` |
| Boolean/null-like literals | `booleans` | `#D2B3F1` | `#734595` |
| Current type-keyword category (`var`) | `typeKeywords` | `#A9D5B2` | `#306F4C` |
| Editor background | `editor` | `#120F14` | `#FFFFFF` |
| Active selection | — | `#493043` | `#F3DFE9` |
| Inactive selection | — | `#362532` | `#F8EBF2` |
| Current line | — | `#1B151B` | `#FAF2F6` |
| Widget background | — | `#2A202B` | `#FAF2F6` |
| Widget / bracket-match border | — | `#917D8F` | `#91768A` |
| Error / invalid token | — | `#FF9999` | `#B33D4D` |
| Warning | — | `#EAC48B` | `#805900` |
| Information / find-match border | — | `#ACCAF0` | `#345F94` |

##### Glacial editor palette

| Role | Current category | Dark | Light |
| --- | --- | --- | --- |
| Plain text / identifiers / delimiters | `rest` | `#EAF4F7` | `#183039` |
| Keywords / currently grouped native functions | `keywords` | `#86D6E7` | `#006F87` |
| Strings | `strings` | `#E8CE91` | `#805D10` |
| Comments | `comments` | `#A1B7C0` | `#506B76` |
| Operators | `operators` | `#CCDFE6` | `#365A69` |
| Numbers | `numbers` | `#A4C4FF` | `#315D9A` |
| Boolean/null-like literals | `booleans` | `#C9B9F3` | `#724B96` |
| Current type-keyword category (`var`) | `typeKeywords` | `#9CD8BB` | `#256B50` |
| Editor background | `editor` | `#091317` | `#FFFFFF` |
| Active selection | — | `#25414D` | `#DCEEF3` |
| Inactive selection | — | `#1E343E` | `#E9F3F7` |
| Current line | — | `#0E1B20` | `#EFF7FA` |
| Widget background | — | `#172B33` | `#EFF7FA` |
| Widget / bracket-match border | — | `#6E8D98` | `#6C8994` |
| Error / invalid token | — | `#FF9999` | `#B13C4B` |
| Warning | — | `#E8CE91` | `#805D10` |
| Information / find-match border | — | `#86D6E7` | `#006F87` |

Use plain foreground for identifiers, functions, types, and delimiters until the
actual tokenizer exposes distinct categories. Do not invent highlighting support
to match a design vocabulary. Invalid-token coloring uses the theme error color.
Suggestion and hover text use foreground, selected rows use active selection,
and secondary widget text uses the comment color. Find-match and bracket-match
fills use inactive selection with their specified borders. Scrollbar thumbs use
the border color with transparency; validate final composited colors separately.
The minimap and overview ruler inherit the corresponding syntax/diagnostic roles
when enabled. These assignments are design targets, not verified runtime mapping.

Calculated minimum contrast across all eight code foregrounds against each
variant's background, current line, active selection, and inactive selection:

| Family | Dark | Light |
| --- | ---: | ---: |
| StarDust | 4.6:1 | 4.62:1 |
| Orbit | 4.78:1 | 4.63:1 |
| Sakura | 5.11:1 | 4.72:1 |
| Glacial | 5.18:1 | 4.74:1 |

These checks assume the exact opaque colors above. They do not cover every
Monaco overlay, diagnostic decoration, or alpha-composited state.

#### Existing Delegua integration

`packages/lsp/src/constants/delegua-tokens.ts` defines the current categories:
`keywords`, `operators`, `booleans`, `typeKeywords`, `strings`, `comments`,
`numbers`, `editor`, and `rest`. Native functions such as `escreva` and
`concatenar` are currently listed with keywords; `var` is in `typeKeywords`.
`editor` is a surface role, not a syntax category. Empty arrays do not imply that
the runtime cannot recognize strings, comments, or numbers.

The Web CodeEditor registers the Monarch definition returned by
`DeleguaConfiguracaoParaEditorMonaco.obterDefinicaoDeLinguagem()`. This definition
must be checked for its actual emitted token names before mapping the palettes.
The existing adapter derives singular rule names from plural color keys and
hardcodes the `darkSpace` palette. Replace that assumption with explicit,
verified mappings during implementation; a new color table alone is insufficient.

The application currently has legacy `darkSpace` / `dark-space` naming. Preserve
compatibility with stored preferences when introducing the proposed IDs. Existing
theme constants are duplicated in Web and Studio; consolidation is an
implementation task rather than a change made by this document.

#### User choice and invariant geometry

**Decision: users choose a theme family, and every family inherits the current
application light/dark mode.** This replaces the earlier proposal for choosing
an editor light/dark appearance independently. For example, Sakura resolves to
`sakura-dark` in dark mode and `sakura-light` in light mode. Switching mode retains
the selected family; switching family retains the current mode.

Persist the family ID (`stardust`, `orbit`, `sakura`, or `glacial`), rather than a
mode-specific ID, as the user's theme choice. Use the application's resolved mode
as the shared authority; if its mode preference follows the system, both UI and
editor follow the resulting light/dark mode. No separate editor mode selector is
needed for this contract.

The existing Web EditorContext persists a legacy `themeName` locally. A migration
must translate `darkSpace` / `dark-space` to the StarDust family without pinning
dark mode, and preserve font size and tab size. Family preference storage,
account synchronization, the new-user default, and unknown-ID fallback still need
implementation. Do not claim the new resolver is already present.

Changing color themes should preserve code, selection, scroll position, and editor
settings. Roboto Mono remains the code-family reference; font size and line height
are editor settings, not properties that a color-theme choice changes. The editor
container and surrounding controls keep the standard 8 px radius. Monaco theme
colors do not replace the app's layout or border-radius tokens.

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

All standard buttons use the shared 44 px height, 8 px radius, 12 px horizontal
padding, 8 px icon gap, and no shadow or glow.

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

- Inputs use the theme surface against the surrounding background, with the
  standard 44 px height and 8 px radius.
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

Cards establish grouping using theme surfaces, an 8 px radius, and modest
contrast or a quiet border. A card should answer what it contains and what the user can do next.

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
- Popovers and menus inherit the active theme surface hierarchy and close predictably
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

### Implementation mapping

Map the approved semantic roles in section 3 into the owning app's Tailwind or
shadcn tokens. Keep theme values separate from component geometry: all family
variants share the same 8 px radius and standard control dimensions.

Resolve the family and appearance once, then derive both UI semantic colors and
Monaco colors/rules from that variant. Store the family preference separately
from the application mode; do not store a resolved dark/light ID as the palette
choice. Components consume semantic roles, not family-specific hex literals.
The Monaco adapter uses explicit tokenizer mappings rather than object order or
plural-name slicing. Changing mode or family must retain the editor model and
user settings.

Pencil namespaces document the visual references; they do not require the same
prefixes in application code. Migrate deliberately and validate the affected
screens in the local browser. Do not treat the provisional primitive scales or
unresolved font/focus choices as production-ready decisions.

---

## 11. Non-standard — do not use

- Generic dashboards that discard the established identity. The refined light
  alternative is allowed and uses its own approved semantic colors.
- Arbitrary palette changes outside the selected family. StarDust uses green,
  while Orbit, Sakura, and Glacial have their own defined accents. Focus
  treatments still need specification and validation per family.
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

The refined references establish the approved design direction, while production
implementation still requires a deliberate migration.

- Web and Studio do not yet consume one shared token package.
- Studio's font declarations contain an unresolved Inter/Outfit conflict.
- Icon usage is not fully centralized in Studio.
- Only the named refined Pencil references in section 3 carry the approved
  palette and geometry; other frames remain exploratory or historical.
- Poppins versus Funnel Sans is still an open UI-family decision.
- Paired editor palettes are defined in section 3, but require visual approval,
  runtime interaction validation, and mappings verified against the Delegua
  tokenizer. The existing local preference supports a legacy theme; the family
  registry, shared mode resolver, and preference migration are not implemented.
- Supporting 50–950 scales are provisional, and their tone ordering needs review.
- Hover, focus, pressed, disabled, and loading treatments for the refined tokens
  still need specification and validation.
- The approved dark/light palettes and 8 px radius have not been migrated into
  application code as part of this design work.
- Existing screens contain historical one-off Tailwind values. New work should
  follow this document, and refactors should remove those values only when the
  behavior and visual result are understood.

When a design decision changes, update this file and the owning app's tokens or
shared component in the same change whenever practical. If the design and
implementation disagree, document the difference instead of silently creating
another visual convention.
