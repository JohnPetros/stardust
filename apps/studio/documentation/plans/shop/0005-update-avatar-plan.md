# Atualização de avatar

## Objetivo

Implementar funcionalidade de atualização de avatar no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- [x] Interface `ShopService` possui o método `updateAvatar` para atualizar um avatar.
- [x] `AvatarDto` é usado para representar um avatar.
- [x] `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

### [ShopService](/home/petros/stardust/apps/studio/src/rest/services/ShopService.ts)

- [x] Implementar o método `updateAvatar` no service `ShopService`.
  - Deve realizar uma chamada `PUT` para o endpoint `/shop/avatars/:id`.

## Camada UI

### [AvatarsTableView](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/AvatarsTable/AvatarsTableView.tsx)

- [x] Usar widget de formulário `AvatarForm` para atualizar um avatar.
- [x] O formulário deve ser preenchido com os dados do avatar existente usando `initialValues`.
- [x] Passar `handleUpdateAvatar` como `onSubmit`.

### [useAvatarsTable](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/AvatarsTable/useAvatarsTable.ts)

- [x] Implementar `handleUpdateAvatar`.
- [x] Chamar `shopService.updateAvatar`.
- [x] Tratar sucesso/erro com `toastProvider`.
- [x] **Em caso de erro, remover a imagem antiga do storage usando `removeImageFile`**.
- [x] **Em caso de sucesso, remover a imagem antiga do storage usando `removeImageFile`**.
- [x] Exibir loading na tabela enquanto o avatar é atualizado.
- [x] Fazer refetch dos dados da tabela ao atualizar o avatar.

### Fluxo de usuário

1. Acessar a página de listagem de avatares.
2. Clicar no botão "Editar" de um avatar existente.
3. O formulário abrirá com os dados atuais preenchidos.
4. Modificar os campos desejados (nome, preço, imagem, etc.).
5. Clicar em "Salvar".
6. Verificar se o toast de sucesso aparece.
7. Verificar se a tabela atualiza com os novos dados.
