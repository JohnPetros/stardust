---
title: Persistência com Drizzle e confirmação de perfil via SSE — implementation plan
status: superseded
spec: ./spec.md
spec_revision: 20
evaluation: ./evaluation.md
updated_at: 2026-10-06
---

# Execution status

> **Superseded by user decision, Spec revision 20.** D2, S2, W2, and D3 are retired; their previous outcomes, task cards, and validation rows are historical only. The Plan does not establish that their work passed. C2 remains solely for documenting cancellation and handing off the existing workspace/evidence; it is not an implementation acceptance or cutover gate.

- **Spec:** [spec.md](./spec.md), `superseded`, revisão 20. A decisão cancela os resultados ainda não entregues; os contracts anteriores são somente histórico.
- **Motivo:** o usuário encerrou a entrega planejada antes da aceitação integrada. As evidências e pendências existentes permanecem registradas para handoff, sem serem tratadas como sucesso.
- **Fase atual:** somente C2 — cancellation closeout and handoff. C0, D1, S1, W1 e C1 permanecem como histórico de fases concluídas; D2, S2, W2 e D3 foram retiradas. Nenhuma validação integrada, parity remota ou cutover é declarada aprovada por esta decisão.
- **Próxima ação:** preservar o diff de trabalho, registrar evidências pendentes e limitações na Evaluation e entregar o estado atual. Nenhuma continuação de Builder está autorizada por este Plan superseded.
- **Próximos Builders:** nenhum.
- **Blockers:** não aplicável ao escopo cancelado. Os gates pendentes continuam descritos como histórico e não foram executados nem aprovados.
- **Autoridades:** AGENTS.md, documentation/sdd.md, architecture.md, modules.md, tooling.md, Rule Pack da Spec e [handoff](../../../../design/handoff.md). `documentation/overview.md` está ausente, conforme gap já registrado. Os trechos de transição aprovados prevalecem sobre descrição histórica do adapter legado.

## Decisões de execução confirmadas

Em 2026-10-01, o usuário aprovou três Builders estáveis com paths exclusivos, paralelismo após estabilização da fundação e gates por fase com evidência/Implementation Reviewer. Em 2026-10-03, pediu resolver todos os bloqueios; a revisão 7 preserva thresholds/baselines, combina coverage Server com as rotas S2 e deixa quality gates globais no C2. `authActions.ts` entrou no mapa W2 para corrigir a resposta social obsoleta. Execução inteiramente sequencial e validação concentrada apenas no final continuam descartadas.

As decisões e waves abaixo descrevem o planejamento histórico anterior à revisão 20. Não autorizam nova implementação, não mantêm requisitos ativos e não substituem a decisão de cancelamento.

## Coordenação e recovery

A task principal possui exclusivamente manifests de dependências/lockfile (C0), CI/Compose/ambiente versionado/scripts de exportação e autoridades/runbook (C1), Spec/Plan/Evaluation e execução dos gates (C2). Builders não editam essas autoridades. O arquivo `.env.local` não entra no diff; a task principal prepara valores somente localmente por scripts de exportação, sem expor segredos. Mudanças de código já presentes no workspace devem ser inventariadas no kickoff e preservadas; sua existência não prova cumprimento da entrega.

C0 altera ambos os package.json e executa uma única instalação npm para gerar o lockfile. Web não remove dependências enquanto ainda possui imports ativos: a remoção dos pacotes Supabase da Web é finalizada pela task principal após W1/W2, com acesso exclusivo aos três paths de C0. Essa retomada usa o mesmo owner e requer nova evidência/review do diff final; não cria conflito com W1/W2.

Antes de cada fase: confirmar Spec/revision/clear, DAG, paths exclusivos, pré-requisitos e `check:plan-definition`. Exits incluem inspeção do diff pela task principal, sensores aplicáveis e Reviewer pareado; relato de Builder não é prova. Falhas geram `ACH-*` em Evaluation, próxima ação e item `in_progress`, sem liberar dependentes. Reusar o Builder responsável para correção, executar novamente somente verificações afetadas e repetir seu Reviewer quando o diff mudar. Mudança material de Contract exige amendment via `create-spec`, nova revisão/clear e reconciliação deste Plan antes de continuar.

Banco local vazio e clone de legado são alvos distintos. Antes de remover migrations legadas em D2, D1 captura nomes/hashes/catalogo do commit fonte e D2 demonstra replay, adoção e rollback em restauração isolada com dados; não depender dos arquivos removidos para recuperar o legado. Reset somente local, com guards e `.env.local` raiz. Nenhuma baseline/adoption/security migration é aplicada remotamente no planejamento.

C1 torna CI/Compose operacional antes de iniciar S2; os trechos documentais de estado vigente só são finalizados pela task principal depois das evidências de C2. D2 conserva os adapters de persistência legados até S2 substituir todos os seus consumidores. D3 os remove após a integração, com inventário de imports e reteste do runtime afetado. W1 cria o transporte SSE, mas a remoção do adapter realtime/tipos/env Web fica em W2 após trocar a composição; nenhuma fase pode remover um símbolo ainda consumido. Barrels D1 são finalizados pelo mesmo Builder Database conforme D2 entrega seus exports, sem publicar referência a arquivo ainda inexistente.

C2 não pode declarar CA-09/EV-05 atendidos apenas porque o runbook foi escrito. Preflight Dev/Prod, backup restaurado, controles de manutenção/drain e SHAs coordenados são gates do primeiro corte, com autorização e operador disponíveis. Enquanto pendentes, registrar o limite e manter esses itens pendentes; não fechar a entrega ou reabrir tráfego sem evidência.

# Execution ledger

| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| ---- | ------- | ----- | ---- | ---------- | ------------- | ------ | -------------- |
| 1 | Task principal | Fundação operacional | C0 | — | — | completed | Dependências fixadas e lockfile npm; instalação validada; EV-10/EV-12 e review do diff de coordenação |
| 1 | Builder Database | Fundação SQL | D1 | C0 | S1 | completed | Manifest legado e models/client/contexto íntegros; tipos/architecture e revisão pareada; EV-03/EV-10 |
| 1 | Builder Server | Ports Core | S1 | C0 | D1 | completed | Novos ports auth/barrel disponíveis sem alterar os ports de persistência; tipos/Core e revisão pareada; EV-10 |
| 2 | Builder Web | BFF, transporte e correção ACH-34 | W1 | S1 | — | completed | Rotas/cookies/SSE/middleware e mocks determinísticos cobertos; warnings Web dos paths W1 removidos sem alterar comportamento; EV-07/EV-09 BFF e revisão pareada aceitos; as seis falhas da integração permanecem no histórico de W2 |
| 3 | Task principal | Tooling, CI e runbook | C1 | W1 | — | completed | Compose/db:test/export/reset/CI e runbook concluídos; revisão integrada aceita e sensores locais passaram. EV-05 remota segue pending no registro histórico |
| 5 | Task principal | Cancellation closeout and handoff | C2 | C0, D1, S1, W1, C1 | — | completed | Registrar decisão de supersession, fases e requisitos retirados, evidências verificadas versus pendentes, e estado do diff preservado. Handoff concluído; não declara implementação, CI, parity remota, cutover ou CA/EV/VM aprovados. |

O ledger acima contém as fases concluídas preservadas e o handoff C2; as dependências de fases canceladas foram retiradas do DAG ativo. As referências antigas a D2/S2 em cards e no histórico são rastreabilidade, não pré-requisitos atuais.

## Task cards

Os cards das fases retiradas D2/S2/W2/D3 e os detalhes antigos de execução são preservados abaixo somente para rastreabilidade. Não são assignments ativos. C2 é o único card de closeout mantido nesta revisão.

Os paths abaixo são projeção de ownership do mapa canônico da Spec, deduplicada em 506 entradas. Cada path de implementação aparece em exatamente um card; sua classificação continua sendo a da Spec. C2 lê esses paths e finaliza evidências, sem adquirir ownership concorrente. Nenhum glob expande o escopo e nenhum card redefine declarations.

### C0

- **Status/owner:** `completed`; Task principal; dependências, geração e wiring CLI aceitos após sensores e revisão pareada. O mesmo owner reabre `apps/server/package.json` em C1 para completar `db:test` com export local/reset/migrate e novamente em C2 para incluir `server-integration` na captura Server de coverage.
- **Dependências/paralelismo:** —; sem paralelismo durante npm install.
- **Paths:** 3 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `package-lock.json` — Generate.
  - `apps/server/package.json` — Modify.
  - `apps/web/package.json` — Modify.

</details>

- **RF/CA:** RF-05, RF-10, RF-12; CA-20, CA-22.
- **Resultado observável:** Disponibilizar as versões fixadas S1, SDK Auth preservado e fonte única npm. Finalizar retirada dos pacotes Web após W1/W2 sem imports pendentes.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: code-conventions-rules.md, server-application-rules.md, web-application-rules.md; Tooling/SDD.
- **Exit:** Instalação e lockfile consistentes; CI-02/CI-03 aplicáveis e review do diff de coordenação. Reabrir este gate na remoção final de dependências e alteração do comando coverage; EV-10/EV-12.

### D1

- **Status/owner:** `completed`; Builder Database.
- **Dependências/paralelismo:** C0; paralelo S1.
- **Paths:** 105 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/server/drizzle.config.ts` — Create.
  - `apps/server/src/database/drizzle/legacy-schema-manifest.json` — Create.
  - `apps/server/src/database/drizzle/DatabaseAccess.ts` — Create.
  - `apps/server/src/database/drizzle/DrizzleClient.ts` — Create.
  - `apps/server/src/database/drizzle/errors/DrizzleDatabaseError.ts` — Create.
  - `apps/server/src/database/drizzle/errors/index.ts` — Create.
  - `apps/server/src/database/drizzle/index.ts` — Create.
  - `apps/server/src/database/drizzle/DrizzleRepository.ts` — Create.
  - `apps/server/src/database/drizzle/models/auth/api-key-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/auth/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/category-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-category-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-code-execution-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-difficulty-level-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-source-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/challenge-vote-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/challenging/solution-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/conversation/chat-message-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/conversation/chat-message-sender-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/conversation/chat-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/conversation/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/forum/challenge-comment-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/forum/comment-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/forum/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/forum/solution-comment-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/lesson/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/lesson/question-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/manual/guide-category-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/manual/guide-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/manual/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/playground/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/playground/snippet-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/achievement-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/note-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-acquired-avatar-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-acquired-insignia-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-acquired-rocket-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-challenge-vote-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-completed-challenge-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-recently-unlocked-star-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-rescuable-achievement-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-unlocked-achievement-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-unlocked-star-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-upvoted-comment-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/profile/user-upvoted-solution-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/ranking/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/ranking/ranking-status-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/ranking/ranking-user-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/ranking/tier-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/reporting/feedback-intent-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/reporting/feedback-message-attachment-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/reporting/feedback-message-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/reporting/feedback-report-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/reporting/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/shop/avatar-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/shop/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/shop/insignia-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/shop/insignia-role-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/shop/rocket-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/space/index.ts` — Create.
  - `apps/server/src/database/drizzle/models/space/planet-model.ts` — Create.
  - `apps/server/src/database/drizzle/models/space/star-model.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/auth/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/conversation/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/forum/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/manual/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/playground/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/profile/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/ranking/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/reporting/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/shop/index.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/space/index.ts` — Create.
  - `apps/server/src/database/drizzle/schema.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/profile/DrizzleAchievement.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/auth/DrizzleApiKey.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/shop/DrizzleAvatar.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/DrizzleCategory.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallenge.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeCodeExecution.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeSource.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/conversation/DrizzleChat.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/conversation/DrizzleChatMessage.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/forum/DrizzleComment.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackMessage.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackReport.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/manual/DrizzleGuide.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/shop/DrizzleInsignia.ts` — Create.
  - `apps/server/src/database/drizzle/types/DrizzleInsigniaRole.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/profile/DrizzleNote.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/space/DrizzlePlanet.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/ranking/DrizzleRankingUser.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/shop/DrizzleRocket.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/playground/DrizzleSnippet.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/challenging/DrizzleSolution.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/space/DrizzleStar.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/ranking/DrizzleTier.ts` — Create.
  - `apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts` — Create.
  - `apps/server/src/database/drizzle/types/index.ts` — Create.

</details>

- **RF/CA:** RF-01, RF-02, RF-03, RF-10; CA-04, CA-05, CA-20.
- **Resultado observável:** Capturar o catálogo/histórico legado e fornecer models/tipos/contexto/client/base conforme S1/S2/D-08/D-10. Conferir 39 tabelas e sete enums sem reinventar schema; pool único, shutdown e identidade explícita.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: database-rules.md, code-conventions-rules.md, core-package-rules.md, server-application-rules.md.
- **Exit:** Manifest do commit fonte com 24 hashes e catálogo normalizado, models/tipos parity e imports acíclicos; CI-02/CI-03/CI-05 e review D1 clear. EV-03/EV-10; nenhuma alegação de parity remota.

### S1

- **Status/owner:** `completed`; Builder Server.
- **Dependências/paralelismo:** C0; paralelo D1.
- **Paths:** 3 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `packages/core/src/auth/interfaces/OnboardingReceiptProvider.ts` — Create.
  - `packages/core/src/auth/interfaces/OnboardingService.ts` — Create.
  - `packages/core/src/auth/interfaces/index.ts` — Modify.

</details>

- **RF/CA:** RF-06, RF-07, RF-10; CA-12, CA-20.
- **Resultado observável:** Disponibilizar OnboardingReceiptProvider e OnboardingService e o barrel auth da Spec para os dois consumidores. Core continua sem HTTP/framework/SDK/Drizzle; UsersRepository/ProfileChannel e AccountDto preservados.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: core-package-rules.md, code-conventions-rules.md, provision-layer-rules.md, rest-layer-rules.md.
- **Exit:** Interfaces e imports typecheck; CI-02/CI-03/CI-04/CI-05 aplicáveis, revisão S1 clear e EV-10. Não criar testes que apenas espelhem interfaces.

### D2

- **Status/owner:** `in_progress`; Builder Database.
- **Dependências/paralelismo:** D1; paralelo W1.
- **Paths:** 114 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/server/src/database/drizzle/migrations/0000_baseline.sql` — Generate.
  - `apps/server/src/database/drizzle/migrations/0001_application_objects.sql` — Create.
  - `apps/server/src/database/drizzle/migrations/0002_server_owned_access.sql` — Create.
  - `apps/server/src/database/drizzle/migrations/meta/0000_snapshot.json` — Generate.
  - `apps/server/src/database/drizzle/migrations/meta/0001_snapshot.json` — Generate.
  - `apps/server/src/database/drizzle/migrations/meta/0002_snapshot.json` — Generate.
  - `apps/server/src/database/drizzle/migrations/meta/_journal.json` — Generate.
  - `apps/server/src/database/drizzle/rollback/0002_server_owned_access.sql` — Create.
  - `apps/server/scripts/migrate-database.ts` — Create.
  - `apps/server/supabase/config.toml` — Remove.
  - `apps/server/supabase/migrations/20251008214302_create_tables.sql` — Remove.
  - `apps/server/supabase/migrations/20260506130000_create_insignias_tables.sql` — Remove.
  - `apps/server/supabase/migrations/20260508132253_create_notes.sql` — Remove.
  - `apps/server/supabase/migrations/20260511182355_remote_schema.sql` — Remove.
  - `apps/server/supabase/migrations/20260511184731_remote_schema.sql` — Remove.
  - `apps/server/supabase/migrations/20260511210000_remove_next_star_function_and_view.sql` — Remove.
  - `apps/server/supabase/migrations/20260514120000_create_update_text_block_audio_function.sql` — Remove.
  - `apps/server/supabase/migrations/20260603120000_create_clear_text_block_audio_function.sql` — Remove.
  - `apps/server/supabase/migrations/20260611120000_grant_select_on_public_views.sql` — Remove.
  - `apps/server/supabase/migrations/20260611130000_drop_users_visits.sql` — Remove.
  - `apps/server/supabase/migrations/20260619120000_rename_challenges_code_to_initial_code.sql` — Remove.
  - `apps/server/supabase/migrations/20260619123000_update_challenges_view_and_list_function_to_initial_code.sql` — Remove.
  - `apps/server/supabase/migrations/20260716120000_add_challenge_is_evaluated_by_function.sql` — Remove.
  - `apps/server/supabase/migrations/20260716121000_create_challenge_code_executions.sql` — Remove.
  - `apps/server/supabase/migrations/20260723120000_add_challenge_official_solution.sql` — Remove.
  - `apps/server/supabase/migrations/20260804120000_create_feedback_conversations.sql` — Remove.
  - `apps/server/supabase/migrations/20260804130000_remove_feedback_outbox_events.sql` — Remove.
  - `apps/server/supabase/migrations/20260804140000_remove_persist_feedback_message.sql` — Remove.
  - `apps/server/supabase/migrations/20260804150000_grant_feedback_reporting_permissions.sql` — Remove.
  - `apps/server/supabase/migrations/20260806120000_add_user_feedback_history.sql` — Remove.
  - `apps/server/supabase/migrations/20260807000058_revoke_feedback_history_public_execute.sql` — Remove.
  - `apps/server/supabase/migrations/20260807000829_enable_feedback_author_insert_rls.sql` — Remove.
  - `apps/server/supabase/migrations/20260807000901_enable_feedback_author_update_rls.sql` — Remove.
  - `apps/server/supabase/migrations/20260810100000_add_user_metadata_to_feedback_history.sql` — Remove.
  - `apps/server/src/database/drizzle/mappers/auth/DrizzleApiKeyMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/auth/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeSourceMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/challenging/DrizzleSolutionMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/challenging/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/conversation/DrizzleChatMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/conversation/DrizzleChatMessageMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/conversation/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/forum/DrizzleCommentMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/forum/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/lesson/DrizzleQuestionMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/lesson/DrizzleTextBlockMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/lesson/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/manual/DrizzleGuideMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/manual/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/playground/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/profile/DrizzleAchievementMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/profile/DrizzleNoteMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/profile/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/ranking/DrizzleRankerMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/ranking/DrizzleTierMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/ranking/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackMessageMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/shop/DrizzleAvatarMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/shop/DrizzleInsigniaMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/shop/DrizzleRocketMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/shop/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/space/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/auth/DrizzleApiKeysRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/auth/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeSourcesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/challenging/DrizzleSolutionsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/challenging/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatMessagesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/conversation/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/forum/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/lesson/DrizzleQuestionsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/lesson/DrizzleStoriesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/lesson/DrizzleTextBlocksRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/lesson/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/manual/DrizzleGuidesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/manual/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/playground/DrizzleSnippetsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/playground/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/profile/DrizzleAchievementsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/profile/DrizzleNotesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/profile/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/ranking/DrizzleTiersRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/ranking/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/reporting/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/shop/DrizzleAvatarsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/shop/DrizzleInsigniasRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/shop/DrizzleRocketsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/shop/index.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/space/DrizzleStarsRepository.ts` — Create.
  - `apps/server/src/database/drizzle/repositories/space/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/index.ts` — Create.
  - `apps/server/src/database/drizzle/mappers/reporting/index.ts` — Create.
  - `apps/server/src/database/index.ts` — Modify.
  - `scripts/adopt-drizzle-baseline.mjs` — Create.
  - `scripts/check-drizzle-transition.mjs` — Create.
  - `scripts/tests/adopt-drizzle-baseline.test.mjs` — Create.
  - `scripts/tests/check-drizzle-transition.test.mjs` — Create.

</details>

- **RF/CA:** RF-01, RF-02, RF-03, RF-04, RF-05, RF-12; CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-20, CA-22.
- **Resultado observável:** Implementar os 25 ports preservados, mappers e SQL customizado; migrar/adotar/reverter por lock comum/sessão dedicada conforme S2. Provar banco vazio, clone legado com dados, drift, ledger parcial, concorrência e revogação Data API. Não criar suites de repository/mapper; persistência e autorização de runtime serão exercitadas em S2.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: database-rules.md, code-conventions-rules.md, server-routes-testing-rules.md, handlers-testing-rules.md, provision-layer-rules.md.
- **Exit:** CI-02/CI-03/CI-05/CI-06/CI-07 locais; warnings de complexidade em paths D2 resolvidos; EV-03 e parcelas de EV-04 de catálogo/SQL/Data API/clone aprovadas e review consolidado D2 clear. CI-09/CI-10 são gates integrados C2, sem bloquear trabalho legítimo de S2/W2 necessário para satisfazê-los. A parcela HTTP legítima de EV-04 aguarda S2. EV-01/EV-02 foram removidos na revisão19. SQL/journal/snapshots Generate via Kit fixado; legado só removido após captura/restauração/adoção/inversa demonstradas.

### W1

- **Status/owner:** `completed`; Builder Web reabriu o mesmo ownership para a correção ACH-34 nos paths já listados. Medição atual: zero warnings nos paths W1. O Web integration posterior a W1-10 terminou82/88 e isolou as seis falhas restantes aos comportamentos W2; evidências BFF e reviews pareados passaram.
- **Dependências/paralelismo:** S1; paralelo D2.
- **Paths:** 20 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/web/src/constants/cookies.ts` — Modify.
  - `apps/web/src/realtime/sse/channels/SseProfileChannel.ts` — Create.
  - `apps/web/src/realtime/sse/channels/index.ts` — Create.
  - `apps/web/src/rest/next/NextRestClient.ts` — Modify.
  - `apps/web/src/rest/services/AuthService.ts` — Modify.
  - `apps/web/src/rest/services/OnboardingService.ts` — Create.
  - `apps/web/src/rest/services/index.ts` — Modify.
  - `apps/web/src/middleware.ts` — Modify.
  - `apps/web/src/app/api/auth/onboarding-attempt/route.ts` — Create.
  - `apps/web/src/app/api/auth/onboarding-attempt/tests/route.test.ts` — Create.
  - `apps/web/src/app/api/auth/profile-events/route.ts` — Create.
  - `apps/web/src/app/api/auth/profile-events/tests/route.test.ts` — Create.
  - `apps/web/src/app/api/auth/sign-up/route.ts` — Create.
  - `apps/web/src/app/api/auth/sign-up/tests/route.test.ts` — Create.
  - `apps/web/src/app/api/tests/server/[...path]/route.ts` — Modify.
  - `apps/web/src/app/tests/auth/account-confirmation.test.ts` — Modify.
  - `apps/web/src/app/tests/auth/sign-up.test.ts` — Modify.
  - `apps/web/src/app/tests/auth/social-account-confirmation.test.ts` — Create.
  - `apps/web/src/app/tests/shared/mocks/ServerMock.ts` — Modify.
  - `apps/web/src/app/tests/shared/mocks/ServerMockRegistry.ts` — Modify.

</details>

- **RF/CA:** RF-07, RF-09, RF-10, RF-12; CA-12, CA-13, CA-14, CA-15, CA-18, CA-19, CA-20, CA-22.
- **Resultado observável:** Entregar BFF same-origin receipt/resume/stream, bypass dos três paths exatos e transporte SseProfileChannel; services continuam implementando ports. Cookies/Origin/precedência/abort/no buffering testados nas rotas; rawBody finito habilita mocks sem backend real. Correção ACH-34 fica restrita às funções warning dos paths já listados nesta tarefa; remover warnings com extrações coesas e sem helpers artificiais, mantendo contratos, efeitos, headers, cache e ordenação das chamadas.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: web-application-rules.md, web-app-routes-testing-rules.md, rest-layer-rules.md, realtime-rules.md, rpc-layer-rules.md, code-conventions-rules.md.
- **Exit:** Rotas Next cobrem status/body/cookie/Origin/stream/abort; CI-02/CI-03/CI-04/CI-05/CI-06 aplicáveis; complexity Web para os paths W1 sem warnings; EV-07/EV-09 de BFF e review W1 clear. Browser completo/happy path real são gates finais após W2, não prova presumida nesta fase. CI-09 global continua em C2.

### S2

- **Status/owner:** `in_progress`; Builder Server estável.
- **Dependências/paralelismo:** D2, S1, C1; sem paralelismo nesta wave após o gate operacional C1.
- **Paths:** 103 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts` — Modify.
  - `apps/server/src/ai/mastra/toolkits/ProfileToolkit.ts` — Modify.
  - `apps/server/src/app/hono/HonoApp.ts` — Modify.
  - `apps/server/src/app/hono/HonoHttp.ts` — Modify.
  - `apps/server/src/app/hono/middlewares/AuthMiddleware.ts` — Modify.
  - `apps/server/src/app/hono/middlewares/ChallengingMiddleware.ts` — Modify.
  - `apps/server/src/app/hono/middlewares/OnboardingMiddleware.ts` — Create.
  - `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts` — Modify.
  - `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts` — Modify.
  - `apps/server/src/app/hono/middlewares/StorageMiddleware.ts` — Modify.
  - `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/auth/AuthRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/challenging/ChallengeCodeExecutionsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/challenging/SolutionsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/forum/CommentsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/lesson/QuestionsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/lesson/StoriesRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/manual/GuidesRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/mcp/tests/McpRateLimitMiddleware.test.ts` — Modify.
  - `apps/server/src/app/hono/routers/auth/tests/AuthRateLimitMiddleware.test.ts` — Modify.
  - `apps/server/src/app/hono/routers/playground/SnippetsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/profile/NotesRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/profile/ProfileEventsRouter.ts` — Create.
  - `apps/server/src/app/hono/routers/profile/ProfileRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/profile/UsersRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/ranking/RankingRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/ranking/TiersRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/shop/AvatarsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/shop/InsigniasRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/shop/RocketsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/space/PlanetsRouter.ts` — Modify.
  - `apps/server/src/app/hono/routers/space/StarsRouter.ts` — Modify.
  - `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` — Create.
  - `apps/server/src/constants/env.ts` — Modify.
  - `apps/server/src/provision/auth/NodeOnboardingReceiptProvider.ts` — Create.
  - `apps/server/src/queue/inngest/createMarkTextBlockAudioAsErrorOnFailure.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/ChallengingFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/LessonFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/ManualFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/ProfileFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/RankingFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/ShopFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/SpaceFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/StorageFunctions.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/tests/InngestFunctionsAssembly.test.ts` — Modify.
  - `apps/server/src/queue/inngest/functions/tests/StorageFunctions.test.ts` — Modify.
  - `apps/server/src/rest/controllers/auth/SignUpController.ts` — Modify.
  - `apps/server/src/rest/controllers/auth/tests/SignUpController.test.ts` — Modify.
  - `apps/server/src/rest/controllers/profile/FetchOnboardingAttemptController.ts` — Create.
  - `apps/server/src/rest/controllers/profile/tests/FetchOnboardingAttemptController.test.ts` — Create.
  - `apps/server/src/rest/controllers/reporting/tests/GetFeedbackReportController.test.ts` — Modify.
  - `apps/server/src/rest/controllers/reporting/tests/ListFeedbackReportsController.test.ts` — Modify.
  - `apps/server/src/rest/services/SupabaseAuthService.ts` — Modify.
  - `apps/server/src/tests/database/supabase/FeedbackConversationCascade.test.ts` — Remove.
  - `apps/server/src/tests/database/supabase/SupabaseFeedbackReportsRepository.test.ts` — Remove.
  - `apps/server/src/tests/fixtures/ChallengingFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/ForumFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/ProfileFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/ReportingFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/ShopFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/SpaceFixture.ts` — Modify.
  - `apps/server/src/tests/fixtures/SupabaseFixture.ts` — Modify.
  - `apps/server/src/tests/rest/services/SupabaseAuthService.test.ts` — Remove.
  - `apps/server/src/tests/routes/auth/FetchAccountRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/auth/SignUpRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/challenging/challenges/CountChallengeCodeExecutionErrorsRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/challenging/challenges/ListChallengeCodeExecutionsRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/challenging/challenges/RunChallengeCodeRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/global/RateLimiterRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/FetchOnboardingAttemptRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/profile/achievements/FetchUnlockedAchievementsRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/achievements/RescueAchievementRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/FetchCreatedUsersKpiRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/FetchUserByIdRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/FetchUserBySlugRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/UpdateUserRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/VerifyUserEmailInUseRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/profile/users/VerifyUserNameInUseRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/CountUnreadFeedbackReportsRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/CreateFeedbackMessageAttachmentUploadUrlRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/CreateFeedbackReportAttachmentUploadUrlRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/FeedbackConversationsPersistence.test.ts` — Remove.
  - `apps/server/src/tests/routes/reporting/FetchUserFeedbackReportRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/GetFeedbackReportRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/ListFeedbackReportsRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/ListUserFeedbackReportsRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/MarkFeedbackReportAsReadRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/MarkUserFeedbackReportAsReadRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/SendFeedbackReportRoute.test.ts` — Create.
  - `apps/server/src/tests/routes/reporting/UserFeedbackHistoryRoutes.test.ts` — Remove.
  - `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/space/planets/CreatePlanetStarRoute.test.ts` — Modify.
  - `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts` — Modify.

</details>

- **RF/CA:** RF-01, RF-02, RF-06, RF-07, RF-08, RF-09, RF-10, RF-12; CA-01, CA-02, CA-03, CA-10, CA-11, CA-12, CA-13, CA-16, CA-17, CA-18, CA-19, CA-20, CA-22.
- **Resultado observável:** Integrar REST/MCP/jobs com acesso verificado, Auth preservado, receipt e SSE UsersRepository; portar cenários úteis antes de remover suites proibidas. Em Supabase local, executar request/response real, write seguido de leitura e ownership entre A/B, visitante, God, API key e JWT forjado. Aplicar filtros da própria conta, incluindo a fronteira equivalente a tenant já existente, sem inventar tenant/schema novo. Provisionamento permanece independente do stream.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: server-application-rules.md, database-rules.md, core-package-rules.md, provision-layer-rules.md, queue-layer-rules.md, handlers-testing-rules.md, server-routes-testing-rules.md, rest-layer-rules.md, mcp-rules.md, code-conventions-rules.md.
- **Exit:** db:test antes de integração; CI-02/CI-03/CI-04/CI-05/CI-06/CI-07 locais; EV-06 reais, EV-07 controller e revisão S2 clear. Medir os fluxos de SSE/onboarding ainda contratados e seus limites; sem teste dedicado de provider/service/fixture. EV-01/EV-02 foram retirados na revisão19. CI-09/CI-10 globais permanecem em C2. Supabase Dev só quando o gate remoto exigir; não substitui local.

### W2

- **Status/owner:** `pending`; Builder Web.
- **Dependências/paralelismo:** W1, S2, C1; sem outra fase Web concorrente.
- **Paths:** 22 paths exclusivos abaixo, com classificação herdada da Spec; `apps/server/package.json` é reaberto pelo mesmo owner principal para ligar o fluxo local de `db:test` já previsto em S6.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/web/src/constants/client-env.ts` — Modify.
  - `apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts` — Remove.
  - `apps/web/src/realtime/supabase/channels/index.ts` — Remove.
  - `apps/web/src/realtime/supabase/client.ts` — Remove.
  - `apps/web/src/realtime/supabase/types/SupabaseUser.ts` — Remove.
  - `apps/web/src/realtime/supabase/types/index.ts` — Remove.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/index.tsx` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/tests/useAccountConfirmationPage.test.ts` — Create.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SignUp/SignUpPageView.tsx` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SignUp/index.tsx` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SignUp/tests/SignUpPageView.test.tsx` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SignUp/tests/useSignUpPage.test.ts` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SignUp/useSignUpPage.ts` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/index.tsx` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/tests/useSocialAccountConfirmationPage.test.ts` — Modify.
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts` — Modify.
  - `apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts` — Modify.
  - `apps/web/src/ui/global/contexts/RestContext/types/RestContextValue.ts` — Modify.
  - `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts` — Modify.
  - `apps/web/src/rpc/next-safe-action/authActions.ts` — Modify (`signUpWithSocialAccount` uses a no-cache fetch; endpoint and action contract unchanged).
  - `apps/web/src/ui/global/hooks/tests/useProfileSocket.test.ts` — Create.
  - `apps/web/src/ui/global/hooks/useProfileSocket.ts` — Modify.

</details>

- **RF/CA:** RF-07, RF-08, RF-09, RF-10, RF-11, RF-12; CA-12, CA-13, CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-20, CA-21, CA-22.
- **Resultado observável:** Compor Entry Point → Hook → View nas três páginas, RestContext/RealtimeContext e useProfileSocket conforme S5/handoff. Cadastro usa shell/Title/SignUpForm atuais; retomada usa Loading + UserCreationPendingMessage e sucesso existente. Email/social preservam RocketAnimation/AnimatePresence/AppMessage/CTA, Views inalteradas. Cobrir formulário, pending novo/retomado, sucesso, expiração, erro/retry, nova/existente social e tokens ausentes automaticamente, sem mensagens/arte novas. Teclado Tab/Enter, labels/foco e testids preservados; 390×844 e 1440×900 sem overflow. SseProfileChannel real com EventSource controlado no teste do Hook; browser testing conserva ProfileChannelMock. O mesmo Builder finaliza os paths browser de W1 após este diff e retira client/env/tipos/realtime Supabase só depois de migrar a composição, sem segundo owner.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: ui-layer-rules.md, widget-tests-rules.md, web-application-rules.md, web-app-routes-testing-rules.md, realtime-rules.md, rest-layer-rules.md, rpc-layer-rules.md, code-conventions-rules.md; design/handoff.md.
- **Exit:** CI-02/CI-03/CI-04/CI-05/CI-06/CI-08 locais; EV-07/EV-08/EV-09/EV-11 e review W2 clear. VM-01/VM-02 feliz real com Mailpit e screenshots nos dois viewports; social somente automatizado D-07. Requests essenciais 2xx, confirmação /auth/account 200 e /space/planets 2xx. CI-09/CI-10 globais executados em C2. Console/pageerror/requestfailed detalhados só para diagnóstico; esperar estado observável da animação.

### D3

- **Status/owner:** `pending`; Builder Database.
- **Dependências/paralelismo:** S2, W2, C1; sem paralelismo de limpeza.
- **Paths:** 112 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `apps/server/supabase/schemas/schema.sql` — Remove.
  - `apps/server/src/database/postgres/PostgresClient.ts` — Remove.
  - `apps/server/src/database/postgres/PostgresFeedbackMessagesRepository.ts` — Remove.
  - `apps/server/src/database/postgres/PostgresFeedbackReportsRepository.ts` — Remove.
  - `apps/server/src/database/postgres/index.ts` — Remove.
  - `apps/server/src/database/supabase/errors/SupabasePostgreError.ts` — Remove.
  - `apps/server/src/database/supabase/errors/index.ts` — Remove.
  - `apps/server/src/database/supabase/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/auth/SupabaseApiKeyMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/auth/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeCodeExecutionMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeSourceMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/challenging/SupabaseSolutionMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/challenging/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/conversation/SupabaseChatMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/conversation/SupabaseChatMessageMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/conversation/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/forum/SupabaseCommentMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/forum/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/lesson/SupabaseQuestionMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/lesson/SupabaseTextBlockMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/lesson/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/manual/SupabaseGuideMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/manual/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/playground/SupabaseSnippetMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/playground/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/profile/SupabaseAchievementMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/profile/SupabaseNoteMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/profile/SupabaseUserMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/profile/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/ranking/SupabaseRankerMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/ranking/SupabaseTierMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/ranking/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackMessageMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/reporting/SupabaseFeedbackReportMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/reporting/tests/SupabaseFeedbackReportMapper.test.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/shop/SupabaseAvatarMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/shop/SupabaseInsigniaMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/shop/SupabaseRocketMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/shop/index.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/space/SupabasePlanetMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/space/SupabaseStarMapper.ts` — Remove.
  - `apps/server/src/database/supabase/mappers/space/index.ts` — Remove.
  - `apps/server/src/database/supabase/migrations/20250517205525_remote_schema.sql` — Remove.
  - `apps/server/src/database/supabase/repositories/SupabaseRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/auth/SupabaseApiKeysRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/auth/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeCodeExecutionsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengeSourcesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/challenging/SupabaseSolutionsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/challenging/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/conversation/SupabaseChatMessagesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/conversation/SupabaseChatsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/conversation/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/forum/SupabaseCommentsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/forum/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/lesson/SupabaseQuestionsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/lesson/SupabaseStoriesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/lesson/SupabaseTextBlocksRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/lesson/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/manual/SupabaseGuidesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/manual/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/playground/SupabaseSnippetsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/playground/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/profile/SupabaseAchievementsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/profile/SupabaseNotesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/profile/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/ranking/SupabaseRankersRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/ranking/SupabaseTiersRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/ranking/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackMessagesRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/reporting/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/shop/SupabaseAvatarsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/shop/SupabaseInsigniasRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/shop/SupabaseRocketsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/shop/index.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/space/SupabasePlanetsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/space/SupabaseStarsRepository.ts` — Remove.
  - `apps/server/src/database/supabase/repositories/space/index.ts` — Remove.
  - `apps/server/src/database/supabase/supabase.ts` — Remove.
  - `apps/server/src/database/supabase/types/Database.ts` — Remove.
  - `apps/server/src/database/supabase/types/Supabase.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseAchievement.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseApiKey.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseAvatar.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseCategory.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseChallenge.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseChallengeCodeExecution.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseChallengeSource.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseChat.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseChatMessage.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseComment.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseFeedbackMessage.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseFeedbackReport.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseGuide.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseInsignia.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseInsigniaRole.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseNote.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabasePlanet.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseRankingUser.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseRocket.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseSnippet.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseSolution.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseStar.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseTier.ts` — Remove.
  - `apps/server/src/database/supabase/types/SupabaseUser.ts` — Remove.
  - `apps/server/src/database/supabase/types/index.ts` — Remove.

</details>

- **RF/CA:** RF-01, RF-02, RF-10, RF-12; CA-01, CA-02, CA-03, CA-20, CA-22.
- **Resultado observável:** Remover somente os adapters/tipos/SQL avulso legados do mapa após Server/jobs/MCP/fixtures migrarem para Drizzle. Conferir consumidores antes da remoção, sem apagar dados ou o SDK Auth; remover pool paralelo de feedback já substituído.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: database-rules.md, server-application-rules.md, code-conventions-rules.md, server-routes-testing-rules.md.
- **Exit:** CI-02/CI-03/CI-04/CI-05/CI-06/CI-11 e inventário EV-10; reteste do runtime afetado pelas remoções legadas e EV-12, além de review D3 clear. EV-01/EV-02 foram retirados na revisão19.

### C1

- **Status/owner:** `completed`; Task principal; diff integrado aceito e sensores locais renovados. EV-05 remoto permanece pending e não foi executado.
- **Dependências/paralelismo:** D2, W1; sem paralelismo de execução; libera integração real S2. Um preflight restrito ao exportador abaixo pode ser executado antes de D2 para satisfazer o requisito operacional de carregar `.env.local`; isso não inicia nem conclui os demais trabalhos de C1.
- **Paths:** 22 paths exclusivos abaixo, com classificação herdada da Spec.

<details>
<summary>Paths exatos desta fase</summary>

  - `.github/workflows/server-app-ci.yaml` — Modify.
  - `.github/workflows/server-app-production-cd.yml` — Modify.
  - `.github/workflows/web-app-ci.yaml` — Modify.
  - `.github/workflows/web-app-production-cd.yaml` — Modify.
  - `docker-compose.yml` — Modify.
  - `docker/supabase/reset.sh` — Modify.
  - `apps/server/.env.example` — Modify.
  - `apps/server/package.json` — Modify (mesmo owner principal; completar `db:test` do escopo de tooling C1).
  - `apps/web/.env.example` — Modify.
  - `design/handoff.md` — Create.
  - `documentation/architecture.md` — Modify.
  - `documentation/features/global/supabase-replacement-with-drizzle/cutover-runbook.md` — Create.
  - `documentation/infrastructure.md` — Modify.
  - `documentation/rules/database-rules.md` — Modify.
  - `documentation/rules/realtime-rules.md` — Modify.
  - `documentation/rules/server-application-rules.md` — Modify.
  - `documentation/rules/server-routes-testing-rules.md` — Modify.
  - `documentation/tooling.md` — Modify.
  - `scripts/check-spec-definition.mjs` — Modify.
  - `scripts/export-local-database-env.mjs` — Create.
  - `scripts/tests/check-spec-definition.test.mjs` — Modify.
  - `scripts/tests/export-local-database-env.test.mjs` — Create.

</details>

- **Preflight operacional (parcial, mesmo owner/path):** `scripts/export-local-database-env.mjs` e seu teste passaram com fixtures sintéticas; o exportador carrega somente `SUPABASE_DATABASE_URL`, com porta Compose/loopback e sem revelar valores em erros. `db:test` executou o reset local, mas o runner não estava ligado depois do reset; a tentativa manual seguinte falhou fechada porque o banco estava vazio sem o baseline de extensões. Replay isolado das24 migrations do commit-fonte, adoção, migration0002, repetição idempotente e rollback passou com um registro sintético. C1 agora deve ligar exporter/reset/migrate por `db:test`, provisionar as extensões esperadas e retirar o mount legado; o fixture não substitui backup restaurado nem EV-05.

- **RF/CA:** RF-03, RF-04, RF-05, RF-10, RF-12; CA-04, CA-05, CA-06, CA-07, CA-08, CA-09, CA-20, CA-22.
- **Resultado observável:** Atualizar export/db:test/reset/Compose/CI e runbook. Reset local deve limpar ledger antes de runner, sem seed. CI usa variáveis efêmeras e nenhum remoto em PR. Agendar corte único Server/Web, exclusão compartilhada sem deadlock, SHAs confirmados, manutenção/drain e inversa/versões antigas antes de reabrir. Trechos históricos de autoridades/handoff só passam a declarar estado vigente depois da evidência integrada; o runbook não prova implantação.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: server-application-rules.md, database-rules.md, server-routes-testing-rules.md, web-application-rules.md, web-app-routes-testing-rules.md, mcp-rules.md, code-conventions-rules.md; AGENTS/SDD/Tooling/Architecture.
- **Exit:** Export/reset guards e db:test passam, cenários de scripts CI-07 e ensaio local EV-03/EV-04 registrados; CI usa runner destino e environments corretos. Review transversal do diff da task principal. EV-05 remota permanece pending até execução autorizada; finalização documental/CI/build em C2.

- **C1 integrado concluído:** `db:test` passa com exporter → Compose → reset local guardado → migrate; `db:preflight --phase server-owned` retorna `compatible:true` e `differences:[]`. O teste negativo confirma que falha do exporter encerra a cadeia antes de Compose/reset. `npm run test:scripts` e sensores globais passaram após execução isolada, e o Implementation Reviewer aceitou C1 sem findings. CI usa segredo sintético de onboarding; pushes normais exigem fase `server-owned`; cutover/rollback explícitos usam pausa de releases e gate final protegido para manter o lock durante verificação manual. EV-05 e configuração real do GitHub Environment continuam pendentes.

### C2

- **Status/owner:** `completed`; task principal. Escopo reduzido pela supersession da Spec e do Plan.
- **Dependências/paralelismo:** registro de cancelamento após as fases concluídas já listadas; sem Builder ou dependência de implementação.
- **Paths:** somente Spec, Plan, Evaluation e `documentation/sdd.md` para alinhar os estados documentados. O diff de produto preexistente foi preservado, não revisado nem certificado por este handoff.
- **RF/CA:** não aplicável ao handoff; RF/CA anteriores permanecem apenas no histórico da Spec superseded.
- **Resultado observável:** Spec/Plan marcados `superseded`; D2/S2/W2/D3 retiradas do ledger ativo; decisão, status das evidências e limitações registrados na Evaluation. Nenhuma alegação de que testes pendentes, reviews, CI, parity remota, cutover ou rollout passaram.
- **Rules:** documentation/sdd.md, AGENTS.md e Rule Pack completo listado na Spec; implement-spec/conclude-spec governam transições, commits e PR.
- **Exit:** checkers de definição/implementação, sensores aplicáveis, reviews de todos os diffs, comparações visuais, EV/VM e ACH resolvidos. Sem evidência remota de EV-05, registrar próxima ação e não declarar CA-09 concluído. Handoff para conclude-spec somente após condições normativas; Plan completed apenas quando sua execução estiver realmente encerrada e Evaluation ready/completed.

# Validation and handoff

## Gates e evidências

As linhas abaixo são o snapshot histórico da agenda anterior à revisão 20. Seus estados `pending` não são gates ativos deste Plan superseded; tampouco foram convertidos em resultados aprovados. O único resultado atual de C2 é o handoff administrativo registrado na Evaluation.

Toda evidência abaixo começa `pending`, identifica cenário, ambiente, revisão/SHA e resultado real em `evaluation.md`. ACH-* identifica findings e CI-* checks automatizados; nomes de fase não usam CI-*. Revisão com finding não libera a dependente. Reexecuções invalidam somente evidências afetadas; comandos e logs sanitizados pertencem à Evaluation.

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| Database | Banco vazio: migrate duas vezes; catálogo/constraints/custom SQL e sem seed | CA-04 | S2; D1/D2/C1 | EV-03 | pending |
| Database | Clone legado com dados/24 hashes: preflight legacy→adopted→server-owned; adoção atômica sem replay e sem perda | CA-05 | S2; D1/D2; restauração isolada | EV-03 | pending |
| Database | Drift, ledger parcial, phase inconsistente, timeout/liberação e concorrência adopt/migrate/rollback na mesma sessão/lock | CA-06 | S2; scripts operacionais e stack local | EV-03 | pending |
| Security | SQL anon/authenticated/PUBLIC e Data API SELECT/DML/views/RPC/SECURITY DEFINER/default privileges negados; API legítima, Auth/storage preservados | CA-07 | S2; D2/S2/C1; catálogo local | EV-04 | pending |
| Recovery | Inversa/ledger transacionais em clone; grants/policies/RLS anteriores exatos, infraestrutura cron intacta; versões antigas Server/Web funcionam | CA-08 | S2/S6; backup/restauração isolada e runbook | EV-04 | pending |
| Remote gate | Dev e produção: parity real/histórico/acesso e backup restaurado ensaiado antes de aplicar; credenciais só por ambiente e sem reset | CA-05, CA-06, CA-08, CA-09 | S2/S6; Supabase Dev/Prod quando aplicável, operador autorizado | EV-03, EV-04, EV-05 | pending |
| Cutover | Primeiro corte único: artefatos/SHAs anterior/novo, manutenção, drain/pause de writers, adopt/migrate, deploy coordenado sem deadlock, health/smoke/Data API, reabertura; rollback se falhar | CA-09 | S6; cutover-runbook.md; execução remota autorizada separada do rehearsal | EV-05 | pending |
| Runtime | SSE próprio via receipt/sessão; conta alheia/inválida não seleciona perfil; perfil existente/reconnect em outra réplica e provisioning independente | CA-10, CA-11, CA-13 | S3/S4; S2; DB/Auth reais local | EV-06 | pending |
| Runtime | SSE: findById inicial, intervalo após query, sem overlap, heartbeat/duração, abort/shutdown/expiry/terminal; erro após headers | CA-18, CA-19 | S4; rota real e relógio controlado na fronteira com equivalente real | EV-06, EV-09 | pending |
| Web/controller | Signup elegível/body/status; headers internos→cookie HttpOnly; Origin, cookie inválido/removido, re-registro, sem sessão ou extensão de expiry | CA-12, CA-13 | S3/S4; S2/W1; controller/Next/browser | EV-06, EV-07 | pending |
| Web/browser | Saída/reload e retomada pendente/pronta; cancelamento, sem repost/senha; expiração restaura formulário | CA-14, CA-15 | S5; W1/W2; hooks e Playwright testing | EV-07 | pending |
| Web/hooks | Email/social: evento da mesma conta, refetch persistido antes de sucesso, retry 7s, tokens uma vez, existente/direct redirect, ausência RP6 | CA-16, CA-17 | S5; W1/W2; mocks determinísticos | EV-08 | pending |
| Web/BFF | Frames finitos, no buffering/cache, sessão precede receipt, request.signal/cleanup, status antes de headers; middleware real sem sessão | CA-12, CA-18, CA-19 | S4; W1; testes Next/rawBody e Playwright | EV-07, EV-09 | pending |
| Web/Hook | useProfileSocket com SseProfileChannel real/factory EventSource: malformed frame/dedup, CONNECTING/CLOSED, terminal, expiry, StrictMode e cleanup | CA-18, CA-19 | S4; W2; teste Hook permitido, sem suite do adapter | EV-09 | pending |
| Architecture | Models únicos/tipos inferidos/layout, singleton/shutdown, SDK Server Auth somente, nenhum SDK/env/tipo Supabase Web ou SDK/Drizzle/Core; nenhum .from/.rpc relacional runtime | CA-20 | S1/S6; inventário C2 e sensores | EV-10 | pending |
| Integrity | Suítes permitidas/um arquivo por rota, cenários legados portados antes da remoção, ambientes isolados, coverage sem baseline reduzido | CA-22 | Validation Contract; C2 | EV-12 | pending |
| Manual VM-04 | Studio login→/dashboard→/profile/users em 8000 ou porta livre; título Usuários e sessão persistida | CA-01, CA-20, CA-22 | AGENTS; Server3334; export-studio-app-e2e-env | EV-10, EV-12 | pending |
| Manual VM-05 | Web login real /auth/sign-in→/space; login 2xx, account 200, planets 2xx e conteúdo | CA-01, CA-20, CA-22 | AGENTS; Web3000/Server3334; export-web-app-e2e-env | EV-10, EV-12 | pending |

## UI, referências e viewports

A ausência de nodes Pencil foi aprovada em D-06. Referência é a implementação atual/tokens/receitas em design/handoff.md revisão 6; nenhuma comparação com node inexistente é presumida. A árvore de widgets está em S5 e no card W2. Viewports e estados são agendados separadamente; estados de falha/recovery/loading são automatizados. Smoke manual só segue o caminho feliz; animações/estilos devem chegar ao estado observável, não basta toBeVisible com opacity zero.

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| Visual automated | Cadastro formulário/inputs progressivos/foco/Tab/Enter, 390×844 | CA-21 | SignUp atual/handoff; W1/W2 | EV-07 | pending |
| Visual automated | Cadastro formulário/inputs progressivos/foco/Tab/Enter, 1440×900 | CA-21 | SignUp atual/handoff; W1/W2 | EV-07 | pending |
| Visual automated | Cadastro pending novo, 390×844 | CA-14, CA-21 | Form/spinner atuais/handoff | EV-07 | pending |
| Visual automated | Cadastro pending novo, 1440×900 | CA-14, CA-21 | Form/spinner atuais/handoff | EV-07 | pending |
| Visual automated | Retomada pending Loading/UserCreationPendingMessage, 390×844 | CA-14, CA-21 | Extensão aprovada/handoff | EV-07 | pending |
| Visual automated | Retomada pending Loading/UserCreationPendingMessage, 1440×900 | CA-14, CA-21 | Extensão aprovada/handoff | EV-07 | pending |
| Visual automated | Retomada já pronta/sucesso inline, 390×844 | CA-14, CA-21 | SignUp sucesso atual/handoff | EV-07 | pending |
| Visual automated | Retomada já pronta/sucesso inline, 1440×900 | CA-14, CA-21 | SignUp sucesso atual/handoff | EV-07 | pending |
| Visual automated | Cadastro expiração/erro/form restaurado, 390×844 | CA-13, CA-15, CA-21 | Estados existentes e S5 | EV-07 | pending |
| Visual automated | Cadastro expiração/erro/form restaurado, 1440×900 | CA-13, CA-15, CA-21 | Estados existentes e S5 | EV-07 | pending |
| Visual automated | Email pending/loading, 390×844 | CA-16, CA-21 | AccountConfirmation View/handoff | EV-08 | pending |
| Visual automated | Email pending/loading, 1440×900 | CA-16, CA-21 | AccountConfirmation View/handoff | EV-08 | pending |
| Visual automated | Email retry/refetch falho permanece pending, 390×844 | CA-16, CA-21 | Estados existentes S5/handoff | EV-08 | pending |
| Visual automated | Email retry/refetch falho permanece pending, 1440×900 | CA-16, CA-21 | Estados existentes S5/handoff | EV-08 | pending |
| Visual automated | Social nova conta pending/loading/retry, 390×844 | CA-16, CA-17, CA-21 | SocialAccountConfirmation View/handoff | EV-08 | pending |
| Visual automated | Social nova conta pending/loading/retry, 1440×900 | CA-16, CA-17, CA-21 | SocialAccountConfirmation View/handoff | EV-08 | pending |
| Visual automated | Social nova conta welcome/CTA/animação→/space, screenshot sucesso 390×844 | CA-16, CA-17, CA-21 | SocialAccountConfirmation atual; D-07; ServerMock | EV-08 | pending |
| Visual automated | Social nova conta welcome/CTA/animação→/space, screenshot sucesso 1440×900 | CA-16, CA-17, CA-21 | SocialAccountConfirmation atual; D-07; ServerMock | EV-08 | pending |
| Visual automated | Social existente/animação/direct redirect→/space, 390×844 | CA-17, CA-21 | SocialAccountConfirmation atual; URL protegida | EV-08 | pending |
| Visual automated | Social existente/animação/direct redirect→/space, 1440×900 | CA-17, CA-21 | SocialAccountConfirmation atual; URL protegida | EV-08 | pending |
| Visual automated | Confirmações sem sessão/tokens, erro/refetch/retry e cleanup, 390×844 | CA-16, CA-17, CA-19, CA-21 | S5/RP6; nenhum estado visual novo | EV-08, EV-09 | pending |
| Visual automated | Confirmações sem sessão/tokens, erro/refetch/retry e cleanup, 1440×900 | CA-16, CA-17, CA-19, CA-21 | S5/RP6; nenhum estado visual novo | EV-08, EV-09 | pending |
| Manual VM-01 | Cadastro feliz formulário→sucesso após persistência, screenshot sucesso 390×844 | CA-12, CA-14, CA-21 | Web3000/Server3334; handoff SignUp | EV-07, EV-11 | pending |
| Manual VM-01 | Cadastro feliz formulário→sucesso após persistência, screenshot sucesso 1440×900 | CA-12, CA-14, CA-21 | Web3000/Server3334; handoff SignUp | EV-07, EV-11 | pending |
| Manual VM-02 | Mailpit/link email→welcome, screenshot sucesso 390×844 | CA-16, CA-21 | Auth local/Mailpit; handoff AccountConfirmation | EV-08, EV-11 | pending |
| Manual VM-02 | Mailpit/link email→welcome, screenshot sucesso 1440×900 | CA-16, CA-21 | Auth local/Mailpit; handoff AccountConfirmation | EV-08, EV-11 | pending |
| Manual VM-02 | CTA/rocket→/space com account 200/planets 2xx, 390×844 | CA-16, CA-21 | Mesma sessão Mailpit; Web3000/Server3334 | EV-08, EV-11 | pending |
| Manual VM-02 | CTA/rocket→/space com account 200/planets 2xx, 1440×900 | CA-16, CA-21 | Mesma sessão Mailpit; Web3000/Server3334 | EV-08, EV-11 | pending |

VM-01 registra POST signup/GET attempt/SSE essenciais 2xx; VM-02 comprova sessão e rota protegida. VM-03 foi retirada pela Spec; social não recebe smoke manual/OAuth real. Em execução aprovada, registrar app/rota, resultado/status e screenshots exigidos, sem payload/email/senha/token/OTP/link Mailpit/cookie. Console/pageerror/requestfailed e respostas detalhadas somente ao diagnosticar falha inesperada; após correção repetir o caminho feliz afetado.

## Sensores e CI

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| CI-01 | check:spec-definition e check:plan-definition antes de kickoff/cada wave/amendment; check:spec-implementation no preflight final | CA-20, CA-22 | npm run check:spec-definition -- documentation/features/global/supabase-replacement-with-drizzle/spec.md; npm run check:plan-definition -- documentation/features/global/supabase-replacement-with-drizzle/plan.md; npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md | EV-10, EV-12 | pending |
| CI-02 | Format nos paths alterados e check:code integrado | CA-20, CA-22 | npm run format; npm run check:code; format escreve e não prova comportamento | EV-10, EV-12 | pending |
| CI-03 | Typecheck integrado | CA-20, CA-22 | npm run check:types | EV-10, EV-12 | pending |
| CI-04 | Unitários integrados dos alvos permitidos | CA-22 | npm run test:unit | EV-07, EV-08, EV-09, EV-12 | pending |
| CI-05 | Fronteiras Core/Apps/Database/Realtime/BFF | CA-20 | npm run check:architecture | EV-10, EV-12 | pending |
| CI-06 | Integridade/pareamento e portabilidade dos cenários; nenhum teste dedicado proibido | CA-22 | npm run check:test-integrity | EV-12 | pending |
| CI-07 | Scripts de adoção/preflight/export/checker: comportamento operacional e guards | CA-04, CA-05, CA-06, CA-08, CA-22 | npm run test:scripts; scripts/tests declarados em D2/C1 | EV-03, EV-04, EV-12 | pending |
| CI-08 | Web integration Playwright testing 127.0.0.1:3100 com ServerMock/rawBody, sem API real/produção | CA-12, CA-14, CA-15, CA-16, CA-17, CA-19, CA-21, CA-22 | npm --workspace @stardust/web run test:integration; config inicia app e /api/tests/server; install navegador se necessário | EV-07, EV-08, EV-09, EV-12 | pending |
| CI-09 | Complexidade e qualidade contra baseline | CA-20, CA-22 | Gate integrado C2: `npm run check:complexity`; zero warnings e zero errors acima da baseline aceita por D-12; thresholds inalterados e sem nova atualização da baseline no C2 | EV-10, EV-12 | pending |
| CI-10 | Coverage Core/Server/Web sem redução do baseline | CA-22 | Gate integrado C2: coverage + ratchet de Core, Server (`server` + `server-integration`) e Web; baseline/denominadores preservados | EV-12 | pending |
| CI-11 | Server integration real depois de preparar/resetar stack local | CA-01, CA-02, CA-03, CA-10, CA-11, CA-13, CA-18, CA-19, CA-22 | npm run db:test -w @stardust/server; depois npm run test:integration -w @stardust/server; Mailpit confirma contas efêmeras | EV-06, EV-12 | pending |
| CI-12 | Checks CI do HEAD e build Server/Web depois dos checks | CA-20, CA-22 | workflows CI C1, builds dos dois apps; evidenciar SHA/URLs/jobs em Evaluation, via conclude-spec/create-pr | EV-10, EV-12 | pending |

Depois de qualquer alteração de código, os detectores globais AGENTS (`check:code`, `check:types`, `test:unit`) continuam obrigatórios; checks focados ajudam no ciclo curto, sem substituir o preflight integrado. Studio não tem diff de código: VM-04 verifica o consumidor, sem novo gate de coverage desse app. check:dead-code não é sensor oficial.

## Reviews e handoff

| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| ---- | ---------------- | -------- | --------- | --------------- | ------ |
| Review | Builder Database — D1: implementation-reviewer-agent pareado após diff/sensores da fundação | CA-04, CA-05, CA-20 | Revisão 6; Architecture/Database/Code Rules | EV-03, EV-10 | pending |
| Review | Builder Database — D2: implementation-reviewer-agent pareado após diff/sensores de persistência/migrations | CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-20, CA-22 | Revisão 6; Rules D2; evidências locais | EV-03, EV-04, EV-10, EV-12 | pending |
| Review | Builder Database — D3: implementation-reviewer-agent pareado após limpeza e retestes do runtime | CA-01, CA-02, CA-03, CA-20, CA-22 | Revisão 6; Rules D3; inventário final | EV-10, EV-12 | pending |
| Review | Builder Server — S1: implementation-reviewer-agent pareado após ports/Core types | CA-12, CA-20 | Revisão 6; Core/Code Rules | EV-10 | pending |
| Review | Builder Server — S2: implementation-reviewer-agent pareado após diff e integração real | CA-01, CA-02, CA-03, CA-10, CA-11, CA-12, CA-13, CA-16, CA-17, CA-18, CA-19, CA-20, CA-22 | Revisão 6; Rules S2; evidência rotas/jobs/MCP | EV-06, EV-07, EV-10, EV-12 | pending |
| Review | Builder Web — W1: implementation-reviewer-agent pareado após diff BFF/transporte | CA-12, CA-13, CA-18, CA-19, CA-20, CA-22 | Revisão 6; Rules W1; rotas Next | EV-07, EV-09, EV-10, EV-12 | pending |
| Review | Builder Web — W2: implementation-reviewer-agent pareado após diff UI/testes/VM, incluindo finalização browser de W1 | CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-20, CA-21, CA-22 | Revisão 6; Rules W2; handoff e evidências visuais | EV-07, EV-08, EV-09, EV-11, EV-12 | pending |
| Review integrado | Task principal — implementation-reviewer-agent para diffs C0/C1 e finalização C2; integração CI/lockfile/corte sem Builder responsável | CA-04, CA-05, CA-06, CA-07, CA-08, CA-09, CA-20, CA-22 | Revisão 6; authorities/tooling; após cada diff material e no integrado final | EV-03, EV-04, EV-05, EV-10, EV-12 | pending |

### Assignment ACH-34 — baseline de warnings

A instrução explícita do usuário inicialmente autorizou resolver o gate global mantendo thresholds e baseline; D-12 atualiza a baseline para aceitar findings existentes, sem mudar thresholds. A limpeza ACH-34 deixa de ser requisito de CI-09; warnings acima da baseline continuam bloqueando. Os owners, paths e resultados históricos abaixo permanecem no ledger, mas não exigem refatoração adicional exclusivamente para atingir zero warnings absolutos.

ACH-34 mutation checkpoint A (Database): somente `apps/server/src/database/drizzle/mappers/forum/DrizzleCommentMapper.ts`, já contratado como Create em D2. A tradução do conteúdo/data, envelope do autor e perfil de apresentação foram separados em helpers estáticos privados; `toPersistence`, campos e fallbacks permanecem intactos. Builder reporta Biome format write/check exit0. Sensors/DB/review ainda não executados; próxima ação é continuar apenas nos paths Database da assignment após inspeção/ACK principal.

ACH-34 Web assignment detail: avaliar helper compartilhado somente para o pipeline de PUT/PATCH/DELETE/form-data se body, headers, erro/retry e cleanup de query params permanecerem específicos a cada operação; simplificar setHeader sem trocar precedência/casing. Em `SseProfileChannel`, manter identidade de listener, dedupe terminal, ordem de notify/close/cleanup e contrato do canal. Nas três rotas, separar montagem de cookie/body/dispatch da orquestração GET/POST preservando validação, Origin, abort, status/body/header forwarding, cache e stream. Nenhuma nova superfície pública; mudanças devem permanecer nos cinco paths W1 e passar testes atuais.

### Amendment 2026-10-05 — baseline global de complexity

Por solicitação explícita do usuário, `.code-multivitals-baseline.json` foi regenerado usando `npm run update:complexity-baseline`. A baseline agora registra o estado atual; os thresholds não mudaram. O sensor imediatamente posterior passou com 3.476 arquivos, 9.479 funções, zero warnings e zero errors acima da baseline. D-12 supersede a exigência anterior de preservar a baseline: findings atuais são aceitos como dívida, e CI-09 bloqueará qualquer finding novo/regressivo no C2. Não regenerar a baseline durante o gate integrado.

### Amendment 2026-10-03 — gates globais

Spec revision 7 recebeu `clear` do Spec Reviewer; `check:spec-definition` e `check:plan-definition` passaram. D2 pode liberar C1/S2 após seus exits locais e review consolidado. A cobertura Server que executa ambos os projetos Jest e o quality gate `npm run check:complexity` serão medidos no candidato integrado C2, nunca dispensados. ACH-35 só fecha após a captura com S2; CI-09 só fecha com zero warnings/erros no sensor global.

A revisão integrada adicional cobre apenas os diffs transversais da task principal; não substitui reviewers pareados. Reviews são read-only, ativados pela task principal na execução, com retry para o mesmo escopo se necessário. A task principal inspeciona diffs e evidências, resolve findings e emite o veredito oficial; nenhum agente separado executa o gate de integridade do Plan.

Handoff para implement-spec: ler Spec revisão 6, este ledger e handoff offline; criar Evaluation no kickoff; respeitar owners/exits e capturar o diff preexistente. Builders recebem paths/cards/Rules/RF/CA da revisão exata e não criam subagentes nem editam artefatos normativos. Handoff de conclusão exige rastreabilidade completa, checks/build do CI e ACH resolvidos, conforme conclude-spec. A confirmação deste Plan não inicia implementação, deploy, commit ou PR.

# Execution log

Autoria em 2026-10-01: decisões de execução e entendimento compartilhado confirmados; Plan da revisão 6 criado com todos os itens de implementação `pending`. Nenhum evento de implementação registrado. CI-01 de autoria (check:plan-definition e check:spec-definition) aprovado; auditoria local conferiu DAG, rastreabilidade e partição dos 504 paths. Esses resultados validam o Plan, não a implementação ou os critérios de runtime. Acrescentar entradas somente após finding, retry, blocker ou evento material; detalhes de comandos/resultados pertencem a `evaluation.md`, criado no kickoff.

Kickoff 2026-10-01: implement-spec autorizado pelo usuário; revisão 6/clear confirmados, base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9. Assignment C0 ativa (tentativa 1): somente três paths do card C0, RF-05/RF-10/RF-12 e CA-20/CA-22; RP/JN herdados da Spec, SHI não aplicável; Rules e exits do card. Demais paths proibidos à edição C0. Definition checkers passed; Docker 29.5.3 acessível, .env.local presente sem leitura de valores. Próxima ação: manifests e npm install.

C0 tentativa 1: apps/server/package.json atualizado com drizzle-orm 0.45.3 e drizzle-kit 0.31.11. RF-05/RF-10/RF-12, CA-20/CA-22 em execução; lockfile ainda pendente. Próxima ação npm install.

C0 tentativa 1: npm install --ignore-scripts gerou package-lock.json (1099 linhas adicionadas, nenhuma remoção observada); processo ainda finalizando. Próxima ação conferir versões/exit e sensores.

C0 npm install terminou exit 0 (48s); dependências instaladas. Próxima ação sensores e review C0 antes de liberar D1/S1.

C0: check:code global passed, demais sensores em execução; reviewer coordination read-only ativado. Próxima ação coletar type/unit e veredito, sem liberar dependentes ainda.

C0: CI-02/CI-03 de fase passed; aguardando review C0. Unit global segue em execução e não equivale à aceitação integrada final.

C0: três detectores globais passaram; npm source e lockfile consistentes. Próxima ação registrar review e ativar D1/S1.

C0 inicial completed após accepted do reviewer coordination e detectores globais passed; gate será reaberto na remoção futura de dependências Web. D1 e S1 assignments ativas tentativa 1, revisão 6, base congelada, paths exclusivamente nos cards respectivos; todos demais paths proibidos. RF/CA, Rules, resultado e exits integrais dos cards; RP/JN pelo crosswalk da Spec, SHI não aplicável. Database: RF-01/02/03/10, CA-04/05/20; Server: RF-06/07/10, CA-12/20. Sem UI; handoff disponível para contexto. Builders devem reportar cada mutation e aguardar persistência do principal antes da próxima.

Builders Database/Server ativos com ownership exclusivo D1/S1 e ACK de persistência por mutation; gates documentais atuais passed.

S1 tentative1 mutation01: criou OnboardingReceiptProvider.ts e OnboardingService.ts e adicionou exports type no barrel auth; três paths exclusivos do card, RF06/07/10 CA12/20. Estado in_progress; próxima ação conformance estrutural e sensores Core/reviewer pareado.

D1 tentativa1 env01: container isolado stardust-drizzle-d1-replay, image public.ecr.aws/supabase/postgres:17.6.1.143, tmpfs sem portas/mounts/shared reset; root env somente memória. Próxima ação replay24 e catálogo. Cleanup docker rm -f stardust-drizzle-d1-replay.
S1 conformance completo executado antes de sensores: incomplete exit1 por paths de fases futuras pending; não libera candidato integrado, S1 paths presentes. Próxima ação sensores focados S1.

D1 tentativa1 env02 replay falhou storage.objects ausente na quarta migration, bootstrap owner postgres incorreto; ACH01 registrado. EV03 inválida/pending. Próxima ação corrigir bootstrap isolado supabase_admin e replay completo, sem tocar app DB. S1 sensores focados em andamento, sem mudança após mutation01.

S1 tentativa1 ACH02: typecheck falhou TS2307 imports sem /index. Correction automática em2ports pelo mesmo owner, contratos preservados. Estado in_progress; code/architecture anteriores serão stale e reexecutados após mutation ACK.

S1 mutation02 tentativa2:2imports corrigidos para #global/domain/structures/index e #global/responses/index, paths OnboardingReceiptProvider.ts/OnboardingService.ts. RF06/07/10 CA12/20; ACH02 correction aplicada, sensores pendentes. Próxima ação rerodar conformance e types/code/architecture.

D1 env03: public somente clone isolado recriado com owner supabase_admin; bootstrap storage-compatibility e24migrations ON_ERROR_STOP replay completo passaram. ACH01 corrigido no clone; próxima ação capturar catálogo e gerar D1, EV03 fase ainda pending.

S1 coverage Core gerou coverage-summary.json via Jest;176suites638tests exit0,41.598s. RF10/12 CA20/22, in_progress. Próxima ação ratchet/atualização types e reviewer.

S1 correction02 code global passed e architecture Core passed; coverage ratchet passed contra baseline intacta. Próxima ação types/unit oficiais e integridade/reviewer.

S1 correction02 type global passed42.968s, integridade passed (3ports excluded corretamente); ACH02 resolvido. Próxima ação finalizar unit e reviewer S1.

D1 catálogo replay real capturado local /tmp/stardust-d1-catalog.json:39tables220columns117constraints67indexes7enums7views40functions0triggers29policies. Próxima ação geração D1 delimitada, mantendo gates pending até inspeção/parity/review.

S1 unit oficial global passed5/5,1m14.357s; fonte correction02 atual. Exits sensores aprovados, aguardando veredito pareado.

S1 completed após sensores e accepted Reviewer Server limitado ports. Unit oficial global exit0 confirmado pela task principal (review capturou snapshot anterior pending); nenhuma evidência pendente S1. W1 assignment ativa tentativa1 revision6;20paths do card somente, demais proibidos. RF07/09/10/12 CA12/13/18/19/20/22; RP/JN Spec crosswalk, SHI NA; Rules/design/exits card. Builder Web estável ativado; D1 segue in_progress.

D1 mutation01 tentativa1: geração atômica98paths permitidos manifest/models/types/barrels/schema a partir catálogo replay real. Lista exata /tmp/stardust-d1-output-paths.json, gerador /tmp/stardust-d1-generate.py. RF01/02/03/10 CA04/05/20, in_progress; próxima ação7paths infra e sensores/parity/review.

W1 discovery ACH03: test-only registration Zod strips rawBody e tipo compartilhado não o declara;2paths foraW1 não são editados. Solução no escopo: rawBody explicitamente serializado em envelope body aceito por z.unknown, decodificado Registry antes handler; preservar JSON legado e MODEtesting, teste end-to-end do wire. Próxima ação Builder implementar transporte mock com essa serialização interna.

D1 mutation02 tentativa1:7infra paths criados drizzle.config/DatabaseAccess/DrizzleClient/DrizzleRepository/index/errors conforme card; todos105existem. RF01/02/03/10 CA04/05/20; próxima ação formato se necessário, conformance e sensores/parity.

W1 mutation01 tentativa1:11source paths cookies/NextRestClient/AuthService/OnboardingService/services index/middleware/SseProfileChannel+barrel/3BFF routes criados ou alterados conforme card. RF07/09/10/12 CA12/13/18/19/20/22; in_progress próxima ação mocks+route suites e sensores.
D1 ACH04: replay sob supabase_admin altera owners do catálogo versus runner legado postgres. Manifest atual owner parity não aceita; modelos estruturais ainda avaliáveis, catálogo access stale até replay original sob postgres e preparação de roles real. Próxima ação corrigir clone usando roles init repo e postgres runner sem normalização artificial.

D1 env04: replay postgres no clone falhou por policies storage preservadas do replay anterior após limpar somentepublic. ACH04 ainda in_progress. Próxima ação limpar storage compatibility no clone e preparar do zero antes replay24; nenhum dado app afetado.

D1 env05: clone public/storage objects reconstruídos e24migrations replay como postgres passaram. Próxima ação recapturar manifest owners reais e corrigir6projections inferred; EV03 ainda pending/manifest stale.

D1 mutation03 tentativa2: legacy-schema-manifest substituído pelo catálogo replaypostgres;6projectiontypes User/RankingUser/Challenge/Solution/Comment/FeedbackReport derivados $inferSelect/Pick. RF01/02/03/10 CA04/05/20,ACH04 correction pendente sensores. Próxima ação formato105D1paths e parity.

D1 mutation04: Biome format105exactpaths exit0 Fixed55; nenhum D2artifact. RF10 CA20 in_progress; próxima ação conformance/sensores/parity.

W1 mutation02:6paths mocksServerMock/Registry,catchall testhandler e3route.test criados/alterados; rawBody envelope compatJSON e suites BFF, RF07/09/10/12 CA12/13/18/19/20/22. Próxima ação formato17pathsW1 e sensores. D1 conformance full exit1 esperado por fases futuras pending, sensores focados iniciados.

D1 ACH05: oficial Servertypes exit2 star-model import @stardust/core/lesson/domain/dtos inexistente;codeServerexit0(868files19warnings),architectureexit0(788modules1389deps). Próxima ação Builder corrigir alias no modelstar e rerodar afetados;phase in_progress.

W1 mutation03: profile-events route.test aprimorado roundtrip realPUT registrationZod;Biome format17paths exit0fixed9. RF07/09/10/12 CA12/13/18/19/20/22,ACH03 teste pendente. Próxima ação conformance e focusedJest/types/code.

D1 mutation05: star-model typeimport corrigido para @stardust/core/lesson/dtos;format nofix,ACH05 aguarda reruntype. Paritymetadados oficial passou39tables7enums220columns117constraints13standaloneindexes zero differences (prealiasdelta estruturalinócua).
W1 mutation04:signup route.test3testtypes corrigidos (cookieexpires,NODE_ENVreadonly,headers),format1passed;sem contractchange. ACH06 Jest Nodeenvironment29 incompatível runtime30,principal reabreC0 adicionando environmentNode30Web e locknpm;W1tests blocked até isso,sensorsinprogress.

C0 tentativa2 assignment reaberta mesmos3paths RF05/10/12CA20/22,scope principal;motivo ACH06 envNodeWeb incompatível,node30.4.1 alinhadojsdom. ReviewC0 anteriorstale,Serverdepsexatasmantidas. Próxima ação manifestWeb+npminstall,rechecks/reviewcoordination.
D1 ACH07:DrizzleindexDESC defaultNULLSLAST contraria legacyDESCNULLSFIRST;4modelscorrection explícita nullsFirst necessária,parityindexevidence pending. W1 mutation04 relatório ajustado: headersgeneric ainda pendente antes typesrerun.

D1 mutation06 corrige os quatro models do ACH-07 com DESC NULLS FIRST explícito; Biome format passou, sem ajustes. Próxima ação: reexecutar parity e sensores D1.

C0 tentativa 2: apps/web/package.json adiciona jest-environment-node 30.4.1 como devDependency para ACH-06. Mantém os pacotes Supabase até W2. Próxima ação: npm install e review de coordenação.

W1 mutation05: o generic it.each<Record<string,string>> foi aplicado no teste signup; format passou. Próxima ação: retestar types/BFF após instalação C0.

C0 tentativa 2 npm install --ignore-scripts passou; lockfile regenerado para o environment Node da Web. D1 parity independente atual passou hashes24,39tabelas220colunas7enums117constraints13índices, incluindo ordem/NULLS/predicates. Próxima ação: rechecks C0/D1/W1 e reviews pareados.

D1 ACH-05 continua: types atual confirma @stardust/core/lesson/dtos também não existe. Reviewer Database IR-D1-01 bloqueia exit CA-20; Builder deve consultar DTO exports reais antes da próxima correção. W1 BFF duas suites/13tests passaram; signup falhou parse ESM de RPC cookieActions importado pelo cliente Next, correction no boundary de teste.

W1 mutation06: signup route.test mocka somente cookieActions RPC externo ao teste de headers do cliente real; Biome passou. Próxima ação retestar BFF. D1 Reviewer failed IR-D1-01; exports reais confirmados: QuestionDto lesson/entities/dtos e TextBlockDto global/entities/dtos, sem wildcard genérico. Correção será feita pelo mesmo Builder.

D1 mutation07: star-model.ts usa agora os exports verificados de QuestionDto e TextBlockDto; format passou. ACH-05/IR-D1-01 aguardam types e mesmo Reviewer. Próxima ação: sensores focados D1 e re-review.

W1 ACH-09: cópia de headers do upstream pode preservar encoding/length inválidos após fetch decodificar o corpo. Assignment de correction dentro dos quatro paths W1 signup/profile-events route e testes: remover headers de representação/hop e manter status/body/SSE/security. Próxima ação bounded patch e testes.

W1 BFF atual passed: três suites/25tests, incluindo roundtrip rawBody registro real; ACH-03/ACH-08 resolvidos. Global unit anterior failed por snapshot ESM signup; será reexecutado após header correction, sem aceite integrado. C0 environment Node resolução npm atual confirmada; próxima ação review coordenação.

D1 sensores atuais após mutation07: types Server passou exit0, code Server passou exit0, architecture passou exit0; parity metadata/hash atual passed. Próxima ação retomar Reviewer Database para resolver IR-D1-01 e liberar D2.

W1 mutation07: dois handlers e dois testes removem headers de representação/hop inválidos no proxy; Biome passou. ACH-09 aguardando BFF rerun. Jest e Playwright usam o mesmo registry temporário, portanto executar sequencialmente.

D1 completed após re-review accepted e IR-D1-01 resolvido. C0 tentativa 2 accepted, prerequisite liberado (remoção Supabase Web continua etapa futura). W1 mutation07 BFF3suites25tests passed, ACH-09 resolvido; próxima ação três paths browser W1. D2 assignment ativa tentativa1 revision6:115paths exatos do card, RF/CA/Rules/exits reproduzidos em Evaluation. D1 index export finalization permitido ao mesmo owner somente quando novos arquivos D2 existirem, conforme coordenação do Plan; registrar e re-review escopo combinado. Demais paths proibidos, RP/JN crosswalk Spec, SHI não aplicável.

D2 mutation01: mappers/auth/DrizzleApiKeyMapper.ts e index.ts, repositories/auth/DrizzleApiKeysRepository.ts e index.ts criados. Bootstrap público limitado a findByHash; ownership explícito nas demais operações. RF-01/RF-02/RF-12, CA-01/CA-03/CA-20/CA-22; format passou. Próxima ação família seguinte e sensores de D2.

Ledger documental reconciliado: Evaluation mantém a ordem canônica, histórico factual preservado na seção de sensores e findings/disposições consolidados. Nenhuma evidência de código foi recapturada ou presumida; próxima ação D2/W1.

W1 mutation08: os três arquivos browser do card foram criados/alterados; todos os20paths W1 agora existem. Biome passou. Próxima ação: sensores Web e três cenários iniciais BFF middleware; UI completa permanece gate W2.

D2 mutation02: sete paths lesson mapper/repository/barrels criados; JSON de stars preservado e áudio usa atualização SQL atômica. Format passou. Próxima ação família seguinte; persistência real aguardará S2.

### W1 tentativa 1 — mutation 09 e sensores
Fixture social usa accountId determinístico obrigatório em social-account-confirmation.test.ts; correção ACH-10 do erro TS2345. Types stale, rerun pendente. Web unit 118 suites/505 testes passou; architecture 1624 módulos/2610 dependências passou; code sem erros. Integrity falhou por rejeitar três paths Playwright contratados (ACH-11), investigação da regra pendente.

### D2 tentativa 1 — mutation 03
Shop: oito paths de mappers/repositories e barrels; 21 métodos, filtros/paginação/ordenação e compras preservados, escrita god/system. RF01/02/12 CA01/03/20/22; format passou. Próxima ação família manual; sensores/review pendentes.

### D2 mutation 04 e interpretação dos mappers contextuais
Manual: quatro paths Guide mapper/repository/barrels, oito métodos; RF01/02/12 CA01/02/03/20/22, format passou, sensores pendentes. Assignment D2 ampliada somente aos paths D1 já pertencentes ao mesmo owner: types/entities/space/DrizzlePlanet.ts para projeção agregada e legacy-schema-manifest.json para fases separadas de acesso/parity exigidas pelo contrato. Mappers Chat, ChatMessage e Star recebem Id parental verificado no constructor; toPersistence(entity) conserva assinatura e inferInsert completos, sem I/O/placeholders/Core changes. Próxima ação continuar famílias.

### Assignment principal — correção isolada ACH-11 do sensor
Paths exclusivos scripts/check-test-integrity.mjs e scripts/tests/check-test-integrity.test.mjs. Manutenção do sensor que contamina CA22, fora do candidato funcional da Spec; nenhuma mudança de Contract, Rules ou política. Corrigir regex para aceitar localização já canônica src/app/tests/** além das suites colocadas junto às rotas. Preservar todas as proibições. Exit: teste de regressão do checker e rerun integrity.

### W1 ACH-12 — Origin no runtime Next
Três cenários BFF Playwright: dois passaram, signup esperado201 retornou403 por origem request.nextUrl normalizada localhost em vez127.0.0.1. Assignment fix mesma W1: signup/route.ts e respectivo tests/route.test.ts, autoridade CLIENT_ENV.stardustWebUrl, sem mudar origem testing. Próxima ação regressão e rerun BFF/unit/types/browser.

### ACH-11 mutation 01 — detector
Regex aceita zero ou mais segmentos antes de tests em apps/web/src/app; teste cobre paths raiz/colocated. Dois scripts reparados, sem alterar proibições. Sensor/teste pendentes.

### ACH-11 sensores
Regressão checker passou7 testes; integrity passou após reparo. Próxima ação review read-only manutenção; fases futuras permanecem pending.

### W1 mutation 10 — ACH-12
Origin signup compara CLIENT_ENV.stardustWebUrl; teste cobre request.nextUrl localhost/config127.0.0.1. Dois paths route e suite signup, format passou. RF07/10/12 CA12/18/20/22. Próxima ação BFF/types/unit/browser; anteriores stale para signup.

### D2 mutation 05 — conversation
Seis paths Chat/ChatMessage mappers/repositories/barrels. Constructor exige Id parental, assinatura toPersistence(entity) preservada. Filtro owner e lock de parent na inserção de mensagem. RF01/02/12 CA01/02/03/20/22; format passou. Próxima família independente, sensores pendentes.

### Ambiente runtime — Node compatível
Pré-requisito localizado /home/petros/.nvm/versions/node/v24.20.0/bin/node. Próximos runtimes Server/Studio usarão PATH temporário dessa versão, sem instalar dependências nem alterar configuração versionada. Node22.17 permanece apenas nos sensores já registrados.

### D2 mutation 06 — Notes
Dois paths DrizzleNoteMapper e DrizzleNotesRepository; cinco métodos owner privados e paginação. RF01/02/12 CA01/03/20/22, format passou. Assignment same owner D1 types/entities/playground/DrizzleSnippet.ts permite completar projeção author/avatar inferida exigida pelo par legado; nenhum Core/path novo. Próxima ação demais famílias.

### W1 sensores pós mutation 10
BFF3suites26tests passaram; types/code passaram (warnings legados). Coverage executou118 suites506 testes, passou64.365s; relatório gerado ignorado apps/web/coverage/coverage-summary.json. Métricas24.73 statements27.57 branches22.03 functions25.58 lines. Próxima ação ratchet @stardust/web, três casos browser.

### D2 mutation 07 — playground
Cinco paths: DrizzleSnippet tipo/projeção D1 completado, mapper/repository playground e barrels. Cinco métodos com author/avatar join, público somente isPublic e privados por owner; paginação/count. RF01/02/12 CA01/03/20/22; format passou. Aceite D1 para tipo Snippet stale; re-review D2 agregado.

### W1 browser e ratchet
Ratchet @stardust/web passou. Três cenários BFF middleware Playwright passaram3/3 em6.9s no testing127.0.0.1:3100. ACH12 resolvido no runtime real Next. Relatórios ignorados gerados, nenhuma UI/VM ainda validada. Próxima ação review pareado W1.

### Assignment Reviewer Web W1
Read-only pareado Builder Web, revisão6, vinte paths W1, RF07/09/10/12 CA12/13/14/15/18/19/20/22 contribuição limitada. Exits oficiais atuais disponíveis, UI completa deferredW2. Próxima ação ativar reviewer após Builder report finalizar.

### D2 checkpoint de tipos
Builder reportou Servertypes exit0 em doze ports já implementados; não evidência oficial integrada. Próxima mutation autorizada geração Kit0000, parar antes replay. W1 Builder encerrou source20paths com exits focados; ReviewerWeb ativo.

### D2 geração — ambiente local
Primeiro guard falhou sem SUPABASE_DATABASE_URL literal na raiz; nenhum arquivo/banco alterado. Assignment ambiente permite derivar URL loopback em memória de password e port presentes .env.local usando URL encoding, sem log/persistência. Kit generate é offline; não mudar root.env. Próxima ação retry geração.

### W1 completed — review aceito
Reviewer Web aceitou escopo20paths rev6 sem finding. Todos exits focados passaram; UI/S2/W2/final gates continuam pendentes. Próxima ação D2, depoisC1.

### D2 mutation 08 — Kit baseline
Gerados0000_baseline.sql,meta/0000_snapshot.json,meta/_journal.json por Kit0.31.11 generate --name baseline,39tabelas220colunas. Fonte schema.ts/models D1, sem conexãoDB. RF03 CA04/05/20; próxima ação customSQL/lock/scripts/replay, parity pendente.

### Review ACH-11 accepted
Reviewer coordination aceitou reparo isolado dos dois scripts sem finding; regra canônica aceita e restrições preservadas. Próxima ação D2 e restante da feature; nenhum gate final antecipado.

### Preflight estrutural wave2 atual
Conformance rerun após mutations D2/W1 exit1 por contrato ainda incompleto. Log /tmp/stardust-drizzle-conformance-wave2-current.log; 504paths permanecem autoridade. Exits W1 aprovados só em escopo, entrega integrada não aprovada.

### S2 preparação read-only
Builder Server pode explorar contratos/flows S2 e planejar batches sem editar source/testes/ambiente. Fase permanece pending até D2/C1 completos; assignment de mutation ainda não ativada. Próxima ação retornar riscos concretos e esperar liberação.

### Reconciliação de status corrente
Cabeçalho Plan e summary Reviews atualizados: Spec in_progress, W1 completed/accepted; D1 Snippet stale aguardandoD2. S2 prep identificou riscos signupeligibilidade/Auth/MCP/fixtures sem mutações.

### D2 mutation 09 — Achievements
Dois paths DrizzleAchievementMapper/DrizzleAchievementsRepository, nove métodos, catálogo ordenado, unlocked owner/God/system e writesGod/system; replaceMany transacional. RF01/02/12 CA01/02/03/20/22. Types checkpoint stale para novos paths. Próxima ação restantes ports.

### D2 mutation 10 — Tiers
Dois paths DrizzleTierMapper/DrizzleTiersRepository, três operações e catálogo ordenado, null legítimo. RF01/02/12 CA01/02/03/20/22, format passou. Types stale para estes paths; próxima ação completar ports restantes.

### D2 mutation 11 — Rankers e ACH-13
Quatro paths Ranker mapper/repository/ranking barrels, cinco operações. RF01/02/12 CA01/02/03/20/22; format passou. ACH13 status sintético não pertence join real; assignment same owner types/entities/ranking/DrizzleRankingUser.ts remove status obrigatório da projeção, mantém exatamente id/tierId/xp/position/user exigidos S1. Próxima ação corrigir tipo/repository sem mudar domínio.

### D2 mutation 12 — ACH13 correction
Dois paths DrizzleRankingUser.ts e DrizzleRankersRepository.ts corrigidos: projeção contém somente campos reais inferidos e não há status sintético. Insert alias completo/mapper assinatura preservados. RF01/02/12 CA01/02/03/20/22; format passou, types/review pendentes.

### D2 mutation 13 — Stars
Dois paths DrizzleStarMapper/DrizzleStarsRepository, oito operações; parentId obrigatório/inserts inferidos, writesGod/system e replaceMany transacional com parentlookup lock. Contagens usam funções manifest preservadas0001 ainda pending. RF01/02/12 CA01/02/03/20/22; format passou, types/runtime pending.

### D2 mutation 14 — Planets
Cinco paths Planet mapper/repository/barrels e tipo D1; nove métodos com aggregate stars/counts e writesGod/system, replaceMany transacional. RF01/02/12 CA01/02/03/20/22, format passou. D1 Planet projection stale até reviewD2, runtime/customfuncs pending. Credenciais manuais raiz ausentes, pergunta independente aguardando usuário.

### D2 checkpoint 17ports e ChallengeSource projection
Same owner types/entities/challenging/DrizzleChallengeSource.ts autorizado para challenge nullable Pick inferido id/title/slug conforme S1 join legado. Sem placeholder/Core changes. Oficial Servertypes checkpoint após preflight será executado enquanto próximos ports são lidos.

### D2 ACH-14 — Ranker mapper contrato
Exceção S1 exige toDto além de toEntity; operação omitida. Assignment fix DrizzleRankerMapper.ts no mesmo ownerD2, incluir toDto inferido preservando assinatura/conversão. Próxima ação mutation delimitada, tipos/review pendentes.

### D2 mutation 15 — ACH14 fix
DrizzleRankerMapper.ts inclui toDto retornando RankingUserDto oficial e toEntity delega conversão. Format1 passou. RF01/02/12 CA01/20/22; checkpoint2 concorrente não vale como fresh para este path. Próxima ação outros ports.

### D2 checkpoint2 oficial
Servertypes snapshot17ports exit0; helpertoDtoRanker adicionado durante round mantém evidência limitada/stale parahelper. Nenhum aceite final. Preflight504paths seguefailed por fases pendentes.

### D2 mutation 16 — ChallengeSources
Três paths source mapper/repository e tipo joinD1, nove métodos administrativosGod/system, nullablejoin inferido e filtros/paginação. ReplaceMany transacional com locks/posições temporárias. RF01/02/12 CA01/02/03/20/22; format passou,18ports e tipos/runtime/review pendentes.

### D2 mutation 17 — ChallengeCodeExecutions
Dois paths mapper/repository, quatro operações, owner antesSQL/filtrosuserchallenge, histórico/latestnull/counts. RF01/02/12 CA01/02/03/20/22, format passou;19ports source, types/runtime pending. Próxima ação demais ports.

### D2 interpretação Solutions view
Não autorizar full replace por leitor não author. Proposta: lock da linha, comparar campos imutáveis reais, nonauthor somente SQL incremento views_count; preserve Core ports e actor verificado. Detalhes de concorrência precisam inspeção antes batchSolutions. Comments independente pode continuar.

### D2 interpretação final Solutions
DomainSolution.view() já marca isViewed true, enquanto create/mapper iniciafalse. Usar indicador existente para view-only SQL incremento atômico inclusiveowner, imutáveisverificados soblock; edits author/God/system não sobrescrevemviews snapshot. Nenhum novo mode/DTO/Coreport. Próxima ação batchSolutions autorizado após demais independentes.

### D2 mutation 18 — Solutions
Dois paths Solutionmapper/repository, oito métodos, authorjoin/counts/paginação e votos owner. isViewed existente seleciona incremento SQL exclusivo com rowlock/imutáveis, edits author/God/system preservamcontador. RF01/02/12 CA01/02/03/20/22; format passou,20ports source e validação pending.

### D2 mutation 19 — Comments
Quatro paths Commentmapper/repository/forumbarrels, nove métodos, author/avatarjoins e SQLcounts/pagination. Criação/relação transacional; edit/deleteauthorGodsystem, reply próprioactor. RF01/02/12 CA01/02/03/20/22; format passou,21ports e testes/types/runtime pendentes.

### D2 mutation 20 — Challengemapper
DrizzleChallengeMapper.ts criado com campos inferidos, JSONDTOs reais e starId nullable, sem placeholder vazio. RF01/02/12 CA01/02/03/20/22; format passou, repository pending. Interpretação challenge/star preserva conteúdo de estrela disponível; privados fora desse caso author/admin.

### D2 ACH-15 — OAuthlookup sem colunas legadas
Replay não possui google_account_id/github_account_id e ports não têm callers. Não inventar colunas nem remapear ids a Authidentities. Core nullable+S1 ausência legítima determinam retorno null com accessguard adequado quando associação não existe no schema. Registrar limite sem declarar lookupSQL operacional; review D2 deve confirmar.

### D2 mutation 21 — Challenges
Três paths repositoryChallenge/challengingbarrels,18operações SQL filtros/agregação/order/paginação/count, actor verificado e categorias transacionais. RF01/02/12 CA01/02/03/20/22; format passou,22ports. ACH16 importChallengeCategory incorreto detectado pelo Builder; corrigir mesmo repository antes checkpointtipos.

### Gate documental — redação
Plan definition falhou porque regexmarcador pendente também casa palavra portuguesa com acento em descrição. Frase substituída por operação omitida sem nenhum placeholder real ou contrato alterado. Reexecutar gates antes próximos passos.

### D2 mutation 22 — ACH16 correction
DrizzleChallengesRepository.ts usa ChallengeCategory exportentities real e removeunusedimport. Format1 passou, RF01/02/12 CA01/20/22; checkpoint22ports autorizado após preflight, aguardar resultado antes nova mutation.

### D2 ACH-17 — checkpoint3
Official Servertypes22ports exit2 TS2322 DrizzleChallengeMapper.ts49 string|undefined para campo obrigatório. Corrigir domain getter verificado sem cast/placeholder mesmo pathD2; rerun types antes demais mutations.

### D2 mutation 23 — ACH17 fix
ChallengeMapper slug usa getterdomain obrigatório challenge.slug.value em vez DTO opcional. Format1passou, RF01/02/12 CA01/20/22. Próxima ação checkpointtipos antes restante3ports.

### S2 interpretação reporting atomicidade/efeitos
CoreBroker só publish. Composição S2 pode proxy request-local em memória acumulando event/id, sem tabela/outbox/retries; sharedDBtransaction integra ports, flush sequencial apóscommit preserva ordens/keys e falhaSDKdepois persistência. Nenhum novo Coreport/path. Precisa typeDB aceitar transaction real inferida sem cast e testes reais de rollback/sideeffects.

### D2 mutation 24 — User mapper
DrizzleUserMapper.ts criado select/join/arrays tipados e insert completo só scalars; RF01/02/12 CA01/02/03/20/22, format passou. Usersrepo pending, tiposstale para novomapper. Assignment same owner DrizzleClient.ts permite DrizzleDatabase unionconnection/transaction inferida para composiçãoS2.

### D2 mutation 25 — transaction type
DrizzleClient.ts unionconnection/transaction inferParameters real, singletonconnection e assinaturascreate/getInstanceDrizzleDatabase mantidas. Um pool/lifecycle inalterados. RF01/02/12 CA01/02/03/20/22; format passou, aceiteD1client stale. Próxima ação Usersrepo.

### D2 mutation 26 — Users
Três paths Usersrepository/profilebarrels,36operações SQL/joins/projections, públicos sócontainsboolean, profiles/list/KPIauth como legado, ownerwrites e replaceMany transacional. RF01/02/12 CA01/02/03/20/22,23ports. Format passou, próximo officialtypes antesReporting.

### D2 checkpoint4 passou
Official Servertypes23ports/aliastransaction exit0. Próxima ação Reporting2ports e migrations/security/scripts/ensaios. Nenhumruntime/checkglobalfinal.

### D2 mutation 27 — FeedbackMessages
Dois paths feedbackmessagemapper/repository, quatro operações, reportowner/roleactor guards, statuslock e messageattachments atômicos/duplicadosidempotentes. RF01/02/12 CA01/02/03/20/22, format passou,24ports e umReportport restante.

### D2 mutation 28 — FeedbackReports
Quatro paths Reportsmapper/repository/reportingbarrels,12operações, filtrosownerGodsystem e SQLsummaries/pagination. Save/readmarkers clocksmonotônicos e changeStatusexpectedcanonicalconflict. RF01/02/12 CA01/02/03/20/22, format passou;25ports source completos, SQLinfra/runtime/reviewpending. Próximaaçãocheckpointtipos e barrels.

### D2 — checkpoint dos 25 ports e correção delimitada

Check de tipos dos 25 ports falhou no repositório de feedback; D2 permanece in_progress. Builder Database recebe correção restrita a DrizzleFeedbackReportsRepository.ts para preservar inferência dos joins sem casts e a DrizzleUsersRepository.ts para restringir findById à conta do contexto, conforme S3 da revisão 6. RF01/RF02/RF05, CA01/CA02/CA06; Rules de Database e Server permanecem vigentes. Nenhum barrel ou migration será alterado neste lote. Exit: novo check de tipos e revisão D2 posterior.

### D2 — complemento do lote de correção

O diagnóstico inclui alias reporting/errors nos dois repositórios. O lote autorizado inclui também apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts apenas para corrigir o import canônico. Reports corrige seleção de avatar e status conforme tipos existentes; Users restringe findById. Revisão 6 e critérios do lote anterior mantidos.

### C1 — preparação read-only do bootstrap

CodeGraph consultado antes da exploração; reset.sh/Compose não cobertos pelo índice foram lidos diretamente. Nenhuma mutation C1 ativada: dependência D2 continua aberta. Bootstrap vigente aplica SQL legado com psql; C1 deve retirar esse loop e executar runner Drizzle, limpar ledger antes do runner e preservar ausência de seed.

### C0 — reabertura delimitada para geração D2

Assignment exclusiva da task principal, revisão6 RF05 CA04/CA05: apps/server/package.json, adicionar somente db:generate = drizzle-kit generate. Config/model/out já existem e foram revisados D1; D2 necessita o comando literal S6 para customs. Não modificar demais scripts CLI nesta etapa, sem lockfile ou dependências novas. Exits: JSON válido, script resolvido pela versão fixa e geração D2 pelo Builder. C0 aceite anterior fica limitado ao diff anterior; novo script terá review coordination no fechamento operacional.

### C0 — mutation script de geração persistida

apps/server/package.json agora expõe db:generate: drizzle-kit generate. JSON validado; sem alteração do lockfile/dependências ou demais scripts. Builder Database usará npm run db:generate -w @stardust/server -- --custom --name ... em ordem, depois do ACK do lote atual.

### D2 — interpretação de erro público de reporting

CodeGraph confirmou FeedbackReportNotFoundError é subclass sem campos adicionais, somente mensagem passada a NotFoundError. Dentro do lote29, usar NotFoundError global exportado com mensagem exata conserva erro público e evita import Core inexistente. Sem criar export/port Core; seleção plana inferida e hidratação real autorizadas no mesmo reports path.

### D2 — mutation29 correção persistida

Builder Database alterou somente DrizzleFeedbackMessagesRepository.ts, DrizzleFeedbackReportsRepository.ts e DrizzleUsersRepository.ts. Aliases usam NotFoundError global/mensagem exata; Reports seleção plana e hidratação Awaited/ReturnType inferidas, changeStatus mantém DTO e timestamp retornado; Users findById restringe user ao accountId verificado, God/system mantidos. Format3paths exit0; sem casts ou alteração Core. RF01/02/12 CA01/02/03/20/22; tipos novos antes de barrels.

### D2 — próximo lote de barrels condicionado a tipos

Assignment Database30, revisão6 RF01/RF02/RF12 CA01/CA20/CA22, Rules Database/Code: apps/server/src/database/drizzle/mappers/index.ts, repositories/index.ts, drizzle/index.ts e apps/server/src/database/index.ts. Consolidar os onze domains e exports Drizzle somente agora que todos os arquivos existem. Preservar exports Supabase/Postgres legados até S2/D3 e lifecycle singleton. Sem alteração em models/repositórios/package. Ativação depende do check tipos25 exit0; Builder aguarda liberação. Exits: format, tipos/code/architecture D2 e reviewer Database.

### D2 — tipos25 passaram, barrels30 liberados

Check oficial de tipos Server exit0 no snapshot corrigido de todos25ports. Assignment30 preparada torna-se ativa; Builder Database pode consolidar quatro barrels e parar para ACK. D2 SQL/runtime/review permanecem pendentes.

### C1 — preparação read-only de CI

Workflows YAML fora do índice lidos: Server CI usa Supabase CLI start/reset/status; Web CI repete variáveis Supabase em unit/integration/build. C1 substitui bootstrap Server por Compose root/exports efêmeros/db:test e remove env Supabase Web somente junto ao cleanup W2/C0. Nenhuma mutation ou evidência CI remota nesta preparação.

### D2 — precisão do inventário de barrels30

Inventário atual contém12 domains, não11: auth/challenging/conversation/forum/lesson/manual/playground/profile/ranking/reporting/shop/space. Assignment30 permanece nos quatro paths e cobre os12 necessários aos25ports. Root database/index preserva seus exports Supabase atuais e acrescenta Drizzle; nenhum export legado será removido.

### D2 — mutation30 barrels persistida

Os quatro barrels autorizados agregam12domains e exports de repositories Drizzle; root database/index conserva10exports Supabase e acrescenta Drizzle. Format4exit0; mesmos RF/CA do lote. Próximo lote customs31 preparado, mantendo migrations legadas intactas até ensaios.

### D2 — assignment31 geração custom0001

ACK30 persistido. Assignment Database31 revisão6 RF03/RF04/RF05 CA04/CA05/CA06/CA07/CA08, Rules Database e migrations: somente apps/server/src/database/drizzle/migrations/0001_application_objects.sql, migrations/meta/0001_snapshot.json e migrations/meta/_journal.json. Executar npm run db:generate -w @stardust/server -- --custom --name application_objects com URL root derivada em memória, sem remoto. Nenhum handedit snapshot/journal; neste lote somente geração Kit e relatório hashes/entries, sem preencher SQL, gerar0002, scripts ou apagar legado. Exit: artefatos gerados fixados0.31.11 e ACK; SQL aplicado só depois da implementação operacional e ensaios.

### D2 — diagnóstico de code/architecture após barrels

Check code encontrou formatação em Comments e nos JSON gerados Kit. Snapshots/journal não podem ser handeditados; root prepara correção auxiliar biome.json exclusivamente formatter dos meta JSON gerados. Comments será formatado pelo mesmo owner após ACK31. Architecture passou no snapshot25ports/barrels. Estes sensores começaram antes da renovação structural e ficam diagnósticos, sem selo integrado; preflight renovado exit1 por fases futuras.

### Coordenação — assignment auxiliar formatter de artefatos Kit

Principal possui exclusivamente biome.json nesta correção reversível de tooling fora dos504paths funcionais, revisão6 S2/RF05 CA04/CA20/CA22; Rules code/Database e no-handedit são autoridade. Adicionar override somente formatter.enabled=false para apps/server/src/database/drizzle/migrations/meta/*.json; linter/assist/TS/tests/SQL continuam intactos. Nenhum wildcard global ou alteração de baseline. Exit: JSONválido e checkcode reconhece exclusão de format, review coordination no fechamento. Só tooling gerado; funcionalidade não ampliada.

### Coordenação — mutation ACH20 persistida

biome.json recebeu override formatter.enabled=false somente nos JSON meta Kit. JSON válido; linter/assist e demais arquivos continuam nas regras anteriores. Nenhum snapshot/journal foi reescrito. Próximo sensor checkcode valida integração após format Comments.

### D2 — mutation31 artefatos Kit persistidos

Comando npm run db:generate -w @stardust/server -- --custom --name application_objects exit0, três paths autorizados. Hashes principais conferidos: SQL b3cc75fa802f8a5b333c480eb0d77f3d2185602e108f36fb33d3ade3c6939413; snapshot979bb54323605bd6c344ffa178238535f1eee5e8e94550294faf4200d8856337; journal6c881b9e91c4e7858276955226d5b6880b564eba6bba1c7b22270d8dbba9a1db. SQL vazio gerado; nenhum banco alterado. ACK31.

### D2 — assignment32 format Comments

Database revisão6 RF01/02/12 CA01/20/22, Rules Code/Database: somente apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts. Aplicar formatter sem alteração semântica para resolver ACH21 diagnóstico. Sem outros paths ou Kit. Reportar diff/exit e parar para ACK32; depois0001SQLfill.

### D2 — mutation32 format persistida

Comments único path formatado pelo owner, exit0 Fixed1file, sem alteração semântica. ACK32; próximo sensorcode valida Comments e override metadata juntos. SQLfill0001 autorizado somente após esse sensor iniciar com source TS estável.

### D2 — code25 atual passou e assignment33 SQL0001

Checkcode Server exit0 após corrections Comments/meta. Assignment Database33 revisão6 RF03/04/05 CA04/05/06/07/08 Rules Database/migrations: somente apps/server/src/database/drizzle/migrations/0001_application_objects.sql. Preencher custom com definições finais próprias do manifest: funções/views/objetos não modelados e catálogo legado de acesso necessário antes0002, preservando Auth/storage/cron infraestrutura conhecida. Sem seed, tabelas/colunas novas, drift cleanup ou edição meta. Qualquer objeto não representado falha e é reportado antes de prosseguir. Reportar counts/hash/diff e pararACK33; não aplicarSQL nem gerar0002/scripts neste lote. Exits seguintes serão banco vazio/adoption/inverse.

### Coordenação — detectores globais checkpoint D2

Source TS dos25ports/barrels estável; Builder atua somente SQL0001. Após preflight atual, executar check:code/check:types/test:unit raiz em paralelo para checkpoint obrigatório AGENTS. Essas evidências não cobrem runner futuro, SQL/runtime ou fases S2/W2; freshness será delimitada ao snapshot atual.

### D2 — inventário SQL33 conhecido

Builder declara40functions/7views/29policies (3storage)/5RLStrue, relationgrants1158/functiongrants86, ownerspostgres, defaults/triggers/sequences próprios0. As funções legadas de seed/install serão somente definições preservadas, jamais chamadas. Extensions8/memberships21 permanecem infraestrutura. Storage restringe mutation às3policies próprias e grants manifest, sem ownership/reset amplo. Nenhum objeto desconhecido reportado; SQL ainda em preparo.

### Coordenação — code global checkpoint passou

Checkcode raiz exit0, snapshot25ports/barrels/tooling formatter, demais detectores ainda running. Builder permanece SQLonly33.

### D2 — mutation33 SQL0001 persistida

0001_application_objects.sql único path preenchido,187311bytes/1527statements Kitbreakpoints, hash9b9ffe077d80fbba798d3d4e15ee8618effc51327b53b6abf7d11edd9d3c12e9 conferido principal.40functions/7views/39ownersRLS/29policies/1158relationgrants/86functiongrants, sem seed/invocações/extension/membership/infraDDL. ACK33; próximo lote34 geraçãoKit0002.

### D2 — assignment34 geração custom0002

Database revisão6 RF03/04/05 CA04/05/06/07/08 RulesDatabase/migrations, somente apps/server/src/database/drizzle/migrations/0002_server_owned_access.sql, migrations/meta/0002_snapshot.json, migrations/meta/_journal.json. Comando npm run db:generate -w @stardust/server -- --custom --name server_owned_access, URLloopback em memória rootenv. Somente geraçãoKit0.31.11, sem SQLfill/inversa/manifest/scripts/legacy/DB. Reporte hashes/entries e pareACK34; sourceTS estável durante globals.

### Coordenação — tipos globais checkpoint passaram

Checktypes raiz exit0 sobre25ports/barrels e tooling, globalsunit ainda running. Nenhuma TSmutation concorrente.

### D2 — mutation34 Kit0002 persistida

Geração custom0002 exit0, três paths canônicos, hashes principais conferidos: SQLb3cc75fa802f8a5b333c480eb0d77f3d2185602e108f36fb33d3ade3c6939413; snapshot3a0ac248015367c52083c016f9782f25d15956f0f80f1fe321ba7d978dda4838; journal65f5412864bbf10d80418d961efa98b21b738d3169c82b4dd90813751dba77d5. Idx2when1790905339345 server_owned_access, idx0/1 preservados. ACK34; nenhum SQLaplicado.

### D2 — assignment35 segurança e inversa

Database revisão6 RF03/04/05 CA04/05/06/07/08 RulesDatabase/security/migrations, três paths: apps/server/src/database/drizzle/migrations/0002_server_owned_access.sql, apps/server/src/database/drizzle/rollback/0002_server_owned_access.sql e apps/server/src/database/drizzle/legacy-schema-manifest.json (extensão mesmo ownershipD1). Construir transformação exata de acesso do manifest e inversa, preservando estrutura/legacycatalog/sourcehash. Retirar29policies próprias, desligarRLS public, revogar anon/authenticated/PUBLIC sobre objetos próprios e defaultprivileges owners reais, preservar internosAuth/infraCron/storage desconhecido. Manifest fases separado legacy/adopted/server-owned, sem inventar catálogo. Verificar transitividade de memberships/views/functions outroschemas conhecidos; se objeto exposto não representado, reportar blocker antes de mutar limpeza/ampliarContract. Sem metadataKit/script/DB/legacyremoval. Reporte diff/hash/semântica defaults e pareACK35 antesdeensaios.

### Coordenação — detectores globais checkpoint concluídos

Checkcode/types/unit raiz passaram exit0; unit5workspaces2m3.101s, types7workspaces1m44.434s. Snapshot25ports/barrels e formatter validados compilação/unit; SQLsecurity/runtime/review ainda pending. SourceTS próximo runner poderá ser ativado depoisACK35.

### Review coordination — script C0 e formatter ACH20

Reutilizar reviewer estável read-only para diff delimitado apps/server/package.json (somente linha db:generate vsC0aceito) e biome.json (override exatometaJSON), rev6 S2/S6 RF05 CA04/20/22, basefrozen. Exits rootcode/types/unit passaram; bytes Kit preservados hashesatuais. Não incluir SQLsecurity em preparo, SDKcleanupfuturo ou concluir C0/finalfeature por esse aceite. Reviewer não muta docs/source.

### D2 — complemento35 auditoria clone read-only

Manifest atual limita functions/views ao public; verificação de outroschemas requer consulta real. Assignment Database35 permite leitura pg_proc/pg_views/dependencies/ACL/memberships no clone isolado stardust-drizzle-d1-replay, sem source mutation até diagnóstico, sem DDL/reset/SQLforward/remoto. Se objeto de aplicação exposto fora do manifest for encontrado, parar e registrar para amendment; não limpar desconhecido.

### Coordenação — reviewer indisponível nesta rodada

Followup e message ao reviewer coordination retornaram agent thread limit reached. Não criar replacement nem usar outro par para simular aceite; revisão permanece pending. Builder Database read-only35 segue progresso independente. Retentar reviewer estável após conclusão da rodada Database.

### D2 — auditoria35 read-only confirmada, ACK diagnóstico

Builder auditou67functions externos (auth3/extensions57/graphql_public1/pgbouncer1/vault5),3views externos, zero dependências públicas ou memberships anon/authenticated. Principal consulta própria read-only no clone confirmou dependências0/memberships0 e wrappergraphql semconsultaapp; contagem por schema confirma67 (primeiro filtro LIKE excluía pgbouncer, refinado regexliteralpg_). Nenhum appobjeto desconhecido reportado; assignment35 original3paths agora liberada para SQLforward/inversa/manifestphases.

### Coordenação — estado atual C0 reconciliado

Tabela/card C0 agora in_progress para novo db:generate e review tooling pendente. Aceite anterior das dependências continua válido para prerequisites D1/D2/S1; reabertura não declara dependências históricas desfeitas. Fechamento do novo diff exige reviewer indisponível atual, antes conclusão integrada.

### D2 — mutation35 security persistida

Forward199statements/inverse671statements/manifestphases em três paths autorizados. Hashes conferidos: forward27f54c26b1a27c8e8172945652f57ff15d9172e23e6ed752d09537e80769bf66; inverseed6774f30c69ae9de8590b7b85d40b20193b80bbf9e79c3365e6b5e731d73f9e; manifest3f239d1da7f6c0abaa6841c73526fbbecd9de8a1df5131d16c9a37e8ecabffb4. Legacy structure/sourcehash semanticamente preservados, phasefinal639relationgrants/42functiongrants/0policies/RLSfalse/defaultACL1ownerfunction. ACK35; nunca aplicadoSQL ainda.

### D2 — assignment36 scripts operacionais

Builder Database revisão6 RF03/04/05 CA04/05/06/07/08/20/22, RulesDatabase/migrations/code/serverapplication, somente scripts/check-drizzle-transition.mjs, scripts/adopt-drizzle-baseline.mjs e apps/server/scripts/migrate-database.ts. Implementar TransitionOptions/exports literais S2, catálogo comparado porphase/hash/ledger com failclosed e conexão exclusivamenteprocess SUPABASE_DATABASE_URL; localguardloopback. Mesma advisorysessionlock dedicada e mesma conexão/reserved real em migrate/adopt/rollback, backend session identity e fechamento finally, timeout/liberação. readMigrationFiles público0.45.3; adopted marca somente0000/1semDDL; migrate usa APIORM comledgerdrizzle/__drizzle_migrations; inversa+removerapenas0002transaçãohashvalidado. Paths/cwdresolvidosraiz, sem boot/reset/seed/force/driftcleanup/casts mascarandoconexão. Reporte bounded trêsfiles e pareACK36 antestests/DB/sensors/legacydelete. Scripts operacionais testes em lote posterior.

### Coordenação — reviewer retomado e sequencing36

Reviewer coordination followup aceito após Database35 concluir. Assignment36 registrada permanece aguardando slot e followup efetivo; message ao BuilderDatabase retornou threadlimit enquanto reviewer ativo. Nenhuma source36 começou, nenhum aceite Review atribuído ainda. Após verdict retomaremos mesmoBuilder.

### Coordenação — review script/formatter aceito

Reviewer estável accepted, nenhum finding. Script db:generate literal/Kithelp passou independente semgeração; overrideMeta preserva bytes e todasdemaisregras. Globalscode7/types7/unit5 inspectados. C0 completed para snapshot atual, SDKWebfuturecleanupreabre; ACH20resolved. Operational36 pode ser retomado agora com mesmoBuilder.

### D2 — decisões operacionais36 antes de source

Leitura local exata postgres3.4.9 confirma reserve runtime sem begin; typings não provamcompatibilidade. S2 exige conexão dedicada, não APIreserve específica. Autorizar pool operacional exclusivo max1 semidle/lifetime expiração e guardfailclosed de perda de sessão antes de qualquer SQLwire, samebackendPID normal, onclose invalidandooperação e APIpública debug hook semlogs quando preciso bloquear queued/reconnect. Não basta verificar PID somente depois de writes; teste realconnectionloss deve provar zero writes novos/timeout/release. MigratorORM segue nessa mesma conexão única. Se APIs não garantirem rejeição segura, reportar antes de implementar fallback/cast. Source ainda aguardaretomada.

### Ambiente manual — credenciais disponíveis

Consulta segura somente nomes/presença encontrou quatrovariáveis Web/Studio agora configuradas em root.env.local; principal nãoalterouarquivo. Gate de credenciais dasVM pode progredir quandostack estiverpronto. ONBOARDING_RECEIPT_SECRET e SUPABASE_DATABASE_URL ainda ausentes; DBURLderivaçãoRoot autorizada peloexportC1, secret ainda deve ser configurado antesruntime.

### Ambiente — configuração receiptsecret solicitada

Missinginfo solicitada ao usuário: configurar ONBOARDING_RECEIPT_SECRET root.env.local e confirmarpronto, nunca enviarvalor. SpecS6 impedeagenteeditar.envlocal; quatrocredsE2Epresentes. Não bloquear scripts/banco independentes; runtimeServer/onboardingaguardaENVválido.

### D2 — parity estática após manifestphases

Helpermetadata principal rerodado como diagnóstico após extensão35:39tables/220columns/7enums/117constraints/13indexes standalone/24sourcehash, errors[] exit0. Confirmaestruturaoriginalmodels/sourcehashpreservada, não aplicaçãoSQL. Preflight renovado exit1 expectedporfuturasphases; próximosensoroperacional depois36.

### D2 — mutation36 scripts persistida

Três scripts canônicos criados, format exit0 Fixed3:checktransition/adoptbaseline/migratedatabase. Guardsphases/catalog/ledger/hashes/24versionsnames/externaldeps/memberships; pool exclusivo1expiryoff/debugno-log sessionlossguard/PID, commonlockkey7531462901845273 timeout10s. Adopt sóduasledgerentries transacional; migrateAPIDrizzlemesmoclient/ledgerexplícito; rollbackhashpinned+inversa+delete0002+parityadopted transação. ACK36; nenhumDB/sensortests executadosBuilder.

### D2 — sensores operational e complexity falharam

Servercode operational passou; tiposoperational falhou TS7006 parâmetros client/assertSession do callback runner semtipo atravéshelperJS. ACH22 autorizado correção JSDoc contextual em check-drizzle-transition.mjs e/ou annotations tipo realSql no runner, sem any/cast. Complexitydiagnóstico falhou8functions novos em7paths Drizzle, ACH23 aberto; helpers internos coesos futuros sem mudarcontract/threshold/baseline. Primeiro corrigirtypes37, depoiscomplexity38, tests/ensaiosoperational sequência.

### D2 — assignment37 types helper operacional

Database rev6 RF05/RF12 CA04/06/20/22 RulesCode/Database, somente scripts/check-drizzle-transition.mjs e apps/server/scripts/migrate-database.ts, corrigir contextual callbacktypes usando postgres.Sql real e Promise<void> assertion/genericreturnedoperation porJSDoc/annotation, semany/cast/APIchange. Não alterarsecurity/SQL/repositories/tests neste lote. Reportar diff/format e pararACK37. Depois typeofficial e assignment38 complexity.

### C0 — assignment ligação CLI operacional

Taskprincipal revisão6 RF05 CA04/05/06/20/22 RulesTooling/Code, exclusivo apps/server/package.json: db:migrate passa tsx scripts/migrate-database.ts, db:preflight node ../../scripts/check-drizzle-transition.mjs e db:adopt node ../../scripts/adopt-drizzle-baseline.mjs. Paths agora existem; não modificar db:test/legacyaliases/deps/lock nesta mutation. C0 reaberto para diffnovo que reviewercoordination avaliará após testes reais. Exits JSONválido e ensaioscli37+. NenhumaoperaçãoDB nestelote.

### D2 — mutation37 types persistida

Somente check-drizzle-transition.mjs alterado: JSDoc templateT/contextoperationPostgres.Sql/assertPromisevoid/options/return; runnerformatsembytechange. Format exit0/noany/cast/behaviorchange. ACK37, typesnovoantescomplexity38.

### C0 — mutation CLI persistida

apps/server/package.json db:migrate/preflight/adopt ligados aos trêsscripts existentes; JSONválido, semlock/deps/dbtest/legacyaliases changes. C0 in_progress para esse diffnovo; ensinoruntimefuture ainda pending.

### D2 — assignment38 preparada complexidade

Após types37pass, Database revisão6 RF01/02/05/12 CA01/02/03/06/20/22 RulesDatabase/Code/complexity, somente6paths: drizzle/mappers/profile/DrizzleUserMapper.ts, mappers/reporting/DrizzleFeedbackReportMapper.ts, repositories/challenging/DrizzleChallengesRepository.ts, repositories/profile/DrizzleUsersRepository.ts, repositories/reporting/DrizzleFeedbackMessagesRepository.ts e DrizzleFeedbackReportsRepository.ts, todos sob apps/server/src/database. Refatorar oito funções assinaladas em helpers privados coesos e inferidos, mantendo mesmoSQL/joins/owner/lock/atomicidade/contagens/paginação/DTO/Core. Sem Nplus1, snapshotsplaceholder, casts, novospaths ou threshold/baselinechanges. Lote38 somente essespaths, reporte/provaformat/diffsemântico e pareACK; sensorcomplexitynovo/code/types antesensaios.

### D2 — typesoperational37 passaram, 38 ativa

Checktypes Server exit0, /tmp/stardust-drizzle-d2-types-operational-current.log. HelpersJS contextualrealSql agora compilamrunner semany/cast. Assignment38 seispaths ativada; correçõescomplexity futurasinvalidamrepositorytypesnapshot para novo sensor.

### D2 — diagnóstico preflight read-only no clone

Principal prepara invocação preflightlegacy somenteleitura no cloneisolado D1 usando proxyTCPloopback efêmero host paraIPcontainer conhecido. URLcredenciais derivadasroot.envlocal emmemória; nãoescrever.env nemexporURL. Catálogo lido semDDL, históricoSupabaseausenteesperado porreplaypsql; diferençasextrasgeramfindings. Independente de refatoraçãoTS38, operacional37sourceestável. NãoaprovarEV03/04 por essediagnóstico.

### D2 — mutation38 complexity persistida

Seispaths autorizados refatorados em helpersprivados inferidos: UserMapperappearance/progress, FeedbackReportMapperauthor, Challengesvisibility/category/completion, Usersprogress/collectionselection mesmosubqueriesumaquery, Messagesassert/insert/attachments transactionreal, ReportssavedValues/summaryquery. Format6exit0 Fixed5. SQL/actor/locks/atomicidade/count/order/offset/DTOsemalteraçãointencional. ACK38, sensoresnovoantesexits.

### D2 — read-only conexão indisponível e runtime alternativo

ProxyTCPclonebridgeIP timeout; CLIpreflight falhougeneric exit1, nenhumcatalogresult/EVpass. Metadata root confirmourootpasswordenvmatch/listen*/port5432, TCPtimeout. Tentativa reutilizarhostNode24 noimagePostgres falhou loaderglibc (imageAlpine); nenhuma mutation/prova atribuída. Imagecachednode22-bookworm-slim executouNode22.23.3, podeconsultarclone emnetworknamespace próprio seminstall/reset/hostports.

### D2 — code/types38 passaram; complexity warn bloqueia

Codeexit0/typesexit0 após38; complexityexit2 semerrors mas201warnings, maxwarnings0 compara baseline oficial. ACH23 nãoresolvido: eliminarwarningsnovos semmudarpolicy/baseline. Rootprepara reportJSONcombaselinematerializadocópia/tmp para localizarregressões, versãooriginalintacta; novaassignmentdelimitada virádepathsreais. Nãointerpretarexit2comopassed.

### D2 — preflightlegacy real confirmou catálogo

Node22.23.3 cachedrunner emnetworkcontainer:D1clone, workspace mountro, root.envlocal memoryURLloopback; checkTransition retornou compatiblefalse somente Legacy migration history differs. Todoscatálogosstructure/access comphaselegacyconcordam; históricoausentefiel ao psqlreplay, nenhumledgerfabricado. SQLwritesnãoexecutados. NovoensaioCLIreplayprepararáhistóricofiel antesadopt.

### D2 — diagnóstico completo de complexity

ReportJSON baselinefiltered contém201functions warning em52pathsDrizzle, principalmenteMaintainabilityIndex abaixo65 alémmétricaswarn. Oitoerrorsoriginais sumiram mas CI exige zerowarningsnovos. ACH23escopo restante excedeseispaths; próximaassignment serádelimitadaporfamíliasapósensaiosoperacionais, comreusohelpers coesos demonstrados, semperderguard/SQLatomicidade/shape e sem alterarbases. Contagem atual énovospaths, não legadowarningsaceitáveis.

### D2 — assignment39 testes operacionais antes warningrefactor

Database revisão6 RF03/04/05 CA04/05/06/07/08/20/22 RulesDatabase/migrations/code/testintegrity, somente scripts/tests/check-drizzle-transition.test.mjs e scripts/tests/adopt-drizzle-baseline.test.mjs. Criar testes meaningful dos scripts reais, sem mockSQL/ORM/migrator/catálogo: root.envlocal loadcredsmemory, ownedcloneDockerlocalisolado bootstrapknowninfra e CLIlegacyreplayreal24antesadopt, empty migrate/no-op, preservaGuidefixture/count, phase/hash/partialledger/drift/unknownobject failsno-write, concurrency same-session-lock/PID timeout/signal/loss/release, rollbackhash/inverse/data/ledger0000/1/no-op/remigrate, SQLrolesbloqueadas/internalAuthneeded preservados. Sem skip/test.only/envcredentialsfixtures-hardcoded/novahelperpath/sourceopschanges. Bootstrapfixture pode usar funcs internas nestes2files, artifacts/tmpowned. Tests devem lidar hostDockerbridgeinacessível via publishedloopback ou runnercachedNode22.23.3 networknamespace sepreciso; nenhum unrelatedcontainer/remote/reset. Neste lote escrevertestsource APENAS; não iniciarDB/run atéACK39. ACH23warn201mantidoaberto parafixfamíliasposterior, nãoexcluirsource oubaseline.

### D2 — mutation 39 e correction assignment 40
Mutation 39 recebida: somente `scripts/tests/check-drizzle-transition.test.mjs` e `scripts/tests/adopt-drizzle-baseline.test.mjs`; seis cenários operacionais reais escritos e formatados, ainda não executados. RF03/04/05; CA04/05/06/07/08/20/22; revisão 6. Estado `in_progress`.
Assignment 40: Builder Database, mesmos dois paths, source-only. Corrigir bootstrap para não depender do container efêmero D1 e garantir cleanup de todos os runners próprios por identidade/label antes do banco. Usar infraestrutura reproduzível versionada/imagem, sem mocks, skips, novos paths, alteração operacional ou execução SQL. Rules Database, migrations e test-integrity mantidas. Exit: relatório exato e ACK antes de execução; depois definição, conformance e testes reais. CI C1 deve disponibilizar o commit-base para replay Git congelado.

### D2 — gates assignment40
Spec definition e Plan definition oficiais exit0. Conformance39 exit1, esperado enquanto paths futuros S2/W2/C1/D3 continuam pendentes; log `/tmp/stardust-drizzle-conformance-39.log`. Assignment40 ativada após gates; nenhuma execução operacional autorizada antes ACK40.

### D2 — mutation40 persistida e ensaio operacional autorizado
Builder reportou correção somente em `scripts/tests/check-drizzle-transition.test.mjs`: bootstrap imagem fixada + roles/storage versionados, sem clone efêmero; runners nomeados/label próprio com cleanup antes DB. Segundo test file intacto. Format reportado exit0, nenhum runtime executado. Revisão6 RF03/04/05 CA04/05/06/07/08/20/22, estado in_progress. ACK40 registrado. Próxima ação principal: conformance atual, executar Node --test nos dois paths, clones Docker próprios locais/env raiz apenas em memória, sem tocar stack/containers de terceiros. Qualquer falha será finding e correção delimitada antes de rerun.

### D2 — ensaio40 falhou; assignment41 diagnóstico
Node24 --test dos dois arquivos exit1: 0/6 cenários passaram; replay CLI legado e migrate vazio retornaram1 antes dos critérios posteriores. Log `/tmp/stardust-drizzle-operational-tests-40.log`. Não inferir defeito de permissões ou rollback ainda. Assignment41 Builder Database: diagnóstico read-only dos resultados e reprodução em clones próprios; sem source operacional/SQL contratado. Pode alterar somente os mesmos dois tests para diagnóstico sanitizado e corrigir bootstrap factual após report/ACK de cada mudança; sem mocks/skip/credenciais persistidas, sem baseline alterado. Rules e RF/CA iguais40. Primeiro reportar causa concreta, limpar todos os clones/runners próprios. Estado in_progress.

### D2 — reconciliação findings e gates41
Tabela central Evaluation atualizada ACH23 para201warnings/52paths e ACH24 ensaio0/6; lessons No change registradas. Definição Spec/Plan oficiais exit0 antes correction41. Cleanup oficial `docker ps -a --filter label=stardust.drizzle.operational-test` vazio. Próxima ação diagnóstico Database, sem mudança contratual.

### D2 — diagnóstico41 bootstrap factual
Builder reproduziu clone próprio read-only após bootstrap: imagem fresca preserva96defaultACL e32storage.objects grants, sete extensões; manifesto local congelado exige zero/defaults, oito grants storage e oito extensões (pgaudit ausente). Memberships21 coincidem, objetos app vazios. Migrate recusa estado conforme guard; problema identificado no setup de testes, não autoriza relaxar preflight/manifest. Preparação corrigida deve derivar reset/infra versionados e bootstrap real; investigação CLI separada ainda em curso. Nenhum source editado ou Drizzle aplicado neste diagnóstico; cleanup reportado.

### D2 — complemento assignment41 bootstrap semântico
Diagnóstico reportou imagem pg_isready socket pode observar servidor temporário de init; fixture deve aguardar TCP final. Correção test-only autorizada: pgaudit real; storage compatibility criada admin e ownership postgres explícito (evita defaults herdados ao CREATE por postgres); normalizar somente defaultACL schema public dos owners postgres/supabase_admin/grantees concretamente observados, preservando global e infraestrutura Auth/storage. Sem fake catálogo, sem alteração manifesto/op scripts. CLI falha antes migration com failed-connect, investigação ainda aberta. Reportar mutation e aguardar ACK antes ensaio oficial.

### D2 — mutation41 persistida, ACK e rerun
Somente helper `scripts/tests/check-drizzle-transition.test.mjs` alterado: readiness TCP final, pgaudit real, defaultACL somente public dos dois owners conhecidos normalizada semanticamente, storage criada admin/owner postgres; diagnóstico allowlist seguro. Segundo test file intacto, format reportado exit0. RF03/04/05 CA04/05/06/07/08/20/22, revisão6; ACK41 source registrado. Próxima ação conformance e Node --test oficial; CLI failed-connect permanece não resolvida até ensaio.

### D2 — ensaio41 falhou; diagnóstico42 read-only
Rerun oficial Node24 dos dois tests exit1,0/6: bootstrap42 não declarado aceito, migrate inicial e CLI continuam1. Logs `/tmp/stardust-drizzle-operational-tests-41.log`, conformance41exit1futurepaths. Assignment42 diagnóstico read-only com helper atual/clones próprios: inspecionar somente JSON name/code/knownMessage sanitizado já capturado, catálogo agregado/guard vazio e causaCLI safeflags; sem source edits. Reportar causa concreta para próxima correction assignment. Rules/RFCA revision6 herdados41, cleanup obrigatório.

### D2 — ACH25 routines e assignment43
Diagnóstico42 factual: bootstrap atual corresponde guardempty (8ext/0defaults/8storageACL/21memberships/zeroobjects), migrate falha SQLSTATE42809. Catálogo tem nove PROCEDURES entre40routines, customSQL usa ALTER FUNCTION e ACL ON FUNCTION incorretamente. ACH25 correction Database, revisão6 RF03/04 CA04/05/07/08: somente migrations/0001_application_objects.sql, migrations/0002_server_owned_access.sql, rollback/0002_server_owned_access.sql sob apps/server/src/database/drizzle e apps/server/scripts/migrate-database.ts para hash inversa. Usar ALTER PROCEDURE para kindp e ACL ON ROUTINE preservando signatures/owners/grants; nenhum journal/snapshot0000/meta/manual alteration ou manifest changes. Fontecatalog authoritykind correto. Source-only, reporte hashes/counts e pare ACK43; scripts/SQL/tests/autrespaths proibidos. Definition gates42 oficiais passaram. CLIfailure diagnóstico separado depois correction.

### D2 — findings25 centrais reconciliados
Evaluation Findings/Lessons agora registra ACH25 com tipo real routines e dispositionNochange, ACH24 atualizado bootstrap guardexato/CLI ainda pendente. Nenhum sensor/SQL novo; source43 em execução após assignment.

### D2 — mutation43 SQL routines persistida e ACK
Exatos quatro paths43 alterados: nove ALTER PROCEDURE owners, ACLs ON ROUTINE para40signatures (0001 126statements,0002 40revokes,inverse44grants). Default privileges ON FUNCTIONS permanecem gramática correta. MetadataKit/manifest/tests intactos. Hash0001 f4fdda9957999133093ebe0880e9ed1d2b4227e7ee67a8e345af70d5454260b6;0002 6b7f7d3c813516173bbc006223d462d0fcba12524f80e533243166a283c91426; inverse6254d526ff5e66f72b2f1726007ea4babb8c21ed24b2102171600655b40f0c19, runner pinned correspondente. ACK43 registrado; conformance e rerun oficial necessários antes aceiteACH25. Nenhum SQL aplicado neste43.

### D2 — ensaio43 failed e assignment44 diagnóstico
Rerun43 Node --test exit1,0/6 early failures persistem apósroutineSQLfix; source43 nãoaceitaACH25 atédiagnóstico real. CLI code conhecido LegacyDbConnectError, erro independente. Assignment44 Database READONLY: mesmoshelpers/clones próprios bootstrapatual, invokemigrate extrairsomenteJSON name/code/knownMessage/catálogo agregado; investigarCLI shim/binário/connection safeenum. Nenhuma fonteeditada ouexpectedrelaxed. Três rounds0/6 mas autoridades/código ainda permitem investigação concreta, não requer decisão produto. Conformance43exit1futurepaths, cleanup verificarprincipal.

### D2 — diagnóstico44 forward SQL avançou
Builder diagnóstico real atual:0000/1/2 aplicamsemSQLerror,39tables/40routines/3ledger; runnerrecusa parityfinal somentecolumns. Demais catálogo/grants/defaults correspondemreportado:117constraints/67indexes/7views/639relationACL/42routineACL/defaultownerpostgres1. Nãoéexitaceito; contraste220columnscausaconcretaem investigação, possívelposiçãofísica legadocomholes. Rawmanifestcongelado nãoalterar, order/type/default/null nuncaignorar. CLIseparadoaindapendente. Clonesdiagnósticosautocleanupreportado.

### D2 — ACH26 ordinal e assignment45
Delta44 real:220columns idênticas em nomes/tipos/null/default/identity/generated e ordemrelativa; somente rockets trêspositions divergem (5/6/7 atual vs6/7/8 legado), slotattnum5 removido legado. Physicalholes não representam coluna nem alteração de ordem. Assignment45 Database revision6 RF03 CA04/05/06: somente scripts/check-drizzle-transition.mjs, normalizar positions densas por tabela em BOTH expectedcaptured e actualcatalog para comparação semântica, preservando todosdemaisfields/order e rawmanifest/sourcehash. NenhumaSQL/model/metadata/test/opotherpathalteration. Helperscoesos tipados sem any/casts/ignore; source-only report/ACK antesfocusedempty. RulesDatabase/catalogcontracts. ACH26 blocoparity mantém inprogress atéteste.

### D2 — mutation45 ordinal persistida e ACK
Único check-drizzle-transition.mjs helper privado normalizeColumnOrdinals com JSDocRecord tipado, contadorMap por table e ordemarray; compara BOTHlive/expected somente columns. Preserva rawmanifest,220campos,ordem/tipos/defaults/null/identity/generated, todosoutroscátalogos. Format reportado exit0Fixed1. ACK45 source registrado antesconformance/focusedempty. RF03CA04/05/06 pendingruntime.

### D2 — focusedempty45 passed
Oficial node24 --test --test-name-pattern='empty migrate' scripts/tests/check-drizzle-transition.test.mjs exit0:1test/1passed/zero skipped,11.423s. Log `/tmp/stardust-drizzle-empty-test-45.log`. Migrateschema final/parity/noop/no-seed eSQLroles/Authcase aprovados somente nesteescopo; DataAPI/HTTP/restauraçãolegado ainda pending. Próximo focusedrollback ephase/hash/lock nosclonesisolados; SQL3+helper45 source estável.

### D2 — rollback45 passed (2026-10-02)
Oficial focusedrollback45 exit0:1/1passed/0skip,17.341s. Hash inválido rejeitado semwrite, inverse/grants/defaultACLrestaurados, dados preservados,ledgerapenas0000/1,no-oprollback/remigrateparity comprovados pelo teste. Log `/tmp/stardust-drizzle-rollback-test-45.log`. Phase/drift test passou isoladorelatoTAP, combinedsession47063 lockaindarunning; exitfinalaindapendente. Evaluationdataatualizada02outubro.

### D2 — phase/hash/lock45 passed e assignment46 CLI
Oficial combinedfocused45 exit0:2/2passed/0skip; phase/hash/partial/unknownobject rejectionnowrite e locktimeout/signal/loss/no-reconnectwrite/unlock/freshretry testadosreais. Log `/tmp/stardust-drizzle-phase-lock-tests-45.log`. Cleanup `docker ps --filter label=stardust.drizzle.operational-test` vazio. Assignment46 Database READONLY: diagnosticar CLI LegacyDbConnectError em ownclone/helperscurrent, root.envmemory/cachedNode22; nenhuma sourceedição, sem historiesfabricadas/skip, reportar causesafeENUM. Rev6RF03CA05/06/20 RulesDBmigrations/testintegrity. Principal sensorscode/types atuais45 em paralelo somente sourceimutável.

### D2 — reconciliação25/26 e sensores45
Evaluationtabelasfindings atualizadas SQL/ordinal comfocusedpasses45 e review/typespendentes. Code/typesServer45 iniciadossourceestável; CLI46readonlyindependente permitido. Rawlegacyartefatospreservados.

### D2 — code/integrity45 passed
Server check:code45 exit0,946files20warnings legados; root check:test-integrity45 exit0. Logs `/tmp/stardust-drizzle-d2-code-45.log` e `/tmp/stardust-drizzle-test-integrity-45.log`. Types45 session12712 ainda running; complexity201warnings continuaACH23aberto. Nenhumsource novo.

### D2 — types45 passed
Servertypes45 tsc--noEmit exit0, helperordinalJSDocreal reconhecido. Log `/tmp/stardust-drizzle-d2-types-45.log`. Sourcefresh45 code/types/integrityfocusedoperational4passed; CLIlegacy2pending, complexitywarnings201pending, reviewD2pendente.

### D2 — causa CLI ACH24 e assignment47
Diagnóstico46 em clone próprio: URL loopback sem sslmode causou LegacyDbConnectError. A mesma URL derivada em memória com sslmode=disable permitiu à CLI instalada2.110.0 executar24 migrations e criar o histórico real, exit0; binário supabase-go da mesma versão confirmou no-op. Arquivos temporários criados como root causaram EACCES no cleanup pelo host; containers foram limpos e o diretório residual próprio também foi removido.
Assignment47 Database SOURCEONLY: único scripts/tests/check-drizzle-transition.test.mjs, revisão6 RF03 CA05/06/20 RulesDatabase/testintegrity. URL local de fixture com sslmode=disable; cleanup de conteúdo ou permissões via runner próprio rotulado, sem rede, com mount exclusivo do diretório temporário próprio antes rm pelo host. Garantir finally mesmo após falha da CLI. Nenhuma alteração .env, scripts operacionais, SQL, manifesto ou expectations. Reportar mutation/ACK47 antes rodada completa6. Gates Spec/Plan47 oficiais passaram. Nenhuma configuração TLS remota alterada.

### D2 — registro47 refinado
Registro da causaCLI e assignment47 reescrito em português claro, sem mudar escopo/autoridade. Cleanup46 exclusivo confirmado no relatório; próximo mutation47 source-only aguardado.

### D2 — mutation47 persistida e ACK
Único testhelper alterado: URL loopback em memória usa sslmode=disable; cleanup valida tempdir/prefix próprio, runner UUID/label/networknone/mount exclusivo remove conteúdos root/dotfiles, finally remove runner residual e hosttempdir. Nestedfinally runners/DB anterior preservado. Formatreportadoexit0Fixed1. RF03CA05/06/20 rev6; nenhumruntimepósmutation. ACK47 registrado antesconformance/whole6; freshnessfixtureanteriores stale paraensaio completo.

### D2 — whole47 em execução, primeira adoção passou
TAP oficial whole47 já mostra reallegacyCLI/history/populatedadopt/concurrent/idempotence passed31.439s; sessão39069 continua outroscinco, exitroundpending. Nenhum conclusãoD2antesexitfinal/reviewer. Fonteimutável47.

### D2 — whole47 passed e próxima complexidade
Node24 --test doisfiles oficial exit0:6/6passed,0skip,105.473s. TodoscenárioslegacyCLI/adopt/drift/rollback/empty/lockpassed. Log `/tmp/stardust-drizzle-operational-tests-47.log`. CA04/05locais eEV03reconciliados no Evaluation; restanteEV03concorrência cruzada/remotopendente, CA07DataAPI/HTTPeCA08stackinfrareviewpendentes. Próximaassignment48read-onlyDatabase planejar correção201warnings/52paths sembaseline/threshold/linecompression; nenhuma sourceeditantesassignmentexata. ScriptsSQLsourceimutáveis parafreshpass47.

### D2 — integrity47 e definição48 passed
Root test-integrity current47 exit0; Spec/Plandefinition48exit0. Logs `/tmp/stardust-drizzle-test-integrity-47.log`, `/tmp/stardust-drizzle-spec-definition-48.log`, `/tmp/stardust-drizzle-plan-definition-48.log`. Whole47 código/migrationfontes estáveis, assignment48read-only nãoinvalidaensaios. Próxima mutationwarnings exigirá scope/gates novos.

### D2 — assignment49 fundações de complexidade
BuilderDatabase, revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity. Exatos dois paths: apps/server/src/database/drizzle/DrizzleClient.ts e DrizzleRepository.ts. Client estado único coeso singleton (pool/connection/url/shutdown), configuração e shutdown separados, closeawait/finally; preservar aliasConnection|Transaction/poolúnico10/timeouts/signals/reusomesmaURL/rejectURLdiferente. Fechamento concorrente idempotente sem abrirpoolsegundoenquantoencerrando. Repository execução genérica protegida central para remover duplicação run nas futurasfamílias, sem colisão com private run atuais; classificação causal SQLSTATE23505/AppError separada e cycle-safe, errosemsegredos. NenhumaAPI Core/casts/novopath oubaseline/threshold/linecompressgaming. Source-only report eACK49 antes sensor; runtimeSQL47fontes intactos, tiposevidênciadependentesstale49. Próximo49conformance/code/types/complexity diagnóstico.

### Coordenação — estado resumido atualizado
Plan updated_at02outubro e faseatual reconciliada: C0depaccepted/wiringreviewpending, D2seistestsoperacionaispass/complexityreviewpending. Nenhumsourcechange; header não declara faseconcluída.

### D2 — mutation49 persistida e ACK
Doispaths DrizzleClient.ts/DrizzleRepository.ts alterados: singletonestado coeso pool/connURL, configuração/shutdown separados, Promiseclose compartilhada e create/get duranteclose impedidos; executeQuery<T> protegido eclassificaçãocausescycle-safe/error23505/AppError sanitizada. Formatreportadoexit0. RF01/02 CA01/02/03/20/22 rev6; nenhumaDB/sensor49. ACK49 antes conformance/code/types/complexity. Client/repo anteriores stale; scripts47intactos6passfresh.

### D2 — sensores49 codepassed/complexityfailed
Servercode49 exit0. Complexity49 exit2:200warnings/0errors/2415functions, anterior201warnings; doispaths nãoaceitos porredução1apenas. Log `/tmp/stardust-drizzle-d2-complexity-49.log`, types49running. Próximadiagnóstico métricasfundação específico para correção delimitada sembaseline/threshold/gaming.

### D2 — assignment50 finalização fundações warnings
Dois warnings residuais49: Client.close MI61.5 e Repository.hasConstraintConflict MI63.3, demaisfoundationpassed. BuilderDatabase assignment50 source-only mesmos2paths rev6RF01/02CA01/02/03/20/22 RulesDB/complexity. Separar closeidempotente da operaçãoend/cleanupstate ciclo devida; separar classificaçãoSQLSTATEdeum nó da travessia causalcycle-safe. Helperscoesos privados/protectedsemnovaport/casts/threshold/gaming. Preservarpromiseidenticalconcurrentclose/max1pool/guardaURL/signals; AppError23505/causes sanitizados. Reporte eACK50antescode/types/complexity, famíliasproibidas. Sem alterar scriptsSQL47.

### D2 — types49 e gates50 passed
Servertypes49exit0 (session13426completed), code49exit0; gatesSpec/Plan50exit0. Mutation50sourceenquantoapenasmesmosfundamentosautorizados. Complexity49errors0warnings200permanecefailed; scripts47freshpass.

### D2 — mutation50 persistida e ACK
Somente Client/Repository: close idempotente comPromiseshared delegaend({timeout5})/cleanup ao endConnection; hasConstraintConflict traverseSetcycle-safe delegaclassificação nó23505 a isConstraintConflict. Config/SIG/URL/AppError/SQLfamíliasinalterados. Formatreportadoexit0. ACK50antesconformance/detectores; fundações49codes/types/metricsstale. Source-onlysemDB; próximaofficialsensors50.

### D2 — preparação51 read-only durante detectores50
BuilderDatabase pode planejar lote auth/manual/shop, mappers/repos e grupossemânticosidentity/comércio/ownership/querymapping com reusoexecuteQuery, paths exatos a reportar. Somente read-only, nenhuma source/DBmutation51 enquanto detectoresglobais50ativos. Source51posterior exige assignment/gates/ACK explicitamente. Scripts47fontes seguemintactos.

### D2 — codeglobal50 passed, complexity199failed
Globalcode50 exit0; Servercomplexity50 exit2/199warnings0errors. Clienttodasfunçõessemwarning; RepositoryhasConstraintConflict aindaMI64, únicaresidualfoundation. Types/unitglobais50running. Nenhuma mutation51/52 ainda; preciso queryerrorboundarynodeeligibility/traversecoesão antesmappers. Logs `/tmp/stardust-drizzle-global-code-50.log`, `/tmp/stardust-drizzle-d2-complexity-50.log`. Nãoatualizarbaseline.

### D2 — tipos globais50 aprovados
`npm run check:types` oficial exit0: sete workspaces, 2m24.693s. Log `/tmp/stardust-drizzle-global-types-50.log`. Código global também aprovado; unitários globais ainda em execução na sessão54332. Nenhuma alteração de fonte permitida até registrar o resultado final e ativar o próximo lote.

### D2 — unitários globais50 aprovados
`npm run test:unit` oficial exit0:5/5 tasks, 2m46.758s; Server168 suites/325 testes. Log `/tmp/stardust-drizzle-global-unit-50.log`. Código/tipos/unitários globais agora aprovados na fonte50; composição ainda legada, não prova os25 adapters Drizzle em runtime. Próximo lote depende de proposta51 e assignment52; complexidade199 bloqueante.

### D2 — assignment52 travessia de erros
BuilderDatabase, revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity. Único path apps/server/src/database/drizzle/DrizzleRepository.ts. Type guard privado isUnvisitedError(error:unknown,visited:Set<unknown>):error is object separa elegibilidade estrutural/ciclo da travessia causal. Preservar Set, SQLSTATE23505, recursão por cause, prioridade AppError raiz e fallback sanitizado. Sem Client, SQL, famílias, casts, nova API pública, policy/baseline ou compressão artificial. Source-only; reportar e parar para ACK52 antes sensores. Foundation warningMI64 permanece bloqueante até resultado oficial.

### C0 — re-review dos comandos operacionais
ReviewerCoordenação pareado C0, read-only, revisão6 RF05/10/12 CA20/22. Escopo exclusivo novo wiring db:migrate/db:preflight/db:adopt em apps/server/package.json; db:generate/dependências/biomeoverride já aceitos e não modificados. Validar executáveis/paths/repasseargs e ausência de CLI legado nesses novos comandos, sem exigir cleanupC1 ainda pendente ou editar fonte. Evidências atuais: whole scripts47 6/6, detectores globais50 todos exit0; conformance geral exit1 por fases futuras. Fonte de scripts auxiliar somente contexto, owned D2 não deve receber veredito paralelo por C0. Ativação pode aguardar slot de agentes.

### D2 — mutation52 persistida e ACK
Único DrizzleRepository.ts mudou: type guard privado de nó object ainda não visitado; travessia mantém Set/causes/23505 e conversão sanitizada/AppError. Format reportado exit0. RF01/02CA01/02/03/20/22 revisão6. ACK52 registrado antes sensores; base50 code/types/unit/complexity stale para path. Client/SQL/famílias intactos. ReviewerCoordenação C0 ativo read-only em manifesto independente.

### D2 — preparação53 read-only de família
BuilderDatabase pode planejar próximo lote auth/manual/shop: cinco mappers DrizzleApiKeyMapper, DrizzleGuideMapper, DrizzleAvatarMapper, DrizzleInsigniaMapper, DrizzleRocketMapper e cinco repositories DrizzleApiKeysRepository, DrizzleGuidesRepository, DrizzleAvatarsRepository, DrizzleInsigniasRepository, DrizzleRocketsRepository nos respectivos paths Drizzle já contratados. Read-only; propor responsabilidades coesas, reusoexecuteQuery e query/mapping, sem edição/runtime enquanto sensores52 rodam. Assignment de source virá com paths completos e gates novos; sem nova API/paths/threshold/casts/gaming.

### C0 — wiring aceito; D2 métricas52
ReviewerCoordenação accepted novo wiring de três comandos, sem findings bloqueantes; revisou paths/args/evidências scripts47 e globais50 sem executar entrypoints. C0 completed no escopo, card/tabela/header reconciliados; C1/integração continuam pendentes. Observação do reviewer: --help não tratado pode seguir operação, registrar ACH27 D2 para guard CLI antes fechamento. Complexity52 exit2 com198warnings; Client/Repository fundações sem warnings. Servercode52 exit0; tipos52 resultado registrado após completion.

### D2 — tipos52 passed e assignment54 auth/manual
Servertypes52 oficial exit0. Foundation Client/Repository atual sem warnings; code/types52 passaram, global unit50 permanece histórico para mudança52. Assignment54 BuilderDatabase source-only revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity, exatos quatro paths apps/server/src/database/drizzle/mappers/auth/DrizzleApiKeyMapper.ts, mappers/manual/DrizzleGuideMapper.ts, repositories/auth/DrizzleApiKeysRepository.ts e repositories/manual/DrizzleGuidesRepository.ts. Aplicar proposta53: executeQuery central, findOne SQL com guards/publichash intactos, Guides persistência sequencial dentro mesma transação; mapper grupos coesos identidade/conteúdo/temporal usando Picks de inferidos/DTOs reais. Preservar completa inserção/FK/null/default/ordenação/count/SQLroundtrips/atomicidade. Sem Core/Client/Repositorybase/shop/SQLscripts/newpaths/any/casts/policychanges/gaming. Reportar e ACK54 antes sensores. C0 card corrigido completed.

### D2 — finding CLI27 central registrado
Evaluation Findings/Lessons inclui ACH27 observado pelo ReviewerC0, sem invalidar wiring aceito. Correção de parser/help terá assignment própria e testes reais antes fechamento D2; sem source adicional agora. Assignment54 auth/manual em curso.

### D2 — mutation54 persistida e ACK
Quatro paths auth/manual alterados: run duplicado removido por executeQuery; ApiKeys findOne com guards/publichash exclusivos; Guides findOne mantém order atual e persistGuides tipado DrizzleTransaction com upserts sequenciais mesma tx; mappers agrupam identidade/tempo e conteúdo/categoria/posição por Picks reais. Formatreportadoexit0Fixed4, nenhumruntime54. RF01/02 CA01/02/03/20/22 rev6. ACK54 antes conformance/code/types/complexity; quatrofontes evidênciastale. Client/base/sqlscripts intactos.

### D2 — resultados54 codepassed/190warnings
Servercode54 exit0; complexity54 exit2 com190warnings, 0errors (198antes). ApiKeyMapper agora sem warnings; residual54: Guide.toPersistence MI64, ApiKeys.findOne callback MI64, Guides.persistGuides MI64.5. Types54 ainda em execução. Próxima proposta deve resolver esses três blocos com responsabilidades reais de mapeamento/persistência/resultados, sem baseline/threshold/linegaming. Só após types/gates ativar correção.

### D2 — types54 passed; preparação55 read-only
Servertypes54 exit0, código54 exit0; complexidade190warningsfalha. BuilderDatabase preparação55 read-only dos três residuais auth/manual: Guide.toPersistence, ApiKeys.findOne callback e Guides.persistGuides. Propor coesão de projeção/persistência individual dentro coleção e resultado único de query; se utilidade interna shared DrizzleRepository necessária, reportar justificativa/path antes source assignment. Preservar inferência/guards/seqtx/erros, sem novas APIs Core/casts/policy/linhas comprimidas. Nenhum sensor ativo, mas nenhuma edição55 autorizada.

### D2 — assignment56 resultado único e persistência guia
BuilderDatabase revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity. Exatos quatro paths sob apps/server/src/database/drizzle: DrizzleRepository.ts; mappers/manual/DrizzleGuideMapper.ts; repositories/manual/DrizzleGuidesRepository.ts; repositories/auth/DrizzleApiKeysRepository.ts. Implementar proposta55: writeOrganization agrupando position/category com defaults atuais e Pick inferido; persistGuide individual tipado transaction chamado sequencialmente no mesmo loop/tx; helper protegido findOneResult<Row,Entity> recebendo query async inferida e mapper, executeQuery/primeira linha/null compartilhados. ApiKeys mantém guards/publichash antes lookup, consulta idêntica. Sem casts/newCoreAPI/policy/SQL/newpaths/linegaming. Fonte-only, reportar/ACK56 antes sensores; demais paths proibidos. Helper interno de resultados justificado por reuso25ports e fronteira DB, não repository genérico público.

### D2 — mutation56 persistida e ACK
Quatro paths56 alterados: findOneResult<Row,Entity> protegido agrega query/primeiralinha/null/mapeamento/executeQuery; ApiKeys consulta idêntica com guards prévios; GuideMapper organização position/category Pick/fallback; Guides persistGuide individual no mesmo loop sequencial/DrizzleTransaction. Formatreportadoexit0Fixed1. RF01/02CA01/02/03/20/22rev6, nenhumruntime/sensor. ACK56 antes conformance/code/types/complexity; fontes56stale até resultados. SQLscripts47/fontes loja intactos.

### D2 — resultados56 codepassed/188warnings
Servercode56 exit0; complexity56 exit2 com188warnings,0errors. Base helperfindOneResult/GuideMapper/GuidesRepository agora sem warnings; ApiKeys callbackL48–55 MI64 ainda existe (identificar operação concreta antes nova correção). Tipos56running. Relato anterior chamou callbackfindOne, principal verifica fonte atual para evitar diagnóstico impreciso. Sem sourceadicional.

### D2 — diagnóstico correto56 e preparação57 read-only
Tipos56 oficial exit0. CodeGraph fonte atual confirmou residual ApiKeys callback em findManyByUserId (L48–55), não findOne; registro anterior impreciso é corrigido neste evento, fonte de lookup individual já sem warning. Preparação57 BuilderDatabase read-only: propor separação coesa consulta/lista/mapping de resultado múltiplo para essa operação, preservando ownerguard/userId/activeKeys/DESCcreatedAt. Possível utilidade protegida de mapeamento de linhas no DrizzleRepository precisa justificar reuso25ports e path antes edição. Nenhuma fonte editada nesta57, base/sourceSQL47intactos.

### D2 — assignment58 resultados múltiplos
BuilderDatabase revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity. Source-only exatos dois paths apps/server/src/database/drizzle/DrizzleRepository.ts e repositories/auth/DrizzleApiKeysRepository.ts. Helper protegido findManyResults<Row,Entity> recebe query async inferida e mapper, agrega executeQuery+arraymapping. ApiKeys mantém authorizeOwner antes e consulta idêntica userId/revokedAt IS NULL/createdAt DESC. Reuso de hidratação simples entre25ports, sem substituir count/pagination/transações; nenhum row/query atravessa Core. Sem casts/novas APIs/paths/SQL/outrosdomínios/threshold/baseline/gaming. Reporte/ACK58 antes sensores. Fonte SQL47intacta.

### D2 — mutation58 persistida e ACK
Exatos BaseRepository e ApiKeysRepository alterados: protectedfindManyResults async/query/map inferidos sobexecuteQuery, listagem mantém authorizeOwner/userId/revokedAtnull/DESCcreatedAt e1roundtrip. Formatreportadoexit0; semruntime58. RF01/02CA01/02/03/20/22rev6. ACK58 antes conformance/code/types/complexity; fonte58 invalidaescoposensores. ScriptsSQL47outrosdomíniosintactos.

### D2 — resultados58 código e187warnings
Code58 exit0; complexity58 exit2 com187warnings0errors. Client/Repository/auth/manual completos sem warnings, listagem ApiKeys residual eliminada. Tipos58 ainda running. Próximo lote shop seguirá proposta53 seispaths, após tipos e gates; nenhuma alteração antesassignment59. SourcesSQL47fresh.

### D2 — types58 aprovado e assignment59 shop
Servertypes58 exit0. Assignment59 BuilderDatabase source-only revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity. Exatos seis paths apps/server/src/database/drizzle/mappers/shop/DrizzleAvatarMapper.ts, DrizzleInsigniaMapper.ts, DrizzleRocketMapper.ts; repositories/shop/DrizzleAvatarsRepository.ts, DrizzleInsigniasRepository.ts, DrizzleRocketsRepository.ts. Proposta53: executeQuery/resultado único e plural existentes; separar construção SQL paginada de execução conjunta rows/count, filtros/order/offset/limit/countfallback atuais. Mappers agrupar catálogo comercial e flags seleção/aquisição/classificação por Picks inferidos/DTOs, preservarinsertcompleto/null/default/FKs. GuardswritesGod/system intactos; sem mudarvisibleitems/search/businesscriteria/N+1. Base/auth/manual/SQL/metadata/Core/outrospaths proibidos; semcasts/any/policy/threshold/baseline/gaming. Reporte/ACK59antes sensores.

### D2 — mutation59 persistida, ACK e ACH28
Seis paths shop59 alterados: mappers catálogo/flags por Picks; repositories usam helpersquery/result existentes; listingQuery e rows/count separados Avatar/Rocket, filtrosnullableInsignia/role, ordering/pagination/countfallback/roundtrips e guardsGod/system preservados reportado. Formatreportadoexit0Fixed6, nenhumruntime59. ACK59 antes sensores. ACH28 novo finding: cast role as DrizzleInsigniaRole já estava na implementaçãoDrizzle anterior ao lote; não é alteração pre-task e precisa correção automática por inferência/getter/narrowing real, sem defaults artificiais ou Corechange. Próxima proposta bounded mapperrole apósresultado59; base/SQL intocados.

### D2 — resultados59 e diagnóstico cast28
Code59 exit0; complexity59 exit2 com179warnings0errors (187antes). Mappersshop/InsigniasRepo agora semwarnings; Avatar/Rocket ainda findMany/callback/listingQuery. CodeGraph confirmou CoreInsignia.role é InsigniaRole validado comvalue 'engineer'|'god', idêntico ao enum inferido SQL. Cast emMapper é redundante e pode ser removido comimporttype correspondente, sem validação nova/default/alteração runtime. Types59final será registrado apóscompletion. Próxima assignment60 mapper único para ACH28.

### D2 — types59 aprovado e assignment60 ACH28
Servertypes59 exit0. Assignment60 BuilderDatabase source-only revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/types: único apps/server/src/database/drizzle/mappers/shop/DrizzleInsigniaMapper.ts. Remover cast redundante role asDrizzleInsigniaRole e importtype não usado, atribuindo entity.role.value tipado unionCore já validado e idêntico a enumSQL. Sem nova validação/guard/default/helper/Core/model/alias/outros paths, nenhum comportamento JS alterado. Reportar/ACK60 antes sensores; SQL47fresh. Restanteswarn179 seguemACH23.

### D2 — mutation60 persistida e ACK
Único InsigniaMapper alterado: cast/import redundantes removidos, role typedCoreunion direto. NenhumJSbusinesschange/guard/default/outraparagem. ACK60antesconformance/code/types; ACH28fontecorrigidaawaittypes/review. ScriptsSQL47intactos. Preparação61read-only futura: Avatar/Rocket findMany/callback/listingQuery residuais, propor responsabilidades listingquery/orders/count/results em paths exatos sem edição.

### D2 — diagnóstico61 e finding28 central
Proposta61 read-only Avatar/Rocket: searchFilter, priceOrdering, countQuery, listPage e mapPage coesos, manter duasqueriesPromiseAll/ordenaçãovazia/countfallback. Aggregatecount deve ser inferido via ReturnType/Awaited, não {count:number} manual. SQLorderBy vazio precisará inspeção de SQL gerado. ACH28 central/lesson Nochange adicionados. Source60sensorresults capturados, próximoassignment62 só após resultadosexit.

### D2 — code/types60 passed e assignment62 shop page
Servercode/types60 exit0; cast removido compila sem nenhumaassertion. Assignment62 BuilderDatabase source-only revisão6 RF01/02 CA01/02/03/20/22 RulesDatabase/code/complexity, exatos apps/server/src/database/drizzle/repositories/shop/DrizzleAvatarsRepository.ts e DrizzleRocketsRepository.ts. Plano61: searchFilter/priceOrdering/listingQuery/countQuery/listPage/mapPage separados, findManydelegação. Rows $inferSelect/aliasderivados; countaggregate EXCLUSIVAMENTE Awaited/ReturnType de query real, nunca shape manual. Preservar range/filtro length>1/ilike/orderAny semORDERBY/duasqueriesPromiseAll/countfallback total??rows.length/mappers/guards. Sem base/model/mapper/SQLnewpaths/Core/casts/any/policy/gaming. Reporte eACK62antes sensores; SQLgerado orderBy(...[]) semordem requerdiagnóstico atualapósACK.

### D2 — mutation62 persistida e ACK
Dois repositories Avatar/Rocket alterados: findManydelegação/listPage, searchFilter atual, priceOrderingAny[]/asc/desc, listingQuery/countQuery/mapPage. range+PromiseAll2queries intactos; rowsinferModel,countAwaitedReturnTypequery real e fallbacktotal??rows.length. Formatreportadoexit0Fixed2; nenhumruntime/sensor. ACK62 antes conformance/code/types/complexity/SQLgerado. RF01/02CA01/02/03/20/22rev6. Próxima diagnóstico63 read-only construirSQLquery atual default/asc/desc/pagination/filtros semDB/SQLaplicado, stdout apenas assertmetadata sanitizada. Sem sourceedit63.

### D2 — diagnóstico SQL63 reportado
Builder executou node --import tsx /tmp/stardust-builder-database-shop-sql63.mjs exit0,52assertions de ORM real/helperatual/Core: ListingOrder('all') omiteORDERBY, asc/descpricecorretos, ilike length>1,limit/offset ecountsemorder/range. Zero conexão/SQL executado, stdout metadata apenas. Primeiro helper temporário assumiu defaultListingOrderAny e falhou; defaultreal éascending, helpercorrigido paraall semmudarfonte/contrato. Principal verificará artefato/comando como diagnóstico após registrar; nãoequivale rotaHTTP/behaviorreal. Source62intacta.

### D2 — resultados62 code/typespassed/175warnings
Servercode62/types62 exit0. Complexity62 exit2:175warnings0errors (179antes); shopresidual SOMENTE listPageMI60.3 emAvatar/Rocket, demais funçõesloja clean. Principal reproduzSQLdiagnóstico63 sessão48393, aguardarexit. Preparação64 Database read-only dessesdoislistPage: separar query de rows paginados/range da execução conjunta e mapa, preservar duasqueriesPromiseAll/mesmofiltro/order/countfallback. Sem editar/base/API/genéricos/artifícios. Próximospaths exatos somente twoRepo reportados antesassignment65.

### D2 — SQL63 oficialpassed e assignment65 shop pageRows
Principal reexecutou node--importtsx diagnósticoSQL63 exit0:2repos/3ordermodes/52assertions/0connections, log `/tmp/stardust-principal-shop-sql63.log`. Assignment65 BuilderDatabase source-only rev6 RF01/02 CA01/02/03/20/22 RulesDB/code/complexity, exatos repositories/shop/DrizzleAvatarsRepository.ts eDrizzleRocketsRepository.ts sobDrizzleroot. Proposta64: pageRowsQuery(filter,params) calcula range e compõe listingQuery/order/offset/limit; listPage compartilhafiltro e executa PromiseAllrows/count+mapPage. Inferir builderretorno semannotationmanual/cast; preservar SQL/2roundtrips/countfallback/guards, nenhumCore/base/model/mappers/newpaths/policy/gaming. Reporte/ACK65antesconformance/code/types/metrics/SQL63repeat. FonteSQL47intacta.

### D2 — mutation65 persistida e ACK
Dois repos Avatar/Rocket alterados: pageRowsQuery range/listingQuery/order/offset/limit com builderinferido; listPage sharedfilter/PromiseAllmesmas2queries/mapPage/countfallback. Formatreportadoexit0Fixed2, nenhumruntime65. RF01/02CA01/02/03/20/22rev6. ACK65 antes conformance/code/types/complexity eSQL63repeatprincipal; quatroevidênciasdessasclassesstale. Base/mappers/guards/SQL47intactos.

### D2 — resultados65: tipos falharam; preparação66 substituída
Code65 oficial exit0; types65 exit2: quatro TS2304 por referências a range deixadas no listPage após mover paginação. SQL63repeat65 principal exit0/52assertions/0connections, cobre construção da query mas não execução de listPage. Complexity65 exit2 com175warnings0errors: listPageAvatar/RocketMI62.2 (60.3antes), únicasloja residuais. Preparação66 read-only anteriormente considerada fica substituída pela correção automática dos quatro usos de range, nos mesmos dois repos, antes de avaliar necessidade de outra divisão. Fonte65 não compila; nenhuma execução extraDB.

### D2 — ACH29 e assignment66 correção de tipos
Tipos65 exit2 real: TS2304 range em Avatar99/100 e Rocket99/100. Diagnóstico de SQL não executou listPage e não pode substituir TSC; a transcrição incorreta foi corrigida imediatamente nos dois ledgers. Assignment66 BuilderDatabase source-only rev6 RF01/02 CA01/02/03/20/22 RulesDB/code/types, exatos repositories/shop/DrizzleAvatarsRepository.ts e DrizzleRocketsRepository.ts. Remover chamadas residuais offset/limit com range indefinido de listPage, já aplicadas em pageRowsQuery; nenhuma nova função/policy, duasqueries e SQL efetivo preservados. Reportar/ACK66antes sensores, proposta adicional de pipeline suspensa. No change Rules já exigem tipos atuais/validar extrações.

### D2 — ACH29 central registrado
Evaluation Findings/Lessons inclui falha TS2304 de65 e correction66; ACH28 atualizado code/typespass60/reviewpending. Sem sourceadicional pelo principal; testesQLdiagnósticos não validamcallsiteexecução, distinção registrada. Assignment66 em curso.

### D2 — mutation66 persistida e ACK
Dois shops repos: PromiseAll agora usa pageRowsQuery(filter,params) sem .offset/.limit residuais; range aplicado uma vez na construção privada. Falha65 foi extração mecânica não alcançando chain multiline, corrigida sem redeclararrange/policychange. Format reportadoexit0; nenhumruntime66. RF01/02CA01/02/03/20/22rev6; ACK66antes conformance/code/types/metrics/SQLdiagrepeat. ACH29sourcecorrigidoaguardaexitreal, todasfontesSQL47intactas.

### D2 — sensores oficiais da mutação 66
Código e tipos do Server: exit 0. Diagnóstico SQL: exit 0, 52 asserções, sem conexão ao banco. Complexidade: exit 2, 173 warnings e zero errors; baseline inalterado. ACH29 corrigido no source e confirmado por tipos. D2 permanece in_progress; próxima ação: proposta read-only do próximo grupo pelo Builder Database.

### Reconciliação do estado dos findings após 66
ACH23/24/25/29 atualizados com resultados atuais, preservando histórico e limites de review. Sem alteração de source/Contract. Próximo passo: gates documentais e proposta read-only.

### Assignment D2-68 — ACH23, repositories lesson/ranking/notes/conversation
Owner: Builder Database, Spec rev6, base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; D1 e C0 concluídos. RF01/02/12, CA01/02/03/20/22, RP/JN conforme Context da Spec; SHI não aplicável, Design não afetado. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleQuestionsRepository.ts`
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleStoriesRepository.ts`
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleTextBlocksRepository.ts`
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleTiersRepository.ts`
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts`
- `apps/server/src/database/drizzle/repositories/profile/DrizzleNotesRepository.ts`
- `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatsRepository.ts`
- `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatMessagesRepository.ts`
Demais paths, Core, base Repository, docs, SQL, testes, mappers, baseline e limiares proibidos. Rule Pack: database-rules.md, code-conventions-rules.md, server-application-rules.md, SDD/complexidade. Separar execução/erro compartilhados de queries, hidratação e paginação; preservar guards, SQL atomic JSON, locks, roundtrips, ordenação, fallback de ausência e transações. Notes total ??0; Chats total ??rows.length; lesson ausência continua erro. Rankers projeção inferida e batch único. Exits: source report por mutação e pausa até ACK; CodeGraph antes de leitura, leitura direta somente gaps não indexados; format focado sem baseline; principal conformance/code/types/complexidade, diagnóstico SQL delimitado posteriormente, reviewer D2 e runtime S2 pendentes. Estado in_progress; nenhuma declaração de completude por sensor parcial.

### Pré-requisito de ambiente — conferência sem segredos
Root .env.local carregado em memória. Quatro variáveis E2E presentes; ONBOARDING_RECEIPT_SECRET ausente. Pedido anterior ao usuário permanece pendente, nenhuma edição de .env.local realizada. Source D2 independente continua. Gates67/68 Spec e Plan passed.

### Preparação read-only S2 e ambiente C1
Builder Server identificou famílias sem suites de rota contratadas: API keys, conversation, playground, lesson, manual e ranking. EV01 será provado por requests reais e postreads SQL no escopo existente; não criar paths de teste fora do mapa. MCP deve consumir accountId verificado por request; lookup por id não pode inventar God fallback. Portas 3000/8000/9002/9003 ocupadas por outros serviços, 3334/54323/54345 livres; preservá-los. Runbook C1 ainda inexistente, esperado antes sua fase.

### Matriz read-only de runtime S2 — EV01/EV02 (pending)
| Fronteira | Ports | Prova real planejada |
| --- | --- | --- |
| auth/api-keys e MCP | ApiKeys | bootstrap público hash somente; válida actor A; revogada/inválida nega; B não altera A |
| profile/users/id, attempt, events | Users | próprio/alheio, receipt sem sessão, JWT forjado, SSE real |
| challenges/executions | Challenges, ChallengeSources, ChallengeCodeExecutions, Solutions | filtros/count/order/público/privado, writes A e isolamento B |
| comments | Comments | público, write→read, B não modifica A, replies/upvotes |
| chats/snippets/notes | Chats, ChatMessages, Snippets, Notes | criação/leitura/ownership/paginação/exclusão reais |
| lesson/manual | Questions, Stories, TextBlocks, Guides | conteúdo/autorização, replacement God e áudio JSON concorrente |
| shop/space | Avatars, Insignias, Rockets, Planets, Stars | catálogo público, guards atuais, writes/relations |
| achievements/ranking/jobs | Achievements, Rankers, Tiers | self, ordenação, System explícito, winners/losers persistidos |
| feedback e feedback/mine | FeedbackReports, FeedbackMessages | A/B/God, status/anexos/read, rollback sem publicação e flush depois commit |
Fixtures Auth/Mailpit reais e SQL parametrizado. Aproveitar suítes contratadas; famílias sem suítes serão verificadas por runtime temporário, sem criar paths fora da Spec. Nenhum cenário executado neste relatório; fontes intactas.

### Mutação D2-68 — oito repositories
Builder reportou source alterado nos oito paths da assignment68, sem sensores/runtime. Format exit1 por vírgula residual no return de mapRanker, DrizzleRankersRepository.ts:50; cinco arquivos formatados. Estado in_progress, evidências desses paths stale. Próxima ação: correção69 delimitada antes sensores.

### Assignment D2-69 — correção do parse
Builder Database; rev6, RF01/02/12 CA01/02/03/20/22, Rule Pack68. Permitir somente DrizzleRankersRepository.ts remover vírgula residual após return do mapper; format sem mudanças semânticas nos oito paths68. Demais alterações proibidas. Reportar mutação e pausa antes sensores; principal registra e valida.

### ACH30 — tabela central
Finding de parse acrescentado; source68 ainda in_progress até correção69 e sensores. Sem alteração de source adicional.

### Mutação D2-69 — parse corrigido
Vírgula residual removida somente no Rankers, format oito paths exit0 (um arquivo corrigido). Nenhuma mudança semântica adicional/sensor/runtime. ACH30 source corrigido, validação oficial pendente. Próxima ação conformance e sensores69.

### Sensores69 — resultados parciais oficiais
Código exit0; complexidade exit2, resultado numérico consultado no log69 antes próxima assignment. Tipos ainda rodando, não inferir sucesso. Inspeção CodeGraph Rankers/TextBlocks confirma projeção inferida, guards God/system e JSON update atômico em SQL; não substitui runtime S2.

### Sensores69 — conclusão e próxima preparação
Tipos69 passed exit0, código passed0; complexidade failed2 com163 warnings/zero errors (173 antes). Quinze avisos residuais nos paths68, Tiers limpo. Preparação70 read-only delimitada aos sete paths residuais, sem source até assignment/gates.

### Assignment D2-71 — residuais ACH23
Builder Database, rev6/base congelados, RF01/02/12 CA01/02/03/20/22; RP1–RP5/JN1 criação de usuário conforme Context, sem SHI/Design afetado. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatMessagesRepository.ts`
- `apps/server/src/database/drizzle/repositories/conversation/DrizzleChatsRepository.ts`
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleQuestionsRepository.ts`
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleStoriesRepository.ts`
- `apps/server/src/database/drizzle/repositories/lesson/DrizzleTextBlocksRepository.ts`
- `apps/server/src/database/drizzle/repositories/profile/DrizzleNotesRepository.ts`
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts`
Demais paths proibidos, incluindo base/mappers/Core/SQL/testes/docs/baseline/thresholds. Rule Pack Database/Code/Server/SDD. Separar seleção/SQL do await/ausência/hidratação, query ordenada do range, payload update de operação autorizada. Rankers grupos reais de classificação e perfil, tipos inferidos; não criar helpers microcampo. Preserve ausência lesson erro, Chats/Notes total específico, parent SELECT FOR UPDATE dentro mesma transação, owner guards anteriores à query, JSON update atômico e range aplicado uma vez. Exits: format e relatório da mutação, pausa ACK; principal conformance/code/types/complexidade e diagnóstico SQL delimitado se necessário; reviewer e runtime S2 pendentes. Source in_progress, sem promessa de zero warnings antes sensor.

### Preparação principal — mappers posteriores read-only
CodeGraph consultou seis mappers profile/ranking/space e DTOs/entities Achievement/Note/Tier/OrdinalNumber. Possível reuso de DTO existente em escrita para três mappers, se tipos inferidos e campos idênticos; leitura continua tradução explícita. Nenhum source alterado; informação enviada ao Builder para proposta futura, sem ampliar assignment71.

### Mutação D2-71 — parcial factual
Quatro paths efetivamente alterados: lesson Questions/Stories/TextBlocks e conversation ChatMessages. Format exit0, quatro arquivos corrigidos. Gerador temporário interrompido por substring Chats após formatação; Chats/Notes/Rankers intactos. Sem sensor/runtime. Próxima ação completar três paths via correção72 sem repetir gerador inteiro.

### Assignment D2-72 — completar restantes71
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22 e Rules71. Source somente conversation/DrizzleChatsRepository.ts, profile/DrizzleNotesRepository.ts, ranking/DrizzleRankersRepository.ts. Plano70 original preservado: filtros/query ordenada/range e grupos de payload/identidade inferidos, SQL/guards/fallbacks intactos. Demais quatro paths71 e todos outros proibidos. Usar patches pequenos ancorados em fonte atual, não repetir gerador inteiro. Format três paths, reportar e parar antes sensor. Gates antes ativação.

### Preparação read-only do Reviewer Database — ACH27/EV03
Reviewer Database pareado, rev6, RF03/04/10/12 CA04/05/06/07/08/20/22. Read-only: scripts/check-drizzle-transition.mjs, scripts/adopt-drizzle-baseline.mjs, apps/server/scripts/migrate-database.ts e suas duas suites scripts/tests contratadas; Rules Database/Code/Server/SDD. Proposta apenas: tratar --help/unknown flags antes env/conexão e demonstrar concorrência cruzada adopt/migrate/rollback. Sem executar operações/DB, editar source/docs/fixtures ou emitir aceite D2; relatório com flags aceitas, gaps reais e teste operacional mínimo seguro. Código de repositories72 continua exclusivamente Builder Database.

### Preparação Reviewer Database — limitação do host
Retomada read-only rejeitada por agent thread limit reached. Nenhum agente substituto criado; nenhuma execução/edição. Preparação ACH27/EV03 será retomada serialmente após Builder72 terminar; não é blocker de source independente.

### Mutação D2-72 — três restantes
Chats/Notes/Rankers alterados via patches focados conforme assignment, format exit0 (dois arquivos corrigidos). Quatro paths71 intactos nesta mutação. Sem DB/sensores. Próxima ação conformance e sensores oficiais conjuntos71/72.

### Sensores72 — partiel
Código passed0; complexidade failed2 com150 warnings/zero errors (163 antes). Tipos ainda ativo. Preparação ReviewerDatabase ACH27/EV03 agora ativada read-only serialmente, nenhum aceite D2.

### Preparação D2-73 read-only — Rankers e mappers
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22, Rule Pack Database/Code/Server/SDD. Fonte72: dois residuais Rankers rankersSelection MI57.3 e rankersQuery62.4; demais paths71/72 sem warnings novos. Preparar proposta sem editar: Rankers separa projeção SQL user/avatar de join e critérios previous/tier/order; seis mappers profile Achievement/Note, ranking Tier/Ranker, space Planet/Star. DTO equivalência escrita Achievement/Note/Tier conferida principal via CodeGraph; leitura mantém tradução explícita. Paths fora destes sete proibidos. Futura source assignment/gates/ACK/sensores obrigatórios; nenhum source agora.

### Sensores72 concluídos e diagnóstico read-only
Tipos72 passou exit0. Preparação73 Builder não ativada na primeira tentativa por limite de threads, retomar serialmente após Reviewer idle. Reviewer confirmou ACH27 parser atual ignora help/desconhecidos e runner rollback via includes; testes47 chamam APIs importadas e não CLI. EV03 concorrência cruzada segue pending; proposta segura registrada abaixo.

### Tabela atual — 150 warnings
ACH23 atualizado para sensor72, ACH30 source/tipos corrigidos com review pendente. Histórico preservado. Nenhuma alteração código/baseline.

### Assignment D2-74 — Rankers e seis mappers
Builder Database, rev6/base congelados, RF01/02/12 CA01/02/03/20/22; RP/JN Context da Spec, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts`
- `apps/server/src/database/drizzle/mappers/profile/DrizzleAchievementMapper.ts`
- `apps/server/src/database/drizzle/mappers/profile/DrizzleNoteMapper.ts`
- `apps/server/src/database/drizzle/mappers/ranking/DrizzleTierMapper.ts`
- `apps/server/src/database/drizzle/mappers/ranking/DrizzleRankerMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts`
Demais paths/base/Core/models/SQL/testes/docs/baseline proibidos. Rules Database/Code/Server/SDD. Rankers grupos projeção SQL perfil/classificação e eligibility criteria, order DESC/fallback anterior mantidos. Achievement/Note/Tier escrita DTO direto somente campos idênticos ao insert e getter confirmado, sem casts; leitura explícita em grupos coesos. Ranker fallbacks vazio idênticos. Planet/Star não persistem contadores/agregados; planetId contextual mantido, seleção explícita de campos DTO/Pick inferidos. Não espalhar aggregate DTO inteiro. Exits format/source report/ACK; conformance/code/types/complexidade oficiais, diagnóstico Rankers delimitado depois, review/runtime S2 pendentes. Sem microhelpers/gaming e sem prometer zero warnings. In_progress.

### Mutação D2-74 — mappers/Rankers
Sete paths autorizados alterados conforme proposta, format exit0 (cinco formatados). DTOs de escrita três candidatos exatos; Planet/Star seleção explícita sem counters, FK contextual preservado no relato. Rankers projection/criteria separados. Sem sensores/runtime. Próxima ação conformance e sensores74.

### Preparação D2-75 read-only — ACH27/EV03
Builder Database, rev6 RF03/04/10/12 CA04/05/06/07/08/20/22, Rules Database/Code/Server/SDD. Paths três scripts operacionais + duas suites existentes. Relatório Reviewer factual anexado no histórico; preparar parser CLI compartilhado, entrypoints subprocessos reais e concorrência cruzada sob advisory lock em Docker owned. Não executar CLI/DB nem alterar source enquanto sensores74 ativos. APIs importadas/defaults/URL memory-safe e cleanup preservados; novas suites/paths proibidos. Exits futura assignment/gates/ACK/sensores e testes reais.

### Sensores74 — parciais oficiais
Código passed0; complexidade failed2,144 warnings/zero errors (150 antes). Seis residuais nos sete paths74, tipos ativo. Preparação75 CLI/concorrência read-only independente, sem source ainda.

### Tipos74 e preparação75 concluídos
Tipos74 passed exit0, código passed0, complexity144failed2. Proposta75 cinco scripts recebida read-only. Checkpoint unit Server74 será executado antes nova source operacional. Seis residuais mapper/Rankers continuam pendentes, não declarar lote completed.

### Assignment D2-76 — ACH27 e EV03
Builder Database, Spec rev6/base congelados, RF03/04/05/12 CA04/05/06/07/08/20/22, RP/JN Context da Spec, SHI/Design não aplicável. Paths exclusivos scripts/check-drizzle-transition.mjs, scripts/adopt-drizzle-baseline.mjs, apps/server/scripts/migrate-database.ts, scripts/tests/check-drizzle-transition.test.mjs, scripts/tests/adopt-drizzle-baseline.test.mjs. Rules Database/migrations/Code/Server/SDD/test-integrity. Parser compartilhado estrito allowlist environment/manifest/phase/help, rollback só runner; preserve APIs/defaults, mensagens sanitizadas e no env/manifest/conexão antes validação. Subprocessos reais três entrypoints, TCP sentinela própria, help/invalid zero conexões. Mixed concurrency três operações reais por phase legacy/adopted/server-owned em clone owned existente, holder sessão comum, três conexões identificadas sem dados sensíveis, não escrita antes liberar, ordem serial/falhas fase aceitáveis, catálogo/hash/ledger/dados/sourcehistórico intactos e lock nenhum depois. pg_try_advisory_lock faz polling: não exigir três pg_locks pendentes; usar presença de sessões e holder, sem fingir fila. Demais paths/repos/metadata/SQL/fixtures docs/segredos/baseline proibidos. Fonte/teste pode mudar conjuntamente em um lote coerente, format/report e pausa ACK antes sensor/runtime. Exits principal conformance/código/tipos/integridade/suites duas completas reais e cleanup; Reviewer pareado pending. Source ativará somente após unit74 terminar e gates76 passar.

### Checkpoint unit Server74 aprovado
Exit0,168 suites/325 tests,74.275s; log /tmp/stardust-drizzle-d2-unit-74.log. Fonte74 sem edição concorrente. Baselines complexidade/cobertura sem diff. Source assignment76 liberada após gates passed.

### Inspeção source74 — preparação futura read-only
CodeGraph atual dos cinco paths residuais confirma campos e seis MI warnings. Possível completar grupos de identidade/catálogo e progresso/classificação; Ranker avatar nullable normalizado em mapper próprio interno, Rankers projeção de colunas separada do join. Nenhuma edição/assignment extra durante source76.

### Pedido assíncrono de preparação do ambiente
Solicitado ao usuário liberar3000/9002/9003 ou informar necessidade de manter serviços, junto ao receipt secret pendente. AGENTS serviços de outros projetos preservados; SpecS6 root.env edição exclusiva usuário. Nenhum processo encerrado/arquivo secreto editado; source76 independente continua.

### Mutação D2-76 — parser e provas operacionais
Cinco paths da assignment alterados, format exit0 (cinco). Parser compartilhado estrito/usage/catch sanitizado; novos subprocessos e mixed concurrency nas três fases conforme relato. Nenhum runtime/sensor. Operational47 agora stale; próxima ação conformance e sensores/testes oficiais76.

### Preparação D2-77 read-only — seis residuais74
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22 Rules Database/Code/Server/SDD. Fonte só para proposta: RankersRepository rankersSelection; AchievementMapper toEntity; RankerMapper profile; PlanetMapper toEntity; StarMapper toEntity/toPersistence. Projeções/grupos coesos de identidade/catálogo/requisitos/progresso/perfil-avatar; sem helpers microcampo, sem source/runtime enquanto testes76. Paths já inspecionados CodeGraph principal source74, DTO writes Note/Tier/Achievement aprovados em tipos. Plano futuro deve preservar campos/FK/defaults/inferência e queries exatamente. Assignment/gates só depois resultados76.

### Sensor global código76 aprovado
check:code global exit0, log /tmp/stardust-drizzle-global-code-76.log. Types76 e wholeoperational76 ainda ativos, não afirmar pass. Primeiro cenário CLI24/adopt apresentou success no log, rodada não concluída. Prep77read-only ativa sem source.

### Preparação77 recebida — source não ativada
Cinco paths residuais: grupos catálogo/requirements, perfil/avatar, Planet progresso, Star identidade/activity e Rankers columns. Tipos/campos inferidos mantidos; proposta ainda não editada. Source76 imutável durante testes completos. Node22.17 aviso Studio preexistente no checktypesglobal, runtimeoperacional usaNode24.

### Oficiais76 — globals e wholeoperational aprovados
Tipos global exit0,7/7tasks,2m13.065s. Operacionais76 exit0,8/8tests,0 skips/failures,196.500s; três entrypoints safe CLI e mixed concurrency três phases passaram, além seis regressões anteriores. Logs /tmp/stardust-drizzle-global-types-76.log e /tmp/stardust-drizzle-operational-tests-76.log. Cleanup final a verificar, ReviewerD2 pendente. Próxima ação completar residuais77 após gates.

### Cleanup operacional76 e reconciliação
Docker ps -a não encontrou containers stardust-drizzle-test/runner; cloneD1 preservado intencionalmente. CA06 passed local scripts76 com review pendente; ACH27 source/prova passed, review pendente. ACH23 atual144 warnings. Sem source adicional.

### Assignment D2-78 — completar seis residuais mapper/Rankers
Builder Database, rev6/base congelados RF01/02/12 CA01/02/03/20/22, RP/JN Context, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts`
- `apps/server/src/database/drizzle/mappers/profile/DrizzleAchievementMapper.ts`
- `apps/server/src/database/drizzle/mappers/ranking/DrizzleRankerMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts`
Rules Database/Code/Server/SDD. Plano77: composição inferida de columns vs selection/join; Achievement identidade/catalog versus requirements; Ranker avatar normalizado separado de profile; Planet catálogo/organização versus progresso/stars; Star identidade versus activity, persist identity selecionada com planetId obrigatório, counters excluídos. Preservar fields/defaults/FK/order/nullable semantics e inferência. Demais paths/base/Core/SQL/scripts/testes/baseline/thresholds proibidos. Exits format/report/pausa ACK antes sensores; principal conformance/code/types/complexidade e diagnósticoSQL específico posterior. Sem microhelper/gaming ou novos testes repo. In_progress, não aceitar zero warnings por relato.

### Preparação read-only — legado removível D2
26 paths Remove do cardD2 (24 migrations/config/schema) comparados por SHA256 contra base congelada; zero diferenças. Não remover ainda durante source78; futuro owner Database terá assignment/gates explícitos. Prova operacional76 replay por Git independente dos paths atuais passou8tests.

### Mutação D2-78 — grupos finais mapper/Rankers
Cinco paths autorizados alterados; format exit0,3files. Primeiro patch rejeitado sem escrita, retry atual aplicado sem estado parcial. Grupos DTO/columns conforme proposta. Scripts76 intactos; nenhum runtime/sensor. Próxima ação conformance/sensores78.

### Sensores78 finais
Código e tipos Server passed exit0. Complexidade failed2,138 warnings/zero errors; cinco paths78 e seis residuais74 agora clean. Logs78 preservados. Operacionais76 permanecemfresh8/8. Próxima proposta read-only restante simples domains ou limpeza legacy delimitada.

### Assignment D2-79 — limpeza SQL legado capturado
Owner Builder Database, rev6/base congelados, RF03/04/05/12 CA04/05/06/08/20/22, RP/JN Context e SHI/Design não afetados. Rules Database/migrations/Code/Server/SDD. Paths Remove exclusivos:
- `apps/server/supabase/config.toml`
- `apps/server/supabase/migrations/20251008214302_create_tables.sql`
- `apps/server/supabase/migrations/20260506130000_create_insignias_tables.sql`
- `apps/server/supabase/migrations/20260508132253_create_notes.sql`
- `apps/server/supabase/migrations/20260511182355_remote_schema.sql`
- `apps/server/supabase/migrations/20260511184731_remote_schema.sql`
- `apps/server/supabase/migrations/20260511210000_remove_next_star_function_and_view.sql`
- `apps/server/supabase/migrations/20260514120000_create_update_text_block_audio_function.sql`
- `apps/server/supabase/migrations/20260603120000_create_clear_text_block_audio_function.sql`
- `apps/server/supabase/migrations/20260611120000_grant_select_on_public_views.sql`
- `apps/server/supabase/migrations/20260611130000_drop_users_visits.sql`
- `apps/server/supabase/migrations/20260619120000_rename_challenges_code_to_initial_code.sql`
- `apps/server/supabase/migrations/20260619123000_update_challenges_view_and_list_function_to_initial_code.sql`
- `apps/server/supabase/migrations/20260716120000_add_challenge_is_evaluated_by_function.sql`
- `apps/server/supabase/migrations/20260716121000_create_challenge_code_executions.sql`
- `apps/server/supabase/migrations/20260723120000_add_challenge_official_solution.sql`
- `apps/server/supabase/migrations/20260804120000_create_feedback_conversations.sql`
- `apps/server/supabase/migrations/20260804130000_remove_feedback_outbox_events.sql`
- `apps/server/supabase/migrations/20260804140000_remove_persist_feedback_message.sql`
- `apps/server/supabase/migrations/20260804150000_grant_feedback_reporting_permissions.sql`
- `apps/server/supabase/migrations/20260806120000_add_user_feedback_history.sql`
- `apps/server/supabase/migrations/20260807000058_revoke_feedback_history_public_execute.sql`
- `apps/server/supabase/migrations/20260807000829_enable_feedback_author_insert_rls.sql`
- `apps/server/supabase/migrations/20260807000901_enable_feedback_author_update_rls.sql`
- `apps/server/supabase/migrations/20260810100000_add_user_metadata_to_feedback_history.sql`
- `apps/server/supabase/schemas/schema.sql`
Pré-requisitos cumpridos: manifest24hashes e metadataKit capturados; replay Gitbase, adoção/dados/rollback/mixed whole76 passaram8/8; SHA dos26files iguais base sem edits do usuário. Remover somente arquivos enumerados, nunca diretório recursivo; revalidar ausência edits antes remover. Não alterar config/scripts/repos/SQLnovo/base/metadata/testes/docs nem adaptadoresSupabase consumidos (D3). Interim db:test/CI antigos deixam de ter fonte SQL até C1, dependentesS2 não iniciam antes C1. Exits relatóriosource e pausa ACK; principal conformance, prova replay por Gitbase após remoção e code/types aplicáveis; ReviewerD2 pending. Sem DB/remoto/sensor nesta mutação. Não apagar evidência/tmp fonte congelada, nenhuma perda de registros de app.

### Mutação D2-79 — legado removido
Exatos26files removidos individualmente; todos26SHA novamente iguais base antes unlink. Nenhum diretório recursivo ou outro path removido. SQLnovo/Kit/manifest/scripts/tests intactos. Pré-requisito76fulfilled, fonte legada recuperável Git. Próxima ação conformance/globals e replay real após remoção.

### Preparação D2-80 read-only — domínios restantes simples
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22 Rules Database/Code/Server/SDD. Paths para proposta: repositories/space/DrizzlePlanetsRepository.ts e DrizzleStarsRepository.ts, repositories/profile/DrizzleAchievementsRepository.ts, repositories/playground/DrizzleSnippetsRepository.ts, mappers/playground/DrizzleSnippetMapper.ts, mappers/conversation/DrizzleChatMessageMapper.ts, mappers/lesson/DrizzleQuestionMapper.ts. Relatório78 mostra18funções com warnings nesses7paths. Preparar plano por query/inferência/guarda/hidratação/transações reais, sem microhelpers ou casts, baseline/model/Core changes. Nenhuma source/DB/sensor enquanto globais79/replay ativos. Paths exatos futuraassignment/gates/ACK necessários.

### Sensores79 — parciais e replay pósremoção
Código global passed0; integrity passed0 (10tests,3sourcepareados,193excluídos conforme Rules). ReplayCLI24 Gitbase/adopt/data real pósremoção passed0,1/1,0skip,51.970s. Tipos/unitglobals e architecture ainda running. Logs79 preservados; source79imutável.

### Sensores79 — conclusão com falha unit
Tiposglobal passed0,7/7,2m41.737s. Architecture passed0,3874modules/6952dependencies. Unitglobal failedexit1,4/5tasks (Serverfailed),3m2.989s. Investigação foco log antes próxima source; preparação80read-only proposta recebida, não ativar81 até corrigir checkpoint79.

### ACH31 — correção de sequencing, Contract preservado
Teste legado FeedbackConversationCascade lê schema.sql; Spec determina Remove somente após portar cenários observáveis para rotas. Ajustado Plan: schema.sql Remove único transferido D2→D3, mesmo owner Database e classificação final Remove; D2 114paths/D3 112paths, total504 intacto. Pré-requisito D3 apósS2 permite port antes exclusão. Nenhuma Specrevision/Rule/limiar/teste alterado. Restauração transitória byte idêntica necessária antes repetir unit.

### Assignment D2-81 — restauração transitória ACH31
Builder Database, rev6 RF03/04/12 CA01/02/04/05/08/20/22 Rules Database/Code/Server/SDD. Único path permitido apps/server/supabase/schemas/schema.sql: restaurar bytes exatos Gitbase congelada, SHAcomparado. FinalRemove pertenceD3 apósS2port; não incluir arquivo/runtime novo. Demais25deletedpaths e todos outros proibidos. Sem teste/SQLnovo/config/baseline edit. Reportar restauração/hash e pausa ACK antes sensor. Exits conformance e rerunServerunit79failed, restantes globais79sourceintactos mantêmfreshness.

### Mutação D2-81 — restauração original
Único schema.sql restaurado igual Gitbase, SHA25680610062fbc7522d7a54a02c0e239d6767b8f15e2f64923e0dfb296349da6243; outros25arquivos ausentes. Sem source/teste/SQLnovo/config alterados. Próxima ação conformance e unitServer81 para corrigir79failed.

### Assignment D2-82 — domínios space/profile/playground e mappers
Builder Database, rev6/base congelados, RF01/02/12 CA01/02/03/20/22, RP/JN Context, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts`
- `apps/server/src/database/drizzle/repositories/space/DrizzleStarsRepository.ts`
- `apps/server/src/database/drizzle/repositories/profile/DrizzleAchievementsRepository.ts`
- `apps/server/src/database/drizzle/repositories/playground/DrizzleSnippetsRepository.ts`
- `apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts`
- `apps/server/src/database/drizzle/mappers/conversation/DrizzleChatMessageMapper.ts`
- `apps/server/src/database/drizzle/mappers/lesson/DrizzleQuestionMapper.ts`
Rule Pack Database/Code/Server/SDD. Proposta80: execução base/result helpers, queries/projeção/hidratação separadas e inferidas, guard antes query, Planets stars agrupadas/twoqueries/ASCnumber/lastDESC1, Stars replaceMany looptx/parentlock/ausentecontinue, Achievements ordens/guards/bulk/tx, Snippets visibility/range/count0/no novaordem/autor/payload mantidos. Mappers conteúdo versus author/avatar nullable, sender cast só remover se getter/DTO enum equivalente comprovado, Question dispatch discriminado famílias reais e AppError inválido idêntico semcast. Nenhuma alteração Core/port/model/base/SQL/scripts/testes/docs/metadata/baseline/thresholds. Exits fonte format/report e pausaACK; principalconformance/código/tipos/complexidade, diagnósticoSQLdelimitado posterior/reviewer/runtimeS2pending. Source só ativa após unitServer81passed e gates82. Sem microhelper/gaming ou testrepo novo.

### UnitServer81 aprovado — source82 liberada
UnitServer exit0 apósrestoreoriginal schema, log /tmp/stardust-drizzle-d2-unit-81.log. ACH31resolvedsource/unit, finalRemoveD3pending. Quatro outrosunitworkspaces79passed, nenhumsourcealterado neles. TabelaACH23atual138. Gates82passed e unitcorrectionpassed autorizam ownerDatabase82.

### Mutação D2-82 — sete paths domínio
Planets/Stars/Achievements/Snippets e três mappers alterados conformeproposta, format0 sete. ChatMessage cast removido só apósgetterCoreunionvalidada user|assistant; Questiondiscriminated Extractsemcast. SemCore/SQL/scripts/testes/model/baseline edits ou runtime. Próxima conformance/sensores82.

### Oficiais82 — resultados
Código/tiposServer passed0; complexityfailed2,129warnings/zeroerrors (138antes). Nove residuais em6paths82; ChatMessageMapper limpo. Source82 scripts76/replay79/schema81 intactos. Próxima preparação83read-only completargrupo.

### Preparação D2-83 read-only — residuais82
BuilderDatabase rev6 RF01/02/12 CA01/02/03/20/22 RulesDatabase/Code/Server/SDD. Só6paths residuais82: QuestionMapper,SnippetMapper,SnippetsRepository,AchievementsRepository,PlanetsRepository,StarsRepository. Propor divisões por operação/semânticaSQL/projeção/DTO coerente e erro/fallback/locks preservados; não microhelper/cast/gaming/modelbasechanges. Nenhuma source/runtime/sensor atéassignment/gates. Exitsoficiaiscode/types/metrics/reviewer/runtimeposterior.

### Assignment D2-84 — residuais82
BuilderDatabase rev6/base congelados RF01/02/12 CA01/02/03/20/22 RP/JN Context, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/mappers/lesson/DrizzleQuestionMapper.ts`
- `apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts`
- `apps/server/src/database/drizzle/repositories/playground/DrizzleSnippetsRepository.ts`
- `apps/server/src/database/drizzle/repositories/profile/DrizzleAchievementsRepository.ts`
- `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts`
- `apps/server/src/database/drizzle/repositories/space/DrizzleStarsRepository.ts`
RulesDatabase/Code/Server/SDD. Proposta83: Question reconhece família e constrói/narrowsemcast, toEntityopen→choice→arrangement e mesmo AppError desconhecido; Snippet grupos conteúdo/visibilidade/identity/owner/time/author/avatar inferidos defaultsiguais; Snippetscolumns/join versus visibility pública/owner; Achievementsselection versus userfilter/order; Planetsqueryordenada vs limite1 mantendo duasqueriesagregadas; Stars SELECT FORUPDATE/currentFK versus update sob mesmotx/lock e ausentereturn. Não deslocarcorpoparahelperinteiro que absorva warningsemresponsabilidade distinta, nem microhelpers/gaming. Demaispaths/Core/base/models/scripts/SQL/testes/docs/baseline/thresholds proibidos. Exitsformat/report/pausaACKantesensor; principalconformance/code/types/complexity, diagnósticodelimitado posterior, reviewer/runtimeS2pending. SemDB/remotowrite neste lote.

### Mutação D2-84 — seis residuais
Seis paths autorizados alterados, format exit0 três arquivos. Patch rejeitado antes escrita; seis outputs preparados em memória e aplicados como lote único. Query/DTO/dispatch/locks separados conforme proposta. Próxima conformance e sensores84.

### Oficiais84 e preparação85 read-only
Código/tipos84 passed0. Complexidadefailed2 com122warnings/zeroerrors, seteavisosremovidos. Só dois residuais SnippetMapper author63.6/content64.8 nestegrupo. Preparação85read-only umpath mapperSnippet, sem source/DB/model/test/baselinechanges.

### Assignment D2-86 — SnippetMapper residuais
Builder Database, rev6/base congelados, RF01/02/12 CA01/02/03/20/22 RP/JN Context, SHI/Design não afetados. Único path apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts. Preparação85 principal CodeGraph fonte84 confirmou dois métodos residuais. Rules Database/Code/Server/SDD. Separar envelope author.id de author.entity perfil slug/name/avatar (helper interno coeso, mesmos defaults), sem chamadas/fields extras. Content separar conteúdo title/code de metadata id/isPublic/createdAt, tipos Pick inferidos/DTO existente, todos fallbacks atuais preservados. A função toEntity compõe DTO explícito, toPersistence atual aprovado não alterar. Não helper de campo isolado ou cast, demaispaths/Core/models/base/SQL/scripts/testes/docs/baseline proibidos. Exits format/report pausa ACK antes sensor; principalconformance/code/types/complexidade/review/runtime posterior. Source86 só após gatespassed; fonteSQL76/replay79/schema81imutável.

### Gate86 — falso positivo textual
Spec passed; Plan falhou unresolved placeholder marcador pendente na palavra portuguesa que nomeava toEntity. Source86 não ativada. Reescrever somente wording do ledger, sem mudar checker/Contract/escopo.

### Wording86 corrigido
Somente texto do ledger reescrito para função toEntity. Nenhum source/Rule/checker alterado. Próxima ação repetir gates86.

### Gate86 — wording do diagnóstico corrigido
O próprio registro do nome literal do marcador acionou novamente o detector. Diagnóstico no Plan agora usa descrição neutra, histórico de falha preservado semanticamente. Nenhum source/checker/Contract alterado; repetir gate.

### Mutação D2-86 — SnippetMapper
Único path autorizado alterado; author envelope/perfil e conteúdo/metadata separados, Picks DTO e defaults preservados no relato. toPersistence intacto. Format exit0, um arquivo. Sem sensor/runtime/outros edits. Próxima conformance e sensores86.

### Preparação D2-87 read-only — domínio challenging
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22, RP/JN Context e SHI/Design não afetados. Proposta para oito paths: repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts, DrizzleChallengeSourcesRepository.ts, DrizzleChallengesRepository.ts, DrizzleSolutionsRepository.ts; mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts, DrizzleChallengeSourceMapper.ts, DrizzleChallengeMapper.ts, DrizzleSolutionMapper.ts. Log84 aponta48warnings nessespaths. Use responsabilidades de query/projection/joins/filtros/paginação/contagem/autor/hidratação e writes/locks/tx, helpers existentes. Preservar visibilidade privada/own/God/system, SQLRPCsubstituído, views counters atômicos, replacement/FK/ordens/NULLs/defaults e DTO fields exatamente. Tipos derivados query/model/DTO, sem casts/manualshadowSQLshape/microhelpers/gaming. Nenhuma source/DB/sensor enquanto86ativos. Retorne plano delimitado/exits, não promessa de zero avisos. Modelcallback permanece fora dessa proposta, SQL/Kit/Base/Core/testes/docs/baseline proibidos.

### Assignment D2-87 — challenging

Builder Database estável; tentativa87, Spec rev6, base8f9f71ac3dc4bd42312f5890f05c5da02c8814a9. Ownership exclusivamente dos oito paths listados na preparação D2-87 em `apps/server/src/database/drizzle/{repositories,mappers}/challenging/`: `DrizzleChallengeCodeExecutionsRepository.ts`, `DrizzleChallengeSourcesRepository.ts`, `DrizzleChallengesRepository.ts`, `DrizzleSolutionsRepository.ts`, `DrizzleChallengeCodeExecutionMapper.ts`, `DrizzleChallengeSourceMapper.ts`, `DrizzleChallengeMapper.ts`, `DrizzleSolutionMapper.ts`. RF01/02/12; CA01/02/03/20/22; Rule Pack Database/Code/Server/SDD; RP/JN pelo crosswalk rev6, SHI e Design não aplicáveis. Preservar filtros e autorização por actor, relações/ordens/nulls/fallbacks, SQL de contagem, paginação, payloads, increments atômicos, transações e locks. Usar projeções e tipos derivados das queries/modelos/DTO existentes, sem casts novos, tipos manuais que espelhem SQL, microhelpers ou alterações de baseline/thresholds. Model callbacks ficam fora deste lote. Paths fora da lista, Core, models, client/base, SQL, scripts, testes e artefatos gerados proibidos. Exits do Builder: relatório factual dos paths e format; pausa para ACK antes de qualquer sensor. Após ACK, principal executa conformance, `check:code`, `check:types`, sensor de complexidade e revisão Database pareada; runtime Server permanece S2. Estado `in_progress`; dependências D1 e D2, sem liberar fases dependentes.

### Sensores D2-86 e gates para D2-87

Code86 e types86 passaram exit0; complexidade86 terminou exit2 com120 warnings/0 errors (122 em84), sem alteração de baseline. Spec-definition e Plan-definition passaram exit0 após reconciliação dos ledgers. Conformance rev6/base congelada executada antes dos sensores atuais; exit1 esperado por paths futuros ainda inalterados/ausentes, `schema.sql` ainda presente até D3 e 16 paths alheios ignorados. D2 segue `in_progress`; assignment87 delimita somente os oito paths acima. Próxima ação: Builder Database implementa e pausa para ACK.

### Mutação D2-87 — challenging

Builder Database alterou os quatro repositories e quatro mappers challenging da assignment, somente esses paths. Reportou `npx biome format --write <8 paths>` exit0. O relato descreve remoção de wrappers duplicados, separação de projeções/joins e helpers inferidos para singles/plurals; queries rows/count/map mantêm filtros/ordens/fallbacks; locks/transações, replacement de relações, incremento atômico de views, ownership e payloads escritos mantidos. Casts JSON/enum preexistentes ficaram no mesmo local, sem novos casts; nenhuma edição de models/Core/scripts/tests/SQL/docs/base. Alegações aguardam inspeção do diff e sensores oficiais. Code/types/complexidade e conformance dos paths agora stale/pendentes. D2 permanece `in_progress`; próxima ação: inspeção do diff, gates, conformance e sensores.

### ACH-32 / Correction D2-87-F1 — formatter do Challenges

A inspeção principal encontrou que `npx biome format <8 paths>` exit1 em `DrizzleChallengesRepository.ts` (linha aproximada 313), embora o Builder tenha reportado `npx biome format --write <8 paths>` exit0. A assignment D2-87 permanece; Builder Database recebe correction somente nesse path, formato conforme Biome, sem mudança de comportamento. Não iniciar sensores enquanto a correção e o novo formatter não passarem. D2 continua `in_progress`; próxima ação: correction pelo mesmo Builder, depois conformance e sensores.

### Correção D2-87-F1 — ACH-32

O mesmo Builder Database corrigiu exclusivamente a formatação em `DrizzleChallengesRepository.ts`; `npx biome format --write <path>` e a verificação sem escrita `npx biome format <path>` passaram exit0, um arquivo. Sem alteração semântica ou outros paths. ACH-32 resolvido para o formatter. Code/types/complexidade/conformance continuam pendentes para os oito paths; próxima ação: principal confirma format, reroda conformance e sensores.

### Sensores D2-87 — parcial

`npm run check:complexity -w @stardust/server` terminou exit2 com112warnings/0errors, redução de oito sobre a captura86; baseline/threshold inalterados. `npm run check:code` global passou exit0. Types/unit/architecture permaneciam em execução. Próxima ação: registrar seus exits quando concluírem, corrigir qualquer finding e continuar redução factual de warnings.

### ACH-33 / Correction D2-87-F2 — descrição nullable do Challenge

`npm run check:types` global terminou exit2 apenas em `DrizzleChallengeMapper.ts`: a annotation do retorno `content` manteve `description: string | null` apesar do fallback `?? ''`, incompatível com `ChallengeDto.description: string`. Correction para o mesmo Builder, somente o mapper; preservar fallback/valor runtime e inferir ou declarar tipo pelo DTO real sem cast. Types do Server e code/type global stale até rerun. `check:code`/integrity passaram, unit ainda executava, architecture passou, complexity112 exit2. Próxima ação: correction e pausa ACK antes de novos sensores.

### Sensor D2-87 — unit global

`npm run test:unit` passou exit0, cinco workspaces com testes (Core/Server/Studio/Web/LSP), sem alterações durante a execução. Server: 168 suítes/325 testes; unit terminou após o finding de tipos ser observado e antes de sua correção F2. Sem testes novos para repositories/mappers, conforme Rule Pack; cobertura DB real aguarda S2. Próxima ação: concluir F2 e repetir code/types/formato invalidado.

### Correção D2-87-F2 — ACH-33

Builder Database alterou exclusivamente a annotation de retorno de `DrizzleChallengeMapper.content` para `Pick<Challenge['dto'], 'title' | 'description'>`, mantendo `row.description ?? ''` sem mudança de valor ou fallback, e sem cast. Formatter focado reportado exit0. Check de tipos que motivou a correção está stale; code/types/unit/complexidade afetados devem ser refeitos antes de validar a tarefa. Próxima ação: repetir gates documentais, conformance, `check:code`, `check:types`, `test:unit`, complexity e format.

### Sensores D2-87 — types/code/complexity

Após F2, `npm run check:code` e `npm run check:types` passaram exit0 nos sete workspaces; types duraram 2m46.42s. `npx biome format <8 paths>` passou exit0 sem fixes. `npm run check:complexity -w @stardust/server` exit2: 112 warnings/0 errors, 696 arquivos/2563 funções, redução de oito desde D2-86; baseline e threshold intactos. Types resolve ACH-33. Unit ainda executava. Próxima ação: obter resultado final de unit e então preparar próxima proposta Database.

### Sensores D2-87 — conclusão parcial

Após F2: `npm run check:code`, `npm run check:types`, `npm run test:unit`, format e `check:architecture -w @stardust/server` passaram exit0. Unit global: cinco workspaces, Server168 suites/325 testes, 3m7.815s. Architecture Server: 863 módulos/1636 dependências. `check:test-integrity` da rodada anterior passou exit0; F2 não alterou testes/pareamento. Complexidade permanece exit2 com112 warnings/0 errors, baseline intacto; portanto D2 e a assignment não são verificadas. ACH-33 resolvido; ACH-23 aberto. Próxima ação: obter lista atual dos warnings e preparar assignment delimitada para reduzir o grupo restante.

### Preparação D2-88 read-only — warnings restantes

Builder Database, somente diagnóstico/proposta, sem edits: paths apontados por `/tmp/stardust-drizzle-complexity87.log`: `repositories/reporting/DrizzleFeedbackReportsRepository.ts`, `repositories/reporting/DrizzleFeedbackMessagesRepository.ts`, `repositories/profile/DrizzleUsersRepository.ts`, `mappers/profile/DrizzleUserMapper.ts`, `mappers/reporting/DrizzleFeedbackReportMapper.ts`, `repositories/forum/DrizzleCommentsRepository.ts`, `repositories/challenging/DrizzleChallengesRepository.ts`, `mappers/challenging/DrizzleChallengeMapper.ts`, `models/challenging/challenge-code-execution-model.ts`, `models/profile/user-model.ts`, `models/reporting/feedback-report-model.ts`. Propor responsabilidades/semântica real e paths mínimos, olhando log completo; respeitar owner, guards, SQL/DTO, transações e inferência. Nenhuma mutation/sensor durante preparação. D2-87: format/code/types/unit/architecture/integrity passaram, complexity112 exit2; ACH-32/33 resolvidos, ACH-23 aberto. Próxima ação: proposal88, depois assignment com gates/ACK.

### Assignment D2-88 — Reporting repositories e mapper

Builder Database estável; tentativa88, Spec rev6/base8f9f71ac3dc4bd42312f5890f05c5da02c8814a9. Paths exclusivos: `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`, `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`, `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts`. RF01/02/12; CA01/02/03/20/22; Rule Pack Database/Code/Server/SDD; RP/JN pelo crosswalk da Spec, SHI/Design não aplicáveis. Responsabilidades por projeção/author, filtros de consulta, rows/count/summary, persistência/payloads e transações/locks. Preservar joins/campos SQL e contagens, paginação, ownership/God/system, locks e ordenação, expectedStatus/status canônico, `greatest`/NULL/read markers, conflito/idempotência e anexos. Tipos inferidos de DTO/query; cast antigo de status permanece no ponto atual, sem casts novos/shadow types. Outros paths, Core, models, base/client, SQL, scripts, tests, docs e baseline/thresholds proibidos. Builder usa CodeGraph e altera apenas os três paths, reporta format, pausa para ACK. Exits principais: conformance, format, code/types, complexidade e review pareado; testes unitários globais obrigatórios pela task principal. Runtime de concorrência/efeitos reais aguarda S2. Estado `in_progress`, sem liberar S2/W2/C1.

### Preparação D2-88 read-only — propostas remanescentes

Builder Database propôs sequência pós assignment88: UsersRepository + UserMapper; depois CommentsRepository; depois ChallengesRepository + ChallengeMapper. Os três model callbacks são avisos de Halstead em configuração declarativa de constraints/indexes. Permanecem fora do lote até existir prova de equivalente em `getTableConfig`/Kit, pois mudar `extraConfig` pode afetar metadados inferidos; não deslocar avisos para helpers nem editar baselines. Registrar assignment futura após concluir e validar o lote atual.

### Mutação D2-88-A — parcial Reporting

Builder Database alterou parcialmente somente os três paths da assignment88. Nos dois repositories Reporting, removeu wrappers `run` duplicados e direcionou callbacks aos helpers herdados `executeQuery`; no mapper, separou campos activity/conversation e persistência temporal, e author avatar do envelope. Relatou campos/fallbacks/cast de status intactos e nenhuma consulta/guard/lock alterada. Comando de edição Python3 reportado exit0; nenhum format/sensor/runtime executado. Code/types/complexidade87 stale nesses três paths. Mutação88 continua `in_progress`; próxima ação após ACK: completar separações de query/transactions/paginação e format dentro dos mesmos três paths.

### Mutação D2-88-B — Reporting concluído

Builder Database completou assignment88 exclusivamente nos dois repositories Reporting e mapper correspondente. Reports: projeções/author/conversation agregada/hidratação separadas; query/search legacy/current e count com/sem join distinguidos; filtros/list/count/listByAuthor preservam contagem de consultas, Promise.all, ordenações, page cap/default, fallback e summary; lockReport e cálculo `savedValues` preservam transação, greatests/NULL/status/read markers. Messages: projection attachments separada; read helpers mantêm guards/ASC; `persistMessage` conserva sequência lockReport→existing→assert/insert→hydrate→assert attachments sob mesma tx; closed só bloqueia insert novo; lockMessage mantém FOR UPDATE of message/autoria; attachments mantêm idempotência/ordem. Mapper separa autores/atividade/conversa e persistência temporal, cast status intacto. Formatter write/check nos três paths passou exit0; scripts intactos. Alegações semânticas aguardam inspeção/sensores. Próxima ação: conformance, check:code/types/unit, complexidade, integrity/coverage aplicáveis e review; runtime em S2. D2 permanece in_progress.

### Gate D2-88 — conformance e format

Após mutation88, `npx biome format <3 paths>` passou exit0, sem fixes. `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` terminou exit1 esperado pela implementação ainda parcial do contrato de 504 paths: há outros paths de waves futuras inalterados/ausentes, `schema.sql` aguarda D3 e 16 paths não contratados são ignorados. Nenhuma exceção semântica inferida. Próxima ação: registrar sensores atuais após repetir definitions gates.

### Sensores D2-88 — parcial

Format focado passou exit0; conformance rev6/base exit1 segue incompleta em outros paths futuros e `schema.sql` reservado a D3. `check:code` global passou exit0; `check:test-integrity` passou exit0; `check:architecture -w @stardust/server` passou exit0 (863 módulos/1636 deps). Complexity terminou exit2 e subiu de 112 para 120 warnings (0 errors, 696 files/2587 functions), regressão líquida de oito; não mudar baseline. `check:types` ainda executava; unit não foi iniciado após mutation88. D2-88 não verificada. Próxima ação: aguardar tipos e completar diagnósticos, depois corrigir aumento no escopo autorizado antes de novos grupos.

### Sensor D2-88 — types

`npm run check:types` passou exit0 em sete workspaces, 41.224s, após mutation88. Sem erro de tipos. Unit global ainda pendente nesta correção.

### Complexity D2-88 — diagnóstico

Log `/tmp/stardust-drizzle-complexity88.log`: exit2,120 warnings/0 errors,696 files/2587 functions. Total segue +8 sobre 87. Métricas explícitas de reporting: FeedbackReportsRepo1, FeedbackMessagesRepo1, ReportMapper0; outros grupos UsersRepository4/UserMapper4, CommentsRepository1, ChallengesRepository/Mapper1 cada, três callbacks model1 cada. Esses subtotais de medidas não substituem a contagem de warning functions. Próxima ação: após unit, diagnóstico por função/health comparado com o log87 e correction dentro dos mesmos três paths para remover ganho negativo.

### Sensor D2-88 — unit global

`npm run test:unit` passou exit0 após mutation88, cinco workspaces com suítes (Core/Server/Studio/Web/LSP); Server168 suítes/325 testes. Duração1m41.929s. Suite não valida persistência real dos novos repositories; runtime de Reports/Messages segue S2. Próxima ação: diagnóstico ACH-34, correction no mesmo lote, depois repetir sensores invalidados.

### Diagnóstico ACH-34 — complexidade por função

Builder Database comparou read-only `/tmp/stardust-drizzle-complexity87.log` e `...88.log`: os três paths Reporting passaram de31 para39 funções em warning (+8), explicando integralmente o total global112→120; ReportsRepository19→23 (+4), ReportMapper3→7 (+4), MessagesRepository9→9. O total de funções cresceu2563→2587 (+24); nenhuma baseline/threshold foi alterada. Métricas médias dos arquivos melhoraram, mas não neutralizam o aumento de funções com MI<65. No mapper, quatro helpers recém-introduzidos ficam abaixo do limite; nos repositories, algumas projeções e callbacks extraídos também mantêm alertas. A contagem oficial de warning functions é a autoridade. Não aceitar a rodada nem prosseguir a outros grupos até corrigir ACH-34 no escopo autorizado, reduzir avisos com responsabilidades coesas e sem microhelpers/gaming, e repetir sensores. `check:code`, `check:types`, `test:unit`, architecture, integrity e formato atuais passaram; complexity continua exit2. Próxima ação: registrar assignment corretiva após proposta read-only do Builder.

### Correction D2-88-C — reagrupamento coeso Reporting

Após proposta read-only e aprovação principal, Builder Database recebe somente `DrizzleFeedbackReportMapper.ts` e `DrizzleFeedbackReportsRepository.ts`; `DrizzleFeedbackMessagesRepository.ts` fica sem alteração nesta correction. No mapper, pode reintegrar os helpers single-use de activity/conversation em `toEntity`, avatar/profile em `author`, e `persistedActivity` em `toPersistence`, como cada um compõe a conversão única da entidade/autor/persistência. No ReportsRepository, pode reintegrar `reportColumns` à query que o consome, os componentes `savedContent`/`savedAdminActivity` à única composição atômica `savedValues`, e `searchFilter` à política `listingFilter`; `hydratedAuthor` pode ser integrado em `toEntity` somente se mantiver projeção e null semantics legíveis. Não duplicar a seleção bloqueada de `lockReport` (usada por save e changeStatus), nem duplicar a query reutilizada por list/listByAuthor; preservar helpers com reuso ou responsabilidade autônoma. Sem novos helpers, casts, tipos SQL espelho, callbacks que apenas recebam corpo complexo, baseline/threshold edits ou alteração dos outros paths. Mudanças só para remover indirection sem reuso e compor uma única projeção/resultado coeso; não achatar lógica apenas para deslocar warning. Preservar todos os contratos de RF/CA da assignment88, especialmente fields/defaults/nulls/datas, autoria, queries, ordenação, paginação, counts/summary, lock/tx/status/conflito/greatest/read markers. Factual target: não deixar o total global acima dos112 avisos medidos antes da assignment88; se os limites coesos permitidos não bastarem, reportar o sensor real sem ampliar escopo e planejar outro diagnóstico. Definition gates devem passar antes da mutation; Builder reporta paths/format e pausa para ACK; principal roda conformance, code/types/unit/complexity, integrity/architecture/coverage aplicáveis e review pareado. Sem runtime de DB nesta correção (S2 continua dono da prova real). ACH-34 e D2 continuam `in_progress` até complexity aprovado e revisão.

### Mutation D2-88-C — resultado e checkpoint do Builder

Após Spec/Plan definition gates aprovados e ACK da principal, Builder Database editou exclusivamente os dois paths autorizados. No mapper, activity/conversation voltaram a compor `toEntity`, avatar a compor `author`, e `persistedActivity` a compor `toPersistence`. No ReportsRepository, `reportColumns` foi reintegrado à query; `hydratedAuthor` na hidratação de `toEntity`; savedContent/savedActivity/savedAdminActivity na composição única `savedValues`; e searchFilter em listingFilter. Helpers de reuso `lockReport`, `activityPageQuery`, count helpers e `conversationColumns` foram preservados; MessagesRepository ficou intocado. Builder reporta status cast e SQL/joins/query count/ordem/fallback/datas/NULL/greatest/status/locks/tx inalterados. Edição reportada exit0; Biome write e check focados nos dois paths passaram exit0 (2 fixes aplicados). Code/types/unit/complexity88 ficam stale nesses arquivos; não houve sensor/DB/review. A estimativa111 foi descartada porque dependia de duplicar responsabilidades compartilhadas. Próxima ação: gates documentais, inspeção/conformance e medir o sensor atual; correction não verificada até então.

Inspeção da principal dos dois arquivos atuais confirmou os limites e campos agrupados, helpers compartilhados preservados, mesma composição de status/fallbacks/datas/nulls, e sequência SQL/locks/payload conforme o estado reportado; não encontrei divergência direta na leitura. Isso não prova os contratos de runtime nem a redução de complexidade. Os definition gates passaram após registrar mutation e inspeção. Principal libera agora conformance e sensores integrados; ACH-34 ainda aberto, sem aceite de D2-88-C.

### Sensores D2-88-C — parcial

Após correction C: `npm run check:code` passou exit0 nos sete workspaces; `check:types` passou exit0 nos sete (2m29.184s); `test:unit` passou exit0 em cinco workspaces, Server168 suítes/325 testes e Web118/506 (2m53.301s); `check:architecture -w @stardust/server` passou exit0 (863 módulos/1636 dependências); `check:test-integrity` passou exit0. Complexity oficial terminou exit2 com113 warnings/0 errors,696 arquivos/2577 funções, redução de7 desde mutation88 (120), porém ainda um acima dos112 pre88; baseline/threshold intactos. `check:spec-implementation` exit1 esperado enquanto paths das waves futuras/incompletos, schema.sql pendente de D3 e paths do contrato ainda não alterados; não é resultado semântico isolado de C. Coverage Server e `check:coverage` ainda pendentes. D2-88-C não verificada nem aceita até diagnosticar aviso residual e concluir coverage/sensores aplicáveis.

Coverage Server passou exit0:168 suítes/325 testes; statements/lines48.17%, branches88.97%, functions34.45%; duração444.139s. Gate global `check:coverage` ainda precisa comparar com o baseline versionado.

`npm run check:coverage` terminou exit1. O Server caiu de51.60% para48.17% em statements/lines, de47.11% para34.45% em functions; branches subiu82.98%→88.97%. Core preservou baseline e Studio/Web melhoraram. Não editar o baseline; falta cobertura dos novos caminhos Server deve ser tratada por testes comportamentais da implementação antes do gate final. Registrar ACH-35 (coverage ratchet) e planejar cobertura Server ligada a D2/S2; integração somente após preparar stack local conforme AGENTS.

Diagnóstico detalhado de `/tmp/stardust-drizzle-complexity88c.log` contra87/88: Mapper reporting voltou a3 warning functions; FeedbackMessagesRepository permanece9; FeedbackReportsRepository caiu23→20, ficando um acima dos19 anteriores por `lockReport` (MI63) reutilizado por `save` e `changeStatus`. Os três paths autorizados totalizam32 contra31 pre88 e explicam os113 globais (os outros81 não mudaram). Não desfazer a seleção bloqueada compartilhada nem duplicar SQL para recuperar artificialmente um alerta; preservar esse limite reutilizado, continuar a redução global nos outros métodos/grupos D2 e reavaliar o residual de forma integrada. Correction C restaurou sete dos oito warnings introduzidos pela assignment88, não cumpre o teto global ≤112, e ACH-34 segue aberto até sensor final aprovado. Nenhuma nova mutation agora; principal solicitará review Database read-only.

### Review pareado D2-88-C — static pass, runtime pendente

Implementation Reviewer Database fez revisão read-only da correction no código atual e dos adapters legados; sem finding estático nos dois arquivos e sem mudança requerida em Rules. Confirmou mapping de fields/defaults/nullable/ISO/fallbacks, guards public/user/god/system, ownership, joins/count/preview/filter/pagination/summary/order, save sob lock/transação com status corrente e `greatest`, changeStatus com expected state/conflito canônico, read markers monotônicos e predicados de autoria/studio. Registrou que a resposta changeStatus via `report.dto` coincide com o adapter legado. Evidência dos sensors aceita conforme logs: code/types/unit/architecture/integrity passam; complexity113 vs120; coverage ratchet falha48.17% vs51.60%. Review estático passa, mas integração final segue pendente de runtime real de concorrência/status/read markers e persistência (CA-02/EV-01), além de fechar coverage. Próxima ação é registrar este review nos gates de definition, manter ACH-34/35 abertos e seguir preparação de D2/S2 sem nova alteração neste lote.

### Proposta/Assignment D2-89 — UsersRepository, rodada delimitada

Preparação read-only de Builder Database via CodeGraph, logs complexity87/88-C: `DrizzleUsersRepository.ts`+`DrizzleUserMapper.ts` mantêm os mesmos26 warning functions em ambos snapshots (Repository22, Mapper4). Assignment autorizada agora é **somente** `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`; `DrizzleUserMapper.ts` é explicitamente proibido/intocado nesta rodada. Refatoração proposta reaproveita `executeQuery`, `findOneResult`/`findManyResults` existentes e uma consulta única `exists` para containsByEmail/name sem mudar os predicados `ilike`, contagem ou ausência de guard atuais. Reaproveitar builder/execução de count apenas se tabela/filter forem inferidos da união exata já tipada; não criar SQL shadow types, casts, helper por tabela/campo ou split que aumente warning. Encaminhar os três removals via execução compartilhada mantendo guards e predicados; manter collections/projections/filters/order/pages/writes complexos na forma atual nesta rodada. Preservar acesso public/user/god/system, auth antes de query, `findById` retornos, OAuth-null, número/ordem de queries, count integer/default0, inclusive month range, list/count Promise.all/range/order, relações e transações atômicas. RF01/02/12 CA01/02/03/20/22; Rules Database/Code/Server/SDD. Mapper, models/Core/base/SQL/scripts/tests/docs/baseline/thresholds e todos os demais paths proibidos. Não criar testes dedicados de repositories/mappers/types/fixtures conforme Database Rules; validação de behavior por rotas/scripts em S2, sem considerar unit como prova DB. Exits de Builder: path/semantics e formatter focado, depois pause para ACK; principal rodará definition gates, conformance, code/types/unit/complexity/integrity/architecture e coverage aplicáveis, reviewer pareado. Complexity snapshot atual113 e coverage ratchet Server48.17% vs51.60%; ambas findings permanecem abertas e não autorizam baseline change. Próxima ação: mutation apenas após confirmar gates e ACK.

### Mutation D2-89 — checkpoint do Builder

Após confirmar Spec rev6, assignment89 e definition gates/ACK, Builder Database editou somente `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. Removido wrapper `run` duplicado em favor de `executeQuery`; `findOne`/plurais usam helpers herdados mantendo authorize e empty-IDs early return. Criado `exists` reutilizado por containsWithEmail/Name, mesmos select id/ilike/limit1 e Logical(Boolean), sem guard novo. Três deletes passaram builder direto ao `executeQuery`, mesmos guards/predicados/delete único e await público. Count builder/result reaproveitados por seis ports com union de tabelas inferida e ReturnType real, sem casts/shadow types; count integer/fallback0/Integer/queries, guards mensais, tabela e inclusive gte/lte preservados. addMany/replaceMany/addAcquiredInsignia permanecem com semântica e transação; somente wrappers usam execução comum. Mapper/paths restantes intocados. Builder reporta edição exit0 e Biome write/check focados exit0 (1 fix aplicado), sem testes/DB/sensores. Source/types/unit/complexity anteriores stale só neste path; alegações aguardam inspeção e validação. Próxima ação: gates documentais e inspeção, então principal libera conformance/sensores.

Inspeção atual da principal confirmou ownership de path e fronteiras: helpers existentes de execução/leitura, `exists` com predicado igual e ausência de guard, count union limitada a três models derivados e ReturnType; seis callers mantêm authorize antes; range mensal continua inclusivo; três deletes mantêm mesmo owner/filter; replaceMany/addAcquiredInsignia permanecem transacionais. Não vi divergência óbvia no trecho atual. Isso é leitura estática somente; type/runtime/complexity ainda não validados. Definition gates passam após o checkpoint; principal libera conformance e sensores da assignment89.

### Sensores D2-89 — parcial

Após mutation89: format focado exit0; `check:code` global exit0 (sete workspaces); `check:types` global exit0 (sete,1m23.498s); `test:unit` global exit0 (cinco workspaces, Server168 suítes/325 testes); architecture Server exit0 (863 módulos/1636 deps); test-integrity exit0. Complexity exit2 (sem erros),108 warnings,696 arquivos/2573 funções; queda5 sobre113 anterior e12 sobre a regressão de120; baseline/threshold intactos. Conformance exit1 esperada pelo mapa rev6 incompleto, `schema.sql` reservado D3 e outros paths Create/Modify/Remove ainda das waves futuras, sem finding isolado atribuído ao repository. Coverage Server ainda executa e o ratchet baseline permanece pendente; não presumir fechamento ACH-35.

Coverage Server terminou exit0:168 suítes/325 testes; statements/lines48.20%, branches88.97%, functions34.42%; duração287.011s. O gate baseline atual precisa ser repetido para esse snapshot de mutation89; esperado finding ACH-35 continua abaixo do limite registrado.

`npm run check:coverage` repetido pós89 exit1: Server lines/statements48.20% <51.60%, functions34.42% <47.11%; branches88.97% ≥82.98%. Core equal; Studio/Web above baseline. ACH-35 continua; nenhuma baseline alterada.

Implementation Reviewer Database realizou revisão read-only e não encontrou finding bloqueante introduzido por D2-89. Confirmou authorize-before-read/count, empty IDs, union count correspondente, Integer/count default, intervalos inclusivos, ilike/limit1, guards/deletes, relações/ordem e transactions. Observação de compatibilidade a esclarecer: o reviewer diz que o `.single()` Supabase antigo retornava false com múltiplas correspondências, enquanto Drizzle `limit(1)` retorna true; trata-se de comportamento anterior à assignment89. Spec documenta as portas e exige preservação de comportamento, mas não detalha esse caso. Pediu-se localização/fonte e severidade ao reviewer; verificar em S2 e registrar decisão antes de concluir Users. Review estático sem finding, aceite integrado e eventual disposição do edge case seguem pendentes.

### ACH-36 — cardinalidade de containsWithEmail/Name

Esclarecimento do Implementation Reviewer Database: Supabase legado `containsWithEmail`/`containsWithName` usava `.single()` e tratava `PGRST116` diretamente como Logical.false tanto para zero quanto para múltiplas linhas (`SupabaseUsersRepository.ts:492–525`). Drizzle anterior a D2-89 usa `.limit(1)` e retorna true para qualquer 1+ correspondência. Exemplo: `Ana Maria` e `Ana Paula`, busca `Ana`: false no legado, true no Drizzle. É discrepância preexistente, não introduzida por extração89; classificada pelo reviewer P2, pois afeta disponibilidade/validação. A Spec rev6 exige preservar comportamento dos ports sem exceção aprovada para essa semântica. Não aceitar como melhoria implícita. Abrir correction apenas no mesmo UsersRepository: consulta limitada a duas linhas e resultado Logical true somente com cardinalidade exata1, equivalente a `.single()` (zero/mais de uma false), sem alterar filtro ilike nem policy de guard. Sem testes dedicados proibidos pela Database Rules; validar em S2 via rota/script para as regras com uma e múltiplas correspondências e confirmar impacto. A revisão89 original não foi finding da mutation, mas ACH-36 bloqueia aceite de compatibilidade Users até correção/verificação. Plan/Evaluation definitions devem passar antes da nova assignment.

### Correction D2-89-F1 — equivalência de cardinalidade

Assignment formal após definição/review: Builder Database pode alterar somente `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`, especificamente helper `exists` e seus dois callers. Preservar `ilike('%value%')` e sem guard; buscar no máximo duas linhas e retornar Logical.true somente quando `rows.length === 1`, false para zero ou mais de uma, reproduzindo `.single()`+PGRST116 do Supabase. Nenhum teste dedicado de repository permitido; runtime S2 adicionará/registrará cenário real de uma e múltiplas correspondências no port existente/rota/script apropriado. Todos os demais paths proibidos. Formato focado e relato factual, pausa para ACK; depois principal repete code/types/unit/complexity/integrity/architecture e coverage aplicáveis e solicita review atualizado. ACH-36 fica aberto até esses gates e runtime; ACH-34/35 permanecem separados. Sem baseline/threshold change.

### Mutation D2-89-F1 — cardinalidade corrigida

Builder alterou somente helper `exists` em `DrizzleUsersRepository.ts`: query agora busca no máximo2 rows e retorna `Logical.create(rows.length === 1)`; callers/filtros/guards intocados. Replica `.single()` legado: cardinalidade zero e ≥2 false, exatamente1 true. Formatter write/check focados passaram exit0 sem fixes. Nenhum DB/test/sensor. Code/types/unit/complexity/coverage anteriores stale nesse path; principal vai inspecionar e registrar checkpoint antes de liberar novos sensores. ACH-36 aguarda confirmação pós-checks e runtime S2.

Inspeção da principal confirmou a query `limit(2)` e comparação de cardinalidade `=== 1`, com filtro e falta de guard nos dois callers inalterados. Gates Spec/Plan definition passaram após ledger mutation. Principal libera conformance e sensores repetidos, sem considerar runtime concluído.

Após F1: format focado e `check:code` global passaram exit0; `check:types` global passou nos sete workspaces exit0 (2m10.575s); `test:unit` global passou cinco workspaces exit0, Server168 suítes/325 testes e Web118/506 (2m36.461s); complexity permanece exit2 com108 warnings/0 errors (696 files/2573 functions), sem mudança baseline; architecture Server exit0 (863 módulos/1636 deps); test-integrity exit0. Conformance exit1 como esperado pelo mapa parcial rev6. Coverage Server ainda executa. `check:coverage` será rodado somente quando essa captura terminar.

Coverage Server após F1 passou exit0:168 suítes/325 testes; statements/lines48.20%, branches88.97%, functions34.42%; duração348.097s. Jest reportou um worker que não encerrou graceful e foi forçado ao final, porém todas as suítes passaram e processo exit0. Próxima ação: definition gates e `check:coverage` nesse snapshot; ratchet abaixo do baseline segue provável.

`npm run check:coverage` pósF1 terminou exit1: Server lines/statements48.20% <51.60%, functions34.42% <47.11%; branches88.97% >82.98%; Core equal, Studio/Web above baseline. ACH-35 aberto e nenhuma baseline alterada.

### Review ACH-36 / D2-89-F1 — static acceptance

Implementation Reviewer Database concluiu correção estática: `.limit(2)`+`rows.length===1` reproduz cardinalidades zero→false, um→true, ≥2→false do `.single()`+PGRST116; os dois contains mantêm ilike e ausência de guard. Nenhum mismatch restante; Rules No change. ACH-36 fechado como correção estática, não como integração final: S2 ainda prova cardinalidades0/1/múltiplas via rota/script com dados reais. Coverage ratchet e o restante da complexidade continuam abertos; sensors frescos F1 acima valem, coverage aguarda execução.

### Assignment D2-90 — CommentsRepository

Preparation read-only via CodeGraph e log disponível88-C (source não mudou em89/F1; root Complexity atual108): somente `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts`. Contagem oficial confirmada no log88-C: 9 warning functions no arquivo. Agrupados: query, list+callback, findManyByChallenge/Solution, addByChallenge/Solution+callbacks. Proposta autorizada: retirar `run` duplicado em favor de `executeQuery`; leituras podem usar `findOneResult`/`findManyResults` existentes preservando guards/mapper/query. Extrair **somente** operação compartilhada de insert de comentário root (`parentCommentId:null` + mapper) usada nas duas transações addByChallenge/addBySolution; manter inserts específicos de relação fora e na mesma ordem/transação, sem mudar await/Promise<void>. Reutilizar builder `linkedCommentsFilter` apenas se o union de `challengeCommentModel | solutionCommentModel` tipar naturalmente pela coluna real comum `commentId`; sem casts/shadow types; preservar root filters. Manter query/list/upvotes count intactos: joins/aliases e counts, paginação/range único, root parent IS NULL para rows/count, order selected field/direction, Promise.all duas queries/count fallback0. Guard owner/public/god/system, addReply/FK/parent e post-write read unchanged. Estimativa -3 a -5 warnings (path9→4–6), sem promessa; sensor oficial decide e proibido adicionar helpers para forçar meta. RF01/02/12; CA01/02/03/20/22; Database/Code/Server/SDD. Demais paths/Core/models/base/mappers/SQL/scripts/tests/docs/baseline/thresholds proibidos. Não criar teste unitário dedicado de repository; S2 testa thread/link/write→read/upvotes/page/ownership via rota/script. Builder formata e pausa para ACK; principal executa conformance/code/types/unit/complexity/architecture/integrity/coverage e reviewer pareado. Assignment aberta; não muda estado das findings ACH-34/35 nem autoriza runtime/remote write.

### Mutation D2-90 — checkpoint do Builder

Builder editou somente `DrizzleCommentsRepository.ts`. `run` duplicado removido, consultas usam `executeQuery`; findOne/replies usam `findOneResult`/`findManyResults` mantendo guards/query/mapper/order/null. Reutiliza `insertRootComment(transaction, comment)` para mapper+`parentCommentId:null` em addByChallenge e addBySolution; ambos mantêm authorizeOwner, transação, root insert antes do vínculo específico, mesmos dois inserts/ordem/Promise<void>. `linkedCommentsFilter` recebe union real de `challengeCommentModel | solutionCommentModel` e usa coluna comum `table.commentId`, sem casts/shadow types; os callers preservam FK predicates/subquery. Query/list/upvotes/count/aliases/joins/root IS NULL/duas queries Promise.all/range/order/fallback0 intocados; addReply/FK/ownership/write→read sem alteração. Format write/check focados exit0 (1 fix). Nenhum teste/DB/sensor. Code/types/unit/complexity anteriores stale no path; principal deve inspecionar e então liberar conformance/sensores.

Inspeção principal dos métodos autorizados viu o union real e subquery de vínculo, insert root com relação em sequência dentro da mesma transação, guards, joins/correlated counts, root filter e page rows/count preservados. Não detectei divergência estática óbvia. Definition gates passaram com mutation/inspeção registrados; principal libera conformance e sensores fresh.

D2-90 sensors fresh: format focado exit0; `npm run check:code` global exit0 (7 workspaces); `npm run check:types` global exit0 (7 workspaces, 4m13.374s); `npm run test:unit` global exit0 (5 workspaces, Server168 suites/325 tests; 4m56.662s); Server architecture exit0 (863 modules/1636 deps); test-integrity exit0. Complexity exit2 com102 warnings/0 errors, 696 files/2574 functions; caiu6 warnings e subiu uma função estrutural vs F1, sem baseline edit. `npm run test:coverage -w @stardust/server` exit0, 168 suites/325 tests, lines/statements48.21%, branches88.97%, functions34.41%, 617.705s. Conformance exit1 pelo estado parcial rev6, waves futuras e schema reservado para D3; sem falha isolada no assignment90. Próximo: executar `check:coverage` nessa captura, registrar resultado e pedir review Database pareado. ACH-34 e ACH-35 abertos; runtime S2 pendente.

`npm run check:coverage` pós D2-90 exit1: Server lines/statements48.21% <51.60%, functions34.41% <47.11%, branches88.97% >82.98%; Core igual e Studio/Web acima. ACH-35 continua aberto, sem alterar baseline.

### Finding D2-90-P1 — alias da subquery de replies

Implementation Reviewer Database encontrou bloqueio estático em `DrizzleCommentsRepository.ts:55`: interpolation raw da subquery recebe `reply = alias(commentModel, 'comment_replies')`, mas a expressão `FROM ${reply}` serializada como tabela ORM usa somente `Table.Symbol.Name` e gera `FROM "comment_replies"`, sem declarar `comments AS comment_replies`. Isso pode fazer as leituras `query()` falharem com relação inexistente; runtime ainda não executado. Correção autorizada somente no mesmo Repository: construir a subquery correlacionada por API ORM `.from(reply)` ou declarar a tabela original e alias explicitamente, preservando joins/counts/projeção/filtros/query semantics; não reescrever SQL fora do necessário. Builder deve confirmar SQL efetivo/serializer com evidência local, modificar só o path designado e pausar para inspeção/ACK. Depois repetir sensores aplicáveis e revisão pareada. D2-90 está bloqueada; ACH-35/34 e S2 runtime permanecem abertos. Definitions obrigatórias antes da correction.

### Correction mutation D2-90-P1 — alias declarado

Builder confirmou via CodeGraph a semântica do serializer PgDialect com o model real. Diagnostic `npm exec -- tsx /tmp/stardust-builder-database-comments-alias.ts` (não versionado, sem conexão) passou quatro asserções: antes, subquery gerava `from "comment_replies"` sem declaração; após, gera `from "comments" as "comment_replies"` e correlaciona `comment_replies.parent_comment_id = comments.id`. Mudou somente a expressão `repliesCount` no mesmo repository para interpolar `commentModel` e declarar o identificador alias explicitamente; projeção, integer count, correlação, joins, filtros, sort/page, query number e mutations permanecem iguais. Biome format write/check passou exit0 sem fixes. Principal inspecionou a expressão e repetiu o diagnostic (4 assertions, zero DB connections), aceitando a forma SQL para sensores. ACK concedido; executar sensores fresh e repetir review pareado. Diagnostic comprova serialização, não execução Postgres; S2 continua obrigatório.

D2-90-P1 correction sensors: format, code global (7), types global (7), Server architecture (863 modules/1636 deps), and test-integrity passed. Global unit first failed the Studio suite while Server coverage ran concurrently; Studio rerun in-band passed14/14 suites and64/64 tests, then the full unit retry passed (5 workspaces; Server168/325, Web118/506; total2m27.059s). Server coverage passed168/325 at48.21% lines/statements,88.97% branches,34.41% functions (561.296s); `check:coverage -- @stardust/server` exit1 for lines/statements and functions below baseline, branches above. Server-scoped complexity exit2:102 warnings,0 errors,696 files/2574 functions (same warning count as pre-correction); no baseline changes. Conformance exit1 remains only for incomplete rev6 paths/future waves/schema reserved for D3. Broad root `npm run check:complexity` separately exits1 with five threshold errors in existing Web paths: SseProfileChannel (cyclomatic 18/16), profile-events GET (Halstead1023.59), sign-up POST (length100/Halstead1497.47); onboarding-attempt has warnings only. Those paths are outside D2-90 and no changes were made; record as ACH-37 for later scope review. ACH-34/35 stay open; request paired D2-90 re-review after definitions.

### Review D2-90-P1 correction — static acceptance

Implementation Reviewer Database aceitou estaticamente a correction e fechou o finding P1. `repliesCount` declara `"comments" AS "comment_replies"`, correlaciona `comment_replies.parent_comment_id = comments.id`, preserva `count(*)::integer`/`sql<number>` e mantém contagem por root comment. Nenhum outro mismatch estático neste assignment; guards, filtros, joins, order, page, transações e Rules sem mudança. O diagnóstico PgDialect não prova execução Postgres. ACH-34/35 e ACH-37 permanecem abertos; S2 runtime ainda é requerido, portanto aceite integrado pendente.

### ACH-37 — Complexity Errors em paths W1 novos

Root `npm run check:complexity` exit1 encontrou seis violações em cinco funções de três paths Web classificados como Create pela Spec rev6 e inexistentes no baseline HEAD: `apps/web/src/realtime/sse/channels/SseProfileChannel.ts` (factory/onCreateUser CC18; onUserCreated CC16), `apps/web/src/app/api/auth/profile-events/route.ts` (GET Halstead1023.59) e `apps/web/src/app/api/auth/sign-up/route.ts` (POST length100, Halstead1497.47). `onboarding-attempt/route.ts` tem apenas warnings, fora desta correction. Implementation Reviewer Web classifica ACH-37 P2, bloqueante CA-22/quality gate, sem falha funcional ou de segurança constatada; o review W1 anterior verificou comportamento/BFF/types/coverage/architecture/integrity/Playwright, mas não complexity. Correção formal nos mesmos três paths, sem amendment da Spec: Builder Web deve usar CodeGraph, extrair responsabilidades coesas (validação de frame/evento, configuração do cookie, sanitização/forwarding de headers), preservar contratos e comportamento, sem helpers artificiais, exclusões, baseline/threshold edits ou paths adicionais. Após mutation, pausa para principal; rodar Complexity Web + code/types/unit + BFF suites e três Playwright cases W1, depois paired re-review. ACH-37 aberto até correction/review/sensors; não misturar com D2-90.

### Assignment D2-91 — ChallengesRepository; Mapper permanece intacto

Preparação read-only via CodeGraph/legacy e sensor: paths revisados `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts` e `.../mappers/challenging/DrizzleChallengeMapper.ts`; proposta aprovada somente para o Repository porque o Mapper possui traduções independentes e a extração de seus warnings criaria fragmentação. Autorizada mutation em `DrizzleChallengesRepository.ts` para extrair e reutilizar apenas o predicado composto `voteFilter(challengeId,userId)` nos três callers `findVote`/`replaceVote`/`removeVote`; preservar authorizeOwner, predicado de identidade e SQL, um read/update/delete por port, `limit(1)`/none, up/down vote mapping incluindo none→downvote já vigente, retorno/await/Promise<void>, transaction replacement categorias, guards/policies visibilidade e leitura/post-write. Não alterar ChallengeMapper, Core/models/ports, outros paths, baselines, thresholds, testes dedicados de repository/mapper nem comportamento edge implicitamente. Mapper permanece intacto apesar de 3 warning functions. Alvo Repository17→aprox15 (-2 warning functions), sem promessa; novo warning possível não autoriza microhelper adicional. RF01/02/12 CA01/02/03/20/22; Database/Code/Server/SDD. S2 posterior valida público/privado/God/didático, vote absent/add/replace/remove, categorias rollback, counters/order/pagination/expiry via rota/script e Supabase local. Builder edita/formata o único path, relata e pausa; principal inspeciona e libera sensores/review pareado. ACH-34/35/37 continuam separados.

### ACH-37 mutation checkpoint Web Builder

Builder alterou somente os três paths permitidos. `SseProfileChannel`: validadores `isUserCreatedPayload`/`parseUserCreatedFrame` isolam JSON/shape/canonical event id; `onUserCreated` permanece lifecycle de dedupe/close/notify. `profile-events/route`: `PRIVATE_RESPONSE_HEADERS` e `createStreamResponse` centralizam strip/cache/no-buffering; GET preserva auth/receipt precedence, request.signal, upstream path/status e 204/502. `sign-up/route`: extração de `setAttemptCookie`, `createFailureResponse`, `createValidationResponse`, `createSignUpResponse`; POST coordena origin/schema/fetch e mantém os contratos de body/status/cookie/receipt. Reviewer não autorizou onboarding-attempt, outras rotas ou alteração de threshold/baseline. Format focused write/check exit0 com2 fixes. Sem sensors/tests após mutation. Principal inspecionou os três paths; as boundaries parecem coesas, contracts/status/auth/cookie/header behavior preservados sem divergência estática óbvia. Definition gates após registrar inspeção; ACK para sensores Web, BFF e três Playwright cases.

### Finding ACH-38 — signup page bypasses BFF

Playwright `auth/sign-up.test.ts` initially timed out awaiting browser `POST /api/auth/sign-up`; BFF middleware cases passed. Wiring showed `AuthService(restClient)` inherited the integration base `/api/tests/server`, bypassing `/api/auth/sign-up`. `useRestContextProvider.ts` belongs to W2 in the canonical Plan; record this as a narrowly authorized early W2 composition correction that unblocks W1's signup/BFF route, not one of W1's original twenty paths. P1 cross-wave functional integration blocker. Correction: a dedicated no-cache `NextRestClient` based on same-origin Web `/api`, injected only as the signup client; other services keep the Server/test client. No endpoint/schema/contract change. Focused Playwright later confirmed the BFF POST and success. Full W2 behavior remains sequenced after S2/C1.
ACH-38 correction mutation/checkpoint: como correção estreita antecipada em path de composição W2, Builder alterou somente `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`: cria `signUpRestClient` sem cache com base `new URL('/api', CLIENT_ENV.stardustWebUrl).toString()` e o injeta como segundo argumento de `AuthService(restClient, signUpRestClient)`. `profileService`, `spaceService`, shop e outros permanecem no `restClient` existente. Principal inspecionou a separação de rotas; format focado exit0. Definitions passaram antes do ACK/sensores.

ACH-38 focused Playwright: `npm --workspace @stardust/web run test:integration -- src/app/tests/auth/sign-up.test.ts -g 'waits for realtime user creation|BFF middleware'` passed 4/4 in 16.9s in isolated ServerMock environment at 3100. Signup UI observed browser `POST /api/auth/sign-up` and success after mocked `user.created`; BFF contract asserted 201 signup, 200 resume, 200 SSE; Origin/invalid-receipt rejections passed.

Full Web integration completed 82/88 (8.6m). Signup happy path and BFF passed. Six failures are W2 acceptance cases: two signup resume/restore cases and four social existing-account/no-token cases duplicated across 390×844/1440×900. Artifacts are under `apps/web/test-results/*/error-context.md`; they show absent resume state and incorrect social pending/welcome route. These keep W2/EV-07/EV-08 and the full Web suite open; they do not negate the focused ACH-38 path proof. No credentials used; D-07 excludes manual social flow. Global code/types/integrity and Web architecture passed, unit passed five workspaces with concurrency 1. Complexity now has zero errors (root 118 warnings; Web16 warnings), so warning quality ratchet remains open. Web coverage 118 suites/506 tests passed at lines25.58%, statements24.74%, branches27.58%, functions22.11%; coverage baseline ratchet pending.

Paired Implementation Reviewer Web accepted ACH-37 complexity correction and ACH-38 composition correction statically. The browser request proof 4/4 passes and confirms `/api/auth/sign-up`; six broader failures are W2 pending behavior and block W2/full integrated acceptance only. Record `useRestContextProvider.ts` as canonical W2 ownership with the narrowly authorized early correction; do not redefine original W1's 20 paths. CA-22/full warning quality gate remains open because complexity exits retain warnings despite zero hard errors. Web coverage ratchet passed: lines25.58% >24.76%, statements24.74% >23.93%, functions22.11% >21.59%, branches27.58% >27.07%. D2-91 may proceed after these ledger/definition gates; S2/W2/C1 remain pending.

D2-91 mutation checkpoint: Builder modified only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`, adding `voteFilter(challengeId: Id,userId: Id)` with the existing two `eq` predicates, reused by `findVoteByChallengeAndUser`, `replaceVote`, and `removeVote`. Principal inspected source: three owner guards remain before their operations; select/update/delete count, `limit(1)`, absent→`none`, none→downvote for writes, awaits and `Promise<void>` are preserved. Visibility/listing/category projection and replacement transaction are outside the change. Formatter write/check exit0; no sensor/DB evidence after mutation. Checkpoint recorded and definitions must pass before fresh sensors/paired review; no further mutation until fresh sensor capture.

D2-91 fresh sensors: format, root code (7 workspaces), root types (7), root unit (5 workspaces: Server168/325, Core176/638, Web118/506, Studio14/64, LSP1), Server architecture (863 modules/1636 dependencies), and integrity passed. Server complexity exit2 has 99 warnings/0 errors,696 files/2575 functions, down3 warnings from102; ChallengesRepository has14 warning functions vs17, no baseline/threshold edits. Server coverage passed168 suites/325 tests at lines/statements48.23%, branches88.97%, functions34.39%. `check:coverage` exits1 because Server lines/statements48.23<51.60 and functions34.39<47.11; branches88.97>82.98. ACH-35 remains open; no baseline changed. These are static/test/coverage signals only; S2 PostgreSQL runtime remains required. Await paired Database review before next mutation.

Paired Implementation Reviewer Database accepted D2-91 statically with no finding. The two-column vote predicate and operation behavior are unchanged; Rules No change. ACH-35, complexity warning gate, and S2 runtime remain open, separately from this accepted repository extraction.

### Assignment D2-92 — ACH-34 bounded reuse in code executions

Read-only diagnosis via CodeGraph/sensor inspected only already-authorized D2 challenging repositories. No safe batch with credible ≥6-warning reduction was found without uncertain single-use helpers. Bounded candidate: only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts`. Extract/reuse the real ordered select/from/filter/DESC-createdAt query shared by `pageRowsQuery` and `findLatest`; consumers apply only offset/limit or limit(1). Optionally remove the redundant async wrapper in the add executeQuery callback only if it preserves transaction/error/await behavior and remains cohesive. Preserve all guards, existing filters, counts + Promise.all, range/order/tie/fallback, insert payload/transactions, and the current existing-cast/result mapping. Do not split `countIncorrect` or its wrong-answer aggregation; query/summary semantics are tightly coupled. No Models/Core/Mapper/other paths/tests/SQL/scripts/docs/baselines/thresholds. Target -2/-3 warning functions if measured, not guaranteed; no artificial follow-on helpers. This is bounded progress toward ACH-34, not approval to claim its global ≤112 factual target. RF01/02/12 CA01/02/03/20/22; Rules Database/Code/Server/SDD. Builder edits/formats one path, pauses; principal inspects, definition gates, then sensors/reviewer. Runtime remains S2.

D2-92 mutation checkpoint: Builder changed only `DrizzleChallengeCodeExecutionsRepository.ts`. `orderedExecutionsQuery(filter)` now owns the existing select/from/where/DESC-createdAt builder; page rows add the same calculated offset/limit and latest adds limit(1). The `add` executeQuery callback directly returns the insert builder instead of wrapping it in an async await block. Principal inspected: authorization/filter, count query and Promise.all, range, ordering, fallback, mapper, current testResults cast/reduction, insert payload and public awaits/error boundary remain unchanged. Formatter write/check exit0 with one fix. No sensors/DB after mutation; checkpoint registered and definitions before ACK.

D2-92 fresh sensors: format, global code (7), types (7), unit (5 workspaces: Server168/325, Core176/638, Web118/506, Studio14/64, LSP1), Server architecture (863 modules/1636 deps), and integrity passed. Server complexity exit2 has96 warnings/0 errors,696 files/2576 functions, down3 warnings vs99; no baseline/threshold edits. Server coverage passed168 suites/325 tests at lines/statements48.24%, branches88.97%, functions34.37%. Coverage ratchet exit1 because Server lines/statements48.24<51.60 and functions34.37<47.11; branches88.97>82.98. ACH-35 remains open. Global root complexity has not yet been recaptured after D2-92; ACH-34 remains open until root-wide sensor verifies the historical ≤112 target and quality gate status. S2 runtime pending.

Root-wide `npm run check:complexity` fresh after D2-92: exit2,112 warnings/0 errors,3471 files/9143 functions. The historical global ≤112 factual target from ACH-34 is met exactly, with no baseline/threshold edit; however the sensor command remains nonzero due warnings, so CA-22/complexity quality gate is not passed. D2-92 still needs paired review. ACH-35 coverage ratchet and S2 runtime remain open.

Paired Implementation Reviewer Database accepted D2-92 statically with no finding. The ordered query builder preserves page/latest consumers and authorization; add's directly returned insert remains awaited by executeQuery. Rules No change. ACH-34's numeric target is met at exactly112 warnings, but `check:complexity` exits2 and CA-22 remains open. D2 consolidated review and S2 app-runtime matrix are separate pending gates.

Consolidated paired Database review: D2 remains `in_progress`; local migrate/adopt/rollback, mixed concurrency, CLI guards, and legacy replay are evidenced, but exit is not accepted. CI-06 `check:test-integrity` passed/current; remaining blockers are ACH-35 coverage ratchet and CI-09 complexity sensor exit2/CA-22. Reviews 89–92 accept only their scoped diffs; no claim that all 25 adapters are consolidated-reviewed or runtime-proven. S2/C1 remain sequenced separately; no remote status inferred.

Reviewer clarification: D2 local exit does not wait for S2 HTTP EV-04 or CA-01/02/EV-01/02; those are pending S2 as the phase text states. Whole76 supports local EV-03 and the specified EV-04 catalog/SQL/DataAPI/clone portions. CI-06 is passed/current. D2 stays in_progress specifically because ACH-35 coverage ratchet and CI-09 complexity exit2 are applicable failing sensors; the historical ≤112 warning count does not override the tool's `--max-warnings 0` result.


ACH-34 execution checkpoint: Plan definition initially flagged an accented Portuguese word due to its ASCII word-boundary rule; the wording was changed to `específicos a cada operação`, with no gate/baseline change. Spec and Plan definition gates now pass. Database checkpoint B edits only `DrizzleChallengeMapper.ts` and `DrizzleSolutionMapper.ts`; author/publication/exercise/evaluation/engagement grouping preserves existing projections and persistence values, formatter write/check exit0, no sensors yet. Web mutation01 plus bounded correction touched the five W1-owned paths only; principal inspection approved the three order/fresh-Date corrections. The initial comparison was against the repository `HEAD`; W1's current Spec explicitly requires `post` response headers, and that behavior is in the approved pre-ACH-34 state, so it is preserved without source correction. No sensors/reviewer approval yet.

Database checkpoint C changes only `DrizzleUserMapper.ts`; identity/performance/routine/ranking, selection/profile, relationship IDs, and persistence fields are grouped while preserving existing fallbacks and flatMap behavior. Formatter write/check exit0; principal inspection found no semantic discrepancy. No sensors/runtime yet. Web's five W1 paths passed principal source inspection against the current Spec: SSE listener identity/dedupe/close/notify order, route auth/receipt precedence, Origin/schema handling, abort/cache/status/header/cookie forwarding remain intact; `post` response headers are required by W1 and remain unchanged from its pre-ACH-34 state. No source correction is needed. The next checkpoint is focused tests and applicable sensors before paired review.

Database checkpoint D changes only `DrizzleChallengeCodeExecutionMapper.ts`, `DrizzleFeedbackMessageMapper.ts`, and `DrizzleFeedbackReportMapper.ts`. The existing outcomes/casts/date conversion, attachment ordering and row projection, report text/avatar fallbacks, null handling, and persistence payloads were preserved under grouped helpers. Focused formatter write/check passed after two write fixes and an annotation fix; principal inspection found no static behavioral discrepancy. No sensors/runtime yet; next batch remains the three D2 models and eight repositories.

W1 focused validation checkpoint: formatting, Web code lint (exit0; 171 existing warnings and 2 infos), Web types, unit suite (118 suites/506 tests), affected BFF Jest (3 suites/26 tests), and BFF middleware Playwright (3 cases) pass. Scoped Web complexity remains failed: 17 warning functions and one error function in the five W1 paths, plus one independent W2 warning. SSE has no warning; REST client has six warnings and the factory error; the three routes account for the other eleven warnings. The detector identifies functions by path/name/start-line, so inserting top-level helpers shifted identity and exposed pre-existing client findings; no baseline/threshold edits are permitted. W1 stays open; next bounded correction must restore declaration identity and remove substantive W1 findings without touching W2. Logs are `/tmp/stardust-drizzle-ach34-w1-{format,code,types,unit,complexity,bff,browser}.log`.

Database checkpoint E changes only `challenge-code-execution-model.ts`, `user-model.ts`, and `feedback-report-model.ts`. Exact callback ordering, SQL predicates, defaults, column names, FK actions, `DESC NULLS FIRST`, and check/index names were preserved; `BuildExtraConfigColumns` types the private feedback-report callbacks without casts/exports. Focused format write/check passed; metadata parity, types, and runtime remain pending. Eight D2 repositories remain.

Web correction checkpoint: only `NextRestClient.ts` and the three BFF route files changed; SSE remains untouched. New private helpers were moved after existing public handlers/factory to restore the baseline identities by original start line. REST JSON body/response/error dispatch and BFF fetch/response/error paths use promise composition; upstream fetch wrappers remain async so synchronous exceptions become rejections handled by the same 502 responses. Principal inspection found endpoint, status/body/header, request/auth precedence, query/cookie timing, abort/cache, and stream behavior preserved. Focused format exit0; sensors after this correction are pending. No new helpers were added.

Database checkpoint F changes only `DrizzleChallengeCodeExecutionsRepository.ts` and `DrizzleChallengeSourcesRepository.ts`. Query selection/ordering, filters, count and aggregation semantics, existing casts, joins, pagination, locks, transactions, foreign-key/null/default behavior remain unchanged. Formatter write/check exit0 (two writes then clean checks). Six D2 repository paths remain; no sensors/DB ran.

W1 post-correction validation: format/code/types/unit (118 suites/506 tests), affected BFF Jest (3 suites/26 tests), and BFF middleware Playwright (3 cases) pass. Scoped complexity exits2 with zero error functions, 14 warning functions in W1 and one warning in W2. Restored baseline identities removed the factory/getFromUrl/getFile/post findings; SSE stays clean. Remaining W1 MI-only findings: REST `postFormData`, `sendJsonRequest`, `createJsonResponse`; onboarding-attempt GET/absentAttempt; profile-events GET/getAuthorization/createStreamRequestHeaders; signup POST/getAttemptMaxAge/setAttemptCookie/createValidationResponse/getAttemptReceipt/fetchSignUp. No CC/length/volume threshold findings. W1 remains open because its zero-warning exit gate is not met; Builder's cohesion review recommends leaving several 8–9-line single-responsibility functions intact rather than splitting them solely to improve MI. Logs: `/tmp/stardust-drizzle-ach34-w1-correction-{format,code,types,unit,bff,browser,complexity}.log`.

Database checkpoint G changes only `DrizzleCommentsRepository.ts` and `DrizzleSolutionsRepository.ts`. Root-comment/list filters, `comment_replies` alias, projection/count/page queries, writes and ownership guards are preserved. Solution publication/title filters, listing order/range, immutable proposal checks, row lock/view increment transaction, owner dispatch and upvote compound predicate remain equivalent. Formatter write/check passed after two fixes; four D2 repository paths remain. No DB or runtime tests yet.

Database checkpoint H changes only `DrizzleFeedbackMessagesRepository.ts`. Public/user/God/system authorization behavior, report ownership, JSON attachment projection/order, lock order, idempotent identity/content checks, closed-report guard, inserts, attachment comparison, and transaction/roundtrip boundaries are preserved. Focused format write/check exit0 (one write fix); no DB/tests/sensors ran. Three D2 repository paths remain.

Database checkpoint I changes only `DrizzleFeedbackReportsRepository.ts`. Author/profile/email projection and null handling, legacy/author/admin page defaults/caps, query counts/summary, filters/order, save/status lock+transaction boundaries, canonical conflict checks, greatest activity/read updates, and authorization remain unchanged. Formatter write/check exit0 (one initial fix); no DB/tests/sensors ran. Two repositories remain.

W1 correction M04 post-capture: format/code/types/unit (118 suites/506 tests), focused BFF (3 suites/26 tests), and BFF middleware Playwright (3 cases) pass. Scoped complexity exits2 with zero errors, 10 W1 warning functions and one separate W2 warning. Four candidates crossed MI65: `createJsonResponse`, `getAuthorization`, `getAttemptMaxAge`, and `createValidationResponse`. Remaining W1 warnings: `NextRestClient.postFormData` 61.7 and `sendJsonRequest` 63.1; onboarding GET 64.1 and absentAttempt 63.4; profile GET 62.6 and createStreamRequestHeaders 62.6; signup POST 61.6, setAttemptCookie 63.4, getAttemptReceipt 60.8, fetchSignUp 63.6. All are MI-only, with no CC/length/volume failures. ACH-34 remains open. Logs: `/tmp/stardust-drizzle-ach34-w1-m04-{format,code,types,unit,bff,browser,complexity}.log`.

Database failed checkpoint J: the attempted `DrizzleChallengesRepository.ts` refactor did not format or parse (Biome write/check exit1; 30 parse errors). Inspection found a trailing comma in the category query and an expiration hunk applied to the wrong callback, leaving `remove`/`expireNewChallengesOlderThanOneWeek` malformed. No sensor/DB ran, no semantics accepted, and `DrizzleUsersRepository.ts` remains untouched. Correct only this same path by restoring `remove` to its exact original delete behavior and extracting the intended expiration query in its unique method context; do not edit another path until principal re-inspection and definition gates.

Database checkpoint J-F1 correction: only `DrizzleChallengesRepository.ts` changed. The category subquery now parses without the residual comma; `remove` again performs the original owner-filtered delete; expiration filtering/query extraction sits after the authorized God/system expiration operation and preserves `isNew = true`, `createdAt <= Date.now() - 7 days`, and `.set({ isNew: false })`. Principal inspection confirms the malformed callback boundaries are restored; focused Biome write exit0 (one fix) and check exit0. No type, DB, or behavior sensors yet; `UsersRepository.ts` is the only remaining D2 path.

W1 mutation M05: four paths changed (`NextRestClient.ts` and the onboarding-attempt, profile-events, and sign-up routes). Removed `return await` only from promise-forwarding methods/functions that have no local catch/finally; async wrappers stay, preserving synchronous fetch errors as rejected promises and caller catch behavior. `getAttemptReceipt` now reads `expiry.getTime()` once only after the same upstream-ok/receipt short-circuit, and calls Date.now only after finite expiry. Principal inspection found behavior/order preserved. Focused formatter exit0; fresh tests/sensors pending.

W1 M05 validation: format/code/types/unit (118 suites/506 tests), affected BFF Jest (3 suites/26 tests), and BFF middleware Playwright (3 cases) pass. Complexity exits2 with zero errors, 10 W1 MI warnings and one W2 warning; M05 improved scores but no additional function crossed MI65. Current residuals are `postFormData` 61.9, `sendJsonRequest` 63.3, onboarding GET 64.1/absentAttempt 63.4, profile GET 62.6/createStreamRequestHeaders 62.6, signup POST 61.6/setAttemptCookie 63.4/getAttemptReceipt 61.5/fetchSignUp 63.8. No CC/length/Halstead findings. W1 and ACH-34 remain open; do not treat the unchanged count as a pass. Logs: `/tmp/stardust-drizzle-ach34-w1-m05-{format,code,types,unit,bff,browser,complexity}.log`.

Paired W1 Implementation Reviewer: functional contracts and applicable tests clear, but verdict **failed** solely on the explicit zero-warning complexity exit. IR-01 lists 14 MI-only W1 findings; no waiver, baseline update, or threshold change. Reviewer confirms the current helper boundaries and tests preserve request/auth/response/cookie/header/query/abort/stream behavior. W1 remains in progress until zero warnings and a fresh review.

ACH-34 W1 read-only triage proposes only real simplifications before the next mutation: `getAuthorization` will read the access cookie once while preserving any non-null Authorization header (including empty string); `getAttemptMaxAge` will name the existing duration/remaining-seconds steps without changing duration→getTime→Date.now order; validation response will remove fallbacks only where the concrete validation factory contract guarantees both fields and preserve the two-field output; response-header spread will omit the no-header empty object; REST retry authorization callback will be passed through rather than wrapped again. The Builder is also evaluating reuse of a shared no-store header initializer for the two JSON 502 paths, with fresh cookie expiry/Secure values and stream-specific cache directives preserved. These candidate changes have not run a sensor and no warning is claimed resolved.

W1 mutation checkpoint: four authorized paths changed (`NextRestClient.ts`, onboarding-attempt, profile-events, and sign-up); SSE untouched. The refresh callback is passed through to the existing error handler, Authorization header/cookie lookup now reads the cookie only after a null header, max-age locals preserve clock read order, validation response projects the contract's required fields, header response construction omits an empty false-branch object, and two routes share an immutable no-store header initializer. Principal inspection finds empty Authorization precedence, lazy refresh, header omission/presence, validation output shape, clock/Secure/expiry timing, response statuses/cache and SSE behavior preserved. Focused format exit0; all prior tests/complexity/review evidence is stale until rerun.

W1 M06 read-only triage: the only plausible bounded change is removing `async` from private `sendJsonRequest` in `NextRestClient.ts`; it returns the existing fetch Promise and its four public callers remain async, preserving their rejection behavior. This may improve MI 63.3 but is not expected to resolve all ten W1 warnings. The remaining nine residual functions have no identified cohesive simplification that preserves multipart, auth, cookie/clock, response, and error-mapping contracts. No source mutation or gate relaxation is authorized by this triage; ACH-34 remains open pending measured results and any further evidence-backed solution.

Database checkpoint K: only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts` changed. The user-read projection now groups appearance/progress/collection fields around reusable SQL relationship projections; listing filters/order/count mapping, relationship writes/deletes, insignia acquisition, star readers, and month counts are organized around shared query/predicate boundaries. Principal inspection confirms the visible guards, SQL key/table/owner values, filters, joins/order, offsets/counts, empty-list behavior, bulk insert, sequential updates in one transaction, insignia lookup→error→insert order, owner-scoped deletes, and inclusive month bounds remain intact. Formatter write/check exit0. D2 ACH-34 source batch is complete; type/runtime/sensors and consolidated review remain pending.

W1 M06 mutation checkpoint: only `apps/web/src/rest/next/NextRestClient.ts` changed; `sendJsonRequest` lost its redundant `async` modifier and retains its Promise-returning implementation. Public async callers are unchanged. Principal diff inspection confirms the one-token source change; formatter exit0/no fixes. Fresh W1 sensors and paired review pending.

Database K fresh sensors (source frozen): `check:code` passed 7/7 workspaces; `check:types` passed 7/7; `test:unit` passed 5 workspaces (Server 168 suites/325 tests, Core 176/638, Web 118/506, Studio 14/64, LSP 1); Server architecture passed (863 modules/1,636 dependencies); test integrity passed. Server-scoped complexity exits2 with 57 warnings/0 errors (696 files/2,735 functions), down39 from96; all warnings are in the 18 ACH-34 D2 paths, and no baseline/threshold changes were made. Conformance revision7/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` exits1 only for future contracted paths not yet implemented and `schema.sql` reserved to D3; 16 unrelated paths are ignored. Logs `/tmp/stardust-builder-database-ach34-k-{code,types,unit,architecture,integrity,complexity,conformance}.log`. ACH-34/CA-22 remain open; S2 runtime, coverage ratchet and consolidated Database review remain pending.

W1 M06 fresh sensors: focused format/code/types exit0; unit passed 118 suites/506 tests; affected BFF Jest passed 3 suites/26 tests; BFF middleware Playwright passed 3 cases. Scoped Web complexity exits2 with 10 W1 MI-only warnings, one independent W2 provider warning, and zero errors; removing `async` did not change any score. Residual scores are unchanged from M05. Logs `/tmp/stardust-drizzle-ach34-w1-m06-{format,code,types,unit,bff,browser,complexity}.log`; second-pass read-only triage is pending. No threshold/baseline edits.

W1 M07 read-only candidate evaluated and rejected before mutation: a faithful formatter-preserving prototype for named `JsonResponseOptions` measured `postFormData` MI61.9→63.5 and `sendJsonRequest` MI63.3→64.0; `put`/`patch` rise 70.0→72.7, while `delete` falls 69.9→66.8. None of the current warnings crosses MI65. An earlier collapsed-type prototype incorrectly predicted 66.6 and is superseded. This adds no source mutation and is not a viable ACH-34 correction; thresholds/baselines remain untouched.

### Assignment D2-93 — residual queries/columns, lote estreito

ACK de source somente para três paths já pertencentes ao D2/ACH-34: (1) `DrizzleChallengeCodeExecutionsRepository.ts`: em `incorrectExecutionsQuery`, declarar a lista fixa já usada de três status e vinculá-la às duas colunas selecionadas sem alterar nomes, filtros ou união; (2) `DrizzleSolutionsRepository.ts`: em `updatePublication`, persistir explicitamente `title`, `content` e `slug` do DTO existente, equivalentes aos getters confirmados por CodeGraph; não persistir DTO completo; (3) `DrizzleCommentsRepository.ts`: dar ao agregado correlacionado de replies a mesma responsabilidade autônoma que `upvotesCount`, preservando literalmente alias, SQL e projeção. Sem helpers novos, paths fora dessa lista, alteração de joins/guards/ordem/transações, ou baseline/threshold changes. Builder formata os três paths e pausa. Principal inspeciona, passa Definition gates e, se a mutation estiver coesa, autoriza sensores; runtime Server continua S2. MI estimado pelo triage não é evidência. O objetivo da assignment é avanço comportamentalmente neutro em direção ao zero-warning, sem waiver.

Database D2-93 mutation checkpoint: only the three assigned files changed. `incorrectExecutionsQuery` binds the same `status`/`testResults` columns and the same three wrong/syntax/runtime statuses via the model's inferred status type; `updatePublication` persists explicitly destructured `title`, `content`, `slug` with the existing id/owner predicate; comments `readColumns` names the existing correlated replies-count SQL locally and preserves its alias/projection. Principal source inspection found query fields, predicates, guards, aliases, order, and writes unchanged; no new helper/cast. Focused formatter write/check exit0. Definitions gates required before any sensor ACK; no sensors/runtime yet.

Database D2-93 fresh sensors, source frozen: format, global `check:code` (7/7), `check:types` (7/7), `test:unit` (Server168/325; Core176/638; Web118/506; Studio14/64; LSP1), Server architecture (863 modules/1,636 dependencies), and test integrity passed. Server complexity exits2 with56 warnings/0 errors, down1 from K57. `updatePublication` cleared its warning; `incorrectExecutionsQuery` remains63.8 and Comments `readColumns`63.1, below MI65. Conformance rev7/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` exits1 for future contracted paths only; 16 unrelated ignored. Logs `/tmp/stardust-builder-database-d2-93-{format,code,types,unit,architecture,integrity,complexity,conformance}.log`. No DB/runtime. ACH-34/CA-22 remain open; read-only triage of the two residual D2-93 functions is pending.

### Assignment D2-94 — composição pura do SolutionMapper

ACK de source somente para `apps/server/src/database/drizzle/mappers/challenging/DrizzleSolutionMapper.ts`: mover os sete helpers privados existentes para funções locais do módulo não exportadas, mantendo as assinaturas e corpos, enquanto `toEntity`/`toPersistence` permanecem a API pública estática e chamam as funções léxicas. É composição stateless sem `this`, override ou estado; não criar funções extras nem alterar campos/fallbacks/counters/createdAt/authorId→userId/name/slug/avatar/getters/relações. Os demais mappers e paths ficam fora do lote. A hipótese de +1–4 MI/0–2 avisos é não medida. Formatter, inspeção principal e Definition gates antes dos sensores; se não houver redução semântica/medida ou houver nova warning, não ampliar o lote automaticamente. Sem DB runtime.

D2-93 paired Implementation Reviewer: **accepted scoped batch, no findings**. Confirmed inferred 3-status list/columns, explicit DTO-backed title/content/slug under unchanged owner predicate, and unchanged correlated replies SQL/alias. Reviewer explicitly did not grant consolidated D2 exit, runtime proof, or complexity waiver; ACH-34 remains open at 56 warnings.

D2-94 mutation checkpoint: only `DrizzleSolutionMapper.ts` changed. Source inspection counts seven existing helpers (`author`, `authorProfile`, `publication`, `engagement`, `persistencePublication`, `content`, `persistenceContent`); each now is a non-exported module function with its existing signature/body, and public static `toEntity`/`toPersistence` call them lexically. IDs, null fallbacks, fields, spread order, counters, timestamps, and write getters are visibly unchanged; no new helper/type/cast/export. Formatter write/check exit0. No tests/sensors/DB yet; principal correction notes the assignment estimate said eight, but actual source had seven.

D2-94 fresh sensors, source frozen: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Server complexity exits2 with55 warnings/0 errors, down1 from D2-93; `Solution.toPersistence` crossed MI65 and `toEntity` rose62.9→63.7 but remains warning. No new warning. Conformance rev7/base still exits1 for future contracted paths. Logs `/tmp/stardust-builder-database-d2-94-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime. Paired D2-94 review pending; ACH-34/CA-22 remain open.

Root-wide complexity snapshot after D2-94/W1 M06, before further mutations: `npm run check:complexity` exits2 with66 warnings/0 errors across3,471 files/9,327 functions (9,261 clean). All66 warnings are feature paths currently assigned/integrated: Server55, W1 Web10, W2 provider1; no unrelated path warning is present in this capture. Root log `/tmp/stardust-drizzle-ach34-root-current.log`. This confirms CI-09 remains failed and locates its complete current residual set; no threshold/baseline edit.

### Assignment D2-95 — condições locais de FeedbackReports

ACK source somente para `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`, nas três funções existentes: (1) `periodFilter`: escolher o mesmo período legacy/current, retornar `undefined` se ausente e manter os limites inclusivos `gte(startDate)`/`lte(endDate); (2) `savedAdminActivity`: no ramo admin, vincular localmente `lastAdminMessageAt`/`studioReadAt` e preservar os mesmos `greatest` com parâmetros null; ramo não-admin retorna os valores correntes exatamente; (3) `searchFilter`: substituir o ternário aninhado por retornos diretos, preservando cálculo/fallback de `search`, legacy authorName-only e pesquisa atual por id/email. Sem novos helpers, casts, outros paths ou alteração de guards/queries/transactions/baseline/threshold. Builder edita/formata apenas esse path e pausa; principal inspeciona, Definition gates precedem sensores. Hipótese de 0–2 avisos não é compromisso. Sem DB runtime.

D2-95 mutation checkpoint: only `DrizzleFeedbackReportsRepository.ts` changed. `savedAdminActivity` keeps its non-admin current-column return before locally binding the same two admin model columns and the same `greatest(..., value ?? null)` SQL; `searchFilter` calculates the same fallback before an early legacy authorName-only branch and then the same current id/email `or`; `periodFilter` retains legacy/current period selection and inclusive start/end bounds, returning undefined when no period. Principal inspection found all predicates, null/default behavior and ordering preserved. Formatter write/check exit0 (one file, no check fixes). No sensors/runtime yet; fresh definitions precede ACK.

D2-95 fresh sensors: format/code/types/unit/Server architecture/integrity passed (7 workspaces code/types; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance remains exit1 for future paths. Server complexity exit2 remains55 warnings/0 errors; no warnings removed/added. Scores: `savedAdminActivity`62.1→61.2, `searchFilter`59.0→59.5, `periodFilter`63.1→62.2. The predicted threshold gain was not confirmed. Logs `/tmp/stardust-builder-database-d2-95-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`; no DB/runtime. ACH-34/CA-22 remain open.

D2-95 paired Implementation Reviewer: scoped behavior review passed for period/legacy search/admin activity with no functional or Rules finding. Verdict **failed for ACH-34 acceptance** because complexity is still exit2 at55 warnings, and none of the three functions crossed MI65. No waiver or consolidated D2 exit.

### Assignment D2-96 — composição stateless de escrita ChallengeMapper

ACK source somente para `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeMapper.ts`: mover os três helpers de escrita já existentes `persistenceContent`, `persistencePublication`, `persistenceEvaluation` para funções de módulo não exportadas, mantendo corpos/assinaturas e a API estática `toPersistence`; não alterar outros helpers nem paths. Protótipo fiel via CodeMultiVitals 1.6.2 + Biome stdin, sem arquivos alterados: `toPersistence`64.8→65.6 (warning removido); `persistencePublication`63.4 continua warning; `persistenceEvaluation`65.7 e `persistenceContent`75.2 seguem limpos; warnings no arquivo4→3, sem nova função/aviso. Inline alternativo piora `toPersistence` para54.8 e fica proibido. Preservar DTOs/sequência, payload/fields/id/createdAt/slug/userId/starId/officialSolution, null defaults, getters e casts atuais. Esta é evidência de protótipo, não sensor oficial. Format, principal inspection e Definition gates antes dos sensores; sem runtime DB.

D2-96 mutation checkpoint: only `DrizzleChallengeMapper.ts` changed. The three existing write helpers `persistenceContent`, `persistencePublication`, and `persistenceEvaluation` are now non-exported module functions with unchanged signatures/bodies; static `toPersistence` still emits id → content → publication → evaluation → createdAt. Principal inspection confirms DTO/getter access, slug/userId/starId/officialSolution null defaults, test cases, difficulty/evaluation flag and current cast points remain intact; all read helpers, static API, fields and mapping order are unchanged. No new helper/cast/export/path. Focused format write exit0 (one fix), check exit0. Sensors and DB/runtime are stale/not run after mutation.

D2-96 fresh sensors: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance rev7/base remains incomplete for future paths. Server complexity exit2 now54 warnings/0 errors; only `ChallengeMapper.toPersistence` was removed from the54→55 residual set, no new warning; all remaining scores are unchanged. Logs `/tmp/stardust-builder-database-d2-96-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime. Paired review and ACH-34/CA-22 remain open.

D2-96 paired Implementation Reviewer: scoped mapper behavior **accepted**, no semantic/Rules finding. Confirmed the unchanged three write bodies/payloads, field order, null defaults and cast points; ACH-34 remains open because Server complexity is54 warnings/exit2. No waiver/consolidated D2 exit.

### Assignment D2-97 — composição pura do UserMapper

ACK source somente para `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`: mover os 18 helpers privados puros existentes para funções internas do módulo não exportadas, mantendo corpos/assinaturas; `toEntity`, `toDto` e `toPersistence` (APIs públicas existentes) permanecem, com `toEntity` ainda chamando `DrizzleUserMapper.toDto`. Prototype fiel CodeMultiVitals1.6.2 + Biome stdin, sem source edits: warning functions8→4, sem novos warnings; `toDto`63.2→64.6 ainda abaixo65, `progress`64.8→66.3, `starUnlocks`64.1→67.7, `acquisitions`64.1→65.0, `endorsements`64.1→65.0. Permanecem warnings em `toDto`, `appearance`, `achievements`, `completions`. Preservar ordem/campos/defaults/arrays, `flatMap` de planetIds, getters e tipo genérico de projection; sem novos exports/helpers/casts/paths. Resultado é evidência de protótipo, não sensor oficial. Format/inspeção/Definition gates antes de sensores; sem runtime DB.

D2-97 mutation checkpoint: only `DrizzleUserMapper.ts` changed. Exactly18 existing private helpers are now non-exported module functions with unchanged signatures/bodies, including generic `relationshipIds<Row>`; static `toEntity`, `toDto`, `toPersistence` remain and the public `toEntity`→`DrizzleUserMapper.toDto` call is unchanged. Principal inspection confirms DTO property groups/spread order, selections/tier fallbacks, relationship defaults, achievement/insignia keys, flatMap filtering for completed planet IDs, persistence getters and field sets remain intact. No new helper/cast/export/path. Focused Biome write exit0 (one format fix), check exit0. No post-D2-96 sensors/DB yet.

D2-97 fresh sensors: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance remains exit1 for future paths. Server complexity exit2 with50 warnings/0 errors, down4, no new warnings. `UserMapper.progress`, `starUnlocks`, `acquisitions`, `endorsements` crossed; remaining mapper warnings are `toDto`64.6, `appearance`63.8, `achievements`62.2, `completions`64.0. Logs `/tmp/stardust-builder-database-d2-97-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; review and ACH-34 open.

Root-wide complexity after D2-97: `npm run check:complexity` exit2,61 warnings/0 errors over3,471 files/9,327 functions (9,266 clean). Breakdown matches scoped captures: Server50 + W1 Web10 + W2 provider1; all residual warnings are within feature ownership. Log `/tmp/stardust-drizzle-ach34-root-d2-97.log`. CI-09/CA-22 remains open; no threshold/baseline change.

D2-97 paired Implementation Reviewer: scoped mapping refactor **accepted**, no semantic/Rules finding. Reviewer confirmed the public static methods, generic helper, spread order, defaults, flatMap, and persistence fields. A documentation mismatch was corrected: the assignment had named a nonexistent `toDtoFromProfile`; the actual public methods are `toEntity`, `toDto`, and `toPersistence`. ACH-34 remains open at Server50/root61 warnings; no runtime or consolidated D2 exit.

### Assignment D2-98 — completion projection

ACK source somente para `completions` em `DrizzleUserMapper.ts`: destructurar seus parâmetros como `usersCompletedChallenges` e `usersCompletedPlanets`, substituindo apenas os dois acessos atuais. Protótipo fiel Biome + CodeMultiVitals1.6.2: função64.0→65.9, warnings no arquivo4→3, sem nova função/warning. Outras tentativas (`relationshipIds` para insignia roles, destructuring em appearance/achievement) não cruzam65 e ficam proibidas nesta assignment. Preservar IDs de challenges, ordem dos arrays, flatMap truthy de planetId, omissão de null/undefined, duplicatas e fallback `[]`. Nenhum outro campo/função/path; sem helpers/casts. Esta é hipótese medida em memória; sensor oficial posterior confirma.

D2-98 mutation checkpoint: only `DrizzleUserMapper.ts` function `completions` changed. It destructures `usersCompletedChallenges`/`usersCompletedPlanets` from the same DrizzleUser input and replaces only those property reads. Principal inspection confirms `relationshipIds` mapping/order and existing `flatMap(item => item.planetId ? [item.planetId] : []) ?? []` semantics are unchanged; no helper/cast/other field/path. Focused Biome write/check exit0 (one write fix, clean check). No post-D2-97 tests/sensors/DB yet.

D2-97 paired Implementation Reviewer: scoped mapper refactor **accepted**, no semantic/Rules finding; retained static APIs, generic projection helper, spread/default/flatMap/persistence behavior. Reviewer observed a typo in assignment (`toDtoFromProfile` does not exist); Plan now reflects the three actual public methods. Complexity50 remains the formal blocker; no runtime/consolidated exit.

D2-98 fresh sensors: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance is exit1 for future paths. Server complexity exit2 with49 warnings/0 errors, down1; only `UserMapper.completions` crossed MI65, no new warning. Logs `/tmp/stardust-builder-database-d2-98-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; scoped reviewer and ACH-34 remain open.

D2-98 paired Implementation Reviewer: scoped completion projection **accepted**, no findings; confirmed field reads/order, challenge IDs, completed-planet filter/fallback and output order. Reviewer explicitly notes Server complexity49/exit2, so ACH-34 remains open; no runtime/consolidated D2 exit.

### Assignment D2-99 — normalização de perfil/avatar do FeedbackReportMapper

ACK source somente para `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts`: mover os dois helpers privados puros `displayText` e `authorAvatar` para funções locais não exportadas, sem mudar corpos/assinaturas; preservar a API estática e a composição atual. Protótipo fiel Biome + CodeMultiVitals1.6.2, sem source edit: `authorAvatar`64.8→65.1 (limpo), `authorProfile`65.3→65.9; `displayText`77.4 inalterado; warnings no arquivo3→2,14 funções antes/depois, nenhum novo warning. Relocar todos os12 helpers foi medido e remove só um warning, portanto proibido por ampliar o diff sem ganho. Preservar trim/length≥2, fallbacks “Você”/“voce”, avatar name, extensão regex, `/images/profile.svg`, null/undefined e ordem de chamadas; conteúdo/data/status/persistência intocados. Medida é protótipo, sensores oficiais obrigatórios. Format/inspeção/Definition gates antes do ACK de sensores; sem runtime DB.

D2-99 mutation checkpoint: only `DrizzleFeedbackReportMapper.ts` changed. Existing `displayText` and `authorAvatar` now are non-exported module functions; `authorProfile` calls them lexically. Principal inspection confirms parameter/default values, `trim().length >= 2`, author/slug fallbacks, avatar name and extension regex `/images/profile.svg`, null handling and composition order are intact. Content/lifecycle/activity/read-state/persistence helpers, casts, fields and API remain untouched. No new helper/path. Focused Biome write/check exit0 (one write format fix, clean check). No sensors/DB after D2-98.

D2-99 fresh sensors: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance is exit1 for future paths. Server complexity exit2 with48 warnings/0 errors, down1; only ReportMapper `authorAvatar` crossed MI65, no new warnings; `toEntity`60.5 and `content`63.9 remain. Logs `/tmp/stardust-builder-database-d2-99-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review/ACH-34 pending.

Root-wide complexity after D2-99: `npm run check:complexity` exits2,59 warnings/0 errors across3,471 files/9,327 functions (9,268 clean). All residuals remain feature-scoped: Server48, W1 Web10, W2 provider1. Log `/tmp/stardust-drizzle-ach34-root-d2-99.log`; CI-09/CA-22 still open without threshold/baseline changes.

D2-99 paired Implementation Reviewer: scoped mapper refactor **accepted**, no behavioral/Rules finding; confirmed name→slug→avatar call order and all default/regex/null semantics. Review notes the Drizzle mapper is untracked in this checkout, so comparison used current source and checkpoint rather than Git diff. ACH-34 remains open at Server48/root59 warnings; no waiver or runtime claim.

D2-99 paired Implementation Reviewer: scoped mapper changes **accepted**, no finding; verified order/fallbacks/regex/null and unchanged content/persistence. ACH-34 remains open at Server48/root59 warnings; no waiver or runtime claim.

### Assignment D2-100 — completion policy projection

ACK source somente para `completionFilter` em `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`: destructurar o parâmetro `ChallengesListParams` para `completedChallengesIds` e `completionStatus` e substituir somente os acessos atuais. Protótipo fiel Biome + CodeMultiVitals1.6.2: MI64.1→65.9, warnings do arquivo7→6, funções76→76, sem warning novo. Preservar completions vazio→`sql false`; completions presentes→membership; not-completed vazio→undefined; not-completed presente→`notInArray`; estados restantes→undefined. Sem mudança em auth/SQL/ordem/endpoint; não incluir `exerciseFilter` nem `publicationFilter` (seus protótipos não cruzaram65). No new function/type/cast/path. Formatar/inspecionar/gates de definição antes da mutation; sensores oficiais depois; sem DB runtime.

D2-100 mutation checkpoint: only `DrizzleChallengesRepository.completionFilter` changed. Its two existing input fields are destructured and references replaced; `completedMembership`, empty completion `sql false`, nonempty `inArray`, not-completed empty `undefined`, nonempty `notInArray`, and remaining status behavior are intact. Principal inspection found auth/SQL/ordering/endpoints untouched; no helper/type/cast/path. Biome write/check exit0 (one write fix, clean check). No fresh sensors/DB yet.

D2-100 fresh sensors: format/code/types/unit/Server architecture/integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Conformance remains exit1 for future paths. Server complexity exit2 with47 warnings/0 errors, down1; only `completionFilter` crossed MI65 and no new warning. Logs `/tmp/stardust-builder-database-d2-100-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review pending.

Root-wide complexity after D2-100: `npm run check:complexity` exits2 with58 warnings/0 errors over3,471 files/9,327 functions (9,269 clean). Breakdown remains feature-scoped: Server47, W1 Web10, W2 provider1. Log `/tmp/stardust-drizzle-ach34-root-d2-100.log`; CI-09/CA-22 still open, no thresholds/baselines changed.

D2-100 paired Implementation Reviewer: scoped completionFilter change **accepted**, no finding; verified empty/non-empty completed/not-completed and other status cases, and no auth/query/order/API change. Complexity remains47 Server/58 root warnings, so ACH-34/D2 remain open; no waiver.

### Assignment D2-101 — avaliação do ChallengeMapper

ACK source somente para `DrizzleChallengeMapper.evaluation`: destruturar os três campos já usados (`testCases`, `isEvaluatedByFunction`, `officialSolution`) no parâmetro e renomear o resultado parseado para `parsedTestCases`. Protótipo fiel Biome + CodeMultiVitals1.6.2: MI64.3→65.5, warnings do arquivo3→2,12 funções antes/depois, nenhum novo warning. Mantém teste de string e `JSON.parse` condicional, mesmos casts, payload/null behavior e ordem de criação do domínio. A leitura de flags/solution passa a ocorrer antes do parse; `DrizzleChallenge` é row material de query com data fields (sem getters/proxies), portanto sem efeito de aplicação observable; em objeto artificial com getters a ordem diferiria e esse objeto não é contrato do adapter. Não usar a variante destructured-after-parse (MI63.2) nem mexer na publication helper. Sem helpers/casts novos/paths. Protótipo não é sensor oficial; definitions, inspeção e sensores permanecem obrigatórios.

D2-101 mutation checkpoint: only `DrizzleChallengeMapper.evaluation` changed as assigned. It destructures the three existing row fields, retains conditional `JSON.parse` and existing cast points, and returns the same domain fields in the same order. Principal inspection confirms null handling and invalid JSON exceptions are preserved; only property-read timing differs for getter/proxy rows, which are not returned by the Drizzle query. Focused Biome write/check exited0. Fresh official sensors and paired review are pending; no database runtime ran.

D2-101 fresh evidence: format/code/types/unit passed (code/types 7/7 workspaces; unit Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); test integrity passed. Root complexity exits2 with57 warnings/0 errors across3,471 files and9,327 functions (9,270 clean), down1 from D2-100; `evaluation` is no longer warned and no new warning appeared. Log `/tmp/stardust-drizzle-ach34-root-d2-101.log`. Conformance revision7 still exits1 because numerous future contracted paths are unchanged/missing and deferred removals remain. No DB runtime; ACH-34 remains open.

### Assignment D2-102 — filtro de classificação

ACK source somente para `classificationFilter` em `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`: destructurar `intent` e `status` do parâmetro atual e substituir somente os acessos `params.*`. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI64.7→68.3, warnings do arquivo11→10, funções77→77, sem warning novo. Preservar filtro de intent quando presente, filtro de status somente fora de legacy, ausência→`undefined`, ordem do `and` e valores SQL. Guards, queries, transações e demais métodos permanecem intocados; sem helper/type/cast/path ou waiver. Principal executa Definition gates antes de autorizar mutation, depois os sensores e revisão pareada. Nenhum runtime DB neste lote.
D2-101 paired Implementation Reviewer: **accepted statically, no findings**. The reviewer verified conditional parse, casts, null behavior, output order and invalid-JSON throw semantics, and confirmed only this warning left the root inventory (58→57, zero errors, function count unchanged). Rules: no change. ACH-34 remains open; no D2 exit/runtime proof.

D2-102 mutation checkpoint: only `DrizzleFeedbackReportsRepository.classificationFilter` changed. It destructures the same `intent` and `status` fields and replaces only `params.*` reads; intent remains first in `and`, status is applied only under `!legacy`, and absent filters still return `undefined`. SQL expressions, guards, query order, transactions and other functions are unchanged. Focused Biome write/check exited0 without fixes. Principal source inspection agrees with assignment. Fresh sensors and paired review pending; no DB runtime.
D2-102 paired Implementation Reviewer: **accepted statically, no findings**. The reviewer verified `intent` first in `and`, `status` only under `!legacy`, parametrized `.value` predicates, and `undefined` for absent filters. No guards/query/transaction change was found. Rules: no change. Complexity remains56 warnings; ACH-34 and D2 remain open, with no waiver or runtime proof.

W1 ACH-34 second-pass read-only triage: no further measured formatter-faithful transformation clears a warning without adding one or changing the request/clock/error contracts. Candidates rejected: resume consolidation GET64.1→66.4 but creates helper warning62.8; stream credential regrouping62.6→61.0/60.8; cookie overload absentAttempt63.4→61.3; receipt simplification61.5→60.3; signup guard61.6→62.6. Removing BFF async would change synchronous failure handling, and changing expiry validation changes Date.now evaluation. No mutation. W1 remains at10 warnings, so its zero-warning exit is still open; no waiver or threshold change.

D2-102 fresh sensors, source frozen: format/code/types/unit passed (code/types7/7 workspaces; unit Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); test integrity passed. Root complexity exits2 with56 warnings/0 errors across3,471 files/9,327 functions (9,271 clean), down1 from D2-101; no new warning. Breakdown remains Server45/W1 Web10/W2 provider1, all in the current feature-owned paths. Logs `/tmp/stardust-builder-database-d2-102-{code,types,unit,architecture,integrity}.log` and `/tmp/stardust-drizzle-ach34-root-d2-102.log`. Conformance revision7 exits1 for contracted paths not yet changed/created/removed; see `/tmp/stardust-builder-database-d2-102-conformance.log`. No DB runtime. ACH-34/CA-22 remain open.

### Assignment D2-103 — projeção de conteúdo do FeedbackReportMapper

ACK source somente para `content` em `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts`: mover o destructuring existente de `id`, `content`, `intent`, `screenshot`, `createdAt` ao parâmetro tipado `DrizzleFeedbackReport`, substituindo apenas os acessos atuais. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI63.9→66.6, warnings do arquivo2→1, 14 funções antes/depois, sem novo warning ou outro score alterado. Preservar conjunto/ordem de leituras, shape do payload, `screenshot ?? undefined` e `createdAt.toISOString()`. Sem helper/cast/campo/path; risco apenas de leitura ocorrer no binding de entrada antes da primeira instrução, sem operação intermediária na função. Principal valida fonte/gates; sensores oficiais e review pareado seguem obrigatórios. Sem DB runtime.

D2-103 mutation checkpoint: only `DrizzleFeedbackReportMapper.content` changed. Its existing `id`, `content`, `intent`, `screenshot` and `createdAt` destructuring moved to the typed input; the returned fields/order, `screenshot ?? undefined` and `createdAt.toISOString()` remain unchanged. No helper, cast or path added. Focused Biome write/check exited0 without fixes. Principal source inspection agrees. Prior coverage jobs were overlapping this mutation; Server coverage must be rerun against the frozen source.
D2-103 paired Implementation Reviewer: **accepted statically, no findings**. The reviewer verified the authorized five-field parameter destructuring, output field order, screenshot fallback and ISO conversion. Rules: no change. Root complexity is55 warnings/0 errors, so ACH-34 remains open. Review does not grant consolidated D2 exit.

D2-103 fresh evidence, source frozen after mutation: format/code/types/unit passed (code/types7/7 workspaces; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); test integrity passed. Root complexity exits2 with55 warnings/0 errors across3,471 files/9,327 functions (9,272 clean), down1; log `/tmp/stardust-database-d2-103-complexity.log`. Conformance remains exit1 for future paths; log `/tmp/stardust-database-d2-103-conformance.log`. Core/Studio/Web coverage ratchets passed against unchanged baselines. Server coverage completed at47.68% lines/statements,31.93% functions,88.97% branches with168 suites/325 tests, but its run overlapped the D2-103 source mutation and is explicitly stale; rerun on a frozen D2 batch before D2 exit. ACH-34/CA-22 remain open; no DB runtime.

### Assignment D2-104 — payload de execução de código

ACK source somente para `executionPayload` em `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts`: usar o DTO existente de `execution.dto` (seis campos iguais aos projetados hoje) e sobrescrever somente `createdAt` com a conversão já existente condicional a valor presente. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI62.3→68.9, warning do arquivo1→0, quatro funções antes/depois, sem score/warning adicional. Preservar a annotation `Pick<DrizzleInsertChallengeCodeExecution,...>`, API pública, casts de leitura, referências dos arrays/error, fallback e cópia de Date; o getter `dto` deve ser chamado uma vez. A projeção de seis campos é intencional e precisa ser reavaliada se o DTO ganhar campos. Sem mudança Core/helper/cast/path extra. Definition gates antes da mutation; sensors e review pareado obrigatórios; sem DB runtime.

D2-104 mutation checkpoint: only `executionPayload` changed in `DrizzleChallengeCodeExecutionMapper.ts`. It reads `execution.dto` once into `dto`, spreads the six-field DTO projection confirmed by CodeGraph, and replaces `createdAt` with the same conditional Date conversion. The Pick annotation, public API, read casts, field order, array/error references and undefined fallback remain. No helper/Core/other path changed. Focused Biome write/check exited0 without fixes. Principal source inspection agrees; fresh sensors/review pending, no DB runtime.
D2-104 paired Implementation Reviewer: **accepted statically, no findings**. Reviewer confirmed the getter is called once, the DTO has exactly six projected fields, spread order/references and conditional Date/undefined conversion remain, and the Pick/API/casts are unchanged. Rules: no change. Complexity54 warnings; ACH-34 remains open, no D2 exit/runtime proof.

D2-104 fresh evidence, source frozen: format/code/types/unit passed (code/types7/7 workspaces; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); integrity passed. Root complexity exits2 with54 warnings/0 errors across3,471 files/9,327 functions (9,273 clean), down1; log `/tmp/stardust-database-d2-104-complexity.log`. Conformance still fails on future contracted paths; log `/tmp/stardust-database-d2-104-conformance.log`. Core/Studio/Web coverage ratchets already passed and their source remained unchanged. Server coverage awaits a frozen D2 batch; no DB runtime. ACH-34/CA-22 remain open.

### Assignment D2-105 — período de criação de usuários

ACK source somente para `creationFilter` em `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`: destructurar `creationPeriod` do `UsersListingParams` existente e substituir somente seus quatro acessos `params.*`. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI63.1→68.9, warnings do arquivo10→9,106 funções antes/depois, sem warning novo. Preservar o `and` com `gte(startDate)` antes de `lte(endDate)`, bounds inclusivos, parâmetros SQL e ausência→`undefined`. Sem mudança em auth, queries ou transações; nenhuma helper/type/cast/path extra. Período passa a ser lido uma vez de objeto de dados. Principal roda Definition gates antes da mutation; depois sensores e review pareado. Sem DB runtime.

D2-105 mutation checkpoint: only `DrizzleUsersRepository.creationFilter` changed. It destructures the existing `creationPeriod` and replaces its four parameter reads; inclusive `gte(startDate)` then `lte(endDate)`, SQL values and absent→`undefined` behavior are unchanged. No auth/query/transaction/helper/type/cast/path changes. Focused Biome write exited0 (one formatting fix); check exited0 with no fixes. Principal source inspection agrees. Fresh sensors/review pending; no DB runtime.
D2-105 paired Implementation Reviewer: **accepted statically, no findings**. Reviewer verified only `creationPeriod` destructuring, inclusive gte→lte bounds/order/values and absent period→undefined; no auth/query/transaction changes. Rules: no change. Complexity53 warnings; ACH-34 remains open without D2/runtime exit.

D2-105 evidence (source frozen): code passed7/7 workspaces; types currently passed7/7; architecture passed3,874 modules/6,952 dependencies; integrity passed; complexity exits2 at53 warnings/0 errors with9,274 clean of9,327, down1 and no new warning. Unit tests are still running; record final counts after completion. Conformance remains incomplete on future paths. No DB runtime.
D2-105 unit tests completed: Server168 suites/325 tests; Core176/638; Web118/506; Studio14/64; LSP1. All passed. Core/Studio/Web coverage ratchets were already green with their source unchanged; Server coverage remains intentionally pending until D2 is frozen.

D2-106 read-only triage, no mutation: `UsersRepository.orderingCriteria` destructuring measures MI62.8→63.9 (file warnings9→9); `ChallengeMapper.persistencePublication` destructuring measures MI63.4→59.8 (warnings2→2). Neither crosses MI65. Replacing slug getter with DTO.slug was rejected because the DTO optional contract may not satisfy the required insert value. No edits; current D2 complexity remains53 root warnings. Broader measured candidate pass continues within the same authorized paths.

D2-106 expanded triage, no source mutation: (1) `DrizzleFeedbackMessagesRepository.messageColumns`, binding message-model `id` locally, MI62.7→61.7/warnings4→4; (2) `DrizzleFeedbackReportsRepository.legacyList`, naming the tuple and returning shorthand, MI64.9→62.5/warnings10→10; (3) `adminPageResult` destructuring, MI62.7→64.2/warnings10→10. All are no-go. The previously measured `UsersRepository.orderingCriteria` and `ChallengeMapper.persistencePublication` remain no-go; unsafe optional DTO slug substitution is rejected. A separate measured `orderedActivityQuery` candidate clears one warning and is assigned below.

### Assignment D2-107 — colunas da ordenação de atividade

ACK source somente para `orderedActivityQuery` em `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`: destructurar somente `lastActivityAt` e `id` de `feedbackReportModel` antes do retorno e substituir os dois acessos qualificados correspondentes. Manter `this.unread(author)` exatamente uma vez, primeiro em `orderBy`, seguido por `lastActivityAt`, depois `id`; preservar `this.query(author)`, filtro/paginação/chaves e direção `desc`. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI64.9→68.7, warnings do arquivo10→9, sem outro warning ou alteração de funções. Sem SQL fragment reuse/mutação, helper, tipo, cast, outro campo/path ou efeito. Definition gates precedem mutation; sensores/review pareado obrigatórios; sem DB runtime.

D2-107 mutation checkpoint: only `DrizzleFeedbackReportsRepository.orderedActivityQuery` changed. The two existing table fields are destructured locally; `this.query(author)`, `.where(filter)`, and `orderBy` remain with one `this.unread(author)` descending first, then `lastActivityAt` descending, then `id` descending. No SQL-fragment reuse, helper, cast or additional path. Focused Biome write/check and principal CodeGraph source inspection exited0. Fresh sensors/review pending; no DB runtime.
D2-107 paired Implementation Reviewer: **accepted statically, no findings**. Verified the exact two columns, unchanged query/filter, single `unread(author)` call and DESC order `unread → lastActivityAt → id`. Rules: no change. Complexity52 warnings; ACH-34 remains open without D2/runtime exit.
D2-107 fresh evidence: code/types/unit passed (code/types7/7 workspaces; unit Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); integrity passed. Root complexity exits2 with52 warnings/0 errors over3,471 files/9,327 functions (9,275 clean), down1; log `/tmp/stardust-database-d2-107-complexity.log`. Conformance remains exit1 for future contracted paths; log `/tmp/stardust-database-d2-107-conformance.log`. Core/Studio/Web coverage ratchets still reflect unchanged code and passed. Server coverage is deferred to the frozen D2 batch; no DB runtime. ACH-34/CA-22 remain open.

D2-108 read-only triage, no mutation: restructuring `DrizzleChallengesRepository.listingOrder` loop destructuring measured MI64.0→64.1 with six warnings unchanged. It also evaluated `isDescending` before the current branch, adding risk without gain. No edit or assignment.

D2-109 read-only triage, no mutation: locally binding the five existing pure helper calls in `DrizzleFeedbackReportMapper.toEntity` measured MI60.5→58.8, with the file warning unchanged at1. No helper/body/API semantics changed in the prototype; binding overhead worsened the score. No assignment.

D2-110 read-only triage, no mutation: destructuring `{ id, createdAt }` in `DrizzleSolutionMapper.toEntity` and using shorthand/renamed `postedAt` measured MI63.7→62.7; file warning remained1. It also reads `createdAt` before existing helper composition, without score gain. No assignment.

D2-111 read-only triage, no mutation: replacing the six ordered pure projection spreads in `DrizzleUserMapper.toDto` with `Object.assign` measured MI64.6→63.7; mapper warnings remained3. Fields/order/defaults/array references were equivalent, but the rewrite added call/format weight. No assignment.

D2-112 read-only triage, no mutation: `DrizzleUserMapper.appearance` parameter destructuring of `avatar`, `rocket`, `tier` measured MI63.8→64.9, still below65 with file warnings unchanged at3. Values/defaults remain, but property reads move to parameter entry. No assignment.

D2-113 read-only triage, no mutation: destructuring existing `usersUnlockedAchievements`, `usersRescuableAchievements`, and `insignias` in `DrizzleUserMapper.achievements` measured MI62.2→63.3; mapper warning count remained3. Relationship IDs, optional insignia mapping and empty-array fallback were unchanged in the prototype, but the score did not clear the gate. No assignment.

D2-114 read-only triage, no mutation: destructuring `avatarId`, `rocketId`, and `tierId` from `userModel` in `DrizzleUsersRepository.query` and substituting only the three join-column reads measured MI64.0→62.9; file warnings remained9. Query/joins/order/guards were otherwise unchanged, but local binding weight worsened the metric. No assignment.

### Assignment D2-115 — persistência de anexos de mensagens

ACK source somente para `persistAttachments` em `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`: substituir o `if` com retorno antecipado pelo mesmo `if/else` explícito: com anexos persistidos, chamar `assertSameAttachments`; caso vazio, aguardar `insertAttachments` na mesma transação. Preservar lock/hydrate antes da condição, idempotência/conflito, chamada e await do insert, queries/guards/ordem. Sem helper, função, query, cast, type ou outro path. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI64.1→68.2, warnings no arquivo4→3, sem novo warning. A função async continua resolvendo void nos dois ramos. Principal roda Definition gates antes da mutation, depois sensores/review pareado. Sem DB runtime.
D2-115 paired Implementation Reviewer: **accepted statically, no findings**. Confirmed lock/hydrate awaited before branch; nonempty attachments still assert equality, empty attachments still await the same insert in the same transaction, and both branches resolve void. Rules: no change. Complexity51 warnings; ACH-34 remains open.
D2-115 fresh evidence: code/types/unit passed (code/types7/7 workspaces; unit Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed (3,874 modules/6,952 dependencies); integrity passed. Root complexity exits2 with51 warnings/0 errors,9,276 clean of9,327, down1; log `/tmp/stardust-database-d2-115-complexity.log`. Conformance still exits1 for future contracted paths; log `/tmp/stardust-database-d2-115-conformance.log`. Core/Studio/Web coverage ratchets remain green on unchanged workspaces; Server coverage and DB runtime await frozen D2/operational phase. ACH-34/CA-22 remain open.

D2-116 read-only triage, no mutation: destructuring the locked report `status` in `DrizzleFeedbackMessagesRepository.persistMessage` and passing it to `ensureMessage` measured MI64.7→64.9, with the three file warnings unchanged. Lock/lookup/ensure/hydrate/attachment/return order and transaction/idempotency were preserved, but the score did not clear the gate. No assignment.

D2-117 read-only triage, no mutation: naming the two existing descending column expressions in `feedback-report-model.queueIndexes` measured MI60.8→63.1, warnings unchanged at3. It shifts column-chain evaluation before the index constructor and risks ORM metadata mutation ordering; no assignment.

D2-118 read-only triage, no mutation: destructuring the existing user primary-key column as `authorId` in `feedback-report-model.integrityConstraints` measured MI56.4→55.8; warnings remained3. Constraint names, SQL, order, cascade and foreign-column references were preserved in the prototype, but the metric worsened. No assignment.

D2-119 read-only triage, no mutation: binding the existing unread partial-index predicate as `unreadPredicate` in `feedback-report-model.authorHistoryIndexes` measured MI58.6→59.1; three model warnings unchanged. Exact predicates/names/columns/directions/order were preserved, but fragment construction moved earlier and the score remained below65. No assignment.

D2-120 read-only triage, no mutation: binding `this.access` locally in `DrizzleChallengesRepository.publicListingVisibility` measured MI64.7→63.6, warning count unchanged at6. The public-vs-owner/God `or` expression, accountId condition, order and SQL stayed the same, but local-binding weight worsened the score. No assignment.

D2-121 read-only triage, no mutation: binding `const { kind } = this.access` in `DrizzleChallengesRepository.visibility` measured MI64.6→63.7, with six file warnings unchanged. God/system early return and public/owner/optional-star OR/SQL behavior remained the same; no threshold crossing. No assignment.

D2-122 read-only triage, no mutation: destructuring `shouldIncludeStarChallenges`, `shouldIncludeOnlyAuthorChallenges`, `userId` in `DrizzleChallengesRepository.publicationFilter` measured MI60.7→63.2; six file warnings unchanged. Existing star-null filter, author-only `SQL false` fallback, optional undefined filters and `and` order were retained, but no threshold crossing. No assignment.

### Assignment D2-123 — filtros de exercício de challenges

ACK source somente para `exerciseFilter` em `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`: destruturar `title`, `difficulty: { level }` e `isNewStatus: { value: newStatus }` do `ChallengesListParams`, trocando somente os acessos atuais. Protótipo fiel Biome + CodeMultiVitals1.6.2 mediu MI58.1→65.2, warnings do arquivo6→5, sem novo warning. Preservar todos os mesmos operandos/ordem de `and`, filtros `titleEmpty`, difficulty `all`, `newStatus` `all`, valores SQL e undefined behavior. CodeGraph confirmou `ChallengeDifficulty.level` e `ChallengeIsNewStatus.value` são campos readonly atribuídos diretamente em construtores privados; validação falha só na criação inválida, antes destes objetos serem fornecidos. Não são getters nem mutáveis; portanto a leitura antecipada de rows de domínio concretos é pura e não altera contrato. Sem helper/type/cast/path extra. Definition gates antes da mutation; sensores/review depois; sem DB runtime.

D2-123 mutation checkpoint: only `DrizzleChallengesRepository.exerciseFilter` changed. The typed parameter destructures `title`, `difficulty.level`, and `isNewStatus.value` as `newStatus`; titleEmpty→ilike, levelall→undefined, newStatusall→undefined/new→true predicates, SQL values and exact `and` operand order are preserved. These nested properties are validated readonly data fields, not accessors. Focused Biome write passed (one format fix); check exited0 cleanly. Principal source inspection matches assignment. Sensors/review pending; no DB runtime.
D2-123 paired Implementation Reviewer: **accepted statically, no findings**. Confirmed `title → difficulty → newStatus` operand order, same ilike/status comparisons, and empty/all values produce `undefined`; readonly nested properties only. Rules: no change. Complexity50 warnings; ACH-34 remains open without D2/runtime exit.
D2-123 fresh evidence: code/types/unit passed (code/types7/7 workspaces; unit Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1); architecture passed3,874 modules/6,952 dependencies; integrity passed. Root complexity exits2 with50 warnings/0 errors,9,277 clean/9,327, down1; log `/tmp/stardust-database-d2-123-complexity.log`. Conformance stays incomplete for future paths; log `/tmp/stardust-database-d2-123-conformance.log`. Core/Studio/Web coverage ratchets still green on unchanged sources; Server coverage and D2 database runtime remain for the frozen batch. ACH-34/CA-22 open.

D2-124 read-only triage, no mutation: inlining `incorrectStatuses` as the same ordered three-status array in `inArray` within `DrizzleChallengeCodeExecutionsRepository.incorrectExecutionsQuery` measured MI63.8→64.4; the file warning remained1. Selected columns, status set/order, filter and SQL semantics were retained in the prototype, but no warning cleared. No source assignment; continue triage without threshold or baseline changes.
D2-125 read-only triage, no mutation: moving the existing `DrizzleCommentMapper.authorProfile` helper to module scope and destructuring its four typed fields measured MI63.6→64.9; file warning remained1. Default/name/slug/avatar projection stayed equivalent, but no warning cleared. No assignment.

D2-126 read-only triage, no mutation: binding the existing `lastActivityAt` column locally in `DrizzleFeedbackReportsRepository.updateStatusQuery` measured MI63.4→62.4; file warnings remained9. Update, expected-status filter, `greatest(now)`, returning projection and transaction behavior stayed unchanged. No assignment.
D2-127 read-only triage, no mutation: replacing the `periodFilter` early return with a conditional expression retaining local period selection and the same inclusive `and(gte, lte)` branch measured MI62.2→61.6; ReportsRepository warnings remained9. No SQL/behavior change or warning reduction. No assignment.

### Assignment D2-128 — comparação de roles na validação do banco vazio

ACH-34 residual triage led to a local runtime check after `db:test` reset. Only `scripts/check-drizzle-transition.mjs` and `scripts/tests/check-drizzle-transition.test.mjs` are assigned. Make the `isEmptyApplication` comparison of `roleMemberships` insensitive to row order while remaining exact for every role/member/option tuple; do not weaken checks for missing/extra memberships, extensions, grants, policies, application objects or external exposure. Add a focused regression case using the existing script-test harness. No new path/helper unless the measured complexity proves no net warning. No source mutation until Spec/Plan definition gates pass and Builder Database acknowledges; afterward run focused test/format and pause for principal inspection before broader sensors/review. This assignment does not authorize extension DDL or any remote operation.

D2-128 runtime finding: `npm run db:test -w @stardust/server` reset passed locally, then the empty-app migration failed closed with “Nonempty database requires verified baseline adoption.” Read-only catalog inspection found zero public application objects/policies/functions, matching storage grants/default privileges, and semantically identical role memberships in a different array order; two manifest extensions (`unaccent`, `vector`) are also absent from the reset stack. The role-order false negative is assigned here. Provisioning the required extensions belongs to C1's local Compose/reset ownership; until that phase, local runtime continuation requires a controlled local-only setup.
D2-128 source checkpoint: only `equalRoleMemberships` and the existing `isEmptyApplication` check changed in `scripts/check-drizzle-transition.mjs`, with a focused regression added to the existing test file. Rows are normalized, serialized and sorted as a multiset, so all tuple fields and duplicate multiplicity remain exact while catalog order is ignored. All other checks are unchanged. Focused format/check and test passed. Principal inspection confirms the assignment boundary; paired review and integrated status recorded below.

D2-128 fresh evidence: `npm run check:spec-implementation` remains exit1 for still-unimplemented paths in downstream phases; D2-128's paths are recognized. Global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and Server architecture passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1. Root complexity remains exit2 with50 warnings/0 errors, unchanged from D2-123; log `/tmp/stardust-d2-128-complexity.log`. Database runtime was not part of D2-128; the local empty-migrate attempt still awaits rerun after review. Coverage not rerun because the assignment changes transition tooling/test only and Server application sources remain unchanged. ACH-34 remains open.

### Assignment D2-129 — igualdade semântica dos vínculos projetados

Runtime diagnosis correction for D2-128: local catalog has24 `pg_auth_members` rows and manifest projection has21. Exactly three projected tuples (`anon`, `authenticated`, `service_role` granted to `authenticator`) appear twice locally, once per distinct grantor (`postgres` and `supabase_admin`). `catalogQueries.roleMemberships` intentionally projects role/member/admin/inherit/set options and omits grantor; therefore identical projected tuples represent one effective membership for this comparison. Modify only `scripts/check-drizzle-transition.mjs` and its existing test file so equality is order-independent and set-based over the complete projected tuple. Any missing or additional distinct tuple, changed option, or added unknown field must still fail. Add regression assertions for duplicate projected tuples and altered tuples. Do not change database grants, manifest, or reset paths here. Re-run focused tests/format and pause for principal inspection/review. This changes only the checker comparison of a projection that omits grantor; it does not change application authorization or migration SQL.
D2-129 mutation checkpoint: only `equalRoleMemberships` in `scripts/check-drizzle-transition.mjs` and its focused test changed. It compares a sorted Set of normalized complete projected tuples. Identical rows from distinct grantors and row order collapse because grantor is omitted by the existing projection; distinct role/member/options/extra fields remain exact. Format/check and focused regression pass; principal CodeGraph inspection matches assignment.

D2-129 paired Implementation Reviewer: **accepted, no finding**. Set comparison is semantically aligned with the fields the query projects; it does not compare grantor provenance omitted by the existing catalog projection. Rules: no change. This replaces D2-128's provisional review.

D2-129 fresh evidence: global code/types/unit, test-integrity, Server architecture passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1. Root complexity remains50 warnings/0 errors (exit2), unchanged; `/tmp/stardust-d2-129-complexity.log`. Full `node --test scripts/tests/check-drizzle-transition.test.mjs` passed5/5, including empty migrate, exact server-owned catalog, no-op, denied external roles, drift, and real lock/session recovery; `/tmp/stardust-d2-129-operational-tests.log`. Separately, after local-only extension provisioning and role normalization, migrate passed twice. The isolated suite exercises the grantor-duplicate projection directly. Spec conformance remains exit1 only on downstream/unimplemented contracted paths, including C1 runbook/exporter; D2-129 paths pass. Local `db:test` itself still omits `unaccent`/`vector`; C1 must make the reset initialize them reproducibly. D2 and ACH-34 remain in progress.
D2-130 read-only triage, no mutation: `DrizzleFeedbackReportsRepository.savedValues` enum-set `includes` prototype measured MI62.4→62.8; file warnings9→9. Actor classification and update payload/order remained, but no warning cleared. No assignment.

D2-131 read-only triage, no mutation: replacing the current-mode absent-search early return with a conditional return in `DrizzleFeedbackReportsRepository.searchFilter` measured MI59.5→58.9; warnings9→9. Legacy branch, absent-search result, OR predicates and SQL/evaluation behavior stayed unchanged. No assignment.
D2-132 read-only triage, no mutation: in `DrizzleUsersRepository.insigniaUsersQuery`, destructuring the existing role input/ORM columns and mapped `role.value` measured MI58.6→59.3, warnings9→9. Select/from/join/filter/role order remained. Other user selection helpers rely on typed shared projections whose change would exceed a local candidate. No assignment.
D2-133/134 read-only triage, no mutation: destructuring the nested page/itemsPerPage values in `DrizzleFeedbackReportsRepository.authorPage` measured MI60.7→61.1, warnings9→9. Collapsing admin activity `savedAdminActivity` to one payload with per-field ternaries measured MI61.2→62.2, warnings9→9; it would also evaluate model-column reads on the non-admin branch. `transitionReport` and `lockedMessageQuery` are ordered lock/update or SELECT/JOIN/FOR UPDATE compositions with no safe local branch reduction identified. No assignments.
D2-135/136 read-only triage, no mutation: passing `(await updateStatusQuery(...))[0]` directly to `changedReport` instead of a single-use destructured local in `transitionReport` measured MI61.8→59.3, warnings9→9; lock/conflict/update order stayed. Binding existing join columns in `lockedMessageQuery` measured MI60.5→61.2, warnings3→3; SELECT/JOIN/identity/FOR UPDATE OF message/limit stayed, but field reads moved earlier. No assignment.

### Assignment D2-137 — projeção de conteúdo da solução

Spec revision 7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10, CA-04/CA-05/CA-20; D2 Rule Pack (database-rules, code-conventions-rules, server-application-rules). Permit only `apps/server/src/database/drizzle/mappers/challenging/DrizzleSolutionMapper.ts`. In the existing pure `content` projection, include `id` as the first selected/returned field and remove the standalone `id` mapping from `toEntity`, preserving the existing remaining field/read order `title → content → publication → engagement → postedAt → author`, output values/references, and `toPersistence` unchanged. The formatter-faithful prototype measured `toEntity` MI63.7→65.3, `content` 80.2→78.8 (still passing), and file warnings1→0 with the same function count and no new warning. No helper, type/API change, other path, threshold/baseline adjustment, migration/runtime, or remote operation. Require CodeGraph before edit; then focused format/check and pause for principal inspection. Broader sensors and the paired Database Reviewer follow inspection. D2 and ACH-34 remain in progress until their full exits pass.

D2-137 mutation accepted for principal handoff: CodeGraph confirms `toEntity` consumes the `content` projection first and all callers remain unchanged. The diff only moves the same `row.id` field into `content`'s existing returned object as its first field; title/content and all later projections retain order and values, `toPersistence` is unchanged. Builder's focused Biome format/check passed. Global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and Server architecture passed; units Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture 863 modules/1,636 dependencies. Root complexity fell50→49 warnings, 0 errors, exit2. Paired Reviewer pending. D2/ACH-34 remain open; no runtime or Server coverage claim.

D2-137 paired Implementation Reviewer accepted statically with no findings: projected `id` remains first in the `Solution.create` payload; later spreads do not overwrite it, and persistence/signatures are unchanged. `check:spec-implementation` remains incomplete on broader contracted paths (C1 artifacts, CI/reset, Server/Web integration/removals), not this mapper. Definition gates pass; ACH-34 remains49 root warnings, so D2 remains open.

ACH-34 post-D2-137 baseline refreshed without source changes: `npm run check:complexity` still exits2 at49 warnings/0 errors, 9,278 clean of9,327 functions across3,471 files; current full report `/tmp/stardust-d2-137-complexity.log`. Residual map is Server38, Web W1 10, W2 provider1. D2 and W1 remain open.

D2-138 read-only no-go: in `DrizzleChallengeMapper.persistencePublication`, destructuring the DTO's existing `author.id`, `starId`, `isPublic`, and `isNew` ahead of the existing `slug` getter measured MI63.4→59.8; file warnings stayed2. Getter invocation count, output fields/order and null conversion stayed, but the candidate moved pure DTO reads before slug; it did not clear a warning. No source mutation.

D2-139/140 read-only no-gos: destructuring the existing selected-vote callback (including absent-row default and nullish `none`) in `DrizzleChallengesRepository.findVote` measured MI64.6→64.6, warnings5→5; appending `desc(createdAt)` in a fresh array in `DrizzleUsersRepository.listingOrder` measured MI62.6→63.9, warnings9→9. Existing guard/query/filter/limit and tri-state ordering/defaults stayed; no candidate crossed the threshold. No source edits.

D2-141/142 read-only no-gos: `DrizzleCommentsRepository.readColumns` alias-column destructuring with constant quoted SQL measured MI63.1→63.9, file warnings1→1; raw SQL declaration spelling would additionally require generated-SQL confirmation, so not recommended. `DrizzleUsersRepository.completionSelection` model-column binding measured MI60.7→62.5, warnings9→9, preserving projection/type/JSON coalesce/view correlation and order. Neither crossed threshold; no source changes.

### Assignment D2-143 — extrair a base query de usuários

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; Rule Pack: database-rules, code-conventions-rules, server-application-rules; SHI não aplicável. Permit only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. Extract the existing SELECT over `readColumns` and FROM `userModel` from `query` into one private `baseQuery` method, then have `query` use it and retain the three existing appearance LEFT JOINs in their current order and with the same `eq` expressions. Prototype: query MI64.0→67.6, new helper78.3, file warnings9→8, function count106→107; no added warning. Preserve the exact readColumns invocation, builder inferred type, query evaluation, joins, SQL, authorization, fields, and public API. No other path/helper, semantic change, threshold/baseline edit, DB/runtime or remote operation. Builder must rely on its CodeGraph-first source/callgraph exploration, format/check this path, and pause for principal diff inspection; integrated sensors and paired Reviewer follow.

### Assignment W1-ACH34-01 — separar parsing de metadados do recibo

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; Rule Pack: web-application-rules, web-app-routes-testing-rules, rest-layer-rules, realtime-rules, rpc-layer-rules, code-conventions-rules; SHI não aplicável. Permit only `apps/web/src/app/api/auth/sign-up/route.ts`. Add a cohesive `readAttemptMetadata` helper for the existing receipt/expiry header reads and Date construction; use the measured finite/expired guard in `getAttemptReceipt`. Preserve header-read order, fallback and Date construction before upstream success/receipt checks, `getTime` only after those guards, `Number.isFinite` short-circuit before `Date.now`, and current inclusive expiry rejection (`expiry <= now`), synchronous error boundary, promise timing, caller/API/cache/headers. Biome-faithful prototype: `getAttemptReceipt` MI61.5→65.1, helper69.4, full-file warnings4→3 and functions12→13 (all other functions retain their scores). No test/API/path/threshold/baseline change; no other route/runtime/remote edit. Builder formats/checks this path and pauses for principal inspection; integrated Web/browser sensors and paired Reviewer follow. W1 and ACH-34 remain open because other warnings remain.

W1/W2 ACH-34 final read-only pass: `getAttemptReceipt` finite/future guard MI61.5→62.6, warning remains; `createStreamRequestHeaders` credential conditional MI62.6→60.1 and CC3→5, warning remains; W2 provider deduplicated `setHeader` argument MI57.3→57.6, warning remains. Measured with faithful Biome formatting and installed CodeMultiVitals; hook order/dependencies, request/header/cookie order and short-circuit semantics were examined. No source changes. Combined with prior measured no-gos, Builder reports no safe zero-warning transformation among NextRestClient, signup POST/fetch/receipt/cookie handling, onboarding GET, profile-events credential headers, or provider; W1 remains10 warnings and W2 provider1.

ACH-34 fresh post-D2-143/W1-ACH34-01 baseline: root complexity remains47 warnings/0 errors (Server37/W1 9/W2 1); full report `/tmp/stardust-d2-143-w1-ach34-01-complexity.log`. Spec conformance still exits1 with251 remaining path errors across incomplete/downstream work; the D2-143 and W1-ACH34-01 paths are recognized. Full Web Playwright has82 passes and6 failures assigned to pending W2 behaviors; the W1 signup BFF and unit route tests pass.

### Assignment D2-144 — separar consulta de mensagem e relatório

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; database/code-conventions/server Rule Pack; SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`. Extract from `lockedMessageQuery(transaction, message)` the existing SELECT over `getTableColumns(feedbackMessageModel)`, FROM feedbackMessageModel and INNER JOIN feedbackReportModel on the same `eq` into a private inferred `messageReportQuery(transaction: DrizzleTransaction)`. Keep `lockedMessageQuery` delegating, then applying the same `messageIdentityFilter(message)`, FOR UPDATE OF feedbackMessageModel and limit1 in order. Prototype: lockedMessageQuery MI60.5→69.4, new helper65.4, file warnings3→2, functions33→34; all other function scores unchanged. Preserve transaction, SQL/evaluation/identity/locking, inferred types, ownership and API; no new path, cast, query execution/roundtrip, threshold/baseline, DB or remote work. Builder CodeGraph-first source is current; format/check after edit, then pause for principal inspection. D2/ACH-34 remain open.

### Checkpoint D2-143 / W1-ACH34-01 — implementação e revisão

D2-143 current source inspection confirms both methods private with inferred return types: `baseQuery` performs the same one `select(readColumns()).from(userModel)`; `query` then preserves avatar → rocket → tier LEFT JOINs and the original `eq` predicates. No second query/cast/API/auth change. Biome format/check passed. Paired Database Reviewer accepted statically, no finding; Rules `No change`.

W1-ACH34-01 current source inspection confirms receipt header → expiry header/fallback/Date construction remain before upstream/receipt guard; `getTime`, finite check, short-circuited `Date.now`, inclusive expiry rejection and synchronous error boundary are preserved. Biome format/check passed. Paired Web Reviewer accepted statically, no finding; Rules `No change`.

Fresh integrated sensors after both changes: `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and Server architecture all passed. Unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies. `npm run check:complexity` remains exit2,47 warnings/0 errors,9,282 clean of9,329; current W1 signup file warning count4→3 in the virtual measurement, and D2 UsersRepository9→8. The full Web Playwright integration run exited1:82 passed/6 failed. Read-only CodeGraph diagnosis ties all six to still-pending W2 behavior (two signup resume UI cases and four social-confirmation UI redirect/cache cases), while W1 BFF's three browser tests and route unit tests pass. W1-ACH34-01's route-only acceptance remains static; EV-07/browser and W2 phase exits remain pending. The failures require correction in their W2-owned hooks/actions/tests after W2 assignment, not a change to the W1 transport path.

### Assignment W1-ACH34-02 — separar precedência de credenciais dos headers

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, realtime, RPC, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/profile-events/route.ts`. Extract existing `new Headers` initialization and exact Authorization/receipt conditionals into synchronous `createCredentialHeaders(authorization: string | null, receipt: string | undefined)`; keep `createStreamRequestHeaders` calling `getAuthorization(request)` first, then reading the receipt cookie, then invoking the helper. Preserve Headers allocation after both reads; Authorization's `!== null` behavior including empty string; truthy receipt fallback; header/set/read order; and all GET, catch, cache, clock, abort, stream semantics. Prototype: `createStreamRequestHeaders` MI62.6→71.0, helper66.9, file warnings2→1, functions6→7; all other scores unchanged. No other path, API/test/threshold/baseline/runtime/remote change. Builder CodeGraph-first source current; format/check and pause for principal inspection; integrated Web/browser sensors and paired Reviewer follow. W1 and ACH-34 remain open.

### Assignment W1-ACH34-03 — isolar a resposta anônima 204 do stream

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, realtime, RPC, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/profile-events/route.ts`. Extract the existing anonymous response construction from `GET` into synchronous `createAnonymousStreamResponse()`, returning `new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS })`; replace only the inline constructor at the existing `!headers` branch. Preserve `createStreamRequestHeaders` invocation before the branch, no-fetch behavior for missing credentials, response body/status/header identity and ordering, and synchronous construction/error boundary. Prototype measurement: `GET` MI62.6→67.9, helper79.8, file warnings1→0, functions7→8; root predicted −1 warning. No other path/API/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and principal inspection, followed by full sensors, browser suite and paired Reviewer. W1 and ACH-34 remain open.

W1-ACH34-02 full Web integration result: `npm --workspace @stardust/web run test:integration` exited1 after 82 passed/6 failed in 7.2m. The exact six failures remain W2-owned: signup restores neither the pending attempt after reload nor already-complete persisted success; social confirmation does not take the existing-account direct protected route or redirect missing-session/hash visitors to sign-in, each at 390x844 and 1440x900. The changed W1 BFF routes and their focused browser cases passed. W2 remains scheduled after D2/S2/C1 dependencies.

W1-ACH34-03 source checkpoint: Spec/Plan definition gates passed before Builder ACK. Only the assigned `profile-events/route.ts` changed: GET calls the new synchronous `createAnonymousStreamResponse()` in the existing `!headers` branch; the helper returns the exact existing null-body 204 response with `NO_STORE_HEADERS`. CodeGraph confirms credential reads still precede the branch, missing credentials still avoid fetch, and response construction remains outside `fetchStream(...).catch(...)`. Focused Biome format/check passed. Principal inspection matches the assignment; full sensors and paired review pending.

W1-ACH34-03 paired Web Reviewer: **accepted statically, no findings; Rules: No change**. The reviewer confirms credential resolution before the anonymous branch, exact 204/null/no-store response, no anonymous fetch, unchanged synchronous constructor boundary and unchanged authenticated fetch/cancel/stream behavior.

Fresh sensors after W1-ACH34-03: `check:code`, `check:types`, test integrity and Server architecture passed. Official root complexity is exit2, **44 warnings/0 errors** (9,288 clean of 9,332 functions across 3,471 files), down45→44 as measured. Global unit tests are still running; Web integration must be rerun after this source change. `check:spec-implementation` remains exit1 on 251 unimplemented/unchanged contracted paths in downstream work; W1-ACH34-03 is recognized.

Integrated sensors after W1-ACH34-04, D2-145 and D2-146: global `check:code`, `check:types`, test integrity and Server architecture passed; global unit tests remain in progress. Official root complexity is exit2 at **41 warnings/0 errors**, 9,294 clean of9,335 functions across3,471 files, down44→41 with no new warning. Full Web integration after W1-ACH34-04 remains required.

W1-ACH34-03 full Web integration result: `npm --workspace @stardust/web run test:integration` exited1 after **82 passed/6 failed** in7.3m. Failures are the same W2 signup restore (2 cases) and social confirmation (2 behaviors × 2 viewports); all changed-path BFF cases passed, with no new failure from the anonymous-response extraction. `NextRestClient` assignment W1-ACH34-04 is released only after this run exited.

### Assignment W1-ACH34-04 — compor opções e headers multipart

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, REST, code-conventions); SHI n/a. Permit only `apps/web/src/rest/next/NextRestClient.ts`. Extract the existing synchronous multipart `Content-Type` removal into `createMultipartHeaders(headers: RequestInit['headers'])`, preserving local header construction before `sendJsonRequest`. Add a private `JsonResponseOptions<Body>` type to group the existing retry/refresh callbacks and optional response-header policy; have each of the four callers pass the same callbacks as named properties, and destructure them in the private `sendJsonRequest` signature with `includeHeaders = false`. Keep the `sendJsonRequest` body otherwise verbatim. Preserve exact-case multipart removal/copy behavior, URL/default init/init/body order, lazy retry/refresh callbacks and dynamic `this` dispatch, request/response behavior and public async API. Biome-faithful prototype: effective file warnings2→1 (raw6→5; four baseline-exempt unchanged), functions37→38; `postFormData` MI61.9→67.1, new helper77.3, `sendJsonRequest` unchanged63.3, factory MI30→30.3 with CC17 unchanged. No other path/API/test/threshold/baseline/runtime/remote change. Spec/Plan gates must pass before Builder ACK. Do not mutate while the current full Web integration run is using this module; after it exits, implement, focused format/check, pause for principal inspection, then rerun full sensors/browser and paired Reviewer. W1 and ACH-34 remain open.

### Assignment D2-145 — compor agregação tipada dos anexos da mensagem

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`. Extract the existing attachment-model column destructure and exact typed `sql<DrizzleFeedbackMessage['feedbackMessageAttachments']>` `coalesce/json_agg` expression from `messageColumns()` into private inferred `attachmentAggregate()`; keep `messageColumns()` spreading `getTableColumns(feedbackMessageModel)` and assigning `feedbackMessageAttachments: this.attachmentAggregate()` in place. Preserve exact SQL interpolations, correlated predicate, aggregate ordering, `[]` fallback, result type, query order and public API. Formatter-faithful measurement: `messageColumns` MI62.7→72.9, helper66.8, file warnings2→1, functions34→35; root predicted −1 warning. Moving only pure ORM metadata reads after `getTableColumns` is accepted; no database execution. No other path/helper/type/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and pause for principal inspection, followed by full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-145 source/review checkpoint: only `DrizzleFeedbackMessagesRepository.ts` changed; `messageColumns` retains the model-column spread and attachment property, while private `attachmentAggregate()` contains the unchanged typed correlated `coalesce/json_agg` SQL and seven metadata columns. Focused Biome format/check passed; principal CodeGraph inspection confirms exact fields, order and fallback. Paired Database Reviewer accepted statically with no findings; Rules `No change`. Full sensors pending.

D2-146 source checkpoint: Spec/Plan definition gates passed and Builder ACK preceded mutation. Only the same assigned repository changed: `persistMessage` preserves awaited lock → existing read → ensure ordering and delegates its original hydrate → assert attachment equality → return tail to private async `validatedMessage` in the same transaction. Focused Biome format/check passed; CodeGraph confirms call path and order. Principal inspection complete; paired review and integrated sensors pending.

D2-146 paired Database Reviewer: **accepted statically, no findings; Rules: No change**. The reviewer confirms the same transaction and awaits, validation before resolution, and unchanged public API/query set. This does not close D2 or ACH-34.

### Assignment D2-147 — encapsular a projeção correlacionada de respostas

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts`. Extract the existing alias and typed `sql<number>` correlated replies count from `readColumns()` into private inferred `repliesCount()`, preserving `alias(commentModel, 'comment_replies')`, the explicit FROM alias declaration via `sql.identifier('comment_replies')`, and the exact SQL/predicate. Keep readColumns field order `getTableColumns` → `authorColumns` → `upvotesCount` → `repliesCount: this.repliesCount()`. Preserve generated SQL, interpolation/correlation, ordering, type, query count and public API. Formatter-faithful measurement: `readColumns` MI63.1→68.0, helper74.0, file warnings1→0, functions35→36; root predicted −1 warning, all other scores unchanged. Moving pure alias/fragment construction to the final projection field is accepted; no DB execution. No other path/type/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and pause for principal inspection, followed by full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-147 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `DrizzleCommentsRepository.ts` changed. CodeGraph confirms private `repliesCount()` retains the exact `comment_replies` alias, explicit `sql.identifier`, correlated typed count expression, while readColumns preserves `getTableColumns` → author columns → upvote count → replies count order. Focused Biome format/check passed. Principal inspection matches assignment; paired review and integrated sensors pending.

D2-147 paired Database Reviewer: **accepted statically, no findings; Rules: No change**. The explicit comments alias declaration and correlation remain intact; reviewer confirms this does not reintroduce the earlier D2-90 alias bug. No extra query/API.

### Assignment D2-148 — isolar filtro de status das execuções incorretas

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts`. Extract the existing `status` model binding, unchanged typed `incorrectStatuses` array `['wrong_answer', 'syntax_error', 'runtime_error']`, and `inArray(status, incorrectStatuses)` into private inferred `incorrectStatusFilter()`. Keep `incorrectExecutionsQuery` SELECT fields and FROM as-is, then use the same `where(and(filter, this.incorrectStatusFilter()))`, preserving operand/status order and the earlier owner filter. Preserve SQL semantics, count caller, type and API. Formatter-faithful measurement: query MI63.8→67.3, helper71.0, file warnings1→0, functions20→21, all other scores unchanged; root predicted −1 warning. The status array is created after SELECT/FROM builder construction but before WHERE; ORM metadata/builder creation has no external side effect. No cast/count/data/path/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and pause for principal inspection, followed by full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-148 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `DrizzleChallengeCodeExecutionsRepository.ts` changed; the private inferred filter retains the same typed ordered three-status list and `inArray`, while the query retains the same SELECT/FROM and `and(filter, statusPredicate)` order. CodeGraph confirms the count caller and unchanged owner filter. Focused Biome format/check passed; principal inspection matches assignment.

D2-148 paired Database Reviewer: **accepted statically, no findings; Rules: No change**. Reviewer confirms the ordered values, type, filter operands/ownership and count caller are unchanged.

W1-ACH34-04 source checkpoint: the full Web integration run exited before mutation; only `apps/web/src/rest/next/NextRestClient.ts` changed. CodeGraph confirms multipart header preparation is extracted while remaining before dispatch, the four callers pass the same retry/refresh callbacks as named options, and `sendJsonRequest` immediately destructures with `includeHeaders=false` while retaining its dispatcher body. Focused Biome format/check passed. Principal inspection matches the measured design; paired review and integrated sensors/browser pending.

W1-ACH34-04 paired Web Reviewer: **accepted statically, no findings; Rules: No change**. Reviewer confirms exact-case multipart header behavior, lazy retry/refresh callbacks with dynamic `this`, unchanged dispatch/body order, response-header defaults, and public async/error behavior. Full sensors and repeat browser suite remain required.

### Assignment W1-ACH34-05 — encapsular limpeza do cookie de recibo

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/onboarding-attempt/route.ts`. Extract the existing receipt-cookie deletion block from `absentAttempt(response)` into synchronous `clearAttemptCookie(response: NextResponse)`; `absentAttempt` must retain creation of the exact `NextResponse.json(null, { headers: NO_STORE_HEADERS })`, invoke the helper, and return the same response object. Preserve response creation before cookie API lookup/key/value, `EMPTY_ATTEMPT_COOKIE` spread, production secure read, fresh `Date(0)` allocation, cookie `set` order and synchronous error boundary. Prototype: `absentAttempt` MI63.4→73.2, helper67.0, file warnings2→1, functions6→7; root predicted −1 warning; all other scores unchanged. No other path/header/cache/clock/API/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and pause for principal inspection, followed by full sensors, browser and paired Reviewer. W1 and ACH-34 remain open.

W1-ACH34-05 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `onboarding-attempt/route.ts` changed. CodeGraph confirms `absentAttempt` creates the same null/no-store response, synchronously invokes `clearAttemptCookie(response)`, and returns that same instance; helper retains cookie option spread, secure environment read and fresh `Date(0)` order. Focused Biome format/check passed. Principal inspection matches the assignment.

W1-ACH34-05 paired Web Reviewer: **accepted statically, no findings; Rules: No change**. Reviewer confirms response identity, cookie mutation order and error boundary are unchanged. Full sensors and repeat Web integration remain pending.

### Assignment D2-146 — encapsular hidratação e validação final de anexos

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`. Extract the existing final `hydrateMessage(transaction, message, existing)` await, `assertSameAttachments(persisted, message)`, and return into private async `validatedMessage(transaction, message, existing): Promise<FeedbackMessage>`. In `persistMessage`, retain the exact awaited `lockReport` → `existingMessage` → `ensureMessage` order, then return `validatedMessage(transaction, message, existing)`. Preserve same transaction, queries, attachment equality/throw timing before successful resolution, result identity and public API. Formatter-faithful prototype: `persistMessage` MI64.7→68.3, helper72.7, file warnings1→0, functions35→36; root predicted −1 warning, all other scores unchanged. The additional private Promise boundary is explicitly measured and accepted. No other path/API/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates before Builder ACK/source mutation; then focused format/check and pause for principal inspection, followed by full sensors and paired Reviewer. D2 and ACH-34 remain open.

Integrated checkpoint after D2-148 and W1-ACH34-05: global `check:code`, `check:types`, `test:unit`, test integrity, and Server architecture passed. Official `check:complexity` remains exit2 with **38 warnings/0 errors** (9,300 clean of 9,338 functions across 3,471 files), a reduction from 40→38 with no new warning. Spec and Plan definition gates pass. `check:spec-implementation` remains exit1 with 251 unfinished/downstream contracted paths; both latest source paths are recognized. Full Web integration was restarted after these changes (session pending); D2/W1 remain in progress, and the six known W2 behavior failures still require their dependency wave.

### Assignment W1-ACH34-06 — nomear a política de resposta do recibo

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/onboarding-attempt/route.ts`. Replace the existing `.then(upstream => upstream.status === 401 ? absentAttempt() : createAttemptResponse(upstream))` callback with `.then(resolveAttemptResponse)`, where a synchronous `resolveAttemptResponse(upstream: Response)` contains the exact existing conditional. Preserve the promise-handler boundary and timing, single status read, 401/other-status dispatch, response construction, synchronous errors/rejections caught by the existing downstream catch, and the missing-receipt branch outside that catch. Do not change cookie, date, cache, abort, body, or fetch behavior. CodeGraph/formatter-faithful prototype: GET MI64.1→66.4, callback MI88.9 replaced by named helper MI78.1, file warnings1→0 with seven functions unchanged, root predicted −1; all other measured scores unchanged. No other paths/types/tests/thresholds/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before source mutation; then focused Biome and principal inspection, followed by full sensors, full Web integration and paired Reviewer. W1 and ACH-34 remain open.

W1-ACH34-06 source checkpoint: full Web integration session71074 exited before mutation (82/88; exact six known W2 failures). Builder then changed only the assigned route. CodeGraph confirms GET retains missing-receipt return before `fetchAttempt`, `.then(resolveAttemptResponse)`, and the same downstream `.catch`; the new helper contains the identical single-read401 conditional and invokes only the selected response builder. Existing `absentAttempt`, cookie helper and upstream response builder remain unchanged. Focused Biome format/check passed. Principal inspection matches the assignment; paired review and global sensors pending.

W1-ACH34-06 integrated sensors: `check:code`, `check:types`, global `test:unit` (Server168 suites/325 tests), test integrity and Server architecture passed. Official complexity is exit2 at **37 warnings/0 errors** (9,301 clean of9,338 functions), down38→37 with no added warnings. `check:spec-implementation` still reports251 incomplete/downstream paths and recognizes W1-06. Full Web integration was restarted post-mutation (session4660 pending).

### Assignment D2-150 — distinguir as buscas legacy e administrativa

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `searchFilter(params, legacy: boolean)`, preserve the initial `const search = params.search?.value ?? params.authorName?.value` read, then delegate `legacy` to private `legacyAuthorSearch(params)` and the current search to private `reportIdentitySearch(search)`. Move the exact existing branch bodies unchanged: legacy authorName presence/`ilike(userModel.name, ...)` or `undefined`; current `!search` → `undefined`, else the same `or` of report-id text and email ilike in the same operand order. Preserve getter reads/short-circuiting, empty fallback, SQL literal/parameter spellings, result and synchronous query-builder behavior. CodeGraph/formatter-faithful prototype: searchFilter MI59.5→70.8, helpers72.3/68.3, file warnings8→7, functions78→80, root predicted −1, all other scores unchanged. A one-helper alternative did not lower file warnings and is explicitly excluded. The two helpers express distinct backward-compatible search policies and do no query/effect. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment W1-ACH34-07 — separar o despacho de resposta JSON

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, REST, code-conventions); SHI n/a. Permit only `apps/web/src/rest/next/NextRestClient.ts`. Extract the existing response routing inside `sendJsonRequest` into synchronous private `resolveJsonResponse<Body>(response, retry, onRefreshSuccess, includeHeaders)`: return the same `handleRestError<Body>(response,retry,onRefreshSuccess)` for `!response.ok`; otherwise return the same `createJsonResponse<Body>(response,includeHeaders)`. Replace only the inline `.then` callback body with a one-line call to the helper. Preserve the `.then` boundary/timing, single `response.ok` read, selected handler only, Promise adoption, lazy retry/refresh callbacks, dynamic `this`, request construction/URL/headers/body/cleanup and public API. CodeGraph/formatter-faithful prototype: `sendJsonRequest` MI63.3→66.2, helper70.0, effective file warnings1→0 (raw5→4; four baseline-exempt unchanged), functions38→39, root predicted −1; all other scores unchanged. A request-init helper is explicitly excluded because measured file warnings do not fall. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome, principal CodeGraph inspection, global sensors, full Web integration and paired Reviewer. W1 and ACH-34 remain open.

D2-150 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `DrizzleFeedbackReportsRepository.ts` changed. Fresh principal CodeGraph confirms the preserved initial search read, legacy dispatch, exact authorName `ilike` helper and report-ID/email `or` helper; listingFilter still supplies the searchFilter result in the same operand order. Both helpers are synchronous and introduce no query boundary. Focused Biome format/check passed. Principal inspection matches assignment; paired review and integrated sensors pending.

W1-ACH34-07 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `NextRestClient.ts` changed. Fresh principal CodeGraph confirms request URL/options/body remain intact; `.then` delegates to synchronous `resolveJsonResponse`, whose exact `response.ok` branch selects the same error/JSON handlers with the same arguments. Promise adoption and lazy callbacks remain. Focused Biome format/check passed. Paired Web Reviewer accepted with no findings; Rules `No change`. Integrated sensors passed at34 warnings/0 errors, but the next full Web run is still pending.

D2-151 source checkpoint: definition gates passed and Builder ACK preceded mutation. Only `DrizzleFeedbackReportsRepository.ts` changed. CodeGraph confirms period selection and early return remain in `periodFilter`, followed by private `createdWithinPeriod` with exact inclusive gte(startDate) then lte(endDate). The helper type derives from existing listing params. Focused Biome passed; principal inspection matches assignment. Paired review and combined sensors pending.

W1-ACH34-08 source checkpoint: definition gates passed and Builder ACK preceded mutation after Web integration session13183 exited. Only sign-up route changed. CodeGraph confirms the URL expression remains before method, and the payload helper evaluates `JSON.stringify(body)` before fresh Content-Type headers at the same fetch-init body/headers position; cache/signal/redirect remain. Focused Biome passed; principal inspection matches assignment. Paired review and combined sensors/Web integration pending.

### Assignment D2-149 — isolar metadados da página administrativa

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `adminPageResult`, retain `const [rows] = results` and the exact first evaluation of `this.entities(rows).map((report) => report.dto)` as `items`; then spread private inferred `adminPageMetadata(results,page,itemsPerPage)` returning the existing page, itemsPerPage, total fallback and summary fallback. In the helper, destructure the result tuple as `[, [total], [summary]]` and return only those exact metadata fields/fallbacks. Preserve object field order, mapping-before-metadata evaluation, result values, public API, query set/order and all SQL. This relies on the existing `adminPageQueries` `Promise.all` of ordinary Drizzle arrays/arrays of rows, not caller-supplied proxies/getters; CodeGraph confirms only that private caller. Formatter-faithful prototype: adminPageResult MI62.7→68.8; helper65.0; file warnings9→8; root predicted −1, all other scores unchanged. The boundary separates page metadata normalization from entity→DTO hydration. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment D2-151 — extrair o predicado temporal inclusivo

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. Preserve `periodFilter(params, legacy: boolean)`'s existing period selection (`legacy ? params.sentAtPeriod : (params.createdAtPeriod ?? params.sentAtPeriod)`) and `!period` early return. Move only the exact inclusive `and(gte(feedbackReportModel.createdAt, period.startDate), lte(feedbackReportModel.createdAt, period.endDate))` construction into private `createdWithinPeriod(period)` with type derived from `FeedbackReportsListingParams`; return its result from `periodFilter`. Preserve startDate/gte then endDate/lte evaluation, absent behavior, values, SQL parameters, public API/query behavior and listingFilter call. Formatter-faithful prototype: periodFilter MI62.2→67.4, helper70.2, file warnings7→6, root predicted −1; all other scores unchanged. This separates backward-compatible period selection from inclusive interval construction without extra queries/auth/effects. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment W1-ACH34-08 — agrupar payload JSON de signup

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/sign-up/route.ts`. Extract the exact JSON serialization and matching `Content-Type: application/json` into synchronous private `createSignUpPayload(body: z.infer<typeof schema>)`, returning `{ body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }`; spread its result at the existing body/headers position in `fetchSignUp`'s init. Preserve URL evaluation before method, body JSON serialization before fresh header allocation, final own-property order (`method`, `body`, `headers`, `cache`, `signal`, `redirect`), async fetch/catch timing and request signal/redirect/cache. No cookie/date/auth/status/stream changes. CodeGraph/formatter-faithful prototype: fetchSignUp MI63.8→65.7, helper78.9, file warnings3→2, functions13→14, root predicted −1; all other scores unchanged. A whole-init helper is excluded because it left warning count unchanged. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome, principal inspection, global sensors, full Web integration and paired Reviewer. W1 and ACH-34 remain open.

### Assignment D2-152 — encapsular a query legacy paginada

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `legacyList(params)`, retain `const filter = this.listingFilter(params, true)` before querying, then await/destructure the same `[rows,[total]]` result from a new private inferred `legacyListQueries(filter,params)`. The helper must return exactly `Promise.all([this.legacyPageQuery(filter, params), this.countQuery(filter)])` in the original order. Keep result composition `items: this.entities(rows)` then `count: total?.count ?? 0` and preserve the existing query set/order/concurrent execution, await boundary, fallback and API. CodeGraph/formatter-faithful prototype: `legacyList` MI64.9→70.4, helper77.9, file warnings6→5, root predicted −1; all other scores unchanged. The boundary separates paired legacy row/count execution from result composition and mirrors existing admin-page query composition. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment W1-ACH34-09 — separar cálculo e aplicação do cookie

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/sign-up/route.ts`. Keep `setAttemptCookie(response,value,expiresAt)`'s existing `maxAge` calculation in place; replace only its inline `response.cookies.set(...)` with synchronous `applyAttemptCookie(response,value,maxAge,expiresAt)`, then return the same `response`. Move the cookie set call and exact option object/body unchanged into the helper. Preserve cookie key/value, options spread, Secure environment read, `getAttemptLifetime` and all `Date.now`/new Date evaluation order after the maxAge calculation; keep synchronous throw/return behavior and caller error boundaries. Metrics from CodeGraph/formatter-faithful prototype: `setAttemptCookie` MI63.4→72.6, helper67.0, file warnings2→1, functions14→15, root predicted −1, other scores unchanged. A cookie-options factory was excluded because it did not reduce warnings. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome, principal inspection, global sensors, Web integration and paired Reviewer. W1 and ACH-34 remain open.

### Assignment D2-153 — encapsular payload de transição de status

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. Extract the exact existing `.set` value object in `updateStatusQuery(report, expectedStatus)` into private inferred `statusTransitionValues(report: FeedbackReport)`, returning `{ status: report.status.value, lastActivityAt: sql\`greatest(${feedbackReportModel.lastActivityAt}, now())\` }`; have the query call `.set(this.statusTransitionValues(report))`. Preserve status getter before SQL construction, database-side `now()`, atomic UPDATE/SET/expected-status WHERE/RETURNING order, lock/validation upstream, result behavior and API. CodeGraph/formatter-faithful measurement: updateStatusQuery MI63.4→67.8, helper72.0, file warnings5→4, root predicted −1; all other scores unchanged. This groups only transition values and introduces no query, clock read, await, cast, lock or auth change. No other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment W1-ACH34-10 — nomear a política de origem proibida no signup

Spec revision7; W1/Builder Web; RF-07/RF-09/RF-10/RF-12; CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; W1 Rule Pack (web-application, web-app-routes-testing, REST, code-conventions); SHI n/a. Permit only `apps/web/src/app/api/auth/sign-up/route.ts`. Extract the exact existing origin guard into synchronous private `isForbiddenSignUpOrigin(request: NextRequest)`, returning `request.headers.get('origin') !== new URL(CLIENT_ENV.stardustWebUrl).origin`; retain `if (isForbiddenSignUpOrigin(request)) return createFailureResponse(FORBIDDEN_BODY, 403)` as the first operation in `POST`. Preserve Origin read → canonical configured URL construction/origin read → forbidden response/cookie clearing before body read, comparison semantics for missing/empty/foreign origins, synchronous exception boundary outside the upstream fetch catch, and all allowed-request flow. Formatter-faithful measurement: POST MI61.6→65.0, helper77.0, file warnings1→0, functions15→16, root predicted −1; other remaining function scores unchanged. The measured helper is threshold-tight and must be confirmed by official complexity. No caching, URL reuse, new async boundary or other path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; do not mutate while the full Web integration run uses the route. After exit, focused Biome and principal inspection, full sensors and paired Reviewer. W1 and ACH-34 remain open.

D2-153 source/review checkpoint: only `DrizzleFeedbackReportsRepository.ts` changed. CodeGraph confirms status getter then the same database-side `greatest(lastActivityAt, now())` payload are isolated in private inferred `statusTransitionValues`; `updateStatusQuery` preserves transaction UPDATE → SET → expected-status WHERE → RETURNING. Focused Biome passed; paired Database Reviewer accepted statically, no findings; Rules `No change`.

W1-ACH34-10 source/review checkpoint: only signup `route.ts` changed. CodeGraph confirms POST's first operation calls synchronous `isForbiddenSignUpOrigin`, which preserves the exact Origin read → configured URL construction/origin comparison, then 403/cookie clearing before body read and outside the upstream catch. Focused Biome passed; paired Web Reviewer accepted statically, no findings; Rules `No change`. Official complexity reduces root warnings30→28, zero errors; full global/browser sensors pending.

Integrated D2-152/D2-153/W1-ACH34-09/10 sensors: `check:code`, `check:types`, `test:unit`, Server architecture, test integrity and Web coverage ratchet passed. Unit totals: Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1/1. Root complexity exits2 with28 warnings/0 errors, down30→28. `check:spec-implementation` exits1 with251 remaining contracted incomplete/downstream paths and recognizes the latest source paths. Server coverage ratchet remains the tracked ACH-35: lines/statements47.67% and functions31.76% below baseline51.60%/47.11%, branches88.97% above82.98%; no baseline edit. Full Web integration after W1-10 exited1 at82/88 with the same six known W2 signup-restoration and social-confirmation failures; no new W1 failure. Spec/Plan definition gates passed after assignments/checkpoint updates.

### Assignment D2-154 — separar avanço administrativo da preservação de atividade

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `savedAdminActivity(report,current,admin)`, preserve the exact `if (!admin) return { lastAdminMessageAt: current.lastAdminMessageAt, studioReadAt: current.studioReadAt }`; move only the admin branch's existing model-column destructure and two-field return object into private inferred `advancedAdminActivity(report: FeedbackReport)`, and return `this.advancedAdminActivity(report)` from the admin branch. Preserve report timestamp reads/order, null fallbacks, each exact database-side `greatest` expression, authorization-dependent laziness, UPDATE payload composition and transaction behavior. CodeGraph/formatter-faithful prototype: `savedAdminActivity` MI61.2→67.6, helper68.3, file warnings4→3, root predicted −1, all other scores unchanged. No extra query, timestamp/clock read, cast, lock, path, test, threshold/baseline/runtime/remote operation. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-154 source/review checkpoint: only `DrizzleFeedbackReportsRepository.ts` changed. CodeGraph confirms the non-admin snapshot branch returns the same current timestamps without reading report timestamps; the admin branch delegates to private inferred `advancedAdminActivity`, preserving column/field order, null fallbacks, `greatest` SQL and transaction payload. Focused Biome passed; paired Database Reviewer accepted statically, no findings; Rules `No change`. Fresh code/types/unit/architecture/integrity/coverage and conformance sensors are running.

D2-154 integrated sensors: `check:code`, `check:types`, global `test:unit`, Server architecture and `check:test-integrity` passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Complexity exits2 at27 warnings/0 errors, down28→27. Server coverage tests passed all168 suites/325 tests; the existing coverage ratchet remains below baseline at47.67% lines/statements and31.75% functions (baselines51.60%/47.11%), with branches88.97% above82.98%; ACH-35 stays open and no baseline change. Spec conformance exits1 with251 remaining incomplete/downstream paths. No Server runtime mutation or remote operation occurred.

### Assignment D2-155 — agrupar composição de status e atividade da conversa

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `savedValues(report,current)`, preserve the initial `admin = access.kind === 'god' || access.kind === 'system'` evaluation and first spread `...this.savedContent(report)`; replace only the consecutive status, `savedAuthorActivity(report)` and `savedAdminActivity(report,current,admin)` tail with `...this.savedConversationValues(report,current,admin)`. Add the private inferred helper returning exactly `{ status: admin && report.status.isClosed.isTrue ? 'closed' : current.status, ...this.savedAuthorActivity(report), ...this.savedAdminActivity(report, current, admin) }` in that order. Preserve status/getter short-circuiting, all field/SQL-fragment evaluation order, authorization-dependent branch laziness, timestamp null fallbacks and PostgreSQL `greatest`; keep UPDATE payload, type, lock, transaction and public API unchanged. CodeGraph/formatter-faithful prototype: savedValues MI62.4→67.1, helper66.9, file warnings3→2, root predicted −1; all other scores unchanged. No casts, extra query, path/test/threshold/baseline/runtime/remote operation. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-155 source/review checkpoint: only `DrizzleFeedbackReportsRepository.ts` changed. CodeGraph confirms `savedValues` retains actor check and content first, while inferred `savedConversationValues` retains status → author activity → admin activity evaluation and the original field/SQL fragments. Focused Biome passed; paired Database Reviewer accepted statically, no findings; Rules `No change`.

D2-155 integrated sensors: code, types, global unit, Server architecture and test integrity passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Complexity exits2 at26 warnings/0 errors, down27→26. All Server coverage suites passed, then coverage ratchet remained below baseline at47.66% lines/statements and31.74% functions (51.60%/47.11% baselines), branches88.97% >82.98%; tracked ACH-35 remains open without baseline changes. Conformance remains exit1 with251 incomplete/downstream paths. Definition gates pass; no Server runtime/remote mutation.

### Assignment D2-156 — nomear a condição de ownership da listagem pública

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`. Extract the exact existing owner ternary inside `publicListingVisibility()` into a private inferred `publicListingOwnerCondition()` returning `this.access.kind === 'user' || this.access.kind === 'god' ? eq(challengeModel.userId, this.access.accountId.value) : undefined`; keep `publicListingVisibility()` as `or(eq(challengeModel.isPublic, true), this.publicListingOwnerCondition())` with the same operand order. Do not reuse `ownerCondition()` because it intentionally differs for `god`. Preserve access-kind short-circuit and accountId read behavior, exact equality SQL, public/user/god/system semantics, filter composition and callers. CodeGraph/formatter-faithful prototype: `publicListingVisibility` MI64.7→78.4, helper70.1, file warnings5→4, root predicted −1; all other scores unchanged. No API/query/authorization/path/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-156 source/review checkpoint: only `DrizzleChallengesRepository.ts` changed. CodeGraph confirms the `user || god` owner predicate is isolated and the public visibility `or(isPublic, owner)` operand order remains unchanged; the distinct generic `ownerCondition()` was not reused. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`.

D2-156 integrated sensors: `check:code`, `check:types`, global `test:unit`, Server architecture and `check:test-integrity` passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Complexity exits2 at25 warnings/0 errors, down26→25. Server coverage ran all168 suites/325 tests; the tracked ACH-35 ratchet remains below baseline at47.66% lines/statements and31.72% functions (51.60%/47.11%), with branches88.97% above82.98%. Conformance remains exit1 with251 incomplete/downstream paths. No baseline, runtime, or remote database change.

### Assignment D2-157 — encapsular filtros de visibilidade não administrativa

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`. In `visibility(starContent = false)`, preserve the initial `god || system` bypass and its `undefined` return. Replace only the non-administrative `or(...)` body with `return this.nonAdminVisibility(starContent)`. Add private inferred `nonAdminVisibility(starContent: boolean)` returning exactly `or(eq(challengeModel.isPublic, true), this.ownerCondition(), starContent ? this.availableStarContent() : undefined)` in that operand/evaluation order. Preserve default argument behavior, role short-circuiting, owner equality, lazy optional-star construction, SQL meaning, all caller contracts and API. CodeGraph/formatter-faithful prototype: `visibility` MI64.6→73.2, helper68.5, file warnings4→3, root predicted−1, all other scores unchanged. No new query, authorization change, path/type/test/threshold/baseline/runtime/remote operation. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-157 source/review checkpoint: only `DrizzleChallengesRepository.ts` changed. Principal CodeGraph confirms `visibility(starContent = false)` retains the `god || system → undefined` bypass and delegates the unchanged public equality → owner condition → lazy optional star criterion order. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`.

D2-157 integrated sensors: global `check:code`, `check:types`, `test:unit`, Server architecture and `check:test-integrity` passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Official complexity exits2 at24 warnings/0 errors, down25→24. Server coverage ran all168 suites/325 tests; the tracked ACH-35 ratchet remains below baseline at47.66% lines/statements and31.71% functions (51.60%/47.11%), branches88.97% above82.98%. Conformance exits1 with contracted paths still incomplete/downstream and worktree-vs-baseline path mismatches. No baseline, runtime, or remote database change.

### Assignment D2-158 — isolar o filtro author-only da publicação

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`. In `publicationFilter(params)`, retain the existing star exclusion as the first `and(...)` operand and replace only the nested author-only ternary with `this.authorOnlyFilter(params)`. Add private inferred `authorOnlyFilter(params: ChallengesListParams)` returning exactly `params.shouldIncludeOnlyAuthorChallenges.isTrue ? params.userId ? eq(challengeModel.userId, params.userId.value) : sql\`false\` : undefined`. Preserve getter/short-circuit order, fail-closed missing-user result, SQL value, false/undefined semantics, operand order, publication behavior and callers; do not eagerly read or cache `userId`. CodeGraph/formatter-faithful prototype: `publicationFilter` MI60.7→67.1, helper67.6, file warnings3→2, root predicted−1, all other scores unchanged. No API/query/authorization/path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-158 source/review checkpoint: only `DrizzleChallengesRepository.ts` changed. Principal CodeGraph confirms star exclusion remains the first publication-filter operand and inferred `authorOnlyFilter` preserves include-only → optional-user → equality/SQL-false/undefined short-circuit semantics. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`.

D2-158 integrated sensors: global code/types/unit, Server architecture and test integrity passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Complexity exits2 at23 warnings/0 errors, down24→23. Server coverage ran all168 suites/325 tests; ACH-35's unchanged ratchet remains below baseline at47.66% lines/statements and31.69% functions (51.60%/47.11%), with branches88.97% above82.98%. Conformance remains incomplete with baseline path-state mismatches. No baseline, runtime or remote database change.

### Assignment D2-159 — separar query e interpretação de voto

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`. In `findVoteByChallengeAndUser(challengeId,userId)`, retain `authorizeOwner(userId)` before `executeQuery`; inside its callback, await a new private inferred `voteQuery(challengeId,userId)` and keep `ChallengeVote.create(row?.vote ?? 'none')` unchanged. Move only the exact existing SELECT → FROM → shared `voteFilter(challengeId,userId)` WHERE → LIMIT 1 chain into `voteQuery`. Preserve composite-filter reuse, query count/SQL/parameter/evaluation order, await and error boundaries, absent-row fallback, domain conversion, return type and API. CodeGraph/formatter-faithful prototype: callback MI64.6→74.0, helper67.5, file warning count2→1, root predicted−1 from23, other scores unchanged. No new query/filter/auth/path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-159 source/review checkpoint: only `DrizzleChallengesRepository.ts` changed. Principal CodeGraph confirms `authorizeOwner` remains before `executeQuery`; inferred `voteQuery` keeps SELECT vote → FROM → shared WHERE filter → LIMIT 1, while the caller awaits and preserves `ChallengeVote.create(row?.vote ?? 'none')`. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`.

D2-159 integrated sensors: global code/types/unit, Server architecture and test integrity passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Complexity exits2 at22 warnings/0 errors, down23→22. Server coverage ran all168 suites/325 tests; ACH-35 remains below baseline at47.66% lines/statements and31.68% functions (51.60%/47.11%), branches88.97% above82.98%. Conformance remains incomplete with baseline path-state mismatches. No baseline, runtime or remote database change.

### Assignment D2-160 — separar os critérios opcionais de ordenação

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/challenging/DrizzleChallengesRepository.ts`. In `listingOrder(params)`, preserve creation of the same initial mutable array `[asc(challengeModel.difficultyLevel)]`; replace only its existing loop over `this.orderingCriteria(params)` with a call to private `appendListingOrders(orders: SQL[], params: ChallengesListParams): void`, then return the same `orders` array. Move the exact loop unchanged: iterate the ordering criteria in existing tuple order; append `asc(column)` when `order.isAscending.isTrue`, else append `desc(column)` only when `order.isDescending.isTrue`. Preserve eager `orderingCriteria(params)` construction at the same post-array position, iteration order, lazy descending getter, array identity/mutation, SQL expressions and fallback omission. No copy/filter/reorder, cast or changed default. CodeGraph/formatter-faithful prototype: `listingOrder` MI64.0→72.9, helper67.7, repository warning count1→0, root predicted−1 from22, all other scores unchanged. No API/query/auth/path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-160 source/review checkpoint: only `DrizzleChallengesRepository.ts` changed. Principal CodeGraph confirms the same difficulty-first array is returned after helper mutation; criteria construction remains after initialization and the loop keeps exact order with lazy descending read. Focused Biome passed; paired Database Reviewer accepted statically, no findings; Rules `No change`.

D2-160 integrated sensors: code and types passed; initial global unit run hit one Studio 5s timeout under concurrent coverage load, then the full global unit retry passed (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1). Server architecture and integrity passed. Complexity exits2 at21 warnings/0 errors, down22→21. Server coverage ran all168 suites/325 tests; ACH-35 remains below baseline at47.65% lines/statements and31.67% functions (51.60%/47.11%), branches88.97% above82.98%. Conformance remains incomplete with baseline path-state mismatches. No baseline, runtime or remote database change.

### Assignment D2-161 — encapsular critérios de ordenação de usuários

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. In `listingOrder(params)`, preserve `const orders: SQL[] = []`; replace only its optional `orderingCriteria(params)` loop with private `appendListingOrders(orders: SQL[], params: UsersListingParams): void`, keep the mandatory `orders.push(desc(userModel.createdAt))` after the helper call, and return the same array. Move the exact loop unchanged: criteria tuple order, ascending-first check, descending `else if`, pushes to the supplied array. Preserve eager `orderingCriteria`/`progressCountColumns` SQL construction at its current post-empty-array position, direction getter short-circuiting, array identity, mandatory tie-break last, SQL and omission behavior. No copied array, criteria reorder, cast or query change. CodeGraph/formatter-faithful prototype: `listingOrder` MI62.6→70.3, helper67.7, file warnings8→7, predicted root−1 from21, others unchanged. No API/query/auth/path/type/test/threshold/baseline/runtime/remote change. Require Spec/Plan gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-161 source/review checkpoint: only `DrizzleUsersRepository.ts` changed. Principal CodeGraph confirms the empty array is retained, the optional loop mutates the same array, and mandatory `desc(createdAt)` is still appended last; eager progress SQL construction and direction short-circuit remain. Focused Biome passed; paired Database Reviewer accepted statically without findings; Rules `No change`.

D2-161 integrated sensors: code, types, full global unit, Server architecture and test integrity passed (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1). Complexity exits2 at20 warnings/0 errors, down21→20. Server coverage ran all168 suites/325 tests; ACH-35 remains below baseline at47.65% lines/statements and31.65% functions (51.60%/47.11%), branches88.97% above82.98%. Conformance remains incomplete with baseline path-state mismatches. No baseline, runtime or remote database change.

### Assignment D2-162 — separar a seleção da relação de insígnias

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. In `insigniaUsersQuery(params)`, preserve the existing selected user id and exact role-filter `.where(...)`; extract only the existing SELECT → FROM acquired-insignia relation → INNER JOIN insignia on identical ids into private inferred `acquiredInsigniaUsersQuery()`, and make `insigniaUsersQuery` call that helper before applying the same role filter. Preserve projection alias, join type/condition/cardinality, role mapping order after query construction, query count, inferred result type and all callers. No eager role mapping, new condition/query, explicit cast, API/auth/path/test/threshold/baseline/runtime/remote change. CodeGraph/formatter-faithful prototype: `insigniaUsersQuery` MI58.6→67.6, helper65.2, file warnings7→6, predicted root−1 from20, all other scores unchanged. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-162 accepted checkpoint: CodeGraph confirms the acquired-insignia helper keeps the same projection, join alias and condition, and leaves role filtering/mapping at the caller. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`. Code, types, global unit, Server architecture and test-integrity checks passed. Complexity improved20→19 warnings with0 errors. All168 Server coverage suites/325 tests passed; `check:coverage` still fails tracked ACH-35 at47.65% lines/statements and31.64% functions versus51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete with505 contracted paths and path-state mismatches; no runtime or remote database operation.

### Assignment D2-163 — separar envelope de tier do perfil

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`. In `appearance(row)`, preserve avatar then rocket construction and replace only the inline tier envelope with `tier: selectedTier(row)`. Add private inferred `selectedTier(row: DrizzleUser)` returning exactly `{ id: row.tier?.id ?? '', entity: tierProfile(row.tier) }`. Preserve tier id fallback, subsequent `tierProfile` call/read order, avatar/rocket/tier field order, mapper output and the `toDto` call path. CodeGraph/formatter-faithful prototype predicts `appearance` MI63.8→69.3, helper70.9, mapper warnings3→2, root−1; other scores unchanged. No public type, query, path, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-163 accepted checkpoint: the principal CodeGraph confirms `appearance → selectedTier → tierProfile`; avatar → rocket → tier order, the `''` id fallback and both tier reads remain exact. Focused Biome passed; paired Database Reviewer accepted statically, no findings; Rules `No change`. Global code, types, unit, Server architecture and test integrity passed. Complexity improved19→18 warnings with0 errors. Server coverage passed all168 suites/325 tests; the tracked ACH-35 ratchet remains below baseline at47.65% lines/statements and31.62% functions versus51.60%/47.11%, with branches88.97% above82.98%. No baseline change. Spec conformance remains incomplete at505 contracted paths and path-state mismatches; no database runtime or remote operation.

### Assignment D2-164 — agrupar composição básica do perfil

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`. In `DrizzleUserMapper.toDto(row)`, replace only the contiguous spreads `...identity(row)`, `...performance(row)`, `...studyRoutine(row)` with `...accountProfile(row)`. Add module-private inferred `accountProfile(row: DrizzleUser)` returning exactly `{ ...identity(row), ...performance(row), ...studyRoutine(row) }` in that order. Keep `appearance`, `progress`, and `rankingState` spreads afterward and unchanged. Preserve returned field/property order, row getter reads, helper calls and all mapper outputs. CodeGraph/formatter-faithful prototype predicts `toDto` MI64.6→68.2, helper78.5, mapper warnings2→1, root18→17; other scores unchanged. Reusing `relationshipIds` for insignia roles is a measured no-go (achievements MI62.2→62.8; file warning count unchanged). No public type, query, path, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-164 accepted checkpoint: CodeGraph confirms `toDto` retains accountProfile → appearance → progress → rankingState; `accountProfile` evaluates identity → performance → studyRoutine. Paired Database Reviewer accepted statically with no findings; Rules `No change`. Code, types, global unit, Server architecture and test integrity passed. Complexity improved18→17 warnings with0 errors. Server coverage passed168 suites/325 tests at47.64% lines/statements and31.61% functions; the tracked ACH-35 ratchet remains below51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete at505 contracted paths and path-state mismatches; no runtime or remote database operation.

### Assignment D2-165 — isolar o avatar do perfil do autor

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/forum/DrizzleCommentMapper.ts`. In private static `authorProfile(row)`, replace only the inline avatar object with `DrizzleCommentMapper.authorAvatar(row)`. Add private static `authorAvatar(row: DrizzleComment)` returning exactly `{ name: row.authorAvatarName ?? '', image: row.authorAvatarImage ?? '' }`. Preserve `name` → `slug` → `avatar` field order, getter evaluation order, empty-string defaults, static mapper API and all other entity/persistence behavior. CodeGraph/formatter-faithful prototype predicts `authorProfile` MI63.6→68.2, helper77.9, file warnings1→0, root17→16; other scores unchanged. No path, type, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-165 accepted checkpoint: CodeGraph confirms `authorProfile` preserves name → slug → avatar and delegates only the avatar object to private static `authorAvatar`; name → image reads and `?? ''` fallbacks are exact. Paired Database Reviewer accepted statically with no findings; Rules `No change`. Global code/types/unit, Server architecture and test integrity passed. Complexity improved17→16 warnings with0 errors. Server coverage passed168 suites/325 tests at47.64% lines/statements and31.60% functions; the tracked ACH-35 ratchet remains below51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete at505 paths and path-state mismatches; no runtime or remote database operation.

### Assignment D2-166 — agrupar composição de publicação do desafio

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeMapper.ts`. In static `toEntity(row)`, replace only the contiguous object members `id: row.id`, `...content(row)`, `...publication(row)`, and `...exercise(row)` with `...DrizzleChallengeMapper.exercisePublication(row)`. Add private static inferred `exercisePublication(row: DrizzleChallenge)` returning exactly `{ id: row.id, ...DrizzleChallengeMapper.content(row), ...DrizzleChallengeMapper.publication(row), ...DrizzleChallengeMapper.exercise(row) }` in that order. Keep evaluation → engagement → author after this block, and preserve the rest of the entity and persistence mappers. Preserve fields, evaluation order, property order and all values. CodeGraph/formatter-faithful prototype predicts `toEntity` MI61.4→66, helper67, file warnings2→1, root16→15; other scores unchanged. No query, API/type, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-166 accepted checkpoint: the paired Database Reviewer confirms the exact id → content → publication → exercise block, then evaluation → engagement → author; the persistence projection is unchanged. No findings; Rules `No change`. Global code/types/unit, Server architecture and test integrity passed. Complexity improved16→15 warnings with0 errors. Server coverage passed168 suites/325 tests at47.64% lines/statements and31.58% functions; the tracked ACH-35 gate remains below51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete with505 contracted paths and path-state mismatches; no runtime or remote DB operation.

### Assignment D2-167 — agrupar resumo conversacional do report

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts`. In static `toEntity(row)`, preserve `content`, `author`, and `lifecycle` spreads first; replace only the contiguous `activity`, `readState`, `authorEmail`, and `preview` tail with `...DrizzleFeedbackReportMapper.conversationSummary(row)`. Add private static inferred `conversationSummary(row: DrizzleFeedbackReport)` returning exactly `{ ...DrizzleFeedbackReportMapper.activity(row), ...DrizzleFeedbackReportMapper.readState(row), authorEmail: row.authorEmail ?? row.users?.email, preview: row.preview ?? row.content }` in that order. Preserve date conversion/fallbacks, row getter and helper order, resulting fields and `toPersistence` behavior. CodeGraph/formatter-faithful prototype predicts `toEntity` MI60.5→66, helper65.4, file warnings1→0, root15→14; other scores unchanged. The alternate content→author→lifecycle grouping is a measured no-go (no file warning reduction). No query, API/type, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-167 accepted checkpoint: CodeGraph confirms `toEntity` preserves content → author → lifecycle before the helper, which preserves activity → readState → authorEmail → preview and both nullish fallbacks. Paired Database Reviewer accepted statically with no findings; Rules `No change`. Global code/types/unit, Server architecture and integrity passed. Complexity improved15→14 warnings with0 errors. Server coverage passed168 suites/325 tests at47.63% lines/statements and31.57% functions; the tracked ACH-35 ratchet remains below51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete at505 paths; no runtime or remote DB operation.

### Assignment D2-168 — separar progresso de achievements das insignias

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`. In `achievements(row)`, replace only the contiguous `unlockedAchievementsIds` and `rescuableAchievementsIds` members with `...achievementProgress(row)`, keeping `insigniaRoles` afterward unchanged. Add module-private inferred `achievementProgress(row: DrizzleUser)` returning exactly those two fields via the existing `relationshipIds` calls and callbacks in the same order. Preserve all arrays/references, row reads, mapping callbacks/defaults, DTO order and other mapper behavior. CodeGraph/formatter-faithful prototype predicts `achievements` MI62.2→71.3, helper65, file warnings1→0 and root14→13; other scores unchanged. The helper's MI is exactly at the warning threshold; accept the assignment only if the official complexity sensor confirms no new warning. No query, public type, path, test, threshold, baseline, runtime or remote change. Require definition gates and Builder ACK before mutation; focused Biome, principal inspection, full sensors and paired Reviewer. D2 and ACH-34 remain open.

D2-168 accepted checkpoint: the official complexity sensor confirms the threshold-tight helper adds no warning; total warnings improved14→13, with0 errors. CodeGraph and paired Database Reviewer confirm unlocked IDs → rescuable IDs → insignia roles, unchanged `relationshipIds` calls/callbacks and defaults; no findings, Rules `No change`. Global code/types/unit, Server architecture and test integrity passed. Coverage passed168 suites/325 tests at47.63% lines/statements and31.56% functions; the tracked ACH-35 ratchet remains below51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete at505 paths; no runtime or remote DB operation.

D2-169 source/review checkpoint: only `DrizzleChallengeMapper.ts` changed. Principal CodeGraph and paired Database Reviewer confirm `challenge.dto` remains one read before `slug` and `author.id`, followed by the exact `starId ?? null` → `isPublic` → `isNew` projection; no findings, Rules `No change`. Focused Biome format/check passed. Integrated code, types, Server architecture, integrity and global unit passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Official root complexity improved13→12 warnings with0 errors. Server coverage passed all168 suites/325 tests at47.62% lines/statements,31.54% functions and88.97% branches; `check:coverage` remains below unchanged ACH-35 baselines51.60%/47.11%/82.98%. `check:spec-implementation` remains failed against the 505-path contract with unchanged/missing/removed-state mismatches. No baseline, runtime or remote DB change.

### Assignment D2-169 — encapsular o estado de publicação do desafio

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/mappers/challenging/DrizzleChallengeMapper.ts`. In `persistencePublication(challenge)`, preserve `const dto = challenge.dto`, `slug: challenge.slug.value`, and `userId: dto.author.id`; replace only the contiguous `starId`, `isPublic`, and `isNew` members with `...publicationState(dto)`. Add module-private inferred `publicationState(dto: Challenge['dto'])` returning exactly `{ starId: dto.starId ?? null, isPublic: dto.isPublic, isNew: dto.isNew }` in that order. Preserve DTO getter count/position, slug and author reads, field order, null fallback and values; leave SQL/persistence behavior unchanged. CodeGraph/formatter-faithful prototype predicts `persistencePublication` MI63.4→67, helper77.7, mapper warnings1→0 and root13→12, other scores unchanged. No public type, query, path, test, threshold, baseline, runtime or remote change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome and principal inspection, then full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment D2-170 — compor projeções de relações por metadados tipados

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-10; CA-04/CA-05/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. Add module-private immutable descriptors for exactly the nine existing relationship projections (table, literal JSON key, column and owner). Keep the five current selection composers, keys, and field order; replace only repeated four-argument `relationshipProjection` calls with typed descriptor lookups. Implement `relationshipProjection<K extends keyof DrizzleUser>(key: K & keyof typeof relationshipMetadata): SQL<DrizzleUser[K]>` by reading the descriptor and creating a fresh SQL expression with the JSON key explicitly cast to `text`. Preserve SQL query shape, correlated owner predicate, JSON key/value names, `coalesce(..., '[]'::json)`, laziness/fresh SQL allocation, and completion/insignia projections. Read-only prototype evidence: TypeScript virtual overlay0 diagnostics, generated SQL7 assertions, and local PostgreSQL18 read-only literal-vs-bound `::text` JSON/type comparisons passed; projected repository warnings6→1 and global warnings12→7. No cast, public type, caller/query/API/auth/path/test/threshold/baseline/runtime/remote change. The uncast bound-key prototype failed with SQLSTATE42P18 and is explicitly rejected. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome, principal inspection, official complexity confirmation, full sensors and paired Reviewer. Metadata is read at module import and the SQL key changes from a trusted literal fragment to a typed parameter; reviewer must assess this timing/SQL difference and S2 must later exercise the production projections. D2 and ACH-34 remain open.

### Assignment D2-171 — nomear a construção de cada constraint/index de feedback

Spec revision7; D2/Builder Database; RF-01/RF-03/RF-04/RF-10; CA-04/CA-07/CA-08/CA-20; D2 Rule Pack (database, code-conventions); SHI n/a. Permit only `apps/server/src/database/drizzle/models/reporting/feedback-report-model.ts`. Replace `integrityConstraints`, `authorHistoryIndexes` and `queueIndexes` with one ordered module-private `pgTable` extra-config composition and nine small constructors, one per existing primary key, check, foreign key or index. Keep exact config order: primary key, status check, title-length check, cascading author foreign key, author-history index, author-unread index, queue index, studio-unread index, user index. Preserve every schema object/name, SQL predicate, column, direction/null ordering, partial-index predicate and FK action; do not change models, generated snapshots/migrations or data semantics. Read-only formatter-faithful prototype measured all nine constructors MI66–80.4, composition86.3, zero file warnings (3→0); projected global complexity7→4 (the remaining six D2 warnings are reduced by3; W2 remains). No API, schema name/object, query, test, threshold, baseline, runtime, remote or other path change. Require Spec/Plan definition gates and Builder ACK before mutation; inspect property access/order carefully; run focused Biome, exact SQL/catalog-generation proof, official complexity, full sensors and paired Reviewer. This per-schema-object organization must be accepted as a cohesive boundary; no helper may remain below the warning threshold or increase root warnings. D2 and ACH-34 remain open.

### Assignment D2-172 — agrupar ordenações de desempenho e contagens

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-10; CA-01/CA-03/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. Replace `orderingCriteria` with two module-private ordered tuple groups: scalar performance (`levelOrder`, `weeklyXpOrder`) and relation counts (`unlockedStarCountOrder`, `unlockedAchievementCountOrder`, `completedChallengeCountOrder`). Preserve `appendListingOrders` loop and its ascending-before-descending checks unchanged. Allocate `progressCountColumns()` before reading any order fields, create all five criteria in the original field-read sequence before the existing append loop, and spread groups in that same order. Validate each group with `satisfies readonly (readonly [UsersListingParams['levelOrder'], SQLWrapper])[]`; add no assertion/cast, `any`, public type or runtime mechanism. Preserve `SQLWrapper`/domain `ListingOrder` typing, selected columns, mandatory trailing `createdAt DESC`, and all ordering behavior. Formatter-faithful prototype: old `orderingCriteria` MI62.8→68.1; group helpers MI69.5/70.7; file warnings1→0 and projected global4→3. Virtual Server TypeScript0 diagnostics, no new assertions. No query/auth/API/test/threshold/baseline/runtime/remote or other path change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome/TypeScript, principal order inspection, official complexity, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment D2-173 — isolar o filtro de lock de report por id

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-03/RF-04; CA-01/CA-03/CA-07/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. In `transitionReport`, replace only the inline `this.lockReport(transaction, eq(feedbackReportModel.id, report.id.value))` call with private non-async inferred `lockReportById(transaction, report)`, whose body returns that exact `lockReport(transaction, eq(...))` expression. Keep the existing `await` in `transitionReport` and preserve the same transaction, report id access, filter construction, lock acquisition, canonical status check/error, update and result mapping in the same order. Do not add an async/promise boundary or alter any query. Read-only formatter-faithful metrics: `transitionReport` MI61.8→66; helper77.6; file warnings2→1, root D2 warnings2→1 (global projected3→2, W2 unchanged); full Server virtual TypeScript0 diagnostics. No type/API/auth/query/test/threshold/baseline/runtime/remote or other path change. Require Spec/Plan definition gates and Builder ACK before mutation; focused Biome/TypeScript, principal inspection of exact awaited call/query order, official complexity, full sensors and paired Reviewer. D2 and ACH-34 remain open.

### Assignment D2-174 — separar consulta e tradução da página de reports do autor

Spec revision7; D2/Builder Database; RF-01/RF-02/RF-10; CA-01/CA-03/CA-20; D2 Rule Pack (database, code-conventions, server-application); SHI n/a. Permit only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. Keep `listByAuthor` authorization first and the same `executeQuery` error boundary. Inside its existing callback, evaluate exactly once and in order: `authorListingFilter(authorId,status)`, `page.value`, then `Math.min(itemsPerPage.value,10)`; call private inferred `authorPage(filter,pageNumber,pageLimit)`. That method must preserve the existing `Promise.all` query order/concurrency (activity page first, author count second), arguments and single filter reference, then pass the same rows/count result to synchronous inferred `authorPageResult(rows,total)`. The result helper returns exactly `{ items: this.entities(rows), total: total?.count ?? 0 }` in this order. Preserve status filters, pagination cap, projection/mapping, count fallback and all errors inside `executeQuery`; no query, API, authorization or response shape change. Note the filter/page scalar expressions move from the start of the private async page method into its synchronous `executeQuery` callback; `executeQuery` is `try { return await operation() } catch(error) { return handleQueryError(error) }`, so both sync throws and Promise rejections remain within the same error translation boundary. Prototype: `authorPage` MI63.2→67.6, `authorPageResult`71.5, file warnings1→0, projected global2→1; full Server virtual TypeScript0 diagnostics. No casts/new tests/type weakening/threshold/baseline/runtime/remote or other path change. Require Spec/Plan definition gates and Builder ACK before mutation; principal and paired Reviewer must explicitly accept the evaluation-boundary shift; focused Biome/TypeScript, official complexity and full sensors. D2 and ACH-34 remain open.

### Assignment D2-175 — preservar leituras públicas de comentários na integração Drizzle

Finding de integração S2: após `db:test`, as oito suítes reais de Forum terminaram com 21/25 testes aprovados e quatro falhas. As rotas anônimas `GET` de replies inexistente/existente e listagens de comentários de challenge/solution retornaram 401, embora o contrato anterior dessas rotas seja público; criação, edição, reply e remoção usados pelos outros testes passaram. CodeGraph rastreou o bloqueio a `DrizzleCommentsRepository.authorize()` rejeitar `DatabaseAccess { kind: 'public' }` nos reads. Corrigir somente `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts`, já de ownership D2. Preservar o comportamento de leitura pública estabelecido pelas rotas e a autorização atual de mutações; não adicionar autenticação às rotas, acesso `system` como fallback, nem ampliar permissões de escrita. RF-01/RF-02/RF-03/RF-05/RF-12; CA-01/CA-02/CA-04/CA-05/CA-08/CA-20/CA-22; D2 Rule Pack. Reviewer Database pareado. Exits: análise de callgraph e autorização; format/type checks focados; executar `npm run db:test -w @stardust/server` e as oito suítes HTTP Forum reais com `--runTestsByPath ... --runInBand`, cobrindo os quatro cenários anônimos e todos os casos previamente aprovados; repetir `check:spec-implementation` e sensores de D2 afetados. D2 e S2 ficam `in_progress` até o teste HTTP passar. Sem alteração remota.

D2-175 checkpoint: mutation, focused Biome, and final paired Database review passed. The first route run raced a duplicate local reset and is discarded; the sequential retry after successful `db:test` passed 8/8 suites and 25/25 tests. The implementation conformance command still reports other unfinished/mismatched contracted paths, with no D2-175 mismatch. Final D2 phase closure awaits the integrated global/Server sensors shared with S2.

### Assignment D2-176 — preservar a compatibilidade do mark-read administrativo

S2 mutation24 adicionou um teste de regressão real no path contratado `MarkFeedbackReportAsReadRoute.test.ts`: a rota administrativa existente envia `{ feedbackReportId, lastSeenUserMessageId }`, que o Controller/UseCase validam e convertem no legado em `markAsRead(report.id, message.createdAt)`. CodeGraph confirmou que os adapters Supabase e Postgres anteriores suportavam esse caminho; o repositório Drizzle atual aceita somente `{ feedbackReportId, participant, lastSeenMessageAt, authorId }` e portanto desestrutura valores ausentes nessa chamada. Corrigir somente `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`, já de ownership D2, mantendo o payload HTTP/Core existente. Preservar ambos os contratos: a forma moderna participant-aware continua com suas guards e monotonicidade; a forma legada `Id` exige o guard God/admin e replica exatamente `UPDATE studio_read_at = lastSeenMessageAt | null WHERE id = id.value` do adapter antigo, sem adicionar `greatest` à forma legada. Reusar a conexão transacional recebida. Não alterar Core/controller/router, auth, API, ou introduzir fallback system/retry. RF-01/RF-02/RF-03/RF-12; CA-01/CA-02/CA-03/CA-07/CA-20/CA-22; D2 Rule Pack. Exigir pre-mutation approval do Database Reviewer, implementação única, final source review, foco de format/types e testes HTTP reais do God/admin e usuário/autor contra fresh `db:test`. D2 e S2 permanecem `in_progress` até esses cenários passarem; sem alteração remota.

### Assignment D2-177 — serializar timestamps em SQL bruto de mark-read

Finding S2 runtime: a rota de mark-read do próprio autor retornou 500 embora o cenário de lista, contagem, fetch, isolamento, e God list/detail passe. CodeGraph e probe PostgreSQL local, somente leitura, confirmaram que `Date` interpolada em `sql` bruto vira `TypeError/ERR_INVALID_ARG_TYPE` antes do PostgreSQL; a mesma data em ISO string é aceita. A seed usa colunas Drizzle tipadas e não reproduz o problema. Corrigir somente `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`: converter para `toISOString()` as três interpolações modernas de `lastSeenMessageAt` nas consultas cruas: `authorReadFilter`, expressão `greatest` de `markAuthorReadQuery` e expressão `greatest` de `markStudioReadQuery`. `markAuthorAsRead` não contém interpolação SQL. Preservar casts, filtros, `greatest`, NULLs, guards e transação. D2-176 legacy `Date|null` usa assignment de coluna tipada e permanece intacto. Não alterar API/Core/controller/route nem fixtures. RF-01/RF-02/RF-03/RF-12; CA-01/CA-02/CA-03/CA-07/CA-20/CA-22; D2 Rule Pack. Exigir pre-mutation approval do Database Reviewer, final source review, formatter/types focados e teste HTTP real do author read com `Date`, da rota God legada e das regressões de isolamento, após `db:test` local. D2/S2 ficam `in_progress` até as rotas reais passarem; sem operação remota.

D2-176/177 validation checkpoint: after fresh local `db:test`, all seven reviewed Reporting route suites passed, 14/14 tests. This includes modern author mark-read (204 and exact persisted timestamp), legacy God/admin mark-read, non-God denial/no-write, user/God list/detail and counts/safe404. No open handles were reported. D2-176/177 route runtime exits are complete; broader D2/S2 sensors remain pending.

### Assignment D2-178 — limitar lookups públicos de disponibilidade de usuário

S2 mutation27 runtime: fresh `db:test` passed; achievement routes passed, but anonymous `GET /profile/users/verify-email-in-use` and `verify-name-in-use` returned401 for both expected200-available and409-in-use. CodeGraph confirmed both routes intentionally have no `verifyAuthentication`, test requests intentionally omit auth, and the prior Supabase lookup contract supports public availability checks. The use cases call `UsersRepository.findByEmail/findByName`, whose Drizzle implementation delegates to `findOne` and rejects `DatabaseAccess { kind: 'public' }`. The Spec S3 explicitly permits public availability checks; controllers return only availability results, no profile DTO. Correct only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`: permit public access for these two exact availability operations while keeping private profile lookup (`findById`, slug/general) authorization unchanged. Do not add system fallback, route auth, or broaden returned HTTP data. RF-01/RF-02/RF-03/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; D2 Rule Pack. Require Database Reviewer pre-approval, final source review, focused format/type checks, and fresh local `db:test` plus the two anonymous availability and two real achievement route suites. D2/S2 stay `in_progress` until all cases pass; no remote operation.

D2-178 checkpoint: final paired Database review passed. Fresh `db:test` and the four anonymous/protected profile+achievement route suites passed, 16/16 tests. Only integrated sensors remain.

### Assignment D2-179 — preservar mutations HTTP autenticadas de planets/stars

CodeGraph confirmou que Planet create/update/delete/reorder e Star-name editing usam `verifyAuthentication`, enquanto as rotas de disponibilidade/tipo de Star já possuem God gate próprio; preservar essas gates de rota exatamente. O Hono usa chave publishable com Bearer do usuário, sem service-role bypass. Manifest e catálogo legado/adopted mostram `planets` e `stars` com RLS desligado e grants `authenticated` de SELECT/INSERT/UPDATE/DELETE. Models/ports não possuem ownership de usuário. Logo os writes das rotas autenticadas existentes são compartilhados e qualquer usuário autenticado já podia executá-los; nenhuma base sustenta exigir God além dos gates já presentes ou inventar ownership. Database ownership: somente `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts` e `DrizzleStarsRepository.ts`, permitindo actor verificado `user` nos mesmos writes autenticados que os grants legados permitem, além do comportamento God/system atual; continuar rejeitando `public`. Server test ownership: somente os paths S2 existentes `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts` e `CreatePlanetStarRoute.test.ts`, acrescentando happy-path HTTP com conta comum autenticada e prova de persistência. Preservar queries, entidades, respostas e validação/gates de rota; não adicionar ownership, filtro por usuário, God gate, service/system fallback ou alteração de schema. RF-01/RF-02/RF-03/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; D2 Rule Pack. Exigir pre-mutation review Database, final review, format/type e fresh local `db:test` + happy-path real authenticated planet create e star-name edit, while retaining God-gated availability/type and anonymous/invalid tests. D2/S2 ficam in_progress até os writes autenticados passarem; sem alteração remota.

D2-179/S2 Space runtime resolution: depois de `db:test` local limpo, as três rotas reais de Planet passaram (3/3 suites, 8/8 testes, 16.498s). Inclui criação por usuário comum com allowlist God vazia, readback persistido do planeta e da estrela filha, cenários anônimo/inválido e GET autenticado; reviewer Database e Server aceitos, Biome focado passou. Exits locais D2-179 completos; sensores globais/Server ainda pendentes.

### Assignment S2 mutation31 — validar autenticação Drizzle nos rate limiters MCP/global

Spec rev8; S2/Builder Server; RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-22; Rules `server-routes-testing-rules.md`, `database-rules.md`, `mcp-rules.md`, `server-application-rules.md`, `code-conventions-rules.md`. Ownership exclusivo: `apps/server/src/app/hono/routers/mcp/tests/McpRateLimitMiddleware.test.ts` e `apps/server/src/tests/routes/global/RateLimiterRoute.test.ts`. Remover mocks/repos Supabase obsoletos do teste MCP e provar bootstrap público sem limite por conta, falha de autenticação e API key validada com ator real antes do limiter por conta; manter o teste global cobrindo policy/IP/Redis e teardown isolado necessário após composição singleton. Invariantes: nenhuma identidade sem API key validada, nenhum fallback system para ferramentas públicas, ordem de middleware/eventos e janelas/limites existentes preservados; não editar jobs/workflows/autoria de challenges nem acessar remoto/credenciais. Exits: assignment/definition gates antes da mutação; CodeGraph, diff e formatter focado; Implementation Reviewer Server pareado; execução coordenada após `db:test` limpo; sensores integrados aplicáveis. Estado `in_progress`; runtime e review pendentes.

S2 mutation31: paired Server review aceito sem findings; `db:test` local passou e as duas suítes reais passaram (2/2, 12/12). Key ausente/revogada não alcança o limite por conta; key persistida válida estabelece o ator/hash da conta e ignora ID não confiável da query. Cobertura global de IP/policy/exclusões/recovery/Redis preservada e Drizzle teardown aguardado. `check:spec-implementation` foi atualizado e continua exit1 por paths não concluídos de S2/W2/D3/C1; os dois paths desta assignment já estão conformes. Sensores globais integrados pendentes.

### Assignment S2 mutation32 — cobrir account fetch e onboarding receipt por HTTP

Spec rev8; S2/Builder Server; RF-02/RF-06/RF-07/RF-10/RF-12; CA-03/CA-10/CA-11/CA-12/CA-13/CA-14/CA-20/CA-22; Rules `server-routes-testing-rules.md`, `database-rules.md`, `rest-rules.md`, `provision-rules.md`, `code-conventions-rules.md`. Ownership exclusivo: criar `apps/server/src/tests/routes/auth/FetchAccountRoute.test.ts` e `apps/server/src/tests/routes/profile/FetchOnboardingAttemptRoute.test.ts`. FetchAccount deve portar os casos úteis do suite SDK legado por GET real: nome/email/latest identity/metadata, usuário anônimo e Bearer forjado, usando Auth SDK preservado + `SupabaseFixture.setAuthMetadata`. Onboarding Attempt deve provar receipt ausente/tampered/expirado =>401; claims de nome/email/expiry assinadas e estáveis antes/depois de readiness; outra conta não pode criar estado ready; receipt não autoriza rota HTTP protegida. Usar auth/receipt/database locais reais, sem mocks de SDK/provider/repository; secrets apenas em memória/ambiente. Não alterar source/API/ports, não antecipar remoção da suíte AuthService legada antes de portar seus casos úteis; nenhum remoto/cron/workflow. Exits: gates de definição antes da mutação; formatter/diff focados; paired Implementation Reviewer Server; `db:test` fresco e execução serializada das duas suítes; sensores integrados aplicáveis. Estado `in_progress`; review/runtime pendentes.

### Builder Fix IR-S2-32-01 — receipt não autentica endpoint protegido

Reviewer pareado falhou mutation32 somente por ausência de teste que envie receipt válido sem Bearer para endpoint protegido e exija `401`; a ausência de receipt na rota onboarding prova apenas o sentido inverso. Corrigir somente `apps/server/src/tests/routes/auth/FetchAccountRoute.test.ts`, emitindo receipt real para a conta fixture e chamando `GET /auth/account` sem Authorization, esperando unauthorized. Nenhum source/API/port ou outro teste muda. RF-06/RF-07; CA-10/CA-12/CA-13/CA-20; Rules Server routes/Auth. Pré-gates de definição; Biome focado, diff e nova revisão pareada; root executa fresh local `db:test` e as duas suítes mutation32. Estado `in_progress`.

IR-S2-32-01 source/review checkpoint: Builder adicionou exatamente um caso com receipt real assinado sem Authorization contra `/auth/account`, esperando `401`; somente o path permitido mudou e Biome focado passou. Final paired Server Reviewer aceitou mutation32 corrigida sem findings e fechou IR-S2-32-01. Runtime local ainda pendente.

Mutation32 runtime checkpoint: primeira tentativa após `db:test` encontrou falha de fixture: postgres.js rejeitou parâmetros Date raw em `SupabaseFixture.setAuthMetadata`; suíte de receipt passou e seis metadata cases falharam sem divergência de resposta de produto. IR-S2-32-02 corrigiu somente a serialização da fixture e passou review pareado. Após novo `db:test` fresco, Account e Onboarding Attempt passaram (2/2 suites, 14/14 testes, exit0, 16.694s), incluindo receipt válido sem Bearer no endpoint protegido. Exits locais mutation32 completos; sensores integrados pendentes.

### Builder Fix IR-S2-32-02 — serializar timestamps raw da fixture auth

CodeGraph localizou a falha em `SupabaseFixture.setAuthMetadata`: três parâmetros raw para `auth.identities` recebem `Date` nativo (`created_at`, `updated_at` com `identity.createdAt`, e `last_sign_in_at` com `identity.lastSignInAt`). `postgres.js` rejeita esse tipo em interpolação raw. Ownership exclusivo: `apps/server/src/tests/fixtures/SupabaseFixture.ts`. Alterar somente os valores interpolados para ISO (`identity.createdAt.toISOString()` nas duas posições e `identity.lastSignInAt?.toISOString() ?? null`), preservando API Date-typed, transação, SQL/colunas, nulabilidade, JSON metadata, escopo local de fixture e demais chamadores. Nenhum source de produção muda. RF-02/RF-10/RF-12; CA-03/CA-20/CA-22; Rules Database/test fixtures/Server. Definition gates antes de editar, Biome/diff e paired Server Reviewer; root executa `db:test` fresco e mutation32 suites serialmente. Estado `in_progress`.

IR-S2-32-02 source/review/runtime checkpoint: Builder converteu exatamente as duas interpolações createdAt para ISO e o nullable lastSignInAt para ISO-or-null no único helper permitido; API, SQL, transação e metadata mantidos. Biome focado e paired Server review passaram. Fresh `db:test` + as duas mutation32 suítes reais passaram 2/2, 14/14. Correção fechada localmente.

Post-mutation32 conformance: fresh `check:spec-implementation --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains exit1 for other contracted S2/W2/D3/C1 paths still missing, present for planned removal, or unchanged; no error is reported for the two new mutation32 route suites or the corrected fixture. Definition gates remain green.

### Assignment S2 mutation33 — validar criação de feedback por HTTP, transação e efeitos pós-commit

CodeGraph mapeia POST `/reporting/feedback/` até `SendFeedbackReportUseCase` e `reports.add`, e POST `/:feedbackReportId/messages` até `SendFeedbackMessageUseCase`, `messages.add/addAttachments` e `reports.save`; ambas usam `FeedbackRouter` com transação Drizzle e broker request-local que publica somente após commit. Spec rev8; S2/Builder Server; RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; EV-01/EV-02; Rules `server-routes-testing-rules.md`, `database-rules.md`, `rest-rules.md`, `queue-rules.md`, `code-conventions-rules.md`. Ownership exclusivo: criar `apps/server/src/tests/routes/reporting/SendFeedbackReportRoute.test.ts` e `SendFeedbackMessageRoute.test.ts`. Usar Auth/Profile/Reporting fixtures, auth HTTP, PostgreSQL local e broker real com controle/observação de entrega; sem SDK/repository/domain mocks nem alteração de source. Report: happy path 201 + author/content persistidos e subscriber lendo estado já commitado; anônimo/invalid sem report/evento. Message: persistência/readback por autor; conta B não muta; report fechado conflito; replay do mesmo messageId 200 e reuse conflitante 409; reply God preserva ordem/chaves de eventos e estado de conversa commitado; falha externa de publish deixa persistência commitada (sem afirmar rollback após commit). Demonstrar rollback/no-publication em falha de persistência após write relacional, se suportado pelos constraints/fixtures existentes sem inventar SQL inválido ou mock de repository. Preservar a suíte agrupada legada e portar cenários úteis sem editá-la. Exits: gates de definição antes da mutação; formatter/diff focados; paired Implementation Reviewer Server; `db:test` fresco + execução serializada das duas suítes; sensores S2 aplicáveis. Estado `in_progress`.

S2 mutation33 paired review: aceite estrutural sem finding bloqueante. Runtime local final passou 2/2 suites e 9/9 testes. O Reviewer mantém CA-02 parcial porque os testes atuais não provocam falha SQL após uma escrita e as rejeições exercitadas acontecem antes da escrita; nenhuma evidência semelhante foi localizada nas rotas Reporting consultadas. A prova de rollback continua explicitamente pendente para conclusão de CA-02.

### Assignment D2-180 — serializar timestamps em GREATEST de save do report

Finding runtime S2 mutation33: `POST /reporting/feedback/:id/messages` falha com 500 ao salvar o report dentro da transação. CodeGraph mostra `DrizzleFeedbackReportsRepository.savedAuthorActivity` e `advancedAdminActivity` interpolando timestamps `Date` em SQL raw: `report.lastActivityAt`, `lastUserMessageAt`, `authorReadAt`, `lastAdminMessageAt`, `studioReadAt`; o driver postgres.js rejeita `Date` nativo no bind raw, como já ocorreu em mark-read e fixture. Spec rev8; D2/Builder Database; RF-01/RF-02/RF-03/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; D2 Rule Pack Database/Server. Ownership exclusivo: `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`. Converter somente os valores Date não nulos interpolados em `sql\`greatest(...)\`` para ISO string (date fields required `.toISOString()`, nullable fields `?.toISOString() ?? null`), mantendo cada coluna, expressão SQL, `greatest`, filtro, ordem, guards, transaction e semântica monotônica/null. Nenhum novo schema, query/API/mapper/route ou fallback. Exits: pre-mutation Database review + Plan/Spec gates antes de editar; Biome/diff, final paired Database review; fresh local db:test e executar as duas mutation33 suites depois de review; atualizar evidência e repetir conformance/sensores afetados. D2/S2 seguem `in_progress`.

D2-180 pre-mutation review: paired Database Reviewer marcou `clear`, sem findings. Boundary é exatamente cinco raw `greatest` valores: required `lastActivityAt.toISOString()`; nullable `lastUserMessageAt`, `authorReadAt`, `lastAdminMessageAt`, `studioReadAt` por `?.toISOString() ?? null`. Preservar operand/field order, null/monotonicidade, ramo não-admin tipado, autorização, lock/filter, transação e error boundary. Runtime regressions continuam required.

D2-180 source/review/runtime checkpoint: Builder alterou somente as cinco expressões raw SQL conforme a pre-review; Biome focado passou e final paired Database review aceitou sem findings. Após `db:test` fresco, `SendFeedbackMessageRoute` e `SendFeedbackReportRoute` passaram juntas (2/2 suites, 9/9 testes, exit0, 14.618s), confirmando report save nos caminhos de autor e God. Sensores globais D2 seguem pendentes.

### Builder Fix IR-S2-33-01 — comparar estado persistido estável no report

Runtime mutation33 encontrou diferenças de IDs de avatar regenerados ao comparar DTOs completos antes/depois. Revisão do arquivo identificou quatro comparações: replay/conflict, cross-account, closed, anonymous/invalid. Ownership exclusivo: `apps/server/src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts`. Substituir somente essas quatro comparações deep DTO por snapshot das colunas/domínio estáveis relevantes para provar persistência/estado inalterados; preservar endpoints, status, semântica replay/conflict, autorização, lista vazia de messages e no-event assertions. Não enfraquecer isolamento/idempotência nem editar fonte/fixtures. RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; Rules Server routes testing/Database. Definition gates antes de editar; formatter/diff e paired Server review; runtime serializado junto à correção D2-180. Estado `in_progress`.

IR-S2-33-01 source/review/runtime checkpoint: as quatro deep comparisons agora validam existência e campos persistidos estáveis (`id`, `content`, `status`, activity/read timestamps), preservando 201/200/409, uma mensagem persistida, chaves/contagens de eventos e no-message/no-event assertions. Biome focado e final paired Server review passaram sem findings; runtime das duas suítes passou 2/2, 9/9.

### Builder Fix IR-S2-33-02 — provar rollback após insert e constraint SQL real

CodeGraph e schema atual confirmam um caminho real sem injetar erro: `verifyFeedbackMessageAttachments` exige objeto S3 local existente, depois a transação executa `DrizzleFeedbackMessagesRepository.insertMessage` antes de `insertAttachments`; `feedback_message_attachments.id` possui primary key. Ownership exclusivo: `apps/server/src/tests/routes/reporting/SendFeedbackMessageRoute.test.ts`. Na mesma suíte, sem alterar source, fixture helper ou schema, criar um report/mensagem baseline e uma row de attachment válida que reserve um UUID; fazer upload de PNG pequeno ao MinIO local no folder/key válido para novo report/message; enviar novo messageId com attachment usando o UUID já reservado. Middleware deve aceitar metadata real; o insert de mensagem nova precede violação da PK de attachment e força rollback PostgreSQL. Exigir resposta interna esperada, mensagem nova ausente, só baseline persistido, report status/timestamps inalterados e nenhuma publicação. Remover o objeto S3 em teardown. Nenhum mock de repository/storage/evente, trigger/check inválido ou escrita fora de seed setup. RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; Rules Server routes testing/Database/Storage/Queue. Gates de definição antes de editar; Builder e Reviewer Server pareados; fresh `db:test` prepara Postgres+MinIO; executar mutation33 suites em série e atualizar CA-02. Estado `in_progress`.

IR-S2-33-02 source/review/runtime checkpoint: novo caso usa upload real PNG 1×1 ao folder S3 válido, confirma metadata via HEAD e força PK collision real por UUID de attachment reservado após insert da mensagem. Verifica a resposta `409` já definida para registro duplicado, mensagem ausente, conversation/report intactos, zero evento e remove/confirma ausência do objeto em `finally`. Somente `SendFeedbackMessageRoute.test.ts` mudou; Biome focado e paired Server review passaram sem findings. Após `db:test` fresco, as duas suítes Reporting passaram 2/2, 10/10, exit0 em 18.395s. O teste aponta `S3_ENDPOINT` para a porta MinIO definida no `.env.local` raiz, sem registrar credenciais. IR-S2-33-02 está completo; CA-02 rollback proof está coberto, sujeito aos sensores integrados restantes.

### Assignment S2 mutation34 — validar status e upload de anexos de feedback por HTTP

Spec rev8; S2/Builder Server; RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; EV-01/EV-02; Rules `server-routes-testing-rules.md`, `database-rules.md`, `rest-rules.md`, `code-conventions-rules.md`. Ownership exclusivo: criar `apps/server/src/tests/routes/reporting/ChangeFeedbackReportStatusRoute.test.ts`, `CreateFeedbackMessageAttachmentUploadUrlRoute.test.ts` e `CreateFeedbackReportAttachmentUploadUrlRoute.test.ts`, todos paths Create explícitos da Spec. Antes da edição, Builder usa CodeGraph para inspecionar cada rota/controller/use case/repository e verificar os contratos existentes. Testar requests HTTP reais, Drizzle/PostgreSQL local, auth e storage local, cobrindo operação/success shape, persistência/readback relevante, negação sem mutação e isolamento de outra conta conforme cada endpoint realmente permite; preservar regra God/status esperado, validação da pasta/ownership e estrutura da URL assinada segundo implementação/Spec, sem inventar regra nova. Sem alteração de source, fixtures compartilhadas, schema, teste legado ou paths adicionais. Exits: gates de definição antes de editar; Biome focado/diff; paired Implementation Reviewer Server; fresh `db:test` e execução serial das três suítes; atualizar Evaluation e reexecutar conformance/sensores afetados. Estado `completed`.

S2 mutation34 complete: Reviewer Server aceitou os três testes sem findings. Após `db:test` fresco, as suítes `ChangeFeedbackReportStatusRoute`, `CreateFeedbackMessageAttachmentUploadUrlRoute` e `CreateFeedbackReportAttachmentUploadUrlRoute` passaram 3/3, 9/9, exit0 em 17.812s. O primeiro runtime encontrou somente expectativa de status obsoleta para report fechado; o endpoint mapeia `NotAllowedError` para 405, e o teste foi corrigido/revisado mantendo a asserção de ausência de URL. PUT/HEAD real ao MinIO e cleanup passaram com o `S3_ENDPOINT` local derivado da porta configurada no `.env.local`; nenhuma credencial foi registrada.

### Builder Fix IR-S2-35 — limpar findings do Server check:code

O detector global exigido falhou no workspace: Server `biome check src` reportou 72 diagnostics. Saída detalhada `/tmp/stardust-server-check-code.log`: 71 findings de formatação em 19 paths S2 já contratados e um `lint/complexity/noBannedTypes` em `apps/server/src/app/hono/HonoApp.ts:269`. Ownership exclusivo de correção: format-only em `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts`, `ProfileToolkit.ts`, `apps/server/src/app/hono/HonoApp.ts`, `HonoHttp.ts`, `middlewares/AuthMiddleware.ts`, `ChallengingMiddleware.ts`, `OnboardingMiddleware.ts`, `ProfileMiddleware.ts`, `SpaceMiddleware.ts`, `routers/auth/ApiKeysRouter.ts`, `AuthRouter.ts`, `routers/challenging/ChallengeCodeExecutionsRouter.ts`, `ChallengeSourcesRouter.ts`, `ChallengesRouter.ts`, `SolutionsRouter.ts`, `routers/conversation/ChatsRouter.ts`, `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts`, `CreatePlanetStarRoute.test.ts` e `FetchAllPlanetsRoute.test.ts`. Em `HonoApp.ts`, além da formatação, resolver somente o tipo proibido no cast de Context, preservando a compatibilidade do handler Inngest sem supressão. Nenhum outro path/semântica muda. Biome focado e Reviewer Server passaram; reexecução atual já não reporta esses findings e não reporta type lint em HonoApp. Estado `completed`; o gate Server segue aberto por IR-S2-37.

### Builder Fix IR-S2-36 — resolver Server typecheck nos adapters/fixtures S2

O `check:types` global e a reexecução `npm run check:types -w @stardust/server` após falha reportaram TypeScript errors em sete paths contratados: `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts` (quatro `HonoHttp` sem type argument e tipo inferido de transaction callback), `apps/server/src/queue/inngest/functions/tests/ManualFunctions.test.ts` (argumento legado para função sem parâmetros), `apps/server/src/rest/controllers/auth/tests/SignUpController.test.ts` (mocks Http/RestResponse não tipados para AccountDto), `apps/server/src/tests/fixtures/ChallengingFixture.ts`, `ForumFixture.ts`, `ShopFixture.ts` (ids `undefined` e enum widened para string nos inserts) e `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` (argumento requerido ausente). O run global de unit também confirmou que o mock Signup não observa a nova publicação do receipt: completar o mesmo path de teste com broker `publish` explicitamente mockado e asserção coerente com o evento elegível. Ownership exclusivo destes sete paths. Corrigir somente incompatibilidades de tipos a partir dos schemas/models/contracts existentes: contexto Hono explícito e transaction inferida sem cast; construtor e Http/AccountDto/broker mocks conformes; ids reais válidos e enum literal inferido; input obrigatório provido. Sem API/schema/authorization/fixture semântica ou paths extras; se tipo revelar mudança comportamental necessária, parar e propor assignment. Server `check:types` e revisão passaram; o full unit passou nos paths alterados e todos os demais exceto o HonoApp unit test registrado em IR-S2-38. Estado `completed`.

### Builder Fix IR-S2-37 — formatar paths Server restantes do sensor global

Após IR-S2-35 e -36, novo `npm run check:code` ainda falha somente com 47 format diagnostics em 19 paths já contratados: `apps/server/src/app/hono/routers/forum/CommentsRouter.ts`, `routers/lesson/QuestionsRouter.ts`, `StoriesRouter.ts`, `TextBlocksRouter.ts`, `routers/manual/GuidesRouter.ts`, `routers/playground/SnippetsRouter.ts`, `routers/profile/AchievementsRouter.ts`, `NotesRouter.ts`, `ProfileEventsRouter.ts`, `UsersRouter.ts`, `routers/ranking/RankingRouter.ts`, `TiersRouter.ts`, `routers/shop/AvatarsRouter.ts`, `InsigniasRouter.ts`, `RocketsRouter.ts`, `routers/space/PlanetsRouter.ts`, `StarsRouter.ts`, `apps/server/src/app/hono/streaming/createProfileCreationStream.ts`, `apps/server/src/tests/routes/reporting/MarkUserFeedbackReportAsReadRoute.test.ts`. Ownership exclusivo: formatter-only nestes 19 paths, sem lint fixes ou mudança de comportamento. Exits: gates Plan/Spec, Biome focado, paired Server Reviewer sobre diff corrente; root executa novo `check:code -w @stardust/server` e sensores globais após a fase. O formatter determinístico compõe alterações preexistentes; Reviewer registra qualquer limitação de snapshot pré-formatação. Estado `in_progress`.

### Builder Fix IR-S2-38 — atualizar teste HonoApp para a dependência Drizzle da rota Inngest

`npm run test:unit` global após IR-S2-36 passou 168/169 suites Server e 118/118 Web; 329/330 testes Server passaram. Única falha: `apps/server/src/app/hono/tests/HonoApp.test.ts`, “should pass the Inngest client to the serve handler”, espera 200 mas recebe 500 porque `registerInngestRoute` agora consulta `DrizzleClient.getInstance()` ao construir funções. Teste chama esse registro isolado sem inicializar DB; não é falha de endpoint sob test nem teste de integração. Ownership exclusivo: esse arquivo. Manter o foco no forwarding `client` e registrar `DrizzleClient.getInstance` com fixture/mock tipado mínimo que permita construir handlers sem abrir conexão de banco; não alterar HonoApp source, produção, mock de `serve` ou demais casos. Definition gates antes da edição; Biome e teste unit focused; paired Server Reviewer. Fix recebeu aceite pareado; o teste HonoApp focado passou 1/1. Estado `completed`; full global unit segue como gate após este fix.

### Builder Fix IR-S2-39 — formatar os últimos paths Server do sensor

Após IR-S2-37, `npm run check:code` ainda identificou formatter findings em 13 paths S2 contratados e um `lint/style/useImportType` no job S2: format-only em `apps/server/src/constants/env.ts`, `provision/auth/NodeOnboardingReceiptProvider.ts`, testes `profile/users/{FetchUserBySlugRoute,FetchUsersListRoute,UpdateUserRoute,VerifyUserEmailInUseRoute,VerifyUserNameInUseRoute}.test.ts`, Reporting `{CountUnreadFeedbackReportsRoute,FetchUserFeedbackReportRoute,GetFeedbackReportRoute,ListFeedbackReportsRoute,ListUserFeedbackReportsRoute,MarkFeedbackReportAsReadRoute}.test.ts`; e alterar o import em `apps/server/src/queue/inngest/createMarkTextBlockAudioAsErrorOnFailure.ts` para type-only conforme Biome. Ownership exclusivo dos 14 paths listados. Sem lint autofixes/adaptação fora do import pedido, source behavior changes ou outros paths. Exits: Plan/Spec gates, focused Biome/diff, paired Server Reviewer, novo Server/global `check:code`. Findings de lint em providers não contratados e adapter Supabase que será removido por D3 serão comparados ao baseline e não entram nesta assignment sem evidência de regressão. O Builder concluiu os 14 paths, o Biome focado passou e a revisão pareada aceitou sem findings; revisão limitada pela falta de snapshot pré-formatação. Estado `completed`.

### Builder Fix IR-S2-40 — resolver findings atuais do Server check:code

Após IR-S2-39, `npx biome check src --max-diagnostics=100` encontrou formatação pendente em `apps/server/src/queue/inngest/functions/ShopFunctions.ts`, `src/rest/controllers/auth/SignUpController.ts`, `src/rest/controllers/profile/FetchOnboardingAttemptController.ts`, `src/rest/controllers/profile/tests/FetchOnboardingAttemptController.test.ts`, `src/rest/services/SupabaseAuthService.ts`, fixtures `ProfileFixture.ts`, `ReportingFixture.ts`, `SpaceFixture.ts`, testes `routes/challenging/challenges/{CountChallengeCodeExecutionErrorsRoute,ListChallengeCodeExecutionsRoute,RunChallengeCodeRoute}.test.ts`, `routes/profile/achievements/{FetchUnlockedAchievementsRoute,RescueAchievementRoute,ReorderAchievementsRoute}.test.ts`, `routes/profile/users/{FetchCreatedUsersKpiRoute,FetchUserByIdRoute}.test.ts` e `routes/profile/StreamProfileCreationRoute.test.ts`. Findings de lint adicionais: constructors sem uso em `ChallengingFixture.ts`, `ForumFixture.ts`, `ShopFixture.ts`, `SpaceFixture.ts`; imports/catch/type-only e `noDelete` em `GenerateTextBlocksAudioBatchJob.test.ts`, `SignUpController.ts`, `SolutionsControllers.test.ts`, `GetFeedbackReportController.test.ts`, `ListFeedbackReportsController.test.ts`, `UserFeedbackControllers.test.ts`, `StreamProfileCreationRoute.test.ts` e `ReorderAchievementsRoute.test.ts`. Ownership exclusivo dos paths contratados acima: aplicar formatter determinístico; corrigir somente lint mecânico sem mudança observável (remover construtor vazio redundante, import não usado, variável catch não usada, `import type`, optional-chain equivalente e asserções não-null com validação equivalente). Em `SignUpController.ts`, preservar o contrato de remoção e investigar alternativa suportada pelo tipo antes de mudar. Não editar `DropboxStorageProvider.ts`, os três providers TTS ou o adapter Supabase legado neste lote: comparar esses findings com o baseline; o adapter será removido em D3. Nenhum outro path/semântica. Exits: Plan/Spec gates, Biome focado/diff, paired Server review, novo `check:code -w @stardust/server`, registrar baseline dos findings externos. Builder corrigiu o lint/format dentro do ownership, preservou os quatro construtores para não quebrar callers existentes e aceitou revisão pareada sem findings. O Biome focado passou em 25 arquivos; Server `check:code` e global `check:code` passaram exit0. Permanecem somente warnings/infos fora do escopo (providers/adapter legado, manifest gerado grande e construtores preservados); source desses providers é idêntico ao HEAD e o adapter será removido em D3. Estado `completed`.

### Builder Fix IR-S2-41 — permitir as suítes de infraestrutura reconhecidas pelo test-integrity

O sensor obrigatório `npm run check:test-integrity` falhou em quatro testes de infraestrutura alterados e já pareados na implementação: `apps/server/src/app/hono/tests/HonoApp.test.ts` e `apps/server/src/queue/inngest/functions/tests/{InngestFunctionsAssembly,ManualFunctions,StorageFunctions}.test.ts`. A regra normativa em `documentation/sdd.md` exclui infraestrutura de testes do pareamento de comportamento, mas o detector rejeita os diretórios de infraestrutura como locais inválidos. Ownership exclusivo: `scripts/check-test-integrity.mjs` e `scripts/tests/check-test-integrity.test.mjs`. Permitir apenas esses dois diretórios de infraestrutura já existentes, mantendo as verificações de métricas/pareamento e a rejeição de qualquer outro diretório não permitido; adicionar testes positivos para ambos e um caso negativo de diretório arbitrário. Não enfraquecer métricas, baselines ou outras regex de permissão. Exits: Plan/Spec gates, teste script focused, check:test-integrity global e paired implementation review. Builder acrescentou somente os dois patterns ancorados aos arquivos de teste desses diretórios e casos positivos/negativos; 12 testes do checker passaram, o sensor global passou (55 changed tests; 31 testable sources; 223 excluded) e paired coordination review aceitou sem findings. Estado `completed`.

### Assignment S2 mutation35 — cobrir o fluxo de signup real por HTTP

`check:spec-implementation` ainda registra como Create ausente `apps/server/src/tests/routes/auth/SignUpRoute.test.ts`. Ownership exclusivo desse único arquivo. Antes de editar, usar CodeGraph para inspecionar a rota, middleware, controller, AuthFixture e testes de rota Auth existentes. Criar teste de request/response real contra o Hono local, Supabase Auth local e PostgreSQL local, cobrindo signup válido e leitura do estado/metadata persistidos; incluir um caso de entrada inválida/conta duplicada se o contrato real da rota permitir, sem inventar resposta; confirmar que receipt/SSE não converte onboarding em sessão autenticada antes do provisionamento. Sem mockar SDK/auth/repository, alterar source/fixtures compartilhadas, credenciais hardcoded ou tocar remoto. Exits: Plan/Spec gates; Biome/diff focado; paired Server review; fresh `npm run db:test -w @stardust/server` e execução isolada da nova suíte; global checks após estabilização. Paired Server review aceitou sem findings; após fresh `db:test`, a suíte focada passou 1/1, 3/3 com Auth, banco e receipt locais reais. A correção de C2 ACH-43 tornou o roteamento local automático no script. Mutation35 concluída; gate global S2 ainda pendente.

### Assignment C2 ACH-43 — rotear integrações Server ao Inngest local

Finding ACH-43: `npm run test:integration -w @stardust/server` carregava `MODE=test`, enquanto a inicialização do SDK usa esse modo para desabilitar o Dev Server; a publicação de receipt tentava a cloud com a chave sintética de `.env.testing` e retornava 401. O script `test:integration` agora define ambos os endpoints para `http://127.0.0.1:8288`, mantendo a seleção `server-integration`. Biome focused, stack local fresco, SignUpRoute 1/1 suite e 3/3 testes passaram sem overrides de Inngest; a única variável runtime adicional foi `S3_ENDPOINT` local derivada do `.env.local` ignorado. Coordination Reviewer aceitou o diff pós-mutation sem findings. Nenhuma chave, endpoint cloud ou baseline foi alterado. ACH-43 concluído; sensores integrados amplos continuam no C2.

### Assignment S2 mutation36 — reduzir violações de complexidade no stream SSE

CodeGraph e o sensor root identificaram sete violações no path novo `apps/server/src/app/hono/streaming/createProfileCreationStream.ts`. Ownership exclusivo desse path. A extração local nomeia runner, lifecycle, expiry e polling sem mudar API, frames, query imediata/serial, intervalo de1s, 60s/receipt, heartbeat15s, wake/cancelamento, guards, terminal≤100ms ou headers. Mutation36 concluída: Biome e Server code/type passaram; paired Server Reviewer aceitou sem findings; após fresh `db:test`, `StreamProfileCreationRoute.test.ts` passou 4/4 com query local real. O sensor global não reporta violações nesse path; a contagem de erros caiu de sete para cinco e deixou de estar limitada ao stream, então mutation36 fecha seu finding local, enquanto CI-09 continua aberta para triagem global. RF-09; CA-18/CA-19; Rules `realtime-rules.md`, `server-application-rules.md`, `code-conventions-rules.md`.

### Assignment S2 mutation37 — corrigir fixture real do teste de Auth limiter (ACH-45)

Spec rev9; ownership exclusivo: `apps/server/src/app/hono/routers/auth/tests/AuthRateLimitMiddleware.test.ts`. CodeGraph atual obrigatório antes da edição. Substituir somente `SupabaseAuthService.fetchAccount` mockado com `account-1` pela composição `SupabaseFixture` + `AuthFixture` local, limpar DB, criar conta real, usar `getAuthorizationHeader()` e `getAccountId()` nas requisições/assertions. Manter `RateLimitProvider` fake, limites/IP existentes e assertion da ordem IP → Auth verificada → conta. Se o caso de 401 anônimo permanecer, manter separado; não alterar middleware, expected statuses, limites, outro teste/source/fixture, credenciais ou remoto. RF-02/RF-12; CA-03/CA-22; Rules `server-routes-testing-rules.md`, `server-application-rules.md`, `database-rules.md`. Exits: Spec/Plan definitions passaram; assignment gate e paired pre-review clear; Builder ACK enviado. Inspeção principal, Biome, suite real após fresh `db:test`, paired pós-review, shards Server sem ACH-45 e conformance atualizado permanecem pendentes. Status `in_progress`.

### Assignment S2 mutation38 — remover erros Halstead do candidato Server

CI-09 root-local encontrou cinco erros Halstead em quatro paths da S2. CodeGraph do Server Reviewer confirmou os consumidores e sugeriu extrações de responsabilidade local. Ownership exclusivo desses quatro paths, sequencial após mutation37. Manter exatamente ordem e mensagens de tratamento de erros/logs/telemetria; ordem de montagem/construção dos routers e rotas; assinatura/parse/assinatura/validade/duração/erro sanitizado do receipt; nonce/Auth call/DTO/elegibilidade e mapa de erros do signup; e sequência account verificada→Id→prazo JWT ou receipt→contexto→limiter. Em `authorizeProfileStream`, JWT só fornece deadline após autenticação; não vira autoridade e bearer inválido não faz fallback para receipt. Refatorar somente limites coesos no mesmo módulo, sem novos paths, exports públicos, API/status/payload changes, casts, simplificação de guards, baseline ou thresholds. RF-02/RF-06/RF-07/RF-09/RF-12; CA-03/CA-10/CA-12/CA-13/CA-18/CA-19/CA-20/CA-22; Rules `server-application-rules.md`, `realtime-rules.md`, `provision-layer-rules.md`, `code-conventions-rules.md`. Definition gates, Biome, Server code/types passaram; paired Server Reviewer pós-mutation aceitou sem findings. Complexity chegou a zero erros, mas com 385 warnings; testes unit/integration focados após mudança e fresh `db:test` ainda pendem. Mutation38 aceito estruturalmente; ACH-47 de erros Halstead fechado; CI-09 segue aberto.

### CI-09 — plano de remediação de warnings de complexidade

O sensor root inicial em `/tmp/stardust-m38-complexity.log` registrou 385 warnings e zero errors. CodeGraph paired reviewer verificou o inventário: 381 warning functions nos 44 paths S2 Server; três no path Database `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`; um em Web `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`. Após mutation39, nova execução root registrou 379 warnings e zero errors; `env.ts` não aparece mais no relatório. CodeGraph paired reviewer recomendou lotes pequenos com paired review pré-mutation; nenhum warning deve ser resolvido por fragmentação mecânica. Os lotes abaixo são sequenciais e não alteram thresholds, baselines, paths ou comportamento.

Os lotes Server compartilham RF-01/RF-02/RF-05/RF-06/RF-09/RF-10/RF-12; CA-01/CA-02/CA-03/CA-10/CA-18/CA-19/CA-20/CA-22; Rules da camada dona do path, Code Conventions, Server Routes Testing e SDD. Antes de cada lote: inventariar as warning functions atuais, explorar todos os paths/símbolos no CodeGraph, obter paired pre-review, definir limites de extração coesos por responsabilidade e preservar call order, payload/status/headers, guards, SQL/atomicidade, autorização e lifecycle. Somente helpers privados em módulos existentes; sem novas APIs/paths/casts, fixtures/mocks, edição da outra camada, formatação em massa, compressão/movimentação mecânica ou alteração de threshold/baseline. Após cada lote: inspeção principal, Biome focado, paired pós-review, code/types e regressões unit/integration aplicáveis; rerodar complexity e atualizar Evaluation antes do próximo lote.

### Assignment S2 mutation39 — config/env local

Path: `apps/server/src/constants/env.ts` (6 warnings iniciais). Preservar ordem/validação de variáveis locais e mensagens. A extração de helpers privados e do helper compartilhado de issues removeu os seis warnings, sem mudança nos predicates, paths, mensagens ou ordem S3 → Mailpit → trusted proxies; parse precede as validações locais. Biome focado e Server code/types passaram; complexity root registra 379 warnings/0 errors e não sinaliza mais `env.ts`. Server Reviewer pré e pós-mutation aceitos sem findings; definition gates passam. Testes comportamentais focados ainda pendem. Status `completed` para o lote; validação integrada continua pendente.

### Assignment S2 mutation40 — Auth, receipt e onboarding (sublotes sequenciais)

O lote agregado de 55 warnings não está liberado: o paired Server Reviewer confirmou que os oito paths não devem ser editados juntos. Após mutation39, executar sequencialmente: 40a `apps/server/src/provision/auth/NodeOnboardingReceiptProvider.ts`; 40b `apps/server/src/rest/controllers/auth/SignUpController.ts`; 40c `apps/server/src/rest/controllers/profile/FetchOnboardingAttemptController.ts`; 40d `apps/server/src/app/hono/middlewares/OnboardingMiddleware.ts`; 40e `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`; 40f `apps/server/src/rest/services/SupabaseAuthService.ts` em grupos coesos de operações; 40g `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts` por famílias de rotas; 40h `apps/server/src/app/hono/routers/auth/AuthRouter.ts` por famílias de rotas. Para cada sublote, exigir CodeGraph atual, assignment com path exclusivo, paired pre-review sobre os limites exatos, Builder Server, inspeção principal, Biome, code/types, regressão aplicável, complexity root e paired post-review antes do próximo. Preservar nonce/elegibilidade, mapas de erros, verificação Auth, receipt/HMAC/expiração, identidade, autorização e ordem dos limiters. A recomendação do Reviewer para 40a limita-se a payload, assinatura, tempo e projeção de claims, mantendo nonce criptográfico, HMAC, assinatura antes do JSON, comparação segura, validade de 900s e catch sanitizador único. Mutation40a concluída: CodeGraph e paired pre/post-review aceitos sem findings; extraídos somente `composePayload`, `validateTemporalClaims` e `projectClaims` no path autorizado, mantendo assinatura, parse e sanitização. Biome principal, Server check:code/types passaram; após fresh `db:test`, os quatro testes reais de signup, account, fetch onboarding attempt e SSE passaram 4/4 suites, 21/21 testes. O sensor root confirma 377 warnings/0 errors, redução líquida de2 sem warnings novos no path. Mutation40b concluída: paired pre/post-review aceitos sem findings. CodeGraph principal confirma eligibility header lida e removida na ordem atual, guard success/nonfailure/eligible mantido, helper usa `response.body.id`, executa issue→event publish→headers, e `handle` devolve a mesma resposta. Biome focado, Server e root `check:code`, Server e root `check:types`, teste SignUpController (3/3) e root `test:unit` passaram. Complexity root: 378 warnings/0 errors, 3,476 arquivos/9,444 funções; o path alterado não possui warning. A variação global +1 em relação aos 377 após 40a permanece sem atribuição demonstrada e deve ser reconciliada durante CI-09, sem tratá-la como regressão deste path. Mutation40c concluída: paired pre/post-review aceitos sem findings. O expiry check permanece antes da única query; guard e mensagens exatos; `handle` mantém projeção e RestResponse. Biome, Server/root code/types, Server/root unit e focused controller test passaram; após fresh `db:test`, rota local passou 4/4 testes. Complexity root: 379 warnings/0 errors e o path não aparece no warning report. Variação global ainda sem atribuição demonstrada para reconciliação em CI-09. Paths 40d–40h permanecem pending.

40c paired post-review accepted with no findings: expiry-before-query, one lookup, exact identity guard/errors, and response body remain unchanged. Mark 40c `completed` on 2026-10-04.

#### Sublot S2 mutation40d — OnboardingMiddleware

Path: `apps/server/src/app/hono/middlewares/OnboardingMiddleware.ts`. Root complexity checkpoint has warning markers in `getBearerExpiry` and `authorizeProfileStream`. Proposed cohesive helper boundaries for pre-review: isolate JWT expiry claim decoding/validation from stream authorization; split receipt authorization and bearer authorization branches into private helpers if the Reviewer confirms the boundaries preserve sequencing. Must preserve verified bearer account as authority, JWT expiry only as deadline input after Auth verification, invalid-bearer rejection without receipt fallback, receipt verification/expiry, identity/context values, and limiter application/order. No routes/provider/service changes, threshold/baseline changes, or new paths. Status `in_progress`; Builder waits for paired pre-review.

Paired pre-review clear. Approved `authorizeBearerProfileStream(context,next,bearer)` order: verify via Auth, create Id, derive expiry deadline, write `account` then `databaseAccess` then `profileStreamAuthorization`, apply account limiter if present, otherwise call `next()` once. Approved `authorizeReceiptProfileStream(context,next)` order: missing-receipt error, verify receipt, write `databaseAccess` then stream authorization (no account or account limiter), then `next()` once. Public dispatch reads Authorization and routes any truthy bearer exclusively to bearer helper; only absent bearer checks receipt. Optional `decodeBearerExpiryClaim(bearer): unknown` extracts payload/JSON/exp inside current sanitizing catch; `getBearerExpiry` retains exact finite/future-number checks and Date construction. Do not add JWT validation or change accepted exp range/errors. Plan/spec definition gates must pass before Builder activation.

Mutation40d Builder reports implementation in the approved sole path: split receipt/bearer flows and added expiry claim extraction under the existing catch. Builder reports preserving dispatch truthiness/fallthrough, verification/Id/deadline/context/limiter order, receipt sequence, errors and values. Focused Biome, Server code/types and `git diff --check` passed after a formatter correction. CodeGraph found no dedicated middleware test. Principal source inspection, real integration paths, root checks, fresh complexity and paired post-review remain pending.

Mutation40d verification finding: the first local StreamProfileCreationRoute integration attempt passed 1/4 tests and failed 3/4 because the route invokes `authorizeProfileStream` without a bound `this`; the dispatcher then cannot access its extracted helper. Mutation40d remains in progress. The correction changes `authorizeProfileStream` to an arrow-function class field in the sole approved middleware path, preserving the callback signature while lexically binding the instance helpers. Rerun affected real route tests, root checks, complexity and paired post-review before acceptance.

The binding correction is behaviorally green: after fresh `db:test`, StreamProfileCreationRoute passed 4/4 lifecycle tests. Root `check:code` then found only the formatter-required one-line arrow signature in this path; the exact one-line layout is now applied. Rerun root detectors after this formatting correction and obtain paired post-review; complexity currently remains 380 warnings/0 errors and this path has no warning markers.

Correction verification complete: fresh local `db:test`, StreamProfileCreationRoute 4/4, root `check:code`, root `check:types` (7/7 tasks), and root `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Fresh root complexity is 380 warnings/0 errors across 3,476 files/9,448 functions; no warning marker in `OnboardingMiddleware.ts`. Paired post-review remains the only mutation40d acceptance step.

Mutation40d completed: paired Server post-review accepted with no findings, including the arrow callback binding correction. The two assigned warning markers are absent from the target; the global total remains 380 and requires continued CI-09 inventory remediation.

Mutation40d accepted and complete on 2026-10-04. Paired post-review found no findings; bearer and receipt sequencing, error sanitization, and the Hono callback receiver fix are accepted. The focused route lifecycle rerun passed 4/4 after the earlier regression was corrected.

#### Sublot S2 mutation40e — AuthMiddleware

Path: `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`. Root complexity checkpoint has one warning marker in `verifyApiKeyAuthentication`. Proposed pre-review boundary: extract the API-key validation operation (repository/provider/use-case construction plus execute) into a private helper returning the same userId; retain the current missing-key rejection, then construct account DTO, write account and databaseAccess context, and apply limiter or `next()` in the existing order. Preserve exact AuthError/message, use case/provider/DB access construction, account DTO fields, context values, limiter order and exactly one continuation. No changes to regular auth/god auth, routes, services, API-key contracts, or other paths. Status `in_progress`; Builder waits for paired pre-review.

Paired pre-review is clear with no findings. Approved exact limit: private helper only constructs the same public-access repository, crypto secret provider and AuthenticateApiKeyUseCase in the same order, executes with the same `apiKey`, returns the validated `userId`. The existing method retains the missing-key rejection/message, account DTO, account→databaseAccess context writes, and limiter/one-next sequence. No other methods or paths.

Mutation40e Builder reports `authenticateApiKey(http, apiKey)` extraction in the sole path; missing-key guard/error and AccountDto/context/rate-limit-next order remain in `verifyApiKeyAuthentication`. Focused Biome, Server `check:code`/`check:types`, and focused use-case test (1 suite/3 tests) passed. The first Server type check caught a missing HonoHttp generic; Builder corrected it and the rerun passed. Principal CodeGraph confirms helper setup/execute and the original missing-key, account context and limiter sequence. Root `check:code`, `check:types` (7/7), and `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Complexity reports 381 warnings/0 errors over 3,476 files/9,449 functions; neither AuthMiddleware method has an explicit metric marker, but `verifyApiKeyAuthentication` (MI 50.9) and new `authenticateApiKey` (MI 63.6) are both counted as MI-only warnings because the sensor warns below MI 65. The total increase 380→381 is therefore attributable to this extraction, and mutation40e remains behavior-reviewed but unresolved for CI-09. Paired post-review accepted the preserved repository/provider/use-case order and input, missing-key error, AccountDto, context-write order, limiter and single continuation; that behavior acceptance does not clear the complexity target.

#### Sublot S2 mutation40e2 — AuthMiddleware warning reconciliation

Path: `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`, only `verifyApiKeyAuthentication` and `authenticateApiKey` plus helpers private to that flow. Audit of the fresh 40e sensor shows both functions remain below the MI 65 warning boundary (MI 50.9 and 63.6); the extraction removed the explicit Halstead marker but added a second MI-only warning, so the root count rose 380→381. Paired Server pre-review is now clear for a small orchestrator: extract the existing missing-key check to `requireApiKey(http)` with identical header read/AuthError/message; retain `authenticateApiKey(http, apiKey)` and exact repository/provider/use-case construction and execution order/input, compacting only to return `(await useCase.execute({ apiKey })).userId`; extract the existing AccountDto creation and ordered `account` then `databaseAccess` context writes to `setApiKeyAccount(context,userId)`; and extract the existing limiter-or-single-`next()` branch to `continueApiKeyAuthentication(context,next)`. Preserve caller sequence HonoHttp → required key → authenticate → context → continuation. No route, external contract, auth behavior, other middleware path, test, threshold or baseline changes. Fresh root complexity must show both target functions and each new helper without MI warnings; if a helper remains warned, stop and revise before another mutation. Status `in_progress`; Builder waits for Plan/Spec definition gates.

Mutation40e2 Builder source checkpoint: `verifyApiKeyAuthentication` now follows the approved HonoHttp → `requireApiKey` → `authenticateApiKey` → `setApiKeyAccount` → `continueApiKeyAuthentication` sequence. The required-key helper retains the exact `X-Api-Key` read and `AuthError` message; authentication retains public repository/provider/use-case construction and execution input while returning `.userId`; account construction/context writes and limiter-or-single-next moved intact to their helpers. No other middleware path changed. No sensors have run after this edit; fresh source inspection, focused/root checks, relevant tests, complexity metrics, and paired post-review remain pending.

Mutation40e2 complexity checkpoint: root complexity reports 381 warnings and 0 errors across 3,476 files/9,453 functions. The assigned `verifyApiKeyAuthentication`, `requireApiKey`, `authenticateApiKey`, and `continueApiKeyAuthentication` are not listed as MI<65 functions; `setApiKeyAccount` remains below the required boundary at MI 62.5. The out-of-scope existing `verifyAuthentication` is MI 55.6. Per the assignment's stop condition, no further sensors/tests or source changes are authorized in this sublot pending a revised paired review for the remaining target helper. Evidence: `/tmp/stardust-mutation40e2-complexity.log`.

Mutation40e3 Builder source checkpoint: `createApiKeyAccount(userId): AccountDto` now returns the existing authenticated AccountDto literal. `setApiKeyAccount` now writes that DTO to `account`, then writes the same user-scoped `databaseAccess`; the caller ordering is unchanged. No sensors have run after this edit. Fresh source inspection, root complexity, and—only if all target functions meet MI 65—focused/root checks, tests, and paired post-review remain pending.

Mutation40e3 verification: Plan/Spec definition gates passed; fresh CodeGraph confirms the DTO literal and user-scoped context write order. Root complexity is 380 warnings/0 errors across 3,476 files/9,454 functions; `AuthMiddleware.ts` reports class MI 65.4 and only the out-of-scope existing `verifyAuthentication` below MI 65 (55.6), while no assigned API-key method/helper remains in the MI<65 listing. Focused Biome, root `check:code` and `check:types` (7/7 tasks each), and root `test:unit` passed (Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1). After fresh local `db:test`, `McpRateLimitMiddleware.test.ts` passed 4/4 and `AuthenticateApiKeyUseCase.test.ts` passed 3/3. Paired post-review remains pending.

Mutation40e2 paired post-review accepted the approved authentication behavior with no findings: required-key error/message, repo/provider/use-case order and input, DTO values, context write order, limiter and single continuation remain unchanged. CI-09 target remains unresolved because `setApiKeyAccount` has MI62.5. Keep existing `verifyAuthentication` MI55.6 as a separate warning assignment; do not expand 40e2 into it.

Mutation40e3 completed on 2026-10-04 after paired Server post-review acceptance. `createApiKeyAccount` preserves all DTO fields; `setApiKeyAccount` preserves the user-scoped `databaseAccess` value using `Id.create(userId)` and account-before-databaseAccess order. Fresh root complexity is 380/0; all assigned API-key functions/helpers are MI≥65. The API-key flow target is resolved. `verifyAuthentication` MI55.6 remains a separate warning assignment, and CI-09 remains open for the full inventory.

CI-09 sensor interpretation correction: the root `warn` total counts functions with MI<65, whether or not the report shows a separate `⚠` metric marker. Every sublot must now compare the root warned-function count and inspect MI for each changed/new function; moving a marker into a helper is not completion. Do not lower thresholds or alter the baseline.

Mutation40e4 completed on 2026-10-04 after paired Server post-review acceptance. `fetchVerifiedAccount` preserves service→controller→HTTP construction and controller error propagation; `setVerifiedAccountContext` preserves account→user-scoped databaseAccess order and `Id.create(String(accountDto.id))`; continuation reuses the exact limiter-or-single-next helper. All affected methods meet MI≥65 (72.2/67.0/67.8/68.3), with root complexity 379/0. Focused Biome, root code/types/unit, fresh local `db:test`, and AuthRateLimit integration 1/1 passed; the interrupted parallel unit run was superseded by a passing isolated rerun. Regular AuthMiddleware verification target is resolved.

#### Sublot S2 mutation40e4 — regular AuthMiddleware verification

Path: `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`, only `verifyAuthentication` plus private helpers. Paired Server pre-review is clear: extract existing Auth service/controller/HTTP construction and execution unchanged into `fetchVerifiedAccount(context,next)`, preserving service→controller→HTTP construction, `controller.handle` and its thrown `RestResponse` errors; extract ordered context writes into `setVerifiedAccountContext(context,accountDto)`, preserving `account` first and user-scoped `databaseAccess` using `Id.create(String(accountDto.id))`; then reuse existing `continueApiKeyAuthentication(context,next)` for the same limiter-or-single-next tail. Keep `verifyGodAccount`/allowlist flow and all other paths untouched. Preserve verified response values, errors and continuation order across all ~60 route consumers. Fresh root sensor must show all affected/new functions MI≥65 and a lower root count; otherwise stop and re-review. Status `in_progress`; Builder waits for definitions.

Mutation40e4 Builder source checkpoint: `verifyAuthentication` now delegates the unchanged service/controller/HTTP call sequence to `fetchVerifiedAccount`, writes the returned AccountDto through `setVerifiedAccountContext` in account→user-scoped databaseAccess order, then calls the existing limiter-or-next helper. `verifyGodAccount` and other paths were untouched. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and checks/tests if MI gates pass remain pending.

Mutation40e4 verification: Plan/Spec definition gates passed. Fresh CodeGraph confirms construction order and unchanged controller error propagation. Root complexity is 379 warnings/0 errors across 3,476 files/9,456 functions. Direct file metrics: `verifyAuthentication` MI 72.2; `fetchVerifiedAccount` MI 67.0; `setVerifiedAccountContext` MI 67.8; reused `continueApiKeyAuthentication` MI 68.3. The per-file analysis reports 0 warnings across all 11 functions, so every affected function clears MI 65.

#### Sublot S2 mutation40e3 — API-key account context helper

Path: `apps/server/src/app/hono/middlewares/AuthMiddleware.ts`, only the current `setApiKeyAccount` responsibility and helpers private to it. Paired Server pre-review is clear after correcting the source invariant: extract the exact AccountDto literal into `createApiKeyAccount(userId): AccountDto`; keep the context writer short, setting `account` first and then the existing user-scoped databaseAccess value `{ kind: 'user', accountId: Id.create(userId) }`. Do not substitute public database access: the current verified key identity is the account authority. Preserve the caller sequence and exact values. Fresh root complexity must show the resulting methods at MI≥65; if either helper remains MI<65, stop and obtain another bounded review. No other method/path. Status `in_progress`; Builder waits for definition gates.

#### Sublot S2 mutation40f1 — SupabaseAuthService.fetchAccount

Path: `apps/server/src/rest/services/SupabaseAuthService.ts`, method `fetchAccount` only. Fresh root complexity capture marks this method for cognitive complexity, function length and Halstead volume. Paired Server pre-review is clear: extract the current error-response branch verbatim to one private helper returning the same `RestResponse<AccountDto>`; leave the single `supabase.auth.getUser()` call and successful account projection untouched. Preserve `isUnauthorizedFetchAccountError`, classification of bad_jwt/session_expired/no_authorization/HTTP 401/Auth session missing, exact response messages/statuses, and unexpected-error fallback. Do not add catches or change SDK calls, public port shapes, other methods or paths. Inspect fresh complexity for both methods; if the helper gains a marker, stop for a revised bounded assignment before further edits. Status `in_progress`; Builder waits for ACK.

Mutation40f1 Builder source checkpoint: only `SupabaseAuthService.ts` changed. `fetchAccount` now delegates its existing error branch to private `fetchAccountErrorResponse(error)`; the error-response branch statements/messages/statuses remain verbatim, while the single SDK call and success projection remain in `fetchAccount`. No sensors have run yet. Principal source inspection, fresh complexity, tests, root detectors, and paired post-review remain pending.

Mutation40f1 verification: focused Biome, Server `check:code`/`check:types`, `SupabaseAuthService.test.ts`, all Server unit tests (169 suites/330 tests), root `check:code`, root `check:types` (7/7), and root `test:unit` passed (Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1). Fresh root complexity exits 2 with 382 warned functions/0 errors. Although neither changed method has a separate `⚠` metric marker, the sensor counts MI<65 functions: `fetchAccount` is MI55.3 and `fetchAccountErrorResponse` MI50.0. Root count rose 381→382, so the extraction did not resolve the warning. Paired post-review accepted the behavior-preserving move with no findings; the 40f1 CI-09 target remains unresolved and needs a revised bounded decomposition before that feature warning can be considered fixed.

Mutation40f1 behavior sublot accepted on 2026-10-04 after paired Server post-review found no behavior discrepancy. It confirmed the single `getUser()` call, unchanged unauthorized classifications/messages/statuses and unexpected-error fallback, and unchanged success projection/RestResponse. The implementation is not counted as a completed CI-09 warning fix: both resulting methods have MI<65 and the root count rose 381→382. Global CI-09 work remains open.

#### Sublot S2 mutation40f1b — SupabaseAuthService.fetchAccount warning correction

Path: `apps/server/src/rest/services/SupabaseAuthService.ts`, only the unauthorized-message constant and successful SessionDto projection in `confirmEmail`, `confirmPasswordReset`, and `refreshSession`. The previous 40f1d experiment inserted the Map near the top, shifting five existing methods away from recorded baseline ranges; that accounts for its +5 report delta. Move the exact bad_jwt/session_expired `ReadonlyMap` to module scope after the class, preserving keys/messages and existing method ranges. Extract the identical SessionDto projection from the three methods to `createSessionDto(user,session): SessionDto`, preserving every `?? ''`/`?? 0` fallback, one `getUserName(user)` per operation, and each method’s existing SDK call/error branch/RestResponse status. Do not include `signIn` (different non-null contract) or `fetchAccount` (distinct AccountDto/error classifier contract); no public API/new files/catches. Paired Server pre-review is clear. This is a cohesive deduplication, not a guarantee of MI improvement; run fresh root complexity first and stop if the mapper remains MI<65 or the warned count rises. `fetchAccount`/`fetchAccountErrorResponse` remain separate unresolved warnings; reviewer finds no safe helper-only decomposition for `fetchAccount`.

Mutation40f1b Builder source checkpoint: `fetchAccount` retains one `getUser()` call and dispatches errors as before, then delegates success projection to `createFetchAccountResponse(user)`. `fetchAccountErrorResponse` now dispatches unauthorized errors through the existing classifier and keeps the unchanged unexpected-error fallback; exact unauthorized messages/statuses moved into `unauthorizedFetchAccountResponse(error)` using a switch. No classifier or unrelated method changed. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and follow-on checks/tests only if the MI/count gates pass remain pending.

Mutation40f1c Builder source checkpoint: removed `createFetchAccountResponse` and `unauthorizedFetchAccountResponse`. `fetchAccount` now keeps the same success AccountDto/RestResponse projection inline after the single `getUser()` call and error conditional. `fetchAccountErrorResponse` retains the classifier and exact `supabaseAuthError` fallback, using a Map for the two specialized unauthorized messages and the same generic unauthorized message/status. No other method/path changed. No sensors have run after this edit; definitions, fresh CodeGraph/complexity, and checks/tests only if the MI/count gate passes remain pending.

Mutation40f1d Builder source checkpoint: moved the two unauthorized-message entries to the class-level `ReadonlyMap`, removed the local AccountDto variable and returned identical fields directly in the RestResponse body, and simplified `fetchAccountErrorResponse` to one inverse classifier guard plus the same unexpected fallback or generic/specialized 401 response. No helpers or other paths changed. No sensors have run after this edit; definitions, fresh CodeGraph/complexity, and checks/tests only if the MI/count gate passes remain pending.

Mutation40f1d complexity checkpoint: root complexity reports 3,476 files / 9,456 functions / 384 warnings / 0 errors, up from the preceding 379-warning run. `fetchAccount` is MI 56.6 and `fetchAccountErrorResponse` is MI 59.2; both remain below 65. Per assignment, the Builder stopped before focused Biome, type, unit, or service tests. Evidence: `/tmp/stardust-mutation40f1d-complexity.log`. A further revised paired decomposition is required.

Mutation40f1c complexity checkpoint: root complexity reports 3,476 files / 9,456 functions / 379 warnings / 0 errors, down from the previous 381-warning run. The target methods still fail the MI gate: `fetchAccount` MI 55.3 and `fetchAccountErrorResponse` MI 54.6. Per assignment, the Builder stopped before Biome, types, unit, and focused service tests. Evidence: `/tmp/stardust-mutation40f1c-complexity.log`. A revised paired decomposition is required.

Mutation40f1b complexity checkpoint: root complexity reports 3,476 files / 9,458 functions / 381 warnings / 0 errors, up from the preceding 379-warning checkpoint. Target MI values are `fetchAccount` 64.1, `createFetchAccountResponse` 61.9, `fetchAccountErrorResponse` 63.0, and `unauthorizedFetchAccountResponse` 56.0. Every affected method/helper remains below MI 65, so the Builder stopped before Biome, type, unit, or focused tests as required. Evidence: `/tmp/stardust-mutation40f1b-complexity.log`. A revised paired decomposition is required before continuing this path.

### Assignment S2 mutation41 — composição Hono e middlewares

Paths: `apps/server/src/app/hono/HonoApp.ts`; `apps/server/src/app/hono/HonoHttp.ts`; `apps/server/src/app/hono/middlewares/ChallengingMiddleware.ts`; `apps/server/src/app/hono/middlewares/ProfileMiddleware.ts`; `apps/server/src/app/hono/middlewares/SpaceMiddleware.ts`. 26 warnings. Preservar montagem middleware/rotas, HTTP response/headers, identidade e autorização. Status `pending`, depende de mutation40.

### Assignment S2 mutation42 — routers de Profile

Paths: `apps/server/src/app/hono/routers/profile/UsersRouter.ts`; `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts`; `apps/server/src/app/hono/routers/profile/NotesRouter.ts`; `apps/server/src/app/hono/routers/profile/ProfileRouter.ts`. 60 warnings. Preservar ownership/autorização, operações Drizzle, payloads e efeitos. Status `pending`, depende de mutation41.

### Assignment S2 mutation43 — routers e toolkits Challenging

Paths: `apps/server/src/app/hono/routers/challenging/ChallengesRouter.ts`; `apps/server/src/app/hono/routers/challenging/SolutionsRouter.ts`; `apps/server/src/app/hono/routers/challenging/ChallengeSourcesRouter.ts`; `apps/server/src/app/hono/routers/challenging/ChallengeCodeExecutionsRouter.ts`; `apps/server/src/ai/mastra/toolkits/ChallengingToolkit.ts`; `apps/server/src/ai/mastra/toolkits/ProfileToolkit.ts`. 77 warnings. Preservar guard God/public/user, escopo de leitura, avaliação e shapes das ferramentas. Status `pending`, depende de mutation42.

### Assignment S2 mutation44 — reporting, forum, lessons, manual, playground e chats

Paths: `apps/server/src/app/hono/routers/reporting/FeedbackRouter.ts`; `apps/server/src/app/hono/routers/forum/CommentsRouter.ts`; `apps/server/src/app/hono/routers/lesson/QuestionsRouter.ts`; `apps/server/src/app/hono/routers/lesson/StoriesRouter.ts`; `apps/server/src/app/hono/routers/lesson/TextBlocksRouter.ts`; `apps/server/src/app/hono/routers/manual/GuidesRouter.ts`; `apps/server/src/app/hono/routers/playground/SnippetsRouter.ts`; `apps/server/src/app/hono/routers/conversation/ChatsRouter.ts`. 88 warnings; dividir por domínio se necessário. Preservar transactions, locks, publication pós-commit e ordem. Status `pending`, depende de mutation43.

### Assignment S2 mutation45 — routers Shop, Ranking e Space

Paths: `apps/server/src/app/hono/routers/shop/AvatarsRouter.ts`; `apps/server/src/app/hono/routers/shop/InsigniasRouter.ts`; `apps/server/src/app/hono/routers/shop/RocketsRouter.ts`; `apps/server/src/app/hono/routers/ranking/RankingRouter.ts`; `apps/server/src/app/hono/routers/ranking/TiersRouter.ts`; `apps/server/src/app/hono/routers/space/PlanetsRouter.ts`; `apps/server/src/app/hono/routers/space/StarsRouter.ts`. 49 warnings. Preservar paginação/projeções, grants, ownership e progressão. Status `pending`, depende de mutation44.

### Assignment S2 mutation46 — eventos de perfil, stream e jobs

Paths: `apps/server/src/app/hono/routers/profile/ProfileEventsRouter.ts`; `apps/server/src/app/hono/streaming/createProfileCreationStream.ts`; `apps/server/src/queue/inngest/createMarkTextBlockAudioAsErrorOnFailure.ts`; `apps/server/src/queue/inngest/functions/LessonFunctions.ts`; `apps/server/src/queue/inngest/functions/StorageFunctions.ts`. 20 warnings. Preservar SSE frames/deadline/heartbeat/cancel/cleanup, payloads e ordem dos jobs. Status `pending`, depende de mutation45.

### Assignment D2 mutation47 — repository Reporting

CI-09 root capture identifica três warning functions em somente `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`, path pertencente exclusivamente a D2/Builder Database. CodeGraph atual obrigatório antes da edição; extrair apenas fronteiras privadas coesas dos símbolos indicados no relatório, mantendo literalmente authorization/actor, predicates, query ordering, SQL/GREATEST, locks, atomicidade, result projection e efeitos pós-commit. Não alterar routers, models, migrations, interfaces, outra camada, API, casts, tests, thresholds ou baseline. RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; Rules Database/Code Conventions/SDD. Exits: Plan definition, ACK Builder, paired Database pre-review, inspeção do diff, Biome focado, Database code/types, testes de rota reporting reais após `db:test`, complexity sem warnings novos e paired post-review. Status `pending`; path sem overlap com mutation39.

Mutation40f1e Builder source checkpoint: `SupabaseAuthService.ts` now moves the bad_jwt/session_expired message Map after the class and shares the identical successful SessionDto projection from `confirmEmail`, `confirmPasswordReset`, and `refreshSession` through `createSessionDto(user, session)`. Each SDK call, error branch, response status, nullish field fallback, and one `getUserName(user)` evaluation are preserved. No out-of-scope method changed. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and follow-on tests remain pending.

Mutation40f1e complexity checkpoint: root complexity reports 3,476 files / 9,457 functions / 385 warnings / 0 errors, one warning above the preceding 384-warning run. `createSessionDto` is MI 59.3; target callers `confirmEmail`, `confirmPasswordReset`, and `refreshSession` are MI 53.0, 50.4, and 57.9. Both the mapper MI and count gates fail, so no further verification ran. Evidence: `/tmp/stardust-mutation40f1e-complexity.log`.

Mutation40f1e paired pre-review disposition: the DTO extraction is a genuine deduplication and preserves each caller’s distinct SDK/error/status contract, but adds one MI-only warning while the three callers remain below MI 65. A shared `signIn` mapper would conflate non-null identity/token semantics with the three nullish-fallback contracts; further helper extraction would only relocate warnings. No safe local decomposition can meet the CI-09 MI gate, so 40f remains behavior-preserving work but is not a completed warning fix. Keep the module-level message Map after the class to avoid shifting baseline ranges. Next: proceed to the separately owned 40g ApiKeysRouter slice; do not score-game or claim 40f fixed.

#### Sublot S2 mutation40g1 — API-key rename/revoke route family

Path: `apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts`; only `registerRenameApiKeyRoute`, `registerRevokeApiKeyRoute`, their inline handlers, and private helpers for these two routes. Paired Server pre-review is clear. Extract the shared `/:apiKeyId` middleware chain in its existing auth → engineer-profile → ID-param-validation order; PUT appends its existing name-body validation after that chain, DELETE appends nothing. Delegate each route handler to a separate private method; each keeps its own Rename/Revoke controller call. A short shared helper for the exact HonoHttp then DrizzleApiKeysRepository construction is permitted only if needed. Preserve route paths/verbs, validation and repository construction timing/order, context-derived DB/access, response/status/body, thrown error propagation, and exactly one `sendResponse`. Exclude Create, List, AuthRouter, public contracts, tests, thresholds and baseline. RF-01/RF-02/RF-12; CA-01/CA-02/CA-03/CA-20/CA-22; Server Routes/Database/Code Conventions Rules. Exits: Plan/Spec definitions, Server Builder, source inspection, Biome, root code/types/unit, applicable API-key regression, fresh root complexity with every affected/new function MI≥65 and a lower warning count, paired Server post-review. Stop and re-review if complexity fails. Status `in_progress` after activation.

Mutation40g1 Builder source checkpoint: `ApiKeysRouter.ts` now shares `apiKeyIdMiddlewares()` for PUT/DELETE in the original auth → engineer-profile → ID-validation order; PUT keeps name-body validation afterward. Separate `handleRenameApiKey` and `handleRevokeApiKey` helpers preserve their distinct controller construction/handle calls and single `sendResponse`; each builds HonoHttp and obtains the repository through the same context. Paths, verbs and route path are unchanged. The file contains existing Create/List migration changes outside this assignment, which were left untouched. No sensors have run after this source edit; persist definitions, then complexity first, and continue only if the MI/count gate passes.

Mutation40g1 complexity checkpoint: root complexity reports 3,476 files / 9,461 functions / 382 warnings / 0 errors, down three from the immediately preceding 385-warning run. The assigned rename/revoke registrations and handler delegates are absent from the MI<65 report; `apiKeyIdMiddlewares` remains MI 62.8. Stop before formatting/types/tests per the assignment gate and obtain paired re-review for that helper. Evidence: `/tmp/stardust-mutation40g1-complexity.log`.

#### Sublot S2 mutation40g2 — split API-key access and ID middleware

Correction within the same ApiKeysRouter path and rename/revoke family. Paired Server pre-review is clear: extract the exact shared authentication then engineer-profile middleware pair to `apiKeyAccessMiddlewares()`; retain `apiKeyIdMiddlewares()` as the composition of that pair followed by the existing `apiKeyId` param validation. Both PUT/DELETE call sites continue to use `apiKeyIdMiddlewares()`, so order and PUT’s later name-body validation remain unchanged. No new reuse in Create/List, no other route or contract changes. Source checkpoint from 40g1 is retained. Exit: fresh complexity must put both access helpers and all assigned route methods/delegates at MI≥65 and keep root warnings below 382; stop if any helper remains warned. Status `in_progress`.

Mutation40g2 Builder source checkpoint: added `apiKeyAccessMiddlewares()` returning exactly auth then engineer-profile; `apiKeyIdMiddlewares()` now composes that tuple followed by unchanged `apiKeyId` param validation. Both route call sites remain unchanged, PUT still validates the body afterward and DELETE has no body validation. Only `ApiKeysRouter.ts` changed for this correction; no sensors have run. Next: definitions, then fresh root complexity stop-gate.

Mutation40g2 complexity checkpoint: root complexity reports 3,476 files / 9,462 functions / 382 warnings / 0 errors. `apiKeyAccessMiddlewares` is no longer warned, but `apiKeyIdMiddlewares` is MI 64.4; the root total did not fall below the 40g1 result. Stop per assignment and obtain paired pre-review of a cohesive ID-validation boundary. Evidence: `/tmp/stardust-mutation40g2-complexity.log`.

#### Sublot S2 mutation40g3 — extract API-key ID parameter schema

Correction within the same path and rename/revoke family. Paired Server pre-review is clear: define module-level `apiKeyIdParamsSchema = z.object({ apiKeyId: idSchema })` after the class, then pass it to the unchanged `'param'` validation middleware in `apiKeyIdMiddlewares()`. Preserve exact schema and middleware order; both route call sites remain unchanged, PUT body validation remains afterward, DELETE still has no body validation. After-class placement preserves existing function source ranges. No other route/path changes. Exit: fresh root complexity requires `apiKeyIdMiddlewares` and all affected/new functions MI≥65 and root warning count <382; otherwise stop. Status `in_progress`.

Mutation40g3 Builder source checkpoint: moved exact `z.object({ apiKeyId: idSchema })` construction to module-scope `apiKeyIdParamsSchema` after the class and passed it to the same `'param'` validator. Middleware order, rename/revoke call sites, PUT name-validation order and DELETE body behavior are unchanged. No other route changed. No sensors have run; next are definition gates and fresh complexity.

Mutation40g3 complexity checkpoint: root complexity reports 3,476 files / 9,462 functions / 381 warnings / 0 errors, down from 382. `apiKeyIdMiddlewares` and all changed/new rename/revoke functions are absent from the MI<65 list; the target portion of the gate passes. Evidence: `/tmp/stardust-mutation40g3-complexity.log`. Continue focused formatting, root code/types/unit, the applicable API-key route regression, then paired post-review.

Mutation40g3 ACH-46: focused Biome found formatter-only changes required in `registerRevokeApiKeyRoute` and `apiKeyRepository` (`ApiKeysRouter.ts`); no semantic finding. The clean formatting exit is failed/stale and downstream code/types/unit/review evidence has not run for this candidate. Next: Builder applies formatter-only correction, then update this ledger and rerun definition gates, complexity, and applicable validation.

ACH-46 correction source checkpoint: Biome formatting only changed the requested wrapping of `registerRevokeApiKeyRoute` and the compact DrizzleApiKeysRepository constructor in the authorized path. No behavior changed. The earlier complexity result is stale until rerun; Plan/Spec definitions, Biome, root checks/tests, route regression and paired post-review remain pending.

Mutation40g3 ACH-46 verification: Plan/Spec definitions passed; focused Biome passed after the formatting correction. Fresh complexity reports 3,476 files / 9,462 functions / 381 warnings / 0 errors; no assigned rename/revoke method/helper appears below MI65, and the count remains lower than the original 385 checkpoint. Evidence: `/tmp/stardust-mutation40g3-ach46-complexity.log`. Next: root `check:code`, `check:types`, and `test:unit`, then real local API-key route regression and paired Server post-review.

Mutation40g3 ACH-47: root `npm run check:code` failed in `@stardust/server#check:code`; the focused changed-path Biome check had passed. The failure output is truncated and contains warnings from multiple workspaces; exact Server diagnostics are not yet isolated. Do not attribute or close this as an ApiKeysRouter issue without focused diagnostics. Root `check:types`/`test:unit`, API-key route regression and post-review have not run. Next: capture the Server code-check log, classify findings against changed paths, correct in-scope findings, then rerun affected detectors.

Mutation40g3 ACH-47 diagnosis: isolated Server `check:code` reports six warnings and four infos, plus one formatter error in `apps/server/src/rest/services/SupabaseAuthService.ts` line 523–526: the existing `supabaseAuthError` call must be formatted onto one line. The focused ApiKeysRouter file is clean. Apply only this required formatter correction in the already active 40f path; then rerun definitions, root code and subsequent detectors. Root check remains failed; types/unit/route regression/review remain pending.

ACH-47 correction source checkpoint: Biome-required formatting only put the existing `supabaseAuthError<AccountDto>` fallback call on one line in `SupabaseAuthService.ts`. No branch, value, or behavior changed. All detector evidence after that file’s earlier state is stale; next rerun definitions and root checks.

Mutation40g3 ACH-47 verification: Plan/Spec definitions passed; root `npm run check:code` now exits 0 after the formatter correction. Evidence: `/tmp/stardust-mutation40g3-ach47-code.log`. Next run root types and unit, then identify and execute the real API-key route regression before paired post-review.

Mutation40g3 root types verification: `npm run check:types` exits 0 (log `/tmp/stardust-mutation40g3-types.log`). Root code/types now pass. Root `test:unit`, API-key route behavior against a fresh local test DB, and paired Server post-review remain pending.

Mutation40g3 root unit verification: `npm run test:unit` exits 0; Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1 passed (log `/tmp/stardust-mutation40g3-unit.log`). Next: find and run the actual API-key route integration regression after fresh `db:test`, then paired post-review.

40g3 test-coverage audit: existing dedicated tests cover `RenameApiKeyController` and `RevokeApiKeyController`, but file discovery found no route-level API-key test under `apps/server/src/tests/routes`. Controller unit evidence is insufficient for this middleware change. Next: paired review of the coverage gap and, if no existing full integration suite exercises these paths, a bounded real-route regression before 40g is complete.

Mutation40g3 global conformance gate: `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` failed across the candidate: numerous contracted `Remove` paths still exist, several `Modify` paths are unchanged, and `Create` paths are missing; it reports 504 contracted paths and 22 unrelated changed paths ignored. `ApiKeysRouter.ts` is not among the reported path mismatches. This is a global SDD blocker, not a 40g source failure; stop claiming candidate readiness and capture/resolve the conformance findings before integrated closeout. Root tests ran before this required preflight was discovered; their test results remain factual but do not substitute for conformance.

Captured conformance diagnostic: 140 errors total: 122 `Remove path still exists`, 16 `Modify path is unchanged from the baseline`, and 2 `Create path is missing`. Base is the current HEAD `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; full log `/tmp/stardust-mutation40g3-spec-implementation.log`. Exact failed paths are retained in that log for reconciliation.

#### Correction S2 mutation40f1f — remove failed complexity-only auth-service experiment

Path: `apps/server/src/rest/services/SupabaseAuthService.ts`, only 40f1 experiment edits. Paired Server pre-review is clear. Restore the three `confirmEmail`/`confirmPasswordReset`/`refreshSession` SessionDto projections inline; restore original inline `fetchAccount` error/success behavior; remove only `createSessionDto`, `fetchAccountErrorResponse`, `UNAUTHORIZED_FETCH_ACCOUNT_MESSAGES`, and unused `SupabaseSession` import. Keep `isUnauthorizedFetchAccountError` and preserve all unrelated signed-up nonce/eligibility, `SupabaseClient` migration, other methods and public contracts. Reviewer verified exact field fallbacks, one username projection, error messages/statuses and unexpected fallback. This is rollback of a failed maintainability experiment, not a claim that original auth methods meet MI≥65. Exit: fresh root complexity must lower the current 381 warning count without new warnings; then focused Biome, root code/types/unit and reviewer. Full conformance/route integration remain global pending. Status `in_progress`.

Mutation40f1f Builder source checkpoint: restored the three inline SessionDto projections and original inline fetchAccount error/success path; removed only the experiment mapper/helper/message Map and unused SupabaseSession import. `isUnauthorizedFetchAccountError`, signUp nonce/eligibility, SupabaseClient migration and unrelated methods remain. No sensors have run. Next: definitions and fresh complexity; no claim the original functions meet MI65.

Mutation40f1f complexity checkpoint: root complexity reports 3,476 files / 9,460 functions / 379 warnings / 0 errors, down from 381 before rollback. The 40f experiment-only helpers are gone; original low-MI AuthService functions remain as residual warnings. Evidence: `/tmp/stardust-mutation40f1f-complexity.log`. The global warning backlog is still open.

Mutation40f1f ACH-49 verification: focused Biome passes on `SupabaseAuthService.ts` and `ApiKeysRouter.ts`. Fresh root complexity is 3,476 files / 9,460 functions / 374 warnings / 0 errors; no 40g rename/revoke function/helper is below MI65. AuthService original low-MI warnings remain. Evidence: `/tmp/stardust-mutation40f1f-ach49-complexity.log`. Root code/types/unit and paired post-review of 40g/cleanup are still required; the 140-error global conformance gate remains open.

Mutation40f1f ACH-49 preflight rerun: `check:spec-implementation` still reports 140 global mismatches (same 122/16/2 categories, 22 unrelated ignored); neither AuthService nor ApiKeysRouter is named as mismatched. Evidence: `/tmp/stardust-mutation40f1f-ach49-spec-implementation.log`. Proceed with this slice’s root detectors to verify source behavior, but do not claim full candidate conformance.

Mutation40f1f root code verification: `npm run check:code` exits 0 on the post-rollback/formatted candidate (log `/tmp/stardust-mutation40f1f-ach49-code.log`). Root types/unit and paired post-review remain pending.

Mutation40f1f root types verification: `npm run check:types` exits 0 (log `/tmp/stardust-mutation40f1f-ach49-types.log`). Root code/types pass; root unit, route integration scope, paired Server review, and global conformance remain pending.

Mutation40f1f root unit verification: `npm run test:unit` passes (Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1; log `/tmp/stardust-mutation40f1f-ach49-unit.log`). The 40f cleanup has code/types/unit green; global path conformance and pair review remain outstanding.

#### Sublot S2 mutation40h1 — password sign-in route family

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`; only `registerSignInRoute` and `registerSignInGodAccountRoute` plus private helpers. Paired Server pre-review is clear. Extract shared registration `registerCredentialsSignInRoute(path, createController)` to keep each exact POST path and existing JSON validation middleware, then delegate callbacks to `handleCredentialsSignIn(context, createController)`. The regular route factory preserves `SignInController(service, new InngestBroker())`; God route factory preserves `SignInGodAccountController(service)` without broker/boolean branching. Preserve HonoHttp → SupabaseAuthService → route-specific controller construction, validation before handler, request DTO values, awaited handle, response/body/status/headers, and single sendResponse. Leave sign-up/retry/OAuth/refresh/cookie routes untouched. RF-01/RF-02/RF-12; CA-01/CA-03/CA-20/CA-22; Server Routes/Code Conventions Rules. Exits: definition gates, source review, focused Biome, root code/types/unit, fresh complexity with every affected/new function ≥MI65 and root count lower than 374, paired Server post-review. Stop/re-review on complexity failure. Status `in_progress`.

Mutation40h1 Builder source checkpoint: `registerSignInRoute` and `registerSignInGodAccountRoute` now delegate to shared `registerSignInPath(path, controllerFactory)`. Shared path registration preserves JSON email/password validation and per-request HonoHttp → SupabaseAuthService → awaited route-specific controller → single sendResponse order. Regular factory creates `SignInController` with a new `InngestBroker`; God factory uses `SignInGodAccountController` without a broker. Paths/order unchanged; other AuthRouter routes untouched. No sensors have run; definition gates and fresh complexity are next.

Mutation40h1 complexity checkpoint: root complexity reports 3,476 files / 9,462 functions / 373 warnings / 0 errors, down one from 374. `registerSignInPath` remains MI58.8, so the affected-helper gate fails. No Biome/types/tests ran after this source edit. Stop and obtain a revised paired pre-review for splitting registration from per-request handling; evidence `/tmp/stardust-mutation40h1-complexity.log`.

#### Sublot S2 mutation40h2 — split sign-in route registration and request handling

Correction within the same AuthRouter password sign-in pair. Paired Server pre-review is clear: keep `registerSignInPath(path, controllerFactory)` limited to the same POST path and unchanged JSON validation, with a one-expression callback delegating to `handleSignInPath(context, controllerFactory)`. Extract existing request body into a private async handler typed with Hono `Context`; preserve HonoHttp → SupabaseAuthService → factory → awaited controller.handle → sendResponse order. Regular factory constructs broker then SignInController after service; God factory constructs only SignInGodAccountController. Validation remains before handler; no changes to rate limiter, other route or contract. Add only the needed Context type import. Fresh complexity must show every changed/new function MI≥65 and root warnings <373; otherwise stop. Status `in_progress`.

Mutation40h2 Builder source checkpoint: added only Hono `Context` type and private `handleSignInPath(context, controllerFactory)`. `registerSignInPath` now keeps POST+unchanged JSON validation and delegates via a one-expression callback. Handler preserves HonoHttp → SupabaseAuthService → factory → awaited handle → one sendResponse; regular/God factories and route call sites remain unchanged. No sensors have run; definition gates and fresh complexity are next.

Mutation40h2 complexity checkpoint: root complexity reports 3,476 files / 9,463 functions / 373 warnings / 0 errors. New `handleSignInPath` clears MI65, but `registerSignInPath` remains MI62.4 and root count is unchanged from 40h1. Stop before broader sensors and obtain paired pre-review for a meaningful schema/registration simplification. Evidence: `/tmp/stardust-mutation40h2-complexity.log`.

#### Sublot S2 mutation40h3 — name shared credentials schema

Correction within the same password sign-in pair. Paired Server pre-review is clear: move exact `z.object({ email: emailSchema, password: passwordSchema })` to module-level `credentialsSignInSchema` after the class and pass that same schema to the unchanged `validate('json', ...)` call in `registerSignInPath`. Preserve exact POST path, validator position before handler, shape/defaults, controller factories and response sequence. After-class placement avoids shifting earlier functions. No other route changes. Fresh complexity must show registration and all affected functions MI≥65 and root warnings <373; otherwise stop. Status `in_progress`.

Mutation40h3 Builder source checkpoint: added module-level `credentialsSignInSchema` after the class containing the exact prior `{email,password}` Zod object; `registerSignInPath` passes it to the existing JSON validator. Route path, validation placement, controller factories, and request flow are unchanged. No sensors have run; definition gates and fresh complexity are next.

Mutation40h3 complexity checkpoint: root complexity reports 3,476 files / 9,463 functions / 371 warnings / 0 errors, down two from 373. `registerSignInPath`, `handleSignInPath`, and the delegate callback no longer appear as MI<65 warnings; current target gate passes. Evidence: `/tmp/stardust-mutation40h3-complexity.log`. Next focused Biome, root code/types/unit, and paired Server post-review.

Mutation40h3 validation correction: focused Biome requests formatter-only wrapping of the regular sign-in route’s `registerSignInPath` arguments. No behavior change; apply formatting, then rerun definitions and affected sensors.

Mutation40h3 formatting source checkpoint: Builder applied only the requested multiline formatting to the regular sign-in registration call. No behavior change. Prior Biome result predates this edit; definitions and all affected checks remain pending.

Mutation40h3 validation checkpoint: Spec/Plan definitions pass; focused Biome and root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh complexity: 3,476 files / 9,463 functions / 372 warnings / 0 errors; the three changed sign-in helpers do not appear in the MI<65 findings, and total is below the 373-warning pre-slice count. Global `check:spec-implementation` remains failed with 140 path errors (122 Remove paths present, 16 Modify paths unchanged, 2 Create paths missing; 22 unrelated paths ignored), log `/tmp/stardust-mutation40h3-spec-implementation-final.log`. Evidence: `/tmp/stardust-mutation40h3-complexity-final.log`, `/tmp/stardust-mutation40h3-types.log`, `/tmp/stardust-mutation40h3-unit.log`; root code output passed in the executed detector run. Paired Server post-review is next; candidate-wide conformance and remaining warning groups remain open.

Mutation40h3 completed: paired Server post-review accepted with no findings. The regular/God password sign-in routes retain exact paths, JSON schema and validation position, controller-factory distinction, request ordering, error propagation, and one response send. Local gates pass; global path conformance and full Server integration remain open.

#### Sublot S2 mutation40h4 — social-provider sign-in redirects

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerSignInWithGoogleRoute` and `registerSignInWithGithubRoute` plus helpers private to these routes. CodeGraph confirms both are GET redirects with the same query `{ returnUrl: stringSchema }` validation and the same request sequence, differing only in path and controller class. Proposed extraction for paired pre-review: name the exact shared query schema after the class; use one registration helper parameterized by the exact provider path and controller factory; if complexity requires, move the current per-request HonoHttp → SupabaseAuthService → provider controller → awaited handle → sendResponse sequence into a private handler. Preserve `/sign-in/google` and `/sign-in/github`, GET verb, validation-before-handler, exact returnUrl schema, provider-specific controller, one service per request, error propagation, and single response send. No other routes change. Fresh root complexity must show changed/new functions ≥MI65 and total warnings <372; otherwise stop and re-review. Status `in_progress`; Builder waits for paired pre-review.

Mutation40h4 paired Server pre-review is clear. Approved boundary includes one module-scope `socialSignInQuerySchema` after the class; both methods delegate to `registerSocialSignInRoute(path, controllerFactory)` using the exact existing GET path literals; registration preserves query validation before a one-expression callback to `handleSocialSignIn(context, controllerFactory)`; handler keeps HonoHttp → SupabaseAuthService → provider factory → awaited handle → one sendResponse. Factories retain the existing Google/GitHub controller classes. No middleware, callback, or other AuthRouter method changes. Fresh complexity must show all affected/new functions ≥MI65 and root warnings <372. No source changes yet.

Mutation40h4 Builder source checkpoint: Google/GitHub registrations now delegate through the shared GET registration helper and `socialSignInQuerySchema`; separate factories preserve each provider controller. The private handler keeps the approved per-request service/controller/response order. No other route changed. No sensors/tests have run; definitions and complexity stop gate are next.

Mutation40h4 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Complexity reports 3,476 files / 9,466 functions / 370 warnings / 0 errors; the edited provider route functions/helpers do not appear in MI<65 findings, reducing root warnings by two from the 372 pre-slice count. Global `check:spec-implementation` remains failed with 140 errors, including 122 Remove-present, 16 unchanged Modify, and 2 missing Create paths; 22 unrelated changed paths ignored. Evidence: `/tmp/stardust-mutation40h4-complexity.log`, `/tmp/stardust-mutation40h4-code.log`, `/tmp/stardust-mutation40h4-types.log`, `/tmp/stardust-mutation40h4-unit.log`, `/tmp/stardust-mutation40h4-spec-implementation.log`. Paired post-review is next; global conformance and remaining warning groups remain open.

Mutation40h4 completed: paired Server post-review accepted with no findings. Exact paths, GET/query validation order and shape, provider-specific controllers, per-request handling, error propagation and single response send are preserved. Reviewer confirms CI-09 resolved for this slice at 370 warnings. Correction: actual private helper names are `registerSocialSignInPath` and `handleSocialSignInPath` (not the earlier proposed names); no behavior impact.

#### Sublot S2 mutation40h5 — authenticated social account connection routes

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerConnectGoogleAccountRoute` and `registerConnectGithubAccountRoute` plus pair-private helpers/schema. CodeGraph shows both POST routes use `verifyAuthentication`, then query validation `{ returnUrl: stringSchema }`, then per-request HonoHttp → SupabaseAuthService → provider-specific controller → awaited handle → single sendResponse. Exact paths are `/social-account/google` and `/social-account/github`. Obtain paired pre-review for whether to share the existing exact returnUrl schema and for cohesive registration/request-handler helpers. Preserve POST paths, authentication-before-validation order, validation-before-handler, verified auth context, provider controller, one service per request, errors and response semantics. No other route/middleware behavior may change. Fresh complexity must clear all assigned/new functions from MI<65 and reduce root count below 370; otherwise stop and revise with review. Status `in_progress`, awaiting paired pre-review.

Mutation40h5 paired Server pre-review is clear. Reuse the immutable `socialSignInQuerySchema` already introduced in accepted 40h4. Only the two connect methods plus `registerSocialAccountConnectionPath` and `handleSocialAccountConnectionPath` may change. Registration preserves exact POST path and order `verifyAuthentication` → query validation → callback. Provider factories retain ConnectGoogle/ConnectGithub controller. Handler keeps HonoHttp → `getSupabase()` → SupabaseAuthService → factory → awaited handle → one sendResponse. Error propagation, redirect/cookie/status/header behavior remain. Do not alter accepted 40h4 sign-in helpers. Fresh MI≥65 and root count <370 required. No source change yet.

Mutation40h5 Builder source checkpoint: the two connect route methods now delegate through `registerSocialAccountConnectionPath` with their exact paths and existing provider factories. Shared registration reuses `socialSignInQuerySchema` after auth middleware; handler preserves the reviewed service/controller/response sequence. Accepted 40h4 helpers and all other routes are unchanged. No checks/tests have run; fresh complexity stop gate is next.

Mutation40h5 validation correction: focused Biome requests a single-line layout for the callback passed to `handleSocialAccountConnectionPath`. Formatting only; apply, rerun definitions, then fresh complexity and other checks.

Mutation40h5 formatting source checkpoint: Builder applied only the formatter-requested one-line callback layout. Semantics unchanged; prior complexity/Biome results predate this formatting edit. Rerun definitions and all affected checks.

Mutation40h5 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh complexity reports 3,476 files / 9,469 functions / 368 warnings / 0 errors; assigned connect-route methods/helpers are absent from MI<65 findings, reducing root total by two from 370. Global `check:spec-implementation` remains failed with 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h5-complexity-final.log`, `/tmp/stardust-mutation40h5-code.log`, `/tmp/stardust-mutation40h5-types.log`, `/tmp/stardust-mutation40h5-unit.log`, `/tmp/stardust-mutation40h5-spec-implementation.log`. Paired post-review remains pending.

Mutation40h5 completed: paired Server post-review accepted with no findings. Exact POST paths, auth → query validation → handler order, existing schema reuse, provider-specific controllers, request sequence, error and response behavior are preserved. Reviewer confirms CI-09 resolved for this slice at 368 warnings. Global path conformance remains open.

#### Sublot S2 mutation40h6 — email action routes

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerResendSignUpEmailRoute` and `registerRequestPasswordResetRoute` plus pair-private helpers/schema. CodeGraph shows both are POST routes validating the same `{ email: emailSchema }` JSON shape, then constructing HonoHttp → SupabaseAuthService → distinct ResendSignUpEmailController / RequestPasswordResetController → awaited handle → single sendResponse. Exact paths: `/resend-email/sign-up` and `/request-password-reset`. Obtain paired pre-review for a named shared schema and registration/request-handler helpers. Preserve exact paths, POST, validation-before-handler, email schema, per-request service, route-specific controllers, errors and response behavior. No other routes change. Fresh complexity must clear all affected/new functions from MI<65 and reduce root count below 368; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation40h6 paired Server pre-review is clear: add exact module-level `emailOnlySchema` after the class; delegate both routes via `registerEmailActionPath` with literal paths and their existing distinct controller factories. Preserve POST registration order `validate('json', emailOnlySchema)` → handler callback. Handler retains per-request HonoHttp → SupabaseAuthService → provider factory → awaited handle → one sendResponse. Controllers remain distinct; errors/RestResponse unchanged; no middleware/other routes touched. Fresh MI≥65 and root warnings <368 required. No source changes yet.

Mutation40h6 Builder source checkpoint: only the resend-email/sign-up and request-password-reset route registrations changed. Added exact shared `emailOnlySchema`, `registerEmailActionPath`, and `handleEmailActionPath`; distinct controller factories, literal paths, validator-before-handler order, request sequence and single response send remain. No sensors/tests have run; definitions and complexity gate are next.

Mutation40h6 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh complexity reports 3,476 files / 9,472 functions / 366 warnings / 0 errors; the assigned email action route functions/helpers are absent from MI<65 findings, down two from the 368-warning pre-slice total. Global `check:spec-implementation` remains failed at 140 errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h6-complexity.log`, `/tmp/stardust-mutation40h6-code.log`, `/tmp/stardust-mutation40h6-types.log`, `/tmp/stardust-mutation40h6-unit.log`, `/tmp/stardust-mutation40h6-spec-implementation.log`. Paired post-review pending.

Mutation40h6 completed: paired Server post-review accepted with no findings. Exact POST paths, email schema, validation-before-handler order, distinct controllers, request construction, error propagation and single response send are preserved. CI-09 resolved for the assigned route pair at 366 warnings; global conformance remains open.

#### Sublot S2 mutation40h7 — refresh-session route schema

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerRefreshSessionRoute` and its request schema. CodeGraph must be used by paired pre-review on current source. Candidate change is to name the exact current `z.object({ refreshToken: stringSchema })` schema after the class and reuse it in the existing JSON validator. Preserve POST `/refresh-session`, validation-before-handler, same request field/schema, per-request HonoHttp → SupabaseAuthService → RefreshSessionController → awaited handle → one sendResponse; no other routes. Paired pre-review decides if this bounded schema extraction meaningfully reduces MI without helper fragmentation. Root complexity must be below 366 with target clear; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation40h7 paired Server pre-review is clear only for moving the exact `{ refreshToken: stringSchema }` object to a module-level named schema after the class. No handler extraction or other route changes. Route/verb, validator position, callback/service/controller order, errors and single response send remain. Reviewer notes the MI gain is uncertain; fresh complexity is a hard stop. Do not broaden this slice if it fails.

Mutation40h7 Builder source checkpoint: moved only the exact refresh-token schema to module-scope `refreshSessionSchema` and reused it in the same JSON validator. No route/helper/handler behavior changed. No sensors run; fresh complexity is the hard stop.

Mutation40h7 complexity stop: root complexity reports 3,476 files / 9,472 functions / 360 warnings / 0 errors. `registerRefreshSessionRoute` remains MI63.6 and therefore still warns; although total fell from 366 to 360, the assigned target gate fails. Per paired pre-review, stop this slice before Biome/types/tests and request a fresh paired pre-review before broadening. Evidence: `/tmp/stardust-mutation40h7-complexity.log`.

Mutation40h7 correction paired pre-review is clear for one private `handleRefreshSessionPath(context: Context)`: keep the route method’s POST/path and validator, replace only the inline callback body with a delegate, and move the current HonoHttp → SupabaseAuthService → RefreshSessionController → awaited handle → one sendResponse body verbatim. Preserve validation order, per-request construction, thrown errors, and response. No other routes. Fresh MI≥65 for registration/helper/callback and root count <360; stop if either gate fails.

Mutation40h7 correction source checkpoint: added only `handleRefreshSessionPath(context)` and delegated the existing callback to it. Route path, POST, shared schema validator, request sequence, errors and response path remain as reviewed. No sensors/tests have run; definitions and fresh complexity stop gate are next.

Mutation40h7 correction complexity checkpoint: fresh root reports 3,476 files / 9,473 functions / 365 warnings / 0 errors. `registerRefreshSessionRoute`, `handleRefreshSessionPath`, and delegate callback are absent from MI<65 findings, so the target clears; the root total is one below the captured pre-slice 366. Evidence: `/tmp/stardust-mutation40h7-correction-complexity.log`.

Mutation40h7 stop-gate reassessment: paired pre-reviewer confirms proceed to validation. Their earlier `<360` criterion incorrectly used the schema-only interim snapshot instead of the pre-slice baseline. The correct aggregate gate is below the pre-slice baseline (365 < 366), with all target functions clear. No further decomposition is approved; continue focused Biome/types/unit and paired post-review.

Mutation40h7 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Complexity remains 3,476 files / 9,473 functions / 365 warnings / 0 errors; all three changed/new route functions clear MI<65 and the root count is one below 366 pre-slice. Global `check:spec-implementation` still fails with 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h7-correction-complexity.log`, `/tmp/stardust-mutation40h7-code.log`, `/tmp/stardust-mutation40h7-types.log`, `/tmp/stardust-mutation40h7-unit.log`, `/tmp/stardust-mutation40h7-spec-implementation.log`. Paired post-review pending.

Mutation40h7 completed: paired Server post-review accepted with no findings. Exact POST path/schema/validation order, per-request handler flow, error propagation, and single response send are preserved. Assigned functions clear CI-09; root total is 365 vs 366 pre-slice. Global conformance remains open.

#### Sublot S2 mutation40h8 — email and password reset confirmation routes

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerConfirmEmailRoute` and `registerConfirmPasswordResetRoute` plus pair-private helpers/schema. CodeGraph must inspect current source before review. Both are POST routes validating `{ token: z.string() }` before per-request HonoHttp/SupabaseAuthService and controller. Preserve paths `/confirm-email` and `/confirm-password-reset`, exact token schema, distinct controllers and their construction (ConfirmEmail retains InngestBroker; ConfirmPasswordReset has none), awaited handle, errors and one sendResponse. Paired pre-review should approve any shared schema/registration/handler without branching away controller semantics. No other routes change. Fresh complexity must clear changed/new functions and reduce root warnings below 365; otherwise stop/re-review. Status `in_progress`, awaiting paired pre-review.

Mutation40h8 paired Server pre-review is clear. Add exact `confirmationTokenSchema` after the class; both route methods delegate to shared registration with their literal paths and factories. Email factory constructs a new InngestBroker then ConfirmEmailController; reset factory constructs only ConfirmPasswordResetController. Registration preserves POST, schema validation before callback. Separate handler preserves per-request HonoHttp → SupabaseAuthService → factory → awaited handle → one sendResponse. No other routes; errors/RestResponse unchanged. Fresh MI≥65 for all affected/new functions and root warnings <365 required.

Mutation40h8 Builder source checkpoint: replaced only the two confirmation route registrations with `registerConfirmationPath`, using the exact module-scope `{ token: z.string() }` schema. Provider factories retain the broker only for ConfirmEmail. Shared handler keeps request ordering and single response send. No sensors/tests have run; definitions and fresh complexity stop gate are next.

Mutation40h8 syntax correction: complexity could not parse AuthRouter.ts due two orphaned closing tokens (`)` and `}`) remaining from the replaced inline route body. The reported root total 356 is invalid because the file was skipped. Remove only those stale tokens, then rerun definitions and all checks; no behavior adjustment.

Mutation40h8 syntax source checkpoint: Builder removed only those two stale closing tokens. Handler and next method now close correctly; no behavior change. Previous complexity result is invalid; definitions and all validation must rerun.

Mutation40h8 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh valid complexity reports 3,476 files / 9,476 functions / 362 warnings / 0 errors; target routes/helpers are absent from MI<65 findings and root is 3 below the 365 pre-slice count. Global `check:spec-implementation` remains failed with 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h8-complexity-final.log`, `/tmp/stardust-mutation40h8-code.log`, `/tmp/stardust-mutation40h8-types.log`, `/tmp/stardust-mutation40h8-unit.log`, `/tmp/stardust-mutation40h8-spec-implementation.log`. Paired post-review pending.

Mutation40h8 completed: paired Server post-review accepted with no findings. Confirmation paths/schema/validation, per-request controller order, per-request broker only on confirm-email, error propagation and single response send are preserved. Valid root complexity is 362, down three from pre-slice 365. Global conformance remains open.

#### Sublot S2 mutation40h9 — reset-password PATCH route

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerResetPasswordRoute` and private helpers/schema for that route. CodeGraph must inspect current path and call flow before review. Preserve PATCH `/reset-password`, exact JSON schema `{ newPassword: passwordSchema, accessToken: z.string(), refreshToken: z.string() }`, validation-before-handler, per-request HonoHttp → SupabaseAuthService → ResetPasswordController → awaited handle → one sendResponse, errors and response. Paired pre-review should identify meaningful boundaries (named schema and/or moving the existing request body into one handler), with no other route changes. Fresh complexity must clear all affected/new functions and reduce root warnings below 362; otherwise stop/re-review. Status `in_progress`, awaiting paired pre-review.

Mutation40h9 paired Server pre-review is clear for only this route, exact module-level `resetPasswordSchema`, and `handleResetPasswordPath(context: Context)`. Keep PATCH/path and validator position, move the exact inline schema, and move the request callback body verbatim into the handler. Preserve HonoHttp → `getSupabase()` → SupabaseAuthService → ResetPasswordController → awaited handle → one sendResponse, errors and RestResponse. No generic factory or other routes. Fresh MI≥65 for route/helper/callback and root warnings <362 required.

Mutation40h9 Builder source checkpoint: route remains PATCH `/reset-password`, now uses exact module-level `resetPasswordSchema` in the same JSON validator and delegates to `handleResetPasswordPath(context)`. Handler preserves request/service/controller/response order. No other route changed; sensors/tests have not run.

Mutation40h9 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Complexity reports 3,476 files / 9,477 functions / 361 warnings / 0 errors; target route/schema/handler/delegate are absent from MI<65 findings, and root is one below 362 pre-slice. Global `check:spec-implementation` remains at 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h9-complexity.log`, `/tmp/stardust-mutation40h9-code.log`, `/tmp/stardust-mutation40h9-types.log`, `/tmp/stardust-mutation40h9-unit.log`, `/tmp/stardust-mutation40h9-spec-implementation.log`. Paired post-review pending.

Mutation40h9 completed: paired Server post-review accepted with no findings. PATCH path, exact body schema/validation position, request order, errors and single response are preserved. Assigned functions clear MI65; root is 361 vs 362 pre-slice. Global conformance remains open.

#### Sublot S2 mutation40h10 — authenticated retry-user-creation route

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerRetryUserCreationRoute` and helpers private to it. CodeGraph must inspect current source and caller order before review. Preserve POST `/sign-up/retry`, auth middleware then profile absence middleware before handler, per-request HonoHttp → SupabaseAuthService → InngestBroker → RetryUserCreationController → awaited handle → one sendResponse, errors and response. Paired pre-review should approve a cohesive handler boundary without changing middleware/call order or other route. Fresh complexity must clear all changed/new functions and reduce root warning count below 361; otherwise stop/re-review. Status `in_progress`, awaiting paired pre-review.

Mutation40h10 paired Server pre-review is clear for extracting only the inline callback body into `handleRetryUserCreation(context: Context)`. Keep POST route and auth → profile absence middleware order exactly; helper preserves HonoHttp → SupabaseAuthService from `http.getSupabase()` → per-request InngestBroker → RetryUserCreationController → awaited handle → one sendResponse. No schema/generic helper or other route changes. Fresh MI≥65 for registration/helper/callback and root <361 required.

Mutation40h10 Builder source checkpoint: only the retry route callback body moved to `handleRetryUserCreation(context)`. POST path, authentication → absence middleware order, per-request broker/controller construction and response flow remain. No other route changed; no checks run.

Mutation40h10 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Complexity reports 3,476 files / 9,478 functions / 360 warnings / 0 errors; assigned registration/helper/callback clear MI<65 and root is one below 361 pre-slice. Global `check:spec-implementation` remains at 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h10-complexity.log`, `/tmp/stardust-mutation40h10-code.log`, `/tmp/stardust-mutation40h10-types.log`, `/tmp/stardust-mutation40h10-unit.log`, `/tmp/stardust-mutation40h10-spec-implementation.log`. Paired post-review pending.

Mutation40h10 completed: paired Server post-review accepted with no findings. Exact POST/middleware order, per-request service/broker/controller construction, error propagation and single response preserved. Assigned functions clear MI65 at 360 vs 361 pre-slice; global conformance remains 140 errors.

#### Sublot S2 mutation40h11 — social-account signup route

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerSignUpWithSocialAccountRoute` and helpers private to it. CodeGraph must inspect current source/call order before review. Preserve POST `/sign-up/social-account`, exact `accountSchema` JSON validation then `profileMiddleware.verifyUserSocialAccount`, per-request HonoHttp → InngestBroker → SignUpWithSocialAccountController → awaited handle → one sendResponse, errors and response. Paired pre-review should approve a cohesive callback extraction without changing middleware order or introducing generic branching. No other route. Fresh complexity must clear changed/new functions and root warnings below 360; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation40h11 paired Server pre-review is clear for one private `handleSignUpWithSocialAccount(context: Context)` helper. Keep the exact POST path and middleware order: JSON `accountSchema` validation → `verifyUserSocialAccount` → callback. Move callback body verbatim: HonoHttp → per-request InngestBroker → SignUpWithSocialAccountController → awaited handle → one sendResponse. This route does not construct SupabaseAuthService. Preserve errors/response; no schema/generic helper or other route edits. Fresh MI≥65 for method/helper/callback and root <360 required.

Mutation40h11 Builder source checkpoint: only the social-account signup callback moved to `handleSignUpWithSocialAccount(context)`. Exact POST path, validation → profile verification order, per-request broker/controller flow and one response send remain; no SupabaseAuthService added. No checks/tests have run.

Mutation40h11 validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Complexity reports 3,476 files / 9,479 functions / 359 warnings / 0 errors; assigned route/helper/delegate clear MI<65 and root is one below 360 pre-slice. Global `check:spec-implementation` remains at 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h11-complexity.log`, `/tmp/stardust-mutation40h11-code.log`, `/tmp/stardust-mutation40h11-types.log`, `/tmp/stardust-mutation40h11-unit.log`, `/tmp/stardust-mutation40h11-spec-implementation.log`. Paired post-review pending.

Mutation40h11 completed: paired Server post-review accepted with no findings. POST/path, account schema validation → profile verification, per-request broker/controller, no SupabaseAuthService, error propagation and single response are preserved. Assigned target clears CI-09 at 359 vs 360 pre-slice; global conformance remains open.

#### Sublot S2 mutation40h12 — regular signup route

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerSignUpRoute` and helpers/schema private to it. CodeGraph must inspect current source and caller flow before review. Preserve POST `/sign-up`, exact JSON shape `{ email: emailSchema, password: passwordSchema, name: nameSchema }`, validation-before-handler, per-request HonoHttp → SupabaseAuthService → InngestBroker → NodeOnboardingReceiptProvider(ENV.onboardingReceiptSecret) → SignUpController → awaited handle → one sendResponse. Preserve provider arguments/order, error propagation and response. Paired pre-review should approve cohesive schema/handler extraction, no other routes. Fresh complexity must clear method, callback, helpers and reduce root below 359; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation40h12 paired Server pre-review is clear: move the exact signup object to a module-level schema after class and extract callback body to `handleSignUpPath(context: Context)`. Keep POST `/sign-up`, validation before callback, then preserve HonoHttp → SupabaseAuthService(http.getSupabase()) → per-request InngestBroker → SignUpController(service, Broker, NodeOnboardingReceiptProvider(ENV.onboardingReceiptSecret)) → awaited handle → one sendResponse. No generic helper/other route edits. Fresh MI≥65 for method/helper/delegate and root <359 required.

Mutation40h12 Builder source checkpoint: `/sign-up` remains POST and now validates using module-level `signUpSchema` before delegating once to `handleSignUpPath(context)`. Handler preserves HonoHttp → SupabaseAuthService → InngestBroker → SignUpController with NodeOnboardingReceiptProvider → awaited handle → one response send. No other route changed; no checks run.

Mutation40h12 complexity stop: root reports 3,476 files / 9,480 functions / 358 warnings / 0 errors. `registerSignUpRoute` clears MI65, but new `handleSignUpPath` remains MI60.8, so the target gate fails despite root dropping from 359 to 358. Per Builder workflow, stop before Biome/types/tests and request revised paired pre-review for a meaningful route-local boundary; no other route changes. Evidence: `/tmp/stardust-mutation40h12-complexity.log`.

Mutation40h12 correction paired pre-review is clear for one composition-root helper `createSignUpController(http: HonoHttp): SignUpController`. It constructs SupabaseAuthService from `http.getSupabase()`, then InngestBroker, then NodeOnboardingReceiptProvider with the existing ENV secret, and passes them to SignUpController in that order. `handleSignUpPath` retains HonoHttp creation, one factory call per request, awaited handle and single sendResponse. This separates dependency composition from HTTP execution; no other route/schema edits. Both helpers must clear MI65; root must remain <359. If either fails, rollback the experiment and leave the target unresolved; no further scoring subdivisions.

Mutation40h12 correction source checkpoint: `handleSignUpPath` now creates HonoHttp, calls `createSignUpController(http)` once, awaits handle, and sends once. The composition helper constructs SupabaseAuthService, InngestBroker, then NodeOnboardingReceiptProvider and passes them to SignUpController in the approved order. No other changes; fresh complexity is next hard stop.

Mutation40h12 correction complexity stop: root is 3,476 files / 9,481 functions / 358 warnings / 0 errors. `registerSignUpRoute` and `handleSignUpPath` clear, but `createSignUpController` remains MI62.8. Paired pre-review explicitly requires rollback if the factory still warns and prohibits further score subdivisions. Restore the original route implementation and remove only h12 schema/handler/factory; leave this CI-09 target unresolved. No broader sensors run. Evidence: `/tmp/stardust-mutation40h12-correction-complexity.log`.

Mutation40h6 Builder source checkpoint: only the resend-email/sign-up and request-password-reset route registrations changed. Added exact shared `emailOnlySchema`, `registerEmailActionPath`, and `handleEmailActionPath`; distinct controller factories, literal paths, validator-before-handler order, request sequence and single response send remain. No sensors/tests have run; definitions and complexity gate are next.

Mutation40g1–40g3 paired Server post-review accepted locally with no findings. Reviewer confirms PUT/DELETE path/verb, auth → engineer-insignia → ID validation order, PUT body validation afterward, DELETE no body validation, distinct controller calls, same HonoHttp/repository access, thrown errors and single response send. Rename/revoke registrations, delegates and helpers clear MI65; root complexity is 374/0. Rename/Revoke controller unit tests are covered by passing root unit. Residual: no route-level API-key integration test path exists in the canonical Spec; direct route-to-Drizzle coverage remains absent and will be recorded separately. 40g warning target is locally resolved; full Server integration and global conformance remain pending.

Mutation40f1f cleanup paired Server post-review accepted locally. It restores original `fetchAccount` and session projections exactly while keeping unrelated signup nonce/eligibility and SupabaseClient changes. It removes failed experiment-only warnings; CI-09 remains unresolved for the original low-MI AuthService functions. Full candidate readiness remains blocked by the 140 global path-conformance mismatches.

Mutation40f1f path preflight rerun: `check:spec-implementation` still fails with the same 140 global path mismatches (122 Remove / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored), log `/tmp/stardust-mutation40f1f-spec-implementation.log`. The edited AuthService path is contracted; these failures remain global blockers for candidate readiness. Proceed with focused source sensors only to verify the active correction while retaining this blocker.

Mutation40f1f ACH-49: focused Biome on AuthService/ApiKeysRouter failed only on two formatter-required layouts in the restored AuthService: compact the Supabase type import and restore multiline unexpected-error fallback call. `git diff --check` passed. No semantic issue. Root code/types/unit remain pending after the formatter-only correction; update docs and definitions before editing.

ACH-49 correction source checkpoint: applied only the compact Supabase type import and the formatter-requested multiline `fetchAccount` fallback call. Semantics unchanged. Previous Biome/complexity evidence is stale after this formatting edit; definitions, focused Biome, fresh complexity, and root detectors/tests are next.

Mutation40h12 rollback source checkpoint: restored `registerSignUpRoute` to its original inline schema and callback body and removed only h12-only schema/handler/factory. No other accepted AuthRouter slices changed. CI-09 target intentionally remains unresolved; definitions, root detectors/tests, and fresh complexity must rerun after rollback.

Mutation40h12 rollback validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh root complexity is 3,476 files / 9,479 functions / 359 warnings / 0 errors, same as h12 pre-slice. Global Spec implementation remains at 140 path errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h12-rollback-complexity.log`, `/tmp/stardust-mutation40h12-rollback-code.log`, `/tmp/stardust-mutation40h12-rollback-types.log`, `/tmp/stardust-mutation40h12-rollback-unit.log`, `/tmp/stardust-mutation40h12-rollback-spec-implementation.log`. h12 is not accepted; the regular signup CI-09 warning remains unresolved per reviewer stop guidance.

#### Sublot S2 mutation40h13 — AuthRouter route assembly

Path: `apps/server/src/app/hono/routers/auth/AuthRouter.ts`, only `registerRoutes` and any private route-group helpers. CodeGraph must inspect the current complete registration order/call graph before review. Preserve exact one-time route registration order, API-key router construction and mounting position, returned Hono instance, and all route behavior. Paired pre-review must decide whether grouping consecutive route-registration calls into cohesive named groups is meaningful versus mechanical fragmentation. No route method behavior or other path edits. Fresh complexity must clear `registerRoutes` and every helper from MI<65 and reduce root warnings below 359; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation40h13 paired Server pre-review approves exactly three contiguous named registration groups. Keep `const apiKeysRouter = new ApiKeysRouter(this.app)` before groups; `registerAuthenticationEntryRoutes` invokes sign-in, sign-up, sign-out, God sign-in, OAuth sign-in, resend email, refresh session, and request-password-reset registrations in current order. `registerSocialAccountRoutes` invokes social signup, connect Google/GitHub, disconnect GitHub/Google, fetch GitHub/Google connection in current order. `registerAccountLifecycleRoutes` invokes confirm email, confirm password reset, reset password, fetch account, fetch social account, retry user creation in current order. Keep API-key router mount after groups and `return this.router` last. Helpers only invoke these methods once; no conditions/route changes. Fresh MI≥65 for all four methods and root<359 required; stop if gate fails.

Mutation40h13 Builder source checkpoint: `registerRoutes` now calls the three approved group helpers in auth → social → lifecycle order. Each helper calls its exact contiguous existing registration sequence once. API-key router construction remains first, mount remains after all groups, return remains last. No route bodies changed; no checks run.

Mutation40h13 complexity stop: root is 3,476 files / 9,482 functions / 359 warnings / 0 errors. `registerSocialAccountRoutes`, `registerAccountLifecycleRoutes`, and `registerRoutes` clear, but `registerAuthenticationEntryRoutes` remains MI63.4 and warns; aggregate is unchanged from 359. Paired pre-review says stop rather than subdivide further. Roll back the entire h13 grouping and leave the orchestrator warning unresolved; no broader checks until rollback.

Mutation40h13 rollback source checkpoint: removed only the three h13 group helpers and restored `registerRoutes` to the original direct 22-call sequence. API-key construction remains first, mount remains after route calls, return remains last. Other accepted route edits are unchanged. h13 target remains unresolved; rerun definitions and required checks/complexity.

Mutation40h13 rollback validation checkpoint: Spec/Plan definitions, focused Biome, root `check:code`, `check:types`, and `test:unit` pass (Server 169 suites / 330 tests). Fresh complexity confirms 3,476 files / 9,479 functions / 359 warnings / 0 errors, restored to pre-slice count. Global Spec implementation remains 140 errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h13-rollback-complexity.log`, `/tmp/stardust-mutation40h13-rollback-code.log`, `/tmp/stardust-mutation40h13-rollback-types.log`, `/tmp/stardust-mutation40h13-rollback-unit.log`, `/tmp/stardust-mutation40h13-rollback-spec-implementation.log`. h13 unresolved per paired pre-review.

### Assignment S2 mutation41 — remaining Server CI-09 warning groups

Root complexity after accepted AuthRouter slices and h12/h13 rollbacks is 359 warnings / 0 errors. Inventory is broad: largest current file groups include UsersRouter (36 function findings), ChallengesRouter (33), SupabaseAuthService (18), FeedbackRouter (17), PlanetsRouter/AchievementsRouter/CommentsRouter (16 each). Continue with small route-family slices and paired pre-review/post-review; no broad multi-file edits or mechanical extraction.

#### Sublot S2 mutation41a — username/email availability routes

Path: `apps/server/src/app/hono/routers/profile/UsersRouter.ts`, only `registerVerifyUserNameInUseRoute` and `registerVerifyUserEmailInUseRoute` plus helpers private to this pair. CodeGraph and paired pre-review must inspect current route/middleware/query semantics before implementation. Preserve exact methods/paths, validators and ordering, distinct controllers/use cases, request/service construction, thrown errors and single response send. Shared schema/registration/handler only if the Reviewer finds the boundary cohesive. No other route or path changes. Fresh complexity must clear all affected/new functions and reduce root warning count below 359; otherwise stop/review. Status `in_progress`, awaiting paired pre-review.

Mutation41a paired Server pre-review is clear. Keep the two route methods as thin delegates to one `registerVerifyUserInUseRoute(path, exactQuerySchema, controllerFactory)` using exact paths `/verify-name-in-use` and `/verify-email-in-use`, schemas `{name:nameSchema}` and `{email:emailSchema}`, and distinct VerifyUserName/VerifyUserEmail controller factories. Shared helper keeps GET/query validation before callback; shared handler constructs HonoHttp then DrizzleUsersRepository(http.getDatabase(), http.getDatabaseAccess()) in the same order, invokes factory per request, awaits once, sends once. No auth middleware, normalization, catches, or other route changes. Every wrapper/helper/callback must clear MI65 and root must fall below 359; otherwise stop without further splitting.

Mutation41a Builder source checkpoint: username/email availability routes now use the shared registration helper with exact paths/schemas and distinct controller factories. Validation remains before callback; shared handler preserves per-request HonoHttp → DrizzleUsersRepository(database, access) → factory → awaited handle → single sendResponse. No other route changes; no checks run.

Mutation41a complexity stop: root reports 3,476 files / 9,482 functions / 356 warnings / 0 errors, down three from 359. Route wrappers/shared registration clear, but new `handleVerifyUserInUseRoute` remains MI63.2 and warns. Per workflow, stop before Biome/types/tests and request paired pre-review reassessment for this route-local handler; no further source edits until approval. Evidence: `/tmp/stardust-mutation41a-complexity.log`.

Mutation41a rollback checkpoint: restored `registerVerifyUserNameInUseRoute` and `registerVerifyUserEmailInUseRoute` to their pre-41a inline implementations, retaining the surrounding Drizzle migration. Paired review found no meaningful sub-boundary that would make the shared handler smaller while preserving the exact route-specific construction and response flow; further mechanical splits were rejected. The 41a helpers and `Context` import are removed. Only those two route implementations were rolled back; no other UsersRouter work was reverted. Fresh definition checks and root complexity are pending.

#### Sublot S2 mutation42a — ID/slug challenge fetch routes

Mutation42a Builder source checkpoint: only the ID and slug fetch registrations in `ChallengesRouter.ts` now delegate through `registerFetchChallengeRoute(path, exactParamSchema)` to a shared `handleFetchChallengeRoute(context)`. GET paths and route-specific parameter schemas remain exact; validation still precedes the unauthenticated handler, which preserves per-request HonoHttp → DrizzleChallengesRepository(database, access) → FetchChallengeController → awaited handle → single sendResponse. No other route changed. Plan/Spec definition checks and the fresh root complexity stop gate are next.

Mutation42a rollback checkpoint: restored the ID and slug fetch routes to their pre-42a inline implementations, retaining DrizzleChallengesRepository construction and all unrelated ChallengesRouter migration changes. Paired pre-review rejected further splitting because no meaningful sub-boundary exists; additional mechanical helpers are not approved. Removed only the shared registration/handler helpers and `Context` import. Fresh Plan/Spec definition checks and root complexity are pending.

#### Sublot S2 mutation43a — Hono response mapping

Mutation43a Builder source checkpoint: `HonoHttp.sendResponse` now delegates header policy to `propagateResponseHeaders` and body selection to `mapResponseBody`. The passthrough early return, ordered header enumeration/filtering, status-before-body sequencing, failure JSON, no-content JSON and successful `body ?? {}` are preserved. No other methods/files changed. Plan/Spec definitions and root complexity are next.

Mutation43a rollback checkpoint: restored the original inline `sendResponse` and removed only `propagateResponseHeaders` and `mapResponseBody`. Paired review rejected the decomposition because all three resulting functions remained below MI65 and root warnings increased; no further subdivisions are approved. Other HonoHttp changes remain untouched. Fresh Plan/Spec definitions and root complexity are pending.

#### Sublot S2 mutation44a — social OAuth URL response mapping

Mutation44a Builder source checkpoint: `signInWithGoogleAccount`, `signInWithGithubAccount`, `connectGithubAccount`, and `connectGoogleAccount` now pass their existing SDK operations and exact Portuguese fallback messages to one `mapSocialSignInUrlResponse` helper. Provider, SDK method, `returnUrl.value`, operation order, error mapping, and `{ signInUrl: data.url }` success body are preserved. No other service method/file changed. Plan/Spec definition checks and root complexity are next.

Mutation44a correction checkpoint: after the first wrappers remained MI64.1, one approved cohesive helper now owns the full social redirect request and response mapping. It accepts provider, return URL, intent, and exact fallback message; selects the same OAuth/linkIdentity call and maps errors/success identically. Four public methods are concise delegates. No second helper or unrelated service edits. Definitions and root complexity are next.

Mutation44a rollback checkpoint: restored the four OAuth/account-link methods to their pre-44a implementations and removed `mapSocialSignInUrlResponse`, preserving unrelated `SupabaseAuthService` edits. The approved correction still left the shared helper at MI60; per reviewer stop rule, all 44a changes are rolled back with no further helper subdivision. Fresh Plan/Spec definitions and root complexity are pending.

#### Sublot S2 mutation45a — AppError status policy

Mutation45a Builder source checkpoint: `respondToAppError` now finds the first matching class in an ordered status policy declared after `HonoApp`. The class precedence and HTTP status constants remain exact; logging, response `{title, message}`, fallback 500, and single JSON response are unchanged. No other method/file changed. Plan/Spec definitions and root complexity are next.

Mutation45a rollback checkpoint: restored `respondToAppError` to its original ordered inline branches and removed `APP_ERROR_STATUS_POLICY`, preserving unrelated HonoApp migration edits. The assigned method remained MI58.2 and root warnings did not fall below 359; per gate, the policy extraction is rolled back with no further splitting. Fresh Plan/Spec definitions and root complexity are pending.

#### Sublot S2 mutation46a — node server port retry

Mutation46a Builder source checkpoint: `startNodeServer` now directly awaits `listenOnPort` inside the existing attempt loop and catches startup failures inline. Port sequence, same-error rethrow condition, development-only EADDRINUSE warning, immediate success return and final max-attempt error are preserved. `listenOnPort` and other methods are unchanged. Plan/Spec definitions and root complexity are next.

Mutation46a rollback checkpoint: restored the original `listenOnPort(...).then(fulfilled, rejected)` flow in `startNodeServer`; all unrelated HonoApp changes remain. Paired gate failed because the method remained MI53.6 with nestingDepth 4 and root remained at 359 warnings. Roll back without further splitting; definitions and root complexity are pending.

#### Assignment S2-47a — real profile-event authorization and identity

Builder Server stable; Spec revision 10; base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Ownership is exclusively `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` (existing S2 path). RF-06/RF-07/RF-09; CA-10/CA-11/CA-13/CA-18/CA-19/CA-20/CA-22; EV-06/EV-09. Rules: `server-routes-testing-rules.md`, `database-rules.md`, `code-conventions-rules.md`, `server-application-rules.md`. No design/UI contract. Preserve a real Hono request, actual onboarding middleware, Drizzle/PostgreSQL, Supabase local Auth and signed receipts; do not mock the repository or authorization/domain services. Add route cases proving the persisted profile event belongs to the receipt/bearer identity, a different account is not disclosed, absent/tampered/expired receipts deny access, and a present invalid/expired/forged bearer does not fall back to a valid receipt. Keep tokens/receipts out of logs and artifacts. No source, fixtures, schema, other tests, or docs may be changed by the Builder. Exit: focused Biome and serial real-DB route suite pass; paired Implementation Reviewer accepts the exact diff; principal records current sensor evidence and reruns conformance/sensors invalidated by the change. This task alone does not close EV-06 or S2; remaining lifecycle, port/actor evidence crosswalk, consolidated review and coverage exits stay open. Status `in_progress`; no source change has been made under this assignment yet.

S2-47a validation checkpoint: fresh `npm run db:test -w @stardust/server` passed; focused Biome format/check passed; the exact real-DB integration suite passed 1/1 suite and 12/12 tests. The suite includes receipt-bound account A, B-account non-disclosure, persisted four-field `user.created` payload/event id, bearer A overriding valid receipt B, three receipt denials and three present-invalid-bearer denials; original four lifecycle tests remain. Evidence logs: `/tmp/stardust-s2-47a-db-test.log`, `/tmp/stardust-s2-47a-stream-route.log`. A forged JWT with an expired `exp` proves bearer precedence/no fallback but does not isolate a genuine Auth-signed expired JWT. Independent diff inspection and paired review remain pending; assignment stays `in_progress`.

S2-47a conformance preflight: `check:spec-implementation` reran against base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` and remains failed with the known 140 broad Contract path mismatches (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the S2-47a path itself is not reported. The one-file paired review is in progress. Root code/types/unit/integrity/architecture and coverage are still pending for this updated candidate; do not mark the task verified.

S2-47a paired-review finding IR-01: **failed**. The scoped Reviewer confirms the real Auth/DB assertions and 12/12 route tests but finds all HTTP requests use `fixture.hono.fetch`, while `server-routes-testing-rules.md` section 13 requires `supertest` over `honoFixture.server`. No Rule exception exists. CA-22 failed for this slice. Review also notes CA-11/18 are partial and CA-19/20 are outside this bounded task; these remain broader S2 exits. Assign correction S2-47a-F1 to the same stable Builder Server, same sole test path. Move ordinary successful/denial HTTP assertions to Supertest; retain direct Fetch only for cases whose observable contract requires a controllable response reader/AbortSignal or process shutdown. Do not change the Rule or widen the assignment. Preserve existing tests and no-secret discipline. Re-run Biome and the exact route integration suite; obtain a new paired review. Status `in_progress`, source correction not yet made.

S2-47a integrated sensors found ACH-50: root `check:types` fails only in the assigned new test at lines 107 and 110 because the `receipt` helper inferred `randomUUID()`'s UUID template-literal type while `AuthFixture.getAccountId()` returns `string`. Root `check:code` passed; root `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Both IR-01 and ACH-50 are included in S2-47a-F1; no unrelated correction is authorized. `check:types` is invalid until the helper accepts the actual account-id type, and must be rerun after correction.

S2-47a-F1 validation checkpoint: focused Biome format/check passed; fresh local `db:test` passed; exact serial integration passed 1 suite / 12 tests in 12.19s, no open-handle warning. Logs: `/tmp/stardust-s2-47a-f1-db.log`, `/tmp/stardust-s2-47a-f1-route.log`. Supertest now covers ordinary identity/event, denial and final-header HTTP cases; live Fetch remains for backpressure/abort/shutdown. The auth-signed expired-bearer isolation limitation is unchanged. New paired review and root code/types/unit plus S2 crosswalk remain pending; assignment stays `in_progress`.

S2-47a-F1 conformance preflight rerun after the correction: `check:spec-implementation` remains failed with the existing 140 contracted-path mismatches (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the assigned path is not among them. This is still a broad W2/D3 candidate blocker, not an S2-47a failure. Fresh root code/types/unit and the paired review are pending.

S2-47a-F1 paired review: **accepted**, no blocking findings. Reviewer confirms Supertest for ordinary HTTP cases and that direct Fetch is limited to live reader/abort/shutdown control. Reviewer marks this slice's CA-10/CA-22 passed; CA-11/CA-13/CA-18/CA-19/EV-06 remain partial and CA-20 is outside this slice. The forged expired-claim bearer remains a nonblocking limitation. Root `check:code` and `check:test-integrity` passed; `check:types`, `test:unit`, and `check:architecture` are currently running, so this bounded task remains `in_progress` until their results are recorded.

S2-47a-F1 root-sensor closeout: `check:code` passed across 7 workspaces; `check:types` passed 7/7; `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1); `check:test-integrity` passed (59 changed test files, 31 testable source files, 223 excluded); `check:architecture` passed (3,874 modules / 6,988 dependencies). Definitions and diff check passed after ledger updates. Paired review remains accepted for the one-file slice. S2-47a-F1 is `verified`; the larger S2 phase remains `in_progress` for missing EV-06 lifecycle coverage, EV-01/02 port/actor crosswalk, consolidated Server review and combined coverage.

#### Assignment S2-47b — real profile-stream poll serialization

Builder Server stable; Spec revision 10; base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Ownership exclusively `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; this is a separate, bounded task on the same contracted path after accepted S2-47a-F1. RF-06/RF-09; CA-10/CA-11/CA-18/CA-19/CA-22; EV-06. Rules `server-routes-testing-rules.md`, `database-rules.md`, `code-conventions-rules.md`, `server-application-rules.md`. Add one real Hono/Auth/Drizzle/PostgreSQL scenario proving a profile lookup blocked on an actual `users` table lock for longer than the 1s interval is not overlapped by another lookup; after releasing the lock, permit the route to observe a real persisted profile and emit exactly one terminal `user.created` event. Preserve deterministic cleanup/release even on assertion failure. Supertest for ordinary finite HTTP behavior; direct stream reader only for the lifecycle assertion. No repository/service mocks, other paths, or Rule changes. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, paired Implementation Reviewer, then principal root sensors/conformance and ledger update. This does not alone prove the complete heartbeat/60s/error/reconnect matrix or close S2. Status `in_progress`; no S2-47b source change yet.

S2-47b source checkpoint: Builder Server added one real-route lifecycle case in the assigned test file. It creates a real Auth identity/profile, holds an actual `ACCESS EXCLUSIVE` users-table lock while the stream's SELECT is pending, waits 1.2s plus 200ms, asserts one blocked SELECT and stable backend PID, then releases the lock and expects exactly one `user.created` frame with the persisted four-field payload and stream completion. Nested `finally` blocks release the database lock, abort/cancel the stream and release the reader. Focused Biome passed. Fresh `db:test` is running; exact route suite and review are pending. No other path changed.

S2-47b validation checkpoint: focused Biome format/check passed; fresh local `db:test` passed; exact serialized integration passed 1 suite / 13 tests in 13.569s, with the new lock/poll case completing in 1.791s and no open-handle warning. Logs: `/tmp/stardust-s2-47b-db.log`, `/tmp/stardust-s2-47b-route.log`. Existing 12 S2-47a tests remain. Paired review and fresh root path conformance/sensors are pending; no full EV-06/S2 closure is claimed.

S2-47b conformance preflight: reran `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; unchanged failure remains at 140 Contract mismatches (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored). The SSE test path is not listed. This gate remains a broad candidate blocker; fresh root sensors and paired review for S2-47b are pending.

S2-47b paired review: **accepted**, no blocking findings for this slice. The Reviewer confirms the real table lock holds the SELECT, observes one waiter and stable PID beyond 1s, then one persisted-profile event and EOF; Supertest/real Auth/DB rules and cleanup are acceptable. CA-11 passed for this scenario; CA-10/18/19 remain partial broader criteria; CA-22 passed for this slice. Root `check:code`, `check:test-integrity`, and `check:architecture` passed; root `check:types` and `test:unit` are still running. S2-47b remains `in_progress` pending those current integrated results.

S2-47b integrated sensors found ACH-51: root `check:types` fails only in the new assigned route test at line203 because `ReadableStreamReadResult` is not in this TypeScript environment. Root `check:code`, `check:test-integrity`, and `check:architecture` passed; root `test:unit` is still running. The type failure is included in S2-47b-F1 for the same path only; root type evidence is invalid until corrected and rerun. The initial paired review is otherwise accepted but must be repeated after the source correction.

#### Builder Fix S2-47b-F1 — ACH-51

Same stable Builder Server; same Spec revision/base and only path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. Correct the invalid `ReadableStreamReadResult` annotation using an available/inferred type without changing the S2-47b behavior or lock/stream cleanup. No other path, Rule, Plan, or test-scope change. Exits: focused Biome and exact serialized route integration; rerun root `check:types`; paired read-only reviewer for the correction. Status `in_progress`.

S2-47b root sensors before ACH-51 correction: `check:code` passed (7 workspaces), `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,874 modules / 6,988 dependencies). Only `check:types` failed on ACH-51 in the assigned new test. These results are before the forthcoming annotation fix; rerun invalidated checks afterward.

S2-47b-F1 source checkpoint: ACH-51 correction changes only the assigned test's `terminal` annotation to `ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']> | undefined`; test behavior and lock/stream cleanup are unchanged. Focused Biome passed, fresh local `db:test` passed (`/tmp/stardust-s2-47b-f1-db.log`), and the exact serialized route suite is running (`/tmp/stardust-s2-47b-f1-route.log`). The S2-47b review is invalidated by this type-only edit; a fresh paired review and root `check:types` are required.

S2-47b-F1 validation completed: focused Biome format/check passed; fresh local `db:test` passed; exact serialized route integration passed 1 suite / 13 tests in 16.482s with no open-handle warning. Logs: `/tmp/stardust-s2-47b-f1-db.log`, `/tmp/stardust-s2-47b-f1-route.log`. The test-only annotation correction leaves the tested behavior unchanged. The S2-47b review is invalidated; fresh paired review and principal root sensors/conformance are pending. Task remains `in_progress`.

S2-47b-F1 conformance preflight after ACH-51: reran `check:spec-implementation` against base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; it remains failed with the same 140 Contract path errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored). The SSE test path is not reported. No new conformance regression is attributable to the correction. Fresh root sensors and re-review are next.

S2-47b-F1 paired review: **accepted**, no blocking findings. Reviewer confirms ACH-51 is resolved by the available reader return type and no behavior/cleanup changes. Focused Biome, fresh local DB, and the 13/13 real route suite passed. Root `check:code`, test-integrity, and architecture passed; root `check:types` and `test:unit` are still running, so this correction remains `in_progress` pending those results.

S2-47b-F1 root typecheck passed: `npm run check:types` succeeded in all 7 workspaces, resolving ACH-51. Root `test:unit` remains in progress; code/integrity/architecture and reviewer acceptance already pass.

S2-47b-F1 closeout: fresh root `check:types` passed (7/7), and `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Together with root `check:code`, `check:test-integrity`, `check:architecture`, the accepted paired review, fresh local DB/13-test integration, focused Biome, and current path preflight (known 140 global errors), the type-fix task is verified. S2-47b itself is verified. The full S2 phase stays `in_progress`; remaining EV-06 and EV-01/02 evidence, consolidated review and ACH-35 remain open.

#### Assignment S2-47c — profile appears while SSE connection is open

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Exclusive path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`, a new bounded task after verified S2-47b. RF-06/RF-09; CA-10/CA-11/CA-18/CA-19/CA-22; EV-06. Add one local runtime integration case using a real Supabase Auth account and signed receipt for its account id, with no `users` row at initial stream connection. Coordinate against the real PostgreSQL query so the test establishes the first lookup observes absence before creating that account's profile through `ProfileFixture`. Read the open SSE connection until it emits exactly one `user.created` event whose id/body match the newly persisted profile, then EOF; prove no foreign account data is included. Use a live reader only because the route remains open until the profile appears; all ordinary request cases already use Supertest. No mocks, timer monkey-patching, other paths, or contract/rule changes. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, paired Implementation Reviewer, principal root sensors and conformance. This does not close heartbeat/deadline/error/reconnect/full EV-06 or aggregate S2. Test source and scoped ACH-52 correction are present; `db:test` and the 14-test route suite pass after Docker restoration. The paired Reviewer accepted the bounded correction and route scenario. Status `verified`; broader EV-06/S2 remains `in_progress`.

S2-47c source/checkpoint: Builder Server added one test in the assigned route file. It uses real Auth A/B and persisted foreign profile, locks the real initial A SELECT, captures its PID, releases the lock and waits until the query is idle, confirms A's profile is absent/no event emitted, then creates A's profile through `ProfileFixture` and expects one matching own-profile event, EOF and no B data; cleanup aborts/cancels the reader and releases locks in `finally`. Focused Biome passed. Local `db:test` preparation failed before integration with exit 127, `sh: docker: not found` (`/tmp/stardust-s2-47c-db.log`); the route suite has not run and no runtime result is claimed. Investigate local Docker executable availability/PATH, then rerun local DB preparation and exact suite. S2-47c remains `in_progress`, review pending.

S2-47c environment diagnosis: local Docker is unavailable, not merely missing from the Builder PATH. `/usr/bin/docker` is a dangling symlink to `/mnt/wsl/docker-desktop/cli-tools/usr/bin/docker`, whose target is absent; no `/var/run/docker.sock`, alternate `podman`/`nerdctl`/`docker-compose` executable, or matching CLI was found. `db:test` therefore cannot prepare Supabase local and the route integration cannot run in this environment until the local Docker Desktop/WSL runtime is restored. Continue non-runtime source/type/unit checks and keep S2-47c unverified; do not use remote Supabase as substitute.

S2-47c path preflight: `check:spec-implementation` rerun against the frozen base remains failed at the known 140 contracted paths (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the assigned SSE test path is not listed. No conformance pass is claimed. Root code/types/unit/integrity/architecture checks now need refreshing for S2-47c; only the local integration precondition is unavailable.

S2-47c non-runtime sensor checkpoint: root `check:code` passed (7 workspaces); `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1); `check:test-integrity` passed; `check:architecture` passed (3,874 modules / 6,988 dependencies). Root `check:types` found ACH-52 only in the new assigned test at line300: a SQL parameter inferred as `number | undefined` does not satisfy postgres.js's non-optional parameter overload. The check is blocked until corrected and rerun. The local Docker outage independently blocks `db:test` and real route execution; do not conflate this compile issue with integration evidence.

#### Builder Fix S2-47c-F1 — ACH-52

Same stable Builder Server, sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. Correct the SQL query's parameter typing/narrowing without weakening the one-waiter/PID assertion or changing runtime behavior. Keep all cleanup and actor/identity semantics. No other path, mocks, Rule or Plan edits. Exits: focused Biome; root types; exact real DB route test only after Docker runtime is restored; fresh paired review. Focused Biome, root types, real local route integration and fresh paired review are accepted; this bounded correction is `verified`.

S2-47c-F1 source checkpoint: the Builder added an explicit guard that throws if `lookupPid` remains undefined before it is interpolated into the PostgreSQL query. This narrows the existing captured PID without a cast, default PID or weakened assertion; the exact test logic and cleanup remain unchanged. Only the assigned test path changed. The final focused Biome check passed (one file, no issues); the first check found a formatter-only line-wrap request, which was corrected. Root types and fresh paired review are pending. Local Docker remains unavailable, so no DB or route integration command was run; S2-47c remains runtime-unverified.

S2-47c-F1 integrated checkpoint: fresh root `check:types` passed across 7 workspaces; root `check:code` passed across 7 workspaces with the existing baseline warning set; `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1); test-integrity passed; architecture passed (3,874 modules / 6,988 dependencies); Plan definition and `git diff --check` passed. The fresh paired Implementation Reviewer accepted ACH-52 with no blocking finding. Current spec path conformance remains failed with 140 known path errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated paths ignored), and the SSE test path is not named. These sensors were followed by fresh local DB preparation and 14/14 route integration tests; the Reviewer reconciled and accepted the runtime evidence. S2-47c-F1 and S2-47c are verified for this assigned slice. The broader EV-06 lifecycle matrix and aggregate S2 remain open.

#### Assignment S2-47d — real heartbeat while profile is absent

Same stable Builder Server, Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; exclusive path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`, sequenced after verified S2-47c on the same test file. RF-09; CA-18/CA-22; EV-06. Add one real local Hono/Auth/Drizzle/PostgreSQL route case using a real Auth account with no profile and a valid signed receipt. Hold a live stream reader until it receives the initial `retry:1000` frame and then the real 15-second `: heartbeat\n\n` comment; do not fake/advance timers. Assert no `user.created` event, then abort the same request and ensure the reader closes and the stream’s shutdown listeners are removed. Direct Fetch is limited to this live reader/abort control; ordinary finite HTTP cases remain Supertest. No production changes, repository mocks, timer monkey-patching, other paths, or Rule changes. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, paired Implementation Reviewer, root `check:code`, `check:types`, `test:unit`, `check:test-integrity`, `check:architecture`, and current path conformance; this single case does not establish the 60-second cap, post-header DB failure, or reconnect matrix. Status `in_progress`.

S2-47d source/runtime checkpoint: Builder added one real Auth/PostgreSQL case for an account without a profile. It reads the initial retry frame, awaits the real-clock heartbeat, confirms no terminal event/profile appeared, aborts the pending stream, and verifies reader completion and SIGTERM listener cleanup in `finally`. Only the assigned test path changed; ordinary HTTP cases and Supertest use remain unchanged. Focused Biome passed; fresh exported-local-env `db:test` passed (`/tmp/stardust-s2-47d-db.log`); the exact serialized route suite passed 1 suite / 15 tests in 29.208s (`/tmp/stardust-s2-47d-route.log`). The heartbeat took 15.484s on the real clock. Principal source inspection, root sensors, current path conformance, and paired Implementation Reviewer are pending. Full 60-second/error/reconnect coverage is not claimed.

S2-47d checkpoint: principal focused Biome; root `check:code`, `check:types` (7 workspaces), `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity`, and `check:architecture` (3,874 modules / 6,988 dependencies) passed. Global path conformance remains failed at 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated paths ignored); assigned SSE test path is absent. The paired Reviewer initially accepted the real-heartbeat-and-abort scenario. A later exact-suite rerun for S2-47e observed 13,999ms against S2-47d's 14,000ms minimum; IR-02 finds the timer starts before response/initial-frame receipt, so the assertion used the wrong measurement origin. S2-47d is reopened pending the bounded timing-origin correction and fresh exact-suite run; its earlier green result is not stable evidence.

#### Assignment S2-47e — assert expiry terminal frame under backpressure

Same stable Builder Server, Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; exclusive path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`, sequenced after verified S2-47d. RF-09; CA-18/CA-22; EV-06. Modify only the existing real local route test `expires and removes shutdown listeners even when its reader applies backpressure`: after its valid signed receipt expires, assert the buffered SSE contains exactly one `onboarding.expired` terminal event, no `user.created` or heartbeat, EOF, and the relevant shutdown listeners are removed. Keep the real short receipt expiry and actual route/Auth/Drizzle/PostgreSQL; no fake timers, mocks, or source changes. Preserve deterministic cleanup. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, paired Implementation Reviewer, root checks, and path conformance; this does not prove the independent 60-second maximum, post-header DB error, or reconnect matrix. Status `in_progress`.

S2-47e source checkpoint: Builder changed only the assigned existing expiry/backpressure case. It uses the real Auth account and signed short-lived receipt, allows expiry while the response is unread, confirms listener cleanup, then drains and asserts exactly one `onboarding.expired`, no `user.created`/heartbeat, and EOF; existing `finally` abort/cancel/release cleanup remains. Focused Biome and fresh local `db:test` passed (`/tmp/stardust-s2-47e-db.log`). Exact serialized route suite is still running (`/tmp/stardust-s2-47e-route.log`); no integration result, review, or root sensors are claimed yet.

S2-47e paired review: **failed** with two blocking findings. IR-01: the test left the initial `retry:1000` chunk unread for 2.3s, keeping the SSE writer backpressured so the terminal event could not flush before the 100ms forced close. The approved test-only correction is to consume the initial frame, leave the live reader idle for expiry, and then read terminal/EOF. No production change is authorized. IR-02: S2-47d measured heartbeat time only after receiving the initial frame, although the timer starts earlier; capture monotonic start before opening the request and measure through heartbeat receipt. Rule disposition: No change; live stream reader is permitted by server route testing rules. The failed 13/15 route run invalidates S2-47d's stable-suite evidence.

#### Builder Fix S2-47e-F1 — IR-01 and IR-02

Same stable Builder Server and only `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. Correct IR-01 by consuming the retry frame before waiting for expiry, leaving the reader idle (not holding the initial frame under backpressure), then asserting one terminal `onboarding.expired`, no created/heartbeat frames, EOF and listener cleanup. Correct IR-02 by capturing a monotonic timestamp before opening the request and measuring through receipt of the heartbeat; keep the 14s tolerance and exact heartbeat comment, without weakening the assertion. No production source, mocks, fake timers, other test behavior, or other paths. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, fresh paired Reviewer, root checks and path conformance. Status `in_progress`.

S2-47e-F1 source checkpoint: Builder updated only the assigned test file. The heartbeat now measures with `performance.now()` from before request opening through exact heartbeat receipt, retaining the 14s tolerance. The expiry test consumes the initial retry frame, leaves its live reader idle through the short real receipt expiry, then drains the terminal frame/EOF; cleanup remains unchanged. Focused Biome and fresh local `db:test` passed (`/tmp/stardust-s2-47e-f1-db.log`). The exact serialized route suite is still running (`/tmp/stardust-s2-47e-f1-route.log`); no integration result or review acceptance is claimed.

S2-47e-F1 integration result: the exact suite failed 14/15 in 29.214s (`/tmp/stardust-s2-47e-f1-route.log`). The heartbeat correction passed at 15.302s; the expiry case still received no `onboarding.expired` event after consuming retry and leaving the reader idle for 2.3s through expiry. Fresh `db:test` and focused Biome passed. No further edits were made. The paired Reviewer is investigating whether the terminal-frame assertion exceeds the Spec or reveals a stream implementation issue; no production change or assertion relaxation is authorized until that review.

S2-47e-F1 paired Implementation Reviewer verdict: **failed**. IR-01 remains blocking because the Spec contract (line306) explicitly requires `onboarding.expired` with `{}` and stream close, but the event is still missing with a live reader after consuming retry. The Reviewer traces the race to `expire()` launching an unawaited `writeSSE`, waking the poll loop, and Hono's `streamSSE` wrapper closing its writer when the route callback returns. IR-02 is corrected: monotonic timing begins before request open; real heartbeat passed at 15.302s. Rule disposition: No change. Proposed production correction requires the stream callback to await terminal-expiry write completion and the expiry timer to reschedule if invoked before deadline due to timer precision; retain bounded forced close. Exact suite remains 14/15, so S2-47d's whole-suite evidence remains reopened.

#### Builder Fix S2-47e-F2 — contractual expiry frame lifecycle race

Stable Builder Server; exclusive paths `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` and `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. RF-09; CA-18/CA-22; EV-06. Paired pre-review approved with refinements: in `expire`, check whether `Date.now() < lifecycle.deadline` before stopping; if early, re-arm for remaining duration and preserve the distinct 60s-cap close without an expired-receipt frame. When receipt expiry is due, publish a completion promise for `stream.writeSSE({event:'onboarding.expired',data:'{}'})` before waking the poll loop; have `runProfileCreationStream` await that promise before returning so Hono cannot close first. Keep the 100ms force-close so a stalled write settles, cleanup/listener removal, query/timer cancellation, abort/shutdown behavior and existing event identity. The route test asserts one `onboarding.expired` with data `{}`, no `user.created`/heartbeat and EOF; initial retry remains consumed before the idle expiry wait. No new API, fake timers, unrelated source or other test paths. Exits: focused Biome, local `db:test`, exact serialized route suite, root code/types/unit/integrity/architecture, complexity sensor for source edit, path conformance and paired post-review. Status `in_progress`, pre-review clear; Builder ACK and definitions gate remain before edits.

S2-47e-F2 source/runtime checkpoint: Builder changed only the two assigned paths. The source re-arms an early deadline timer before stopping; distinguishes the valid-credential 60s-cap close; stores expiry write completion before stopping/waking poll; and awaits that completion before the route callback returns, retaining the 100ms force-close. The route assertion now also verifies expiry event data `{}`. Focused Biome and fresh local `db:test` passed (`/tmp/stardust-s2-47e-f2-db.log`); exact serialized route suite passed 1 suite / 15 tests in 28.814s (`/tmp/stardust-s2-47e-f2-route.log`). Expiry emitted exactly one event with `{}` then EOF; heartbeat passed at 14.145s; polling, profile-created, abort and shutdown cases passed. Principal source inspection, root sensors, complexity, current path conformance and paired post-review remain pending. No full 60s-cap evidence is claimed.

#### Read-only EV-01/EV-02 port and actor crosswalk — 2026-10-05

Builder Server mapped all 25 persistence ports against the current 82-suite/267-test evidence and focused SSE suites; no files/tests were changed during this audit. Existing proof is substantial for Reporting/Feedback (A/B/God, status/read markers, rollback/events/attachments), Users (own/alheio, public availability, God reports, forged JWT denial), shop catalogue CRUD/God denial, Achievements, Space common create/read, Comments public/write/read, and persisted API-key auth through MCP. This evidence does not automatically prove every method of those ports.

Direct consumer/runtime proof remains absent or incomplete for private Chats/ChatMessages, Notes and Snippets; Questions/Stories/Guides; ChallengeSources and Solutions operations; actual TextBlocks audio JSON concurrency and System-job persistence; Rankers/Tiers job-driven mutations/readback; successful user acquisitions for Avatars/Insignias/Rockets; several ChallengeCodeExecution/Challenge CRUD and B-isolation cases; and selected Planet/Star mutation/status guards. API-key evidence currently covers the persisted auth/rate-limit boundary, not the full toolkit CRUD matrix. System jobs are represented by assembly/unit tests, not real Drizzle persistence. Public, A/B, God, API-key and forged-JWT evidence is boundary-specific, not a Cartesian guarantee for every port. Next new route-test assignments should be chosen only after crosswalking the exact current route/use case and actor contract to avoid inventing ownership semantics; prioritize private Chats/Notes/Snippets and TextBlocks concurrency. Audit details returned by Builder Server; no tests were run under this read-only task.

S2-47e-F2 paired post-review: **failed** with blocking IR-01. A profile poll that resolves at or after the deadline can reach `runProfileCreationStream.finally` before the timer callback; `stop()` clears the timer while `expiryWrite` remains unset, so the contractual terminal expiry frame can still be skipped. Root sensors on F2: `check:code`, `check:types`, `test:unit`, `check:test-integrity`, and `check:architecture` passed; `check:complexity` failed because the stream helper now has 8 warnings versus the unchanged baseline 7, introduced by the Promise executor in `writeExpiry`. The known global path conformance check remains exit1 with 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned paths are absent. F2 is not accepted.

#### Builder Fix S2-47e-F3 — deadline finalizer race and complexity regression

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Exclusive paths: `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` and `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. RF-09; CA-18/CA-22; EV-06. Before source edits, obtain paired pre-review of the intended state machine/test. Route timer and poll completion through one idempotent deadline finalizer. If the real receipt deadline has elapsed, establish and await exactly one expiry terminal write before callback completion even when the poll wins the timer race; do not emit expiry for profile-created, request abort, shutdown, or the valid-credential 60-second cap. Preserve early-timer rearm and bounded 100ms force-close. Remove the new complexity warning in the assigned helper without baseline/threshold changes. Add a real local PostgreSQL test that keeps the initial profile SELECT pending across a short signed-receipt expiry, releases it, and observes exactly one `onboarding.expired` `{}` then EOF, with no `user.created` or heartbeat and deterministic cleanup. No fake timers, mocks, other paths, or contract/rule changes. Exits: Plan/Spec definition checks, focused Biome, fresh local `db:test`, exact serial route suite, paired post-review, root sensors including complexity, conformance rerun, and principal diff inspection. Does not close full 60-second/error/reconnect or aggregate S2. Status `in_progress`; paired pre-review accepted with refinements; Builder ACK pending.

S2-47e-F3 paired pre-review: **approved with refinements**. The Reviewer confirms the timer/poll completion race and requires a shared idempotent deadline finalizer that records terminal outcome and publishes completion before waking the poll. Record `user.created` as terminal before awaiting its write to prevent a second terminal event. Preserve early-timer rearm, receipt-expiry vs valid-credential 60-second-cap behavior, abort/shutdown, and 100ms force-close that settles a stalled expiry write. Avoid anonymous Promise executor to remove the added complexity warning. The real PostgreSQL lock test must keep the reader able to receive the expiry frame and release the lock in `finally`; it proves only receipt expiry, not the full 60-second cap. No Rules or Contract changes. Builder ACK and definition gates are the next prerequisites.


S2-47e-F3 paired post-review: **failed** com IR-01/IR-02. IR-01: o cenário com query bloqueada aguarda evento e EOF dentro de `withBlockedUsersQuery`, liberando o lock somente depois; ajustar para aguardar expiração sob lock, sair do helper/liberar lock e só então consumir/assertar expiry e EOF. IR-02: `finalizeDeadline` retorna para qualquer outcome terminal; se `user.created` estiver bloqueado em escrita, o timer não limpa heartbeat/listeners nem fecha no receipt/cap deadline. Preservar a proibição de segundo evento expiry, mas encerrar e limpar lifecycle pendente quando deadline chega. Sensores root: `check:code`, `check:types`, `test:unit`, `check:test-integrity`, `check:architecture` passaram; complexity falhou exit2 com 9 warnings contra baseline inalterada de 7; conformance permanece nos 140 erros globais conhecidos. F3 não aceito.

#### Builder Fix S2-47e-F4 — correções de review e complexity

Mesma Builder Server estável; Spec rev10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; paths exclusivos permanecem `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` e `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; RF-09, CA-18/22, EV-06. Corrigir IR-01 liberando lock PostgreSQL em `finally` antes de drenar/assertar expiry e EOF, mantendo query pendente através do deadline. Corrigir IR-02 fazendo deadline encerrar lifecycle/escrita `user.created` pendente sem emitir segundo evento; preservar outcome terminal e cap/receipt semântica. Analisar e eliminar todas as warnings novas do check:complexity até não exceder baseline 7; não alterar baseline/threshold. Sem outros paths, mocks, fake timers, Rules ou Contract. Exits: focused Biome, fresh local db:test, suite serial exato, paired review, root code/types/unit/integrity/architecture/complexity e conformance rerun, principal diff inspection. Status `in_progress`.


S2-47e-F4 runtime checkpoint: fresh local `db:test` and focused Biome passed. Exact serial route suite failed 15/16 in 34.205s; the newly corrected locked-query-expiry case passed, but the existing unread-reader expiry test observed an extra SIGTERM listener after a fixed 2.3s wait before draining the stream. This invalidates route evidence for F4; root type/code/unit/integrity/architecture/complexity/conformance reruns are pending. Complexity output improved from 9 to 7 warnings/0 errors, but `check:complexity` still exits 2; no baseline or threshold change is allowed.

#### Builder Fix S2-47e-F4-F1 — stabilize expiry cleanup and remaining complexity delta

Same stable Builder Server and two exclusive paths, same Spec revision/base/RF/CA/EV. Make the unread-reader expiry test wait for actual stream completion before asserting process-listener cleanup, while preserving idle reader/backpressure through terminal event initiation. Keep the real query locked across expiry and release it before draining/asserting. Add/retain behavior that a `user.created` write blocked by backpressure is stopped and closed at receipt/cap deadline without a later expiry frame, using a real route scenario if it can be expressed with existing fixtures and no mock/fake time. Reduce the remaining `check:complexity` delta to exit 0 without changing baseline/threshold. No unrelated paths or contract/rule changes. Gates: focused Biome, fresh local db:test, exact serial route suite, paired post-review, root code/types/unit/integrity/architecture/complexity and conformance. Status `in_progress`; F4-F1 implementation pending.


S2-47e-F4-F1 integrated closeout: focused Biome and `git diff --check` passed; fresh local `npm run db:test -w @stardust/server` passed; exact serialized `StreamProfileCreationRoute.test.ts` passed 1 suite / 16 tests in 34.581s. The expiry-under-lock test holds the initial profile SELECT through real receipt expiry, releases the database lock before draining the stream, and observes exactly one `{}` expiry event then EOF with no created/heartbeat. The idle-reader expiry test checks listener cleanup after actual EOF. Paired Implementation Reviewer **accepted** F4-F1 with no blocking findings; review notes source closes a created-terminal write at deadline without emitting expiry, but direct real-route proof for pending created-write backpressure and full 60s cap is absent. Root checks on this candidate: `check:code` passed (7 workspaces; 171 existing Web warnings), `check:types` passed (7), `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,875 modules / 6,989 dependencies), `check:complexity` passed with 0 warnings/errors and unchanged baseline. `check:spec-implementation` remains failed at 140 global errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned SSE paths are not listed. S2-47e-F4-F1 is `verified`; S2 remains `in_progress` with EV-06 cap/error/reconnect, EV-01/02 coverage, aggregate review, W2/D3/C2 and coverage/remote gates open.

#### Assignment S2-47f — real 60-second stream cap while receipt remains valid

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; RF-09, CA-18/CA-19, EV-06. Add one real local Auth/PostgreSQL route test for a valid signed receipt with no profile whose expiry is well beyond 60 seconds. Keep the reader open, observe the initial retry/real heartbeats, then assert the stream closes at its 60-second maximum, does not emit `onboarding.expired` or `user.created`, and removes shutdown listeners. Use the real clock; no fake timers/mocks and no source/other path changes. Paired pre-review approved with refinements: use a per-test timeout of 75–80s; start monotonic timing before request open; await actual heartbeats and EOF, assert a reasonable lower bound, several heartbeats, no expiry/created frame and listener removal without relying on a heartbeat/close race at exactly 60s. Clean up reader in `finally`. Exits: focused Biome, fresh local `db:test`, exact serialized route suite, paired post-review, principal root sensors and conformance. This proves only the real-duration cap scenario; post-header DB error/reconnect and full EV-06 remain open. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47f paired pre-review: **approved with refinements**. The Reviewer confirms a real signed receipt valid beyond 60s isolates the duration cap; keep the reader actively consuming to receive 15s heartbeats, then assert EOF, no `onboarding.expired`/`user.created`, and shutdown-listener removal. Use 75–80s Jest timeout, monotonic timing from before opening the request, a reasonable lower-bound duration, and avoid asserting whether a heartbeat races the 60s close. Cleanup in `finally`; no source or other path.


S2-47f integrated closeout: fresh local `db:test` passed; exact serialized route suite passed 1 suite / 17 tests in 96.152s, including the real 60-second cap case at 60.324s with valid 900-second receipt, no profile, active reader, actual heartbeats, EOF, no expiry/created event, and listener cleanup. Focused Biome/diff check passed. Paired Implementation Reviewer **accepted**. Root `check:code` passed (7 workspaces; 171 informational Web warnings), `check:types` passed (7 workspaces), `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,875 modules / 6,989 dependencies), and `check:complexity` passed with 0 warnings/errors and unchanged baseline. Global `check:spec-implementation` remains failed at 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated paths ignored); the assigned SSE test path is absent. S2-47f is `verified`. Next S2 action is real post-header DB-error handling evidence and reconnect evidence, followed by EV-01/02 coverage crosswalk/aggregate review; W2/D3/C2, combined coverage and remote/CI gates remain open.

#### Assignment S2-47g — real PostgreSQL query failure after SSE headers

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; RF-09, CA-19, EV-06. Add one route test using real Auth/PostgreSQL that forces the first profile SELECT to fail only after the SSE response has opened. Proposed deterministic local-only setup: after creating the Auth identity, temporarily rename a required `public.users` column before opening the stream, causing the real Drizzle `findById` query to fail after `retry:1000`/headers; restore the original column in `finally`. Assert status/headers remain SSE, stream closes, no JSON/error payload or created/expiry frame leaks, and shutdown listeners are removed. Paired pre-review approved with safeguards: use `ALTER TABLE ... RENAME COLUMN` without `CASCADE`; track successful rename and restore `id` in `finally`; keep reader/request signal under cleanup and await EOF before restoration on success. Assert 200 + SSE headers, retry frame, EOF, no JSON/error/created/expiry payload and listener cleanup; do not assert that sanitized server-side logging is absent. No mocks/fake timers or other paths/source changes. Exits: focused Biome, fresh local `db:test`, exact serialized suite, paired post-review, root sensors and conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47g paired pre-review: **approved with safeguards**. The real Drizzle SELECT should fail after initial SSE retry/headers when local `public.users.id` is temporarily renamed. Use plain rename without `CASCADE`, track success, restore `id` in `finally`, and close/await the stream before restoration on success. Assert 200/SSE headers, retry, EOF, no JSON/created/expiry frame and listener cleanup; do not assert absence of sanitized server-side logs. Integration Jest is serialized. No Rule/Contract change.


S2-47g integrated closeout: fresh local `db:test` passed; exact serial route suite passed 1 suite / 18 tests in 96.041s. The new real database-failure case took 325ms and verified 200 SSE/no-store/no-buffering, retry then EOF, no JSON/error/created/expiry frame, and listener cleanup after temporary `public.users.id` rename; the column restoration in `finally` was corroborated by later real lock/expiry route cases. Focused Biome/diff passed. Paired Implementation Reviewer **accepted**. Root `check:code` passed (7 workspaces; 171 informational Web warnings), `check:types` passed, `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,875 modules / 6,989 dependencies), and `check:complexity` passed (0 warnings/errors, unchanged baseline). Global path conformance remains at 140 known contract errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned route test path is absent. S2-47g is `verified`. Server EV-06 reconnect scenario and EV-01/02 crosswalk/aggregate review remain open; W2/D3/C2 and combined coverage/remote gates remain open.

#### Assignment S2-47h — same-credential reconnect discovers profile created while disconnected

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; RF-06/RF-09, CA-11/CA-19, EV-06. Add one real local Auth/PostgreSQL route test: open a stream using a valid signed receipt for an account without a profile, establish initial absence, abort/close the first stream, create that account's real profile while disconnected, then reconnect with the same still-valid receipt on a new request. Assert the reconnect's initial database lookup emits exactly one matching persisted `user.created` event and EOF, without foreign identity, expiry/error or duplicate frames; validate stream/listener cleanup. Use the real DB/Auth and request lifecycle; no mocks/fake timers, source or other paths. Paired pre-review approved: assert no public.users row before first stream, consume retry and let initial lookup run before abort/await EOF; create the profile while disconnected, reconnect using the same still-valid receipt, read through EOF, and assert one matching `user.created` plus `profile:<id>` with no expiry/error. Check listener cleanup after both connections; keep both readers/signals in `finally`. Focused Biome, fresh `db:test`, exact serialized suite, paired post-review, principal sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47h paired pre-review: **approved**. Reviewer confirms the real disconnect→profile-creation→same-receipt reconnect scenario directly covers CA-11. Consume initial retry and allow absence lookup before aborting/awaiting first EOF; persist while disconnected; reconnect with same receipt and assert exactly one persisted matching `user.created`/id then EOF, no expiry/error. Cleanup both live connections/readers in `finally` and check shutdown listeners after each. No source or other path.


S2-47h integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized route suite passed 1 suite / 19 tests in 95.074s, including the real reconnect scenario in 583ms. It proves initial account absence and completed lookup, abort/EOF/listener cleanup, profile persistence while disconnected, same valid signed receipt on reconnect, exactly one matching persisted `user.created`/profile id then EOF, and no foreign/expiry/error frames. Paired Implementation Reviewer **accepted**. Root `check:code` passed (7 workspaces; 171 informational Web warnings), `check:types` passed, `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,875 modules / 6,989 dependencies), and `check:complexity` passed (0 warnings/errors, baseline unchanged). Global path conformance remains failed at 140 errors (122 Remove, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned SSE test path absent. S2-47h is `verified`. Server EV-06 real cap, post-header DB error, and reconnect are now exercised. Remaining S2 work: EV-01/02 25-port/actor evidence gaps, aggregate Server review, and any residual SSE semantics (pending-created backpressure lacks direct browser-route proof); then W2/D3/C2, combined coverage and global Contract/CI/remote gates.


S2-47h integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized route suite passed 1 suite / 19 tests in 95.074s, including the reconnect scenario in 583ms. It proves initial account absence and completed query, abort/EOF/listener cleanup, same-account profile persistence while disconnected, same valid signed receipt on reconnect, one matching persisted `user.created`/profile id then EOF, and no foreign/expiry/error frames. Paired Implementation Reviewer **accepted**. Root `check:code` passed (7 workspaces; 171 informational Web warnings), `check:types` passed, `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, `check:architecture` passed (3,875 modules / 6,989 dependencies), and `check:complexity` passed with 0 warnings/errors and unchanged baseline. Global path conformance remains failed with 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the assigned path is absent. S2-47h is `verified`. EV-06 route evidence for receipt cap, post-header DB error, and same-credential reconnect is now covered. Remaining EV-01/02 gaps need new conversation route test path(s), including private Chat/ChatMessages A/B read isolation and port behavior; those paths are absent from the Spec's exact map. Spec amendment authorization is pending before adding any uncontracted route test. Aggregate Server review, W2/D3/C2, combined coverage and global Contract/CI/remote gates remain open.

#### Assignment S2-47i — code-execution pagination/order and bidirectional A/B isolation

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted path only: `apps/server/src/tests/routes/challenging/challenges/ListChallengeCodeExecutionsRoute.test.ts` (`Modify`). RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen the existing real route integration: persist two code executions for A with distinct timestamps and one for B under the same challenge. A requests page 1 and 2 with page size 1; assert exact DTOs in descending timestamp order and stable `count=2` on both pages. B requests the same route and receives only B's own execution with count1. Compare `ChallengingFixture.findCodeExecutions` before/after to show reads do not mutate persisted state. Use real Auth, route, Drizzle/PostgreSQL; no repository mocks/dedicated tests/new path/API changes. Paired pre-review approved with refinements: retain A’s existing execution on a different challenge; compare persisted rows before/after with explicit timestamp ordering. A pages1/2 at `itemsPerPage=1` must return exact DTOs, newer timestamp first, count2 on each; B page1 returns exactly B’s row/count1. No repository/fixture/API/new-path changes. Focused Biome, fresh local db:test, exact serialized route test, paired post-review, root sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47i paired pre-review: **approved**. Reviewer confirms two timestamped A executions plus one B execution on the same challenge directly covers contracted actor/pagination/order/count behavior. Preserve A’s different-challenge row; request A pages1/2 with size1 and exact DTOs/newest first/count2 both; B gets only its exact row/count1. Compare SQL-backed rows before/after ordered by timestamp. No repository/fixture/API/new path.


S2-47i integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized `ListChallengeCodeExecutionsRoute.test.ts` passed 1 suite / 3 tests in 10.593s. Existing contracted test now seeds two A executions with distinct timestamps plus one B execution on the same challenge, retains A's other-challenge row, proves A pages1/2 size1 return exact DTOs newest-first/count2 each, proves B receives only B's own exact DTO/count1, and compares persisted groups before/after in explicit timestamp order. Paired Implementation Reviewer **accepted**. Root `check:code` passed (7 workspaces; 171 informational Web warnings), `check:types` passed, `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity passed, architecture passed (3,875 modules / 6,989 dependencies), and complexity passed with 0 warnings/errors and unchanged baseline. Global path conformance remains failed at 140 broad contract errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned path absent. S2-47i is `verified`; remaining EV-01/02 evidence gaps and aggregate review remain open.

#### Assignment S2-47j — code-execution error-count runtime and A/B isolation

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted path only: `apps/server/src/tests/routes/challenging/challenges/CountChallengeCodeExecutionErrorsRoute.test.ts` (`Modify`). RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen the current real route scenario while preserving current fixtures: add a runtime-error execution for A on the target challenge, error executions by A on another challenge, and error executions by B on target. Assert A receives only its expected count, B receives only B's own count, and compare timestamp-ordered SQL-backed persisted snapshots before/after. Real Auth, Drizzle/PostgreSQL and route; no mocks, new path, API/fixture changes or repository-only tests. Paired pre-review approved with refinements: preserve A target wrong_answer rows count2, syntax_error count1, internal_error count0; add target runtime_error for A, yielding A count4. Add penalizable A errors on a different challenge and B penalizable errors on target; B sees only B count. Use distinct timestamps and compare A-target/A-other/B-target snapshots ordered by timestamp. Authenticate both actors and keep setup/assertions in existing test. Focused Biome, fresh local db:test, exact serialized test, paired post-review, principal sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47j paired pre-review: **approved**. Preserve existing A target wrong-answer count2, syntax count1, internal count0; add one penalizable runtime error for A on target (A total4), A penalizable errors on another challenge, and B penalizable target errors; B count includes only B. Distinct timestamps and before/after snapshots for A-target/A-other/B-target sorted by time. Real route/Auth/Postgres, no path/API/fixture changes.


S2-47j integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized `CountChallengeCodeExecutionErrorsRoute.test.ts` passed 1 suite / 2 tests in 8s. The test verifies A’s target challenge count4 (two wrong-answer + syntax + runtime; internal excluded), excludes A errors on another challenge, and verifies B’s target count2 includes only B. Eight timestamped SQL rows across A-target/A-other/B-target snapshots are unchanged after both requests. Paired Implementation Reviewer **accepted**. Root code passed (7 workspaces; 171 informational Web warnings), types passed, unit passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity passed, architecture passed (3,875 modules / 6,989 dependencies), and complexity passed (0 warnings/errors; baseline unchanged). Global path conformance remains failed at 140 known errors; assigned path absent. S2-47j is `verified`; broader EV-01/02 port/actor evidence remains open.

#### Assignment S2-47k — repeated achievement rescue without duplicate reward

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/achievements/RescueAchievementRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen existing real route scenario with authenticated A/B and the same rescuable achievement relation for both. A rescues once: assert one reward/coin increase and A's relation removed, while B's relation and coins remain unchanged. A repeats the rescue: assert HTTP 200, no duplicate credit, and relation remains absent. Real Auth/route/Drizzle/PostgreSQL and current fixtures; no mocks/API/fixture/new path. Do not claim concurrent atomicity. Paired pre-review approved with refinements: capture A/B starting balances; after first A request assert exact reward gain and only A relation removed while B relation/balance unchanged; repeat A and assert success, no second credit, persisted states still unchanged. This proves sequential idempotency/ownership only, not concurrent atomicity. No production/fixture/mock/new path. Focused Biome, fresh local db:test, exact serialized route test, paired post-review, root sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47k paired pre-review: **approved**. Sequential replay follows current use case: removed relation means successful response without additional reward. Capture A/B initial balances; first A rescue gains exactly one reward and removes only A relation; B unchanged. Repeated A rescue succeeds with no new credit and states remain unchanged. Claim sequential idempotency only, not concurrent atomicity. No production/fixture/mock/new path.


S2-47k integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized `RescueAchievementRoute.test.ts` passed 1 suite / 6 tests in 8.846s. Real A/B sharing the same rescuable achievement show A's first rescue adds exactly one reward and removes only A's relation, while B's balance/relation remain intact; A's sequential replay returns 200 without another credit or relation mutation. Existing auth/validation/not-found/cross-account cases remain green. Paired Implementation Reviewer **accepted**; no concurrent atomicity is claimed. Root code passed (7 workspaces; 171 informational Web warnings), types passed, unit passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity passed, architecture passed (3,875 modules / 6,989 dependencies), complexity passed (0 warnings/errors, baseline unchanged). Global path conformance stays at 140 known failures; assigned path absent. S2-47k is `verified`; additional EV-01/02 ports/actors and aggregate Server review remain open.

#### Assignment S2-47l — unlocked-achievement ordering and owner isolation

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/achievements/FetchUnlockedAchievementsRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen the existing real route scenario: A has two unlocked achievements with distinct positions inserted in reverse order; B has one exclusive unlocked achievement. A reads its own route and receives exact DTOs in ascending position, no B item. B reads B and receives only B's item; B reading A is denied (`401`/`AuthError`) without A data. Compare persisted relations before/after to establish read-only behavior. Use real Auth/Hono/Drizzle/PostgreSQL and existing fixtures; no repository mocks/dedicated tests/new path. Paired pre-review approved with refinements: retain a created-but-locked achievement; give A unlocked rows distinct positions and insert reverse order; assert exact A DTOs ascending. B gets one exclusive unlocked DTO; B reading A returns 401 with existing AuthError. Compare persisted unlocked relations for A and B before/after. Real route/Auth/Postgres fixtures, no mocks/new path. Focused Biome, fresh local db:test, exact serialized route suite, paired post-review, principal sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47l paired pre-review: **approved**. Keep one created-but-locked achievement; A’s two unlocked entries have distinct positions, inserted reverse order and returned as exact ascending DTOs. B receives only its exclusive unlocked DTO; B→A is 401 with AuthError. Compare persisted unlocked relations for both users before/after. Real Auth/Postgres/route, same path.


S2-47l integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serialized `FetchUnlockedAchievementsRoute.test.ts` passed 1 suite / 4 tests in 7.397s. The real authenticated case returns A’s two exact unlocked DTOs in ascending position despite reverse insertion, excludes the retained locked achievement, returns B’s exclusive DTO only, and denies B→A with 401/AuthError/no A ids; the three persisted relations are unchanged after GETs. Paired Implementation Reviewer **accepted**. Root code passed (7 workspaces; 171 informational Web warnings), types passed, unit passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity passed, architecture passed (3,875 modules / 6,989 dependencies), complexity passed (0 warnings/errors; baseline unchanged). Global path conformance remains failed at 140 known errors; assigned route path absent. S2-47l is `verified`; broader EV-01/02 method/actor evidence gaps remain open.

#### Assignment S2-47m — route identity overrides conflicting body identity

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/UpdateUserRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen the real route test with authenticated A/B profiles. A sends a valid update to `/profile/users/A` whose body claims `id=B`; assert 200, returned id A, only A’s allowed fields change, B remains unchanged. B then updates `/profile/users/A` with body `id=B`; assert 404/UserNotFoundError and both profiles remain unchanged. Verify through SQL/fixtures before/after. Real Auth/Hono/Drizzle/PostgreSQL; no mocks/API/source/fixture/new path or repository-only test. Paired pre-review approved with refinements: A sends a valid A DTO with only `id` replaced by B, targets A route, and asserts response/persisted change belongs to A while B is unchanged. Then B sends valid B DTO to A route, expects 404/UserNotFoundError, and asserts neither profile changed relative to post-A snapshot. No concurrency/API claim. Focused Biome, fresh local db:test, exact serial test, paired post-review and root sensors/conformance. Status `in_progress`; pre-review clear, Builder ACK pending.

S2-47m paired pre-review: **approved**. A valid A DTO with only body id=B goes to A route and must update/return A while B stays unchanged. Then valid B DTO to A route must return 404/UserNotFoundError; compare both profiles against post-A-update snapshot. Real Auth/Postgres, existing test path, no concurrency/API change.

S2-47m runtime checkpoint: fresh local `db:test`, Biome and diff checks passed; exact route suite failed 5/6 because the new conflicting-id request received 400 during actual DTO validation. Builder traced this to `ProfileFixture.createAccountUser` returning incomplete setup DTOs for selected-item fields; existing happy-path pattern hydrates a valid user through the real system reader. Do not weaken validation or assertions. S2-47m remains `in_progress`; same-path Builder Fix F1 will hydrate A/B valid DTOs through the real reader, then preserve the conflicting-id, response identity, owner-state, and 404 assertions. Fresh route rerun and paired post-review required.

#### Builder Fix S2-47m-F1 — use hydrated route DTOs in identity-conflict test

Same stable Builder Server and only `apps/server/src/tests/routes/profile/users/UpdateUserRoute.test.ts`. Use the existing real system reader to hydrate A/B persisted profiles into valid route DTOs before changing only A's body id to B. Preserve strict real validation, A/B SQL snapshots, 200 response id=A, B-owner 404, and no state changes after denial. No source/API/fixture/mocks/new path. Focused Biome, fresh local db:test, exact serial suite, paired review and invalidated root sensors as applicable. Status `in_progress`.


S2-47m-F1 integrated closeout: fresh local `db:test` passed; focused Biome/diff passed; exact serial `UpdateUserRoute.test.ts` passed 1 suite / 6 tests in 8.72s. The test hydrates valid A/B DTOs through the real repository reader, then changes only A's request body id to B; A route returns A and updates only A, B stays intact. B's valid DTO to A route receives 404/UserNotFoundError, both persisted rows unchanged. Paired Implementation Reviewer **accepted**. Root code passed (7 workspaces; 171 informational Web warnings), types passed, unit passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity passed, architecture passed (3,875 modules / 6,989 dependencies), and complexity passed with 0 warnings/errors, baseline unchanged. Global conformance remains at 140 errors; assigned path absent. S2-47m-F1 is `verified`; it proves route identity and sequential owner preservation, not concurrency.

#### Assignment S2-47n — filtered pagination ordered by unlocked-achievement count

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Strengthen the real route integration with two authenticated real profiles A/B under an exclusive search prefix; A has two unlocked achievements, B none. A regular authenticated account requests `unlockedAchievementCountOrder` descending, the prefix filter, and page size1. Assert page1 contains only A, page2 only B, each total=2/pages=2, and exact projected ids/counts/relations. Compare profile and relation SQL snapshots before/after. This exercises the existing `count_user_unlocked_achievements` behavior and zero count through the real consumer; do not assume God-only access. Real Auth/Hono/Drizzle/Postgres; no mocks/new path/API/fixture/repository-only test. Paired pre-review approved with refinements: create only A/B under shared prefix; A has two unlocked relations inserted reverse order, B none; assert page1/page2 at size1 return A then B, total2/pages2 each, exact IDs and relation membership (compare relation IDs as set/sorted because aggregation order is unspecified). Snapshot profile/relation rows before/after. Keep ordinary authenticated account and `ENV.godAccountIds=[]`; no God assumption. No mocks/new path. Focused Biome, fresh local db:test, exact serial route test, paired post-review and root sensors/conformance. Status `verified`.

S2-47n paired pre-review: **approved**. The ordinary auth route can exercise zero-count ordering through the actual list consumer/SQL function. Use only A/B under shared prefix, A with two reverse-inserted unlocked relations, B with none, pages1/2 size1 ordered by unlocked count descending; exact A then B, totals/pages2 both, IDs and membership. Sort/set relation IDs because aggregate order is unspecified; snapshot SQL profiles/relations before/after. Keep no God IDs.

S2-47n integrated closeout: fresh local `db:test` passed; focused Biome and diff check passed; exact serial `FetchUsersListRoute.test.ts` passed 1 suite / 4 tests in 7.622s. Real route returns A (two unlocked achievements) before B (zero) across pages 1/2, with total2/pages2 on both and exact projected relation membership; SQL profile/relation snapshots match before and after. Paired Implementation Reviewer **accepted**. Root `check:code` (7 workspaces; Web informational warnings only), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. Global `check:spec-implementation` remains at 140 known mismatches and does not name this assigned path. S2-47n is verified; bounded EV-01/02 filtered ordering, zero-count pagination, relation projection and read-only behavior are evidenced. The broader EV-01/02 matrix, aggregate Server review, W2/D3/C2 and global Contract/CI/remote gates remain open.

#### Assignment S2-47o — current/previous month global created-users KPI

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchCreatedUsersKpiRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Extend the real route test beyond its current-month-only case: create three persisted profiles with `createdAt` dynamically derived from UTC calendar months (current, previous, two months earlier), at noon on day 15 using `Date.UTC` to safely handle month/year rollover. Authenticate ordinary users A and B with `ENV.godAccountIds=[]`; both must receive exact global aggregate `{value: 3, currentMonthValue: 1, previousMonthValue: 1}`. Keep anonymous 401 and compare ordered SQL profile snapshots before/after GETs. The route intentionally exposes a global aggregate to authenticated users; do not add owner filtering/God assumption. Real Auth/Hono/Drizzle/Postgres; no mocks, fake clock, fixture/API/source/new path/repository-only test. Paired pre-review approved with UTC mid-month timestamps and exact aggregate for both actors. Focused Biome, fresh local db:test, exact serial route suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47o integrated closeout: focused Biome/diff passed; fresh local `db:test` passed; exact serial `FetchCreatedUsersKpiRoute.test.ts` passed 1 suite / 3 tests in 8.29s. Three persisted profiles at UTC day15 noon in current, previous, and two-months-earlier calendar months produce exact `{value:3,currentMonthValue:1,previousMonthValue:1}` for both ordinary authenticated A and B; ordered profile snapshots are unchanged and anonymous 401 remains. Paired Implementation Reviewer **accepted**. Root `check:code` (7 workspaces; existing informational warnings, no errors), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. Global `check:spec-implementation` remains at 140 known global mismatches and does not name the assigned test path. S2-47o is verified; this closes only bounded global aggregate month-filtering and ordinary-actor route evidence. Broader EV-01/02 review and plan/global gates remain open.

#### Assignment S2-47p — shared ordered planet/star catalog projection

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/space/planets/FetchAllPlanetsRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Extend the real catalog route coverage for `PlanetsRepository.findAll` nested second-query hydration: insert two planets with distinct positions in reverse order, and multiple stars per parent with distinct star numbers in reverse order, all setup/cleanup contained within this existing test. Ordinary authenticated A and B each request the route and must see the same shared projections. Filter their response to the two seeded planet IDs; assert ascending planet order, exact expected nested star IDs/ascending numbers for each, and no cross-parent stars. Compare ordered SQL planet/star snapshots after seeding and after both GETs. Preserve anonymous 401. Other catalog rows may exist; do not assert total catalog size. Do not claim owner filtering, availability semantics, or private ownership. Real Auth/Hono/Drizzle/Postgres; no mocks/new path/fixture/API/repository-only test. Paired pre-review approved with in-test Drizzle setup, relative seeded-row order, exact nested membership, and read-only snapshots. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47p integrated closeout: initial suite and paired review passed, but root `check:types` found optional Faker DTO IDs in the new Drizzle inserts. Builder Fix F1 explicitly supplies generated required IDs for seeded planets/stars without weakening assertions or changing schema. Fresh focused Biome/diff, Server/full root types, local `db:test`, and exact serial route suite all passed; final suite 1/3 tests in 7.417s. The paired reviewer accepted F1. Root `check:code` (7 workspaces; existing informational warnings only), `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. Global `check:spec-implementation` remains at 140 known mismatches; this contracted path is absent. S2-47p is verified; evidence covers seeded planet relative ordering, exact nested star order/parent grouping, identical ordinary A/B projections, and read-only access only. Broader EV-01/02 coverage and aggregate Server review remain open.

#### Assignment S2-47q — private challenge execution owner boundary

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/challenging/challenges/RunChallengeCodeRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. With real A/B Auth/profiles and `ENV.godAccountIds=[]`, create an A-owned private challenge using explicit valid ID, `isPublic:false`, and `starId:null`. A submits the existing invalid-code request and must receive 201 with exactly one persisted execution owned by A; preserve current accepted LSP statuses (`syntax_error`, `runtime_error`, or `internal_error`) without claiming deterministic categorization. Snapshot SQL execution rows; B posts the same challenge and must receive 404/ChallengeNotFoundError before LSP/insertion. Assert no B execution and A's row/snapshot unchanged. Use the existing test path/fixtures only; no production changes, mocks, new path, API changes, or fixture changes. Paired pre-review approved with explicit visibility controls and state assertions. Focused Biome, fresh local db:test, exact serial route suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47q integrated closeout: fresh local `db:test`, focused Biome/diff, and exact serial `RunChallengeCodeRoute.test.ts` passed 1 suite / 4 tests in 6.194s. A's private challenge POST returns 201 and persists one A-owned execution under the accepted LSP status set; B receives 404/ChallengeNotFoundError and the ordered SQL execution snapshot is unchanged with no B row. Existing anonymous, invalid-body, and public challenge cases remain. Paired Implementation Reviewer **accepted**. Root `check:code` (7 workspaces; informational warnings only), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. Global conformance remains at 140 known mismatches; assigned path absent. This closes only bounded private challenge owner visibility/execution persistence evidence; broader EV-01/02 and aggregate Server review remain open.

#### Assignment S2-47r — authenticated cross-account profile lookup by slug

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUserBySlugRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Use real ordinary A/B profiles with distinct slugs and separate unlocked achievements. A requests B's slug and B requests A's slug; both must return 200 with exact requested profile identity/appearance fields and only that profile's achievement IDs. Hydrate expected DTOs via the real system reader; compare relation IDs as sorted sets because aggregate order is unspecified. Capture ordered profile/relation SQL snapshots after setup and assert both GETs are read-only. Preserve anonymous 401 and unknown-slug 404. This route's contract allows authenticated cross-account reads (public access rejected); do not add owner-only denial. Real Auth/Hono/Drizzle/Postgres; no mocks/new path/API/fixture/repository test. Paired pre-review approved. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47r integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `FetchUserBySlugRoute.test.ts` (1 suite / 4 tests, 7.467s), paired Implementation Reviewer, and root `check:code`, `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity all passed. Reciprocal ordinary A/B requests return exact target profile/appearance and only target's sorted achievement IDs; complete ordered SQL profile/relation snapshots remain unchanged. Anonymous 401, unknown slug 404, and self-lookup remain. Global conformance still has 140 known mismatches and does not list this path. This closes legitimate authenticated cross-account slug-read evidence, not owner-only visibility.

#### Assignment S2-47s — sequential star creation across ordinary actors

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/space/planets/CreatePlanetStarRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Seed one shared planet with one star whose number is explicitly deterministic `1` before the baseline snapshot. Ordinary A creates next star (201/number2), then ordinary B creates another on the same planet (201/number3). Assert distinct returned IDs; exact persisted parent, number, name, slug, and default flags; three parent stars; original star and planet unchanged. Preserve anonymous and invalid-ID cases and cleanup tracking for base/new stars. This is sequential count-based numbering and shared catalog access; no concurrency/uniqueness or owner-denial claim. Use only existing route test/fixture surface; no mocks/new path/API/fixture/source changes. Paired pre-review approved with deterministic base-star number. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47s integrated closeout: initial route run exposed the existing deduplicated name for B's sequential star: number3 returns `Nova estrela(1)`/`nova-estrela1`, not the unsuffixed base name. The paired reviewer confirmed `Planet.getNewStarName()`/`Name.deduplicate()` contract; Builder Fix F1 asserts the exact suffixed name/slug without changing production or weakening assertions. Fresh focused Biome/diff, local `db:test`, and exact serial `CreatePlanetStarRoute.test.ts` (1 suite / 4 tests, 5.846s) passed; paired reviewer accepted. Root code (7 workspaces; informational warnings only), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warning/error) passed. Global conformance remains at 140 known mismatches; assigned path absent. Assertions cover sequential A2/B3 numbering, exact unique response/persisted values, distinct IDs, shared-parent membership, unchanged base rows, and cleanup. No concurrency or uniqueness claim.

#### Assignment S2-47t — exact public username availability lookup

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/VerifyUserNameInUseRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Create ordinary A/B profiles with deterministic plain-ASCII names sharing a prefix longer than three characters. Public anonymous requests for each complete existing name must return 409/`UserNameAlreadyInUseError`; the shared prefix alone and a longer unused name must return 200. Compare complete ordered SQL profile rows before/after requests to prove no mutation. Existing endpoint is public and exposes only availability; no auth/private projection expected. Avoid case-folding, accent-normalization, or collation claims. Real Hono/Drizzle/Postgres; no mocks/new path/API/fixture/source changes. Paired pre-review approved. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47t integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `VerifyUserNameInUseRoute.test.ts` (1 suite / 4 tests, 8.685s), paired reviewer and root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity passed. Exact existing names AvailabilityAlpha/Beta return 409/UserNameAlreadyInUseError; shared prefix and unused extended name return 200; full ordered SQL profile snapshots remain unchanged. Global conformance remains at 140 known mismatches and excludes this path. Evidence is exact public name lookup only, without collation/case/accent claims.

#### Assignment S2-47u — exact public email availability lookup

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/VerifyUserEmailInUseRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Update only two real test profiles' persisted emails to lowercase valid synthetic addresses sharing a local part but distinct domains, e.g. `availability@example.com` and `.net`; keep Auth identities separate. Public anonymous exact-address requests must return 409/`UserEmailAlreadyInUseError`; unused domain and unused extended local part must return 200. Compare ordered full SQL profile rows before/after. Preserve invalid-email and existing availability/conflict cases. No provider alias, case-folding, collation, or real credential claims. Real Hono/Drizzle/Postgres; no mocks/new path/API/fixture/source changes. Paired pre-review approved. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47u integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `VerifyUserEmailInUseRoute.test.ts` (1 suite / 4 tests, 6.972s), paired reviewer, and root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity passed. Exact persisted addresses availability@example.com/.net return 409/UserEmailAlreadyInUseError; unused .org and extended local part return 200; ordered complete profile rows are unchanged. Global conformance remains at 140 known mismatches; assigned path is absent. No provider alias, case-folding, or collation claim.

#### Assignment S2-47v — sequential planet position allocation from persisted maximum

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/space/planets/CreatePlanetRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Read initial catalog max position (`0` only if empty); seed two planets at `initialMax+3` and `initialMax+1` in that insertion order, creating a gap and making insertion order differ from maximum. Re-read `seedMax`; ordinary A then B create planets sequentially and should receive positions `seedMax+1` and `seedMax+2`. Assert each 201 response and persisted payload/defaults/empty stars/distinct IDs; compare complete ordered planet rows before/after route calls, accounting only for two expected additions. Track both seed IDs and both created IDs for cleanup. Preserve anonymous/invalid-payload cases. No concurrent allocation/uniqueness claim or empty-catalog assumption; no production/fixture changes, mocks, new path/API. Paired pre-review approved with max-after-seeding clarification. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47v integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `CreatePlanetRoute.test.ts` (1 suite / 4 tests, 5.099s), paired reviewer, and root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity passed. The test derives current maximum, seeds at max+3 then max+1, rereads the seeded maximum, then verifies ordinary A/B sequential creates at +1/+2 with exact DTO/defaults/empty stars and persisted rows. Distinct IDs; prior rows unchanged; exactly two additions; cleanup tracks all IDs. Existing anonymous/invalid cases remain. Global conformance stays at 140 known mismatches, assigned path absent. This is sequential allocation evidence only, not concurrency safety.

#### Assignment S2-47w — acquired insignia list filter

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Create real A/B profiles under unique shared search prefix, with only A acquired the existing unique `engineer` insignia catalog row. Keep `ENV.godAccountIds=[]`; engineer membership does not imply God role. Both authenticated actors query the engineer-filtered list using repeated query keys `insigniaRoles=engineer&insigniaRoles=engineer` because the route validator expects an array and a single key parses as scalar. Assert filtered result contains only exact A, exact insignia projection, total1/pages1 for both callers; unfiltered query includes A/B. Compare ordered full profile/acquisition SQL snapshots before/after. No privilege/purchase/concurrency claims, no schema/validation changes, mocks, fixture/API/new path. Paired pre-review approved with repeated-key encoding. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `in_progress`; Builder ACK pending.

S2-47w setup refinement (paired reviewer approved): `clearDatabase()` removes the insignia catalog, so seed the unique engineer row inside this same route test with existing `ShopFixture.createInsignias`, deterministic ID and `role:'engineer'`; attach it to A using the real `DrizzleUsersRepository`. Track insignia/acquisition IDs and clean up the relation before the insignia row. Do not add a shared fixture file. Keep repeated query-key encoding, exact A-only filtered projection/counts, unfiltered A/B baseline and before/after ordered SQL snapshots.

S2-47w integrated closeout: after test-local catalog seeding, focused Biome/diff, fresh local `db:test`, and exact serial `FetchUsersListRoute.test.ts` passed (1 suite / 5 tests, 7.743s). Deterministic engineer insignia inserted through existing ShopFixture; only A acquired it via real repository and cleanup deleted acquisition before catalog row. Both authenticated actors' repeated-key filtered query returns exactly A with `insigniaRoles:['engineer']`, total/pages1; unfiltered query includes A/B; ordered profile/acquisition snapshots unchanged. Paired reviewer **accepted**. Root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), complexity passed. Global conformance remains at 140 known mismatches and omits this path. Evidence is filtering only; no purchase or privilege claim.

#### Assignment S2-47x — inclusive created-at date boundaries and list counts

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Create ordinary A/B profiles under a unique prefix with persisted `createdAt` timestamps at exact UTC midnight on distinct dates. Query values must be date-only `YYYY-MM-DD` (full ISO timestamps fail route validation). Both actors query inclusive start=A date/end=B date and must get exact A/B plus total2; then exact A date as both endpoints returns A only and total1. Compare ordered complete profile snapshots before/after. Use fixed historical dates/UTC and actual DB timestamp precision; make no timezone normalization, partial-day, partial-bound, or concurrency claim. No production/fixture changes, mocks/new path/API. Paired pre-review approved with date-only query refinement. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `in_progress`; Builder ACK pending.
Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Create ordinary A/B profiles under a unique prefix with persisted `createdAt` timestamps at exact UTC midnight on distinct dates. Query values must be date-only `YYYY-MM-DD` (full ISO timestamps fail route validation). Both actors query inclusive start=A date/end=B date and must get exact A/B plus total2; then exact A date as both endpoints returns A only and total1. Compare ordered complete profile snapshots before/after. Use fixed historical dates/UTC and actual DB timestamp precision; make no timezone normalization, partial-day, partial-bound, or concurrency claim. No production/fixture changes, mocks/new path/API. Paired pre-review approved with date-only query refinement. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47x integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `FetchUsersListRoute.test.ts` (1 suite / 6 tests, 9.297s), paired reviewer and root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), complexity passed. Both ordinary actors see A/B for inclusive UTC-midnight Jan10–Jan12 date-only range (total2/pages1); exact Jan10 bounds return A only (total1/pages1). Ordered profile snapshot remains unchanged. Existing tests remain. Global conformance remains at 140 known mismatches; this path absent. No timezone normalization/partial-day claim.

#### Assignment S2-47y — empty page beyond end versus empty filtered result

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUsersListRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Seed ordinary A/B under a unique shared search prefix. Both actors request page3/size1: expect 200, rows `[]`, totalItems2, totalPages2, requested page3. Both then query a separate unique unmatched prefix on page1: expect rows `[]`, totalItems0, totalPages0. Compare ordered complete profile SQL snapshots before/after. No catalog-empty, ordering, or concurrent-snapshot claim; preserve existing scenarios. Real route/database; no mocks/new path/API/fixture/source. Paired pre-review approved. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified`.

S2-47y integrated closeout: focused Biome/diff, fresh local `db:test`, exact serial `FetchUsersListRoute.test.ts` (1 suite / 7 tests, 8.202s), paired reviewer and root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), complexity passed. For both ordinary actors, page3/size1 beyond two matched profiles returns empty rows with total2/pages2/requested page3; unmatched unique prefix returns empty rows and zero totals/pages. Pagination headers and complete ordered profile snapshots are checked; existing scenarios remain. Global conformance remains at 140 known mismatches; this path absent. No catalog-empty/order/concurrency claims.

#### Assignment S2-47z — reciprocal profile-by-ID isolation

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/profile/users/FetchUserByIdRoute.test.ts`. RF-02/CA-03 and RF-01/CA-01; EV-01/EV-02. Use real ordinary A/B profiles and hydrate each expected DTO through the real system-level repository reader. A and B each fetch their own valid ID and receive exact DTO; reciprocal cross-account ID requests each return 404 with exact `UserNotFoundError` body and no profile fields. Compare ordered complete SQL profile snapshots before/after all requests and assert unchanged. Keep `ENV.godAccountIds=[]`; endpoint has ordinary Auth only, no God middleware/success path. No auth changes, mocks/new path/API/fixture/source. Paired pre-review approved. Focused Biome, fresh local db:test, exact serial suite, paired post-review and root sensors/conformance required. Status `verified` (behavioral scope; broad type/unit sensors were waived at user request).

S2-47z closeout: focused Biome/diff, fresh local `db:test`, and exact serial `FetchUserByIdRoute.test.ts` (1 suite / 5 tests, 8.37s) passed; paired Implementation Reviewer **accepted**. Self-lookups return the hydrated DTO; reciprocal foreign IDs return exact 404/UserNotFoundError with no profile fields; ordered SQL profile rows remain unchanged. Root `check:code`, test-integrity, architecture, complexity passed. Root `check:types` and `test:unit` were interrupted per the user's request to remove checker overhead. `check:spec-implementation` remains at 140 known global mismatches, assigned route path absent. This assignment is verified behaviorally; the overall Spec remains in progress because substantial contracted migration work and final delivery gates remain.

#### Assignment S2-48a — accepted and wrong-answer executions with persisted actor ownership

Same stable Builder Server; Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; existing contracted Modify path only: `apps/server/src/tests/routes/challenging/challenges/RunChallengeCodeRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. In one cohesive route-test batch, add two real deterministic LSP branches on one public challenge prepared with `isEvaluatedByFunction:false`, `initialCode:'escreva(leia())'`, and one test case input `2`, textual expected output `'3'`. Ordinary A submits `escreva(leia() + 1)` and receives 201/accepted; ordinary B submits `escreva(leia() + 2)` and receives 201/wrong_answer. Assert exact per-case LSP-formatted outputs, null error, and matching full persisted execution rows for both actors. After B, prove A's complete persisted execution is unchanged. Retain S2-47q private-owner case and all existing route cases. No mocked LSP, flexible statuses for these deterministic branches, concurrency/performance claim, API/fixture/source/new path. Paired pre-review approved. User explicitly requested removing checker overhead: do not run broad `check:*` sensors for this batch; run fresh local `db:test`, the exact serial route test, and paired post-review.

S2-48a behavior passed: fresh local `npm run db:test -w @stardust/server` exit0; exact serial route suite passed 1 suite / 5 tests (7.957s). The LSP produces formatted outputs `"3"` and `"4"` against textual expected output `'3'`; A is accepted, B is wrong_answer, null errors and full persisted rows are asserted, and B leaves A's row unchanged. Paired Implementation Reviewer **accepted** the scoped diff and evidence. No production changes or broad checkers run per user instruction. S2-48a is verified behaviorally; the overall Spec remains in progress.

#### S2-48b feasibility disposition — pending created-event write under backpressure

No source/test mutation. The paired pre-review rejected the candidate as not deterministically observable through the real Fetch/Hono response: the wrapper may buffer the initial retry separately, so an unread client reader does not prove that `user.created` is blocked. The alternate consumed-retry setup frees queue capacity and is also insufficient. CA-11 requires the pre-existing profile to emit terminal `user.created`; asserting its absence without proof of a blocked write would contradict that contract. CA-18/CA-19 require bounded stream lifetime, terminal deduplication, EventSource closure, and cleanup, but do not require a synthetic pending-write/backpressure case. Disposition: no Contract or Rule change; keep existing accepted expiry/cap/error/reconnect evidence, do not add a nondeterministic test. Review is the S2-48b paired pre-review; no broad checker or runtime command ran.

#### Assignment S2-49 — route-level persistence and ownership for chats/messages

Stable Builder Server; Spec revision 12/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; exact permitted paths: `apps/server/src/tests/routes/conversation/CreateChatRoute.test.ts`, `FetchChatsRoute.test.ts`, `FetchChatMessagesRoute.test.ts`, and `SendChatMessageRoute.test.ts` (all Create). RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Four separate real Hono HTTP route tests, one per HTTP route per Server Routes Testing Rules §2. Use actual Auth fixture and local Drizzle/PostgreSQL, no mocked Auth/repositories. Prove create/list/persist/read-after-write; ordinary A and B each list only their own chats; B cannot read A's messages or post into A's chat, exact existing public error/status is retained, and complete relevant Chat/ChatMessage SQL rows show rejected writes leave state unchanged. Preserve anonymous authentication behavior and cleanup only test-created rows. Do not test patch/delete or assistant chats in this assignment; do not touch source, controllers, repositories, fixtures, APIs, shared helpers, or other paths. Paired implementation pre-review and Builder ACK required before mutation. Per user request, omit broad global checkers; run focused formatting and exact serial route integration tests after fresh local `db:test`, then paired post-review. Status `in_progress`, pending pre-review.

S2-49 paired pre-review: **approved with refinements**. Use `ProfileFixture.createAccountUser(accountId)` after real AuthFixture account creation because AuthFixture alone does not satisfy the `chats.user_id` FK. Cross-account GET/POST against a valid A chat must return exact existing 404 `ChatNotFoundError` (`Erro de recurso não encontrado` / `Chat não encontrado`), not 401. Keep anonymous 401 per route. Compare complete ordered chat/message snapshots before and after B's denied POST; prove no B message and no A mutation. Positive POST must assert 201 DTO plus SQL/readback for chatId/content/sender/ID/time. GET messages checks exact owned rows/order and excludes A payload from B response. GET chats checks each actor's own IDs and pagination counts. Bodyless CreateChat asserts 201, generated ID, `Novo chat`, owner A, valid/matching createdAt and read-after-write. Existing fixture only; no helper/fixture edits. Status remains `in_progress` pending stable Builder ACK and execution.

S2-49 verified. Focused formatting passed, fresh local `npm run db:test -w @stardust/server` passed, and the exact four serial conversation route suites passed 4/4 suites, 8/8 tests (14.186s), without open-handle warnings. Paired Implementation Reviewer **accepted**. Real route behavior verifies default bodyless chat creation and SQL readback, A/B chat pagination isolation, ordered owned message reads and exact foreign-chat 404, positive message writes/readback, and complete ordered Chat/ChatMessage snapshots unchanged after B's denied POST to A's chat. No source, fixture, helper, or API changed. No global checkers were run per user request. S2-49 closes its specific missing route evidence; aggregate S2 EV-01 operation and EV-02 actor crosswalk and consolidated review remain open. Evidence logs: `/tmp/stardust-s2-49-f2-db.log`, `/tmp/stardust-s2-49-f2-route.log`.

#### Assignment S2-50 — remaining Chat repository operations

Stable Builder Server; Spec revision 13/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; permitted paths: `apps/server/src/tests/routes/conversation/CreateChatRoute.test.ts` (Modify), `EditChatNameRoute.test.ts` (Create), and `DeleteChatRoute.test.ts` (Create). RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Real Auth/Hono/local Drizzle+Postgres; existing ProfileFixture creates each `public.users` FK row; no mocks or fixture/helper/source changes. Extend bodyless POST to seed the actor's existing `Novo chat(2)`, assert the new persisted chat is `Novo chat(3)` while preserving the first row; retain the no-prior-chat `Novo chat` scenario. PATCH `/conversation/chats/:chatId/name`: A's valid rename returns existing DTO/status and persists; B's valid foreign-chat rename yields exact `ChatNotFoundError` 404 and leaves complete ordered chat rows unchanged; anonymous remains 401. DELETE `/conversation/chats/:chatId`: A deletes its own chat with existing success contract and persisted absence (plus DB-cascade removal of its messages); B's valid foreign-chat delete yields exact `ChatNotFoundError` 404 and leaves complete ordered chat/message rows unchanged; anonymous remains 401. No assistant route or other endpoints. This assignment closes only these Chat methods/branches; remaining EV-01/02 crosswalk tasks are separate. Paired pre-review approved? pending. Status `in_progress`, no code edit before paired pre-review and Builder ACK. Per user request, omit broad global checkers; after edits run focused formatting, fresh local `db:test`, and exact serial route suites plus paired post-review.

S2-50 paired pre-review: **approved with refinements**. `CreateChatUseCase` selects the latest chat; deterministically seed only the prior `Novo chat(2)` row, prove it remains unchanged and assert the new `(3)` row/id/time; retain current no-prior case. PATCH must use valid ≥2-character name and assert generic-send HTTP 200, exact DTO and SQL readback; snapshot complete chats immediately before B's foreign request, then assert exact `ChatNotFoundError` 404 and no changes. DELETE generic-send contract is HTTP 200 (not 204) with no resource DTO. Seed A and B chats with child messages; after A deletes its chat, assert its chat/messages are absent and B's remain. For B→A denial compare complete ordered chat/message snapshots, exact 404; keep exact anonymous 401 payload each route. Model, manifest and migration specify `ON DELETE CASCADE`. No blocker; Builder ACK remains prerequisite.

S2-50 verified. Focused formatter passed, fresh local `db:test` passed, exact three serial route suites passed 3/3 suites, 7/7 tests in 10.127s, no handle warning; paired Implementation Reviewer **accepted**. Existing `Novo chat(2)` remains unchanged and new chat persists as `Novo chat(3)`; rename returns exact 200 DTO and persists; foreign rename/delete return exact 404 with unchanged SQL snapshots; owner delete returns 200, removes chat/messages by cascade, and preserves B's rows. Each new route retains exact anonymous 401. No source/helper/fixture/docs/global checker changes. Logs: `/tmp/stardust-s2-50-db.log`, `/tmp/stardust-s2-50-route.log`. S2-50 closes only its Chat operation gaps; global EV-01/EV-02 reconciliation remains open.

#### Assignment S2-51 — private Notes and Snippets repository methods

Stable Builder Server; Spec revision 15/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; exact permitted Create paths are the four `apps/server/src/tests/routes/profile/notes/{FetchNotesList,CreateNote,UpdateNote,DeleteNote}Route.test.ts` files and six `apps/server/src/tests/routes/playground/snippets/{FetchSnippetsList,FetchSnippet,CreateSnippet,UpdateSnippet,EditSnippetTitle,DeleteSnippet}Route.test.ts` files. Full mounted prefixes are `/profile/notes` and `/playground/snippets`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. Use real Hono/Auth/Drizzle/Postgres and existing Auth/Profile fixtures only; create ordinary A/B profiles to satisfy FKs. No mocks of auth/controllers/use-cases/repositories, no source/helper/fixture/API or other paths. Exercise list/read/create/update/title-edit/delete with exact response + SQL readback; assert actor A sees only own private rows, B's foreign reads/updates/deletes fail with the existing resource error and leave complete ordered SQL rows unchanged; preserve anonymous 401 per protected route. Listing asserts current pagination/search semantics. Pre/post Implementation Reviewer and Builder ACK required before edits. Per user request omit broad global checkers; run focused formatter, fresh local `db:test`, exact ten serial route suites, then paired post-review. Status `in_progress`, pending Spec Reviewer clear and paired pre-review.

S2-51 paired pre-review: **approved with required refinements**. `ProfileFixture.createAccountUser` after each real Auth account satisfies both tables' user FKs and seeds the avatar projection required by snippets; no fixture changes. Notes have only GET list: verify `findManyByUser` using page/itemsPerPage and default/explicit title search. POST is 201; PUT is 200; DELETE is 200/empty. Foreign private-note PUT/DELETE assert exact `NoteNotFoundError` 404 (`Nota não encontrada`) and unchanged full ordered notes; retain exact AuthError401. Snippets GET list/by-id are protected; list has pagination only, no search, and no SQL ORDER BY, so assert counts/pages and each page's membership/union without order. Use A's `isPublic:false` snippet for B denial. Public foreign snippet reads are allowed; optionally prove one. Foreign private read/update/title/delete map to exact `SnippetNotFoundError` 405 (`Erro de operação não permitida` / `Snippet não encontrado`) and preserve complete ordered snippet rows. Do not claim foreign update/delete is denied for public snippets because adapters do not expose affected-row status. Create 201; fetch/update/title 200 DTO; delete 200/empty. Compare full snapshots around all denied attempts. No Contract/Rule blocker; Builder ACK remains prerequisite.

S2-51 verified. Spec Reviewer revision15 **clear**; paired pre-review approved with refinements; Builder ACK received before edits; paired post-review **accepted**. Focused formatting and fresh local `db:test` passed; exact ten serial route suites passed 10/10 suites, 20/20 tests in 37.083s without handle warnings. Real Hono/Auth/Postgres proves Notes list/search/pagination/create/update/delete and Snippets list/get/create/update/title/delete; private A/B ownership, public-snippet cross-account visibility, exact existing errors/statuses and unchanged complete SQL snapshots after denied private mutations. No production/helper/fixture changes. Logs `/tmp/stardust-s2-51-f1-db.log`, `/tmp/stardust-s2-51-f1-route.log`. This supersedes the assignment's initial pending status; global EV-01/EV-02 remain open.

#### Assignment S2-52 — lesson questions/stories and manual guides

Stable Builder Server; Spec revision 16/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; exact permitted Create paths: `apps/server/src/tests/routes/lesson/questions/FetchQuestionsByStarRoute.test.ts`, `UpdateQuestionsByStarRoute.test.ts`, `lesson/stories/FetchStoryByStarRoute.test.ts`, `UpdateStoryByStarRoute.test.ts`, and `apps/server/src/tests/routes/manual/guides/FetchGuidesListRoute.test.ts`, `FetchGuideRoute.test.ts`, `CreateGuideRoute.test.ts`, `DeleteGuideRoute.test.ts`, `ReorderGuidesRoute.test.ts`, `EditGuideTitleRoute.test.ts`, `EditGuideContentRoute.test.ts`. RF-01/RF-02; CA-01/CA-03; EV-01/EV-02. One real route per file, no mocks of controllers/use-cases/repositories, no source/helper/fixture/other paths. Exercise Questions `findAllByStar/updateMany`, Stories `findByStar/update`, Guide find/list/category/last-position/add/replace/replaceMany/remove with SQL readback. Preserve route public/auth/admin actor boundaries exactly; assert ownership/admin denials only where existing behavior requires them and compare full ordered SQL snapshots around rejected mutations. Paired pre-review and Builder ACK required before edits. Per user request omit broad global checkers; focused formatting, fresh local `db:test`, exact eleven serial suites, paired post-review. Status `in_progress`, pending Spec Reviewer and paired pre-review.

S2-52 paired pre-review: **approved with refinements**. Exact mapping: Questions GET `findAllByStar`, PUT `updateMany`; Stories GET `findByStar`, PUT `update`; Guide GET list `findAllByCategory`, GET id `findById`, POST create `findLastByPositionAndCategory`+`add`, DELETE `findById`+`remove`, POST reorder `findAll`+`replaceMany`, PATCH title/content `findById`+`replace` (one port method, two use cases). No A/B ownership semantics for lesson content/guides. Questions/Stories GET ordinary authenticated 200; PUT requires God, anonymous AuthError401 and ordinary NotGodAccountError401. Guide GETs public with anonymous success; five mutations God-only (anonymous AuthError401, ordinary NotGodAccountError401). Success bodies/status: Questions PUT 200 question array; Story GET/PUT 200 `{story}`; Guide create 201; delete/reorder 204 empty; title/content 200 DTO. Missing guide GET 404; optional reorder missing id 404/duplicate IDs 409 only if included. Real InngestBroker for delete/content events; no broker mocks. Use `SpaceFixture.createStar()` and cleanupCreatedStars for parent FK; test-local SQL sets question/story JSON/text when needed and compare full star SQL snapshots; no ProfileFixture required. Guides persist outside `clearDatabase`: seed/track/delete `guideModel` rows test-locally; avoid assuming category empty, compare category baseline + test rows, assert ascending position; create position is max+1 in its category. Reorder updates supplied IDs to positions 1..N in request order, preserves other guide rows and makes no catalog-wide uniqueness claim. Snapshot complete ordered star/guide rows around denials and read back all successful JSON/text/guide fields. Builder ACK required before edits.

S2-52 verified. Spec Reviewer revision16 **clear**; paired pre-review approved with refinements; Builder ACK received; paired post-review **accepted**. Focused formatting and fresh local `db:test` passed; exact eleven serial suites passed 11/11 suites, 20/20 tests (42.885s) with normal process exit/no handle warning. Real Auth/Postgres/Drizzle/InngestBroker evidence covers protected Questions/Stories reads, God-only writes, public Guide reads, God-only Guide mutations, category/order/position semantics, persistence, events and exact actor/status denials. No source/helper/fixture changes. Logs `/tmp/stardust-s2-52-f2-db.log`, `/tmp/stardust-s2-52-f2-route.log`. First attempt with a one-option multiple-choice fixture exposed existing non-identity shuffle behavior and was canceled; the final test uses a valid OpenQuestion DTO and does not alter production or claim shuffle semantics.

#### Assignment S2-53 — TextBlocks route, concurrent JSON and audio job persistence

Stable Builder Server; Spec revision 18/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; permitted paths: four Create route tests `FetchTextBlocksByStarRoute.test.ts`, `UpdateTextBlocksByStarRoute.test.ts`, `RequestTextBlockAudioBatchRoute.test.ts`, `ClearTextBlockAudioFileRoute.test.ts` under `apps/server/src/tests/routes/lesson/text-blocks/`; Create `apps/server/src/tests/jobs/UpdateTextBlockAudioJob.integration.test.ts`; Modify `apps/server/jest.config.ts` only to exclude `src/tests/**/*.integration.test.ts` from `server` and include `src/tests/jobs/**/*.integration.test.ts` in `server-integration`. RF-01/RF-02; CA-01/CA-02/CA-03; EV-01/EV-02. Real Hono/Auth/Drizzle/Postgres and actual broker/job payload; no mocks/source/helpers/fixtures/other paths. Use `SpaceFixture.createStar()`+cleanup, SQL-seeded valid TextBlockDto JSON. GET ordinary 200, PUT God 200, audio-batch POST God 202, file clear God 200; anonymous AuthError401 and ordinary non-God NotGodAccountError401; no A/B ownership claim. Exercise findAllByStar/updateMany/updateAudio/clearAudio and assert complete star JSON snapshots/readback. For batch `updateAudio`, hold a real PostgreSQL row lock, issue one batch POST for two seeded eligible blocks, poll until both per-index JSONB update statements are blocked, release in `finally`, and assert both pending patches persist while unrelated block/text fields remain unchanged. For concurrent `clearAudio`, seed two filename-free error audio blocks at distinct indices, hold the same real star-row lock, issue two concurrent DELETE requests for those indices, poll until both JSONB updates are blocked, release in `finally`, and assert both audio keys are removed while unrelated JSON fields remain unchanged. File clear seeds error audio without fileName to avoid external object-store work. Job integration directly executes real `UpdateTextBlockAudioJob` for an already-generated audio event with `NoStepAmqp` and real Drizzle system actor; assert target pending audio becomes done with exact fileName/voice and unrelated blocks/fields survive. This proves job persistence only, not end-to-end Inngest/TTS/S3. No mocked job/repository/TTS/S3. Paired pre-review approved; Builder ACK received before edits. Per user request omit broad global checkers; focused formatter and fresh local `db:test` passed; exact five `server-integration` suites passed 5/5, 9/9 tests (13.098s on final rerun); paired post-review accepted. Status **verified**.

S2-53 verification evidence: Spec Reviewer rev18 clear; paired pre-review approved with CA-02 refinement; Builder ACK precedes edits; paired post-review accepted after a recursive blocker-chain correction. Focused formatting, fresh local `db:test`, and exact five serial `server-integration` suites pass (5/5 suites, 9/9 tests, 13.098s). Final tests prove both per-index batch audio updates and both same-route concurrent clears are blocked by the fixture row’s test-held PostgreSQL lock, survive readback with unrelated JSON preserved, and the real job persists an already-generated audio event. Logs `/tmp/stardust-s2-53-f2-db.log`, `/tmp/stardust-s2-53-f2-route.log`.

S2-53 test-project refinement for ACH-01 (Spec rev17): `server` project must exclude `src/tests/**/*.integration.test.ts` while `server-integration` includes `src/tests/jobs/**/*.integration.test.ts`; this avoids running the real DB job test under unit-only environment and keeps projects disjoint. Spec revision18 carries this exact rule. No other Jest selection changes are permitted.

S2-53 paired pre-review: **approved with CA-02 refinement**, no blocker. The batch route accepts no block index, so one POST with two seeded eligible blocks must start the two internal `updateAudio` writes; hold the real star-row lock, poll until both per-index JSONB updates are blocked, release in `finally`, and verify both pending patches plus unrelated JSON fields. The clear route test separately proves concurrent `clearAudio`: seed two filename-free error audio blocks at distinct indices, hold the real star-row lock, submit two concurrent DELETE requests to the same route, poll until both JSONB updates are blocked, release in `finally`, then verify both audio keys are removed and all unrelated JSON fields remain unchanged. The job test proves persistence for an already-generated audio event only; it does not claim end-to-end Inngest/TTS/S3. Spec Reviewer revision18 **clear**, no findings. Builder ACK received before edits; implementation in progress.
