---
spec: ./spec.md
spec_revision: 1
base_commit: 46830574d9b8d9f515ff8a0758ff54d5c9e571bf
status: in_progress
judge_plan_verdict: accepted
last_updated_at: 2026-08-06
---

# Evaluation — Histórico e conversas no diálogo de feedback

## Registro inicial

Este arquivo foi criado após o primeiro julgamento relevante do Plan, conforme
as regras do SDD. A implementação integrada está na F6; o commit-base é apenas
uma referência histórica, pois o diff atual ainda não foi commitado.

## Evidências disponíveis

| Evidência | Resultado |
| --- | --- |
| `git rev-parse HEAD` antes do Plan | `46830574d9b8d9f515ff8a0758ff54d5c9e571bf` |
| `git diff --check` no Plan inicial | passou |
| Inspeção dos paths Validation/Supabase | revelou os paths corrigidos por JP-01 e JP-02 |
| Spec revisão 1 | `open`, Judge Spec `accepted`, nenhum finding de produto aberto |
| Judge Plan primeira avaliação | `failed`, findings JP-01–JP-05 abaixo |
| F1 Core/Validation | implementada; typecheck Core/Validation passou; 636 testes unitários do Core passaram; check direcionado da área sem erros, apenas warnings preexistentes |
| Supabase Dev inspeção | tabelas `feedback_reports`, `feedback_messages`, `feedback_message_attachments` e `feedback_outbox_events` confirmadas; alerta remoto existente de RLS desabilitado registrado, sem alteração automática |
| F2 migration remota | aplicada com sucesso via Supabase Dev; `last_admin_message_at` e `author_read_at`, índices de author history/unread e funções `list_user_feedback_reports`, `count_unread_user_feedback_reports`, `mark_user_feedback_report_read` confirmados; funções `security_definer=false`; RLS habilitado nas três tabelas, policies de SELECT/INSERT/UPDATE por ownership confirmadas e execute de `PUBLIC`/`anon` revogado nas três funções |
| F2 código | Server `check:types` passou; check direcionado de mapper/repository/types passou |
| F3 código/testes | Server typecheck passou; 9 testes unitários de controllers e job Discord passaram; rotas autenticadas e queue foram adicionadas |
| F3 integração | o teste dedicado permanece incompatível com a regra de não usar Supabase local; em browser real autenticado, `/mine`, `/mine/:id` e `/read` retornaram 200/200/204 pelo Server local apontado ao Supabase Dev |
| F4 código | Web typecheck passou; ReportingService, rota deep link e allowlist de `nextRoute` implementados; testes Web focados passaram (23/23) |
| F5 UI/Pencil | montagem global autenticada, trigger responsivo, histórico/detalhe/conversa, estados loading/error/empty/content/closed e composer implementados; typecheck e integração Web passaram; node `zSm9F` atualizado via Pencil e screenshot de `r6xBJD` verificado |
| Preflight final | `npm run check:code`, `npm run check:types` e `npm run check:architecture` passaram; o typecheck emite apenas o aviso de Node `22.17.0` vs requisito `>22.22.0`; `test:unit` permanece parcial porque o Server falha somente no teste de cascata que tenta `psql` em Supabase local (`127.0.0.1:54322`), fonte proibida pelo AGENTS.md; Studio isolado e sob a execução observada passou |
| Web integração | os seis cenários de `feedback-dialog.test.ts` passaram (histórico/detalhe, criação, seleção de JPEG, resposta, falha recuperável e fechado); a suíte anterior tinha 49/49 antes da adição desses cenários; o mock de 204 foi corrigido para suportar o contrato real |
| Upload inicial selecionado | o nome original é preservado em `initialAttachment.originalName`, enquanto a chave enviada ao endpoint é um UUID `.png`/`.jpg`, conforme a validação de storage do Server; unit e Playwright direcionados passaram |
| Upload real no Dev | bloqueado por storage externo | fluxo autenticado com JPEG selecionado obteve signed upload `201`, mas o `PUT` ao host R2/Cloudflare falhou (`requestfailed`) e o `POST /reporting/feedback` não foi executado; consulta remota confirmou que nenhum reporte da fixture foi criado |
| Browser real autenticado | parcial com warning de sessão | `source ./scripts/export-web-app-e2e-env.sh` + Inngest, Server e Web separados: login chegou a `/space` por `waitForURL`; a fixture remota validou histórico 200, detalhe 200, leitura 204, resposta 201 com draft vazio após refresh e deep link fechado somente leitura; `requestfailed=0`, mas houve 401 transitório no middleware/renovação, seguido de refresh 201 e respostas 200; a deduplicação client-side de refresh e a consulta inicial idempotente foram adicionadas e testadas |
| Matriz manual complementar | parcial | viewport mobile 390px validou trigger, histórico, filtros, seleção de `manual.png` e ausência de overflow horizontal; viewport desktop 1440px validou o mesmo layout; resposta 500 injetada no carregamento exibiu estado de erro com `Tentar novamente`; upload real recebeu signed URL `201`, mas o `PUT` ao R2/Cloudflare falhou antes da criação, sem registro persistido; falhas reais de criação/resposta continuam cobertas pelo fluxo test-only |
| Supabase Dev — fixture final | passed | MCP `supabase_dev` conectado: migrations até `20260807000901` e tabelas/RLS confirmados; fixture controlada teve 11 reportes do usuário (8 `open`, 3 `closed`), 2 respostas admin não lidas, 1 observada e 1 reporte de outro usuário; RPC list/count/read validaram paginação, unread e leitura monotônica; fixture foi removida e restaram 0 reportes/0 mensagens marcados |

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
| `npm run test:unit` | partial — bloqueio ambiental | execução mais recente: Server teve 165/166 suítes e 311/312 testes aprovados; Web teve 107/107 suítes e 464/464 testes aprovados; o único teste restante tenta `psql` local em `127.0.0.1:54322`; a task global falha somente por esse ambiente |
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

## Judge Implementation Final — resultado único

- **Veredito:** `failed`.
- **Modo:** `final`, Spec revisão 1, diff não commitado sobre
  `46830574d9b8d9f515ff8a0758ff54d5c9e571bf`.
- **Findings:** JI-01 RLS/ownership, JI-02 upload inicial, JI-03 anexos/drafts,
  JI-04 erro seguro do detalhe e JI-05 evidência autenticada/integração server.
- **Regra de execução:** este foi o único Judge final; não será repetido.

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
o RLS aplicado. Elas permanecem sem novo aceite independente porque o Judge final
já foi consumido conforme a Spec. JI-05 continua aberto: a conta E2E real não é
mais um bloqueio para o browser, mas o teste automatizado de rotas ainda tenta
Supabase local; a evidência válida disponível para essas rotas é o fluxo manual
real contra o Supabase Dev.

## Ação após a primeira avaliação

Corrigir JP-01–JP-05 no `plan.md`, executar novo Judge Plan read-only e só
encaminhar a Spec para `implement-plan` se o veredito for `accepted`.

## Judge Plan — segunda avaliação

- **Veredito:** `accepted`.
- **Evidência:** os paths de Validation e Supabase foram confirmados na
  codebase; F3-T3/F3-T4 possuem ownership disjunto e dependem de F3-T2;
  `evaluation.md` existe; F6-T2 define fixture repetível no Supabase Dev,
  limpeza, IDs sem credenciais e mapeamento para os CAs.
- **Findings bloqueantes:** nenhum; JP-01–JP-05 resolvidos.
- **Observação não bloqueante:** F3-T4 ainda agrupa múltiplas rotas em um teste;
  pode ser dividido posteriormente conforme a Rule, sem bloquear o handoff.

## Próxima ação

F1, F2, F4 e F5 estão verificadas em código/typecheck e os cenários Web
direcionados passaram. F3-T4 continua parcial porque o teste de rota legado
tenta Supabase local; F6-T2 continua parcial apenas para upload/falhas reais e
por causa do 401 transitório observado na sessão autenticada.
