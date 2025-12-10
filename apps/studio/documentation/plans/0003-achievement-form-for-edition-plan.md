# Formulário de Conquista para Edição

## Objetivo

Implementar funcionalidade de edição de conquistas existentes através de um formulário modal que permite atualizar os dados de uma conquista cadastrada no sistema.

módulo: `profile`

## Status: Concluído

### Core

- Interface `ProfileService` já possuía o método `updateAchievement` para atualizar uma conquista existente.
- `AchievementDto` é usado para representar uma conquista.

### Camada REST

- Implementado o método `updateAchievement` no `ProfileService` (`apps/studio/src/rest/services/ProfileService.ts`) que utiliza `restClient.put` para fazer requisição ao endpoint `/profile/achievements/:id`.

### Camada UI

- **AchievementForm movido**: O componente `AchievementForm` foi movido de `pages/AchievementsPage/AchievementForm` para `widgets/components/AchievementForm` para permitir reutilização.

- **AchievementForm atualizado**:
  - Aceita prop opcional `achievementDto` para modo de edição.
  - Inicializa o formulário com valores do `achievementDto` quando presente (modo edição).
  - Título do diálogo muda dinamicamente: "Adicionar conquista" (criação) ou "Editar conquista" (edição).
  - Botão de submit muda dinamicamente: "Criar" (criação) ou "Salvar" (edição).
  - Lógica de limpeza de imagem preserva imagens existentes (não deleta se for a mesma imagem inicial).

- **AchievementsCard atualizado**:
  - Botão de edição agora envolve o `AchievementForm` passando o `achievementDto`.
  - Prop `onEdit` substituída por `onUpdate` que recebe os dados do formulário.

- **AchievementsPageView atualizado**:
  - Lista `AchievementsCard` diretamente em um grid (sem usar `AchievementsGrid`).
  - Propaga `onUpdate` para cada card.

- **useAchievementsPage atualizado**:
  - Implementado `handleUpdate` que:
    - Recebe o `achievement` e os dados do formulário.
    - Cria uma entidade `Achievement` com os dados atualizados (preservando `id` e `position`).
    - Chama `profileService.updateAchievement`.
    - Exibe mensagem de erro via `toastProvider` em caso de falha.
    - Recarrega a página via `uiProvider` em caso de sucesso.

- **Validação**: O formulário utiliza `react-hook-form` com `zodResolver` e o schema `achievementSchema` (omitting `id` e `position`).
