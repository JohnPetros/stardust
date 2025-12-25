# Endpoints para CRUD de Guias

## Core

- `GuidesRepository`, interface para o repositório de guias
- `Guide`, entidade de guia
- `GuideDto`, DTO para a criação da entidade guia
- `CreateGuideUseCase`, use case para a criação de guias

- `DeleteGuideUseCase`, use case para a exclusão de guias

## Camada REST

### `CreateGuideController`

- Crie o controller cujo o body seja o `GuideDto`
- Retorne o `GuideDto` criado
- Registre no `GuidesRouter` a rota POST `/guides`

### `EditGuideTitleController`

- Crie o controller cujo o body seja o `{ guideTitle: string }`
- Retorne o `GuideDto` atualizado
- Registre no `GuidesRouter` a rota PATCH `/guides/title/:guideId`

### `EditGuideContentController`

- Crie o controller cujo o body seja o `{ guideContent: string }`
- Retorne o `GuideDto` atualizado
- Registre no `GuidesRouter` a rota PATCH `/guides/content/:guideId`

### `DeleteGuideController`

- Crie o controller cujo o body seja o `GuideDto`
- Não retorne nada
- Registre no `GuidesRouter` a rota DELETE `/guides/:id`

### `ReorderGuidesController`

- Crie o controller cujo o body seja o `GuideDto`
- Não retorne nada
- Registre no `GuidesRouter` a rota POST `/guides/reorder`

## Validation

- Crie o zod schema para o `GuideDto`, criando também o `guideCategorySchema`


