# Deleção de Conquista

## Objetivo

Implementar funcionalidade de deleção de conquistas existentes.

módulo: `profile`

## Status: Concluído

### Core

- Interface `ProfileService` já possuía o método `deleteAchievement` para deletar uma conquista existente.
- `AchievementDto` é usado para representar uma conquista.

### Camada REST

- Implementado o método `deleteAchievement` no `ProfileService` (`apps/studio/src/rest/services/ProfileService.ts`) que utiliza `restClient.delete` para fazer requisição ao endpoint `/profile/achievements/:id`.

### Camada UI

- Implementado modal de confirmação no componente `AchievementsCardView` (`apps/studio/src/ui/profile/widgets/components/AchievementsCard/AchievementsCardView.tsx`) utilizando `AlertDialog` do shadcn.
- O modal exibe o título "Deletar Conquista" e a descrição "Tem certeza que deseja deletar a conquista?" com os botões "Cancelar" e "Deletar".
- Implementado o método `handleDelete` no hook `useAchievementsPage` (`apps/studio/src/ui/profile/widgets/pages/AchievementsPage/useAchievementsPage.ts`) que:
  - Cria um `Id` a partir do `achievement.id`
  - Chama `profileService.deleteAchievement` para deletar a conquista
  - Em caso de sucesso: recarrega a página usando `uiProvider.reload()`
  - Em caso de erro: exibe mensagem de erro via `toastProvider.showError()`
- Ao clicar no botão "Cancelar", o modal é fechado automaticamente pelo `AlertDialog`.
- Ao clicar no botão "Deletar", o método `onDelete` é executado, que por sua vez chama `handleDelete` do hook.
