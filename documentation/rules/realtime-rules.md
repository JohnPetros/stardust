# Regras da Camada Realtime

## Visão Geral

A camada **Realtime** encapsula assinaturas de eventos em tempo real da aplicação web, traduzindo eventos externos para contratos estáveis do `@stardust/core`.

**Responsabilidades centrais:**

- Permitir que a UI reaja a eventos assíncronos de onboarding e sincronização sem acoplar `widgets` diretamente ao SDK do provedor realtime.
- Centralizar a criação de canais, adaptadores e clientes realtime da aplicação web.

**Fora do escopo desta camada:**

- Regras de negócio, navegação, estado de `widget` ou acesso direto a `controllers`, banco de dados do servidor e jobs.

> O limite atual da camada é o app `web`, com integração concreta em `apps/web/src/realtime/supabase/` e exposição para a UI via `apps/web/src/ui/global/contexts/RealtimeContext/`.

---

## Estrutura de Diretórios

| Caminho | Responsabilidade |
| :--- | :--- |
| `apps/web/src/realtime/supabase/client.ts` | Cria o `client` browser do Supabase Realtime a partir de `CLIENT_ENV`. |
| `apps/web/src/realtime/supabase/channels/` | Concentra adaptadores de canais realtime por domínio (ex: `SupabaseProfileChannel.ts`). |
| `apps/web/src/realtime/supabase/types/` | Concentra tipos de payload externo usados para traduzir eventos do provedor (ex: `SupabaseUser.ts`). |
| `apps/web/src/ui/global/contexts/RealtimeContext/` | `Composition root` cliente que injeta canais realtime na árvore React. |
| `apps/web/src/ui/global/hooks/useRealtimeContext.ts` | Expõe o acesso ao contexto, sem recriar clientes ou canais. |
| `apps/web/src/ui/global/hooks/useProfileSocket.ts` | `Hook` fino de consumo para assinatura de eventos de perfil. |
| `apps/web/src/ui/global/widgets/layouts/Root/ClientProviders/index.tsx` | Registra o `RealtimeContextProvider` na borda cliente global. |
| `packages/core/src/profile/interfaces/ProfileChannel.ts` | Contrato estável consumido pela UI. A camada realtime **não deve** redefinir esse contrato dentro de `apps/web`. |

---

## Princípios Fundamentais

### Deve conter

- Adaptadores realtime devem **implementar contratos do core** (ex: `ProfileChannel`), em vez de expor diretamente APIs do provedor.
- A **tradução de payload externo** deve acontecer dentro do adaptador, convertendo dados do provedor em eventos do domínio (ex: `UserCreatedEvent`).
- A criação do `client` e a injeção dos canais devem acontecer na **borda cliente**, hoje em `RealtimeContextProvider` e `useRealtimeContextProvider`.
- `Hooks` de consumo devem depender de interfaces estáveis da camada (ex: `profileChannel.onCreateUser(...)`), e não do SDK do Supabase.
- Cada assinatura deve retornar **cleanup explícito** para permitir `unsubscribe` correto em `useEffect`.

### Não deve conter

- Regra de negócio de onboarding, `retry`, redirecionamento ou decisão de fluxo — isso pertence à UI e ao core.
- Imports de `apps/server/**`, repositórios, jobs, `controllers` REST ou `actions` RPC.
- Vazamento de `SupabaseClient`, `channel(...)`, `postgres_changes` ou payloads brutos para `widgets` e `hooks` de domínio.
- Mistura de tratamento visual, estado de componente ou feedback de UX com adaptadores realtime.
- Contratos paralelos aos do core quando já existir interface canônica em `packages/core/**`.

---

## Padrões de Projeto

### Adapter por Domínio

Cada integração realtime deve ser implementada como `factory function` com nome em `PascalCase`, recebendo dependências por parâmetro e retornando uma interface do core.

```typescript
// Exemplo atual
function SupabaseProfileChannel(supabase: SupabaseClient): ProfileChannel {
  // ...
}
```

### Payload Translation

O adaptador deve mapear o payload externo para um evento canônico do domínio antes de notificar `listeners`.

```typescript
// Exemplo atual: SupabaseUser -> UserCreatedEvent
// apps/web/src/realtime/supabase/channels/SupabaseProfileChannel.ts
```

### Composition Root via Context

A injeção de canais deve acontecer em `apps/web/src/ui/global/contexts/RealtimeContext/useRealtimeContextProvider.ts`, deixando a UI dependente apenas do contexto.

### Consumer Hook Fino

`Hooks` como `apps/web/src/ui/global/hooks/useProfileSocket.ts` devem apenas assinar e limpar `listeners`. Qualquer filtro por conta, tela ou fluxo deve ficar no `hook`/página consumidora.

### Tipos Externos Isolados

Tipos do provedor devem ficar em `apps/web/src/realtime/supabase/types/` e devem ser evitados fora da camada.

> **Nota:** Evite um adaptador genérico demais quando existir apenas um contrato de domínio claro. Enquanto a necessidade for localizada, prefira canais por domínio em vez de uma camada abstrata sem uso real.

---

## Padrões de Uso Aplicados

### Fluxo correto

1. `ClientProviders` registra `RealtimeContextProvider`.
2. O contexto injeta `profileChannel`.
3. `Hooks`/páginas cliente assinam `onCreateUser` para reagir a `UserCreatedEvent`.

### Exemplos de uso correto

- **Páginas de confirmação:** a UI pode filtrar o evento por `account.email.value` e disparar `onRefetchUser()` ou atualizar estado local.
  - `apps/web/src/ui/auth/widgets/pages/AccountConfirmation/useAccountConfirmationPage.ts`
  - `apps/web/src/ui/auth/widgets/pages/SocialAccountConfirmation/useSocialAccountConfirmationPage.ts`
- **Hooks compartilhados:** `apps/web/src/ui/global/hooks/useProfileSocket.ts` demonstra o padrão mínimo esperado de assinatura dentro de `useEffect` com retorno do `cleanup`.

### Erros comuns

| Erro | Correção |
| :--- | :--- |
| Consumir `SupabaseClient()` diretamente em `widgets` ou `hooks` de página. | O acesso deve vir do contexto realtime. |
| Passar payload bruto do Supabase para a UI (`{ new: ... }`). | A UI deve receber `UserCreatedEvent` ou outro evento do core. |
| Duplicar filtros de assinatura, reuso de `client` e conversão de evento em múltiplos componentes. | Esses comportamentos devem ficar concentrados no adaptador ou no `hook` consumidor adequado. |

---

## Regras de Integração com Outras Camadas

| Camada | Regra |
| :--- | :--- |
| **Core** | A camada realtime pode importar eventos, entidades auxiliares e interfaces de `@stardust/core` (ex: `ProfileChannel`, `UserCreatedEvent`, `Name`). O core **não deve** importar nada de `apps/web/src/realtime/**`. |
| **UI** | A UI deve consumir realtime via `RealtimeContext` ou `hooks` dedicados. `Widgets` e `hooks` de página não devem conhecer detalhes do Supabase. |
| **REST/RPC/Queue** | Realtime pode reagir a efeitos produzidos por essas camadas, mas não deve chamá-las diretamente para abrir conexões, persistir dados ou publicar eventos. |
| **Infraestrutura externa** | O SDK do Supabase deve ficar encapsulado em `apps/web/src/realtime/supabase/**`; a escolha do provedor não deve alterar contratos públicos da UI. |

**Direção de dependência:**

```
UI → Realtime adapter/context → SDK externo
              ↑
         @stardust/core (contratos de domínio)
```

> Novos canais devem ser expostos por interfaces nomeadas por domínio e injetados no contexto. Não deve existir `import` cruzado da UI para arquivos internos de `realtime/supabase/channels/**`.

---

## Checklist para Novas Features na Camada

- [ ] O novo canal implementa uma interface existente do core **ou** introduz um contrato novo no core antes da implementação web.
- [ ] O adaptador foi criado em `apps/web/src/realtime/...` como `factory function` e recebe o `client` por injeção.
- [ ] O payload externo foi mapeado para evento/objeto canônico antes de chegar à UI.
- [ ] A assinatura retorna `cleanup` de `unsubscribe` e o consumo em React acontece dentro de `useEffect`.
- [ ] O acesso ao canal passa por `RealtimeContextProvider` ou por outro `composition root` explícito, sem instanciação local em `widget`.
- [ ] Nenhum arquivo da camada importa `apps/server/**`, repositórios, jobs ou regras de negócio do fluxo.
- [ ] Os nomes de arquivos, `factories` e tipos seguem as convenções globais em `documentation/rules/code-conventions-rules.md`.
