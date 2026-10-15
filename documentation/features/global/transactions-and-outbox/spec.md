---
title: Transações compartilhadas e outbox durável
status: in_progress
revision: 2
source:
  - type: direct-request
    ref: codex-task
scope:
  - packages/core
  - apps/server
last_updated_at: 2026-10-15
---

# Context and scope

Implementar o pedido confirmado nesta conversa: conservar as transações compartilhadas
existentes, padronizar o boundary de transação para todos os produtores de eventos com
persistência e adicionar outbox durável, adaptando o padrão Scoops ao StarDust.
Origem técnica direta, sem Issue criada e sem mudança de requisitos de produto/PRD.
Não copiar NestJS, módulos Scoops ou seus identificadores. Sem frontend, merge, deploy,
publicação, aplicação de migrations remotas ou transação distribuída.

Baseline: Broker publica diretamente no Inngest; feedback usa buffer em memória após commit;
repositories Drizzle já recebem conexão/access explícitos e alguns usam savepoints locais.
A exclusão de outbox na entrega histórica #602 não se aplica a esta nova entrega autorizada.
O usuário confirmou migração de todos os produtores, não apenas feedback, e transação + outbox.
A recomendação aceita nesta conversa conserva serializable e um retry 40001/40P01.

# Implementation Contract

| ID | Comportamento |
| --- | --- |
| RF-01 | Database.run delimita um callback atômico; repositories existentes e outbox compartilham o executor, mantendo autorização/access explícitos. |
| RF-02 | Produtores Core migram para Database obrigatório, composto na borda; falhas revertem todos os writes e eventos participantes. |
| RF-03 | Broker grava evento durável no executor corrente; publicação externa ocorre somente pelo dispatcher após commit. |
| RF-04 | Dispatcher suporta múltiplas instâncias, leases, recuperação, backoff, limite de tentativas e retenção sem expor payloads ou segredos. |
| RF-06 | Corrigir todos os warnings/errors reportados pelo gate Server, incluindo dívida anterior, preservando comportamento e sem alterar baseline, thresholds ou exclusões. |
| RF-05 | Eventos/IDs, contratos HTTP, jobs/steps e efeitos externos preservam suas responsabilidades; novas garantias têm testes reais de persistência. |

| CA | RF | Dado | Quando | Então | Evidência esperada |
| --- | --- | --- | --- | --- | --- |
| CA-01 | RF-01 | Dois repositories no mesmo callback | Um write posterior falha | Nenhum write nem evento é confirmado | Integração de rota com falha de enqueue |
| CA-02 | RF-01 | Transação ativa | Operação aninhada participa | Reutiliza executor sem commit independente; contexto não vaza entre requisições | Integração de rota e inspeção |
| CA-03 | RF-02 | Produtor de qualquer domínio | Executa write e publish | Ambos entram em Database.run; construtores exigem Database | Typecheck, inventário e testes Core/handlers |
| CA-04 | RF-01 | Erro SQL 40001 ou 40P01 | Callback falha | Retry único recria callback; segundo conflito vira ConflictError; outros erros não repetem | Testes de boundary e integração |
| CA-05 | RF-03 | Evento com ID opcional estável | Broker publica | Evento fica pending no banco sem envio de rede; ID é preservado e deduplicado | Integração reporting/profile |
| CA-06 | RF-04 | Eventos pending elegíveis | Dispatchers concorrentes reservam | Lote até 100 usa SKIP LOCKED e lease de 5 minutos; ACK exige owner correto | Integração e teste de job |
| CA-07 | RF-04 | Evento reservado | Inngest aceita ou falha | published em sucesso; failed com tentativas/backoff 1/5/15/60 min em falha; retry automático abaixo de 10 | Teste de job e integração |
| CA-08 | RF-04 | Processo cai ou notificação é perdida | Outro sweep ocorre | Lease expirado é recuperado; pending é reencontrado; fila não depende de notificação | Teste de job e integração |
| CA-09 | RF-04 | Evento published há mais de 30 dias | Cleanup executa | Remove somente published antigo; failed terminal permanece disponível para diagnóstico | Teste de job/integração |
| CA-10 | RF-05 | Auth/storage/AI externos | Operação executa | IO externo não é repetido por retry SQL; steps Inngest não são envolvidos por uma transação longa | Inspeção, testes de handlers/jobs |
| CA-11 | RF-06 | Gate Server com106warnings/2errors | Refactor autorizado pelo usuário | Zero warnings e zero errors no comando oficial; tipos e testes dos boundaries afetados passam | Complexidade, tipos, lint e regressões por impacto |

# Technical Contract

## Core

Database é port agnóstico: `run<Result>(operation: () => Promise<Result>): Promise<Result>`.
Todos os use cases que usam Broker recebem Database como primeiro argumento obrigatório,
sem fallback passthrough em produção, mantendo os repositories e Broker já injetados.
O callback cobre leitura de decisão, writes e enqueue; cada retry recria as entidades.
Core não importa Drizzle/AsyncLocalStorage. Read-only/event-only produtores podem usar o
mesmo port por consistência; Auth remoto não é convertido em write PostgreSQL.

OutboxEvent: `{ id: string; name: string; payload: unknown; attempts: number }`.
OutboxRepository possui os métodos:
- `enqueue(event: Event, eventId?: Text): Promise<void>`;
- `reserve(now: Date, owner: Text, limit: Integer): Promise<OutboxEvent[]>`;
- `markPublished(id: Text, owner: Text, now: Date): Promise<boolean>`;
- `markFailed(id: Text, owner: Text, attempts: Integer, availableAt: Date, now: Date): Promise<boolean>`;
- `recover(now: Date): Promise<void>`;
- `cleanup(cutoff: Date): Promise<number>`.

## Database e autorização

DrizzleUnitOfWork implementa Database. AsyncLocalStorage mantém executor e estado da
transação, isolados por execução async. run aninhado reutiliza transação e não pode
comitar parcialmente; rejeição marca rollback-only mesmo se capturada por outro nível.
O root roda serializable read/write e repete uma vez em 40001/40P01, incluindo causas
aninhadas. Outros erros mantêm semântica pública. DrizzleRepository resolve executor
corrente sem substituir access; preserve causa SQL internamente para retry sem expor SQL.
Repositories com transações locais continuam usando savepoints da transação corrente.
Nenhuma regra de ownership é removida ou substituída por conexão privilegiada.

Tabela `outbox_events`: id text PK (eventId explícito ou UUID), event_name text,
payload jsonb, sequence bigserial para ordem estável, status pending/publishing/published/failed,
attempts >= 0, available_at/created_at/updated_at/published_at timestamptz,
reserved_by text, reservation_expires_at timestamptz, last_error_code text sanitizado.
Constraint mantém lease/owner somente em publishing; índices cobrem disponibilidade,
failed elegível, lease e retenção. Sem FK de domínio: eventos sobrevivem à deleção do agregado.
Sem backfill de eventos antigos ou acesso browser; grants de anon/authenticated/PUBLIC
revogados na nova tabela/sequência, sem relaxar a segurança existente.
Drizzle Kit gera migration/snapshot/journal; nomes concretos são atribuídos pelo gerador
sob `apps/server/src/database/drizzle/migrations/`, e entram no mapa antes de avaliação final.
SQL de grants é migration custom quando necessário; aplicar somente no Supabase local.

## Produtores e dispatcher

InngestBroker mantém a assinatura Broker.publish e passa a enqueue durável; IDs de
feedback permanecem exatamente iguais. Outbox insert participa do callback quando ativo;
publicação isolada de eventos de Auth/controle também é persistida, sem prometer atomicidade
com serviço externo. Dispatcher usa InngestEventPublisher para envio direto com o ID da row.
Não chamar Broker de enqueue no dispatcher para evitar recursão.
DispatchOutboxEventsJob é agnóstico do SDK: recebe OutboxRepository, Broker de transporte,
clock e owner quando necessários; handle(amqp) roda recuperação/reserva/envio/ACK e cleanup
por métodos explícitos; não registra payload ou erro bruto. OutboxDispatcher orquestra
sweep periódico de 1 segundo, single-flight por processo, startup e shutdown aguardável;
notificações podem acelerar mas não substituem sweep. Cleanup tem no máximo uma execução
diária; retenção de 30 dias. Sem mudança de requisitos de produto, sem garantia exactly-once:
falha entre send e ACK pode reenviar o mesmo ID; preservar idempotência existente.
Bootstrap real inicia dispatcher, fixtures não iniciam worker em background inadvertidamente.

HTTP/controllers/MCP e composição de jobs recebem DrizzleUnitOfWork. Feedback elimina
buffer request-local e usa o boundary reutilizável, mantendo rollback em RestResponse
falha. Orquestrações multi-use-case só abrangem grupos DB, nunca a chamada inteira de
Auth/storage/AI ou handler Inngest. Grupos puramente DB de criação de usuário e
recompensa compartilham callback; consolidar steps DB quando necessário para atomicidade.
Antes de deploy, drenar execuções antigas afetadas por mudança de step, sem migrar
implicitamente o histórico Inngest nesta tarefa. Arquivos .rest dos grupos afetados são revisados
para paridade; não fabricar alterações se contratos/examples já estiverem corretos.

## Mapa de paths

| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| `apps/server/rest-client/profile/users.rest` | Modify | Producer request payloads | RF-02 | Router validation schemas | Verified REST parity |
| `apps/server/rest-client/challenging/challenges.rest` | Modify | Producer request payloads | RF-02 | Router validation schemas | Verified REST parity |
| `apps/server/rest-client/lesson/text-blocks.rest` | Modify | REST examples | RF-02 | Existing route contracts | Labelled request parity |
| `apps/server/rest-client/reporting/feedback-reports.rest` | Modify | REST examples | RF-02 | Existing route contracts | Labelled request parity |
| `scripts/outbox-schema-catalog.json` | Create | Exact appended outbox catalog | RF-03 | Approved SQL migrations | Catalog drift regression tests |
| `scripts/check-drizzle-transition.mjs` | Modify | Appended migration verification | RF-03 | Frozen baseline and outbox catalog | Transition tooling tests |
| `apps/server/scripts/migrate-database.ts` | Modify | Apply post-baseline migrations | RF-03 | Verified journal prefix and catalog | Transition tooling tests and local migration |
| `scripts/tests/check-drizzle-transition.test.mjs` | Modify | Migration safety regression tests | RF-03 | Transition verifier | node test |
| `apps/server/src/ai/challenging/tools/tests/DeleteChallengeTool.test.ts` | Modify | DeleteChallengeTool.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/ai/challenging/tools/tests/PostChallengeTool.test.ts` | Modify | PostChallengeTool.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/drizzle/migrations/0003_tranquil_mulholland_black.sql` | Generate | 0003_tranquil_mulholland_black | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/drizzle/migrations/0004_outbox_server_access.sql` | Generate | 0004_outbox_server_access | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/drizzle/migrations/meta/0003_snapshot.json` | Generate | 0003_snapshot | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/drizzle/migrations/meta/0004_snapshot.json` | Generate | 0004_snapshot | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/drizzle/migrations/meta/_journal.json` | Modify | _journal | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/queue/inngest/InngestBroker.ts` | Modify | InngestBroker | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/queue/jobs/profile/tests/CreateUserJob.test.ts` | Create | CreateUserJob.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/challenging/challenges/tests/DeleteChallengeController.test.ts` | Modify | DeleteChallengeController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/challenging/challenges/tests/PostChallengeController.test.ts` | Modify | PostChallengeController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/lesson/tests/CancelTextBlockAudioGenerationController.test.ts` | Modify | CancelTextBlockAudioGenerationController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/lesson/tests/CancelTextBlocksAudioGenerationInBatchController.test.ts` | Modify | CancelTextBlocksAudioGenerationInBatchController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/lesson/tests/RemoveTextBlockAudioController.test.ts` | Modify | RemoveTextBlockAudioController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/lesson/tests/TriggerTextBlockAudioGenerationController.test.ts` | Modify | TriggerTextBlockAudioGenerationController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/lesson/tests/TriggerTextBlocksAudioGenerationInBatchController.test.ts` | Modify | TriggerTextBlocksAudioGenerationInBatchController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/AcquireAvatarController.test.ts` | Modify | AcquireAvatarController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/AcquireInsigniaController.test.ts` | Modify | AcquireInsigniaController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/AcquireRocketController.test.ts` | Modify | AcquireRocketController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/CompleteSpaceController.test.ts` | Modify | CompleteSpaceController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForChallengeCompletionController.test.ts` | Modify | RewardUserForChallengeCompletionController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarChallengeCompletionController.test.ts` | Modify | RewardUserForStarChallengeCompletionController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/profile/users/tests/RewardUserForStarCompletionController.test.ts` | Modify | RewardUserForStarCompletionController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/space/planets/tests/ReorderPlanetStarsController.test.ts` | Modify | ReorderPlanetStarsController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/space/planets/tests/ReorderPlanetsController.test.ts` | Modify | ReorderPlanetsController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/rest/controllers/space/stars/tests/AppendNextStarToBodyController.test.ts` | Modify | AppendNextStarToBodyController.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/tests/jobs/DispatchOutboxEventsJob.integration.test.ts` | Create | DispatchOutboxEventsJob.integration.test | RF-01 a RF-05 conforme boundary | Transaction and outbox contracts | Focused affected checks |
| `apps/server/src/database/seed.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/database/seeders/AuthSeeder.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/database/seeders/ProfileSeeder.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/database/seeders/SeedDatabase.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/database/seeders/seed-config.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/database/seeders/seed-data.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `apps/server/src/rest/controllers/health/tests/CheckHealthController.test.ts` | Modify | Health socket regression boundary | RF-06/CA-11 | CheckHealthController | Health unit cases |
| `apps/server/src/rest/controllers/health/CheckHealthController.ts` | Modify | Complexity correction | RF-06/CA-11 | Existing Server boundaries | Focused boundary regression and official complexity |
| `packages/core/src/global/interfaces/Database.ts` | Create | Database | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/global/interfaces/OutboxRepository.ts` | Create | OutboxRepository | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/global/domain/types/OutboxEvent.ts` | Create | OutboxEvent | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/DrizzleUnitOfWork.ts` | Create | DrizzleUnitOfWork | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/DatabaseTransactionContext.ts` | Create | DatabaseTransactionContext | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/repositories/global/DrizzleOutboxRepository.ts` | Create | DrizzleOutboxRepository | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/models/global/outbox-event-model.ts` | Create | outbox-event-model | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/inngest/InngestEventPublisher.ts` | Create | InngestEventPublisher | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/inngest/OutboxDispatcher.ts` | Create | OutboxDispatcher | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/global/DispatchOutboxEventsJob.ts` | Create | DispatchOutboxEventsJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/global/tests/DispatchOutboxEventsJob.test.ts` | Create | DispatchOutboxEventsJob.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/TriggerTextBlocksAudioGenerationInBatchUseCase.ts` | Modify | TriggerTextBlocksAudioGenerationInBatchUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/CancelTextBlockAudioGenerationUseCase.ts` | Modify | CancelTextBlockAudioGenerationUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/TriggerTextBlockAudioGenerationUseCase.ts` | Modify | TriggerTextBlockAudioGenerationUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/RemoveTextBlockAudioUseCase.ts` | Modify | RemoveTextBlockAudioUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/CancelTextBlocksAudioGenerationInBatchUseCase.ts` | Modify | CancelTextBlocksAudioGenerationInBatchUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/ReorderPlanetsUseCase.ts` | Modify | ReorderPlanetsUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/GetNextStarUseCase.ts` | Modify | GetNextStarUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/ReorderPlanetStarsUseCase.ts` | Modify | ReorderPlanetStarsUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/UnlockFirstStarUseCase.ts` | Modify | UnlockFirstStarUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/HandleStarsNewOrderUseCase.ts` | Modify | HandleStarsNewOrderUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/manual/use-cases/EditGuideContentUseCase.ts` | Modify | EditGuideContentUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/manual/use-cases/DeleteGuideUseCase.ts` | Modify | DeleteGuideUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/ranking/use-cases/ReachFirstTierUseCase.ts` | Modify | ReachFirstTierUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/ranking/use-cases/UpdateRankingsUseCase.ts` | Modify | UpdateRankingsUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/shop/use-cases/AquireDefaultShopItemsUseCase.ts` | Modify | AquireDefaultShopItemsUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/shop/use-cases/AcquireDefaultShopItemsUseCase.ts` | Modify | AcquireDefaultShopItemsUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/SendFeedbackMessageUseCase.ts` | Modify | SendFeedbackMessageUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/ChangeFeedbackReportStatusUseCase.ts` | Modify | ChangeFeedbackReportStatusUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/SendFeedbackReportUseCase.ts` | Modify | SendFeedbackReportUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/CompleteSpaceUseCase.ts` | Modify | CompleteSpaceUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/AcquireInsigniaUseCase.ts` | Modify | AcquireInsigniaUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/AcquireAvatarUseCase.ts` | Modify | AcquireAvatarUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/RewardUserUseCase.ts` | Modify | RewardUserUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/FinishUserCreationUseCase.ts` | Modify | FinishUserCreationUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/UnlockStarUseCase.ts` | Modify | UnlockStarUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/CompleteChallengeUseCase.ts` | Modify | CompleteChallengeUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/AcquireRocketUseCase.ts` | Modify | AcquireRocketUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/challenging/use-cases/DeleteChallengeUseCase.ts` | Modify | DeleteChallengeUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/challenging/use-cases/PostChallengeUseCase.ts` | Modify | PostChallengeUseCase | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/ai/challenging/tools/DeleteChallengeTool.ts` | Modify | DeleteChallengeTool | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/ai/challenging/tools/PostChallengeTool.ts` | Modify | PostChallengeTool | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` | Modify | FeedbackRouter | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/space/HandleStarsNewOrderJob.ts` | Modify | HandleStarsNewOrderJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/space/UnlockFirstStarJob.ts` | Modify | UnlockFirstStarJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/ranking/UpdateRankingsJob.ts` | Modify | UpdateRankingsJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/ranking/ReachFirstTierJob.ts` | Modify | ReachFirstTierJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/shop/AcquireDefaultShopItemsJob.ts` | Modify | AcquireDefaultShopItemsJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/queue/jobs/profile/CreateUserJob.ts` | Modify | CreateUserJob | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/lesson/CancelTextBlocksAudioGenerationInBatchController.ts` | Modify | CancelTextBlocksAudioGenerationInBatchController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/lesson/RemoveTextBlockAudioController.ts` | Modify | RemoveTextBlockAudioController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/lesson/CancelTextBlockAudioGenerationController.ts` | Modify | CancelTextBlockAudioGenerationController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/lesson/TriggerTextBlocksAudioGenerationInBatchController.ts` | Modify | TriggerTextBlocksAudioGenerationInBatchController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/lesson/TriggerTextBlockAudioGenerationController.ts` | Modify | TriggerTextBlockAudioGenerationController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/space/stars/AppendNextStarToBodyController.ts` | Modify | AppendNextStarToBodyController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/space/planets/ReorderPlanetsController.ts` | Modify | ReorderPlanetsController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/space/planets/ReorderPlanetStarsController.ts` | Modify | ReorderPlanetStarsController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/manual/EditGuideContentController.ts` | Modify | EditGuideContentController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/manual/DeleteGuideController.ts` | Modify | DeleteGuideController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/AcquireAvatarController.ts` | Modify | AcquireAvatarController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/CompleteSpaceController.ts` | Modify | CompleteSpaceController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/AcquireRocketController.ts` | Modify | AcquireRocketController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/RewardUserForChallengeCompletionController.ts` | Modify | RewardUserForChallengeCompletionController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/AcquireInsigniaController.ts` | Modify | AcquireInsigniaController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarCompletionController.ts` | Modify | RewardUserForStarCompletionController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/profile/users/RewardUserForStarChallengeCompletionController.ts` | Modify | RewardUserForStarChallengeCompletionController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/challenging/challenges/DeleteChallengeController.ts` | Modify | DeleteChallengeController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/rest/controllers/challenging/challenges/PostChallengeController.ts` | Modify | PostChallengeController | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/tests/RemoveTextBlockAudioUseCase.test.ts` | Modify | RemoveTextBlockAudioUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/tests/TriggerTextBlocksAudioGenerationInBatchUseCase.test.ts` | Modify | TriggerTextBlocksAudioGenerationInBatchUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/tests/CancelTextBlocksAudioGenerationInBatchUseCase.test.ts` | Modify | CancelTextBlocksAudioGenerationInBatchUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/tests/CancelTextBlockAudioGenerationUseCase.test.ts` | Modify | CancelTextBlockAudioGenerationUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/lesson/use-cases/tests/TriggerTextBlockAudioGenerationUseCase.test.ts` | Modify | TriggerTextBlockAudioGenerationUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/tests/UnlockFirstStarUseCase.test.ts` | Modify | UnlockFirstStarUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/tests/HandleStarsNewOrderUseCase.test.ts` | Modify | HandleStarsNewOrderUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/tests/ReorderPlanetStarsUseCase.test.ts` | Modify | ReorderPlanetStarsUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/tests/ReorderPlanetsUseCase.test.ts` | Modify | ReorderPlanetsUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/space/use-cases/tests/GetNextStarUseCase.test.ts` | Modify | GetNextStarUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/manual/use-cases/tests/DeleteGuideUseCase.test.ts` | Modify | DeleteGuideUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/manual/use-cases/tests/EditGuideContentUseCase.test.ts` | Modify | EditGuideContentUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/ranking/use-cases/tests/ReachFirstTierUseCase.test.ts` | Modify | ReachFirstTierUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/ranking/use-cases/tests/UpdateRankingsUseCase.test.ts` | Modify | UpdateRankingsUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/tests/ChangeFeedbackReportStatusUseCase.test.ts` | Modify | ChangeFeedbackReportStatusUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/tests/SendFeedbackMessageUseCase.test.ts` | Modify | SendFeedbackMessageUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/reporting/use-cases/tests/SendFeedbackReportUseCase.test.ts` | Modify | SendFeedbackReportUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/CompleteChallengeUseCase.test.ts` | Modify | CompleteChallengeUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/CompleteSpaceUseCase.test.ts` | Modify | CompleteSpaceUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/AcquireRocketUseCase.test.ts` | Modify | AcquireRocketUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/RewardUserUseCase.test.ts` | Modify | RewardUserUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/UnlockStarUse.test.ts` | Modify | UnlockStarUse.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/AcquireInsigniaUseCase.test.ts` | Modify | AcquireInsigniaUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/profile/use-cases/tests/AcquireAvatarUseCase.test.ts` | Modify | AcquireAvatarUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/challenging/use-cases/tests/PostChallengeUseCase.test.ts` | Modify | PostChallengeUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/challenging/use-cases/tests/DeleteChallengeUseCase.test.ts` | Modify | DeleteChallengeUseCase.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/global/interfaces/index.ts` | Modify | index | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `packages/core/src/global/domain/types/index.ts` | Modify | index | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/DrizzleRepository.ts` | Modify | DrizzleRepository | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/DrizzleClient.ts` | Modify | DrizzleClient | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/errors/DrizzleDatabaseError.ts` | Modify | DrizzleDatabaseError | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/index.ts` | Modify | index | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/database/drizzle/models/index.ts` | Modify | index | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/app/hono/tests/HonoApp.test.ts` | Modify | Startup regression boundary | RF-06/CA-11 | HonoApp | Port limit and original error propagation |
| `apps/server/src/app/hono/HonoApp.ts` | Modify | HonoApp | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts` | Modify | Durable status route regression | RF-03/RF-06/CA-05/CA-11 | Transactional broker | Real enqueue order/visibility/rollback |
| `apps/server/src/tests/routes/reporting/SendFeedbackReportRoute.test.ts` | Modify | SendFeedbackReportRoute.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts` | Modify | SendFeedbackMessageRoute.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/tests/routes/profile/users/AcquireAvatarRoute.test.ts` | Modify | AcquireAvatarRoute.test | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `apps/server/src/tests/fixtures/SupabaseFixture.ts` | Modify | SupabaseFixture | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `documentation/architecture.md` | Modify | architecture | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `documentation/rules/database-rules.md` | Modify | database-rules | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `documentation/rules/queue-layer-rules.md` | Modify | queue-layer-rules | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |
| `documentation/tooling.md` | Modify | tooling | RF-01 a RF-05 conforme boundary | Database, repositories e Broker | Testes de use case, handler/job ou rota afetados |

| `packages/core/src/profile/use-cases/tests/FinishUserCreationUseCase.test.ts` | Create | FinishUserCreationUseCase.test | RF-02/RF-05 | Database | Testes Core/jobs |
| `packages/core/src/shop/use-cases/tests/AcquireDefaultShopItemsUseCase.test.ts` | Create | AcquireDefaultShopItemsUseCase.test | RF-02/RF-05 | Database | Testes Core/jobs |
| `packages/core/src/shop/use-cases/tests/AquireDefaultShopItemsUseCase.test.ts` | Create | AquireDefaultShopItemsUseCase.test | RF-02/RF-05 | Database | Testes Core/jobs |
| `apps/server/src/queue/inngest/functions/ProfileFunctions.ts` | Modify | ProfileFunctions | RF-02/RF-05 | Database | Testes Core/jobs |
| `apps/server/src/queue/inngest/functions/SpaceFunctions.ts` | Modify | SpaceFunctions | RF-02/RF-05 | Database | Testes Core/jobs |
| `apps/server/src/queue/inngest/functions/RankingFunctions.ts` | Modify | RankingFunctions | RF-02/RF-05 | Database | Testes Core/jobs |
| `apps/server/src/queue/inngest/functions/ShopFunctions.ts` | Modify | ShopFunctions | RF-02/RF-05 | Database | Testes Core/jobs |

# Validation Contract

Seleção por impacto conforme Tooling: testes Core dos produtores do inventário, testes
Server dos controllers/jobs/tools alterados, integração real das rotas reporting/profile
para enqueue/rollback e cenários de worker/concorrência/leases no boundary permitido.
Não criar testes dedicados de repositories/mappers/fixtures. Acrescentar cenários de
infraestrutura de outbox em testes de rota existentes ou testes de job permitidos.
Typecheck Core e Server; checks de consumers Web/Studio apenas se as assinaturas alcançarem
esses projetos. Lint Biome somente paths alterados; complexidade Core/Server e arquitetura
aplicáveis sem baseline novo. Build Server se necessário ao bootstrap/SDK, sem build por retry.

Comandos focados usam `--runTestsByPath` e contagens reais; integrar antes das seleções
Server com Supabase local preparado por `npm run db:test -w @stardust/server`.
`check:spec-definition`, `check:plan-definition`, `check:spec-implementation --base c79b11a5f9c88f641f233665b90d1302feaae36b`
e `check:test-integrity --base c79b11a5f9c88f641f233665b90d1302feaae36b` devem passar. Ratchet agregado permanece no CI;
não apresentar cobertura focada como medição global. Smoke UI não aplicável: sem frontend
ou contrato visual alterado. VM-01: API local real, mutação autenticada e consulta de row
outbox/dados; evidencia EV de status, persistência e enqueue sem credenciais/logs sensíveis.
Falha de infra requerida mantém Evaluation in_progress, nunca substituída por mocks.

# Documentation alignment and revision history

Rule Pack: AGENTS.md; architecture.md; modules.md; tooling.md; rules/database-rules.md,
queue-layer-rules.md, core-package-rules.md, code-conventions-rules.md,
use-cases-testing-rules.md, handlers-testing-rules.md, server-routes-testing-rules.md,
server-application-rules.md. Autoridades superiores recebem a nova convenção antes do código,
com autorização do usuário para a implementação nesta conversa. PRDs não mudam comportamento.

| Revisão | Data | Motivo |
| --- | --- | --- |
| 2 | 2026-10-15 | User explicitly requests fixing all Server complexity findings, including preexisting seed/health; RF-06/CA-11, behavior preserved, no baseline changes. |
| 1 | 2026-10-15 | Pedido confirmado: todos os produtores, transações existentes preservadas e outbox durável; adotar padrão Scoops com fronteiras StarDust. |

Correção de revisão ACH-01: IDs textuais/owner usam Text, limites e tentativas Integer;
DTO OutboxEvent mantém transporte serializável; SQL serializa estruturas no adapter.

Spec Reviewer: revisão 1 clear após corrigir ACH-01 (estruturas semânticas nos ports).

Revision2 — explicit user request “fix all” authorizes all Server complexity findings, including preexisting seed/health code. No unresolved design decision: behavior-preserving refactor, unchanged baselines/thresholds/exclusions. Grilling frontier empty; user instruction supplies shared scope authority. No issue/PR/publication added.

Revision2 Spec Reviewer clear; implementation assignments and all local exits passed. Evaluation ready; Spec remains in_progress pending separately authorized publication/CI/conclusion.
