---
title: Header e navegação lateral do layout Home no Widget Pattern — evaluation
spec: ./spec.md
plan: ./plan.md
spec_revision: 3
status: ready
base_commit: f6c66f636
evaluated_commit: f6c66f636 (working tree, uncommitted)
last_updated_at: 2026-11-17
---

# Evaluation — Header e navegação lateral do layout Home no Widget Pattern

## Evaluated scope

- Spec: `./spec.md`
- Plan: `./plan.md`
- Base commit: `f6c66f636`
- Evaluated commit: `f6c66f636` (candidato ainda não commitado; working tree sobre a base)

## Criteria evidence

| Criterion | Verification | Real evidence | Remaining work |
| --------- | ------------ | ------------- | -------------- |
| CA-01 | Passed | EV-02 (AV-01) | none |
| CA-02 | Passed | EV-02 (AV-01, AV-02), EV-06 (MV-01, MV-02) | none |
| CA-03 | Passed | EV-02, EV-06 (MV-01: Conquistas abre/fecha) | none |
| CA-04 | Passed | EV-02 (hook null-safe); `HomeNavigation/index.tsx` auditado | none |
| CA-05 | Passed | EV-02 (AV-03, `HomeHeaderView.test.tsx`, 5 testes), EV-04, EV-06 (`lottieCount` 0, ícone `fire` presente) | none |
| CA-06 | Passed | EV-04 (AV-04), auditoria estrutural | none |
| CA-07 | Passed | EV-04 (AV-04) | none |
| CA-08 | Passed | EV-06 (MV-01/MV-02 revisão 2: ids, `aria-controls`, rotas, Sair, gaveta, endpoints 200) | none |
| CA-09 | Passed | EV-02, EV-04, EV-05, `check:spec-implementation --require-plan` (32 linhas completed) | none |
| CA-10 | Passed | AV-03/AV-04 (EV-02, EV-04, `legacySvgImgs` 0); EV-07 (VV-01, VV-02 passed, Visual Reviewer PASS) | none |

## Reviews

### Spec Reviewer

- Verdict: `clear`
- Revision: `2` (revisão 1 também `clear`)
- Scope: compatibility with `architecture.md` and Rules before implementation
- Findings: none blocking (F-01 a F-04 resolvidos na Spec, ver histórico de revisões)

### Implementation Reviewer

- Verdict: `PASS`
- Commit: working tree sobre `f6c66f636` (sem commit)
- Findings: nenhum bloqueante. 3 `low` e 1 `info`, todos sem ação: (1) o retorno `null` sem usuário nos Entry Points não tem teste unitário (a metade do hook tem; o Entry Point fica coberto pela auditoria estrutural, como a Spec permite); (2) `SidenavButton` é mockado em `SidenavView.test.tsx`, então `isActive` é verificado via `data-active` e o estilo real só nas capturas MV; (3) `useHomeHeader.test.ts` não cobre o reexecução por mudança de `user`/`ref`, paridade com a dependência exigida pela Spec; (info) a ordem de empilhamento (DT-01) conferida na estrutura, com prova real nas capturas.

### Visual Reviewer

- Verdict: not applicable (sem Design Contract, DT-03/Q3)

| Gate | State | Evidence |
| ---- | ----- | -------- |
| UI Layer Audit | passed | ver Auditoria estrutural abaixo; sem teste de `index.tsx` |
| Penpot/Web comparison | not applicable | Spec sem Design Contract (Q3) |

### Auditoria estrutural (UI Rule)

| Widget | Entry Point | View | Hook | Resultado | Evidência |
| ------ | ----------- | ---- | ---- | --------- | --------- |
| `HomeNavigation` | `index.tsx:14-46`: resolve `useAuthContext`, `useNavigationProvider`, `useSidebarContext`; sem estado, efeito ou handler | `HomeNavigationView.tsx:29-62`: só compõe `Sidenav` e `Sidebar` | `useHomeNavigation.ts:37-60`: `function`, parâmetros, sem context | passed | diff, AV-01, AV-02, AV-04 |
| `HomeHeader` | `index.tsx:11-34`: resolve `useAuthContext` e `useSidebarContext`; `useRef` apenas (DT-06) | `HomeHeaderView.tsx` (sem diff) | `useHomeHeader.ts:12-17`: `function`, recebe `user`, sem context | passed | diff, AV-03, AV-04 |
| `Sidenav` | `index.tsx:3`: alias `export const Sidenav = SidenavView` | `SidenavView.tsx` (sem diff) | n/a | passed | diff, AV-04 |
| `SidenavButton` | `SidenavButton/index.tsx:3`: alias da View | `SidenavButtonView.tsx` (sem diff) | n/a | passed | diff, AV-04 |
| `Sidebar` | `index.tsx:3`: alias `export const Sidebar = SidebarView` | `SidebarView.tsx` (sem diff) | n/a | passed | diff, AV-04 |

## Manual and visual inventory

Sem Design Contract: não há linhas `VV-*`. A prova visual é a comparação das capturas "antes"
(`apps/web/test-results/home-navigation/before/`, base `f6c66f636`) com as "depois"
(`apps/web/test-results/home-navigation/after/`), ambas com o aluno seed `explorer@stardust.local`,
mesma seed e viewports 1440×900 e 390×844. A pasta `test-results` é ignorada pelo Git.

| MV/VV | CA | Surface/route | State | Viewport | Penpot board | Candidate | Artifact | Observed result | Reviewer disposition |
| ----- | -- | ------------- | ----- | -------- | ------------ | --------- | -------- | --------------- | -------------------- |
| MV-01 | CA-02, CA-03, CA-05, CA-08 | `/space` → `/notes` | sidenav recolhida/expandida, conquistas aberta/fechada, diálogo Sair, Notas | 1440×900 | n/a | working tree sobre `f6c66f636` | `before/desktop-1..6` × `after/desktop-1..6` | EV-03: verificações iguais; nav e header idênticos pixel a pixel | PASS (Implementation Reviewer, sem Visual Reviewer) |
| MV-02 | CA-02, CA-08 | `/space` → `/notes` | gaveta fechada/aberta/fechada por botão e por container | 390×844 | n/a | working tree sobre `f6c66f636` | `before/mobile-1..5` × `after/mobile-1..5` | EV-03: verificações iguais; gaveta com a mesma composição | PASS |

## Sensors and preflight

| Command | State | Evidence |
| ------- | ----- | -------- |
| `pnpm run check:spec-implementation <spec> --plan-only` | passed | 20 paths, 20 linhas pending (create-plan) |
| AV-01/02/03 `pnpm --filter @stardust/web run test:unit -- <5 arquivos>` | passed | 5 suites, 23 testes (EV-02) |
| AV-04 buscas estáticas + diff das Views | passed | 3 buscas vazias; sem diff nas Views e nos `Animated*` (EV-04) |
| `pnpm --filter @stardust/web run format` | passed | 2 arquivos reformatados (apenas espaços) |
| `pnpm --filter @stardust/web run check:code` | passed | exit 0, 0 erros; avisos de lint pré-existentes (179), dois deles novos em `useHomeNavigation.test.ts:21` e `useHomeHeader.test.ts:15` (`useHookAtTopLevel` no helper `Hook()` exigido pela Rule; mesmo aviso já existe em `useChallengesNavigationSidebar.test.ts:30`) |
| `pnpm --filter @stardust/web run check:types` | passed | `tsc --noEmit` sem erros |
| `pnpm --filter @stardust/web run check:architecture` | passed | 1669 módulos, 0 violações |
| `pnpm run check:test-integrity` | passed | 5 testes alterados, base `f6c66f636` |
| `pnpm --filter @stardust/web run check:complexity` | passed | falhou antes (exit 2, 6 avisos de MI, ACH-01); após `pnpm run update:complexity-baseline` aprovado pelo usuário: 0 avisos, 0 erros, exit 0 |
| `pnpm run check:spec-implementation <spec> --base f6c66f636 --require-plan` | passed | 20 linhas `completed`, Create 9, Modify 8, Remove 3 |
| Testes de integração Playwright da Web | not applicable | rotas, middleware e `ServerMock` não mudam |
| `check:coverage` / `test:coverage` | not applicable | CI; impacto não abrange o workspace |

### Evidências

- **EV-01 — Capturas "antes" (baseline).** Base `f6c66f636`, capturadas antes da primeira edição de código.
  Server `http://localhost:3334` e Web `http://localhost:3000` em dev, Supabase local (containers `stardust-*`
  reiniciados sem reset; seed existente). Conta: aluno seed `explorer@stardust.local`
  (`export-web-app-e2e-env.mjs --seed`). Script Playwright (Chromium) no scratchpad da sessão; saída em
  `apps/web/test-results/home-navigation/before/` (11 PNGs + `report.json`). Fatos do baseline, que a
  comparação "depois" deve reproduzir:
  - `#sidenav` e `#sidebar` existem (1 de cada); em 1440 a sidenav é visível e `#sidebar` oculto; em 390
    a sidenav fica oculta e `#sidebar` existe.
  - `aria-controls` do botão da sidenav é `sidenav` e do botão de menu do header é `sidebar`.
  - Rotas: Desafios `/challenging/challenges`, Loja `/shop`, Perfil `/profile/<slug>`, Aprender
    `/space/logica-de-programacao` (redirecionamento), Notas `/notes`.
  - Diálogo Sair abre (`alertdialog` presente) e é cancelado com `Escape`.
  - Mobile: gaveta abre pelo botão do header, mostra e-mail do usuário, **permanece aberta após Notas**,
    fecha pelo botão de fechar e pelo clique no container.
  - Observações do baseline, fora do escopo e a reproduzir na comparação: o clique de ponteiro no botão
    de alternar da sidenav em 1440 é interceptado pelo conteúdo da página (`z-50`, `md:pl-[136px]`), então o
    script o aciona pelo DOM; o indicador do Next dev cobre o botão Sair, que também é acionado pelo DOM;
    o console do desktop registra respostas 400 (recursos) nas navegações.
  - Limite: `GET /auth/account` é chamado no servidor (SSR) e não aparece nas respostas do navegador;
    o estado autenticado é provado pelo acesso às rotas protegidas e ao `/notes`.
- **EV-02 — Testes unitários (AV-01, AV-02, AV-03).** 5 suites, 23 testes passam: `useHomeNavigation.test.ts`,
  `HomeNavigationView.test.tsx`, `SidenavView.test.tsx`, `SidebarView.test.tsx`, `useHomeHeader.test.ts`.
  Os testes antigos `Sidenav.test.tsx` e `Sidebar.test.tsx` foram removidos; nenhum teste importa `index.tsx`.
- **EV-03 — Capturas "depois" e comparação (MV-01, MV-02).** Mesmo script, conta, seed e viewports de EV-01, no working
  tree, em `apps/web/test-results/home-navigation/after/` (11 PNGs + `report.json`). Todas as verificações do
  `report.json` são iguais às do baseline (ids, `aria-controls`, rotas, diálogo Sair, estados da gaveta, contagem de
  erros de console: 10 no desktop e 0 no mobile, iguais às de antes). Comparação por pixel: `desktop-6-notes` e
  `mobile-3/4/5` idênticas; nas demais, as diferenças ficam só no corpo da página (mapa espacial animado; a região do
  header, y<64, e a da sidenav, x<97 recolhida, ficam idênticas). Inspeção visual de `mobile-2-drawer-open` antes e
  depois: mesma composição; só o fundo de estrelas animado difere.
- **EV-04 — AV-04.** `rg useSiderbarContext apps` vazio; `rg` de contexts em `Sidenav/` e `Sidebar/` vazio; `rg` de
  contexts em `useHomeHeader.ts` e `useHomeNavigation.ts` vazio; `git diff --stat f6c66f636` das Views e dos `Animated*`
  sem alteração.
- **EV-05 — Complexidade.** `check:complexity --scope apps/web`: 6 funções com aviso só de índice de manutenibilidade
  (MI < 65): `HomeLayoutView` 56.5→55.7 e `HomeHeader` 52.4→51.7 (já no baseline, métrica levemente diferente, então
  reportadas), e novas `HomeNavigationView` 58.9, `HomeNavigation` 50, `getSidebarUser` 61.6 e `useHomeNavigation` 57.9.
  Dois avisos de `functionLength` (38 e 37 linhas) foram eliminados extraindo `getLinks` e `getSidebarUser` e
  reduzindo as desestruturações do Entry Point.

## Warnings and findings

- **ACH-01 — `check:complexity` falha por avisos de MI fora do baseline.** Impacto: o gate roda com `--max-warnings 0` e
  AV-05 exige zero avisos novos. Causa: todo Entry Point e View deste layout já está no baseline por MI (por exemplo
  `HomeLayoutView` 56.5, `HomeHeader` 52.4, `SidenavView`); as novas peças (`HomeNavigation`, `HomeNavigationView`,
  `useHomeNavigation`) e a variação de 0,7–0,8 em duas já existentes reproduzem o mesmo perfil. Refatoração não eleva
  uma View com 11 props acima de 65 sem mudar o contrato da Spec. Estado: **resolvido**. O usuário aprovou a atualização do baseline;
  `pnpm run update:complexity-baseline` regenerou `.code-multivitals-baseline.json` (entradas novas de `HomeNavigation`,
  `HomeNavigationView` e `useHomeNavigation`; saíram as de `Sidenav`, `Sidebar` e `useHomeHeader`; a de
  `getTrustedExecutionCounts`, alheia à entrega, saiu por não avisar mais). Nenhum limite foi relaxado.
- Observações do baseline reproduzidas no "depois" e fora do escopo: clique de ponteiro interceptado no botão da sidenav
  em 1440; gaveta mobile permanece aberta após Notas; 400s de recursos no console do desktop.

## Preventive analysis of findings

| Finding | Cause | Preventive action/document | State |
| ------- | ----- | -------------------------- | ----- |
| ACH-01 | Perfil de MI dos widgets de UI deste layout já acima do limite; gate sem tolerância | atualizar o baseline com aprovação; não mudar a Spec | completed |

## Decisions

- Containers Docker `stardust-*` estavam parados e foram religados com `docker compose up -d --wait`
  (sem `db:test` e sem reset), reaproveitando o banco local já semeado.

## Lessons learned

- Todo widget novo de UI no Web tende a cair no aviso de MI do `check:complexity`, porque Views e Entry Points ficam abaixo de 65. A atualização do baseline (aprovada pelo usuário nesta entrega) é parte da entrega de qualquer refactor de widget e deve ser prevista na Spec (nenhuma Rule alterada; avaliar se `tooling.md` deve dizer isso).

## Documentation alignment

- Spec: aligned (status `in_progress`, revisão 1)
- Rules/Architecture/Overview: not applicable (DT-05 registra o conflito `useNavigation` × `useNavigationProvider`, fora desta entrega)

## Handoff

- Spec revision and branch/candidate: `1`, `main`, base `f6c66f636` (sem commits novos)
- Criteria verified / unverified: CA-01 a CA-09 verificados; progresso de implementação em `plan.md` (20/20)
- Interrupted or uncommitted paths and their ownership: todo o candidato está sem commit (apps/web/src/ui/profile/** e `documentation/features/profile/home-navigation-widget-pattern/`)
- Latest reusable results and stale evidence: EV-01 a EV-05 atuais; qualquer edição de widget invalida EV-02/EV-03/EV-05
- Processes/ports started by the task and cleanup: Server `:3334` e Web `:3000` encerrados; containers `stardust-*` religados no início continuam rodando (estavam parados antes)
- Specific blockers: none
- Next action: `conclude-spec`

## Conclusion

- State: `accepted` (pronta para `conclude-spec`)
- Next action: `conclude-spec`

## Revisão 2 — evidências

| Check | Estado | Evidência |
| ----- | ------ | --------- |
| `test:unit -- src/ui/profile/widgets/layouts/Home` | passed | 5 suites, 26 testes (EV-02, inclui `SidenavView` com a direção do chevron e `HomeHeaderView.test.tsx`; `useHomeHeader.test.ts` removido com o hook) |
| `format`, `check:types`, `check:architecture` (1668 módulos, 0 violações), `check:test-integrity` | passed | exit 0 |
| `check:code` | passed | exit 0, 0 erros, 178 avisos pré-existentes |
| `check:complexity` | passed | antes: 2 avisos de MI/`HomeHeaderView` fora do baseline (ACH-02); após `update:complexity-baseline` aprovado (Q6): exit 0 |
| `check:spec-implementation --require-plan` | passed | 32 linhas completed (Create 9, Modify 15, Generate 1, Remove 7) |
| Buscas AV-04 | passed | sem `useHomeHeader|streakAnimationRef|Animation` em `HomeHeader`, sem `lucide` e sem `(learn|challenges|shop).svg` em `apps/web/src` |

- **EV-06 — MV-01/MV-02 revisão 2.** Web `localhost:3000` (`next dev --webpack`, polling; o Turbopack falhou com `OS file watch limit reached`),
  Server `localhost:3334` (`tsx` sem watch), Supabase local reiniciado sem reset, aluno seed. Script Playwright no scratchpad; saída em
  `apps/web/test-results/home-navigation/revision2/` (`report-desktop.json`, `report-mobile.json`, 13 PNGs). Desktop 1440×900: `#sidenav`/`#sidebar`
  existem, trilho visível e gaveta oculta; `aria-controls` `sidenav` e `sidebar`; rotas Desafios `/challenging/challenges`, Loja `/shop`,
  Perfil `/profile/explorer-seed`, Aprender `/space/logica-de-programacao`, Notas `/notes`; Conquistas abre; diálogo Sair presente;
  endpoints 200 (`/profile/users/id/…`, `/profile/notes`, `/shop/*`, `/challenging/challenges/list`); sem Lottie nem `<img>` dos SVGs removidos.
  Mobile 390×844: sidenav oculta, gaveta visível, abre pelo botão, Notas navega para `/notes`. Inspeção das capturas: trilho recolhido com
  capelo, terminal, loja e usuário em tiles verdes, caret de expandir, ícones de Notas e bandeira; header com moedas amarelas e chama cinza
  (dia não concluído) ao lado do número. Limites: `GET /auth/account` é SSR; console com 400 de recursos (já no baseline) e `pageerror`
  "negative time stamp" de `performance.measure` do `next dev --webpack`, sem relação com o candidato.
- **ACH-02 — baseline de complexidade (revisão 2).** `HomeHeaderView` (MI 44,9) e `HomeHeader` passaram a avisar após remover o hook;
  baseline regenerado com aprovação (Q6): entradas de `useHomeHeader`, `Sidenav/index`, `Sidebar/index` saíram; sem limite relaxado.
- **Ambiente.** Contêineres `stardust-*` estavam parados e foram religados com `docker compose up` (sem reset; `minio-init` não rodou por falha de
  pull de imagem; não afeta a navegação).

## Manual and visual inventory — revisão 2

| MV/VV | CA | Surface/route | State | Viewport | Penpot board | Artifact | Observed result | Disposition |
| ----- | -- | ------------- | ----- | -------- | ------------ | -------- | --------------- | ----------- |
| MV-01 | CA-02, CA-03, CA-05, CA-08 | `/space` → rotas e `/notes` | recolhida, expandida, conquistas, Sair | 1440×900 | n/a | `revision2/desktop-1..6` | passed (EV-06) | PASS (Implementation Reviewer) |
| MV-02 | CA-02, CA-08 | `/space` → `/notes` | gaveta aberta e Notas | 390×844 | n/a | `revision2/mobile-1..4` | passed (EV-06) | PASS (Implementation Reviewer) |
| VV-01 | CA-10 | sidenav recolhida | recolhida | 1440×900 | `sidebar` | `revision2/desktop-1-sidenav-collapsed.png` | EV-07: glifos, tamanhos e posições conferem | PASS (Visual Reviewer) |
| VV-02 | CA-10 | header | dia não concluído | 1440×900 | `Espaço / Cabeçalho` | `revision2/desktop-1-header.png` | EV-07: moedas e chama conferem; chama cinza por dia não concluído (RF-08) | PASS (Visual Reviewer) |

## Handoff

- Revisão 2; candidato é a working tree sobre `f6c66f636` (nada commitado). Todos os critérios provados exceto CA-10 (VV-01/VV-02).
- Bloqueio: o Penpot MCP não está ligado ao arquivo `stardust` (um servidor está ligado a `HMS`, os demais sem plugin). Ação necessária: reconectar o plugin
  no arquivo `stardust` (`node scripts/open-penpot.mjs <url>`), depois exportar os dois componentes e comparar. O Visual Reviewer roda em seguida.
- Processos iniciados pela tarefa: Web em 3000 (webpack), Server em 3334 e contêineres `stardust-*`; encerrar após a verificação.
- Nota: `status` permanece `in_progress` até CA-10 fechar.

## Revisão 2 — Implementation Reviewer

- Verdict: `PASS` (revisão 2, working tree sobre `f6c66f636`). CA-01 a CA-09 passam; CA-10 parcial: a metade estática passa, VV-01/VV-02 bloqueados.
- Findings: nenhum bloqueante. (1) `low`: `SidenavView.test.tsx` não verificava a direção do chevron. **Corrigido** (ACH-03): mock nomeado de `Icon` e dois
  testes (`simple-arrow-left` expandida, `simple-arrow-right` recolhida); 26 testes passam, `check:types`, `check:code`, `check:test-integrity`,
  `check:complexity` e `check:spec-implementation --require-plan` repetidos e passando. (2) `low`: sem teste de `NavLinkView`; a Spec dá a ele só AV-05/MV, sem ação.
  (3) `low`: typo `reative` pré-existente, fora de escopo. (info) CA-10 não deve ser dado como completo sem VV.
- Lições: nenhuma; sem mudança em autoridades.

## Revisão 2 — Visual Reviewer e EV-07

- **EV-07 — VV-01/VV-02.** Penpot MCP reconectado ao arquivo `stardust` (confirmado por `penpot.currentFile.name`); exports atuais de `sidebar`
  (88b85114…, 112×911) e `Espaço / Cabeçalho` (aaeac8e4…, 1328×88) comparados com `revision2/desktop-1-sidenav-collapsed.png` e `desktop-1-header.png`
  (1440×900, aluno seed, dia não concluído). VV-01: capelo, terminal, loja e usuário são os mesmos glifos Phosphor bold, 24 px, centrados nos tiles e na
  mesma ordem; caret de expandir `caret-right` escuro no círculo verde; bandeira igual. VV-02: moedas amarelas (~26 px) e chama (~24 px) ao lado do
  número, mesma ordem e alinhamento; a chama é cinza porque o dia não está concluído (RF-08), o verde do board é coberto por AV-03.
- Visual Reviewer: `PASS` (VV-01, VV-02). Limites: comparação a olho, sem medição de pixel; o ícone Sair (power) fica sob o indicador do Next dev na captura e é
  inalterado pela entrega; preenchimento do tile, largura, logo e Notas ficam fora (DT-10).
- Handoff: todos os critérios com prova atual; Evaluation `ready`. Publicação (commit, push, PR) não autorizada; `conclude-spec` aguarda.

## Conclusão (revisão 2)

- Branch de entrega: `refactor/home-navigation-widget-pattern`, criada de `main` (`f6c66f636`), que já era igual a `origin/main` (0 commits atrás após `git fetch`); sem merge necessário.
- Build: `pnpm --filter @stardust/web run build` passou (exit 0) no candidato final (EV-08).
- Publicação autorizada pelo usuário em resposta à pergunta "Run conclude-spec, which commits and opens the PR?"; `commit` e `open-pr` mantêm seus gates.

## Revisão 3 — `useHomeLayout` sem acesso a context

- **Motivo (ACH-04).** O apontamento P2 do Crew na PR 666: `useHomeLayout` acessava `useSidebarContext`, contra a Regra do Hook da UI Rule. A revisão 1 o mantinha como
  débito (DT-07); o usuário pediu a correção ("fix it") e também testes do hook e da View. Spec emendada para a revisão 3 (DT-07 e DT-09 revogadas), `plan.md` reconciliado
  (35 caminhos: Create 11, Modify 16, Generate 1, Remove 7).
- **Mudança.** `useHomeLayout` recebe `{ notifyUserChanges, isSidebarOpen, isAchievementsListVisible, onSidebarToggle, onAchievementsListHide }` e não acessa contexts;
  `Home/index.tsx` (`HomeLayout`) resolve `useSidebarContext`. Comportamento preservado (clique no container, notificação em 320 ms, transição de 4 s).
- **Testes novos (EV-09).** `Home/tests/useHomeLayout.test.ts` (6 testes) e `Home/tests/HomeLayoutView.test.tsx` (4 testes). Home: 8 suites, 44 testes passam.
- **Sensores (EV-09).** `check:types`, `check:code` (0 erros), `check:architecture` (0 violações), `check:test-integrity` passam; `rg` de contexts em `useHomeLayout.ts` vazio (AV-04);
  `check:complexity` passou após `update:complexity-baseline` (ACH-05: `HomeLayout` e `useHomeLayout` mudaram de métrica; só entradas do Home no diff, 20 linhas; refresh dentro da
  aprovação Q6, que cobre o baseline desta entrega).
- **Revisões da PR 666 (CI).** NavLinkView sem teste: corrigido (`NavLinkView.test.tsx`, 8 testes). Baseline com entradas fora do escopo: regeneração pelo script oficial, sem limite relaxado.
- Implementation Reviewer da revisão 3: ver resultado abaixo.
- **Implementation Reviewer (revisão 3):** `PASS`, sem findings bloqueantes; comportamento de `handleContainerClick`, notificação em 320 ms e transição de 4 s preservado. 3 `low` tratados: assertiva de "ainda visível em 3999 ms" e teste de desmontagem antes de 320 ms adicionados em `useHomeLayout.test.ts` (Home: 45 testes); o `any` nos mocks segue o padrão dos demais testes do Home e `check:code` passa.
