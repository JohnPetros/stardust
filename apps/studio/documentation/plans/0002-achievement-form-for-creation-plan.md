# Formulário de Conquista para Criação

## Objetivo

Criar um formulário de conquista para criação de uma nova conquista.

módulo: `profile`

## Status: Concluído

### Core

- Use ProfileService: Interface para fazer requisições ao servidor para buscar
  todas as conquistas cadastradas.
- Use AchievementDto: DTO para representar uma conquista.

### Camada REST

- Implementado o método `createAchievement` no `ProfileService` do Studio (`apps/studio/src/rest/services/ProfileService.ts`).
  - Realiza POST para `/profile/achievements` com `achievement.dto` como body.
  - Retorna `Promise<RestResponse<AchievementDto>>`.

### Camada UI

- Criado o formulário de criação de conquista `AchievementForm` dentro do widget `AchievementsPage`.
  - Localização: `apps/studio/src/ui/profile/widgets/pages/AchievementsPage/AchievementForm/`
  - Arquivos criados:
    - `index.tsx`: Componente container que integra hook e view
    - `AchievementFormView.tsx`: Componente visual do formulário
    - `useAchievementForm.ts`: Hook com lógica do formulário
- Formulário exibido em um modal (Dialog) com os seguintes campos:
  - Nome da conquista (Input)
  - Ícone da conquista (ImageInput com upload para pasta `achievements`)
  - Descrição da conquista (Textarea)
  - Recompensa da conquista (Input numérico)
  - Contagem mínima exigida (Input numérico)
  - Métrica da conquista (Select com opções em PT-BR):
    - `unlockedStarsCount` → "Estrelas Desbloqueadas"
    - `acquiredRocketsCount` → "Foguetes Adquiridos"
    - `completedChallengesCount` → "Desafios Completados"
    - `completedPlanetsCount` → "Planetas Completados"
    - `xp` → "XP"
    - `streak` → "Streak (Dias seguidos)"
- Validação implementada usando `achievementSchema` do pacote `@stardust/validation` com react-hook-form.
- Hook `useAchievementForm` criado e utilizado dentro do widget `AchievementForm`.
- Criado hook `useAchievementsPage` (`apps/studio/src/ui/profile/widgets/pages/AchievementsPage/useAchievementsPage.ts`):
  - Implementa `handleCreateAchievement` que:
    - Calcula automaticamente a posição (`achievements.length + 1`)
    - Cria entidade `Achievement` usando `Achievement.create()`
    - Chama `profileService.createAchievement()`
    - Usa `uiProvider.reload()` em caso de sucesso
    - Exibe erro via `toastProvider` em caso de falha
- Integração na `AchievementsPageView`:
  - Botão "Adicionar Conquista" adicionado no cabeçalho da página
  - Botão funciona como trigger do modal do formulário
  - Handler `onCreateAchievement` conectado ao formulário
- Componente `Textarea` criado em `apps/studio/src/ui/shadcn/components/textarea.tsx` para uso no campo de descrição.