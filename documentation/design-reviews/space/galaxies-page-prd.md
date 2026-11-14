---
prd: documentation/prds/space/galaxies-page-prd.md
prd_last_updated_at: 2026-11-14
reviewed_at: 2026-11-14
penpot_revn: 412
verdict: findings
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
    board: Espaço / Galáxia / Desktop
    digest: a3cde18189fde36e
  - page: 🖥️ Desktop
    board: Espaço / Galáxia / planeta liberado / Desktop
    digest: fa1deb0979b65c33
  - page: 📱 Mobile
    board: Espaço / Galáxias / Mobile
    digest: 7165c02b1b126cff
  - page: 📱 Mobile
    board: Espaço / Galáxias / carregando / Mobile
    digest: 99ccf2bcf77fa160
  - page: 📱 Mobile
    board: Espaço / Galáxias / falha ao carregar / Mobile
    digest: 8487b681ddb02ad2
  - page: 📱 Mobile
    board: Espaço / Galáxia / Mobile
    digest: 56633d3e77f3ef74
---

# Design review: Página de Galáxias

## Scope

RP-01 to RP-05 and JN-01 to JN-04 of the Galaxies Page PRD.

- RP-01, RP-02, RP-03, RP-05, JN-01 to JN-03: the three `Espaço / Galáxias / … / Desktop` boards
  and the three `Espaço / Galáxias / … / Mobile` boards (map, loading, load failure).
- RP-04: the `Controle de galáxia` layer added to `Main › Header` of the existing
  `Espaço / Galáxia / Desktop` and `Espaço / Galáxia / planeta liberado / Desktop` boards (named `Espaço / Desktop …`
  until the page was renamed to Galáxia on 2026-11-14). The rest of those
  two boards is outside this review and keeps its baseline debt.

`check:design` reports no new error or warning on any of the eight boards at file
revision 390. The Design Reviewer ran two rounds; the second covered only the boards
changed after the first.

## Open findings

The PRD was revised after the review rounds (interview of 2026-11-14) and now settles the
two gaps below. The verdict stays `findings` because the boards do not yet reflect them.

- **Galaxy control on mobile (RP-04, JN-01 step 1).** Drawn after the review rounds as a
  full-width 48 px strip below the header on the new board `Espaço / Galáxia / Mobile` (section
  `Galáxia · Trilha` of the `📱 Mobile` page). `check:design` reports nothing new on it,
  but the Reviewer has not seen this board. The board draws the first viewport of the
  mobile Galáxia page (header, control, planet header, four stars, bottom navigation) to
  place the control; the rest of the mobile trail is not drawn.
- **Failure when entering a galaxy (RP-03, JN-05).** The PRD now defines an error toast
  that names the galaxy. No board draws it; decide whether it reuses the toast component
  without a dedicated board.
- **Current galaxy unpublished (RP-03, JN-06).** New in the PRD; it changes no board, and
  has not been through the Reviewer.

## Resolved findings

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

- The nine boards were renamed to the pattern
  `<Módulo> / <Página> / <Componente> / <Estado ou variante> / <Desktop|Mobile>` by the
  user's decision of 2026-11-14, now in `documentation/rules/penpot-rules.md`. Only the
  names changed; the digests above were taken after the rename and `check:design`
  reports nothing new at revision 412. The seven other boards of the section
  `Galáxia · Trilha` (video dialogs and the lock animation) keep the previous pattern
  until a task changes them.
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
- Space with a single published galaxy (RP-04, JN-04) → no board. It is the Space header
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
