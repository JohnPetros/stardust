# Listagem de conquistas

## Objetivo

Listar todas as conquistas cadastradas no sistema em formato de grid na página
de gestão de conquistas.

módulo: `profile`

## Status: ✅ Concluído

### Core

- Use ProfileService: Interface para fazer requisições ao servidor para buscar
  todas as conquistas cadastradas.
- Use AchievementDto: DTO para representar uma conquista.

### Camada REST

- Implementado o método `fetchAllAchievements` na interface `ProfileService`
  para buscar todas as conquistas cadastradas.
  - Arquivo: `apps/studio/src/rest/services/ProfileService.ts`
  - Endpoint: `GET /profile/achievements`

### Camada App

- Criada a página de `AchievementsRoute` para acessar a página de gestão de
  conquistas.
  - Arquivo: `apps/studio/src/app/routes/AchievementsRoute.tsx`
- Rota protegida com o middleware `AuthMiddleware`.
- Implementado `clientLoader` na rota para buscar todas as conquistas
  cadastradas usando o `ProfileService` oriundo do `RestMiddleware`.
- Retornados os dtos das conquistas pelo clientLoader como `achievementsDto`.

### Camada UI

- Criado o componente de página `AchievementsPage`
  - Arquivo:
    `apps/studio/src/ui/profile/widgets/pages/AchievementsPage/index.tsx`
  - Usa `useLoaderData` para buscar dados do `clientLoader`
- Criado o widget `AchievementsGrid` para exibir as conquistas em formato de
  grid dentro de `AchievementsPage`.
  - Arquivo:
    `apps/studio/src/ui/profile/widgets/components/AchievementsGrid/index.tsx`
  - Grid com 4 colunas (não responsivo)
- Criado o widget `AchievementsCard` para exibir cada conquista em formato de
  card dentro de `AchievementsGrid`.
  - Arquivo:
    `apps/studio/src/ui/profile/widgets/components/AchievementsCard/index.tsx`
  - Link do componente Figma:
    https://www.figma.com/design/XRPs85G9W6lx6SsMLcwgo9/stardust?node-id=513-23552&t=Z0UF0LjIeqT5GjvV-4
- Card implementado com:
  - Nome e descrição da conquista
  - Imagem usando `StorageImage` com folder `achievements`
  - Ícone de drag and drop (GripVertical) no lado esquerdo
  - Dois botões de ícone no topo direito: editar e deletar (sem funcionalidade
    implementada ainda)
  - Layout horizontal com imagem, ícone de drag, nome e descrição alinhados

## Próximos Passos (Futuro)

- Implementar funcionalidade de edição de conquistas
- Implementar funcionalidade de exclusão de conquistas
- Implementar drag and drop para reordenar conquistas
