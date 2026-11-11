# Regras da Camada Realtime

## Visão Geral

A camada **Realtime** encapsula assinaturas de eventos em tempo real da aplicação web, traduzindo eventos externos para contratos estáveis do `@stardust/core`.

**Responsabilidades centrais:**

- Permitir que a UI reaja a eventos assíncronos de onboarding e sincronização sem acoplar `widgets` diretamente ao SDK do provedor realtime.
- Centralizar a criação de canais, adaptadores e clientes realtime da aplicação web.

**Fora do escopo desta camada:**

- Regras de negócio, navegação, estado de `widget` ou acesso direto a `controllers`, banco de dados do servidor e jobs.

> O limite atual da camada é o app `web`, com integração concreta em `apps/web/src/realtime/polling/` e exposição para a UI via `apps/web/src/ui/global/contexts/RealtimeContext/`. Hoje o transporte é **polling REST**; a camada não mantém conexão longa, WebSocket nem stream.

---

## Estrutura de Diretórios

| Caminho | Responsabilidade |
| :--- | :--- |
| `apps/web/src/realtime/polling/channels/` | Adaptadores de canais por domínio que consultam uma função injetada (ex: `PollingProfileChannel.ts`). |
| `apps/web/src/realtime/polling/types/` | Tipos do resultado de cada consulta (ex: `ProfileCreationPoll.ts`). |
| `apps/web/src/ui/global/contexts/RealtimeContext/` | `Composition root` cliente que injeta canais realtime na árvore React. |
| `apps/web/src/ui/global/contexts/RealtimeContext/useProfileCreationPolling.ts` | Compõe o canal de polling: decide o transporte da credencial e traduz respostas REST em `ProfileCreationPoll`. |
| `apps/web/src/ui/global/hooks/useRealtimeContext.ts` | Expõe o acesso ao contexto, sem recriar canais. |
| `apps/web/src/ui/global/hooks/useProfileSocket.ts` | `Hook` fino de consumo para assinatura de eventos de perfil, com `enabled` opcional. |
| `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/` | Registra o `RealtimeContextProvider` na borda cliente global, dentro de `AuthContextProvider` e `RestContextProvider`. |
| `packages/core/src/profile/interfaces/ProfileChannel.ts` | Contrato estável consumido pela UI. A camada realtime **não deve** redefinir esse contrato dentro de `apps/web`. |

---

## Princípios Fundamentais

### Deve conter

- Adaptadores realtime devem **implementar contratos do core** (ex: `ProfileChannel`), em vez de expor diretamente APIs do transporte.
- O adaptador recebe por parâmetro a função de consulta e os tempos de polling; ele **não conhece REST, sessão nem UI**.
- A **tradução em dois níveis** é explícita: o composition root (`useProfileCreationPolling`) traduz respostas REST em `ProfileCreationPoll`; o adaptador traduz `ProfileCreationPoll` em evento do domínio (ex: `UserCreatedEvent`).
- A composição do canal e a injeção na árvore acontecem na **borda cliente**, em `RealtimeContextProvider`, `useRealtimeContextProvider` e `useProfileCreationPolling`.
- `Hooks` de consumo dependem de interfaces estáveis da camada (ex: `profileChannel.onCreateUser(...)`).
- Cada assinatura retorna **cleanup explícito e idempotente** para uso correto em `useEffect`.
- Cada assinatura tem estado próprio, no máximo uma consulta em voo, timeout e entrega única.

### Não deve conter

- Regra de negócio de onboarding, `retry`, redirecionamento ou decisão de fluxo — isso pertence à UI e ao core.
- Imports de `apps/server/**`, repositórios, jobs, `controllers` REST ou `actions` RPC, nem de `apps/web/src/rest/**` ou `apps/web/src/ui/**` dentro de `apps/web/src/realtime/**`.
- Vazamento de respostas HTTP ou do tipo `ProfileCreationPoll` para `widgets` e `hooks` de domínio.
- Mistura de tratamento visual, estado de componente ou feedback de UX com adaptadores realtime.
- Contratos paralelos aos do core quando já existir interface canônica em `packages/core/**`.
- Testes em `apps/web/src/realtime/**`: o local não é permitido pelo `check:test-integrity`.

---

## Padrões de Projeto

### Adapter por Domínio

Cada integração realtime deve ser implementada como `factory function` com nome em `PascalCase`, recebendo dependências por parâmetro e retornando uma interface do core.

```typescript
// Exemplo atual
function PollingProfileChannel(params: {
  pollProfileCreation: () => Promise<ProfileCreationPoll>
  intervalInMs: number
  maxBackoffInMs: number
  timeoutInMs: number
}): ProfileChannel {
  // ...
}
```

### Payload Translation

O composition root mapeia respostas REST para `ProfileCreationPoll` (`pending`, `created`, `stopped`, `failed`). O adaptador mapeia `created` para um evento canônico do domínio antes de notificar `listeners`.

```typescript
// apps/web/src/ui/global/contexts/RealtimeContext/useProfileCreationPolling.ts
// REST (fetchUserById / fetchOnboardingAttempt) -> ProfileCreationPoll
// apps/web/src/realtime/polling/channels/PollingProfileChannel.ts
// ProfileCreationPoll { status: 'created' } -> UserCreatedEvent
```

### Composition Root via Context

A composição do canal acontece em `apps/web/src/ui/global/contexts/RealtimeContext/`. O Entry Point (`index.tsx`) resolve `profileService`, `account` e `accessToken` pelos contexts de Rest e Auth e os passa por parâmetro a `useRealtimeContextProvider`. Um canal injetado por prop (ambiente `testing`) tem precedência sobre o canal de polling.

### Consumer Hook Fino

`Hooks` como `apps/web/src/ui/global/hooks/useProfileSocket.ts` apenas assinam e limpam `listeners`. O hook aceita `{ enabled }`, guarda o listener mais recente em `useRef` e só refaz a assinatura quando `enabled` ou `profileChannel` mudam, para que re-renders não reiniciem o polling. Qualquer filtro por conta, tela ou fluxo fica no `hook`/página consumidora.

### Cobertura de testes

Hooks globais não recebem testes dedicados. O comportamento do canal é coberto por `RealtimeContext/tests/useProfileCreationPolling.test.ts` (executa o adaptador real com timers falsos) e pelas jornadas Playwright da Web com `ProfileChannelMock`.

> **Nota:** Evite um adaptador genérico demais quando existir apenas um contrato de domínio claro. Enquanto a necessidade for localizada, prefira canais por domínio em vez de uma camada abstrata sem uso real.

---

## Padrões de Uso Aplicados

### Fluxo correto

1. `ClientProviders` registra `AuthContextProvider > RestContextProvider > RealtimeContextProvider`.
2. O contexto injeta `profileChannel` (polling, ou o mock em `testing`).
3. `Hooks`/páginas cliente assinam `onCreateUser` para reagir a `UserCreatedEvent`.

### Exemplos de uso correto

- **Páginas de confirmação:** a UI pode filtrar o evento por `account.email.value` e disparar `onRefetchUser()` ou atualizar estado local.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
- **Cadastro:** `SignUpPage` só assina depois do envio bem-sucedido: `useProfileSocket(handleUserCreated, { enabled: userEmail !== null })`.

### Erros comuns

| Erro | Correção |
| :--- | :--- |
| Chamar `ProfileService` ou `fetch` dentro de `apps/web/src/realtime/**`. | A consulta é injetada pelo composition root. |
| Passar o corpo HTTP ou `ProfileCreationPoll` para a UI. | A UI deve receber `UserCreatedEvent` ou outro evento do core. |
| Assinar com um listener novo a cada render sem a ref. | Use `useProfileSocket`, que mantém a assinatura estável. |
| Duplicar filtros de assinatura e conversão de evento em múltiplos componentes. | Concentre-os no adaptador ou no `hook` consumidor adequado. |

---

## Regras de Integração com Outras Camadas

| Camada | Regra |
| :--- | :--- |
| **Core** | A camada realtime pode importar eventos, entidades auxiliares e interfaces de `@stardust/core` (ex: `ProfileChannel`, `UserCreatedEvent`). O core **não deve** importar nada de `apps/web/src/realtime/**`. |
| **UI** | A UI consome realtime via `RealtimeContext` ou `hooks` dedicados. O composition root (`useProfileCreationPolling`), na UI, é quem conhece REST e sessão. |
| **REST/RPC/Queue** | O adaptador realtime não chama essas camadas; a função de consulta injetada, criada na UI, usa os services de `RestContext`. |
| **Infraestrutura externa** | O transporte é isolado no adaptador; a escolha do transporte não deve alterar contratos públicos da UI. |

**Direção de dependência:**

```
UI (composition root) → ProfileService (port) → adapter REST
UI → Realtime adapter (recebe a função de consulta)
              ↑
         @stardust/core (contratos de domínio)
```

> Novos canais devem ser expostos por interfaces nomeadas por domínio e injetados no contexto. Não deve existir `import` cruzado da UI para arquivos internos de `realtime/polling/channels/**` fora do composition root.

---

## Checklist para Novas Features na Camada

- [ ] O novo canal implementa uma interface existente do core **ou** introduz um contrato novo no core antes da implementação web.
- [ ] O adaptador foi criado em `apps/web/src/realtime/...` como `factory function` e recebe a função de consulta por injeção.
- [ ] A resposta externa foi mapeada para evento/objeto canônico antes de chegar à UI.
- [ ] A assinatura retorna `cleanup` idempotente e o consumo em React acontece dentro de `useEffect`.
- [ ] O acesso ao canal passa por `RealtimeContextProvider` ou por outro `composition root` explícito, sem instanciação local em `widget`.
- [ ] Nenhum arquivo da camada importa `apps/server/**`, REST, UI, repositórios, jobs ou regras de negócio do fluxo.
- [ ] Os testes ficam em locais permitidos (`ui/**/contexts/**/tests`), nunca em `realtime/**` nem em hooks globais.
- [ ] Os nomes de arquivos, `factories` e tipos seguem as convenções globais em `documentation/rules/code-conventions-rules.md`.
