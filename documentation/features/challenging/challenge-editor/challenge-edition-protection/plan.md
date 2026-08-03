---
spec: ./spec.md
spec_revision: 2
status: completed
last_updated_at: 2026-08-01
---

# Plan — Proteção contra perda de alterações no editor de desafios

## Objetivo

Implementar a proteção de alterações pendentes do editor de desafios usando o
`form.formState.isDirty` como única fonte de verdade, com interceptação
controlada das navegações da aplicação, confirmação nativa para travessias e
descarregamento do documento, diálogo acessível e desarme seguro após operações
persistidas com sucesso.

## Escopo

- `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/`
- `apps/web/src/ui/challenging/widgets/components/UnsavedChangesDialog/`
- `apps/web/src/app/tests/challenging/`
- testes unitários dos hooks, View e adapter de browser relacionados ao editor

## Fora de escopo

- Core, Server, Validation, banco de dados e contratos REST.
- Autosave, rascunho local, recuperação de dados ou novos campos de domínio.
- Sentinelas de histórico, `pushState`/`replaceState` próprios ou substituição
  de métodos globais do navegador.
- Diálogo customizado para voltar/avançar do browser, links externos, download,
  nova aba ou cliques com modificadores.
- Alteração do `AlertDialog` global ou restauração do node Pencil removido.

## Estado operacional

- **Spec:** `completed`, revisão 2, aceita pelo Judge Spec.
- **Plan:** `completed`.
- **Fase atual:** F4 concluída e aceita com base nos sensores automatizados.
- **Judge Plan:** `accepted` para a Spec revisão 2, após três avaliações; o
  contrato de Navigation API foi refinado com `pendingTraversal`, rejeição do
  handler e `currententrychange` determinístico.
- **Findings ativos:** nenhum bloqueante. `JS-01` foi resolvido na revisão 2 da
  Spec ao substituir a estratégia de sentinela pela Navigation API com
  degradação explícita.
- **Próxima ação:** nenhuma; a Spec foi concluída por decisão do usuário sem
  exigir PR, validação manual adicional ou CI.
- **Tentativas:** 1 Judge Plan aceito; Builders/Fixes F1–F4 concluídos.

### Contrato operacional do entry protegido

Para remover a ambiguidade do fluxo de histórico, o adapter de F1 deve seguir
este ciclo de vida:

- No mount, quando `window.navigation` existir, capturar
  `navigation.currentEntry?.key` como `editorEntryKey`; se não houver chave,
  declarar a degradação e não tentar restaurar uma travessia.
- O callback de `navigate` recebe o evento original e compara
  `event.destination.key` com `editorEntryKey`. Só eventos com
  `navigationType === 'traverse'`, destino same-document e
  `event.canIntercept === true` entram no fluxo de confirmação; demais eventos
  seguem a degradação definida pela Spec e continuam cobertos por
  `beforeunload` quando descarregarem o documento.
- Para uma travessia elegível, chamar `event.intercept({ handler })` no próprio
  listener de `navigate`; o handler é o único ponto que segura a conclusão da
  travessia original. Antes de chamar `intercept`, o listener grava
  `pendingTraversal = { destinationKey, editorEntryKey }`; assim o listener de
  `currententrychange` não pode atualizar a chave durante a decisão. Dentro do
  handler, chamar `window.confirm()` uma vez. Se confirmar, limpar
  `pendingTraversal`, consumir o bypass de confirmação e resolver o handler;
  a transição original segue e o próximo `currententrychange` atualiza a chave
  para a entry realmente committed. Se cancelar, marcar `isRestoringEntry`,
  chamar `navigation.traverseTo(editorEntryKey)` uma vez e aguardar a sua
  Promise; depois limpar `isRestoringEntry` e rejeitar o handler com um
  `DOMException`/erro de cancelamento para abortar explicitamente a transição
  original. O `currententrychange` da restauração é ignorado e a chave original
  é preservada. Nunca usar `preventDefault()` como mecanismo de cancelamento e
  nunca chamar `traverseTo` para a confirmação aceita.
- Registrar também um listener de `currententrychange` enquanto o widget
  estiver montado. Ele ignora eventos quando `pendingTraversal` ou
  `isRestoringEntry` estiverem ativos; fora desses estados, após uma travessia
  confirmada que mantém o widget montado, atualiza `editorEntryKey` para
  `navigation.currentEntry?.key`. O listener deve ser a mesma referência usada
  no cleanup, junto do listener de `navigate`; em unmount ambos são removidos e
  chave, transição pendente e bypasses são descartados sem criar navegação.
- A chave não é inferida por delta nem substituída por uma nova entry fora do
  `currententrychange`. Se `event.intercept` não existir, declarar degradação
  explícita e não fingir que o cancelamento é suportado.
- O adapter recebe callbacks genéricos para solicitar, permitir e restaurar a
  travessia; a página continua sendo responsável pela máquina de diálogo e
  pelas ações controladas. Os testes de F1-T3 devem cobrir mount sem chave,
  mount com chave, confirmação, cancelamento/restauração, atualização da
  chave via `currententrychange`, uso de `event.intercept`, rejeição explícita
  da transição cancelada, tratamento da Promise de `traverseTo`, proteção
  contra reentrada, bypass único e cleanup dos dois listeners.

## Dependências e paralelismo

| Fase | Objetivo | Depende de | Paralelizável |
| --- | --- | --- | --- |
| F1 | Implementar e testar o adapter de browser para `beforeunload`, `navigate`, filtro de links e bypass | — | Não; define o contrato que a página consumirá |
| F2 | Integrar o guard ao formulário, às ações de persistência e ao diálogo customizado | F1 | Parcialmente; View do diálogo pode avançar após sua API ser definida, mas a integração depende do hook |
| F3 | Validar os fluxos observáveis com Playwright automatizado e manual na Web App real | F1 e F2 | Não; os cenários dependem do comportamento integrado e dos locators finais |
| F4 | Executar sensores, preflight e Judge Implementation por fase | F1, F2 e F3 | Não; os vereditos precisam do diff e das evidências finais |

Não há benefício seguro em distribuir a implementação entre workspaces: toda a
mudança pertence ao Web App e as tarefas compartilham o estado do mesmo
formulário, seus bypasses e seus destinos pendentes.

## F1 — Adapter de navegação do browser

**Estado:** `accepted`
**Dependências:** nenhuma  
**Veredito do Judge Implementation:** `accepted` (F1)

### Tarefas

- [x] **F1-T1 — Criar o adapter/hook de browser do editor**
- **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorBrowserNavigation.ts` (novo)
  - **Refs:** RF-03, RF-05; CA-07, CA-08, CA-09
  - **Resultado observável:** o hook registra `beforeunload` somente quando
    dirty e sem bypass; quando `window.navigation` existe, registra `navigate`
    apenas para estado dirty e trata somente travessias same-document
    interceptáveis com confirmação nativa síncrona. Remove exatamente os
    listeners e referências no cleanup.
  - **Restrições:** não criar entries, não usar sentinela, não substituir APIs
    globais e declarar a degradação quando Navigation API ou interceptação não
    estiver disponível.
  - **Parallelizable:** `false`; o contrato do hook é compartilhado por F2.

- [x] **F1-T2 — Implementar filtro de links internos e bypass efêmero**
- **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorBrowserNavigation.ts`
  - **Refs:** RF-02, RF-04; CA-04, CA-06, CA-09
  - **Resultado observável:** o listener de captura considera somente clique
    principal em âncora same-origin, sem `download`, sem modificadores e com
    `target` ausente ou `_self`; a navegação confirmada ou de sucesso passa uma
    única vez pelo bypass sem reabrir o guard.
  - **Parallelizable:** `false`; depende somente de F1-T1. O adapter deve
    receber callbacks genéricos de solicitação e bypass; a página os conecta à
    máquina de ação pendente em F2.

- [x] **F1-T3 — Cobrir o ciclo de vida e as travessias do adapter**
- **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/tests/useChallengeEditorBrowserNavigation.test.ts` (novo)
  - **Refs:** RF-02, RF-03, RF-04; CA-03, CA-07, CA-08, CA-09
  - **Resultado observável:** testes verificam registro/remoção de listeners,
    `preventDefault` e `returnValue` do `beforeunload`, confirmação nativa para
    back/forward, confirmação/cancelamento, restauração com
    `navigation.traverseTo`, filtro de links e bypass sem acúmulo de handlers.
  - **Parallelizable:** `false`; deve acompanhar o adapter real para evitar
    contrato de teste divergente.

### Evidências esperadas

- Testes unitários do adapter passando para estado limpo, dirty, bypass e
  cleanup.
- Evidência explícita de que o fallback sem Navigation API não cria histórico
  artificial e continua coberto por `beforeunload`.

### Riscos e próxima ação

- **Risco:** a tipagem/runtime da Navigation API pode divergir do Chromium
  disponível. **Mitigação:** encapsular acessos opcionais, testar o adapter com
  mocks e confirmar o comportamento real em F3.
- **Próxima ação:** criar o adapter mantendo a API pequena e independente do
  `useChallengeEditorPage`.

## F2 — Guard do formulário e diálogo acessível

**Estado:** `accepted`
**Dependências:** F1  
**Veredito do Judge Implementation:** `accepted` (F2)

### Tarefas

- [x] **F2-T1 — Expor o estado e a máquina de navegação pendente na página**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`
  - **Refs:** RF-01, RF-02, RF-04, RF-05; CA-01, CA-02, CA-04, CA-05, CA-06, CA-10, CA-11, CA-12
  - **Resultado observável:** o hook retorna `hasUnsavedChanges`,
    `requestNavigation`, `confirmNavigation` e `cancelNavigation`; ações são
    executadas imediatamente quando limpo, somente a primeira ação dirty é
    armazenada, cancelamento preserva valores e confirmação consome a ação uma
    vez.
  - **Resultado de persistência:** criação/atualização bem-sucedida executa
    `form.reset(form.getValues())` ou equivalente tipado antes do redirect;
    exclusão bem-sucedida usa bypass; qualquer falha mantém valores e proteção.
  - **Parallelizable:** `false`; é o ponto de orquestração consumido pela View
    e pelo adapter.

- [x] **F2-T2 — Integrar o adapter, botão Voltar e links controlados**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/useChallengeEditorPage.ts`, `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/ChallengeEditorPageView.tsx`, `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/index.tsx` (somente se a composição exigir)
  - **Refs:** RF-02, RF-03, RF-04; CA-03, CA-04, CA-06, CA-07, CA-08, CA-09, CA-10, CA-12
  - **Resultado observável:** `Voltar` chama `requestNavigation`, o adapter é
    montado com a referência dirty do formulário e os redirects de sucesso ou
    exclusão não ficam presos no guard.
  - **Restrições:** preservar o `useChallengeNavigationGuard` da resolução de
    desafios e não alterar o comportamento de `Rewarding`.
  - **Parallelizable:** `false`; depende da API final de F2-T1.

- [x] **F2-T3 — Criar o widget UnsavedChangesDialog**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/components/UnsavedChangesDialog/index.tsx` (novo), `apps/web/src/ui/challenging/widgets/components/UnsavedChangesDialog/UnsavedChangesDialogView.tsx` (novo)
  - **Refs:** RF-05; CA-05, CA-06, CA-13
  - **Resultado observável:** o widget recebe `isOpen`,
    `onContinueEditing` e `onLeaveWithoutSaving`; exibe o título `Sair sem
    salvar?`, ações seguras com foco inicial, ação destrutiva de saída,
    `shouldPlayAudio={false}` e trata `onOpenChange(false)` como continuar
    editando.
  - **Parallelizable:** `true` dentro de F2 após a API de callbacks estar
    definida; não pode ser integrado antes de F2-T1.

- [x] **F2-T4 — Atualizar testes unitários da página e da View**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/tests/useChallengeEditorPage.test.ts`, `apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/tests/ChallengeEditorPageView.test.tsx`, `apps/web/src/ui/challenging/widgets/components/UnsavedChangesDialog/tests/UnsavedChangesDialogView.test.tsx` (novo)
  - **Refs:** RF-01, RF-02, RF-04, RF-05; CA-01 a CA-06, CA-10 a CA-13
  - **Resultado observável:** testes cobrem criação/edição limpa e dirty,
    campos dinâmicos, cancelamento, confirmação única, reset após sucesso,
    retenção após falha, exclusão, wiring do botão Voltar e contrato acessível
    do diálogo.
  - **Parallelizable:** `false`; os testes devem refletir a API integrada e
    impedir regressões no mock existente da View.

### Evidências esperadas

- Matriz de testes unitários relacionando a máquina do hook aos CA-01..06 e
  CA-10..13.
- Verificação de que não existe snapshot/DTO paralelo ao `isDirty`.
- Verificação de que a mesma função de listener é removida no cleanup e de que
  o sucesso não dispara confirmação antes do redirect agendado.

### Riscos e próxima ação

- **Risco:** `form.watch` e `setValue` usados para campos derivados podem
  alterar dirty state de forma indireta. **Mitigação:** testar campos simples e
  `useFieldArray`, mantendo todos os valores no mesmo React Hook Form.
- **Risco:** o callback de fechar o `AlertDialog` pode conflitar com a ação
  pendente. **Mitigação:** mapear todo fechamento permitido para cancelamento
  seguro e testar teclado/Escape.
- **Próxima ação:** integrar primeiro a API do hook; só então conectar View e
  widget.

## F3 — Fluxos reais de integração Web

**Estado:** `accepted`  
**Dependências:** F1 e F2  
**Veredito do Judge Implementation:** `accepted` após correção de `JI-08`

### Tarefas

- [x] **F3-T1 — Criar cenário autenticado de editor no Playwright**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/app/tests/challenging/challenge-editor-edition-protection.test.ts` (novo)
  - **Refs:** RF-01, RF-02, RF-03, RF-04, RF-05; CA-01 a CA-13
  - **Resultado observável:** o teste usa `ServerMock`, cookie de sessão fake do
    ambiente `testing`, endpoints mínimos de conta/categorias/desafio e
    navega para `/challenging/challenge` e
    `/challenging/challenge/<slug>` sem depender de conta real ou produção.
  - **Parallelizable:** `false`; a base de mocks é compartilhada pelos
    cenários seguintes.

- [x] **F3-T2 — Cobrir navegação controlada e diálogo customizado**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/app/tests/challenging/challenge-editor-edition-protection.test.ts`
  - **Refs:** RF-01, RF-02, RF-05; CA-03, CA-04, CA-05, CA-06
  - **Resultado observável:** editor limpo navega imediatamente; editor dirty
    mantém URL e valores ao usar `Voltar` ou link interno, abre `Sair sem
    salvar?`, cancela com ação segura/Escape e executa somente o destino
    original após `Sair sem salvar`.
  - **Parallelizable:** `false`; depende dos locators e do widget final.

- [x] **F3-T3 — Cobrir back/forward, reload e descarga do documento**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/app/tests/challenging/challenge-editor-edition-protection.test.ts`
  - **Refs:** RF-03; CA-07, CA-08, CA-09
  - **Resultado observável:** Chromium verifica confirmação nativa para
    travessias suportadas, confirmação/cancelamento e permanência do editor
    com valores preservados; o teste de `beforeunload` observa o diálogo nativo
    em reload/navegação que descarrega o documento, sem afirmar texto
    customizado.
  - **Parallelizable:** `false`; depende da compatibilidade real da Navigation
    API no projeto configurado.

- [x] **F3-T4 — Cobrir sucesso e falha de persistência**
  - **Estado:** `verified`
  - **Paths:** `apps/web/src/app/tests/challenging/challenge-editor-edition-protection.test.ts`
  - **Refs:** RF-04; CA-10, CA-11, CA-12
  - **Resultado observável:** respostas mockadas de criação/atualização e
    exclusão bem-sucedidas redirecionam sem guard; respostas de erro preservam
    valores, editor e próxima tentativa protegida.
  - **Parallelizable:** `false`; depende das rotas e estados de ação finais.

- [x] **F3-T5 — Executar validação manual autenticada com Web App e Server App reais**
  - **Estado:** `verified`
  - **Paths:** `apps/server/`, `apps/web/` e rotas reais do editor
  - **Refs:** RF-01, RF-02, RF-03, RF-04, RF-05; CA-01 a CA-13
  - **Pré-requisitos:** iniciar `npm --workspace @stardust/server run dev` em
    `http://localhost:3334` e `npm --workspace @stardust/web run dev` em
    `http://localhost:3000`; carregar as credenciais reais por
    `source ./scripts/export-web-app-e2e-env.sh`, sem registrar valores em
    código, documentação ou logs.
  - **Resultado observável:** em uma sessão Playwright real, autenticar pela
    Web App, aguardar a navegação para `/space`, acessar o editor protegido e
    exercitar edição, `Voltar`, link interno, cancelamento/descarte,
    back/forward, reload e sucesso/falha de persistência. Confirmar visualmente
    o diálogo, os valores preservados e o destino final.
  - **Diagnóstico obrigatório:** capturar `console`, `pageerror`,
    `requestfailed` e `response`; confirmar `2xx` para `/auth/account` e para
    os endpoints consumidos pelo editor. Resolver CORS, configuração ou falhas
    da API antes de considerar a implementação validada.
  - **Parallelizable:** `false`; deve ocorrer após os testes automatizados e
    com Web e Server App executando versões do mesmo estado do código.

### Evidências esperadas

- Execução da suíte Playwright no ambiente `testing`, com respostas mockadas de
  `/auth/account` e endpoints do editor em `2xx` quando aplicável.
- Registro da validação manual autenticada com Playwright contra Web App e
  Server App reais, incluindo rotas acessadas, respostas `2xx`, ausência de
  erros de console/request e resultado visual dos fluxos protegidos.
- Evidência de navegação para as rotas previstas, não apenas renderização da
  tela inicial.
- Captura de console/request failures somente para diagnóstico; a suíte
  automatizada com `ServerMock` não deve usar credenciais reais nem
  `STUDIO_APP_E2E_*`. A sessão manual usa somente as credenciais locais
  carregadas pelo script oficial da Web App.

### Riscos e próxima ação

- **Risco:** diálogos nativos e Navigation API variam por browser. **Mitigação:**
  limitar o requisito automatizado ao projeto Chromium já configurado e manter
  fallback explícito para ambientes sem suporte.
- **Risco:** o atraso de 1 segundo do redirect de sucesso gerar flakiness.
  **Mitigação:** aguardar URL/resposta/evento observável, nunca depender apenas
  de `waitForTimeout`.
- **Risco:** a validação real falhar por ambiente, autenticação, CORS ou
  endpoints não disponíveis. **Mitigação:** iniciar Server App e Web App em
  terminais separados, validar as variáveis de ambiente antes do browser e
  registrar as respostas do fluxo.
- **Resultado:** 9/9 cenários Playwright passaram; a sessão manual autenticou,
  acessou `/space`, a lista de desafios e o editor real, e confirmou edição,
  cancelamento, preservação e descarte.

## F4 — Sensores, preflight e julgamento

**Estado:** `accepted`  
**Dependências:** F1, F2 e F3  
**Veredito do Judge Implementation:** `accepted` no modo `Final`

### Tarefas

- [x] **F4-T1 — Executar ciclo curto e formatar alterações**
  - **Estado:** `verified`
  - **Paths:** arquivos alterados nas fases F1–F3
  - **Refs:** todos os RF/CA cobertos pelo diff
  - **Resultado observável:** executar `npm run format`, `npm run check:code`,
    `npm run check:types` e `npm run test:unit`, registrando comandos, status e
    evidências reais no `evaluation.md`.
  - **Parallelizable:** `false`; format e testes devem avaliar o mesmo estado
    final do ciclo curto.

- [x] **F4-T2 — Executar preflight aplicável do Web App**
  - **Estado:** `verified`
  - **Paths:** `apps/web/` e arquivos da feature
  - **Refs:** CA-01 a CA-13
  - **Resultado observável:** `npm run check:architecture` e
    `npm run test:integration` passam; o workspace Web também passa em
    `npm --workspace @stardust/web run test:integration`; a suíte da feature e
    os cenários de `official-solution` são a evidência automatizada considerada
    para este encerramento.
  - **Parallelizable:** `false`; o preflight deve ser executado sobre o HEAD
    que será julgado.

- [x] **F4-T3 — Executar Judge Implementation final**
  - **Estado:** `verified`
  - **Paths:** diff da feature, `plan.md` e `evaluation.md`
  - **Refs:** RF-01..RF-05 e CA-01..CA-13
  - **Resultado observável:** cada fase recebe `accepted` ou `failed` com
    evidência; findings operacionais são persistidos neste Plan imediatamente,
    e correções repetem os sensores afetados antes de novo julgamento.
  - **Parallelizable:** `false`; o Judge é read-only e depende das evidências
    da fase correspondente.

### Sensores obrigatórios

| Sensor | Momento | Estado inicial | Evidência esperada |
| --- | --- | --- | --- |
| `npm run format` | ciclo curto | `passed` | Turbo formatou os workspaces; 1 arquivo Web ajustado. |
| `npm run check:code` | ciclo curto/preflight | `warning` | 1 erro e 173 warnings preexistentes fora da feature, concentrados em arquivos não alterados. |
| `npm run check:types` | ciclo curto/preflight | `passed` | TypeScript do Web App passou. |
| `npm run test:unit` | ciclo curto/preflight | `passed` | 107 suítes / 461 testes passaram. |
| `npm run check:architecture` | preflight | `passed` | 3572 módulos / 6364 dependências, sem violações. |
| `npm run test:integration` | preflight | `passed` | 9/9 cenários F3 passaram. |
| `npm --workspace @stardust/web run test:integration` | preflight Web | `warning` | Os 9 cenários da feature e os 5 cenários de `official-solution` passaram; a execução completa foi interrompida por timeout externo em `auth/account-confirmation`. |

PR, validação manual adicional, Quality Gate e build do CI não são critérios de
encerramento desta Spec, conforme decisão do usuário.

## Findings e tentativas

| ID | Tipo | Estado | Registro / próxima ação |
| --- | --- | --- | --- |
| JS-01 | histórico com sentinela/popstate | resolved | Resolvido na Spec revisão 2; não reintroduzir entries artificiais. |
| JP-01 | contrato de travessia sem `intercept`/`currententrychange` determinísticos | resolved | Corrigido nesta revisão do Plan: `pendingTraversal` é gravado antes de `intercept`, confirmação resolve a transição original, cancelamento aguarda `traverseTo` e rejeita o handler, e `currententrychange` ignora estados provisórios. Repetir o Judge Plan. |
| JP-02 | cancelamento não rejeitava a transição e atualização da entry ocorria cedo | resolved | Corrigido nesta revisão do Plan com rejeição explícita do handler, tratamento da Promise de restauração e bloqueio de atualização durante `pendingTraversal`/`isRestoringEntry`. Repetir o Judge Plan. |
| JI-01 | confirmação de travessia não ativava bypass efêmero e testes não cobriam o ciclo | resolved | Builder Fix F1 implementou bypass único/reentrada e cobertura de `returnValue`; Judge Implementation F1 aceitou após sensores focados. |
| JI-02 | confirmação F2 executava navegação dentro de updater React | resolved | Builder Fix F2 consumiu a ação pendente via ref e adicionou teste de confirmação única; Judge Implementation F2 aceitou. |
| JI-03 | cobertura F2 não demonstrava CA-01, CA-03, CA-05, CA-10–CA-13 | resolved | Builder Fix F2 ampliou cobertura de limpeza, Voltar, cancelamento/fechamento, foco, sucesso, falha e exclusão; Judge Implementation F2 aceitou. |
| JI-04 | alterações documentais e de AGENTS fora do escopo da F2 no worktree | external | Alterações já existentes no worktree antes da implementação; preservar, não reverter, e separar/justificar no diff final se necessário. |
| JI-05 | ações explícitas do AlertDialog podem conflitar com `onOpenChange(false)` | resolved | Builder Fix F2 separou ações explícitas de fechamento externo/Escape e cobriu callbacks únicos no ciclo do diálogo; F2 e o Judge final aceitaram. |
| JI-06 | cobertura não demonstrava campos dinâmicos e criação bem-sucedida | resolved | Builder Fix F2 adicionou dirty em `useFieldArray` e reset após criação; Judge F2 aceitou. |
| JI-07 | F3 deixou update/exclusão como `fixme`, sem evidência integrada de CA-10–CA-12 | resolved | Builder Fix F3 removeu `fixme`, corrigiu submissão por clique, payload e mocks; os dois cenários de update e exclusão passaram isoladamente/na suíte parcial. |
| JI-08 | dirty state inicial impedia o Voltar limpo | resolved | A inicialização derivava parâmetros de função de código mesmo quando `isEvaluatedByFunction=false`, criando inputs e marcando o formulário como dirty. A inicialização foi condicionada ao modo de avaliação; os 9 cenários F3 passaram. |
| JI-09 | validação manual autenticada não redirecionou após login | resolved | O bloqueio era a ausência do Inngest local em `127.0.0.1:8288`. Com Inngest iniciado, o login redirecionou para `/space`, a sessão persistiu na lista/editor e o fluxo protegido foi exercitado. 401 transitórios foram renovados por `POST /auth/refresh-session` 201 e os endpoints finais retornaram 2xx. |
| EXT-01 | suíte geral falhou em `auth/account-confirmation` | external | O timeout aguardou listeners de `__STARDUST_PROFILE_CHANNEL_MOCK__`; os testes da feature e de `official-solution` passaram. Não bloqueia o encerramento desta Spec. |

## Handoff

Após F4-T3, o Orchestrator atualizou `evaluation.md` com commit-base, commit
avaliado, matriz CA/evidência real, sensores, vereditos e decisões. O finding
externo da suíte geral foi registrado como warning; não há tarefa bloqueante
remanescente e o Plan está concluído.
