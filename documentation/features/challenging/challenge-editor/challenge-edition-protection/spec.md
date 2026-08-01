---
title: Proteção contra perda de alterações no editor de desafios
status: in_progress
revision: 2
source:
  - type: issue
    ref: https://github.com/JohnPetros/stardust/issues/517
  - type: prd
    ref: https://github.com/JohnPetros/stardust/milestone/4
scope:
  - apps/web/src/ui/challenging/widgets/pages/ChallengeEditor/
  - apps/web/src/ui/challenging/widgets/components/UnsavedChangesDialog/
  - apps/web/src/app/tests/challenging/
last_updated_at: 2026-08-01
---

# Contexto e objetivo

O editor de desafios usa React Hook Form e já consulta `form.formState.isDirty`
para habilitar atualizações, mas hoje qualquer saída da página descarta os dados
locais sem aviso. A entrega deve usar a mesma referência de estado persistido
para proteger criações e edições contra navegação acidental, sem bloquear uma
saída legítima depois de salvar ou excluir com sucesso.

A origem possui duas divergências conhecidas. A issue referencia um PRD local
em `documentation/features/challenging/challenge-editor/prd.md`, atualmente
removido no worktree, e requisitos `RF-08`/`CA-38..44` que não existem na
descrição atual do milestone remoto, encerrada em `RF-07`/`CA-37`. Para esta
Spec, a issue `#517` é a fonte normativa da mudança e o milestone `4` fornece o
contexto de produto do editor. Além disso, o node Pencil `yCjct` indicado na
issue não existe mais em `design/stardust.pen`; o contrato textual da issue e os
componentes visuais existentes da Web App prevalecem nesta revisão.

# Escopo

## Incluído

- Detectar alterações pendentes em todos os campos atualmente registrados no
  formulário do editor, inclusive estruturas dinâmicas de categorias,
  parâmetros e casos de teste.
- Proteger o botão `Voltar` e navegações internas iniciadas por links da página
  com um diálogo customizado enquanto houver alterações pendentes.
- Solicitar confirmação nativa em voltar/avançar do histórico, recarregamento,
  fechamento da aba e navegações que descarreguem o documento.
- Exibir um diálogo acessível para navegações controladas pela aplicação.
- Limpar a proteção antes do redirecionamento decorrente de criação,
  atualização ou exclusão bem-sucedida e preservá-la após falha.
- Adicionar testes unitários/de widget e integração Playwright para os fluxos
  observáveis de navegação.

## Fora de escopo

- Autosave, persistência de rascunho local ou recuperação posterior dos dados
  descartados.
- Alterações em contratos do Core, API, banco de dados ou serviços REST.
- Adicionar solução oficial ou playback ao editor. Esses campos não pertencem
  ao schema/formulário atual; quando forem integrados, deverão ser registrados
  no mesmo React Hook Form para participarem de `isDirty` sem um segundo estado
  paralelo.
- Interceptar abertura em nova aba, download, links externos ou cliques com
  modificadores. Quando a navegação descarregar a página atual, aplica-se apenas
  a confirmação nativa de `beforeunload`.
- Exibir o diálogo customizado em voltar/avançar do navegador. Por decisão
  humana de 2026-08-01, esse fluxo usa a confirmação nativa síncrona para não
  depender de uma navegação assíncrona impossível de pausar no App Router.
- Restaurar o node Pencil removido ou redesenhar o `AlertDialog` global.

# Contract

## Requisitos funcionais

- **RF-01 — Detectar alterações pendentes:** o editor deve considerar pendente
  qualquer divergência entre os valores atuais do React Hook Form e os últimos
  valores carregados ou redefinidos como persistidos.
- **RF-02 — Proteger navegações da aplicação:** uma tentativa de sair por
  `Voltar` ou link interno no mesmo contexto deve ser adiada enquanto houver
  alterações pendentes e retomada somente após confirmação no diálogo
  customizado.
- **RF-03 — Proteger navegação do browser:** voltar/avançar do histórico,
  recarregar, fechar a aba ou executar outra navegação que descarregue o
  documento deve acionar uma confirmação nativa enquanto o formulário estiver
  pendente.
- **RF-04 — Sincronizar proteção e persistência:** sucesso de criação,
  atualização ou exclusão deve desarmar a proteção antes do redirecionamento;
  falha deve manter os valores e a proteção.
- **RF-05 — Oferecer decisão acessível e segura:** o diálogo deve explicar a
  perda de dados, priorizar a permanência no editor e permitir descarte
  explícito sem repetir ou trocar o destino pendente.

## Critérios de aceitação

| CA | RF | Dado | Quando | Então | Evidência esperada |
|---|---|---|---|---|---|
| CA-01 | RF-01 | um editor recém-hidratado ou um formulário cujos valores voltaram aos defaults persistidos | o estado é observado antes de qualquer edição efetiva | `hasUnsavedChanges` é falso e a saída ocorre sem diálogo | teste unitário do hook com criação e edição |
| CA-02 | RF-01 | qualquer campo atual do editor, inclusive categoria, parâmetro ou caso de teste | o usuário adiciona, altera ou remove um valor | `hasUnsavedChanges` é verdadeiro; alterações derivadas no mesmo formulário não criam uma referência paralela | teste unitário/de integração do widget com campos simples e dinâmicos |
| CA-03 | RF-02, RF-03 | formulário limpo | o usuário aciona `Voltar`, um link interno simples ou o histórico | a navegação solicitada ocorre imediatamente, sem confirmação customizada ou nativa | teste unitário e Playwright |
| CA-04 | RF-02, RF-05 | formulário alterado | o usuário aciona `Voltar` ou um link interno simples | a URL e os valores permanecem no editor e o diálogo `Sair sem salvar?` é aberto com aquela primeira navegação armazenada | teste unitário e Playwright |
| CA-05 | RF-02, RF-05 | diálogo aberto por uma navegação pendente | o usuário escolhe `Continuar editando`, pressiona `Escape` ou fecha o diálogo por um meio permitido pelo componente | o diálogo fecha, a navegação é cancelada e todos os valores permanecem; uma nova tentativa futura volta a ser protegida | teste do hook, teste da View e Playwright |
| CA-06 | RF-02, RF-05 | diálogo aberto por uma navegação pendente | o usuário escolhe `Sair sem salvar` | somente o destino originalmente armazenado é executado uma vez, sem reabrir o diálogo durante essa execução | teste unitário e Playwright para rota controlada |
| CA-07 | RF-03 | formulário alterado após interação do usuário | o usuário inicia voltar/avançar em uma travessia same-document suportada pela Navigation API | uma confirmação nativa síncrona é exibida; confirmar permite o destino original e cancelar restaura o entry do editor sem descartar valores | teste unitário do adapter de browser e Playwright Chromium para back, forward, confirmação e cancelamento |
| CA-08 | RF-03 | formulário alterado após interação do usuário | o documento recebe `beforeunload` por reload, fechamento, travessia cross-document ou navegação externa na mesma aba | o evento é cancelado conforme a API do navegador e a confirmação nativa pode ser exibida | teste unitário do listener e Playwright com evento de diálogo nativo |
| CA-09 | RF-03 | formulário limpo, redefinido como persistido ou componente desmontado | o ciclo de vida dos listeners é inspecionado | não existe listener ativo de `navigate` ou `beforeunload` para essa proteção | teste unitário com spies em `addEventListener`/`removeEventListener` |
| CA-10 | RF-04 | criação ou atualização bem-sucedida | o redirecionamento automático é agendado | o formulário é redefinido como persistido antes da navegação e nenhum diálogo customizado ou nativo é acionado | teste unitário com timers e Playwright com resposta de sucesso |
| CA-11 | RF-04 | criação ou atualização falha | a resposta de erro retorna | os valores preenchidos e `hasUnsavedChanges` são preservados, e a próxima tentativa de saída continua protegida | teste unitário com resposta de falha |
| CA-12 | RF-04 | exclusão confirmada pelo diálogo destrutivo existente | a exclusão termina com sucesso ou falha | no sucesso, a proteção é desarmada antes de ir à lista; na falha, o editor e a proteção permanecem ativos | teste unitário do hook |
| CA-13 | RF-05 | diálogo de alterações pendentes aberto | a interface é consultada e o usuário navega por teclado | o título é `Sair sem salvar?`, as ações são `Continuar editando` e `Sair sem salvar`, o áudio está desativado e o foco inicial está na ação segura | teste da View com React Testing Library |

# Estado atual

- `useChallengeEditorPage` inicializa um único React Hook Form e usa
  `form.formState.isDirty` apenas para habilitar a atualização de desafios
  existentes.
- O botão `Voltar` chama `navigationProvider.goBack()` imediatamente.
- Em sucesso, `handleActionSuccess` agenda `navigationProvider.goTo(...)` sem
  redefinir a referência persistida do formulário.
- Campos compostos usam `useFieldArray`/`setValue`; não existe um segundo store
  para os dados do editor.
- `useRefreshPage` demonstra o uso de `beforeunload`, porém mantém o listener
  registrado mesmo quando `isEnabled` é falso. Esta entrega precisa registrar e
  remover o listener de proteção conforme o estado pendente, sem alterar o
  comportamento do consumidor existente em `Rewarding`.
- A Web App usa Next.js App Router. `useRouter` de `next/navigation` não expõe
  um evento cancelável anterior à troca de rota; portanto a proteção deve atuar
  nos pontos de intenção controláveis e no histórico do browser, não reagir
  somente depois que `usePathname` mudar.
- O guard `useChallengeNavigationGuard` existente protege rascunho de código na
  página de resolução de desafios, baseado em `localStorage`. Ele não deve ser
  reutilizado no editor porque possui outra fonte de dirty state e descarta
  outro tipo de rascunho.

# Solução técnica

## Estado e API do hook da página

`useChallengeEditorPage` permanece responsável pelo React Hook Form e passa a
expor, no mínimo:

```ts
type PendingNavigation = () => void

{
  form,
  hasUnsavedChanges,
  requestNavigation,
  confirmNavigation,
  cancelNavigation,
  ...
}
```

- `hasUnsavedChanges` deriva de `form.formState.isDirty`; não criar snapshot
  manual nem comparar DTOs em paralelo.
- `requestNavigation(action)` executa imediatamente quando limpo. Quando dirty,
  armazena somente a primeira ação pendente e abre o diálogo.
- `confirmNavigation()` fecha o diálogo, consome a ação pendente uma vez e usa
  um bypass efêmero apenas durante essa execução.
- `cancelNavigation()` remove a ação pendente, fecha o diálogo e mantém o dirty
  state.
- O botão `Voltar` deve chamar `requestNavigation(() =>
  navigationProvider.goBack())`.

## Links internos controlados

- Enquanto dirty, registrar um listener de clique em fase de captura para
  âncoras internas no mesmo origin. Interceptar apenas botão principal sem
  modificadores, sem `download` e com target ausente ou `_self`; prevenir o
  clique e encaminhar o destino a `requestNavigation`.
- O redirecionamento de sucesso e a navegação após exclusão confirmada usam o
  bypass efêmero, nunca uma desativação global permanente.

## Histórico do navegador

- Não criar entrada sentinela nem alterar `pushState`/`replaceState` do Next.js.
- Encapsular a integração de browser em um adapter/hook local do widget. Quando
  `window.navigation` estiver disponível, registrar `navigate` apenas enquanto
  dirty e tratar `navigationType === 'traverse'` com uma confirmação nativa
  síncrona (`window.confirm`). Guardar a key do entry do editor e usar a key do
  `event.destination` para distinguir e testar back/forward sem inferir delta.
- Ao confirmar, permitir a travessia original uma vez mediante bypass efêmero.
  Ao cancelar uma travessia same-document que não seja cancelável, restaurar o
  entry do editor por `navigation.traverseTo(editorEntryKey)` com bypass de
  restauração. O resultado observável obrigatório é o editor novamente ativo,
  com os valores preservados e sem entrada adicional no histórico.
- Se `window.navigation` não existir ou `event.canIntercept` for falso, não
  simular travessia com sentinela. Navegações que descarregarem o documento
  continuam cobertas por `beforeunload`; travessias same-document sem suporte
  à Navigation API ficam como degradação explícita de compatibilidade.
- Remover os listeners e referências no cleanup. O adapter não pode acumular
  handlers, substituir métodos globais, criar entries ou prender o usuário após
  o unmount.

Devido à ausência de uma API bloqueadora no App Router, a implementação deve
manter a confirmação de histórico síncrona e nativa, conforme decisão humana de
2026-08-01. `useChallengeEditorPage` permanece como API de orquestração e o
adapter de browser deve ser validado no Next.js instalado e no projeto Chromium
já configurado em `apps/web/playwright.config.ts`.

## Descarregamento do documento

- Registrar `beforeunload` somente quando `hasUnsavedChanges` for verdadeiro e
  não houver bypass de sucesso em andamento.
- O handler deve chamar `event.preventDefault()` e atribuir `event.returnValue`
  para compatibilidade, sem tentar customizar o texto nativo.
- O cleanup deve remover exatamente a mesma função/listener.

## Persistência

- Após resposta bem-sucedida de criação ou atualização, executar
  `form.reset(form.getValues())` (ou equivalente tipado) antes de agendar o
  redirecionamento. Isso torna os valores atuais a nova referência persistida e
  limpa `isDirty` sem apagar a confirmação visual.
- Em falha, não executar `reset` nem limpar a ação pendente.
- Após exclusão bem-sucedida, não é necessário redefinir dados que deixarão de
  existir, mas o redirecionamento deve usar o bypass de saída. Falha de exclusão
  mantém o guard inalterado.

## Diálogo

Criar `UnsavedChangesDialog` conforme o Widget Pattern, com `index.tsx` como
entry point e `UnsavedChangesDialogView.tsx` para renderização. O widget pode
compor o `AlertDialog` existente e deve receber estado/handlers explícitos:

```ts
UnsavedChangesDialog({
  isOpen,
  onContinueEditing,
  onLeaveWithoutSaving,
}): JSX.Element
```

O fechamento informado por `onOpenChange(false)` deve equivaler a continuar
editando. A ação segura recebe foco inicial, a ação de saída possui tratamento
visual destrutivo e `shouldPlayAudio` permanece falso.

# Plano de validação

## Sensores locais aplicáveis

- `npm run format` — aplicar formatação após as alterações.
- `npm run check:code` — obrigatório no ciclo curto e preflight.
- `npm run check:types` — obrigatório para contratos do hook, eventos DOM e
  React Hook Form.
- `npm run test:unit` — obrigatório; deve cobrir hook e View.
- `npm run check:architecture` — aplicável no preflight por criação de widget e
  hook de UI.
- `npm run test:integration` — aplicável no preflight por navegação, histórico e
  comportamento real do browser. No workspace Web, executar também
  `npm --workspace @stardust/web run test:integration` conforme as instruções do
  projeto.

Quality Gate e build final permanecem validações do CI, posteriores ao
preflight local.

## Evidência automatizada esperada

- Testes de `useChallengeEditorPage` para dirty limpo/alterado, retenção da
  primeira navegação, cancelamento, confirmação única, sucesso, falha e
  exclusão.
- Testes do hook encapsulado de browser para ciclo de vida de `beforeunload` e
  `navigate`, filtro de links, back/forward nativo, bypass, restauração e cleanup.
- Teste de `UnsavedChangesDialogView` para textos, ação destrutiva, fechamento,
  áudio e foco inicial.
- Playwright em `apps/web/src/app/tests/challenging/` usando `ServerMock`, cookie
  de sessão e respostas determinísticas para `/auth/account`, categorias e
  persistência. Cobrir cancelamento e confirmação de link/voltar, histórico e
  ausência de aviso após sucesso.
- Para a confirmação nativa, observar o evento `dialog` do Playwright e cobrir
  aceitar/cancelar; não exigir texto em `beforeunload`, porque o browser controla
  essa mensagem.

# Avaliações previstas

- **Judge Spec:** obrigatório antes de alterar o status para `open`.
- **Judge Implementation:** obrigatório por envolver coordenação entre estado
  de formulário, App Router e History API.
- **Browser/UX:** obrigatório via Playwright para confirmar preservação do
  formulário, foco do diálogo e navegação única.
- **Arquitetura:** verificar Widget Pattern, dependências recebidas na borda e
  ausência de estado de negócio na View.
- **Performance:** verificar listeners condicionais, cleanup e ausência de
  criação/acúmulo de entradas no histórico; não há meta numérica adicional.
- **Segurança:** confirmar que somente URLs internas analisadas pelo browser são
  repassadas à navegação controlada; nenhum novo fluxo de autorização ou dado
  sensível é introduzido.

# Alinhamento documental

- Não alterar `documentation/architecture.md`: a solução permanece na camada
  Web UI e segue o Widget Pattern existente.
- Não recriar incidentalmente o PRD removido nem alterar o milestone remoto.
  A divergência entre a issue e essas referências fica registrada nesta Spec.
- `design/stardust.pen` precisa de realinhamento futuro da referência visual,
  mas isso não bloqueia o contrato textual e acessível desta entrega.
- `evaluation.md` já registra o primeiro Judge Spec e deve continuar sendo
  atualizado com os próximos vereditos e evidências reais.

# Premissas e questões resolvidas

- A issue `#517` prevalece para a proteção de alterações não salvas porque é a
  única fonte que contém o requisito completo e está aberta no milestone.
- Solução oficial e playback ficam fora da implementação atual, mas qualquer
  integração futura desses campos no editor deve registrá-los no mesmo form.
- A cobertura de “mudanças de rota” significa intenções observáveis enquanto o
  widget está montado: controles do editor, links internos simples no DOM,
  histórico e descarregamento do documento. O App Router não oferece hook
  cancelável global anterior à rota.
- Por decisão humana de 2026-08-01, o diálogo customizado não se aplica ao
  histórico do navegador. Back/forward usam confirmação nativa síncrona onde a
  Navigation API estiver disponível; `beforeunload` cobre descarregamentos.
- A primeira navegação pendente é preservada até confirmação ou cancelamento;
  tentativas adicionais com o diálogo aberto não substituem o destino.
- A confirmação de exclusão existente já é uma decisão destrutiva explícita;
  uma exclusão bem-sucedida não deve abrir um segundo aviso de dados não salvos.
- Não há questões materiais pendentes para abrir esta revisão.

# Amendments

- **Revisão 2 — 2026-08-01:** após reprovação da revisão 1 pelo finding `JS-01`,
  foi removida a estratégia de sentinela. Revisão humana autorizou restringir o
  diálogo customizado às navegações controladas e usar confirmação nativa para
  back/forward, reload e fechamento. O Contract passou a declarar a degradação
  para travessias same-document sem Navigation API.
