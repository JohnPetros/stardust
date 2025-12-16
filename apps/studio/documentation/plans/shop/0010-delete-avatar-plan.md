# Deleção de avatar

## Objetivo

Implementar funcionalidade de deleção de avatar no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Em andamento

### Camada Core

- [ ] Interface `ShopService` possui o método `deleteAvatar` para deletar um avatar.
- `Avatar` é a entidade usada para representar um avatar.
- `AvatarDto` é o DTO usado para criar uma entidade avatar.
- `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

- [ ] Implemente o método `deleteAvatar` no service `ShopService`.
  - O método deve chamar `restClient.delete('/shop/avatars/${id}')` (verificar convenção de URL).

### Camada UI

- [ ] `AvatarsTableView.tsx`:
  - Adicionar prop `onDeleteAvatar`.
  - Utilizar `AlertDialog` (do shadcn) para confirmação de exclusão.
  - Conectar o botão "Excluir" para abrir o dialog.
  - O dialog deve ter "Cancelar" e "Deletar".

- [ ] `useAvatarsTable.ts`:
  - Implementar `handleDeleteAvatar`.
  - Chamar `shopService.deleteAvatar`.
  - Gerenciar sucesso/erro com `toastProvider`.
  - Chamar `refetch()` após sucesso para atualizar a lista.

- [ ] `index.tsx` (Wrapper):
  - Passar `handleDeleteAvatar` do hook para a view.

## Verificação

- **Confirmação Visual**: O dialog aparece antes de deletar?
- **Feedback**: O toast de sucesso/erro aparece?
- **Atualização**: A lista atualiza automaticamente após a deleção?