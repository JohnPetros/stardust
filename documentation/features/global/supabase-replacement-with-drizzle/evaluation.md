---
title: Persistência com Drizzle e confirmação de perfil via SSE — Evaluation
spec: ./spec.md
spec_revision: 20
status: in_progress
base_commit: 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9
evaluated_commit: 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9
last_updated_at: 2026-10-06
---

# Evaluation — Persistência com Drizzle e confirmação de perfil via SSE

## Escopo avaliado

- **Supersession record, revision 20:** the user cancelled the unfinished delivery outcomes and approved superseding the Spec and Plan. All RF/CA/EV/VM status rows and execution notes below are historical snapshots; they are not active gates and have not been converted to passes. This Evaluation remains `in_progress` as the evidence ledger; it does not certify the current uncommitted code diff, integrated behavior, CI, remote parity, cutover, or deployment.
- **C2 cancellation closeout completed:** Spec/Plan statuses and the Plan ledger were reconciled to revision 20. D2/S2/W2/D3 are retired, their detailed records remain for traceability, and C2 records handoff only. The existing working-tree changes were preserved and remain outside an accepted integrated review.
- Revision19 amendment record: `npm run check:spec-definition -- documentation/features/global/supabase-replacement-with-drizzle/spec.md` passed. Spec Reviewer revision19 was **clear** for the revision19 behavior contract; that review does not assess or accept implementation and is not a review of the supersession amendment.

- Spec: ./spec.md, revisão 20, `superseded`; Plan: ./plan.md, revisão 20, `superseded`.
- Commit-base e HEAD: 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; candidato inclui diff não commitado, histórico preexistente preservado.
- Assignment C0, tentativa 1: task principal; paths exclusivos package-lock.json, apps/server/package.json, apps/web/package.json. RF-05/RF-10/RF-12; CA-20/CA-22. RP/JN mapeados no Context da Spec; SHI não aplicável. Rules code-conventions/server-application/web-application e Tooling/SDD; exits instalação/lockfile/sensores/review conforme card. Demais paths proibidos a C0; artefatos SDD coordenados pela task principal. Design não afetado.
- Estado inicial: Docker 29.5.3 acessível, .env.local raiz presente; runtime não preparado. npm view confirmou orm 0.45.3 e kit 0.31.11; nenhum segredo lido ou impresso.

Diff preexistente ao kickoff (nenhuma destas mudanças comprova implementação):

```text
M .dockerignore
 M .gitignore
 M AGENTS.md
 M documentation/agents/builder-agent.md
 M documentation/architecture.md
 M documentation/infrastructure.md
 M documentation/prompts/create-layer-rules-prompt.md
 M documentation/prompts/create-spec-prompt.md
 M documentation/prompts/find-performance-issues-prompt.md
 M documentation/prompts/update-layer-rules-prompt.md
 M documentation/rules/database-rules.md
 M documentation/rules/mcp-rules.md
 M documentation/rules/realtime-rules.md
 M documentation/rules/rules.md
 M documentation/rules/server-application-rules.md
 M documentation/rules/server-routes-testing-rules.md
 M documentation/tooling.md
 M scripts/check-spec-definition.mjs
 M scripts/tests/check-spec-definition.test.mjs
?? design/handoff.md
?? documentation/features/global/supabase-replacement-with-drizzle/
```

## Evidências dos critérios

| Critério | Estado | Evidência real |
| --- | --- | --- |
| CA-01 | pending | EV conforme Spec revisão 6; não executado |
| CA-02 | in_progress | Feedback Message HTTP integration: falha real de PK em `feedback_message_attachments` após insert da mensagem; rollback preserva report/conversation/baseline e não publica evento. Evidência cobre o boundary de transação S2; demais EV/rotas integradas seguem pendentes. |
| CA-03 | pending | EV conforme Spec revisão 6; não executado |
| CA-04 | passed | EV-03 local: whole47 empty migrate/no-op/no-seed e catálogo exato; Reviewer D2 pendente |
| CA-05 | passed | EV-03 local: CLI24 genuína, clone com dados, adoção/ledger e dados preservados whole47; Reviewer D2 pendente |
| CA-06 | passed | Whole76 passou drift/hash/ledger/concorrência cruzada e lock/perda de sessão; Reviewer D2 pendente |
| CA-07 | pending | EV conforme Spec revisão 6; não executado |
| CA-08 | in_progress | Whole47 inversa restaura catálogo/defaultACL/dados/ledger, remigrate aprovado; stack infraestrutura completa/review pendentes |
| CA-09 | pending | EV conforme Spec revisão 6; não executado |
| CA-10 | pending | EV conforme Spec revisão 6; não executado |
| CA-11 | pending | EV conforme Spec revisão 6; não executado |
| CA-12 | pending | EV conforme Spec revisão 6; não executado |
| CA-13 | pending | EV conforme Spec revisão 6; não executado |
| CA-14 | pending | EV conforme Spec revisão 6; não executado |
| CA-15 | pending | EV conforme Spec revisão 6; não executado |
| CA-16 | pending | EV conforme Spec revisão 6; não executado |
| CA-17 | pending | EV conforme Spec revisão 6; não executado |
| CA-18 | pending | EV conforme Spec revisão 6; não executado |
| CA-19 | pending | EV conforme Spec revisão 6; não executado |
| CA-20 | pending | EV conforme Spec revisão 6; não executado |
| CA-21 | pending | EV conforme Spec revisão 6; não executado |
| CA-22 | pending | EV conforme Spec revisão 6; não executado |
| RF-01 | pending | CA conforme Spec revisão 6 |
| RF-02 | pending | CA conforme Spec revisão 6 |
| RF-03 | pending | CA conforme Spec revisão 6 |
| RF-04 | pending | CA conforme Spec revisão 6 |
| RF-05 | pending | CA conforme Spec revisão 6 |
| RF-06 | pending | CA conforme Spec revisão 6 |
| RF-07 | pending | CA conforme Spec revisão 6 |
| RF-08 | pending | CA conforme Spec revisão 6 |
| RF-09 | pending | CA conforme Spec revisão 6 |
| RF-10 | pending | CA conforme Spec revisão 6 |
| RF-11 | pending | CA conforme Spec revisão 6 |
| RF-12 | pending | CA conforme Spec revisão 6 |

| Evidência | Estado | Captura |
| --- | --- | --- |
| EV-01 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-02 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-03 | in_progress | Whole47 scripts reais 6/6; concorrência cruzada completa e paridade remota ainda pendentes |
| EV-04 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-05 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-06 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-07 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-08 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-09 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-10 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-11 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |
| EV-12 | pending | Cenário e ambiente conforme Plan; captura ainda não executada |

| Cenário | Estado | Evidência |
| --- | --- | --- |
| VM-01 | pending | Cadastro feliz real em ambos viewports |
| VM-02 | pending | Confirmação email via Mailpit em ambos viewports |
| VM-04 | pending | Studio login/dashboard/users |
| VM-05 | pending | Web login/space |

## Revisões

### Spec Reviewer

- Veredito clear, revisão 6, conforme histórico da Spec. Não reinvocado.

### Implementation Reviewer

- Modo pareado por ownership; S1 accepted, D1 accepted após resolução IR-D1-01 (client/transaction e projeções Snippet/Ranker/Planet/ChallengeSource agora stale até D2), W1 accepted; coordenação C0 tentativa 2, wiring operacional atual e reparo ACH-11 accepted. Nenhum candidato integrado aceito.

| Gate | Estado | Evidência |
| --- | --- | --- |
| UI Layer Audit | pending | W2 |
| Pencil/Web comparison | pending | D-06: nodes indisponíveis aprovados; preservar handoff/current UI, capturas runtime pendentes |

## Sensores e preflight

| Comando | Estado | Evidência |
| --- | --- | --- |
| npm run check:spec-definition -- documentation/features/global/supabase-replacement-with-drizzle/spec.md | passed | kickoff, Spec definition PASSED, exit 0, revisão 6 |
| npm run check:plan-definition -- documentation/features/global/supabase-replacement-with-drizzle/plan.md | passed | kickoff antes de status, Plan definition PASSED, exit 0 |
| npm view drizzle-orm@0.45.3 version | passed | 0.45.3, read-only |
| npm view drizzle-kit@0.31.11 version | passed | 0.31.11, read-only |

### Histórico de execução

### Evento C0-01 — 2026-10-01

Manifest Server adicionou versões exatas contratadas orm/kit. HEAD/base inalterados; nenhum runtime alterado. EV-10/EV-12 e sensores code/types/unit/architecture permanecem pending; fonte do lockfile será npm install. Gates documentais após kickoff passaram, exit 0.

### Evento C0-02 — lockfile gerado

Fonte apps/server/package.json; gerador npm install --ignore-scripts (scripts de lifecycle não necessários à resolução). Output package-lock.json, diff observado +1099/-0; npm ainda em andamento. Warnings EBADENGINE: Node local 22.17.0 abaixo do mínimo de dependências preexistentes Babel/React Router/PostHog; não declarar runtime validado. EV-10/EV-12 pending; próxima ação confirmar exit e sensores.

C0-02 resultado final: exit 0; 355 added/33 removed, lockfile +1099/-0. Audit reportou 62 vulnerabilidades agregadas; nenhuma correção indiscriminada autorizada fora da Spec. Warnings engine permanecem registrados. Próxima ação check:code/check:types/test:unit e reviewer de coordenação.

### Sensor C0 — check:code

`npm run check:code` passed exit 0: 7/7 workspaces, 3.582s. Log local /tmp/stardust-drizzle-check-code.log; warnings legados de hooks permanecem, sem mudança de source. check:types/test:unit ainda running. Lockfile confirmou orm 0.45.3 e kit 0.31.11. Reviewer de coordenação ativo read-only; C0 ainda in_progress até sensores e veredito.

Sensor C0 `npm run check:types` passed exit 0, 7/7 workspaces, 1m34.913s; log /tmp/stardust-drizzle-check-types.log. Node warning Studio não impediu types. Reviewer confirmou `npm ls drizzle-orm drizzle-kit postgres --workspace @stardust/server --depth=0` exit0 (0.45.3/0.31.11/3.4.9). Unit global ainda em execução.

Sensor C0 `npm run test:unit` passed exit0, 5/5 workspaces, 1m53.353s; log /tmp/stardust-drizzle-unit.log. Core176/638, Server168/325, Studio14/64 suites/tests; Web resultado no log, LSP1/1. Resultados atuais apenas do C0, sem prova de adapters futuros.

### Review C0 e activation D1/S1

Reviewer coordination accepted C0 inicial, revision6, base+diff, sem finding bloqueante; grafo57 registros novos/zero version churn. No change em Rules já explícitas. Web dependencies adiadas e aceite não cobre CA20/22 finais. Unit concluiu exit0, Web115 suites/480tests; review será retomado no próximo diff C0/C1.

Assignment D1 ativa tentativa1; revisão6, base8f9f71ac3dc4bd42312f5890f05c5da02c8814a9. Paths permitidos e Rules/exits reproduzidos abaixo; todos demais paths proibidos; RP/JN herdados do crosswalk Spec, SHI não aplicável; Design não afetado. Nenhuma evidência runtime passed.

### D1

- **Status/owner:** `in_progress`; Builder Database.
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


Assignment S1 ativa tentativa1; revisão6, base8f9f71ac3dc4bd42312f5890f05c5da02c8814a9. Paths permitidos e Rules/exits reproduzidos abaixo; todos demais paths proibidos; RP/JN herdados do crosswalk Spec, SHI não aplicável; Design não afetado. Nenhuma evidência runtime passed.

### S1

- **Status/owner:** `in_progress`; Builder Server.
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


D1/S1 activation pós-registro: Builders estáveis builder_database e builder_server ativados; definition gates reexecutados passed exit0. Protocolo de ACK imediato por mutation para assegurar persistência antes da próxima mudança/sensor.

### Evento S1-01 — contratos Core

Builder Server criou os dois ports issue/verify/fetchAttempt e type-only exports exatamente nos três paths S1. HEAD/base congelados; RF06/07/10 CA12/20. Nenhum framework/SDK/HTTP runtime; nenhum teste de interface. EV10 e Core code/types/unit/architecture/coverage pending; sensor C0 global anterior stale para Core após source novo, sem invalidar review exclusivo manifest/lockfile C0. Próxima ação inspecionar paths e executar sensores atuais.

D1 env01: ambiente efêmero isolado criado pelo Builder Database (container stardust-drizzle-d1-replay image public.ecr.aws/supabase/postgres:17.6.1.143, tmpfs/no-port/no-mount). Credencial exclusivamente root .env.local em memória; nenhuma alteração de repositório/dado app. RF03 CA04/05, EV03 ainda pending. Cleanup docker rm -f stardust-drizzle-d1-replay após captura; próxima ação replay/catalogo.

Sensor conformance wave1: `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` exit1, candidato incompleto conforme Plan; paths futuros ainda pending, log /tmp/stardust-drizzle-conformance-wave1.log. Não usado como passed integrado. Inspeção S1 confirmou assinaturas e imports/barrel exatos.

### ACH-01 — replay isolado bootstrap

D1 env02:24 arquivos extraídos do commit fonte em /tmp/stardust-d1-replay; replay container falhou na quarta migration após três aplicadas, storage.objects ausente. Bootstrap imagem exige supabase_admin como owner do schema. Nenhum diff do repo/dado app; EV03 pending, catálogo parcial inválido. Correção automática: recriar clone efêmero ou limpar somente public isolado, aplicar compatibilidade storage pelo owner correto e replay completo. No change Rules: procedimento local/documentação já delimita ownership/clone e nenhuma parity presumida.

Relato S1 focado: Core code/architecture exit0 (968files16warnings preexistentes;792modules1432deps). Ainda aguardam validação oficial principal e types/unit.

### ACH-02 — aliases Core nos ports novos

Sensor oficial `npm run check:types` S1 exit2 (26.234s): TS2307 aliases globais novos precisam /index pela resolução package imports. Builder corrigirá apenas2 imports nos ports; contratos intactos. code global exit0 7/7 (6.693s) e architecture Core exit0 (792modules1432dependencies), anteriores à correção e stale para S1. Log /tmp/stardust-drizzle-s1-types.log. No change Rule: seguir aliases do pacote já é guidance claro. Próxima ação persistir correction e rerodar types/code/architecture.

### Evento S1-02 — correction ACH02

Dois imports agora terminam /index conforme alias real Core; somente os dois ports novos. Assinaturas intactas, HEAD/base inalterados. code/types/architecture stale para essa parcela; unit sem mudança comportamental continua pending. ACH02 aguardando confirmação types.

D1 env03 correction ACH01: clone stardust-drizzle-d1-replay somente public limpo/recriado sob supabase_admin, storage-compatibility do repo aplicado e todas24migrations do commit fonte replay exit0. Sem app DB/source mutation. RF03 CA04/05; EV03 parcial, catálogo/manifests ainda não capturados. ACH01 replay resolvido, cleanup anterior mantido. No change guidance existente de owner/stack isolado.
Conformance após S1 correction exit1 (paths futuros pending); candidato integrado não aprovado.

Sensor/artifact S1 coverage: `npm run test:coverage -w @stardust/core` exit0,176suites/638tests,41.598s; Jest gerou relatório de cobertura local (fonte source/test Core; sem mudança baseline). Statements81.67%, branches65.89%,functions64.43%,lines81.34%. Import-only correction02 não altera comportamento coberto; freshness observada na execução. Ratchet pending.

Sensores S1 atuais: code global exit0; Core architecture exit0,792modules1432dependencies. `npm run check:coverage -- @stardust/core` exit0: quatro métricas iguais baseline81.34/81.67/64.43/65.89. Builder relatou unit176/638exit0(102.199s), principal não usa relato como evidência oficial; global unit e test-integrity iniciados. Types oficial running.

Sensores S1 correction02: `npm run check:types` exit0 7/7,42.968s; ACH02 resolvido. `npm run check:test-integrity` exit0,3sources excluídas (ports/barrel),0testable,1test preexistente checker; não exige teste de interface. Logs /tmp/stardust-drizzle-s1-types.log e /tmp/stardust-drizzle-s1-integrity.log. code e architecture atuais já passed; unit oficial pending.

D1 captura catálogo isolado (relato Builder, inspeção oficial pendente): /tmp/stardust-d1-catalog.json,39tables/220columns/117constraints/67indexes/7enums/7views/40functions/0triggers/29policies,1158relation grants86function grants21memberships,defaultACL0. Nenhum dado de usuários/segredos. Manifest/model parity será conferido no candidato; não prova parity Dev/Prod. EV03 fase partial pending.

Sensor S1 `npm run test:unit` oficial passed exit0,5/5workspaces1m14.357s, log /tmp/stardust-drizzle-s1-unit.log. Core176/638,Server168/325,Web115/480,Studio14/64,LSP1/1; freshness após correction02. Nenhum source adicional. Review S1 pending, CA12/20 finais continuam pending (apenas ports neste escopo).

### Review S1 e activation W1

Reviewer Server accepted S1 revision6/base+3paths, sem finding bloqueante. Review focado limitado ports; unit global reviewer descreveu snapshot pending, principal confirmou logo antes exit0, freshness atual. No change Rules suficientes. CA12/20 completos pending.

Assignment W1 ativa tentativa1, revisão6, base congelada. RP/JN herdados da Spec, SHI não aplicável. Paths/Rules/RFCA/exits exatos abaixo; todo outro path proibido, incluindoUI/composição W2 e manifests. Design sem mudança W1, handoff contexto; capturas browser contratadas após composiçãoW2.

### W1

- **Status/owner:** `in_progress`; Builder Web.
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
- **Resultado observável:** Entregar BFF same-origin receipt/resume/stream, bypass dos três paths exatos e transporte SseProfileChannel; services continuam implementando ports. Cookies/Origin/precedência/abort/no buffering testados nas rotas; rawBody finito habilita mocks sem backend real. Testes browser existentes e novos permanecem neste owner e serão finalizados após W2.
- **Rules:** Paths relativos a `documentation/rules/`, salvo autoridades indicadas: web-application-rules.md, web-app-routes-testing-rules.md, rest-layer-rules.md, realtime-rules.md, rpc-layer-rules.md, code-conventions-rules.md.
- **Exit:** Rotas Next cobrem status/body/cookie/Origin/stream/abort; CI-02/CI-03/CI-04/CI-05/CI-06 aplicáveis; EV-07/EV-09 de BFF e review W1 clear. Browser completo/happy path real são gates finais após W2, não prova presumida nesta fase.


### Evento D1-01 — geração catálogo/models/types

Output98paths D1 a partir /tmp/stardust-d1-catalog.json (replay24commitfonte), gerador temporário /tmp/stardust-d1-generate.py, capture /tmp/stardust-d1-catalog.py; nenhuma migration Generate criada/alterada. Manifest46models/table+enum e infer types/barrels/schema; RF01/02/03/10 CA04/05/20. Principal inspecionou JSON de fonte39tables220columns117constraints67indexes7enums7views40functions29policies; commit exato fonte e24hashes registrados. code/types/architecture/parity DB EV03/10 pending; globais anteriores stale para Server. Lista factual output:

```text
apps/server/src/database/drizzle/legacy-schema-manifest.json
apps/server/src/database/drizzle/models/auth/api-key-model.ts
apps/server/src/database/drizzle/models/auth/index.ts
apps/server/src/database/drizzle/models/challenging/category-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-category-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-code-execution-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-difficulty-level-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-source-model.ts
apps/server/src/database/drizzle/models/challenging/challenge-vote-model.ts
apps/server/src/database/drizzle/models/challenging/index.ts
apps/server/src/database/drizzle/models/challenging/solution-model.ts
apps/server/src/database/drizzle/models/conversation/chat-message-model.ts
apps/server/src/database/drizzle/models/conversation/chat-message-sender-model.ts
apps/server/src/database/drizzle/models/conversation/chat-model.ts
apps/server/src/database/drizzle/models/conversation/index.ts
apps/server/src/database/drizzle/models/forum/challenge-comment-model.ts
apps/server/src/database/drizzle/models/forum/comment-model.ts
apps/server/src/database/drizzle/models/forum/index.ts
apps/server/src/database/drizzle/models/forum/solution-comment-model.ts
apps/server/src/database/drizzle/models/index.ts
apps/server/src/database/drizzle/models/lesson/index.ts
apps/server/src/database/drizzle/models/lesson/question-model.ts
apps/server/src/database/drizzle/models/manual/guide-category-model.ts
apps/server/src/database/drizzle/models/manual/guide-model.ts
apps/server/src/database/drizzle/models/manual/index.ts
apps/server/src/database/drizzle/models/playground/index.ts
apps/server/src/database/drizzle/models/playground/snippet-model.ts
apps/server/src/database/drizzle/models/profile/achievement-model.ts
apps/server/src/database/drizzle/models/profile/index.ts
apps/server/src/database/drizzle/models/profile/note-model.ts
apps/server/src/database/drizzle/models/profile/user-acquired-avatar-model.ts
apps/server/src/database/drizzle/models/profile/user-acquired-insignia-model.ts
apps/server/src/database/drizzle/models/profile/user-acquired-rocket-model.ts
apps/server/src/database/drizzle/models/profile/user-challenge-vote-model.ts
apps/server/src/database/drizzle/models/profile/user-completed-challenge-model.ts
apps/server/src/database/drizzle/models/profile/user-model.ts
apps/server/src/database/drizzle/models/profile/user-recently-unlocked-star-model.ts
apps/server/src/database/drizzle/models/profile/user-rescuable-achievement-model.ts
apps/server/src/database/drizzle/models/profile/user-unlocked-achievement-model.ts
apps/server/src/database/drizzle/models/profile/user-unlocked-star-model.ts
apps/server/src/database/drizzle/models/profile/user-upvoted-comment-model.ts
apps/server/src/database/drizzle/models/profile/user-upvoted-solution-model.ts
apps/server/src/database/drizzle/models/ranking/index.ts
apps/server/src/database/drizzle/models/ranking/ranking-status-model.ts
apps/server/src/database/drizzle/models/ranking/ranking-user-model.ts
apps/server/src/database/drizzle/models/ranking/tier-model.ts
apps/server/src/database/drizzle/models/reporting/feedback-intent-model.ts
apps/server/src/database/drizzle/models/reporting/feedback-message-attachment-model.ts
apps/server/src/database/drizzle/models/reporting/feedback-message-model.ts
apps/server/src/database/drizzle/models/reporting/feedback-report-model.ts
apps/server/src/database/drizzle/models/reporting/index.ts
apps/server/src/database/drizzle/models/shop/avatar-model.ts
apps/server/src/database/drizzle/models/shop/index.ts
apps/server/src/database/drizzle/models/shop/insignia-model.ts
apps/server/src/database/drizzle/models/shop/insignia-role-model.ts
apps/server/src/database/drizzle/models/shop/rocket-model.ts
apps/server/src/database/drizzle/models/space/index.ts
apps/server/src/database/drizzle/models/space/planet-model.ts
apps/server/src/database/drizzle/models/space/star-model.ts
apps/server/src/database/drizzle/schema.ts
apps/server/src/database/drizzle/types/DrizzleInsigniaRole.ts
apps/server/src/database/drizzle/types/entities/auth/DrizzleApiKey.ts
apps/server/src/database/drizzle/types/entities/auth/index.ts
apps/server/src/database/drizzle/types/entities/challenging/DrizzleCategory.ts
apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallenge.ts
apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeCodeExecution.ts
apps/server/src/database/drizzle/types/entities/challenging/DrizzleChallengeSource.ts
apps/server/src/database/drizzle/types/entities/challenging/DrizzleSolution.ts
apps/server/src/database/drizzle/types/entities/challenging/index.ts
apps/server/src/database/drizzle/types/entities/conversation/DrizzleChat.ts
apps/server/src/database/drizzle/types/entities/conversation/DrizzleChatMessage.ts
apps/server/src/database/drizzle/types/entities/conversation/index.ts
apps/server/src/database/drizzle/types/entities/forum/DrizzleComment.ts
apps/server/src/database/drizzle/types/entities/forum/index.ts
apps/server/src/database/drizzle/types/entities/index.ts
apps/server/src/database/drizzle/types/entities/manual/DrizzleGuide.ts
apps/server/src/database/drizzle/types/entities/manual/index.ts
apps/server/src/database/drizzle/types/entities/playground/DrizzleSnippet.ts
apps/server/src/database/drizzle/types/entities/playground/index.ts
apps/server/src/database/drizzle/types/entities/profile/DrizzleAchievement.ts
apps/server/src/database/drizzle/types/entities/profile/DrizzleNote.ts
apps/server/src/database/drizzle/types/entities/profile/DrizzleUser.ts
apps/server/src/database/drizzle/types/entities/profile/index.ts
apps/server/src/database/drizzle/types/entities/ranking/DrizzleRankingUser.ts
apps/server/src/database/drizzle/types/entities/ranking/DrizzleTier.ts
apps/server/src/database/drizzle/types/entities/ranking/index.ts
apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackMessage.ts
apps/server/src/database/drizzle/types/entities/reporting/DrizzleFeedbackReport.ts
apps/server/src/database/drizzle/types/entities/reporting/index.ts
apps/server/src/database/drizzle/types/entities/shop/DrizzleAvatar.ts
apps/server/src/database/drizzle/types/entities/shop/DrizzleInsignia.ts
apps/server/src/database/drizzle/types/entities/shop/DrizzleRocket.ts
apps/server/src/database/drizzle/types/entities/shop/index.ts
apps/server/src/database/drizzle/types/entities/space/DrizzlePlanet.ts
apps/server/src/database/drizzle/types/entities/space/DrizzleStar.ts
apps/server/src/database/drizzle/types/entities/space/index.ts
apps/server/src/database/drizzle/types/index.ts
```

### ACH-03 — mock rawBody atravessa registration

CodeGraph confirmou apps/web/src/app/api/tests/server/route.ts schema strips unknown rawBody e ServerMockRoute.ts tem body:unknown sem rawBody; esses2paths não pertencem mapa contratado. Decisão: sem editar paths foraContract, factory Mock/Registry (W1) estendem tipo localmente e codificam rawBody em envelope distintivo de body existente, Registry decodifica antes do handler. Nenhuma mudança de semântica rawBody/JSON ou produto; validar round-trip e compatibilidade em suites route contratadas. Finding pending até teste. No change Rules: preservação boundary test-only e escopo já claros; detalhe wire local não cria convenção global.

### Evento D1-02 — infraestrutura

Gerador temporário /tmp/stardust-d1-infra.py criou7paths exclusivosD1; acesso user explícito, singleton max10/timeouts10/close5,shutdown, errors AppError,config canonical; estas alegações aguardam inspeção/sensores oficiais. RF01/02/03/10 CA04/05/20;EV03/10 code/types/architecture/parity pending. HEAD/base inalterados.

```text
apps/server/drizzle.config.ts
apps/server/src/database/drizzle/DatabaseAccess.ts
apps/server/src/database/drizzle/DrizzleClient.ts
apps/server/src/database/drizzle/errors/DrizzleDatabaseError.ts
apps/server/src/database/drizzle/errors/index.ts
apps/server/src/database/drizzle/DrizzleRepository.ts
apps/server/src/database/drizzle/index.ts
```

### Evento W1-01 — transporte

Mutation atômica11paths: apps/web/src/constants/cookies.ts,rest/next/NextRestClient.ts,rest/services/AuthService.ts,OnboardingService.ts,index.ts,middleware.ts,realtime/sse/channels/SseProfileChannel.ts,index.ts,app/api/auth/sign-up/route.ts,onboarding-attempt/route.ts,profile-events/route.ts. RF07/09/10/12 CA12/13/18/19/20/22; implementação de cookie/Origin/headers/abort/SSE aguarda inspeção e tests. EV07/09 W1 code/types/unit/architecture pending; globais anteriores stale para Web.

### ACH-04 — owner no replay legado

Builder identificou migrations replay como supabase_admin no clone, mas runner legacy aplica como postgres. Manifest registrou owner real do ensaio porém não é autoridade do owner legado; access parity stale/pending. Correção: preparar clone com scripts roles/storage reais e replay como postgres, recapturar catálogo exato; não normalizar owner arbitrariamente. No change Rules: parity real e fonte runner já claros. Models atuais estruturais aguardam comparação após novo replay.

D1 env04 tentativa2: clone public reset e storage.objects ownerpostgres; primeira3migrations passaram, quarta falhou policies storage antigas remanescentes. Nenhum repo/app DB alterado; access manifest permanece stale. Próxima correção limpar storage.objects somente clone e reconstruir bootstrap compatibility com ownerpostgres antes replay24completo. No change Rule; estado clone incompleto deve ser descartado.

D1 env05 mutation clone somente: public/storage.objects isolados limpos; repo storage compatibility reconstruída ownerpostgres;24migrations aspostgres ON_ERROR_STOP exit0. Sem app DB/source alteração,cleanup conhecido. ACH04 catálogo antigo stale até recaptura/manifest. Correção planejada também6projection types (User/RankingUser/Challenge/Comment/Solution/FeedbackReport) para Pick/inferred model em vez duplicação de shape de row; No change Rules/Spec já exigem inferência de joins.

### Evento D1-03 — owner e projections

Manifest recapturado do replay completo como postgres (39tables40functions ownerpostgres); seisprojection types inferem campos de models, sem shapes paralelos. Paths: legacy-schema-manifest.json e types/entities/profile/DrizzleUser.ts,ranking/DrizzleRankingUser.ts,challenging/DrizzleChallenge.ts,challenging/DrizzleSolution.ts,forum/DrizzleComment.ts,reporting/DrizzleFeedbackReport.ts na raiz drizzle. RF01/02/03/10 CA04/05/20; ACH04 aguarda parity/reviewer,EV03/10 stale até validação,HEAD/base inalterados. Próxima ação formatoD1 e sensores.

D1-04 artifact/source formatting: node_modules/.bin/biome format --write [105paths list /tmp/stardust-d1-allpaths.json] exit0,formatted105fixed55. Apenas D1paths,source catálogo/modelsgeneration descritos; RF10 CA20. Nenhuma reviewaceitaD1 anterior; code/types/architecture/parity pending, freshness reset para diff formatado.

### Evento W1-02 — mocks e regressões BFF

6paths apps/web/src/app/tests/shared/mocks/ServerMock.ts,ServerMockRegistry.ts; app/api/tests/server/[...path]/route.ts; app/api/auth/sign-up/tests/route.test.ts,onboarding-attempt/tests/route.test.ts,profile-events/tests/route.test.ts. Testes protegem Origin/schema/cookie/no-leak/status/error/null/SSEframes/authprecedence/abort/cancel e mockrawBody roundtrip; source/baselineHEAD inalterados. RF07/09/10/12 CA12/13/18/19/20/22; todos sensores EV07/09 pending,ACH03 aguardando teste. Próxima ação formatarW1/rodar fronteiras.
D1 full-conformance rerun exit1 paths future pending;codeServer exit0,sessõestypes/architecture running.

### ACH-05 — import DTO do model star

`npm run check:types -w @stardust/server` exit2 TS2307 apps/server/src/database/drizzle/models/space/star-model.ts:12 @stardust/core/lesson/domain/dtos não exportado. Correction mesma assignmentD1,usar entrypoint Core real permitido. codeServerexit0,868files19warnings legados;architectureexit0,788modules1389deps,logs /tmp/stardust-drizzle-d1-{code,types,architecture}.log. Evidências code/types/architecture deverão atualizar após importcorrection. No change Rules aliases existentes claros;não alterar ContractCore.

W1-03: teste profile-events/tests/route.test.ts usa PUT registration realZod,protege rawBody envelope sem editar2paths foraContract. Biomeformat17paths exit0fixed9 (SseProfileChannel,3routes,3tests,2mocks). Source exactW1;EV07/09 pending,code/types/unit invalidated pending;ACH03 resolvido somente após roundtrip teste passed.

D1-05 correctionACH05: star-model.ts importtype @stardust/core/lesson/dtos real,format nofix. EV03/10/sensores stale até rerun. Oficial parity metadata `node --import tsx /tmp/stardust-d1-metadata.ts` exit0,39tables7enums220columns117constraints13indexes,zero differences contra manifesto (columnname/type/null/default,constraintnames,FKcolumns/target/actions,enumvalues eindexnames);source helper temporário,output /tmp/stardust-drizzle-d1-parity.log. Aliasdelta é somente typeimport semimpactmetadata,rerunagendado. Não substitui SQL/catalog real D2.

### ACH-06 — environment Node Jest Web

3BFF suites falham antes de assertions: _moduleMocker.clearMocksOnScope notfunction. Web Jest/runtime30.4.2 resolve jest-environment-node29.7.0 herdadoServer,jsdom30.4.1. Correction pelo principal C0: adicionar devDependency Web environmentNode compat30,gerarlocknpm;sem reduzir testes/alterar Serverrunner. No change Rules testesNodefrontend boundary já permitidos;dependência faltante local.

W1-04:signup/tests/route.test.ts corrige3types testes newDate(cookieexpires),jest.replacePropertyNODE_ENV,headersRecord;format1passed;RF07/12CA12/13/22,mesmo comportamento protegido. Types/testsevidencestale até rerun.

Assignment C0tentativa2 ativa mesmos3paths card eRules/exits;RF05/10/12CA20/22,RP/JN conformeSpec SHINA. ACH06 environmentNodeWeb,reviewcoordinationC0stale antesmanifestpatch. npmview30.4.2E404 (nenhumdiff),usar30.4.1compatíveljsdomverificável.

### ACH-07 — NULL placement indexesDESC

Drizzle0.45.3.desc mantém nullsLast enquantolegacyDESC temNULLSFIRST;corrigir4models(authapi-key,challengingchallenge-code-execution,reportingfeedback-report,profilenote) para .desc().nullsFirst explícito,especialmentelastAdminMessageAtnullable. Parity anteriorverificou nomes,não nulls,insuficienteindexdefinition;EV03pending ehelper será estendido. No changeRulesSchema parityjáclaro.

W1 mutation04 inspeção Builder:castheaders nãoaplicado;relato factual corrigido,somente expires/NODEENV resolvidos;headersTS2322aindapending,próximacorrectiongeneric it.each.

D1-06: api-key-model, challenge-code-execution-model, feedback-report-model e note-model agora usam .desc().nullsFirst(). RF-03/RF-10, CA-04/CA-05/CA-20; sensores anteriores stale para esses paths. Format dos quatro arquivos passou. ACH-07 aguarda verificação completa. Houve colisão de helper temporário /tmp/stardust-d1-metadata.ts entre Builder e principal, sem conflito no repo; principal passará a usar prefixo stardust-principal, Builder stardust-builder-database. Log da verificação anterior preservado; nova verificação terá fonte exclusiva.

C0-03: manifest Web declara environment Node 30.4.1, disponível no registry e compatível com o jsdom 30.4.1 existente. RF-12, CA-22; nenhum teste foi enfraquecido. Lockfile e sensores pendentes, aceite C0 anterior stale. Próxima ação: npm install para gerar resolução npm.

W1-05: signup/tests/route.test.ts aplica generic explícito à matriz de headers, corrigindo TS2322 pendente. RF-07/RF-12, CA-12/CA-13/CA-22; assertions preservadas, format passou. Types/BFF permanecem pending até npm resolver o environment Node compatível.

C0-04: npm install --ignore-scripts exit0; output package-lock.json gerado do manifest Web, log /tmp/stardust-drizzle-c0-install2.log. Nenhuma baseline de teste foi alterada; warning de engine existente permanece. Review C0 anterior stale; novo review após sensores.

Oficial D1 parity atual `node --import tsx /tmp/stardust-principal-d1-metadata.ts` exit0, output /tmp/stardust-drizzle-d1-parity-current.log. Conferiu24hashes contra git fonte,39tabelas220colunas (tipo/null/default),7enums ordenados,117constraints (nomes/colunas/FKs/actions/checks) e13índices (nome/colunas/método/unique/ordem/nulls/predicate). Zero diferenças. Helper exclusivo principal, não versionado; não substitui replay do SQL gerado e cenários de adoção D2. ACH-04/ACH-05/ACH-07 aguardam types/review para fechamento final.

Sensor atual `npm run check:types` exit2, 6/7workspaces: alias @stardust/core/lesson/dtos continua inválido em star-model.ts. ACH-05 permanece aberto; Reviewer Database confirmou IR-D1-01, nenhuma evidência D1 type aprovada. Correction precisa usar localização/entrypoint real de QuestionDto/TextBlockDto; no change Rules já explícitas. code global exit0 7/7 6.07s e architecture Server exit0 788/1389; ficarão stale apenas para a correção de import.

W1 BFF oficial: duas suites/13tests passaram, signup suite não iniciou por import ESM next-safe-action via cookieActions no NextRestClient. Jest Node conflict ACH-06 corrigido (environment30.4.1 npm ls exit0). Novo finding ACH-08: isolar boundary cookieActions imediato no teste do cliente, manter execução real BFF/NextRestClient e assertions. Global unit registrará falha correspondente; nenhuma evidência integrada green. Disposição No change: mocking de boundary externo segue Rules existentes.

W1-06: signup/tests/route.test.ts isola cookieActions RPC externo via jest.mock; mantém cliente NextRestClient real e BFF real. Source de produção inalterado. RF-07/RF-12, CA-12/CA-13/CA-22; Biome passou, EV-07/EV-09 aguardam rerun oficial.

D1 diagnosis ACH-05: CodeGraph dos mappers legados e package exports confirmam QuestionDto em @stardust/core/lesson/entities/dtos e TextBlockDto em @stardust/core/global/entities/dtos. Os dois aliases anteriores foram supostos sem verificação suficiente; não eram exports reais. Correção atual preservará os DTOs usados pelo legado. Lição No change: verificar exports/consumidores existentes antes de alterar import; Rule já exige fronteira válida.

D1-07: star-model.ts divide import types nos dois exports Core reais, idênticos aos consumidores legados. RF-01/RF-03/RF-10, CA-04/CA-20; SQL/models não mudam em runtime, format passou. Types/code/architecture precisam capturas atuais; review failed IR-D1-01 permanece até re-review.

### ACH-09 — headers do proxy BFF

Node fetch entrega corpo decodificado; propagar content-encoding/content-length do upstream pode resultar em double decoding ou tamanho incorreto. Headers hop-by-hop também não pertencem à resposta final. Correction W1 nos dois handlers e respectivas suites remove esses headers, preservando payload/status e headers end-to-end contratados. RF-07/RF-09/RF-12, CA-12/CA-18/CA-19/CA-22. Evidência W1 afetada fica stale após patch; disposition No change nas Rules, detalhe de transporte já é responsabilidade da borda.

W1 sensor oficial BFF após mutation06: três suites/25tests passed exit0,0.764s, /tmp/stardust-drizzle-w1-bff-current.log. ACH-03 rawBody wire e ACH-08 ESM boundary resolvidos; headers correction ACH-09 ainda não executada, próxima captura substituirá esta. Globalunit anterior exit1,1m37.314s, por signup parse snapshot pré-mutation06; manter failed até rerun. npm ls Server/Web exit0: orm0.45.3,kit0.31.11,postgres3.4.9 e environmentNode30.4.1.

D1 sensores oficiais atuais: `npm run check:types -w @stardust/server` exit0 (/tmp/stardust-drizzle-d1-types-current.log), `check:code -w @stardust/server` exit0 (/tmp/stardust-drizzle-d1-code-current.log), `check:architecture -w @stardust/server` exit0 (/tmp/stardust-drizzle-d1-architecture.log). Import correction07 confirma resolução de ACH-05 no sensor; IR-D1-01 aguarda mesmo Reviewer. Parity de owner/hashes/indexNULLS conferida independentemente; ACH-04/ACH-07 resolvidos no escopo D1, sem aceite runtime D2.

W1-07: handlers signup/profile-events e suas suites removem content-encoding/content-length e headers hop-by-hop, mantendo status/body/Retry-After/headers SSE; tests assertions reforçadas. RF-07/RF-09/RF-12, CA-12/CA-18/CA-19/CA-22. Biome4paths passou, fixed1; EV-07/EV-09 anterior stale para essas duas suites, novo BFF rerun necessário. Registry test-only global temporário exige Jest antes de Playwright, sem concorrência.

### Review D1/C0 e activation D2

Reviewer Database accepted D1 atual após imports reais/typecheck; IR-D1-01 resolvido, sem findings bloqueantes. Reviewer coordination accepted C0 tentativa2:69 registros novos no lock, zero version/resolution churn/removals, Nodeenvironment Web correto. Criteria finais não aprovados por esses reviews.

W1 BFF pós-mutation07 oficial exit0,3suites25tests0.701s; ACH-09 resolvido. Outros paths browser W1 ainda pending.

Assignment D2 ativa, tentativa1/revisão6/base congelada. Paths/Rules/RFCA/resultados/exits abaixo; RP/JN herdados da Spec,SHI não aplicável. Somente estes115paths e finalização de exports D1 index pelo mesmo owner já prevista no Plan (registrar a alteração específica); todo outro path proibido. Manifest/legacy capturados e clone isolado pronto, runtime novo ainda não provado. Design não afetado.

### D2

- **Status/owner:** `in_progress`; Builder Database.
- **Dependências/paralelismo:** D1; paralelo W1.
- **Paths:** 115 paths exclusivos abaixo, com classificação herdada da Spec.

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
  - `apps/server/supabase/schemas/schema.sql` — Remove.
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
- **Exit:** CI-02/CI-03/CI-05/CI-06/CI-07/CI-09 aplicáveis; EV-03 e parcelas de EV-04 de catálogo/SQL/Data API/clone aprovadas e review D2 clear. A parcela de HTTP legítimo de EV-04 aguarda composição S2 e integração C2; o gate D2 não declara essa parcela atendida. SQL/journal/snapshots Generate via Kit fixado; legado só removido após captura/restauração/adoção/inversa demonstradas. EV-01/EV-02 permanecem dependentes de S2.


D2-01: quatro paths auth de mapper/repository/barrels criados. Seis métodos do port implementados com inferência de rows/inserts; public só admite bootstrap findByHash, writes dependem do actor verificado. RF-01/RF-02/RF-12, CA-01/CA-03/CA-20/CA-22; Biome format4paths exit0 fixed1. Alegações semânticas aguardam inspeção/runtime; Server code/types/architecture anteriores stale para novo D2, EV-01/EV-02 pending até S2.

### Evento W1-08 — cobertura browser

Paths: apps/web/src/app/tests/auth/sign-up.test.ts, account-confirmation.test.ts e social-account-confirmation.test.ts. Cadastro acrescenta três cenários API/middleware executáveis agora; expectativas de retomada/sucesso dependem de W2. Email testa id correspondente/refetch; social cobre oito cenários nos dois viewports, com screenshots e CTA, a executar após composição W2. RF-07/RF-09/RF-10/RF-12, CA-12/CA-13/CA-14/CA-15/CA-18/CA-19/CA-20/CA-22; contribuição confirmação RF-08/CA-16/CA-17 será validada na fase UI. Biome3files exit0 fixed3. Não há prova de browser ainda; code/types/unit/architecture e três casos iniciais middleware pendentes.

Os checkers de definição passaram novamente após a reconciliação documental; a ordem canônica da Evaluation foi mantida e o histórico preservado. Nenhum sensor de código foi declarado novo por essa alteração documental.

### Evento D2-02 — persistência lesson

Criados mappers/lesson/DrizzleQuestionMapper.ts, DrizzleTextBlockMapper.ts e index.ts; repositories/lesson/DrizzleQuestionsRepository.ts, DrizzleStoriesRepository.ts, DrizzleTextBlocksRepository.ts e index.ts. Leitura/escrita JSON de stars preservada; writes restritos a God/system conforme uso existente; áudio usa jsonb_set parametrizado por índice. RF-01/RF-02/RF-12, CA-01/CA-02/CA-03/CA-20/CA-22; Biome7paths passou fixed5. Sem prova de runtime ainda; EV-01/EV-02 pending, code/types/architecture do novo D2 pendentes.

Preflight estrutural wave2 executado exit1 por paths de fases futuras não implementados, log /tmp/stardust-drizzle-conformance-wave2.log; nenhum aceite integrado. Integridade wave2 exit1 requer diagnóstico imediato, sem alteração para ocultar falha.

### W1 mutation 09 e achados dos sensores
HEAD/base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9, Spec revisão 6. ACH-10: AccountDto.id opcional em fixture social produziu TS2345; accountId string explícito corrige sem cast. Path apps/web/src/app/tests/auth/social-account-confirmation.test.ts; RF07/09/10/12, CA18/19/20/22. Types stale até rerun; browser W2 permanece pendente. Web unit passou 118 suites/505 testes (40.548s); architecture passou 1624 módulos/2610 dependências; code passou com 171 warnings/2 infos. ACH-11: check:test-integrity rejeitou três paths Playwright explicitamente contratados; sensor failed, não excluir testes para contornar. No change Rules: tipos obrigatórios e localização dos testes já documentados.

### D2 mutation 03 — shop
Oito paths sob apps/server/src/database/drizzle/{mappers,repositories}/shop, mappers Avatar/Rocket/Insignia e repositories correspondentes, com index.ts. 21 métodos SQL e tipos inferidos; RF01/02/12 CA01/03/20/22. Builder format 8 arquivos exit 0; evidência oficial de tipos/runtime/review ainda pendente. Sensores Server posteriores aos novos paths precisam rerun.

### D2 mutation 04 e resolução de contexto parental
Quatro paths manual DrizzleGuideMapper/DrizzleGuidesRepository/index.ts, oito métodos e bulk upsert transacional. RF01/02/12 CA01/02/03/20/22; format quatro arquivos passou. Sem prova oficial runtime ainda. Spec S1 não exige métodos static: contexto parental obrigatório no constructor permite toPersistence(entity) retornar inferInsert completo sem FK fictícia, mantendo Core ports. Assignment same owner permite ajustar projeção DrizzlePlanet e fases no manifest D1; esses ajustes invalidarão aceite D1 afetado e exigem re-review D2 agregado.

### ACH-11 — assignment de reparo do sensor
Rules web-app-routes-testing-rules.md linhas 30/52 já exigem src/app/tests/**; regex atual src/app/.* /tests exige diretório adicional e rejeita caminho canônico. Reparo independente nos dois paths scripts/check-test-integrity.mjs e scripts/tests/check-test-integrity.test.mjs, sob principal, autorizado como correção de contaminação da evidência pelo workflow implement-spec. Sem alteração de Contract funcional/política; teste deve aceitar raiz e colocated, conservar rejeições existentes. Integrity permanece failed até captura oficial.

### ACH-12 — browser BFF revelou normalização de origem
Comando npm --workspace @stardust/web run test:integration -- src/app/tests/auth/sign-up.test.ts -g BFF middleware: exit1, 2 passed/1 failed em17.8s. Log /tmp/stardust-drizzle-w1-bff-browser.log, diagnóstico test-results ignorado. Origin127.0.0.1 legítimo rejeitado403 quando Next request.nextUrl usa localhost. Corrigir comparação com origem configurada CLIENT_ENV.stardustWebUrl nos dois paths W1 já atribuídos; testes cobrem diferença runtime/config e conservam rejeição cross-origin. Evidência BFF browser failed; code/types/unit/review W1 precisam refresh após mutation. No change Rules: origem confiável configurada e testing127.0.0.1 já explícitos.

### ACH-11 mutation 01
Corrigidos scripts/check-test-integrity.mjs e scripts/tests/check-test-integrity.test.mjs. Regex agora permite diretório tests na raiz app e em rotas aninhadas; regressão executa checker em Git fixture efêmera com ambos os caminhos canônicos. Nenhuma mudança de Rules ou teste funcional removido. Test:scripts focado e integrity pendentes; veredito coordination de manutenção deve ser solicitado.

### ACH-11 sensores oficiais
node --test scripts/tests/check-test-integrity.test.mjs exit0; npm run check:test-integrity exit0. Logs /tmp/stardust-drizzle-integrity-regression.log e /tmp/stardust-drizzle-wave2-integrity-current.log. Localizações documentadas aceitas sem remover checks/proibições. ACH-11 resolvido quanto aos sensores; revisão independente pendente.

### W1 mutation 10 — origem configurada
apps/web/src/app/api/auth/sign-up/route.ts e tests/route.test.ts corrigidos. Comparação usa origem configurada de CLIENT_ENV, mantendo rejeição de origem não confiável. Regressão cobre normalização localhost da NextURL com origem configurada127.0.0.1. Format2paths passou; RF07/10/12 CA12/18/20/22. BFF/types/unit/browser precisam refresh; ACH-12 pending até pass. ACH-11 regressão oficial contou7 testes (não10).

### D2 mutation 05 — conversation
Seis paths conversation sob mappers/repositories: DrizzleChatMapper, DrizzleChatMessageMapper, DrizzleChatsRepository, DrizzleChatMessagesRepository e index.ts. Contexto parental obrigatório evita placeholder, inserção de mensagem usa transação/lock de parent autorizado. RF01/02/12 CA01/02/03/20/22; format6paths exit0. Alegações de autorização/persistência aguardam inspeção e testes reais S2; Server sensors/review pendentes.

### Ambiente local Node
Node24.20.0 já instalado na máquina; usar PATH temporário em comandos futuros de runtime remove incompatibilidade com engines>=22.18/22.22 das bibliotecas existentes. Nenhuma mutação de package/lockfile/credenciais. Procedimento reversível por encerrar shell ou retirar prefixo PATH. Evidências anteriores mantêm versão original, não são consideradas reexecutadas.

### D2 mutation 06 — Notes e projeção Snippet
mappers/profile/DrizzleNoteMapper.ts e repositories/profile/DrizzleNotesRepository.ts criados. Cinco métodos com owner explícito, filtro título/count/order/pagination. RF01/02/12 CA01/03/20/22; format2paths exit0. Projeção author/avatar de DrizzleSnippet faltante em D1 pode ser completada pelo mesmo Builder em path existente de ownership D1 conforme contrato S1 de join shapes; invalida aceite D1 afetado, re-review D2 necessário. Ratchet Web usa chave literal @stardust/web; --help não suportado, execução diagnóstica falhou por chave desconhecida sem representar regressão cobertura.

### W1 evidências oficiais após origem configurada
Logs /tmp/stardust-drizzle-w1-bff-final.log (3suites26tests0.708s), types-final.log (exit0), code-final.log (exit0,171warnings2infos). Coverage /tmp/stardust-drizzle-w1-coverage.log exit0,118suites506tests64.365s; gerou apps/web/coverage/coverage-summary.json ignorado, sem dados sensíveis. Statements24.73/branches27.57/functions22.03/lines25.58, ratchet ainda pending. Unit executado pelo coverage com todas as suites; browser não pode ser declarado aprovado até rerun. RuntimeNode22.17.0. Nenhum source alterado.

### D2 mutation 07 — playground
types/entities/playground/DrizzleSnippet.ts atualizado por mesmo owner para projeção author/avatar inferida. Mappers/repositories playground DrizzleSnippetMapper/DrizzleSnippetsRepository/index.ts criados; cinco métodos, público limitado às linhas isPublic, privados owner e writes owner/god/system. RF01/02/12 CA01/03/20/22. Format5paths exit0; sensores/runtime ainda pendentes. Aceite D1 afetado marcado stale para Snippet; reviewer Database deve reavaliar diff conjunto D2/D1.

### W1 exits focados runtime
node scripts/check-coverage-baseline.mjs @stardust/web exit0, log /tmp/stardust-drizzle-w1-ratchet.log. Playwright três casos BFF middleware exit0,3/3,6.9s /tmp/stardust-drizzle-w1-bff-browser-final.log; signup201/receipt HttpOnly e headers privados ocultos, resume200, SSE200 raw, anônimo204/null, crossOrigin403 e receipt inválido limpo. Artefatos apps/web/playwright-report e test-results ignorados sem screenshots UI. ACH-12 resolvido. Evidência restrita BFF/mock testing, não prova VM01/02 nem UI W2. Reviewer Web ainda pending.

### Review Web W1 — assignment
Reviewer read-only pareado exclusivamente Builder Web W1, vinte paths listados Plan. Base8f9f71ac3dc4bd42312f5890f05c5da02c8814a9+diff atual, Spec6, Rules Web/rest/realtime/RPC/testing/code. Examinar status/body/cookies/Origin/preferência auth/abort/proxy/stream e raw mock; transport adapter terá testes consumidor W2. Evidências oficiais BFF26tests, Webcoverage506tests/ratchet, types/code/arch e3browserBFF. Sem aceitar VM/UI nem integração final por estes resultados.

### D2 checkpoint parcial e W1 handoff
Builder Database types checkpoint exit0 /tmp/stardust-builder-database-d2-types.log; principal ainda deve capturar oficialmente após conjunto D2. Doze ports implementados,13 restantes pendentes. Kit generate0000 autorizado como batch separado e será registrado antes replay. Builder Web finalreport source20paths pronto e revisão pareada em andamento; sem UI/VM/Server integrado declarado.

### D2 geração — ambiente guard e resolução
Root.env.local tem password/port local mas não SUPABASE_DATABASE_URL literal. Guard falhou antes geração, nenhum output/DB mutation. Procedimento autorizado derive postgres://postgres:[encoded password]@127.0.0.1:[root port]/postgres somente process.env, sem imprimir valor nem persistir. Fonte exclusiva root.env.local, URL encoding obrigatório; C1 export versionado ainda pending. No change Rules: fonte de credenciais local já explícita. Kit generate não conecta banco; ambientes remotos não autorizados por esse procedimento.

### Review W1 accepted
Implementation Reviewer Web aceitou vinte paths W1, Spec6/base+diff atual, sem finding bloqueante. Critérios CA12/13/18/19/20/22 somente contribuições BFF/transport; UI/timersServer/consumer adapter/retiradaSDK aguardamW2/S2/C2. Sem widget alterado W1, comparação visual não aplicável nesta fase. Aceite será stale se estes paths mudarem; correção checker fora desse aceite.

### D2 mutation 08 — baseline gerada
apps/server/src/database/drizzle/migrations/0000_baseline.sql e meta/{0000_snapshot.json,_journal.json} gerados exclusivamente pelo DrizzleKit0.31.11, comando node ../../node_modules/drizzle-kit/bin.cjs generate --name baseline a partir apps/server. Fonte schema.ts/modelsD1; URL derivada em memória somente requisito config, nenhuma conexãoDB. Tool exit0,39tabelas220colunas; log /tmp/stardust-builder-database-d2-baseline-generation.log. RF03 CA04/05/20, EV03 pending até replay/hash/catalog. Servertypes checkpoint oficial exit0 /tmp/stardust-drizzle-d2-types-checkpoint.log antes geraçãoSQL.

### Review coordination ACH-11 accepted
Reviewer read-only aceitou scripts/check-test-integrity.mjs e scripts/tests/check-test-integrity.test.mjs, Spec6/base+diff atual. Confirmou sete regressões/8tests alterados no integrity, restrições de força/proibições/pareamento intactas. No change Rules localização já explícita. Aceite separado C0 e feature integrada.

### Conformance wave2 atual
npm run check:spec-implementation -- spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9 exit1 /tmp/stardust-drizzle-conformance-wave2-current.log, esperado por fases pendentes, sem ignorar gate. Rerun acompanha novos paths Kit/repositories e W1 corrections. Candidato integrado permanece in_progress; sensores focados/review W1 não substituem contrato504paths.

### S2 preparação sem mutações
Reutilizar Builder Server estável para leitura CodeGraph dos paths S2 e contratos rev6 enquanto D2 conclui. Proibidas mutações/geração/sensores de runtime nesta preparação. Preparar receipt/elegibilidade/SSE/access/composição/fixtures/rest-client/testes; reportar contradições antes implementação. Não altera estado pending nem satisfaz dependências D2/C1.

### Freshness dos summaries
Corrigida descrição histórica open no Plan para in_progress atual; W1 accepted espelhado em summary Reviews, D1 Snippet stale explícito. S2 preparação read-only confirmou correções já contratadas para publicação signup elegível, SQL fixtures parametrizado e identidade MCP antes composição; nenhuma evidência nova runtime nem source mutation.

### D2 mutation 09 — Achievements
Criados mappers/profile/DrizzleAchievementMapper.ts e repositories/profile/DrizzleAchievementsRepository.ts. Nove operações do port, reads catálogo e unlocked autorizados, writes God/system, replaceMany transacional, insert inferido. Format2paths passou. RF01/02/12 CA01/02/03/20/22; RF03/04/05 e CA04/05/06 reportados pelo Builder pertencem migrations e não são provados por esta mutation. Types checkpoint anterior stale para novos paths; runtime/review pendentes.

### D2 mutation 10 — Tiers
mappers/ranking/DrizzleTierMapper.ts e repositories/ranking/DrizzleTiersRepository.ts criados/formatados. Três operações port preservadas com select/insert inferidos e catálogo por posição. RF01/02/12 CA01/02/03/20/22 contribuição de código, runtime/review pending. Falha anterior por diretório pai inexistente não alterou arquivos; criação de diretórios faz parte do batch autorizado. Servertypes anterior stale para dois novos paths.

### D2 mutation 11 — Rankers
Quatro paths ranking mapper/repository/barrels criados/formatados; cinco operações e projeção pública nome/slug/avatar/XP. Queries de users não têm status de ranking_users, mas tipo D1 exigia campo e Builder preencheu winner sintético. ACH-13: corrigir projeção D1 no path types/entities/ranking/DrizzleRankingUser.ts (mesmo owner) para campos reais exigidos S1 id/tierId/xp/position/user, remover valor sintético repository. Sem duplicar shape/raw alias ou alterar Core. Format4paths passou; types/arch/runtime/review pendentes. Aceite D1 projeção Ranker stale; correção/re-review D2 necessários. No change Rules: inferir projeção real já exigido.

### D2 mutation 12 — projeção real RankingUser
DrizzleRankingUser.ts usa Pick inferido id/tierId/xp/position mais nested user/avatar inferidos, mantendo DrizzleInsertRankingUser completo. DrizzleRankersRepository.ts retirou status winner fabricado. Format2paths exit0; RF01/02/12 CA01/02/03/20/22. ACH13 correção source concluída, types/runtime/review pendentes; D1 projeção ainda stale até review Database D2. Não houve alteração de Core ou SQL model.

### D2 mutation 13 — Stars
mappers/space/DrizzleStarMapper.ts e repositories/space/DrizzleStarsRepository.ts criados/formatados. Oito operações, contexto parental real, replaceMany transacional com lock parent e preservação JSON embarcado reportada pelo Builder. userCount/unlockCount dependem duas funções SQL próprias do manifest que0001 ainda deve preservar; sem PostgREST. RF01/02/12 CA01/02/03/20/22; types e comportamento real devem validar estas dependências, não presumir entrega antes customSQL. Space barrels aguardam Planet.

### D2 mutation 14 — Planets e pré-requisito manual
DrizzlePlanetMapper/index.ts, DrizzlePlanetsRepository/index.ts e types/entities/space/DrizzlePlanet.ts alterados/criados pelo mesmo owner. Projeção inferred stars/completionCount/userCount exigida S1; nove operações e funções SQL existentes manifest, God/system writes e batch transacional. Format5paths exit0. RF01/02/12 CA01/02/03/20/22; tipos/runtime/review pendentes, D1 projeçãoPlanet stale. Auditoria de nomes root.env.local confirmou ausência WEB_APP_E2E/ STUDIO_APP_E2E; valores nunca expostos. Pergunta ao usuário sobre preparar contas/variáveis, por restrição Spec340 de não mudar root.env. Bloqueia apenas VM futuros, implementação independente continua.

### D2 assignment projeção ChallengeSource
DrizzleChallengeSource.ts same owner D1 pode adicionar challenge:Pick<typeof challengeModel.$inferSelect,id/title/slug>|null conforme join exigido pelo mapper legado e contrato S1. Campo tabela/insert permanece inferido intacto, assinatura mapper preservada. Mudança futura invalidará aceite D1 correspondente e exigirá review D2. Atualmente17/25 ports; próximo sensor tipos oficial parcial, precedido preflight estrutural, não substitui runtime.

### ACH-14 — operação toDto obrigatória omitida
Spec S1§207 exige DrizzleRankerMapper.toDto(row:DrizzleRankingUser):RankingUserDto, além toEntity. Builder detectou omissão antes runtime. Corrigir somente mapper ranking autorizado D2 em batch separado, converter projeção real sem campos sintéticos. CA01/20, RF01/02/12; tipos/review desse mapper pendentes. No change Rules/Spec: assinatura já explícita, não enfraquecer contrato por método não usado atualmente.

### D2 mutation 15 — toDto Ranker
mappers/ranking/DrizzleRankerMapper.ts agora implementa toDto(row:DrizzleRankingUser):RankingUserDto conforme S1; toEntity delega conversão real. Format1path exit0. ACH14 source corrigido, validação oficial/review pending; RF01/02/12 CA01/20/22. Checkpoint2 iniciou antes desta mutation, portanto saída não será fresh para o helper novo mesmo se passar; evitar mutar paths durante sensor próximo.

### D2 checkpoint2 oficial
Log /tmp/stardust-drizzle-d2-types-checkpoint2.log exit0. Pré-flight estrutural /tmp/stardust-drizzle-conformance-wave2-current.log exit1 pelas fases futuras pendentes. Tipos snapshot17ports compilaram; mutation15 simultânea do helper toDto não é considerada validada por este resultado. Próximo sensor após candidato D2 completo. FindingsACH13/14 corrigidos source mas pending validação/review.

### D2 mutation 16 — ChallengeSources
mappers/challenging/DrizzleChallengeSourceMapper.ts e repositories/challenging/DrizzleChallengeSourcesRepository.ts criados; types/entities/challenging/DrizzleChallengeSource.ts completado com join real nullable. Nove operações e accessGod/system exigido para metadados administrativos, lista título/order/count/paginação; replaceMany transacional com locks e offset calculado além posições existentes/solicitadas em vez sentinel1_000_000 legado. Format3paths exit0, RF01/02/12 CA01/02/03/20/22. Review/runtime deve verificar guard/ordenação/relações. D1 projeçãoSource stale até D2, nenhum sensor novo declarado.

### D2 mutation 17 — execuções de desafio
mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts e repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts criados/formatados. Quatro operações, guard owner/publicdenied, user/challengefilters, createdAtDESC/pagination/count/latestnull e contagem de resultados incorretos preservada. Mapper toStructure do par legado (structure, sem entidade fictícia) e insert inferido com contexto real do port. RF01/02/12 CA01/02/03/20/22;19ports source implementados, tipos/runtime/review pendentes. Principais hashes dos três artifacts baseline conferidos e iguais aos reportados Kit.

### D2 autorização de views Solutions
ViewSolutionUseCase usa replace após view por authenticated nonauthor; guard author-only quebraria contrato, fullreplace abriria alteração alheia. Interpretação operacional exige update exclusivo de views_count para leitor não author e verificação de campos reais sob lock, sem God artificial ou Coreportnovo. Ainda inspecionar operações caller para preservar concorrência e owner update; nenhum pathSolutions alterado nesta preparação.

### D2 Solutions — discriminator domínio existente
CodeGraph de CoreSolution mostrou view() marca isViewed=true e incrementa contador; create iniciafalse e DTO não expõeflag. Repository pode distinguir operação real de view sem novoport/modeconstructor: isViewed true → somente incremento SQL views_count+1, lock/verificação dos demais campos reais, para authenticated user/God/system; edit → author/God/system e contador persistido não é substituído por snapshot antigo. Preserva autorização de leitor e concorrência, sem Godartificial nem aceitar conteúdo alheio. Assignment existenteD2Solutions cobre interpretação. RuntimeS2 deve testar nonauthorview sem poder editar e views concorrentes.

### D2 mutation 18 — Solutions
mappers/challenging/DrizzleSolutionMapper.ts e repositories/challenging/DrizzleSolutionsRepository.ts criados/formatados. Oito operações, reads autenticados conforme endpoints, authorjoin/correlatedcounts/listasort/pagination. View detectado por Solution.isViewed.isTrue: transação/rowlock e comparação campos imutáveis; só views_count incrementado atômico, inclusive owner. Edits/delete author/God/system, votos somente próprio user. RF01/02/12 CA01/02/03/20/22;20ports implementadossource, types/runtime/review pendentes. Guard privatevisibility de challenge relacionado deve ser verificado runtime conforme legado.

### D2 mutation 19 — Comments
mappers/forum/DrizzleCommentMapper.ts,index.ts e repositories/forum/DrizzleCommentsRepository.ts,index.ts criados/formatados. Nove operações, authenticatedreads conforme endpoints, joins e contagens SQL, filtros challenge/solution e paginação/ordem. Criação de comment e relação em transação; reply actor próprio, edit/delete author/God/system filtrados SQL. RF01/02/12 CA01/02/03/20/22;21ports source prontos, sem novo sensor/runtime declarado. Comparação de visibilidade será contra manifest/callers legados, sem inventar restrição.

### D2 mutation 20 — Challengemapper
mappers/challenging/DrizzleChallengeMapper.ts criado/formatado; projeção e insert inferidos, testCases JSON real/CodePlaybackDTO, timestamp/starId nullable corretos, não substituir ausência por string vazia. RF01/02/12 CA01/02/03/20/22; repository e tipos/runtime ainda pendentes. Para visibility, conteúdo didático de star disponível mantém filtro atual previsto S1; desafios privados gerais continuam actor author/admin. Não confiar em params.accountId.

### ACH-15 — ports OAuth obsoletos e ausência real
findByGoogleAccountId/GithubAccountId legados consultam colunas inexistentes no catálogo real220cols; CodeGraph não encontrou caller atual, socialverificação usa findById/name. Correção no Usersport futuro: não inferir novo significado de Id, criar colunas ou consultar auth.identities sem autoridade. Modelo persistido não possui associação desses ids, logo nullableport retorna ausência null com guard normal, conforme S1 ausência legítima retorna null em vez de erroPostgREST artificial. Métodos permanecem assinaturas exatas, limite explícito a revisar; nenhuma associação/dado existente removida nem novo comportamento de endpoint. No change Rules contrato de ausência/model real já claro.

### D2 mutation 21 — Challenges
repositories/challenging/DrizzleChallengesRepository.ts e mappers/repositories/challenging/index.ts criados/formatados.18operações, SQL substitui RPC e usa actor real, writesauthor/God/system, votosownuser, categorias delete+insert transacional e playbackomitido listado comoRPClegado. RF01/02/12 CA01/02/03/20/22. ACH16 importChallengeCategory apontava structures em vez entities oficial; remover importisNotNull não usado, mesmo path, antes sensor22ports. No change Rules aliases Core já explícitos. Tipos/runtime/review pending.

### Gate documental e redação factual
Spec definition passou, Plan definition falso-positivo do regexplaceholder: palavra portuguesa para operação com acento faz boundary ASCII casar substringtodo. Não havia placeholder real. Reescrita neutra operação omitida preserva relato ACH14; nenhum detector enfraquecido ou source alterado. Gate precisa novo pass; detalhe local sem mudança Rules.

### D2 mutation 22 — import Core real
repositories/challenging/DrizzleChallengesRepository.ts corrigido para ChallengeCategory de @stardust/core/challenging/entities e isNotNull unused removido. Format1path exit0. ACH16 source corrigido, sensor22ports types pending após preflight. Novo source não será alterado durante captura de tipos para permitir freshness clara. RF01/02/12 CA01/20/22.

### ACH-17 — types checkpoint3
Official npm run check:types -w @stardust/server exit2 /tmp/stardust-drizzle-d2-types-checkpoint3.log, único diagnóstico DrizzleChallengeMapper.ts49 string|undefined incompatível string obrigatório. Assignment correction no mesmo mapperD2 exige fonte domain obrigatória ou default real do schema, não cast/padding vazio. Invalida mapper/new22portstypes, review/runtime pending. No change Rules: inferInsert deve refletir fonte real validada.

### D2 mutation 23 — slug obrigatório
mappers/challenging/DrizzleChallengeMapper.ts alterado para challenge.slug.value, getter confirmadoCodeGraph, eliminando DTOslug opcional semcast/fallback. Format1path exit0; ACH17 correção source concluída, tipos22ports rerunpending. RF01/02/12 CA01/20/22. Crossport atomicidade reporting deve ser compostaS2 com efeitos apóscommit; não envolverpublish externo em transaçãoDB.

### S2 reporting — autoridade de composição
CodeGraph confirmou SendFeedbackMessageUseCase persiste message/attachments/report antes publishes, mas outertx total publicaria antescommit. CoreBroker tem apenas publish(event,eventId?). Interpretação de S1 efeitos apóspersistência: proxy local à requisição acumula pares event/id somente em memória durante transação compartilhada dos repositories, flush aguarda broker real depoiscommit. Em rollback nada publica; falhaexterna póscommit mantém persistência, mesma limitação sem transação distribuída. Não é outbox: nenhum storage/retry/novoport. Implementar somente em paths S2 já contratados FeedbackRouter/controllers, quando faseativa; preservar tratamento AppError, não swallowerrors que faria commit indevido. D1DrizzleDatabase poderá aceitar transaction inferida em tipo interno pelo mesmo ownerD2 se necessário.

### D2 mutation 24 — User mapper e transação tipada
mappers/profile/DrizzleUserMapper.ts criado/formatado, toEntity/toDto preservejoins/arrays/defaults e timestamp, toPersistence só campos tabela inferidos/id real. RF01/02/12 CA01/02/03/20/22; mappertypes/runtime/review pending. D1sameowner DrizzleClient.ts autorizado: DrizzleConnection=PostgresJsDatabase<typeofschema>, DrizzleTransaction extraída callbackParameters de transaction, DrizzleDatabase=Connection|Transaction. Singleton só rootconnection, um pool; métodoscreate/getInstance mantêm assinatura contratada DrizzleDatabase. Habilita compartilharTxreal semcast ou novoCoreport. Alteração invalida aceiteD1client e exigirátypes/reviewD2.

### D2 mutation 25 — conexão/transação inferidas
DrizzleClient.ts agora DrizzleDatabase=connection|transaction inferida Parameters callback, singleton rootconnection somente; create/getInstance continuam retornar DrizzleDatabase. Nenhum pool novo/defaultsystem/cast de client. Format1path exit0. Permite ServerS2 compor ports numaTxreal e nestedtransactions/savepoints. RF01/02/12 CA01/02/03/20/22; D1clientreview e tipos anteriores stale para alias/consumidores, rerunD2 necessário.

### D2 mutation 26 — Users
repositories/profile/DrizzleUsersRepository.ts e mappers/repositories/profile/index.ts criados/formatados.36 operações Core preservadas, joins/arrays/projeções inferidos, containsname/emailbool público somente; readsprofiles/list/KPI authenticated legados e writes/relações ownuser/God/system, replaceMany transacional. OAuthlookup obsoleto retorna ausência null factual semassociação nova conformeACH15. Contagens/decompletions dependem0001 própriasfunções preservadas. RF01/02/12 CA01/02/03/20/22;23ports source, tipos/runtime/review pending. Tipos22ports apósfix23 passaram oficial, próximosensor incluiráUser e aliastransaction.

### D2 checkpoint4 oficial
npm run check:types -w @stardust/server exit0 /tmp/stardust-drizzle-d2-types-checkpoint4.log. Captura inclui23ports, Usermapper/Repo e tipo connection|transaction semcast; fonte mantida estáveldurantecomando. Ainda não prova comportamento SQL/funções0001, autorização real, segurança/adopt/rollback. Tiposglobais/runtime/reporting/D2review continuam pending.

### D2 mutation 27 — FeedbackMessages
mappers/reporting/DrizzleFeedbackMessageMapper.ts e repositories/reporting/DrizzleFeedbackMessagesRepository.ts criados/formatados. Quatro operações, report-ownerjoin em reads/writes, actorId/roleguard (Godadmin), publicdenied. Add usa transação/lockstatus e salva mensagem+anexos; duplicados validam conteúdo/anexos sem sobrescrever outrorelatório. addAttachments idempotente com rowlock, historytimestamp/idASC/attachmentpositionASC; insert inferido explícito. RF01/02/12 CA01/02/03/20/22;24ports source prontos, tipos/runtime/review pending. Sharedtransaction/efeitos apóscommit aindaS2.

### D2 mutation 28 — FeedbackReports
mappers/reporting/DrizzleFeedbackReportMapper.ts,index.ts e repositories/reporting/DrizzleFeedbackReportsRepository.ts,index.ts criados/formatados.12operações, owner/God/systemguards, adminlist/email/status e ownuserhistory/unread/markers, SQLcounts/preview/order/filter/pagination/summary. Save usa transactionlock/greatest para clocks e não regredirclosedstatus; changeStatus expectedcondition/canonicalConflictError, readmarkers monotônicos. RF01/02/12 CA01/02/03/20/22;25ports source entregues, tipos/runtime/review ainda pending. Rootbarrels futuros adicionamDrizzle mantendo Supabaselegado atéS2/D3, comoPlano. Drizzle/indexsameownerD1 autorização já registrada quandoD2exports existirem.

### D2 — checkpoint oficial dos 25 ports

`npm run check:types -w @stardust/server` falhou (exit 2), evidência `/tmp/stardust-drizzle-d2-types-25ports.log`. A inferência do join de feedback retornou registros desconhecidos e não satisfaz o mapper. ACH18 aberto; correção delimitada ao repositório de reports, sem casts que escondam contrato. ACH19 aberto: findById de Users exige restrição ao ator conforme S3, descoberta pelo Builder; corrigir somente essa operação, mantendo visibilidade das demais operações contratadas. Evidência de tipos anterior cobre apenas o snapshot dos 23 ports e permanece insuficiente para o candidato atual. Próximo passo: correção no ownership Database, ACK e novo sensor.

### D2 — diagnóstico completo ACH18

Além dos joins, o log oficial identifica import inexistente de reporting/errors nos dois repositórios, seleção de avatar incompatível e acesso .value sobre status string. Correção autorizada nos dois repositórios reporting e em findById Users; sem alterações Core ou casts. Sensor será refeito após ACK.

### C1 — preparação de infraestrutura sem mutation

Consulta CodeGraph encontrou convenção de exportação root .env.local e confirmou reset.sh fora do índice. Leitura direta do reset e serviço Compose constatou montagem de migrations legadas e loop psql; candidato C1 deverá executar runner destino com ledger limpo, sem seed, após D2. Não executado reset, não modificado Compose, não alterado ambiente local. Não constitui evidência EV03/EV04.

### C0 — ativação auxiliar de script de geração

D2 já possui config/schema/out. Task principal retoma ownership exclusivo de apps/server/package.json para adicionar db:generate conforme S6, sem executar geração ou alterar journal. Esse script não acessa remoto; Runner/adopt/preflight serão ligados quando implementados. Aceite C0 anterior não cobre o novo diff; review coordination será renovado. Nenhuma dependência será instalada.

### C0 — script db:generate criado

Uma linha adicionada em apps/server/package.json; JSON válido, configuração existente permanece autoridade. Sem execução CLI, banco ou generated files alterados por esta mutation. Review coordination futuro cobre esse novo trecho; tipos/units existentes não são prova de geração custom.

### D2 — equivalência do erro de ausência

Fonte atual via CodeGraph: FeedbackReportNotFoundError constructor chama apenas super(Relatório de feedback não encontrado); NotFoundError define título Erro de recurso não encontrado. Substituição pelo NotFoundError exportado com a mesma mensagem preserva título/classe-base usada no HTTP. Evidência runtime desse mapeamento ainda será S2, não inferida de types.

### D2 — mutation29 ACK e freshness

Três repositórios corrigidos no ownership Database. ACH18/19 source corrigido, tipos/runtime/review pendentes. Builder informa format exit0 e tentativa python indisponível anterior sem source mutation; python3 executou lote. Sensores antigos não validam este snapshot. Próximo comando oficial check:spec-implementation seguido de tipos25; Builder retém source estável. Nenhuma autorização/isolamento runtime declarada aprovada.

### D2 — assignment30 preparada

Barrels são finalização do mesmo ownership D1/D2 previsto no sequencing do Plan. Quatro paths permitidos, sem remover símbolos ainda consumidos ou adicionar segundo client. Mutation não iniciou; somente após resultado do sensor25 atual. Reviewer D1 anterior não cobre barrel/repositórios novo agregado, exigindo D2 review.

### D2 — sensor oficial tipos25 atual

`npm run check:types -w @stardust/server` passou exit0, log `/tmp/stardust-drizzle-d2-types-25ports-current.log`, source mantido estável. ACH18/19 passaram types mas comportamento/autorização e review ainda pendentes. Pré-flight estrutural anterior exit1 continua esperado por fases futuras, não aceite integrado. Definition Spec/Plan passaram após docs anteriores. Barrels30 liberados; novo diff invalidará freshness de tipos para exports e exigirá próximo sensor.

### C1 — inventário dos workflows atuais

Leitura dos dois CI YAML identificou blocos exatos de bootstrap e geração de env a trocar. Dependência D2 segue necessária para runner real; ENV receipt deve usar segredo sintético testing, sem copiar raiz ou credenciais remotas ao CI. Web mocks mantêm 127.0.0.1:3100/api/tests/server. Workflow não executado nem alterado; CI/build atuais ainda pending.

### D2 — inventário exato de domains

Builder corrigiu contagem documental para12domains existentes. Essa precisão não amplia paths/Contract: consolida todos25ports já contratados. Config/schema/model exports não alterados; root barrel preservará legado durante S2. Sem finding funcional ou aprovação de runtime.

### D2 — mutation30 freshness

mappers/index.ts e repositories/index.ts criados; drizzle/index.ts e database/index.ts alterados somente para exports atuais. Nenhum consumidor legado removido; types25 anterior stale para esses novos exports. Novo check types/code/architecture seguirá candidato D2 completo. Kit/custom/SQL não executados neste lote; review Database D2 pendente.

### D2 — próximo lote31 geração por Kit

Barrels30 ACK persistido. Geração custom0001 autorizada em três paths canônicos; artifacts/ledger devem vir do Kit0.31.11, comando db:generate contratado. Root .env.local permanece intacto e segredos somente em memória, sem URL/log. Banco não será modificado. Depois do relatório e persistência principal, próximo lote preencherá objetos próprios do manifest; segurança0002 e inversa terão lotes separados.

### D2 — ACH20/ACH21 sensores diagnósticos

Log `/tmp/stardust-drizzle-d2-code-25ports.log` exit1: três erros de format, Comments e meta0000/journal gerados, 19warnings legados. `/tmp/stardust-drizzle-d2-architecture-25ports.log` exit0. Iniciados antes do novo preflight de barrels; tratados como diagnóstico, serão renovados na ordem oficial. ACH20: formatter deve respeitar bytes Kit exigidos S2. ACH21: Comments precisa format final. Nenhuma reescrita de meta permitida; correção tooling narrowly scoped é maintenance fora do mapa funcional, pois bloqueia sensor exigido e preserva contrato gerado.

### Coordenação — assignment ACH20

Correção auxiliar de tooling autorizada pelo workflow para sensor contaminado: biome.json terá override exato dos meta JSON Kit, sem modificar os artefatos gerados. Existing formatter seguirá em todos os demais paths. Sem nova política funcional ou teste espelho; candidato receberá novo checkcode e review coordination. Mutation ainda não iniciou.

### Coordenação — mutation tooling ACH20

Override de formatter dos meta gerados adicionado em biome.json; JSON parse passou. Respeita S2 no-handedit sem enfraquecer verificação dos fontes. Artefatos Kit ainda têm seus hashes de geração, reviewer coordination avaliará diff junto à validação renovada. ACH20 source corrigido, sensor/review pendentes.

### D2 — ACK31 e evidência de geração

Kit0.31.11 gerou0001SQL/meta e atualizou journal v7 postgres: idx0when1790901517786 intacto; idx1when1790905057160/application_objects/breakpoints true. Principal sha256sum confirma os três hashes reportados. SQL ainda vazio, portanto EV03/04 e funções/views operacionais não demonstradas. .env.local intacto, URL loopback somente em memória. Novo SQLfill será mutation separada após formato Comments.

### D2 — assignment correção ACH21

Biome detectou chains format divergente em Comments apesar do relato anterior de format. Corrigir apenas whitespace/formato pelo owner Database; sem lint fixes/alteração semântica. Sensorcode novo após ACK32. Nenhuma evidência runtime inferida.

### D2 — mutation32 evidência

DrizzleCommentsRepository.ts recebeu apenas formato de chains, ACH21 corrigido source. Nenhum Kit/script/Core alterado; sensorcode anterior stale. Pré-flight renovado antes do sensor oficial, ambos logs locais novos. A geração0001 não é prova de aplicação/parity.

### D2 — sensor code atual e assignment33

`npm run check:code -w @stardust/server` passou exit0, log `/tmp/stardust-drizzle-d2-code-25ports-current.log`. Override formatter meta válido e Comments format corrigido; warnings legados mantidos. Preflight antes do sensor exit1 ainda paths futuros. ACH20/21 passed sensor, review coordination/Database pendentes. Próximo lote somente preenchimento0001SQL derivado do manifest39tables/40functions/7views/acesso legado; nem geração sozinha nem code provam SQLruntime. Snapshots/journal permanecem byte-a-byte Kit.

### Coordenação — ativação sensores globais

Detectores globais após25ports/barrels e tooling formatter. SQLfill não muda TS nem comportamento unit no snapshot atual; manter Builder sem TS mutation durante execução. Sem comparação de cobertura/integração declarada; esses exits permanecem para candidato D2/integrado posterior. Resultados serão registrados antes de próxima source mutation.

### D2 — limites de reprodução0001

Catálogo declarado pelo Builder para custom0001: definir funções não equivale a executar seed. Bootstrap não executará insert_initial_data/install_available_extensions_and_test. Defaults execute PUBLIC das funções criadas serão neutralizados e grants exatos do manifest reaplicados. Nenhuma alteração de memberships/extensions infraestrutura neste lote. Parity SQLaplicado e acesso0002/inversa ainda pendentes.

### Coordenação — resultado code global

`npm run check:code` passou exit0, log `/tmp/stardust-drizzle-wave2-global-code.log`. Nenhuma correção indiscriminada de warnings legados. Tipos e units raiz ainda running; evidência code restrita ao source atual, não prova SQL/catalog/runtime ou final entrega.

### D2 — ACK33 SQL candidato

Custom0001 contém somente definições próprias do manifest e reconstrução ACL legado:40REVOKEPUBLICfunc neutralizam default criação antes86grants, storage apenas3policies/8grants próprios. Search_pathpublic,extensions e check_function_bodies false restrito às definições/restaurado true. SQLvazio31hash stale pela mutation autorizada; meta31/journal intactos. Ainda não aplicado: contagens/texto não demonstram catálogo, persistência, segurança ou rollback.

### D2 — assignment34 metadata segurança

Geração custom0002 autorizada exclusivamente nos três paths Kit. Runner/globaltypes/units não serão alterados durante sensor atual. SQLsecurity efetivo e inversa são próximos lotes independentes depois de persistência principal; nenhum catálogo remoto/local modificado nesta geração.

### Coordenação — resultado types global

`npm run check:types` passou exit0, log `/tmp/stardust-drizzle-wave2-global-types.log`. Valida também novos barrels dos25ports e workspaces atuais. Não cobre SQLsecurity/custom0002 ou runner futuro; freshness será renovada após esses fontes serem criados. Globalsunit ainda running, sem declarações integradas.

### D2 — ACK34 artefatos de segurança

Kit0.31.11 gerou SQLcustom vazio0002/meta/journal, hashes conferidos sha256sum principal. Artifacts ainda não implementam segurança: EV04/CA07/08 seguem pending. Snapshot/journal jamais handeditados. Globals TS permanecem source estável; próximolote SQLsecurity/inversa/manifest será registrado explicitamente.

### D2 — assignment35 security candidato

Três paths delimitados para SQLforward/inversa/catálogo esperado. ACL legacyoriginal e sourcehash24 são imutáveis; manifest acrescenta esperado0002/ledger phases. Inversa restaura flags/policies/grants/defaults exatos, semdropdados/tabelas ou entries0000/1. PostgreSQL defaultPUBLIC de funções exige análise correta de defaultACL, não confiar só em REVOKE INSCHEMA se grant é global; Builder deve explicar transformação e efeito limitado. Nenhuma aplicaçãoSQL ou prova de isolamento será atribuída ao texto. Próximosexits reais clone/runner/adoption/rollback apósimplementaçãooperacional.

### Coordenação — resultado unit global

`npm run test:unit` passou exit0, `/tmp/stardust-drizzle-wave2-global-unit.log`,5tasks/2m3.101s; Server168suites325tests. Typesroot7tasks1m44.434s; code rootexit0. Sem cache em unit/types. Suítes existentes ainda exercitam composiçãolegada antesS2; isso não valida comportamento das25novasrepositories. EV01/02 via rotas reais e EV03/04 via clones continuam obrigatórios. Warnings Studio runtime/deps existentes registrados semfixforaescopo. Nenhuma falsa conclusão integrada.

### Review coordination — ativação focada

Revisão pareada da coordenação retoma script db:generate e maintenance ACH20 fora do mapa funcional, justificada pela exigência bytes Kit/S2 e sensorformat bloqueado. Evidências atuais globalscode/types/unit e Servercode estão passed; pré-flight geral expectedfailed por paths futuros. Solicitar findings de scopeoverride, versão/resolução, preservação outrasregras e comandos. Não cobre SQL/security/runtime pendente.

### D2 — auditoria requerida antes da segurança

Builder identificou limite de catálogo fora public. Autorizada consulta read-only no clone isolado próprio para funções/views/security-definer/dependencies/grants e memberships. Sem aplicação0002/inversa. Defaultslegado0: REVOKEglobalEXECUTEPUBLICownerpostgres é necessário para funções; inverseGRANT deve voltar catálogo pg_default_acl vazio, a confirmar em ensaio. Reviewer coordination followup falhou infraestrutura agent thread limit reached; nenhuma revisão executada/veredito atribuído, retomar agente estável quando disponível.

### Coordenação — indisponibilidade do reviewer

Duas chamadas coordination falharam no limite de threads de agentes; listagem live atual não expõe esse reviewer, embora esteja no contexto anterior. Sem read-only executado ou accepted. Toolingcode/types/unit passaram mas não substituem reviewer. Próxima tentativa somente após rodada Database para evitar polling; nenhum fechamento de entrega/C0/ACH20 por esta situação.

### D2 — evidência read-only35

Consulta principal docker exec/psql read-only rootenv carregado em memória, exit0, log `/tmp/stardust-principal-d2-security-audit.log`. Zero dependências de funçãoexterna em relationspublic e zero memberships cujo member é anon/authenticated; função graphql_public.graphql atual só retorna erro de extensão não habilitada. Agrupamento externo67 conhecido; trêsviews infra preservados. Builder relata leitura das definitions externasemDMLapp, não tratada como EV04runtime. Essa auditoria não substitui role/dataAPI ensaio, mas permite transformação3paths conhecida; nenhuma source/DBmutation nesta leitura. Globalguards/securityruntime pending.

### Coordenação — freshness do estado C0

Status principal/card/table reconciliados com reabertura do script e reviewer pendente. D1/S1/W1 aceitos nos seus snapshots, DatabaseD2 vigente não aceito ainda. Nenhuma alteração funcional/Spec revisão; ledger evita completed enganoso diante novo diff.

### D2 — ACK35 e limites

0002 retira519relationgrants/44functiongrants públicos/anon/auth e29policies próprias, desligaRLS39tables, seisdefaultrevokes ownerrealpostgres. Inversa reaplica flags/policies/removidosgrants e defaultglobalPUBLICfunction; retorno pg_default_acl zero ainda hipótese a ensaiar. InfraAuth/storageACL/cron/extension/memberships preservados no texto. D1manifestreview stale porphaseextension; Kitmetadata intacta e hashcustomvazio0002 stale autorizado. Nenhuma demonstração DataAPI/Auth/S3/SQLroles/rollback ainda. GlobalsTS anterioresfresh para repositories, não operationalscripts futuros.

### D2 — assignment36 operacional

Três scripts canônicos são próximos fontes, globaltypes/unit/code anteriores agora não validarão novo diff. Testes/scripts operacionais posteriores cobrirão phases/partialledger/hash/drift/idempotência/concorrência/timeout/rollback. Driver session dedicada deve suportar drizzle migrate e transações verdadeiras sem trocar conexão apóslock; consulte APIs públicas/tipos atuais em vezdecast. Rootsharedpackage runner/adopt/preflight será ligado depois que paths existem. .env.local intacto, nenhumaURL/credential versionada ou emitida. Nenhum DBtest autorizado neste lote antes reporte/ACK.

### Coordenação — estado de execução dos agentes

Rodada read-only de coordination agora ativa; threadlimit impede retomar/mensagem Database simultaneamente. Essa limitação será tratada serializando as rodadas, não criando replacements. Operational36 está preparado mas não ativado efetivamente; não há mutation ou sensor a registrar nele ainda.

### Coordenação — veredito focado accepted

Implementation Reviewer coordination aceitou linha db:generate e reparo ACH20 no basefrozen+diff atual, semfindingbloqueante. Inspecionou logs oficiais e executou db:generate --help exit0, semSQLgerado/DB. No change Rules: preservação de ferramenta já explícita. Aceite exclui SQLsecurity/adoption/runtime/SDKcleanup e featurefinal. Status C0 e findingACH20 reconciliados; novosoperationalscripts não cobertos. AgenteBuilderDatabase será retomado depois desse veredito.

### D2 — interpretação de conexão e histórico

Conexão dedicada S2 pode ser clientexclusivo max1; reserve() de postgres3.4.9 não suporta migrator.begin apesartipo, não será usado comcast. Queryguard precisa impedir reenvioporpool pósclose, não apenasassert finalPID; usar hooks públicos semlogparams/URL, erro sanitizado e tests connectionloss. HistóricoSupabaseexato significa conjunto24versions/names semextras/duplicates, sourcehashSQL congelado separado da representação statements doCLI; S2 não exige inventarchecksumjoinstatements. CLI migrationup --help independente confirma --db-url para replaylegacyfiel emclone owned posterior, semseed. Fixtureledger deve vir deCLIreplayreal, nãofabricarrow para fingirevidência. Nenhum amendment de assinaturas/arquivos necessário para essas interpretações; scripts failclosed catálogo/phase/ledgerhash continuamliterais.

### Ambiente — disponibilidade atual semsegredos

Root.env.local carregado emmemória; metadata presence-only: WEB_APP_E2E_EMAIL/PASSWORD e STUDIO_APP_E2E_EMAIL/PASSWORD presentes. Nenhum email/password/token exibido, nenhumaedição.envlocal peloagente. Pergunta anterior dascontas superada peladisponibilidadeobservada; nãoinferir queautorizacriação/alteraçãoarquivo. Receiptsecret ainda ausente, SMOKEdependente deENVstartupválido. Nãofoi executadologin/browser oucontacriada.

### Ambiente — gate secret local

Requestasync accepted para configuração receiptsecret pelo usuário, semrecebersegredo nochat. FonteexataSpecS6line340/provedorENVmínimo32bytes. Não alteradoarquivo, não inferida configuração peloelapsed. TodaVMdependenteaguardarápresença/validação real; scripts/bancoclonespodemcontinuar. Sem approvalflowdecódigo adicional.

### D2 — verificação estática de manifesto

`node --import tsx /tmp/stardust-principal-d1-metadata.ts` exit0, log `/tmp/stardust-principal-d2-manifest-model-parity.log`, errors[]. Round tratado diagnóstico porque structuralpreflight renovado imediatamente depois, não usado para aceiteintegrado. Modelo/manifestestrutura/hashGit permanecemcompatíveis apósphaseextension; catálogo SQLgerado/aplicado/ACLruntime não cobertos. FaltaensaioMigrator/Adopt/Rollback para concluirD2.

### D2 — mutation36 freshness

Sourceoperacionalnovo invalida globals anteriores para essesfiles. Guarddebug pode exporerroparams seprinted, CLIcatchfixo sanitizado relatado; sinais/finallycloseunlock precisamensaioreal. Nenhuma provaempty/adopt/rollback/connectionloss ainda. Complexitydiagnóstico iniciadoantesdereporte36, portanto snapshotnãoatribuídoaosnovosscripts atéconferirresultado. Próximofocusedcode/types/readinspection eassignmenttests/rootCLIsharedscripts; runnernãoexecutadonoboot, semreset/seed/remotewrites.

### D2 — ACH22/ACH23 resultados

CodeServer `/tmp/stardust-drizzle-d2-code-operational.log` exit0. TypesServer `/tmp/stardust-drizzle-d2-types-operational.log` exit2: runner24 callback client/assertSession implicitany. Complexity `/tmp/stardust-drizzle-d2-complexity-checkpoint.log` exit1:8functions thresholds em UserMapper, FeedbackReportMapper, ChallengesRepository, UsersRepository, FeedbackMessagesRepository(2callbacks), FeedbackReportsRepository(2callbacks). Scopeanalisado696files2396functions; source36nãofresh para esse diagnosticiniciadoantes. Não enfraquecer thresholds/baseline/excluirnewpaths. Correções automáticaownershipDatabase, testsrealvalidarsemanticsdepois.

### D2 — assignment37 correção tipos

HelperJS exportado semJSDoc contextual deixa callbackTS implicitany; permitirtiposcorretos daAPIrealpostgres e contractsdeoperação. Source37 invalidate types36falho; rerunapósACK/preflight, demaisfuncionalidadeintacta. ACK36persistido e fonte lida CodeGraph; nenhumaoperaçãoDBexecutada atéagora.

### C0 — assignment wiring operacional

Trêscomandos serão ligados aos scripts canônicos existentes; legado db:test permanece atéC1 infra pronta e removalsaliased depoisproof. Principalsharedownership preservado, Builder nãoedita package. Aceite C0precedente não cobre diffnovo; autoreviewapósevidênciaruntime. Não instalar/alterardependências, não tocar.envlocal.

### D2 — ACK37 correção ACH22

HelperJS agora provê tipocontextual real para callbackTS; nenhumrunnerAPI/SQL/guard alterado. SensorTS36falhou e serárenovado apóspreflight. ComplexityACH23 fontefora37 intacta e pendente. Semtest/DBexecutado.

### C0 — wiring CLI atual

Mudança3commands empackageShared pelo principal, nenhumDBexecutado. Scripts respectivos existem e dependênciasORM/tsxinstaladas; runtimeguards/inferênciatype serãoensaiadosagora. AceiteprecedenteC0 invalido somente para novodiff; dependencyfoundationpreservada. .envlocal intacto.

### D2 — precisão e escopo ACH23

Oito funções correspondem a seispaths (contagem inicial sete corrigida): UserMapper.toDto, FeedbackReportMapper.toEntity, Challenges.listingFilter, Users.query, Messages.add/addAttachments callbacks, Reports.save/listMine callbacks. Métricas acima de800Halstead e User.toDto CC24 acima15; helpers devem reduzircomplexidade semmascarar apenascalculation/exclusões. Assignmentpreparedconditiontypes37green, nenhumsrc38mutado ainda. Operacionais/SQL/metadata/testsforaesseescopo.

### D2 — sensor37 resultado

`npm run check:types -w @stardust/server` passou exit0 apósJSDoc. ACH22 source+typespassed, scriptreview/runtime ainda pending. PreflightantesdoSensor exit1expectedfuturasphases. Nenhumaevidência conexão/lock/ledger/apply derivada deTS. Próximas correções ACH23 somente sourceadapters seispaths.

### D2 — preparação de leitura operacional real

ScriptcheckTransition jácompila e vai consultarcatálogo do clone PostgreSQL real, maslegacyledgerCLI nãofoipreparado. Proxy efêmerolocal permiteguardloopback sempublishportrecriarcontainer; nãoaltera dados/configDB. Rootcommand usasomenteprocessENV secreta, stdoutdiferençasnormalizadassemrows. Essesensor é diagnóstico de catalogqueries; integração/aplicaçãoSQL ainda pendentes.

### D2 — ACK38 freshness

ACH23 refatoração seispaths reportada mecânica e semNplus1/newpaths/casts/threshold/baselinechanges. Tipos/code/complexity precedentesstale paraessesfontes; sónovo roundapóspreflight valida. NenhumqueryextraouDBexecutadoBuilder. Preflightread-onlyroot emclone usa scriptsoperacionais37estáveis, independente dessasextrações; resultadoaindarunning.

### D2 — diagnóstico ambiente do preflight

Logs `/tmp/stardust-principal-d2-preflight-legacy-readonly.log` somenteerrofixo/exit1; não interpretarcomoincompatibilidadecatálogo. FalhaéalcanceTCPbridge (probe1s timeout), rootsecret sourceboolmatches, serverlisten*5432. Node24hostbinary nãoexecuta emAlpineglibcloaderausente; tentativa read-onlycontainer encerrou255. RuntimecachedNode22.23.3 Debian confirmado, superarequisitos22.22 e evitaimagemnova; nova leitura usaránetworkcontainerclone e reposro. Nenhum root.envalterado/SQLaplicado.

### D2 — sensores38 resultados

Logs code-post-complexity/types-post-complexity exit0; complexity-current exit2:696files2410functions,error0,warn201. Script oficial `--max-warnings 0` e baselinefilter sãoautoridade; errozeroinsuficiente. ACH23continuaaberto, JSONdiagnósticoparafunctionsregressão comcópia baseline materializadaem/tmp, semalteraroriginal/thresholds. RootNodecontainerread-only preflightexit0wrapper nãoequivalecompatible, resultJSONvai serregistradoespecificamente.

### D2 — leitura real catálogo legado

Log `/tmp/stardust-principal-d2-preflight-legacy-container.log`: JSON differences contémapenas Legacy migration history differs. APIpreflightrealvalidou todoscatalogkeys/ACL/provenance/frozenhash/externalexposurecontraD1clone; Nodeimagecached22.23.3 eURLsecreta apenasprocessENV, envfileintacto, reposro. Wrapperexit0 sóexecução bemsucedida, compatiblefalseéfalhado como esperadohistorypsqlclone; nãoEV03adopt/EV04aplicação. PrimeirafalharedeProxy nãoeraSQL/catálogo; networknamespaceisoladoresolveu semhostports/instalação.

### D2 — evidence JSON complexity

`/tmp/stardust-principal-d2-complexity-report.json`201functions/52files baselinefiltered, warn201,error0. Cópia baseline `/tmp/stardust-principal-d2-complexity-base.json` somente/tmp, originalintacto; comando diagnósticoexit2capturado. Introspecção inicial primeiroarrayvazio retornouIndexError, corrigida apenasleitorlocal para filtrarfunctions; nãofalhadefeature/teste. Regex/metricleves não serãoafrouxados. Ainda haverárefatoração maiorcapazderesolverMI65 e thresholds, comcadaassignmentpaths explícitos; operationalriskspriorizadosantes dessaestruturação.

### D2 — assignment39 validação scripts

Rootpreflightread-only mostroucataloglegacyexato e históriaCLIausente, logoensaio deveproduzirhistórico viaCLIreal. SourceTS38 code/typespassed, complexitywarn201pending; runtimepriorityantesrefatoração52paths permitida, semcompletedD2. Dois script-testpaths jácanônicosD2, semteste dedicadoRepository/provider/service/fixture. Casos devem observar efeito e no-write/errors/locksession, nãomirrors deimplementação. Principal executará Node--test depoisACK, comenvroot/statusredigidos. Nãoadicionarseed às migrations oubootstrapdbtest; fixturedata somenteclone teste.

- D2 mutation 39 registrada: testes operacionais candidatos em dois paths; formatação reportada exit 0, nenhuma execução oficial ou migração aplicada. Evidência de testes/code afetada permanece pendente; HEAD `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Identificada dependência indevida de fixture efêmera D1 e cleanup incompleto de runners em timeout: correção automática assignment 40, mesmo ownership e paths, sem mudança de Contract. Rules já exigem reproduzibilidade/cleanup: No change. RF03/04/05 e CA04/05/06/07/08/20/22 não aceitos até ensaio real. ACK39 documental permite apenas correction40 source-only; não autoriza execução.

- Gates40: `check:spec-definition` e `check:plan-definition` exit0; `check:spec-implementation -- ... --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` exit1, freshness39, implementação parcial mantém conformance bloqueante. Logs `/tmp/stardust-drizzle-spec-definition-40.log`, `/tmp/stardust-drizzle-plan-definition-40.log`, `/tmp/stardust-drizzle-conformance-39.log`. Nenhum resultado runtime inferido.

- Mutation40 source recebida: dependência D1 removida e cleanup runners próprios corrigido no helper de testes. Freshness39 invalida bootstrap/cleanup; nenhum veredito runtime existe. ACK40 documental habilita ensaio oficial dos dois testes com infraestrutura reproduzível, credenciais root somente memória e cleanup label. RF/CA pendentes até resultados oficiais; Rule disposition No change. HEAD/base permanecem inalterados.

- Ensaio operacional40 oficial exit1, seis falhas antecipadas: CLI replay24 e migrate inicial retornam1. Nenhuma adoção/rollback/security aceita; fonte do erro ainda não identificada devido output genérico. ACH-24 aberto: harness/runtime operacional não atinge setup. Reproduzir diagnóstico sanitizado, corrigir somente causa factual delimitada e repetir. Conformance40 exit1 permanece paths futuros. Assignment41 same-owner/two-test-paths, rev6 RF03/04/05 CA04/05/06/07/08/20/22. Evidência runtime atual failed; nenhum estado passado herdado.

- Reconciliação documental atual: ACH23 mantém bloqueio de avisos novos, ACH24 falha de setup registrada também na tabela central. Gates41 Spec/Plan definition exit0; cleanup dos containers labeled testes confirmado vazio. Logs `/tmp/stardust-drizzle-spec-definition-41.log` e `/tmp/stardust-drizzle-plan-definition-41.log`. Não confundir SQL aplicado a clones de teste com aceite de migração.

- ACH24 diagnóstico candidato: bootstrap da imagem fresca difere da infraestrutura congelada, script corretamente fail-closed antes DDL. Builder reportou contagens agregadas sem segredo, clone próprio removido; principal ainda deverá validar correção e ensaio. Não alterar manifesto, thresholds ou expected catalog para acomodar fixture. RF/CA permanecem failed/pending. Assignment41 dois tests somente, steps semânticos infra reproduzíveis sujeitos a ACK de mutation.

- ACH24 causa setup refinada: readiness socket temporário e herança real defaultACL por owner de CREATE. Preparação semântica isolada dos testes autorizada, scope schema public conhecido e owner storage restaurado, extensão pgaudit real. Banco/CLI permanecem sem aceite; output raw/credenciais proibido. Nenhuma alteração de Contract ou Rules; freshness teste41 pendente mutation.

- Mutation41 registrada antes próximo sensor: preparação infraestrutura dos testes corrigida, fonte operacional/SQL/manifest intacta. Evidência40 failed permanece histórica e stale para bootstrap atual. Nenhuma aprovação de migração/adoção/rollback inferida; principal rerodará seis cenários após conformance. ACH24 in_progress, source-only format candidato exit0. HEAD/base unchanged.

- Ensaio41 oficial novamente exit1 antes critérios; nenhuma conclusão de schema/ACL/transação/rollback. ACH24 permanece aberto; logsfailed anteriores históricos. Diagnostics testcatch produz JSON seguro mas assertion code omite stderr, reproduzir leitura estruturada sem rawlogs. Assignment42 read-only, nenhuma mutation autorizada em scripts/tests ou opSQL. Falhas duas rodadas, terceira idêntica só escala se autoridades não resolverem; continuar investigação factual.

- ACH25 aberto: source SQL classifica nove procedures como functions; migrate real falha42809 antes commit, catálogo app vazio/ledgersemrows apósrollback reportado diagnóstico. Corrigir SQL customversionado e hash inversa somente quatro paths explicitamente atribuídos; snapshotsKit permanecem byteidênticos. Rules já exigem catálogo/owners/signatures exatos: No change. RF03/04 CA04/05/07/08 bloqueados; metadata/model e bootstrap aceites não substituem SQL. Assignment43 rev6/Database source-only; sensorruntime42 candidato requer nova captura apósACK.

- Tabelas centrais ACH24/25 reconciliadas com diagnóstico42; lessons No change por fidelidade já explícita em Rules. Não declarar seis cenários passados: falha CLI e migration correta ainda exigem rerun.

- Mutation43 factual source reportada/registrada: tipos de routine corrigidos no SQL custom e hashinversa runner; metadados gerados preservados. Formatrunner candidato exit0. Runtime anterior failed/stale, CA04/05/07/08 permanecem pending/failed até repetição. Logs e hashes44 serão oficiais; sem inferir efeito de ACL/rollback pela correção textual. RF03/04 freshness43; próximo principal conformance+Node --test.

- Ensaio43 oficial failed exit1 seissetupfalhas; corrigirFUNCTION/PROCEDUREnãoequivaleSQLpass, ACH25 aindainprogress. Fonte43fresh, capturaerrorsó structuredsafe autorizado44. CLI independentfailure LegacyDbConnectError reportadodiagnóstico; nãohash/ledgerfabricado. Estadoin_progress, nenhum CAaprovação/remoçãolegadopermitida. Próximaação READONLYDatabase44 antesnovaassignmentmutation.

- ACH25 SQL typecorrection43 deixou forwardSQL executar emclone real, porém finalpreflightdifferencescolumns mantém operaçãofailed e critériosnãoaceitos. Diagnosefielddeltas antesmutation; não usar contagens iguais como prova de paridade. Tabelas/ACL agregadas reportadasdiagnóstico, oficialfocusedempty futura. Nenhumnovo sourcealterado44.

- ACH26 aberto: comparação de attnum físico confunde slot histórico dropped com coluna presente; três posições rockets são único delta. Correção canônica de ordinal relativo nos dois lados preserva 220colunas e ordem exata, sem ignorar field/tipo/default nem reescrever manifesto congelado. Assignment45 único helperpath, source-only rev6 RF03 CA04/05/06. No change Rules: fidelidade semântica já exigida; fonte/préflight evidência45 stale atéfocusedempty oficial.

- Mutation45 comparação semântica de ordem registrada, rawartifactlegacy intacto; resultado44falsepositional stale parahelperatual. Format fonte candidato exit0; tipos45pendent. Próximo ensaio oficial `node --test --test-name-pattern='empty migrate' ...check-drizzle-transition.test.mjs` valida migrate/noop/SQLroles/internalAuth semCLIlegacyindependente. NenhumcriterionaceitoaindaporrelatoBuilder.

- Evidência oficial atual45: focusedempty test passed1/1 exit0, zerofail/skip, log `/tmp/stardust-drizzle-empty-test-45.log`. CA04 local empty+migrate/noop candidato atendido; CA07 parcial SQLprivileges apenas, não DataAPI/Server. ACH25/26 source+focusedpassed, reviewer/types/currentfullassays ainda exigidos. Legacyadopt/rollback/lock não inferidos. Próxima ação sensoresfocused restantes antes whole6; nenhum runtimeprodalterado.

- Evidência oficial rollback45 passed1/1 exit0, log `/tmp/stardust-drizzle-rollback-test-45.log`; CA08 local inverse exata e preservação, parcialCA06/hash/ledger. Não prova restorebackup/versionantiga/dataAPI/remoteEV05. Combinedphase/lock ainda running, aguardar exitfinal. Lastupdated2026-10-02 refletiu environmentdate; source estável45.

- Phase/hash/lock45 oficial passed2/2 exit0 e cleanupvazio. Local guards/atomicrollback/locksperdasessão agora evidênciapassed atual45, whole6/CLIlegacyadopt continuam pending e reviewerD2pendente. Assignment46 readonlyCLI delimitada; ningúnsource/migration/manifestallowed. Logsfailed40/41/43 preservadoshistóricos; não transformar EV05 remoto empassed porensaioisolado.

- Reconciliação documental ACH25/26 fontecorrigida+officialfocusedpasses; sem fecharfindingsantesreviewD2. Sensors code/types45 running, resultados pendentes. CA/EV finais integrados ainda pending, sem alterarcontrato.

- Sensores oficiais fresh45: Servercode passedexit0 (warningslegados), root testintegritypassedexit0. Typesrunning; esses resultadosnão aprovamcomplexity/coverage/novosrepositorybehavior ainda semintegração. CLI46 investigação independentreadonly. Logs atuais45 versionadossomente referências locais semsegredos.

- Sensor oficial Servertypes45 passedexit0, currenthelper/script/routines fontes; registro individual apóscompletion12712. Não substitui whole6/runtime repos25/reviewerD2. ACH22 fonte+typescontinuaadequado, ACH25/26focused/currenttypesadequadosatéreview. PróximoCLI46causa aguardada.

- ACH24 causa CLI reproduzida: detecção TLS da CLI falha no PostgreSQL isolado local; sslmode=disable na URL derivada permite24 migrations reais e histórico legítimo. Rodada completa de adoção ainda pendente. Cleanup EACCES causado por arquivos root no diretório próprio também corrigível no helper47. Nenhum segredo em logs, root.env editado ou ação remota. Rules já exigem ambiente local e cleanup: No change. Mutation47 invalidará evidência de testes/helper. Cleanup residual46 reportado exclusivo e concluído; nenhum container de teste remanescente.

- Refinamento documental de causaCLI/cleanup47, sem source novo nem evidência inferida; gates47 já passaram, source47 em trabalho delimitado.

- Mutation47 source factual registrada: TLS local explícito e cleanup temp permissões sem alterar .env/ops/SQL/manifest/asserts. Whole6 oficial pendente; diagnóstico46 CLIhistory real permanece histórico, não aceiteadopt. Próximo conformance47 e Node24 --test doisfiles. Nenhumchange remoto ou dadoslegadoreais.

- Atualização factual whole47: primeirocasoadoçãolegadoreal passou no TAP oficial; dados/histórico preservados e idempotência/concorrência assertions executadas. Resultado globalainda running, CA05candidato nãofinal atéexitround/review. Log `/tmp/stardust-drizzle-operational-tests-47.log`. Nenhuma sourcealterada duranteensaios.

- Whole47 oficial passed6/6 exit0 zero skips, current source47. Evidência real scriptslocals agora válida, não encerraD2 porcomplexity201warnings/52paths e behavior25ports/reviewer/integratedremotegates pendentes. CA04/05 atualizadas passedlocal comreviewpendente; CA06/08 parcial/in_progress. EV03misturasconcorrênciaadopt/migrate/rollback não demonstradasseparadamente ainda, não esconder lacuna. Próxima investigação48 design de responsabilidades warnings source-onlyplan/read-only. HEAD/baseunchanged, nãomigraçãoremota.

- Sensores atuais registrados: integrity47 passedexit0 e gatesdocumentais48 passedexit0. Nenhumbaseline/thresholdalterado. ReviewerDatabaseD2 continua pending, scripts6passed não resolvewarnings201 ouboundarybehavior25ports.

- Assignment49 registrada após plano48 read-only: dois fundamentos Drizzle somente, responsabilidades reais singleton/lifecycle e query/error-boundary compartilhadas. Dependentes25repos/S2, risco shutdown/recreate/URLs e errorsnested/cíclicos explícito. Exits warnings destespaths sem regressão code/types e eventual integração runtime; zero source mutate antes assignment. SQLscripts47pass6 permanece fresh se intactos, Client/reposruntime ainda não aceitos. ACH23 em progresso, não alterarbaseline/threshold.

- Planheaderdate/status reconciliados com latestledger; source49aindaemtrabalho, sem invalidarscriptstests47. C0novoCLIwiringpairreviewpending mantém gate futuro.

- Mutation49 registrada individualmente: refatoração boundedfundaçõesDB, typedaliases/poolmax10/timeouts/singlepool preservados segundoBuilder, principalverificarátypes/code/metrics/runtime. Não aceitarwarneliminação porrelato; ACH23ainda201pre49pendingfreshreport. ScriptsSQL47fontesimutáveismantêmlocaloperational6pass. NenhumCore/newpaths/policychanges.

- Resultados oficiais49: codepassedexit0; complexityfailedexit2 com200novoswarnings (201antes),0errors. ACH23continuaaberto; responsabilidadesextraídas não provam metricpassed. Types49running. Sem sourceextra enquanto resultados atualizados. Logs `/tmp/stardust-drizzle-d2-code-49.log` e `/tmp/stardust-drizzle-d2-complexity-49.log`. Conformance49exit1expectedfuturepaths.

- Diagnóstico métricasfundação49 factual: somente close61.5/hasConstraintConflict63.3 ainda abaixo65; demais funçõesnovoestado/queryerrorpassed. Assignment50 responsabilidade lifecycleI/O versusidempotência e causaltraversalversusnodeclassification para eliminarwarnings legítimos. ACH23 global200aindaaberto. Nenhumbaseline/thresholdmudado. Types49completion será registradoindividualmente apósexit.

- Sensor oficialtypes49 passedexit0, log `/tmp/stardust-drizzle-d2-types-49.log`. DefinitionSpec/Plan50passedexit0 logs atuais50. Client/repo foundation funcional compile/codeadequados maswarn2residuaisnãoaceitos; correction50delimitada. Nenhuma evidência runtimeClientinventada.

- Mutation50 fontebounded registrada, endConnection e isConstraintConflict responsabilidades coesas; runtimeClient ainda não demonstrado, métricasfreshnecessárias. RF01/02CA01/02/03/20/22rev6. Scripts47operacionais6passfresh preservados; novasfundaçõesinvalidamcode/types/unit/complexitydoescopo. Nenhumthreshold/baseline/expectedalterado.

- Preparação51 read-only autorizada para próximo grupo, sem antecipar métricas/finalizarfundação oumutararquivo sob sensores50. Rootglobalcode/types/unit eServercomplexityexecutando; resultados individuais serão registrados antes próxima source assignment.

- Sensorsoficiais codeglobal50 passedexit0 (7tasks), complexityServerfailedexit2 com199novoswarnings. FoundationClient agora métricapassed; Repo traversalMI64 (<65), demaisfoundationfunçõespassed. ACH23restante inclui198famílias+1base. Types/unit50nãofinalainda. Fonte50imutável, scripts47 6passfresh.

- Sensor oficial de tipos global50 aprovado, exit0, 7/7 tasks. Warnings preexistentes do Vite no Studio permanecem informativos. A complexidade continua bloqueada por199 avisos novos, incluindo um na base. Unitários ainda em execução; não inferir seu resultado pelos testes parciais.

- Sensor oficial de unitários global50 aprovado exit0,5/5 workspaces. Resultados existentes preservados; testes de repositories Drizzle via composição real S2 permanecem pendentes. Três detectores obrigatórios globais passaram para este checkpoint, sem encerrar D2/Spec. Fonte50 estável, nenhum sensor ativo agora.

- Preparação51 read-only reportada; assignment52 registrada para um path, separação coesa guard/travessia com narrowing TypeScript. Fonte50 code/types/unit globais aprovados; mutation52 invalidará esses sensores do escopo, não scripts47SQL. Nenhuma alteração de Contract ou dados, ReviewerD2 continua pendente.

- C0 novo wiring permanece in_progress até re-review pareado. Assignment read-only registrada para comandos operacionais em manifesto, com provas oficiais atuais de scripts/detectores e limites de escopo explícitos. Nenhuma alteração de código ou invocação remota autorizada; Database continua responsável por D2 e seus findings/review.

- Mutation52 registrada imediatamente: elegibilidade estrutural/ciclo separada da travessia causal. Freshness oficial52 será conformance/code/types/complexity; zero runtime executado por Builder. Scripts47 6pass não invalidados porque fontes intactas. C0 wiring review separado read-only ativado, sem veredito D2 concorrente.

- Preparação53 read-only registrada durante code/types/complexity52, sem alterar fontes sob evidência. Próximo lote de domínio precisa reduzir warnings preservando guards, queries, DTOs, FK e transações, com type inference real. ReviewC0 read-only independente em andamento.

- Veredito pareado C0 wiring accepted, revisão6; nenhum script executado pelo Reviewer por ausência de help seguro. Aceite restrito ao manifesto, não valida D2 interno/cleanupC1/Spec integrada. ACH27 aberto: CLI flags unsupported/help devem falhar ou apresentar uso antes operação, correção futura delimitada D2, não alterar C0 aceito. Complexity52 failed198warnings0errors, fundaçõesClient/Repository semregressões atuais. Fonte52 codepassed e typescompletion capturada separadamente.

- Sensor oficial types52 passedexit0, `/tmp/stardust-drizzle-d2-types-52.log`; base/fundações atuais code/types e métricas aprovados. ACH23 restantes198 funções de domínio. Assignment54 quatro paths auth/manual registrada, riscos mapperMI residual explícitos e verificação oficial exigida, sem promessa de zero avisos por Builder. Source mutation54 invalidará sensores do escopo; scripts47 continuam6pass se intactos. C0 status card reconciliado com review accepted.

- ACH27 central e lesson No change registrados; revisar --help/flags desconhecidas antes conexão sem expor segredos. C0 review accepted restrito a wiring permanece válido, D2 interno ainda pendente. Nenhum código de CLI alterado nesta reconciliação.

- Mutation54 registrada individualmente antes sensores: bounded auth/manual, autorização/queries/inserts/nulls/FK/order/upsertatomicidade preservados no relatório, principal verificará compilações/métricas e review. Não aceitar redução de warnings por relato. Scripts47seistestsfresh, fundações52intactas. Novos25repos ainda requerem integraçãoS2/reviewerD2.

- Sensores oficiais54 registrados: codepassedexit0, complexityfailed190warnings0errors. Loteauth/manual removeu8warnings, mas3residuais mantêm lote pendente. Tipos54running; fontes anteriores pass47SQL permanecem intactas. Logs `/tmp/stardust-drizzle-d2-code-54.log`, `/tmp/stardust-drizzle-d2-complexity-54.log`; nenhum runtime dos adapters inferido.

- Oficial types54 passou exit0, log `/tmp/stardust-drizzle-d2-types-54.log`. Preparação55 exclusivamente read-only registrada após resultados, para resolver três warnings residuais com papéis reais e paths delimitados. Domainruntime e reviewer continuam pendentes; fonteSQL47 seistests permanece fresh.

- Preparação55 aceita para assignment56 de quatro paths explicitamente registrados: resultado único/error handling coesos, organização guia e persistência individual versus coleção. Query Row inferido sem row shape manual, Core permanece intacto. Riscos de inferência/callback/ordenação seq/duplicatas serão verificados em sensores e review; nenhuma prova de warningpass antecipada. Novas evidências56 invalidarão code/types/metrics anteriores no escopo, não scripts47.

- Mutation56 registrada antes próximos sensores, helper DBinterno não expõe query/row ao Core. Preservação de mapper/guards/seqtx é candidata e requer verificação oficial/review; nenhumwarningpassinferido. Scripts47seistestsfresh porque intactos, histórico50globals pass permanece para fonte50, não56.

- Sensores oficiais56: codepassedexit0, complexityfailed188warnings (190antes),0errors. Três componentes semwarn, ApiKeys umcallbackresidual. Diagnóstico precisa nome de operação concreta, não corrigir às cegas. Tipos56pendente; sourceSQL47seistestsfresh. Logs atuais56 guardados.

- Sensor oficial types56 passou exit0. Correção de diagnóstico: warning residual de ApiKeys é findManyByUserId, CodeGraph fonte real confirma; findOne já limpo e helper56 funciona em tipos. Não repetir correção sobre operação errada. Preparação57 read-only registrada para consulta plural e mapeamento/error boundary coesos, sem policy/gaming/casts. Complexidade188 bloqueia D2; scripts47seistestsfresh.

- Preparação57 aceita para assignment58: construção SQL/ownership versus hidratação/error boundary, utilidade interna coesa com inferência real. Doispaths somente; nunca eliminar filtro, count ou roundtrips como otimização incidental. Mutation58 invalida sensores do escopo, fontesSQL47seistests não mudam. Nenhum runtime ou aceite antecipado.

- Mutation58 registrada antes próximos sensores: responsabilidade de hidratação plural compartilhada, consultas/autorização sem mudança no relatório. Principal verificará types/code/metrics, sem aceitarwarnings eliminados porrelato. Row/query ficamDBinterno, Coreinalterado. Histórico47operational6passfresh; runtimeadapter25aindapendente.

- Resultados oficiais58: codepassedexit0; complexityfailed187warnings, de188antes. Basehelpers eauth/manual agora sem avisos novos; demais domínios ainda bloqueiamD2. Tipos58pendente, não declarar lote fechado até resultado. Logs `/tmp/stardust-drizzle-d2-code-58.log`, `/tmp/stardust-drizzle-d2-complexity-58.log`. Nenhum adapterruntime inferido de métricas.

- Types58 oficialpassedexit0, auth/manual fonte58 code/types e métricas semavisos; revisão/runtimepending. Assignment59 seispaths loja registrado, escopo já pesquisado read-only53. SharedfindOneResult/findManyResults só consumo, base não editada neste59. Novas fontes invalidarão sensores shop, não scripts47 e auth/manual58. Nenhum critério integração aceito por esse lote.

- Mutation59 registrada individualmente antes próximos sensores. Cast de enum role preexistente neste candidato Drizzle identificado e preservado neste lote para não mudar contrato sem diagnóstico; ACH28 aberto, não aceitar cast como legado externo. Rules tipos inferidos/no unsafecasts já claras: No change. Code/types/metrics shopstale até oficial59. ScriptsSQL47seistestsfresh, authorization runtime dos adapters ainda pendente.

- Resultado official59codepassed, complexityfailed179warnings0errors. ACH28 diagnóstico real: literalunion do getterCore coincide comenumSQL; removerassertion redundantpreserva JS/contrato, não introduzir guard artificial. FonteRole/Core/model só leitura, sem mudarCore/model/alias. Avatar/Rocket métricas residuais precisarão lote separado após typedresults.

- Oficialtypes59 passedexit0, log `/tmp/stardust-drizzle-d2-types-59.log`. Assignment60 uma remoção de assertion redundante, causa evidenciada pelos símbolosCore/model sem exigir mudarcontrato. Não escreverteste que espelha esse ajuste reversível; tipos/code serão prova estática, routeintegrationreviewposterior. Rawfields/roles/SQL invariantes intactos.

- Mutation60 registrada antes sensores, assertion unsafe removida por inferência atualModel/Core. Freshcode/types60necessários, não escrever teste que espelha mudança semruntime. ACH28 sourcefixedreviewpending; shopmetrics179 restante Avatar/Rocket eoutrosdomínios. Preparação61 read-only permiteplanejar próximo lote sem mutação sobsensor.

- Proposta61 registrada sem edição/runtime: duasclasses especializadas, semGenericPageAPI/basechange/roundtripsnovos. Tipo agregado inferido explicitamente exigido; arrayORDERBYvazio manterá ausênciaSQL porprova diagnósticadequery. Findings28centralreconciliado, Rulesjáclaras. Nenhum novo código antesgates62.

- Oficial60 code/typespassedexit0: log `/tmp/stardust-drizzle-d2-code-60.log` e types60 correspondente; ACH28 source+types correto, reviewD2pendente. Assignment62 doisrepospermitted registrada comagregadoinferido eSQLordervaziosafetyscope. Novamutationinvalida code/types/metrics dessa page; scripts47permanecemfresh. Nenhuma evidência querySQLdiagnóstica capturada ainda.

- Mutation62 registrada imediatamente; seisresponsabilidades de listing separadas semmanualprojection/agregado, base/mappers/guardsinalterados. SQLorderByempty ausência ainda pendenteprova; verificação diagnóstica read-only63 permitida apósACK, usando ORMreal/estruturasCore reais e.toSQL semmocks/DBwrites. Officialsource62 types/code/metricsfresh necessários, SQL47sixpassedpermanecefresh.

- Diagnóstico63 do Builder recebido:52SQLgeneratedasserts pass semcredentials/params/SQLraw. Ainda relatório candidato até principal reexecutar artifact; fonte de queries62 inalterada. Falha inicial de helper temporário porassumptionAny foi corrigida semmutação source, Rule dispositionNochange convençãoCore jáexplícita. Não invalidascripts47 oufonte62.

- Sensores oficiais62 code/typespassedexit0 e complexityfailed175warnings. TiposcountAwaitedReturnType aprovados, mas listaPageaindablocked. DiagnósticoSQL63 principal reexeciniciada, não aceitarrelato semexit. Preparação64 read-only dosdoisresiduais autorizada, guardandofonte62parafreshsensores/querychecks. Scripts47seistestsfresh, actorroute/runtimependente.

- DiagnósticoSQL63 agora oficial principalpassed52 assertions exit0, zeroDBconnections, parâmetros nãoimpressos; querybuilderproperties atuais62provados, nãoHTTPintegração. Assignment65 separação constructionpagedSQL/execution/hydration delimitada2paths, candidate64semruntime antesmutação. Novafonte65invalidará SQL63/code/types/metrics62paraessespaths eprecisarárepetiçãofresh; scripts47unchanged.

- Mutation65 registrada imediatamente, querypageconstruction eexecution/hydration separadas, nenhuma novaAPI/Core/casts/manualshape/policychange. Officialchecks65 eSQLdiagnósticofreshnecessários antesaceiteshop. Scripts47sixpassed continuamfresh; DomainHTTP/autorização realpendenteS2/reviewer.

- Sensores oficiais65: code exit0, types exit2 por quatro TS2304 range indefinido em listPage; SQLgenerated52asserts passou mas não executa listPage. A primeira transcrição de types como passed estava errada e foi corrigida antes de próxima ação. Complexidadefailed175warnings. Corrigir paginação duplicada residual em dois repos, sem novo pipeline/helper ou alterar expected. FontesSQL47seistestsintactas.

- ACH29 aberto: extração de paginação deixou referências inválidas na execução da página. Correction66 delimitada aos dois callsites, sem casts/variável artificial para esconder erro, sem nova API. Evidência65 de tipos failed, fonte65 in_progress; SQL63 é diagnóstico parcial. Lesson No change: compiler já obrigatório e nunca inferir exit. Principal corrigiu sua transcrição de tipos antes qualquer próxima mutação/sensor. Outros scripts47 continuam6passfresh.

- Reconciliação central29 e28 feita antes próximosensores, nenhuma evidência falsa de tipos65 preservada como aceite. Histórico mantém falha/transcrição corrigida explicitamente. No change Rules: parâmetros/dataflow após refactor e exit factual já exigidos.

- Mutation66 registrada imediatamente, callsduplicados removidos nos dois paths permitidos, countQuery/mapPage/filters/guards intactos. OficialTSC66 precisa passar pararesolverACH29; nãoinferirporedição. SQL52builderdiagnostic serárepetido masnão substituiTSC/HTTP. Métodosloja metricestado65stale, source66inprogressatéverificações.

### D2 — validação oficial da mutação 66
`check:code` e `check:types` do Server passaram (exit 0), logs `/tmp/stardust-drizzle-d2-code-66.log` e `/tmp/stardust-drizzle-d2-types-66.log`. Diagnóstico SQL passou 52 asserções (exit 0), log `/tmp/stardust-principal-shop-sql66.log`; não substitui execução real. Complexidade falhou com 173 warnings e zero errors (exit 2), log `/tmp/stardust-drizzle-d2-complexity-66.log`. ACH29 source corrigido e tipos confirmados; review independente pendente. ACH23 permanece aberto, sem relaxamento do baseline. Conformance 66 continua failed por paths de waves futuras. HEAD 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9.

### Reconciliação dos findings após 66
Tabela central alinhada aos logs oficiais: 173 warnings de complexidade, seis testes operacionais aprovados e ACH29 corrigido com tipos aprovados. Nenhum aceite de review inferido; fontes e SQL intactos.

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
Gates documentais67 passaram; assignment68 será validada antes ativação. SQL operacional47 permanece fresh se fontes intactas. Código/tipos globais50 históricos; sensores dos oito paths serão invalidados pela mutação68.

### Pré-requisito de ambiente — presence-only
Conferência local confirmou variáveis Web/Studio E2E presentes e receipt secret ausente. Não expôs valores, não alterou arquivo nem executou login. VM e receipt runtime permanecem pendentes; pedido anterior para configuração manual continua válido. Gates documentais67/68 passaram sem findings.

### Preparação read-only — gaps de integração e portas
Relatório S2 não é evidência de execução. Famílias sem suites por rota no mapa exigem EV01 via requests reais e verificação posterior de persistência; testes novos não contratados não foram criados. MCP actor vem de authInfo.extra.accountId por request; perfil por id conserva restrição self sem fallback privilegiado. Inspeção ss confirmou conflitos locais nas portas 3000/8000/9002/9003 e disponibilidade de 3334/54323/54345; nenhum processo foi encerrado. Runbook ainda pending em C1. Nenhuma alteração de source/runtime/dados.

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

### Mutação D2-68 — source e falha de format
Execução comum central, queries/paginação/hidratação separadas conforme assignment; guards/SQL/fallbacks alegados pelo Builder aguardam verificação. Format exit1: vírgula residual após return de mapping no Rankers, parse inválido; não executar sensores sobre fonte inválida. ACH30 aberto, mesma Rule de código já clara, No change. Código/tipos/complexidade dos oito paths stale; SQL operacional47 intacto. Nenhum runtime, baseline ou Contract alterado.

### Assignment D2-69 — ACH30
Correção sintática delimitada no Rankers e format dos oito paths68. Exits: parse/format, ACK imediato e sensores oficiais conformance/código/tipos/complexidade. Não alterar guards, fallback, SQL, base ou limiares. Nenhuma alteração de Contract; review pendente.

### ACH30 — disposição de guidance
Vírgula residual de extração é falha local de implementação, capturada pelo formatter. No change: conventions e validação de parse já obrigatórias. Correção automática delimitada69; sem enfraquecer sensor.

### Mutação D2-69 — ACK
Correção de parse registrada antes sensores; formatter passou nos oito paths. Fonte68/69 ainda exige código/tipos/complexidade e review, sem aceitar relato como evidência. SQL operacional47 intacto e fresh; baseline/limiares inalterados. HEAD/base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9.

### Sensores69 — código e inspeção
Código Server69 passed exit0. Complexidade69 failed exit2; tipos ainda pending. CodeGraph fonte atual Rankers e TextBlocks inspecionada: sem shapes paralelos/casts, batch único, índices/fallback mantidos e áudio via expressão SQL atômica com filtro e returning; runtime real ainda pendente. Logs69 preservados. ACH30 parse resolvido no source, review ainda pendente.

### Sensores69 — resultados finais
Tipos69 aprovado exit0, log `/tmp/stardust-drizzle-d2-types-69.log`; código aprovado0 com20 warnings não bloqueantes existentes. Complexidade69 failed2,163 warnings e0 errors, log `/tmp/stardust-drizzle-d2-complexity-69.log`. Lote reduziu10 warnings; quinze residuais nos sete paths (Tiers sem warnings). ACH30 parse e tipos corrigidos, review pendente. ACH23 não resolvido; nenhuma alteração de baseline. Conformance69failedpaths futuros. Próxima preparação70 read-only para completar responsabilidades destes paths.

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
Preparação70 read-only recebida e registrada; fontes69 imutáveis até gates71. SQL operacional47 mantém freshness. Nenhum teste repository criado.

### Preparação read-only de mappers
Achievement/Note/Tier toPersistence reconstruíam campos idênticos aos respectivos DTOs; equivalência numérica OrdinalNumber confirmada. Possível simplificação deve preservar defaults/FK e compilação inferida, sem casts/manual shape. Ainda não implementada, sem evidência comportamental. Assignment71 continua exclusiva aos sete repositories; mappers não autorizados neste lote.

### Mutação D2-71 — estado parcial
Payload/query/ausência e locks separados em quatro paths conforme relato, ainda sem prova oficial. Gerador teve ValueError em trecho Chats formatado; nenhuma escrita nos três paths restantes. Formatter sete paths passou, quatro alterados. Freshness code/types/complexidade dos quatro paths invalidada; operational47 intacto. Disposição No change: falha local de ferramenta de edição; usar patch focado na fonte atual evita reexecução de alterações concluídas.

### Assignment D2-72
Restantes três paths de71 delimitados. Evitar transformação automatizada frágil sobre trechos já formatados. Exits conformance/code/types/complexidade após ACK, sem testes repository ou baseline change. Nenhuma mudança de Contract; D2 in_progress.

### Preparação read-only do Reviewer Database — ACH27/EV03
Reviewer Database pareado, rev6, RF03/04/10/12 CA04/05/06/07/08/20/22. Read-only: scripts/check-drizzle-transition.mjs, scripts/adopt-drizzle-baseline.mjs, apps/server/scripts/migrate-database.ts e suas duas suites scripts/tests contratadas; Rules Database/Code/Server/SDD. Proposta apenas: tratar --help/unknown flags antes env/conexão e demonstrar concorrência cruzada adopt/migrate/rollback. Sem executar operações/DB, editar source/docs/fixtures ou emitir aceite D2; relatório com flags aceitas, gaps reais e teste operacional mínimo seguro. Código de repositories72 continua exclusivamente Builder Database.
Whole47 passou6/6; prova de mixed concurrency e safe CLI ainda pending. Não interpretar preparação como review accepted.

### Limite de agentes na preparação
Ferramenta recusou reativar Reviewer Database por limite de threads. Assignment read-only ainda não executada. Nenhuma nova revisão ou evidência foi presumida; reusar mesmo Reviewer serialmente quando slot disponível. D2 source72 continua independente.

### Mutação D2-72 — ACK imediato
Seleção/range/search e replacementData separados em Chats/Notes; Rankers seleção/join versus classificação/perfil com inferência. Relato de preservação SQL/guards/fallback/roundtrips aguarda sensores/review/runtime. Código/tipos/complexidade dos sete paths stale até resultados72. OperationalSQL47 fontes intactas. Sem baseline, Contract ou testes alterados.

### Sensores72 — resultados parciais
Código72 passed0; complexidade72 failed2,150 warnings/0 errors, log `/tmp/stardust-drizzle-d2-complexity-72.log`. Tipos72 pending, não declarar passado. Redução13 warnings factual, não fechamentoD2. Retomada Reviewer read-only agora aceita pela ferramenta após Builder idle; nenhum script/runtime executado. Conformance72exit1 paths futuros.

### Preparação D2-73 read-only — Rankers e mappers
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22, Rule Pack Database/Code/Server/SDD. Fonte72: dois residuais Rankers rankersSelection MI57.3 e rankersQuery62.4; demais paths71/72 sem warnings novos. Preparar proposta sem editar: Rankers separa projeção SQL user/avatar de join e critérios previous/tier/order; seis mappers profile Achievement/Note, ranking Tier/Ranker, space Planet/Star. DTO equivalência escrita Achievement/Note/Tier conferida principal via CodeGraph; leitura mantém tradução explícita. Paths fora destes sete proibidos. Futura source assignment/gates/ACK/sensores obrigatórios; nenhum source agora.
Métricas/proposta não constituem prova runtime ou review. SQL47 fresh.

### Resultados72 e diagnóstico operacional
Tipos72 passed0; fonte72 código/tipos aprovados, complexidade150 failed2,zero errors. ACH30 resolvido source+parse+tipos, review pendente. Reviewer read-only sem vereditoD2 confirmou parser ignora help/flags desconhecidas e entrypoints não cobertos por suites47 (API imports). Proposta: allowlist compartilhada environment/manifest/phase/help, rollback somente runner; rejeitar duplicate/positional/missing/enum antes manifest/env/conexão; usage sem ambiente; subprocessos reais sentinela sem conexão. EV03: sessão dedicada segura advisory lock, operações adopt/migrate/rollback concorrentes não escrevem antes liberação; aceitar sucesso/fase-stale conforme ordem, verificar catálogo/hash/ledger/dados/lock em legacy/adopted/server-owned. Nenhum comando/DB/source executado por Reviewer; No change Rules claras. CodeGraph não localizou segunda suite; futura investigação direta autorizada para gap. Preparação73 primeira ativação recusada pelo host, serialização será repetida sem criar agentes.

### Freshness dos findings72
Tabela central reflete 150 warnings atuais e resolução sintática/tipos ACH30; nenhum estado integrado ou review convertido em passed por inferência.

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
Preparação73 recebida sem edits/runtime; official72code/typespassed,complexity150failed. Mutação74 invalidará esses paths somente; operationalSQL47 fontes intactas.

### Mutação D2-74 — ACK
Fonte alterada nos sete paths definidos; tipos inferidos mantidos, alegações de campos/ordem/defaults aguardam oficial. Nenhum Core/model/base/SQL/teste/baseline alterado. Código/tipos/complexidade dos paths stale até resultados74; reviewD2/runtimeS2 pendentes. OperationalSQL47 intacto.

### Preparação D2-75 read-only — ACH27/EV03
Builder Database, rev6 RF03/04/10/12 CA04/05/06/07/08/20/22, Rules Database/Code/Server/SDD. Paths três scripts operacionais + duas suites existentes. Relatório Reviewer factual anexado no histórico; preparar parser CLI compartilhado, entrypoints subprocessos reais e concorrência cruzada sob advisory lock em Docker owned. Não executar CLI/DB nem alterar source enquanto sensores74 ativos. APIs importadas/defaults/URL memory-safe e cleanup preservados; novas suites/paths proibidos. Exits futura assignment/gates/ACK/sensores e testes reais.
Whole47 seis testes fresh até source scripts; após correção será stale e exigirá rodada completa. Nenhum contrato ou limite alterado.

### Sensores74 — métricas atuais
Código74 passed0. Complexidade74 failed2 com144 warnings/0 errors, seis residuais Achievement toEntity63.5, Ranker profile62.8, Planet toEntity61.9, Star toEntity63.5/toPersistence64.8 e Rankers selection63.2. Logs74 preservados. Tipos74 pending. Nenhum relaxamento baseline/threshold ou aceite runtime; mapper source74 segue in_progress até correção e review.

### Tipos74 e proposta operacional75
Tipos74 oficial passed0, `/tmp/stardust-drizzle-d2-types-74.log`. CLI/mixed concurrency proposta read-only recebida; não executada. APIs/defaults permanecem authority, CLI seguro antes env/manifest/conexão. Observabilidade precisa conexões application_name exclusivas: pg_try_advisory_lock faz polling, não gera três locks pendentes em pg_locks. Prova deve confirmar holder e três sessões vivas sem mutação antes liberação, sem presumir fila blocking. Whole47 fica stale somente após source scripts, ainda intacto.

### Assignment D2-76 — ACH27 e EV03
Builder Database, Spec rev6/base congelados, RF03/04/05/12 CA04/05/06/07/08/20/22, RP/JN Context da Spec, SHI/Design não aplicável. Paths exclusivos scripts/check-drizzle-transition.mjs, scripts/adopt-drizzle-baseline.mjs, apps/server/scripts/migrate-database.ts, scripts/tests/check-drizzle-transition.test.mjs, scripts/tests/adopt-drizzle-baseline.test.mjs. Rules Database/migrations/Code/Server/SDD/test-integrity. Parser compartilhado estrito allowlist environment/manifest/phase/help, rollback só runner; preserve APIs/defaults, mensagens sanitizadas e no env/manifest/conexão antes validação. Subprocessos reais três entrypoints, TCP sentinela própria, help/invalid zero conexões. Mixed concurrency três operações reais por phase legacy/adopted/server-owned em clone owned existente, holder sessão comum, três conexões identificadas sem dados sensíveis, não escrita antes liberar, ordem serial/falhas fase aceitáveis, catálogo/hash/ledger/dados/sourcehistórico intactos e lock nenhum depois. pg_try_advisory_lock faz polling: não exigir três pg_locks pendentes; usar presença de sessões e holder, sem fingir fila. Demais paths/repos/metadata/SQL/fixtures docs/segredos/baseline proibidos. Fonte/teste pode mudar conjuntamente em um lote coerente, format/report e pausa ACK antes sensor/runtime. Exits principal conformance/código/tipos/integridade/suites duas completas reais e cleanup; Reviewer pareado pending. Source ativará somente após unit74 terminar e gates76 passar.
Proposta75 read-only base, nenhuma edição operacional ainda. Whole47 fresh agora, ficará stale na mutação76; não reutilizar resultado47 para source76. Complexidade144 continua bloqueio separado.

### Unitários oficiais74
Server test:unit passou exit0,168/168 suites e325/325 tests,74.275s. Log `/tmp/stardust-drizzle-d2-unit-74.log`. São regressões da composição atual; não substituem rotas reais de25ports/S2. Código/tipos74 aprovados, complexidade144failed; nenhum baseline versionado alterado. Assignment76 pode iniciar agora, operational47 será stale quando scripts mudarem.

### Inspeção atual source74
Mappers mantêm DTO escrita exato e seleção explícita de agregados. Seis residuais atuais podem ser corrigidos com grupos de DTO/projeção reais: identidade versus progresso, catálogo versus requisitos/recompensa, perfil versus avatar, seleção de colunas versus join. Não aceitar helper de campo único ou relaxamento de sensor. Inspeção read-only não constitui prova runtime ou aceite review. Source76 pertence a scripts e permanece exclusivo.

### Ambiente real — informação pendente
Pergunta assíncrona apresentada para resolver conflitos de portas e secret ausente antes VM/C1/S2runtime. Não é aceite nem timeout convertido em aprovação. Resposta pendente; quatro credenciais E2E presença confirmada sem valores. Demais source autorizado continua, sem bloquear progresso independente.

### Mutação D2-76 — ACK imediato
CLI agora pretende rejeitar argumentos inválidos antes env/manifest/conexão e help sem ambiente, APIs/defaults preservados no relato. Testes reais TCP sentinel e entrypoints concorrentes com observabilidade application_name adicionados nos paths existentes. Não executados ainda; ACH27 e CA06/EV03 permanecem in_progress. Whole47 seis passou source anterior, agora stale para scripts76; nova rodada completa obrigatória. Nenhum SQL/metadata/repos/baseline/segredo alterado.

### Preparação D2-77 read-only — seis residuais74
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22 Rules Database/Code/Server/SDD. Fonte só para proposta: RankersRepository rankersSelection; AchievementMapper toEntity; RankerMapper profile; PlanetMapper toEntity; StarMapper toEntity/toPersistence. Projeções/grupos coesos de identidade/catálogo/requisitos/progresso/perfil-avatar; sem helpers microcampo, sem source/runtime enquanto testes76. Paths já inspecionados CodeGraph principal source74, DTO writes Note/Tier/Achievement aprovados em tipos. Plano futuro deve preservar campos/FK/defaults/inferência e queries exatamente. Assignment/gates só depois resultados76.
Oficiais76 globais e testes reais ativos, nenhum source concorrente permitido.

### Código global76 — resultado oficial
check:code passed exit0; logs globais76 preservados. Tipos/testes operacionais76 pending. Primeiro caso clone legado/adoção passou, prova parcial não equivale rodada inteira. Source76 congelado durante sensores; preparação77 somente read-only, sem contaminação de evidência.

### Proposta read-only77
Recebida sem edição ou execução. Planeja completar seis residuais mapper/Rankers por grupos de campos, sem mudanças contrato. Globaltypes76/operational76 ainda pending; não ativar novo source antes término. Warnings Node/Vite existentes preservados, sem suprimir/configurar fora escopo; Node24 usado nos testes operacionais reais.

### Oficiais76 — nova prova local EV03
Wholeoperational76 passou exit0,8/8tests,0 skips/0 failures,196.499963s, log `/tmp/stardust-drizzle-operational-tests-76.log`. Cobriu help/invalids sem env/manifest/conexão nos três entrypoints reais, mixed adopt/migrate/rollback nas três phases com lock/sessões/não escrita/serialização/catalog/hash/ledger/dados, e todas seis regressões47. Typesglobal76 passed0,7/7tasks,2m13.065s; codeglobal76 passed0. ACH27 source e provaCLI resolvidos, review pendente. CA06/EV03 local agora inclui mixed concurrency, não falta mais essa prova. Parity remota/stackDataAPI e versão antiga continuam pending; conformance76failedfuturepaths. Nenhum baseline/segredo alterado.

### Cleanup e estado atual76
Inspeção final Docker confirmou ausência de containers test/runner gerados pelas suites, sem remover outros projetos ou cloneD1. Tabela CA06 agora passed local, ACH27 corrigido/verificado com reviewer pending e ACH23 métricas144 alinhadas. Histórico47 preservado como resultado source anterior; rodada76 é prova fresh atual.

### Assignment D2-78 — completar seis residuais mapper/Rankers
Builder Database, rev6/base congelados RF01/02/12 CA01/02/03/20/22, RP/JN Context, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/repositories/ranking/DrizzleRankersRepository.ts`
- `apps/server/src/database/drizzle/mappers/profile/DrizzleAchievementMapper.ts`
- `apps/server/src/database/drizzle/mappers/ranking/DrizzleRankerMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzlePlanetMapper.ts`
- `apps/server/src/database/drizzle/mappers/space/DrizzleStarMapper.ts`
Rules Database/Code/Server/SDD. Plano77: composição inferida de columns vs selection/join; Achievement identidade/catalog versus requirements; Ranker avatar normalizado separado de profile; Planet catálogo/organização versus progresso/stars; Star identidade versus activity, persist identity selecionada com planetId obrigatório, counters excluídos. Preservar fields/defaults/FK/order/nullable semantics e inferência. Demais paths/base/Core/SQL/scripts/testes/baseline/thresholds proibidos. Exits format/report/pausa ACK antes sensores; principal conformance/code/types/complexidade e diagnósticoSQL específico posterior. Sem microhelper/gaming ou novos testes repo. In_progress, não aceitar zero warnings por relato.
Header Plan reconciliado oito testes76, operacionalSQL/CLI76 fresh e source intacto nessa assignment. Mutação78 invalidará somente paths de mapper/repo; unitServer74 histórico para paths modificados. ReviewD2/runtimeS2 pendentes.

### Inventário factual legado D2
Hash dos26paths Supabase antigos igual ao commit fonte congelado, incluindo24migrations. Nenhuma alteração do usuário nesses paths foi detectada; nada removido nesta inspeção. Proof76 mostra recuperação/replay via Gitbase em clone owned; futura remoção não substitui runner/ComposeC1 e integraçãoS2. Nenhum conteúdo/segredo impresso.

### Mutação D2-78 — ACK
Cinco paths mapper/Rankers source alterados; default/DTO writes/FK/counters/select/order preservados no relato, aguardam oficial. Patch rejeitado antes qualquer escrita não foi mutação source; retry único registrado. Código/tipos/complexidade stale para cinco paths; operacional76 continua fresh8/8, fontes intactas. Baseline/Contract/SQL/Core/testes não alterados.

### Oficiais78 — grupo mapper/Rankers concluído para sensores
check:code/types passed0. Complexity78 failed2,138warnings/0errors, nenhum residual nos cinco paths78; log `/tmp/stardust-drizzle-d2-complexity-78.log`. Campos/guards ainda dependem reviewD2/runtimeS2, não aceitarSpec integrada. SQL76seisregressões+CLI+mixed8passed fontes intactas; conformance78failedpaths futuros. ACH23 restantes138, sembaseline/thresholdalterado.

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
Source78code/typespassed e138warnings restantes; operacional76 fresh8/8 antes remoção. Futura prova replay deve mostrar independência dos arquivos deletados. Nenhum Contract/baseline alterado.

### Mutação D2-79 — ACK
Remove26 autorizado executado com revalidação SHA e unlink por arquivo. Sem perda/edit do usuário, dadosDB intocados. Adapterlegacy consumido mantido atéD3. Operational76 fresh para scripts/SQL intactos, mas independência dos arquivos retirados será provada por replayCLI24/adopt real novamente. CI/db:test legado interim indisponível atéC1; não iniciarS2 antes. Globals/unit foco checkpoint79 pendentes, complexity138 ainda aberta.

### Preparação D2-80 read-only — domínios restantes simples
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22 Rules Database/Code/Server/SDD. Paths para proposta: repositories/space/DrizzlePlanetsRepository.ts e DrizzleStarsRepository.ts, repositories/profile/DrizzleAchievementsRepository.ts, repositories/playground/DrizzleSnippetsRepository.ts, mappers/playground/DrizzleSnippetMapper.ts, mappers/conversation/DrizzleChatMessageMapper.ts, mappers/lesson/DrizzleQuestionMapper.ts. Relatório78 mostra18funções com warnings nesses7paths. Preparar plano por query/inferência/guarda/hidratação/transações reais, sem microhelpers ou casts, baseline/model/Core changes. Nenhuma source/DB/sensor enquanto globais79/replay ativos. Paths exatos futuraassignment/gates/ACK necessários.
Source79 remove26 registrado; conformance79expectedfuturepathsfailed. Scripts76intactos8pass, replay específico pósremoção79running; complexidade138 ainda bloqueiaD2.

### Oficiais79 — recuperação comprovada após Remove26
ReplaylegacyCLI24 via Gitbase, adoção/dados/concurrent adoption passed exit0,1/1test,0skips,51.969551s, log `/tmp/stardust-drizzle-legacy-replay-79.log`. Confirma recuperação independente dos26files atuais removidos; scripts76intactos8pass continuamfresh. Código global79 passed0. Test-integrity79 passed0 (10changedtestfiles,3testablesource,193excluídos segundoRules), log `/tmp/stardust-drizzle-integrity-79.log`. Types/unit/architecture79 ainda pending. Nenhum source extra durante sensor.

### Oficiais79 — falha unit global
Tipos79passed0 eArchitecture79passed0 sem violations3874modules6952deps. Unit79 failed1 no Server, quatro outros workspacespassed, log `/tmp/stardust-drizzle-global-unit-79.log`. Resultado histórico74unitServerpass não substitui estecheckpoint; source79inprogressatédiagnóstico/correção. Replay79passed1/1 e code/integritypassed continuamfresh. Próxima source domain81 não ativada; resolver erro observado primeiro.

### ACH31 — falha e lição
Globalunit79 Server falhou somente FeedbackConversationCascade.test.ts (1caso,167suites/324cases passed) por ENOENT schema.sql; outros4workspacespassed. Fonte não indexada pelo CodeGraph, leitura direta autorizada confirmou contrato cascade reports→messages→attachments via regex legado. Resolver ordenação conforme Spec: portar comportamento realS2 antes remover teste proibido/schema lido. Plan transferiu único Remove schema.sql paraD3 mesmoowner, sem mudar504paths/finalContract/rev6. No change Rules claras; não excluir teste/alterarbaseline/duplicar schema para silenciar falha. Restauração original transitória atéD3 e testeunitafetado requerido.

### Assignment D2-81 — source correction
Restaurar somente schema.sql legado exato; não reintroduzir migrations/config ou novos usos. Assignment/gates antesBuilder. Sem decisão produto/Contract, revisão6preservada; complexo138 continuaaberto. Prova replay79passdeindependênciaSQL24 permanecefactual.

### Mutação D2-81 — ACK
Restauração transitória byteidêntica do arquivo lido pelo legado, finalRemoveD3 mantido. ACH31 source corrigido, unitfreshpending. Tipos/code/architecture79 deTSsources inalterados continuamfresh; replay79/operational76 fontesimutáveis aprovados. Globalunit79failed preservado, rerunescopoServerafetado necessário antes domain82source.

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
Preparação80read-only registrada, unitcorrection81 ativo; nenhum source82 ainda. Sourcescripts76fresh8pass/replay79pass, compilaçãoTS79globalsapproved. Source82 invalidará sete paths e sensorServer relacionado após mutação.

### Correction path81 — prova oficial
UnitServer81 passedexit0, log `/tmp/stardust-drizzle-d2-unit-81.log`. Reexecutado somente workspaceafetado pela falha79; outros4workspaces79passedfresh sem edits. Global79failedhistorypreservado, finalglobalsC2continuamrequired. ACH31restoredoriginaltransient+unitcorrected, sequencingfinalRemoveD3mesmoContract. Cleanup apósreplay79semtest/runnercontainers. Source82podeiniciarapósassignment/gatespassed, code/types/architecture79TSfreshaténewsource.

### Mutação D2-82 — ACK
Query/projection/hidratação/autorização e payloads separados conformeassignment, alegações de count/null/order/locks/tx/defaults aguardam oficial. Castsender redundante removido comproofGetterunion, Coreinalterado; Rulealreadyclear Nochange. Setepaths code/types/complexity stale. Sourcescripts76/replay79/schema81 intactos, proofs8pass/1pass/unit81freshparaescoposinalterados. ReviewD2/runtimeS2pending.

### Oficiais82 — métricas e freshness
Code/types82passedexit0, logs82. Complexity82failedexit2,129warnings0errors;9residuais: Question toEntity62.9; SnippetMapper toEntity62.5/author63.6/toPersistence63.5; SnippetsRepo visibility62.3/readQuery62.4; Achievements unlockedQuery61.2; Planets planetsQuery64.2; Stars replaceStar57.6. Redução9 factual, não fechamentoD2. ScriptsSQL/CLI76fresh8/8, replay79fresh1/1, unitServer81freshparaescoposnãoalterados. Review/runtimeS2pending, baselinesimutáveis.

### Preparação D2-83 read-only — residuais82
BuilderDatabase rev6 RF01/02/12 CA01/02/03/20/22 RulesDatabase/Code/Server/SDD. Só6paths residuais82: QuestionMapper,SnippetMapper,SnippetsRepository,AchievementsRepository,PlanetsRepository,StarsRepository. Propor divisões por operação/semânticaSQL/projeção/DTO coerente e erro/fallback/locks preservados; não microhelper/cast/gaming/modelbasechanges. Nenhuma source/runtime/sensor atéassignment/gates. Exitsoficiaiscode/types/metrics/reviewer/runtimeposterior.
Tipos/code82pass, complexity129failed; não aceitar proposta como sensor. ChatMessageMappercleansemnovaedição.

### Assignment D2-84 — residuais82
BuilderDatabase rev6/base congelados RF01/02/12 CA01/02/03/20/22 RP/JN Context, SHI/Design não afetados. Paths exclusivos:
- `apps/server/src/database/drizzle/mappers/lesson/DrizzleQuestionMapper.ts`
- `apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts`
- `apps/server/src/database/drizzle/repositories/playground/DrizzleSnippetsRepository.ts`
- `apps/server/src/database/drizzle/repositories/profile/DrizzleAchievementsRepository.ts`
- `apps/server/src/database/drizzle/repositories/space/DrizzlePlanetsRepository.ts`
- `apps/server/src/database/drizzle/repositories/space/DrizzleStarsRepository.ts`
RulesDatabase/Code/Server/SDD. Proposta83: Question reconhece família e constrói/narrowsemcast, toEntityopen→choice→arrangement e mesmo AppError desconhecido; Snippet grupos conteúdo/visibilidade/identity/owner/time/author/avatar inferidos defaultsiguais; Snippetscolumns/join versus visibility pública/owner; Achievementsselection versus userfilter/order; Planetsqueryordenada vs limite1 mantendo duasqueriesagregadas; Stars SELECT FORUPDATE/currentFK versus update sob mesmotx/lock e ausentereturn. Não deslocarcorpoparahelperinteiro que absorva warningsemresponsabilidade distinta, nem microhelpers/gaming. Demaispaths/Core/base/models/scripts/SQL/testes/docs/baseline/thresholds proibidos. Exitsformat/report/pausaACKantesensor; principalconformance/code/types/complexity, diagnósticodelimitado posterior, reviewer/runtimeS2pending. SemDB/remotowrite neste lote.
Source82code/typespassedcomplex129failed. Proposta83read-only recebida; nenhumaediçãoantesgates. Scripts76replay79schema81imutáveis;unit81históricoparasourcealterado82. Contractrev6mantido.

### Mutação D2-84 — ACK imediato
Source dos seis paths registrado; alegações de defaults/FK/query/guard/order/roundtrips/narrowing aguardam prova oficial. Sem outra mutação intermediária no patch rejeitado. Scripts/SQL/testes76 e schema81 intactos, operational8pass/replay79pass fresh. Código/tipos/complexidade dos seis paths stale, ReviewerD2/runtimeS2pending. TabelaACH23 reconciliada 129warnings82, sem baseline/threshold changes.

### Oficiais84 — resultado final
Code/types84passedexit0. Complexity84failedexit2,122warnings0errors, log `/tmp/stardust-drizzle-d2-complexity-84.log`. Cinco outros paths84 clean; SnippetMapper author63.6/content64.8 permanecem. Prepare correction de grupos identity/avatar e conteúdo/data semmicrohelper, mesmaRulePack/RFCA, inferência/fallbacks intactos. Sourceoperacional76/schema81intactos; proof8/1fresh e review/runtimeS2pending.

### Assignment D2-86 — SnippetMapper residuais
Builder Database, rev6/base congelados, RF01/02/12 CA01/02/03/20/22 RP/JN Context, SHI/Design não afetados. Único path apps/server/src/database/drizzle/mappers/playground/DrizzleSnippetMapper.ts. Preparação85 principal CodeGraph fonte84 confirmou dois métodos residuais. Rules Database/Code/Server/SDD. Separar envelope author.id de author.entity perfil slug/name/avatar (helper interno coeso, mesmos defaults), sem chamadas/fields extras. Content separar conteúdo title/code de metadata id/isPublic/createdAt, tipos Pick inferidos/DTO existente, todos fallbacks atuais preservados. A função toEntity compõe DTO explícito, toPersistence atual aprovado não alterar. Não helper de campo isolado ou cast, demaispaths/Core/models/base/SQL/scripts/testes/docs/baseline proibidos. Exits format/report pausa ACK antes sensor; principalconformance/code/types/complexidade/review/runtime posterior. Source86 só após gatespassed; fonteSQL76/replay79/schema81imutável.
Code/types84passed e122warnings/0errors, dois locais destepath. Proposta de responsabilidade deriva fonte CodeGraph atual, nenhum novoContract/revision. Source86invalidarámapperrelatedcode/types/metrics,semruntimeDB.

### Gate86 — falha documental
Plan-definition retornou erro placeholder TODO por ocorrência textual na palavra portuguesa usada para função toEntity. Não há placeholder de implementação; source não iniciou. Correção documental local de wording, No change Rules e checker fora Contract inalterado. Rerun gates obrigatório antes Builder.

### Correção documental86
Texto do ledger ajustado sem mudança de assignment/paths/Contract. Evidência de gate86 anterior failed preservada; novo gate necessário.

### Gate86 — correção do registro
O nome literal do marcador no diagnóstico acionou o checker após primeira reescrita. Plan agora descreve o marcador sem reproduzir o token; Evaluation mantém a causa factual. Source86 ainda não iniciada. Sem alteração de código, Rules ou checker.

### Mutação D2-86 — ACK imediato
Source mapper registrado antes sensores; authorIdentity contém perfil slug/name, id no envelope permanece fallback original. Campos de conteúdo/visibilidade/data agrupados sem casts. Código/tipos/complexidade deste path stale; proofs SQL/CLI76/replay79/schema81 intocados. Review/runtimeS2 pendentes, sem baseline/Contract edit.

### Preparação D2-87 read-only — domínio challenging
Builder Database, rev6 RF01/02/12 CA01/02/03/20/22, RP/JN Context e SHI/Design não afetados. Proposta para oito paths: repositories/challenging/DrizzleChallengeCodeExecutionsRepository.ts, DrizzleChallengeSourcesRepository.ts, DrizzleChallengesRepository.ts, DrizzleSolutionsRepository.ts; mappers/challenging/DrizzleChallengeCodeExecutionMapper.ts, DrizzleChallengeSourceMapper.ts, DrizzleChallengeMapper.ts, DrizzleSolutionMapper.ts. Log84 aponta48warnings nessespaths. Use responsabilidades de query/projection/joins/filtros/paginação/contagem/autor/hidratação e writes/locks/tx, helpers existentes. Preservar visibilidade privada/own/God/system, SQLRPCsubstituído, views counters atômicos, replacement/FK/ordens/NULLs/defaults e DTO fields exatamente. Tipos derivados query/model/DTO, sem casts/manualshadowSQLshape/microhelpers/gaming. Nenhuma source/DB/sensor enquanto86ativos. Retorne plano delimitado/exits, não promessa de zero avisos. Modelcallback permanece fora dessa proposta, SQL/Kit/Base/Core/testes/docs/baseline proibidos.
Somente preparação, source86mapperisolado imutável para sensores. Operacionais76 oito testes e replay79 aprovados, integraçãoS2/review pending. Nenhum amendment de Contract.

## Checks e build do CI

| ID | Verificação | Estado | HEAD / evidência |
| --- | --- | --- | --- |
| CI-01 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-02 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-03 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-04 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-05 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-06 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-07 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-08 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-09 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-10 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-11 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |
| CI-12 | Gate conforme Plan | pending | 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9; sem CI de candidato |

## Warnings e findings

| Finding | Estado | Resultado e limite |
| --- | --- | --- |
| ACH-01 | resolved | Bootstrap do clone corrigido; replay completo passou. |
| ACH-02 | resolved | Aliases dos ports Core corrigidos; types e review S1 passaram. |
| ACH-03 | resolved | RawBody atravessa registration real; teste BFF passou. |
| ACH-04 | resolved para D1 | Manifest recapturado com owner postgres; parity conferida. |
| ACH-05 / IR-D1-01 | resolved | Imports DTO reais; types e re-review D1 aceitos. |
| ACH-06 | resolved | Environment Node 30.4.1 explícito; BFF tests executam. |
| ACH-07 | resolved para D1 | Índices DESC usam NULLS FIRST; parity completa passou. |
| ACH-08 | resolved | Teste isola RPC externo; mantém BFF/cliente reais. |
| ACH-09 | resolved | Headers inválidos de representação/hop retirados; 25 tests passed. |
| ACH-10 | resolved | Fixture social usa id obrigatório; types Web passou após correção. |
| ACH-11 | resolved | Regex reparada; regressão, integrity e review coordination passaram. |
| ACH-12 | resolved | Origem configurada aceita loopback canônico; BFF e browser passaram. |
| ACH-13 | in_progress | Campo/valor sintético removido; types/review D2 pendentes. |
| ACH-14 | in_progress | toDto Ranker obrigatório adicionado; próximo sensor/review pendentes. |
| ACH-15 | in_progress | Lookup OAuth legado referencia colunas inexistentes; ausência real nullable definida, review pendente. |
| ACH-16 | in_progress | Alias ChallengeCategory corrigido; tipos passaram, revisão D2 pendente. |
| ACH-17 | in_progress | Slug obrigatório obtido da entidade; tipos passaram, revisão D2 pendente. |
| ACH-18 | in_progress | Aliases, seleção e status corrigidos; types passaram, runtime/review D2 pendentes. |
| ACH-19 | in_progress | findById restrito à conta do contexto; types passaram, runtime/review pendentes. |
| ACH-20 | resolved | Override exato de meta JSON preserva Kit; code/types/unit e reviewer coordination passaram. |
| ACH-21 | in_progress | Format Comments corrigido e code passou; review Database D2 pendente. |
| ACH-22 | in_progress | Callback operacional tipado por JSDoc real; types passaram, runtime/review pendentes. |
| ACH-23 | in_progress | Complexity atual D2-88 exit2:120 warnings/0 errors, aumento de oito sobre 87; `check:code` passou, types segue, unit pendente. Baseline inalterado; correction da regressão aberta. |
| ACH-24 | in_progress | Bootstrap, conexão CLI local e cleanup corrigidos; whole47 passou 6/6, zero skips. Review independente pendente; falhas40/41 preservadas no histórico. |
| ACH-25 | in_progress | SQL routines corrigido43; whole47 passou 6/6, tipos posteriores passaram. Reviewer D2 pendente. |
| ACH-26 | in_progress | Slots físicos removidos em rockets causavam falso drift. Ordinal relativo comparado nos dois lados45; focusedempty/rollback passaram; rawmanifest preservado, review pendente. |
| ACH-27 | in_progress | Parser estrito76 e subprocessos reais help/invalids passaram whole76, zero conexões antes operação. Review Database pendente; wiring C0 aceito. |
| ACH-28 | in_progress | Cast redundante removido60; código/tipos oficiais passaram, revisão D2 pendente. |
| ACH-29 | in_progress | Extração65 deixou quatro referências a range indefinido; correção66 dos callsites passou código e tipos. SQL diagnóstico 52/52 passou; review D2 pendente. |

| ACH-30 | in_progress | Vírgula residual68 corrigida69; format, código e tipos69/72 passaram. Review D2 pendente. |

| ACH-31 | in_progress | Schema legado restaurado81 byte idêntico; unitServer81passed. Remoção final adiadaD3 após portS2/testlegadoRemove, mesmoContract504paths; reviewer pendente. |
| ACH-32 | resolved | Formatter principal reprovou um encadeamento em `DrizzleChallengesRepository.ts`; mesmo Builder corrigiu apenas a formatação, e a nova verificação sem escrita passou exit0. |
| ACH-33 | resolved | Annotation corrigida para `Pick<Challenge['dto'], 'title' | 'description'>`, fallback preservado; code/types/unit globais passaram exit0. |
| ACH-34 | accepted baseline; C2 pending | Por solicitação explícita do usuário em 2026-10-05, a baseline global foi atualizada para o estado atual, sem alterar thresholds. Findings presentes passam a ser dívida aceita; regressões acima da baseline continuam bloqueando CI-09. |
| ACH-44 | resolved for integration; D3 cleanup pending | Fixtures de `UserFeedbackHistoryRoutes` agora usam SQL local privilegiado em vez de Data API revogada; 6/6 testes de reporting history e persistence passam. O path ainda será removido conforme D3. |
| ACH-45 | resolved | Full Server integration re-run passou; a fixture Auth usa UUID real e a chave SHA-256 esperada. Sem alteração de middleware/status. |
| ACH-47 | accepted baseline; C2 pending | D-12 atualiza a baseline conforme pedido; `check:complexity` atual passa com 0 warnings/0 errors novos. Não altera thresholds e não permite novos findings no C2. |

- Dev/Prod, backup restaurado e corte permanecem não validados; nenhum resultado de runtime remoto foi presumido.
- Overview ausente conforme lacuna já aprovada; não criar nesta entrega.

## Análise preventiva dos findings

| Finding | Causa | Ação preventiva/documento | Estado |
| --- | --- | --- | --- |
| ACH-01/ACH-04 | Bootstrap/owner do clone | No change — stack/runner e parity já explicitados; reproduzir papel e limpar clone completo. | registrado |
| ACH-02/ACH-05 | Alias presumido sem conferir export | No change — Rules exigem fronteira Core válida; usar exports/consumidores reais. | registrado |
| ACH-03 | Schema de registro elimina campo desconhecido | No change — wire interno compatível dentro dos paths contratados, com roundtrip testado. | registrado |
| ACH-06/ACH-08 | Dependência/ESM do ambiente de teste | No change — declarar environment compatível e mockar somente boundary externo. | registrado |
| ACH-07 | Default de NULLS diferente no ORM | No change — parity de schema já obrigatória; conferir definição completa de índices. | registrado |
| ACH-09 | Headers upstream não representam corpo retornado | No change — BFF responde pelo transporte; testar headers além de body/status. | registrado |
| ACH-10 | DTO permite id ausente, payload não | No change — fixture define id obrigatório sem cast. | registrado |
| ACH-11 | Regex não cobre localização documentada | No change Rules — corrigir detector contra convenção já explícita. | registrado |
| ACH-12 | NextURL normaliza loopback | No change — autoridade de origem é configuração da app, com regressão de runtime. | registrado |
| ACH-13 | Projeção incluiu campo não retornado pelo join | No change — inferir apenas campos reais, sem placeholders; S1/Rules já explícitos. | registrado |
| ACH-14 | Método obrigatório omitido | No change — conferir lista literal do Contract, sem limitar ao uso atual. | registrado |
| ACH-15 | Ports obsoletos referem coluna removida | No change — model/catálogo são autoridade; não inventar associações Auth nem SQL impossível. | registrado |
| ACH-16/ACH-17/ACH-18 | Alias e seleção incompatíveis com tipos reais | No change — exports, entidades e projeções inferidas já exigidos; validar snapshot completo antes de revisão. | registrado |
| ACH-19 | Operação não aplica restrição literal do Contract | No change — S3 já exige contexto verificado e isolamento; conferir operação individual, além da política geral. | registrado |
| ACH-20 | Tooling tenta reescrever artefato gerado | No change Rules — preservar bytes da ferramenta e limitar override de formatter aos meta JSON. | registrado |
| ACH-21 | Relato de formatter não substitui sensor | No change — executar detector sobre candidato estável e corrigir diferença no owner. | registrado |
| ACH-22 | Helper JS não fornece contexto de tipos ao TS | No change — tipos reais nas fronteiras já exigidos; JSDoc genérico com API do driver, sem cast. | registrado |
| ACH-23 | in_progress | Complexity atual D2-88 exit2:120 warnings/0 errors, aumento de oito sobre 87; `check:code` passou, types segue, unit pendente. Baseline inalterado; correction da regressão aberta. |
| ACH-24 | Bootstrap reproduzível e diagnóstico sanitizado de ensaios reais | No change — Rules já exigem provas reais, independência de fixtures efêmeras e proteção de credenciais; causa factual pendente. | registrado |
| ACH-25 | DDL e ACL devem respeitar o tipo real de routine | No change — catálogo e migrations já exigem fidelidade de tipos/assinaturas; usar PROCEDURE e ACL ROUTINE conforme autoridade. | registrado |
| ACH-26 | Comparar ordem de colunas presentes preservando manifesto legado | No change — paridade semântica exige nomes/ordem/tipos/defaults, não slots físicos de colunas excluídas. | registrado |
| ACH-27 | Validar argumentos CLI antes de operação de banco | No change — guards fail-closed e relatórios sanitizados já exigidos; help e flags inválidas devem terminar sem conectar/escrever. | registrado |
| ACH-28 | Preservar inferência em enum de domínio e SQL | No change — tipos inferidos e ausência de casts inseguros já exigidos; union literal compatível dispensa assertion. | registrado |
| ACH-29 | Revalidar callsites após extração de query | No change — check de tipos já obrigatório; manter paginação em um único lugar e registrar exit real sem inferência. | registrado |
| ACH-32 | Divergência entre formatter reportado e verificação principal | No change — Rules já exigem format efetivo; verificar com format sem escrita antes de considerar a edição pronta. | registrado |
| ACH-33 | Annotation nullable incompatível apesar de fallback | No change — usar DTO normalizado/inferência da query conforme Database Rules e provar no typecheck. | registrado |
| ACH-34 | Complexidade total aumentou apesar das extrações | D-12 atualiza a baseline uma vez para aceitar os findings atuais; thresholds permanecem. Future findings acima da baseline devem ser corrigidos sem nova atualização indiscriminada. | baseline aceita; monitorar no C2 |

## Decisões

- Implementação Plan-backed na task atual, três Builders estáveis, conforme aprovação e skill implement-spec.
- C0 retém dependências Web até W1/W2 removerem imports; npm é fonte do lockfile.

## Lições aprendidas

### 2026-10-05 — baseline global de complexity

Por instrução explícita do usuário, executei `npm run update:complexity-baseline`; o arquivo anterior estava datado de 2026-09-17. Metadata anterior: 3.281 arquivos, 8.287 funções, 2.563 warning findings e 245 error findings; snapshot atualizado: 3.476 arquivos, 9.479 funções, 2.702 warning findings e 243 error findings. Nenhum threshold foi alterado. A validação `npm run check:complexity` passou: 3.476 arquivos, 9.479 funções, 0 warnings e 0 errors acima da nova baseline. Os findings aceitos não foram refatorados por essa ação; CI-09 ainda precisa ser executado no candidato C2 sem atualizar novamente a baseline.

- Os findings foram corrigidos sob Rules existentes; nenhum deles exigiu alterar uma autoridade. Verificar exports reais, owner do replay e definição completa de índices antes de aceitar parity.

## Alinhamento documental

- Spec/Plan revisão 6 alinhados; status em execução, sem critérios presumidos passed.
- Rules/Architecture/Tooling possuem transição aprovada, finalização após runtime validado.


## Conclusão

- Estado: `in_progress`; C0/D1/S1 aceitos apenas em seus escopos.
- Próxima ação: concluir persistência/migrations D2 e transporte/testes W1, validar seus exits e então iniciar C1/S2.

### Registro atual D2-86 / D2-87

- D2-86: o Builder alterou somente `DrizzleSnippetMapper.ts`; formato reportado exit0. Os sensores executados para essa revisão resultaram em `check:code` exit0, `check:types` exit0 e complexidade exit2 (120 warnings, zero errors; 122 antes da mudança). A coleta anterior foi em sessões locais encerradas; não há logs temporários recuperáveis nesta retomada. Nenhuma evidência de banco ou runtime depende desse mapper.
- Gate documental atual: `check:spec-definition` e `check:plan-definition` passaram exit0 após a reconciliação. `check:spec-implementation ... --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` executado exit1 como esperado: contrato de 504 paths ainda tem caminhos futuros inalterados/ausentes, `schema.sql` aguarda remoção D3 e 16 paths não contratados foram ignorados. Isto não é evidência semântica nem conclusão da Spec.
- Assignment D2-87: Builder Database, paths exclusivos: quatro repositories (`DrizzleChallengeCodeExecutionsRepository.ts`, `DrizzleChallengeSourcesRepository.ts`, `DrizzleChallengesRepository.ts`, `DrizzleSolutionsRepository.ts`) e quatro mappers correspondentes em `apps/server/src/database/drizzle/{repositories,mappers}/challenging/`. RF01/02/12, CA01/02/03/20/22, Rule Pack Database/Code/Server/SDD. O contrato inclui projeções e tipos derivados, autorização/filtros por actor, paginação/contagens, payloads, contadores atômicos, relações e transações/locks preservados. Proibidos casts novos, tipos manuais que espelhem SQL, microhelpers, baseline/threshold changes e qualquer path fora da lista. Builder reportará paths e format, depois aguardará ACK; sensores principais e review pareado vêm em seguida. Runtime permanece S2.

### Mutação D2-87 — challenging

Builder Database alterou somente os oito paths da assignment87: quatro repositories e quatro mappers challenging. Reportou `npx biome format --write <8 paths>` exit0. O relato afirma que projeções/joins, execução de query/erro e singles/plurals foram separados; rows/count/map inferidos mantêm filtros, ordens e fallback; locks/transações, replacement de relações, incremento atômico de views, ownership e payloads permanecem. Casts JSON/enum preexistentes foram preservados no local original, sem casts novos. Ainda não inspecionei o diff nem confirmei os comportamentos por sensores; `check:code`, `check:types`, complexidade e conformance dos oito paths estão stale. Nenhum runtime foi executado; isso pertence a S2. Base/models/Core/scripts/tests/SQL/docs não foram alterados neste lote, segundo o relatório; confirmar no diff.

### Sensor D2-87 — complexidade

`npm run check:complexity -w @stardust/server` terminou exit2; 696 arquivos, 2563 funções, 112 warnings e zero errors. Redução líquida de oito warnings desde a captura86 (120). Não se alterou baseline/threshold. `check:code` global passou exit0; `check:types`, `test:unit` e `check:architecture` ainda estavam em execução nesta captura. D2 segue em andamento; revisão pareada e runtime S2 pendentes.

### ACH-32 — divergência entre formatter reportado e verificação principal

`npx biome format --write <8 paths>` foi reportado pelo Builder como exit0. A checagem principal `npx biome format <8 paths>` terminou exit1 e indicou apenas a cadeia `.insert(...).values(...)` em `DrizzleChallengesRepository.ts` (formatter quer encadear a primeira chamada na mesma linha). Nenhuma escrita foi feita pelo sensor. Isso invalida o relato de formatação aprovada, não demonstra falha semântica. Correction limitada ao mesmo path pela Builder Database; code/types/complexidade/conformance aguardam conclusão. Rule Pack já exige formatter efetivo: No change. O diff completo aguarda avaliação.

### Correção D2-87-F1 — ACH-32 resolvido

O mesmo Builder Database alterou somente a formatação de `DrizzleChallengesRepository.ts`. Reportou `npx biome format --write <path>` exit0 (`Formatted 1 file`) e, logo depois, `npx biome format <path>` exit0 (`Checked 1 file, No fixes applied`). Nenhuma semântica/outro path alterado. A verificação principal da mutation87 é nova e válida para esse path, sujeita a confirmação no sensor atual. ACH-32 resolvido no escopo de formatação; Rules sem mudança. Code/types/complexidade dos oito paths seguem pendentes.

### ACH-33 — tipos de `Challenge.description`

`npm run check:types` global terminou exit2; Core, Studio, Web, LSP, Validation e Email passaram, Server falhou somente em `DrizzleChallengeMapper.ts(13,29)`. O retorno explicitamente anotado por `Pick<DrizzleChallenge, ...>` conserva a nulabilidade do modelo em `description`, embora o fallback de runtime use `row.description ?? ''`; `Challenge.create` espera `ChallengeDto` com string. Finding de implementação no mapper da assignment, sem mudança de contract/Rule. Builder Database recebe correction somente nesse path: manter fallback e inferir/declarar o tipo conforme o DTO do domínio, sem cast. `check:code` passou exit0; check de integrity passou exit0; `check:architecture -w @stardust/server` passou (863 módulos, 1636 dependências); complexidade exit2, 112 warnings/0 errors; unit ainda em execução. Correcção invalidará os sensores que cobrem o path.

### Sensor D2-87 — testes unitários globais

`npm run test:unit` passou exit0; cinco workspaces com suites (Core, Server, Studio, Web e LSP), duração 4m40.373s. Server: 168 suítes/325 testes aprovados. A execução ocorreu com a assignment87 presente e o finding typecheck registrado; terminou antes da correção F2. Não foram adicionados testes repository/mapper. Este resultado não comprova semântica contra PostgreSQL; isso pertence ao runtime Server S2. Unit mantém validade para D2-87 porque a correção F2 é somente annotation de tipo e preserva o valor runtime; os demais gates de source permanecem sujeitos a rerun.

### Correção D2-87-F2 — ACH-33

Builder Database consultou CodeGraph e alterou somente a annotation de retorno de `DrizzleChallengeMapper.content` para `Pick<Challenge['dto'], 'title' | 'description'>`, usando o DTO normalizado e preservando `row.description ?? ''` sem mudança runtime. Não adicionou cast ou edit em outro path. `npx biome format --write <path>` foi reportado exit0 (`No fixes applied`). O erro de tipo anterior permanece no histórico; o sensor precisa ser repetido para avaliar a correção. Unit global havia passado antes de F2; AGENTS requer novo `test:unit` após esta alteração de código. ACH-33 permanece `in_progress` até types/code/formato atualizados.

### Sensores D2-87 — types/code/complexity

Após F2, `npm run check:code` passou exit0 (sete workspaces) e `npm run check:types` passou exit0 (sete workspaces, 2m46.42s). `npx biome format <8 paths>` passou exit0 sem fixes. `npm run check:complexity -w @stardust/server` exit2: 112 warnings, zero errors, 696 arquivos/2563 funções; redução líquida de oito desde 86. Nenhum baseline/threshold alterado. A nova captura de tipos resolve ACH-33; unit ainda executava na atualização deste ledger.

`npm run test:unit` concluiu exit0 após F2: cinco workspaces, Server168 suites/325 testes, duração3m7.815s. `npm run check:architecture -w @stardust/server` passou exit0 em863 módulos/1636 dependências; sem violação arquitetural. `npm run check:test-integrity` passou exit0 na rodada pré-F2 (10 testes mudados,3 sources testáveis,193 excluídos); F2 não alterou teste nem relação de dependências. ACH-33 resolvido após check de tipos global exit0. D2-87 ainda não verificada porque a complexidade não passou e review/runtime estão pendentes.

### Snapshot D2-87 após F2

- O segundo `npm run test:unit` passou exit0: cinco workspaces, Server168 suítes/325 testes, 3m7.815s. Junto aos sensores atuais, code/types/formato/arquitetura/integrity estão aprovados; complexity continua falhando.
- A repetição diagnóstica `npm run check:complexity -w @stardust/server` foi capturada em `/tmp/stardust-drizzle-complexity87.log`, exit2,112 warnings/0 errors. Os grupos com alertas incluem `DrizzleFeedbackReportsRepository` (9), `DrizzleFeedbackMessagesRepository` (5), `DrizzleUsersRepository` (4), `DrizzleUserMapper` (4), `DrizzleFeedbackReportMapper` (3), `DrizzleCommentsRepository` (1), `DrizzleChallengesRepository` (1), `DrizzleChallengeMapper` (1) e um alerta em cada de três model callbacks. Contagens referem métricas avisadas por arquivo, não necessariamente funções únicas. O relatório bruto tem as localizações e medidas completas; não se mudou baseline.
- Próxima ação D2-88: Builder Database deve preparar somente uma proposta read-only para remover avisos nos paths listados, incluindo se algum ajuste deveria evitar os callbacks de models. A nova assignment só será registrada depois da proposta; até lá não editar source.

### Assignment D2-88 — Reporting repositories e mapper

Builder Database recebeu assignment formal rev6/base congelada, somente três paths: `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackReportsRepository.ts`, `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`, `apps/server/src/database/drizzle/mappers/reporting/DrizzleFeedbackReportMapper.ts`. RF01/02/12; CA01/02/03/20/22; Rules Database/Code/Server/SDD. A proposta read-only divide responsabilidades de projeção/hidratação, filtros/listagem, persistência/marcadores e locks/transactions mantendo semântica relacional, autorização, paginação/count/summary, estado/ordem/nulls, idempotência, anexos e conflito. Tipos devem vir de DTO/query inferidos. Cast de status preexistente fica no mesmo local; sem novos casts ou shadow SQL types. Sem outros paths/base/models/SQL/scripts/testes/docs/baseline. Depois da mudança principal executa format, conformance, code/types/unit/complexity, reviewer pareado. EV-01/02 reais de concorrência e autorização seguem no S2. Builder pausará para ACK antes de sensores.

A preparação sugeriu as fases posteriores UsersRepository+UserMapper, CommentsRepository, e ChallengesRepository+ChallengeMapper. Três avisos dos models são de callbacks declarativos de constraints/indexes; ficam fora da assignment88 até comprovar equivalência de metadata Kit e inferência de `extraConfig`. Não foram autorizadas mudanças em models nem ajuste de thresholds.

### Mutação D2-88-A — checkpoint parcial Reporting

Builder Database alterou parcialmente somente `DrizzleFeedbackReportsRepository.ts`, `DrizzleFeedbackMessagesRepository.ts` e `DrizzleFeedbackReportMapper.ts`. O relato identifica remoção dos wrappers `run` duplicados em ambos repositories em favor de `executeQuery` herdado e extrações no mapper para activity/conversation, temporal persistence e avatar/profile author. Campos, fallbacks, cast de status e consultas/guards/locks seriam inalterados segundo Builder; confirmar no diff. Edição por Python3 terminou exit0, sem format/sensores/DB. Código/tipos/complexidade87 ficam stale nos três paths; Review/runtimes ainda não ocorreram. A mesma assignment88 segue em progresso, aguardando a conclusão autorizada desses três paths antes de novos sensores.

### Mutação D2-88-B — Reporting concluído

Builder Database concluiu somente os três paths autorizados. Repositories de Reports e Messages tiveram projeção e operações/query groups reorganizados; o mapper separa grupos DTO e execução de persistência. O relato detalha invariantes a conferir: Reports mantém 2/3/2 queries conforme list/find, Promise.all, filtros/ordens/page defaults e cap, count/summary e fallback; lockReport sob mesma transação; `savedValues` conserva expressões greatests/NULL/status. Messages preserva lockReport→existing→assert/insert→hydrate→assert attachments na transação, bloqueio closed apenas para insert novo, `FOR UPDATE of message`, ownership/idempotência e ordem dos attachments. Cast status existente mantido no ponto semântico. Formatter `npx biome format --write <3 paths>` e checagem `npx biome format <3 paths>` reportados exit0. Sem DB/sensores; essas alegações aguardam inspeção/sensores. Code/types/complexidade87 stale nos três paths; D2-88 segue sem aceite. Próxima ação: inspect diff e executar os checks atuais.

### Gates D2-88 — conformance e format

`npx biome format <3 paths>` passou exit0 (`Checked 3 files, No fixes applied`). O gate integrado `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` terminou exit1 como esperado no estado intermediário: contrato de 504 paths inclui caminhos de fases futuras inalterados/ausentes; `schema.sql` continua presente até sua remoção em D3; 16 paths alheios ignorados. Esta saída não avalia semântica. Code/types/unit/complexity atuais de D2-88 ainda pendentes.

### Sensores D2-88 — parcial e regressão de complexidade

Após mutation88: format dos três paths passou exit0; conformance global permanece exit1 por paths futuros ainda ausentes/inalterados e remoção `schema.sql` destinada a D3. `npm run check:code` global passou exit0. `npm run check:test-integrity` passou exit0. `npm run check:architecture -w @stardust/server` passou exit0 (863 módulos/1636 dependências). `npm run check:complexity -w @stardust/server` terminou exit2: 120 warnings/0 errors,696 arquivos/2587 funções, aumento líquido de oito sobre complexity87 (112); baseline intacto. `check:types` seguia em execução; unit pós-mutation88 não foi executado. ACH-23 permanece aberto; o ganho não pode ser presumido e mutation88 precisa resolver a regressão antes de aceitar. Próxima ação: registrar types/unit e capturar warning details; Builder Database permanece owner autorizado para correction dos mesmos três paths.

`npm run check:types` concluiu após mutation88 com exit0 nos sete workspaces (41.224s), sem erros. O finding ACH-34 segue por complexidade; test:unit pós-mutação ainda pendente.

### Complexity D2-88 — diagnóstico detalhado

Repetição oficial capturada em `/tmp/stardust-drizzle-complexity88.log`: exit2,120 warnings/0 errors,696 files/2587 functions. O total permaneceu 120 ao longo da rodada após mutation88. A extração por métricas explícitas apontou no reporting `DrizzleFeedbackReportsRepository` uma medida warning e `DrizzleFeedbackMessagesRepository` uma; `DrizzleFeedbackReportMapper` não aparece com warning de métrica explícito. Outros arquivos ainda alertados: UsersRepository4/UserMapper4, CommentsRepository1, ChallengesRepository1/ChallengeMapper1 e três callbacks de models1 cada. As métricas explícitas por arquivo são subtipo do relatório, não equivalem à contagem de funções na linha `warn`; para avaliar incremento, usar detalhes completos e localizar funções/health. Baseline/thresholds sem alterações. Unit D2-88 continua rodando.

`npm run test:unit` concluiu pós-mutation88 com exit0 em cinco workspaces com suites; Server168 suítes/325 testes, duração1m41.929s. Cobertura unit não prova as queries/locks/atomicidade de Reporting; EV-01/02 reais seguem exigidos em S2. A correção de complexity ACH-34 continua necessária.

### ACH-34 — diagnóstico comparativo Reporting

O diagnóstico read-only do Builder comparou as saídas completas de complexidade87/88: os três paths Reporting subiram de31 para39 funções em warning, aumento líquido8 que explica sozinho o global112→120. `DrizzleFeedbackReportsRepository` foi19→23, `DrizzleFeedbackReportMapper`3→7 e `DrizzleFeedbackMessagesRepository` permaneceu9. Foram adicionadas24 funções totais (2563→2587), sem alteração do baseline ou threshold. A média de MI/Health por arquivo melhorou, mas quatro helpers novos do mapper e novos helpers/callbacks de repository permanecem abaixo de MI65; portanto o gate global regrediu. Não contar as métricas agregadas por arquivo como substituto do relatório por função. ACH-34 permanece aberto e D2-88 não aceita. A próxima correction deve remover warnings com agrupamento coerente ou responsabilidades reais, preservar SQL/DTO/transação/ordem e demonstrar redução na saída oficial, sem microhelpers, deslocamento de warnings, edição de baseline ou relaxamento de thresholds. Sensores pós-mutation88: format, code, types, unit, architecture e integrity passaram; complexity exit2. Runtime Reports/Messages continua pendente em S2.

### Correction D2-88-C — limites autorizados e guardrails

Depois de avaliar a proposta, autorizei somente Mapper e ReportsRepository. A integração dos quatro helpers single-use do mapper agrupa campos que compõem cada conversão única do DTO/autor/persistência; em ReportsRepository, limites single-use reportColumns, savedContent/savedAdminActivity e searchFilter podem ser integrados aos consumidores que já formam uma query/projeção/payload. `hydratedAuthor` só pode juntar-se à conversão de entidade se null semantics e legibilidade forem mantidas. `lockReport` não será duplicado porque é reutilizado por save/changeStatus; a query partilhada por list/listByAuthor permanece partilhada. MessagesRepository fica intocado. Nenhuma alteração de métricas/baseline, helper novo, deslocamento artificial de alerta, SQL/DTO ou comportamento autorizado. Meta de verificação: corrigir a regressão sem ultrapassar os112 warnings pré-assignment88; a saída real do sensor decide, sem presumir a estimativa. Se o escopo coeso não atingir a meta, relatar fato e replanejar sem ampliação implícita. Definition gates prévios passaram antes da próxima edição; o Builder aguarda ACK posterior à mutation. Review e checks integrados serão feitos pelo principal; a prova real de concorrência/DB permanece em S2.

### Mutation D2-88-C — relato factual pendente de confirmação

O Builder reportou mutation somente em `DrizzleFeedbackReportMapper.ts` e `DrizzleFeedbackReportsRepository.ts`: helpers de conversão/projeção single-use foram reintegrados nos consumidores, enquanto `lockReport`, `activityPageQuery`, count helpers e `conversationColumns` continuaram compartilhados; MessagesRepository permaneceu sem alteração. Informou preservação literal dos campos, nulls/fallbacks/datas, queries/joins/contagens/ordem, transações/locks/status/greatest/read markers e cast preexistente. Edição exit0; Biome write/check focados exit0 com2 fixes. Essas são alegações do Builder ainda não confirmadas pelo principal/reviewer. Code/types/unit/complexity anteriores stale nos dois paths; sem DB ou outros sensores após mutation. A estimativa111 da proposta inicial não se aplica à correction autorizada, pois pressupunha também duplicar partes compartilhadas, o que foi deliberadamente proibido. Próximo: inspeção, definition gates, conformance e sensores fresh; ACH-34 aberto até redução comprovada e review.

Inspeção atual da principal viu os campos e operações agrupadas conforme assignment; lockReport/activityPageQuery e demais partes partilhadas continuam como helpers. Não detectei divergência textual óbvia nos campos, fallback/null/date/status, filtros, joins, Promise.all, ordering/range, update expressions e transação. É revisão estática limitada; semântica relacional aguarda testes/reviewer e complexidade aguarda o sensor fresh. Principal liberou conformance e sensores após ambos definition gates passarem.

### Sensores pós D2-88-C — ACH-34 aberto

Code global exit0 (7 workspaces); types global exit0 (7 workspaces,2m29.184s); unit global exit0 (5 workspaces; Server168/325, Web118/506;2m53.301s); architecture Server exit0 (863 módulos/1636 deps); test-integrity exit0. Complexity Server exit2:113 warning functions, zero errors,696 files/2577 functions; redução7 em relação a mutation88 (120), mas supera por1 o snapshot112 pré-D2-88. Nenhum threshold/baseline alterado. Portanto a correction reduziu os alertas, mas sua meta factual ≤112 não foi alcançada ainda; ACH-34 não fecha, e é preciso verificar qual warning permanece no delta Reporting antes de decidir nova correção. Conformance global exit1 como estado esperado enquanto waves incompletas e schema.sql até D3; output também contém paths do contrato ainda unchanged/missing que exigem waves. Coverage Server ainda em execução, gate `check:coverage` pendente. Nenhum DB runtime/reviewer ainda.

`npm run test:coverage -w @stardust/server` passou exit0:168 suítes/325 testes, statements e lines48.17%, branches88.97%, functions34.45%, duração444.139s. O gate global `check:coverage` ainda deve validar os relatórios contra baseline. O fato de Coverage ter terminado não altera o finding complexity113.

O gate `npm run check:coverage` falhou exit1: Server lines/statements48.17% versus baseline51.60%; functions34.45% versus47.11%; branches aumentou82.98%→88.97%. Core permaneceu igual; Studio/Web subiram. Não houve baseline edit. ACH-35 aberto: novos caminhos Server ainda não têm cobertura suficiente; adicionar testes comportamentais reais como parte das waves de repositórios/S2 e repetir o ratchet. Complexity diagnostic `/tmp/stardust-drizzle-complexity88c.log` mostra Reporting Mapper3, MessagesRepo9, ReportsRepo20, total32 versus31 antes da wave. Um alerta residual é `lockReport` MI63, usado por save e changeStatus; sua extração reutilizada reduz duplicação de seleção/lock, então não a reverter nem duplicar SQL apenas para atingir o número. Os outros81 warnings permaneceram iguais ao snapshot87; total113. Correction C reduziu7 dos8 warnings reportados, sem atingir sua meta ≤112. Deixar ACH-34 aberto para tratar o warning junto da redução restante, e não ampliar esta correction sem evidência. Definições antes de nova atividade/review.

Review pareado Database para D2-88-C: **sem findings estáticos** nos dois paths após comparação com os adapters legados. Reviewer confirmou projeções/fallbacks/null/ISO, guards/ownership, joins/count/preview/filter/page/summary/order, locks/status esperados/transação, `greatest`, conflito e monotonic read markers. ChangeStatus DTO coincide com a implementação Supabase anterior. Sem mudança necessária nas Rules. Reviewer pede prova real de concorrência/status/read markers/persistência (CA-02/EV-01) antes da aprovação integrada. Review estático concluído; ACH-34 (complexity global 113) e ACH-35 (coverage ratchet) permanecem abertos; runtime e coverage vinculados às próximas waves. Não há nova mutation autorizada/necessária neste lote.

### D2-89 — decisão read-only para UserRepository

Builder Database usou CodeGraph e comparou complexity87/88-C: os atuais26 warnings dos paths Users permanecem idênticos (UsersRepository22/UserMapper4). Assignment autorizada é apenas `DrizzleUsersRepository.ts`; o mapper fica intacto para evitar churn. A proposta usa as rotinas de execução/leitura já herdadas, reuso de `exists` para os dois contains com os mesmos `ilike`/sem guard, helpers de count somente se a tipagem de tabelas for derivada sem shape espelhado, e execução shared para três deleções sem alterar guard/predicado. O restante de queries/projeções/paginação/transações fica preservado. Range de risco: -3 a -6 warnings estimados no repository, sem garantia; o sensor oficial decide. Spec/Rules proíbem testes unitários dedicados de repository/mapper/types/fixtures; behavior será provado por rota/script real em S2. ACK da principal e definition gates são pré-requisitos para mutation. ACH-34 e ACH-35 permanecem abertos; nenhum baseline/threshold edit permitido.

Builder reportou mutation D2-89 somente em `DrizzleUsersRepository.ts`: execução comum, `exists` compartilhado, count helper/result e three deletes usam helpers da base, sem mudança de Mapper. Union de table types e ReturnType reportados como derivados/inferidos; nenhuma SQL shadow type/cast. Guards/predicados/queries/counts/empty behavior/order/transactions preservados segundo Builder. Format write/check exit0, um fix. Ainda sem code/types/unit/complexity/coverage/reviewer/DB após mutation; validação real fica pendente; detalhes estão sujeitos à inspeção da principal e sensores.

Inspeção da principal confirma que as alterações observadas ficam no path autorizado e que os checks de autorização precedem os callers de count, os predicados `ilike` e a ausência de guard em contains permanecem, o limite de tabela union é específico e os updates transacionais não foram extraídos. Nenhuma divergência estática óbvia; type checking ainda é fonte de verdade para a inferência do count union. Definition gates aprovados após registrar inspeção; ACK para conformance e sensores agora liberado.

Após mutation89: format focused exit0, code global exit0 (7 workspaces), types exit0 (7,1m23.498s), unit exit0 (5 workspaces, Server168/325), architecture Server exit0 (863 modules/1636 deps), test-integrity exit0. Complexity exit2:108 warnings, zero errors,696 files/2573 functions, down5 from113 and down12 from pre-correction regression120; baseline/threshold unchanged. Conformance exit1 due expected incomplete rev6 paths/schema.sql D3/future waves, no isolated failure attributed to UsersRepository. Server coverage still running; baseline ratchet not yet checked. No reviewer/database runtime yet for assignment89.


### ACH-36 — cardinalidade de `containsWithEmail`/`containsWithName`

Esclarecimento do Implementation Reviewer Database: `SupabaseUsersRepository.ts:492–507` e `:510–525` usam `.single()` e convertem PGRST116 para Logical.false. `.single()` exige exatamente uma linha, então zero ou múltiplas correspondências retornam falso. A implementação Drizzle pre89 com `.limit(1)` retorna true para qualquer 1+ correspondência. Exemplo: `Ana Maria` e `Ana Paula`; consulta parcial `Ana` era false no legado e true no Drizzle. Discrepância preexistente classificada P2; Spec rev6 exige preservar comportamento dos ports e não há exceção aprovada. Assign correção somente no `DrizzleUsersRepository.ts`, preservando `ilike`, obtendo até duas linhas e retornando true apenas para cardinalidade exatamente1; não introduzir guard nem teste unitário direto de repository, conforme Rules. Cobrir casos de uma e múltiplas correspondências por rota/script em S2. Finding bloqueia aceite integrado Users; após mutation os sensores fresh atuais devem ser repetidos. Reviewer não encontrou regressão nova no refactor89.

Coverage Server snapshot de mutation89 terminou exit0:168 suítes/325 testes; statements/lines48.20%, branches88.97%, functions34.42%; duração287.011s. Abaixo dos baselines Server previamente medidos: lines/statements51.60%, functions47.11%, branches82.98%. Repetir `check:coverage` nesse snapshot antes da correction F1; ACH-35 segue aberto.

`check:coverage` repetido para mutation89 exit1: Server lines/statements48.20% <51.60%, functions34.42% <47.11%; branches88.97% >82.98%. Core invariante e Studio/Web acima das respectivas baselines. ACH-35 aberto; baseline intacta.


### Correction D2-89-F1 — assignment

Somente `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`, helper `exists` e callers containsWithEmail/Name: query limit2, Logical.true iff rows.length===1, false for zero/multiple. Same ilike, no auth guard change. Behavior reproduzível via `.single()`/PGRST116 do legado. Sem testes dedicados de repository; S2 route/script verifica match único e múltiplos. Todos os outros paths proibidos; formatter e ACK pré-sensores, depois check code/types/unit/complexity/coverage/integrity/architecture e review. ACH-36 P2 aberto até correção+runtime.


### Mutation D2-89-F1 — cardinalidade corrigida

Builder alterou exclusivamente helper `exists` no `DrizzleUsersRepository.ts`: `.limit(2)` e Logical true somente se `rows.length===1`. Zero e múltiplos matches false, equivalente a `.single()`/PGRST116 legado; filtros `ilike`, policy sem guard e callers sem alteração. Format write/check focados exit0 sem fixes. Nenhum sensor/test/DB após mutation. Evidências code/types/unit/complexity/coverage stale para esse path até repetir. ACH-36 permanece aberto para review e prova S2 com cardinalidade real.

Inspeção principal viu a cardinalidade implementada literalmente como autorizado e os dois métodos mantém `ilike` e ausência de guard. Não surgiu alteração lateral. Definition gates da Spec/Plan passaram após registrar mutation/inspeção; sensores podem rodar. A confirmação com múltiplas rows reais segue pendente de S2.

Após F1: format/code global exit0; types global exit0 nos sete workspaces (2m10.575s); unit global exit0 em cinco workspaces, Server168/325, Web118/506 (2m36.461s); complexity exit2 inalterado em108 warnings/0 errors/696 files/2573 functions; architecture Server e test-integrity exit0. Conformance exit1 esperado por contrato incompleto/waves futuras/schema D3. Coverage Server permanece executando; depois usar captura concluída no check:coverage.


Review D2-89-F1: Implementation Reviewer Database aceitou correção no escopo estático e fechou ACH-36 como corrigido estaticamente. `.limit(2)` e `rows.length===1` equivalem a `.single()`/PGRST116: zero false, um true, múltiplos false. `containsWithEmail`/`Name` preservam ilike e ausência de guard; nenhum mismatch restante; Rules No change. Não prova dado/runtime: S2 deve validar os três casos reais via rota/script. Coverage ratchet ainda pendente (teste rodando) e complexidade global108 ainda falha gate; não declarar D2 completa.


Coverage Server pós F1 exit0, 168 suites/325 tests; lines/statements48.20%, branches88.97%, functions34.42%; 348.097s. Jest reported one worker forced to exit after suites; all suites passed, no test failure. Repeat coverage-baseline ratchet for this report; ACH-35 remains open.

`check:coverage` pós F1 exit1: Server lines/statements48.20% versus baseline51.60%, functions34.42% vs47.11%; branches88.97% versus82.98%. Core unchanged; Studio/Web above baseline. ACH-35 permanece sem baseline edit.


### D2-90 — CommentsRepository

Read-only CodeGraph proposal, única owner path `apps/server/src/database/drizzle/repositories/forum/DrizzleCommentsRepository.ts`; complexity88-C mais recente por arquivo, 9 warnings (root complexity F1 total108, source Comments não mudou). Ação autorizada: reaproveitar execution base, um insert-root operation chamado pelos dois flows addByChallenge/Solution e filtro de vínculos tipado somente se union de tabelas resolve na coluna real comum. Manter list query/upvotes projection, subqueries/counts/joins/aliases, order/page/Promise.all/count fallback, guards, addReply/FK, 2 inserts na ordem dentro da mesma transação, e queries/reads. Alvo -3 a -5 warnings, não garantido. Sem testes dedicados repository; S2 route/script. Apenas o Repository autorizado, sem models ou outros arquivos; definition gates e ACK antes de mutação. ACH-34/35 continuam abertos.


### Mutation D2-90 — CommentsRepository

Builder editou somente `DrizzleCommentsRepository.ts`: execução/leitura usa helpers herdados, `insertRootComment` é reutilizado nas duas transações addByChallenge/Solution e linked filter recebe a união real dos dois models com coluna comum commentId. Relata mesmos dois inserts/ordem/root linkage, autorização/guards, root query e relação. List/upvotes/count/join/aliases/order/page/Promise.all/fallback ficaram intocados. Formatter write/check exit0 com um fix; sem sensores/test/DB após mutation. TypeScript precisa confirmar union. Nenhuma mudança fora do path.


Inspeção principal de D2-90 confirmou que union linkedCommentsFilter usa os modelos reais/column shared, insertRoot + inserts de vínculos mantêm a ordem e a mesma transação, e list/query/count/upvotes/guards inalterados; sem divergência estática óbvia. Definition gates passaram após o checkpoint; ACK para sensores liberado. Behavior real segue em S2.

D2-90 validation: focused format, global code (7 workspaces), global types (7), global unit (5; Server168/325), Server architecture (863 modules/1636 deps), and test-integrity all passed. Typecheck took4m13.374s; unit took4m56.662s. Complexity sensor remains a gate failure (exit2), now102 warnings, zero errors,696 files/2574 functions, down6 warnings from108; baseline unchanged. Server coverage passed all168 suites/325 tests at lines/statements48.21%, branches88.97%, functions34.41% (617.705s). Conformance exit1 is expected for still-unimplemented rev6 paths/future waves and `schema.sql` awaiting D3; no D2-90-specific failure. Coverage ratchet check follows. No runtime evidence yet; S2 remains required.

`npm run check:coverage` exit1 for this snapshot: Server lines/statements48.21% versus51.60% baseline, functions34.41% versus47.11%, branches88.97% versus82.98%; Core unchanged, Studio/Web remain above their baselines. ACH-35 stays open; no baseline changed.

Paired Implementation Reviewer Database encontrou um finding bloqueante P1 em D2-90: `DrizzleCommentsRepository.ts:55` interpola `reply`, criado com `alias(commentModel, 'comment_replies')`, como raw `FROM ${reply}`. O serializer Drizzle resolve o nome da tabela via `Table.Symbol.Name`, logo gera `FROM "comment_replies"` sem declarar `comments AS comment_replies`; query() pode lançar relation/table missing. Sem runtime para confirmar. D2-90 não recebeu static acceptance. Correction limitada ao mesmo Repository para usar `.from(reply)` na subquery correlacionada ou declarar base+alias corretamente, mantendo filtros, contagens, joins e resultados; Builder deve provar forma de SQL gerada, e principal inspecionar antes de sensores/review. ACH-35 segue separado, sem baseline edit; S2 ainda obrigatório.

D2-90-P1 correction: Builder usou CodeGraph e PgDialect real para confirmar a serialização. Diagnostic temporário `/tmp/stardust-builder-database-comments-alias.ts` passou quatro assertions sem conexão: SQL anterior `from "comment_replies"` sem alias declaration; SQL corrigido `from "comments" as "comment_replies"`, com correlação `parent_comment_id`→`comments.id`. A mutation limita-se à expressão de `repliesCount` no único Repository autorizado; count/projeção/filtros/joins/order/page e restante dos métodos intactos. Formatter write/check exit0, sem fixes. Principal inspecionou e repetiu o diagnostic; ACK para sensores fresh concedido. Essa prova apenas valida SQL gerado; ainda não executa Postgres, logo reviewer e runtime S2 permanecem necessários.

D2-90-P1 fresh sensor evidence: format/code global (7 workspaces)/types global (7)/Server architecture (863 modules,1636 deps)/test-integrity passed. Initial global unit run failed Studio while Server coverage was competing; rerunning Studio in-band passed14 suites/64 tests and a full `npm run test:unit` retry passed five workspaces (Server168/325, Web118/506; 2m27.059s). Corrected Server coverage passed168/325 (lines/statements48.21%, branches88.97%, functions34.41%,561.296s). Server coverage ratchet exit1:48.21<51.60 lines/statements and34.41<47.11 functions;88.97>82.98 branches. Server-scoped complexity remains exit2 with102 warnings,0 errors,696 files/2574 functions; warning count unchanged by alias correction. Conformance remains exit1 for incomplete contracted paths/waves/schema D3. Separately, root-wide complexity exits1 with five threshold errors outside this database batch: `SseProfileChannel.ts` cyclomatic18/16, Web profile-events GET Halstead1023.59, Web sign-up POST length100/Halstead1497.47; onboarding-attempt only has warnings. No unrelated changes. Track ACH-37 for later review. No baseline/threshold edits. Request paired review now; Postgres route/runtime proof remains S2.

Paired Implementation Reviewer Database re-reviewed the P1 correction and accepted it statically; finding resolved. The SQL now declares `"comments" AS "comment_replies"`, correlates parent_comment_id to the outer comments.id, and preserves integer count/sql<number>, projection, guards, filters, joins, ordering, pagination, and transactions. No static mismatch or Rules update remains in D2-90. Reviewer explicitly notes PgDialect generation is not PostgreSQL execution. Integrated acceptance remains pending S2 runtime, ACH-35 coverage ratchet, ACH-34 complexity reduction, and ACH-37 root-wide complexity errors.

ACH-37 triage pareado Web: root complexity report exit1 tem seis violações de threshold em cinco funções de três arquivos criados pela Spec W1 após baseline HEAD (git ls-tree confirma ausência no baseline). `SseProfileChannel.ts`: factory/onCreateUser CC18 e onUserCreated CC16; `profile-events/route.ts` GET Halstead1023.59; `sign-up/route.ts` POST length100 e Halstead1497.47. onboarding-attempt só tem warnings. Reviewer classifica P2, bloqueia CA-22 quality gate, sem finding funcional/segurança; review W1 prévio cobriu comportamento/BFF/types/coverage/architecture/integrity/Playwright, mas não complexity. Correção deve ficar nos mesmos três paths, com extração coesa de validação frame/evento, cookie setup e sanitização/forwarding de headers; sem gaming/threshold/baseline/exclusões. Assignment adicionada, Spec sem amendment.

D2-91 read-only proposal aprovada: `DrizzleChallengesRepository.ts` mantém helper composto `voteFilter(challengeId,userId)` reutilizado em findVote/replaceVote/removeVote. Repositório preserva guards, predicado e uma operação SQL por port, retorno none/up/down, update/delete e categoria transacional; Mapper não muda por ausência de extração coesa que reduza risco. Estimativa -2 warning functions (repo17→15), sem garantia; sensor é fonte de verdade. Assignment formal no Plan; execução aguardou a correção cross-wave ACH-38, agora aceita estaticamente.

ACH-37 mutation01: Builder editou exatamente os três W1 paths autorizados. `SseProfileChannel` isolou validação do payload/frame e manteve `onUserCreated` no lifecycle dedupe/close/notify. `profile-events` extraiu política de headers/response sem mexer em autorização, receipt, signal, upstream status/204/502. `sign-up` extraiu cookie/failure/validation/upstream response builders, mantendo POST responsável por origem, schema e fetch; status/body/cookie/receipt segundo Builder. Formatter write/check focados exit0 com2 fixes. Principal leu os três paths: validação tem shape estrito/id canônico, filtros de headers privados e cache/no-buffering declarados, cookie policy mantém duration/expires/Secure/HttpOnly/SameSite/path; sem mudança evidente de contratos ou ordem. Ainda sem sensors/testes após mutation; congela esta inspeção até ACK e validação.

ACH-38 browser finding: the initial Web integration run timed out awaiting `POST /api/auth/sign-up`; BFF middleware passed. `AuthService(restClient)` inherited test base `/api/tests/server`, bypassing the BFF. `useRestContextProvider.ts` is W2 in the canonical Plan; this is a narrowly authorized early W2 composition correction required to unblock the W1 BFF route, not an original W1 path. P1 cross-wave functional blocker. Correction routes signup through its own no-cache same-origin `/api` client while all other services retain existing routing. Focused Playwright later confirmed browser POST and success.
ACH-38 correction mutation/checkpoint: como correção antecipada e estreita num path de composição W2, Builder alterou apenas `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`, criando `signUpRestClient` no-cache com base same-origin `/api` e injetando-o em `AuthService`; os demais serviços continuam no client original Server/testing. Principal inspecionou e aceitou o isolamento; formatter focado exit0; Spec/Plan definitions passaram antes do ACK.

ACH-38 browser evidence: focused Playwright passed 4/4 selected signup/BFF cases in 16.9s under isolated ServerMock. The UI emitted `POST /api/auth/sign-up` and displayed success after mocked `user.created`; API test asserted 201 signup, 200 resume, 200 SSE; invalid Origin and receipt cases passed.

Full Web integration completed 82/88 in 8.6m. Signup happy path/BFF passed. Six failures are deferred W2 acceptance: two attempt restoration cases and four social existing-account/no-token cases duplicated at 390×844 and 1440×900. Error contexts are under `apps/web/test-results/*/error-context.md`; W2 behavior and full suite remain open. No credentials; social manual smoke excluded by D-07. ACH-37 complexity correction removed all hard errors (global zero errors/118 warnings; Web zero errors/16 warnings). Global code/types/integrity and Web architecture passed; serial global unit passed five workspaces. Web coverage passed 118 suites/506 tests at lines25.58%, statements24.74%, branches27.58%, functions22.11%; ratchet result pending.

Paired Implementation Reviewer Web accepted ACH-37 and ACH-38 statically. ACH-38 `POST /api/auth/sign-up` path is confirmed by focused browser; re-review explicitly classifies all six full-suite failures as deferred W2 (restore behavior and social navigation), not blockers for this scoped correction. Canonical ownership of `useRestContextProvider.ts` is W2; the early correction was narrowly authorized to make the W1 BFF flow reachable and must not be described as an original W1 path. Complexity hard errors are gone but warning exits leave CA-22/full quality gate open. `npm run check:coverage -- @stardust/web` passed all four dimensions above baseline: lines25.58%/24.76%, statements24.74%/23.93%, functions22.11%/21.59%, branches27.58%/27.07%. W2/full integration remain pending.

Spec Reviewer revision 7 result: `clear`, no blocking Architecture/Rules findings. Reviewer confirms `authActions.ts` is a valid RPC composition root, the combined Jest projects remain within the Server boundary, and deferring global CI-09/CI-10 to C2 does not waive either gate. `check:spec-definition` and `check:plan-definition` passed. `check:spec-implementation --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` fails with the expected incomplete-contract inventory (505 contracted paths; future C1/S2/W2/D3 paths absent/unchanged); it reports 16 pre-existing unrelated paths ignored, which remain untouched.

ACH-34 remediation assignments are now active in the existing D2 and W1 ownership. A fresh root sensor snapshot at `/tmp/stardust-drizzle-recovery-complexity.log` reports 112 warnings/0 errors across3471 files/9143 functions; all warning functions are in the Database/Web paths named in Plan. Database owns the currently warned Drizzle mapper/model/repository paths; Web reopens its five W1 warning paths, and handles its `useRestContextProvider.ts` warning in W2. Each owner will preserve current behavior and test only through the allowed route/browser boundaries; `coverage-baseline.json` and complexity thresholds remain untouched. The paired reviewers must inspect each final diff before the corresponding path evidence is fresh.

ACH-34 Database checkpoint A: the Builder created only `apps/server/src/database/drizzle/mappers/forum/DrizzleCommentMapper.ts` under its existing D2 declaration. Principal inspected the current CodeGraph source and confirmed `toEntity` now delegates the same content/date, author identity, and display-profile fields/fallbacks; `toPersistence` remains unchanged. Builder reports focused Biome format write/check exit0. The path's previous complexity evidence is stale; no sensor, runtime test, or paired review has been run after this mutation. The Builder is authorized to continue its remaining assigned paths after this checkpoint; no ACK is an acceptance of the feature or D2.

ACH-34 Web assignment design checkpoint: Builder Web consulted CodeGraph for the five W1 paths and proposed only in-file cohesive changes: shared request execution where method-specific body/error/retry/query cleanup remains identical, simplified header merge preserving casing/precedence, an internal SSE lifecycle helper preserving listener identity/dedupe/notify-close-cleanup order, and in-file response/cookie/dispatch helpers for the onboarding and signup routes preserving validation, Origin, abort, status/body/header forwarding, cache and streaming. This is an implementation proposal, not review evidence; no Web source mutation or sensor has occurred yet.

D2-91 mutation/checkpoint: Builder modified only `DrizzleChallengesRepository.ts`; one private compound `voteFilter(Id,Id)` now supplies the same challenge/user predicates to the three existing find/replace/remove vote operations. Principal inspected: all three authorization guards precede SQL; operation count/type, `limit(1)`, missing-read `none`, write `none`→downvote mapping, awaits and void returns remain as assigned; unrelated listing, transaction/category handling and mapper untouched. Formatter write/check exit0. Fresh sensor, DB and paired-review evidence pending; D2-91 not accepted yet.

D2-91 validation: format/code/types/unit/Server architecture/integrity passed (code 7 workspaces; types 7; unit five workspaces including Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1636 dependencies). Server complexity exit2:99 warnings,0 errors,696 files/2575 functions, down3 warnings; repository17→14 warning functions. Server coverage passed168 suites/325 tests, lines/statements48.23%,branches88.97%,functions34.39%. Coverage ratchet exit1 for Server lines/statements below51.60 baseline and functions below47.11; branches exceed82.98. ACH-35 remains open; thresholds/baselines unchanged. S2 DB route proof and paired review pending.

Paired Implementation Reviewer Database accepted D2-91 statically with no finding. `voteFilter` keeps the exact challenge/user conjunction; authorization remains before each operation, and select/limit/fallback, update, and delete semantics are unchanged. No Rules update. S2 PostgreSQL execution remains outstanding; ACH-35 and complexity-warning quality gate remain open and do not indicate a defect in this extraction.

ACH-34 next-step read-only diagnostic: Builder inspected three challenging repositories already in D2 scope. No defensible ≥6-warning batch was identified; refusing to add speculative helpers to reach the historical global ≤112 target. Bounded low-risk candidate D2-92 is `DrizzleChallengeCodeExecutionsRepository.ts`: shared real select/from/filter/DESC-createdAt query is used by `pageRowsQuery` and `findLatest`; expected -2/-3 warnings, contingent on official sensor. `countIncorrect` aggregation and projection stay untouched due semantic/cast risk. No source mutation occurred; the target remains open and must not be represented as met.

D2-92 mutation checkpoint: Builder edited only `DrizzleChallengeCodeExecutionsRepository.ts`; `orderedExecutionsQuery` shares the select/from/filter/descending-createdAt portion used by page/latest, leaving offset/limit in each caller. `add` now directly returns its insert builder to `executeQuery` without redundant async/await. Principal inspection confirms existing filters, authorization, count/Promise.all, range/order/fallback, mapping/cast/aggregation, insert payload, await/error semantics preserved. Format exit0 with one fix. No fresh sensor or database evidence yet; expected complexity reduction remains unverified.

D2-92 validation: format/code/types/unit/Server architecture/integrity all passed (root code7; types7; unit five workspaces, Server168/325; architecture863/1636). Server complexity exit2:96 warnings,0 errors,696 files/2576 functions (-3 vs99). Server coverage passed168 suites/325 tests at lines/statements48.24%,branches88.97%,functions34.37%; ratchet exit1 for lines/statements below51.60 and functions below47.11. ACH-35 remains open and no baseline changed. Root-wide complexity not yet recaptured, so ACH-34's global ≤112 target is unverified; S2 runtime remains pending.

Fresh root-wide complexity after D2-92 exits2 with112 warnings/0 errors across3471 files/9143 functions. This exactly meets ACH-34's historical ≤112 factual target without threshold/baseline changes. The sensor still fails because warnings remain, so CA-22/full complexity quality gate remains open; static review of D2-92 pending. Server coverage ratchet/ACH-35 and S2 remain open.

Paired Implementation Reviewer Database accepted D2-92 statically with no finding. The shared ordered query retains existing authorization/filter/order/range/limit/count behavior; add continues to await `executeQuery` and propagate failures. Rules No change. Root-wide warning count exactly meets ACH-34's historical cap, but the complexity command remains exit2 and CA-22 is not passed. D2's consolidated review and S2 database route evidence remain pending.

Consolidated paired Database review declined D2 exit: keep D2 `in_progress`. Local migrate/no-op, adopt/data preservation, rollback/remigrate, mixed concurrency/lock/session loss, strict CLI checks, and replay after deleting legacy migrations are evidenced. Reviews 89–92 are scoped static accepts only and do not establish a consolidated review of all adapters. ACH-35 coverage ratchet blocks (Server lines48.24% <51.60%, functions34.37% <47.11%). Root complexity hits the ACH-34 numeric cap at112 warnings/0 errors, but exits2, so CA-22 not passed. CI-06 `check:test-integrity` is passed/current; CI-09 complexity remains failed. Reviewer clarification: S2 HTTP EV-04 and CA-01/02/EV-01/02 are separate pending S2, not D2-local exit blockers. Whole76 supports local EV-03 and the contracted catalog/SQL/DataAPI/clone pieces of EV-04. The historical ≤112 count does not override the complexity command's `--max-warnings 0` failure. CA-09 EV-05, final CA-20 EV-10, CA-22 EV-12 remain pending as applicable. Rules No change; no remote acceptance.

### ACH-39 — stale social-account classification cache (W2)

Read-only Web diagnosis: the social existing-account Playwright case gets a stale `{isNewAccount:true}` result from the Next fetch cache although its deterministic ServerMock registration returns `false`. Trace evidence records the actual Server Action POST `/auth/sign-up/social-account` returning the cached signup result; the cache contains `revalidate:60`. `apps/web/src/rpc/next-safe-action/authActions.ts` constructs its own default `NextRestClient()` and does not use ACH-38's RestContext signup client. Implementation Reviewer Web classifies this as a functional W2/CA-17 finding. The user's 2026-10-03 instruction “solve all them” authorizes the minimum amendment adding this path under Web/W2; pending correction is `NextRestClient({ isCacheEnabled: false })` for the social action only. The other four resume/no-session failures are already contracted W2 paths and remain pending for W2.

### Amendment/recovery 2026-10-03 — revisão 7

Spec revision 7 adds the bounded social Action composition, requires the Server coverage report to include both Jest projects (`server` and `server-integration`), and places global CI-09/CI-10 at integrated C2 after S2/W2 generate their route behavior and coverage. This preserves `coverage-baseline.json`, warning thresholds, and measured paths. `check:spec-definition` and `check:plan-definition` passed after the amendment; the read-only Spec Reviewer is pending. No source changed in this documentation amendment.

Current gate diagnosis: `npm run check:complexity` reports 112 warnings and zero errors across 3471 files/9143 functions (96 warnings in Server) and exits nonzero. The Server coverage command selects only Jest project `server`: 168 suites/325 tests, lines/statements48.24%, functions34.37%, branches88.97%. The ratchet therefore fails lines/statements below51.60 and functions below47.11. Jest already declares `server` and `server-integration`; workspace coverage script must run both in the same report. These are diagnostic findings, not accepted global gates.

ACH-39 remains open until the no-cache action correction, existing-account Playwright case, and paired Web review pass. D2 remains `in_progress` until its consolidated review and local exits pass; complexity and coverage are not D2 exits and remain mandatory at C2.


ACH-34 recovery checkpoints: `check:spec-definition` and `check:plan-definition` pass. The Plan checker failure came from its case-insensitive ASCII word-boundary matcher treating the substring `todo` in `método-específicos` as a placeholder; rephrased it to `específicos a cada operação`. Database checkpoint B formatted only `DrizzleChallengeMapper.ts` and `DrizzleSolutionMapper.ts`; static inspection found the existing input fields, author fallback/profile, parsing/casts, and persistence values grouped without an evident semantic change; no runtime/sensors run. Web mutation01 plus bounded correction modified only the five W1 paths and focused formatting passed; inspection confirmed URL-before-body serialization and fresh date allocation/order. The initial comparison against repository `HEAD` suggested `post` response headers were incidental, but the approved pre-ACH-34 W1 state and Spec require them, so the existing behavior remains in scope. No complexity, coverage, test or reviewer evidence is claimed for either batch.

Database checkpoint C: only `DrizzleUserMapper.ts` changed; principal inspection confirmed the DTO fields, selected item/tier fallbacks, relationship collection defaults, completed-planet filtering, and persistence getters/fields remain equivalent. Focused formatter write/check passed; no tests, database, or sensors ran. Web W1 batch: principal inspected `NextRestClient.ts`, `SseProfileChannel.ts`, and the three BFF routes. The helper extractions preserve response-header contract (including `post` headers required by W1), query cleanup, auth/receipt precedence, Origin/schema behavior, abort/cache/status/forwarding, cookie lifetime order, SSE listener identity/dedupe/terminal behavior, and notify/close ordering. Three evaluation-order corrections were present in the final five-path batch. Focused formatting passed; no functional tests, complexity/coverage sensors, or paired review have run. Definition gates pass after recording these checkpoints.

Database checkpoint D: the challenge execution, feedback message, and feedback report mappers were grouped by outcome/identity/content/lifecycle/activity/read state. Principal static inspection found the existing casts, date conversions, attachment sorting/positions, report preview/email/display/avatar fallbacks, nullable timestamp semantics, and persistence field sets preserved. Formatter write/check passed (three files, two initial fixes, one annotation follow-up); no DB/runtime or other sensors ran. ACH-34's factual warning count remains unmeasured after these changes. Eleven Database paths remain in the bounded assignment.

W1 focused validation: format exit0; Web code exit0 (171 warnings/2 infos); types exit0; unit exit0 (118 suites/506 tests); affected BFF Jest exit0 (3 suites/26 tests); BFF middleware Playwright exit0 (3 cases). Scoped Web complexity exits1 with 17 warning functions and 1 error function in W1 plus 1 warning in the separately owned W2 provider. SSE has no warning; current REST client reports 6 warnings plus factory error; the three routes report 11 warnings. Read-only diagnosis confirms insertion of a top-level helper shifted previously baselined start-line identities, exposing unchanged factory/getFromUrl/getFile/post findings. Current sensor results invalidate the prior root warning snapshot. No baselines or thresholds changed; W1/ACH-34 remain open pending a bounded correction and paired review.

Database checkpoint E: exactly the three D2 models changed. Principal inspection confirmed column definitions/defaults, constraint names and callback order, PK/check/FK/index behavior, SQL predicates, relationship names, `DESC NULLS FIRST`, and inferred types remain unchanged; `BuildExtraConfigColumns` was used only for the private feedback-report callback typing, without casts or exports. Formatter write/check exit0 (one write fix then clean check). No type/parity/runtime sensor after this checkpoint. Eight repository paths are still in scope.

Web correction checkpoint: exactly four W1 files changed; SSE stayed unchanged. Helpers were moved after the original public functions to preserve sensor baseline identity; JSON request/response/retry and BFF upstream-response/error paths now use promise composition, with fetch wrappers remaining async to retain rejection behavior. Principal static inspection found request bodies, method/header precedence, query cleanup, header forwarding, cache, cookies/timing, auth/receipt precedence, status/body/stream behavior and catch boundaries unchanged. Formatter exit0. All pre-correction sensors are stale; complexity and functional tests must be rerun before W1 review.

Database checkpoint F: the two challenging repositories were refactored only through existing shared query/composition boundaries. Static inspection confirms authorization/filtering, result selection/order, count, casts/aggregation, joins, paging, lock and transaction behavior are unchanged; focused formatter write/check exit0. No DB tests or sensors ran.

Post-correction Web validation: format/code/types exit0; unit exit0 (118 suites/506 tests); focused BFF Jest exit0 (3 suites/26 tests); BFF middleware Playwright exit0 (3 cases). Scoped complexity exits2 with zero error functions, 14 W1 warnings and one separate W2 provider warning. Restored baseline identity for the factory/getFromUrl/getFile/post; SSE clean. Residual W1 findings are MI-only, with no explicit cyclomatic/function-length/Halstead threshold violations: `postFormData`, `sendJsonRequest`, `createJsonResponse`; onboarding GET/absentAttempt; profile-events GET/getAuthorization/createStreamRequestHeaders; signup POST/getAttemptMaxAge/setAttemptCookie/createValidationResponse/getAttemptReceipt/fetchSignUp. These are not waived: zero-warning W1 exit remains failed. The Builder reports that splitting several cohesive 8–9-line functions solely to pass MI65 would harm clarity. Logs: `/tmp/stardust-drizzle-ach34-w1-correction-{format,code,types,unit,bff,browser,complexity}.log`.

Paired Implementation Reviewer W1 verdict: **failed**, with no functional findings in the five paths. CA-12/RF-07, CA-13/RF-08 at the proxy, CA-18/RF-09, and CA-19/RF-09 passed within W1; CA-20 is C2. Blocker IR-01 is the formal CA-22/ACH-34 zero-warning gate: 14 MI-only W1 warnings remain and scoped complexity exits2. Reviewer confirms there is no waiver/baseline route and requires substantive correction plus a fresh capture. This review does not establish Server adapter eligibility/CA-13, Server SSE cadence/EV-06, or integrated C2.

Read-only W1 triage identified five likely behavior-preserving simplifications in the exact residual functions: avoid repeated cookie access when an Authorization header is present; name duration/remaining-time computations without reordering clock reads; use concrete validation output types without redundant null fallbacks; omit the empty false-branch object for absent response headers; pass the session-authorization callback directly. A shared no-store initializer may serve resume/profile 502 responses, while preserving fresh cookie timing and stream-specific cache headers. Builder has not mutated these candidates; sensor improvement is unverified.

W1 mutation checkpoint after IR-01: exactly four W1 paths changed; SSE untouched. Source review confirms the refresh callback is passed to `handleRestError` unchanged and remains lazy; an empty authorization header still wins over cookie credentials, with one cookie read otherwise; maxAge duration and clock order stay fixed; validation response still emits only required title/fieldErrors; absent response headers remain absent; no-store metadata is reused only for same JSON cache policy while cookies remain fresh and SSE retains `no-transform`. Focused format exit0. No tests or sensors after mutation; prior W1 validation/reviewer evidence is stale.

Database checkpoint G: only `DrizzleCommentsRepository.ts` and `DrizzleSolutionsRepository.ts` changed. Static inspection confirms the explicit reply alias/projections, root predicates, order/range/count queries, writes/owner guards, solution filter/order semantics, immutable view proposal, row-lock transaction and atomic increment, and compound upvote filter are retained. Formatter write/check exit0; no DB/tests/sensors ran. Four repository paths remain within this ACH-34 assignment.

Database checkpoint H: only `DrizzleFeedbackMessagesRepository.ts` changed. Principal review confirms authorization roles/owner scope, attachment JSON ordering, lock order, NotFound/Auth/Conflict boundaries, idempotency checks, existing/insert paths, hydration, attachment comparison/insertion, and transaction/query count remain equivalent. Focused formatter write/check exit0 (one initial write correction); no DB/tests/sensors ran. Three D2 repository paths remain.

Database checkpoint I: only `DrizzleFeedbackReportsRepository.ts` changed. Static inspection confirms author/profile/email projection and null handling, page defaults/caps, counts/summary/query counts, filters/order, save/status locks and transaction boundaries, canonical conflicts, greatest activity/read updates, and owner/admin guards remain unchanged. Formatter write/check exit0 (one initial fix); no DB/tests/sensors ran. Two repositories remain.

W1 correction M04: format/code/types exit0; unit exit0 (118/506); BFF Jest exit0 (3/26); BFF middleware Playwright exit0 (3 cases). Complexity exits2, 0 errors, 10 W1 MI warnings and one separate W2 provider warning. Four candidate functions crossed MI65: `createJsonResponse`, `getAuthorization`, `getAttemptMaxAge`, and `createValidationResponse`. Remaining W1 functions/MI: `postFormData` 61.7, `sendJsonRequest` 63.1, onboarding `GET` 64.1, `absentAttempt` 63.4, profile `GET` 62.6, `createStreamRequestHeaders` 62.6, signup `POST` 61.6, `setAttemptCookie` 63.4, `getAttemptReceipt` 60.8, and `fetchSignUp` 63.6. No CC/length/volume findings; IR-01 remains unresolved and the prior W1 paired review is stale after this mutation. Logs: `/tmp/stardust-drizzle-ach34-w1-m04-{format,code,types,unit,bff,browser,complexity}.log`.

Database checkpoint J failed: a mutation touched only `DrizzleChallengesRepository.ts` but left syntax invalid. Focused Biome write/check both exit1 with 30 parser errors. It left a comma after the category subquery and misapplied an expiration extraction hunk to `remove`, breaking both remove and expire method boundaries. No sensors or DB were run and no behavior is approved. The source is isolated to this one authorized path; a bounded repair must restore original delete semantics and correctly target expiration before any other mutation.

Database checkpoint J-F1 correction: only `DrizzleChallengesRepository.ts` changed. Principal source inspection confirms category query syntax repaired, `remove` restored to owner-authorized challenge deletion, and the extracted expiration update retains the original admin/system guard, cutoff (`Date.now() - 7 * 86400000`), `isNew` predicate, and `isNew: false` update. Focused format write exit0 (one fix), check exit0. No typecheck, runtime/DB, or other sensor evidence yet. `DrizzleUsersRepository.ts` remains the sole path to complete the Database warning batch.

W1 M05 source checkpoint: exactly four authorized files changed; SSE remains untouched. `return await` was removed from HTTP promise-forwarding code only where async declarations and caller promise catches remain, so synchronous errors still become rejections at the same handling boundary. `getAttemptReceipt` retains the original upstream/receipt short-circuit and delayed clock sample, caching one `getTime()` result. Principal source inspection found no contract or evaluation-order discrepancy. Focused formatting exit0; no post-M05 sensor or test evidence yet.

W1 M05 validation: format/code/types exit0; unit exit0 (118/506); focused BFF Jest exit0 (3/26); BFF middleware Playwright exit0 (3 cases). Complexity exits2 with 10 W1 MI warnings, 1 W2 warning, and 0 errors. M05 improved values but none crossed MI65. Residuals: `postFormData` 61.9, `sendJsonRequest` 63.3, onboarding GET 64.1, absentAttempt 63.4, profile GET 62.6, createStreamRequestHeaders 62.6, signup POST 61.6, setAttemptCookie 63.4, getAttemptReceipt 61.5, fetchSignUp 63.8. All are MI-only; no CC/length/Halstead warnings. No gate waiver. Logs: `/tmp/stardust-drizzle-ach34-w1-m05-{format,code,types,unit,bff,browser,complexity}.log`.

W1 M06 read-only triage found only one bounded candidate: removing `async` from private `sendJsonRequest`, whose Promise-returning implementation has no await/catch/finally and whose four public callers remain async. Expected MI improvement is uncertain and this alone cannot satisfy the zero-warning gate. The other nine warning functions have no evidence-backed cohesive simplification identified while preserving current request, auth, cookie/clock, response, and error contracts. No mutation or warning waiver recorded; ACH-34 remains open.

Database checkpoint K changed only `DrizzleUsersRepository.ts`. Principal inspection found the grouped SQL relationship projections, listing selection/order/filter, map/count path, guards, bulk/transaction behavior, owner-filtered deletes, insignia lookup/error/insert sequence, ordered star query, and inclusive monthly count predicates intact. Focused formatter write/check exit0; no type, database, or integrated sensor evidence yet. All paths in the bounded D2 ACH-34 refactor batch have now been processed; validation and consolidated paired review remain open.

W1 M06 changed only `NextRestClient.ts` by removing `async` from private `sendJsonRequest`; its body still returns the same fetch Promise, and its public async callers are unchanged. Principal inspection confirms a one-token diff; focused formatter exit0 with no fixes. M05 functional-test and sensor results do not cover this latest mutation; rerun before review.

Database checkpoint K fresh evidence: code exit0 (7 workspaces); types exit0 (7); unit exit0 (5, Server168/325, Core176/638, Web118/506, Studio14/64, LSP1); Server architecture exit0 (863 modules/1,636 dependencies); test integrity exit0. Server complexity exit2 with 57 warnings/0 errors over 696 files/2,735 functions, down39 from96; all residual warnings are among the 18 D2 ACH-34 paths. No baseline or threshold changed. Conformance revision7/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains incomplete only for future contracted paths and schema removal assigned to D3; 16 unrelated paths are ignored. Logs `/tmp/stardust-builder-database-ach34-k-{code,types,unit,architecture,integrity,complexity,conformance}.log`. ACH-34/CA-22 remain failed, S2/coverage/consolidated review pending.

W1 M06 fresh evidence: format/code/types0; unit118 suites/506 tests; focused BFF Jest3 suites/26 tests; middleware browser3 cases. Complexity exits2 with10 W1 MI warnings, one W2 warning, zero errors; the `sendJsonRequest` modifier change did not affect scores. Logs `/tmp/stardust-drizzle-ach34-w1-m06-{format,code,types,unit,bff,browser,complexity}.log`. W1 remains open; second-pass read-only triage pending.

W1 M07 candidate was rejected before mutation. A faithful formatter-preserving prototype grouping retry, refresh, and `includeHeaders` options measured `postFormData` MI61.9→63.5 and `sendJsonRequest` MI63.3→64.0; `put`/`patch` rose 70.0→72.7 and `delete` fell 69.9→66.8. None of the current warnings crosses MI65. The earlier 66.6 estimate came from a prototype that collapsed a multiline `Record` type and is superseded. No source changed; the zero-warning gate remains open.

D2-93 source assignment: somente `DrizzleChallengeCodeExecutionsRepository.incorrectExecutionsQuery`, `DrizzleSolutionsRepository.updatePublication` e `DrizzleCommentsRepository.readColumns`. A proposta mantém os três status e colunas da consulta, envia apenas os campos `title/content/slug` equivalentes existentes à atualização, e alinha a responsabilidade do agregado correlacionado de replies à projeção upvotes mantendo alias/SQL. Nenhum helper novo nem mudança de query semantics autorizada. Estimativas MI não são evidência; sensores seguem obrigatórios. Runtime permanece S2.

D2-93 mutation inspection: the three assigned repositories changed only as proposed. The same status list and selected columns remain; publication writes the same DTO-backed values under the same id/owner condition; reply-count SQL/alias remains unchanged. No helper/cast was added. Focused formatter write/check exited0. No sensors or DB ran; fresh code/type/unit/complexity evidence is required.

D2-93 evidence: format/code/types/unit/Server architecture/test-integrity passed (7 workspaces code/types; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Server complexity exits2 with56 warnings/0 errors, down1 from57; only `updatePublication` crossed the warning threshold. `incorrectExecutionsQuery` remains MI63.8 and Comments `readColumns`63.1. Conformance remains incomplete for future contracted paths;16 unrelated paths ignored. Logs `/tmp/stardust-builder-database-d2-93-{format,code,types,unit,architecture,integrity,complexity,conformance}.log`. No DB/runtime; paired review and ACH-34 remain open.

D2-94 source assignment: only `DrizzleSolutionMapper.ts`; move its seven already-existing private pure helpers to non-exported module functions, preserve signatures/bodies and public static entrypoints, and replace only internal self-dispatch. No new helper or mapper path. This tests a cohesive composition hypothesis; the estimated MI gain/0–2 warnings is not evidence and the result will be decided by the official sensor.

D2-93 paired review: **accepted the scoped three-path mutation, no findings**. Query fields/statuses, DTO-backed publication values/owner predicate, and correlated reply-count alias/SQL were judged preserved. The reviewer did not waive 56 complexity warnings or grant D2 consolidated exit/runtime. Static review only.

D2-94 checkpoint: only `DrizzleSolutionMapper.ts` changed. The source had seven existing helpers (the assignment estimate of eight was corrected); they were relocated unchanged as private module functions, with public static entrypoints and map fields/fallbacks/spread order retained. Formatter write/check exit0. No sensors, DB, or tests after this mutation. Principal inspection found no static discrepancy; fresh definitions and sensors are next.

D2-94 fresh evidence: format/code/types/unit/Server architecture/test-integrity passed (code/types7/7; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies). Server complexity exit2:55 warnings/0 errors, down1; Solution `toPersistence` is now clean, `toEntity` MI63.7 still warns. No new warning. Conformance is incomplete only for future contracted paths; no DB/runtime ran. Logs `/tmp/stardust-builder-database-d2-94-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. D2-94 paired review, ACH-34 and CA-22 remain open.

Current root-wide complexity capture (after D2-94/W1 M06): exit2, 66 warnings/0 errors, 3,471 files/9,327 functions (9,261 clean). The full66 are confined to current feature ownership: Server55, W1 Web10, W2 provider1; no unrelated paths warned. Log `/tmp/stardust-drizzle-ach34-root-current.log`. CI-09/CA-22 remains failed; no threshold/baseline edit.

D2-95 source assignment: only `DrizzleFeedbackReportsRepository.ts` functions `periodFilter`, `savedAdminActivity`, and `searchFilter`. The date filter can return `undefined` on missing period before building the same inclusive bounds; admin column names can be bound locally while preserving both `greatest` expressions and the non-admin current values; nested search logic can become explicit returns while preserving legacy authorName-only behavior and the current id/email query/fallback. No helpers/new paths. Expected metric gain is unmeasured; test with the official sensor.

D2-95 checkpoint: only `DrizzleFeedbackReportsRepository.ts` changed. Review confirms missing period remains undefined, start/end inclusivity remains, the legacy authorName-only route and current id/email fallback stay the same, and admin/non-admin activity values plus greatest/null behavior are unchanged. Formatter write/check exit0, no fixes. No sensors/DB yet.

D2-95 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete on future paths. Server complexity exits2 with55 warnings/0 errors, unchanged. The three candidate methods remain below MI65 (`savedAdminActivity`61.2, `searchFilter`59.5, `periodFilter`62.2), with no warnings removed or added. Logs `/tmp/stardust-builder-database-d2-95-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime.

D2-95 paired review found no semantic/Rules issue in the three functions; scoped verdict **failed for ACH-34 acceptance** because complexity remains55 warnings/exit2 and none of the functions crossed the gate. No waiver or consolidated D2 exit granted.

D2-96 prototype: faithful in-memory CodeMultiVitals1.6.2 + Biome stdin, no source files edited. Relocating the three existing pure write helpers in `DrizzleChallengeMapper.ts` gives `toPersistence` MI64.8→65.6; `persistencePublication` remains63.4 warning, `persistenceEvaluation`65.7 and `persistenceContent`75.2 stay clear; file warnings4→3 with no added method/warning. Inlining publication instead worsens `toPersistence` to54.8 and is rejected. Assignment is limited to relocation; official sensor still decides.

D2-96 checkpoint: only `DrizzleChallengeMapper.ts` changed. The three existing pure persistence helpers moved unchanged to non-exported module scope; static `toPersistence` keeps the same id/content/publication/evaluation/createdAt order and payload, including current null defaults/casts. No new helper or path. Focused Biome write/check passed (one write fix, clean check); no sensors/DB yet.

D2-96 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete for future paths. Server complexity exits2 with54 warnings/0 errors, down1; only `ChallengeMapper.toPersistence` crossed MI65, no new warning. Logs `/tmp/stardust-builder-database-d2-96-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review pending.

D2-96 paired review accepted the scoped ChallengeMapper relocation with no behavioral/Rules findings; complexity remains54 warnings/exit2, so ACH-34 stays open.

D2-97 prototype: faithful in-memory CodeMultiVitals1.6.2 + Biome stdin (no source edits) moving the18 existing private pure helpers in `DrizzleUserMapper.ts` predicts warnings8→4, no new warning. Scores: `toDto`63.2→64.6, `progress`64.8→66.3, `starUnlocks`64.1→67.7, `acquisitions`64.1→65.0, `endorsements`64.1→65.0; `appearance`, `achievements`, and `completions` still warn. Assignment is one mapper only, preserves public APIs and mapping/default/order/flatMap behavior. Official sensor must confirm.

D2-97 checkpoint: only `DrizzleUserMapper.ts` changed. Eighteen existing private helpers moved unchanged to module scope, with public static mapper API/entrypoint call retained. Projection keys, spread order, optional relationship defaults, selected item/tier fallbacks, completed-planet flatMap and persistence field/getter mappings are unchanged by inspection. Formatter write/check passed (one write format fix, clean check). No sensors/DB yet.

D2-97 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete for future paths. Server complexity exit2 with50 warnings/0 errors, down4. `UserMapper.progress`, `starUnlocks`, `acquisitions`, `endorsements` are clean; residual UserMapper warnings remain `toDto`64.6, `appearance`63.8, `achievements`62.2, `completions`64.0. Logs `/tmp/stardust-builder-database-d2-97-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`; no DB/runtime; paired review pending.

Fresh root-wide complexity after D2-97: exit2,61 warnings/0 errors (3,471 files/9,327 functions;9,266 clean). All warnings are feature-scoped: Server50, W1 Web10, W2 provider1. Log `/tmp/stardust-drizzle-ach34-root-d2-97.log`; CI-09/CA-22 remains failed without thresholds/baseline changes.

D2-97 paired review accepted the scoped UserMapper relocation with no semantic/Rules finding. It noted and the Plan now corrects an assignment typo: there is no `toDtoFromProfile`; actual public static methods are `toEntity`, `toDto`, `toPersistence`. No runtime/D2 consolidated exit.

D2-98 prototype: in-memory formatted destructuring of only the existing `completions` helper's input fields measures MI64.0→65.9 and file warnings4→3, with no new function/warning. Other single-expression candidates did not cross65. Assignment limits mutation to this helper and preserves the challenge IDs/array order and planet flatMap/filter semantics.

D2-98 checkpoint: only the existing `completions` input destructuring/property names changed in DrizzleUserMapper. Challenge ID mapping and completed-planet flatMap/truthy filter/nullish [] fallback remain byte-equivalent in behavior. Formatter write/check exit0; no new helper/path. Sensors are stale after this edit.

D2-97 paired review accepted the scoped mapper move with no semantic findings. It noted the assignment typo `toDtoFromProfile`; this nonexistent method reference has been corrected in Plan to the actual `toEntity`/`toDto`/`toPersistence` API. Complexity remained50.

D2-98 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete for future paths. Server complexity exit2 with49 warnings/0 errors, down1; only UserMapper `completions` crossed65. Logs `/tmp/stardust-builder-database-d2-98-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review pending.

D2-98 paired review accepted the scoped completion projection change with no findings. It does not close ACH-34: the Server complexity sensor remains49 warnings/exit2; no runtime/consolidated D2 exit.

D2-99 prototype: faithful in-memory Biome + CodeMultiVitals1.6.2 relocation of only `displayText` and `authorAvatar` predicts a net one-warning reduction (`authorAvatar`64.8→65.1, `authorProfile`65.3→65.9; `displayText`77.4 unchanged; warnings3→2, no new functions/warnings). Relocating all12 helpers yields the same count and is rejected as unnecessary. Preserve profile/avatar fallbacks, trimming/length, extension/image rules and null behavior; do not touch content/date/status/persistence. No source edited; official sensors still decide.

D2-99 checkpoint: only `DrizzleFeedbackReportMapper.ts` changed. The two existing profile/avatar helpers moved unchanged to module scope; call order, trimming/fallback/image extension/null semantics remain. Report content/lifecycle/activity/read/persistence mappings are untouched. Formatter write/check passed (one write fix, clean check); fresh sensors pending.

D2-99 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete for future paths. Server complexity exit2 with48 warnings/0 errors, down1; ReportMapper `authorAvatar` cleared; `toEntity`60.5 and `content`63.9 still warn. Logs `/tmp/stardust-builder-database-d2-99-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review pending.

Root-wide complexity after D2-99 exits2 with59 warnings/0 errors (3,471 files/9,327 functions;9,268 clean). Breakdown: Server48, W1 Web10, W2 provider1; all feature-scoped. Log `/tmp/stardust-drizzle-ach34-root-d2-99.log`. CI-09/CA-22 remains open; no threshold/baseline change.

D2-99 paired review accepted the scoped profile/avatar helper relocation without findings. It confirms call order and defaults; it notes mapper source is untracked, so it relied on current source/checkpoint. ACH-34 remains open (Server48, root59 warnings).

D2-99 paired review accepted the FeedbackReportMapper profile/avatar relocation without findings; complexity48 Server/59 root remains open.

D2-100 prototype: destructuring only `completionFilter`'s `completedChallengesIds` and `completionStatus` measures MI64.1→65.9 and removes one file warning (7→6, no new function/warning). Explicit empty-list and status semantics are preserved; no auth/SQL/order change. Other filter candidates were not included because they did not cross65. Source remains unedited pending assignment/sensors.

D2-100 checkpoint: only `completionFilter` parameters/property reads changed in DrizzleChallengesRepository. Empty/non-empty completed and not-completed behavior plus remaining-status undefined behavior and existing SQL expressions are unchanged. Formatter write/check exit0; no new helper/path. Sensors stale after this source edit.

D2-100 fresh evidence: format/code/types/unit/Server architecture/integrity passed; conformance remains incomplete for future paths. Server complexity exit2 with47 warnings/0 errors, down1; only `completionFilter` crossed MI65 with no warning added. Logs `/tmp/stardust-builder-database-d2-100-{format,code,types,unit,architecture,integrity,conformance,complexity}.log`. No DB/runtime; paired review pending.

Root-wide complexity after D2-100 exits2 with58 warnings/0 errors (3,471 files/9,327 functions;9,269 clean), breakdown Server47/W1 Web10/W2 provider1. Log `/tmp/stardust-drizzle-ach34-root-d2-100.log`. All residuals remain in feature-owned paths; CI-09/CA-22 is not passed and no threshold/baseline changed.

D2-100 paired review accepted the scoped completion-filter edit with no finding; all empty/non-empty status cases and contracts remain intact. The 47 Server/58 root warnings keep ACH-34 and D2 open.

D2-101 prototype: destructuring `testCases`, `isEvaluatedByFunction`, `officialSolution` at the `DrizzleChallengeMapper.evaluation` input and naming the parsed result `parsedTestCases` measures MI64.3→65.5, file warnings3→2, no new function/warning. It preserves conditional JSON parsing, casts, null behavior, domain output order and invalid JSON exceptions. Field-read ordering changes only for artificial getter/proxy objects; Drizzle rows are material plain data objects and do not expose such getters. No source edit yet; assignment is limited to this one function.

D2-101 source checkpoint: `DrizzleChallengeMapper.evaluation` only. The three input fields are destructured and the conditional parse result is named, with parsing, casts, output order, null handling, and invalid-JSON throw behavior retained. Biome write/check passed. This is not sensor evidence; fresh checks and the paired review remain required.

D2-101 fresh evidence: global format/code/types/unit passed; Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1; architecture passed (3,874 modules/6,952 dependencies); test integrity passed. Root complexity exits2 with57 warnings/0 errors (3,471 files,9,327 functions;9,270 clean), down1, no new warning. Log `/tmp/stardust-drizzle-ach34-root-d2-101.log`. `check:spec-implementation` exits1 for the contracted rev7 scope: many create/modify/remove paths remain missing, unchanged, or present (detailed output from run on 2026-10-03); 16 unrelated changed paths ignored. No database integration/runtime ran. ACH-34/CA-22 remain open.

D2-102 candidate: a formatter-preserving in-memory prototype on `DrizzleFeedbackReportsRepository.classificationFilter` measured MI64.7→68.3 and file warnings11→10, with 77 functions before/after and no new warning. Destructuring only `intent`/`status` preserves intent/status predicates, the `!legacy` status condition, undefined behavior, `and` order and SQL values. Other measured candidates did not cross65 and are excluded. This is prototype evidence only; no source mutation yet.
D2-101 paired review: **accepted statically, no findings**. Confirmed conditional JSON parse, casts, nulls, output order and invalid JSON throw. The root sensor changed58→57 with only this warning removed. ACH-34 remains open; no D2 exit or S2 runtime proof.

D2-102 source checkpoint: only `DrizzleFeedbackReportsRepository.classificationFilter` changed. Destructuring the existing `intent`/`status` fields preserves filter guards, legacy condition, undefined result, SQL values and `and` ordering. Focused Biome write/check passed with no fixes. Broader sensors/review remain pending; no DB runtime.
D2-102 paired review: **accepted statically, no findings**. Filter predicates, legacy guard, undefined behavior, SQL parameter values and order are preserved. Complexity is56 warnings/0 errors; ACH-34 and D2 remain open, no runtime proof.

W1 ACH-34 second-pass triage found no additional measured transformation that removes a warning without adding one or changing request, clock or synchronous error behavior. Prototype metrics and rejected alternatives are logged in Plan; no source changed. W1 remains10 warnings, complexity gate open, no waiver.

D2-102 fresh evidence: format/code/types/unit/architecture/integrity passed; code/types7/7 workspaces; Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874 modules/6,952 dependencies. Root complexity exits2 at56 warnings/0 errors (3,471 files,9,327 functions;9,271 clean), down1; breakdown Server45/W1 10/W2 1. Conformance remains incomplete for future contracted paths. Logs `/tmp/stardust-builder-database-d2-102-{code,types,unit,architecture,integrity,conformance}.log` and `/tmp/stardust-drizzle-ach34-root-d2-102.log`. No DB runtime; ACH-34/CA-22 remain open.

D2-103 prototype: formatter-faithful in-memory destructuring at `DrizzleFeedbackReportMapper.content` input measures MI63.9→66.6 and file warnings2→1, with14 functions before/after and no additional score/warning change. Field set/order, payload, screenshot fallback and ISO conversion remain identical. No source edit; assignment is recorded in Plan.

D2-103 source checkpoint: only `DrizzleFeedbackReportMapper.content` input destructuring moved; payload fields/order, screenshot fallback and ISO conversion are unchanged. Biome write/check passed without fixes. Coverage was in flight during this mutation, so Server coverage from that run is not accepted and must be repeated after source freeze.

D2-103 paired review: **accepted statically, no findings**. Verified the five existing inputs, output order, screenshot fallback and ISO date conversion; Rules unchanged. Complexity55 warnings/0 errors keeps ACH-34 open.

D2-103 sensors: format/code/types/unit, architecture and test integrity passed; code/types7/7 workspaces; Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874 modules/6,952 dependencies. Complexity55 warnings/0 errors, 9,272 clean of9,327; conformance remains incomplete. Core/Studio/Web coverage ratchets passed unchanged baselines. Server coverage result from the overlapping run was47.68% lines/statements,31.93% functions,88.97% branches (168 suites/325 tests); rejected as stale because it overlapped this source mutation. Rerun after the D2 batch is frozen. No DB runtime; ACH-34/CA-22 remain open.

D2-104 prototype: CodeGraph confirmou que o DTO de `execution.dto` tem exatamente os seis campos projetados no `executionPayload` atual. Um protótipo formatado em memória que espalha o DTO e sobrescreve apenas a conversão condicional de `createdAt` mede MI62.3→68.9 e arquivo1→0 warning, quatro funções sem alteração e nenhum novo warning. DTO lido uma vez; API/casts/data/defaults/referências preservados. Nenhuma fonte alterada; assignment detalhada no Plan.

D2-104 source checkpoint: only `executionPayload` changed. The six-field DTO is read once and spread, with `createdAt` conditionally converted to `Date` or `undefined`; type annotation, public API, casts, ordering and references remain. Biome write/check passed without fixes. Broader sensors/review pending; no DB runtime.

D2-104 review accepted with no findings: DTO getter is read once; six projected fields, order/references, Date conversion/fallback, Pick/API/casts are preserved. Complexity54 warnings/0 errors, so ACH-34 remains open.

D2-104 sensors: format/code/types/unit, architecture and integrity passed; code/types7/7; Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874 modules/6,952 dependencies. Complexity54 warnings/0 errors,9,273 clean of9,327. Conformance remains incomplete. Core/Studio/Web coverage ratchets passed with unchanged source and baselines; Server coverage deferred until the D2 source batch is frozen. No DB runtime.

D2-105 candidate: formatter-faithful in-memory destructuring of `creationPeriod` in `DrizzleUsersRepository.creationFilter` measured MI63.1→68.9, file warnings10→9,106 functions unchanged, no warning added. Inclusive `gte`/`lte` SQL order, values and absent→undefined behavior remain. No source mutation; assignment recorded in Plan.

D2-105 source checkpoint: only `creationFilter` input destructuring and four reads changed. Inclusive bounds, SQL order/values and absent-period result are unchanged. Biome write/check passed (one format fix, then clean check). Sensors/review pending; no DB runtime.

D2-105 paired review accepted with no findings: inclusive `gte` then `lte`, same values and absent→undefined are preserved; no authorization/query/transaction changes. Complexity53 warnings/0 errors; ACH-34 remains open.

D2-105 current evidence: code/types7/7, architecture3,874/6,952, test integrity passed; complexity53 warnings/0 errors,9,274 clean. Unit tests continue; final counts pending. Conformance remains incomplete, no DB runtime.

D2-105 unit final counts: Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1, all passed. Core/Studio/Web coverage ratchets remained valid; Server coverage waits for the frozen D2 batch.

D2-106 read-only triage: measured candidates did not clear a warning (`orderingCriteria`62.8→63.9; `persistencePublication`63.4→59.8). An optional DTO slug cannot replace the required insert getter without changing/weakening its contract. No source mutation or waiver; broadened triage continues.

D2-106 wider triage: three more formatter-faithful prototypes were no-go: `messageColumns`62.7→61.7/file4 warnings; `legacyList`64.9→62.5/file10; `adminPageResult`62.7→64.2/file10. No source edits. D2-107 candidate `orderedActivityQuery`: destructure only `lastActivityAt`/`id` from the Drizzle model and keep the single `unread(author)` expression first. Prototype MI64.9→68.7, file warnings10→9, no new warning/function change. Assignment is in Plan.

D2-107 source checkpoint: only `orderedActivityQuery` binds existing `lastActivityAt`/`id` columns locally. Query source, filter, directions/order and single `unread(author)` call are preserved. No shared SQL-fragment object, helper, cast or other path. Biome and CodeGraph inspection passed. Sensors/review pending; no DB runtime.

D2-107 paired review accepted with no findings: columns, query/filter, one `unread(author)` call and DESC order preserved. Complexity52 warnings/0 errors; ACH-34 remains open.

D2-107 sensors: format/code/types/unit, architecture and integrity passed; code/types7/7, Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874 modules/6,952 dependencies. Complexity52 warnings/0 errors,9,275 clean/9,327. Conformance still fails on remaining future contract paths. Core/Studio/Web coverage ratchets remain green; Server coverage deferred to the frozen D2 batch. No DB runtime.

D2-108 candidate no-go: `ChallengesRepository.listingOrder` loop destructuring yields MI64.0→64.1 and no warning change; additionally reads the descending getter earlier. No mutation.

D2-109 candidate no-go: `FeedbackReportMapper.toEntity` local bindings for its five existing mapping helpers dropped MI60.5→58.8; warning count remained1. No source mutation.

D2-110 candidate no-go: SolutionMapper.toEntity local destructuring measured MI63.7→62.7 and file warnings remained1; no source mutation.

D2-111 candidate no-go: `UserMapper.toDto` Object.assign composition measured MI64.6→63.7, with three file warnings unchanged. No source mutation.

D2-112 candidate no-go: `UserMapper.appearance` destructuring measured MI63.8→64.9, below threshold; warning count remained3. No source mutation.

D2-113 candidate no-go: `UserMapper.achievements` input destructuring measured MI62.2→63.3; the three mapper warnings remained. No source mutation.

D2-114 candidate no-go: `DrizzleUsersRepository.query` join-column destructuring measured MI64.0→62.9 with file warnings unchanged at9. No source mutation.

D2-115 candidate: `persistAttachments` explicit if/else removes only a terminal early return. Existing behavior (persisted attachments→assert and resolve; empty→await same insert) remains, as do lock/hydrate/transaction/query order. Formatter-faithful prototype measured MI64.1→68.2, FeedbackMessagesRepository warnings4→3, no new function/warning. No source mutation; assignment in Plan.

D2-115 paired review accepted without findings: lock and hydration remain first; branch still validates existing attachments or awaits insertion in the same transaction, preserving void/conflict/idempotency behavior. Complexity51 warnings/0 errors; ACH-34 remains open.

D2-115 sensors passed: format/code/types/unit, architecture and integrity; unit Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874 modules/6,952 dependencies. Complexity51 warnings/0 errors,9,276 clean/9,327, down1. Conformance remains incomplete on future paths. Core/Studio/Web coverage ratchets stay green; Server coverage and DB runtime remain pending for frozen D2/C1. ACH-34/CA-22 stay open.

D2-116 candidate no-go: binding the locked report status in `persistMessage` measured MI64.7→64.9; repository warning count remained3. No source mutation.

D2-117 candidate no-go: `queueIndexes` local expression bindings measured MI60.8→63.1, with three model warnings unchanged and an evaluation-order risk. No source mutation.

D2-118 candidate no-go: `integrityConstraints` local column alias measured MI56.4→55.8, with three model warnings unchanged. No source mutation.

D2-119 candidate no-go: `authorHistoryIndexes` partial-predicate binding measured MI58.6→59.1; warning count stayed3. No source mutation.

D2-120 candidate no-go: local access binding in `ChallengesRepository.publicListingVisibility` measured MI64.7→63.6; file warnings stayed6. No source mutation.

D2-121 candidate no-go: local access-kind binding in `ChallengesRepository.visibility` measured MI64.6→63.7; file warnings remained6. No source mutation.

D2-122 candidate no-go: `ChallengesRepository.publicationFilter` parameter destructuring measured MI60.7→63.2 with file warnings unchanged at6. No source mutation.

D2-123 prototype: `exerciseFilter` nested input destructuring measures MI58.1→65.2, ChallengesRepository file warnings6→5, no new warning. Predicates and `and` order remain identical. CodeGraph confirms `ChallengeDifficulty.level` and `ChallengeIsNewStatus.value` are readonly constructor-assigned data properties, not getters; validation/throws happen at construction. Earlier parameter-entry reads are therefore pure for valid domain values. No source edit; assignment in Plan.

D2-123 source checkpoint: only `exerciseFilter` uses the approved nested input destructuring; all filters, SQL values and operand order remain. Readonly nested fields are constructor-assigned. Biome passed (one write format fix and clean check). Broader sensors/review pending; no DB runtime.

D2-123 paired review accepted without findings: filters/order/defaults and readonly nested fields match contract. Complexity50 warnings/0 errors; ACH-34 remains open.

D2-123 sensors passed: code/types/unit, architecture, integrity; Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture3,874/6,952. Complexity50 warnings/0 errors,9,277 clean/9,327, down1. Conformance still fails on future paths. Core/Studio/Web coverage ratchets green on unchanged workspaces; Server coverage/runtime pending final D2 freeze. ACH-34/CA-22 remain open.

D2-124 read-only ACH-34 triage: formatter-faithful inline of the existing three-item status array in `incorrectExecutionsQuery` measured MI63.8→64.4 and did not remove its warning. Status values/order, selected columns and filter semantics remained equivalent. No source mutation; no-go recorded. D2 and ACH-34 remain in progress.

D2-125/126 read-only ACH-34 triage: `DrizzleCommentMapper.authorProfile` relocation plus typed destructuring measured MI63.6→64.9 (warning1→1); `DrizzleFeedbackReportsRepository.updateStatusQuery` column binding measured MI63.4→62.4 (warnings9→9). Both formatter-faithful prototypes passed; neither reduced warnings, so neither was mutated. ACH-34 remains open.

D2-127 read-only triage: `periodFilter` early-return-to-conditional prototype measured MI62.2→61.6 and left warnings9→9. Local period selection, inclusive bounds and SQL values were equivalent; no source mutation. ACH-34 remains open.

D2 local runtime checkpoint: `npm run db:test -w @stardust/server` passed and reset only the local Compose database. The first empty-app migrate attempt failed closed with `Nonempty database requires verified baseline adoption`. Read-only diagnostics found no public application tables/views/functions/policies; storage grants and default privileges matched; role membership tuples matched but appeared in a different row order; local extension catalog had six entries versus eight expected (`unaccent` and `vector` absent). No source or remote project changed. Finding ACH-128 is assigned to D2's existing transition checker/test paths for an order-insensitive but exact tuple comparison. Extension provisioning is deferred to C1's Compose/reset ownership. D2 remains in progress; this failed runtime evidence is current.

D2-128 source and sensors: only `scripts/check-drizzle-transition.mjs` and its existing test file changed. The membership comparator treats catalog entries as an exact multiset; field mutations, extra/missing rows and duplicate-count changes fail, while reordered identical rows pass. Focused comparator test passed 1/1; focused Biome format/check passed (two pre-existing script lint warnings). Global `check:code`, `check:types`, `test:unit` passed (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1); test integrity passed (10 changed test files,3 testable sources); Server architecture passed (863 modules/1,636 dependencies). Root complexity remains50 warnings/0 errors, unchanged; `/tmp/stardust-d2-128-complexity.log`. `check:spec-implementation` remains incomplete on downstream contracted paths. Paired review pending. No coverage rerun for the tooling-only diff; no DB/remote operation in this assignment.

D2-128 runtime diagnosis correction: post-edit local inspection clarified that the checker still correctly rejected the reset catalog: actual has24 role rows versus21 manifest rows. Three identical projected memberships for `authenticator` (to `anon`, `authenticated`, `service_role`) each have two distinct grantors, `postgres` and `supabase_admin`; the catalog query intentionally omits grantor. Therefore this is not solely row ordering, and D2-128's multiset comparison properly remains false. D2-129 now assigns set equality over complete projected tuples, retaining detection of any distinct extra membership or changed option while collapsing rows indistinguishable in the checker projection. Local catalog otherwise has zero application objects/policies, exact eight expected extensions after local-only setup, matching grants/default privileges, and no external exposure. D2-128 remains accepted as a general order-independent comparator; local migrate was not yet rerun.

D2-129 accepted: reviewer confirms set equality is exact for complete projected role/member/options rows while ignoring row order and identical projections from distinct grantors, which the existing catalog query omits. Distinct extra/missing memberships, changed tuple fields and extra fields still fail. Rules: `No change`; authorization and migration SQL are untouched. The earlier limit is resolved by the full isolated operational suite: `node --test scripts/tests/check-drizzle-transition.test.mjs` passed5/5 (including empty migrate/server-owned catalog/no-op/denied roles, drift, and lock timeout/signal/lost session) while exercising the duplicate grantor projections. Global code/types/unit, integrity and Server architecture passed; root complexity remains50 warnings/0 errors. Logs `/tmp/stardust-d2-129-{code,types,unit,integrity,architecture,complexity}.log` and `/tmp/stardust-d2-129-operational-tests.log`. D2 still awaits broader ACH-34, final batch Server coverage, and remaining phase exits. The Compose reset's missing `unaccent`/`vector` setup is tracked for C1; manual setup used only local Compose, no remote project.

D2-130/131 read-only complexity triage: `savedValues` actor `includes` prototype MI62.4→62.8; `searchFilter` conditional-return prototype MI59.5→58.9. Both kept existing payload/filter semantics but left file warnings9→9. No source changes. ACH-34 remains open.

D2-132 read-only complexity triage: `insigniaUsersQuery` typed destructuring and ORM-column binding measured MI58.6→59.3, with DrizzleUsersRepository warnings9→9. Select/from/join/filter/mapping order stayed; no source change. The other selection helpers depend on typed shared projection APIs; no local safe reduction identified. ACH-34 remains open.

D2-133/134 read-only triage: `authorPage` nested page/item binding measured MI60.7→61.1; `savedAdminActivity` field ternaries measured MI61.2→62.2 (and move model-column reads onto non-admin path). Both kept warning count9 and were rejected. `transitionReport`/`lockedMessageQuery` ordered lock/query compositions had no safe local control-flow reduction. No source edits; ACH-34 remains open.

D2-135/136 read-only triage: `transitionReport` single-use result binding removal measured MI61.8→59.3, warnings9→9; `lockedMessageQuery` join-column bindings measured MI60.5→61.2, warnings3→3. Existing lock/conflict/update order, SQL, joins, filters and limit were retained in prototypes. Both no-go, no source edits.

D2-137 assignment activated for Spec revision7, Builder Database, RF-01/RF-02/RF-03/RF-10 and CA-04/CA-05/CA-20, with the D2 database/code-conventions/server Rules. Only `apps/server/src/database/drizzle/mappers/challenging/DrizzleSolutionMapper.ts` may change: fold `id` into its existing pure content projection as the first field and remove the duplicate standalone mapping from `toEntity`; preserve all remaining projection/read order, values/references and `toPersistence`. The measured formatter-faithful prototype moves `toEntity` MI63.7→65.3 and file warnings1→0; `content` remains below threshold at80.2→78.8, with unchanged function count and no added warning. No helper/API/path/threshold/baseline/runtime/remote changes are authorized. CodeGraph, focused format/check, principal inspection and paired review are required; integrated sensors remain pending.

D2-137 integrated checkpoint: CodeGraph post-edit confirms `toEntity` now obtains the same `row.id` as the first field of `content`; subsequent content/publication/engagement/postedAt/author order and mapper callers are unchanged; persistence remains untouched. Builder's focused Biome format/check passed. Global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and `npm run check:architecture -w @stardust/server` passed. Unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1. Architecture passed with863 modules/1,636 dependencies. `npm run check:complexity` remains exit2 but warnings fell50→49, errors0; this assignment clears one warning without adding a function/warning. `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains exit1 on unrelated/unimplemented contracted paths in CI, Compose/reset, server/web consumers/removals, and C1 runbook/exporter paths; the mapper path is not among findings. `check:spec-definition` and `check:plan-definition` pass after ledger updates. No DB runtime, coverage, or remote project validation ran. D2/ACH-34 remain in progress.

D2-137 paired Implementation Reviewer: **accepted statically; no findings**. `id` is now the first field of the existing content projection consumed by the first spread in `Solution.create`; later spreads do not overwrite it. Payload values/order, signature, and `toPersistence` are unchanged. Complexity is49 warnings/0 errors (exit2), down one; Reviewer notes this does not complete global sensors/D2.

ACH-34 current baseline after D2-137 (no source changes afterward): root `npm run check:complexity` exit2,49 warnings/0 errors,9,278 clean of9,327 functions,3,471 files; `/tmp/stardust-d2-137-complexity.log`. Breakdown Server38, W1 Web10, W2 provider1. D2 and W1 remain in progress.

D2-138 read-only no-go: CodeGraph and faithful Biome/CodeMultiVitals prototype on `DrizzleChallengeMapper.persistencePublication` showed nested DTO destructuring MI63.4→59.8, warnings2→2. Existing getter count and output values/order stayed; read timing shifts. No warning reduction, no source edit, ACH-34 remains open.

D2-139/140 read-only no-gos: `findVote` selected-vote callback destructuring measured MI64.6→64.6, warnings5→5, preserving owner guard/query/filter/limit and absent-row default; `listingOrder` append-in-array measured MI62.6→63.9, warnings9→9, preserving tri-state criteria/order/defaults. Prototypes passed formatter/CodeMultiVitals; no warning cleared or source changed.

D2-141/142 read-only no-gos: `DrizzleCommentsRepository.readColumns` alias destructuring/constant quoted SQL MI63.1→63.9 (file warnings1→1; raw SQL source spelling would need generated-SQL verification); `DrizzleUsersRepository.completionSelection` existing model-column bindings MI60.7→62.5 (warnings9→9; projection/type/JSON/view correlation unchanged). No warning removed and no source mutation.

D2-143 assignment activated: Spec rev7, D2/Builder Database; RF-01/02/03/10; CA-04/05/20; database/code-conventions/server Rules; SHI n/a. Only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`: move the current `readColumns` SELECT and `userModel` FROM into a private `baseQuery`, preserving inferred builder type and make existing `query` delegate then retain its three LEFT JOINs in order. Measured query MI64.0→67.6, helper78.3, file warnings9→8, functions106→107. Preserve SQL/joins/evaluation/auth/public API. No other changes, thresholds, DB or remote operations. Builder must format/check and pause for principal inspection.

### Integrated validation D2-143 / W1-ACH34-01

The assigned changes are limited to their existing paths. `DrizzleUsersRepository.query` delegates to a private inferred `baseQuery` with the exact `select(readColumns()).from(userModel)` expression and preserves avatar→rocket→tier joins and predicates. `getAttemptReceipt` delegates to `readAttemptMetadata`; receipt then expiry/fallback/Date construction stay before upstream/receipt guards, followed by getTime, finite check and short-circuited Date.now. Both focused Biome format/check commands exited0; principal inspection matches the assignments.

Paired Reviewers accepted D2-143 and W1-ACH34-01 statically, with no findings; both Rules dispositions are `No change`. D2 types, public API/auth/SQL/evaluation are unchanged. W1 status/body/headers/cache/synchronous error behavior is unchanged.

Fresh sensors: global `check:code`, `check:types`, `test:unit`, test integrity, and Server architecture passed; unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies. Global complexity remains exit2 with47 warnings/0 errors,9,282 clean of9,329 functions across3,471 files.

`npm --workspace @stardust/web run test:integration` exited1:82 passed and6 failed. The failures are two signup restoration/persisted-success cases and four social-confirmation cases at both viewports. CodeGraph shows the signup composition still does not call onboarding-attempt restoration; the social hook returns on missing hash tokens without redirect; the existing-account redirect depends on a social action result, with stale caching plausible but its action response unverified in this run. These are W2 composition/hook/action behaviors, not a demonstrated regression in the W1 route extraction. The three W1 BFF middleware browser tests and Web route unit tests passed. W2 remains gated by D2/S2/C1; EV-07/browser remains pending and no runtime/manual happy-path claim is made.

W1-ACH34-01 assignment activated: Spec rev7, W1/Builder Web; RF-07/09/10/12; CA-12/13/14/15/18/19/20/22; Web/app-routes/REST/realtime/RPC/conventions Rules; SHI n/a. Only `apps/web/src/app/api/auth/sign-up/route.ts`: extract ordered receipt/expiry header parsing and Date construction into `readAttemptMetadata`, and apply the measured finite/expired guard in `getAttemptReceipt`. Preserve header/fallback/Date order, upstream/receipt guards before getTime, finite check short-circuit before Date.now, inclusive expiry, sync error/promise/cache/headers/caller behavior. Measured `getAttemptReceipt` MI61.5→65.1, helper69.4, file warnings4→3, functions12→13; all other scores stable. No other path/API/test/threshold/runtime/remote change. Builder formats/checks and pauses for principal inspection. Other W1 warnings remain.

W1/W2 ACH-34 final read-only pass: signup `getAttemptReceipt` guard MI61.5→62.6; profile stream-header conditional MI62.6→60.1 with cyclomatic complexity3→5; W2 provider `setHeader` argument consolidation MI57.3→57.6. None clears its warning. Biome-faithful metrics and relevant time/credential/header/cookie/hook ordering were checked; no source mutation. Builder's surveyed surface included NextRestClient, signup POST/fetch/receipt/cookie handling, onboarding GET, profile-events headers, and provider. W1 remains10 warnings; W2 provider remains1; no waiver/threshold/baseline change.

D2-144 assignment activated: Spec rev7, D2/Builder Database; RF-01/02/03/10; CA-04/05/20; database/code-conventions/server Rules; SHI n/a. Only `apps/server/src/database/drizzle/repositories/reporting/DrizzleFeedbackMessagesRepository.ts`: move existing transaction SELECT/FROM/INNER JOIN to private inferred `messageReportQuery(transaction: DrizzleTransaction)`; `lockedMessageQuery` delegates, then applies the same identity filter, `FOR UPDATE OF feedbackMessageModel`, and `limit(1)`. Measured locked method MI60.5→69.4, helper65.4, file warnings3→2, functions33→34. Preserve transaction/SQL/evaluation/identity/locking/types/ownership/API; no extra path/cast/query execution/threshold/runtime/remote change. Awaiting Builder ACK, then focused format/check and principal inspection.

W1-ACH34-02 assignment activated: Spec rev7, W1/Builder Web; RF-07/09/10/12; CA-12/13/14/15/18/19/20/22; W1 Web/app-routes/REST/realtime/RPC/conventions Rules; SHI n/a. Only `apps/web/src/app/api/auth/profile-events/route.ts`: extract existing Headers initialization and credential conditionals into synchronous `createCredentialHeaders`; preserve ordered `getAuthorization(request)` then receipt-cookie read then helper call, allocation timing, non-null Authorization behavior including empty value, truthy receipt fallback, and GET/catch/cache/clock/abort/stream semantics. Prototype: existing request-header function MI62.6→71.0, helper66.9, file warnings2→1, functions6→7; all other scores unchanged. No other path/API/test/threshold/runtime/remote change. Awaiting Builder ACK, then focused format/check and principal inspection.

D2-144 + W1-ACH34-02 source checkpoints: `messageReportQuery(transaction)` preserves the existing SELECT/FROM/INNER JOIN in the same transaction; `lockedMessageQuery` preserves identity WHERE, `FOR UPDATE OF feedbackMessageModel`, then `limit(1)`. `createStreamRequestHeaders` preserves authorization read → receipt-cookie read → helper call; helper allocates Accept headers afterward, preserves `Authorization !== null` (including empty string), truthy receipt fallback, and null when neither exists. Both focused Biome format/check commands exited0; principal inspection matches assignments.

Latest integrated sensors after D2-144/W1-ACH34-02: global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and Server architecture passed. Unit totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1; architecture863 modules/1,636 dependencies. `npm run check:complexity` exits2 at45 warnings/0 errors (9,286 clean/9,331 functions,3,471 files), down47→45 with two prototype-measured file warnings removed. `check:spec-implementation` still exits1 with251 remaining Contract path errors downstream; D2-144 and W1-ACH34-02 paths are recognized. Full Web Playwright integration is currently running; phase/review gate remains pending its result.

W1-ACH34-03 candidate triage: CodeGraph confirmed the sole anonymous `!headers` branch in `apps/web/src/app/api/auth/profile-events/route.ts` and its surrounding GET order. Extracting `new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS })` to synchronous `createAnonymousStreamResponse()` measured GET MI62.6→67.9, helper79.8, file warnings1→0, functions7→8; virtual full-file measurement predicts root −1 warning. It preserves request-header construction before the branch, avoids fetch without credentials, and retains the same 204/null/no-store response and synchronous constructor boundary. Rejected Web candidates: signup cookie-options helper (`setAttemptCookie`63.4→64.9, warnings3→3) and request-init helper (`fetchSignUp`63.8→72.4, helper64.7, warnings3→3); Database `authorPageQueries` aggregation (`authorPage`60.7→61.3, helper69.6, warnings9→9, root delta0). No source/DB changes from this triage. Assignment W1-ACH34-03 is recorded in Plan; definition gates must pass before any edit.

W1-ACH34-02 full Web integration result: `npm --workspace @stardust/web run test:integration` exited1 after 82 passed/6 failed in 7.2m. Failures: `sign-up.test.ts` restoration after reload and persisted-complete success; `social-account-confirmation.test.ts` existing-account direct protected-route path and missing-session/hash redirect, each repeated at 390x844 and 1440x900. This matches the previously diagnosed W2 composition/hook/action gaps; no new W1 route failure appeared. The three changed-path BFF middleware cases passed. W2 remains gated by D2/S2/C1; do not close Web integration or EV-07/browser on this run.

W1-ACH34-03 source checkpoint: Spec/Plan definition gates passed and Builder ACK preceded mutation. CodeGraph current source confirms only `profile-events/route.ts` changed: GET constructs credential headers first, then dispatches missing credentials to synchronous `createAnonymousStreamResponse()`; that factory preserves the exact null body, 204 status, and `NO_STORE_HEADERS`. It remains outside the upstream fetch catch, and no fetch occurs on the anonymous branch. Focused Biome format/check passed. Principal inspection accepted the assignment boundary; full sensors and paired Web Reviewer remain pending.

W1-ACH34-03 paired Web Reviewer: **accepted statically; no findings. Rules: No change.** Fresh global `check:code`, `check:types`, test integrity and Server architecture passed. `npm run check:complexity` exits2 at44 warnings/0 errors, 9,288 clean of9,332 functions across3,471 files, down45→44 with no added warning; the assigned profile-events file warning cleared. Global `test:unit` remains in progress. Full Web Playwright integration must rerun because this source changed. `check:spec-implementation` remains exit1 with251 remaining downstream contracted path errors; the changed W1 route is recognized.

D2-145 read-only triage: CodeGraph verified the existing correlated attachment projection in `DrizzleFeedbackMessagesRepository.messageColumns()` and its single query caller. Extracting the existing attachment-model destructure and exact typed `sql<DrizzleFeedbackMessage['feedbackMessageAttachments']>` coalesce/json_agg expression into private inferred `attachmentAggregate()` measured `messageColumns` MI62.7→72.9, helper66.8, file warnings2→1, functions34→35; predicted root −1. SQL interpolation/predicate/order and `[]` fallback stay exact; only pure ORM metadata reads move until after `getTableColumns`. No DB execution or source mutation. `authorPageQueries` remained a no-go (file warnings9→9). Assignment D2-145 is recorded in Plan; definition gates must pass before any edit.

W1-ACH34-04 read-only candidate: CodeGraph and Biome-faithful full-file metrics found a combined extraction in `NextRestClient.ts`: move multipart Content-Type removal to `createMultipartHeaders`, add a private typed options object for existing retry/refresh/includeHeaders callbacks, pass equivalent named properties at the four call sites, and destructure immediately in the unchanged `sendJsonRequest` body with `includeHeaders=false`. The combined prototype changes effective warnings2→1 (raw6→5; four original baseline-exempt functions untouched), functions37→38, `postFormData` MI61.9→67.1, helper77.3, and leaves `sendJsonRequest` at63.3; factory MI30→30.3 and CC17 unchanged. Exact header case/removal/copy, request construction and lazy/dynamic callbacks remain. Multipart-only and options-only variants did not reduce warnings; the first `?? false` combined variant raised factory CC and was rejected. No source edits. Assignment recorded; wait for active Web Playwright run to finish before source mutation.

W1-ACH34-05 read-only triage: CodeGraph verified the sole cookie-clearing block in `absentAttempt()` of `onboarding-attempt/route.ts`. Extracting it verbatim into synchronous `clearAttemptCookie(response)` measured `absentAttempt` MI63.4→73.2, helper67.0, file warnings2→1, functions6→7; root predicted −1. Same response allocation/object, cookie spread/security/key/value, fresh Date(0), set order and synchronous error boundary remain; helper is only a cohesive response-side cookie deletion boundary. No source changes. Assignment W1-ACH34-05 is recorded in Plan; definition gates must pass before mutation.

D2-146 read-only triage: CodeGraph verified `persistMessage` lock → existing read → ensure order and the same-transaction `hydrateMessage` query/assertion tail. Extracting that unchanged final tail into private async `validatedMessage(transaction, message, existing)` measured parent MI64.7→68.3, helper72.7, file warnings1→0, functions35→36; root predicted −1. The new await/Promise boundary remains inside the existing transaction, preserves query/assertion ordering and rejects before returning. Prototype passed formatter-faithful analysis; no source/DB/docs changes. Assignment D2-146 is recorded in Plan; definition gates must pass before edit.

D2-147 read-only triage: CodeGraph verified the existing alias-corrected correlated replies count in `DrizzleCommentsRepository.readColumns()` and its single query caller. Extracting the same alias and typed `sql<number>` fragment into private inferred `repliesCount()` measured parent MI63.1→68.0, helper74.0, file warnings1→0, functions35→36; root predicted −1. The explicit aliased FROM, identifier, correlated predicate and SQL order stay verbatim; only pure ORM/fragment construction moves to the final projection field. Formatter-faithful measurement passed; no source/DB mutation. Assignment D2-147 is recorded in Plan; definition gates must pass before edit.

D2-148 read-only triage: CodeGraph verified `incorrectExecutionsQuery` and its count caller. Extracting the exact status model binding, `['wrong_answer','syntax_error','runtime_error']` set and typed `inArray` predicate into `incorrectStatusFilter()` measured query MI63.8→67.3, helper71.0, file warnings1→0, functions20→21; root predicted −1. SELECT/FROM fields/order, same `and(filter, predicate)` order, owner filter and count consumer remain. Only ORM builder construction precedes the status array; no external side effect/query. Prototype passed formatter-faithful analysis; no source mutation. Assignment D2-148 is recorded in Plan; definition gates must pass before edit.

D2-148: CodeGraph confirms the exact ordered typed statuses, unchanged `inArray`, unchanged SELECT/FROM and `and(filter,predicate)` order, plus count caller. Focused Biome format/check passed. Paired Database Reviewer accepted with no findings; Rules `No change`.

W1-ACH34-05: CodeGraph confirms same no-store/null response object is created before and returned after synchronous cookie deletion; cookie option spread, secure read and expiry Date construction stay ordered. Focused Biome format/check passed. Paired Web Reviewer accepted, no findings; Rules `No change`. Full sensors and browser rerun remain pending.

D2-147 source checkpoint: CodeGraph current source confirms only `DrizzleCommentsRepository.ts` changed and preserves exact alias, identifier, correlated SQL, query count and readColumns projection order. Focused Biome format/check passed. Principal inspection accepted the scope; paired Database review and full sensors pending.

D2-147 paired Database Reviewer accepted statically with no findings; Rules `No change`. Reviewer verified the explicit `comments AS comment_replies` declaration and correlated count remain valid and that readColumns order/query count are unchanged.

W1-ACH34-03 full Web integration: 82 passed/6 failed (7.3m, exit1); failures exactly match the known W2 signup restoration and social confirmation behaviors/viewports. No new W1 route failure; anonymous BFF behavior and the three changed-path middleware cases passed.

D2-145: principal CodeGraph inspection confirms exact typed SQL aggregate, seven column references, correlation/order/fallback and messageColumns projection. Paired Database Reviewer accepted, no findings; Rules `No change`. Focused Biome format/check passed; full sensors pending.

D2-146: principal CodeGraph inspection confirms `persistMessage` retains lockReport→existingMessage→ensureMessage awaits, then delegates only hydrate/assert/return to private async `validatedMessage`; helper runs in the same transaction, so query and conflict timing before successful resolution are preserved. Focused Biome format/check passed; paired review and integrated sensors pending.

D2-146 paired Database Reviewer accepted statically with no findings; Rules `No change`. Reviewer confirms transaction, await order and public API/query set are unchanged. This scoped acceptance does not satisfy D2/runtime/ACH-34 exits.

W1-ACH34-04 source checkpoint: post-integration, Builder changed only `NextRestClient.ts`. CodeGraph confirms multipart header preparation remains before dispatch; four call sites pass equivalent callbacks/policy as named options; private dispatcher immediately destructures with `includeHeaders=false`; dispatcher body is unchanged. Focused Biome format/check passed. Principal inspection matches assignment; paired Web review, full sensors and repeat Web integration remain pending.

W1-ACH34-04 paired Web Reviewer accepted statically with no findings; Rules `No change`. Reviewer confirms exact-case Content-Type stripping/copy, callbacks stay lazy arrows over dynamic `this`, and URL/defaults/method headers/body/error/response ordering remains. Full sensors and repeat browser suite remain pending.

Latest integrated sensors after W1-ACH34-04, D2-145 and D2-146: global `check:code`, `check:types`, test integrity and Server architecture passed. Global `test:unit` is still running. Official `check:complexity` exits2 at41 warnings/0 errors, 9,294 clean of9,335 functions across3,471 files, down44→41 with no new warning. Definition gates pass. `check:spec-implementation` remains exit1 for251 contracted paths assigned to unfinished/downstream work; all current D2/W1 edits are recognized. Full Web integration after W1-ACH34-04 remains pending.

Integrated D2-148/W1-ACH34-05 sensor checkpoint: global `check:code`, `check:types`, `test:unit`, test integrity and Server architecture pass. `check:complexity` exits2 at38 warnings/0 errors (9,300 clean of9,338 functions across3,471 files), down40→38 with no new warning. Spec and Plan definition gates pass. `check:spec-implementation` exits1 with251 unfinished/downstream paths and recognizes both latest source paths. Full Web integration was started again after these changes; result pending.

ACH-34 triage after W1-ACH34-05: Database's candidate extraction in `feedback-report-model.ts` was measured no-go: `integrityConstraints` MI56.4→61.1, helper66.8, file warnings3→3 and root delta0, so no assignment/source change. Web's distinct candidate W1-ACH34-06 names the existing sign-up attempt response Promise callback as `resolveAttemptResponse`; CodeGraph confirms the unchanged `.then` handler boundary and catch placement. Formatter-faithful prototype measures GET MI64.1→66.4, replaces the anonymous callback MI88.9 with a named helper MI78.1, preserves seven functions, and reduces that file's warnings1→0 (predicted root −1). No source edit made; assignment recorded in Plan pending definition gates and Builder ACK.

Full Web integration after W1-ACH34-04/05 and D2-145–148: **82 passed, 6 failed**, exit1 after7.1m. Failures exactly match the known W2 cases: signup restore after reload; already-complete persisted success; existing-account social confirmation and missing-session redirect at390x844 and1440x900. No new W1 failure. The full run exited before W1-ACH34-06 mutation; Builder is now released to implement that assigned route-only extraction.

W1-ACH34-06: after integration exited and the Builder was released, only `onboarding-attempt/route.ts` changed. CodeGraph confirms the exact `.then` callback extraction into synchronous `resolveAttemptResponse(upstream)` and unchanged downstream `.catch`; selected response creation, status read and missing-receipt branch remain ordered as assigned. Focused Biome format/check passed. Paired Web Reviewer accepted, no findings; Rules `No change`. Full sensors are running; the prior 82/6 browser result predates this mutation and cannot validate it.

D2-149 read-only triage: fresh CodeGraph confirms `adminPageResult` has one caller, `adminPage`, and consumes plain arrays from `adminPageQueries`' Drizzle `Promise.all`. Extracting count/summary normalization into private `adminPageMetadata()` while retaining `items` hydration as the first object field measured `adminPageResult` MI62.7→68.8, helper65.0, file warnings9→8, root predicted −1; remaining scores unchanged. Tuple metadata destructuring moves after DTO mapping, relying on ordinary ORM result arrays rather than proxies/getters. This gives a cohesive pagination/count/summary boundary. No source/DB/docs mutation. Assignment D2-149 is recorded in Plan pending definition gates and Builder ACK.

Post-W1-ACH34-06 global sensors: `check:code`, `check:types`, `test:unit`, test integrity and Server architecture passed; Server unit tests168/325. Official `check:complexity` is exit2 with37 warnings/0 errors, 9,301 clean of9,338 functions across3,471 files, down38→37 with no new warning. Spec conformance remains exit1 with251 downstream/incomplete paths and recognizes W1-06. Paired Web Reviewer accepted W1-06; full Web integration is running after its mutation (session4660).

D2-149 source/review checkpoint: CodeGraph confirms `adminPage` → `adminPageResult` and the single `adminPageQueries` `Promise.all` producer. Only `DrizzleFeedbackReportsRepository.ts` changed. Item rows are destructured and converted to DTOs before spreading `adminPageMetadata`; its inferred type is the same query tuple, and the total/summary fallbacks and field order remain unchanged. Focused Biome format/check passed. Paired Database Reviewer accepted statically with no findings; Rules `No change`. Integrated sensors after D2-149 are running; W1 full browser suite is also still active.

W1-ACH34-06 post-mutation Web integration: `npm --workspace @stardust/web run test:integration` exited1; `.last-run.json` reports six failed test IDs out of88, matching the same W2 signup restoration and social-confirmation cases seen before this edit. The full output ended with82 passed/6 failed. No new W1 test failure; the prior six are unchanged. Global post-D2-149 sensors passed `check:code`, `check:types`, `test:unit` (Server168/325), test integrity and Server architecture. Official complexity remains exit2 at36 warnings/0 errors, 9,303 clean of9,339 functions across3,471 files, down37→36 with no new warning. Spec conformance still has251 unfinished/downstream contracted paths.

D2-150 read-only triage: fresh CodeGraph verified `searchFilter`'s legacy and current search branches and its sole listingFilter caller. Splitting them into exact `legacyAuthorSearch` and `reportIdentitySearch` predicates preserves initial query/name reads, legacy short-circuit, empty fallback, SQL conditions and OR operand order. Prototype: dispatcher MI59.5→70.8; helpers72.3/68.3; file warnings8→7, functions78→80, root predicted −1. A single-helper alternative was a no-go (file8→8). No source mutation; assignment D2-150 is recorded in Plan pending gates and ACK.

W1-ACH34-07 read-only triage: fresh CodeGraph inspected `sendJsonRequest`, `handleRestError`, and `createJsonResponse`. Extracting the exact `response.ok` routing into synchronous `resolveJsonResponse` retains `.then`, the selected branch, lazy retry/refresh callbacks and Promise adoption. Formatter-faithful measurement: dispatcher MI63.3→66.2, helper70.0, effective file warnings1→0 (raw5→4; baseline-exempt functions unchanged), functions38→39, root predicted −1. A request-init helper was rejected because it left the file warning unchanged. No source change; assignment recorded in Plan pending definition gates and Builder ACK.

D2-151 read-only triage: after D2-150, Database measured `periodFilter` as a distinct candidate. It preserves legacy/current period selection and the `!period` return, extracting only the ordered inclusive createdAt `gte(startDate)`/`lte(endDate)` into `createdWithinPeriod`. Type derives from the existing listing params. Metrics: MI62.2→67.4, helper70.2, file warnings7→6, root predicted −1; all other scores unchanged. CodeGraph confirms the selection/predicate order. No source edit; Plan assignment pending gates/ACK.

W1-ACH34-08 read-only triage: after W1-ACH34-07, CodeGraph confirms the existing sign-up fetch init and caller test. A synchronous `createSignUpPayload` groups only the same JSON serialization and matching Content-Type header, then spreads at the original body/headers position. Metrics: `fetchSignUp` MI63.8→65.7, helper78.9, file warnings3→2, functions13→14, root predicted −1. URL/body/header/cache/signal/redirect evaluation order and existing async catch remain. A whole-init helper was a no-go (no warning reduction). No source mutation; Plan assignment pending gates/ACK and integration exit.

D2-152 read-only triage: CodeGraph confirms `legacyList` applies its legacy filter before issuing parallel rows/count queries and its sole `findMany` caller is admin-gated. Extracting the unchanged `Promise.all([legacyPageQuery, countQuery])` to private `legacyListQueries` preserves query order, concurrency, result await/destructure and count fallback. Metrics: `legacyList` MI64.9→70.4, helper77.9, file warnings6→5, root predicted −1; all other scores unchanged. No source mutation; Plan assignment pending definition gates and ACK.

W1-ACH34-09 read-only triage: after W1-ACH34-08, CodeGraph confirms `setAttemptCookie` computes maxAge before the original synchronous cookie mutation. Extracting only the unchanged `cookies.set` and options into `applyAttemptCookie(response,value,maxAge,expiresAt)` preserves the Secure/lifetime/date reads and return/error boundary. Metrics: setAttemptCookie MI63.4→72.6, helper67.0, file warnings2→1, functions14→15, root predicted −1. An options-factory alternative was a no-go (no warning reduction). No source edit; Plan assignment pending gates and Web integration exit.

D2-153 read-only triage: fresh CodeGraph verified `updateStatusQuery` and its existing status-transition payload. Extracting the unchanged `{ status: report.status.value, lastActivityAt: sql\`greatest(..., now())\` }` into private `statusTransitionValues(report)` preserves the status getter, DB-side clock, atomic update/expected-status WHERE/RETURNING order, lock and validation. Metrics: query MI63.4→67.8, helper72.0, file warnings5→4, root predicted −1; others unchanged. Prototype passed formatter-faithful analysis; no source/DB mutation. Plan assignment recorded; definition gates and current Web integration exit required before mutation.

W1-ACH34-10 read-only triage: fresh CodeGraph verified the first operation in signup `POST` and its current canonical-origin rejection. Extracting the exact forbidden-origin predicate into `isForbiddenSignUpOrigin(request)` preserves header read→configured URL/origin construction→403/cookie clearing before body read, including sync error timing. Metrics: POST MI61.6→65.0, helper77.0, route warnings1→0, functions15→16, root predicted −1; candidate is threshold-tight and requires official confirmation. No source edit; Plan assignment recorded, definition gates and full Web integration exit required before mutation.

D2-153 and W1-ACH34-10 checkpoints: source remained limited to the two assigned files. Principal CodeGraph confirms the atomic status SET payload/order and the first-operation synchronous signup Origin rejection are unchanged; both paired Reviewers accepted statically without findings, Rules `No change`. Focused Biome passed. Fresh global code/types/unit, Server architecture, test integrity and Web coverage ratchet passed; complexity exited2 with28 warnings/0 errors (down30→28). The Server coverage check still fails at lines/statements47.67% and functions31.76% versus51.60%/47.11% baselines; branches88.97% exceeds82.98%. This is the already-tracked ACH-35 for the incomplete D2 code surface, not a reason to alter baselines or add forbidden repository-only tests; the Database Rule Pack routes behavior validation through S2 runtime scenarios. Full Web integration is running. Spec conformance exits1 with251 contracted downstream/incomplete paths and recognizes the current D2/W1 source paths.

Fresh full Web integration after W1-ACH34-10: exit1 after8.5m, **82 passed/6 failed**. The six are identical to prior runs: signup attempt restoration after reload and already-complete restoration; social confirmation for existing persisted account and missing session at390x844 and1440x900. No new failure in the signup BFF path. Web coverage ratchet passed against baseline: lines25.76% (24.76%), statements24.93% (23.93%), functions22.58% (21.59%), branches27.69% (27.07%). Server coverage exited0 for all168 suites/325 tests but `check:coverage` still exits1 against the existing ACH-35 baseline debt: lines/statements47.67% <51.60%, functions31.76% <47.11%, branches88.97% ≥82.98%. No baseline changed. Definition gates passed after updating the current Plan/Evaluation checkpoint.

ACH-34 triage after D2-153/W1-ACH34-10: the latest official complexity capture is `/tmp/stardust-ach34-10-complexity.log`, 28 warnings/0 errors. CodeGraph showed the only remaining Web warning is `useRestContextProvider` MI57.3, owned by W2, so no further safe W1 assignment is made. D2's `savedAdminActivity` has a cohesive measured extraction: preserve the non-admin snapshot branch, extract only the admin-only `greatest` updates into `advancedAdminActivity(report)`. Metrics MI61.2→67.6, helper68.3, repository warnings4→3, predicted root −1. No source mutation; D2-154 recorded in Plan pending definition gates/ACK.

D2-154 principal/review checkpoint: CodeGraph confirms exact non-admin current-value return and admin-only helper call; helper preserves the same ordered SQL `greatest` values and null handling. Focused Biome passed and paired Database Reviewer accepted, no findings; Rules `No change`. Fresh global code/types/unit, Server architecture/integrity/complexity and Server coverage are running; earlier Web browser/coverage evidence remains fresh because this is a Server-only path.

D2-154 fresh sensor result: global code/types/unit and Server architecture/integrity passed (Server168/325; Core176/638; Web118/506; Studio14/64; LSP1/1). Complexity is27 warnings/0 errors, reduced28→27. Server coverage run passed all168 suites/325 tests, then `npm run check:coverage -- @stardust/server` exited1: lines/statements47.67% <51.60% baseline, functions31.75% <47.11%, branches88.97% ≥82.98%. The 0.01-point function change from the prior coverage snapshot reflects the newly added helper remaining unexercised; this is tracked under ACH-35/S2, with no baseline change or repository-only test. Conformance remains exit1 with251 unfinished/downstream paths. No database or remote action.

ACH-34 D2 triage against `/tmp/stardust-d2-154-complexity.log`: `transitionReport` measured no-go (caller MI61.8→71.2, helper64.0 still warning, file/root delta0). `authorPage` result extraction also measured no-go (60.7→64.5, helper71.5, file delta0). `savedValues` yielded a cohesive candidate: retain actor check and `savedContent`, extract its ordered status + author activity + admin activity composition into private inferred `savedConversationValues(report,current,admin)`. Metrics MI62.4→67.1, helper66.9, file warnings3→2, root predicted−1. Formatter-faithful prototypes passed; no source edit. Assignment D2-155 recorded in Plan pending definition gates and Builder ACK.

D2-155 principal/review checkpoint: CodeGraph confirms `savedValues` retains actor calculation then `savedContent`, and the helper preserves status → author activity → admin activity with unchanged SQL fragments/fallbacks. Focused Biome passed; paired Database Reviewer accepted with no findings; Rules `No change`.

D2-155 fresh sensor result: global code/types/unit, Server architecture and test integrity passed (Server168/325; Core176/638; Web118/506; Studio14/64; LSP1/1). Complexity fell27→26 warnings, zero errors. Server coverage passed all168 suites/325 tests, then `check:coverage` still failed the tracked ACH-35 ratchet: lines/statements47.66% <51.60%, functions31.74% <47.11%, branches88.97% ≥82.98%. No baseline change; no repository-only tests per Database Rules. Spec conformance remains exit1 with251 incomplete/downstream paths. No runtime or remote operation. Spec/Plan definition gates passed after the checkpoint.

ACH-34 D2 triage after D2-155: the current official complexity map leaves `transitionReport` and `authorPage` as the only warnings in FeedbackReportsRepository; both candidate extractions were measured no-go (no net warning reduction). A viable candidate in `DrizzleChallengesRepository.publicListingVisibility` isolates the user/God owner exception into `publicListingOwnerCondition`, preserving OR order and role behavior; reusing generic `ownerCondition` would be incorrect because it omits God. Metrics: caller MI64.7→78.4, helper70.1, file warnings5→4, predicted root−1. No source edit. Assignment D2-156 recorded in Plan pending definition gates and Builder ACK.

D2-156 accepted checkpoint: `DrizzleChallengesRepository.publicListingVisibility` retained `isPublic` before the exact `user || god` owner predicate; reviewer accepted statically, no findings, Rules `No change`. Fresh code, types, global unit (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1), Server architecture and test integrity passed. Official complexity improved26→25 warnings with0 errors. All168 Server coverage suites/325 tests passed; the unchanged ACH-35 ratchet still fails at47.66% lines/statements and31.72% functions versus51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline changes. Spec conformance remains exit1 with251 unfinished/downstream contracted paths. No local or remote database runtime validation occurred for this extraction.

ACH-34 D2 triage after D2-156: fresh CodeGraph confirms `visibility` retains the `god || system` unrestricted bypass, then composes public visibility, the user-only owner condition, and lazily optional available-star visibility. A private inferred `nonAdminVisibility(starContent)` can isolate only the existing OR expression with exact operand order. Formatter-faithful prototype: caller MI64.6→73.2, helper68.5, file warnings4→3, predicted root−1, other scores unchanged. Assignment D2-157 is recorded in Plan; no source edit yet.

D2-157 accepted checkpoint: the Database Reviewer confirmed the retained `god/system` bypass and exact public → owner → lazily optional star expression; no findings, Rules `No change`. Global code/types/unit, Server architecture and test-integrity checks passed. Complexity improved25→24 warnings with0 errors. All168 Server coverage suites/325 tests passed; `check:coverage` still fails the tracked ACH-35 ratchet at47.66% lines/statements and31.71% functions versus51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline changes. Conformance remains incomplete and reports path-state mismatches against the requested baseline. No database runtime validation was required by this extraction.

ACH-34 D2 triage after D2-157: fresh CodeGraph confirms `publicationFilter` preserves the star-exclusion operand first, then checks the nested author-only criterion. Extracting that exact ternary into inferred `authorOnlyFilter(params)` preserves getter/short-circuit order and `sql\`false\`` for the fail-closed missing-author case. Formatter-faithful prototype: caller MI60.7→67.1, helper67.6, file warnings3→2, predicted root−1, other scores unchanged. Assignment D2-158 is recorded in Plan; no source edit yet.

D2-158 accepted checkpoint: the Database Reviewer confirmed the star-first operand and unchanged author-only short-circuit, including missing-user `sql\`false\`; no findings and Rules `No change`. Global code/types/unit, Server architecture and test-integrity checks passed; complexity improved24→23 warnings with0 errors. All168 Server coverage suites/325 tests passed, but the unchanged ACH-35 ratchet remains below baseline at47.66% lines/statements and31.69% functions versus51.60%/47.11%; branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete; no database runtime validation was required for this extraction.

D2-159 accepted checkpoint: review confirms the authorization guard, shared-filter SQL query and `'none'` fallback remain unchanged. Global code/types/unit, architecture and test integrity passed; complexity improved23→22 warnings with0 errors. All168 Server coverage suites/325 tests passed; the ACH-35 ratchet remains at47.66% lines/statements and31.68% functions versus51.60%/47.11%; branches88.97% exceeds82.98%. No baseline changes. Conformance remains incomplete; no database runtime validation was required.

ACH-34 D2 triage after D2-159: fresh CodeGraph identifies the remaining `DrizzleChallengesRepository.listingOrder` warning. Extracting only its existing optional-criteria loop into `appendListingOrders(orders,params)` preserves the initial mandatory difficulty order, same mutable array identity, eager criteria construction and iteration order, plus lazy ascending/descending reads. Formatter-faithful prototype: caller MI64.0→72.9, helper67.7, file warnings1→0, predicted root−1 from22, other scores unchanged. Assignment D2-160 is recorded in Plan; no source edit yet.

D2-160 accepted checkpoint: the paired Reviewer verified the original mutable array, mandatory difficulty-first order, criteria construction point, tuple iteration order and lazy direction getter behavior; no findings, Rules `No change`. Global code/types passed, and full unit tests passed on retry after one Studio timeout under concurrent coverage load; totals Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1. Server architecture and test integrity passed. Complexity fell22→21 warnings with0 errors. All168 Server coverage suites/325 tests passed, while the unchanged ACH-35 ratchet remains at47.65% lines/statements and31.67% functions versus51.60%/47.11%; branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete.

ACH-34 D2 triage after D2-160: the remaining `DrizzleUsersRepository.listingOrder` warning has an exact optional-order loop boundary. Extracting that loop into `appendListingOrders(orders,params)` preserves the empty initial array, eager `orderingCriteria`/count SQL construction, ascending-before-descending short-circuit, same array, and mandatory creation-date DESC appended last. Formatter-faithful prototype: caller MI62.6→70.3, helper67.7, file warnings8→7, predicted root−1 from21, others unchanged. Assignment D2-161 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-161: fresh CodeGraph identifies `DrizzleUsersRepository.insigniaUsersQuery` as a viable remaining warning. Extracting only the existing acquired-insignia SELECT/FROM/INNER JOIN into inferred `acquiredInsigniaUsersQuery()` leaves the role `.where(...)` and role mapping after query construction. Formatter-faithful prototype: caller MI58.6→67.6, helper65.2, file warnings7→6, predicted root−1 from20, others unchanged. Assignment D2-162 is recorded in Plan; no source edit yet.

D2-162 accepted checkpoint: CodeGraph confirms the acquired-insignia helper keeps the same projection, join alias and condition, and leaves role filtering/mapping at the caller. Focused Biome passed; paired Database Reviewer accepted statically with no findings; Rules `No change`. Code, types, global unit, Server architecture and test-integrity checks passed. Complexity improved20→19 warnings with0 errors. All168 Server coverage suites/325 tests passed; `check:coverage` remains below tracked ACH-35 baselines at47.65% lines/statements and31.64% functions (51.60%/47.11%), while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete with505 contracted paths and path-state mismatches; no runtime or remote database operation.

ACH-34 D2 triage after D2-162: CodeGraph confirms `apps/server/src/database/drizzle/mappers/profile/DrizzleUserMapper.ts`'s `appearance` is only called by `toDto`, and the mapper's existing `selectedItem`/`tierProfile` helpers already isolate adjacent mapping concerns. Moving only the tier `{ id, entity }` envelope into private inferred `selectedTier(row)` preserves avatar → rocket → tier output order and id fallback before `tierProfile(row.tier)`. Formatter-faithful prototype predicts caller MI63.8→69.3, helper70.9, mapper warnings3→2 and root−1 from19; other scores unchanged. Assignment D2-163 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-163: the remaining `DrizzleUserMapper.toDto` warning has a cohesive boundary after the adjacent identity, performance and study-routine spreads. Private inferred `accountProfile(row)` returning those three existing helper results in their exact order leaves appearance, progress and ranking spreads in place. Prototype metrics: caller MI64.6→68.2, helper78.5, file warnings2→1, predicted root18→17. The `achievements`/`relationshipIds` alternative was a no-go (MI62.2→62.8, no file warning reduction). Assignment D2-164 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-164: the remaining `DrizzleCommentMapper.authorProfile` warning can group its exact inline avatar object in private static `authorAvatar(row)`, preserving name → slug → avatar and the two empty-string fallbacks. Prototype metrics: caller MI63.6→68.2, helper77.9, file warnings1→0, predicted root17→16. Three proposed `DrizzleUsersRepository` bindings and a `DrizzleFeedbackReportMapper` conversation-state grouping were measured no-go because their file warning counts did not change. Assignment D2-165 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-165: `DrizzleChallengeMapper.toEntity` has a measured composition boundary across the contiguous id → content → publication → exercise members. Private static `exercisePublication(row)` returns that exact block in order; evaluation, engagement and author remain after it, while persistence is untouched. Prototype metrics: caller MI61.4→66, helper67, file warnings2→1 and root16→15. Assignment D2-166 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-166: `DrizzleFeedbackReportMapper.toEntity` can group only its contiguous activity → readState → authorEmail → preview tail into private static `conversationSummary(row)`, leaving content → author → lifecycle before it. Metrics: caller MI60.5→66, helper65.4, file warnings1→0, root15→14. Grouping content/author/lifecycle was a no-go (no warning reduction). Assignment D2-167 is recorded in Plan; no source edit yet.

ACH-34 D2 triage after D2-167: `DrizzleUserMapper.achievements` can group its first two adjacent fields, unlocked and rescuable achievement IDs, into inferred `achievementProgress(row)`, while insignia roles remain afterward. The existing `relationshipIds` calls, callbacks and output arrays are unchanged. Prototype metrics: caller MI62.2→71.3, helper65, mapper warnings1→0, predicted root14→13. The helper is threshold-tight and official complexity must confirm it adds no warning. Assignment D2-168 is recorded in Plan; no source edit yet.

D2-168 integrated sensors: official complexity confirmed the threshold-tight helper adds no warning; count improved14→13 with0 errors. Paired review accepted without findings; Rules `No change`. Code/types/unit, Server architecture and integrity passed. Server coverage passed168 suites/325 tests at47.63% lines/statements,31.56% functions and88.97% branches. ACH-35 remains below51.60%/47.11%/82.98%; no baseline change. Conformance remains incomplete at505 contracted paths. No runtime or remote DB operation.

ACH-34 D2 triage after D2-168: the last measured mapper warning is `DrizzleChallengeMapper.persistencePublication`. A module-private inferred `publicationState(dto)` can return the contiguous `starId`, `isPublic`, `isNew` tail, preserving its exact field order and `starId ?? null` fallback; `dto`, `slug`, and `author.id` reads remain in their original positions. CodeGraph and formatter-faithful prototype: caller MI63.4→67, helper77.7, mapper warnings1→0, predicted root13→12, all other scores unchanged. Prototype passed; Assignment D2-169 was recorded in Plan, definition gates passed, and Builder ACK preceded mutation. Feedback-report-model activity-order extraction is a measured no-go (three warnings remain; helper MI78.1), and `DrizzleUsersRepository.orderingCriteria` remains a previously measured no-go (no warning reduction).

D2-169 integrated sensors: paired Database review accepted statically with no findings; Rules `No change`. Focused Biome, global code and types, Server architecture (863 modules/1,636 dependencies), test integrity, and global unit passed (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1). Complexity fell13→12 warnings with0 errors. Server coverage passed168 suites/325 tests at47.62% lines/statements,31.54% functions and88.97% branches; the existing ACH-35 ratchet still fails at51.60%/47.11%/82.98%, unchanged. `check:spec-implementation` remains failed against the 505 contracted paths with baseline path-state mismatches. No baseline edit or database runtime/remote action. Coverage worker reported a process requiring forced exit after all tests passed.

ACH-34 D2 continued triage: a CodeGraph-first prototype extracting the full feedback-report author FK metadata into `authorReference(userId)` preserves column and constraint order but is a measured no-go: `integrityConstraints` MI56.4→62.1, helper66, feedback-report-model warnings3→3, prototype exit0. No source mutation or assignment.

ACH-34 D2 triage audit: no safe zero-warning candidate was demonstrated among the 11 remaining D2 functions (three feedback-report model, six user repository selections/order, two feedback-report repository functions). The five-selection reintegration prototype lowers `DrizzleUsersRepository` warnings6→3, but creates `progressSelection` MI49.7 and `collectionSelection` MI44.9 (length30/27; Halstead194.49/335); no-go. Replacing the owner argument with a table-derived `userId` leaves three warnings and those composers at MI51.6/51; it changes the owner-read point and lacks a runtime/type proof, so no-go. Existing separately measured no-gos remain as listed above. No D2-170 source assignment or edit. ACH-34 remains open; threshold/baseline unchanged.

The lazily invoked per-projection-factory prototype exits0 and reduces the repository six selection warnings to two; its prototype report predicted root11→7 warnings at that measurement: `progressSelection` MI67.6 passes, `collectionSelection` MI62.5 remains a warning; nine named projection factories score68.7 each, the planets factory75.6, and `relationshipProjection`78.8. Despite preserving lazy/fresh SQL creation and exact field order, the nine one-projection functions violate the cohesive-boundary guardrail, the collection still warns, and the prototype lacks TypeScript verification; no-go. A single inferred tuple prototype was not validly measurable: array inference loses heterogeneous projection types, while preserving tuple positions would require a cast/explicit annotation or new runtime mechanism outside the assignment constraints. No D2-170 source assignment/edit; ACH-34 remains open.

Feedback-report model inline prototype: moving all nine ordered constraints/indexes directly into the existing `pgTable` callback preserves the table shape, but callback Halstead volume is574.48 (>400), so the three function warnings become one warning rather than zero. No assignment/edit; no-go for the phase quality gate.

W1 closure: current official complexity has zero warnings in W1 paths. The full Web integration after W1-10 completed82/88; all six failures are the two already identified W2 behaviors duplicated across two viewports. W1-specific BFF browser cases and unit routes passed, and paired Web reviews found no findings. W1 is marked completed in Plan; W2 remains gated on S2/C1.

D2-167 integrated sensors: paired static review accepted with no findings and Rules `No change`. Code, types, global unit, Server architecture and test integrity passed; complexity improved15→14 warnings with0 errors. Server coverage passed168 suites/325 tests at47.63% lines/statements,31.57% functions and88.97% branches. The existing ACH-35 ratchet remains below51.60%/47.11%/82.98%; no baseline change. Conformance remains incomplete with505 contracted paths and path-state mismatches. No runtime or remote DB operation.

D2-166 integrated sensors: paired static review accepted with no findings and Rules `No change`. Code, types, global unit, Server architecture and test integrity passed; complexity improved16→15 warnings with0 errors. Server coverage passed all168 suites/325 tests at47.64% lines/statements,31.58% functions and88.97% branches. The tracked ACH-35 ratchet remains below51.60%/47.11%/82.98%; no baseline change. Conformance remains incomplete at505 paths. No runtime or remote DB operation.

D2-165 integrated sensors: paired static review accepted with no findings; Rules `No change`. Global code/types/unit, Server architecture and integrity passed; complexity decreased17→16 warnings with0 errors. Server coverage passed168 suites/325 tests, reporting47.64% lines/statements,31.60% functions and88.97% branches. The tracked ACH-35 coverage ratchet remains below51.60%/47.11%/82.98%; no baseline change. Conformance remains incomplete with505 contracted paths and path-state mismatches. No runtime or remote DB operation.

D2-164 integrated sensors: paired static review accepted without findings; Rules `No change`. Global code/types/unit, Server architecture and integrity passed. Complexity reduced18→17 warnings with0 errors. Server coverage passed all168 suites/325 tests, reporting47.64% lines/statements,31.61% functions and88.97% branches. The existing ACH-35 coverage ratchet still fails against51.60%/47.11%/82.98%; no baseline was changed. Conformance remains incomplete at505 contracted paths and path-state mismatches. No runtime or remote DB operation.

D2-163 integrated sensors: paired static review accepted with no findings and Rules `No change`. Code, types, global unit, Server architecture and test-integrity checks passed; official complexity improved19→18 warnings with0 errors. Server coverage passed all168 suites/325 tests, reporting47.65% lines/statements,31.62% functions and88.97% branches. Its gate remains below the existing ACH-35 baselines (51.60%,47.11%,82.98% respectively); no baseline changed. Spec conformance remains incomplete with505 contracted paths and path-state mismatches. No runtime or remote DB operation.

D2-161 accepted checkpoint: review confirms the user listing keeps an empty array, applies optional orders in the existing lazy direction order, appends mandatory `createdAt DESC` last and returns the same array; no findings, Rules `No change`. Code, types, full global unit, Server architecture and integrity passed. Complexity improved21→20 warnings with0 errors. All168 Server coverage suites/325 tests passed; `check:coverage` still fails ACH-35 at47.65% lines/statements and31.65% functions versus51.60%/47.11%, while branches88.97% exceeds82.98%. No baseline change. Conformance remains incomplete.

ACH-34 D2 triage after D2-158: fresh CodeGraph confirms `findVoteByChallengeAndUser` authorizes before its callback, then runs one select/from/shared vote-filter/limit query and converts the optional row to the existing `'none'` default. A private inferred `voteQuery(challengeId,userId)` can isolate that exact query while the callback retains await and domain conversion. Formatter-faithful prototype: callback MI64.6→74.0, helper67.5, file warnings2→1, predicted root−1 from23, other scores unchanged. Assignment D2-159 is recorded in Plan; no source edit yet.

D2-150 checkpoint: paired Database Reviewer accepted statically, no findings. Reviewer confirmed the exact initial search read (including before legacy dispatch), author-name access behavior, current `!search` fallback and report-id→email OR order. Rules `No change`. Reviewer noted the Plan's wording implied a `legacy = false` default; source has required `legacy: boolean`. Plan wording was corrected to match the original signature; no code change.

W1-ACH34-07 checkpoint: paired Web Reviewer accepted statically, no findings. Reviewer confirms unchanged URL/init/body order, one `response.ok` read, same selected handler, same promise adoption, and lazy retry/refresh callbacks with dynamic `this`. Rules `No change`. Global sensors and post-edit Web integration are pending.

Integrated sensors after D2-150/W1-ACH34-07: global `check:code`, `check:types`, `test:unit` (Server168/325), test integrity, and Server architecture passed. Official `check:complexity` exits2 at34 warnings/0 errors (9,308 clean of9,342 functions across3,471 files), down36→34 with no added warning. Spec conformance remains exit1 on251 incomplete/downstream contracted paths and recognizes both assigned routes. Definition gates pass. Full Web integration after W1-07 is active; no further source mutation until it exits.

D2-151 checkpoint: CodeGraph confirms period selection/absence handling remain in `periodFilter` and only the ordered inclusive gte/lte construction moved to private `createdWithinPeriod`. Paired Database Reviewer accepted statically, no findings; Rules `No change`.

W1-ACH34-08 checkpoint: full Web integration after W1-ACH34-07 exited1 after7.8m with82/88 passed and exactly the six known W2 failures; no new W1 failure. After the run, only the assigned signup route changed. CodeGraph confirms URL→method→payload serialization→fresh headers→cache→signal→redirect. Paired Web Reviewer accepted statically, no findings; Rules `No change`. Focused Biome passed for both D2-151 and W1-08. Combined sensors and Web integration after W1-08 are pending.

C1 exporter preflight: `scripts/export-local-database-env.mjs` emits only a shell-quoted local `SUPABASE_DATABASE_URL`, derived from root `.env.local` password and Compose port (default 54322), with loopback host and `sslmode=disable`. Four synthetic node tests passed for custom/default port, URL encoding and sanitized validation failures; focused Biome passed. `npm run check:code`, `check:types` and `test:unit` passed after the addition (Web506, Server325, Core638, Studio64, LSP1; package counts from this run are recorded by the command output); no credential values were logged. `npm run db:test -w @stardust/server` passed using the exporter in the same shell.

D2-0002 default-privilege gate: a read-only comparison after local baseline adoption showed the migration ended with an empty global function-default ACL while the versioned `server-owned` manifest requires an explicit `EXECUTE` grant to owner `postgres`. The D2 fix adds that owner grant after revoking external principals; paired Database Reviewer accepted statically with no findings and Rules `No change`. Against a freshly reconstructed local clone, replayed the exact 24 legacy migration files from source commit `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, staged the frozen migration-history/ACL fixture, and inserted one synthetic `guides` row. Preflight legacy passed; `db:adopt` reported adopted; `db:migrate` reached server-owned parity; a second migrate was idempotent; `--rollback` returned to adopted parity; final preflight passed and the synthetic row's id/title/content were unchanged. This validates the local transition mechanics and one-row preservation, not a restored production backup, real legacy data distribution, remote parity, or EV-05. The earlier failed rehearsal was discarded by rebuilding the local Compose schema and ledger from scratch.

Residual ACH-34 audit remains open: no new safe reduction was found in the read-only `transitionReport` status-validation extraction (MI61.8→63.9; helper74.9; repository warnings2→2). Do not assign it. D2 retains 11 complexity warnings and W2 one; ACH-35 Server coverage ratchet and 505-path Spec conformance remain unresolved.

ACH-35 rerun after exporter and D2 migration fix: Server coverage completed with168 suites/325 tests passing,47.62% lines/statements,31.54% functions and88.97% branches. `check:coverage -- @stardust/server` still fails the unchanged baseline at51.60% lines/statements and47.11% functions; branches exceed82.98%. No threshold/baseline edit. The contracted combined `server` + `server-integration` capture remains pending S2 routes and C0 wiring; this server-only rerun is diagnostic, not the final ACH-35 gate.

ACH-34 rejected read-only prototype: binding the JSON key without an SQL cast fails against local PostgreSQL with SQLSTATE42P18 (indeterminate datatype), zero writes. Do not implement that variant.

Assignment D2-170 activated: Spec revision7, D2/Builder Database, RF-01/RF-02/RF-03/RF-10, CA-04/CA-05/CA-20; only `apps/server/src/database/drizzle/repositories/profile/DrizzleUsersRepository.ts`. The proposed typed relationship metadata registry uses explicit `::text` for bound JSON keys. Read-only evidence: virtual TypeScript overlay0 diagnostics, generated SQL7 assertions, and local PostgreSQL18 read-only comparisons across nine descriptors and nullable/non-null values all passed; projection shapes and JSON types matched the literal-key expression. Formatter-faithful prototype predicts this repository drops6→1 warnings and root drops12→7. Metadata import timing and trusted-literal→typed-parameter SQL change remain explicit review points; S2 runtime projection coverage is still required. Assignment is recorded in Plan; definition gates and Builder ACK are required before source mutation. No source or database writes occurred during the prototype.

D2-170 source/review checkpoint: Builder ACK followed passing Spec/Plan definition gates. Only `DrizzleUsersRepository.ts` changed; nine descriptors, all five selection composers/order, completion and insignia expressions remain within assignment. Biome format/check and focused `npx tsc --noEmit -p apps/server/tsconfig.json` passed. Independent Database Reviewer accepted statically with no findings; all descriptor mappings, fresh SQL construction, JSON `::text` behavior and module-private import-time metadata were reviewed; Rules `No change`. Reviewer did not independently run PostgreSQL; the reported18 read-only comparisons remain supporting Builder evidence. Official `npm run check:complexity` confirms warnings12→7, zero errors: six D2 (feedback-report-model3, feedback-reports repository2, user orderingCriteria1) and one W2. Global check:code, Server architecture (863 modules/1,636 dependencies) and test integrity passed; check:types and test:unit are still running. Coverage, conformance, D2 runtime projection validation and consolidated D2 exit remain pending. No threshold/baseline, database ledger, remote project or credentials changed.

D2-170 integrated sensors: global check:types and test:unit passed (Server168/325, Core176/638, Web118/506, Studio14/64, LSP1/1); `check:code`, Server architecture and test-integrity passed. Server coverage passed all168 suites/325 tests at47.79% lines/statements,31.93% functions and89.06% branches; `check:coverage -- @stardust/server` failed unchanged ACH-35 baselines51.60%/47.11%/82.98% (branches remain above baseline). No baseline change. Spec and Plan definitions pass. `check:spec-implementation` still fails with249 contracted-path errors: 122 Remove paths remain,98 Modify paths unchanged,25 Create paths missing and4 environment-path state errors; these include downstream phases and are not resolved by D2-170. D2 runtime projection validation through S2 and consolidated exits remain pending.

Assignment D2-171 proposed after a fresh read-only ACH-34 prototype: nine constructors, one per named feedback-report constraint/index, preserve the exact extra-config order. Formatter-faithful full-file metric reports0 warnings in the model (3→0), no added helper warnings, and projected global7→4. This is a new hypothesis requiring Principal/Reviewer confirmation of cohesive schema-object boundaries and focused schema/catalog-generation parity; no source mutation has started. Definition gates and Builder ACK are required.

D2-171 source/review checkpoint: Builder ACK followed passing definition gates. Only `feedback-report-model.ts` changed; Biome format/check and focused Server TypeScript passed. Paired Database Reviewer accepted statically with no findings; the nine private constructors each own one complete named schema object, and the ordered primary key/checks/FK/indexes preserve the model contract; Rules `No change`. An independent before/after `getTableConfig`/`PgDialect` JSON capture compares byte-identically (`cmp` exit0). Official global complexity confirms the model warnings3→0 and root warnings7→4, with0 errors; remaining functions are UsersRepository `orderingCriteria`, FeedbackReportsRepository `transitionReport` and `authorPage`, plus W2 `useRestContextProvider`. Global code/types/unit, Server architecture/integrity and Server coverage after this source change are pending; no DB/runtime/remote operation or threshold/baseline edit.

D2-171 integrated sensors: global check:code/check:types/test:unit, Server architecture (863 modules/1,636 dependencies) and test-integrity passed. Server coverage passed all168 suites/325 tests at47.80% lines/statements,31.85% functions and89.06% branches; `check:coverage -- @stardust/server` fails unchanged thresholds51.60%/47.11%/82.98%, with branches above baseline. `check:spec-implementation` remains failed at249 errors with no change in error counts:122 Remove paths remain,98 Modify paths unchanged,25 Create paths missing and4 environment state errors. No thresholds/baselines changed. D2 has three complexity warnings open, S2 projection behavior still requires route-level validation, and conformance remains incomplete.

Assignment D2-172 proposed after read-only prototype: replace `orderingCriteria` with scalar-performance and relation-count tuple groups, using `satisfies` to preserve checked tuple types without assertions/casts. Prototype preserves counts-first allocation and all five field reads before the existing append loop; type diagnostics0; function MI62.8→68.1, file warnings1→0, projected global4→3. No source change yet; definition gates and Builder ACK are required.

D2-172 source/review checkpoint: Builder ACK followed passing Spec/Plan gates. Only `DrizzleUsersRepository.ts` changed. Biome format/check and focused Server TypeScript passed; paired Database Reviewer accepted statically, no findings, Rules `No change`. `progressCountColumns()` stays first; criteria are built in level→weekly XP→unlocked stars→unlocked achievements→completed challenges order before the unchanged append loop. `satisfies` enforces actual `[ListingOrder, SQLWrapper]` tuples with no casts/assertions/`any`; ASC-before-DESC and trailing mandatory `createdAt DESC` remain. Official complexity confirms file warning1→0 and root4→3. The remaining warnings are `transitionReport`, `authorPage`, and W2 `useRestContextProvider`; no errors. After this edit global check:code, check:types, test:unit, Server architecture and test integrity all passed. `check:spec-implementation` remains failed at249 errors. Server coverage after D2-172 remains pending; no database/runtime/remote or baseline change.

Assignment D2-173 proposed from a new read-only prototype: replace the inline report-id lock filter in `transitionReport` with private non-async inferred `lockReportById(transaction, report)`, preserving the caller's existing `await` and returning the same `lockReport(transaction, eq(feedbackReportModel.id, report.id.value))` Promise. Prototype moves `transitionReport` MI61.8→66, helper MI77.6, repository warnings2→1; virtual full Server TypeScript diagnostics0. This removes one of the two final D2 warnings with no new async boundary or query change. Source remains unchanged pending definition gates and Builder ACK.

D2-173 source/review checkpoint: Builder ACK followed passing definition gates. Only `DrizzleFeedbackReportsRepository.ts` changed; focused Biome and Server TypeScript passed. Paired Database Reviewer accepted statically, no findings; the private helper returns the exact prior lock Promise without `async`, and caller `await`/transaction/status-check/update/result order remain unchanged; Rules `No change`. Official global complexity confirms repository warnings2→1 and root3→2, with0 errors. The remaining warnings are `authorPage` (D2) and `useRestContextProvider` (W2). After D2-173, global check:code/types/unit, Server architecture and test-integrity passed. Server coverage passed168 suites/325 tests at47.79% lines/statements,31.81% functions and89.06% branches; check:coverage fails unchanged baselines51.60%/47.11%/82.98%. `check:spec-implementation` remains failed with249 path errors. No DB/runtime/remote or threshold/baseline change.

Assignment D2-174 proposed from the combined scalar-argument + page-result read-only prototype. It clears the last D2 warning: `authorPage` MI63.2→67.6, inferred `authorPageResult`71.5, repository warnings1→0, predicted global2→1. The same Promise.all queries/concurrency, mapping and count fallback remain. Its only evaluation-boundary shift moves filter/page scalar evaluation into the existing `executeQuery` callback; because `executeQuery` catches both synchronous throws and rejections and translates them identically, the public error boundary remains. Require reviewer confirmation. No source changes yet; definition gates and Builder ACK are required.

Script CI sensor: `npm run test:scripts` passed50/50 tests, including real CLI validation for empty migrate, adoption, drift rejection, rollback/default restoration, concurrent transition serialization, and argument validation. This is local script/test evidence, not restored production backup or remote EV-05. No remote project change.

D2-174 source/review checkpoint: paired Database Reviewer accepted the integrated diff with no findings and Rules `No change`. `listByAuthor` still authorizes first; its filter, page and capped-limit evaluation now occurs inside the existing `executeQuery` callback, whose `try/await/catch` maps synchronous throws and rejected query Promises through the same handler. Both Promise.all queries retain their order/concurrency, and mapping remains before the count fallback. Focused Biome and Server TypeScript passed. Official global complexity is1 warning/0 errors; the only warning is W2 `useRestContextProvider`, so D2 has no complexity warning.

D2 integrated exit after D2-174: global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and `npm run check:architecture -w @stardust/server` passed; unit counts were Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64 and LSP1/1. `npm run test:coverage -w @stardust/server` passed168/168 suites and325/325 tests at47.78% lines/statements,31.80% functions and89.06% branches. `npm run check:coverage -- @stardust/server` fails the unchanged ACH-35 baseline (51.60% lines/statements,47.11% functions,82.98% branches); combined Server plus server-integration is the contracted C2 measurement after S2, with no baseline change authorized. `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md` remains failed with249 contracted-path errors (122 Remove remain,98 Modify unchanged,25 Create missing,4 environment-path state errors), all from incomplete/downstream scope. `check:spec-definition` and `check:plan-definition` passed before starting C1.

Local stack checkpoint during handoff to C1: root-env exporter loaded without logging credentials; `npm run db:test -w @stardust/server` passed. The current reset runner has no mounted legacy migration files because D2 already removed them, so a subsequent empty-database `db:migrate` correctly failed closed and `db:preflight --phase legacy` reported catalog/ledger mismatch. This is the known C1 reset/bootstrap gap, not evidence against the isolated transition rehearsal above; no remote database was accessed. C1 is now `in_progress`; D2's local exit is complete while S2 runtime EV-01/EV-02 and HTTP EV-04, combined ACH-35, and global conformance remain open in their owning phases.

Spec amendment/review checkpoint, revision8: inspection confirmed both `.env.testing` paths are absent from commit-base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, ignored by `.gitignore`, and generated locally/by CI; they were incorrectly listed as `Modify`. Removed those two non-versioned paths from the canonical map and clarified that CI-generated files use synthetic values only. No behavior, acceptance criteria, security requirement or other path changed. `check:spec-definition` and `check:plan-definition` passed; the sole read-only Spec Reviewer returned `clear` with no Architecture/Rules finding. Revision8 is current for resumed implementation.

### C1 integrated checkpoint — 2026-10-03

C1 now passes its local exits. `npm run db:test -w @stardust/server` completed exporter → Compose stack → guarded local reset → empty Drizzle migration. `npm run db:preflight -w @stardust/server -- --phase server-owned` returned `{"compatible":true,"differences":[]}`. The first positive reset exposed a Supabase `roles.sql` default function ACL that made the empty application fail closed; the local reset now removes only that explicit owner default grant, and the repeated full `db:test` passed. No remote database was used.

The negative shell control verified a failed exporter assignment stops before the Compose/reset suffix. `npm run test:scripts` passed 50/50 on isolated rerun; the first run under parallel CPU load had one cancelled subtest and zero failures, so it was discarded as evidence. Global `npm run check:code`, `npm run check:types`, `npm run test:unit`, `npm run check:test-integrity`, and `npm run check:architecture -w @stardust/server` passed. Unit counts: Server168 suites/325 tests, Core176/638, Web118/506, Studio14/64, LSP1/1. All three changed workflow YAML documents parsed with unique keys; `git diff --check`, `check:spec-definition` and `check:plan-definition` passed. `npm run check:complexity` remains exit2 with the existing single W2 warning in `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`, zero errors; no code in that warning's scope changed during C1.

Paired integrated Implementation Reviewer accepted C1 against Spec revision8 with no findings after resolving IR-C1-01 (exporter failure masking), IR-C1-02 (synthetic CI secret), IR-C1-03 (shared lock released before verified cutover completion), and IR-C1-04 (normal push could advance `adopted`). The corrected workflows validate deployment UUID, terminal status, exact commit SHA and configured 2xx health; explicit cutover/rollback retain the workflow-level exclusion through protected operator signoff. `PRODUCTION_RELEASES_PAUSED` fails normal Server/Web releases closed during a maintenance or recovery window. Runbook covers pause, queued workflow cancellation, manual verification, reopening, approval and rollback sequencing. Rules disposition: `No change`; fail-closed and lock requirements were already explicit.

Freshness boundary: static workflow validation is local only; the GitHub `production` Environment required-reviewer configuration, its secrets/variables, actual Coolify status/health polling, real Dev/Prod parity and EV-05 production cutover remain unverified and pending. No environment setting, remote database, Coolify deployment, commit, or PR was changed or created.

### S2 assignment — Builder Server

S2 is activated against Spec revision8 and base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, after D2, S1, and C1 completed their local gates. Stable ownership remains Builder Server, with the 102 exact paths enumerated under S2 in `plan.md`; no paths outside that assignment are authorized. Contract: server-side Drizzle repositories, REST/MCP/jobs/fixtures, onboarding receipt and profile SSE integration, auth/tenant isolation and side-effect parity. RF/CA and the ten-path Rule Pack are listed on the S2 Plan card; SHI n/a and no visual contract. EV-01/EV-02/EV-06, controller EV-07, route-level tests, REST client examples, local Supabase integration, and paired Server review are required exits. The latest pre-sensor `check:spec-implementation` still fails on the broad unfinished Spec map (503 paths; this includes pending S2/W2/D3 paths and the remaining legacy schema removal); this is the expected baseline for the next phase, not passed conformance evidence. No S2 source path was changed by the task principal during activation.

S2 batch 1 review checkpoint: only `HonoApp.ts`, `HonoHttp.ts` and `AuthMiddleware.ts` changed. The paired Server Implementation Reviewer accepted the current diff with no findings for continued phase work; `jwtDecode` no longer grants identity, optional bearer context requires verified `getUser()`, API key identity follows validated hash lookup, God actor remains behind its allowlist controller, and database access fallback remains `public`. Response-header review found no eligibility/receipt leakage or loss of ordinary headers. This is a scoped structural ACK only; changed paths have no fresh runtime/sensor evidence, and any later edits to them invalidate this review.

Finding IR-S2-02-01, Builder Server mutation02: the first failed review found 18 constructors in `ChallengeSourcesRouter.ts`, `AchievementsRouter.ts`, and `PlanetsRouter.ts` passing the Supabase client to Drizzle repositories and omitting `DatabaseAccess`, breaking Drizzle composition and actor-based access enforcement. The first correction fixed all 18 constructors; a follow-up review found 11 now-unused local Supabase declarations in those files. The same Builder removed those declarations, and the final paired review accepted the correction. Rules disposition `No change`: explicit Drizzle database/access construction is already required by current Rules/Contract. The other reviewed router substitutions preserve route/validator/controller/middleware ordering; AuthRouter and FeedbackRouter remain unchanged as assigned.

IR-S2-02-01 resolution: after the 11-declaration cleanup, the same paired Server Reviewer accepted the corrected batch. Inspection confirmed all 18 formerly incorrect constructors now use Drizzle plus `DatabaseAccess`, none of the three routers retains a Supabase reference, and the current reviewed batch has 28 constructors using the required arguments. Routes, validators, authorization, controllers, brokers, and middleware order remain preserved. The acceptance is limited to this batch; focused types/tests, local integration/runtime evidence, and the full S2 exit are still pending.

S2 batch 3 queue-composition checkpoint: the Builder changed `HonoApp.ts`, the seven persistent Inngest function families, `createMarkTextBlockAudioAsErrorOnFailure.ts`, and `StorageFunctions.ts`. Paired Server Reviewer accepted the diff with no findings: one Drizzle instance is passed to persistent families; each migrated repository/job uses explicit `{ kind: 'system' }`; Analytics/Notification/Manual stay without database access, Manual returns no functions, and non-persistent Storage helpers only lose unused DB parameters while storage providers remain. Event keys, triggers, payload schemas, ordering, steps, retries, concurrency, cancellation and failure callbacks remain preserved. Review is structural for this batch only; queue integration tests and local behavior remain pending.

S2 batch 4 queue-fixture checkpoint: `InngestFunctionsAssembly.test.ts` now accepts `DrizzleDatabase` for persistent families while Manual remains no-argument; `StorageFunctions.test.ts` mock follows the Drizzle repository import/class. The paired Server Reviewer accepted the diff, confirming existing assembly/backup/audio behavior assertions remain and no dedicated repository/provider tests were added. Test execution and `check:test-integrity` remain pending, so this is not runtime evidence.

S2 batch 5 onboarding/receipt checkpoint: the paired Server Reviewer accepted the current diff with no findings. ENV requires a 32-byte minimum secret; receipts use HMAC-SHA256, cryptographic nonce, timing-safe signature comparison, strict claims and a 900-second validity period. Auth eligibility requires matching id/email/identity/nonce, is consumed before transport, and only validated signup success publishes the event and returns receipt expiry. The Server service keeps Supabase SDK usage within Auth and Core ports remain intact. Reviewer noted an existing helper logs raw Auth SDK `error.message`; public responses remain sanitized and this diff adds no nonce/receipt/metadata logs. No Rule change was requested. Local test environment currently lacks `ONBOARDING_RECEIPT_SECRET`; CI now generates a deterministic synthetic test-only value, and local runtime validation remains pending until its test-only environment is prepared without changing root `.env.local`.

S2 batch 6 controller checkpoint: the paired Server Reviewer accepted the signup-controller tests and new onboarding-attempt controller/test. Behavioral tests preserve signup response body/status, assert event/receipt only for validated eligibility, remove the internal eligibility header, and avoid body reads/issuance on failed signup. The attempt controller checks expiry before querying, reads only the matching account, rejects mismatched results, and returns only signed identity/expiry data plus profile readiness; tests cover missing/persisted profile and no-query expiration. Reviewer confirms receipt verification/invalid-identity-before-query are owned by the route/controller-composition boundary, while this controller receives an already verified attempt; route proof is still pending. No provider unit tests were added; local integration remains pending.

Finding IR-S2-09-01/02/03, onboarding SSE route: failed review found (01) `streamSSE` overwrites a pre-set `Cache-Control`, violating `no-store,no-transform`; (02) expiry waits on terminal `writeSSE` before canceling heartbeat/closing, so backpressure can exceed the deadline; (03) abort/shutdown leaves listeners and stream resources until an in-flight `findById` settles. The Reviewer confirmed receipt-before-query auth, bearer rejection/no fallback, verified actor, account rate limit, no overlapping polling, four-field terminal payload and sanitized database error. Rules disposition `No change`: S4/CA-18 already require these headers, duration bounds and cleanup. Correction assigned to the same Builder: use the canonical `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` path, set headers on the final Response, make expiry/abort/shutdown cleanup immediate and idempotent even with a pending query or blocked write, suppress later frames, and validate response/backpressure/query-pending boundaries at route level. Work remains held until paired review accepts.

IR-S2-09 resolution: the final paired review accepted the canonical stream source and contracted `StreamProfileCreationRoute.test.ts` diff with no findings. The first focused run exposed that Hono's prepared context headers overrode the direct `Response.headers` update; the builder now updates both after `streamSSE`. Idempotent stop removes timers/listeners immediately, abort/shutdown closes the stream independent of pending query completion, expiry stops polling before the terminal frame and has a 100ms forced-close bound, and the stopped guard prevents later frames. The route-level test uses a PostgreSQL lock to verify lock-wait evidence, early reader closure, listeners, final headers, and no late frames without repository mocks or secret output. After the paired review accepted this correction, `npm run test:integration -w @stardust/server -- --runTestsByPath src/tests/routes/profile/StreamProfileCreationRoute.test.ts --runInBand` passed: 1 suite, 4 tests, including final cache headers, expiry during backpressure, abort during a pending query, and shutdown during a pending query; it exited without an open-handles warning. IR-S2-09-01/02/03 are resolved. S2 integrated tests and phase exits remain pending.

Finding IR-S2-13-01, MCP toolkit consumer boundary: the paired read-only review accepted verified `authInfo` as the MCP HTTP identity source, with unchanged public IDs/schemas and no payload-derived actor or system fallback. It found the same tools are invoked by `MastraCreateChallengeWorkflow` steps, whose workflow input has no MCP `authInfo`; requiring `mcp.getAccountId()` there would fail challenge creation before source lookup and also affects the post-challenge tool. Follow-up CodeGraph evidence confirms the workflow is an argument-free cron automation, while `PostChallengeTool` persists an `author.id` and publishes `ChallengePostedEvent`; `DatabaseAccess { kind: 'system' }` supplies database authorization but does not determine that domain author. Rules disposition `No change`: identity and job composition already require explicit trusted actors. The Spec/Plan cannot safely assign a dedicated automation account, a particular God account, or remove cron behavior without a product decision. The task principal asked the user to choose the authoring behavior; no implementation or contract amendment has been made. Mutation13 and only its dependent job-author correction remain blocked pending that answer, then require revised path contract, paired review, and runtime evidence.

S2 batch 14 fixture checkpoint: paired Server Reviewer accepted `apps/server/src/tests/fixtures/SupabaseFixture.ts` with no findings. The fixture retains Supabase Auth, exposes the singleton Drizzle database, limits relational cleanup to six allowlisted tables using identifier quoting, preserves synchronous `deleteInsigniaByRole` callers with shell-free `psql` literal binding, and adds parameterized transactional Auth metadata updates limited to Google/GitHub identities. Production is explicitly rejected; local-only endpoint validation remains in place. Runtime/schema compatibility and caller integration tests remain pending.

S2 batch 15 fixture checkpoint: paired Server Reviewer accepted the Shop, Space, and Challenging fixture migration with no findings. Public fixture constructors/method signatures and caller behavior are preserved; writes use Drizzle with bound values/transactions, and reviewed projections/defaults retain their prior fixture shapes, including avatar `isPurchasable` omission, rocket `true`, Space return/cleanup ordering, Challenge authorship and JSON solution/playback fields. Type and local database caller validation remain pending.

S2 batch 16 fixture checkpoint: paired Server Reviewer accepted `ProfileFixture.ts` with no findings. Its public constructor/method signatures remain stable; account setup writes avatar/rocket/tier/user in one parameterized Drizzle transaction; repository helpers use explicit system fixture access; coin projection/null guard and rescuable achievement filters/legacy `{ achievement_id }` result are preserved. Type and local caller integration evidence remain pending.

S2 batch 17 tenant-isolation checkpoint: paired Server Reviewer accepted `FetchUserByIdRoute.test.ts`. Fixture setup and profile lookup use Drizzle with system access only inside test composition; the HTTP request still crosses real Supabase Auth and Hono with account A's credential. The new persisted account A→B case asserts 404 with an empty God allowlist, while own-profile 200 retains full id/name/slug/email/avatar/rocket/tier shape and existing 401/404 cases. Focused local integration execution is pending.

S2 tenant-isolation runtime: the exact focused route suite initially passed all 4 scenarios (unauthenticated 401, absent self 404, A→B 404, own profile) in 9.288s, but Jest emitted an open-handle warning from the singleton Drizzle pool. The paired Reviewer accepted a test-only `afterAll` awaiting `DrizzleClient.close()`. After a fresh `npm run db:test -w @stardust/server` exit0, the same exact focused suite exited0 with 1 suite/4 tests passed in 9.236s and no open-handle warning. Jest displayed a negative per-test elapsed duration for the cross-account case despite passing assertions. The paired Reviewer inspected the test and cleanup and classified this as a non-blocking runner timing artifact: the case uses real HTTP waits, no fake timers, and no duration assertion. Its exact cause is unproven without captured instrumentation; do not treat that number as performance evidence. This does not invalidate the 4/4 behavioral result.

S2 batch 19 Forum fixture checkpoint: paired Server Reviewer accepted `ForumFixture.ts` with no findings. Challenge/solution/comment/reply/relation writes use Drizzle and bound values; reads preserve the `comments_view` projection, counts, author/avatar snapshot, parent filters, relation `EXISTS`, descending timestamp order, constructor and DTO/snapshot contracts. Focused real comment-route callers and local view compatibility remain pending.

Finding D2-175 / S2 Forum integration: after fresh `npm run db:test -w @stardust/server` passed, the exact eight real comment-route suites exited1: 5 suites passed/3 failed, 21/25 tests passed. Four anonymous GET assertions failed with 401 instead of expected 200/404: missing/existing replies and challenge/solution comment lists. Create/edit/reply/delete route cases passed, confirming fixture writes/readbacks for those callers. CodeGraph tracing identified the cause as `DrizzleCommentsRepository.authorize()` rejecting public database access on reads even though `CommentsRouter` preserves the existing unauthenticated GET contract. The Database-owned repository path is already in D2's Spec map; D2 was reopened as assignment D2-175, restricted to that path and the current read/write boundary. Required correction preserves public reads, existing write authorization, and forbids route auth changes or system fallback. Forum route evidence is failed/stale until D2-175 is reviewed and all eight suites pass. Rules disposition: `No change`; public route contracts and explicit per-operation authorization already govern this boundary.

D2-175 source/review checkpoint: Builder Database removed only the three read-side `authorize()` calls from `DrizzleCommentsRepository.ts`; queries, projections, joins, counts, ordering, pagination and null behavior remain unchanged. All create/replace/delete authorization guards and user/God/system behavior remain intact. Focused Biome format/check passed; final paired Database Reviewer accepted with no findings. Runtime evidence is pending a fresh local reset and all eight Forum route suites.

D2-175 runtime resolution: the first post-fix attempt overlapped a second `db:test` reset and then failed fixture setup with missing `public.users`; those results are discarded as contaminated. With all concurrent resets stopped, a fresh `npm run db:test -w @stardust/server` passed, then the exact eight Forum route suites were run sequentially via `--runTestsByPath ... --runInBand`: exit0, 8/8 suites, 25/25 tests in 35.732s. All anonymous reads, authenticated writes, 401 and 404 scenarios passed. `check:spec-implementation --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains exit1 for many other unfinished/mismatched paths across S2/W2/D3/C1; it reports no D2-175 mismatch. `check:plan-definition` passes. Global code/types/unit and D2 architecture/integrity/coverage sensors remain scheduled with the final S2 integrated pass.

S2 batch 22 reporting-route contract checkpoint: paired Server Reviewer accepted four new suites for list, unread-count, fetch, and mark-read routes. They use real Hono/Auth, Drizzle seed/readback and singleton cleanup. Assertions cover A/B filtering and totals, non-duplicated count with messages, equal 404 for missing/foreign reports, read-denial with unchanged marker, and own-report 204 with exact persisted timestamp. This acceptance is limited to the four new suites; useful scenarios in the previous multi-route suite remain to be ported, and local execution/sensors are pending.

S2 batch 23 reporting-test correction: the builder reconciled the four new suites and `ReportingFixture.ts` with Server Rules by reusing existing `createReportForAuthor`/`createAdministrativeReply` fixture helpers and replacing literal HTTP status values with `HTTP_STATUS_CODE`; unused imports were removed. The paired Server Reviewer accepted the updated five-file diff with no findings and confirmed authorization/filter/count/safe404/readback assertions remain. This replaces mutation22's now-stale review; all five paths require fresh local runtime evidence.

Finding D2-176 / S2 reporting mark-read integration: while mapping the prior God/read scenarios, CodeGraph identified a contract mismatch: the existing HTTP body `{ feedbackReportId, lastSeenUserMessageId }` reaches the legacy branch of `MarkAsReadFeedbackReportUseCase`, while the Drizzle repository now destructures `{ feedbackReportId, participant, lastSeenMessageAt, authorId }`. That branch can pass undefined values and fail mark-read. The HTTP contract must remain unchanged. This is a Database-owned repository integration correction; no code change is authorized until the Database owner confirms prior semantics, exact affected paths, and a minimal compatibility approach. Mark-read route runtime evidence is pending/stale until D2-176 is reviewed and validated; other reporting route scenarios continue independently.

S2 batch 24 reporting God-route checkpoint: three new contracted route suites were accepted after final paired Server review. `ReportingFixture.ts` adds `createUserReply` with parameterized matching `created_at`/`last_user_message_at`; list/detail/mark-read suites exercise real Auth/Hono with an empty God allowlist for account-user denials and a God account for authorized reads. Persistence, conversation read marker, denied no-write, and HTTP 204/no-body assertions remain. The mark-read success case exposes D2-176 and is not runtime-accepted yet. Older `UserFeedbackHistoryRoutes.test.ts` remains untouched; the four scoped route suites still need full scenarios and execution.

D2-176 source/review checkpoint: the Drizzle reports repository now supports both its participant-aware input and the legacy `Id` + `Date|null` input. The legacy branch requires the God/admin guard and directly assigns `studioReadAt = timestamp ?? null` by report id through the injected transaction connection/`executeQuery`, matching Supabase/Postgres behavior; the modern author branch and monotonic update are unchanged. Focused Biome passed and final paired Database Reviewer accepted with no findings. Fresh HTTP validation remains pending.

S2 reporting runtime checkpoint: after a fresh `db:test`, six real reporting suites exited1 (5/6 suites and 11/12 tests passed). List, count, fetch, foreign-report safe404/no-write, and God list/detail passed. The own-author mark-read route expected204 but returned500 in `DrizzleFeedbackReportsRepository.markAuthorAsRead`; the captured log contains only the sanitized `DrizzleDatabaseError` and stack, no underlying PostgreSQL cause. This exercises the modern author path, separate from the D2-176 legacy God branch; do not infer D2-176 caused it. Route integration evidence remains failed until the Database owner traces the SQL/transaction cause and the same real path passes.

Finding D2-177 / S2 author mark-read SQL binding: follow-up CodeGraph analysis and a local read-only PostgreSQL probe identified the cause before mutation: raw `sql` interpolation of JavaScript `Date` values throws `TypeError/ERR_INVALID_ARG_TYPE` in the postgres driver; an equivalent ISO string is accepted. The fixture seed uses typed Drizzle columns, so it did not expose raw interpolation. The paired pre-review found the initial Plan wording misidentified the third source position: the three modern raw SQL timestamps are `authorReadFilter`, the `greatest` in `markAuthorReadQuery`, and the `greatest` in `markStudioReadQuery` (`markAuthorAsRead` has no interpolation). Plan D2-177 was corrected to name those exact positions and include modern Studio. The proposed conversion preserves filters, casts, monotonicity, ownership, transactions and D2-176's already reviewed legacy typed-column branch. No code changed; the pre-review must reconfirm the corrected assignment before mutation.

D2-177 source/review checkpoint: after corrected pre-mutation approval, the Builder changed only the three authorized `Date.toISOString()` raw SQL positions; Biome passed and the paired Database Reviewer accepted the source. In the focused real route rerun, the modern author mark-read suite passed, as did the legacy God-authorized update. The God non-admin denial returned401, but its no-write check failed because the fixture reader returned `studioReadAt: undefined` while the test asserted `null`. This is an assertion/fixture-shape mismatch; the read marker was not observed to change. Builder Server is correcting the assertion to compare persisted pre/post state while preserving the no-write guarantee. Full route evidence remains pending that corrected test and sequential full suite.

Reporting runtime resolution: after paired review accepted the pre/post state assertion correction, a single serialized validation run executed fresh `db:test` followed by all seven exact Reporting HTTP route suites with `--runTestsByPath ... --runInBand --silent`. Both commands exited0. Results: 7/7 suites and 14/14 tests passed in 30.851s, with no open-handle warning. The modern author route persisted the exact user-message timestamp and returned204; the legacy God/admin route persisted its validated timestamp; non-God denial preserved the report and marker. User/God list, unread count, detail, fetch, and safe404/isolation checks also passed. This supersedes the earlier 6-suite failure and null-vs-undefined assertion failure. D2-176 and D2-177 route runtime criteria are met; integrated D2/S2 global sensors remain pending.

Fresh conformance checkpoint after D2-176/177 and reporting test additions: `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` exits1 with 503 contracted paths and 16 unrelated changed paths ignored. The D2 report repository and new reviewed reporting route tests have no conformance mismatch; outstanding errors are the expected unfinished/mismatched S2/W2/D3/C1 paths (legacy removes still present, pending creates, and baseline-unchanged modifies). `check:spec-definition` and `check:plan-definition` pass.

S2 batch 26 profile-route checkpoint: paired Server Reviewer accepted four suites for fetch by slug, list, update, and created-users KPI. Existing HTTP/Auth coverage remains; fixture seed/readback now uses Drizzle with system access only in fixture composition, and teardown closes the singleton. The update A→B denied-write case asserts404 and compares the full persisted DTO before/after. Local execution and affected sensors remain pending.

S2 profile-route runtime: after a fresh `npm run db:test -w @stardust/server` exit0, the four exact `--runTestsByPath` suites passed: 4/4 suites, 13/13 tests in 21.494s, no open-handle warning. This includes real Auth/Hono route execution and the A→B denied update with unchanged persisted DTO. Evidence is local and applies only to these four paths.

S2 batch 27 user/achievement route checkpoint: paired Server Reviewer accepted four suites for email/name availability, unlocked achievements, and rescue. Test setup/readback uses Drizzle with fixture-only system access; HTTP Auth/protected routes remain real. A→B rescue denies with404 and proves account B's coins and reward relation remain unchanged. Fresh local route execution and sensors remain pending.

S2 batch 27 runtime: after a fresh `npm run db:test -w @stardust/server` exit0, the four exact route suites exited1: achievements passed (2 suites/12 tests), while email/name availability failed (2 suites/4 tests) because all expected public 200/409 responses were401. The paired reviewer accepted these tests structurally, but runtime is authoritative. Root cause is under CodeGraph investigation; no correction has been made. Route composition, Auth precondition, and prior behavior must be traced before retry.

Finding D2-178 / S2 public availability queries: CodeGraph confirms email/name availability routes intentionally have no authentication middleware, callers send no auth headers, and the controllers expose only availability outcomes. The use cases call `findByEmail/findByName`; Drizzle delegates both to `findOne`, whose generic private-read guard rejects `public`, unlike the former adapter. The Spec S3 explicitly permits public availability checks. Required correction is limited to those two repository operations, keeping `findById`, slug and general reads private and exposing no user DTO. No source edits yet; Plan D2-178 is active pending pre-mutation Database review.

D2-178 source/runtime resolution: after paired pre-mutation approval, the Database Builder changed only `findByName`/`findByEmail` to use the same `findOneResult` query/projection/mapper without the generic private-read guard. `findById`, slug/general reads and every write/ownership guard remain protected; no system fallback. Focused Biome passed and final paired Database review accepted with no findings. After fresh `db:test`, the two anonymous availability and two protected achievement suites passed: 4/4 suites, 16/16 tests in 21.836s. This includes available200/in-use409 results, A→B rescue denial and no reward/coin mutation. D2-178 runtime exits are complete; broader integrated sensors remain pending.

Fresh conformance rerun after D2-178 and the challenge-execution test addition remains exit1 on the same broad unfinished/mismatched contract state: `check:spec-implementation` reports 503 paths with remaining expected S2/W2/D3/C1 creates/removes/baseline-unchanged modifies. No mismatch is reported for the corrected D2 paths or the reviewed profile/challenge route tests. `check:plan-definition` and `check:spec-definition` pass.

S2 batch 28 challenge-execution route checkpoint: paired Server Reviewer accepted the shared `ChallengingFixture.ts` and Count/List/Run route suites. Seed/readback uses bound Drizzle values; list filters both account and challenge, uses account A/B real rows, and asserts only A's same-challenge row with total2. Count keeps penalizable/internal error distinction, POST retains persisted-execution proof, and real Auth/Hono plus pool teardown remain. Local execution and sensors are pending.

S2 challenge-execution runtime: after fresh `db:test`, the three exact real route suites passed 3/3 suites and 8/8 tests in 16.269s, with no open-handle warning. This validates account/challenge filtering, counts, and persisted execution for this batch only.

S2 batch 29 Space fixture/GET checkpoint: paired Server Reviewer accepted the three planet test files' Drizzle fixture seed/cleanup and new authenticated GET of a persisted planet/star. Existing anonymous/invalid-write tests remain; valid-write behavior is explicitly outside this review pending the D2 authorization parity investigation. Local execution is pending.

S2 Space fixture/GET runtime: after fresh `db:test`, the three exact `CreatePlanet`, `CreatePlanetStar`, and `FetchAllPlanets` route suites passed, 3/3 suites and 6/6 tests in 12.99s. This validates cleanup and authenticated GET of persisted planet/star, plus existing anonymous/invalid-write scenarios; it does not yet validate a permitted authenticated write.

Finding D2-179 / S2 Space write parity: CodeGraph and the legacy manifest/catalog show Planet create/update/delete/reorder and Star-name editing require verified authentication; Star availability/type routes retain their existing God gate. Hono uses the publishable key plus caller Bearer token. Legacy `planets`/`stars` had RLS disabled and `authenticated` CRUD grants, with no user ownership columns in schema/models/Core ports. Original Drizzle `authorizeWrite` accepted only God/system, breaking authenticated-user writes. Evidence supports shared catalog writes for authenticated users on auth-gated routes; preserve God route gates already present. Plan D2-179 assigns only the two Drizzle repositories to permit verified-user writes while retaining public rejection. Pre-review accepted this behavior and clarified the route-gate boundary; Plan wording preserves existing Star availability/type God gates. Authenticated happy-path planet create and Star-name edit HTTP tests remain required.

S2 batch 20 Reporting fixture checkpoint: paired Server Reviewer accepted `ReportingFixture.ts` with no findings. Public SupabaseClient constructor remains compatible; reports/messages use Drizzle with explicit fixture-only system access, DTO/entity behavior is preserved, report cleanup leaves database FK cascades intact, and the fixture no longer starts a Supabase proxy or uses Data API persistence. Real reporting-route validation remains pending after the FeedbackRouter transaction migration is ready.

S2 batch 21 FeedbackRouter checkpoint: paired Server Reviewer accepted `FeedbackRouter.ts` with no findings. Routes retain authentication/God/attachment checks; repositories receive the same transaction connection and verified actor. The request-local broker buffers full publish arguments and flushes sequentially only after commit; failed `RestResponse` and thrown errors roll back, while post-commit broker failures propagate without claiming database rollback. Storage, URLs, payloads, use cases and public Core ports remain unchanged; no outbox/retry was introduced. Local persistence, authorization, atomicity, concurrency and event-order route tests remain pending.

D2-179 source/review checkpoint: paired pre-mutation and final Database reviews accepted the two-repository correction. Both `authorizeWrite` guards now reject public and admit verified user, God, and system; query, mapper, transaction, route gates and ownership remain unchanged. Star availability/type God gates are preserved. Focused Biome passed. Runtime awaits authenticated planet-create and Star-name-edit HTTP tests after fresh `db:test`.

S2 batch 30 planet/star mutation-test checkpoint: paired Server Reviewer accepted the two existing POST route suites' new authenticated common-user happy paths. Each uses an empty God allowlist, expects201, reads back the persisted planet payload/position and star parent/name/number/slug by id, and restores configuration before pool teardown. Existing anonymous/invalid cases remain. Fresh local runtime is pending.

D2-179/S2 Space runtime resolution: after fresh `db:test`, the three exact planet routes (create, create-star, persisted listing) passed 3/3 suites and 8/8 tests in 16.498s. This includes common authenticated users creating a planet and child star with the God allowlist empty, persisted payload/position/parent/name/number/slug checks, existing anonymous/invalid cases, and real authenticated GET. The result confirms user-write parity while public access remains denied and route-level God gates remain unchanged. D2-179 runtime exits are complete; broader sensors remain pending.

S2 mutation31 assignment: exclusive scope is `McpRateLimitMiddleware.test.ts` and `RateLimiterRoute.test.ts`. Replace stale Supabase MCP test seams with real local API-key hashing/Drizzle seed; preserve public bootstrap, authentication-failure, validated-key-before-account-limiter ordering, and the global policy/IP/Redis contract. No job/cron author changes or remote access. Reviewer/runtime pending. Refreshed `check:spec-implementation` remains exit1 for broad unfinished S2/W2/D3/C1 contracted creates/removes/unchanged paths (503 contracted paths); corrected D2 paths have no reported mismatch. `check:plan-definition` passed after D2-179 ledger update.

S2 mutation31 paired review accepted without findings: persisted hashed API keys replace Supabase/crypto mocks; missing/revoked key cannot reach account limiter; valid key sets the verified actor/hash and ignores caller-supplied account ID. Global IP/policy/exclusion/recovery/Redis coverage is retained; Drizzle teardown is awaited. Focused fresh local runtime pending.

S2 mutation31 runtime: `npm run db:test -w @stardust/server` passed (local Supabase stack reset and Drizzle migrations applied). With local DB environment exported, the exact MCP rate-limit and global RateLimiter route integration suites passed 2/2 suites, 12/12 tests, exit0, 16.959s. Negative cases emitted expected existing Inngest signature and API-key error logs; no test failed/skipped. Fresh `check:spec-implementation --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains exit1 on unfinished S2/W2/D3/C1 contracted paths; both mutation31 paths are now changed/conformant. `check:spec-definition` and `check:plan-definition` passed before source mutation.

S2 mutation32 assignment: create only `FetchAccountRoute.test.ts` and `FetchOnboardingAttemptRoute.test.ts`. Cover real account DTO/auth behavior and signed onboarding receipt lifecycle, readiness/other-account isolation and protected-route non-authorization with local SDK/database/receipt; no source/API change or new mocks. Focused paired review and fresh local integration remain pending.

Finding IR-S2-32-01: paired Server Reviewer failed mutation32 because neither suite proves a valid onboarding receipt cannot authorize a protected HTTP endpoint. Missing receipt against the onboarding endpoint proves the reverse direction only. The other account metadata/authenticity and signed receipt lifecycle/readiness scenarios were accepted. Builder Fix is scoped to one additional real-receipt/no-Bearer request to protected `GET /auth/account` in `FetchAccountRoute.test.ts`, expecting 401; no source change. New paired review and both suites after fresh local reset are pending.

IR-S2-32-01 source correction: the assigned account route suite now issues a valid real receipt for its fixture and sends it without Authorization to `GET /auth/account`, expecting 401. Only the assigned test file changed; focused Biome passed. Final paired review and fresh local integration remain pending.

IR-S2-32-01 final review: paired Server Reviewer accepted the corrected two-file mutation32 diff without findings. The valid-receipt/no-Bearer request to protected `/auth/account` expects 401; prior auth/metadata/latest-identity and signed receipt/readiness isolation cases remain. Runtime pending.

S2 mutation32 runtime attempt after fresh local `db:test`: onboarding receipt suite passed; Account suite failed 6 of 10 cases while `SupabaseFixture.setAuthMetadata` inserted identity rows. postgres.js rejected the fixture's JS `Date` timestamp parameters in its raw SQL interpolation (`TypeError: ... Received an instance of Date`); no product endpoint mismatch was observed. Overall command exit1: 1/2 suites, 8/14 tests passed. This invalidates mutation32 runtime acceptance. Next: CodeGraph-trace the fixture, record a bounded correction if its implementation must change, then fresh local reset and rerun both exact suites; do not weaken or remove metadata/latest-identity assertions.

IR-S2-32-02 assignment: CodeGraph confirms three raw SQL timestamp interpolations in local `SupabaseFixture.setAuthMetadata` pass native Date objects to postgres.js. One-path Builder Fix converts the two createdAt expressions to ISO and nullable lastSignInAt to ISO-or-null, retaining Date-typed helper API, transaction, SQL columns, metadata and production code. No edit yet; paired review and fresh local runtime pending.

IR-S2-32-02 source checkpoint: the sole assigned fixture path now ISO-serializes the two createdAt values and nullable lastSignInAt at the raw SQL boundary; API, transaction and columns are unchanged. Focused Biome passed; paired review and fresh local runtime pending.

IR-S2-32-02 paired review accepted without findings. Reviewer confirmed both createdAt values are ISO, lastSignInAt is ISO-or-null, and helper API, bound values, transaction, metadata and identity replacement remain intact. Fresh local DB/runtime remains the exit.

S2 mutation32 final runtime: after fresh successful `npm run db:test -w @stardust/server`, the exact `FetchAccountRoute.test.ts` and `FetchOnboardingAttemptRoute.test.ts` integration suites passed 2/2, 14/14, exit0 in 16.694s. The Account cases now seed provider identities successfully with the helper correction; the onboarding cases confirm signed claim/readiness isolation and valid receipt alone still gets 401 on `/auth/account`. Expected negative auth cases log existing Hono error output; no failures/skips. IR-S2-32-01 and IR-S2-32-02 are resolved.

Post-mutation32 conformance command returned exit1 as expected for other contracted S2/W2/D3/C1 paths still unfinished; neither new route suite nor `SupabaseFixture.ts` is reported as a mismatch. Fresh Spec/Plan definition gates passed before the Builder Fix, and Plan definition passed after ledger updates.

S2 mutation33 assignment: create the two Reporting route integration suites (`SendFeedbackReportRoute.test.ts`, `SendFeedbackMessageRoute.test.ts`) only. Exercise real Drizzle persistence and `FeedbackRouter` transaction/post-commit broker semantics, including authorization, idempotency and failure boundaries from existing fixtures/contracts; no source changes or repository/domain mocks. Pre-mutation review not applicable to these bounded new test paths; focused paired review and fresh local runtime pending.

S2 mutation33 paired Server review accepted without blocking findings. Reviewer confirms real HTTP/auth/DB persistence, verified actor, no-write/no-event denials, post-commit state observation, account isolation, closed-report conflict, idempotent replay/event keys, God event ordering, and committed report after external publish failure. CA-02 remains partial: no SQL failure after a relational write proves rollback, and no equivalent evidence was found in the inspected Reporting tests. The assignment made this conditional on a safe existing constraint/fixture; investigate feasibility before claiming CA-02 complete. Runtime pending.

S2 mutation33 first local runtime after fresh `db:test`: `SendFeedbackReportRoute.test.ts` passed, while `SendFeedbackMessageRoute.test.ts` failed all five cases (1/2 suites, 4/9 tests overall passed). Stack traces point to Drizzle `reports.save` inside the real message transaction; CodeGraph traced the 500 to raw `GREATEST` interpolation of native Date values in `DrizzleFeedbackReportsRepository.savedAuthorActivity` and `advancedAdminActivity`, rejected by postgres.js. This is a D2 production-path parity defect, not an assertion-only issue. The no-write assertions also compared full report DTOs whose mapped avatar IDs are regenerated; those test assertions need stable-field comparison after the repository correction. D2-180 is assigned for ISO serialization at the raw timestamp boundary. CA-02 rollback evidence remains unresolved until runtime passes and feasibility is investigated.

D2-180 paired Database pre-mutation review returned `clear` without findings. It approved ISO serialization for exactly five `greatest` inputs while preserving order, nullable/monotonic behavior, typed non-admin branch, authorization, lock/filter, transaction and error handling. No mutation performed yet; final review and local regressions required.

D2-180 source/final review: Builder converted exactly five raw `GREATEST` timestamp inputs to ISO or ISO-or-null; Biome focused write/check passed. Final paired Database Reviewer accepted without findings. No query order, auth, lock, transaction, typed non-admin branch, null/monotonic semantics or error boundary changed. Fresh local route regressions remain pending.

D2-180 runtime: after fresh `npm run db:test -w @stardust/server`, the exact `SendFeedbackMessageRoute.test.ts` and `SendFeedbackReportRoute.test.ts` suites passed 2/2, 9/9, exit0 in 14.618s. This validates report save after message persistence for both author and God paths. The original 500 from raw Date GREATEST inputs is resolved locally; global D2 sensors remain pending.

IR-S2-33-01 assignment: review of the full test file found four comparisons of full report DTOs (replay/conflict, cross-account, closed, anonymous/invalid), whose nested avatar IDs are regenerated by fixture mapping. Builder Fix narrows only these comparisons to stable persisted fields, retaining the same status/replay/auth assertions, empty-message checks and no-event assertions; no change to routes, fixtures or production source. Paired review and runtime pending.

IR-S2-33-01 final source/review: all four comparisons now check stable persisted report fields rather than regenerated avatar IDs. The final paired Server Reviewer accepted without findings and confirmed 201/200/409, replay idempotency/event keys, and all no-message/no-event denial checks remain. Focused Biome passed; local runtime pending.

S2 mutation33 final runtime: following fresh successful local `db:test`, `SendFeedbackMessageRoute.test.ts` and `SendFeedbackReportRoute.test.ts` passed 2/2 suites, 9/9 tests, exit0, 14.618s. No error/failure remains in those paths. CA-02 is still partial pending an actual SQL failure after a relational write that proves transaction rollback/no publication; current authorization/closed/input denials precede writes, and external publish rejection intentionally happens after commit.

IR-S2-33-02 feasibility: CodeGraph confirmed the message route's real local S3 metadata guard runs before the transaction, then the transaction inserts the message before attachment rows; `feedback_message_attachments.id` has an actual primary key. A valid local MinIO object plus a seeded duplicate attachment UUID can therefore trigger a genuine SQL constraint failure after the message insert without mocks or schema changes. One-path test addition is assigned to `SendFeedbackMessageRoute.test.ts` to assert rollback/no event and object cleanup; CA-02 remains partial until it passes.

IR-S2-33-02 source checkpoint: the assigned route test now uploads a valid 1×1 PNG to real local MinIO, confirms HEAD metadata, then sends a valid request reusing a seeded attachment UUID to trigger a real PostgreSQL primary-key violation after message insert. It asserts the established 409 duplicate-record response, message absence, baseline/report state unchanged, no event, and object deletion in `finally`; source/schema/fixture remain untouched. Biome focused passed. Paired review and fresh local runtime pending.

IR-S2-33-02 paired review accepted without findings. Reviewer confirms the path passes real S3 metadata checks, then fails on the real attachment primary key after message insert; rollback, report/baseline preservation, no external publication and MinIO cleanup assertions are sound.

IR-S2-33-02 runtime: after fresh `npm run db:test -w @stardust/server`, the two Reporting route suites passed 2/2, 10/10, exit0 in 18.395s. The first real-MinIO attempt exposed that the host API port differs from the app's default endpoint; the local run used `S3_ENDPOINT` derived from root `.env.local` and the test IAM user configured on the local MinIO stack. No credential values were written to tests, docs, commands, or logs. The duplicate primary key maps to the established HTTP 409 contract. The test verified message/report/conversation rollback, preserved the seeded attachment, observed no event delivery, and removed the uploaded object. This closes the S2 transaction rollback evidence; CA-02 remains `in_progress` until its other acceptance evidence and integrated sensors pass.

S2 mutation34 paired review accepted without findings. Three contracted Reporting route suites cover status transitions and post-commit event order, stale conflict without mutation/publication, signed initial/message attachment uploads, storage metadata via real PUT/HEAD, author isolation, God access, closed-report rejection and cleanup. First runtime exposed an incorrect expected code only: closed-report upload maps the existing `NotAllowedError` to HTTP 405, not 403. Builder Fix changed only that expected constant; paired Server Reviewer accepted it. After a fresh successful `npm run db:test -w @stardust/server`, the three suites passed 3/3, 9/9, exit0 in 17.812s. Local MinIO used `S3_ENDPOINT` from the host port configured in root `.env.local`; no credential values were recorded. Mutation34 is complete; broader EV-01/EV-02 and remaining route suites remain pending.

### ACH-40 — Server/global check:code gate (closed)

`npm run check:code` first failed because `apps/server` Biome reported 72 diagnostics: 71 formatting findings across 19 contracted S2 paths plus one `noBannedTypes` for `Context<any, any, {}>` at the Inngest handler boundary. IR-S2-35, -37, -39 and -40 resolved all contracted errors. Paired reviews accepted the current changes without semantic findings; formatter batches retain the documented limitation that no pre-format workspace snapshot exists. Final `npm run check:code -w @stardust/server` and global `npm run check:code` both pass exit0. Remaining warnings/infos are in unchanged provider sources, informational unused-constructor notices where callers still use the argument-taking API, and the generated manifest size notice; they do not fail the sensor. The legacy Supabase adapter is scheduled for D3 removal. ACH-40 is complete.

### ACH-41 — Server global typecheck errors

`npm run check:types` failed in the Server workspace with 17 TypeScript errors across seven contracted paths: `FeedbackRouter.ts`, `ManualFunctions.test.ts`, `SignUpController.test.ts`, `ChallengingFixture.ts`, `ForumFixture.ts`, `ShopFixture.ts` and `StreamProfileCreationRoute.test.ts`. IR-S2-36 corrected their Hono generic/transaction inference, obsolete argument, typed HTTP/DTO/broker mocks, required fixture inputs/literal roles and signal callback. Server and global `check:types` passed, exit0; the subsequent global unit run passed 169/169 Server suites (330/330 tests) and 118/118 Web suites (506/506 tests), closing these type/unit findings.

### ACH-42 — HonoApp unit test expects an initialized Drizzle client

The global unit run first failed one test: `apps/server/src/app/hono/tests/HonoApp.test.ts`. IR-S2-38 added a typed local `DrizzleClient.getInstance` mock and preserved the `/inngest`, mocked `serve`, status/body and forwarded-client assertions. Paired review accepted; focused HonoApp test passed 1/1. Subsequent full global unit rerun passed 169/169 Server suites/330 tests and 118/118 Web suites/506 tests. ACH-42 is complete.

### S2 mutation35 — signup route integration

Paired Server Reviewer accepted `apps/server/src/tests/routes/auth/SignUpRoute.test.ts` without findings. After a fresh local `npm run db:test -w @stardust/server`, the focused suite passed 1/1 suite and 3/3 tests against local Auth/PostgreSQL/receipt services. It covers unconfirmed signup and persisted nonce, signed receipt claims/readiness, receipt-only rejection at `/auth/account`, SSE retry/abort/cancel cleanup, invalid password with no account/receipt, and confirmed duplicate privacy behavior. The initial run returned HTTP 500 because Jest's `MODE=test` disabled Inngest Dev routing and sent the synthetic event key to cloud. Focused rerun passed only after setting local `INNGEST_DEV` and `INNGEST_BASE_URL` plus local MinIO endpoint; the shared integration script correction is tracked as ACH-43 before broader integration validation. No remote service or credential was used.

### ACH-43 — Server integration Inngest endpoint (closed)

Observed signup failure: the Server Inngest client checks `MODE=test` as non-development and sent the onboarding receipt event to the cloud using the synthetic test key; response was `401 Event key not found`. `apps/server/package.json` now sets `INNGEST_DEV` and `INNGEST_BASE_URL` to `http://127.0.0.1:8288` in `test:integration`. The paired Coordination Reviewer accepted the diff without findings. After a fresh local `db:test`, focused real SignUpRoute passed 1/1 suite and 3/3 tests with no Inngest overrides; Biome on package.json passed. The run used only `S3_ENDPOINT` derived from ignored root `.env.local` for local MinIO. The earlier full in-band Server integration attempt exceeded the Node heap before completion; its S3-related failures also used an incorrect host endpoint, so neither is accepted as feature evidence. ACH-43 is closed. No baseline or remote configuration change.

### ACH-44 — feedback history repository access (resolved for integration; D3 cleanup pending)

The initial shard4 failures came from the legacy suite's `createReport()` seeding through Supabase Data API after migration0002 intentionally revoked that access. The fixture now seeds and reads reports through local privileged SQL; no Data API grants were restored. `UserFeedbackHistoryRoutes` and `FeedbackConversationsPersistence` pass 10/10 tests, and the full Reporting route group passes 43/43. The legacy test path remains contracted `Remove` in D3 after its observable scenarios are covered by the Drizzle route suites.

### ACH-45 — Auth rate-limit integration order (resolved)

The initial failure used a non-UUID fake account id, which AuthMiddleware correctly rejected before rate limiting. The contracted fixture correction now creates a real UUID-backed account and asserts the exact hashed key. The Auth router integration group passes 2/2 suites and 2/2 tests, and the full Server integration inventory passes in fresh serial groups. No middleware or status behavior changed.

### Server integration capture — C2 checkpoint

Initial capture: 82 suites/267 tests, with four failures confined to ACH-44 and ACH-45. Superseded by the 2026-10-05 grouped rerun below.

### ACH-47 — residual root complexity errors

After mutation36 the root complexity sensor showed five Halstead errors: two in `HonoApp.ts`, one each in `NodeOnboardingReceiptProvider.verify`, `SupabaseAuthService.signUp`, and `OnboardingMiddleware.authorizeProfileStream`. Same-module private extraction boundaries preserved router registration order, error mapping/logging, receipt verification/expiry/sanitization, signup nonce/Auth/eligibility sequence, and verified-auth-before-JWT-deadline with no invalid-bearer receipt fallback. Mutation38 was accepted by the paired Server Reviewer with no findings. Mutation39 then refactored only `apps/server/src/constants/env.ts`, preserving validation predicates, issue paths/messages, and order (S3 → Mailpit → trusted proxies), including schema parse before local validation. Focused Biome and Server code/type checks passed; root complexity fell from 385 to **379 warnings**, with zero errors and no remaining warning in `env.ts`. Paired Server Reviewer accepted mutation39 without findings. Behavioral tests after that mutation and all other CI-09 warning paths remain pending.

### C2 integrated sensors — 2026-10-04

After the ACH-43 package-script change, the root sensors passed: `npm run check:code` exit0 (7/7 workspaces; existing warnings/infos only), `npm run check:types` exit0 (7/7), `npm run test:unit` exit0 (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `npm run check:test-integrity` exit0 (56 changed tests; 31 testable sources; 223 excluded), and `npm run check:architecture` exit0 (3874 modules/6988 dependencies). `check:spec-definition` and `check:plan-definition` also pass. Logs are in `/tmp/stardust-check-code.log`, `/tmp/stardust-check-types.log`, `/tmp/stardust-test-unit.log`, `/tmp/stardust-test-integrity.log`, `/tmp/stardust-architecture.log` and definition/conformance logs under `/tmp/stardust-*.log`.

`check:spec-implementation -- spec --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains exit1 as expected while D3 Remove paths and W2 Modify/Create paths are unfinished; the new SignUpRoute Create path is no longer reported missing. ACH-44 explains one legacy D3 Remove test still running before its scheduled phase; ACH-45 is an invalid test identity fixture and awaits a scoped Spec amendment/user confirmation. Do not mark the feature or Server integrations accepted yet.

This 2026-10-04 checkpoint is superseded for ACH-44/45 by the 2026-10-05 grouped integration rerun below. The current conformance run still reports 140 errors (122 Remove-present, 16 unchanged Modify, 2 missing Create; 24 unrelated paths ignored), so W2/D3 and full candidate acceptance remain pending.

### CI-09/Server integration continuation — 2026-10-04

The user requested resolution of the outstanding complexity and Server integration blockers. This 2026-10-04 checkpoint predates the 2026-10-05 user-requested baseline update and final sensor reruns recorded below. The whitespace-only formatting request inserted blank lines between 517 adjacent class-method pairs across 25 Drizzle repository implementation files (447 insertions in 23 files; two already met the style). The current complexity result and integration evidence are recorded in the principal verification section below.

Paired Server Reviewer found the planned mutation40 aggregate (eight Auth/receipt/onboarding paths; 55 warnings) too broad and recommended sequential, path-bounded sublots. Plan now defines 40a–40h, beginning with `NodeOnboardingReceiptProvider.ts`; no source edit for mutation40 has started. Before each sublot, require current CodeGraph, exact paired pre-review, plan/spec definition gates, Builder Server, focused checks, fresh root complexity and paired post-review. ACH-44 remains open until the contracted legacy D3 test removal; ACH-45's fixture correction passed its focused integration test but the full eight-shard rerun remains pending. Mutation39 focused behavior, combined Server coverage, and remaining S2/W2/D3/C1 gates remain open.

After the Plan decomposition, `check:spec-definition` and `check:plan-definition` both pass. Fresh `check:spec-implementation -- spec --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` still exits1 with 504 contracted paths and expected outstanding S2/W2/D3 work (including all D3 removes, unchanged W2 Modify paths and missing account-confirmation/profile-socket tests); it is recorded as a current conformance failure, not a completion gate for this sublot. No source changed in this checkpoint.

Fresh `npm run check:complexity` after the repository spacing-only change confirms **379 warnings and 0 errors** across3,476 files/9,440 functions; no warning count changed. Root `check:code`, `check:types`, `test:unit`, and focused Biome for all Drizzle repository files passed. The paired Server Reviewer then cleared mutation40a pre-review for only `NodeOnboardingReceiptProvider.ts`, no findings. Approved limits preserve 32-byte secret minimum, 32-byte nonce, HMAC-SHA256 wire format, signature checks before JSON parse, timing-safe comparison, strict claims schema, iat/exp exact 900-second rules, domain projection and one sanitizing catch. Plan marks mutation40a `in_progress`; source mutation has not yet started. Next action: activate Builder Server on the sole path.

Mutation40a Builder result: only `apps/server/src/provision/auth/NodeOnboardingReceiptProvider.ts` changed. Added private local `composePayload`, `validateTemporalClaims`, and `projectClaims`; retained signature verification/claims parsing and their order. Builder reports nonce, signed payload format, 900-second checks, claim projection and single sanitized `AuthError` preserved. Focused Biome, Server `check:code`, Server `check:types`, and path `git diff --check` passed. These are Builder-reported, not yet principal-verified. Fresh principal Biome/code/types, focused provider behavioral tests, global complexity and paired post-review remain pending; no semantic evidence is accepted until those checks complete. Evidence for this path is stale after the source edit.

Principal runtime for mutation40a: `npm run db:test -w @stardust/server` passed using the local stack and root `.env.local` export; subsequent sequential local integration run passed 4/4 suites and 21/21 tests: `SignUpRoute.test.ts`, `FetchAccountRoute.test.ts`, `FetchOnboardingAttemptRoute.test.ts`, and `StreamProfileCreationRoute.test.ts`. This exercises signed receipt issue/verify, valid/invalid onboarding receipts and Auth account behavior on the real local stack. Full shard run for ACH-45 and legacy ACH-44 remain separate/pending. Console output contained expected existing invalid-input/auth-path logs; tests passed. Principal `npx biome check` for the provider, Server `check:code`, and Server `check:types` passed. Fresh root `npm run check:complexity` reports 377 warnings/0 errors across 3,476 files/9,443 functions; mutation40a removed two warnings net without adding warnings in the provider. Paired Server Reviewer accepted mutation40a post-review with no findings. Assignment 40a is complete; next is pre-review for 40b.

### ACH-46 — SSE stream complexity threshold (resolved locally; global CI-09 remains open)

Fresh root `npm run check:complexity` before mutation36 exited1 with 3,476 files, 9,411 functions, 9,038 clean and seven errors, all in `createProfileCreationStream.ts`. Same-file helper extraction separated runner/lifecycle/expiry/poll-frame responsibilities while preserving stream timing, frames, auth guards, cancellation and headers. Focused Biome, `check:code -w @stardust/server` and `check:types -w @stardust/server` passed; fresh local `db:test` then `StreamProfileCreationRoute.test.ts` passed 4/4, including expiry/backpressure, pending-query abort and shutdown. Paired Server Reviewer accepted post-mutation without findings. Fresh root complexity still exits1, but none of the seven original errors remain in this path; total errors fell from7 to5 and now occur in `HonoApp.ts`, `NodeOnboardingReceiptProvider.ts`, `SupabaseAuthService.ts` and `OnboardingMiddleware.ts`. Thus ACH-46 is resolved for its assigned stream path; CI-09 remains open pending ownership/triage of those five global errors. No threshold/baseline changed. Full report: `/tmp/stardust-m36-complexity.log`.

IR-S2-37 paired review found no semantic deviation in the current 19 formatter-target paths, with the same incremental-evidence limit: no pre-format snapshot exists, so review used the cumulative diff plus earlier contract reviews. Focused formatter/check passed; root global `check:code` remains pending.

IR-S2-39 completed: the 13 contracted files were formatter-only and the Inngest event constant used exclusively in `typeof` is now type-only. Focused Biome passed and paired Server review accepted without findings; as for the prior formatter batches, review is limited by absence of a pre-format snapshot. The subsequent Server-wide Biome run moved the remaining contracted findings to IR-S2-40, which also passed review and final code sensors as recorded above.

IR-S2-40 completed: Builder resolved all contracted format/lint diagnostics without unrelated files; `SignUpController` uses `Reflect.deleteProperty` to preserve the response headers object's identity and actual property removal, and tests now guard the stream body and fixture achievement ID explicitly. Paired Server review accepted without semantic findings (same no-preformat-snapshot limitation). The focused Server check passed, then `npm run check:code -w @stardust/server` and global `npm run check:code` both passed exit0. Remaining lint output consists of warnings/infos in untouched existing files, four informational constructor findings whose argument-taking API remains in use, and the generated legacy schema manifest size warning; they do not fail the detector. The legacy Supabase adapter is scheduled for D3 removal. Global `check:types` passed 7/7 tasks, and global `test:unit` passed (Server169 suites/330 tests, Core176/638, Web118/506, Studio14/64, LSP1/1); downstream SDD sensors remain open.

IR-S2-41: the initial `npm run check:test-integrity` exposed four infrastructure tests outside the detector's explicit allowlist, despite the SDD excluding test infrastructure from pairing. The checker now allows only direct test files in the two existing Hono app and Inngest function infrastructure directories; test strength metrics, source/test pairing, and neighboring-directory rejection remain unchanged. Focused script suite passed 12/12. Root rerun passed global `check:test-integrity` (55 changed tests, 31 testable sources, 223 excluded); paired Coordination Reviewer accepted without findings. This resolves the integrity sensor finding.

Coverage run after IR-S2-40/41: Core passed 176 suites/638 tests; lines81.36%, statements81.68%, functions64.43%, branches65.97%; all exceed baselines. Web passed118/506 at lines25.76%, statements24.93%, functions22.58%, branches27.69%; Studio passed14/64 at lines10.65%, statements10.54%, functions10.07%, branches9.16%; their `check:coverage` gates pass. Server passed169/330, but unit-only capture is lines/statements50.95%, functions36.68%, branches89.18%; baseline check fails lines/statements51.60% and functions47.11%, while branches82.98% passes. As established in the Plan, this is diagnostic only: ACH-35's final gate includes `server-integration` in the C2 coverage capture. No baseline or threshold changed. `check:architecture` passed (3874 modules/6988 dependencies). Conformance still correctly reports downstream planned removals and W2 unchanged/create paths plus the pending Signup route; it is not an acceptance gate until phases finish.

Mutation40b preparation: after 40a's accepted post-review, the paired Server Reviewer cleared the sole path `apps/server/src/rest/controllers/auth/SignUpController.ts`. The permitted helper groups only eligible receipt issuance, event publication and receipt/expiry header writes under the existing eligibility/success predicate. Preserve eligibility-header read/delete order, failure/status checks, returned account id, issuance→publish→headers, and the exact `RestResponse` instance; nonce, service, routing, middleware, and BFF cookie behavior remain outside scope. Definition gates must be rerun after this Plan update before Builder activation. No 40b source edit has begun.

Mutation40b source update: CodeGraph principal inspection confirms that `handle` still reads and deletes `X-Onboarding-SignUp-Eligible` before evaluating the original successful/nonfailure/eligible guard, then returns the same response. The new private generic helper uses `response.body.id`, constructs the account ID, issues the receipt, constructs and publishes the event, then writes receipt/expiry headers. Builder-reported Biome, Server `check:code`, Server `check:types`, and focused SignUpController test (3/3) pass; these reports are not yet principal sensor results. Fresh Plan/spec definition, principal focused checks, root complexity and paired post-review are pending. Full eight-shard integration remains pending; ACH-44’s three legacy D3 tests remain expected failures until the contracted removal, while ACH-45’s fixture correction has only focused evidence so far.

Correction to the preceding 40b checkpoint: mutation40b is now accepted. Principal CodeGraph confirms the behavior and sole-path scope; paired post-review accepted with no findings. Principal `npx biome check` for the controller, Server `check:code`, Server `check:types`, root `check:code`, root `check:types`, focused SignUpController test (1 suite/3 tests), and root `test:unit` all passed. The root unit run passed Server169/330, Core176/638, Web118/506, Studio14/64, and LSP1/1. Root complexity fresh after this change reports 378 warnings/0 errors over 3,476 files/9,444 functions, and the edited controller does not appear among warning paths. The increase of one warning from the 377 snapshot after 40a is not attributable from current evidence; record for reconciliation under CI-09 without asserting a regression in this sublot. `check:plan-definition` and `check:spec-definition` pass; `check:spec-implementation` continues to fail only on contracted downstream pending/missing paths (504-path report, including planned D3 removals and W2 changes/tests). Full eight-shard integration is still pending: ACH-44's three legacy D3 tests remain expected until removal, and ACH-45 needs the complete rerun after its fixture correction.

40c accepted: paired post-review found no issues. `resolveUser` preserves expiry-before-query, a single lookup, same identity check and error strings; `handle` returns the same response contract. Fresh local DB stack and route behavior passed as recorded above. The root code/type/unit suites also passed. Global complexity is 379 warnings/0 errors; this path is warning-free. The increase from the earlier snapshots remains an unresolved overall inventory change and is not attributed to 40c. The Builder's initial invalid test-script invocation was corrected, and the focused test passed.

40d preparation: CodeGraph confirms warning markers on `getBearerExpiry` and `authorizeProfileStream`; the middleware decides between signed receipt and bearer-authorized stream, verifies the bearer account through Auth, derives a deadline from JWT expiry, places account/deadline in context and applies the account limiter. Before implementation, the paired Server Reviewer must approve the proposed cohesive helper boundaries and confirm preservation of the authorization source/order, no invalid-bearer fallback, expiry handling, context values and limiter sequence. Definition gates follow this Plan update.

40d paired pre-review is clear. Approved bearer helper sequence: Auth verification → Id → expiry deadline → `account`/`databaseAccess`/`profileStreamAuthorization` context writes → limiter or one `next()`. Receipt helper sequence: missing-receipt rejection → receipt verification → `databaseAccess`/stream authorization writes → one `next()`, without account or limiter. Public dispatch must not fall through from any truthy bearer to receipt. A narrow payload/JSON/exp claim extraction helper is allowed inside the existing sanitizing catch; preserve exact finite/future exp validation and error mapping. No additional JWT checks or changed exp bounds. Plan/spec definition gates before Builder.
40d Builder source update: only `OnboardingMiddleware.ts` changed. Builder reports branch helpers and `decodeBearerExpiryClaim` with the approved sequences/guards. Focused Biome, Server `check:code` and `check:types`, and diff check pass after an initial formatting-only correction. No dedicated middleware unit test was found. These remain Builder reports; principal CodeGraph, route integration across bearer and receipt, root code/type/unit, fresh complexity, and paired post-review remain pending. Builder noted the path is currently untracked in Git, matching the broader feature's new-file workspace state; no staging action was taken.
40d principal CodeGraph confirms public dispatch sends any truthy Authorization header only to bearer authorization; it cannot fall through to receipt. The bearer helper preserves verify→Id→expiry→account/databaseAccess/stream-auth context writes→limiter-or-next; receipt path preserves missing-header check→receipt verification→databaseAccess/stream-auth→next, with no account/limiter. Claim extraction is called inside the existing `try`, so decode/JSON errors remain sanitized by the unchanged AuthError catch; finite/future checks and Date construction are unchanged. Source and Plan constraints align; proceed to behavior checks.
40d first principal integration attempt after fresh `db:test` failed 3/4 stream lifecycle tests with `TypeError: Cannot read properties of undefined (reading 'authorizeReceiptProfileStream')` at `authorizeProfileStream`; one test passed. This is a real regression caused by the method being invoked without a bound receiver in the route. Do not accept mutation40d yet. Trace the route callback and fix receiver preservation inside the approved middleware path, then repeat local stream integration, root checks, complexity and post-review.
40d correction: CodeGraph confirms `ProfileEventsRouter` registers `middleware.authorizeProfileStream` directly as a Hono callback, so a prototype method has no instance receiver. Changed only the approved middleware path: `authorizeProfileStream` is now an arrow-function class field, preserving the callback signature and lexically binding the extracted helpers. Plan/spec definitions passed before this correction. Rerun `db:test`, route integration, root detectors, complexity and paired post-review; the first failed integration evidence remains historical and must be superseded by a passing rerun.
40d corrected integration passed all 4/4 `StreamProfileCreationRoute.test.ts` lifecycle tests after another fresh `db:test`. Server type checks passed. Root `check:code` failed only on a Biome formatting difference for the arrow-function signature (`authorizeProfileStream` arguments must stay on one line); focused check confirmed one formatting error in the edited file. Complexity is 380 warnings/0 errors, with no markers in `OnboardingMiddleware.ts`. The exact one-line layout is now applied. Root type/unit runs already in flight after the binding fix completed successfully: 7/7 type tasks, root unit tasks passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Rerun root code/types/unit after the formatting edit and obtain paired post-review; integration is already green for the behavior change.
40d final principal sensors: root `check:code` passed after formatting; root `check:types` passed all seven tasks; root `test:unit` passed the five test-bearing packages (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). The corrected focused integration was green 4/4 after fresh local DB setup. Fresh complexity remains 380 warnings/0 errors (3,476 files/9,448 functions), with no warning marker in the edited middleware. One initial integration run exposed the unbound-receiver defect; it was fixed within scope and the repeated route run passed. Paired post-review requested.
40d paired post-review accepted without findings. It confirms both bearer/receipt order and direct Hono callback binding. Mutation40d is complete locally; the edited file has no complexity markers while the overall count remains 380 warnings/0 errors, so CI-09 continues across remaining paths.

40e preparation: CodeGraph confirms `verifyApiKeyAuthentication` reads and validates `X-Api-Key`, builds the public-access Drizzle API-key repository and crypto secret provider/use case, executes authentication, builds an authenticated account DTO, writes `account` then `databaseAccess`, and applies the account limiter or exactly one `next()`. Paired Server Reviewer pre-review is clear: extract only repository/provider/use-case setup and execute to a private helper returning validated userId; keep missing-key rejection/message, account DTO, context writes and continuation order in the existing method. Definition gates pass after recording the exact boundary; Builder may proceed.
40e Builder source update: `authenticateApiKey(http, apiKey)` now contains only public repository/provider/use-case setup and execution, returning `userId`. The missing-key guard/error and account/context/limiter flow remain in the current method. Builder reports Biome, Server `check:code`/`check:types`, and core use-case test (1 suite/3 tests) passed. Initial Server type run failed due a missing HonoHttp generic; Builder corrected it and reports the rerun passed. Principal review, root checks, fresh complexity and paired post-review remain pending.
40e principal evidence: CodeGraph confirms the private helper builds the same public repository, crypto provider and use case in order and executes with `apiKey`; caller retains missing-key rejection, same account DTO, context write order and limiter/next behavior. Root code/types/unit passed; API-key use-case test passed 3/3. Fresh complexity reports 381 warnings/0 errors. Neither AuthMiddleware method has an explicit metric marker, but the sensor counts both `verifyApiKeyAuthentication` (MI50.9) and `authenticateApiKey` (MI63.6) as MI-only warnings below 65. Thus the root count rise 380→381 is attributable to this extraction: it removed the caller’s Halstead metric finding but left that function warned and added the helper warning. Paired post-review accepted the preserved behavior, but mutation40e remains unresolved for CI-09 pending a bounded 40e2 correction.

40e2 paired pre-review is clear. The approved boundary is limited to `AuthMiddleware.ts`: make the current caller an orchestrator by extracting required-key validation, account/context writes, and limiter-or-single-next; retain API-key repository/provider/use-case creation and execution in `authenticateApiKey`, compacting its final userId projection only. Preserve HonoHttp→key→authentication→context→continuation ordering, exact errors/DTO/values and one continuation. Each new helper and both existing methods must be checked against the MI<65 warning count; no source edit until the Plan records this scope and definitions pass.

40e2 Builder source checkpoint: `verifyApiKeyAuthentication` now follows the approved five-step sequence through `requireApiKey`, `authenticateApiKey`, `setApiKeyAccount`, and `continueApiKeyAuthentication`. The missing-key message, dependency construction/execution input, AccountDto fields, context write order, limiter behavior, and single `next()` are preserved in the assigned helpers. No sensors or tests have run after this source edit; fresh source inspection, root checks, regression coverage, complexity metrics, and paired post-review remain pending.

40e2 complexity checkpoint: root complexity reports 381 warnings and 0 errors across 3,476 files/9,453 functions. The assigned `verifyApiKeyAuthentication`, `requireApiKey`, `authenticateApiKey`, and `continueApiKeyAuthentication` are not listed as MI<65 functions; `setApiKeyAccount` remains MI 62.5. Existing `verifyAuthentication` is MI 55.6 and outside this assignment. Per the explicit stop condition, the Builder stopped before other checks/tests or more source edits; a revised paired boundary is needed for the remaining target helper. Evidence: `/tmp/stardust-mutation40e2-complexity.log`.

40e3 Builder source checkpoint: added private `createApiKeyAccount(userId): AccountDto` containing the existing literal, and reduced `setApiKeyAccount` to the unchanged `account` then user-scoped `databaseAccess` writes. The caller order and `{ kind: 'user', accountId: Id.create(userId) }` value are preserved. No sensors have run after this edit; fresh CodeGraph, root complexity, and follow-on checks/tests if every target helper clears MI 65 remain pending.

40e3 verification: Plan/Spec definition gates passed; fresh CodeGraph confirms the DTO literal and ordered user-scoped context writes. Root complexity is 380 warnings/0 errors across 3,476 files/9,454 functions. `AuthMiddleware.ts` class MI is 65.4; the only listed sub-threshold method is pre-existing, out-of-scope `verifyAuthentication` at MI 55.6, so all assigned API-key methods/helpers meet MI 65. Focused Biome, root code/types (7/7 tasks each), and root unit (Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1) passed. Local `db:test` succeeded; MCP API-key/rate-limit integration passed 4/4 and the core AuthenticateApiKeyUseCase test passed 3/3. No log files were created for checks/tests; complexity evidence is `/tmp/stardust-mutation40e3-complexity.log`. Paired post-review is pending.

40e2 paired post-review accepted API-key behavior with no findings, while explicitly leaving the CI-09 target unresolved due to `setApiKeyAccount` MI62.5. It confirms the exact HonoHttp→require→authenticate→account context→continue sequence and error/account/limiter semantics. Existing `verifyAuthentication` MI55.6 stays out of this slice for separate assignment.

40e3 paired Server pre-review: the first proposal incorrectly said public database access. CodeGraph showed the current helper writes user-scoped databaseAccess using `{ kind: 'user', accountId: Id.create(userId) }`; using public access would change authorization, so that proposal was rejected. Corrected, the exact boundary is to extract only the existing AccountDto literal to `createApiKeyAccount(userId)` and leave ordered account then identical user-scoped databaseAccess context writes in a short helper. Reviewer clear on the corrected split; verify fresh MI for both helpers.

40e3 paired post-review accepted with no findings. Exact DTO fields, user-scoped database access via `Id.create(userId)`, write order and caller flow are preserved. All assigned API-key methods/helpers meet MI≥65; root complexity fell to 380 warnings/0 errors. The API-key target is resolved; `verifyAuthentication` MI55.6 is separate and CI-09 remains open.

CI-09 sensor audit corrected the previous interpretation: the root `warn` total counts every function with MI<65, including MI-only warnings that have no `⚠` marker. Future sublots must lower the warned-function count and verify MI for each changed/new helper, not just remove visible metric markers. No baseline/threshold changes.

40e4 paired Server pre-review is clear. CodeGraph shows the current regular-auth sequence: service→controller→HonoHttp→controller.handle (propagating errors)→account context→user-scoped databaseAccess via `Id.create(String(response.body.id))`→limiter or one `next()`. Approved decomposition extracts the exact service/controller/HTTP composition to `fetchVerifiedAccount`, ordered context writes to `setVerifiedAccountContext`, then reuses `continueApiKeyAuthentication`; `verifyGodAccount` remains untouched. The path serves ~60 Hono routes; the AuthRateLimitMiddleware integration test exercises this path and verifies IP-before-account limiter ordering. Fresh MI must be≥65 for all affected/new functions.

40e4 paired post-review accepted with no findings. Construction/error propagation, DTO, user-scoped access value/order and limiter-or-next behavior are preserved; `verifyGodAccount` is unchanged. All assigned methods are MI≥65, root complexity is379/0. Focused Biome, root code/types/unit, fresh local database, AuthRateLimit integration1/1 and definitions passed; interrupted parallel unit is superseded by an isolated pass.

40e4 Builder source checkpoint: `verifyAuthentication` now delegates service/controller/HTTP construction and `controller.handle` to `fetchVerifiedAccount`, writes the AccountDto and same user-scoped databaseAccess through `setVerifiedAccountContext`, and reuses `continueApiKeyAuthentication`. Construction and continuation order are preserved; `verifyGodAccount` is untouched. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and checks/tests if MI gates pass remain pending.

40e4 verification: Plan/Spec definition gates passed; CodeGraph confirms service→controller→HonoHttp→handle order and unchanged error propagation. Root complexity is 379 warnings/0 errors across 3,476 files/9,456 functions. Direct file metrics are: `verifyAuthentication` MI 72.2, `fetchVerifiedAccount` MI 67.0, `setVerifiedAccountContext` MI 67.8, and reused `continueApiKeyAuthentication` MI 68.3; all affected functions clear MI 65. Focused Biome passed; root code and types passed 7/7 tasks each. Fresh local `db:test` passed, and `AuthRateLimitMiddleware.test.ts` passed 1/1. The first parallel root unit run was interrupted (exit 143); an isolated retry passed all five tasks: Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1. Evidence: complexity `/tmp/stardust-mutation40e4-complexity.log`, per-file metrics `/tmp/stardust-mutation40e4-authmiddleware.json`, unit output `/tmp/stardust-mutation40e4-unit.log`. Paired post-review pending.

40f1 assignment: only `SupabaseAuthService.fetchAccount` in `apps/server/src/rest/services/SupabaseAuthService.ts`, carrying cognitive-complexity, function-length and Halstead markers in the root report. CodeGraph confirms the method performs one `auth.getUser()`, maps errors, then projects the successful account. Paired Server pre-review is clear: move only the existing error response branch into a private helper returning the same `RestResponse<AccountDto>`. Keep the SDK call, success projection, current classifier, exact unauthorized cases/messages/statuses and unexpected-error fallback unchanged. Definition gates passed after recording this limit; the Builder may proceed. Fresh complexity must confirm the helper has no new warning marker before acceptance.

40f1 Builder source checkpoint: only `SupabaseAuthService.ts` changed. `fetchAccount` delegates the existing error branch to private `fetchAccountErrorResponse(error)`; the branch statements/messages/statuses are preserved verbatim, and the SDK call/success projection remain in place. No sensors or tests have run after this source edit. Principal inspection, fresh complexity, root detectors, regression test, and paired post-review are pending.

40f1 verification: focused Biome, Server `check:code`/`check:types`, `SupabaseAuthService.test.ts`, Server unit tests (169/330), root code/types (7/7), and root unit tests (Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1) passed. Fresh root complexity report `/tmp/stardust-m40f1-audit-complexity.log` exits2 with382 warned functions/0 errors. `fetchAccount` is MI55.3 and `fetchAccountErrorResponse` MI50.0, both counted as warnings despite no separate `⚠` marker; root total increased381→382. Paired post-review accepted behavior with no findings, but the 40f1 CI-09 warning target is unresolved.

40f1 paired post-review accepted with no findings. The single `getUser()` call, unauthorized classification/responses, unexpected-error fallback and success account projection are unchanged. It was behavior-accepted only; both methods remain MI<65 warnings and the root total delta is accounted for by the new helper.

40f1b assigned for warning correction after re-reading the official sensor: `fetchAccount` MI55.3 and `fetchAccountErrorResponse` MI50.0 are both counted. The first split produced MI64.1/61.9/63.0/56.0 and raised root379→381; it was stopped before tests. 40f1c removed the two added helpers and lowered root back to379, but both remaining methods stayed warned (MI55.3/54.6). It was also stopped before tests. Paired pre-review is now clear for 40f1d: move the immutable specialized-message Map to a class-level ReadonlyMap, remove the local AccountDto variable, return the exact body fields directly, and keep the error handler to one classifier guard plus one 401 response or unchanged unexpected-error fallback. No additional functions are introduced; fresh MI for both existing methods is the gate.

40f1c Builder source checkpoint: removed the two helpers introduced by 40f1b. Successful account projection remains inline in `fetchAccount`; `fetchAccountErrorResponse` now uses the unchanged classifier, a Map for bad_jwt/session_expired messages, generic unauthorized response, and the same unexpected-error fallback. The single `getUser()` call and all response values are preserved. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and tests if the count/MI gates pass remain pending.

40f1d Builder source checkpoint: the specialized unauthorized messages now live in a class-level ReadonlyMap. `fetchAccount` returns the same successful fields directly in `RestResponse.body`; `fetchAccountErrorResponse` uses one inverse classifier guard, the unchanged fallback, and one exact unauthorized response. No helpers or out-of-scope methods changed. No sensors have run after this edit; definition gates, fresh CodeGraph/complexity, and tests if the count/MI gates pass remain pending.

40f1d complexity checkpoint: root complexity reports 3,476 files / 9,456 functions / 384 warnings / 0 errors, up from 379. `fetchAccount` is MI 56.6 and `fetchAccountErrorResponse` is MI 59.2, both below 65. No other checks/tests ran, per the stop condition. Evidence: `/tmp/stardust-mutation40f1d-complexity.log`.

40f1d paired delta audit: the root +5 is reproducible, not run variability. The added six-line class field near the top shifted five existing SupabaseAuthService methods away from the function ranges recorded in `.code-multivitals-baseline.json`; their bodies and MI were unchanged, but baseline matching surfaced those warnings. Place the message `ReadonlyMap` after the class to preserve source ranges. Reviewer found no safe fetchAccount-only helper split that reaches MI≥65 without adding another warned helper.

40f1e paired pre-review is clear for a shared SessionDto projection: only `confirmEmail`, `confirmPasswordReset`, and `refreshSession` share identical successful account/token/duration fallback mapping. Extract that mapping once and retain each method's SDK/error/status behavior. Also move the unauthorized Map to module scope after the class. This is a meaningful deduplication, with fresh MI/count as a stop gate; `fetchAccount` remains unresolved separately.

40f1c complexity checkpoint: root complexity is 3,476 files / 9,456 functions / 379 warnings / 0 errors, down from 381. `fetchAccount` remains MI 55.3 and `fetchAccountErrorResponse` MI 54.6, both below 65. The assignment's stop condition prevented further checks or tests. Evidence: `/tmp/stardust-mutation40f1c-complexity.log`; a revised paired decomposition is needed.

40f1b Builder source checkpoint: moved successful account response construction to `createFetchAccountResponse(user)`, reduced `fetchAccountErrorResponse` to classifier dispatch plus the existing `supabaseAuthError` fallback, and isolated the exact bad_jwt/session_expired/default unauthorized responses in `unauthorizedFetchAccountResponse(error)`. The sole SDK `getUser()` call and existing classifier remain unchanged. No sensors have run after this edit; definitions, fresh source/complexity inspection, and focused/root verification remain pending.

40f1b complexity checkpoint: root complexity is 3,476 files / 9,458 functions / 381 warnings / 0 errors, up from 379. The four target MI values are `fetchAccount` 64.1, `createFetchAccountResponse` 61.9, `fetchAccountErrorResponse` 63.0, and `unauthorizedFetchAccountResponse` 56.0, all below 65. Per the explicit stop condition, no further checks or tests ran. Evidence: `/tmp/stardust-mutation40f1b-complexity.log`; this path needs a revised paired decomposition.
40d paired post-review accepted without findings. It confirms both bearer/receipt order and direct Hono callback binding. Mutation40d is complete locally; the edited file has no complexity markers while the overall count remains 380 warnings/0 errors, so CI-09 continues across the remaining paths.

40f1e Builder source checkpoint: moved the specialized unauthorized message Map out of the class to module scope after it, restoring class member offsets. Extracted the exact shared successful SessionDto projection for `confirmEmail`, `confirmPasswordReset`, and `refreshSession` into `createSessionDto(user, session)`. The three callers retain their own SDK operation, error handling, response status, nullish fallbacks, and exactly one username projection. No sensors have run after this edit; definitions, fresh CodeGraph, and root complexity are next.

40f1e complexity checkpoint: root complexity reports 3,476 files / 9,457 functions / 385 warnings / 0 errors, up one from 384. `createSessionDto` is MI 59.3; the three target methods are `confirmEmail` 53.0, `confirmPasswordReset` 50.4, and `refreshSession` 57.9. Both explicit stop gates failed; no formatting, type, unit, or integration checks ran. Evidence: `/tmp/stardust-mutation40f1e-complexity.log`.

40f1e paired pre-review disposition: the deduplication is behavior-preserving but not a CI-09 correction; it adds one MI-only warning and every target remains below MI 65. Expanding to `signIn` would merge distinct fallback, required-field, error, and status contracts; further extraction would relocate the warning. No safe local decomposition meets the gate. Preserve the module-level Map after the class to retain baseline ranges. `SupabaseAuthService.ts` remains unresolved for CI-09; no post-review or behavioral test is claimed for this stopped attempt. Next bounded ownership is 40g `ApiKeysRouter.ts`, pending its own CodeGraph scope and paired pre-review.

40g1 paired Server pre-review is clear for only the ApiKeysRouter rename/revoke `/:apiKeyId` family. CodeGraph reports low-MI registration methods `registerCreateApiKeyRoute` 58.6, `registerRenameApiKeyRoute` 54.3 and `registerRevokeApiKeyRoute` 56.0, plus inline callbacks 61.9/63.2/63.2 and list callback 63.2; this assignment excludes Create/List. Approved boundary extracts the shared auth → engineer-profile → ID validation middleware chain and separate private rename/revoke handler delegates; PUT keeps name-body validation after ID validation. Preserve HonoHttp/Drizzle repository construction timing/order, context values, controller response and thrown errors, and exactly one `sendResponse`. Fresh affected-function MI must be ≥65 and root warnings must fall; fail that gate closed. No implementation has started; Plan and Spec definition gates are the next exits.

40g1 Builder source checkpoint: `ApiKeysRouter.ts` now shares the PUT/DELETE `apiKeyIdMiddlewares()` chain in auth → engineer-profile → ID-validation order, with PUT name-body validation afterward. Separate rename/revoke handlers retain distinct controller calls, repository construction through the same HonoHttp context, thrown errors and one `sendResponse` each; route paths and verbs are unchanged. Existing Create/List migration changes in the same file were not altered by this sublot. No sensors/tests have run after this edit; complexity is the next stop-gate, so no behavior or CI-09 acceptance is yet claimed.

40g1 complexity checkpoint: official root complexity reports 3,476 files / 9,461 functions / 382 warnings / 0 errors, down from 385 immediately before this route-family edit. `registerRenameApiKeyRoute`, `registerRevokeApiKeyRoute`, and their private handler delegates no longer appear as MI-only warnings; shared `apiKeyIdMiddlewares` remains MI 62.8. Per the assignment, validation stopped at this failed MI≥65 gate; no formatter, types, unit, integration, or post-review evidence is claimed. Evidence: `/tmp/stardust-mutation40g1-complexity.log`; paired re-review of the shared middleware boundary is required.

40g2 paired Server pre-review is clear for a private `apiKeyAccessMiddlewares()` containing the existing authentication → engineer-profile pair, with `apiKeyIdMiddlewares()` composing that helper followed by the unchanged route-param validation. Rename and Revoke continue to use the same ID helper; PUT name validation remains after it, DELETE has no body validation. This is a meaningful separation of common access policy from resource-specific ID constraint and preserves call sites/order. No implementation has started for the correction; fresh MI/count remains a stop gate.

40g2 Builder source checkpoint: added `apiKeyAccessMiddlewares()` returning auth then engineer-profile; `apiKeyIdMiddlewares()` composes the returned tuple with the existing ID-param validation. Rename/Revoke call sites, PUT body-validation position, and DELETE’s lack of body validation are unchanged. CodeGraph and diff inspection completed; no sensors/tests have run after this correction. Root complexity is next; behavior and CI-09 acceptance remain pending.

40g2 complexity checkpoint: official root complexity reports 3,476 files / 9,462 functions / 382 warnings / 0 errors. `apiKeyAccessMiddlewares` clears MI 65, while `apiKeyIdMiddlewares` remains MI 64.4; total count is unchanged from 40g1. The assignment stop gate failed, so no further validation or behavior acceptance is claimed. Evidence: `/tmp/stardust-mutation40g2-complexity.log`; a meaningful ID-schema boundary requires paired pre-review.

40g3 paired Server pre-review is clear for moving the exact `z.object({ apiKeyId: idSchema })` into module-level `apiKeyIdParamsSchema` after the class and passing it to the existing param validator. This preserves schema, validation order, route call sites and body-validation placement while keeping prior function ranges stable. The goal is to clear the MI64.4 helper and reduce root warnings; fresh metrics remain a fail-closed gate. No correction source edit has started.

40g3 Builder source checkpoint: `apiKeyIdParamsSchema` now contains the exact prior Zod object after the class, and `apiKeyIdMiddlewares` passes it to the same param validator. Middleware order and route/body-validation placement are unchanged. No sensors/tests have run after this correction; definitions and root complexity remain pending.

40g3 complexity checkpoint: official root complexity reports 3,476 files / 9,462 functions / 381 warnings / 0 errors, down one from the 40g2 report. `apiKeyIdMiddlewares` and the changed/new rename/revoke registration/handler functions no longer appear as MI<65 warnings. This bounded complexity gate passes. Behavior is still pending Biome, root detectors/tests, the applicable route regression and paired post-review. Evidence: `/tmp/stardust-mutation40g3-complexity.log`.

ACH-46: focused `npm exec biome check apps/server/src/app/hono/routers/auth/ApiKeysRouter.ts` failed with formatter-only changes requested for `registerRevokeApiKeyRoute` and `apiKeyRepository`; no semantic finding was emitted. Mark clean-format evidence stale until corrected. Root code/types/unit, route behavior and post-review have not run on this candidate. Retain the complexity evidence as source-equivalent pending a formatter-only correction; rerun after it.

ACH-46 correction source checkpoint: Biome formatter applied only the two requested layout changes in the same `ApiKeysRouter.ts` path. No behavior or contract changed. The pre-format complexity record is now stale and must be rerun; definition gates, focused Biome, root sensors/tests and behavior review remain pending.

Mutation40g3 ACH-46 verification: Plan/Spec definition gates passed; focused Biome on `ApiKeysRouter.ts` passed after correction. Fresh root complexity is 3,476 files / 9,462 functions / 381 warnings / 0 errors; assigned rename/revoke registrations, delegates, and middleware helpers are not MI<65 warnings. The lower total and target metrics survive formatting. Root code/types/unit, route behavior and paired post-review remain pending. Evidence: `/tmp/stardust-mutation40g3-ach46-complexity.log`.

ACH-47: root `npm run check:code` exited 1; Turbo reports `@stardust/server#check:code` as failed. The focused `ApiKeysRouter.ts` Biome check passed. Root output was truncated and includes warnings from multiple workspaces, so the exact Server diagnostics and relevance are unverified. No scope attribution or fix is claimed. Server/root code, root types/unit, API-key route regression and paired post-review remain pending; next diagnostic is an isolated Server check captured to a full log.

ACH-47 diagnosis: isolated `npm --workspace @stardust/server run check:code` exits 1 with six warnings, four infos, and one formatter error in `SupabaseAuthService.ts:523–526`, requiring only the existing `supabaseAuthError` call to fit on one line. No diagnostic points to the 40g route file. The 40g focused Biome check passed. Evidence: `/tmp/stardust-mutation40g3-server-code.log`. Next correction is formatter-only in the existing 40f service path; Server/root code and downstream checks remain failed/pending.

ACH-47 correction source checkpoint: formatted only the existing `supabaseAuthError<AccountDto>` fallback call in `SupabaseAuthService.ts` as required. No logic or contract changed. Prior root/Server `check:code` evidence is stale; fresh definition and code checks are required before proceeding. Types/unit/route regression/review remain pending.

Mutation40g3 ACH-47 verification: Plan/Spec definitions passed; root `npm run check:code` exits 0 after formatting the service fallback. Evidence: `/tmp/stardust-mutation40g3-ach47-code.log`. Root `check:types`, `test:unit`, actual API-key route regression and paired post-review remain pending.

Mutation40g3 root types verification: `npm run check:types` exited 0 (captured in `/tmp/stardust-mutation40g3-types.log`). Root code and types are green on the current candidate. Root `test:unit`, fresh local DB-backed API-key route regression and paired post-review remain pending.

Mutation40g3 root unit verification: `npm run test:unit` passed; Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1 (log `/tmp/stardust-mutation40g3-unit.log`). Route-level API-key behavior and paired Server post-review remain pending; controller unit suites do not validate the changed route middleware order.

40g3 coverage audit: route-test path discovery found no API-key route-level suite in `apps/server/src/tests/routes`; existing `RenameApiKeyController.test.ts` and `RevokeApiKeyController.test.ts` are controller unit coverage only. Do not treat them as proof of middleware routing. Paired coverage review and real-route regression are pending.

Mutation40g3 global conformance: `check:spec-implementation` with base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` failed. It reports 504 contracted paths, with failures including legacy `Remove` paths still present, contracted `Modify` paths unchanged from baseline, and required `Create` paths missing; 22 unrelated changed paths are ignored. `ApiKeysRouter.ts` has no reported conformance error. Full stdout was truncated in the tool result, so rerun captured evidence is required for exact count/path reconciliation. The 40g source-specific code/types/unit/complexity evidence is still valid for those exact snapshots, but integrated candidate readiness, full behavior, CI and conclusion remain blocked by global path conformance.

Captured conformance diagnostic: 140 errors: 122 remove paths still exist, 16 modify paths are unchanged, and 2 create paths are missing. Base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` equals current HEAD. Full output: `/tmp/stardust-mutation40g3-spec-implementation.log`. These global mismatches must be reconciled; they are not attributed to mutation40g.

40f1f paired Server pre-review is clear to remove only the failed complexity-experiment edits in `SupabaseAuthService.ts`: restore inline SessionDto projections and original inline `fetchAccount` branches, remove the new helpers/message Map and unused Session import. Keep `isUnauthorizedFetchAccountError`, sign-up nonce/eligibility implementation, SupabaseClient migration and unrelated code. Reviewer confirms identical fields/defaults/username evaluation/error/status/fallback semantics; fresh complexity must show root warnings lower than 381. This cleanup reduces warning regressions but does not resolve the original low-MI auth methods. No implementation has started.

40f1f source checkpoint: restored the inline session DTO projections and inline fetchAccount branches; removed only createSessionDto, fetchAccountErrorResponse, the unauthorized message Map and SupabaseSession import. Existing classifier, sign-up nonce/eligibility and SupabaseClient migration remain. No sensors have run after this correction; complexity is next.

40f1f complexity checkpoint: official root complexity reports 3,476 files / 9,460 functions / 379 warnings / 0 errors, down from 381. Experiment-only helpers are absent; original low-MI AuthService functions remain. This cleanup reduces two warnings introduced by the failed experiment but does not close CI-09. Evidence: `/tmp/stardust-mutation40f1f-complexity.log`; focused Biome, root code/types/unit and paired review of the cleanup remain pending.

40f1f ACH-49 verification: focused Biome passed on AuthService and ApiKeysRouter. Fresh root complexity is 3,476 files / 9,460 functions / 374 warnings / 0 errors. No assigned 40g rename/revoke helper is warned; several original AuthService functions remain below MI65. Evidence: `/tmp/stardust-mutation40f1f-ach49-complexity.log`. Root code/types/unit are stale after 40f1f and pending; paired post-review and 140-error conformance remain open.

40f1f ACH-49 conformance rerun: `check:spec-implementation` still fails with 140 global errors (122 Remove paths still present, 16 Modify paths unchanged, 2 Create paths missing; 22 unrelated ignored). Neither changed Server source path is named. Full log: `/tmp/stardust-mutation40f1f-ach49-spec-implementation.log`. This remains a candidate-level blocker; this record does not waive it.

40f1f root code verification: `npm run check:code` passed on the formatted restored-source candidate (log `/tmp/stardust-mutation40f1f-ach49-code.log`). Root types/unit and paired Server post-review remain pending.

40f1f root types verification: `npm run check:types` passed (log `/tmp/stardust-mutation40f1f-ach49-types.log`). Root code/types are green; root unit, behavior review, and global path conformance remain open.

40f1f root unit verification: `npm run test:unit` passed across all five workspaces: Core176/638, Server169/330, Web118/506, Studio14/64, LSP1/1 (log `/tmp/stardust-mutation40f1f-ach49-unit.log`). Code/types/unit now pass after rollback. No route integration or paired review is claimed; global spec path conformance remains failed.

Paired Server post-review accepted mutation40g1–40g3 locally, no findings. It confirms exact PUT/DELETE flow and behavior: auth → engineer-insignia → ID validation; PUT name validation follows; DELETE has no body validation; routes keep distinct controller calls, identical HonoHttp/Drizzle repository access, thrown-error propagation and one response send each. Assigned route methods/delegates/helpers clear MI65; fresh root is 374 warnings/0 errors. Root units include Rename/Revoke controller suites. Limitation: no API-key route-level integration test is contracted or present, so direct middleware-to-Drizzle coverage is absent. Global integration remains pending.

Paired Server post-review accepted mutation40f1f as a behavior-preserving cleanup rollback. Restored inline projections and fetchAccount branches preserve exact current values/errors/statuses; signup nonce/eligibility and SupabaseClient migration remain. It clears only warnings introduced by the failed decomposition; original AuthService low-MI methods remain open. Both local slices are accepted, but full candidate readiness is blocked by the 140 global Spec path mismatches and pending full Server integration.

40h1 paired Server pre-review is clear for only the regular and God password sign-in routes in `AuthRouter.ts`. Approved shared registration and request-handling helpers retain each POST path, JSON validation-before-handler, HonoHttp → SupabaseAuthService construction, route-specific controller factory, awaited handle, and one sendResponse. Regular sign-in retains its `InngestBroker`; God sign-in retains its distinct controller with no broker. Sign-up/retry/OAuth/refresh/cookie flows are excluded. Fresh complexity must show all resulting functions MI≥65 and lower the 374 root count; no source edit has started.

Mutation40h1 source checkpoint: both password sign-in registrations now call shared `registerSignInPath(path, controllerFactory)`. The helper keeps email/password validation, HonoHttp → SupabaseAuthService construction, controller factory, awaited handle and one sendResponse. Regular factory keeps a fresh InngestBroker; God factory uses the God controller without it. No other AuthRouter routes changed. No sensors have run after this edit.

40h1 complexity checkpoint: official root complexity is 3,476 files / 9,462 functions / 373 warnings / 0 errors, one lower than 374. The new `registerSignInPath` helper remains MI58.8, so the assignment stop gate fails despite a lower total. No formatter, code/types/unit, integration or post-review checks ran. Evidence: `/tmp/stardust-mutation40h1-complexity.log`; obtain revised pre-review before further source changes.

40h2 paired Server pre-review is clear to reduce `registerSignInPath` to exact POST + existing JSON validation and a one-expression callback to new private `handleSignInPath(context, controllerFactory)`. Handler preserves current HonoHttp → SupabaseAuthService → route-specific factory → awaited handle → single sendResponse sequence. Hono `Context` type import is permitted. Broker remains regular-route-only; God controller remains separate. Fresh helper/callback MI and root count must pass before broader validation.

40h3 paired Server pre-review is clear to move the exact email/password Zod shape into module-level `credentialsSignInSchema` after the class, then pass it to the same `validate('json', ...)` call. The route path, validation-before-handler order, exact schema, controller factories and request flow remain. This is a meaningful shared contract constant and may clear `registerSignInPath` MI62.4; fresh MI/root count remain the gate.

Mutation40h3 source checkpoint: extracted the exact credentials schema to module scope after the class and reused it in `registerSignInPath`. No path, order, shape, factory or request behavior changed. No sensors/tests have run after the edit.

Mutation40h2 source checkpoint: added the Hono `Context` type and extracted current request handling into `handleSignInPath`; `registerSignInPath` retains POST/path/JSON validation and delegates through a one-expression callback. HonoHttp → service → factory → awaited handle → single sendResponse, regular/God factory distinction, and route call sites remain. No sensors/tests have run.

40h2 complexity checkpoint: root complexity is 3,476 files / 9,463 functions / 373 warnings / 0 errors. `handleSignInPath` is not MI-warned; `registerSignInPath` remains MI62.4 and total is unchanged. Per stop rule, no Biome/types/unit/integration/post-review ran. Evidence: `/tmp/stardust-mutation40h2-complexity.log`; revised paired pre-review needed.

40f1f conformance rerun: `check:spec-implementation` remains failed with 140 global errors: 122 Remove paths still present, 16 Modify paths unchanged, 2 Create paths missing; 22 unrelated paths ignored. Full evidence `/tmp/stardust-mutation40f1f-spec-implementation.log`. This does not identify the targeted AuthService path as a conformance error; global preflight remains open despite the 40f and 40g source paths matching the map.

ACH-49: focused Biome check on `SupabaseAuthService.ts` and `ApiKeysRouter.ts` found two formatting adjustments in the restored AuthService (Supabase type import layout and multiline error fallback); no semantic issue. `git diff --check` passed. Root code/types/unit remain pending. Apply only Biome formatting, then rerun definitions and affected sensors.

ACH-49 correction checkpoint: applied the two requested formatting changes only. Prior Biome/complexity snapshots are stale after formatting; no behavior changed. Focused Biome, fresh complexity, and root detectors/tests remain pending.

Mutation40h3 complexity checkpoint: root `check:complexity` reports 3,476 files / 9,463 functions / 371 warnings / 0 errors. The sign-in registration, request handler, and delegate callback are clear of MI<65 warnings; the targeted gate passes, reducing the root total by two from 373. Evidence: `/tmp/stardust-mutation40h3-complexity.log`. Focused Biome, root code/types/unit, fresh spec implementation preflight, and paired Server post-review remain pending.

Mutation40h3 validation correction: focused Biome found one formatter-only wrap required in the regular sign-in registration call. No semantic issue. Apply formatting, then repeat definitions and affected sensors.

Mutation40h3 formatting source checkpoint: Builder applied only the formatter-requested multiline layout in AuthRouter. Semantics unchanged; previous check evidence is stale after this source edit. Rerun definitions, focused Biome, root code/types/unit, and the conformance preflight.

Mutation40h3 validation checkpoint: Spec and Plan definition checks pass. Focused Biome, root `check:code`, `check:types`, and `test:unit` pass; Server unit result is 169 suites / 330 tests. Root complexity reports 3,476 files / 9,463 functions / 372 warnings / 0 errors; the edited sign-in registration, handler, and callback are absent from MI<65 findings, and the root total is lower than the 373-warning pre-slice count. The global `check:spec-implementation` gate still fails with 140 path errors: 122 Remove paths remain, 16 Modify paths are unchanged, 2 Create paths are missing, and 22 unrelated paths are ignored. Evidence: `/tmp/stardust-mutation40h3-complexity-final.log`, `/tmp/stardust-mutation40h3-types.log`, `/tmp/stardust-mutation40h3-unit.log`, `/tmp/stardust-mutation40h3-spec-implementation-final.log`; root code check exited zero in the detector run. Paired Server post-review and all remaining warning groups/conformance corrections remain outstanding.

Mutation40h3 paired post-review accepted locally with no findings. Both password sign-in paths, validation order/schema, route-specific controller construction, request sequence, error propagation and single response send are preserved. Focused and root local gates pass. This acceptance does not close global path conformance (140 errors) or full Server integration.

Mutation40h4 paired Server pre-review is clear for only the Google/GitHub sign-in redirect pair in AuthRouter. Approved exact shared query schema, parameterized registration with the same GET paths and validation order, route-specific factories, and straight-line per-request handler preserve HonoHttp → SupabaseAuthService → controller → awaited handle → one response send. No source changes yet; Builder proceeds only within that boundary and fresh complexity must beat 372 without MI<65 targets.

Mutation40h4 Builder source checkpoint: only the paired Google/GitHub sign-in routes and their private helpers/schema changed. Shared GET registration/schema and separate controller factories preserve each path and exact request flow. No sensors/tests have run; fresh complexity is the stop gate.

Mutation40h4 validation checkpoint: definition gates, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,466 functions / 370 warnings / 0 errors, two fewer than the 372-warning pre-slice count; the changed/new provider sign-in functions do not appear in MI<65 results. Global Spec implementation conformance remains failed at 140 errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated paths ignored). Evidence: `/tmp/stardust-mutation40h4-complexity.log`, `/tmp/stardust-mutation40h4-code.log`, `/tmp/stardust-mutation40h4-types.log`, `/tmp/stardust-mutation40h4-unit.log`, `/tmp/stardust-mutation40h4-spec-implementation.log`. Paired post-review remains pending.

Mutation40h4 paired Server post-review accepted locally with no findings. Both GET redirect paths retain the exact query validation and provider controller, service/handler order, error propagation and single response send. Reviewer confirms the assigned helper functions clear CI-09 at 370 warnings. Private helper names in the Plan were corrected to match source; no behavioral impact. Global conformance remains at 140 path errors.

Mutation40h5 paired Server pre-review is clear for only the authenticated Google/GitHub connection routes. Approved reuse of `socialSignInQuerySchema`, shared registration and a separate request handler. The exact POST path and auth → query validation → handler order, controller-specific factories, HonoHttp → `getSupabase()` → service → awaited handle → single response sequence, thrown errors and redirect/cookie/status/headers remain. The accepted 40h4 helpers are out of scope. No source changes yet.

Mutation40h5 Builder source checkpoint: only the two authenticated provider connection route methods and approved private helpers changed. Both preserve exact POST paths and auth-before-query validation; shared schema reused. Handler retains HonoHttp → SupabaseAuthService → provider controller → awaited handle → one response send. No tests/sensors have run.

Mutation40h5 validation correction: focused Biome requests a formatter-only one-line callback layout in the shared connection registration helper. No behavior change; apply before refreshing complexity and other sensors.

Mutation40h5 formatting source checkpoint: only the requested callback wrapping changed. Semantics unchanged; complexity and focused Biome snapshots are stale and must be rerun after definition gates.

Mutation40h5 validation checkpoint: definition gates, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,469 functions / 368 warnings / 0 errors; assigned connect route functions/helpers do not appear in MI<65 findings, two fewer warnings than the 370 pre-slice count. Global Spec implementation still fails with 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h5-complexity-final.log`, `/tmp/stardust-mutation40h5-code.log`, `/tmp/stardust-mutation40h5-types.log`, `/tmp/stardust-mutation40h5-unit.log`, `/tmp/stardust-mutation40h5-spec-implementation.log`. Paired post-review remains pending.

Mutation40h5 paired Server post-review accepted locally with no findings. The authenticated connection route order, paths, schema reuse, provider factories, request flow and response/error semantics are preserved. The assigned functions clear CI-09 with root complexity at 368. Candidate-wide Spec conformance remains at 140 errors.

Mutation40h6 paired Server pre-review is clear for only the resend-signup-email and request-password-reset POST routes. Approved exact `emailOnlySchema`, shared registration/handler, literal paths and distinct controller factories. Validation remains before handler; per-request HonoHttp/service/controller/awaited response order, errors and one sendResponse remain. No source change yet.

Mutation40h6 Builder source checkpoint: only the approved two email route registrations and pair-private shared schema/helpers changed. Distinct controllers and request/response order remain. No checks/tests have run.

Mutation40h6 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,472 functions / 366 warnings / 0 errors, two fewer than 368 pre-slice; assigned email route methods/helpers are clear of MI<65 findings. Global Spec implementation still fails with 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h6-complexity.log`, `/tmp/stardust-mutation40h6-code.log`, `/tmp/stardust-mutation40h6-types.log`, `/tmp/stardust-mutation40h6-unit.log`, `/tmp/stardust-mutation40h6-spec-implementation.log`. Paired post-review pending.

Mutation40h6 paired Server post-review accepted locally with no findings. Exact email routes/schema/validation, distinct controllers, service/request ordering, error propagation and one response send are preserved. Assigned warning gate resolved at 366; global path conformance remains 140 errors.

Mutation40h7 paired Server pre-review permits only naming the exact refresh-token JSON schema after the class and reusing it in the unchanged validator. This is meaningful but MI clearance is uncertain; no helper extraction is approved. If the method remains warned or root total does not fall below 366, stop this slice and request a new review before broadening.

Mutation40h7 Builder source checkpoint: extracted the exact `refreshSessionSchema` module constant and reused it at the same validator position. No other change; fresh complexity not yet run.

Mutation40h7 complexity gate failed: root is 3,476 files / 9,472 functions / 360 warnings / 0 errors, but `registerRefreshSessionRoute` remains at MI63.6 (below 65). The lower aggregate count does not satisfy the target gate. Following paired pre-review, no further sensors or source changes proceed until revised paired pre-review approves a meaningful boundary. Evidence: `/tmp/stardust-mutation40h7-complexity.log`.

Mutation40h7 correction pre-review is clear for extracting the existing per-request callback body verbatim into `handleRefreshSessionPath(context: Context)`, leaving route method/path/schema validator in place and delegating via callback. This is a cohesive registration/request-execution boundary; no other route changes. The same MI≥65 and root<360 stop gate applies.

Mutation40h7 correction source checkpoint: extracted only the existing refresh-session callback body and delegated through the new private handler. No sensors/tests run yet.

Mutation40h7 correction complexity checkpoint: target route/helper/callback clear MI65; root is 3,476 files / 9,473 functions / 365 warnings / 0 errors, one below the pre-slice baseline of 366. The paired reviewer reassessed the earlier `<360` condition as too strict because it used an interim schema-only count. The correct gate is below pre-slice baseline with assigned target clear; proceed to focused Biome/types/unit and post-review. No further route decomposition.

Mutation40h7 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity remains 3,476 files / 9,473 functions / 365 warnings / 0 errors; assigned route/helper/callback clear MI<65 and root is one lower than pre-slice baseline. Global Spec implementation still has 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h7-correction-complexity.log`, `/tmp/stardust-mutation40h7-code.log`, `/tmp/stardust-mutation40h7-types.log`, `/tmp/stardust-mutation40h7-unit.log`, `/tmp/stardust-mutation40h7-spec-implementation.log`. Paired post-review pending.

Mutation40h7 paired Server post-review accepted with no findings. Exact refresh-session route/schema/order, error propagation and one response send remain; assigned functions clear MI65, root is 365 vs 366 pre-slice. Global Spec implementation remains 140 errors.

Mutation40h8 paired Server pre-review is clear for only the email/password confirmation route pair. Approved exact shared token schema, route registration helper with literal paths/factories, and separate request handler. Email path keeps per-request InngestBroker; password-reset path has none. Validation order, controller behavior, errors and single response remain. No source edits yet.

Mutation40h8 Builder source checkpoint: only the two confirmation route registrations and approved schema/helpers changed. Exact paths/schema/order and distinct broker/controller factories remain. No checks/tests have run.

Mutation40h8 parse failure: fresh complexity reports a parse error in AuthRouter.ts at the two stale closing tokens left after extracting the former inline handler. Its 356-warning count is invalid because the file was skipped. Remove only those tokens and rerun definition gates and validation; no behavioral changes.

Mutation40h8 syntax source checkpoint: removed only the two stale tokens. Source now parses according to focused diff inspection; all prior checks are stale and must be rerun.

Mutation40h8 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Valid complexity is 3,476 files / 9,476 functions / 362 warnings / 0 errors; assigned routes/helpers clear MI<65 and root is 3 below 365 pre-slice. Global Spec implementation remains at 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h8-complexity-final.log`, `/tmp/stardust-mutation40h8-code.log`, `/tmp/stardust-mutation40h8-types.log`, `/tmp/stardust-mutation40h8-unit.log`, `/tmp/stardust-mutation40h8-spec-implementation.log`. Paired post-review pending.

Mutation40h8 paired Server post-review accepted with no findings. Exact confirmation path/schema/order and distinct per-request controllers are preserved, including broker creation only on email confirmation. Valid root complexity is 362 vs 365 pre-slice. Global path conformance remains 140 errors.

Mutation40h9 paired Server pre-review is clear for the reset-password route’s exact named schema and one request handler. PATCH/path/schema validation position, per-request HonoHttp→service→controller→awaited handle→one response behavior, errors and response are preserved. No generic factory or other route edits.

Mutation40h9 Builder source checkpoint: only the PATCH route, its exact schema constant, and private handler changed as approved. No sensors or tests have run.

Mutation40h9 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,477 functions / 361 warnings / 0 errors; assigned route/schema/handler/delegate clear MI<65 and root is one lower than 362 pre-slice. Global Spec implementation remains at 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h9-complexity.log`, `/tmp/stardust-mutation40h9-code.log`, `/tmp/stardust-mutation40h9-types.log`, `/tmp/stardust-mutation40h9-unit.log`, `/tmp/stardust-mutation40h9-spec-implementation.log`. Paired post-review pending.

Mutation40h9 paired Server post-review accepted locally with no findings. Reset-password path/schema/validation, request sequence, errors and single response preserved; assigned functions clear CI-09 at 361 vs 362 pre-slice. Global conformance still 140 errors.

Mutation40h10 paired Server pre-review is clear for only `registerRetryUserCreationRoute` and a private request helper. Keep auth → profile absence middleware order; move the existing per-request HonoHttp/service/broker/controller/response body verbatim. No schema/generic helper/other route changes; require fresh MI≥65 and root <361.

Mutation40h10 Builder source checkpoint: route callback now delegates to `handleRetryUserCreation(context)` with body moved as approved. Middleware order and request flow remain unchanged; no checks run.

Mutation40h10 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,478 functions / 360 warnings / 0 errors; assigned functions clear MI<65 and root is one below 361 pre-slice. Global Spec implementation remains at 140 errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h10-complexity.log`, `/tmp/stardust-mutation40h10-code.log`, `/tmp/stardust-mutation40h10-types.log`, `/tmp/stardust-mutation40h10-unit.log`, `/tmp/stardust-mutation40h10-spec-implementation.log`. Paired post-review pending.

Mutation40h10 paired Server post-review accepted locally with no findings. The retry route retains auth → profile-absence middleware order, per-request construction, error propagation and single response send. CI-09 target clear at 360 vs 361 pre-slice; global conformance remains open.

Mutation40h11 paired Server pre-review permits only extracting the social-account signup callback into a private handler. Preserve POST path, accountSchema validation → profile verification order, and exact HonoHttp → InngestBroker → SignUpWithSocialAccountController → awaited handle → one response sequence. No SupabaseAuthService is constructed by this route. No other edits.

Mutation40h11 Builder source checkpoint: the approved callback extraction is complete. Path, both middleware order, broker/controller sequence and response are unchanged; no tests/sensors run.

Mutation40h11 validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Complexity is 3,476 files / 9,479 functions / 359 warnings / 0 errors; assigned method/helper/delegate clear MI<65 and root is one below 360 pre-slice. Global Spec implementation remains at 140 errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h11-complexity.log`, `/tmp/stardust-mutation40h11-code.log`, `/tmp/stardust-mutation40h11-types.log`, `/tmp/stardust-mutation40h11-unit.log`, `/tmp/stardust-mutation40h11-spec-implementation.log`. Paired post-review pending.

Mutation40h11 paired Server post-review accepted locally with no findings. Signup path, validation→profile verification order, broker/controller and response are preserved; route does not add SupabaseAuthService. Target clears CI-09 at 359. Global conformance remains 140 errors.

Mutation40h12 paired Server pre-review is clear for the regular signup route only: exact named schema and private request handler. Preserve validator-before-handler and per-request HonoHttp/service/InngestBroker/NodeOnboardingReceiptProvider/SignUpController construction and response sequence; no other route edits.

Mutation40h12 Builder source checkpoint: regular signup route now uses exact module-level schema and delegates to private handler. Request construction/arguments/order remain as approved; no checks/tests yet.

Mutation40h12 complexity gate failed: root is 3,476 files / 9,480 functions / 358 warnings / 0 errors; route registration clears, but new `handleSignUpPath` is MI60.8 and remains warned. No Biome/types/tests proceed until paired pre-review approves a revised cohesive boundary within this route. Evidence: `/tmp/stardust-mutation40h12-complexity.log`.

Mutation40h12 correction pre-review approves one route-local composition helper `createSignUpController(http)`, separating dependency wiring (service, broker, receipt provider, controller) from HTTP request execution. Preserve exact construction order and per-request behavior; handler still creates HonoHttp, calls factory, awaits handle, sends once. No further helper subdivision; if fresh MI/root gate fails, rollback and leave the warning unresolved.

Mutation40h12 correction source checkpoint: dependency composition now lives in `createSignUpController(http)` with exact approved construction order; `handleSignUpPath` retains per-request HTTP execution and response. No sensors run; fresh complexity is the hard stop.

Mutation40h12 correction gate failed: `createSignUpController` remains MI62.8, although route/helper and root total (358) improved. Following paired pre-review, no further helper subdivision is permitted. Roll back the entire 40h12 schema/handler/factory experiment to the original regular-signup route; leave the warning unresolved. Evidence: `/tmp/stardust-mutation40h12-correction-complexity.log`.

Mutation40h12 rollback source checkpoint: restored the original regular-signup route and removed only h12-specific schema/handler/factory. Other accepted AuthRouter changes remain untouched. This target stays unresolved; rerun definitions and all required root detectors/tests/complexity.

Mutation40h12 rollback validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Fresh complexity is 3,476 files / 9,479 functions / 359 warnings / 0 errors, matching pre-slice. Spec implementation remains at 140 errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h12-rollback-complexity.log`, `/tmp/stardust-mutation40h12-rollback-code.log`, `/tmp/stardust-mutation40h12-rollback-types.log`, `/tmp/stardust-mutation40h12-rollback-unit.log`, `/tmp/stardust-mutation40h12-rollback-spec-implementation.log`. The target remains unresolved by paired pre-review instruction.

Mutation40h13 paired Server pre-review approves only three contiguous, named groups for authentication entry, social-account operations, and account lifecycle. All existing route calls remain exactly once and in original order; API-key router construction stays before groups, mount stays after all groups, return remains last. No route-body changes. All group helpers/registerRoutes must clear MI65; root<359.

Mutation40h13 Builder source checkpoint: added the three approved contiguous registration groups. `registerRoutes` retains API-key construction, group order, API-key mount, and returned router order; route bodies untouched. No checks run.

Mutation40h13 complexity gate failed: root remains 3,476 files / 9,482 functions / 359 warnings / 0 errors; `registerAuthenticationEntryRoutes` is MI63.4. Following paired pre-review, no further helper splitting is allowed. Roll back all h13 helpers/grouping and leave the warning unresolved. Evidence: `/tmp/stardust-mutation40h13-complexity.log`.

Mutation40h13 rollback source checkpoint: restored the original direct route-call list in `registerRoutes` and removed only h13 grouping helpers. API-key order and all other accepted AuthRouter changes remain. Target unresolved; checks must rerun.

Mutation40h13 rollback validation checkpoint: definitions, focused Biome, root code/types/unit pass; Server unit is 169 suites / 330 tests. Root complexity is restored to 3,476 files / 9,479 functions / 359 warnings / 0 errors. Global conformance remains at 140 path errors (122 Remove present / 16 unchanged Modify / 2 missing Create; 22 unrelated ignored). Evidence: `/tmp/stardust-mutation40h13-rollback-complexity.log`, `/tmp/stardust-mutation40h13-rollback-code.log`, `/tmp/stardust-mutation40h13-rollback-types.log`, `/tmp/stardust-mutation40h13-rollback-unit.log`, `/tmp/stardust-mutation40h13-rollback-spec-implementation.log`. h13 remains unresolved per reviewer stop guidance.

Mutation41 inventory: root complexity stands at 359 warnings / 0 errors. Largest Server groups include UsersRouter (36 findings), ChallengesRouter (33), SupabaseAuthService (18), and FeedbackRouter (17). Start with one paired-review bounded UsersRouter route pair; candidate-wide conformance and full Server integration remain open.

Mutation41a paired Server pre-review approves only the username/email availability route pair in UsersRouter. Exact paths, per-query schema and distinct controller factories remain; shared GET registration and handler preserve validation-before-handler, per-request HonoHttp/repository construction, await and single response. No auth middleware, normalization, catches, or other route changes. Require every affected/new function MI≥65 and root<359.

Mutation41a Builder source checkpoint: only the two availability routes and approved shared helpers changed. Exact paths/query schemas/controllers and validation/request ordering remain. No checks have run.

Mutation41a complexity gate failed: root is 3,476 files / 9,482 functions / 356 warnings / 0 errors; `handleVerifyUserInUseRoute` remains MI63.2 while all other assigned functions clear. Stop before broader validation and request paired review for a meaningful correction or rollback. Evidence: `/tmp/stardust-mutation41a-complexity.log`.

Mutation41a rollback: restored the two availability route methods to their pre-41a inline implementations while retaining the surrounding Drizzle migration. Paired reviewer rationale: there is no meaningful sub-boundary for the shared handler, and additional mechanical splits were rejected. Removed only the 41a helpers and `Context` import; preserved unrelated UsersRouter changes. Fresh definition checks and root complexity are pending.

Mutation42a Builder source checkpoint: only the ID and slug fetch registrations in `ChallengesRouter.ts` now share registration and handler helpers. Exact GET paths, route-specific parameter schemas, validation-before-handler order, unauthenticated access, per-request repository/controller construction, awaited handle and single response send are preserved. No other route changed. Plan/Spec definitions and fresh root complexity are the next gates.

Mutation42a rollback: restored both routes to their pre-42a inline implementations while retaining Drizzle migration changes. Paired pre-review rationale: there is no meaningful sub-boundary for the handler, and further mechanical splits were rejected. Removed only the 42a helpers and `Context` import; unrelated ChallengesRouter changes remain. Fresh definitions and root complexity are pending.

Mutation43a Builder source checkpoint: only `HonoHttp.sendResponse` changed, delegating header policy and body mapping to two private helpers. Passthrough, header order/filtering, status assignment order, and exact failure/no-content/success body behavior remain. Plan/Spec definitions and fresh root complexity are next.

Mutation43a rollback: restored the original inline `sendResponse` and removed only its two 43a helpers. Paired reviewer rationale: `sendResponse` and both helpers remained below MI65, while root warnings increased; further subdivisions were rejected. Other HonoHttp changes are preserved. Definitions and fresh root complexity are pending.

Mutation44a Builder source checkpoint: four social OAuth/connection methods now delegate their existing SDK promises and exact error messages to one URL-response mapper. Provider literals, redirect values, SDK operations/order, Supabase error mapping, and success response shape remain unchanged. No other service method/file changed. Definitions and fresh root complexity are next.

Mutation44a correction checkpoint: the single helper now owns the SDK request selection (`signInWithOAuth` versus `linkIdentity`) and response mapping, parameterized by provider, return URL, intent, and exact fallback. Four public methods delegate with their existing values/messages. This is the only approved correction; no further splits are permitted if the metric gate fails.

Mutation44a rollback: restored all four OAuth/account-link methods and removed the helper after the approved correction remained MI60. Paired reviewer stop rule prohibits further subdivision; unrelated service changes remain. Definitions and fresh root complexity are pending.

Mutation45a Builder source checkpoint: `respondToAppError` uses an ordered class/status policy with short-circuiting lookup. Auth, not-found, conflict, validation, and not-allowed precedence/constants, logs, response body, fallback status and one JSON response are preserved. No other method/file changed. Definitions and root complexity are next.

Mutation45a rollback: restored the original inline error-class/status mapping and removed the policy data after the method remained MI58.2 and root warnings stayed at 359. No further splitting is authorized by the gate; unrelated HonoApp edits remain. Definitions and fresh root complexity are pending.

Mutation46a Builder source checkpoint: `startNodeServer` uses direct try/await/catch retries with the same port order, exact EADDRINUSE development warning, same error identity for rethrows and final max-attempt error. No helper or `listenOnPort` changes. Definitions and root complexity are next.

Mutation46a rollback: restored the original promise callback flow after the method remained MI53.6/nestingDepth 4 and root warnings stayed at 359. No further split was approved by the gate; unrelated HonoApp changes remain. Definitions and fresh root complexity are pending.

### Principal verification — Server integration and sensors — 2026-10-05

After `npm run db:test -w @stardust/server`, the Server integration inventory was run in fresh serial Jest processes by route group after loading local database and MinIO variables from the root `.env.local` exporter. All 82 suites and 267 tests passed: Auth 15, Challenging 12, Forum 25, Global 8, Health 3, Profile 83, Reporting 43, Shop 52, Space 20, and Auth/MCP router suites 6. Monolithic and single-process full-suite attempts exceeded Node's 4 GB heap; the isolated groups completed successfully. Jest emitted its existing open-handle notice after some groups.

The principal fixed the shared Hono callback failure by making the three `AuthMiddleware` handlers instance-field callbacks, preserving their authentication/access sequencing. The user-feedback legacy test now uses privileged local SQL rather than revoked Data API access, and its persistence assertion derives summary counts from current rows. The root local environment exporter now supplies MinIO's local credentials/endpoint to Server tests when configured; `jest.setup.js` preserves explicit shell exports over `.env.testing`. Exporter tests passed 5/5 without printing credential values. The scoped Implementation Reviewer accepted these changes with no blocking findings.

Final sensors passed: root `check:code` (7 workspaces; existing warnings only), `check:types` (7/7), `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:architecture` (3874 modules/6988 dependencies), `check:test-integrity`, `check:complexity` (3476 files, 9479 functions, zero warnings/errors above the user-approved baseline), Spec definition, Plan definition and `git diff --check`. Server unit coverage passed 169 suites/330 tests at lines/statements51.63%, branches89.29%, functions36.81%; `check:coverage -- @stardust/server` remains failed because functions are below the unchanged 47.11% baseline. Do not rebaseline coverage; ACH-35 remains pending until the combined integration capture and planned D3 removal. No remote/production validation was performed.

### S2-47a assignment checkpoint — 2026-10-05

At HEAD `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, the Server integration inventory has fresh serial evidence for 82 suites / 267 tests. A read-only CodeGraph audit found that this does not fully satisfy EV-06: the current real `/profile/events` suite directly exercises final headers, signed-receipt stream expiry under backpressure, and abort/shutdown during an actually blocked PostgreSQL query, but does not prove created-profile identity/isolation or receipt/bearer rejection and precedence. A read-only S2 Builder audit also found no consolidated port/actor evidence crosswalk and no consolidated paired Builder Server review; its prior review covered only the callback, Reporting fixture and local environment fixes. Server coverage is 36.81% functions against the unchanged 47.11% baseline. These are open; no S2 completion is claimed.

The principal recorded assignment S2-47a for the sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`: real Hono/OnboardingMiddleware, local Supabase Auth, signed receipts and Drizzle/PostgreSQL must prove persisted event identity, foreign-account non-disclosure, missing/tampered/expired receipt denial, and invalid/expired/forged bearer precedence without repository/service mocks. Assignment is `in_progress`; no source edit or new test evidence exists yet. Previous root sensors remain current only for the unchanged code diff; they do not validate this assignment. After its implementation, focused route/format checks and a paired review are required, then the invalidated integration evidence and S2 crosswalk must be refreshed. EV-06 lifecycle cases, the port/actor crosswalk, aggregate review, coverage ratchet, D3 cleanup and C2 gates remain pending.

S2-47a source checkpoint: Builder Server reports one-file change in `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`, adding eight real-route cases around persisted account identity, foreign account isolation, receipt denials and bearer precedence; the original four lifecycle cases remain. Focused Biome passed. The authorized serialized `db:test` preparation and route-suite execution are running; no result is claimed yet. The expired-bearer case currently crafts a JWT-shaped token with an expired claim rather than obtaining a genuinely Auth-signed expired token, so this limit remains open for paired review. The diff has not yet been independently inspected and no paired verdict exists. Root sensors and prior integration evidence are stale for this new test diff.

S2-47a current validation: `eval "$(node scripts/export-local-database-env.mjs)"` loaded the local stack variables without printing credentials; `npm run db:test -w @stardust/server` passed; focused Biome format/check passed; `npm run test:integration -w @stardust/server -- --runTestsByPath src/tests/routes/profile/StreamProfileCreationRoute.test.ts --runInBand` passed 1 suite / 12 tests (13.084s). `/tmp/stardust-s2-47a-db-test.log` and `/tmp/stardust-s2-47a-stream-route.log` hold outputs. Tests cover own persisted identity/event payload, foreign-account non-disclosure, receipt denials, and no fallback when a present invalid bearer accompanies another account's valid receipt. The expired-claim JWT is forged and therefore does not independently prove rejection of a genuinely Auth-signed expired JWT. The test diff remains pending principal inspection and paired read-only review; broader code/type/unit/coverage/conformance and consolidated S2 gates are not claimed current for this edit.

After S2-47a, the required path conformance preflight was rerun with `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; it remains failed at 140 errors (122 Remove paths present, 16 Modify unchanged, 2 Create missing; 24 unrelated paths ignored), with S2-47a not among the failures. This confirms the previously known unfinished paths, not completion. The one-file review is now in progress; root code/types/unit/integrity/architecture and coverage sensors must be refreshed before the slice can be accepted.

S2-47a paired Implementation Reviewer verdict: **failed** at HEAD `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. Blocking finding IR-01: all test requests use `fixture.hono.fetch(...)`, but `server-routes-testing-rules.md` section 13 requires `supertest` over `honoFixture.server`; no documented SSE exception applies to every request in the suite. The Reviewer accepted real identity/persistence assertions and found CA-11/CA-18 partial plus CA-19/CA-20 outside this slice; these remain broader S2 exits. Nonblocking limitation: the expired-claim bearer is a forged JWT and does not isolate a valid Auth-signed expired token. Rule disposition: `No change`; the rule is explicit. Correction S2-47a-F1 is assigned to the same stable Builder Server and sole test path, moving compatible ordinary HTTP assertions to Supertest and retaining direct Fetch only where stream reader/abort/shutdown control is necessary. Fresh focused tests and a paired re-review are required. No code correction has been applied yet; root sensor sessions started before this finding are not evidence for the corrected candidate.

Root sensors for the pre-correction S2-47a candidate: `npm run check:code` passed (7 workspaces, existing diagnostics only); `npm run test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1); `npm run check:types` failed in the assigned new test at lines107/110 because `receipt` inferred the UUID template-literal type from `randomUUID()` while AuthFixture returns `string`. This is recorded as ACH-50 and included in S2-47a-F1. The failed type result invalidates type evidence for this candidate; rerun types after the narrowly scoped helper correction.

S2-47a-F1 source checkpoint: the assigned single test file now uses Supertest over `fixture.server` for successful identity/event requests, HTTP denial cases and the final-header case. Direct Hono Fetch remains only where the test must hold/read/cancel the live stream or trigger process shutdown. The receipt helper now accepts `accountId: string`, addressing ACH-50. Focused Biome passed and a fresh local `db:test` passed (`/tmp/stardust-s2-47a-f1-db.log`). The exact serial route integration command is still running (`/tmp/stardust-s2-47a-f1-route.log`); no test result or paired acceptance is claimed yet. Root code/types/unit and prior review evidence are stale for this correction.

S2-47a-F1 validation completed: focused Biome format/check passed; fresh `npm run db:test -w @stardust/server` passed; exact serial integration passed 1 suite / 12 tests in 12.19s with no open-handle warning. Logs are `/tmp/stardust-s2-47a-f1-db.log` and `/tmp/stardust-s2-47a-f1-route.log`. The corrected requests now traverse Supertest for ordinary HTTP behavior; Fetch is retained for actual live-stream lifecycle control. The previous IR-01 review is invalidated by the correction and the required new paired review is pending. The genuine Auth-signed expired-bearer case remains a nonblocking test limitation from the prior Reviewer. Root code/types/unit checks have not been rerun on F1.

After S2-47a-F1 the path preflight was rerun with `npm run check:spec-implementation -- documentation/features/global/supabase-replacement-with-drizzle/spec.md --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`; it still reports 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored) and does not name the assigned route-test path. This is the known unfinished global Contract set. No conformance pass is claimed. The corrected candidate is awaiting root sensors and the fresh paired review.

S2-47a-F1 paired Implementation Reviewer verdict: **accepted**, no blocking findings, against the single assigned test-file change at base/HEAD `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. The Reviewer confirmed Supertest for ordinary HTTP behavior and accepted direct Fetch only for tests requiring stream-reader, abort-signal or shutdown control. CA-10 and CA-22 passed for this slice; CA-11/CA-13/CA-18/CA-19 and EV-06 remain partial; CA-20 is outside this slice. The forged expired-claim bearer remains a nonblocking limitation. Root `check:code` and `check:test-integrity` passed; root `check:types`, `test:unit` and `check:architecture` were still running when this entry was recorded. Acceptance applies only to S2-47a-F1, not the full S2 phase.

S2-47a-F1 integrated sensor closeout: current corrected candidate passed root `npm run check:code` (7 workspaces; existing informational diagnostics only), `npm run check:types` (7/7), `npm run test:unit` (Server169 suites/330 tests, Core176/638, Web118/506, Studio14/64, LSP1/1), `npm run check:test-integrity` (passed; 59 changed test files, 31 testable source files, 223 excluded), and `npm run check:architecture` (3,874 modules / 6,988 dependencies). `check:spec-definition`, `check:plan-definition`, and `git diff --check` passed after the ledger updates. Combined with focused Biome, fresh local `db:test`, 12/12 exact route integration tests and the fresh paired reviewer acceptance, S2-47a-F1 is verified. Scope is one test file only. Overall S2 remains open: EV-06 lifecycle gaps (poll cadence/non-overlap/heartbeat/60-second bound, reconnect, terminal deduplication and post-header database error), EV-01/02 25-port and actor evidence crosswalk, consolidated paired Server review, ACH-35 combined coverage, and later W2/D3/C2 gates remain outstanding. The global conformance check still fails at the recorded 140 unrelated/incomplete Contract path errors.

### S2-47b assignment — 2026-10-05

After S2-47a-F1 verification, the next bounded S2 task is assigned to the same stable Builder Server and sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. It will use a real PostgreSQL table lock to keep a profile query pending beyond the 1s polling interval, assert the route does not overlap another query, release the lock, persist a real profile, and observe one terminal `user.created` event. No source change or evidence exists for S2-47b yet. It does not close other EV-06 lifecycle or S2-wide evidence/review/coverage gates.

S2-47b source checkpoint: one test was added only to `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. The test uses real Auth/profile data and a real PostgreSQL ACCESS EXCLUSIVE table lock to hold the stream's SELECT beyond the 1s polling interval; it checks one blocked SELECT/stable backend PID, releases the lock, and verifies a single terminal event containing persisted identity data. Cleanup aborts/cancels the stream and releases the lock/reader in `finally`. Focused Biome passed. Fresh local `db:test` is running; route-suite result, diff inspection and paired review remain pending.

S2-47b validation: focused Biome format/check passed; fresh `npm run db:test -w @stardust/server` passed; `npm run test:integration -w @stardust/server -- --runTestsByPath src/tests/routes/profile/StreamProfileCreationRoute.test.ts --runInBand` passed 1 suite / 13 tests in 13.569s (new real-lock scenario 1.791s), no open-handle warning. Logs: `/tmp/stardust-s2-47b-db.log`, `/tmp/stardust-s2-47b-route.log`. The test observes one blocked SELECT and stable backend PID beyond 1s, then observes one persisted-profile event and EOF. S2-47b is not verified until diff inspection, paired review, and fresh principal conformance/sensors. Broader lifecycle cadence/heartbeat/60s/error/reconnect and aggregate S2 gates remain open.

After S2-47b the required `check:spec-implementation` preflight was rerun against base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`. It remains failed at 140 errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the changed SSE test path is not listed. This is the existing broad unfinished Contract state, not a passing candidate gate. The Builder-paired review and fresh root sensors for S2-47b remain pending.

S2-47b paired Implementation Reviewer verdict: **accepted**, no blocking findings for the assigned real-lock polling test. The Reviewer independently confirmed one real blocked SELECT/PID remains stable beyond the 1s interval, followed by one persisted-profile event and EOF; Supertest is used for ordinary HTTP cases and live Fetch only for stream-reader control. CA-11 and CA-22 passed for this scenario; CA-10/18/19 remain partial at the broader feature level. Focused Biome, fresh local `db:test` and 13/13 route integration tests passed. Root `check:code`, `check:test-integrity`, and `check:architecture` passed; root `check:types` and `test:unit` remain in progress. This is only the paired S2-47b slice review, not S2-wide acceptance.

S2-47b integrated root typecheck found ACH-51: `npm run check:types` fails only at line203 of `StreamProfileCreationRoute.test.ts` because `ReadableStreamReadResult` is undefined in this project’s TypeScript lib. This is a test-only compile issue and invalidates the prior type sensor for this candidate. Root `check:code`, `check:test-integrity`, and `check:architecture` passed; `test:unit` is still running. A narrow same-path Builder Fix and a new paired review are required; no unrelated source or Rule edits are authorized.

The pre-ACH-51 root unit run completed successfully: Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1. Root `check:code`, `check:test-integrity`, and `check:architecture` also passed. `check:types` alone failed on the assigned test's unsupported annotation. These are pre-correction evidence and will be superseded where invalidated after S2-47b-F1.

S2-47b-F1 ACH-51 source checkpoint: the unsupported stream read result type was replaced with `ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']> | undefined`, changing only the test annotation. Focused Biome passed and fresh local `db:test` passed (`/tmp/stardust-s2-47b-f1-db.log`). The exact serial route run remains in progress (`/tmp/stardust-s2-47b-f1-route.log`). Prior S2-47b paired review is invalidated by the edit; rerun root typecheck and obtain a fresh paired review after the route run. No other path changed.

S2-47b-F1 validation completed: focused Biome format/check passed; fresh `npm run db:test -w @stardust/server` passed; exact serial integration passed 1 suite / 13 tests in 16.482s, no open-handle warning. Evidence: `/tmp/stardust-s2-47b-f1-db.log`, `/tmp/stardust-s2-47b-f1-route.log`. The type annotation correction does not change behavior. The previous S2-47b review is invalidated and a new paired review is pending. Principal conformance and root sensors must be refreshed on this final annotation diff; the prior `check:types` failure is not resolved until a fresh typecheck passes.

S2-47b-F1 path preflight after ACH-51: `check:spec-implementation` was rerun against the frozen base and remains at the existing 140 Contract path mismatches (122 Remove still present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the SSE test path is absent from findings. This confirms the known unfinished global paths only; no conformance pass is claimed. Current root sensor refresh and the correction's paired review remain pending.

S2-47b-F1 paired Implementation Reviewer verdict: **accepted**, no blocking findings for ACH-51. The Reviewer confirms the inferred reader-return annotation compiles as a correction candidate and preserves behavior/cleanup; the test path remains the sole scope. Focused Biome, fresh local `db:test`, and 13/13 route integration tests passed. Root `check:code`, `check:test-integrity`, and `check:architecture` passed; root `check:types` and `test:unit` are still running at this evidence point. Overall S2 remains open.

S2-47b-F1 type correction verified: fresh root `npm run check:types` passed all 7 workspaces. ACH-51 is resolved. Root unit tests are still running; other refreshed root sensors and paired review are accepted/passed.

S2-47b-F1 closeout: root `check:types` passed in 7/7 workspaces after ACH-51 correction; root `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1). Root `check:code`, `check:test-integrity`, and `check:architecture` passed. With fresh local DB prep, focused Biome, 13/13 route integration, and the fresh paired reviewer acceptance, S2-47b-F1 is verified and ACH-51 is resolved. Overall S2 remains in progress: EV-06 polling-to-profile lifecycle, heartbeat/deadline/error/reconnect details, EV-01/02 port/actor matrix, aggregate review, and combined Server coverage remain open. The broad path conformance check still fails with the known 140 unfinished paths.

### S2-47c assignment — 2026-10-05

The next bounded S2 task is assigned to Builder Server on the sole path `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`. It will connect a real Auth identity with a valid signed receipt while no Drizzle user profile exists, establish the real initial lookup observed absence, create that same user's profile through the real fixture, and assert one correct `user.created` event then EOF over the already-open stream. No source edit/evidence exists yet. The task does not establish heartbeat/deadline/post-header-error/reconnect behavior or close aggregate S2.

S2-47c source checkpoint: the assigned single test now coordinates a real query against the user's initially absent profile, proves absence/no event before inserting that user's profile, then observes one correct terminal event and EOF. It uses real Auth A/B, Drizzle/PostgreSQL and `ProfileFixture`; it keeps cleanup in `finally`. Focused Biome passed. `npm run db:test -w @stardust/server` did not reach stack preparation: exit127, `sh: docker: not found` (`/tmp/stardust-s2-47c-db.log`). The exact route integration has not been run, so no database/runtime result exists. Root/diff checks and paired review are pending; local Docker PATH availability is being diagnosed. No remote Supabase was used.

S2-47c local runtime diagnosis: `db:test` exited127 because Docker is unavailable. `/usr/bin/docker` resolves to a dangling symlink targeting absent `/mnt/wsl/docker-desktop/cli-tools/usr/bin/docker`; no local Docker socket or alternate `podman`/`nerdctl`/`docker-compose` CLI was found. This is an environment blocker, not a code or test failure. The real route integration has not run; S2-47c is not verified. No remote Supabase action was taken. Non-runtime checks can proceed, but a fresh local `db:test` and route suite require Docker Desktop/WSL runtime restoration.

S2-47c path preflight: `check:spec-implementation --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` remains at the known 140 broad Contract errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); the new test path is not named. Root non-runtime sensors for S2-47c are pending and will be run despite the local container-runtime blocker.

S2-47c root non-runtime sensors: `check:code` passed (7 workspaces), `test:unit` passed (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), `check:test-integrity` passed, and `check:architecture` passed (3,874 modules / 6,988 dependencies). Root `check:types` reports ACH-52 at line300 of the new test: the SQL parameter is typed `number | undefined`, incompatible with the non-optional postgres.js query parameter. This test-only typing defect requires a narrow correction and fresh typecheck. Separately, Docker remains unavailable, so no fresh DB prep or route integration evidence exists for S2-47c.

#### EV-01/EV-02 crosswalk discovery — 2026-10-05

A read-only Builder Server audit mapped the 25 ports to current route suites. Existing real evidence is strongest for Reporting/Feedback, Users, shared shop catalogues, Achievements, selected Space/Comments behavior, and persisted API-key authorization through MCP; it includes boundary-specific A/B/God/public/forged-JWT cases. Coverage gaps remain for direct Chats/ChatMessages, Notes, Snippets, lesson/manual Questions/Stories/Guides, ChallengeSources, Solutions/toolkit CRUD, TextBlocks concurrent audio JSON plus persisted System-job effects, Ranking/Tier job mutations, successful avatar/insignia/rocket acquisition, and selected challenge/planet/star mutation cases. MCP authorization does not establish full API-key toolkit writes; job assembly/unit tests do not establish real Drizzle persistence. Do not infer untested port methods from suite counts or fixtures; exact route/use-case actor contracts must be inspected before assigning new cases. No code/tests changed during this audit. S2-47c is independently blocked from runtime validation by unavailable local Docker.

S2-47c-F1 ACH-52 correction and S2-47c runtime closeout: the Builder added an explicit undefined guard before PostgreSQL query interpolation, narrowing the captured PID without casts/defaults and preserving assertions, behavior and cleanup. Only the assigned test changed. Focused Biome passed after a formatting-only adjustment. Root `check:types`, `check:code`, `test:unit`, `check:test-integrity`, and `check:architecture` all passed; Plan definition and `git diff --check` passed. `check:code` emitted the existing baseline warning set. After Docker was restored, local `npm run db:test -w @stardust/server` passed and the exact serialized `StreamProfileCreationRoute.test.ts` integration passed 1 suite / 14 tests in 21.639s. The paired Implementation Reviewer accepted ACH-52 and the route scenario with no blocking findings. Current spec path conformance remains failed at 140 global errors (122 Remove present, 16 Modify unchanged, 2 Create missing; 24 unrelated paths ignored); the assigned test path is clear. S2-47c-F1 and S2-47c are verified for this bounded slice. Heartbeat/duration/post-header-error/reconnect and broader S2 EV-01/EV-02 evidence remain open.

S2-47d assignment: the next bounded real-route scenario targets the unproven 15-second heartbeat while the account has no profile, then aborts the same live reader and verifies shutdown cleanup. Scope is only `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`; no timers are faked and production source is unchanged. Plan definition gates are required before Builder activation. The prior successful local `db:test` and 14-test route run establish the environment baseline, but the new heartbeat scenario requires a fresh DB preparation and exact route rerun. Status `in_progress`; no source/test change exists yet.

S2-47d source/runtime checkpoint: Builder added the assigned real Auth/PostgreSQL heartbeat case. Focused Biome passed; fresh local `db:test` passed (`/tmp/stardust-s2-47d-db.log`); the exact serial route suite passed 1 suite / 15 tests in 29.208s (`/tmp/stardust-s2-47d-route.log`), including the 15-second real-clock heartbeat at 15.484s. The test observes no created profile/event and validates abort reader completion and SIGTERM cleanup. No other path changed. Principal inspection, root sensors, path conformance, and paired review remain pending.

S2-47d principal sensor checkpoint: focused Biome, root `check:code`, `check:types`, `test:unit`, `check:test-integrity`, and `check:architecture` all passed; unit counts were Server169/330, Core176/638, Web118/506, Studio14/64 and LSP1/1. Architecture cruised 3,874 modules / 6,988 dependencies. Conformance remains 140 global path errors, with this test path absent. Fresh paired review and post-ledger Plan/diff checks remain pending; broader EV-06 is open.

S2-47d paired-review closeout: accepted for the bounded real-heartbeat-and-abort scenario. The reviewer confirms the heartbeat arrived after 15.484s using a real Auth account with no profile, no profile event was emitted, and abort completed the reader and removed the SIGTERM listener. Focused Biome, local db preparation, 15/15 route integration, root code/types/unit/integrity/architecture checks passed. Review notes SIGINT cleanup is not independently asserted by this case. S2-47d is verified; 60-second cap, post-header DB error, reconnect and broader S2 evidence remain open.

S2-47e assignment: add the missing assertion that the existing real backpressure/expiry route test receives exactly one `onboarding.expired` event before EOF while excluding `user.created` and heartbeat; retain actual short signed-receipt expiry and listener cleanup. Only the existing test in `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` may change. Plan/Spec definition gates precede Builder activation. No implementation diff exists yet; status `in_progress`.

S2-47e source checkpoint: Builder modified only the existing expiry/backpressure test as assigned. Focused Biome and fresh local `db:test` passed (`/tmp/stardust-s2-47e-db.log`); exact serial route integration remains running (`/tmp/stardust-s2-47e-route.log`). Awaiting route result before paired review and principal root sensors; no other path changed.

S2-47e integration failure/findings pending review: fresh `db:test` passed, but the exact route suite failed 13/15 in 29.69s (`/tmp/stardust-s2-47e-route.log`). The assigned backpressure test observed no `onboarding.expired` frame. The same run exposed the prior S2-47d real-heartbeat assertion at 13,999ms against a 14,000ms lower bound. Builder stopped without assertion weakening or scope expansion. The S2-47d route-suite acceptance is reopened for a stable timing correction; fresh paired review is assessing both findings before correction assignments.

S2-47e paired Implementation Reviewer verdict: **failed** for the test-only candidate. IR-01 confirms the test held the initial retry frame unread, which kept the SSE writer backpressured and prevented the terminal frame from reaching the consumer before force-close. Recommendation: consume retry first, then leave the reader idle until expiry and read terminal/EOF. No production change is indicated unless the contract explicitly requires delivery under a blocked writer. IR-02 confirms the heartbeat timer is registered before the test's post-initial-frame timestamp; measure from before request opening through heartbeat receipt. Rule change disposition: No change. Fresh DB setup passed; exact suite failed 13/15. S2-47d prior runtime acceptance is invalidated pending stable rerun.

S2-47e-F1 correction assignment: one-file test-only correction for IR-01 and IR-02. Preserve the 14-second tolerance and exact heartbeat comment, but start monotonic measurement before opening the request. Consume initial retry before waiting on short receipt expiry so the terminal event can flush, then assert exactly one terminal frame, no created/heartbeat events, EOF, and listener cleanup. No implementation change yet; local runtime is available.

S2-47e-F1 source checkpoint: Builder applied both approved test-only corrections in the assigned file. Focused Biome and fresh local `db:test` passed (`/tmp/stardust-s2-47e-f1-db.log`). Exact serial route suite remains active (`/tmp/stardust-s2-47e-f1-route.log`); await result before paired review/root sensors. No other paths changed.

S2-47e-F1 integration result: exact serial suite failed 14/15 in 29.214s (`/tmp/stardust-s2-47e-f1-route.log`). Heartbeat timing now passes at 15.302s after moving its monotonic start before request opening. The expiry test still sees no `onboarding.expired` event even after consuming the initial retry and leaving the reader idle until expiry. Fresh local `db:test` and focused Biome passed. Builder stopped without additional edits. Fresh paired review is assessing the Spec/implementation contract before any next correction; S2-47d's timing fix alone is not accepted until the whole suite is stable.

S2-47e-F1 paired review: **failed** with IR-01. Spec line306 explicitly requires `event:onboarding.expired` and `{}`. The Reviewer confirms `expire()` starts an unawaited terminal `writeSSE`, wakes the polling loop, and Hono closes the writer when the route callback returns before that write completes. IR-02 passed after monotonic timing began before request open (15.302s). Rule disposition: No change. Fresh DB prep and focused Biome passed; exact route suite failed 14/15. Builder Fix S2-47e-F2 is assigned to only the stream helper and route test: await terminal expiry write within callback completion, re-arm an early timer until the deadline, preserve bounded force-close and existing lifecycle guarantees. Paired pre-review is required before mutation.

S2-47e-F2 paired pre-review: **approved with refinements**. The Reviewer confirms the expiry event is contractual. Exact boundaries: check deadline before stopping and re-arm early timer; publish expiry-write completion before waking poll; make route callback await terminal write before returning; retain 100ms bounded force-close; distinguish valid-credential 60s cap (close without expired-receipt event). Route test consumes initial retry, waits idle through expiry, then asserts exactly one event/data `{}`, no created/heartbeat and EOF. No fake timers or unrelated paths. Builder ACK and definition gates precede source edit.

S2-47e-F2 source checkpoint: Builder reports edits only to the approved streaming helper and route test. It added early-deadline rearm, distinct cap-close behavior, published expiry-write promise before poll wake, and callback await before Hono close; the route now asserts exact terminal data `{}`. Focused Biome passed for both files. Fresh local `db:test` remains in progress (`/tmp/stardust-s2-47e-f2-db.log`); no route/runtime or complexity evidence yet.

S2-47e-F2 runtime checkpoint: fresh local `db:test` passed and the exact serial route suite passed 1 suite / 15 tests in 28.814s. Expiry emitted exactly one `onboarding.expired` with data `{}` followed by EOF; the corrected real-heartbeat case passed at 14.145s. The suite also passed real polling, profile-created, abort and shutdown scenarios. Focused Biome and diff check passed. Only the two assigned files changed. Principal source inspection, root sensors, complexity, path conformance and paired post-review remain pending; no full 60-second cap proof is claimed.

S2-47e-F2 paired post-review: **failed** with blocking IR-01: poll completion can reach `finally` after deadline and clear the timer before it publishes `expiryWrite`, skipping the contract-required `onboarding.expired` frame. Root `check:code`, `check:types`, `test:unit`, `check:test-integrity`, and `check:architecture` passed; `check:complexity` failed at 8 warnings versus the unchanged baseline 7 due to the new Promise executor. The broad path preflight remains failed with 140 known global errors, with neither assigned path named. F2 is not accepted; its passing 15/15 route run does not resolve the independently reviewed race.

Assignment S2-47e-F3 is active on the same stable Builder Server and only `apps/server/src/app/hono/streaming/createProfileCreationStream.ts` plus `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts`, Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, RF-09, CA-18/CA-22, EV-06. Paired pre-review approved with refinements; Plan/Spec definition gates pass. Centralize timer/poll expiry through one idempotent finalizer that publishes completion before waking poll; record terminal outcome before awaiting the `user.created` write. Preserve receipt-expiry vs valid-credential 60-second-cap distinction, abort/shutdown outcomes, early-timer rearm and 100ms force-close that settles a stalled expiry write. Remove the added complexity warning without changing baselines. Add a real local PostgreSQL query-in-flight-across-expiry case asserting exactly one empty expiry event then EOF and no created/heartbeat event, releasing the DB lock in `finally`. No mocks, fake timers, unrelated paths or contract/rule changes. Current status: `in_progress`; no F3 source or runtime evidence yet.

S2-47e-F3 paired pre-review: **approved with refinements**. The Reviewer confirms the poll-before-timer race and requires one idempotent deadline finalizer shared by timer and poll completion, terminal-outcome recording before writes (including `user.created` before awaiting), and published completion before poll wake. Preserve rearm, expiry-vs-60-second-cap semantics, abort/shutdown behavior, and a 100ms force-close that settles stalled writes. Avoid anonymous Promise executors to remove the added complexity warning without changing baselines. The real Postgres test must leave the reader able to consume the exact expiry frame and release its lock in `finally`. No Rules or Contract change; F3 remains in progress awaiting Builder ACK and implementation.


S2-47e-F3 paired post-review: **failed** with blocking IR-01/IR-02. The real database-lock test currently awaits expiry event and EOF inside `withBlockedUsersQuery`, so it releases the PostgreSQL lock only after observing completion; change it to hold the query across expiry, exit/release lock, then drain/assert terminal event and EOF. A pending `user.created` write is marked terminal and therefore makes `finalizeDeadline` return without stopping heartbeat/listeners or closing at receipt/60-second deadline; retain no-second-expiry semantics while closing/cleaning a pending created write at deadline. Fresh local `db:test`, exact serial route integration 16/16, focused Biome, code, types, unit, test-integrity and architecture passed. `check:complexity` failed exit2: 9 warnings against unchanged baseline 7. Path conformance remains failed at the same 140 global errors; neither assigned path is listed.

Builder Fix S2-47e-F4 is active on the same two assigned files, Spec revision 10/base `8f9f71ac3dc4bd42312f5890f05c5da02c8814a9`, RF-09, CA-18/22, EV-06. It will release the real DB lock before reading/asserting expiry/EOF, close and clean up a backpressured created-terminal stream at deadline without a second expiry event, and remove complexity regressions until current complexity does not exceed baseline 7. No threshold/baseline change or scope expansion. Status `in_progress`; no F4 implementation/evidence yet.


S2-47e-F4 runtime failure: fresh local `db:test`, focused Biome and diff check passed; exact serial route suite failed 15/16 in 34.205s. The new real PostgreSQL locked-query-across-expiry scenario passed after releasing the lock before draining. Existing idle-reader/backpressure expiry test failed its fixed 2.3s SIGTERM listener-count assertion (expected baseline 1, observed 2) before reading terminal/EOF; treat as a route-suite failure, not accepted evidence. Complexity reduced 9→7 warnings/0 errors but `check:complexity` still exits 2, so the remaining baseline delta is unresolved. No baseline/threshold changes. F4-F1 is assigned to stabilize the cleanup assertion against actual stream completion and remove the remaining complexity delta; it should also prove deadline cleanup for a backpressured created-terminal write if a real route scenario can do so within these two paths. No other paths changed.


S2-47e-F4-F1 verified. Focused Biome/diff clean; fresh local `db:test` and exact serial route suite passed 16/16 in 34.581s. The real locked SELECT remains pending across receipt expiry; its transaction lock releases before the live reader drains exactly one `onboarding.expired` `{}` and EOF. The idle-reader expiry path confirms SIGTERM listener removal after stream EOF. The previous created-terminal cleanup finding is fixed in source: at deadline it aborts/closes a pending created write without a second expiry frame. Paired Implementation Reviewer accepted with no blocking findings; direct real-route pending-created-backpressure and 60s-cap tests remain evidence gaps. Root sensors passed: `check:code` 7 workspaces (171 informational Web warnings), `check:types` 7, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), complexity (0 warning/error; unchanged baseline). Global path conformance still fails with 140 known unrelated/incomplete Contract paths (122 Remove, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored); assigned SSE paths are absent. Next S2 task: close remaining EV-06 cap/error/reconnect evidence, then continue EV-01/02 port/actor crosswalk and aggregate Server review.

Assignment S2-47f targets one real local route scenario for the Spec's 60-second maximum while the signed credential remains valid and the profile absent. It will use real time/Auth/PostgreSQL, observe actual heartbeats and EOF, assert no expiry/created terminal event and listener cleanup, without fake timers or mocks. Only `apps/server/src/tests/routes/profile/StreamProfileCreationRoute.test.ts` is allowed. RF-09, CA-18/19, EV-06. Paired pre-review and definition gates precede edits; exact suite will take at least the 60-second cap duration. Paired pre-review approved with refinements: use 75–80s test timeout, monotonic timing from before request open, several real heartbeat frames, EOF and cleanup; assert a reasonable lower-bound and do not rely on a heartbeat racing exact cap. Keep reader active; clean in `finally`. Status `in_progress`; Builder ACK pending.

S2-47f paired pre-review: **approved with refinements**. A valid signed receipt with lifetime beyond 60s isolates the cap; a live reader should observe real heartbeats and EOF. Set a 75–80s Jest timeout, measure from before request open, check a reasonable lower bound/several heartbeats, no expiry or created event, and shutdown listener cleanup without assuming heartbeat ordering at the cap. No source or other path.


S2-47f verified. The paired Implementation Reviewer accepted the real-duration cap scenario. Fresh exported-env local `db:test` passed; exact route integration passed 17/17 in 96.152s. Cap closed at 60.324s while the signed receipt remained valid for 900s and the account lacked a profile; live reader observed real heartbeats, EOF, no `onboarding.expired`/`user.created`, and no remaining shutdown listener. Focused Biome and diff passed. Root sensors passed: code (7 workspaces; 171 informational Web warnings), types (7), unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors; baseline unchanged). Global path conformance remains at 140 known errors (122 Remove, 16 Modify unchanged, 2 Create missing; 24 unrelated ignored), and the assigned path is absent. Remaining S2 EV-06 work is post-header database-error and reconnect evidence; EV-01/02 crosswalk and aggregate Server review remain open.

Assignment S2-47g targets Spec EV-06's database failure after SSE headers using a real local Drizzle query and test-only temporary schema mutation: rename a required `public.users` column after Auth setup, open the SSE route and verify the post-header query failure ends the stream without JSON/error/terminal leakage, restoring the column in `finally`. Only the existing route-test path is assigned; no source/mocks/fake timers. RF-09, CA-19, EV-06. Paired pre-review approved with safeguards: use plain `ALTER TABLE ... RENAME COLUMN` without `CASCADE`; track successful rename, restore the original id in `finally`, keep reader/request signal under cleanup and await EOF before restoration on success. Assert 200/SSE headers, retry, EOF, no JSON/error/created/expiry frame and listener cleanup; do not assert absence of sanitized server logging. No Rule/Contract change. Status `in_progress`; Builder ACK pending.

S2-47g paired pre-review: **approved with safeguards**. Reviewer confirms the local rename causes the real lookup to fail after committed SSE retry; serialized integration tests avoid competing DDL. Always restore in `finally` without `CASCADE`, await EOF before restoration on success, and assert response/SSE headers, retry, clean EOF, no JSON/terminal event and listener cleanup. Do not constrain sanitized server log behavior.


S2-47g verified. Paired reviewer accepted the real post-header Drizzle query failure case. Fresh local `db:test`, focused Biome/diff, and exact serial 18/18 route suite (96.041s) passed. The test proves 200 SSE headers/retry followed by clean EOF with no JSON/error/created/expiry frame and shutdown listener cleanup; temporary local `public.users.id` rename is restored in `finally` and later route cases passed. Root code (7 workspaces; 171 informational Web warnings), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules/6,989 dependencies), and complexity (0 warnings/errors, unchanged baseline) passed. Global path conformance remains failed at 140 known contract mismatches; assigned route path is absent.

Assignment S2-47h adds a real server reconnect scenario on the same existing route test path: observe account absence on first stream, close connection, persist profile while disconnected, reconnect using same valid receipt and require initial real lookup to emit the one persisted matching profile then EOF. RF-06/RF-09, CA-11/19, EV-06. No mocks, fake timers, source/other path. Paired pre-review approved. Assert initial absence and complete initial lookup, abort/await EOF, persist same account while disconnected, then reconnect with the same receipt and assert one matching profile event/id then EOF, no expiry/error; verify cleanup/listeners for both connections in `finally`. Status `in_progress`; Builder ACK pending.

S2-47h paired pre-review: **approved**. The sequence directly covers CA-11 without production changes: absent profile on first stream, disconnection, persistence while disconnected, same-receipt reconnect, initial lookup returns one matching terminal profile event. Reader/signal cleanup and listener assertions apply to both streams.


S2-47h verified. Paired Implementation Reviewer accepted the real route reconnect case. Fresh local `db:test`, focused Biome/diff, and exact serial route integration 19/19 (95.074s) passed. The test observes no account profile on the first stream, completes a blocked initial lookup, aborts and awaits EOF/listener cleanup, persists that account while disconnected, then reconnects with the same signed receipt and observes exactly one matching persisted profile event/id and EOF without foreign/expiry/error frames. Root `check:code` (7 workspaces; 171 informational Web warnings), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors, unchanged baseline) passed. Global Contract path check stays at 140 known failures; assigned SSE path absent. EV-06 now has real route evidence for the 60s cap, post-header DB failure and reconnect. EV-01/02 persistence port/actor gaps and aggregate Server review remain open; S2 overall and later W2/D3/C2 remain `in_progress`.


S2-47h verified: fresh local `db:test`, focused Biome/diff, exact serial suite 19/19 (95.074s), and paired Implementation Reviewer passed. The new real reconnect test confirms the first stream's absent-profile lookup, abort/EOF/listener cleanup, profile creation while disconnected, same signed receipt reconnect, one matching persisted creation frame and EOF, no foreign/expiry/error frames. Root code (7 workspaces; 171 informational Web warnings), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors, baseline unchanged) passed. Global conformance remains at 140 known mismatches. Current EV-01/02 evidence crosswalk found private Chat/ChatMessages real route coverage absent; the natural new route-test path is not in the Spec's exact map. Do not add that implementation/test path pending an authorized Spec amendment. Aggregate Server review, W2/D3/C2, combined coverage and global Contract/CI/remote gates remain open.

Assignment S2-47i targets the already-contracted `ListChallengeCodeExecutionsRoute.test.ts` path (`Modify`) to strengthen EV-01/EV-02 evidence for `ChallengeCodeExecutionsRepository.findManyByUserAndChallenge`: real A/B identities, two A executions plus one B execution on the same challenge, page 1/2 at size1, exact descending order/counts, B-own-only result, and SQL-backed before/after persistence comparison. RF-01/RF-02, CA-01/CA-03. No new path, API, fixture, mocks or repository test. Paired pre-review approved with refinements: retain A’s other-challenge row; assert exact A page1/page2 DTOs (newest first, count2 each), B exact own-only DTO/count1, and explicit timestamp-ordered persisted-state equality before/after. No repository/fixture/API/new path. Status `in_progress`; Builder ACK pending.

S2-47i paired pre-review: **approved** with exact A pagination/order/count, B-own-only/count, retained other-challenge filter, and before/after timestamp-ordered SQL readback requirements.


S2-47i verified. Paired Implementation Reviewer accepted the real route test update. Fresh local `db:test`, focused Biome/diff, and exact serialized route suite 3/3 (10.593s) passed. A gets exact newer/older execution DTOs on separate pages with count2; B gets only B's exact row/count1; A's other-challenge row remains and SQL-backed persisted rows are identical before/after. Root code (7 workspaces; 171 informational Web warnings), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules/6,989 dependencies), and complexity (0 warnings/errors; unchanged baseline) passed. Global path conformance still has 140 known errors; the assigned test path is absent. This closes bounded EV-01/02 evidence for challenge execution query ordering/pagination and A/B read isolation only; remaining port/actor coverage and aggregate review are open.

Assignment S2-47j uses the already-contracted `CountChallengeCodeExecutionErrorsRoute.test.ts` (`Modify`) to extend real EV-01/02 evidence for `ChallengeCodeExecutionsRepository.countIncorrectByUserAndChallenge`: include runtime-error for A on target challenge, A errors on a different challenge, and B errors on target; assert actor/challenge-specific counts for both A and B and timestamp-ordered persisted-state equality before/after. RF-01/02, CA-01/03. No new path/API/fixture/repository mock. Paired pre-review approved: preserve current A counts 2 wrong-answer + 1 syntax + 0 internal, add target runtime-error (A total4), add cross-challenge A penalizable rows and target B rows to assert exact B-own count; use distinct timestamps and timestamp-ordered snapshots. Authenticate both actors. Status `in_progress`; Builder ACK pending.

S2-47j paired pre-review: **approved** with exact expected counts/status taxonomy, challenge filtering, actor isolation, and timestamp-ordered persisted snapshots.


S2-47j verified. Paired reviewer accepted the real route count scenario. Fresh local `db:test`, focused Biome/diff, and exact serial route suite 2/2 passed. A target errors count4 includes wrong-answer/syntax/runtime and excludes internal; A other-challenge errors are excluded; B sees only its own target errors count2. Timestamp-ordered SQL snapshots for all groups are unchanged. Root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture, and complexity (0 warning/error; baseline unchanged) passed. `check:spec-implementation` remains at the known 140 global mismatches and does not name the assigned path. This closes bounded EV-01/02 error-count semantics only; full repository-port/actor matrix and aggregate Server review remain open.

Assignment S2-47k uses existing contracted `RescueAchievementRoute.test.ts` (`Modify`) to cover replay and owner isolation in EV-01/02: real A/B share same rescuable achievement; first A rescue grants one reward/removes only A relation; B relation and balance stay unchanged; repeated A rescue returns 200 without additional reward and relation remains absent. RF-01/02, CA-01/03. No concurrency/atomicity claim, mocks, fixture/API/new path. Paired pre-review approved: capture A/B starting balances; first A rescue exact reward + A-only relation removal/B unchanged; replay success without second credit and unchanged relations/balances. Evidence is sequential idempotency/owner isolation, not concurrency. Status `in_progress`; Builder ACK pending.

S2-47k paired pre-review: **approved** with initial balances, exact one-time A reward, A-only relation removal, B preservation, sequential successful replay/no second reward, and no concurrent atomicity claim.


S2-47k verified. Paired reviewer accepted the real sequential-replay route behavior. Fresh local `db:test`, focused Biome/diff and route suite 6/6 passed. A's first rescue granted exactly once and removed only A's relation; B's state stayed unchanged; A replay returned 200 without additional credit and preserved both users' state. Existing negative cases passed. No concurrent atomicity claim. Root code (7 workspaces; 171 informational Web warnings), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors; unchanged baseline) passed. Global path conformance remains at 140 known failures, assigned path absent. This closes only bounded sequential rescue/replay and same-achievement ownership evidence; the broader EV-01/02 matrix remains open.

Assignment S2-47l uses contracted `FetchUnlockedAchievementsRoute.test.ts` (`Modify`) to cover EV-01/02 for `AchievementsRepository.findAllUnlockedByUser`: A's two unlocked rows inserted reverse-position order return exact ascending DTOs; B gets only B's exclusive row; B querying A is denied without data; persisted relations unchanged before/after. RF-01/02, CA-01/03. Real Auth/Hono/Drizzle/Postgres and existing fixtures; no mocks/new path/repository test. Paired pre-review approved: include retained locked item, A reverse-order inserts/exact ascending DTOs, B exclusive item, B→A 401/AuthError, before/after relation snapshots for both users. Status `in_progress`; Builder ACK pending.

S2-47l paired pre-review: **approved** with locked row retained, exact ordering and owner-isolation cases, and before/after persisted relation comparison.


S2-47l verified. Paired reviewer accepted the real authenticated route ordering/ownership scenario. Fresh local `db:test`, focused Biome/diff, and route suite 4/4 passed. A’s reverse-inserted position1/2 achievements return as exact ascending DTOs; locked item excluded. B gets only its exclusive item; B→A returns 401/AuthError with no A ids. Persisted unlocked relations remain unchanged. Root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules/6,989 dependencies), complexity (0 warnings/errors; unchanged baseline) passed. Global path conformance remains at 140 known errors; assigned path absent. This closes bounded ordering/owner isolation evidence for `findAllUnlockedByUser`; remaining EV-01/02 matrix and aggregate Server review remain open.

Assignment S2-47m targets the existing contracted `UpdateUserRoute.test.ts` (`Modify`) for EV-01/02 identity/ownership evidence: real A/B profiles; A updates A’s route with conflicting body id B and only A changes/response retains A id; B attempts A route with body id B, receives 404/UserNotFoundError and neither profile changes. Verify SQL-backed state. RF-01/02, CA-01/03. No source/API/fixture/mock/new path/repository test. Paired pre-review approved: A’s valid DTO with id overridden to B targets A and must update only A; B’s valid DTO against A route then returns 404/UserNotFoundError and neither profile changes from post-A snapshot. Status `in_progress`; Builder ACK pending.

S2-47m paired pre-review: **approved** with request sequencing and persisted-state checkpoints to prove route identity overrides conflicting body identity and preserves owner boundary.

S2-47m first route run failed 5/6: the new test's first request returned 400 because `ProfileFixture.createAccountUser` setup objects omit hydrated selected-item fields required by strict route DTO validation. Fresh local `db:test`, focused Biome and diff check passed. The Builder identified the existing valid approach: hydrate both profiles through the real system reader, then modify only the id field for the conflict. No validation/assertion weakening or source changes. Builder Fix S2-47m-F1 is assigned to the same existing test path to preserve exact identity/ownership assertions. Current route evidence is failed; fresh runtime and paired review required.


S2-47m-F1 verified. Hydrated persisted DTOs resolved the test setup 400 without relaxing route validation. Fresh local `db:test`, focused Biome/diff and exact serial 6/6 route suite passed; paired reviewer accepted. A body id=B to A's route updates only A and returns id=A; B targeting A returns 404/UserNotFoundError; SQL confirms both profile rows remain correct. Root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules/6,989 dependencies), and complexity (0 warnings/errors, baseline unchanged) passed. Global path conformance stays at 140 known failures; assigned path absent. This closes a bounded route-identity/owner scenario only; broader EV-01/02 evidence remains open.

Assignment S2-47n uses contracted `FetchUsersListRoute.test.ts` (`Modify`) to prove filtered pagination and real unlocked-achievement relation count/order via `UsersRepository.findMany`: A/B profiles under exclusive prefix, A has two unlocked achievements and B zero; regular authenticated account searches/filter-sorts by `unlockedAchievementCountOrder` descending at size1; exact A then B rows, count/pages2 on both, correct IDs/count projections, no state mutation before/after. RF-01/02, CA-01/03, EV-01/02. Existing route/Auth/Postgres/fixtures, no God presumption, mocks, new path, API/fixture changes or repository test. Paired pre-review and gates before edit. Status `in_progress`; no runtime evidence yet.

S2-47n paired pre-review: **approved** with regular-account route/no God IDs, A/B shared prefix, zero-count ordering, pagination totals, sorted relation membership, and persisted before/after snapshots.

S2-47n verified. Paired Implementation Reviewer **accepted** the real route test. Fresh local `db:test`, focused Biome/diff, and exact serial `FetchUsersListRoute.test.ts` (1 suite / 4 tests, 7.622s) passed. The ordinary authenticated route returns A with two unlocked achievements before B with zero across pages 1/2, reports total2/pages2 on both pages, and projects the exact relations; SQL profile/relation snapshots are unchanged. Root `check:code` (7 workspaces; Web informational warnings only), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. `check:spec-implementation` remains at 140 known global mismatches; the assigned test path is not among them. This closes only bounded EV-01/02 filtered ordering, zero-count pagination, relation projection and read-only evidence; the broader matrix and aggregate Server review remain open.

Assignment S2-47o uses contracted `FetchCreatedUsersKpiRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02, to extend real route evidence from current-month-only to exact global current/previous/total month counts. Seed three persisted profiles with dynamic UTC month anchors (current, previous, two months earlier), authenticate ordinary A and B with `ENV.godAccountIds=[]`, assert both receive `{value:3,currentMonthValue:1,previousMonthValue:1}`, retain anonymous 401, and prove GETs preserve ordered SQL profile snapshots. Paired pre-review approved; dates should be UTC day15 noon via `Date.UTC` for calendar rollover. No fake clock/mock/new path/API/fixture/repository-only test. Status `in_progress`; no runtime evidence yet.

S2-47o verified. Paired Implementation Reviewer **accepted** the real authenticated route case. Focused Biome/diff, fresh local `db:test`, and exact serial `FetchCreatedUsersKpiRoute.test.ts` (1 suite / 3 tests, 8.29s) passed. The test creates current-, previous-, and two-months-earlier UTC day15-noon profile rows; both ordinary actors receive exact `{value:3,currentMonthValue:1,previousMonthValue:1}`; the ordered SQL profile snapshot is unchanged; anonymous 401 remains. Root `check:code` (7 workspaces; existing informational warnings only), `check:types`, `test:unit` (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warnings/errors) passed. `check:spec-implementation` remains at 140 known global mismatches, with this contracted path absent from findings. This closes bounded month-filtering/global-count and ordinary-actor evidence only; broader EV-01/02 coverage and aggregate Server review remain open.

Assignment S2-47p targets contracted `FetchAllPlanetsRoute.test.ts` (`Modify`) for RF-01/02, CA-01/03, EV-01/02: real A/B ordinary-auth requests over a shared planet/star catalog; insert two planets in reverse position order and multiple stars per planet in reverse number order; assert relative ascending order among seeded planets, exact nested star IDs/order/no cross-parent membership, identical A/B projections, and ordered planet/star SQL snapshots unchanged across GETs. Keep anonymous 401; other catalog rows may exist. No owner/availability claim, new path, fixture/API/source/mocks/repository test. Paired pre-review approved with in-test Drizzle inserts and bounded assertions. Status `in_progress`; no runtime evidence yet.

S2-47p first root type-check found test-only TypeScript errors: Faker DTO IDs were optional at inserted-object boundaries (TS2345 and cascading TS2769). No behavior/assertion issue was found. Builder Fix F1 explicitly overrides IDs with generated required values for planet/star inserts; no casts, schema/source changes, or assertion weakening.

S2-47p-F1 verified. Paired Implementation Reviewer **accepted** the corrected scoped test. Focused Biome/diff, `npm run check:types -w @stardust/server`, fresh local `db:test`, and exact serial route suite (1 suite / 3 tests, 7.417s) passed. The final full root code (7 workspaces; informational warnings only), types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), test-integrity, architecture (3,875 modules / 6,989 dependencies), and complexity (0 warning/error) sensors passed. `check:spec-implementation` remains at the same 140 global path mismatches; the assigned path is absent from findings. Assertions prove seeded-relative planet ordering, exact ordered star membership per parent/no cross-parent rows, shared A/B projections, and unchanged SQL snapshots, with anonymous 401 retained. No total-catalog, owner, or availability claim.

Assignment S2-47q uses contracted `RunChallengeCodeRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02 to prove private challenge execution ownership through the real route. A owns a private challenge with explicit ID, `isPublic:false`, `starId:null`; A's existing invalid-code request gets 201 and one persisted A-owned execution (retain accepted LSP status set). B's same-challenge request gets 404/ChallengeNotFoundError, with SQL execution snapshot unchanged and no B row. God IDs empty; no deterministic syntax, production/fixture/API/new-path changes. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47q verified. Paired Implementation Reviewer **accepted** the real private-owner route scenario. Focused Biome/diff, fresh local `db:test`, exact serial `RunChallengeCodeRoute.test.ts` (1 suite / 4 tests, 6.194s), and root code, types, unit, test-integrity, architecture, and complexity sensors passed. A's private challenge execution is persisted once under A; B is denied with exact `ChallengeNotFoundError`/404 and no change to ordered execution rows; accepted LSP outcomes are retained rather than forcing syntax classification. Existing anonymous/invalid-body/public-route coverage remains. `check:spec-implementation` remains at 140 known global mismatches; this assigned path is absent. This closes bounded private challenge visibility and owner-attributed persistence evidence only.

Assignment S2-47r uses contracted `FetchUserBySlugRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02 to prove legitimate authenticated cross-account profile reads and exact achievement projection. Real A/B with distinct slugs and separate unlocked-achievement sets request each other's slug, assert 200 and exact target DTO/own sorted relation IDs, with SQL profile/relation snapshots unchanged. Keep anonymous 401 and unknown slug404. The contract is authenticated shared profile access, not owner-only; no such denial assertion. Hydrate expected DTOs through real system reader. No mocks/API/fixture/new path. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47r verified. Paired Implementation Reviewer **accepted** the reciprocal authenticated profile reads. Focused Biome/diff, fresh local `db:test`, exact serial route suite (1 suite / 4 tests, 7.467s), and root code, types, unit, test-integrity, architecture, and complexity passed. A can read B by slug and B can read A; each response matches target identity/appearance and only that target's sorted unlocked-achievement IDs. Ordered SQL profile/relation snapshots are unchanged; existing anonymous401/unknown404/self-fetch remain. `check:spec-implementation` remains at 140 known global mismatches; this path is absent. Evidence supports the route's authenticated shared-read contract, not owner-only restrictions.

Assignment S2-47s uses contracted `CreatePlanetStarRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02. Seed shared planet/base star with deterministic number1. Ordinary A creates number2, then B creates number3 sequentially; assert distinct response IDs and exact persisted parent/number/name/slug/defaults, 3-star membership, unchanged original star/planet. Preserve anonymous/invalid-ID cases and cleanup. Paired pre-review approved; do not claim concurrency/uniqueness or owner denial. Status `in_progress`; no runtime evidence yet.

S2-47s first route run: A's number2 creation passed; B's number3 returned the domain-deduplicated `Nova estrela(1)`/`nova-estrela1`, while the initial assertion expected the unsuffixed name. Suite 3/4. No source changes. Paired reviewer confirmed the established `Planet.getNewStarName()`/`Name.deduplicate()` contract and approved exact same-path test expectation correction.

S2-47s-F1 verified. Corrected test asserts A's exact base name/slug and B's exact deduplicated suffix/slug in both response and persisted rows. Focused Biome/diff, fresh local `db:test`, exact serial suite (1 suite / 4 tests, 5.846s), and paired Implementation Reviewer passed. Root code, types, unit (Server169/330, Core176/638, Web118/506, Studio14/64, LSP1/1), integrity, architecture (3,875 modules / 6,989 dependencies), and complexity passed; global conformance remains at 140 known mismatches and excludes this path. This is sequential domain numbering/naming evidence only; no concurrent uniqueness claim.

Assignment S2-47t uses contracted `VerifyUserNameInUseRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02 to distinguish exact public username lookup against populated rows. Deterministic plain ASCII A/B names share a prefix >3 chars; complete existing names return 409/UserNameAlreadyInUseError, shared prefix and unused extended name return 200. Ordered full profile SQL snapshot unchanged. No case/accent/collation or private-data claims. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47t verified. Paired Implementation Reviewer **accepted** the public exact-name cases. Focused Biome/diff, fresh local `db:test`, exact serial route suite (1 suite / 4 tests, 8.685s), and root code, types, unit, test-integrity, architecture and complexity sensors passed. Exact populated usernames return 409/UserNameAlreadyInUseError; shared prefix and longer unused name return 200; ordered profile rows are unchanged. `check:spec-implementation` remains at 140 global mismatches; the assigned test path is not among them. No case/accent/collation behavior is claimed.

Assignment S2-47u targets contracted `VerifyUserEmailInUseRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02. Use two real profiles with synthetic lowercase persisted emails sharing the local part across different domains while keeping Auth identities separate. Exact public queries for each return 409/UserEmailAlreadyInUseError; unused domain and extended local-part queries return 200. Ordered full profile SQL rows unchanged. Preserve malformed/existing cases; no provider alias/case/collation claims. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47u verified. Paired Implementation Reviewer **accepted** exact-address public lookup. Focused Biome/diff, fresh local `db:test`, exact serial route suite (1 suite / 4 tests, 6.972s), and root code, types, unit, test-integrity, architecture and complexity sensors passed. Complete synthetic persisted addresses return 409/UserEmailAlreadyInUseError; unused domain and extended local part return 200; complete ordered profile snapshots are unchanged. Existing invalid/existing cases remain. `check:spec-implementation` remains at 140 global mismatches, with this path absent. No provider alias/case/collation behavior is claimed.

Assignment S2-47v uses contracted `CreatePlanetRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02. Derive initial max, seed at max+3 then max+1 (higher first with a gap), re-read seed max, and create ordinary A then B sequentially at seed max+1/+2. Assert exact response/persisted rows, empty stars/defaults/distinct IDs, complete ordered before/after rows except expected additions, and cleanup. No concurrent allocation/uniqueness or empty-catalog assumption. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47v verified. Paired Implementation Reviewer **accepted** the sequential maximum-position case. Focused Biome/diff, fresh local `db:test`, exact serial route suite (1 suite / 4 tests, 5.099s), and root code, types, unit, test-integrity, architecture, and complexity passed. The test seeds a higher position before a lower one with a gap, then ordinary A/B sequential creates use the actual seeded maximum +1/+2, return exact payload/defaults/empty stars, and persist exactly two additions while preserving prior rows. Anonymous/invalid-payload cases remain. `check:spec-implementation` remains at 140 global mismatches; this path is absent. No concurrency claim.

Assignment S2-47w targets contracted `FetchUsersListRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02 for acquired-insignia filtering. A/B share a unique prefix, only A has acquired engineer; both ordinary authenticated accounts (God IDs empty) submit repeated `insigniaRoles=engineer&insigniaRoles=engineer` keys because single-key parsing yields a scalar, violating the route's array schema. Assert exact A-only filtered row/insignia and total/page1; unfiltered baseline contains A/B; ordered profile/acquisition snapshots unchanged. No God/purchase/privilege/concurrency claim. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47w first route attempt found no engineer insignia catalog row because `clearDatabase()` clears catalog data; the test stopped at its setup guard before HTTP. Fresh local `db:test` and focused Biome/diff passed; route suite 4/5 with new case failing before request. No fallback seed, fixture, or production changes were made. Paired reviewer approved same-path refinement: seed the unique engineer row test-locally via existing `ShopFixture.createInsignias` with deterministic ID, attach using real `DrizzleUsersRepository`, then cleanup relation before insignia row. The repeated query encoding and route assertions remain unchanged.

S2-47w verified. Paired Implementation Reviewer **accepted** the refined route test. Focused Biome/diff, fresh local `db:test`, exact serial suite (1 suite / 5 tests, 7.743s), and root code, types, unit, test-integrity, architecture and complexity passed. The in-test engineer row is deterministic; only A gets the persisted acquisition. Both ordinary accounts' repeated-role query returns exact A-only engineer projection and total/pages1; unfiltered baseline includes A/B; ordered profile/acquisition snapshots unchanged. `check:spec-implementation` remains at 140 global mismatches; path absent. No purchase or privilege claim.

Assignment S2-47x uses contracted `FetchUsersListRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02 to prove inclusive creation-date bounds and correct count application for the real list query. A/B share a unique prefix and have fixed distinct UTC-midnight `createdAt`; endpoint query parameters are date-only `YYYY-MM-DD`, not full ISO. Both actors' A-date→B-date query returns A/B and total2; A-date→A-date returns only A and total1. Ordered complete profile rows unchanged. No timezone normalization, partial-day/bound or concurrency claim. Paired pre-review approved with date-only format. Status `in_progress`; no runtime evidence yet.

S2-47x verified. Paired Implementation Reviewer **accepted** the real date-filter route scenario. Focused Biome/diff, fresh local `db:test`, exact serial suite (1 suite / 6 tests, 9.297s), and root code, types, unit, test-integrity, architecture, complexity passed. The supported date-only inclusive range from Jan10 through Jan12 returns exact A/B with total2/pages1; Jan10-only range returns A with total1/pages1. Ordered full profile SQL snapshots unchanged. `check:spec-implementation` remains at 140 known global mismatches; this path is absent. No partial-day/timezone normalization claim.

Assignment S2-47y targets contracted `FetchUsersListRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02. Ordinary A/B under unique prefix both request page3/size1 beyond two matching pages and must get empty items with total2/pages2/requested page3. Then both query a unique unmatched prefix and must get empty items/total0/pages0. Ordered complete SQL profiles unchanged. No catalog-empty/order/concurrency claim. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47y verified. Paired Implementation Reviewer **accepted** both empty-result distinctions. Focused Biome/diff, fresh local `db:test`, exact serial suite (1 suite / 7 tests, 8.202s), and root code, types, unit, test-integrity, architecture, complexity passed. For both ordinary callers, page3 beyond two pages returns `[]` while retaining total2/pages2/requested page3; a unique unmatched prefix returns `[]` with total0/pages0. Headers and complete ordered profile snapshots are asserted. `check:spec-implementation` remains at 140 global mismatches and excludes this path. No catalog-empty/order/concurrency claim.

Assignment S2-47z targets contracted `FetchUserByIdRoute.test.ts` (`Modify`), RF-02/CA-03 plus RF-01/CA-01, EV-01/02. Real A/B ordinary profiles each fetch self by valid ID and assert hydrated exact DTO; each cross-fetches the other's valid ID and receives exact404/UserNotFoundError with no profile fields. Full ordered profile SQL snapshot unchanged. God IDs empty; no God-only success path or auth modifications. Paired pre-review approved. Status `in_progress`; no runtime evidence yet.

S2-47z behavior verified: paired Implementation Reviewer **accepted**; focused Biome/diff, fresh local `db:test`, and serial route suite (1 suite / 5 tests, 8.37s) passed. Both self DTOs and reciprocal exact404/UserNotFoundError/no-profile-fields behavior were confirmed with unchanged ordered SQL profiles. `check:code`, integrity, architecture and complexity passed. Per the user's request to remove checker overhead, the in-flight full `check:types` and `test:unit` were interrupted and not reported as passes; `check:spec-implementation` reports its known 140 global mismatches and omits this path. This is a scoped behavioral closeout, not completion of the whole Spec.

Assignment S2-48a batches two real run-code route branches in contracted `RunChallengeCodeRoute.test.ts` (`Modify`), RF-01/02, CA-01/03, EV-01/02: explicit output-evaluated public challenge with `escreva(leia())`, input2 and textual expected output `'3'`; A submits `escreva(leia()+1)` => accepted; B submits `escreva(leia()+2)` => wrong_answer. Assert exact LSP-formatted outputs, null errors and full persisted actor-specific rows, with A unchanged after B. Paired pre-review approved. Keep S2-47q/private and existing tests. No LSP mocks/performance/concurrency. At the user's request, omit broad checker commands; evidence is fresh local DB setup, focused real route test and paired review only. Status `in_progress` pending post-review.

S2-48a behavioral run passed: fresh local `npm run db:test -w @stardust/server` exit0; exact serial `RunChallengeCodeRoute.test.ts` suite passed 1 suite / 5 tests (7.957s). The real LSP contract returns formatted string outputs (`"3"` and `"4"`) while the challenge's expected output remains textual `'3'`; A is `accepted`, B is `wrong_answer`, both have null errors and exact full persisted rows, and B leaves A's row unchanged. Paired Implementation Reviewer **accepted** the scoped diff and evidence. No production changes or broad checkers run, per user instruction. S2-48a is verified behaviorally; the overall Spec remains in progress.

Aggregate S2 Server Implementation Review (2026-10-05, pre-revision19): **failed under the then-active EV-01/EV-02 contract**. It identified missing per-port evidence, actor matrix cases and other route paths. User decision in Spec revision19 retires EV-01/EV-02, so that specific finding no longer blocks conclusion; other phase dependencies, behavioral CA, sensors and EV-03–EV-12 remain separately tracked. Broad type/unit/checker evidence was omitted per user request; no checkers rerun.

S2-48b feasibility disposition: no source/test mutation or runtime run. The paired pre-review rejected an unread-response variant because Hono's response wrapper can buffer the retry separately, so client unread state does not establish a pending `user.created` write. A consumed-retry variant frees the queue slot and cannot reliably block that one chunk. CA-11 explicitly requires a pre-existing profile to emit `user.created`; absence cannot be asserted absent direct evidence that the write is pending. CA-18/CA-19 do not require this internal backpressure condition. Disposition: no Rule/Contract change and no further route test; existing accepted expiry, 60-second cap, post-header database failure and reconnect scenarios remain the evidence for EV-06. This feasibility item is closed as not contract-required; no broad checker ran.

Spec Reviewer revision 12: **clear**, no findings. ACH-01 from the prior review was resolved by splitting Chat/ChatMessages evidence into four distinct Create paths, each mapped to one HTTP route per Server Routes Testing Rules §2. The reviewer confirmed these routes preserve existing Auth/Database boundaries and scope.

Assignment S2-49 is recorded in the Plan for four route-level tests only. Paths, RF/CA, EV, privacy assertions and exclusions are fixed there. No code/test mutation has started; paired implementation pre-review and Builder ACK remain prerequisites. Broad checkers remain waived at the user's request; planned verification is fresh local `db:test`, focused formatting, exact serial route suites, and paired post-review.

S2-49 paired implementation pre-review: **approved with refinements**, no Architecture/Rules blocker. Exact findings/refinements are recorded in the Plan: seed `public.users` with the existing ProfileFixture after real AuthFixture identities; assert exact 404/ChatNotFoundError for valid foreign chat requests; retain per-route anonymous 401; inspect complete ordered SQL snapshots for denied POST; and verify positive DTO writes with database readback. No source or test edits preceded this approval. Builder ACK and focused route execution remain pending.

S2-49 verified: focused formatting passed; fresh local `npm run db:test -w @stardust/server` passed; exact four serial conversation route tests passed 4/4 suites, 8/8 tests in 14.186s with no open-handle warning. The paired Implementation Reviewer **accepted** the four-file diff and evidence. Tests prove bodyless default chat creation/readback, ordinary A/B list isolation and pagination headers, ordered per-owner message results, exact `ChatNotFoundError` 404 for foreign chat reads/writes, positive persisted message writes/readback, and unchanged full ordered Chat/ChatMessage snapshots after denied B→A write. Only the four Spec-contracted test paths changed. Logs: `/tmp/stardust-s2-49-f2-db.log`, `/tmp/stardust-s2-49-f2-route.log`. No global checkers run per user request. Aggregate S2 EV-01 per-operation crosswalk, EV-02 actor matrix, and consolidated paired review still remain before W2 release.

Aggregate S2 re-audit after S2-49: **not ready to release W2**. S2-49 closes route behavior for Chats `add/findById/findManyByUser` and ChatMessages `add/findAllByChat`, but does not cover Chats `replace/remove` or the existing-chat branch of `CreateChatUseCase`. Spec revision 13 adds two route paths for rename/delete and extends the existing create route path to cover name deduplication. The prior crosswalk is stale (predates S2-47a and accepted slices through S2-49); EV-01 and EV-02 remain pending until reconciled at port-method level and by actor applicability. Reviewer identified remaining runtime-evidence families: Notes/Snippets; Questions/Stories/Guides/TextBlocks, including concurrent audio JSON update/clear; ChallengeSources/Solutions and remaining Challenges/ChallengeCodeExecutions CRUD/count/latest/vote branches; Rankers/Tiers jobs; successful Shop acquisitions; remaining Planets/Stars mutations/guards; API-key/MCP tool operations; and real Drizzle persistence for System jobs. EV-02 must apply public/A-B/God/valid-revoked-key/forged-JWT actors only at relevant boundaries, not as a Cartesian matrix. Broad checkers are waived and are separate from behavioral evidence. W2 remains unreleased pending Spec rev13 clear, exact S2 assignments, reconciled crosswalk, and fresh aggregate review.

Spec Reviewer revision 13: **clear**, no findings. The amendment maps one route per test path for rename/delete and adds the existing-name deduplication branch to the established POST route test. S2-50 is drafted in the Plan to cover these specific method gaps; paired implementation pre-review is required before code edits. No runtime candidate exists yet.

S2-50 paired implementation pre-review: **approved with refinements**, no blocker. The Plan records deterministic prior-chat selection/name deduplication, exact generic-send 200 contracts for rename/delete, valid name constraints, cross-account exact 404 and unchanged snapshots, anonymous 401 payloads, and real `ON DELETE CASCADE` assertions with another account's rows preserved. No code edits preceded approval.

S2-50 verified: focused formatting passed; fresh local `npm run db:test -w @stardust/server` passed; exact three serial route suites passed 3/3 suites, 7/7 tests in 10.127s without open-handle warnings. Paired Implementation Reviewer **accepted**. The prior default chat remains unchanged and the new row is `Novo chat(3)`; owner PATCH returns exact 200 DTO and SQL readback; valid foreign PATCH/DELETE return exact ChatNotFound 404 and leave full SQL snapshots unchanged; owner DELETE returns current 200/no DTO, cascades A's messages and preserves B's chat/message rows. Exact anonymous 401 behavior remains. Only the three contracted conversation test paths changed; no global checker run per user request. Logs: `/tmp/stardust-s2-50-db.log`, `/tmp/stardust-s2-50-route.log`.

Spec Reviewer revision 13 is clear; S2-50 is verified with paired pre/post-review acceptance and focused local evidence. Its accepted results close Chats `replace/remove` and the default-name deduplication branch. The remaining stale artifact is the broader 25-port EV-01 and boundary-specific EV-02 crosswalk; a method-level read-only reconciliation is underway before selecting the next bounded runtime assignments.

## Historical EV-01/EV-02 method crosswalk — S2-50 checkpoint

This crosswalk records the investigation as of revision 18 only. EV-01/EV-02 were retired by the user in revision19, so `M`/`P` entries below do not require new assignments and do not block Spec conclusion. Preserve it as an audit trail; do not use it as an active gap ledger.

This replaces the stale broad family audit as the current gap ledger. `C` means accepted direct real-route/runtime evidence at the named method, `P` means indirect or only partial branch evidence, and `M` means no accepted real-consumer evidence found. Baseline paths below are accepted suites, but their individual assertions were not re-audited in this pass; do not overclaim from suite names. S2-49/50 Chat evidence is paired-reviewed and current.

| Port | Method coverage and evidence |
| --- | --- |
| ApiKeysRepository | `findById` M; `findByHash` P (persisted auth/rate-limit boundary in `McpRateLimitMiddleware.test.ts`, `RateLimiterRoute.test.ts`, not valid/revoked/forged matrix); `findManyByUserId`, `add`, `replace`, `revoke` M. |
| ChallengeCodeExecutionsRepository | `add` C (`RunChallengeCodeRoute.test.ts`, 47q/48a); `findManyByUserAndChallenge` C (47i); `countIncorrectByUserAndChallenge` C (47j); `findLatestByUserAndChallenge` P (latest-row selection not specifically asserted). |
| ChallengeSourcesRepository | `findById`, `findNextNotUsed`, `findByChallengeId`, `findMany`, `add`, `findAll`, `replace`, `replaceMany`, `remove`: M. |
| ChallengesRepository | `findById` C (`RunChallengeCodeRoute`, 47q/48a); `findBySlug` C (baseline `FetchChallengeBySlugRoute`); `findMany` C (baseline `FetchChallengesListRoute`); `findByStar`, `findChallengeNavigationBySlug`, `findAllByNotAuthor`, `countPublicChallenges`, `findAllCategories`, `findVoteByChallengeAndUser`, `add`, `addVote`, `replace`, `remove`, `removeVote`, `replaceVote`, `countAll`, `countByMonth`, `expireNewChallengesOlderThanOneWeek`: M. |
| SolutionsRepository | `findById`, `findBySlug`, `findMany`, `add`, `replace`, `remove`, `addSolutionUpvote`, `removeSolutionUpvote`: M. |
| ChatMessagesRepository | `findAllByChat` C (`FetchChatMessagesRoute`, 49); `add` C (`SendChatMessageRoute`, 49; SQL readback and denied-write snapshots). |
| ChatsRepository | `findById`, `findManyByUser`, `findLastCreatedByUser`, `add`, `replace`, `remove`: C (`FetchChatsRoute`, `CreateChatRoute`, `EditChatNameRoute`, `DeleteChatRoute`, 49/50). |
| CommentsRepository | All methods C via baseline `PostChallengeComment`, `PostSolutionComment`, `ReplyComment`, `FetchChallengeCommentsList`, `FetchSolutionCommentsList`, `FetchCommentReplies`, `EditComment`, `DeleteComment`; exact owner-denial coverage is not established for every method. |
| QuestionsRepository | `findAllByStar`, `updateMany`: C (S2-52 protected GET and God PUT with SQL readback). |
| StoriesRepository | `findByStar`, `update`: C (S2-52 protected GET and God PUT with SQL readback). |
| TextBlocksRepository | `findAllByStar`, `updateMany`, `updateAudio`, `clearAudio`: C (S2-53 real routes/Drizzle/Postgres, complete star JSON readback, concurrent JSONB writes attributable through blocker chains to the held fixture-row lock, and already-generated audio job persistence). |
| GuidesRepository | `findById`, `findAllByCategory`, `findLastByPositionAndCategory`, `add`, `replace`, `replaceMany`, `remove`: C (S2-52 public reads; God create/reorder/title/content/delete with real event broker and SQL readback). `findAll` P: categories covered, no unfiltered contract exercised. |
| SnippetsRepository | `findById`, `findManySnippets`, `add`, `replace`, `remove`: C (`FetchSnippetsList`, `FetchSnippet`, `CreateSnippet`, `UpdateSnippet`, `EditSnippetTitle`, `DeleteSnippet`, S2-51; own/private/public visibility and persisted writes). |
| AchievementsRepository | `findById`, `findLastByPosition`, `findAll`, `findAllUnlockedByUser`, `add`, `replace`, `replaceMany`, `remove`: C via baseline CRUD/reorder plus 47k/47l; `addMany` M. |
| NotesRepository | `findById`, `findManyByUser`, `add`, `replace`, `remove`: C (`FetchNotesList`, `CreateNote`, `UpdateNote`, `DeleteNote`, S2-51; private A/B denial and SQL snapshots). |
| UsersRepository | `findById` C (47z); `findByIdsList` M; `findBySlug` C (47r; authenticated cross-account reads are allowed); `findByName` M; `findByEmail`, `findByGoogleAccountId`, `findByGithubAccountId` P; `findByTierOrderedByXp` M; `findMany` C (47n/47w/47x/47y); `findUnlockedStars`, `findRecentlyUnlockedStars` P; `containsWithEmail` C (47u); `containsWithName` C (47t); `findAll` P; `add` C (profile creation/`RetryUserCreationRoute`); `addMany` M; `addAcquiredAvatar`, `addAcquiredRocket` M; `addAcquiredInsignia` P (47w uses it for setup, not acquisition route); `addUnlockedStar` C (baseline reward routes); `addRecentlyUnlockedStar`, `removeRecentlyUnlockedStar` M; `addUpvotedComment`, `removeUpvotedComment` C (baseline upvote route); `addUnlockedAchievement` C (rescue); `addRescuableAchievement`, `removeRescuableAchievement` C (47k); `addCompletedChallenge` C (baseline completion reward); monthly/all completed challenge and unlocked star counters C (baseline KPI routes); `replace` C (`UpdateUserRoute`, 47m); `replaceMany` M; `countByMonth`, `countAll` C (`FetchCreatedUsersKpiRoute`, 47o). |
| RankersRepository | `findAllByTier`, `findAllByTierOrderedByXp`, `addWinners`, `addLosers`, `removeAll`: M (assembly/unit evidence is not real Drizzle job persistence/readback). |
| TiersRepository | `findAll`, `findById`, `findByPosition`: M. |
| FeedbackMessagesRepository | `add`, `addAttachments`, `findById`, `listByReport`: C via baseline send/fetch/attachment routes. |
| FeedbackReportsRepository | `add`, `findById`, `findByIdAndAuthor`, `findAuthorEmail`, `list`, `findMany`, `save`, `changeStatus`, `listByAuthor`, `countUnreadByAuthor`, `markAsRead`: C via baseline reporting routes; actor evidence is broad but not Cartesian. |
| AvatarsRepository | `findById`, `findMany`, `add`, `replace`, `remove`: C via baseline CRUD/list routes; `findSelectedByDefault`, `findAllByPrice`: P (no method-specific assertion identified). |
| InsigniasRepository | All methods C via baseline Insignia CRUD/list routes. Successful user acquisition is still missing at `UsersRepository.addAcquiredInsignia`. |
| RocketsRepository | `findById`, `findMany`, `add`, `replace`, `remove`: C via baseline CRUD/list; `findSelectedByDefault`, `findAllByPrice`: P. |
| PlanetsRepository | `add` C (47v); `findAll` C (47p); `findLastPlanet` C (47v); `findById`, `findByStar` P; `findByPosition`, `replace`, `replaceMany`, `remove`: M. |
| StarsRepository | `findAllOrdered` C (47p); `findById`, `findBySlug` C (baseline fetch routes); `findByNumber` P; `add` C (47s); `replace` C (baseline name/type/availability routes, guards not fully crosswalked); `replaceMany`, `remove`: M. |

### Actor applicability

Apply actors by boundary, not as a Cartesian product. A/B ownership and foreign denial are required for private Notes/Snippets/API-key CRUD, user acquisitions, and relevant challenge operations. Public/anonymous positives apply to public catalogs, comment reads, and name/email availability; anonymous 401 applies only to authenticated routes. God/admin applies to management operations in Achievements, Shop, and Feedback. Valid/revoked API-key and forged-JWT cases apply at the auth/MCP boundaries; current auth/rate-limit and SSE bearer-precedence tests do not prove API-key CRUD or all toolkit writes. System/job evidence remains missing for TextBlocks audio, Rankers/Tiers, and challenge expiry. Authenticated cross-account reads by slug are an intentional Users contract.

### Missing runtime evidence and path disposition

These groups were recorded as EV-01/EV-02 gaps at revision18. They are historical only after revision19 and do not authorize new assignments. Any future test work must follow a still-active CA/EV and its exact Spec paths.

1. Notes and Snippets: private A/B list/read/write/delete with persisted-state assertions.
2. Questions, Stories, Guides, TextBlocks: real reads/writes; audio JSON update/clear with concurrency; real job persistence where no route exists.
3. ChallengeSources, Solutions, remaining Challenges and CCE: CRUD/vote/count/navigation/expiry/latest-row methods not proven above.
4. Rankers/Tiers: job-driven winner/loser/reset writes and ordered readback; real Drizzle effects.
5. Users acquisitions: successful Avatar/Insignia/Rocket purchases with persisted balance/relations.
6. Planets/Stars: lookup/reorder/replaceMany/delete and remaining availability/type/name guards.
7. API keys/MCP: owner-scoped list/create/rename/revoke plus valid/revoked/foreign-key behavior through authenticated tools.
8. Users: `findByIdsList`, `findByName`, `findAll` exact runtime cases; Google/GitHub/email and stars lookups where current partial evidence does not assert the specific lookup; `addMany`, recent-star mutations and `replaceMany`.

Consolidated paired S2 review remains pending these cells. Checker status is tracked separately; user-waived broad checkers are not behavioral gaps.

S2-51 is drafted to close every `NotesRepository` method and all `SnippetsRepository` methods with ten route-specific real integration tests. This is a test-only amendment with no product or authorization contract change. Spec revision 14 review found ACH-01: missing parent router prefixes; revision 15 corrects these to `/profile/notes` and `/playground/snippets`. Spec Reviewer revision 15 clear and paired pre-review are required before Builder mutation. The method crosswalk above is authoritative for remaining gaps and evidence freshness.

S2-51 paired implementation pre-review: **approved with required refinements**, no blocker. The Plan records exact semantics: ProfileFixture satisfies FKs; Notes title search/pagination and 201/200/empty contracts; Snippets are list-paginated without search/order, private foreign access maps to exact 405/SnippetNotFoundError, public cross-account reads remain allowed, and the test does not claim public foreign writes are denied. Complete ordered SQL snapshots must remain unchanged after private denials. No edit has started.

S2-51 verified: Spec Reviewer revision15 **clear**; paired pre-review approved with refinements; post-review **accepted**. Focused formatting passed; fresh local exporter plus `npm run db:test -w @stardust/server` passed; exact ten serial route suites passed 10/10 suites, 20/20 tests (37.083s), no handle warning. Private Notes list/title-search pagination/create/update/delete and Snippet list/by-id/create/update/title/delete are backed by real SQL readback. Ordinary A/B foreign access preserves full ordered SQL snapshots; public Snippets remain readable cross-account. Existing status/errors are retained. Only ten contracted new test paths changed. Logs: `/tmp/stardust-s2-51-f1-db.log`, `/tmp/stardust-s2-51-f1-route.log`. Initial candidate discovered unexported `SnippetNotFoundError` and nondeterministic generated nested author ID; same-path test assertions were corrected to exact HTTP body and valid UUID while preserving stable DTO fields. No production/fixture/helper changes. Global checker runs remain waived per user request.

S2-52 is drafted for eleven route-specific real tests covering Questions, Stories, and Guides methods currently marked `M` in the EV-01 crosswalk. This test-only amendment leaves product/permission contracts unchanged. Spec revision 16 clear and paired pre-review are required before Builder mutation; actor applicability follows the actual route boundaries.

S2-52 paired pre-review: **approved with refinements**, no blocker. The exact port-to-route method map, public/ordinary/God actor boundaries, status/body contracts, live InngestBroker requirement, SpaceFixture star lifecycle, SQL-driven lesson seeding, and manual-guide category seeding/position semantics are recorded in the Plan. No code edit has started.

S2-52 verified: Spec Reviewer rev16 **clear**; paired pre-review approved with refinements and paired post-review **accepted**. Focused formatter passed; fresh local `db:test` passed; exact eleven serial suites passed 11/11 suites, 20/20 tests (42.885s) normal exit/no handles. Questions/Stories route evidence proves authenticated reads, God-only persisted updates and ordinary-user denials; Guides proves anonymous category-filtered reads, God-only create/reorder/title/content/delete, category-relative positions, real InngestBroker events and SQL readback. No production/helper/fixture changes. Logs: `/tmp/stardust-s2-52-f2-db.log`, `/tmp/stardust-s2-52-f2-route.log`. Initial invalid one-option shuffled question fixture caused a hung/canceled first run; replaced with valid OpenQuestion DTO within the same tests; no source change, final runtime is clean.

S2-53 covers all TextBlocks repository methods plus System-job persistence. The initial amendment was reviewed as Spec revision17; revision18 resolves its Jest project overlap by excluding `src/tests/**/*.integration.test.ts` from `server` and selecting the job path in `server-integration`. Current implementation basis is revision18.

Spec Reviewer rev17 raised ACH-01: the integration job file would also match the broad unit `server` pattern. Spec revision18 resolves this by excluding `src/tests/**/*.integration.test.ts` from `server` and selecting the jobs path in `server-integration`; prior project selections stay unchanged. Spec Reviewer revision18 is **clear**, no findings.

S2-53 paired implementation pre-review: **approved with CA-02 refinement**, no blocker. Because the batch endpoint takes no block index, its test uses one POST with two seeded eligible blocks, holds a real PostgreSQL star-row lock, waits for both internal per-index `updateAudio` JSONB writes to block, then releases and asserts both updates plus unrelated fields. `ClearTextBlockAudioFileRoute.test.ts` separately exercises two concurrent DELETE requests for distinct indices under the same real lock and verifies both filename-free error audio keys are removed while unrelated fields survive. The job test proves persistence for an already-generated event only, not end-to-end Inngest/TTS/S3. Plan S2-53 records these constraints and the revision18 Jest exclusion/inclusion. Builder ACK was received before implementation.

S2-53 Builder ACK was received before edits. Builder accepted the six-path scope, revision18 contract and CA-02 real-lock/poll cases for both `updateAudio` and `clearAudio`, the already-generated-event-only job boundary, and focused validation without broad global checkers. The assignment’s final verified status is recorded below.

S2-53 initial implementation and focused runtime complete. Exactly the six permitted paths changed: four TextBlocks route tests, one `UpdateTextBlockAudioJob.integration.test.ts`, and two Jest selection lines. Focused formatter passed; fresh exported-local `npm run db:test -w @stardust/server` passed; the exact five serial `server-integration` suites passed 5/5 suites, 9/9 tests in 20.141s with normal exit/no open handles. The tests observed two matching JSONB update waiters, verified complete-star persistence, and confirmed job persistence/status/actor contracts. Logs: `/tmp/stardust-s2-53-db.log`, `/tmp/stardust-s2-53-route.log`.

S2-53 paired post-review: **failed pending narrow test-only correction**. The first fix captured the lock-holder PID but required it as a direct `pg_blocking_pids(pid)` member. PostgreSQL reports earlier waiters in a lock queue as soft blockers, so the second row update can reach the holder through another waiter. The reviewer approved a recursive blocker walk per matching origin query: keep current-database, `wait_event_type = 'Lock'`, and JSONB `stars` update filters; recursively follow `pg_blocking_pids` with cycle protection; require two distinct origin PIDs to reach the exact captured holder PID. The reviewer otherwise accepted route contracts, persistence assertions, job scope, and Jest project disjointness. The Plan already uses the correct Spec revision18 anchor. A second Builder fix and repeated focused runtime are pending; broad checkers remain waived.

S2-53-F1 correction and focused runtime complete, paired re-review pending. The two lock polls now recursively follow each matching waiter’s `pg_blocking_pids` chain with cycle protection and count distinct matching JSONB star-update origins reaching the captured test lock-holder PID. Only `RequestTextBlockAudioBatchRoute.test.ts` and `ClearTextBlockAudioFileRoute.test.ts` changed for this correction. Focused formatter passed; fresh exported-local `db:test` passed; all five exact serial `server-integration` suites passed 5/5, 9/9 tests in 13.098s, normal exit/no handles. Logs: `/tmp/stardust-s2-53-f2-db.log`, `/tmp/stardust-s2-53-f2-route.log`. No broad checkers ran.

S2-53 paired post-review: **accepted**. The reviewer confirmed both recursive blocker walks reach the captured PID after the fixture star’s `FOR UPDATE`, count two distinct origin updates, protect against cycles, retain reliable cleanup, and preserve all actor/status/response/persistence assertions. The direct-blocker attempt and its failed run above are superseded by the accepted recursive fix. TextBlocksRepository methods are now C in the method crosswalk. Spec revision18 remains clear; S2-53 is verified. Broad global checkers remain waived by user request.

## Revision 20 cancellation and draft PR preflight — 2026-10-06

The user explicitly superseded the Spec and Plan at revision20, cancelled the remaining implementation outcomes, and retained C2 only for cancellation closeout/handoff. This draft PR is an explicit exception to the usual Spec-conformance prerequisite; it does not mark the Spec implemented, accepted, or concluded. No production cutover, remote database mutation, or release was performed.

Fresh repository checks after the final test-boundary edit: `npm run check:code`, `npm run check:types`, and `npm run test:unit` passed. Unit totals: Web118 suites/506 tests, Server169/330, with all Turbo tasks successful. `npm run check:test-integrity -- --base 8f9f71ac3dc4bd42312f5890f05c5da02c8814a9` passed after aligning its allowlist with the existing Jest `server-integration` job-test pattern; the checker’s 12 script tests passed. `git diff --check` passed.

Earlier in this preflight, `npm run db:test -w @stardust/server`, `npm run check:architecture`, `npm run check:complexity`, and `npm run build` passed against the local stack/build. The complete Web integration run reported 82 passing and 6 failing among 88 tests. The failures were only in newly added experimental E2E cases for a signup-resume UI that is not wired to the onboarding service and social-auth server actions that browser-side `ServerMock` cannot intercept. Those incomplete cases were removed from this draft; the remaining signup browser file then passed 9/9, and the other 82 cases had passed in the full run. No claim is made that signup resumption or social-auth browser recovery is complete.

All 114 Server integration files were exercised in serial batches. Two batches initially failed three attachment-storage cases because the test process did not inherit the local MinIO credentials from root `.env.local`; rerunning those three exact files after `eval "$(node scripts/export-local-database-env.mjs)"` passed 3/3 suites and 11/11 tests. The other Server integration batches passed.

Manual Web smoke: the local Web sign-in page loaded, but the protected-route path could not be validated. `npm run db:test` had reset the local database; the configured E2E account was absent, the sign-in Server Action returned HTTP200 with invalid-login feedback, and navigation remained at `/auth/sign-in`. Browser diagnostics showed unrelated PostHog calls blocked on unsafe port1. No `/space` success or authenticated `/auth/account` status is claimed. The local-only onboarding receipt secret required to start the changed Server was generated in ignored root `.env.local` and is not staged.

Final local migration rerun after restoring manifest-exact routine bodies: `npm run db:test -w @stardust/server` passed, and `node scripts/check-drizzle-transition.mjs --environment local --phase server-owned --manifest apps/server/src/database/drizzle/legacy-schema-manifest.json` reported `compatible: true` with no differences. The generated migration keeps the trailing spaces in several legacy SQL function bodies because they are part of the catalog definitions checked by the transition manifest.
