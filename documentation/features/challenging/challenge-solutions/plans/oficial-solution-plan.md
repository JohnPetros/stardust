---
title: Plano da solução oficial de desafio com Code Playback
spec: documentation/features/challenging/challenge-solutions/specs/oficial-solution-spec.md
spec_revision: 05f6873a9398d3162d8f8d58f83e133fcc16fb0f
status: in_progress
current_task: T2.1
base_commit: d0970aeffb15f6783acafbd4e27d682e123144f4
last_updated_at: 2026-07-23
---

# Plano — Solução oficial de desafio com Code Playback

## Estado Atual

- **Tarefa ativa:** T2.1
- **Estado:** `in_progress`
- **Última ação:** T1.3 aceita; a estabilização do Zustand eliminou `TS2589` e os sensores globais voltaram a passar.
- **Próxima ação:** executar readiness gate e iniciar T2.1, migration e tipos Supabase.
- **Bloqueios:** nenhum conhecido; a falha contratual isolada do worktree sintético continua registrada como limitação ambiental.
- **Workspaces afetados:** `@stardust/core`, `@stardust/server`, `@stardust/web`

## Pendências

Sem pendências.

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
  - **Tentativas:** 2
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

- [ ] **T2.1** — Criar a migration canônica e refletir o schema nos tipos Supabase
  - **Estado:** `in_progress`
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
  - **Tentativas:** 1
  - **Sensores:** Builder: migration-check (15 migrations), server typecheck/codecheck/unit e quality-ratchet passaram; gate scope/typecheck/codecheck passou; unit integrado foi interrompido após sensores direcionados; Supabase reset local não concluiu por pull PostgreSQL `429`/container ausente.
  - **Avaliação:** pending — aguardando Judge independente
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** solicitar Judge independente.

- [ ] **T2.2** — Adaptar mapper e repository e provar os contratos HTTP de detalhe e listagem
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar adapters e testes de rota pelo Builder

## F3 — Experiência web

**Objetivo:** entregar o componente global de Playback, a chamada condicional e a rota oficial protegida visualmente, com cobertura unitária e de browser.

**Diretriz visual:** os assets em `documentation/assets/code-playback/` são referências não normativas de hierarquia, estados, composição e responsividade. A implementação deve usar o design system já existente em `apps/web/src/ui/global/widgets/components/`, tokens do tema e padrões de layout da aplicação; não deve copiar cores, tipografia, ícones, abas de linguagem ou markup específico dos screenshots. O Playback suporta somente Delégua nesta entrega e não exibe indicador, abas ou seletor de linguagem.

### Tarefas

- [ ] **T3.1** — Estender o CodeEditor para múltiplos intervalos destacados
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.2** — Implementar o estado e a temporização do hook de Code Playback
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.3** — Implementar os controles acessíveis do Code Playback
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.4** — Implementar a renderização discriminada dos painéis do Code Playback
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.5** — Compor o widget global Code Playback e seus layouts
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** integrar e testar o widget pelo Builder

- [ ] **T3.6** — Corrigir hidratação e semântica de navegação para URLs de soluções
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.7** — Refatorar a listagem de soluções e inserir a chamada oficial condicional
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** implementar e testar pelo Builder

- [ ] **T3.8** — Integrar slot, App Router e jornada real da solução oficial
  - **Estado:** `pending`
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
  - **Tentativas:** 0
  - **Sensores:** pending
  - **Avaliação:** pending
  - **Findings bloqueantes:** nenhum
  - **Próxima ação:** integrar slot, rotas e testes pelo Builder

## Amendments da Spec

- **2026-07-23 — revisão textual:** a revisão da Spec mudou de `5a6b58a6a88bbb86f2d7b6dd0443c47f0c024c4d` para `05f6873a9398d3162d8f8d58f83e133fcc16fb0f` somente por uma quebra de linha final; nenhuma regra ou requisito foi alterado.

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

## Conclusão

- **Estado:** pending
- **Tarefas aceitas:** 3/13
- **Findings bloqueantes:** 0
- **Sensores finais:** pending
- **Judge da conclusão:** pending
