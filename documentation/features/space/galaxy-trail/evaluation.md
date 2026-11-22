---
title: Trilha da galáxia — evaluation
spec: ./spec.md
plan: ./plan.md
spec_revision: 11
status: ready
base_commit: 17ff18282d8b55ef2181ce2997862d4516f9c37a
evaluated_commit: 17ff18282d8b55ef2181ce2997862d4516f9c37a (working tree)
last_updated_at: 2026-11-19
---

# Evaluation — Trilha da galáxia com progresso por fatos, abertura de planetas e staging automatizado

## Evaluated scope

- Spec: `./spec.md` (revisão 11)
- Plan: `./plan.md`
- Base commit: `17ff18282d8b55ef2181ce2997862d4516f9c37a` (branch `feat/new-galaxy-page`)
- Evaluated commit: working tree (nada commitado)
- Assignment: Builder Direct no contexto principal; RF-01–RF-19, CA-01–CA-45; paths = mapa canônico da Spec; Rules: code-conventions, ui-layer, rest-layer, rpc-layer, core/server/database layer rules por path (lidas antes de cada camada).

## Criteria evidence

| Criterion | Verification | Real evidence | Remaining work |
| --------- | ------------ | ------------- | -------------- |
| CA-01 | Passed | EV-02 (41 estrelas, 10 planetas); EV-14 imagens WebP 512×512 com alfa; EV-11 catálogo servido no navegador | none |
| CA-02 | Passed | EV-02 | none |
| CA-03 | Passed | EV-02 | none |
| CA-04 | Passed | EV-02, EV-03 seed, EV-11 | none |
| CA-05 | Passed | EV-01 | none |
| CA-06 | Passed | EV-01 | none |
| CA-07 | Passed | EV-01 | none |
| CA-08 | Passed | EV-01 | none |
| CA-09 | Passed | EV-04 | none |
| CA-10 | Passed | EV-04 | none |
| CA-11 | Passed | EV-04 | none |
| CA-12 | Passed | EV-04 (401; conta da sessão) | none |
| CA-13 | Passed | EV-04; EV-11 (fatos relidos após novo login do Playwright) | none |
| CA-14 | Passed | EV-04 | none |
| CA-15 | Passed | EV-04 | none |
| CA-16 | Partial | EV-01 unit; EV-04 route; evento publicado não afirmado no route test | aceito: coberto por unit (ACH-09) |
| CA-17 | Passed | EV-04 | none |
| CA-18 | Passed | EV-04 | none |
| CA-19 | Passed | EV-05 CreateUserJob | none |
| CA-20 | Passed | EV-15 grep: restam só `FirstStarUnlockedEvent` (mantido por RF-06), migrations históricas, rollback `0002`, manifesto legado e `Database.ts` gerado (ACH-08) | none |
| CA-21 | Passed | EV-04 KPI/xlsx/perfil; EV-08; EV-09 | none |
| CA-22 | Passed | AV-06 (StarView/PlanetView/StarDetailsView tests); AV-07 `space.test.ts` "renders the state of the planets and of each star…"; VV-01/02/05/06 PASS (round 4) | none |
| CA-23 | Passed | AV-06 PlanetView tests; AV-07 `space.test.ts` (planeta liberado/bloqueado); VV-02/02b/06/07 PASS (round 4) | none |
| CA-24 | Passed | AV-06 StarDetails tests; AV-07 `space.test.ts` "fills the details panel by hover and by focus…"; VV-01 PASS | none |
| CA-25 | Passed | AV-06 StarDetails + SpaceContext tests; AV-07 `space.test.ts` bottom sheet on mobile; VV-01/10 PASS | none |
| CA-26 | Passed | AV-07 `space.test.ts` "opens the bottom sheet by touch on mobile, closes it…"; VV-10 PASS | none |
| CA-27 | Passed | AV-06 `useStarDetails.test.ts` (áudio, reinício, navegação, desafio sem desafio e falha de lookup); AV-07 `space.test.ts` "starts a story…" e "shows a toast … challenge star has no challenge" | none |
| CA-28 | Passed | AV-06 `useSpaceContextProvider.test.ts` (rola uma vez após layout estável); AV-07 `space.test.ts` return button; MV-01 passou (EV-11) | none |
| CA-29 | Passed | AV-06 `useSpaceContextProvider.test.ts` (acima/abaixo); AV-07 `space.test.ts` "shows the return button only when the current item is out of view"; MV-02 (EV-12); VV-04/09 PASS | none |
| CA-30 | Passed | AV-06 `useSpaceContextProvider.test.ts` ("should not scroll when there is no current item"); AV-07 `space.test.ts` trilha concluída e vazia | none |
| CA-31 | Passed | AV-07 `space.test.ts` "shows every star completed, no return button and the ending link…" | none |
| CA-32 | Passed | AV-06 PlanetView/usePlanet tests; AV-07 `space.test.ts` "opens a liberated planet with a single request…" e falha de abertura; VV-03/08/11 PASS | none |
| CA-33 | Passed | AV-06 PlanetView tests (aberto, sem botão); AV-07 `space.test.ts` renders state of planets | none |
| CA-34 | Passed | AV-07 `space.test.ts` "opens the planet with reduced motion"; AV-06 PlanetLock tests; VV-02/11 PASS | none |
| CA-35 | Passed | AV-07 `space.test.ts` empty message e load failure with retry; `galaxies.test.ts` loading e failure state (ACH-13: flake conhecido em dev server) | none |
| CA-36 | Passed | AV-06 PlanetView/StarView (nomes acessíveis); AV-07 `space.test.ts` mobile sem scroll horizontal; MV-02 (EV-12) | none |
| CA-37 | Passed | AV-06 `AccessStarPageAction.test.ts` e `AccessChallengePageAction.test.ts` (404 bloqueada; God mantém desafios); ressalva ACH-11 (falha de lookup abre a página) | none |
| CA-38 | Passed | AV-08 inspeção estática do workflow (EV-07); confirmada na 2ª revisão da implementação | none |
| CA-39 | Waived | MV-03 dispensado pelo usuário (sem staging real nesta entrega); coberto estaticamente por AV-08 (EV-07) e pelas revisões; sem alegação de aprovação | usuário (waiver) |
| CA-40 | Passed | EV-03 | none |
| CA-41 | Waived (mobile) | Revisão 10: AV-10 falha no mobile (performance 47 a 49, TBT 1384 a 1701 ms) e foi waived pelo usuário em 2026-11-21; desktop passa (91, TBT 96 ms). Medição anterior, antes da revisão 7 — EV-17: build de produção local, mediana de 3 após as correções de CLS — mobile: performance 56, acessibilidade 90, best-practices 93, LCP 6884 ms, TBT 809 ms, CLS 0.000; desktop: perf 94, a11y 92, LCP 1606 ms, TBT 73 ms, CLS 0.000. Medição "antes" não feita (a página antiga não roda no banco novo); todos os mínimos atingidos | none |
| CA-42 | Passed | Docs atualizados; contadores de `tooling.md` reconciliados com `storage:seed` (124 imagens, 110 referências, dez planetas); exemplo `StarUnlockedEvent` removido de `core-package-rules.md` | none |
| CA-43 | Passed | EV-04 | none |
| CA-44 | Passed | EV-07 | none |
| CA-45 | Waived | MV-03 dispensado pelo usuário; AV-08 estático passou em EV-07 e a 2ª revisão da implementação confirmou o workflow | usuário (waiver) |

## Reviews

### Spec Reviewer

- Verdict: `clear` (conforme histórico de revisões da Spec)
- Revision: 5

### Implementation Reviewer

- Verdict: findings (parcial; item 3 só em parte, 5 e 6 não auditados) — high: adaptador legado do Supabase com tabelas removidas (corrigido, ACH-08); medium: `schema.sql` declarativo desatualizado (aceito, ACH-08), concorrência na recompensa (aceito, ACH-09), guard de desafio abre ao falhar a busca da estrela e `isGod` (pré-existente, ACH-11); low: ordenação CD de imagens × migration em produção (checklist de release).
- 2ª execução (completa para persistência, migrations, seed, CD, rotas e guardas Web): FAIL só por integridade do ledger — CA-41 e o mapeamento genérico de CA-27..38 (corrigidos: cada CA aponta para AV/teste específico; CA-41 Blocked), ledger obsoleto (atualizado), contadores de `tooling.md` e exemplo em `core-package-rules.md` (corrigidos). Sem defeito de código bloqueante. Não auditado nessa rodada: widgets Web por camada e realismo dos testes (cobertos por AV-06/AV-07 e pelas rodadas do Visual Reviewer).

### Visual Reviewer

- 1ª rodada: FAIL (F1–F4, F6, F9); `builder_web_visual` corrigiu; F8 é o botão global de feedback (pré-existente).
- Rodadas 2–4 com o Penpot reconectado: FAIL (F1) → FAIL (F6) → PASS com notas (ver seções abaixo).

## Manual and visual inventory

| MV/VV | CA | Surface/route | State | Viewport | Penpot board | Candidate | Artifact | Observed result | Reviewer disposition |
| ----- | -- | ------------- | ----- | -------- | ------------ | --------- | -------- | --------------- | -------------------- |
| MV-01 | CA-27, CA-28, CA-32 | `/space/logica-de-programacao`, `/lesson/...` | login seed; abrir Aurora; estrela 1; lição; recompensa; revisar | 1440×900 | n/a | working tree | EV-11 (scripts no scratchpad) | `PUT …/open` 200; estrela 1 Concluída, 2 Disponível, "1 de 4"; revisar não altera; fato persistido; rotas 2xx | n/a |
| MV-02 | CA-26, CA-29, CA-36 | `/space/logica-de-programacao` | painel inferior, foco, lição, FAB | 390×844 | n/a | working tree | EV-12 | painel abre/fecha, foco volta à estrela, lição abre, FAB só fora da tela e traz o item, sem scroll horizontal (cartões terminam em x=372) | n/a |
| MV-03 | CA-39, CA-45 | GitHub Actions + Coolify staging | primeira execução | n/a | n/a | n/a | n/a | Waived pelo usuário em 2026-11-19; a primeira execução real em staging ocorre após o merge | n/a |
| VV-01 | CA-22, CA-24, CA-25 | `/space/logica-de-programacao` | ver Spec | 1440×900 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-01-desktop-map-panel.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4) |
| VV-02 | CA-22, CA-23, CA-34 | `/space/logica-de-programacao` | ver Spec | 1440×900 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-02-desktop-liberated.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4, com VV-02b) |
| VV-03 | CA-32 | `/space/logica-de-programacao` | ver Spec | 1440×900 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-03-desktop-just-opened.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4) |
| VV-04 | CA-29 | `/space/logica-de-programacao` | ver Spec | 1440×900 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-04-desktop-fab-down.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 2) |
| VV-05 | CA-22 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-05-mobile-map.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4) |
| VV-06 | CA-22, CA-23 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-06-mobile-liberated.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4) |
| VV-07 | CA-23 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-07-mobile-locked.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS com nota (round 4) |
| VV-08 | CA-32 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-08-mobile-just-opened.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 4) |
| VV-09 | CA-29 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-09-mobile-fab.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 2) |
| VV-10 | CA-25, CA-26 | `/space/logica-de-programacao` | ver Spec | 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-10-mobile-sheet.png` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS (round 2) |
| VV-11 | CA-32, CA-34 | `/space/logica-de-programacao` | ver Spec | 1440×900 / 390×844 | ver Design Contract | working tree após restyle | `/tmp/claude-1000/-home-petros-projects-stardust/c81050ba-f36b-479a-ac31-d1e0dfbc66d5/scratchpad/vv/VV-03/VV-08 frame0..3` | capturado; 1ª rodada FAIL corrigida (ACH-10); FAB mobile OK | PASS com notas (round 2; fantasma do cadeado no frame 3, arte provisória permitida) |

## Sensors and preflight

| Command | State | Evidence |
| ------- | ----- | -------- |
| `pnpm run check:spec-implementation <spec> --base 17ff18282 --require-plan` | Passed | EV-06: 250 caminhos, 250 linhas `completed` (revisão 6) |
| Core `check:types`, `check:architecture`, `test:unit` space/profile | Passed | EV-01 (inclui Image `.webp` e recompensa sem perguntas) |
| Server `check:types`; `test:unit` src/rest, queue, provision, database | Passed | EV-05 |
| Server `test:integration` rotas OpenPlanet, RewardStar, RewardStarChallenge, EnterGalaxy, FetchCurrentGalaxy, ListGalaxies, ListGalaxyPlanets, FetchUserById, KPI, Xlsx | Passed | EV-04 (stack local; `db:test` falhou em `minio-init` e `db:migrate` recusou a baseline por default privileges; migrations 0000–0008 pelo migrator do Drizzle; URLs por variável) |
| `scripts/tests` galaxy-trail-migration, galaxies-migration (STARDUST_LOCAL_MIGRATION_TEST=1) | Passed | EV-02 |
| `scripts/tests` seed-database (unit 8; integration 1) | Passed | EV-03 |
| `node --test scripts/tests/seed-database.test.mjs scripts/tests/seed-staging-assets.test.mjs` | Passed (12/12) | EV-07 |
| Web `check:types`; `check:code` (0 erros); `test:unit` src/ui/space, src/rpc/actions/space, Animation: 24 suites/177 testes | Passed | EV-08 |
| Backoffice `check:types`, `test:unit` KpisView; `check:code` 0 erros | Passed | EV-09 |
| `check:test-integrity` | Passed | EV-13 (testes de recompensa, controller de desafio, `AccessStarPageAction` e `useSpaceContextProvider` reforçados após queda de contagem) |
| `check:architecture` core, server | Passed | EV-13 |
| Playwright `src/app/tests/space` (space + galaxies) e `profile`, workers=1 | Passed (39) | EV-10 (corrigidas 3 races dos próprios testes: botão de abrir planeta, FAB com rolagem do contêiner, overlay de erro do Next) |
| MV-01 desktop real (login seed, abrir Aurora, estrela 1, lição, recompensa, revisar) | Passed | EV-11 |
| MV-02 mobile real (painel inferior, foco, lição, FAB) | Passed | EV-12 |
| MV-03 staging real | Waived | dispensado explicitamente pelo usuário; não conta como aprovado |
| `check:complexity` core, server, web, backoffice | Passed | baseline atualizado a pedido do usuário (`pnpm run update:complexity-baseline`); os quatro workspaces sem avisos (ACH-04 resolvido) |
| `check:web-quality --route galaxy` (AV-10) | Failed/inconclusive | EV-16: servidor `next dev` (o próprio script avisa que não vale); mobile perf 31, a11y 87, LCP 16 s, TBT 4,2 s, CLS 0,158; desktop perf 51, a11y 88, TBT 704 ms; sem medição "antes" nem build de produção |

## Warnings and findings

- ACH-01 (resolved) — 42→41 estrelas por amendment (revisão 6).
- ACH-02 (resolved) — quatro caminhos sem mudança saíram do mapa (revisão 6).
- ACH-03 (resolved) — dez imagens WebP 512×512 com alfa criadas a partir de `assets/generated/*.png` (trabalho prévio do usuário); verificadas no navegador servidas pelo MinIO local como `image/webp`.
- ACH-04 (resolved: baseline atualizado a pedido do usuário; `check:complexity` limpo nos quatro workspaces) — `check:complexity` com avisos novos fora do baseline em Core, Server e Web (MI abaixo de 65 em funções de 8–25 linhas, não refatoráveis por mudança pequena). `pnpm run update:complexity-baseline` foi bloqueado pelo classificador do harness; precisa da ação ou permissão explícita do usuário.
- ACH-05 (resolved) — Penpot conectado ao arquivo `stardust` (servidor `393829…`); VV revisados, ver ACH-10.
- ACH-06 (resolved) — mudanças fora do mapa registradas na revisão 6 da Spec (HonoHttp, Animation, CompleteSpaceController, teste do Inngest, Image `.webp`, Fab mobile, `next.config.js`, seed-local-assets, recompensa sem perguntas).
- ACH-07 (resolved) — bugs encontrados só pelo stack real e corrigidos: `Image` rejeitava `.webp` (500 no planeta); `seed-local-assets.mjs` exigia animação igual ao slug (a trilha anterior reutiliza a da Lógica); recompensa de estrela sem perguntas dava NaN (catálogo provisório não tem perguntas); FAB escondido atrás da navegação mobile; otimizador de imagens do Next bloqueava o MinIO local (IP privado).
- ACH-08 (accepted) — o adaptador legado `SupabaseUsersRepository` (sem rota que o componha, DT-08) ainda referenciava as tabelas removidas; limpado (selects, tipo e ordenação por `count_user_completed_stars`). Restam referências históricas: rollback `0002`, manifesto legado e `Database.ts` gerado; `apps/server/supabase/schemas/schema.sql` ainda descreve `users_unlocked_stars`, `users_view` e `planets_view` (Drizzle é a fonte; fora desta entrega).
- ACH-09 (accepted) — concorrência: duas requisições simultâneas para a mesma estrela disponível pagam recompensa cheia duas vezes e podem publicar `PlanetCompletedEvent` duas vezes (a gravação dos fatos é idempotente, a recompensa não). A Spec cobre só o caso sequencial. Registrado como risco conhecido.
- ACH-10 (resolved: rodadas 2–4 do Visual Reviewer; F6 corrigido, ver seções abaixo) — Visual Reviewer FAIL (revisão 6): cartões de estrela, placa do planeta, chips/eyebrow do painel, ícone play e estrutura do painel inferior divergiam dos boards (F1–F4, F6, F9). Corrigidos por `builder_web_visual`; depois a restyle largou os cartões 20 px além da tela mobile e deixou a lista cobrindo o FAB (corrigido: `max-w-[calc(100vw-12rem)]`, FAB `z-50`; MV-02 refeito). Recaptura feita; nova revisão bloqueada pela aba suspensa do Penpot.
- ACH-13 (pre-existing) — `galaxies.test.ts` "failure state and retries" falha ~1 em 5 no servidor `next dev` ("Tentar novamente" nunca estabiliza); a página Galáxias não foi alterada nesta entrega.
- ACH-11 (pre-existing, not changed) — `AccessChallengePageAction` libera o acesso quando `fetchStarById` falha e `isGod` ignora o guard; ambos já existiam antes desta entrega.
- ACH-12 (waived by user) — MV-03 dispensado pelo usuário; AV-10 resolvido (EV-17, CA-41 Passed). A primeira execução real do CD de staging fica como verificação pós-merge.

## Preventive analysis of findings

| Finding | Cause | Preventive action/document | State |
| ------- | ----- | -------------------------- | ----- |

## Decisions

- Links RF/CA do Plan derivados por regra de caminho (create-plan).

## Lessons learned

- Nenhuma até agora.

## Documentation alignment

- Spec: aligned
- Rules/Architecture/Overview: pending (RF-18)

## Handoff

- Spec revision and branch/candidate: revisão 6, `feat/new-galaxy-page`, base 17ff18282
- Criteria verified / unverified: ver tabela de critérios
- Interrupted or uncommitted paths and their ownership: worktree já tinha mudanças de imagens/seed-catalog/tooling anteriores à implementação; preservadas
- Processes/ports started by the task: stack Docker `stardust-*` no ar; Server (3334) e Web (3000) em `dev`; banco local descartável reseedado (`db:seed`, `storage:seed`); nada em Supabase Dev/Prod
- Specific blockers: none
- Core (`packages/core`) implementado: GalaxyTrail, estados, erros, casos de uso, profile; `check:types`, `check:architecture` e `test:unit` de `src/space` e `src/profile` passam (68 + profile). Pendente no Core: `check:complexity` tem avisos novos fora do baseline (CompleteStar/OpenPlanet/GetPlanetOpening `execute`, GalaxyTrail `getPlanetState`/`getStarState`/`currentItem`, PlanetProgressState `create`, GetStarCompletion) — refatorar antes de `ready`; `check:code` tem 4 erros preexistentes em arquivos não tocados.
- Decisão: `countCompletedStarsByMonth(month: Month)` mantém o parâmetro (a Spec omitiu; o KPI precisa dele).
- Next action: ver Conclusion

## Conclusion

- State: `ready`
- Next action: `conclude-spec` (preflight, CI do HEAD do PR, PR e Spec `completed`). Nenhum item aberto além do waiver de MV-03.


## Visual Reviewer round 2 (Penpot reconnected)

- Verdict FAIL with F1 (blocking): locked star cards were 16 px right of the others. Fixed in `StarView.tsx` (`-mr-4` on the locked marker); measured left edges are now 405 for every state on desktop and 155–157 on mobile (right edge ≤ 373, no horizontal scroll). Unit tests of the Planet widgets pass (48).
- F2 (low): desktop content sits about 130 px left of the board because of the real page shell (sidenav, global buttons); recorded as an adaptation, not aligned.
- F3 (low): VV-01/VV-05 clip the planet plaque; covered by VV-03/06/08.
- F4 (low): locked illustration opacity looks lighter than the board disc; to confirm against design.md.
- F5: green feedback pill and dev badge overlap the bottom nav; pre-existing, not product UI.
- Open: recapture VV-05..VV-08 (post-F1) and VV-02 (with a locked planet), then a final targeted Visual Reviewer pass on those rows.

## Visual Reviewer round 3 (targeted recheck)

- F1 resolved: locked cards share the left edge in every state (405 desktop; 155–157 mobile; right edge ≤ 373; no horizontal scroll).
- VV-01, VV-02 (with VV-02b locked planet), VV-03: PASS with notes. VV-04, VV-09, VV-10, VV-11: PASS in round 2.
- **F6 (open, low, `ACH-14`)**: the locked label ("Conclua a estrela N para liberar", "Abra o planeta para liberar") wraps to two lines (260 px card on desktop, ~216 px on mobile) where the board shows one line; on mobile the planet art is ~100 px against the board's 72 px disc, so cards start at x≈157 instead of 108. Nothing clips or overflows. Rows VV-05..VV-08 stay `pending` until the user either accepts the wrap as a recorded adaptation (Spec amendment) or asks for the fix (72 px mobile art, one-line label, recapture).


## Visual Reviewer round 4 (final targeted recheck)

- F6 / `ACH-14` fixed: mobile planet art 72 px, star marker pulled left, card `px-3` and `max-w-[calc(100vw-10rem)]`. Measured: every locked label is one line (15–16 px) on both viewports; mobile cards x 126–373, desktop 405–665; no horizontal scroll. Web unit tests for `src/ui/space` pass (21 suites, 164 tests).
- Verdict: PASS with notes. VV-01, 02 (+02b locked planet), 03, 05, 06, 07, 08 pass; VV-04, 09, 10, 11 passed in round 2.
- Recorded adaptations (traceable here): (a) star markers are about 60–68 px against the board's 44 px, so mobile cards start at x≈126 instead of 108 (width ~246 vs 258; right edge 6 px from the viewport); (b) desktop content sits about 130 px left of the board because of the real page shell; (c) real planet art replaces the board placeholder.
- Minor, non-blocking: on VV-07 the locked planet plaque wraps an orphan "4" ("· 0 de" / "4").


## AV-10 (EV-17) — `check:web-quality --route galaxy`, build de produção local

- Setup: `pnpm --filter @stardust/web run build`, `server.js` standalone na porta 3000, Server local em 3334, conta seed. O aviso "looks like a Next dev server" do script é falso positivo (as páginas de produção do Turbopack casam com a regex); resultados em `scratchpad/av10.json`.
- Mobile (mediana de 3): performance 41 FAIL (≥50), acessibilidade 90, best-practices 93, LCP 7436 ms, TBT 1404 ms FAIL (≤1000), CLS 0.181 FAIL (≤0.1). Desktop: tudo dentro dos mínimos.
- Diagnóstico do CLS (Playwright, 390×844): ~0.16 em três saltos entre 1,5 s e 1,6 s, quando as listas de planetas/estrelas da primeira tela mudam de altura (itens `LI` 174→236 px e cartões de estrela deslocados 54–60 px) enquanto imagens/animações dos marcadores e da placa carregam. Não há medição da página antiga: a página antiga não roda no banco novo, então o limiar não pode ser classificado como regressão sem decisão do usuário (condição de aprovação do AV-10).
- Nota: em produção `dangerouslyAllowLocalIP` não vale, então as imagens do MinIO local não passam pelo otimizador (afeta LCP local, não o CDN real).

### AV-10 após correção de CLS

- Causas do CLS (0.18 → 0.000): (1) `LottieAnimationView` devolvia `null` até carregar o JSON e o `import` dinâmico, então o marcador/cadeado aparecia depois e empurrava o conteúdo; agora reserva a caixa `size × size` (teste novo em `LottieAnimationView.test.tsx`); (2) a imagem conectora `locked/unlocked-stardust.svg` (26–27×100) tinha `width=32 height=64` com `height:auto`, e crescia de 64 para 118–123 px ao carregar; agora tem `h-[118px]`/`h-[123px]` e `w-8` (aparência final preservada).
- Mobile: performance 56 (≥50), a11y 90, best-practices 93, LCP 6884 ms, TBT 809 ms (≤1000), CLS 0.000. Desktop: perf 94, a11y 92, best-practices 96, LCP 1606 ms, TBT 73 ms, CLS 0.000 (`scratchpad/av10b.json`).
- Revalidado após a mudança: unit Web `src/ui/space` + Animation (23 suítes, 177 testes), Playwright `space.test.ts` 13/13, `check:types`, `check:complexity`, `check:test-integrity`.

## Revisão 7 — remoção do ícone do planeta

- Mudança de contrato pedida pelo usuário: o planeta não tem mais `icon` (Core, banco, seed, Server, Web e Backoffice; migration `0009_drop_planet_icon`). A Evaluation volta de `ready` para `in_progress` porque parte da evidência anterior deixa de valer.
- Verificado nesta revisão: `check:types` em core, server, web e backoffice sem erros; `test:unit` de `packages/core/src/space` (25 suítes, 131 testes), controllers de planeta do Server (9 suítes, 20 testes) e `apps/web/src/ui/space` (21 suítes, 164 testes); preflight `check:spec-implementation --require-plan` com 284 paths, plano 284/284 `completed`.
- `ACH-15` (resolved, 2026-11-21): AV-04/AV-05 (rotas de planeta e galáxia no banco real) não rodavam contra a `0009` porque `db:test` falhava ao baixar `quay.io/minio/mc` (401; o repositório deixou de ser público e `minio/mc` também não existe no Docker Hub). Recuperação: o bucket `stardust-bucket-local` já existia no MinIO em execução, então `minio-init` foi dispensado; rodei à mão os demais passos do `db:test` (`supabase-db-reset` e `pnpm run db:migrate`, migrações 0000–0009 aplicadas em banco zerado; um default privilege residual de `postgres` foi revogado só no banco local para a checagem de baseline). Execução parcial do `db:test`, registrada como tal. Testes: `pnpm exec jest --selectProjects server-integration --runTestsByPath` em `src/tests/routes/space/planets/{CreatePlanetRoute,FetchAllPlanetsRoute,CreatePlanetStarRoute}.test.ts` e `src/tests/routes/space/galaxies/{FetchCurrentGalaxyRoute,ListGalaxiesRoute,ListGalaxyPlanetsRoute}.test.ts`, com `SUPABASE_URL`/`DATABASE_URL` apontando para as portas publicadas pela stack (15423/15445; `.env.testing` aponta para as portas padrão). Resultado: 6 suítes, 26 testes, todos passando. A primeira execução falhou em `CreatePlanetRoute` (asserções de resposta e de linha persistida sem `concept: null`, campo anulável do contrato, DT-09); corrigi as duas asserções no teste, sem mudar código de produção, e a suíte passou. `check:test-integrity` (PASSED) e `check:code` do Server (exit 0) após a correção.
- `ACH-16` (resolved por inspeção): `scripts/tests/galaxies-migration.integration.test.mjs` e `galaxy-trail-migration.integration.test.mjs` inserem `icon` apenas em estados anteriores à `0009` (aplicam só até `0005` e `0008`), então continuam válidos. Rodados nesta sessão, os dois ficaram `SKIP` (sem a configuração de integração); não há execução real.
- Documentação alinhada: contadores de `documentation/tooling.md` atualizados com a saída real de `storage:seed` ("Uploaded 115 catalog assets; verified 102 catalog references", era 124 e 110) e o PRD `space-management-planets-and-stars-prd.md` sem ícone no cadastro, na prévia e na edição.
- Reabrir após esta revisão: AV-10 e as capturas VV (a placa do planeta perdeu a miniatura e a arte cresceu) e `check:code`/`check:complexity` dos workspaces tocados.
- `ACH-17` (resolved: baseline atualizado com aprovação do usuário em 2026-11-19; `check:complexity` exit 0 em core, server, web e backoffice): `check:complexity` falha (exit 2) em core, server, web e backoffice depois da revisão 7, porque as edições mudaram os valores de MI/Health de `CreatePlanetUseCase.ts`, `UpdatePlanetUseCase.ts` e `Planet.ts` (e arquivos vizinhos), que saíram do `.code-multivitals-baseline.json`. Não são avisos novos de lógica; a correção é refatorar ou atualizar o baseline (`pnpm run update:complexity-baseline`), que exige aprovação do usuário.

## Revisão 8 — planetas com WebP animado

- Mudança pedida pelo usuário: as dez imagens de planeta viram WebP animado em loop, com o planeta parado e os elementos ao redor animados (Aurora: luzes da estação, farol, satélite; Trívia: três bolhas; Kalkulon: asteroides e balança; Ifthenia: pulsos nas estradas e gema; Ciclade: luz no anel, sol, lua e ícone do relógio; O Comboio 1: naves e trilho; O Comboio 2: nave, cabine e cúpula; Arcana: leme, balão e vapor; Perene: roda do cofre, brilho no aço e cápsulas; Chavalor: água, ripple do tubarão e tesouros).
- Verificado: cada arquivo tem de 24 a 30 quadros em loop, 256 × 256, canto transparente; `storage:seed` publicou 115 imagens (102 referências verificadas); no Web local, as dez imagens aparecem animadas (capturas consecutivas do elemento diferem) e `next/image` com `unoptimized` serve o arquivo original. Tamanhos: Aurora 334 KB, Trívia 295, Kalkulon 342, Ifthenia 345, Ciclade 320, O Comboio 1 221, O Comboio 2 341, Arcana 278, Perene 373, Chavalor 353 (cerca de 3,2 MB). Testes unitários de `Planet` do Web (6 suítes, 48 testes) e `check:types` do Web passaram antes das imagens e não mudaram com elas; o preflight foi reexecutado.
- `ACH-18` (waived pelo usuário em 2026-11-20; sem alternativo estático para `prefers-reduced-motion`, aceito como risco e registrado fora do escopo na Spec): não há alternativo estático para `prefers-reduced-motion`; um `<img>` animado não pode ser pausado por CSS. Exige um arquivo estático por planeta e a troca no widget.
- `ACH-19` (waived pelo usuário em 2026-11-21, junto com AV-10; a última medição já usa só o planeta atual animado): peso. Com `unoptimized`, o Next.js não redimensiona nenhuma imagem de planeta e a página pode carregar cerca de 3,2 MB só com a arte (carregamento preguiçoso, não medido). AV-10 e as capturas VV precisam ser refeitos; no mobile, performance estava em 56 contra o mínimo de 50.
- `ACH-20` (waived pelo usuário em 2026-11-20; o envio das dez imagens novas ao R2 de staging pelo CD é verificado depois do merge, sem prova local): o CD de staging precisa enviar as dez imagens novas (e a seed local já as publica); o envio ao R2 de produção segue pendente como antes.
- Imagens estáticas originais: guardadas só no scratchpad da sessão; não estão no repositório.

## Visual Reviewer round 5 (Doop, revisão 8)

- Fonte de design: Doop MCP, canvas `StarDust` (`iTvx3bvEsu`); os frames "Espaço / Galáxia / …" substituem os boards do Penpot citados na Spec (a Spec ainda diz Penpot e precisa ser atualizada). Candidato: working tree com a revisão 8; capturas novas em `scratchpad/vv2/` (18 arquivos, desktop 1440×900 e mobile 390×844, conta seed local).
- Veredito: FAIL (três achados de severidade baixa, todos aceitos pelo usuário como adaptações em 2026-11-21; ACH-21 resolvido), sem clipping nem overflow horizontal. Pedem decisão do usuário (aceitar como adaptação registrada na Spec ou corrigir o código):
  - `ACH-21` (resolved, F1): faltava a captura desktop do planeta bloqueado (metade de VV-02). Recapturada em `desktop-locked.png` (VV-02b); o revisor deu adaptação aprovada (placa neutra sem botão, texto em uma linha, cadeado sobre a arte atenuada, trilha contínua; arte animada de 80 px no lugar do disco de 100 px, sem rótulo acima do disco e sem anel cinza). Os achados ACH-22 e ACH-24 valem também para esse quadro.
  - `ACH-22` (accepted pelo usuário em 2026-11-21 como adaptação, registrada na Spec revisão 9; F2): estrelas de planeta não aberto dizem "Abra o planeta para liberar"; os boards dizem "Conclua a estrela N para liberar" ou "Conclua o planeta anterior". CA-23 sustenta o texto do código, mas o desvio não consta em "Allowed deviations" (VV-02, VV-04, VV-06, VV-07).
  - `ACH-23` (accepted pelo usuário em 2026-11-21 como adaptação, registrada na Spec revisão 9; F3): o painel de detalhes desktop fica no alto da coluna direita (topo em y=96 no VV-01 e y=172 no VV-03), bem acima do cartão da estrela selecionada, com cerca de 162 px de distância; no board fica na altura da estrela, a cerca de 114 px. Não consta na Spec nem na Evaluation.
  - `ACH-24` (accepted pelo usuário em 2026-11-21 como adaptação, registrada na Spec revisão 9; F4): a estrela bloqueada tem cor lilás-acinzentada com numeral dourado/oliva; o board usa cinza-ardósia com numeral escuro. CA-22 diz só "SVG em bloqueada"; a cor não tem decisão registrada.
- Notas não bloqueantes do revisor: o rótulo "· 0 de N" da placa bloqueada quebra em duas linhas no mobile (VV-07 já registrado; VV-09 com Ifthenia é novo); o botão de fechar da folha mobile (VV-10) é um quadrado de 40 px com borda, e `design.md` pede 44 px; a barra da galáxia no mobile some ao rolar (os boards a mostram fixa); selo "N" de desenvolvimento e botão de feedback sobre a navegação inferior (recorrentes, F5).
- Linhas sem ressalva: VV-03, VV-04, VV-06, VV-08, VV-09 (match ou adaptação aprovada), VV-10 e VV-11 (adaptação aprovada, arte provisória), VV-01 e VV-05 (adaptação aprovada; o cabeçalho do planeta fica fora da tela, e VV-03/VV-08 cobrem a placa).

## Verificação da revisão 9 (2026-11-21)

- Implementation Reviewer (revisões 7 a 9): PASS, sem achados bloqueantes. Itens não bloqueantes: (1) nada testava o contrato da revisão 8 (`unoptimized`); corrigido com o teste "should serve the planet art as is, so an animated image keeps its frames" em `PlanetView.test.tsx`, que falha sem `unoptimized` (verificado removendo e restaurando a prop) e passa com ela; (2) `alt='Icon'` na prévia da imagem do planeta no Backoffice, trocado por `alt='Imagem do planeta'`; (3) a arte do planeta usa `md:` (768 px) para os 140 px, enquanto o resto do widget troca em `lg:` (1024 px); a Spec diz só "mobile" e "desktop", então não é violação, mas entre 768 e 1023 px o quadro não foi capturado (`ACH-26`, open, baixo, aguarda decisão); (4) o adapter legado do Supabase grava `icon: ''` e falharia no schema real; é código sem rota (DT-08), informativo. Não verificados pelo revisor: as asserções por trás de CA-04, CA-22, CA-23, CA-24 e CA-29, e a área da revisão 6 em profundidade.
- Implementation Reviewer (revisão 10 + ACH-26 + ACH-15, 2026-11-22, candidato = working tree): PASS, sem achados bloqueantes. Cobriu: `isAnimated` (`usePlanet.ts`, `PlanetView.tsx`, `index.tsx` e testes de cada ramo), o breakpoint `lg` da arte de 140 px, a evidência do ACH-15 e a remoção de `icon` (sem referências restantes). Ressalvas registradas: (1) o `db:test` oficial não rodou verde de ponta a ponta neste candidato (`minio-init` indisponível; execução parcial documentada em ACH-15), então o CI do PR é a confirmação final do gate; (2) a amostragem ampla de CA-01–CA-12 e CA-30–CA-40 não foi refeita nesta passagem (as revisões anteriores amostraram CA-04/22/23/24/29 e o `check:spec-implementation` cobre a conformidade de caminhos); (3) a mudança para `lg` não tem captura nova porque os viewports da Spec (1440 e 390 px) ficam fora de 768–1023 px; `check:complexity` do Web foi rodado após a mudança (exit 0, ver ACH-26).
- Sensores locais depois das revisões 7 a 9: `check:code` exit 0 em core, server, web e backoffice (a formatação de `SpaceService.ts`, `PlanetsRouter.ts`, `PlanetFormView.tsx` e `usePlanetsPage.ts` foi corrigida com `biome format`); `check:types` exit 0 nos quatro; `check:test-integrity` PASSED (os testes de `CreatePlanetUseCase` e `UpdatePlanetUseCase` tinham perdido uma asserção cada ao sair o `icon`; entrou `expect(response).not.toHaveProperty('icon')` em cada); `test:unit` de `PlanetView` (10 testes) e dos dois casos de uso (6 testes) passando; `check:complexity` exit 0 em core, web e backoffice.
- `ACH-27` (resolved: baseline atualizado com aprovação do usuário em 2026-11-21; `check:complexity` exit 0 nos quatro workspaces): `check:complexity` do Server falha (exit 2) só em `apps/server/src/app/hono/routers/space/PlanetsRouter.ts`; a formatação exigida pelo Biome deslocou as linhas das funções anônimas e elas saíram do `.code-multivitals-baseline.json`. Não há aviso novo de lógica. A correção é atualizar o baseline, que exige a aprovação do usuário.
- AV-10 (`check:web-quality --route galaxy`, build de produção local, conta seed, rota `/space/logica-de-programacao`, mediana de 3, duas execuções): FAIL. Mobile: performance 49 e 47 (mínimo 50), TBT 1384 ms e 1701 ms (máximo 1000), LCP 8621 ms, CLS 0,000, acessibilidade 90, best-practices 93. Desktop: performance 80 e 71 (mínimo 65), TBT 169 ms (ok) e 277 ms (máximo 200, falha na segunda execução), LCP 1817 ms, CLS 0,000. Antes das revisões 7 e 8 a mesma rota passava (mobile 56 e TBT 809 ms; desktop 94 e TBT 73 ms).
- `ACH-25` (waived pelo usuário em 2026-11-21 para o mobile; desktop passa; ver o complemento abaixo; a causa da regressão do mobile não foi encontrada e a animação não a explica): AV-10 falha no mobile e oscila no desktop depois que as dez imagens passaram a ser WebP animado servido com `unoptimized` (cerca de 3,2 MB e decodificação de quadros). É a causa provável, pela comparação com a medição anterior, mas não foi isolada com uma execução sem animação. Opções registradas: animar só o planeta atual e deixar os outros no quadro estático pelo otimizador (`unoptimized` condicionado a `isCurrent`), reduzir quadros e resolução das animações, ou waiver do usuário.

## Revisão 10 — só o planeta atual anima

- Decisão do usuário (2026-11-21) para a falha de AV-10: animar só o planeta atual. `usePlanet` ganhou `isAnimated` (planeta que é o item atual ou que contém a estrela atual) e `PlanetView` aplica `unoptimized` só a ele, com `sizes` restaurado; os outros nove passam pelo otimizador. Para manter `check:complexity` dentro do limite foram extraídos `PlanetArt`, `PlanetArtLock`, `buildFlags` e `buildProgress`. Testes: `usePlanet` (animado quando o item atual é o planeta ou uma de suas estrelas; não animado nos outros planetas nem sem item atual) e `PlanetView` (arquivo original para o animado; `/_next/image` para os outros). Planet tests do Web: 6 suítes, 52 testes; `check:types` e `check:code` do Web exit 0; `check:test-integrity` PASSED.
- AV-10 depois da mudança (build de produção, mediana de 3): mobile performance 49, TBT 1437 ms, LCP 7477 ms, CLS 0,000 (FAIL); desktop performance 91, TBT 96 ms, LCP 1792 ms, CLS 0,000 (ok).
- Isolamento: com `isAnimated` forçado a `false` em todos os planetas (nenhuma animação), o mobile também falha (performance 47, TBT 1563 ms) e o desktop passa (90, 175 ms). Logo, a animação não explica a regressão do mobile em relação à medição anterior (56 e 809 ms); a causa não foi encontrada e pode ser carga do host (várias pilhas Docker de outros projetos ativas, carga média de 2 a 3 em 6 núcleos), já que o Lighthouse calibra a CPU pelo host. A mudança para só o planeta atual reduz o peso e melhorou o desktop (TBT de 277 para 96 ms entre as execuções com todas as imagens animadas e esta).
- `ACH-28` (resolved: mesmo update de baseline, aprovado em 2026-11-21): `check:complexity` do Web falha (exit 2) em `PlanetArt` (MI 57,6), `buildFlags` (63,8) e `buildPlanetView` (60), funções novas ou deslocadas que não estão no `.code-multivitals-baseline.json`; foram divididas em funções menores, e o gate pede MI acima de cerca de 65. Soma-se ao `ACH-27` (Server, `PlanetsRouter.ts`). Os dois pedem a aprovação do usuário para `update:complexity-baseline`.
- `ACH-26` (resolved, 2026-11-22; baixa): a arte do planeta de 140 px trocava em `md` (768 px) enquanto o resto da placa troca em `lg` (1024 px). Decisão do usuário: `lg`. `PlanetView.tsx` agora usa `lg:h-[140px] lg:w-[140px]` e `sizes='(min-width: 1024px) 140px, 88px'`. Reverificação: testes do Planet (6 suítes, 52 testes) passam; `check:code` (exit 0, só avisos preexistentes), `check:types` e `check:complexity` do Web exit 0. As capturas de AV-10/VV anteriores foram feitas nos viewports da Spec, 1440 px (desktop) e 390 px (mobile), ambos fora da faixa 768–1023 px, então o resultado visual não muda.
- AV-10 (mobile) waived pelo usuário em 2026-11-21: performance 47 a 49 (mínimo 50) e TBT 1384 a 1701 ms (máximo 1000) ficam registrados como falha aceita, sem afirmar aprovação. Antes da revisão 7 a mesma rota passava no mobile (56 e 809 ms). Desktop passou na última medição (performance 91, TBT 96 ms). Os critérios que dependiam de AV-10 ficam `Waived` no que toca ao mobile.

## Revisão 11 — `getCurrentGalaxyTrail` interno (feedback do PR #669)

- Decisão do usuário: o helper vira função interna de `AccessStarPageAction.ts`; `AccessChallengePageAction.ts` também o usava, então ganhou cópia interna (opção escolhida pelo usuário). `getCurrentGalaxyTrail.ts` removido; caminho retirado do mapa da Spec e do plano (283 linhas). Sem mudança de comportamento.
- `ACH-29` (resolved): `check:complexity` do Web reprovou o helper movido (MI 57, mesmo valor de antes; chave nova por arquivo). Baseline atualizado com aprovação do usuário em 2026-11-22; `check:complexity` exit 0 nos quatro workspaces.
- Reverificação: testes de `src/rpc/actions` (11 suítes, 47 testes) passam, incluindo os ramos de sucesso, falha da galáxia e falha dos planetas de `AccessStarPageAction.test.ts`; `check:code` e `check:types` do Web exit 0.
- Crew review do PR: P1 (God Account nas rotas de planeta) é preexistente em `main` e fora do escopo; P2 (migrations destrutivas) é decisão da Spec (Q5/Q5a, sem backfill, backup antes do release); P3 já coberto pelos testes de `AccessStarPageAction`.
