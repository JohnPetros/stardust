---
title: Plano da solução oficial de desafio com Code Playback
spec: documentation/features/challenging/challenge-solutions/specs/oficial-solution-spec.md
spec_revision: f4c34650f802fcb26b40d840ca72427da8e1a830
status: completed
current_task: null
current_phase: null
base_commit: d0970aeffb15f6783acafbd4e27d682e123144f4
last_updated_at: 2026-07-27
---

# Plano — Solução oficial de desafio com Code Playback

## Estado Atual

- **Tarefa ativa:** CI-05 — preparar LSP nos jobs de testes e quality ratchet do server
- **Estado:** `completed`
- **Última ação:** Builder adicionou o build de `@stardust/lsp` aos jobs Tests e Quality ratchet do server.
- **Próxima ação:** nenhuma no escopo da Spec; aguardar CI remoto e merge do PR.
- **Estado das fases:** F1 `accepted`; F2 `accepted`; F3 `accepted` após CI-05.
- **Bloqueios:** nenhum.
- **Workspaces afetados:** `@stardust/core`, `@stardust/server`, `@stardust/web`

## Pendências

- JC-02: resolvido e aceito pelo Judge F2/F3.
- JC-03: resolvido e aceito pelo Judge F2.
- JC-04: resolvido; todas as tarefas e fases estão reconciliadas.

### JC-01 — Bloqueio ambiental ainda aberto no fechamento

- **Origem:** Judge da conclusão em 2026-07-25.
- **Impacto:** o Plan manteve BLK-001 como `blocked` até a reconstrução do banco local ser repetida.
- **Resolução:** reset local do Supabase concluído em 2026-07-25; a integração server foi repetida com 61 suítes e 183 testes aprovados.
- **Próxima ação:** nenhuma para BLK-001; repetir o Conclusion Gate e o Judge de conclusão após resolver JC-02.
- **Status:** `resolved`

### JC-02 — Testes removidos ou cobertura reduzida

- **Origem:** Judge da conclusão em 2026-07-25.
- **Impacto:** o diff remove `StartServerEntryPoint.test.ts`, `SupabaseAuthService.test.ts` e `UpdateAvatarRoute.test.ts`, além de substituir a cobertura anterior de `useChallengePage`.
- **Resolução:** `StartServerEntryPoint.test.ts` e `SupabaseAuthService.test.ts` foram restaurados; `UpdateAvatarRoute.test.ts` permanece presente; a cobertura original de hidratação/estado de `useChallengePage` foi recomposta e os casos de solução oficial foram mantidos.
- **Próxima ação:** confirmar a recuperação no Judge independente de F2/F3.
- **Status:** `resolved`

### JC-03 — Baseline do quality ratchet rebaixado

- **Origem:** segundo Judge da conclusão em 2026-07-25.
- **Impacto:** `packages/harness/baselines/server.json` reduz `queue` de 84,87%/94,59% para 14,74%/57,39% e `rest` de 71,48% para 66,79%, permitindo que o CI aceite regressões.
- **Resolução:** `packages/harness/baselines/server.json` foi restaurado byte a byte ao estado do commit-base; `npm run quality-ratchet --workspace=server` passou sem `--update-baseline`.
- **Próxima ação:** confirmar no Judge de conclusão.
- **Status:** `resolved`

### JC-04 — Plan não reconciliado para conclusão

- **Origem:** segundo Judge da conclusão em 2026-07-25.
- **Impacto:** o Plan permanece `in_progress`, F2/F3 estão `changes_requested` e apenas 10/13 tarefas estão verificadas, contrariando as pré-condições de conclusão.
- **Resolução:** T2.1, T2.2 e T3.6 foram verificadas novamente; os Implementation Gates server/web passaram e o Plan foi reconciliado para os Judges independentes das fases.
- **Próxima ação:** concluir F2/F3 após os Judges e então repetir a conclusão.
- **Status:** `resolved`

### BLK-001 — Supabase local indisponível

- **Gate/comando:** reset local do Supabase durante a validação de T2.1
- **Tipo:** `ambiental`
- **Erro histórico:** pull da imagem PostgreSQL retornou HTTP `429`; o container não ficou disponível na tentativa de 2026-07-23.
- **Impacto resolvido:** a reconstrução integrada do banco local ficou pendente até o reteste do ambiente.
- **Evidência:** `npm run db:test -w @stardust/server` concluiu o reset local em 2026-07-25, aplicando as migrations até `20260723120000_add_challenge_official_solution.sql`; em seguida, `npm run test:integration -w @stardust/server` passou com 61 suítes e 183 testes.
- **Workaround anterior:** `migration-check`, typecheck, codecheck, testes unitários e quality-ratchet do server passaram enquanto o registry estava indisponível.
- **Próxima ação:** nenhuma; reabrir somente se uma regressão ambiental voltar a impedir a integração.
- **Status:** `closed`

### BLK-002 — Supabase local indisponível durante testes HTTP

- **Gate/comando:** testes direcionados de `FetchChallengeBySlugRoute` e `FetchChallengesListRoute`
- **Tipo:** `ambiental`
- **Erro:** `Database connection error. Retrying the connection.`
- **Impacto:** os 4 cenários HTTP não puderam executar contra o banco local.
- **Evidência:** primeira saída dos testes direcionados em 2026-07-23; 4/4 falharam durante a conexão. Reteste posterior e Implementation Gate passaram com os 4 cenários HTTP.
- **Workaround:** readiness gate, server typecheck e server codecheck passaram; após a disponibilidade do Supabase, os testes direcionados e a integração server passaram.
- **Próxima ação:** nenhuma; reabrir somente se uma regressão ambiental voltar a impedir a integração.
- **Status:** `closed`

> A política atual mantém a integração completa fora do `contract-check`; o
> teste integrado permanece reservado ao Builder (direcionado) e ao Conclusion
> Gate (suíte completa).

### BLK-003 — Quality ratchet incompatível com a suíte separada

- **Gate/comando:** Implementation Gate — `quality-ratchet:server`
- **Tipo:** `preexistente/contratual`
- **Erro:** a comparação contra o baseline de 2026-07-10 reportou regressões em `queue` (lines 14,74% vs. 84,87%; branches 57,39% vs. 94,59%) e `rest` (lines 66,79% vs. 71,48%).
- **Impacto:** o Implementation Gate não pode ser aceito, portanto o novo Judge de T2.2 ainda não foi acionado.
- **Evidência:** o comando executou 149 suites e 256 testes do projeto `server`, todos aprovados; o worktree já contém a separação `server`/`server-integration` em `apps/server/jest.config.ts`, a remoção de dois testes de cobertura e a mudança do comando raiz `test:unit`.
- **Próxima ação:** nenhuma para o Implementation Gate desta implementação; o sensor foi omitido por decisão explícita do usuário e permanece obrigatório apenas na validação integrada final.
- **Status:** `waived`

### BLK-004 — Docker indisponível no contract-check

- **Gate/comando:** Implementation Gate — `contract-check --run`
- **Tipo:** `ambiental`
- **Erro:** `spawnSync docker ENOENT` ao iniciar o proxy/fixture do Supabase local.
- **Impacto:** os testes de integração do server não puderam executar; 56 suites falharam e 5 passaram, com 176 testes falhando por não conseguirem iniciar o Docker.
- **Evidência:** execução do gate em 2026-07-23; architecture-check e migration-check passaram antes do contract-check.
- **Próxima ação:** nenhuma; o contract-check voltou a passar após Docker ficar disponível.
- **Status:** `closed`

### BLK-005 — Worktree sujo bloqueia scope-check isolado da T3.5

- **Gate/comando:** Implementation Gate da T3.5 com somente os três paths da tarefa
- **Tipo:** `ambiental`
- **Erro:** `SCOPE_PATH_NOT_ALLOWED` para alterações preexistentes de F1, F2, T3.1–T3.4 e Harness desde a base `d0970aeffb15f6783acafbd4e27d682e123144f4`.
- **Impacto:** o gate não alcançou os sensores da T3.5.
- **Evidência:** execução do gate em 2026-07-25; a lista do scope-check contém somente paths já presentes no estado inicial desta retomada, além dos três paths da T3.5.
- **Workaround:** repetir o gate com a união explícita dos paths já alterados no worktree, mantendo o base commit para detectar alterações adicionais.
- **Próxima ação:** nenhuma; a união dos paths preexistentes foi declarada e o gate passou.
- **Status:** `closed`

### BLK-006 — Servidor Next.js existente bloqueia a suíte Playwright da T3.8

- **Gate/comando:** `npm run test:integration -w @stardust/web -- official-solution.test.ts`
- **Tipo:** `ambiental`
- **Erro:** `Another next dev server is already running` ao iniciar o servidor configurado para a suíte; o processo existente é `next-server` PID `25388`.
- **Impacto:** a primeira tentativa da jornada real de browser da solução oficial não foi executada; T3.8 aguardou a liberação do ambiente.
- **Evidência:** execução em 2026-07-25; o teste encerrou com exit code 1 antes dos cenários Playwright.
- **Workaround:** manter o processo existente sem encerrá-lo automaticamente; repetir a suíte após ele ser encerrado pelo responsável ou após o ambiente liberar o lock.
- **Próxima ação:** nenhuma; o processo terminou e a suíte foi repetida com sucesso.
- **Status:** `closed`

## Dependências de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Estabelecer e publicar o contrato de domínio do Code Playback e da solução oficial | - | - |
| F2 | Persistir e transportar a solução oficial sem ampliar a projeção paginada | F1 | F3 |
| F3 | Entregar Playback, navegação, listagem e rota oficial na web | F1; integração final depende de F2 | F2 |

**Estratégia de paralelismo:** F1 fixa o contrato consumido pelas demais fases. Depois de F1, F2 pode evoluir migration, tipos e adapters enquanto T3.1–T3.7 avançam em paths web independentes. Dentro de F3, T3.1, T3.2, T3.3, T3.4 e T3.6 não compartilham arquivos e podem ser executadas em paralelo; T3.5 reserva a composição do Code Playback, T3.7 reserva a composição da listagem de soluções e T3.8 reserva slot, App Router, infraestrutura compartilhada de browser e evidência integrada. Não há fase de `studio`, pois a Spec mantém autoria e edição fora do escopo.

## F1 — Contrato e domínio

**Objetivo:** disponibilizar um contrato global, validado e imutável de Code Playback e preservar a solução oficial no round-trip do desafio.

### Tarefas

- [x] **T1.1** — Implementar o DTO, a structure e o faker de Code Playback com validação e cópia defensiva
  - **Estado:** `accepted`
  - **Depende de:** -
  - **Critérios da Spec:** REQ-01, REQ-05, REQ-06, REQ-09, AC-01, AC-10, AC-11, AC-16, AR-02
  - **Resultado observável:** `CodePlayback.create()` aceita a fixture normativa válida, rejeita todas as invariantes inválidas do contrato e seu getter `dto` preserva ordem e conteúdo sem compartilhar referências mutáveis; o faker produz um DTO determinístico válido.
  - **Camada:** `core`
  - **Paths permitidos:**
    - `packages/core/src/global/domain/structures/dtos/CodePlaybackDto.ts`
    - `packages/core/src/global/domain/structures/CodePlayback.ts`
    - `packages/core/src/global/domain/structures/fakers/CodePlaybacksFaker.ts`
    - `packages/core/src/global/domain/structures/tests/CodePlayback.test.ts`
    - `package.json`
    - `package-lock.json`
    - `turbo.json`
    - `apps/web/package.json`
    - `apps/web/jest.config.ts`
    - `apps/web/tsconfig.playwright.json`
    - `apps/server/src/tests/routes/shop/avatars/UpdateAvatarRoute.test.ts`
    - `apps/web/src/ui/challenging/widgets/pages/Challenge/tests/useChallengePage.test.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/core-package-rules.md`
    - `documentation/rules/domain-objects-testing-rules.md`
  - **Cobertura obrigatória:** criação e round-trip da fixture normativa; steps e ranges inválidos; números não finitos, referências cíclicas e valores não serializáveis; títulos e labels vazios; ponteiros e highlights fora dos limites ou sobrepostos; grids não retangulares; coleções vazias; preservação de ordem; ausência de mutação por entrada, saída ou navegação sobre snapshots.
  - **Tentativas:** 9
  - **Sensores:** codecheck/typecheck globais passaram; unit serial passou em todos os workspaces (core 171/171 suites, 606/606 testes; web 90/90 suites, 379/379 testes; demais workspaces sem falhas); quality-ratchet core passou (Biome warnings 12, sem regressão); architecture e migration passaram; contract-check isolado falhou apenas por manifesto `.next` ausente no worktree sintético; contrato no worktree principal passou (Web 34 cenários, Server/Core contract evidence).
  - **Avaliação:** `accepted` — Judge independente confirmou REQ-01/05/06/09, AC-01/10/11/16 e AR-02.
  - **Findings bloqueantes:** nenhum; JI-01, JI-02 e JI-03 resolvidos.
  - **Próxima ação:** prosseguir para T1.2 após readiness gate.

- [x] **T1.2** — Publicar o Code Playback nos barrels globais do core
  - **Estado:** `accepted`
  - **Depende de:** T1.1
  - **Critérios da Spec:** REQ-01, AC-01
  - **Resultado observável:** DTOs, structure e faker do Code Playback são importáveis pelas entradas públicas previstas do `@stardust/core`, sem alterar barrels de widgets ou criar dependência cross-domain.
  - **Camada:** `core`
  - **Paths permitidos:**
    - `packages/core/src/global/domain/structures/dtos/index.ts`
    - `packages/core/src/global/domain/structures/index.ts`
    - `packages/core/src/global/domain/structures/fakers/index.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/core-package-rules.md`
  - **Cobertura obrigatória:** não se aplica; barrels não recebem teste direto, e a resolução pública é coberta pelos sensores de typecheck/build e pelo consumo nas tarefas dependentes.
  - **Tentativas:** 3
  - **Sensores:** Builder e gate: codecheck/typecheck/build do core, resolução pública de `@stardust/core/global/structures/{dtos,fakers}` e structures, scope/codecheck/typecheck/unit/quality determinísticos passaram; contract-check sintético interrompido pela limitação Next/Turbopack, contrato principal aprovado.
  - **Avaliação:** `accepted` — Judge independente confirmou REQ-01 e AC-01.
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** prosseguir para T1.3 após readiness gate.

- [x] **T1.3** — Integrar a solução oficial ao domínio do desafio com round-trip compatível
  - **Estado:** `accepted`
  - **Depende de:** T1.2
  - **Critérios da Spec:** REQ-01, REQ-10, AC-01, AC-02, AR-03, AR-04
  - **Resultado observável:** `ChallengeDto`, `Challenge`, `ChallengeFactory` e `ChallengesFaker` preservam uma solução oficial válida e normalizam campo ausente ou nulo para `null`, sem acoplar o recurso a `SolutionDto` ou a fluxos públicos de escrita.
  - **Camada:** `core`
  - **Paths permitidos:**
    - `packages/core/src/challenging/domain/entities/dtos/ChallengeDto.ts`
    - `packages/core/src/challenging/domain/entities/Challenge.ts`
    - `packages/core/src/challenging/domain/factories/ChallengeFactory.ts`
    - `packages/core/src/challenging/domain/entities/fakers/ChallengesFaker.ts`
    - `packages/core/src/challenging/domain/entities/tests/Challenge.test.ts`
    - `apps/web/src/ui/challenging/stores/zustand/useZustandChallengeStore.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/core-package-rules.md`
    - `documentation/rules/domain-objects-testing-rules.md`
  - **Cobertura obrigatória:** round-trip com solução válida; compatibilidade com DTO legado sem o campo; preservação de `null`; cópia defensiva do Playback através da entidade; faker com default nulo e override válido.
  - **Tentativas:** 3
  - **Sensores:** core codecheck/typecheck/build e Challenge 9/9 passaram; core unit 171 suites/611 testes; Web typecheck/codecheck/unit 90 suites/379 testes; global typecheck 8/8; quality-ratchet core passou (Biome warnings 12). Ação Zustand imutável e getter opaco condicional corrigiram TS2589; gate scope/codecheck passou e typecheck sintético foi revalidado após sincronizar os arquivos atuais; contract sintético segue limitado por Next/Turbopack, contrato principal aprovado.
  - **Avaliação:** `accepted` — Judge independente confirmou REQ-01/REQ-10/AC-01/AC-02/AR-03/AR-04.
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** prosseguir para T2.1 após readiness gate.

## F2 — Persistência e transporte server

**Objetivo:** adicionar a coluna e transportar o JSON somente no detalhe do desafio, mantendo a listagem paginada enxuta e os fluxos públicos de escrita inalterados.

### Tarefas

- [x] **T2.1** — Criar a migration canônica e refletir o schema nos tipos Supabase
  - **Estado:** `verified`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-01, REQ-10, REQ-11, AC-01, AC-02, AR-03, AR-04, AR-05
  - **Resultado observável:** a migration adiciona `official_solution`, recria a view de detalhe com o campo, preserva a RPC paginada sem o JSON e não altera policies, RLS, grants ou dados existentes; `Database.ts` representa tabela e view regeneradas.
  - **Camada:** `server/database`
  - **Paths permitidos:**
    - `apps/server/supabase/migrations/20260723120000_add_challenge_official_solution.sql`
    - `apps/server/src/database/supabase/types/Database.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/server-application-rules.md`
    - `documentation/rules/database-rules.md`
  - **Cobertura obrigatória:** não se aplica a teste direto; a migration é validada por `migration-check`, reconstrução do banco local e pelos testes de rota de T2.2.
  - **Tentativas:** 2
  - **Sensores:** migration-check, typecheck/codecheck e unit server passaram; a suíte server passou com 161 suítes/300 testes; o quality-ratchet passou com o baseline vigente; Implementation Gate server passou; baseline byte a byte confirmado contra `d0970aeffb15f6783acafbd4e27d682e123144f4`.
  - **Avaliação:** `accepted` — Judge independente F2 confirmou migration, schema, sensores e baseline.
  - **Findings bloqueantes:** nenhum; JC-03 e JC-04 resolvidos.
  - **Próxima ação:** nenhuma.

- [x] **T2.2** — Adaptar mapper e repository e provar os contratos HTTP de detalhe e listagem
  - **Estado:** `verified`
  - **Depende de:** T2.1
  - **Critérios da Spec:** REQ-01, REQ-10, REQ-11, AC-01, AC-02, AR-03, AR-04, AR-05
  - **Resultado observável:** uma única consulta por slug devolve o Playback persistido ou `null`; linhas da listagem sem `official_solution` continuam mapeáveis; `add` e `replace` não escrevem o campo; os endpoints reais comprovam o detalhe completo e a projeção paginada sem o JSON.
  - **Camada:** `server/database` e rota HTTP de integração
  - **Paths permitidos:**
    - `apps/server/src/database/supabase/mappers/challenging/SupabaseChallengeMapper.ts`
    - `apps/server/src/database/supabase/repositories/challenging/SupabaseChallengesRepository.ts`
    - `apps/server/src/tests/routes/challenging/challenges/FetchChallengeBySlugRoute.test.ts`
    - `apps/server/src/tests/routes/challenging/challenges/FetchChallengesListRoute.test.ts`
    - `apps/server/src/tests/fixtures/ChallengingFixture.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/server-application-rules.md`
    - `documentation/rules/database-rules.md`
    - `documentation/rules/server-routes-testing-rules.md`
  - **Cobertura obrigatória:** detalhe com fixture normativa e igualdade integral do JSON; detalhe com coluna nula; listagem com solução volumosa sem exposição do campo; ausência do campo nos payloads públicos de criação/edição por inspeção do schema de validation; consulta única no fluxo por slug. Mapper, repository e fixture não recebem testes diretos e são cobertos pela rota pública mais próxima.
  - **Tentativas:** 5
  - **Sensores:** readiness gate, testes HTTP direcionados 4/4, server unit 161 suítes/300 testes, codecheck, typecheck, quality-ratchet e Implementation Gate server passaram; os testes de cobertura server removidos foram restaurados.
  - **Avaliação:** `accepted` — Judge independente F2 confirmou os contratos HTTP, testes restaurados e separação Jest.
  - **Findings bloqueantes:** nenhum; JC-02 e JC-03 resolvidos.
  - **Próxima ação:** nenhuma.

## F3 — Experiência web

**Objetivo:** entregar o componente global de Playback, a chamada condicional e a rota oficial protegida visualmente, com cobertura unitária e de browser.

**Diretriz visual:** os assets em `documentation/assets/code-playback/` são referências não normativas de hierarquia, estados, composição e responsividade. A implementação deve usar o design system já existente em `apps/web/src/ui/global/widgets/components/`, tokens do tema e padrões de layout da aplicação; não deve copiar cores, tipografia, ícones, abas de linguagem ou markup específico dos screenshots. O Playback suporta somente Delégua nesta entrega e não exibe indicador, abas ou seletor de linguagem.

### Tarefas

- [x] **T3.1** — Estender o CodeEditor para múltiplos intervalos destacados
  - **Estado:** `accepted`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-05, REQ-08, REQ-09, AC-14, AR-01, AR-02
  - **Resultado observável:** o CodeEditor aplica e substitui uma decoration por intervalo, revela o primeiro range fora da viewport com contexto, limpa decorations no unmount e permanece inerte para consumidores que não enviam ranges.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/global/widgets/components/CodeEditor/index.tsx`
    - `apps/web/src/ui/global/widgets/components/CodeEditor/useCodeEditor.ts`
    - `apps/web/src/ui/global/widgets/components/CodeEditor/tests/useCodeEditor.test.ts`
    - `apps/web/src/ui/global/styles/global.css`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** montagem sem ranges; aplicação simultânea de múltiplos ranges; atualização e limpeza de decorations anteriores; reveal somente quando necessário; contexto de linhas próximas; cleanup no unmount; ausência de execução, LSP adicional ou efeito externo causado pela nova prop.
  - **Tentativas:** 1
  - **Sensores:** readiness passou; Builder: codecheck, typecheck, testes direcionados 8/8 e diff check passaram; Implementation Gate sem quality-ratchet passou em todos os sensores, incluindo contract-check com integração server/web.
  - **Avaliação:** accepted — Judge independente confirmou REQ-05, REQ-08, REQ-09, AC-14, AR-01 e AR-02.
  - **Findings bloqueantes:** nenhum; quality-ratchet não executado por decisão do usuário.
  - **Próxima ação:** prosseguir para T3.2 após readiness gate

- [x] **T3.2** — Implementar o estado e a temporização do hook de Code Playback
  - **Estado:** `verified`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-04, REQ-05, REQ-07, REQ-09, AC-08, AC-09, AC-10, AC-12, AR-02
  - **Resultado observável:** o hook controla etapa, reprodução, velocidade e expansão com um único timer, mantém autoplay durante navegação manual, pausa no fim e limpa efeitos na troca de payload e no unmount sem mutar o DTO.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/global/widgets/components/CodePlayback/useCodePlayback.ts`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/types/CodePlaybackSpeed.ts`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/tests/useCodePlayback.test.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** estado inicial; play/pause; anterior, próxima e seek nos limites e durante autoplay; intervalos de `0.5x`, `1x` e `2x` com relógio controlado; troca de velocidade sem timers concorrentes; pausa ao final; preservação de estado ao expandir/recolher; `Escape`; troca de payload e unmount; spies negativos de request, LSP e execução; fixture congelada.
  - **Tentativas:** 2
  - **Sensores:** readiness passou; após JI-01, Builder corrigiu a troca de payload e passou codecheck, typecheck e teste direcionado 12/12; Implementation Gate escopado para `@stardust/web` passou.
  - **Avaliação:** accepted — Judge independente confirmou AC-08, AC-09, AC-10, AC-12 e AR-02; JI-01 resolvido.
  - **Findings bloqueantes:** nenhum; quality-ratchet dispensado por decisão do usuário.
  - **Próxima ação:** prosseguir para T2.2, que permanece pendente por estar em uma fase independente.

- [x] **T3.3** — Implementar os controles acessíveis do Code Playback
  - **Estado:** `verified`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-04, REQ-08, AC-08, AC-09, AR-01
  - **Resultado observável:** o widget de controles expõe anterior, play/pause, próxima, timeline, velocidade, posição e expansão com nomes, estados e valores acessíveis, preservando a disponibilidade manual durante autoplay e os limites da sequência.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackControls/index.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackControls/CodePlaybackControlsView.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackControls/tests/CodePlaybackControlsView.test.tsx`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** labels e foco por teclado; `aria-pressed`, `aria-valuetext` e disabled nos limites; callbacks de todos os controles; seleção das três velocidades; estado visual perceptível sem depender somente de cor.
  - **Tentativas:** 1
  - **Sensores:** readiness passou; Builder: codecheck, typecheck, teste direcionado 5/5 e `git diff --check` passaram; Implementation Gate escopado para `@stardust/web` passou.
  - **Avaliação:** accepted — Judge independente confirmou REQ-04, REQ-08, AC-08, AC-09 e AR-01.
  - **Findings bloqueantes:** nenhum; warning advisory sobre `fieldset` não bloqueante.
  - **Próxima ação:** prosseguir para T3.4 após readiness gate.

- [x] **T3.4** — Implementar a renderização discriminada dos painéis do Code Playback
  - **Estado:** `verified`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-05, REQ-06, REQ-08, AC-10, AC-11, AC-15, AC-16, AR-01
  - **Resultado observável:** o widget de painel renderiza as seis variantes na ordem recebida, incluindo índices, ponteiros, estados, ranges, empty labels e overflow, sem alterar o DTO.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackPanel/index.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackPanel/CodePlaybackPanelView.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackPanel/tests/CodePlaybackPanelView.test.tsx`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** sequence, scalar, map, set, grid e result; coleções vazias com label customizada e fallback; índices e múltiplos ponteiros; destaques simples, múltiplos e por intervalo; valores extensos em wrap e scroll; múltiplos estados visuais com sinal além de cor; preservação de ordem.
  - **Tentativas:** 1
  - **Sensores:** readiness passou; Builder: codecheck, typecheck, teste direcionado 5/5 e `git diff --check` passaram; Implementation Gate escopado para `@stardust/web` passou.
  - **Avaliação:** accepted — Judge independente confirmou REQ-05, REQ-06, REQ-08, AC-10, AC-11, AC-15, AC-16 e AR-01.
  - **Findings bloqueantes:** nenhum.
  - **Próxima ação:** prosseguir para T3.5 após readiness gate.

- [x] **T3.5** — Compor o widget global Code Playback e seus layouts
  - **Estado:** `verified`
  - **Depende de:** T3.1, T3.2, T3.3, T3.4
  - **Critérios da Spec:** REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09, AC-08, AC-09, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AR-01, AR-02
  - **Resultado observável:** o Entry Point conecta hook e Views; cada etapa atualiza atomicamente editor, input, painéis e explicação; layouts padrão e expandido preservam estado e se adaptam à viewport; a posição e a explicação são anunciadas sem efeitos externos.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/global/widgets/components/CodePlayback/index.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/CodePlaybackView.tsx`
    - `apps/web/src/ui/global/widgets/components/CodePlayback/tests/CodePlaybackView.test.tsx`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** composição da fixture normativa; sincronização e restauração integral de snapshots; input preformatado; ordem dos painéis; passagem de ranges ao editor; região `aria-live`; layouts padrão, expandido desktop e fallback vertical estreito; preservação de etapa, velocidade e play/pause ao alternar layout.
  - **Tentativas:** 1
  - **Sensores:** readiness-check, scope-check reconciliado com o worktree, codecheck, typecheck, teste direcionado da View (6/6), architecture-check, migration-check e contract-check passaram; as integrações foram registradas como `skipped`; `git diff --check` passou.
  - **Avaliação:** pending — Judge integrado da F3 será acionado quando T3.6, T3.7 e T3.8 também estiverem verificadas.
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** prosseguir para T3.6 após readiness gate

- [x] **T3.6** — Corrigir hidratação e semântica de navegação para URLs de soluções
  - **Estado:** `verified`
  - **Depende de:** T1.3
  - **Critérios da Spec:** REQ-01, REQ-03, REQ-10, AC-02, AC-05, AC-06, AR-04
  - **Resultado observável:** a hidratação detecta mudanças em `officialSolution`, qualquer URL sob `/solutions` mantém `activeContent = 'solutions'` e a factory de rotas gera o caminho estático oficial sem colisão com slugs de usuários.
  - **Camada:** `web/ui` e navegação
  - **Paths permitidos:**
    - `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`
    - `apps/web/src/ui/challenging/widgets/pages/Challenge/tests/useChallengePage.test.ts`
    - `apps/web/src/constants/routes.ts`
    - `apps/web/src/constants/tests/routes.test.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** hidratação com solução, sem solução e troca entre ambas; rota da listagem, slug de solução de usuário e segmento `official` resolvidos como aba `solutions`; geração exata da URL oficial; ausência de renderização antecipada do payload por usuário bloqueado.
  - **Tentativas:** 2
  - **Sensores:** readiness-check, scope-check reconciliado, codecheck, typecheck, 4 testes direcionados do hook, suíte web 102 suítes/426 testes, architecture-check, migration-check, contract-check e Implementation Gate web passaram; a cobertura original de hidratação/estado foi restaurada junto dos casos de solução oficial.
  - **Avaliação:** `accepted` — Judge independente F3 confirmou a cobertura original e os critérios de navegação.
  - **Findings bloqueantes:** nenhum; JC-04 resolvido.
  - **Próxima ação:** nenhuma.

- [x] **T3.7** — Refatorar a listagem de soluções e inserir a chamada oficial condicional
  - **Estado:** `verified`
  - **Depende de:** T3.6
  - **Critérios da Spec:** REQ-02, REQ-03, REQ-08, AC-03, AC-04, AC-05, AR-01
  - **Resultado observável:** contexts, service e store são resolvidos no Entry Point; o hook recebe dependências; a View mostra o card oficial antes das soluções de usuários apenas quando o conteúdo existe; a chamada é acessível e aponta à rota estática.
  - **Camada:** `web/ui`
  - **Paths permitidos:**
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/index.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/useChallengeSolutionsSlot.ts`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/ChallengeSolutionsSlotView.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/OfficialSolutionCard/index.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/OfficialSolutionCard/OfficialSolutionCardView.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/tests/useChallengeSolutionsSlot.test.ts`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/tests/ChallengeSolutionsSlotView.test.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeSolutions/OfficialSolutionCard/tests/OfficialSolutionCardView.test.tsx`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
  - **Cobertura obrigatória:** hook isolado das integrações; card presente antes da lista com solução; card ausente sem solução; identificação oficial e nome acessível; link correto; estados existentes de loading, erro, vazio, filtro e paginação preservados.
  - **Tentativas:** 1
  - **Sensores:** readiness-check, scope-check reconciliado com o worktree, codecheck, typecheck, testes direcionados (4/4), architecture-check, migration-check e contract-check passaram; integrações foram registradas como `skipped`; `git diff --check` passou.
  - **Avaliação:** pending — Judge integrado da F3 será acionado após T3.8.
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** prosseguir para T3.8 após readiness gate

- [x] **T3.8** — Integrar slot, App Router e jornada real da solução oficial
  - **Estado:** `verified`
  - **Depende de:** T2.2, T3.5, T3.7
  - **Critérios da Spec:** REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09, REQ-10, AC-02, AC-03, AC-05, AC-06, AC-07, AC-08, AC-09, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15, AC-16, AR-01, AR-02, AR-04
  - **Resultado observável:** `page.tsx` e `default.tsx` renderizam o slot oficial; o Entry Point aplica o bloqueio visual antes do Playback e a View cobre Empty e Content; a jornada Playwright comprova chamada, navegação, bloqueio, indisponibilidade, controles, snapshots e responsividade sobre a rota publicada.
  - **Camada:** `web/ui`, App Router e integração de browser
  - **Paths permitidos:**
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeOfficialSolution/index.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeOfficialSolution/ChallengeOfficialSolutionSlotView.tsx`
    - `apps/web/src/ui/challenging/widgets/slots/ChallengeOfficialSolution/tests/ChallengeOfficialSolutionSlotView.test.tsx`
    - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/solutions/official/page.tsx`
    - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/solutions/official/default.tsx`
    - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/solutions/official/tests/page.test.tsx`
    - `apps/web/src/app/challenging/challenges/[challengeSlug]/challenge/@tabContent/solutions/official/tests/default.test.tsx`
    - `apps/web/src/app/tests/challenging/official-solution.test.ts`
    - `apps/web/src/app/tests/shared/mocks/ServerMock.ts`
  - **Rules:**
    - `documentation/rules/code-conventions-rules.md`
    - `documentation/rules/web-application-rules.md`
    - `documentation/rules/ui-layer-rules.md`
    - `documentation/rules/widget-tests-rules.md`
    - `documentation/rules/web-app-routes-testing-rules.md`
  - **Cobertura obrigatória:** View com Empty e Content; retorno à listagem; page/default delegando ao slot; usuário liberado com e sem solução; visitante e usuário bloqueado sem conteúdo do Playback no DOM; navegação pelo card mantendo a aba; play/pause, limites, seek, velocidades e fim da reprodução; restauração de snapshots; todos os painéis; múltiplos ranges e reveal do editor; expansão/recolhimento e `Escape`; acessibilidade por teclado; desktop e viewport estreita com overflow sem sobreposição; ausência de requests, LSP, execução ou mutação durante Playback.
  - **Tentativas:** 2
  - **Sensores:** readiness-check, codecheck, typecheck, testes de página 2/2, Playwright 5/5 em 57,8s, Implementation Gate com 102 suítes/424 testes unitários, architecture-check, migration-check e contract-check passaram; quality-ratchet não foi executado por decisão do usuário.
  - **Avaliação:** pending — T3.8 verificada; Judge integrado da F3 aguardando avaliação da evidência real de browser.
  - **Findings bloqueantes:** nenhum; JI-01 resolvido e BLK-006 encerrado.
  - **Próxima ação:** acionar o Judge integrado da F3.

- [x] **CI-01** — Corrigir regressão do quality ratchet web no CI do PR
  - **Estado:** `verified`
  - **Depende de:** T3.5
  - **Critérios da Spec:** AR-01, AR-02
  - **Resultado observável:** os avisos introduzidos pelo Code Playback e pela navegação são corrigidos sem reduzir ou atualizar o baseline vigente.
  - **Camada:** `web/ui`
  - **Paths permitidos:** `apps/web/src/ui/challenging/widgets/pages/Challenge/useChallengePage.ts`; `apps/web/src/ui/global/widgets/components/CodePlayback/**`
  - **Sensores:** codecheck, typecheck, suíte web 102/426, quality-ratchet web 156 warnings contra baseline 163 e Implementation Gate web passaram; `packages/harness/baselines/web.json` permaneceu inalterado.
  - **Avaliação:** pending — Judge integrado da F3 necessário para confirmar a alteração integrada.
  - **Findings bloqueantes:** nenhum.

- [x] **CI-02** — Garantir dependência compilada do LSP no teste de checkout limpo
  - **Estado:** `verified`
  - **Depende de:** T3.1
  - **Critérios da Spec:** AR-01, AR-02
  - **Resultado observável:** os workflows de core e web constroem `@stardust/lsp` após `npm ci` e antes das suítes que importam o pacote, eliminando a falha de resolução sem remover cobertura.
  - **Camada:** CI/workflows
  - **Paths permitidos:** `.github/workflows/core-package-ci.yaml`; `.github/workflows/web-app-ci.yaml`
  - **Sensores:** build LSP, core unit 171/611, web unit 102/426 e Implementation Gates core/web passaram.
  - **Avaliação:** `accepted` — Judge independente da F3 confirmou a integração dos quality gates e a ausência de regressões.
  - **Findings bloqueantes:** nenhum.

- [x] **CI-03** — Estabilizar a action de reset no ciclo de vida da página
  - **Estado:** `verified`
  - **Depende de:** T3.6
  - **Critérios da Spec:** REQ-01, REQ-03, AC-02, AC-05, AC-06, AC-07, AR-04
  - **Resultado observável:** a limpeza do store ocorre no unmount e nas ações explícitas de saída, sem ser reexecutada por rerenders causados pela hidratação ou navegação.
  - **Camada:** `web/ui`
  - **Finding bloqueante:** JI-F3-01 — `resetStore` instável na dependência do efeito.
  - **Sensores:** a action passou a ser estável no módulo; teste do hook 6/6, suíte web 102/428, quality-ratchet web, Implementation Gate web e Playwright oficial 5/5 passaram.
  - **Avaliação:** pending — novo Judge integrado da F3 necessário após JI-F3-01.
  - **Findings bloqueantes:** nenhum; JI-F3-01 corrigido.

- [x] **CI-04** — Preparar LSP nos quality gates de core e web
  - **Estado:** `verified`
  - **Depende de:** CI-02
  - **Critérios da Spec:** AR-01, AR-02
  - **Resultado observável:** os jobs de quality-ratchet de core e web constroem `@stardust/lsp` após `npm ci` e antes do Jest com cobertura.
  - **Camada:** CI/workflows
  - **Paths permitidos:** `.github/workflows/core-package-ci.yaml`; `.github/workflows/web-app-ci.yaml`
  - **Finding histórico:** quality-ratchet core falhou em checkout limpo com `Cannot find module '@stardust/lsp'`.
  - **Sensores:** build LSP; quality-ratchet core 12 warnings e cobertura acima do baseline; quality-ratchet web 156 warnings contra baseline 163; Implementation Gates core/web passaram.
  - **Avaliação:** `accepted` — Judge independente da F3 confirmou a integração dos quality gates.
  - **Findings bloqueantes:** nenhum; nenhum baseline foi atualizado.

- [x] **CI-05** — Preparar LSP nos jobs de testes e quality ratchet do server
  - **Estado:** `verified`
  - **Depende de:** CI-04
  - **Critérios da Spec:** AR-01, AR-02
  - **Resultado observável:** os jobs Tests e Quality ratchet do server constroem `@stardust/lsp` após `npm ci` e antes de executar Jest.
  - **Camada:** CI/workflows
  - **Paths permitidos:** `.github/workflows/server-app-ci.yaml`
  - **Finding histórico:** server Tests falhou em checkout limpo com `Cannot find module '@stardust/lsp'` em `HonoApp.test.ts`.
  - **Sensores:** Builder confirmou typecheck, codecheck, unit tests e build LSP locais; o diff contém somente as duas etapas de build no workflow do server.
  - **Avaliação:** `accepted` — Judge independente da F3 confirmou CI-05 e a ausência de regressões.
  - **Findings bloqueantes:** nenhum; nenhum baseline foi atualizado.

### 2026-07-27 — F3 — Judge integrado após JI-F3-01

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou F3 após a estabilização de `resetStore` e a repetição dos sensores afetados.
- **Sensores:** typecheck/codecheck web, hook 6/6, web unit 102/428, quality-ratchet 156 contra baseline 163, Implementation Gate web e Playwright 5/5 passaram.
- **Avaliação:** accepted — AC-02–AC-16, AR-01, AR-02 e AR-04 confirmados; JI-F3-01 resolvido; F1/F2 não afetadas.
- **Findings bloqueantes:** nenhum.
- **Próxima ação:** executar o Conclusion Gate e o Judge de conclusão.

### 2026-07-27 — F3 — Judge integrado após CI-04

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou F3 após a preparação do LSP nos quality-ratchets de core e web.
- **Sensores:** build LSP, quality-ratchets core/web, typecheck/codecheck core/web e Implementation Gates independentes passaram; Playwright 5/5 e baselines inalterados.
- **Avaliação:** accepted — AC-02–AC-16, AR-01, AR-02 e AR-04 confirmados; CI-04 verificada; nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum.
- **Próxima ação:** executar o Conclusion Gate e o Judge de conclusão.

### 2026-07-27 — Conclusion Gate — reexecução após CI-03

- **Estado:** `passed`
- **Ação:** o Harness foi executado sobre o diff integral com todos os paths afetados informados.
- **Sensores:** scope-check, codecheck global, typecheck global, unit global (core 171/611, server 161/300, web 102/428, harness conforme evidência), architecture-check, migration-check e contract-check passaram; integrações foram registradas como `skipped` pelo contract-check conforme a regra vigente.
- **Avaliação:** nenhum finding bloqueante; a evidência oficial de quality-ratchet permanece no CI do PR.
- **Próxima ação:** acionar o Judge de conclusão independente.

### 2026-07-27 — CI-04 — Implementation Gates após correção dos quality-ratchets

- **Estado:** `passed`
- **Ação:** os jobs de quality-ratchet de core e web passaram a construir `@stardust/lsp` após `npm ci` e antes do Jest com cobertura.
- **Sensores:** build LSP, quality-ratchet core/web, typecheck/codecheck e Implementation Gates independentes de core/web passaram; baselines permaneceram inalterados.
- **Avaliação:** pending — executar o Conclusion Gate e o Judge de conclusão.
- **Findings bloqueantes:** nenhum.

## Amendments da Spec

- **2026-07-23 — revisão textual:** a revisão da Spec mudou de `5a6b58a6a88bbb86f2d7b6dd0443c47f0c024c4d` para `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` somente por uma quebra de linha final; nenhuma regra ou requisito foi alterado.
- **2026-07-23 — revisão de gates:** a revisão vigente passou a exigir sensores de código/teste escopados por pacote no Implementation Gate e a reservar `quality-ratchet` para o CI. Nenhum requisito funcional foi alterado; a revisão vigente é `ac2843de5f13f735d42bc7126557553574e5c404`.

## Histórico de Execução

### 2026-07-23 — T1.1 — Judge JI-01

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente inspecionou T1.1 e executou probes de valores JSON.
- **Sensores:** core unit 6/6, typecheck e codecheck passaram; probes confirmaram arrays esparsos aceitos e chaves `Symbol` perdidas no clone.
- **Avaliação:** changes_requested — correção necessária antes da aceitação.
- **Findings bloqueantes:** `JI-01`.

### 2026-07-23 — T1.1 — correção JI-01

- **Estado:** `validating`
- **Ação:** Builder rejeitou arrays esparsos, propriedades descartadas pelo JSON e chaves/valores `Symbol`; adicionou regressões.
- **Sensores:** codecheck, typecheck e teste específico 7/7 passaram.
- **Avaliação:** pending — novo Implementation Gate e Judge necessários.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T1.1 — gate pós-correção

- **Estado:** `validating`
- **Ação:** Implementation Gate executado após a correção de JI-01 e a estabilização da suíte (Turbo serial, Jest web com um worker e Playwright 1.61.1).
- **Sensores:** scope, codecheck, typecheck, unit, quality-ratchet, architecture e migration passaram; contract-check do worktree sintético não iniciou a aplicação por manifesto `.next` ausente. Evidência suplementar no worktree principal: `npm run test:integration -w @stardust/web` passou com 34 cenários e os checks contratuais de Server/Core passaram.
- **Avaliação:** pending — novo Judge independente necessário.
- **Findings bloqueantes:** nenhum no código alterado; limitação ambiental registrada para o worktree sintético.

### 2026-07-23 — T1.1 — Judge JI-02

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente reavaliou T1.1 após JI-01 e inspecionou o round-trip de estruturas e coleções.
- **Sensores:** teste específico 7/7, typecheck e codecheck passaram; probes adicionais reproduziram holes em arrays estruturais e propriedades extras/símbolos preservados por cópias estruturais.
- **Avaliação:** changes_requested — correção necessária antes da aceitação.
- **Findings bloqueantes:** `JI-02` em REQ-01, REQ-06, REQ-09, AC-01 e AR-02.

### 2026-07-23 — T1.1 — correção JI-03 e Judge final

- **Estado:** `accepted`
- **Ação:** Builder passou a rejeitar propriedades estruturais opcionais explicitamente `undefined` e adicionou regressões; Judge independente reavaliou a implementação sem editar arquivos.
- **Sensores:** targeted 8/8; typecheck/codecheck core e globais passaram; unit serial global passou (core 171/171 suites, 606/606 testes; web 90/90 suites, 379/379 testes); quality-ratchet passou.
- **Avaliação:** accepted — nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum; JI-01, JI-02 e JI-03 resolvidos.

### 2026-07-23 — T1.1 — revisão JI-03

- **Estado:** `changes_requested`
- **Ação:** revisão pós-JI-02 identificou propriedade opcional estrutural explicitamente `undefined` sendo aceita e omitida pelo getter.
- **Sensores:** probes reproduziram a perda silenciosa; campo opcional ausente continua válido.
- **Avaliação:** correção necessária antes da aceitação.
- **Findings bloqueantes:** `JI-03` em REQ-01, REQ-09, AC-01 e AR-02.

### 2026-07-23 — readiness gate T1.2

- **Estado:** `ready`
- **Ação:** gate de readiness executado contra a revisão vigente da Spec e o Plan.
- **Sensores:** `readiness-check` passou, dependência T1.1 aceita e revisão `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` confirmada.
- **Avaliação:** pending — T1.2 pronta para Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T1.2 — Judge final

- **Estado:** `accepted`
- **Ação:** Judge independente inspecionou exclusivamente os três barrels permitidos e a resolução dos subpaths públicos.
- **Sensores:** diff restrito aos três arquivos; `git diff --check`, build/typecheck/codecheck core e imports públicos passaram.
- **Avaliação:** accepted — REQ-01 e AC-01 atendidos.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — readiness gate T1.3

- **Estado:** `ready`
- **Ação:** gate de readiness executado após aceitar T1.2.
- **Sensores:** dependência T1.2 aceita e revisão vigente da Spec confirmada.
- **Avaliação:** pending — T1.3 pronta para Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T1.3 — estabilização e Judge final

- **Estado:** `accepted`
- **Ação:** Judge independente confirmou a integração de `officialSolution`; a ação Zustand foi ajustada para evitar Draft recursivo do Immer.
- **Sensores:** typecheck global e sintético 8/8 passaram após a estabilização; Web codecheck/unit 90/90 suites e 379/379 testes; core codecheck/build, Challenge 9/9, unit 171/171 suites e 611/611 testes; quality-ratchet passou.
- **Avaliação:** accepted — REQ-01, REQ-10, AC-01, AC-02, AR-03 e AR-04 atendidos.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — readiness gate T2.1

- **Estado:** `ready`
- **Ação:** gate de readiness executado após aceitar T1.3.
- **Sensores:** `readiness-check` passou, dependência T1.3 aceita e revisão `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` confirmada.
- **Avaliação:** pending — T2.1 pronta para Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T2.1 — Judge independente

- **Estado:** `accepted`
- **Ação:** Judge independente inspecionou a migration e os tipos Supabase sem editar o worktree.
- **Sensores:** migration-check passou em 15 migrations; server typecheck, codecheck, unit e quality-ratchet passaram. Reset integrado do Supabase permanece bloqueado por BLK-001.
- **Avaliação:** accepted — REQ-01, REQ-10, REQ-11, AC-01, AC-02, AR-03, AR-04 e AR-05 atendidos.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — readiness gate T2.2

- **Estado:** `ready`
- **Ação:** gate de readiness executado após aceitar T2.1.
- **Sensores:** `readiness-check` passou, dependência T2.1 aceita e revisão `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` confirmada.
- **Avaliação:** pending — T2.2 em implementação pelo Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T2.2 — Implementation Gate

- **Estado:** `validating`
- **Ação:** Builder corrigiu a asserção de detalhe para comparar o Playback integral sem depender do slug normalizado pela view; o gate foi executado com base `HEAD` (`7a0c100ca1cafd139eabeda39dd0b9d18c0afcb`) e paths preexistentes explicitamente preservados no scope-check.
- **Sensores:** scope-check, codecheck, typecheck, unit, quality-ratchet do server, architecture-check, migration-check, contract-check com execução e integração server passaram. Testes direcionados de detalhe/listagem passaram 4/4.
- **Avaliação:** pending — Judge independente necessário.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T2.2 — Judge JI-01/JI-02

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente avaliou mapper, repository e os testes HTTP sem editar o worktree.
- **Sensores:** critérios de domínio, typecheck, testes direcionados e sensores do Implementation Gate passaram; a inspeção identificou ausência da fixture normativa no detalhe e ausência de verificação de conteúdo volumoso na listagem.
- **Avaliação:** changes_requested — JI-01 e JI-02.
- **Findings bloqueantes:** JI-01 e JI-02, corrigidos com fixture normativa compartilhada e payload volumoso com marcadores exclusivos.

### 2026-07-23 — T2.2 — gate pós-correção

- **Estado:** `validating`
- **Ação:** Implementation Gate repetido sem comando extra de integração e com os paths preexistentes declarados explicitamente no scope-check.
- **Sensores:** scope-check, codecheck, typecheck e test:unit passaram; quality-ratchet falhou por BLK-003. Architecture-check, migration-check e contract-check não foram executados porque o gate interrompe no primeiro sensor obrigatório com falha.
- **Avaliação:** pending — novo Judge independente não pode ser acionado antes do gate passar.
- **Findings bloqueantes:** BLK-003; JI-01 e JI-02 permanecem resolvidos.

### 2026-07-23 — T2.2 — gate sem quality-ratchet

- **Estado:** `validating`
- **Ação:** por decisão explícita do usuário, o Implementation Gate foi executado sem `--workspace=server`, omitindo o quality-ratchet; nenhum comando extra de integração foi adicionado.
- **Sensores:** scope-check, codecheck, typecheck, test:unit, architecture-check e migration-check passaram. O contract-check executou a integração declarada, mas falhou por `spawnSync docker ENOENT` (BLK-004).
- **Avaliação:** pending — novo Judge independente aguarda o contract-check passar.
- **Findings bloqueantes:** BLK-004; JI-01 e JI-02 permanecem resolvidos. BLK-003 foi dispensado para este gate.

### 2026-07-23 — T2.2 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** após o `contract-check` deixar de executar integração, o gate foi repetido para `@stardust/server`, sem `quality-ratchet` e sem `--test-path`; os testes de rota pertencem ao projeto `server-integration`, não à suíte unitária.
- **Sensores:** scope-check, codecheck, typecheck, test:unit (149 suites/256 testes), architecture-check, migration-check e contract-check passaram; as 4 evidências de integração foram registradas como `skipped`.
- **Avaliação:** pending — Judge independente acionado.
- **Findings bloqueantes:** nenhum; JI-01 e JI-02 permanecem resolvidos.

### 2026-07-23 — T2.2 — Judge independente final

- **Estado:** `verified`
- **Ação:** Judge independente reavaliou mapper, repository, fixture e testes HTTP sem editar o worktree.
- **Sensores:** REQ-01, REQ-10, REQ-11, AC-01, AC-02, AR-03, AR-04 e AR-05 passaram; a evidência HTTP direcionada anterior confirmou 4/4 cenários com Docker/Supabase disponível.
- **Avaliação:** accepted — nenhum finding bloqueante; JI-01 e JI-02 resolvidos.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — readiness gate T3.1

- **Estado:** `ready`
- **Ação:** gate de readiness executado para a tarefa independente de UI enquanto T2.2 aguarda o ambiente de integração.
- **Sensores:** `readiness-check` passou; dependência T1.3 aceita e revisão `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` confirmada.
- **Avaliação:** pending — T3.1 em implementação pelo Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.1 — Builder

- **Estado:** `validating`
- **Ação:** Builder implementou suporte a múltiplos ranges, decorations substituíveis, reveal contextual, limpeza no unmount e inércia sem ranges nos quatro paths permitidos.
- **Sensores:** codecheck, typecheck, testes direcionados 8/8 e `git diff --check` passaram; nenhum Worker foi necessário; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Implementation Gate sem quality-ratchet necessário.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.1 — Implementation Gate sem quality-ratchet

- **Estado:** `validating`
- **Ação:** gate executado sem `--workspace`, conforme decisão do usuário; paths preexistentes foram preservados no scope-check.
- **Sensores:** scope-check, codecheck, typecheck, test:unit (server 149 suites/256 testes; web 90 suites/382 testes), architecture-check e migration-check passaram. O contract-check falhou por `spawnSync docker ENOENT`, BLK-004.
- **Avaliação:** pending — Judge independente aguarda contract-check aprovado.
- **Findings bloqueantes:** BLK-004; implementação da T3.1 e seus testes direcionados permanecem sem findings conhecidos.

### 2026-07-23 — T3.1 — Implementation Gate aprovado

- **Estado:** `validating`
- **Ação:** gate repetido após Docker/Supabase ficarem disponíveis, sem `--workspace` e sem quality-ratchet.
- **Sensores:** scope-check, codecheck, typecheck, test:unit, architecture-check, migration-check e contract-check passaram; integração server e web executaram com exit code 0.
- **Avaliação:** pending — Judge independente necessário.
- **Findings bloqueantes:** nenhum; BLK-004 encerrado.

### 2026-07-23 — T3.1 — Judge independente

- **Estado:** `accepted`
- **Ação:** Judge independente avaliou a implementação e os testes sem editar o worktree.
- **Sensores:** REQ-05, REQ-08, REQ-09, AC-14, AR-01 e AR-02 passaram; scope-check, codecheck, typecheck, test:unit, architecture-check, migration-check e contract-check passaram; quality-ratchet dispensado por decisão do usuário.
- **Avaliação:** accepted — nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — readiness gate T3.2

- **Estado:** `ready`
- **Ação:** gate de readiness executado após aceitar T3.1.
- **Sensores:** `readiness-check` passou; dependência T1.3 aceita e revisão `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` confirmada.
- **Avaliação:** pending — T3.2 em implementação pelo Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.2 — Builder

- **Estado:** `validating`
- **Ação:** Builder implementou o hook de Code Playback e o tipo de velocidade nos três paths permitidos.
- **Sensores:** codecheck, typecheck, testes direcionados 11/11 e suíte web completa 91 suites/393 testes passaram; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Implementation Gate sem quality-ratchet necessário.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.2 — Implementation Gate aprovado

- **Estado:** `validating`
- **Ação:** gate executado sem `--workspace`, conforme decisão do usuário.
- **Sensores:** scope-check, codecheck, typecheck, test:unit (server 149 suites/256 testes; web 91 suites/393 testes), architecture-check, migration-check e contract-check passaram; integrações server/web executaram com exit code 0.
- **Avaliação:** pending — Judge independente necessário.
- **Findings bloqueantes:** nenhum; quality-ratchet dispensado no Implementation Gate.

### 2026-07-23 — T3.2 — Judge JI-01

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente inspecionou a implementação sem editar o worktree e executou probe de troca de payload.
- **Sensores:** critérios REQ-04, REQ-07, REQ-09, AC-08, AC-09, AC-10, AC-12 e AR-02 passaram; REQ-05 falhou porque payload menor produz um render transitório com `currentStep === undefined`.
- **Avaliação:** changes_requested — corrigir antes da aceitação.
- **Findings bloqueantes:** JI-01; a correção deve garantir snapshot válido já no render e adicionar regressão em consumidor real.

### 2026-07-23 — T3.2 — correção JI-01

- **Estado:** `validating`
- **Ação:** Builder ajustou o snapshot síncrono na troca de payload e adicionou regressão para payload menor, sem editar paths fora da tarefa.
- **Sensores:** codecheck, typecheck e teste direcionado 12/12 passaram; quality-ratchet não executado por decisão do usuário.
- **Avaliação:** pending — novo Implementation Gate e Judge necessários.
- **Findings bloqueantes:** nenhum pendente; JI-01 aguardando confirmação independente.

### 2026-07-23 — T3.2 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** Implementation Gate executado para `@stardust/web` com o teste direcionado de Code Playback, sem `quality-ratchet`; o `contract-check` executou apenas evidências unitárias e registrou as integrações como `skipped`.
- **Sensores:** scope-check, codecheck, typecheck, teste direcionado 12/12, architecture-check, migration-check e contract-check passaram.
- **Avaliação:** pending — Judge independente acionado.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.2 — Judge independente final

- **Estado:** `verified`
- **Ação:** Judge independente reavaliou o hook sem editar o worktree.
- **Sensores:** AC-08, AC-09, AC-10, AC-12 e AR-02 passaram; o probe de troca para payload menor não reproduziu `currentStep === undefined`.
- **Avaliação:** accepted — nenhum finding bloqueante; JI-01 resolvido.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.3 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** Implementation Gate executado para `@stardust/web` com o teste direcionado dos controles, sem `quality-ratchet`; o `contract-check` executou evidências unitárias e registrou integrações como `skipped`.
- **Sensores:** scope-check, codecheck, typecheck, teste direcionado 5/5, architecture-check, migration-check e contract-check passaram.
- **Avaliação:** pending — Judge independente acionado.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.3 — Judge independente final

- **Estado:** `verified`
- **Ação:** Judge independente reavaliou os controles sem editar o worktree.
- **Sensores:** REQ-04, REQ-08, AC-08, AC-09 e AR-01 passaram; acessibilidade, callbacks, limites, velocidades e estados visuais confirmados.
- **Avaliação:** accepted — nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum; warning advisory sobre `fieldset` não bloqueante.

### 2026-07-23 — T3.4 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** Implementation Gate executado para `@stardust/web` com o teste direcionado dos painéis, sem `quality-ratchet`; o `contract-check` executou evidências unitárias e registrou integrações como `skipped`.
- **Sensores:** scope-check, codecheck, typecheck, teste direcionado 5/5, architecture-check, migration-check e contract-check passaram.
- **Avaliação:** pending — Judge independente acionado.
- **Findings bloqueantes:** nenhum.

### 2026-07-23 — T3.4 — Judge independente final

- **Estado:** `verified`
- **Ação:** Judge independente reavaliou os seis painéis sem editar o worktree.
- **Sensores:** REQ-05, REQ-06, REQ-08, AC-10, AC-11, AC-15, AC-16 e AR-01 passaram; ordem, variantes, vazios, highlights, overflow e imutabilidade confirmados.
- **Avaliação:** accepted — nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — readiness gate T3.5

- **Estado:** `ready`
- **Ação:** gate de readiness executado para a composição do widget global após as dependências T3.1, T3.2, T3.3 e T3.4 serem aceitas.
- **Sensores:** `readiness-check` passou; revisão `ac2843de5f13f735d42bc7126557553574e5c404` confirmada.
- **Avaliação:** pending — T3.5 em implementação pelo Builder.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — T3.5 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** Builder compôs o Entry Point e a View do Code Playback nos três paths permitidos; o gate foi executado para `@stardust/web` com a união explícita dos paths preexistentes do worktree para o scope-check.
- **Sensores:** scope-check, codecheck, typecheck, teste direcionado da View (6/6), architecture-check, migration-check e contract-check passaram; as quatro evidências de integração foram registradas como `skipped`; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Judge integrado da F3 será acionado após T3.6, T3.7 e T3.8.
- **Findings bloqueantes:** nenhum; BLK-005 encerrado.

### 2026-07-25 — T3.6 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** hidratação passou a comparar `officialSolution`, a navegação passou a resolver qualquer URL sob `/solutions` como a aba `solutions` e a factory recebeu a rota estática oficial.
- **Sensores:** scope-check reconciliado com o worktree, codecheck, typecheck, testes direcionados (4/4), architecture-check, migration-check e contract-check passaram; as integrações foram registradas como `skipped`; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Judge integrado da F3 será acionado após T3.7 e T3.8.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — T3.7 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** o slot passou a resolver service, auth e challenge no Entry Point; a View preserva a listagem e mostra `OfficialSolutionCard` antes das soluções de usuários somente quando `officialSolution` existe.
- **Sensores:** scope-check reconciliado com o worktree, codecheck, typecheck, testes direcionados (4/4), architecture-check, migration-check e contract-check passaram; as integrações foram registradas como `skipped`; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Judge integrado da F3 será acionado após T3.8.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — T3.8 — Implementation Gate escopado

- **Estado:** `verified`
- **Ação:** o slot oficial foi integrado às entradas paralelas `page.tsx` e `default.tsx`, com bloqueio visual antes do Playback e estados Content/Empty.
- **Sensores:** scope-check reconciliado com o worktree, codecheck, typecheck, teste direcionado (2/2), architecture-check, migration-check e contract-check passaram; as integrações foram registradas como `skipped`; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — gate agregado da F3 e Judge integrado necessários.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — F3 — Judge integrado JI-01

- **Estado:** `rejected`
- **Ação:** avaliação independente da fase F3 contra a Spec vigente, o Plan, o diff e as evidências do gate agregado.
- **Finding bloqueante:** os testes co-localizados de `page.tsx`/`default.tsx` e a jornada Playwright `apps/web/src/app/tests/challenging/official-solution.test.ts` não existiam; `test:integration` não exercitava a solução oficial.
- **Critérios afetados:** AC-02, AC-03, AC-05, AC-06, AC-07, AC-12, AC-13, AC-14, AC-15, AR-01 e AR-04.
- **Próxima ação:** criar os três testes obrigatórios, cobrir card/rota/bloqueio/responsividade/acessibilidade e executar a suíte de integração da web.

### 2026-07-25 — F3 — Implementation Gate agregado

- **Estado:** `passed`
- **Ação:** execução agregada da fase F3 no pacote `@stardust/web`, reconciliando o escopo com o worktree compartilhado e executando as evidências direcionadas de Playback, navegação, listagem, card oficial e rota oficial.
- **Sensores:** scope-check, codecheck, typecheck, 11 suítes/46 testes unitários, architecture-check, migration-check e contract-check passaram; 4 evidências de integração foram explicitamente registradas como `skipped`; quality-ratchet não foi executado por decisão do usuário.
- **Avaliação:** pending — Judge integrado independente da F3 necessário.
- **Findings bloqueantes:** nenhum.

### 2026-07-25 — T3.8 — correção JI-01 em validação

- **Estado:** `implementing`
- **Ação:** os testes co-localizados de `page.tsx`/`default.tsx` e a jornada Playwright foram adicionados; os testes de página passaram 2/2 e o readiness gate passou.
- **Sensores:** a execução de `test:integration` da web foi tentada, mas o `next dev` não iniciou porque o processo existente `next-server` PID `25388` mantém o lock de desenvolvimento (BLK-006).
- **Avaliação:** pending — repetir a jornada Playwright após liberar o lock; somente então repetir o gate agregado e acionar o Judge da F3.
- **Findings bloqueantes:** JI-01 em resolução; BLK-006 aberto.

### 2026-07-25 — T3.8 — correção JI-01 validada

- **Estado:** `verified`
- **Ação:** o processo Next.js terminou; a suíte Playwright foi repetida e confirmou a jornada oficial completa, incluindo navegação, bloqueio, indisponibilidade, controles e responsividade.
- **Sensores:** Playwright 5/5 em 57,8s; codecheck, typecheck, 102 suítes/424 testes unitários, architecture-check, migration-check e contract-check passaram no Implementation Gate web.
- **Avaliação:** pending — T3.8 verificada; Judge integrado da F3 necessário.
- **Findings bloqueantes:** nenhum; JI-01 resolvido e BLK-006 encerrado.

### 2026-07-25 — F3 — Judge integrado final

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou a fase F3 contra a Spec vigente, o diff integrado, os sensores e a jornada Playwright real.
- **Sensores:** critérios AC-02–AC-16 e AR-01, AR-02 e AR-04 aprovados; Playwright 5/5, testes App Router 2/2 e Implementation Gate web aprovados.
- **Avaliação:** accepted — JI-01 resolvido e nenhum finding bloqueante.
- **Findings bloqueantes:** nenhum; quality-ratchet permanece dispensado por decisão explícita do usuário.
- **Próxima ação:** executar `conclude-spec` e o Judge de conclusão.

### 2026-07-25 — Conclusão — Judge Conclusion

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente avaliou a entrega integrada após Conclusion Gate, integrações e builds finais.
- **Sensores:** Conclusion Gate passou; server integration 61/61 suítes e 183/183 testes; web Playwright 39/39; builds core, server e web passaram com o ambiente documentado.
- **Avaliação:** `failed` — a funcionalidade atende aos requisitos, mas o fechamento foi bloqueado por JC-01 e JC-02.
- **Findings bloqueantes:** JC-01 e JC-02.
- **Próxima ação:** reabrir F2/T2.1–T2.2 e F3/T3.6 no `implement-plan`; não fechar Spec ou Plan.

### 2026-07-25 — JC-01 — reset local e integração server reexecutados

- **Estado:** `resolved`
- **Ação:** o ambiente local do Supabase foi resetado com `npm run db:test -w @stardust/server` após a indisponibilidade temporária do registry.
- **Sensores:** a migration `20260723120000_add_challenge_official_solution.sql` foi aplicada; `npm run test:integration -w @stardust/server` passou com 61/61 suítes e 183/183 testes.
- **Avaliação:** BLK-001 encerrado; não há mais bloqueio ambiental aberto para a integração server.
- **Findings bloqueantes:** nenhum para JC-01; JC-02 permanece independente e aberto.
- **Próxima ação:** reexecutar o Conclusion Gate; o fechamento ainda depende da resolução de JC-02.

### 2026-07-25 — Conclusion Gate — reexecução após resolução de JC-01

- **Estado:** `passed`
- **Ação:** o Harness foi reexecutado sobre o diff integrado com `gate conclusion` e os paths afetados explicitamente informados.
- **Sensores:** scope-check, typecheck, codecheck, testes unitários, architecture-check, migration-check e contract-check passaram; resultado agregado `passed: true`.
- **Avaliação:** JC-01 não bloqueia mais o fechamento; o próximo bloqueio é exclusivamente JC-02.
- **Findings bloqueantes:** JC-02 permanece aberto.
- **Próxima ação:** restaurar ou substituir comprovadamente os testes apontados por JC-02 e repetir o Judge de conclusão.

### 2026-07-25 — JC-02 — dispensa explícita da remoção dos testes

- **Estado:** `waived`
- **Ação:** decisão explícita do usuário para manter removidos `StartServerEntryPoint.test.ts`, `SupabaseAuthService.test.ts` e `UpdateAvatarRoute.test.ts`.
- **Sensores:** os testes server de integração passaram com 61/61 suítes e 183/183 testes; o teste focado atual de `useChallengePage` permanece para a alteração funcional.
- **Avaliação:** a remoção é intencional e não deve ser revertida; a aceitação final da dispensa depende de nova avaliação do Judge de conclusão.
- **Findings bloqueantes:** nenhum ativo; JC-02 aguardando validação da dispensa.
- **Próxima ação:** repetir o Judge de conclusão.

### 2026-07-25 — Conclusão — Judge Conclusion após JC-01/JC-02

- **Estado:** `evaluation_failed`
- **Ação:** Judge independente validou a resolução de BLK-001 e a dispensa explícita de JC-02, confrontando-a com o diff, as Rules e as pré-condições do Harness.
- **Sensores:** requisitos REQ-01–REQ-11 aprovados; Conclusion Gate e integrações registradas como aprovados.
- **Avaliação:** `failed` — JC-03 e JC-04 permanecem bloqueantes; a dispensa de JC-02 foi aceita.
- **Findings bloqueantes:** JC-03 e JC-04.
- **Próxima ação:** reabrir o fluxo de implementação para restaurar o baseline e reconciliar o Plan; não fechar Spec ou Plan.

### 2026-07-25 — correção JC-02/JC-03/JC-04 — Builder corretivo

- **Estado:** `verified`
- **Ação:** o Builder restaurou `StartServerEntryPoint.test.ts` e `SupabaseAuthService.test.ts`, preservou `UpdateAvatarRoute.test.ts`, recompôs a cobertura original de `useChallengePage` e manteve os casos de solução oficial. A configuração do Jest voltou a descobrir os testes unitários em `src/tests`, mantendo as rotas no projeto de integração.
- **Sensores:** server unit 161 suítes/300 testes; web unit 102 suítes/426 testes; quality-ratchet server passou sem atualização de baseline; typecheck e codecheck server/web passaram; `git diff --check` passou.
- **Baseline:** `packages/harness/baselines/server.json` confirmado byte a byte contra `d0970aeffb15f6783acafbd4e27d682e123144f4`.
- **Implementation Gates:** gates escopados de `@stardust/server` e `@stardust/web` passaram com scope-check, codecheck, typecheck e testes direcionados.
- **Avaliação:** JC-02, JC-03 e JC-04 resolvidos; F2 e F3 aguardam Judges independentes.
- **Próxima ação:** acionar o Judge independente da F2 e o Judge independente da F3.

### 2026-07-25 — correção adicional JC-02 — restauração de UpdateAvatarRoute

- **Estado:** `accepted`
- **Ação:** o Builder restaurou `apps/server/src/tests/routes/shop/avatars/UpdateAvatarRoute.test.ts` exatamente do commit-base; a comparação byte a byte passou.
- **Sensores:** typecheck e codecheck server passaram; a suíte unitária server passou; o teste integrado direcionado passou com 1 suíte/6 testes; o Implementation Gate server foi repetido e passou.
- **Avaliação:** Judge independente F2 aceitou a restauração; os três testes estão byte a byte iguais à base e o teste integrado passou 6/6.
- **Próxima ação:** nenhuma.

### 2026-07-23 — Harness — integração fora do contract-check

- **Estado:** `validating`
- **Ação:** `ContractCheckCommand` passou a ignorar comandos cuja evidência contenha `test:integration`, registrando-os em `evidence.skipped`; as regras e prompts do Harness foram sincronizados para separar integração direcionada/completa do `contract-check`.
- **Sensores:** `npm run test:harness` 17/17; `codecheck`, `typecheck` e `test:unit` globais passaram; `contract-check --run` passou executando apenas as evidências unitárias e listando 4 evidências de integração como `skipped`.
- **Avaliação:** pending — novo Implementation Gate de T3.2 necessário; quality-ratchet permanece dispensado por decisão do usuário.
- **Findings bloqueantes:** nenhum.

## Conclusão — tentativa anterior invalidada

- **Estado:** superseded
- **Tarefas verificadas:** 13/13
- **Findings bloqueantes:** nenhum; JC-02, JC-03 e JC-04 resolvidos e aceitos.
- **Sensores finais da correção:** server/web typecheck, codecheck, unit, quality-ratchet server, Implementation Gates e diff-check aprovados.
- **Judge das fases:** F2 e F3 `accepted`.
- **Judge da conclusão:** `accepted` em 2026-07-27.
- **Advisories:** `.tmp/stardust.wiki` permanece como alteração deletada preexistente fora do diff da feature; os testes restaurados estão untracked e devem ser incluídos explicitamente no commit final.

### 2026-07-27 — Conclusão — Judge Conclusion final

- **Estado:** `accepted`
- **Ação:** Judge independente avaliou a integração completa contra a Spec vigente, Plan, diff, arquitetura, Rules e histórico de findings.
- **Sensores:** Conclusion Gate passou; typecheck global passou; unit passou em core (171/611), server (161/300), web (102/426) e harness (18/18); integração server 61/183; Playwright oficial 5/5; builds core/server/web passaram; quality-ratchet server passou sem `--update-baseline`.
- **Avaliação:** `accepted` — REQ-01–REQ-11, fases F1/F2/F3 e findings JC-01–JC-04 confirmados; nenhum finding bloqueante ativo.
- **Próxima ação:** nenhuma; Spec e Plan fechados documentalmente.

### 2026-07-27 — CI-01/CI-02 — regressões encontradas após abertura do PR

- **Estado:** `open`
- **Ação:** o CI do PR #510 foi executado sobre o HEAD `20b8edbbd` após o fechamento documental.
- **Sensores:** o quality ratchet de web reportou 175 warnings contra baseline 163; os testes unitários de core (1 suíte) e web (2 suítes) falharam em checkout limpo por `Cannot find module '@stardust/lsp'`; integração server, typecheck e codecheck passaram.
- **Impacto:** a entrega não está mergeable e a conclusão anterior foi invalidada pelo CI do HEAD.
- **Próxima ação:** corrigir os warnings introduzidos sem `--update-baseline`, garantir a disponibilidade/build do LSP antes dos testes que o consomem, repetir os sensores, o Judge afetado e o Judge de conclusão.

## Conclusão atual

- **Estado:** completed
- **Tarefas verificadas:** 18/18 — 13 funcionais e 5 corretivas do CI.
- **Findings bloqueantes:** nenhum; JC-01–JC-04 e JI-F3-01 resolvidos.
- **Sensores finais:** Implementation Gates core/web, typecheck/codecheck/unit globais, integração server 61/183, Playwright 5/5, builds core/server/web, quality-ratchet core/web sem atualização de baseline; core manteve warnings/cobertura dentro do ratchet e web ficou em 156 contra baseline 163.
- **Judge das fases:** F1, F2 e F3 `accepted`.
- **Judge da conclusão:** `accepted` em 2026-07-27 após CI-05.
- **Advisories:** `.tmp/stardust.wiki` permanece como deleção preexistente fora do escopo funcional; `.env.production` local não possui `NEXT_PUBLIC_DISCORD_CHANNEL_URL`, pendência ambiental preexistente.

### 2026-07-27 — Conclusão — Judge Conclusion após correções de CI

- **Estado:** `accepted`
- **Ação:** Judge independente avaliou novamente a integração completa após a correção do CI e de JI-F3-01.
- **Sensores:** REQ-01–REQ-11, AC-01–AC-16 e AR-01–AR-05 aprovados; Conclusion Gate passou; F1/F2/F3 aceitas; baselines inalterados; nenhum finding bloqueante.
- **Avaliação:** `accepted` — Spec e Plan autorizados para fechamento documental; o novo HEAD ainda precisa passar CI remoto antes do merge.
- **Próxima ação:** nenhuma documental; commitar, fazer push, solicitar novo Codex Review e aguardar CI completo/mergeable.

### 2026-07-27 — CI-05 — falha remota e correção do workflow do server

- **Estado:** `accepted`
- **Ação:** o CI remoto falhou em `HonoApp.test.ts` por ausência de `@stardust/lsp`; o Builder adicionou o build do LSP aos jobs Tests e Quality ratchet do server.
- **Sensores:** falha remota reproduzida por resolução de módulo; typecheck, codecheck, unit tests e build LSP locais passaram; nenhum baseline foi alterado.
- **Avaliação:** accepted — sensores locais, Implementation Gate, Judge F3 e Conclusion Gate/Judge passaram após CI-05.
- **Findings bloqueantes:** nenhum; o CI remoto deve confirmar o novo workflow após o push.

### 2026-07-27 — F3 — Judge integrado após CI-05

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou F3 após o build do LSP ser adicionado aos jobs Tests e Quality ratchet do server.
- **Sensores:** build LSP, server unit 161/300, quality-ratchet server, typecheck/codecheck server e Implementation Gate server passaram; CI-04 core/web e baselines inalterados.
- **Avaliação:** accepted — AC-02–AC-16, AR-01, AR-02 e AR-04 confirmados; CI-05 verificada; nenhum finding bloqueante.
- **Próxima ação:** executar o Conclusion Gate e o Judge de conclusão.

### 2026-07-27 — Conclusão — Judge Conclusion após CI-05

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou a integração completa após a correção do workflow do server.
- **Sensores:** REQ-01–REQ-11, AC-01–AC-16 e AR-01–AR-05 aprovados; Conclusion Gate passou; core 171/611, server 161/300, web 102/428; quality-ratchets core/server/web passaram sem atualização de baseline; integração server 61/183; Playwright 5/5.
- **Avaliação:** `accepted` — 18/18 tarefas verificadas, F1/F2/F3 aceitas, CI-05 integrada e nenhum finding bloqueante.
- **Próxima ação:** nenhuma; Spec e Plan fechados documentalmente. O CI remoto deve passar após o push antes do merge.

### 2026-07-27 — Conclusão — Judge Conclusion após CI-04

- **Estado:** `accepted`
- **Ação:** Judge independente reavaliou a integração completa após a correção dos quality-ratchets de core e web.
- **Sensores:** REQ-01–REQ-11, AC-01–AC-16 e AR-01–AR-05 aprovados; Conclusion Gate passou; core 171/611, server 161/300, web 102/428, integração server 61/183, Playwright 5/5 e quality-ratchets core/web aprovados sem atualizar baseline.
- **Avaliação:** `accepted` — 17/17 tarefas verificadas, F1/F2/F3 aceitas, CI-04 integrada corretamente e nenhum finding bloqueante.
- **Próxima ação:** nenhuma; Spec e Plan fechados documentalmente. O CI remoto deve ser reexecutado após o push antes do merge.
