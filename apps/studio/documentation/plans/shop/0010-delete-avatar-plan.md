# Deleção de avatar

## Objetivo

Implementar funcionalidade de deleção de avatar no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- [x] Interface `ShopService` possui o método `deleteAvatar` para deletar um avatar.
- [x] `Avatar` é a entidade usada para representar um avatar.
- [x] `AvatarDto` é o DTO usado para criar uma entidade avatar.
- [x] `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

### [ShopService](/home/petros/stardust/apps/studio/src/rest/services/ShopService.ts)

- [x] Implementar o método `deleteAvatar` no service `ShopService`.
  - Deve realizar uma chamada `DELETE` para o endpoint `/shop/avatars/:id`.

## Camada UI

### [AvatarsTableView](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/AvatarsTable/AvatarsTableView.tsx)

- [x] Importar e adicionar `AlertDialog` (deve ser criado/importado de components) para confirmação de deleção.
- [x] Passar prop `onDeleteAvatar` do tipo `(id: string, imageName: string) => Promise<void>`.
- [x] O botão de excluir deve abrir o `AlertDialog`.
- [x] Ao confirmar, chamar `onDeleteAvatar` passando o `id` e o `imageName` do avatar.

### [useAvatarsTable](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/AvatarsTable/useAvatarsTable.ts)

- [x] Implementar `handleDeleteAvatar`.
- [x] Primeiro, remover a imagem do avatar do storage usando `storageService.removeFile`.
- [x] Em caso de erro na remoção da imagem, exibir toast de erro e interromper o processo.
- [x] Chamar `shopService.deleteAvatar`.
- [x] Tratar sucesso/erro com `toastProvider`.
- [x] Recarregar a lista após sucesso.

### Fluxo de usuário

1. Acessar a página de listagem de avatares.
2. Clicar no botão "Excluir" de um avatar existente.
3. Verificar se o dialog de confirmação é exibido.
4. Clicar em "Cancelar" e verificar se nada acontece e o dialog fecha.
5. Clicar em "Excluir" novamente e confirmar.
6. Verificar se o toast de sucesso aparece.
7. Verificar se o avatar foi removido da lista (lista atualizada).