# Plano de Implementação: CRUD de Conquistas
> **Objetivo:** Implementar as rotas de criação, atualização e remoção (`CRUD`) de conquistas no módulo `profile` da aplicação server.

---

### 1. Validação (`packages/validation`) 🛡️
*Garantir a integridade dos dados recebidos nas requisições.*

- **Criar Schema Zod:**
  Arquivo: `packages/validation/src/modules/profile/achievementSchema.ts`
  - Criar o schema para `AchievementDto`.
  - **Campos obrigatórios:** `name`, `icon`, `reward`, `description`, `metric`, `position`, `requiredCount`.
  - **Campos opcionais:** `id`.
- **Exportar Schema:**
  Arquivo: `packages/validation/src/modules/profile/index.ts`
  - Adicionar a exportação do novo `achievementSchema`.

### 2. Core (`packages/core`) 🧠
*Expor as regras de negócio para uso no servidor.*

- **Exportar Use Cases:**
  Arquivo: `packages/core/src/profile/use-cases/index.ts`
  - Certificar-se de exportar as seguintes classes:
    - `CreateAchievementUseCase`
    - `UpdateAchievementUseCase`
    - `DeleteAchievementUseCase`

### 3. Banco de Dados (`apps/server`) 🗄️
*Implementar a persistência no repositório Supabase.*

- **Atualizar Repositório:**
  Arquivo: `apps/server/src/database/supabase/repositories/profile/SupabaseAchievementsRepository.ts`
  - Implementar os métodos de escrita:
    - `add(achievement: Achievement)`: Inserir nova conquista.
    - `replace(achievement: Achievement)`: Atualizar conquista existente.
    - `remove(achievement: Achievement)`: Remover conquista.

### 4. REST API (`apps/server`) 🌐
*Configuração de rotas e controladores (Hono).*

#### **Controllers**
Criar os arquivos em `apps/server/src/rest/controllers/profile/achievements/`:

- **Create:** `CreateAchievementController.ts` (Manipular `POST /achievements`)
- **Update:** `UpdateAchievementController.ts` (Manipular `PUT /achievements/:achievementId`)
- **Delete:** `DeleteAchievementController.ts` (Manipular `DELETE /achievements/:achievementId`)

#### **Router**
Atualizar `apps/server/src/app/hono/routers/profile/AchievementsRouter.ts`:

- **Imports:** Importar os novos *controllers* e *schemas*.
- **Método Create:** `createAchievementRoute()`
  - Rota `POST` com validação de `body`.
- **Método Update:** `updateAchievementRoute()`
  - Rota `PUT` com validação de `param` e `body`.
- **Método Delete:** `deleteAchievementRoute()`
  - Rota `DELETE` com validação de `param`.
- **Registro:** Adicionar as novas rotas ao método `registerRoutes()`.