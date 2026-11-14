---
prd: documentation/prds/space/galaxies-page-prd.md
prd_last_updated_at: 2026-11-14
reviewed_at: 2026-11-14
penpot_revn: 515
verdict: pass
boards:
  - page: 🖥️ Desktop
    board: Espaço / Galáxias / Desktop
    digest: 764c24e399254121
  - page: 🖥️ Desktop
    board: Espaço / Galáxias / carregando / Desktop
    digest: 6c6bf373d531689d
  - page: 🖥️ Desktop
    board: Espaço / Galáxias / falha ao carregar / Desktop
    digest: d8a2c1105cb78184
  - page: 🖥️ Desktop
    board: Espaço / Galáxias / galáxia em breve / Desktop
    digest: 2e8bb025274b1d9a
  - page: 🖥️ Desktop
    board: Espaço / Galáxias / Toast / falha ao entrar / Desktop
    digest: 467452f2366375c3
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / Desktop
    digest: a3cde18189fde36e
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta liberado / Desktop
    digest: fa1deb0979b65c33
  - page: 📱 Mobile
    board: Espaço / Galáxias / Mobile
    digest: 6b905b3bf9b59572
  - page: 📱 Mobile
    board: Espaço / Galáxias / carregando / Mobile
    digest: 99ccf2bcf77fa160
  - page: 📱 Mobile
    board: Espaço / Galáxias / falha ao carregar / Mobile
    digest: ae6fb265ab9d32b0
  - page: 📱 Mobile
    board: Espaço / Galáxias / galáxia em breve / Mobile
    digest: 52e35f1e0c705840
  - page: 📱 Mobile
    board: Espaço / Galáxias / Toast / falha ao entrar / Mobile
    digest: 7703ec62b57ffb87
  - page: 📱 Mobile
    board: Espaço / Galáxia / Mobile
    digest: fdec4ddb48d14a6c
---

# Design review: Página de Galáxias

## Scope

RP-01 to RP-05 and JN-01 to JN-07 of the Galaxies Page PRD.

- RP-01, RP-02, RP-03, RP-05, JN-01 to JN-03: the `Espaço / Galáxias / … / Desktop` and
  `Espaço / Galáxias / … / Mobile` boards for the map, loading and load failure.
- Announced galaxy (RP-01 to RP-03, JN-07): `Espaço / Galáxias / galáxia em breve /
  Desktop` and `/ Mobile`.
- Failure when entering a galaxy (RP-03, JN-05): `Espaço / Galáxias / Toast / falha ao
  entrar / Desktop` and `/ Mobile`, standalone frames with the `Notificação / Toast`
  component, variant `Tipo=Erro`.
- RP-04 on desktop: the `Controle de galáxia` layer in `Main › Header` of
  `Espaço / Galáxia / Desktop` and `Espaço / Galáxia / planeta liberado / Desktop`. The
  rest of those two boards is outside this review and keeps its baseline debt.
- RP-04 on mobile: the `Controle de galáxia` strip of `Espaço / Galáxia / Mobile`. That
  board draws only the first viewport of the mobile Galáxia page (header, control, planet
  header, four stars, bottom navigation) to place the control. It has no starfield or
  rocket, and the mobile trail itself belongs to a review under `galaxy-page-prd.md`.

`check:design` reports no new error or warning on any of the thirteen boards at file
revision 515. The Design Reviewer ran four rounds; the third covered all boards drawn
until then and the fourth the announced-galaxy boards, the toast boards and the mobile
control, against the PRD revised on 2026-11-14. No `missing` or `contradicted` finding
is open.

Two notes on the evidence:

- The toast boards were resized after the fourth round (see the first resolved finding)
  and were not sent back to the Reviewer; the fix was checked by export.
- The digests of `Espaço / Galáxias / Mobile` and `Espaço / Galáxias / falha ao carregar /
  Mobile` changed between revisions 412 and 462 without an intended edit. Both exports
  were checked and look as reviewed; the cause is unknown.

## Resolved findings

- The toast instance had a fixed 70 px height and clipped the bottom padding and the
  4 px time bar of the three-line message (round 4) → the instance now sizes to its
  content and both frames are 87 px tall.
- No board drew the failure when entering a galaxy (round 3) → the two toast boards.
- The mobile `Controle de galáxia` strip read as an informative bar (round 3) → its
  stroke uses `color.border`, as the desktop control.
- The PRD did not say where the galaxy name of the return action comes from while the
  page loads or after a load failure (round 3) → RP-04 now states that it comes from the
  current galaxy of the account, with “Voltar” as the fallback.
- The PRD forbade “Em breve” galaxies and any state label → revised with the user on
  2026-11-14: the catalog has an announced state, shown as “Em breve”.
- “Tentar novamente” was clipped on both failure boards (the label box kept a stale
  width), reported by the user → label and button resized to fit; particles that sat
  inside buttons, texts or plates were removed.
- Mobile boards read as a card list, without the space background → starfield added to
  the three mobile boards; each illustration overlaps the top of its `Placa` and
  alternates left and right.
- Mobile current galaxy had no rocket → `slot-rocket` added beside the illustration.
- Second galaxy fell below a 900 px desktop viewport → vertical stagger reduced; the
  second galaxy now ends at y 828.
- `Controle de galáxia` read as a split button → separator removed; it is one 44 px
  control.
- Desktop `slot-rocket` was outside the galaxy element → moved inside
  `Galáxia Lógica de Programação · atual`.
- Loading skeletons did not match the loaded geometry → placeholders and `Placa` sizes
  match the loaded boards on desktop and mobile; the mobile loading subtitle reserves two
  lines.
- Mobile starfield particles were square, fully opaque and crossed text → round, 36%
  opacity, moved off the text blocks.
- Placeholder debt cloned from the Space board (`slot-avatar` and `slot-rocket` fill
  #2A3538, 11 px captions), 20 px padding and 22 px titles → bound to
  `color.border-quiet`, 12 px captions, `space.6` padding and 20 px titles on the new
  boards.
- Mobile bottom-navigation tabs cloned with a 12 px radius and unbound colors → 8 px
  radius and tokens bound on the new boards.

## Decisions

- Announced galaxy (`Galáxia Orientação a Objetos · em breve`) → illustration at 40%
  opacity, neutral “Em breve” chip in the position of “Você está aqui”, dashed `Placa`
  border, no progress and no padlock. It is not a control: it has no hover, pressed or
  focus treatment.
- Toast position over the page → no board. The toast uses the Web App's existing toast
  position on both viewports; the boards are standalone frames, as the other toasts of
  the file.
- Return action with the fallback label “Voltar” → no board; it is the same `Botão`
  (Contorno) with a shorter label.
- Current galaxy unpublished (JN-06) → no board; the student lands on the Galáxia page of
  another galaxy, which is already drawn.
- Loading skeleton with an announced galaxy → kept. The skeleton shows a progress line
  for both galaxies and a 178 px `Placa` against the 166 px announced one, because the
  state of each galaxy is unknown while loading.
- Subtitle “Escolha em qual você quer estudar” with a single published galaxy → kept;
  the PRD defines no variant.
- The first nine boards were renamed to the pattern
  `<Módulo> / <Página> / <Componente> / <Estado ou variante> / <Desktop|Mobile>` by the
  user's decision of 2026-11-14, now in `documentation/rules/penpot-rules.md`. Only the
  names changed; `check:design` reported nothing new after the rename, at revision 412. The seven other boards of the section
  `Galáxia · Trilha` (six video dialogs and the lock animation) were renamed to the same
  pattern, for example `Espaço / Galáxia / Diálogo de vídeo de apresentação / sem som /
  Desktop`; they are outside this review and have no digest here.
- The load-failure message is centered in the content area, with centered text, on
  desktop and mobile, by the user's request after the review rounds; not sent back to
  the Reviewer.
- The back button shows the current galaxy name, “Voltar para Lógica de Programação”, by
  the user's request after the review rounds; RP-04 of the PRD now states it. Only the
  label changed (302 px wide, it fits the 342 px mobile content), so the boards were not
  sent back to the Reviewer.
- The study page was renamed from Espaço to Galáxia after the review rounds → the section
  is now `Galáxia · Trilha`, its boards were `Galáxia / Desktop …` until the naming decision above, and the back button
  first read “Voltar à galáxia”. Only names and that label changed, so the boards were not sent
  back to the Reviewer; the digests above were taken after the rename. “Space” in this
  record means that page.
- Space with a single visible galaxy (RP-04, JN-04) → no board. It is the Space header
  as it was before this change, without `Controle de galáxia`. Direct access to the page
  with one galaxy is a redirect and has nothing to draw.
- Three or more galaxies and long names (implied maximum) → no board. The stagger
  continues downward, alternating sides, and the page scrolls vertically; names and
  descriptions wrap inside the 340 px `Placa`. Only two galaxies are planned.
- Keyboard focus of the galaxy element and of the control → no board. They follow the
  approved focus extension of `documentation/design.md`, which has no Penpot frame.
- Top of the Space showing another galaxy name (JN-02 step 3) → no board; it is the same
  control with a different label.
- Finished galaxy (“10 de 10 planetas”) → no board; the PRD defines no state label, so it
  is the same layout with a full bar.
- `Controle de galáxia` is a plain board duplicated in the two Space boards, not a
  library component → kept; it appears twice, below the three-use threshold of
  `documentation/rules/penpot-rules.md`.
- The back button uses the `Botão` component, variant `Contorno` → kept; this page
  makes that variant an implementation target.
- The galaxy illustrations are provisional geometric drawings → kept; final art is out
  of scope in the PRD.
- The existing Space boards now always show the control, as the user asked to update
  them instead of adding a new Space board.
