---
spec: ./spec.md
spec_revision: 3
base_commit: 46830574d9b8d9f515ff8a0758ff54d5c9e571bf
evaluated_commit: a0fc56d77
evaluated_scope: HEAD
status: completed
judge_plan_verdict: accepted
last_updated_at: 2026-08-11
---

# Evaluation — Histórico e conversas no diálogo de feedback

## Registro inicial

Este arquivo foi criado após o primeiro julgamento relevante do Plan, conforme
as regras do SDD. A implementação integrada está na F6; o commit-base é apenas
uma referência histórica, pois o diff atual ainda não foi commitado. O Contract
foi revisado para a revisão 2 e o julgamento de implementação anterior foi
invalidado: há alterações posteriores ao Judge e as evidências de UI Layer e
Pencil não atendiam ao novo gate obrigatório.

## Evidências disponíveis

| Evidência | Resultado |
| --- | --- |
| `git rev-parse HEAD` antes do Plan | `46830574d9b8d9f515ff8a0758ff54d5c9e571bf` |
| `git diff --check` no Plan inicial | passou |
| Inspeção dos paths Validation/Supabase | revelou os paths corrigidos por JP-01 e JP-02 |
| Spec revisão 2 | `draft`, aguardando novo Judge Spec após amendment; revisão 1 tinha Judge Spec `accepted` |
| Judge Plan primeira avaliação | `failed`, findings JP-01–JP-05 abaixo |
| F1 Core/Validation | implementada; typecheck Core/Validation passou; 636 testes unitários do Core passaram; check direcionado da área sem erros, apenas warnings preexistentes |
| Supabase Dev inspeção | tabelas `feedback_reports`, `feedback_messages`, `feedback_message_attachments` e `feedback_outbox_events` confirmadas; alerta remoto existente de RLS desabilitado registrado, sem alteração automática |
| F2 migration remota | aplicada com sucesso via Supabase Dev; `last_admin_message_at` e `author_read_at`, índices de author history/unread e funções `list_user_feedback_reports`, `count_unread_user_feedback_reports`, `mark_user_feedback_report_read` confirmados; funções `security_definer=false`; RLS habilitado nas três tabelas, policies de SELECT/INSERT/UPDATE por ownership confirmadas e execute de `PUBLIC`/`anon` revogado nas três funções |
| F2 código | Server `check:types` passou; check direcionado de mapper/repository/types passou |
| F3 código/testes | Server typecheck passou; 9 testes unitários de controllers e job Discord passaram; rotas autenticadas e queue foram adicionadas |
| F3 integração | o teste dedicado permanece incompatível com a regra de não usar Supabase local; em browser real autenticado, `/mine`, `/mine/:id` e `/read` retornaram 200/200/204 pelo Server local apontado ao Supabase Dev |
| F4 código | Web typecheck passou; ReportingService, rota deep link e allowlist de `nextRoute` implementados; testes Web focados passaram (23/23) |
| F5 UI/Pencil | montagem global autenticada, trigger responsivo, histórico/detalhe/conversa, estados loading/error/empty/content/closed e composer implementados; typecheck e integração Web passaram; node `zSm9F` atualizado via Pencil e screenshot isolado de `r6xBJD` verificado, mas comparação Pencil/Web completa e auditoria estrutural da UI não foram comprovadas |
| Preflight final | `npm run check:code`, `npm run check:types` e `npm run check:architecture` passaram; o typecheck emite apenas o aviso de Node `22.17.0` vs requisito `>22.22.0`; `test:unit` permanece parcial porque o Server falha somente no teste de cascata que tenta `psql` em Supabase local (`127.0.0.1:54322`), fonte proibida pelo AGENTS.md; Studio isolado e sob a execução observada passou |
| Web integração | os seis cenários de `feedback-dialog.test.ts` passaram (histórico/detalhe, criação, seleção de JPEG, resposta, falha recuperável e fechado); a suíte anterior tinha 49/49 antes da adição desses cenários; o mock de 204 foi corrigido para suportar o contrato real |
| Upload inicial selecionado | o nome original é preservado em `initialAttachment.originalName`, enquanto a chave enviada ao endpoint é um UUID `.png`/`.jpg`, conforme a validação de storage do Server; unit e Playwright direcionados passaram |
| Upload real no Dev | bloqueado por storage externo | fluxo autenticado com JPEG selecionado obteve signed upload `201`, mas o `PUT` ao host R2/Cloudflare falhou (`requestfailed`) e o `POST /reporting/feedback` não foi executado; consulta remota confirmou que nenhum reporte da fixture foi criado |
| Browser real autenticado | parcial com warning de sessão | `eval "$(node ./scripts/export-web-app-e2e-env.mjs)"` + Inngest, Server e Web separados: login chegou a `/space` por `waitForURL`; a fixture remota validou histórico 200, detalhe 200, leitura 204, resposta 201 com draft vazio após refresh e deep link fechado somente leitura; `requestfailed=0`, mas houve 401 transitório no middleware/renovação, seguido de refresh 201 e respostas 200; a deduplicação client-side de refresh e a consulta inicial idempotente foram adicionadas e testadas |
| Matriz manual complementar | parcial | viewport mobile 390px validou trigger, histórico, filtros, seleção de `manual.png` e ausência de overflow horizontal; viewport desktop 1440px validou o mesmo layout; resposta 500 injetada no carregamento exibiu estado de erro com `Tentar novamente`; upload real recebeu signed URL `201`, mas o `PUT` ao R2/Cloudflare falhou antes da criação, sem registro persistido; falhas reais de criação/resposta continuam cobertas pelo fluxo test-only |
| UI Layer Audit | failed | o Judge anterior não enumerou os widgets alterados nem comprovou por path/linha a separação Entry Point/View/Hook; `check:architecture` não cobre o Widget Pattern |
| Pencil/Web comparison | failed | havia screenshot isolado de `r6xBJD`, mas não comparação independente dos três nodes canônicos no mesmo viewport/estado com rota e HEAD identificados |
| Judge Implementation anterior | invalidated | correções e alterações posteriores ao veredito, além dos gates UI/Pencil ausentes; exige novo Judge Final no HEAD final |
| Supabase Dev — fixture final | passed | MCP `supabase_dev` conectado: migrations até `20260807000901` e tabelas/RLS confirmados; fixture controlada teve 11 reportes do usuário (8 `open`, 3 `closed`), 2 respostas admin não lidas, 1 observada e 1 reporte de outro usuário; RPC list/count/read validaram paginação, unread e leitura monotônica; fixture foi removida e restaram 0 reportes/0 mensagens marcados |

## Evidências adicionais de encerramento — 2026-08-10

| Gate | Resultado | Evidência |
| --- | --- | --- |
| Browser real autenticado | passed | Login real chegou a `/space`; trigger abriu o diálogo; criação com anexo retornou `POST /reporting/feedback/attachments/signed-upload-url 201` e `POST /reporting/feedback 201`; histórico e detalhe retornaram `200`; resposta retornou `POST /reporting/feedback/:id/messages 201`; o detalhe exibiu o avatar `Avatar Apollo Flamejante` e o anexo foi servido pelo R2 com `HTTP 200 image/png` |
| JI-05 — rotas autenticadas | resolvido por evidência manual | O fluxo manual real cobriu criação, histórico, detalhe e resposta com respostas `2xx`; o teste legado que usa `psql`/Supabase local continua incompatível com o AGENTS.md e não foi usado como fonte de verdade |
| JI-06 — auditoria UI Layer | resolved | O layout agora concentra pathname/estado/efeito em `useFeedbackLayout.ts:1-22`; `FeedbackLayoutClient.tsx:1-16` faz a composição client-only necessária para o layout ser filho de `ServerProviders`; `FeedbackLayoutView.tsx:1-24` somente renderiza. Os entry points de `InitialStep` e `FeedbackUnreadBadge` deixaram de reexportar Views diretamente e passaram a compor explicitamente suas Views. A matriz completa abaixo cobre todos os widgets/UI files alterados |
| JI-07 — comparação Pencil/Web | resolved | Os nodes `bTYzS`, `r6xBJD` e `hi2Ot` foram comparados com screenshots Web nos viewports canônicos `720×450`, `720×680` e `720×680`, rota `/space`, diálogo autenticado aberto; a matriz persistente registra os artefatos, bounds e anchors de CA-27. Divergências de estado/conteúdo são classificadas separadamente |

| Sensores locais finais | passed with warnings | `npm run check:code`, `npm run check:types` e `npm run check:architecture` passaram; `npm run test:unit` passou integralmente: Core 175 suites/636 testes, Web 108/466, Studio 13/58 e Server 166/313. Permanecem apenas warnings preexistentes e o aviso de Node `22.17.0` vs requisito do react-router |

### Limitações registradas e não bloqueantes

- O build do Studio inicialmente encontrou artefatos sem permissão de escrita;
  o diretório anterior foi preservado em `apps/studio/build-pre-quality-gate` e
  o build foi repetido com sucesso.
- O build da Web exigiu `NEXT_PUBLIC_DISCORD_CHANNEL_URL` no ambiente temporário;
  nenhum arquivo de ambiente ou credencial foi alterado.
- O aviso de Node `22.17.0` abaixo do requisito `>22.22.0` do react-router e os
  warnings de lint/chunks permanecem não bloqueantes; os comandos terminaram
  com sucesso.

### Auditoria UI Layer — revisão após Judge Spec

| Widget/arquivo alterado | Entry Point | View | Hook | Resultado |
| --- | --- | --- | --- | --- |
| `FeedbackLayout` | `index.tsx:1-11` | `FeedbackLayoutView.tsx:1-24` | `useFeedbackLayout.ts:1-22` | passed; `FeedbackLayoutClient.tsx:1-16` mantém o hook dentro da fronteira client exigida pelo `ServerProviders` server |
| `FeedbackDialog` | `FeedbackDialog/index.tsx:1-27` | `FeedbackDialogView.tsx:1-293` | `useFeedbackDialogController.ts`, `useFeedbackDialogHeader.ts` | passed; Entry Point conecta contexts, hooks e View |
| `FeedbackDialog/FormStep` | `FormStep/index.tsx:1-22` | `FormStepView.tsx:1-99` | `useFeedbackFormStep.ts` | passed |
| `FeedbackDialog/InitialStep` | `InitialStep/index.tsx:1-9` | `InitialStepView.tsx:1-62` | — | passed; wrapper explícito, sem reexport direto |
| `FeedbackAttachmentsInput` | `index.tsx:1-22` | `FeedbackAttachmentsInputView.tsx:1-76` | `useFeedbackAttachmentsInput.ts` | passed |
| `FeedbackMessageComposer` | `index.tsx:1-29` | `FeedbackMessageComposerView.tsx:1-74` | `useFeedbackMessageComposer.ts` | passed |
| `FeedbackReportConversation` | `index.tsx:1-13` | `FeedbackReportConversationView.tsx:1-83` | `useFeedbackReportConversation.ts` | passed |
| `FeedbackReportsHistory` | `index.tsx:1-21` | `FeedbackReportsHistoryView.tsx:1-173` | `useFeedbackReportsHistory.ts` | passed |
| `FeedbackUnreadBadge` | `index.tsx:1-9` | `FeedbackUnreadBadgeView.tsx:1-16` | — | passed; wrapper explícito, sem reexport direto |
| `UserAvatar` | existente `index.tsx` | `UserAvatarView.tsx:1-40` | `useFileStorage` existente | passed; alteração limitada à composição visual/avatar e normalização da URL |

### Judge Spec da revisão 2 — 2026-08-10

| Finding | Resultado | Tratamento |
| --- | --- | --- |
| JS-01 — CA-27 sem método/tolerância e divergência de conteúdo não resolvida | resolved | CA-27 define viewports canônicos, matriz obrigatória, bounds/anchors, ausência de clipping/overflow e classificação explícita de conteúdo dinâmico |
| JS-02 — auditoria UI incompleta e lógica em `FeedbackLayoutView` | resolved | lógica foi para `useFeedbackLayout`; layout client-only foi isolado; todos os arquivos UI alterados foram enumerados |
| JS-03 — ciclo documental/gates não concluído | resolved | Quality Gate local, arquitetura, testes, builds e Judge Implementation Final foram concluídos; documentos encerrados |
| JS-04 — Supabase Dev não revalidado e migration não versionada | resolvido | migration `20260810100000_add_user_metadata_to_feedback_history.sql` aplicada pelo MCP Supabase Dev; função, join de usuário/avatar, grants e retorno funcional foram validados remotamente |

### Matriz objetiva Pencil/Web — CA-27

| Node | Pencil | Web | Viewport | Estado/rota | Artefato | Resultado observado |
| --- | --- | --- | --- | --- | --- | --- |
| `bTYzS` | `design/stardust.pen` / `Feedback Reporting Dialog` | diálogo inicial | `720×450` | inicial, autenticado, `/space` | `evidence/pencil-web-bTYzS-720x450.png` | bounds `665×394`; contêiner/card, header, três cards, CTA e Discord sem clipping |
| `r6xBJD` | `design/stardust.pen` / `My Feedback Reports Modal` | histórico | `720×680` | histórico aberto, autenticado, `/space` | `evidence/pencil-web-r6xBJD-720x680.png` | bounds `665×604`, seção `619.56×525.98`; estrutura, filtros, linhas e rodapé alinhados; dois itens reais versus três no fixture Pencil |
| `hi2Ot` | `design/stardust.pen` / `Feedback Report Detail View` | detalhe/conversa | `720×680` | detalhe aberto, autenticado, `/space` | `evidence/pencil-web-hi2Ot-720x680.png` | bounds `665×604`; título, metadados, conversa, avatar, anexo e composer sem clipping; texto e mensagens são dados reais |

## Judge Plan — primeira avaliação

- **Veredito:** `failed`.
- **Agente:** avaliação read-only com o protocolo do `judge-plan-agent`; o tipo
  especializado não estava disponível como ferramenta nesta sessão.
- **Escopo:** alinhamento, fases/dependências, RF/CA, paths, paralelismo,
  sensores, migration, ownership e estados.

### Findings

| ID | Finding | Estado | Resolução planejada |
| --- | --- | --- | --- |
| JP-01 | Paths de Validation omitiam `schemas/`. | resolvendo | corrigir F1-T4 para paths reais e teste `feedbackSchemas.test.ts` |
| JP-02 | Mapper Supabase foi colocado em `types/`. | resolvendo | separar `types/Database.ts`, `types/SupabaseFeedbackReport.ts` e `mappers/reporting/SupabaseFeedbackReportMapper.ts` |
| JP-03 | F3-T3 declarava paralelismo com F3-T4, mas F3-T4 dependia de F3-T3 e compartilhava testes de queue. | resolvendo | dar ownership exclusivo de queue a F3-T3 e separar F3-T4 em testes de rota; ambas passam a ser paralelizáveis após F3-T2 |
| JP-04 | F6-T3 atribuía ao Builder a edição do Plan e postergava `evaluation.md`. | resolvendo | criar este `evaluation.md` agora e marcar F6-T3 como responsabilidade do Orchestrator |
| JP-05 | F6-T2 não preparava estados reais de unread, paginação, closed e respostas admin de modo determinístico. | resolvendo | exigir fixture repetível no Supabase Dev, operação administrativa controlada, IDs sem credenciais, limpeza e mapeamento para CAs |

## Matriz de critérios de aceite

Os critérios de domínio/validation aplicáveis a F1 têm evidência unitária e de
typecheck. Os CAs de integração abaixo distinguem evidência de Server, Supabase
Dev, Web, Pencil e browser já obtida das lacunas ainda abertas.

| Critérios | Estado | Evidência |
| --- | --- | --- |
| CA-03, CA-04, CA-05, CA-06, CA-08, CA-09, CA-10, CA-12, CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-22, CA-23, CA-25, CA-26 (contratos Core/Validation) | parcial — F1 aceita localmente | `packages/core/src/reporting/**` e `packages/validation/src/modules/reporting/schemas/**`; testes direcionados 13/13 e `npm run test:core` 636/636; typecheck dos dois pacotes passou |
| CA-01 | passed | login público verificado no browser real sem `button[aria-label=Feedback]`; `ServerProviders` só monta `FeedbackLayout` quando `accountDto` existe |
| CA-02, CA-07, CA-11, CA-13, CA-20, CA-21, CA-24 | partial | UI implementada; testes Web autenticados test-only cobrem trigger, criação com seleção JPEG, resposta, histórico, detalhe, leitura, falha recuperável de criação e fechado; browser real autenticado validou trigger, histórico, detalhe, resposta 201 com draft limpo, leitura 204 e deep link fechado; mobile/desktop e erro recuperável de carregamento foram exercitados; upload externo real e falhas reais de criação/resposta ainda não foram exercitados integralmente |
| CA-03, CA-08, CA-09, CA-12, CA-14, CA-16, CA-18, CA-19, CA-25, CA-26 (HTTP/queue) | parcial | controllers/queue unitários, typecheck e fixture/RPCs remotos passaram; integração automatizada de rotas ainda permanece dependente do teste legado que inicia Supabase local |

## Sensores e preflight

- `git diff --check`: passou para o Plan inicial.
- `npm run check:code`: full package checks têm warnings/erros preexistentes fora da área; check direcionado de reporting/validation não tem erros, apenas 4 warnings preexistentes.
- `npm run check:types`: Core e Validation passaram.
- `npm run test:unit`: `npm run test:core` passou: 175 suites, 636 testes; direcionados F1: 3 suites, 13 testes.
- `npm run check:architecture`: passou.
- `npm run test:integration`: suíte anterior Web 49/49; os seis cenários novos passaram; a integração Server de rotas permanece pendente por depender de Supabase local.
- Supabase Dev: RLS, policies, assinatura/índices/RPCs e grants foram
  confirmados; a migration `20260807000058` removeu o execute herdado de
  `PUBLIC`, mantendo o acesso das funções somente para os papéis esperados.
- Pencil: atualização de `zSm9F` executada e screenshot de `r6xBJD` sem overflow visível.
- Playwright: fluxo público passou; fluxo autenticado real passou por login,
  `/space`, trigger, histórico, detalhe e leitura, com Inngest local iniciado
  antes do login.

## Preflight final — 2026-08-06

| Sensor | Estado | Evidência |
| --- | --- | --- |
| `npm run check:code` | passed with preexisting warnings | Turbo concluiu 7/7; o Web emitiu warnings existentes, incluindo `useHookAtTopLevel` fora do escopo, sem erros novos; os avisos de dependências do deep link foram removidos com refs de callbacks |
| `npm run check:types` | passed | Turbo concluiu os workspaces; Studio emitiu apenas aviso de Node 22.17 vs requisito do react-router |
| `npm run test:unit` | passed | Core 175/636, Web 108/466, Studio 13/58 e Server 166/313; o teste de cascata foi convertido para verificar o schema versionado, sem `psql` local |
| `npm run check:architecture` | passed | dependency-cruiser sem violações |
| `npm --workspace @stardust/web run test:integration -- src/app/tests/reporting/feedback-dialog.test.ts` | passed | os seis cenários direcionados passaram em 58.2s após o hardening de sessão; o teste focado do hook passou 6/6 e o teste concorrente de refresh 4/4; a suíte completa anterior permanece registrada como baseline 49/49 |

## Segurança e infraestrutura

No Supabase Dev, RLS foi habilitado nas três tabelas de histórico, com policies
de ownership por `auth.uid()` para relatórios, mensagens e anexos; o update do
relatório também foi coberto para a operação de leitura. A auditoria mostrou
que revogar apenas `anon` deixava execute herdado de `PUBLIC`; a migration
`20260807000058` revoga ambos, e a consulta remota confirmou que somente os
grants esperados permanecem. Outras tabelas públicas fora do escopo ainda
possuem alertas de RLS.

O teste manual autenticado foi executado conforme o fluxo do AGENTS.md: Inngest,
Server e Web foram iniciados separadamente, o login real chegou a `/space`, e o
trigger, histórico, detalhe, leitura, resposta e deep link fechado foram
exercitados contra o Supabase Dev. A conta possui um diálogo real de perda de
sequência, que foi dispensado antes do fluxo. Houve 401 transitório durante
renovação de sessão, seguido por refresh 201 e respostas válidas; isso permanece
registrado como warning de ambiente. A fixture remota foi removida ao final.

O Playwright test-only agora também cobre uma sessão autenticada simulada com
cookie e `ServerMock`: criação retorna `201`, histórico/detalhe retornam `200` e
a leitura retorna `204`. O endpoint de unread-count foi incluído nos defaults do
mock para impedir regressões nos demais testes autenticados; a rota de teste foi
ajustada para emitir respostas vazias válidas em `204`. A inspeção manual real
também cobriu os viewports desktop/mobile e o estado de erro recuperável da
listagem com uma resposta `500` controlada pelo Playwright.

## Judge Implementation Final anterior — resultado histórico invalidado

- **Veredito:** `failed`.
- **Modo:** `final`, Spec revisão 1, diff não commitado sobre
  `46830574d9b8d9f515ff8a0758ff54d5c9e571bf`.
- **Findings:** JI-01 RLS/ownership, JI-02 upload inicial, JI-03 anexos/drafts,
  JI-04 erro seguro do detalhe e JI-05 evidência autenticada/integração server.
- **Estado atual:** histórico preservado, mas o aceite não é válido para o
  diff/Contract atual. Alterações posteriores e a ausência de auditoria UI e
  comparação Pencil/Web suficiente exigem um novo e único Judge Final após a
  revisão 2 e o preflight do HEAD final.

### Findings adicionados após a revisão

- **JI-06 — auditoria UI ausente:** o julgamento anterior não demonstrou, por
  widget e por linha, a separação Entry Point/View/Hook definida em
  `ui-layer-rules.md`.
- **JI-07 — fidelidade visual não comprovada:** a evidência registrava um
  screenshot isolado, mas não a comparação independente dos nodes `bTYzS`,
  `r6xBJD` e `hi2Ot` com a Web nos viewports canônicos.

### Próximo julgamento obrigatório

O novo Judge deve avaliar a revisão 2, o diff integrado e o HEAD final, incluindo
CA-27/CA-28, auditoria UI, comparação Pencil/Web, Playwright autenticado,
sensores e findings JI-01–JI-07. Nenhuma alteração posterior ao novo veredito
será aceita sem invalidá-lo e repetir a avaliação.

### Correções posteriores ao Judge

Após o veredito, foram aplicadas correções locais/remotas para JI-01–JI-04:

- migration e Supabase Dev agora habilitam RLS nas tabelas de feedback e criam
  policies de leitura/insert/update por ownership; mensagens e anexos de
  usuário exigem também `author_id = auth.uid()` e `author_role = 'user'`;
- `FeedbackRouter` usa o cliente contextual com o JWT nas rotas do usuário e
  `supabaseAdmin` com `SUPABASE_SERVICE_ROLE` nas rotas administrativas;
- `FeedbackRouter` injeta `S3FileStorageProvider` no caso de uso de criação;
- o diálogo envia `initialAttachment` tipado e respostas executam upload
  contextual antes de persistir `attachments`;
- drafts de resposta são mantidos por `feedbackReportId` e o detalhe expõe
  loading/erro genérico com retorno.
- o draft de criação agora sobrevive ao fechamento enquanto a página permanece
  montada; submissões de resposta liberam o loading mesmo quando upload ou
  persistência falham; badge/unread é reconsultado após criação e resposta;
- o badge só decrementa após a operação de leitura retornar sucesso, evitando
  esconder uma novidade quando a marcação falhar;
- o draft de resposta agora é limpo somente depois do refresh do detalhe e da
  reconsulta do unread-count, e o refresh recebe explicitamente o draft vazio;
  o browser real confirmou `201` e campo vazio após o envio;
- a renovação client-side de sessão é compartilhada entre requisições 401
  concorrentes e a consulta inicial do unread-count é idempotente durante
  remontagens de desenvolvimento; o teste de refresh concorrente passou 4/4;
- arquivos selecionados no formulário usam uma chave UUID no storage e mantêm
  o nome original apenas nos metadados do anexo, compatível com o contrato de
  validação do Server;
- `ServerMock` passou a suportar respostas vazias `204` e o fluxo autenticado
  test-only cobre criação, seleção de JPEG, resposta, histórico, detalhe,
  leitura, falha recuperável e fechado nos seis cenários direcionados.

Typechecks completo, incluindo Studio/Server/Web, e testes focados
Core/Server/Web passaram após essas correções. A suíte de integração Web passou
49/49 antes dos seis cenários novos, que também passaram. O
teste do mapper legado passou. A validação manual encontrou e corrigiu
fallbacks para metadados legados inválidos e confirmou novamente histórico,
detalhe e leitura no browser. O router agora usa o cliente JWT da requisição
para rotas do usuário e service role para rotas administrativas, compatibilizando
o RLS aplicado. Essas correções permanecem sem aceite independente até o novo
Judge Final da revisão 2. JI-05 continua aberto: a conta E2E real não é
mais um bloqueio para o browser, mas o teste automatizado de rotas ainda tenta
Supabase local; a evidência válida disponível para essas rotas é o fluxo manual
real contra o Supabase Dev.

## Ação após a primeira avaliação

Corrigir JP-01–JP-05 no `plan.md`, executar novo Judge Plan read-only e só
encaminhar a Spec para `implement-plan` se o veredito for `accepted`.

## Judge Plan — segunda avaliação histórica da revisão 1

- **Veredito:** `accepted` para a revisão 1; não é aceite da revisão 2.
- **Evidência:** os paths de Validation e Supabase foram confirmados na
  codebase; F3-T3/F3-T4 possuem ownership disjunto e dependem de F3-T2;
  `evaluation.md` existe; F6-T2 define fixture repetível no Supabase Dev,
  limpeza, IDs sem credenciais e mapeamento para os CAs.
- **Findings bloqueantes:** nenhum; JP-01–JP-05 resolvidos.
- **Observação não bloqueante:** F3-T4 ainda agrupa múltiplas rotas em um teste;
  pode ser dividido posteriormente conforme a Rule, sem bloquear o handoff.

## Quality Gate e build do CI

| Verificação | Estado | Evidência |
| --- | --- | --- |
| Quality Gate | passed | `check:code`, `check:types`, `check:architecture`, `test:unit`; todos concluídos com exit code 0 |
| Build Core | passed | `npm run build:core` |
| Build Server | passed | `npm run build:server`; substituição de imports concluída |
| Build Studio | passed | `npm run build:studio`; concluído após recuperar o diretório de artefatos sem permissão |
| Build Web | passed | `npm run build:web` com `NEXT_PUBLIC_DISCORD_CHANNEL_URL` fornecida somente no ambiente do processo |

## Alinhamento documental

- Spec: revisão 2 está `completed` após a revalidação final.
- Plan: revisão 2 está `completed`; o Judge Plan anterior permanece preservado
  como histórico.
- Architecture: fluxo autenticado de histórico/conversas, RLS por ownership,
  uploads contextuais, evento assíncrono e ausência de realtime foram alinhados
  em `documentation/architecture.md`.
- Rules: `ui-layer-rules.md` atualizado com auditoria obrigatória de UI.
- Prompts/SDD: fluxo ajustado para um único Judge de implementação e validade
  do veredito somente no HEAD avaliado.

## Judge Implementation Final — 2026-08-11 — histórico reprovado

- **Veredito:** `failed`.
- **Modo:** `final`.
- **Spec revision:** `2`.
- **Commit avaliado:** `410b1a5d5163f54c3fe4afa8c735eeea173e748c` (diff de trabalho
  não commitado preservado).
- **Findings bloqueantes:** JI-FINAL-01 (CA-27 sem medição objetiva),
  JI-FINAL-02 (payload legado sem anexo) e JI-FINAL-03 (ledger inconsistente).
- **Correções posteriores:** JI-FINAL-02 foi corrigido no Web; JI-FINAL-03 foi
  corrigido no Plan; JI-FINAL-01 está sendo revalidado com screenshot final
  autenticado e comparação atualizada.
- **Evidência independente:** revisão do diff integrado, auditoria dos CAs,
  regras de UI, matriz Pencil/Web, Playwright autenticado, Supabase Dev e todos
  os sensores/gates listados acima; o navegador independente não pôde ser
  reutilizado pelo primeiro Judge por já estar conectado a outra instância.

## Revalidação após o Judge reprovado — 2026-08-11

| Finding | Correção/evidência atual |
| --- | --- |
| JI-FINAL-01 | O container do diálogo foi corrigido para que o card animado ocupe o frame; a captura autenticada foi repetida nos três nodes: inicial `720×450`, histórico `720×680` e detalhe `720×680`. Bounds Playwright: inicial `665×394`, histórico `665×604` com seção de conteúdo `619.56×525.98`, detalhe `665×604`; não houve clipping ou overflow horizontal observável. |
| JI-FINAL-02 | `useFeedbackDialog.ts` envia sempre `CreateFeedbackReportRequest`; o caminho sem anexo não reconstrói mais `FeedbackReport`/autor legado. O teste unitário direcionado passou 6/6. |
| JI-FINAL-03 | F3-T4 e F5-T3 estão marcadas `[x]`; `plan.md` permanece `in_progress` e `spec.md` `draft` até o aceite final, sem divergência operacional ativa. |

### Sensores repetidos após a correção visual

- `npm run check:code`: passou, com warnings preexistentes.
- `npm run check:types`: passou; permanece apenas o aviso de Node `22.17.0`.
- `npm run test:unit`: passou: Core 175/636, Web 108/466, Studio 13/58,
  Server 166/313; warnings de JSDOM permanecem não bloqueantes.
- `npm run check:architecture`: passou, 3664 módulos e 6543 dependências.
- `NEXT_PUBLIC_DISCORD_CHANNEL_URL=... npm run build:web`: passou; houve apenas
  o warning de `Unhandled Rest Api error: 404` durante uma página estática e o
  aviso de depreciação de middleware.
- `git diff --check`: passou após remover whitespace documental.

### Playwright autenticado e comparação visual

O fluxo real usou login por `waitForURL('**/space')`, abriu o diálogo na rota
protegida `/space`, carregou histórico e detalhe contra o Server em `3334` e
gerou as capturas finais. O navegador observou respostas `200` para unread,
histórico e detalhe; os `401` transitórios e falhas de assets antigos do R2
continuam registrados como warnings de ambiente, não como falha do fluxo de
feedback. Os exports Pencil canônicos permanecem em `/tmp/stardust-pencil-final`.

## Judge Implementation Final — aceite formal anterior — invalidado

- **Veredito:** `accepted`.
- **Modo:** `final`; Spec revisão `2`; fase `F6`.
- **Escopo:** diff integrado, Contract vigente, CAs, UI Layer, comparação
  Pencil/Web, Playwright autenticado, Supabase Dev e Quality Gate.
- **Findings bloqueantes:** nenhum.
- **CA-01–CA-28:** aceitos pelo Judge Final independente.
- **Gates:** `check:code`, `check:types`, `test:unit`, `check:architecture`,
  `git diff --check`, builds Core/Server/Studio/Web e validação remota no
  Supabase Dev aceitos. Warnings ambientais permanecem registrados acima.

O Judge registrou como observação não bloqueante que a aceitação visual foi
baseada na matriz persistente, screenshots e `design/stardust.pen`, sem nova
interação no MCP Pencil durante a avaliação isolada.

Esse veredito foi invalidado pela correção posterior de acessibilidade/estado
na View do diálogo, conforme a regra de validade no HEAD avaliado.

## Judge Implementation Final — revalidação do worktree — 2026-08-11

- **Veredito:** `accepted`.
- **Modo:** `final`; Spec revisão `2`; fase `F6`.
- **Commit avaliado:** `410b1a5d5163f54c3fe4afa8c735eeea173e748c` mais o diff
  não commitado do worktree presente nesta execução.
- **Escopo:** Contract CA-01–CA-28, diff integrado, findings anteriores,
  auditoria UI, matriz Pencil/Web, Supabase Dev, Playwright, sensores e builds.
- **Findings bloqueantes:** nenhum.

### Regressão encontrada e resolvida durante o fechamento

O primeiro `test:integration` do worktree passou 3/6 cenários e falhou nos
fluxos de histórico/detalhe porque a refatoração não materializava
`feedback-history-title` e porque o estado fechado não era um texto localizável
como `Fechado`. A View foi corrigida com o `id` no `Dialog.Title` e um `span`
semântico para o status. A suíte repetida passou 6/6, incluindo histórico,
leitura, criação, anexo JPEG, resposta, falha recuperável e fechado somente
leitura.

### Sensores e builds finais após a correção

| Comando | Estado | Evidência |
| --- | --- | --- |
| `npm run check:code` | passed with warnings | 7/7 pacotes; warnings preexistentes fora do escopo |
| `npm run check:types` | passed | 7/7 pacotes; apenas aviso de Node `22.17.0` do react-router |
| `npm run test:unit` | passed | Core 175/636, Web 108/466, Studio 13/58, Server 166/313 |
| `npm run check:architecture` | passed | 3.664 módulos e 6.543 dependências, sem violações |
| `git diff --check` | passed | sem whitespace inválido |
| `npm --workspace @stardust/web run test:integration -- src/app/tests/reporting/feedback-dialog.test.ts` | passed | 6/6 cenários; warnings conhecidos de middleware/assets |
| `npm run build:core` | passed | build Core concluído |
| `npm run build:server` | passed | build Server e substituição de imports concluídos |
| `npm run build:studio` | passed | build Studio concluído; aviso de Node/chunks não bloqueante |
| `NEXT_PUBLIC_DISCORD_CHANNEL_URL=... npm run build:web` | passed | build Web concluído; 404 de API durante geração estática e middleware deprecated registrados como warnings |

### Veredito independente

CA-01–CA-28 permanecem aceitos. A correção posterior é limitada à View,
preserva os contratos, não altera ownership, persistência ou autorização, e foi
validada por integração browser, typecheck, unit, arquitetura e build no
worktree avaliado. O SHA versionado avaliado é
`410b1a5d5163f54c3fe4afa8c735eeea173e748c`; o diff adicional permanece sem
commit para o handoff desta task.

## Conclusão

- **Estado:** `completed`.
- **Próxima ação:** nenhuma; entrega pronta para handoff/revisão de PR.

## Correções do review do PR — 2026-08-11

| Finding | Correção | Evidência no HEAD |
| --- | --- | --- |
| Admin reply/upload usava client JWT | contas god selecionam `supabaseAdmin`; contas comuns mantêm o client da requisição | teste `selectFeedbackClient`, typecheck e unit Server passaram |
| service-role tinha fallback silencioso | `SUPABASE_SERVICE_ROLE` é obrigatório fora de `MODE=test`; fallback só existe no setup explícito de testes | `check:types`, `check:code` e unit passaram |
| deep link era perdido após login | rotas privadas seguras são codificadas em `nextRoute` ao redirecionar para login | 15 testes do `VerifyAuthRoutesController` e integração Web passaram |
| nome original era tratado como storage key | `originalName` aceita metadata de exibição; chave gerada, MIME, tamanho e metadados do storage continuam validados | testes Core/Validation e integração Web 55/55 passaram |
