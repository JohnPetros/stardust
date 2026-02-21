---
title: Endpoint de geração de arquivo XLSX de usuários
prd: documentation/features/profile/users-management/prd.md
app: server
status: concluido
last_updated_at: 2026-02-20
---

# 1. Objetivo (Obrigatório)

Implementar a exportação administrativa de usuários em XLSX via `GET /profile/users/xlsx` no server e disponibilizar a ação de download na página de usuários do Studio, com autenticação/autorização de admin, geração de planilha no backend e download do arquivo no frontend.

---

# 2. Escopo (Obrigatório)

## 2.1 In-scope

- Criar endpoint de exportação XLSX em `UsersRouter`.
- Aplicar `verifyAuthentication` e `verifyGodAccount` na rota.
- Buscar todos os usuários sem filtros e ordenar por criação (mais novos primeiro).
- Gerar arquivo XLSX com colunas operacionais e nome padrão `users-export-YYYY-MM-DD.xlsx`.
- Expor ação no Studio para baixar o arquivo ao clique.
- Adicionar suporte de cliente REST para download de arquivo binário com nome extraído de header.

## 2.2 Out-of-scope

- Qualquer formato diferente de XLSX.
- Processamento assíncrono por fila para exportação.
- Ajustes/cobertura de novos testes automatizados desta feature.

---

# 3. Requisitos (Obrigatório)

## 3.1 Funcionais

- Expor rota `GET /profile/users/xlsx` em profile/users.
- Restringir acesso a conta admin.
- Exportar todos os usuários (sem query params de filtro).
- Ordenar usuários por `createdAt` decrescente (mais recentes primeiro).
- Gerar planilha com colunas:
  - `userId`
  - `Nome`
  - `Nível`
  - `XP Semanal`
  - `Estrelas Desbloqueadas`
  - `Conquistas Desbloqueadas`
  - `Desafios Completados`
  - `Status do Espaço`
  - `Insígnias`
  - `Data de Criação`
- Disponibilizar botão de download na página de usuários do Studio.

## 3.2 Não funcionais

- **Segurança:** endpoint protegido por autenticação/autorização.
- **Compatibilidade:** `Content-Type` XLSX + `Content-Disposition` para download.
- **Resiliência:** fallback de nome/tipo no frontend quando header não estiver disponível.

---

# 4. O que já existe? (Obrigatório)

## Camada Hono App (Routes)

- **`UsersRouter`** (`apps/server/src/app/hono/routers/profile/UsersRouter.ts`) - Router de profile/users.
- **`AuthMiddleware`** (`apps/server/src/app/hono/middlewares/AuthMiddleware.ts`) - Controle de autenticação e conta admin.

## Camada REST (Controllers)

- **`FetchUsersListController`** (`apps/server/src/rest/controllers/profile/users/FetchUsersListController.ts`) - Referência de padrão de controller no módulo.

## Camada Banco de Dados (Repositories)

- **`UsersRepository`** (`packages/core/src/profile/interfaces/UsersRepository.ts`) - Contrato com `findAll()`.
- **`SupabaseUsersRepository`** (`apps/server/src/database/supabase/repositories/profile/SupabaseUsersRepository.ts`) - Implementação concreta.

## Camada Provision (Providers)

- **`XlsxProvider`** (`packages/core/src/global/interfaces/provision/XlsxProvider.ts`) - Contrato para geração de XLSX.

## Camada UI (Widgets)

- **`UsersPage`** (`apps/studio/src/ui/profile/widgets/pages/Users/index.tsx`) - Entrada da página de usuários.
- **`useUsersPage`** (`apps/studio/src/ui/profile/widgets/pages/Users/useUsersPage.ts`) - Estado e ações da página.
- **`UsersPageView`** (`apps/studio/src/ui/profile/widgets/pages/Users/UsersPageView.tsx`) - Layout e componentes visuais.

---

# 5. O que deve ser criado? (Depende da tarefa)

## Camada Provision (Providers)

- **Localização:** `apps/server/src/provision/xlsx/ExcelJsXlsxProvider.ts` (**novo arquivo**)
- **Dependências:** `exceljs`, `Datetime`, `User`
- **Biblioteca:** `exceljs`
- **métodos:** `generateUsersFile(users: User[]): Promise<File>`

- **Localização:** `apps/server/src/provision/xlsx/index.ts` (**novo arquivo**)
- **Dependências:** Não aplicável
- **Biblioteca:** Não aplicável
- **métodos:** exportar `ExcelJsXlsxProvider`.

## Camada REST (Controllers)

- **Localização:** `apps/server/src/rest/controllers/profile/users/GenerateUsersXlsxFileController.ts` (**novo arquivo**)
- **Dependências:** `UsersRepository`, `XlsxProvider`
- **Dados de request:** Não aplicável
- **Dados de response:** stream de arquivo XLSX
- **Métodos:** `handle(http: Http): Promise<RestResponse>`

## Camadas não aplicáveis

- **Camada REST (Services):** Não aplicável.
- **Camada Banco de Dados (Mappers):** Não aplicável.
- **Camada Banco de Dados (Types):** Não aplicável.
- **Pacote Validation (Schemas):** Não aplicável.
- **Camada RPC (Actions):** Não aplicável.
- **Camada UI (Stores):** Não aplicável.
- **Camada UI (Contexts):** Não aplicável.
- **Camada AI (Workflows):** Não aplicável.
- **Camada AI (Tools):** Não aplicável.
- **Camada Inngest App (Functions):** Não aplicável.
- **Camada Next.js App (Pages, Layouts):** Não aplicável.
- **Camada React Router App (Pages, Layouts):** Não aplicável.

---

# 6. O que deve ser modificado? (Depende da tarefa)

## Camada REST

- **Arquivo:** `apps/server/src/rest/controllers/profile/users/index.ts`
- **Mudança:** Exportar `GenerateUsersXlsxFileController`.
- **Justificativa:** Disponibilizar controller no módulo.
- **Camada:** `rest`

- **Arquivo:** `apps/server/src/app/hono/routers/profile/UsersRouter.ts`
- **Mudança:** Registrar `GET /profile/users/xlsx` com middlewares admin e controller.
- **Justificativa:** Expor endpoint de exportação.
- **Camada:** `rest`

## Camada Provision

- **Arquivo:** `apps/server/package.json`
- **Mudança:** Adicionar `exceljs`.
- **Justificativa:** Dependência de geração XLSX.
- **Camada:** `provision`

## Camada Core

- **Arquivo:** `packages/core/src/global/interfaces/rest/RestClient.ts`
- **Mudança:** Adicionar `getFile(url: string): Promise<RestResponse<File>>`.
- **Justificativa:** Suporte tipado para downloads binários.
- **Camada:** `core`

- **Arquivo:** `packages/core/src/profile/interfaces/ProfileService.ts`
- **Mudança:** Adicionar `fetchUsersXlsxFile()`.
- **Justificativa:** Expor contrato de download para Studio/Web.
- **Camada:** `core`

## Camada UI

- **Arquivo:** `apps/studio/src/rest/axios/AxiosRestClient.ts`
- **Mudança:** Implementar `getFile` (blob + nome por `Content-Disposition`).
- **Justificativa:** Download de arquivo via cliente REST.
- **Camada:** `ui`

- **Arquivo:** `apps/studio/src/rest/services/ProfileService.ts`
- **Mudança:** Implementar `fetchUsersXlsxFile`.
- **Justificativa:** Conectar UI ao endpoint de exportação.
- **Camada:** `ui`

- **Arquivo:** `apps/studio/src/ui/profile/widgets/pages/Users/useUsersPage.ts`
- **Mudança:** Adicionar `handleUsersXlsxFileDownload` + estado de loading + fallback de extensão `.xlsx`.
- **Justificativa:** Permitir download seguro no clique.
- **Camada:** `ui`

- **Arquivo:** `apps/studio/src/ui/profile/widgets/pages/Users/UsersPageView.tsx`
- **Mudança:** Adicionar botão `Baixar XLSX`.
- **Justificativa:** Ação visível de exportação na tela.
- **Camada:** `ui`

- **Arquivo:** `apps/studio/src/ui/global/contexts/RestContext/useRestContextProvider.ts`
- **Mudança:** Aplicar header `Authorization` de forma síncrona na inicialização.
- **Justificativa:** Evitar requisição inicial sem token e erro de autorização no load.
- **Camada:** `ui`

## Camada Web (compatibilidade de contrato)

- **Arquivo:** `apps/web/src/rest/next/NextRestClient.ts`
- **Mudança:** Implementar `getFile`.
- **Justificativa:** Manter aderência ao contrato `RestClient` compartilhado.
- **Camada:** `ui`

- **Arquivo:** `apps/web/src/rest/services/ProfileService.ts`
- **Mudança:** Implementar `fetchUsersXlsxFile`.
- **Justificativa:** Manter aderência ao contrato `ProfileService` compartilhado.
- **Camada:** `ui`

- **Arquivo:** `apps/server/src/rest/axios/AxiosRestClient.ts`
- **Mudança:** Implementar `getFile`.
- **Justificativa:** Manter aderência ao contrato `RestClient` compartilhado.
- **Camada:** `rest`

---

# 7. O que deve ser removido? (Depende da tarefa)

**Não aplicável**.

---

# 8. Decisões Técnicas e Trade-offs (Obrigatório)

- **Decisão**
  Exportação exclusivamente em XLSX.
- **Alternativas consideradas**
  CSV.
- **Motivo da escolha**
  Decisão de produto para esta entrega.
- **Impactos / trade-offs**
  Menos flexibilidade de formato.

- **Decisão**
  Orquestração no controller (sem use case dedicado).
- **Alternativas consideradas**
  Criar use case no core.
- **Motivo da escolha**
  Simplificação por diretriz explícita.
- **Impactos / trade-offs**
  Menos camadas, maior acoplamento do controller.

- **Decisão**
  Incluir fallback de nome/tipo no download frontend.
- **Alternativas consideradas**
  Confiar exclusivamente em headers.
- **Motivo da escolha**
  Corrigir casos de download com extensão `.bin`.
- **Impactos / trade-offs**
  Pequena lógica extra no hook da página.

---

# 9. Diagramas e Referências (Obrigatório)

- **Fluxo de Dados:**

```ascii
[Studio Users Page]
   | click "Baixar XLSX"
   v
[useUsersPage]
   | profileService.fetchUsersXlsxFile()
   v
[AxiosRestClient.getFile]
   | GET /profile/users/xlsx
   v
[UsersRouter]
   | Auth + GodAccount
   v
[GenerateUsersXlsxFileController]
   | usersRepository.findAll() + sort(createdAt desc)
   | xlsxProvider.generateUsersFile(users)
   v
[ExcelJsXlsxProvider]
   | workbook -> File(.xlsx)
   v
[HTTP Response stream]
   | Content-Type + Content-Disposition
   v
[Browser download]
```

- **Layout (se aplicável):**

```ascii
UsersPage
 ├─ Header (Título + descrição)
 ├─ Botão "Baixar XLSX"
 ├─ Filtros/listagem existentes
 ├─ UsersTable
 └─ Pagination
```

- **Referências:**
  - `apps/server/src/app/hono/routers/profile/UsersRouter.ts`
  - `apps/server/src/rest/controllers/profile/users/GenerateUsersXlsxFileController.ts`
  - `apps/server/src/provision/xlsx/ExcelJsXlsxProvider.ts`
  - `apps/studio/src/ui/profile/widgets/pages/Users/useUsersPage.ts`
  - `apps/studio/src/ui/profile/widgets/pages/Users/UsersPageView.tsx`
  - `apps/studio/src/rest/axios/AxiosRestClient.ts`

---

# 10. Pendências / Dúvidas (Quando aplicável)

**Sem pendências**.
