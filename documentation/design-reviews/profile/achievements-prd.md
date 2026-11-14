---
prd: documentation/prds/profile/achievements-prd.md
prd_last_updated_at: 2026-11-14
reviewed_at: 2026-11-14
penpot_revn: 515
verdict: pass
boards:
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Diálogo · Conquista desbloqueada
    digest: abba82323fb2c597
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Diálogo · Várias conquistas
    digest: 2c95337db7c8aa55
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Diálogo · Vários níveis de uma trilha
    digest: dc462be4fa51c8a8
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Diálogo · Especial revelada
    digest: 71157bd2ebdfbdae
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Diálogo · Muitas conquistas
    digest: 472062dba5f580ad
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Toast · Conquista desbloqueada
    digest: b718fedd198add25
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas
    digest: 709942946e4cd4db
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Trilha destacada
    digest: e3a1583d4c8d7682
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Primeiro uso
    digest: fefa1c62bef95e5b
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Menu de ordenação aberto
    digest: 1a9755bdad9609a3
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Busca sem resultados
    digest: 94027ac32aba9d95
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Carregando
    digest: 3c681752fb8fdf94
  - page: 🖥️ Desktop
    board: Conquistas / Desktop / Conquistas · Falha ao carregar
    digest: 8094e07963c7ae76
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas
    digest: 1c91fdeaff3be35a
  - page: 📱 Mobile
    board: Conquistas / Mobile / Gaveta lateral
    digest: be60e8edb29bfe7c
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Trilha destacada
    digest: c864b5fb370955ff
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Primeiro uso
    digest: 7c4b7b8c8db7e940
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Menu de ordenação aberto
    digest: 1d22a4b807d795f2
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Busca sem resultados
    digest: b3d094038b8c98b2
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Carregando
    digest: 959f3d2f4a5fa9e0
  - page: 📱 Mobile
    board: Conquistas / Mobile / Conquistas · Falha ao carregar
    digest: a5d9f91b097f367f
  - page: 📱 Mobile
    board: Conquistas / Mobile / Diálogo · Conquista desbloqueada
    digest: 6dfb08bb9d3413b4
  - page: 📱 Mobile
    board: Conquistas / Mobile / Diálogo · Várias conquistas
    digest: f03e24f7dc1c8943
  - page: 📱 Mobile
    board: Conquistas / Mobile / Diálogo · Vários níveis de uma trilha
    digest: 65f7c7d140fb9c18
  - page: 📱 Mobile
    board: Conquistas / Mobile / Diálogo · Especial revelada
    digest: 47ed90f44aac6ff4
  - page: 📱 Mobile
    board: Conquistas / Mobile / Diálogo · Muitas conquistas
    digest: 4d35b158076cba9c
  - page: 📱 Mobile
    board: Conquistas / Mobile / Toast · Conquista desbloqueada
    digest: bea5695adb25654d
---

# Design review: Conquistas

## Scope

- RP-04 (unlock toast and celebration dialogs): the `Diálogo · …` and `Toast · Conquista desbloqueada` boards on Desktop and Mobile.
- RP-06 (achievements page): `Conquistas` and its states `Trilha destacada`, `Primeiro uso`, `Menu de ordenação aberto`, `Busca sem resultados`, `Carregando` and `Falha ao carregar` on Desktop and Mobile, plus `Conquistas / Mobile / Gaveta lateral`.
- JN-05 step 1 (two "???" spaces in Especiais): `Conquistas · Primeiro uso` on Desktop and Mobile.

Two Design Reviewer rounds; the second scored the heuristics 31/40. `check:design` at revn 515 has no new errors.

## Resolved findings

- The toast showed a generic check icon → it shows the trail icon in its level frame (Leitor II, silver).
- The mobile header showed StarCoins as a star → Lucide coins icon, as on desktop.
- Green glow on the highlighted trail and a drop shadow on the sort menu → the 2 px selected border and a plain `color.border` stroke.
- The dialogs used a custom 52 px Continuar → a `Botão` (Primário) instance at 44 px in all 10 dialogs.
- Pill radius on tier badges, group counters and mobile chips → 8 px (`radius.default`); the chips are 44 px tall.
- Quase lá cards had green borders → neutral `color.border-quiet` borders.
- "+100" clipped on Solucionador III → the progress bars fill the space beside the value and reward.
- "Vários níveis de uma trilha" showed an impossible double unlock → Investidor II after one 2.000 StarCoins purchase, +35.
- JN-05 step 1 was not drawn → `Primeiro uso` shows Especiais with two "???" cards.
- The drawer email differed from the header → ana@stardust.dev everywhere; the drawer icons match the sidebar (flag for Conquistas, power for Sair).
- The Especiais counter was green at 0/2 → neutral `color.text-secondary`.
- No loading or load-error boards → `Conquistas · Carregando` and `Conquistas · Falha ao carregar` on Desktop and Mobile, following the Galáxias pattern; RP-06 now defines both states.
- No Quase lá ranking rule → RP-06: progress percentage, then fewest units left, then catalog order; completed trails and Especiais excluded. `Primeiro uso` now shows Ascensão I, Desbravador I and Cartógrafo I.
- No frame or summary count for Especiais → RP-06: bronze frame, counted as Bronze.
- Sorting by "Desbloqueadas"/"Bloqueadas" was undefined → RP-06: the group sections stay, show only the matching trails and hide empty groups.
- Opaque colors that lost their token while editing → rebound to their tokens.

## Decisions

- The celebration dialogs are detached copies of `Diálogos / Diálogo` → accepted exception (user decision): same surface and header, but the component has no content slot and Penpot cannot change a copy's structure. Rebuild them as instances if the component gains a slot.
- The toast is a detached copy of `Notificação / Toast` → accepted: the shared Toast has no icon slot for the trail icon.
- Quase lá with fewer than three candidates, or none → no board; RP-06 states the behavior (show only the existing ones, hide the section when none).
- Sorted results ("Desbloqueadas"/"Bloqueadas") → no board; RP-06 states the behavior and it reuses the group sections.
- The desktop sidebar is legacy vector art with Perfil active and no labeled Conquistas entry → kept; it is the shared layout sidebar, outside this PRD.
- The mobile sort button is icon-only → kept (decided with the user in the first round).
- Mobile "Muitas conquistas" shows about two rows before scrolling → kept; the list scrolls inside the dialog.
- 40 `color-unbound` warnings on translucent tier tints (10–45% fills and borders) → kept unbound: binding a token resets the opacity to 100% in Penpot.
- 8 `radius` warnings on the 12 px `Navegação inferior` tabs of the mobile loading and error boards → inherited from the shared bottom navigation, already in the baseline on the page board; fix it in that component.
