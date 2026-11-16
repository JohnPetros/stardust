---
prd: documentation/prds/space/galaxy-page-prd.md
prd_last_updated_at: 2026-11-15
reviewed_at: 2026-11-15
penpot_revn: 594
verdict: pass
boards:
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Desktop
    digest: 958fdb9212d3dab6
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta liberado / Desktop
    digest: 6effeb16ca16a733
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta aberto / Desktop
    digest: 209794419abd8ec4
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
    digest: b40e3fd128dc31b5
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de encerramento / Desktop
    digest: 9aa53ceaff1958e7
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Diálogo de vídeo de encerramento / falha ao carregar / Desktop
    digest: 7b58ea402fe76ef9
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Planeta / animação de abertura do cadeado / Desktop
    digest: e4518b6e8ff8593d
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
---

# Design review: Trilha e Galáxia

## Scope

Requirements RP-02, RP-05, RP-07, RP-08 and RP-10, and journeys JN-01, JN-08 and
JN-09, in the Penpot section "Galáxia · Trilha".

- Planet and star states, Desktop: `Espaço / Galáxia / Desktop` (opened planet,
  progress 1 of 4), `planeta liberado` (locked-with-ring, "Abrir planeta") and
  `planeta aberto` (just opened, star 1 available). Kalkulon blocked is visible
  below the Trívia planet in all three.
- Planet and star states, Mobile: the same three states plus
  `planeta bloqueado / Mobile`.
- Presentation video dialog (default, `falha ao carregar`, `sem som`,
  `movimento reduzido`), closing video dialog (default, `falha ao carregar`) and
  the `Planeta / animação de abertura do cadeado` storyboard, Desktop only.

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

## Decisions

- Mobile storyboard of the lock-opening animation → deliberately without a Mobile
  board. It is a behavior sheet identical in both viewports.
- Mobile bottom panel for star details (RP-09) → deliberately without a board; it
  belongs to the feature issue #613, not to this review.
- Dialogs → no Mobile boards, per `documentation/rules/penpot-rules.md`.
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
- `planeta aberto / Desktop` reports 45 `check:design` warnings (21 spacing, 23
  unbound colors, 1 type scale) → kept; they are inherited from
  `Espaço / Galáxia / Desktop`, which carries the same 46 baseline findings
  (6 px and 10 px gaps, unbound fills, 22 px panel title). The baseline was not
  updated. `unknownBackgrounds: 1` stays unresolved.
