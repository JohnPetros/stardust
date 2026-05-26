---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

Sem pendencias.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Alinhar o contrato compartilhado de storage ao fluxo explicito de signed upload para apps clientes | - | - |
| F2 | Ajustar autorizacao HTTP de signed upload e remover o endpoint multipart legado no `server` | F1 | F3, F4 |
| F3 | Migrar o fluxo de screenshot do feedback no `web` para signed upload direto ao Supabase | F1 | F2, F4 |
| F4 | Padronizar o upload de imagens do `studio` para signed URL + provider client-side | F1 | F2, F3 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [x] **T1.1** — Remover `uploadFile(...)` da interface compartilhada `StorageService`
  - **Depende de:** -
  - **Resultado observavel:** `packages/core/src/storage/interfaces/StorageService.ts` passa a expor para apps clientes apenas `createSignedUploadUrl(...)` como operacao de upload publico, e qualquer consumidor remanescente de `uploadFile(...)` passa a falhar em compilacao ate ser migrado.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — repositorios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T2.1** — Adicionar `verifySignedUploadUrlAccess(...)` em `apps/server/src/app/hono/middlewares/StorageMiddleware.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** o middleware libera `POST /storage/signed-upload-url` para usuario autenticado comum apenas quando `folderPath` for `images/feedback-reports`, e continua exigindo verificacao de `god account` para qualquer outra pasta.
  - **Camada:** `rest`

- [x] **T2.2** — Atualizar `apps/server/src/app/hono/routers/storage/StorageRouter.ts`
  - **Depende de:** T2.1
  - **Resultado observavel:** a rota `POST /storage/signed-upload-url` passa a executar `verifyAuthentication`, validacao `signedUploadUrlSchema`, `verifySignedUploadUrlAccess` e handler nessa ordem, preservando o retorno `200` com `SignedUploadUrlDto`.
  - **Camada:** `rest`

- [x] **T2.3** — Remover o registro da rota `POST /storage/files/:folder` em `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`
  - **Depende de:** T3.7, T4.6
  - **Resultado observavel:** `FilesStorageRouter` deixa de registrar upload multipart publico, enquanto `GET /storage/files` e `DELETE /storage/files` permanecem expostos e inalterados.
  - **Camada:** `rest`

- [x] **T2.4** — Remover `UploadFileController` do barrel `apps/server/src/rest/controllers/storage/index.ts`
  - **Depende de:** T2.3
  - **Resultado observavel:** o barrel de controllers de storage deixa de exportar `UploadFileController`, sem afetar os demais controllers do modulo.
  - **Camada:** `rest`

- [x] **T2.5** — Remover `apps/server/src/rest/controllers/storage/UploadFileController.ts`
  - **Depende de:** T2.4
  - **Resultado observavel:** o adapter HTTP legado de upload multipart deixa de existir no `server`, sem remover `FileStorageProvider.upload(...)` nem os fluxos internos server-side que ainda dependem dele.
  - **Camada:** `rest`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T3.1** — Criar `apps/web/src/provision/storage/SupabaseSignedFileStorageProvider.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** o `web` passa a ter um provider client-side que recebe `SignedUploadUrl`, renomeia o `File` para o nome assinado e executa `PUT` direto no Supabase Storage com `x-upsert: false`.
  - **Camada:** `provision`

- [x] **T3.2** — Criar `apps/web/src/provision/storage/index.ts`
  - **Depende de:** T3.1
  - **Resultado observavel:** `SupabaseSignedFileStorageProvider` fica exportavel pelo barrel de provision do `web`.
  - **Camada:** `provision`

- [x] **T3.3** — Atualizar `apps/web/src/ui/global/contexts/RestContext/types/RestContextValue.ts`
  - **Depende de:** T3.2
  - **Resultado observavel:** o contrato do `RestContext` passa a incluir o provider client-side necessario para upload direto, junto dos services REST ja expostos.
  - **Camada:** `ui`

- [x] **T3.4** — Atualizar `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
  - **Depende de:** T3.2, T3.3
  - **Resultado observavel:** o `RestContext` do `web` passa a instanciar e disponibilizar `signedFileStorageProvider` sem acoplar o upload binario ao `StorageService`.
  - **Camada:** `ui`

- [x] **T3.5** — Atualizar `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/index.tsx`
  - **Depende de:** T3.4
  - **Resultado observavel:** `FeedbackDialog` passa a repassar `signedFileStorageProvider` para o hook junto com `storageService` e `reportingService`.
  - **Camada:** `ui`

- [x] **T3.6** — Migrar `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts` para signed upload explicito
  - **Depende de:** T3.5
  - **Resultado observavel:** quando houver screenshot em `data:` URL, o hook converte para `File`, solicita `createSignedUploadUrl(...)`, executa o PUT direto via provider e so envia `POST /reporting/feedback` em caso de sucesso; em falha, o texto do formulario permanece preservado e nenhum feedback e enviado com screenshot invalida.
  - **Camada:** `ui`

- [x] **T3.7** — Atualizar `apps/web/src/rest/services/StorageService.ts`
  - **Depende de:** T1.1, T3.6
  - **Resultado observavel:** o service REST do `web` deixa de implementar `uploadFile(...)` multipart e passa a expor apenas `createSignedUploadUrl(...)` para o fluxo de upload de screenshots.
  - **Camada:** `rest`

---

## F4 — Studio: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F3 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **T4.1** — Atualizar `apps/studio/src/rest/services/StorageService.ts`
  - **Depende de:** T1.1
  - **Resultado observavel:** o `StorageService` do `studio` deixa de receber `signedFileStorageProvider` e deixa de orquestrar upload binario, permanecendo responsavel apenas por chamadas REST como `createSignedUploadUrl(...)`, listagem e remocao.
  - **Camada:** `rest`

- [x] **T4.2** — Atualizar `apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
  - **Depende de:** T4.1
  - **Resultado observavel:** o composition root de `RestContext` do `studio` passa a instanciar `StorageService(restClient)` sem dependencia de provider client-side.
  - **Camada:** `ui`

- [x] **T4.3** — Atualizar `apps/studio/src/ui/global/contexts/RestContext/index.tsx`
  - **Depende de:** T4.2
  - **Resultado observavel:** `RestContextProvider` deixa de ler `signedFileStorageProvider` apenas para montar `storageService`, mantendo o provider disponivel exclusivamente pelo `ProvisionContext`.
  - **Camada:** `ui`

- [x] **T4.4** — Atualizar `apps/studio/src/app/middlewares/RestMiddleware.ts`
  - **Depende de:** T4.1
  - **Resultado observavel:** o contexto de rotas do `studio` passa a publicar `storageService` sem injetar `SupabaseSignedFileStorageProvider()` no service REST.
  - **Camada:** `studio`

- [x] **T4.5** — Atualizar `apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`
  - **Depende de:** T4.3
  - **Resultado observavel:** `ImageInput` passa a obter `signedFileStorageProvider` via `useProvisionContext()` e repassa essa dependencia ao hook sem alterar a API publica do widget.
  - **Camada:** `ui`

- [x] **T4.6** — Migrar `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts` para signed upload explicito
  - **Depende de:** T4.1, T4.5
  - **Resultado observavel:** o hook passa a solicitar `createSignedUploadUrl(...)`, montar `SignedUploadUrl`, executar upload direto via provider e chamar `onSubmit(signedUploadUrl.fileName.value)` apenas em sucesso; em falha, exibe erro e nao fecha o dialog.
  - **Camada:** `ui`
