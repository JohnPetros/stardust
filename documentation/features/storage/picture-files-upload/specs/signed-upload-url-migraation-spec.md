---
title: Migracao de uploads do Studio para URLs assinadas do Supabase
prd: https://github.com/JohnPetros/stardust/milestone/32
issue: https://github.com/JohnPetros/stardust/issues/413
apps: server, studio, web
status: closed
last_updated_at: 2026-05-22
---

# 1. Objetivo (Obrigatorio)

Migrar o upload de imagens iniciado pelo Studio para um fluxo baseado em URLs assinadas do Supabase Storage, mantendo a experiencia atual dos widgets de selecao, upload imediato, listagem paginada, preview e remocao de assets. Tecnicamente, a entrega cria um endpoint autenticado e autorizado no `server` para emitir o contrato de upload assinado, adiciona o contrato compartilhado em `core`/`validation`, implementa o upload direto no `studio` sem trafegar binario pelo `server` e mantem o endpoint legado de upload binario `POST /storage/files/:folder` para nao quebrar o `web`.

---

# 2. Escopo (Obrigatorio)

## 2.1 In-scope

* Criar um contrato REST unico para solicitar URL assinada informando `folderPath` e `fileName`.
* Implementar a emissao da URL assinada no `SupabaseFileStorageProvider` usando o bucket atual `stardust-bucket`.
* Migrar o `StorageService` do Studio para executar upload direto ao Supabase a partir do contrato assinado.
* Preservar o contrato publico atual de `ImageInput` e dos formularios administrativos que o reutilizam.
* Manter listagem (`GET /storage/files`) e remocao (`DELETE /storage/files?folder=...&fileName=...`) sem mudanca funcional, aplicando a mesma regra de autenticacao/autorizacao do endpoint de signed upload.
* Manter `POST /storage/files/:folder` como compatibilidade temporaria para o upload de screenshot de feedback no `web`.
* Corrigir o alinhamento do contrato `FileStorageProvider` com os usos reais de upload server-side ja existentes.
* Exportar `SignedUploadUrl` e `SignedUploadUrlDto` pelos barrel files publicos do `core`.

## 2.2 Out-of-scope

* Definir novos formatos aceitos alem da regra ja consolidada no PRD atualizado por esta entrega.
* Alterar a experiencia visual do seletor de imagens alem dos estados necessarios para preservar erro/loading atuais.
* Renomear imagens ja cadastradas, organizar assets por novas pastas/tags ou bloquear remocao de imagens em uso.
* Criar migrations, buckets, RLS policies ou grants de Storage nesta entrega.
* Substituir listagem/remocao por URLs assinadas ou por chamadas diretas do Studio ao Supabase.

---

# 3. Requisitos (Obrigatorio)

## 3.1 Funcionais

* O Studio deve continuar permitindo upload de imagens para a pasta `story` no fluxo de edicao de historia e quiz de licao.
* O Studio deve continuar permitindo upload de imagens nos formularios administrativos que reutilizam `ImageInput` para planetas, avatares, foguetes, conquistas e insignias.
* O Studio deve solicitar ao server um contrato assinado antes de enviar o binario ao Supabase Storage.
* O Studio deve enviar o binario diretamente ao Supabase Storage usando a URL assinada, sem passar o arquivo pelo endpoint REST legado.
* Apos upload bem-sucedido, o Studio deve registrar no estado/formulario o nome final do arquivo e preservar preview, refetch da listagem e selecao existentes.
* No seletor `PictureInput`, apos upload bem-sucedido, a imagem recem-enviada deve ser selecionada automaticamente.
* O fluxo de cancelamento/fechamento sem salvar deve continuar removendo arquivos recem-enviados pelos hooks de formulario que ja usam `removeFile`.
* Ao remover uma imagem dentro do `PictureInput`, o dialog deve permanecer aberto.
* Ao remover a imagem atualmente selecionada no `PictureInput`, a selecao deve voltar para `panda.jpg`.
* O server deve receber `folderPath` e `fileName` no request antes de emitir a URL assinada.
* O server deve usar o `fileName` informado e validado como nome final do arquivo ao emitir a URL assinada; o client nunca deve enviar `url` ou token assinado no request.
* O server deve verificar via `FileStorageProvider` se o `fileName` ja existe no `folderPath` informado antes de emitir a URL assinada e deve falhar quando houver conflito.
* O `web` pode continuar usando `POST /storage/files/:folder` neste ciclo para nao quebrar o fluxo atual de screenshot de feedback.

## 3.2 Nao funcionais

* Seguranca: o endpoint de emissao de signed upload URL deve exigir `verifyAuthentication` e `verifyGodAccount`, seguindo o padrao das rotas administrativas de escrita do Studio.
* Seguranca: `GET /storage/files` e `DELETE /storage/files?folder=...&fileName=...` devem exigir `verifyAuthentication` e `verifyGodAccount`.
* Seguranca: `folderPath` deve ser validado contra a allowlist do projeto na borda; `fileName` nao deve aceitar `/`, `\\`, valor vazio, `.` ou `..`.
* Seguranca: a compatibilidade entre `folderPath` e extensao do `fileName` deve ser validada em `SignedUploadUrl`.
* Compatibilidade retroativa: `StorageService.uploadFile(folder, file)` deve continuar existindo porque ainda e usado pelo `web` e pelos widgets do Studio.
* Compatibilidade retroativa: uploads server-side usados por jobs e pelo endpoint legado devem continuar suportados por `FileStorageProvider.upload(folder, file)`.
* Latencia: no Studio, o binario deve deixar de trafegar pelo `server`; apenas a emissao da URL assinada passa pela API.
* Performance percebida: o `PictureInput` deve abrir com carga inicial reduzida, buscando `12` imagens por pagina e pre-carregando as thumbnails assim que a primeira pagina for recebida.
* Resiliencia: falha na emissao da signed URL e falha no upload direto devem ser tratadas separadamente e exibidas como erro no fluxo atual do `ImageInput`.
* Compatibilidade funcional: o conflito de nome deve ser detectado antes do upload direto ao Supabase, para evitar tentativa de envio desnecessaria.
* Tamanho maximo: uploads de imagem na `studio` devem respeitar limite fixo de `5 MB` (`5 * 1024 * 1024` bytes), validado antes da chamada ao endpoint de signed upload URL.

---

# 4. O que ja existe? (Obrigatorio)

## Core

* **`SignedUploadUrl`** (`packages/core/src/storage/domain/structures/SignedUploadUrl.ts`) - Structure ja existente com `url`, `folderPath`, `fileName` e getter `dto`; sera estendida para validar a extensao do `fileName` de acordo com o `folderPath` no `create()`.
* **`SignedUploadUrlDto`** (`packages/core/src/storage/domain/structures/dtos/SignedUploadUrlDto.ts`) - DTO existente com `{ url: string; folderPath: string; fileName: string }`.
* **`FileStorageFolderPath`** (`packages/core/src/storage/domain/structures/FileStorageFolderPath.ts`) - Resolve nomes legados como `story` para `images/story` e valida os paths canonicos de storage.
* **`FileStorageProvider`** (`packages/core/src/storage/interfaces/FileStorageProvider.ts`) - Interface de provider de storage; hoje esta inconsistente com os adapters reais porque declara `upload(signedUploadUrl)` enquanto controllers, jobs e providers usam `upload(folder, file)`.
* **`SignedFileStorageProvider`** (`packages/core/src/storage/interfaces/SignedFileStorageProvider.ts`) - Novo contrato dedicado ao upload direto por URL assinada, usado pela `studio`.
* **`StorageService`** (`packages/core/src/storage/interfaces/StorageService.ts`) - Interface compartilhada dos clients REST de storage, com `listFiles`, `uploadFile`, `removeFile` e `searchEmbeddings`.
* **`BackupDatabaseUseCase`** (`packages/core/src/storage/use-cases/BackupDatabaseUseCase.ts`) - Uso existente de upload server-side via `storageProvider.upload(folder, file)`.

## Core - Use Cases

* **`BackupDatabaseUseCase`** (`packages/core/src/storage/use-cases/BackupDatabaseUseCase.ts`) - Referencia de use case simples do modulo `storage`, com dependencias injetadas e orquestracao direta sobre providers.

## Validation

* **`fileStorageFolderPathSchema`** (`packages/validation/src/modules/storage/fileStorageFolderPathSchema.ts`) - Schema Zod com allowlist de paths canonicos como `images/story`, `images/avatars`, `images/feedback-reports` e `database-backups`.
* **`stringSchema`** (`packages/validation/src/modules/global/schemas/stringSchema.ts`) - Schema base de string usado em validators de rota.
* **`storage` barrel** (`packages/validation/src/modules/storage/index.ts`) - Exporta schemas do modulo de storage.

## Server - Hono App

* **`FilesStorageRouter`** (`apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`) - Registra hoje `POST /storage/files/:folder`, `GET /storage/files` e `DELETE /storage/files`; nesta entrega, listagem/remocao passam a usar o mesmo par `verifyAuthentication` + `verifyGodAccount` do endpoint de signed upload.
* **`StorageRouter`** (`apps/server/src/app/hono/routers/storage/StorageRouter.ts`) - Monta o router de storage sob `/storage` e passa a expor `POST /storage/signed-upload-url`.
* **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Expoe `verifyAuthentication` e `verifyGodAccount`; rotas administrativas de escrita usam os dois middlewares em sequencia.

## Server - REST Controllers

* **`UploadFileController`** (`apps/server/src/rest/controllers/storage/UploadFileController.ts`) - Controller legado de upload multipart que deve ser mantido para compatibilidade com o `web`.
* **`FetchFilesListController`** (`apps/server/src/rest/controllers/storage/FetchFilesListController.ts`) - Lista arquivos com paginacao via `storageProvider.listFiles`.
* **`RemoveFileController`** (`apps/server/src/rest/controllers/storage/RemoveFileController.ts`) - Remove arquivo via `storageProvider.removeFile`.
* **`storage controllers barrel`** (`apps/server/src/rest/controllers/storage/index.ts`) - Exporta controllers do modulo de storage.

## Server - Provision

* **`SupabaseFileStorageProvider`** (`apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`) - Provider principal de storage, usa `@supabase/supabase-js`, bucket `stardust-bucket`, upload server-side, listagem, busca, public URL e remocao.
* **`GoogleDriveStorageProvider`** (`apps/server/src/provision/storage/GoogleDriveStorageProvider.ts`) - Provider alternativo parcial; implementa upload server-side e deixa demais metodos como nao implementados.
* **`DropboxStorageProvider`** (`apps/server/src/provision/storage/DropboxStorageProvider.ts`) - Provider usado para backup de database; implementa upload server-side e deixa demais metodos como nao implementados.

## Studio - REST

* **`StorageService`** (`apps/studio/src/rest/services/StorageService.ts`) - Implementacao atual de `StorageService`, com `uploadFile` enviando `FormData` para `POST /storage/files/${folder.value}`.
* **`SupabaseSignedFileStorageProvider`** (`apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts`) - Provider client-side dedicado ao upload direto por URL assinada.
* **`AxiosRestClient`** (`apps/studio/src/rest/axios/AxiosRestClient.ts`) - Implementa `RestClient` com `get`, `post`, `postFormData`, `put`, `patch`, `delete`, headers e query params.
* **`useRestContextProvider`** (`apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`) - Cria `AxiosRestClient`, configura `ENV.stardustServerUrl` e injeta `storageService` no contexto da UI.
* **`ProvisionContext`** (`apps/studio/src/ui/global/contexts/ProvisionContext`) - Composition root de providers client-side consumidos pela UI da `studio`.
* **`contexts` de UI** (`apps/studio/src/ui/global/contexts`) - Ponto onde a `studio` ja organiza providers de infraestrutura consumidos pela camada UI.

## Studio - UI

* **`ImageInput`** (`apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`) - Entry point do widget reutilizavel de upload imediato, resolve `storageService` via `useRestContext`.
* **`useImageInput`** (`apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`) - Hook que guarda `imageFile`, `imageName`, valida `Image.create(imageName)` e chama `storageService.uploadFile`.
* **`ImageInputView`** (`apps/studio/src/ui/global/widgets/components/ImageInput/ImageInputView.tsx`) - View com `FileUpload`, input de nome e botao `Enviar` com loading.
* **`PictureInput`** (`apps/studio/src/ui/lesson/widgets/components/PictureInput/index.tsx`) - Entry point do seletor de imagens de licao.
* **`usePictureInput`** (`apps/studio/src/ui/lesson/widgets/components/PictureInput/usePictureInput.ts`) - Lista imagens de `FileStorageFolderPath.createAsStory()` com `usePaginatedFetch`, `ITEMS_PER_PAGE = 12`, busca, selecao, preload de thumbnails e refetch apos upload/remocao.
* **`PictureInputView`** (`apps/studio/src/ui/lesson/widgets/components/PictureInput/PictureInputView.tsx`) - View com busca, imagem selecionada, `ImageInput folder='story'`, loading, empty state, grid e load more.
* **`PictureCard` hook** (`apps/studio/src/ui/lesson/widgets/components/PictureInput/PictureCard/usePictureCard.ts`) - Remove imagens via `storageService.removeFile(FileStorageFolderPath.createAsStory(), Text.create(imageName))`.
* **`StorageImage`** (`apps/studio/src/ui/global/widgets/components/StorageImage/index.tsx`) - Renderiza preview a partir do CDN do Supabase e resolve pastas legadas.

## Web - Compatibilidade

* **`StorageService`** (`apps/web/src/rest/services/StorageService.ts`) - Implementacao web do `StorageService`; hoje `uploadFile` ainda usa `POST /storage/files/${folder.value}`.
* **`useFeedbackDialog`** (`apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`) - Consumidor remanescente do upload legado, envia screenshot para `FileStorageFolderPath.createAsFeedbackReports()`.

---

# 5. O que deve ser criado?

## Camada REST (Controllers)

* **Localizacao:** `apps/server/src/rest/controllers/storage/CreateSignedUploadUrlController.ts` (**novo arquivo**)
* **Dependencias:** `FileStorageProvider` injetado no construtor.
* **Dados de request:** body JSON com `folderPath: string` e `fileName: string`.
* **Dados de response:** `SignedUploadUrlDto` com `url`, `folderPath` e `fileName`.
* **Metodos:** `handle(http: Http<CreateSignedUploadUrlControllerSchema>): Promise<RestResponse<SignedUploadUrlDto>>` - le `folderPath` e `fileName` do body, chama o use case `CreateSignedUploadUrl` e retorna `http.statusOk().send(signedUploadUrl.dto)`.

## Camada Core (Use Cases)

* **Localizacao:** `packages/core/src/storage/use-cases/CreateSignedUploadUrl.ts` (**novo arquivo**)
* **Dependencias:** `FileStorageProvider`.
* **Dados de request:** `folderPath: string` e `fileName: string`.
* **Dados de response:** `SignedUploadUrlDto`.
* **Metodos:** `execute({ folderPath, fileName }: { folderPath: string; fileName: string }): Promise<SignedUploadUrlDto>` - cria `FileStorageFolderPath` e `Text`, consulta `findFile(folderPath, fileName)` no provider, falha se ja existir arquivo com esse nome e, caso nao exista, solicita `createSignedUploadUrl(folderPath, fileName)` ao provider; o DTO retornado deve ser criado via `SignedUploadUrl.create(...)`, que valida a extensao do `fileName` de acordo com o `folderPath`.

## Pacote Validation (Schemas)

* **Localizacao:** `packages/validation/src/modules/storage/signedUploadUrlSchema.ts` (**novo arquivo**)
* **Atributos:** `folderPath` deve reutilizar `fileStorageFolderPathSchema`; `fileName` deve reutilizar `stringSchema`, exigir pelo menos 1 caractere apos trim e rejeitar `/`, `\\`, `.`, `..`.

## Camada Provision (Providers)

* **Localizacao:** `apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts` (**novo arquivo**)
* **Dependencias:** Nenhuma dependencia externa obrigatoria; usar `fetch` do browser ou `axios` local sem base URL do `server`.
* **Biblioteca:** Browser Fetch API ou Axios.
* **Metodos:** `uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void>` - usa os dados do `SignedUploadUrl` e o binario selecionado para enviar o upload diretamente ao Supabase Storage e resolve sem payload quando o upload for concluido com sucesso.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Core

* **Arquivo:** `packages/core/src/storage/interfaces/FileStorageProvider.ts`
* **Mudanca:** Ajustar `upload` para `upload(folder: FileStorageFolderPath, file: File): Promise<File>` e adicionar `createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text): Promise<SignedUploadUrl>`.
* **Justificativa:** O upload server-side ja e usado por `UploadFileController`, `BackupDatabaseUseCase` e jobs de audio; a URL assinada deve ser um metodo adicional do port, nao uma substituicao que quebra fluxos internos.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/interfaces/SignedFileStorageProvider.ts`
* **Mudanca:** Criar a nova interface `SignedFileStorageProvider` com o metodo `uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void>`.
* **Justificativa:** O upload por URL assinada precisa de um contrato proprio para a UI, sem poluir `FileStorageProvider` server-side com responsabilidades que pertencem a outro adapter.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/interfaces/StorageService.ts`
* **Mudanca:** Adicionar `createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text): Promise<RestResponse<SignedUploadUrlDto>>`, mantendo `uploadFile(folder, file): Promise<RestResponse<{ filename: string }>>`.
* **Justificativa:** O contrato compartilhado precisa expor a emissao da signed URL para adapters REST sem remover a API usada por Studio/Web.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/use-cases/index.ts`
* **Mudanca:** Exportar `CreateSignedUploadUrl`.
* **Justificativa:** O controller do server deve executar um use case do modulo `storage`, em vez de delegar diretamente ao provider.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/domain/errors/index.ts`
* **Mudanca:** Exportar novo erro de conflito de nome de arquivo do modulo `storage`.
* **Justificativa:** O use case precisa falhar com erro explicito quando `findFile` indicar que o `fileName` ja existe.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/domain/structures/SignedUploadUrl.ts`
* **Mudanca:** Adicionar validacao no `create(dto)` para garantir que a extensao do `fileName` e compativel com o `folderPath` informado.
* **Justificativa:** A regra pedida pelo usuario deve ficar centralizada na structure usada para representar o contrato assinado.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/domain/structures/index.ts`
* **Mudanca:** Exportar `SignedUploadUrl`.
* **Justificativa:** O Studio precisa criar a structure a partir do DTO retornado antes de chamar o upload client.
* **Camada:** `core`

* **Arquivo:** `packages/core/src/storage/domain/structures/dtos/index.ts`
* **Mudanca:** Exportar `SignedUploadUrlDto`.
* **Justificativa:** `StorageService.createSignedUploadUrl` retorna esse DTO pelo contrato publico.
* **Camada:** `core`

## Validation

* **Arquivo:** `packages/validation/src/modules/storage/index.ts`
* **Mudanca:** Exportar `signedUploadUrlSchema`.
* **Justificativa:** O router Hono deve validar o body do novo endpoint usando o pacote compartilhado.
* **Camada:** `rest`

## Server - Provision

* **Arquivo:** `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts`
* **Mudanca:** Implementar `createSignedUploadUrl(folderPath, fileName)` usando o metodo `createSignedUploadUrl` do Supabase Storage para o path composto por `folderPath.value` + `/` + `fileName.value`, com `upsert: false`; mapear a URL retornada para `SignedUploadUrl.create({ url, folderPath: folderPath.value, fileName: fileName.value })` e manter `upload(folder, file)` para fluxos server-side.
* **Justificativa:** A emissao da URL assinada e detalhe do SDK Supabase e deve ficar encapsulada no provider.
* **Camada:** `provision`

* **Arquivo:** `apps/server/src/provision/storage/GoogleDriveStorageProvider.ts`
* **Mudanca:** Adicionar apenas `createSignedUploadUrl(_folderPath: FileStorageFolderPath, _fileName: Text): Promise<SignedUploadUrl>` lancando `MethodNotImplementedError(...)`.
* **Justificativa:** Satisfazer o contrato do core sem fingir suporte a signed upload em provider que nao participa do fluxo.
* **Camada:** `provision`

* **Arquivo:** `apps/server/src/provision/storage/DropboxStorageProvider.ts`
* **Mudanca:** Adicionar apenas `createSignedUploadUrl(_folderPath: FileStorageFolderPath, _fileName: Text): Promise<SignedUploadUrl>` lancando `MethodNotImplementedError(...)`.
* **Justificativa:** Satisfazer o contrato do core sem alterar o fluxo de backup que usa Dropbox apenas para upload server-side.
* **Camada:** `provision`

## Studio - Provision

* **Arquivo:** `apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts`
* **Mudanca:** Implementar `SignedFileStorageProvider` com o metodo `uploadFile(signedUploadUrl: SignedUploadUrl, file: File): Promise<void>`.
* **Justificativa:** Na `studio`, o provider existe apenas para executar o upload direto a partir do contrato assinado retornado pelo `server`.
* **Camada:** `provision`

## Server - REST

* **Arquivo:** `apps/server/src/rest/controllers/storage/CreateSignedUploadUrlController.ts`
* **Mudanca:** Injetar e executar `CreateSignedUploadUrl`, sem montar `SignedUploadUrlDto` diretamente no controller.
* **Justificativa:** A validacao de `folderPath`, a checagem de existencia e a chamada ao provider devem ficar no use case e na structure.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/rest/controllers/storage/index.ts`
* **Mudanca:** Exportar `CreateSignedUploadUrlController`.
* **Justificativa:** Manter o padrao de barrel dos controllers de storage.
* **Camada:** `rest`

## Server - Hono App

* **Arquivo:** `apps/server/src/app/hono/routers/storage/StorageRouter.ts`
* **Mudanca:** Importar `signedUploadUrlSchema`, `CreateSignedUploadUrlController` e `CreateSignedUploadUrl`; criar `registerCreateSignedUploadUrlRoute()` com `POST /signed-upload-url`, middlewares `verifyAuthentication`, `verifyGodAccount`, `validate('json', signedUploadUrlSchema)`; instanciar controller + use case + provider dentro da rota e registrar essa rota no router raiz de `storage`.
* **Justificativa:** O endpoint final exigido e `POST /storage/signed-upload-url`; registrar a rota no `StorageRouter` preserva `FilesStorageRouter` dedicado apenas a `/storage/files`.
* **Camada:** `rest`

* **Arquivo:** `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts`
* **Mudanca:** Aplicar `verifyAuthentication` + `verifyGodAccount` em `GET /storage/files` e alterar a remocao para `DELETE /storage/files` com `folder` e `fileName` em query params.
* **Justificativa:** Mantem listagem/remocao no mesmo subrouter de arquivos e alinha o contrato real exposto pela borda REST.
* **Camada:** `rest`

## Studio - REST

* **Arquivo:** `apps/studio/src/rest/services/StorageService.ts`
* **Mudanca:** Alterar a factory para receber `signedFileStorageProvider: SignedFileStorageProvider`; implementar `createSignedUploadUrl(folderPath, fileName)` chamando `POST /storage/signed-upload-url` com `{ folderPath: folderPath.value, fileName: fileName.value }`; alterar `uploadFile(folder, file)` para enviar o `fileName` escolhido na UI, montar o `SignedUploadUrl` a partir da resposta e fazer upload direto via `signedFileStorageProvider.uploadFile(signedUploadUrl, file)`; retornar `RestResponse<{ filename: string }>` com o mesmo `fileName` retornado pelo server.
* **Justificativa:** Preservar o contrato atual dos widgets enquanto remove o uso do endpoint legado no Studio.
* **Camada:** `rest`

## Studio - UI (Contexts)

* **Localizacao:** `apps/studio/src/ui/global/contexts/ProvisionContext` (**nova pasta**)
* **Props:** `children: ReactNode`.
* **Hook do provider:** `apps/studio/src/ui/global/contexts/ProvisionContext/useProvisionContextProvider.ts`.
* **Responsabilidade:** Instanciar e prover providers consumidos pela UI da `studio`, inicialmente `SupabaseSignedFileStorageProvider` com suporte a upload por signed URL.
* **Value:** `{ signedFileStorageProvider: SignedFileStorageProvider }`.

* **Arquivo:** `apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
* **Mudanca:** Manter o `RestContext` restrito a services REST; remover dele a responsabilidade de instanciar providers de provision.
* **Justificativa:** Providers de infraestrutura da UI passam a ser resolvidos por `ProvisionContext`, separando REST de provision.
* **Camada:** `ui`

## Studio - UI

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`
* **Mudanca:** Continuar usando o nome editado na UI como `fileName` enviado ao service; apos sucesso, chamar `onSubmit(response.body.filename)` usando o `fileName` retornado pelo server, que deve repetir o `fileName` validado.
* **Justificativa:** O nome final do arquivo volta a ser controlado pela borda, desde que passe pela validacao do backend antes da emissao da URL assinada.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/lesson/widgets/components/PictureInput/usePictureInput.ts`
* **Mudanca:** Apos upload bem-sucedido, selecionar automaticamente a imagem recem-enviada; ao remover uma imagem, manter o dialog aberto; ao remover a imagem atualmente selecionada, definir `panda.jpg` como fallback padrao; reduzir `ITEMS_PER_PAGE` para `12` e pre-carregar thumbnails da primeira pagina.
* **Justificativa:** Preserva a continuidade do fluxo no seletor de imagens, melhora a performance percebida na abertura do dialog e evita estado vazio inesperado apos exclusao da imagem selecionada.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/index.tsx`
* **Mudanca:** Resolver `storageService` via `useRestContext` e `signedFileStorageProvider` via `useProvisionContext`, repassando ambos para o fluxo de upload.
* **Justificativa:** O widget continua como entry point de integracao, mas cada dependencia passa a vir do contexto correto.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/ImageInputView.tsx`
* **Mudanca:** Manter o input de nome da imagem como campo editavel e alinhar o texto/placeholder para representar explicitamente o `fileName` que sera validado pelo backend; configurar `FileUpload` com `maxSize={5 * 1024 * 1024}`.
* **Justificativa:** O fluxo volta a depender do nome informado pelo usuario para compor o `fileName` final no storage.
* **Camada:** `ui`

* **Arquivo:** `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts`
* **Mudanca:** Tratar erro da etapa de signed URL e erro do upload direto no mesmo estado `isSubmitting`, exibindo toast e resetando o loading em `finally`; respeitar o bloqueio de arquivo acima de `5 MB` vindo do `FileUpload`.
* **Justificativa:** O novo fluxo tem duas chamadas falhaveis e o widget precisa preservar feedback de erro sem fechar o dialog em falha parcial.
* **Camada:** `ui`

## Web - REST

* **Arquivo:** `apps/web/src/rest/services/StorageService.ts`
* **Mudanca:** Implementar `createSignedUploadUrl(folderPath, fileName)` chamando `POST /storage/signed-upload-url`, e ajustar `removeFile(folder, fileName)` para usar `DELETE /storage/files` com query params; manter `uploadFile(folder, file)` usando `POST /storage/files/${folder.value}`.
* **Justificativa:** A interface compartilhada passa a exigir o metodo novo, mas o `web` ainda depende do endpoint legado pelo `FeedbackDialog`.
* **Camada:** `rest`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Nao aplicavel**.

---

# 8. Decisoes Tecnicas e Trade-offs (Obrigatorio)

* **Decisao:** Manter `uploadFile(folder, file)` no contrato `StorageService` e mudar apenas a implementacao do Studio para usar signed URL internamente.
* **Alternativas consideradas:** Alterar `ImageInput` para chamar explicitamente `createSignedUploadUrl` e um client local; remover `uploadFile` da interface compartilhada.
* **Motivo da escolha:** Minimiza alteracoes na UI, preserva formularios existentes e mantem compatibilidade com o Web.
* **Impactos / trade-offs:** `StorageService` fica com um metodo de fachada legado (`uploadFile`) e um metodo explicito novo (`createSignedUploadUrl`) durante a fase de migracao.

* **Decisao:** Corrigir `FileStorageProvider.upload` para o contrato server-side real e adicionar `createSignedUploadUrl` como metodo separado.
* **Alternativas consideradas:** Substituir `upload` por `upload(signedUploadUrl)` como o arquivo atual indica; criar um segundo provider apenas para Supabase signed upload.
* **Motivo da escolha:** Existem usos reais de upload server-side em controllers, jobs e use cases; substituir `upload` quebraria funcionalidades fora do escopo.
* **Impactos / trade-offs:** Providers que nao suportam signed URL precisam implementar metodo que lanca `MethodNotImplementedError`.

* **Decisao:** Usar um unico endpoint `POST /storage/signed-upload-url` com `folderPath` e `fileName` no body.
* **Alternativas consideradas:** Usar endpoint por caminho como `POST /storage/images/story`; usar `POST /storage/files/:folder/signed-upload-url`.
* **Motivo da escolha:** O usuario pediu um unico endpoint/controller; a selecao do caminho passa a ser explicita no body e a validacao de extensao e centralizada em `SignedUploadUrl`.
* **Impactos / trade-offs:** O endpoint fica mais generico e precisa validar corretamente a combinacao `folderPath` + `fileName` em todas as chamadas.

* **Decisao:** Na `studio`, o upload direto deve acontecer por um `SupabaseSignedFileStorageProvider` local implementando `SignedFileStorageProvider`.
* **Alternativas consideradas:** Usar um client utilitario fora do contrato do core; implementar todos os metodos de `FileStorageProvider` no Studio.
* **Motivo da escolha:** Cria um contrato especifico para upload por URL assinada sem misturar responsabilidades server-side e UI-side no mesmo provider.
* **Impactos / trade-offs:** O pacote `core` passa a expor uma nova interface dedicada ao fluxo de signed upload.

* **Decisao:** O metodo `SignedFileStorageProvider.uploadFile(...)` deve receber tanto `SignedUploadUrl` quanto o `File` selecionado.
* **Alternativas consideradas:** Fazer o `StorageService` executar o `fetch` direto sem provider; manter o provider sem receber o binario e capturar o arquivo por closure/construtor.
* **Motivo da escolha:** O adapter de provision da `studio` precisa ter todos os dados necessarios para executar o upload direto sem depender de estado externo implícito.
* **Impactos / trade-offs:** O contrato da interface fica um pouco mais explicito, mas continua pequeno e com responsabilidade unica.

* **Decisao:** Prover providers da UI por um `ProvisionContext`, em vez de acoplar essa responsabilidade ao `RestContext`.
* **Alternativas consideradas:** Instanciar o provider no `RestContext`; instanciar o provider diretamente no widget.
* **Motivo da escolha:** Separa dependencias REST de dependencias de provision e preserva a camada UI com composition roots explicitos por responsabilidade.
* **Impactos / trade-offs:** A `studio` ganha um novo contexto global para providers, mas o acoplamento arquitetural fica mais claro.

* **Decisao:** Usar o `fileName` informado pelo client como nome final do arquivo, apos validacao no use case.
* **Alternativas consideradas:** Gerar nome aleatorio no backend; derivar apenas extensao do nome informado.
* **Motivo da escolha:** Mantem o comportamento esperado pelo fluxo atual do widget, em que o usuario informa o nome do arquivo antes do upload.
* **Impactos / trade-offs:** O backend precisa validar estritamente o `fileName` para impedir path traversal, nomes vazios e extensoes invalidas, e precisa consultar o storage antes de emitir a URL para bloquear nomes duplicados.

* **Decisao:** Validar a extensao do `fileName` dentro de `SignedUploadUrl.create(dto)` com base no `folderPath`.
* **Alternativas consideradas:** Validar extensao no schema Zod da borda; validar extensao apenas no use case.
* **Motivo da escolha:** Centraliza a regra semantica no proprio objeto que representa o contrato assinado, como voce pediu.
* **Impactos / trade-offs:** O schema da borda continua validando forma basica do request, enquanto a structure assume a regra de compatibilidade por pasta.

* **Decisao:** Sugerir allowlist inicial de extensoes por `folderPath`.
* **Alternativas consideradas:** Reusar a mesma allowlist para todas as pastas; adiar a definicao completamente.
* **Motivo da escolha:** A feature precisa de um criterio tecnico objetivo para implementar a validacao por pasta sem depender de ambiguidade do PRD.
* **Impactos / trade-offs:** Essa lista e uma sugestao tecnica inicial e pode ser refinada depois com produto.
* **Sugestao de extensoes:**
* `images/story`: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`
* `images/avatars`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/rockets`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/planets`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/achievements`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/rankings`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/insignias`: `.png`, `.jpg`, `.jpeg`, `.svg`
* `images/feedback-reports`: `.png`, `.jpg`, `.jpeg`, `.webp`
* `audios/story`: `.mp3`, `.wav`, `.ogg`
* `database-backups`: `.sql`, `.dump`, `.backup`

* **Decisao:** Usar limite fixo de `5 MB` para uploads de imagem na `studio`.
* **Alternativas consideradas:** Nao definir limite nesta entrega; usar limites diferentes por pasta; validar tamanho apenas no backend.
* **Motivo da escolha:** O componente base de upload ja suporta `maxSize`, e um limite unico reduz ambiguidade e previne upload desnecessario antes da emissao da signed URL.
* **Impactos / trade-offs:** O valor fica decidido nesta spec para imagens do Studio; se houver necessidade de limites distintos por pasta no futuro, a regra precisara ser reaberta.

* **Decisao:** Bloquear o fluxo quando `findFile` indicar que o `fileName` ja existe no `folderPath` solicitado.
* **Alternativas consideradas:** Permitir overwrite com `upsert: true`; emitir signed URL e deixar o conflito acontecer apenas no upload; gerar nome alternativo automaticamente.
* **Motivo da escolha:** O usuario pediu validacao previa com `FileStorageProvider`, e isso preserva um erro deterministico antes do upload binario direto.
* **Impactos / trade-offs:** Ha uma leitura extra no storage antes da emissao da URL assinada e permanece uma pequena janela de corrida entre a checagem e o upload, mitigada por `upsert: false` no provider.

* **Decisao:** Exigir `verifyAuthentication` + `verifyGodAccount` no endpoint de signed upload URL e tambem em `GET /storage/files` e `DELETE /storage/files/:folder/:fileName`.
* **Alternativas consideradas:** Manter remocao via route params; endurecer somente o endpoint novo.
* **Motivo da escolha:** O par de middlewares precisa cobrir todas as rotas administrativas de storage, e a remocao via query params simplifica o contrato compartilhado entre adapters web/studio e controller REST.
* **Impactos / trade-offs:** O endpoint de remocao deixa de usar path params e passa a depender de query params validados na borda.

* **Decisao:** No `PictureInput`, apos upload bem-sucedido, selecionar imediatamente a imagem criada; apos remover a imagem selecionada, voltar para `panda.jpg`; manter o dialog aberto em remocoes.
* **Alternativas consideradas:** Apenas refetchar a lista sem alterar selecao; fechar o dialog apos remocao; limpar a selecao quando a imagem removida era a atual.
* **Motivo da escolha:** O fluxo fica mais previsivel para quem esta editando historias e quizzes, reduz passos manuais e evita perda de contexto no dialog.
* **Impactos / trade-offs:** O seletor assume um fallback visual fixo (`panda.jpg`) quando a imagem selecionada e removida.

* **Decisao:** Reduzir a pagina inicial do `PictureInput` para `12` imagens e pre-carregar thumbnails assim que a primeira pagina chega.
* **Alternativas consideradas:** Manter `30` itens por pagina; otimizar apenas as thumbnails sem reduzir a pagina inicial; adiar otimização do dialog.
* **Motivo da escolha:** Melhora a performance percebida na abertura do dialog com mudanca pequena e localizada, sem alterar o contrato REST ou o layout principal do seletor.
* **Impactos / trade-offs:** Mais paginas podem ser necessarias em bibliotecas grandes, compensadas por abertura inicial mais leve.
* **Alternativas consideradas:** Manter apenas `verifyAuthentication` nas rotas atuais de storage; endurecer somente o endpoint novo.
* **Motivo da escolha:** As mesmas regras de auth devem valer para os endpoints administrativos de storage segundo a definicao mais recente do usuario.
* **Impactos / trade-offs:** Listagem e remocao passam a ter a mesma exigencia de permissao do fluxo de emissao de signed upload URL.

* **Decisao:** Nao criar migration nesta entrega.
* **Alternativas consideradas:** Criar policies/grants de `storage.objects` para signed upload.
* **Motivo da escolha:** A codebase nao contem evidencia de migrations de Storage para o bucket atual e a emissao ocorre pelo server via Supabase SDK; o PRD pede migracao de fluxo de aplicacao, nao alteracao estrutural de banco.
* **Impactos / trade-offs:** A permissao real do bucket/projeto Supabase para `createSignedUploadUrl` e upload via signed URL deve ser validada no ambiente antes do deploy.

---

# 9. Diagramas e Referencias (Obrigatorio)

* **Fluxo de Dados:**

```text
Studio ImageInput
  -> apps/studio StorageService.uploadFile(folder, file)
  -> apps/studio StorageService.createSignedUploadUrl(folder, fileName)
  -> POST /storage/signed-upload-url
  -> StorageRouter
  -> CreateSignedUploadUrlController
  -> CreateSignedUploadUrl.execute({ folderPath, fileName })
  -> FileStorageProvider.findFile(folderPath, fileName)
  -> SupabaseFileStorageProvider.createSignedUploadUrl(folderPath, fileName)
  -> SignedUploadUrl.create({ url, folderPath, fileName }) validates extension
  <- SignedUploadUrlDto { url, folderPath, fileName }
  -> studio SupabaseSignedFileStorageProvider.uploadFile(SignedUploadUrl, File)
  -> Supabase Storage signed URL
  <- upload success
  -> ImageInput.onSubmit(filename)
  -> form state / PictureInput selects uploaded image / PictureInput.refetch()
```

* **Fluxo Cross-app (se aplicavel):**

```text
apps/studio consumes REST from apps/server

[Studio]
  StorageService.createSignedUploadUrl(folderPath, fileName)
      |
      | REST POST /storage/signed-upload-url
      | body: { folderPath: string, fileName: string }
      v
[Server]
  StorageRouter -> CreateSignedUploadUrlController -> CreateSignedUploadUrl
      |
      | validates folderPath on edge
      | validates fileName
      | checks existence with findFile(folderPath, fileName)
      v
[Server]
  SupabaseFileStorageProvider.createSignedUploadUrl(folderPath, fileName)
      |
      | SignedUploadUrl.create validates extension by folderPath
      v
[Supabase Storage]
      |
      | response to Server: signed URL data
      v
[Server]
  response: SignedUploadUrlDto { url, folderPath, fileName }
      |
      v
[Studio]
  SupabaseSignedFileStorageProvider.uploadFile(signedUploadUrl, file)
      |
      | direct HTTP upload to signed URL
      v
[Supabase Storage]

[Web]
  FeedbackDialog remains on legacy REST POST /storage/files/:folder
      |
      v
[Server]
  UploadFileController -> SupabaseFileStorageProvider.upload(folder, file)
```

* **Layout (se aplicavel):**

```text
PictureInput Dialog
  Header: "Selecione uma imagem"
  Toolbar
    Search input
    Selected preview
    Optional clear button
    ImageInput trigger: "Adicionar"
      ImageInput Dialog
        FileUpload
        Image name input
        Submit button with loading
  Content
    Loading state
    Empty state
    PictureCard grid
    LoadMoreButton
```

* **Referencias:**

* `apps/server/src/app/hono/routers/storage/FilesStorageRouter.ts` - router atual de upload/listagem/remocao de arquivos.
* `apps/server/src/app/hono/routers/storage/StorageRouter.ts` - router raiz de storage onde a rota de signed upload URL e registrada.
* `apps/server/src/rest/controllers/storage/UploadFileController.ts` - referencia de controller de storage com provider injetado.
* `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts` - provider que deve encapsular o SDK Supabase.
* `apps/server/src/app/hono/routers/shop/AvatarsRouter.ts` - referencia de rota administrativa de escrita com `verifyAuthentication` e `verifyGodAccount`.
* `apps/studio/src/rest/services/StorageService.ts` - service REST do Studio a migrar.
* `apps/studio/src/provision/storage/SupabaseSignedFileStorageProvider.ts` - provider client-side do upload direto por signed URL.
* `apps/studio/src/ui/global/widgets/components/ImageInput/useImageInput.ts` - ponto central do upload imediato no Studio.
* `apps/studio/src/ui/lesson/widgets/components/PictureInput/usePictureInput.ts` - referencia de listagem paginada e refetch apos upload/remocao.
* `packages/core/src/storage/domain/structures/SignedUploadUrl.ts` - structure do contrato assinado.
* `packages/validation/src/modules/storage/fileStorageFolderPathSchema.ts` - allowlist atual de folders de storage.
* Supabase docs: `https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl` - referencia de `createSignedUploadUrl`.
* Supabase docs: `https://supabase.com/docs/reference/javascript/storage-from-uploadtosignedurl` - referencia de upload usando signed URL.

---

# 10. Pendencias / Duvidas (Quando aplicavel)

**Sem pendencias**.
