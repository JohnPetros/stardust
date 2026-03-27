---
title: Job de Notificacao de Criacao de Usuario
prd: ../prd.md
apps: server
status: open
last_updated_at: 2026-03-10
---

# 1. Objetivo

Implementar um job assíncrono no `server` para enviar uma notificacao operacional quando o onboarding de criacao de usuario for closed com sucesso no modulo `profile`, reutilizando a infraestrutura atual de notificacoes via Inngest + Discord e preservando a cadeia existente de eventos (`auth` -> `space` -> `ranking` -> `shop` -> `profile`). A entrega inclui o disparo do evento canonico de criacao do usuario via `FinishUserCreationUseCase`, o consumo desse evento pela camada de notificacao e o alinhamento do schema Inngest usado por esse fluxo.
---


# 2. Escopo

## 2.1 In-scope

- Disparar `UserCreatedEvent` ao final do `CreateUserJob` por meio de `FinishUserCreationUseCase`, somente apos a conclusao bem-sucedida da criacao do perfil e da aplicacao do onboarding inicial.
- Criar um job de notificacao dedicado para consumo do evento `profile/user.created`.
- Registrar a nova function do Inngest na trilha de notificacoes do `server`.
- Estender o contrato `NotificationService` e a implementacao `DiscordNotificationService` para suportar a notificacao de criacao de usuario.
- Corrigir o schema de `UserCreatedEvent` em `apps/server/src/queue/inngest/inngest.ts` para refletir o payload real do evento usado pelo core.

## 2.2 Out-of-scope

- Alterar a UX de cadastro em `web` ou `studio`.
- Criar notificacao por email, push ou inbox interna.
- Refatorar toda a cadeia de eventos de onboarding.
- Corrigir divergencias de schema de outros eventos do onboarding que nao sejam necessarias para `profile/user.created`.
- Implementar recuperacao automatica de provisionamento parcial.

---

# 3. Requisitos

## 3.1 Funcionais

- O fluxo deve continuar aplicando o mesmo onboarding a todo novo cadastro, independentemente de a origem ser email/senha ou provedor social.
- A notificacao so deve ser disparada depois que o perfil interno do usuario estiver criado com tier inicial, estrela inicial liberada e itens padrao aplicados no fluxo atual.
- O job de notificacao deve consumir o evento `profile/user.created`, carregando `userId`, `userName`, `userEmail` e `userSlug`.
- A notificacao deve reutilizar o modulo `notification` existente no `server`, sem criar um canal paralelo fora do contrato `NotificationService`.
- O fluxo nao deve criar ou enviar notificacoes duplicadas para um mesmo processamento de evento.

## 3.2 Nao funcionais

- Idempotencia: a criacao do perfil continua protegida pelas validacoes de unicidade de nome e email ja existentes em `CreateUserUseCase`.
- Observabilidade: o envio da notificacao deve executar dentro de `amqp.run(...)`, seguindo o padrao atual dos jobs Inngest para rastreabilidade e retry.
- Compatibilidade retroativa: o cadastro via `SignUpController` e `SignUpWithSocialAccountController` nao deve mudar contrato HTTP; o onboarding deve consumir o payload canonico atual de `AccountSignedUpEvent` (`accountId`, `accountName`, `accountEmail`).
- Resiliencia: a composicao concreta do job deve permanecer em `apps/server/src/queue/inngest/functions/**`, mantendo o job agnostico de Inngest e do provider REST.

---

# 4. O que ja existe?

## Queue

* **`UnlockFirstStarJob`** (`apps/server/src/queue/jobs/space/UnlockFirstStarJob.ts`) - inicia o onboarding a partir de `AccountSignedUpEvent`.
* **`ReachFirstTierJob`** (`apps/server/src/queue/jobs/ranking/ReachFirstTierJob.ts`) - continua a cadeia de onboarding apos o desbloqueio da primeira estrela.
* **`AcquireDefaultShopItemsJob`** (`apps/server/src/queue/jobs/shop/AcquireDefaultShopItemsJob.ts`) - concede os itens padrao e publica o evento consumido por `profile`.
* **`CreateUserJob`** (`apps/server/src/queue/jobs/profile/CreateUserJob.ts`) - persiste o usuario no modulo `profile`, desbloqueia a estrela inicial e registra os itens adquiridos.
* **`NotificationFunctions`** (`apps/server/src/queue/inngest/functions/NotificationFunctions.ts`) - composition root das notificacoes baseadas em evento no Inngest.
* **`SendPlanetCompletedNotificationJob`** (`apps/server/src/queue/jobs/notification/SendPlanetCompletedNotificationJob.ts`) - referencia direta de job de notificacao com `NotificationService` + `amqp.run`.
* **`SendSpaceCompletedNotificationJob`** (`apps/server/src/queue/jobs/notification/SendSpaceCompletedNotificationJob.ts`) - referencia adicional de notificacao simples orientada a evento.
* **`SendFeedbackNotificationJob`** (`apps/server/src/queue/jobs/notification/SendFeedbackNotificationJob.ts`) - referencia de notificacao baseada em `EventPayload<typeof Event>`.
* **`SendChallengePostedNotificationJob`** (`apps/server/src/queue/jobs/notification/SendChallengePostedNotificationJob.ts`) - referencia mais recente de job de notificacao com payload composto.
* **`InngestBroker`** (`apps/server/src/queue/inngest/InngestBroker.ts`) - publica eventos do core no Inngest.
* **`InngestAmqp`** (`apps/server/src/queue/inngest/InngestAmqp.ts`) - adaptador do contrato `Amqp` usado pelos jobs.
* **`inngest`** (`apps/server/src/queue/inngest/inngest.ts`) - registra os schemas Zod dos eventos aceitos pelo runtime.

## REST

* **`DiscordNotificationService`** (`apps/server/src/rest/services/DiscordNotificationService.ts`) - implementa `NotificationService` e envia notificacoes para o webhook atual.
* **`SignUpController`** (`apps/server/src/rest/controllers/auth/SignUpController.ts`) - publica `AccountSignedUpEvent` para cadastros por email e senha.
* **`SignUpWithSocialAccountController`** (`apps/server/src/rest/controllers/auth/SignUpWithSocialAccountController.ts`) - publica `AccountSignedUpEvent` para cadastros sociais.

## Core

* **`AccountSignedUpEvent`** (`packages/core/src/auth/domain/events/AccountSignedUpEvent.ts`) - evento de entrada do onboarding contendo `accountId`, `accountName` e `accountEmail`.
* **`UserCreatedEvent`** (`packages/core/src/profile/domain/events/UserCreatedEvent.ts`) - evento existente e semanticamente aderente para representar a criacao do usuario no modulo `profile`.
* **`CreateUserUseCase`** (`packages/core/src/profile/use-cases/CreateUserUseCase.ts`) - valida unicidade e persiste o usuario base no repositorio.
* **`FinishUserCreationUseCase`** (`packages/core/src/profile/use-cases/FinishUserCreationUseCase.ts`) - publica `UserCreatedEvent` a partir dos dados finais do usuario criado.
* **`NotificationService`** (`packages/core/src/notification/interfaces/NotificationService.ts`) - contrato central das notificacoes operacionais do sistema.
* **`UsersRepository`** (`packages/core/src/profile/interfaces/UsersRepository.ts`) - contrato usado por `CreateUserJob` para persistir e complementar o perfil.

## Database

* **`SupabaseUsersRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`) - implementa `UsersRepository` e materializa a criacao do usuario e dos vinculos iniciais no banco.

## Validation

* **`idSchema`** (`packages/validation/src/modules/global/schemas/idSchema.ts`) - validacao base do `userId` no schema Inngest.
* **`nameSchema`** (`packages/validation/src/modules/global/schemas/nameSchema.ts`) - validacao base do `userName` no schema Inngest.
* **`emailSchema`** (`packages/validation/src/modules/global/schemas/emailSchema.ts`) - validacao base do `userEmail` no schema Inngest.

---

# 5. O que deve ser criado?

## Camada Queue (Jobs)

* **Localizacao:** `apps/server/src/queue/jobs/notification/SendUserCreatedNotificationJob.ts` (**novo arquivo**)
* **Dependencias:** `NotificationService`
* **Dados de request:** `userId: string`, `userName: string`, `userEmail: string`, `userSlug: string` via `EventPayload<typeof UserCreatedEvent>`
* **Dados de response:** `Promise<void>`; o job apenas valida o `RestResponse` recebido do provider e propaga falha quando necessario
* **Metodos:**
  * `handle(amqp: InngestAmqp<EventPayload<typeof UserCreatedEvent>>): Promise<void>` - extrai o payload do evento, executa o envio da notificacao dentro de `amqp.run(...)` e interrompe o fluxo em caso de `response.isFailure`.

---

# 6. O que deve ser modificado?

## Queue

* **Arquivo:** `apps/server/src/queue/jobs/profile/CreateUserJob.ts`
* **Mudanca:** Injetar `Broker` no construtor, instanciar `FinishUserCreationUseCase` e chamar `execute({ userId, userName, userEmail, userSlug })` apos a conclusao bem-sucedida de `CreateUserUseCase`, `UnlockStarUseCase`, `AcquireRocketUseCase` e `AcquireAvatarUseCase`.
* **Justificativa:** O job e o unico ponto que tem visibilidade do onboarding completo no modulo `profile`; usar o use case existente preserva a orquestracao via core e evita publicar o evento diretamente na camada de queue.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/ProfileFunctions.ts`
* **Mudanca:** Instanciar `InngestBroker` e repassar a dependencia para `CreateUserJob`.
* **Justificativa:** A composicao concreta do broker deve permanecer na borda do runtime Inngest, seguindo a regra da camada queue.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/functions/NotificationFunctions.ts`
* **Mudanca:** Adicionar uma nova function para `UserCreatedEvent`, instanciando `DiscordNotificationService`, `InngestAmqp` e `SendUserCreatedNotificationJob`; incluir a function em `getFunctions()`.
* **Justificativa:** Esse arquivo centraliza o wiring dos jobs de notificacao por evento e ja contem os precedentes diretos da feature.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/jobs/notification/index.ts`
* **Mudanca:** Exportar `SendUserCreatedNotificationJob` no barrel da pasta.
* **Justificativa:** Mantem o padrao de organizacao atual da camada de notificacao.
* **Camada:** `queue`

* **Arquivo:** `apps/server/src/queue/inngest/inngest.ts`
* **Mudanca:** Corrigir o schema registrado para `UserCreatedEvent._NAME` para `z.object({ userId: idSchema, userName: nameSchema, userEmail: emailSchema, userSlug: stringSchema })`.
* **Justificativa:** O schema atual diverge do payload real definido no core e bloquearia o consumo correto do evento pelo Inngest.
* **Camada:** `queue`

## REST

* **Arquivo:** `apps/server/src/rest/services/DiscordNotificationService.ts`
* **Mudanca:** Adicionar um metodo especifico para notificacao de criacao de usuario, usando o payload tipado de `UserCreatedEvent` e o formato de embed com `title` `Perfil inicial criado`, `description` `Um novo usuario concluiu o onboarding inicial da plataforma.` e campos `Usuário` e `Perfil`.
* **Justificativa:** A implementacao concreta do canal atual de notificacao vive nesse service; a feature deve reutilizar o provider existente.
* **Camada:** `rest`

## Core

* **Arquivo:** `packages/core/src/notification/interfaces/NotificationService.ts`
* **Mudanca:** Declarar `sendUserCreatedNotification(payload: EventPayload<typeof UserCreatedEvent>): Promise<RestResponse>`.
* **Justificativa:** O novo job deve continuar dependendo apenas do contrato do core, sem acoplamento ao provider Discord.
* **Camada:** `core`

---

# 7. O que deve ser removido?

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs

* **Decisao**: reutilizar `UserCreatedEvent` em vez de acionar `UserCreationFinishedEvent` ou introduzir um evento novo.
* **Alternativas consideradas**: usar `UserCreationFinishedEvent`; criar `UserOnboardingCompletedEvent`.
* **Motivo da escolha**: `UserCreatedEvent` ja existe no core, tem payload suficiente para notificacao e comunica melhor o fato de negocio que interessa ao modulo `notification`.
* **Impactos / trade-offs**: reduz criacao de contratos novos, mas exige corrigir o schema Inngest hoje divergente para esse evento.

* **Decisao**: disparar `UserCreatedEvent` no final de `CreateUserJob` por meio de `FinishUserCreationUseCase`, e nao publicar o evento diretamente no job ou dentro de `CreateUserUseCase`.
* **Alternativas consideradas**: publicar o evento diretamente em `CreateUserJob`; publicar o evento imediatamente apos `UsersRepository.add(...)` em `CreateUserUseCase`.
* **Motivo da escolha**: o PRD considera sucesso quando o usuario recebe o estado inicial completo; o job conhece o encerramento do onboarding inteiro, e o uso do `FinishUserCreationUseCase` reaproveita um contrato de orquestracao ja existente no core.
* **Impactos / trade-offs**: preserva `CreateUserUseCase` enxuto e reduz logica de evento na camada de queue, mas exige fornecer ao use case todos os dados finais, incluindo `userSlug`.

* **Decisao**: reutilizar `NotificationService` + `DiscordNotificationService` como canal da feature.
* **Alternativas consideradas**: criar provider dedicado; usar `packages/email`.
* **Motivo da escolha**: o modulo `notification` do server ja padroniza notificacoes operacionais por webhook e possui referencias diretas para jobs assíncronos equivalentes.
* **Impactos / trade-offs**: entrega fica consistente com o restante do modulo, mas a notificacao continua dependente do formato e disponibilidade do webhook Discord.

* **Decisao**: limitar o ajuste de schemas Inngest ao evento `profile/user.created` nesta spec.
* **Alternativas consideradas**: corrigir todas as divergencias entre eventos do core e schemas registrados no mesmo PR.
* **Motivo da escolha**: a feature depende diretamente apenas de `UserCreatedEvent`; expandir o escopo aumentaria risco e tamanho da entrega sem necessidade imediata.
* **Impactos / trade-offs**: mantem a spec implementavel e focada, mas deixa outras inconsistencias mapeadas para saneamento futuro.

---

# 9. Diagramas e Referencias

* **Fluxo de Dados:**

```text
SignUpController | SignUpWithSocialAccountController
        |
        v
  AccountSignedUpEvent
        |
        v
 UnlockFirstStarJob
        |
        v
 FirstStarUnlockedEvent
        |
        v
 ReachFirstTierJob
        |
        v
 FirstTierReachedEvent
        |
        v
 AcquireDefaultShopItemsJob
        |
        v
 ShopItemsAcquiredByDefaultEvent
        |
        v
 CreateUserJob
   |    |    |    \
   |    |    |     +--> AcquireAvatarUseCase
   |    |    +--------> AcquireRocketUseCase
   |    +-------------> UnlockStarUseCase
   +------------------> CreateUserUseCase
        |
        v
 FinishUserCreationUseCase
        |
        v
   UserCreatedEvent
        |
        v
 SendUserCreatedNotificationJob
        |
        v
 NotificationService.sendUserCreatedNotification(...)
        |
        v
 Discord webhook
```

* **Fluxo Cross-app:** Nao aplicavel.
* **Layout:** Nao aplicavel.
* **Referencias:**
  * `apps/server/src/queue/jobs/notification/SendChallengePostedNotificationJob.ts`
  * `apps/server/src/queue/jobs/notification/SendPlanetCompletedNotificationJob.ts`
  * `apps/server/src/queue/inngest/functions/NotificationFunctions.ts`
  * `apps/server/src/queue/jobs/profile/CreateUserJob.ts`
  * `packages/core/src/profile/domain/events/UserCreatedEvent.ts`
  * `packages/core/src/notification/interfaces/NotificationService.ts`
  * `apps/server/src/rest/services/DiscordNotificationService.ts`

---

