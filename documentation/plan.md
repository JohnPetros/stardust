---
description: Criar um plano de implementacao estruturado em fases e tarefas a partir de uma spec tecnica.
---

## Pendencias (quando aplicavel)

- [x] Rota de emissao da signed URL montada em `StorageRouter` como `POST /storage/signed-upload-url`, preservando `FilesStorageRouter` sob `/storage/files`.

---

## Tabela de Dependencias de Fases

| Fase | Objetivo | Depende de | Pode rodar em paralelo com |
| --- | --- | --- | --- |
| F1 | Definir os contratos, structures, erros e use case do fluxo de signed upload no modulo `storage` | - | - |
| F2 | Expor a emissao de signed upload URL no `server`, ajustar providers e endurecer autenticacao das rotas de storage | F1 | F3, F4 |
| F3 | Adaptar o `web` ao novo contrato compartilhado sem remover o upload legado de screenshot | F1 | F2, F4 |
| F4 | Migrar a `studio` para upload direto ao Supabase via signed URL, preservando os widgets e formularios atuais | F1 | F2, F3 |

> **Estrategia de paralelismo:** sempre comece pelo core (dominio, structures e use cases). Assim que o core estiver concluido, as fases de `server`, `web` e `studio` podem ser executadas em paralelo, pois todas dependem apenas do contrato definido no core.

---

## F1 — Core: Dominio, Structures e Use Cases

**Objetivo:** Definir o contrato do dominio — entidades, structures, interfaces de repositorio/provider e use cases — sem nenhuma dependencia de infraestrutura. Essa fase desbloqueia F2, F3 e F4 para rodarem em paralelo.

### Tarefas

- [x] **F1-T1** — Ajustar `packages/core/src/storage/interfaces/FileStorageProvider.ts`
  - **Depende de:** -
  - **Resultado observavel:** o contrato passa a refletir o uso server-side real de storage com `upload(folder, file)` e expor tambem a emissao de signed upload URL sem quebrar controllers, jobs e providers existentes.
  - **Camada:** `core`

- [x] **F1-T2** — Criar `packages/core/src/storage/interfaces/SignedFileStorageProvider.ts` e exporta-lo pelo barrel de interfaces
  - **Depende de:** F1-T1
  - **Resultado observavel:** existe um contrato de core especifico para upload direto com `uploadFile(signedUploadUrl: SignedUploadUrl): Promise<void>`, separado do provider server-side.
  - **Camada:** `core`

- [x] **F1-T3** — Ampliar `packages/core/src/storage/interfaces/StorageService.ts` e `packages/core/src/storage/interfaces/index.ts`
  - **Depende de:** F1-T2
  - **Resultado observavel:** o contrato compartilhado de REST expoe `createSignedUploadUrl(folderPath, fileName)` e preserva `uploadFile(folder, file)` como fachada de compatibilidade para `web` e `studio`.
  - **Camada:** `core`

- [x] **F1-T4** — Endurecer `packages/core/src/storage/domain/structures/SignedUploadUrl.ts` e exportar `SignedUploadUrl`/`SignedUploadUrlDto` pelos barrels publicos
  - **Depende de:** F1-T1
  - **Resultado observavel:** `SignedUploadUrl.create(dto)` rejeita combinacoes invalidas de `folderPath` e extensao de `fileName`, e os tipos ficam importaveis pelos paths publicos do modulo `storage`.
  - **Camada:** `core`

- [x] **F1-T5** — Criar o erro de conflito de nome de arquivo no modulo `storage` e exporta-lo
  - **Depende de:** -
  - **Resultado observavel:** existe um erro de dominio explicito para representar conflito quando o `fileName` ja existe no `folderPath` solicitado.
  - **Camada:** `core`

- [x] **F1-T6** — Criar `packages/core/src/storage/use-cases/CreateSignedUploadUrl.ts` e exporta-lo em `packages/core/src/storage/use-cases/index.ts`
  - **Depende de:** F1-T1, F1-T4, F1-T5
  - **Resultado observavel:** `CreateSignedUploadUrl.execute({ folderPath, fileName })` valida os objetos de dominio, consulta existencia pelo provider e retorna `SignedUploadUrlDto` somente quando nao ha conflito de nome.
  - **Camada:** `core`

---

## F2 — Server: Infra, Repositorios e Handlers

> ⚡ Pode rodar em paralelo com F3 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a camada de infraestrutura e exposicao — repositorios, providers, jobs e handlers RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **F2-T1** — Criar `packages/validation/src/modules/storage/signedUploadUrlSchema.ts` e exporta-lo em `packages/validation/src/modules/storage/index.ts`
  - **Depende de:** F1-T3, F1-T4
  - **Resultado observavel:** a borda REST consegue rejeitar requests com `folderPath` fora da allowlist, `fileName` vazio ou com `/`, `\\`, `.`, `..` antes de executar controller/use case.
  - **Camada:** `rest`

- [x] **F2-T2** — Implementar `createSignedUploadUrl(...)` em `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`
  - **Depende de:** F1-T6
  - **Resultado observavel:** o provider do `server` emite um contrato assinado para `stardust-bucket` com path final `<folderPath>/<fileName>` e `upsert: false`, sem alterar o fluxo legado de `upload(folder, file)`.
  - **Camada:** `provision`

- [x] **F2-T3** — Adequar `apps/server/src/provision/storage/GoogleDriveStorageProvider.ts` ao novo contrato do core
  - **Depende de:** F1-T1
  - **Resultado observavel:** o provider compila contra a interface atualizada e falha explicitamente com `MethodNotImplementedError` para signed upload URL, sem alterar o fluxo de backup que ele ja suporta.
  - **Camada:** `provision`

- [x] **F2-T4** — Adequar `apps/server/src/provision/storage/DropboxStorageProvider.ts` ao novo contrato do core
  - **Depende de:** F1-T1
  - **Resultado observavel:** o provider compila contra a interface atualizada e falha explicitamente com `MethodNotImplementedError` para signed upload URL, preservando o upload server-side usado em backup.
  - **Camada:** `provision`

- [x] **F2-T5** — Criar `apps/server/src/rest/controllers/storage/CreateSignedUploadUrlController.ts` e exporta-lo no barrel de controllers
  - **Depende de:** F1-T6
  - **Resultado observavel:** o controller le `folderPath` e `fileName` do body, delega para `CreateSignedUploadUrl` e retorna `200` com `SignedUploadUrlDto` sem conter regra de storage na borda.
  - **Camada:** `rest`

- [x] **F2-T6** — Atualizar `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts` e `apps/server/src/app/hono/routers/storage/StorageRouter.ts`
  - **Depende de:** F2-T1, F2-T2, F2-T5
  - **Resultado observavel:** a rota de emissao de signed upload URL fica exposta no path acordado com `verifyAuthentication`, `verifyGodAccount` e validacao de JSON, e `GET /storage/files` + `DELETE /storage/files/:folder/:fileName` passam a exigir o mesmo par de middlewares.
  - **Camada:** `rest`

---

## F3 — Web: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F4 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao web — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **F3-T1** — Atualizar `apps/web/src/rest/services/StorageService.ts`
  - **Depende de:** F1-T3
  - **Resultado observavel:** o adapter REST do `web` implementa `createSignedUploadUrl(folderPath, fileName)` e `uploadFile(folder, file)` passa a enviar screenshots por signed upload sem depender do endpoint legado.
  - **Camada:** `rest`

---

## F4 — Studio: UI e Integracao

> ⚡ Pode rodar em paralelo com F2 e F3 apos F1 estar concluida.

**Objetivo:** Implementar a interface e integracao client-side na aplicacao studio — widgets, actions e chamadas RPC/REST — consumindo os contratos definidos no core.

### Tarefas

- [x] **F4-T1** — Criar uma implementacao de `SignedFileStorageProvider` na `studio`
  - **Depende de:** F1-T2, F1-T4
  - **Resultado observavel:** a `studio` possui um adapter client-side que recebe `SignedUploadUrl` e executa o upload direto ao Supabase sem trafegar binario pelo `server`.
  - **Camada:** `provision`

- [x] **F4-T2** — Criar `apps/studio/src/ui/global/contexts/ProvisionContext` e encaixa-lo em `apps/studio/src/app/root.tsx`
  - **Depende de:** F4-T1
  - **Resultado observavel:** a UI da `studio` passa a resolver `signedFileStorageProvider` por um contexto proprio de provision, separado do `RestContext`.
  - **Camada:** `ui`

- [x] **F4-T3** — Atualizar `apps/studio/src/rest/services/StorageService.ts`
  - **Depende de:** F1-T3, F4-T1
  - **Resultado observavel:** `uploadFile(folder, file)` passa a solicitar `POST /storage/signed-upload-url`, montar `SignedUploadUrl` a partir da resposta e delegar o upload direto via `SignedFileStorageProvider`, retornando `RestResponse<{ filename: string }>` com o nome final validado pelo `server`.
  - **Camada:** `rest`

- [x] **F4-T4** — Atualizar os composition roots de storage da `studio` em `apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts` e `apps/studio/src/app/middlewares/RestMiddleware.ts`
  - **Depende de:** F4-T2, F4-T3
  - **Resultado observavel:** tanto a arvore de UI quanto o contexto de rotas da `studio` instanciam `StorageService` com o novo grafo de dependencias, sem recriar providers dentro do service.
  - **Camada:** `studio`

- [x] **F4-T5** — Atualizar `apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`
  - **Depende de:** F4-T4
  - **Resultado observavel:** o entry point do widget continua preservando a API publica de `ImageInput`, mas passa a resolver as dependencias pelo contexto correto apos a migracao para signed upload.
  - **Camada:** `ui`

- [x] **F4-T6** — Atualizar `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`
  - **Depende de:** F4-T3, F4-T5
  - **Resultado observavel:** o hook envia o `fileName` editado pelo usuario para o service, chama `onSubmit(response.body.filename)` no sucesso e trata separadamente erro de emissao da signed URL e erro de upload direto sem perder o estado de loading/toast atual.
  - **Camada:** `ui`

- [x] **F4-T7** — Atualizar `apps/studio/src/ui/global/widgets/components/ImageInput/ImageInputView.tsx`
  - **Depende de:** F4-T6
  - **Resultado observavel:** o dialog continua exibindo preview e input editavel de nome, mas deixa explicito que o campo define o `fileName` validado pelo backend e bloqueia arquivos acima de `5 MB`.
  - **Camada:** `ui`

- [x] **F4-T8** — Ajustar `apps/studio/src/ui/lesson/widgets/components/PictureInput/usePictureInput.ts` para preservar o refetch do seletor apos upload/remocao
  - **Depende de:** F4-T6
  - **Resultado observavel:** o fluxo de `story` continua listando imagens com paginacao, refetchando apos upload/remocao e mantendo preview/selecao sem trafegar binario pelo `server`.
  - **Camada:** `ui`
