---
title: Migracao do upload de screenshots de feedback para URL assinada
prd: https://github.com/JohnPetros/stardust/milestone/32
issue: https://github.com/JohnPetros/stardust/issues/414
apps: server, web, studio
status: open
last_updated_at: 2026-05-26
---

# 1. Objetivo (Obrigatorio)

Migrar o upload opcional de screenshots do widget de feedback do `web` para o fluxo de URL assinada do Supabase Storage, mantendo o envio do feedback separado do upload da imagem, reduzindo trafego binario pelo `server` e removendo o endpoint legado de upload multipart `POST /storage/files/:folder` quando `web` e `studio` nao dependerem mais dele.

---

# 2. Escopo (Obrigatorio)

## 2.1 In-scope

* Migrar `apps/web` para executar upload direto ao Supabase Storage via `SignedUploadUrl` antes de enviar o feedback.
* Criar no `apps/web` um provider client-side equivalente ao provider de signed upload ja existente no `apps/studio`.
* Ajustar o fluxo do `apps/web` para solicitar `StorageService.createSignedUploadUrl(...)` e executar o PUT direto via `SignedFileStorageProvider.uploadFile(...)`.
* Ajustar o fluxo do `apps/studio` para seguir o mesmo padrao do `web`: `StorageService.createSignedUploadUrl(...)` emite o contrato assinado e `SignedFileStorageProvider.uploadFile(...)` executa o upload binario direto.
* Permitir que usuarios autenticados solicitem signed upload URL para `images/feedback-reports`.
* Manter `god account` obrigatorio para signed upload URL nas demais pastas administrativas.
* Remover a rota legada `POST /storage/files/:folder` do `FilesStorageRouter`.
* Remover o controller legado `UploadFileController` e seu export.
* Preservar `GET /storage/files`, `DELETE /storage/files`, `POST /storage/signed-upload-url`, upload server-side interno por `FileStorageProvider.upload(...)`, listagem, remocao e leitura publica de arquivos.

## 2.2 Out-of-scope

* Alterar o fluxo de envio do feedback `POST /reporting/feedback`.
* Alterar schema, tabela, grants, views, indices ou RLS do banco de dados.
* Renomear arquivos ja enviados ao Storage.
* Criar novo bucket ou alterar a configuracao do bucket `stardust-bucket`.
* Alterar a experiencia funcional do fluxo de imagens do `studio`; a mudanca no `studio` e apenas de organizacao do contrato tecnico de upload.
* Alterar contratos de dominio de `reporting`.
* Incluir testes automatizados nesta spec.

---

# 3. Requisitos (Obrigatorio)

## 3.1 Funcionais

* O widget de feedback deve continuar permitindo screenshot opcional antes do envio.
* O widget deve converter a screenshot recortada em `File` e solicitar uma signed upload URL para `images/feedback-reports` antes de enviar o feedback.
* O upload binario da screenshot deve ser feito diretamente do browser para o Supabase Storage.
* Em sucesso no upload no `web`, o feedback deve persistir a referencia final retornada pelo fluxo de storage em `screenshot`.
* Em sucesso no upload no `studio`, o `ImageInput` deve continuar retornando o nome final do arquivo para o consumidor do widget.
* Em falha no upload da screenshot, o feedback nao deve ser enviado com `data:` URL/base64 como screenshot; o usuario deve permanecer no formulario com o texto preservado para tentar novamente.
* O endpoint `POST /storage/signed-upload-url` deve aceitar usuarios autenticados comuns apenas quando `folderPath` for `images/feedback-reports`.
* O endpoint `POST /storage/signed-upload-url` deve continuar exigindo `god account` para pastas diferentes de `images/feedback-reports`.
* O endpoint legado `POST /storage/files/:folder` deve deixar de existir no `server` apos a migracao do `web`.

## 3.2 Nao funcionais

* Seguranca: o signed upload deve validar `folderPath` por allowlist via `fileStorageFolderPathSchema` e `fileName` sem `/`, `\\`, `.` ou `..` via `signedUploadUrlSchema`.
* Seguranca: a extensao do arquivo deve continuar sendo validada por `SignedUploadUrl`; para `images/feedback-reports`, as extensoes permitidas sao `.png`, `.jpg`, `.jpeg` e `.webp`.
* Seguranca: campos controlados pelo servidor, como identidade do usuario autenticado, nao devem ser aceitos no schema de signed upload.
* Performance: o binario da screenshot nao deve trafegar pelo `server`; o `server` deve emitir apenas o contrato assinado.
* Compatibilidade retroativa interna: `FileStorageProvider.upload(...)` deve permanecer no core e no provider server-side porque ainda atende fluxos internos como backup e geracao de audio.
* Resiliencia: falhas na emissao da signed URL ou no PUT direto ao Supabase devem interromper o fluxo consumidor sem disparar `POST /reporting/feedback` com screenshot invalida no `web` e sem chamar `onSubmit(...)` no `studio`.

---

# 4. O que ja existe? (Obrigatorio)

## Camada UI

* **`useFeedbackDialog`** (`apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`) - Hook que captura screenshot com `html-to-image`, recebe o crop como `data:` URL, converte para `File`, chama hoje `storageService.uploadFile(...)` e depois envia `FeedbackReport` via `reportingService.sendFeedbackReport(...)`.
* **`FeedbackDialogView`** (`apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/FeedbackDialogView.tsx`) - View que renderiza o dialog, formulario, preview e `ScreenCropper`.
* **`ScreenCropper`** (`apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/ScreenCropper`) - Widget interno usado para recortar a captura e gerar `canvas.toDataURL('image/png')`.
* **`useRestContextProvider`** (`apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - Factory client-side dos services REST consumidos pela UI, atualmente instancia `StorageService(restClient)`.
* **`ImageInput`** (`apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`) - Widget de upload de imagem do Studio; hoje injeta apenas `storageService` no hook.
* **`useImageInput`** (`apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`) - Hook do Studio que hoje chama `storageService.uploadFile(folder, imageFile)` e retorna `response.body.filename` via `onSubmit(...)`.
* **`useProvisionContext`** (`apps/studio/src/ui/global/hooks/useProvisionContext.ts`) - Hook ja existente para acessar `signedFileStorageProvider` no Studio.

## Camada REST (Services)

* **`StorageService`** (`apps/web/src/rest/services/StorageService.ts`) - Service web que ja possui `createSignedUploadUrl(folderPath, fileName)`, mas ainda implementa `uploadFile(folder, file)` com `postFormData('/storage/files/${folder.value}', formData)`.
* **`StorageService`** (`apps/studio/src/rest/services/StorageService.ts`) - Implementacao atual do Studio que ja emite signed URL, mas ainda esconde a emissao e o PUT direto dentro de `uploadFile(folder, file)`.
* **`ReportingService`** (`apps/web/src/rest/services/ReportingService.ts`) - Service que envia o feedback por `POST /reporting/feedback`; deve permanecer separado do upload da screenshot.

## Camada Provision (Providers)

* **`SupabaseSignedFileStorageProvider`** (`apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts`) - Provider client-side de referencia que faz `fetch(signedUploadUrl.url.value, { method: 'PUT', body: fileToUpload, headers: { 'Content-Type': ..., 'x-upsert': 'false' } })`.
* **`SupabaseFileStorageProvider`** (`apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`) - Provider server-side que implementa `upload(...)`, `createSignedUploadUrl(...)`, `findFile(...)`, `listFiles(...)` e `removeFile(...)` para o bucket `stardust-bucket`.

## Camada Core

* **`StorageService`** (`packages/core/src/storage/interfaces/StorageService.ts`) - Interface compartilhada com `uploadFile(folder, file): Promise<RestResponse<{ filename: string }>>` e `createSignedUploadUrl(folderPath, fileName): Promise<RestResponse<SignedUploadUrlDto>>`; `uploadFile(...)` deve deixar de ser usado pelos apps clientes nesta entrega.
* **`SignedFileStorageProvider`** (`packages/core/src/storage/interfaces/SignedFileStorageProvider.ts`) - Interface client-side para upload direto por URL assinada.
* **`FileStorageProvider`** (`packages/core/src/storage/interfaces/FileStorageProvider.ts`) - Interface server-side usada por signed URL, listagem, remocao e uploads internos; nao deve ser removida.
* **`CreateSignedUploadUrl`** (`packages/core/src/storage/use-cases/CreateSignedUploadUrl.ts`) - Use case que valida folder/name, verifica conflito via `findFile(...)` e retorna `SignedUploadUrlDto`.
* **`SignedUploadUrl`** (`packages/core/src/storage/domain/structures/SignedUploadUrl.ts`) - Structure que valida URL, folder, nome de arquivo e extensoes permitidas por pasta.
* **`FileStorageFolderPath`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - Structure com factory `createAsFeedbackReports()` resolvendo para `images/feedback-reports`.

## Pacote Validation

* **`signedUploadUrlSchema`** (`packages/validation/src/modules/storage/signedUploadUrlSchema.ts`) - Schema do body `{ folderPath, fileName }` para emissao da signed upload URL.
* **`fileStorageFolderPathSchema`** (`packages/validation/src/modules/storage/fileStorageFolderPathSchema.ts`) - Allowlist de folders canonicos, incluindo `images/feedback-reports`.

## Camada Hono App (Routes)

* **`StorageRouter`** (`apps/server/src/app/hono/routers/storage/StorageRouter.ts`) - Expõe `POST /storage/signed-upload-url`, hoje com `verifyAuthentication`, `verifyGodAccount` e `signedUploadUrlSchema`.
* **`FilesStorageRouter`** (`apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`) - Expõe `POST /storage/files/:folder`, `GET /storage/files` e `DELETE /storage/files`; o upload legado deve ser removido, listagem/remocao devem permanecer.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Middleware de autenticação e `verifyGodAccount` usado nas rotas de storage.
* **`StorageMiddleware`** (`apps/server/src/app/hono/middlewares/StorageMiddleware.ts`) - Middleware especifico de storage ja existente, hoje usado para `verifyFileExists(...)`.

## Camada REST (Controllers)

* **`CreateSignedUploadUrlController`** (`apps/server/src/rest/controllers/storage/CreateSignedUploadUrlController.ts`) - Controller que lê `folderPath` e `fileName`, chama `CreateSignedUploadUrl.execute(...)` e retorna o DTO com `200`.
* **`UploadFileController`** (`apps/server/src/rest/controllers/storage/UploadFileController.ts`) - Controller legado do upload multipart via `http.getFile()` e `storageProvider.upload(...)`; deve ser removido junto com a rota publica legada.

---

# 5. O que deve ser criado? (Depende da tarefa)

## Camada Provision (Providers)

* **Localizacao:** `apps/web/src/provision/storage/SupabaseSignedFileStorageProvider.ts` - **novo arquivo**
* **Dependencias:** `SignedFileStorageProvider`, `SignedUploadUrl`, `AppError`.
* **Biblioteca:** `fetch` nativo do browser.
* **Metodos:** `SupabaseSignedFileStorageProvider(): SignedFileStorageProvider` - factory que retorna o provider de upload direto.
* **Metodos:** `uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void>` - renomeia o `File` para `signedUploadUrl.fileName.value`, envia `PUT` para `signedUploadUrl.url.value` com `Content-Type` do arquivo e header `x-upsert: false`, e lança `AppError` quando o Supabase retornar falha.

* **Localizacao:** `apps/web/src/provision/storage/index.ts` - **novo arquivo**
* **Dependencias:** `SupabaseSignedFileStorageProvider`.
* **Biblioteca:** Nao aplicavel.
* **Metodos:** exportar `SupabaseSignedFileStorageProvider` para consumo no `RestContext`.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Camada REST (Services)

* **Arquivo:** `apps/web/src/rest/services/StorageService.ts`
* **Mudanca:** Manter `createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text): Promise<RestResponse<SignedUploadUrlDto>>` como metodo responsavel por chamar `POST /storage/signed-upload-url`; remover o uso de `uploadFile(...)` no fluxo de screenshot do feedback e remover a implementacao multipart `postFormData('/storage/files/${folder.value}', formData)` quando o contrato compartilhado for atualizado.
* **Justificativa:** Alinhar o `web` ao padrao explicito em que a emissao do contrato assinado e feita por `StorageService.createSignedUploadUrl(...)` e o upload binario direto fica no `SignedFileStorageProvider`.
* **Camada:** `rest`

* **Arquivo:** `apps/studio/src/rest/services/StorageService.ts`
* **Mudanca:** Remover a orquestracao de signed upload de dentro de `uploadFile(folder, file)`; manter `createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text): Promise<RestResponse<SignedUploadUrlDto>>` como unico metodo do service responsavel pela emissao da signed URL; nao executar `SignedUploadUrl.create(...)` nem `signedFileStorageProvider.uploadFile(...)` dentro do service.
* **Justificativa:** Fazer o `studio` seguir o mesmo padrao do `web`, separando service REST de provider de infraestrutura e evitando que `StorageService.uploadFile(...)` esconda a chamada de signed URL.
* **Camada:** `rest`

* **Arquivo:** `packages/core/src/storage/interfaces/StorageService.ts`
* **Mudanca:** Remover `uploadFile(folder: FileStorageFolderPath, file: File): Promise<RestResponse<{ filename: string }>>` da interface compartilhada quando todos os consumidores forem migrados para `createSignedUploadUrl(...)` + `SignedFileStorageProvider.uploadFile(...)`.
* **Justificativa:** O contrato compartilhado de apps clientes deve nomear a operacao real executada pelo service REST: emissao de URL assinada, nao upload binario.
* **Camada:** `rest`

## Camada UI (Contexts)

* **Arquivo:** `apps/web/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
* **Mudanca:** Importar `SupabaseSignedFileStorageProvider` de `@/provision/storage` e disponibilizar o provider no contexto/provisionamento client-side seguindo o mesmo padrao do `apps/studio`.
* **Justificativa:** Permitir que o fluxo do feedback execute o PUT direto sem acoplar a emissao da signed URL ao upload binario nem ao endpoint legado.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
* **Mudanca:** Remover a injecao de `signedFileStorageProvider` em `StorageService(...)`, caso ela exista apos a refatoracao; o provider deve continuar vindo do `ProvisionContext` e nao do service REST.
* **Justificativa:** Manter o `StorageService` do Studio restrito a chamadas REST e padronizar a separacao entre REST service e provision provider.
* **Camada:** `ui`

## Camada UI (Widgets)

* **Arquivo:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`
* **Mudanca:** Ajustar `handleSubmit()` para nao manter `screenshotUrl = screenshotPreview` quando `screenshotPreview` for `data:` URL; gerar `fileName` com `Text.create(file.name)`, chamar `storageService.createSignedUploadUrl(FileStorageFolderPath.createAsFeedbackReports(), fileName)`, criar `SignedUploadUrl` a partir da resposta, chamar `signedFileStorageProvider.uploadFile(signedUploadUrl, file)`, e interromper o envio do feedback em qualquer falha; em sucesso, usar `signedUploadUrl.fileName.value` como valor de `screenshot`.
* **Justificativa:** Evitar persistencia acidental de base64 no feedback e atender ao requisito de permitir reenvio sem perder texto quando o upload falhar.
* **Camada:** `ui`

* **Arquivo:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/index.tsx`
* **Mudanca:** Obter `signedFileStorageProvider` do contexto/provisionamento client-side e repassar para `useFeedbackDialog(...)` junto com `storageService`.
* **Justificativa:** O hook precisa orquestrar a emissao da signed URL pelo service e o PUT direto pelo provider sem que o service esconda o upload.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`
* **Mudanca:** Obter `signedFileStorageProvider` via `useProvisionContext()` e repassar para `useImageInput(...)` junto com `storageService`.
* **Justificativa:** O widget do Studio deve seguir a mesma separacao do Web: service emite signed URL, provider executa upload.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`
* **Mudanca:** Substituir `storageService.uploadFile(folder, imageFile)` por `storageService.createSignedUploadUrl(folder, Text.create(imageFile.name))`, criar `SignedUploadUrl` a partir do body, chamar `signedFileStorageProvider.uploadFile(signedUploadUrl, imageFile)`, e em sucesso chamar `onSubmit(signedUploadUrl.fileName.value)`; em falha, exibir toast e nao fechar o dialog.
* **Justificativa:** Remover o uso de `StorageService.uploadFile(...)` no Studio e manter comportamento funcional equivalente ao fluxo atual de imagens.
* **Camada:** `ui`

## Camada Hono App (Routes)

* **Arquivo:** `apps/server/src/app/hono/routers/storage/StorageRouter.ts`
* **Mudanca:** Substituir `this.authMiddleware.verifyGodAccount` por `this.storageMiddleware.verifySignedUploadUrlAccess` em `POST /storage/signed-upload-url`, mantendo a ordem `verifyAuthentication`, `validate('json', signedUploadUrlSchema)`, `verifySignedUploadUrlAccess`, handler.
* **Justificativa:** Permitir signed upload de screenshot para usuarios autenticados comuns apenas na pasta `images/feedback-reports`, preservando autorizacao administrativa para demais pastas na borda do server.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`
* **Mudanca:** Remover import de `UploadFileController`, remover o metodo `registerUploadFileRoute()` e remover sua chamada em `registerRoutes()`; manter `registerRemoveFileRoute()` e `registerlistFilesRoute()`.
* **Justificativa:** Encerrar o contrato legado `POST /storage/files/:folder` apos migrar o ultimo consumidor conhecido no `web`, sem remover listagem/remocao de arquivos.
* **Camada:** `rest`

## Camada Hono App (Middlewares)

* **Arquivo:** `apps/server/src/app/hono/middlewares/StorageMiddleware.ts`
* **Mudanca:** Adicionar `verifySignedUploadUrlAccess(context: Context, next: Next): Promise<void>`; ler `folderPath` do body validado por `context.req.valid('json')`; quando `folderPath === 'images/feedback-reports'`, chamar `await next()`; para qualquer outro folder, delegar para `VerifyGodAccountController` usando `new HonoHttp(context, next)`.
* **Justificativa:** Manter autenticacao/autorizacao como responsabilidade da borda e evitar acoplamento cross-domain no `core`; a excecao de permissao e especifica do adapter HTTP de storage.
* **Camada:** `rest`

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/storage/index.ts`
* **Mudanca:** Remover o export `UploadFileController`.
* **Justificativa:** O controller legado deixa de ser parte da API publica interna de controllers apos a remocao da rota multipart.
* **Camada:** `rest`

---

# 7. O que deve ser removido? (Depende da tarefa)

## Camada REST (Controllers)

* **Arquivo:** `apps/server/src/rest/controllers/storage/UploadFileController.ts`
* **Motivo da remocao:** O endpoint publico multipart `POST /storage/files/:folder` sera removido e nenhum consumidor da codebase deve chamar esse contrato apos a migracao do `web`.
* **Impacto esperado:** Remove apenas o adapter HTTP legado. Nao remove `FileStorageProvider.upload(...)`, porque essa operacao ainda e usada por fluxos internos do `server`, como backup e geracao de audio.

---

# 8. Decisoes Tecnicas e Trade-offs (Obrigatorio)

* **Decisao:** Usar `StorageService.createSignedUploadUrl(...)` no fluxo do `web` em vez de reaproveitar `StorageService.uploadFile(...)` como fachada para signed upload.
* **Alternativas consideradas:** Manter `uploadFile(...)` como fachada compatível; criar um service especifico para screenshots; executar o PUT direto dentro do `StorageService`.
* **Motivo da escolha:** O nome `createSignedUploadUrl(...)` explicita que o service REST apenas emite o contrato assinado, enquanto o upload binario pertence ao `SignedFileStorageProvider`, seguindo o mesmo padrao arquitetural usado pelo `studio`.
* **Impactos / trade-offs:** O widget/hook passa a orquestrar duas etapas de infraestrutura (`createSignedUploadUrl` e provider de upload), mas elimina ambiguidade semantica de `uploadFile(...)` e evita manter uma API publica que esconda o fluxo real.

* **Decisao:** Aplicar o mesmo padrao no `studio`, removendo a orquestracao de signed upload de `StorageService.uploadFile(...)` e movendo-a para o hook consumidor (`useImageInput`).
* **Alternativas consideradas:** Manter o Studio como excecao por ja estar funcional; criar helper compartilhado de upload direto; manter dois padroes entre apps.
* **Motivo da escolha:** Ter o mesmo contrato mental e tecnico nos dois apps reduz ambiguidade: `StorageService.createSignedUploadUrl(...)` fala com o server, `SignedFileStorageProvider.uploadFile(...)` fala com o Supabase Storage.
* **Impactos / trade-offs:** O hook do Studio fica responsavel por mais uma etapa de orquestracao, mas o service REST deixa de depender do provider e fica mais simples e consistente com o Web.

* **Decisao:** Criar `SupabaseSignedFileStorageProvider` no `apps/web` espelhando o provider do `apps/studio`.
* **Alternativas consideradas:** Compartilhar o provider do `studio`; executar o PUT direto dentro do `StorageService`.
* **Motivo da escolha:** Apps nao devem importar codigo uma da outra, e o provider mantem a responsabilidade de infraestrutura fora do service REST.
* **Impactos / trade-offs:** Duplica uma pequena implementacao, mas preserva fronteiras entre apps e permite evolucao independente.

* **Decisao:** Permitir `POST /storage/signed-upload-url` para usuario autenticado comum somente quando `folderPath` for `images/feedback-reports`.
* **Alternativas consideradas:** Manter `verifyGodAccount` para todas as pastas; criar endpoint separado para feedback; mover autorizacao para o use case do core.
* **Motivo da escolha:** O PRD exige feedback por usuarios autenticados, o endpoint atual com `god account` quebraria esse fluxo, e autorizacao HTTP pertence a borda conforme os guardrails do projeto.
* **Impactos / trade-offs:** A rota passa a ter autorizacao condicional por folder, aumentando a responsabilidade do middleware de storage, mas evita criar novo endpoint e preserva autorizacao administrativa para assets do Studio.

* **Decisao:** Remover apenas o endpoint/controller HTTP legado, mantendo `FileStorageProvider.upload(...)` no core e no provider server-side.
* **Alternativas consideradas:** Remover tambem `FileStorageProvider.upload(...)`; manter o endpoint legado sem consumidores.
* **Motivo da escolha:** `FileStorageProvider.upload(...)` ainda e usado por fluxos internos server-side, enquanto o contrato publico multipart deixa de ter consumidores apos a migracao do `web`.
* **Impactos / trade-offs:** O binario deixa de passar por endpoint publico generico, mas a capacidade de upload interno do servidor continua existindo.

* **Decisao:** Interromper envio do feedback quando o upload da screenshot falhar.
* **Alternativas consideradas:** Enviar feedback sem screenshot; enviar feedback com `data:` URL/base64; limpar automaticamente a screenshot e prosseguir.
* **Motivo da escolha:** O comportamento atual pode persistir payload invalido e pesado; interromper preserva texto/screenshot no formulario e permite reenvio explicito pelo usuario.
* **Impactos / trade-offs:** Um feedback com screenshot falha por completo se o upload falhar, mas evita dados inconsistentes em `reporting`.

---

# 9. Diagramas e Referencias (Obrigatorio)

* **Fluxo de Dados:**

```text
FeedbackDialog/useFeedbackDialog
  -> converte screenshot data: URL em File
  -> apps/web StorageService.createSignedUploadUrl(folder=images/feedback-reports, fileName)
    -> POST /storage/signed-upload-url { folderPath, fileName }
      -> StorageRouter
      -> ValidationMiddleware(signedUploadUrlSchema)
      -> StorageMiddleware.verifySignedUploadUrlAccess
      -> CreateSignedUploadUrlController
      -> CreateSignedUploadUrl
      -> SupabaseFileStorageProvider.findFile
      -> SupabaseFileStorageProvider.createSignedUploadUrl
    <- SignedUploadUrlDto { url, folderPath, fileName }
    -> SupabaseSignedFileStorageProvider.uploadFile(signedUploadUrl, file)
      -> PUT direto para Supabase Storage signedUrl
  -> FeedbackReport.create({ screenshot: filename, ... })
  -> ReportingService.sendFeedbackReport(report)
    -> POST /reporting/feedback
```

* **Fluxo Cross-app (se aplicavel):**

```text
apps/web (consome)
  StorageService.createSignedUploadUrl
  | REST POST /storage/signed-upload-url
  v
apps/server (expoe)
  StorageRouter + CreateSignedUploadUrlController
  | Supabase SDK createSignedUploadUrl
  v
Supabase Storage
  ^ PUT direto com signedUrl
  |
apps/web (consome signedUrl via SupabaseSignedFileStorageProvider)

apps/web (depois do upload)
  ReportingService.sendFeedbackReport
  | REST POST /reporting/feedback
  v
apps/server (reporting endpoint existente)

apps/studio (consome)
  StorageService.createSignedUploadUrl
  | REST POST /storage/signed-upload-url
  v
apps/server (expoe)
  StorageRouter + CreateSignedUploadUrlController
  | Supabase SDK createSignedUploadUrl
  v
Supabase Storage
  ^ PUT direto com signedUrl
  |
apps/studio (consome signedUrl via SupabaseSignedFileStorageProvider)
```

* **Layout (se aplicavel):** Nao aplicavel.

* **Referencias:**
* `apps/studio/src/rest/services/StorageService.ts` - Service que deve ser ajustado para expor apenas a emissao de signed URL, sem orquestrar o PUT direto em `uploadFile(...)`.
* `apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts` - Referencia para o PUT direto ao Supabase Storage.
* `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts` - Hook consumidor do Studio que deve orquestrar `createSignedUploadUrl(...)` + `signedFileStorageProvider.uploadFile(...)`.
* `apps/web/src/rest/services/StorageService.ts` - Service web atual que deve trocar o multipart legado por signed upload.
* `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts` - Fluxo atual de captura, crop, upload e envio do feedback.
* `apps/server/src/app/hono/routers/storage/StorageRouter.ts` - Rota existente `POST /storage/signed-upload-url`.
* `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts` - Router onde o endpoint legado `POST /storage/files/:folder` deve ser removido.
* `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts` - Provider server-side que emite signed URL e deve manter uploads internos.
* `packages/core/src/storage/domain/structures/SignedUploadUrl.ts` - Validacao de extensoes por folder.
* `packages/core/src/storage/domain/structures/FileStorageFolderPath.ts` - Factory `createAsFeedbackReports()` para `images/feedback-reports`.
* `packages/validation/src/modules/storage/signedUploadUrlSchema.ts` - Schema do contrato de emissao da signed upload URL.
* `https://github.com/JohnPetros/stardust/blob/main/documentation/features/reporting/feedback/prd.md` - PRD remoto usado como fonte de requisitos de produto para o widget de feedback.
* `documentation/features/storage/picture-files-upload/specs/signed-upload-url-migraation-spec.md` - Spec anterior que manteve o upload legado temporariamente para o `web` e serve de contexto para esta remocao.

---

# 10. Pendencias / Duvidas (Quando aplicavel)

Sem pendencias.
