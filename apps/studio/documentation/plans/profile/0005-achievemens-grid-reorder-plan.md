# Reordenamento de Conquistas (Grid)

## Objetivo

Implementar funcionalidade de reordenamento de conquistas existentes no grid.

módulo: `profile`

## Status: Concluído

### Core

- Interface `ProfileService` já possuía o método `reorderAchievements` para reordenar conquistas existentes.
- `AchievementDto` é usado para representar uma conquista.

### Camada REST

- Implementado o método `reorderAchievements` no `ProfileService` (`apps/studio/src/rest/services/ProfileService.ts`)
  - Endpoint: `PATCH /profile/achievements/order`
  - Recebe um array de IDs de conquistas na ordem desejada

### Camada UI

- Criado o widget `SortableGrid` (`apps/studio/src/ui/global/widgets/components/SortableGrid/`) inspirado no widget `Sortable` existente
  - `SortableGridContainer`: Container que utiliza `rectSortingStrategy` do `@dnd-kit/sortable` para layouts em grid
  - `SortableGridItem`: Item do grid com handle de arraste posicionado no lado esquerdo (verticalmente centralizado)
  - Tipos e estrutura seguindo o padrão do `Sortable` existente
- Implementado o handler `handleDragEnd` no hook `useAchievementsPage`:
  - Chama o método `reorderAchievements` do `ProfileService` com os IDs das conquistas reordenadas
  - Atualiza a interface com `uiProvider.reload()` em caso de sucesso
  - Exibe erro com `toastProvider.showError()` em caso de falha
  - Mapeia `achievementsDto` para o formato `SortableItem<AchievementDto>[]`
- Atualizado `AchievementsPageView` para usar `SortableGrid.Container` e envolver os `AchievementsCard` com `SortableGrid.Item`
- Atualizado `AchievementsPage` para passar os novos props (`achievements` e `handleDragEnd`)	