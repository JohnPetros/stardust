---
prd: documentation/prds/space/galaxy-page-prd.md
prd_last_updated_at: 2026-11-15
reviewed_at: 2026-11-17
penpot_revn: 622
verdict: pass
boards:
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Desktop
    digest: 9dd845d8b698595f
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta liberado / Desktop
    digest: 6aa8266a23ec6e16
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta aberto / Desktop
    digest: 423b8e0106ebc7d0
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de apresentação / Desktop
    digest: 1bf51e4299eb7859
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de apresentação / falha ao carregar / Desktop
    digest: 16c7472059611946
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de apresentação / sem som / Desktop
    digest: 21234dc581615bc1
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de apresentação / movimento reduzido / Desktop
    digest: e981deb66adf042b
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de encerramento / Desktop
    digest: 9aa53ceaff1958e7
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de encerramento / falha ao carregar / Desktop
    digest: 7b58ea402fe76ef9
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Planeta / animação de abertura do cadeado / Desktop
    digest: e4518b6e8ff8593d
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / FAB de retorno / Desktop
    digest: c43ce2450b3f1aad
  - page: 📱 Mobile
    board: Espaço / Galáxia / Mobile
    digest: b3babc75eeeab978
  - page: 📱 Mobile
    board: Espaço / Galáxia / planeta liberado / Mobile
    digest: 6dee1e1119db0141
  - page: 📱 Mobile
    board: Espaço / Galáxia / planeta bloqueado / Mobile
    digest: 3371036698acc614
  - page: 📱 Mobile
    board: Espaço / Galáxia / planeta aberto / Mobile
    digest: 4507bece14d5ed97
  - page: 📱 Mobile
    board: Espaço / Galáxia / Diálogo de vídeo de apresentação / Mobile
    digest: e1c76ecc1ecce481
  - page: 📱 Mobile
    board: Espaço / Galáxia / FAB de retorno / Mobile
    digest: 1730469f4c0464f9
  - page: 📱 Mobile
    board: Espaço / Galáxia / Detalhes da estrela / Mobile
    digest: 562c3c67c257cf99
---

# Design review: Trilha e Galáxia

## Scope

Requirements RP-02, RP-03, RP-04, RP-05, RP-07, RP-08, RP-09, RP-10 and RP-11, and journeys
JN-01, JN-07, JN-08 and JN-09, in the Penpot section "Galáxia · Trilha".

- Planet and star states, Desktop: `Espaço / Galáxia / Desktop` (opened planet,
  progress 1 of 4), `planeta liberado` (locked-with-ring, "Abrir planeta") and
  `planeta aberto` (just opened, star 1 available). Kalkulon blocked is visible
  below the Trívia planet in all three.
- Planet and star states, Mobile: the same three states plus
  `planeta bloqueado / Mobile`.
- Return button (RP-03): `FAB de retorno / Desktop` and `/ Mobile`, the map
  scrolled so the current item is above the viewport, with the arrow-up button.
- Star details on Mobile (RP-09): `Detalhes da estrela / Mobile`, the bottom panel
  drawn as a standalone frame (available story star, "Começar história").
- Presentation video dialog (default, `falha ao carregar`, `sem som`,
  `movimento reduzido`), closing video dialog (default, `falha ao carregar`) and
  the `Planeta / animação de abertura do cadeado` storyboard, Desktop only, plus
  the Mobile sample of the presentation video dialog.

## Resolved findings

- Mobile had no planet-state boards → drew `planeta liberado / Mobile`,
  `planeta bloqueado / Mobile` and `planeta aberto / Mobile`.
- Mobile map lacked the trail, the type and state icons and showed a wrong
  counter → added the trail instances and icons and fixed the counters
  ("0 de 4 concluídas", "1 de 4 concluídas").
- "Rever vídeo" and "Abrir planeta" were below the 44 px touch target on Mobile
  → 44 px controls (`control-height`).
- State right after opening (JN-08, step 8) was not drawn → added
  `planeta aberto / Desktop` and `/ Mobile` (0 of 4, star 1 "Disponível", no
  lock).
- All Desktop star numbers read "1" → numbered 1 to 4.
- Kalkulon plaque was clipped at the board edge → Desktop boards resized to
  1440 × 1160.
- Desktop "Abrir planeta" and "Rever vídeo" were 32 px high → 44 px on the three
  Desktop map boards.
- Counter wording on Desktop mixed "concluídas" and "estrelas concluídas" →
  "estrelas concluídas" on all three Desktop map boards.
- RP-02 required a position rocket that the boards no longer draw → the PRD was
  amended on 2026-11-15 (RP-02 and RP-13): the Galáxia shows no position rocket,
  and the continuity point is shown only by the highlight of the current star or
  planet and by the map states. The rocket in the sidebar and header is the brand
  mark.
- The presentation video dialog had no Mobile board to prove it fits the width
  (RP-10) → drew `Diálogo de vídeo de apresentação / Mobile` (358 px wide, 44 px
  controls, skip button full width) and added it as the single dialog exception
  to `documentation/design.md` and `documentation/rules/doop-rules.md`.
- The return button (RP-03) was not drawn → drew `FAB de retorno / Desktop` and
  `/ Mobile`, modeled on the Web App `Fab` (48 × 48, `color.surface`,
  `radius.default`, 2 px `color.action` bottom border, bold arrow).
- The Mobile bottom panel for star details (RP-09) had no board → drew
  `Detalhes da estrela / Mobile` (390 px wide, 44 px close and action, tokens
  bound, 0 `check:design` findings), modeled on the Desktop hover panel.
- The "Reproduzir vídeo" label was clipped in
  `Diálogo de vídeo de apresentação / movimento reduzido / Desktop` → the button
  now sizes to its label.

## Decisions

- Mobile storyboard of the lock-opening animation → deliberately without a Mobile
  board. It is a behavior sheet identical in both viewports.
- Mobile bottom panel for star details (RP-09) → drawn as a standalone panel
  frame; the dimmed backdrop and the map behind it are deliberately not drawn
  (standalone frame rule). The panel for completed ("Revisar") and locked stars
  has no board; locked stars show their condition on the map. The rule that the
  return button must not block the panel actions (RP-03) is not shown in a board
  and is left to the Spec.
- Star details panel, weak and debt findings → kept: the state chip has no icon
  (same as the Desktop panel); the challenge variant ("Começar desafio", code
  icon) has no board, and the Spec states the action label per type; the frame
  has four rounded corners and a full border, and the Spec rounds only the top
  corners and drops the side and bottom stroke when docked; the panel is a plain
  board (three occurrences with the two Desktop hover panels, which keep their
  legacy names) and the component extraction waits for a task that changes them.
- Dialogs → no Mobile boards, per `documentation/rules/doop-rules.md`, except
  the presentation video dialog sample. Its other states and the closing video
  dialog follow that sample on Mobile.
- Map with the trail completed (RP-06, JN-07) → deliberately without a board in
  this delivery. It is the standard map with every star concluded, no current
  highlight and no return button; the Spec defines it.
- Closing video dialog `sem som` and `movimento reduzido` → deliberately without
  a board; they reuse the presentation video variants (same player and control
  row).
- Return button pointing down → deliberately without a board; it is the same
  component with the arrow mirrored when the current item is below the viewport.
- Return button over a liberated planet reference → the layer name keeps the PRD
  wording "voltar à estrela atual"; the Spec states that the planet case uses
  the same accessible name.
- Meaning of the "X" in the closing video dialog → open PRD question left for the
  Spec (back to the map or to the thank-you page); not changed in the PRD.
- Desktop video dialog controls at 32 px and footer buttons at 40 px (weak) →
  kept; they predate this review and the dialogs are approved references.
- Failure-state buttons are all secondary (weak) → kept; the Spec decides the
  primary recovery action.
- No buffering or video-ended state (RP-10, missing, non-blocking) → kept as
  deliberately without a board; the failure and play states cover the flow.
- The video dialog parts are plain boards, not instances of `Diálogos / Diálogo`
  (debt) → kept; extraction into a shared video dialog component is separate
  work.
- Mobile counter wording stays "concluídas" while Desktop uses "estrelas
  concluídas" → kept; the Mobile plaque is narrower and the longer text would
  wrap.
- No "Liberado" or "Bloqueado" word on the planet plaque (weak) → kept; the lock,
  the requirement text and the action button already carry the state.
- 12 px state and metadata text on Mobile (weak) → kept; it follows the existing
  trail pattern and 14 px would wrap the plaques.
- No `planeta bloqueado / Desktop` board (weak) → kept; Kalkulon blocked is
  visible in the three Desktop map boards, so the Desktop base covers the state.
- The action sits inside the plaque, not on the planet (weak) → kept; the Spec
  defines that planet and plaque are one actionable target (RP-10).
- Mobile boards use plain boards instead of `Botão` and `Cabeçalho` instances, and
  the star plaque repeats four times per board (debt) → kept; existing structure
  outside this delivery.
- Mobile tab bar binds the primitives `color.green.800` and `color.green.400`
  (debt) → kept; existing debt of the Mobile tab bar.
- `planeta aberto / Desktop` and `FAB de retorno / Desktop` report `check:design`
  warnings (spacing, unbound colors, type scale) → kept; they are inherited from
  `Espaço / Galáxia / Desktop`, which carries the same findings in the baseline
  (6 px and 10 px gaps, unbound fills, 22 px panel title). The FAB layers
  themselves have none. The baseline was not updated. `unknownBackgrounds: 1`
  stays unresolved.
- The galaxy control chip overlaps star 3 in `FAB de retorno / Desktop` (debt) →
  kept; inherited from `Espaço / Galáxia / Desktop`.
