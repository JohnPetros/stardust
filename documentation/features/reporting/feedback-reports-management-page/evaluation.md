---
title: Acompanhamento conversacional de feedbacks no Studio
spec: ./spec.md
spec_revision: 4
status: in_progress
base_commit: cd927d32bcbc10811c222bc0e1fa22744dd1d60e
evaluated_commit: 8ed1e7be8
last_updated_at: 2026-08-04
---

# Evaluation — Acompanhamento conversacional de feedbacks no Studio

## Amendment corrente

Por decisão explícita do usuário, a revisão 4 remove RLS/grants e benchmark do
Contract. CA-26 foi retirado e CA-33 passou a exigir somente auth/authz na borda
e composição server-only. Os findings JI-01..JI-13 ligados a esses gates foram
supersedidos; não serão reabertos no Judge Final.

O amendment corrente também simplifica a entrega assíncrona: a outbox,
`FeedbackConversationTransaction` e o dispatcher foram removidos. Repositories
persistem diretamente e publicam no Broker após o save; jobs usam chaves
estáveis para idempotência básica. A janela de perda entre commit e Broker é
aceita por decisão explícita do usuário. A migration de cleanup remove a tabela
legada em bancos que já a tenham criado.

## Evidências correntes da implementação

- F1–F5 foram implementadas no worktree e estão em validação integrada; os
  sensores curtos de Core/Server/Studio executados até aqui passaram, com
  warnings preexistentes e o aviso de versão do Node no typecheck do Studio.
- F6-T1 passou: a persistência Supabase de reporting executou 4/4 testes,
  cobrindo persistência direta, anexos, idempotência, concorrência e cascatas.
  A referência obsoleta a `claimReportId` foi removida do teste de persistência.
- F6-T2 está verificado: não há artefatos de benchmark, P95 ou EXPLAIN no
  escopo corrente, conforme o amendment da revisão 4.
- F6-T3 foi tentado com Server em `3334` e Studio em `8001` porque `8000` estava
  ocupada. O transporte Playwright encerrou durante o login; portanto não há
  evidência válida de autenticação, `/dashboard`, `/profile/users` ou da rota de
  feedback. Este bloqueio permanece explícito e não é tratado como sucesso.
- Evidências automatizadas, de runtime e visuais permanecem separadas; a
  validação manual autenticada não é substituída por testes unitários ou mocks.

## Preflight local antes do PR

- `npm run check:code`: passou com warnings preexistentes nos workspaces.
- `npm run check:types`: passou; o Studio emitiu somente o aviso de versão do
  Node exigida pelo react-router.
- `npm run check:architecture`: passou sem violações (3.617 módulos e 6.465
  dependências).
- `npm run test:unit`: a execução global inicial falhou em uma expectativa
  obsoleta de `family: 4` no teste de opções Redis; essa expectativa foi alinhada
  ao provider IPv4/IPv6 no commit `🧪 test(server): align Redis option expectations`.
  A suíte completa não foi repetida após o ajuste.
- Teste focado `buildRedisOptions.test.ts`: 2/2 passou após a correção.
- A validação manual autenticada do Studio continua bloqueada pelo encerramento
  do transporte Playwright, conforme F6-T3; nenhum sucesso foi declarado.

## Escopo avaliado

- Spec: `./spec.md`
- Plan: `./plan.md` criado para a revisão 4; Judge intermediário desabilitado por
  decisão explícita do usuário
- Commit-base: `cd927d32bcbc10811c222bc0e1fa22744dd1d60e`
- Commit avaliado: `cd927d32bcbc10811c222bc0e1fa22744dd1d60e`
- Estado do diff: F1–F6 implementadas no worktree; alterações pré-existentes fora
  do escopo foram preservadas.

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 a CA-25, CA-27 a CA-35 | pending | implementação integrada em validação; F6-T3 manual bloqueado pelo transporte Playwright |
| CA-26 | retired | removido pelo amendment da Spec revisão 4 |

## Judges

### Judge Spec

- Veredito inicial: `failed`
- Segundo veredito: `accepted` para a revisão `1`
- Terceiro veredito: `failed` para a revisão `2`; `JS-07` a `JS-10` encontrados
- Quarto veredito: `accepted` para a revisão `2`, agora `open`
- Quinta avaliação: `accepted` para a revisão `3`, agora `open`
- Findings: `JS-01` a `JS-06`, resolvidos no draft e aceitos no segundo julgamento

### Judge Plan

- Veredito: `accepted` na segunda avaliação para a revisão 3; primeira avaliação
  falhou e JP-01 a JP-07 foram corrigidos no Plan
- Plan: `./plan.md` criado pelo `create-plan`, com 7 fases e 29 tarefas (28
  tarefas originais mais o Judge Implementation Final explicitado em F7-T3)
  rastreáveis por RF/CA
- Findings: JP-01 overlap de paths em F5; JP-02 dependência F5 contraditória;
  JP-03 inventário DELETE incompleto; JP-04 assembly Inngest incompleto;
  JP-05 benchmark sem path determinístico; JP-06 expectativas 2xx/409
  ambíguas; JP-07 gate de rollout da CTA Web sem critério verificável.
- Estado: aceito na terceira avaliação, após correção de JP-08 a JP-11; o modo
  de implementação é `Por fase`.

### Judge Implementation

- Modo: `final`, conforme decisão explícita do usuário; o primeiro Judge Final
  foi chamado somente após F1–F7 e retornou `failed`; os findings JI-01..JI-05
  estão em correção/revalidação.
- Phase F1: histórico `accepted`, sem findings bloqueantes, na revisão 3; será
  reavaliado no Judge Final contra a revisão 4.

### Judge Final — primeira execução

- Veredito: `failed`.
- Findings bloqueantes da primeira execução: JI-01 listagem padrão sem summary/unread conversacional;
  JI-02 transições de status sem persistência dos outbox events; JI-03 upload do
  Studio usando nome incompatível com o schema; JI-04 payload de idempotência
  instável por IDs aleatórios de outbox; JI-05 fluxo Playwright autenticado
  bloqueado pelo encerramento do transporte MCP.
- RLS/grants e benchmark/P95/EXPLAIN foram explicitamente aceitos como fora do
  contrato da revisão 4.
- Próxima ação: Builder Fix dos findings JI-01..JI-04, repetir sensores e
  submeter o diff corrigido a nova avaliação final; JI-05 permanece evidência
  manual bloqueada, sem inventar sucesso.

### Revalidação após Builder Fix

- JI-01..JI-04 foram corrigidos: a listagem usa o contrato conversacional,
  transições chamam a RPC transacional com outbox, IDs de outbox são removidos do
  payload lógico de idempotência e uploads usam filename UUID preservando
  `originalName`.
- `npm run check:types`: passou em todos os workspaces; Studio mantém somente o
  aviso de versão do Node.
- `npm run check:architecture`: passou sem violações.
- `npm run check:code`: passou com warnings preexistentes.
- `npm run format` e `git diff --check`: passaram.
- Integração Supabase de reporting: 4/4 passou após reaplicar a migration local.
- Testes focados Core: 5/5; Server reporting/assembly: 16/16 passaram.
- JI-05 continua bloqueado: a validação Playwright autenticada não concluiu por
  encerramento do transporte MCP; nenhum sucesso foi inventado.

### Correções posteriores ao terceiro Judge

- JI-11..JI-13 foram implementados no worktree: storage key completa, campos de
  listagem/DTO (`authorEmail`, `isUnread`, preview) e bloqueio de fechamento por
  usuário comum.
- O typecheck global passou após essas alterações.
- A quarta reavaliação formal ainda precisa ser executada; a limitação atual é
  operacional do limite de threads de agentes, não uma decisão de aceitar os
  findings sem Judge.

### Judge Final — veredito final

- Veredito: `failed` somente por JI-14: ausência de evidência manual autenticada
  do Studio no Playwright.
- JI-11..JI-13 foram considerados resolvidos.
- Sensores técnicos e integração de reporting passaram; RLS/grants e benchmark
  permanecem fora do contrato da revisão 4.
- Próxima ação: repetir o fluxo autenticado real do Studio quando o transporte
  Playwright estiver disponível, registrar login, `/dashboard`,
  `/profile/users`, lista e dialog conversacional, e então reabrir apenas a
  avaliação desse gate.
- Commit avaliado: `cd927d32bcbc10811c222bc0e1fa22744dd1d60e` (estado de trabalho
  compartilhado; sem commit novo)
- Evidências: F1-T1..F1-T4 aceitas; contratos Core/Validation/Storage/Notification
  e Broker cobertos pelos sensores do ciclo curto
- Observações: legado de delete permanece para remoção integrada em F3/F5;
  implementação concreta de storage/persistência pertence à F2+
- Phase F2: implementação integrada em andamento; Builder concluído e Builder Fix F2-TS-01
  concluído. Migration/RLS/integration/architecture passaram; server typecheck
  passou após o fix. A suíte server ficou 161/162 por falha preexistente de
  `IORedisCacheProvider` (`family: 4`). O typecheck monorepo ainda encontra
  consumidores Studio de contratos F3, que permanecem pendentes por dependência
  planejada.
- Phase F2 Judge: `failed` com JI-01..JI-04. Findings: repositories não usavam
  composição `service_role`; RPC agregada não integrada; idempotência não
  validava `report_id`/payload; e o teste Supabase não cobria índices, grants,
  cascatas, claim concorrente, transação e outbox. F2 foi reaberta para fix.
- Retry F2: JI-01..JI-04 corrigidos pelo Builder Fix. Migration reaplicada;
  teste Supabase 5/5 passou; Server `check:types` passou; `check:code` passou
  com warnings preexistentes; unitários 161/162 com a falha preexistente de
  IORedis. A integração completa do Server aguarda `SUPABASE_SERVICE_ROLE_KEY`;
  concorrência entre processos ainda não foi executada.
- Retry F2 Judge: `failed` com JI-05 (repository chamava a RPC agregada duas
  vezes e descartava o summary da primeira) e JI-06 (testes não executavam
  transaction/outbox/anexos/cascatas/claim concorrente nem mediam N+1). F2 foi
  reaberta novamente; JI-01..JI-04 permanecem resolvidos.
- Retry F2-2: JI-05..JI-06 corrigidos. RPC é executada uma vez; teste Supabase
  cobre atomicidade, anexos, status, outbox, idempotência/conflito, dois claims
  concorrentes, RLS/grants, cascatas e consulta agregada. Migration/reset,
  teste F2 5/5, teste unitário da RPC, typecheck, check:code e diff-check
  passaram. Unitários 162/163 mantêm somente a falha preexistente de IORedis.
  O adapter TypeScript de service role não foi exercitado porque
  `SUPABASE_SERVICE_ROLE_KEY` não estava exportada.

## Retry F2-3 Judge

- **Veredito:** `failed`, com JI-07, JI-08 e JI-09.
- **JI-07:** o `FeedbackRouter` ainda injeta client anon/JWT em vez da
  composição server-only.
- **JI-08:** não havia teste do lifecycle de cascata partindo de `users`.
- **JI-09:** não havia contagem de queries nem `EXPLAIN` observável para provar
  ausência de N+1.
- F2 foi reaberta; JI-01..JI-06 permanecem resolvidos.

## Retry F2-4

- JI-07..JI-09 foram corrigidos: Router usa `reportingSupabase()` server-only;
  teste executa cascata `users → report → message → attachment/outbox → DELETE
  users`; benchmark SQL/EXPLAIN confirma índices, RPC única e ausência de
  consultas por item. Migration/reset, testes F2/RPC/benchmark e Server
  `check:types`/`check:code` passaram. Server unitários 163/164 mantêm somente
  a falha preexistente de IORedis; root typecheck ainda aguarda consumidores
  Studio de F3/F5. `SUPABASE_SERVICE_ROLE_KEY` não estava exportada, então o
  adapter live não foi declarado como exercitado.

## Retry F2-5 Judge

- **Veredito:** `failed`, com JI-10. A implementação funcional, RLS,
  service_role, cascatas, RPC única, transação, outbox, idempotência e claims
  concorrentes foram aceitos; o benchmark ainda não tinha dataset/warmup/100
  requests/P95 nem `EXPLAIN ANALYZE` integrado conforme CA-26.
- F2 foi reaberta exclusivamente para a evidência de desempenho.

## Retry F2-6

- JI-10 foi corrigido: dataset local `10000:100000:150000` validado; `EXPLAIN
  (ANALYZE, BUFFERS)` executado para RPC sem filtro/status/intent; seis índices
  confirmados; runner versionado com warmup 20, 100 requests por cenário, P95,
  `pg_stat_statements`, contagem e candidatos N+1. HTTP autenticado não foi
  executado por falta de `BENCHMARK_EMAIL/PASSWORD` e
  `SUPABASE_SERVICE_ROLE_KEY`.

## Retry F2-7 Judge

- **Veredito:** `failed`, com JI-11 (distribuição 25%/25% em vez de 30%/10%),
  JI-12 (cenários incompletos: filtros combinados e detalhe com 100 mensagens)
  e JI-13 (sem evidência live de 100 requests autenticados/P95/contagem real).
- F2 foi reaberta para JI-11..JI-12 e diagnóstico de ambiente; não há P95
  declarado sem execução real.

## Retry F2-8

- JI-11/12 corrigidos: fixture validada com 3.000 fechados, 1.000 não lidos,
  7.000 abertos, 9.000 lidos, 100 mensagens no detalhe e 100.000 mensagens
  totais; runner cobre filtro combinado e detalhe, mantendo warmup/100 requests.
- **JI-13 permanece aberto e bloqueante:** a verificação local não encontrou
  `SUPABASE_DATABASE_URL`, `BENCHMARK_EMAIL`, `BENCHMARK_PASSWORD` ou
  `SUPABASE_SERVICE_ROLE_KEY` exportados; portanto não existe P95 live nem
  contagem autenticada real. Nenhum valor foi inventado.

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| `git diff --check` | passed | preflight integrado, sem whitespace inválido |
| `npm run format` | passed | 7 workspaces formatados sem correções pendentes |
| `npm run check:code` | passed with warnings | warnings preexistentes; nenhum erro bloqueante |
| `npm run check:types` | passed | typecheck monorepo concluído; Studio emite aviso de Node 22.17 vs requisito do react-router |
| `npm run test:unit` | failed known | Server: 162 suites/304 testes passaram e 1 falhou no teste preexistente de IORedis (`family: 4`); demais workspaces concluídos |
| `npm run check:architecture` | passed | 3625 módulos / 6472 dependências, sem violações |
| `npm run test:integration` | passed for reporting | `FeedbackConversationsPersistence.test.ts` 4/4; suíte global executada com logs esperados de cenários negativos |

## Quality Gate e build do CI

| Verificação | Estado | HEAD / evidência |
| --- | --- | --- |
| Quality Gate | pending | PR ainda não criado |
| Build | pending | PR ainda não criado |

## Warnings e findings

- `JS-01 — snapshot de leitura`: resolvido com
  `lastSeenUserMessageId`, validação de ownership/papel e avanço monotônico até o
  snapshot conhecido; aceito no segundo Judge Spec.
- `JS-02 — commit/publicação`: resolvido com outbox transacional,
  dispatcher imediato, dreno agendado e event ID determinístico. O segundo Judge
  Spec aceitou a solução e recomendou manter a idempotency key também no provider.
- `JS-03 — Discord`: resolvido ao reincluir resposta do usuário no backend e
  notificação resumida/idempotente, mantendo somente a UI Web fora do escopo;
  aceito no segundo Judge Spec.
- `JS-04 — fechamento concomitante`: resolvido ao exigir resposta administrativa
  anterior à operação corrente; aceito no segundo Judge Spec.
- `JS-05 — e-mail inválido`: resolvido com bloqueio anterior à persistência, erro
  operacional e preservação do rascunho; aceito no segundo Judge Spec.
- `JS-06 — performance`: resolvido com dataset, distribuição, warmup, amostragem
  e cenários autenticados reproduzíveis; aceito no segundo Judge Spec.
- `RS-01 — evidência e paths`: revisão 2 adiciona síntese da pesquisa e inventário
  por camada com estado existente/novo, responsabilidade, dependências e
  referências reais; aceito pelo Judge Spec.
- `RS-02 — segurança do banco`: revisão 2 explicita RLS/grants e composição
  server-only `service_role` para reporting após auth/authz da borda; aceito pelo
  Judge Spec.
- `RS-03 — anexos`: revisão 2 cria signed upload contextual com ownership, em vez
  de reutilizar o endpoint genérico sem contexto de reporte; aceito pelo Judge
  Spec.
- `RS-04 — idempotência externa`: documentação oficial confirmou janela de 24h
  no Resend e Inngest; a revisão 2 substitui garantia ilimitada por retry até 23h
  e reconciliação sem reenvio automático; aceito pelo Judge Spec.
- `JS-07 — scope formal`: resolvido ao incluir Provision, constants, env example,
  schema Supabase e `apps/server/src/tests`, com fixture/route tests explicitados
  no inventário; aceito na reavaliação.
- `JS-08 — lifecycle da conta`: resolvido preservando a cascata existente de
  `users -> feedback_reports` e estendendo `CASCADE` a mensagens, anexos e outbox;
  CA-34 cobre exclusão de conta com conversa; aceito na reavaliação.
- `JS-09 — Discord`: resolvido ao declarar entrega `at-least-once` com possível
  aviso duplicado quando o resultado HTTP for desconhecido, sem duplicar estado
  de negócio; CA-31 foi corrigido; aceito na reavaliação.
- `JS-10 — resposta em fechado`: resolvido ao exigir `open` para usuário e admin,
  retornar `409` em fechamento concorrente e cobrir bypass da UI no CA-35;
  aceito na reavaliação.

## Decisões

- O efeito de Discord volta ao Contract de backend porque permanece explícito no
  PRD; apenas a experiência Web continua na demanda posterior.
- A primeira resposta administrativa não pode fechar o reporte na mesma
  transação, seguindo literalmente a precondição do fluxo de produto.
- E-mail, Discord e analytics usam outbox transacional para remover a janela de
  perda entre persistência e broker.
- A leitura administrativa transporta o último ID de mensagem efetivamente visto
  para não consumir respostas concorrentes.
- Revisão humana determinou que métodos de interfaces devem estar explícitos na
  Spec. Foram fixadas as assinaturas de repositories, transação, service,
  storage, e-mail e broker. Na revisão 3, o port passou para o módulo
  `notification` com
  `EmailProvider.sendFeedbackReportReplyEmail(request): Promise<void>`; IDs do
  Resend não atravessam o port.
- A reaplicação do prompt revisado tornou obrigatórios pesquisa consolidada,
  inventário por path/estado, contratos de use cases/jobs/HTTP e decisões com
  evidência; por alterar segurança, upload e retry, a Spec avançou para revisão 2.
- O lifecycle de exclusão de conta permanece fora do domínio de Reporting: esta
  feature mantém a remoção em cascata atual em vez de bloquear ou introduzir
  anonimização sem requisito de Profile.
- Discord prioriza recuperação da notificação (`at-least-once`) e admite aviso
  duplicado; apenas mensagem, leitura, atividade e outbox de negócio precisam ser
  estritamente únicos.
- Revisão humana definiu `notification` como owner do port de e-mail de resposta
  ao feedback. `EmailProvider` permanece separado do `NotificationService`, que
  continua representando os webhooks existentes.
- Revisão humana renomeou o shape compartilhado de anexos para
  `FeedbackMessageAttachmentRequest`, usado tanto no request do service quanto
  no port transacional.

## Lições aprendidas

- Idempotência do comando não garante entrega do efeito externo; a fronteira
  durável precisa fazer parte explícita do Contract.
- Uma marcação de leitura concorrente precisa transportar o snapshot conhecido,
  não apenas identificar o reporte.

## Alinhamento documental

- Spec: revisão 3 `open` após Judge Spec `accepted`; aceites das revisões 1 e 2
  permanecem preservados como histórico
- Plan: aceito pelo Judge Plan para a revisão 4; a implementação usa modo Final
  e só será submetida ao Judge Implementation após F7.
- Rules: nenhuma mudança necessária nesta etapa
- SDD/fluxo de criação de Specs: atualizado para exigir assinaturas dos contratos
  técnicos introduzidos ou alterados
- Architecture/Overview/Pencil: alinhamentos previstos na conclusão da feature

## Conclusão

- Estado: `in_progress`
- F7-T1/T2: concluídos com o preflight acima e evidências separadas.
- Próxima ação: submeter o diff corrigido a nova avaliação final. A validação
  Playwright autenticada segue bloqueada pelo encerramento do transporte MCP.
