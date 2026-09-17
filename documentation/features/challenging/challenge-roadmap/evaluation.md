---
title: Avaliação do roadmap curado de desafios
spec: ./spec.md
spec_revision: 5
status: in_progress
base_commit: 0a50ce756b7d7df77c534e6825c7a8f35587fc3e
evaluated_commit: worktree-2026-09-16
last_updated_at: 2026-09-16
---

# Evaluation — Roadmap curado de desafios

## Escopo e estado

- Spec avaliada: `./spec.md`, revisão 5.
- Plan avaliado: `./plan.md`, revisão 5.
- Commit-base congelado: `0a50ce756b7d7df77c534e6825c7a8f35587fc3e`.
- Avaliação: worktree atual, com alterações ainda não commitadas; nenhum SHA
  final é afirmado.
- Estado: implementação integrada e validada por sensores automatizados, mas
  ainda não pronta para `conclude-spec` por causa da validação manual real
  parcialmente bloqueada, da auditoria visual/UI pendente e de findings de
  contrato HTTP/telemetria que exigem hardening Server.

## Ownership e waves executadas

| Wave | Assignment | Resultado |
| --- | --- | --- |
| 1 | C1 — Core/Validation | concluída; domínio, DTOs, ports, use cases, guards, schemas, fakers e testes; Reviewer pareado `clear` após correção do fallback de UUID |
| 1 | D1 — migration/seed | concluída; fixture local idempotente, migration estrutural, schema/RLS/policies, tipos gerados e verificação remota |
| 2 | S1 — Server/API | implementação concluída; rotas focadas 4/4 e sensores passaram; hardening e Reviewer final ainda pendentes |
| 2 | W1 — Web/UI | implementação concluída; Playwright com ServerMock 9/9 e build passaram; browser real/visual e Reviewer final ainda pendentes |
| 3 | C2/S2/W2 | em fechamento; C2 não encontrou novo diff necessário, S2/W2 aguardam Reviewer e evidência manual atual |

## Evidências dos critérios

| Critérios | Estado | Evidência |
| --- | --- | --- |
| CA-02..CA-08, CA-15, CA-17..CA-18 | verificado | testes Core/Validation, typecheck, code check focado, `db:test`, migration local/Dev e rotas focadas |
| CA-01, CA-09..CA-11, CA-13..CA-14, CA-19, CA-21 | verificado por automação; browser real pendente | unitários/views/hooks e Playwright Web 9/9 com ServerMock; falta confirmar o mesmo comportamento com API local autenticada |
| CA-12, CA-16, CA-20, CA-22..CA-24 | parcial | fixes de foco, query/storage, contexto, Handles, linear/mobile/reduced-motion e estrutura UI estão no worktree; faltam screenshots duráveis, auditoria UI Layer e inspeção real completa |
| CA-18 | parcial | repository omite/registra associações inválidas e testes de mapper/use case cobrem a regra; falta um cenário de rota dedicado com telemetria observável |

## Implementação verificada

- Core removeu o fallback de UUID para `recommendation.challengeSlug`; metadata
  de slug é obrigatório e validado.
- A migration estrutural cria as quatro tabelas, constraints, FKs `RESTRICT`,
  índices, trigger de imutabilidade, RLS, policies e grants. A fixture
  `20260916110000_seed_challenge_roadmap.sql` prepara o catálogo local de forma
  idempotente e não duplica o catálogo remoto.
- O Supabase Dev recebeu a migration versionada
  `20260916223842_create_challenge_roadmap`; a consulta de verificação confirmou
  1 revisão, 8 nós, 10 arestas, 20 associações `node_challenges`, 20 desafios
  curados e RLS/policies nas tabelas novas. Não foi usado reset/delete remoto.
- Mapper/repository são a fronteira de rows e `Database.ts`; routers compõem as
  dependências; controllers permanecem finos; GETs e guards de mutação têm
  cobertura focada.
- Web implementa rota pública, switch mapa/lista, mapa React Flow read-only com
  handles `source`/`target` explícitos,
  lista linear topológica, drawer filtrável, query `node`, viewport em
  `sessionStorage`, contexto de retorno, analytics sanitizado, retry isolado,
  `comingSoon`, estados de loading/error/empty/visitante/conclusão e reduced
  motion.
- `documentation/architecture.md` e `documentation/overview.md` foram
  atualizados depois da integração para refletir o fluxo implementado.

## Sensores e builds

| Comando | Estado | Evidência/limitação |
| --- | --- | --- |
| `npm run check:spec-definition -- documentation/features/challenging/challenge-roadmap/spec.md` | passed | Spec rev5 válida |
| `npm run check:plan-definition -- documentation/features/challenging/challenge-roadmap/plan.md` | passed | Plan rev5 válido |
| `npm run check:spec-implementation -- documentation/features/challenging/challenge-roadmap/spec.md --base 0a50ce756b7d7df77c534e6825c7a8f35587fc3e` | passed | 126 paths contratados presentes: 88 Create, 36 Modify, 1 Generate, 1 Remove |
| `npm run check:types` | passed | 7 workspaces; apenas warnings conhecidos do Studio sobre Node/Vite |
| `npm run test:unit` | passed | Core 179/661, Server 172/327, Web 136/511, Studio 13/58, além dos demais workspaces |
| `npm run check:test-integrity -- --json` | passed | `errors: []`, `untestedSourcePaths: 0` |
| `npm run check:architecture` | passed | 3735 módulos, 6648 dependências, sem violações |
| `npm run check:coverage` | passed | todos os workspaces acima do baseline; Server report foi gerado, embora o processo de coverage tenha sido interrompido após workers não encerrarem |
| `npm run check:complexity` | passed | baseline atualizado pelo comando oficial; Server e Web terminaram com 0 warnings/0 errors |
| `npm run check:code` | failed, não bloqueante desta Spec | os workspaces aplicáveis passaram; Web mantém dois erros preexistentes fora do escopo em `AnimatedRocketView.tsx` (hook condicional) e `useStar.test.ts` (hook aninhado), além de warnings preexistentes |
| `npm run db:test -w @stardust/server` | passed | reset local, fixture, migration estrutural e geração/verificação do stack local |
| rotas Server focadas | passed | 2 suítes, 7 testes; sucesso/visitante/404, 500 estrutural, 409 HTTP e telemetria injetada no Supabase local |
| Playwright Web focado | passed | 9/9 em `challenge-roadmap.pw.test.ts` e `challenges.pw.test.ts` com ServerMock |
| build Web | passed | build com `apps/web/.env.development` |

## Validação manual e visual

O fluxo real com Playwright foi executado com Server e Web locais, login por
variáveis exportadas pelo script oficial, acesso a `/space` e navegação para
`/challenging/roadmap` em desktop e mobile. O login retornou 200, o refresh
retornou 201, a rota protegida foi alcançada e a rota do roadmap retornou 200;
não houve `pageerror` nem `requestfailed`. A evidência, porém, não é verde:
as chamadas compartilhadas `GET /reporting/feedback/mine/unread-count` e
`POST /profile/achievements/.../observe` retornaram 401, gerando console errors
de autenticação fora do fluxo específico do roadmap. Por isso VM-03/VM-04 não
podem ser declaradas limpas.

Os screenshots temporários `/tmp/stardust-roadmap-desktop.png` e
`/tmp/stardust-roadmap-mobile.png` foram produzidos durante a inspeção, mas não
são evidência versionada. VM-01, VM-02 e VM-06 continuam pendentes até uma
comparação durável com `design/GJpSw.png`, `design/b081p.png` e a auditoria
estrutural da árvore UI.

## Reviewers e findings

- Core: Reviewer pareado rerun `clear`; o finding do fallback de UUID foi
  corrigido com regressão.
- Server: o Reviewer final anterior retornou `failed` com três blockers: não
  havia teste de rota integrado para 500 estrutural, teste HTTP de 409 para
  guards de mutação ou provider/spy de telemetria. Esses três pontos foram
  corrigidos no worktree e cobertos por uma suíte de rota 5/5; o rerun
  independente após esse último diff ainda não concluiu. Composition,
  schema/RLS, fixture local e complexity foram aceitos; permanece um workaround
  isolado `as never` em
  `SupabaseFeedbackReportsRepository.ts`, necessário porque o `Database.ts`
  oficial remoto não expõe o RPC legado; isso deve ser mantido como drift
  documentado, não ampliado.
- Web: o Reviewer final retornou `failed` antes do último fix local e apontou a
  recommendation linear/mapa, handles sem IDs explícitos, manual 401, ausência
  de comparação visual e UI Layer audit. A recommendation agora é derivada de
  `roadmap.recommendation.nodeKey`, os handles e `sourceHandle`/`targetHandle`
  têm IDs explícitos e três testes focados + Playwright 9/9 foram rerodados com
  sucesso; manual/visual/audit e rerun independente após o último diff
  permanecem pendentes.

## Ambiente remoto e segurança

- A solicitação do usuário autorizou editar/verificar o Supabase Dev; a
  migration foi aplicada uma única vez e as contagens/curadoria foram
  verificadas sem expor credenciais.
- O advisor remoto continua reportando RLS desabilitado em 35 tabelas legadas.
  Esse alerta `ACH-SEC-01` é pré-existente e fora do escopo desta Spec; não foi
  feita remediação global sem policies aprovadas. As tabelas novas do roadmap
  permanecem com RLS/policies próprias.

## Próximas ações obrigatórias

1. Repetir os Reviewers Server/Web após os últimos diffs de suas boundaries e
   registrar verdictos atuais.
2. Repetir o fluxo manual autenticado após estabilizar/diagnosticar os 401
   compartilhados, sem registrar tokens, cookies ou credenciais.
3. Produzir screenshots versionados nos viewports da Spec e concluir a UI Layer
   audit; se houver divergência intencional, abrir amendment antes de editar.
4. Somente depois atualizar o estado para `ready` e encaminhar a Spec a
   `conclude-spec`.

## Conclusão

Estado atual: `in_progress`. O comportamento principal está implementado e os
gates automatizados relevantes passam, mas o pacote ainda não tem evidência
manual/visual limpa nem Reviewers finais atuais suficientes para declarar
conformidade completa.
