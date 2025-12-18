# Atualização de foguete

## Objetivo

Implementar funcionalidade de atualização de foguete no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- [x] Interface `ShopService` possui o método `updateRocket` para atualizar um foguete.
- [x] `RocketDto` é usado para representar um foguete.
- [x] `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

### [ShopService](/home/petros/stardust/apps/studio/src/rest/services/ShopService.ts)

- [x] Implementar o método `updateRocket` no service `ShopService`.
  - Deve realizar uma chamada `PUT` para o endpoint `/shop/rockets/:id`.

## Camada UI

### [RocketsTableView](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/RocketsTable/RocketsTableView.tsx)

- [x] Usar widget de formulário `RocketForm` para atualizar um foguete.
- [x] O formulário deve ser preenchido com os dados do foguete existente usando `initialValues`.
- [x] Passar `handleUpdateRocket` como `onSubmit`.

### [useRocketsTable](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/RocketsTable/useRocketsTable.ts)

- [x] Implementar `handleUpdateRocket`.
- [x] Chamar `shopService.updateRocket`.
- [x] Tratar sucesso/erro com `toastProvider`.
- [x] **Em caso de erro, remover a imagem antiga do storage usando `removeImageFile`**.
- [x] **Em caso de sucesso, remover a imagem antiga do storage usando `removeImageFile`**.
- [x] Exibir loading na tabela enquanto o foguete é atualizado.
- [x] Fazer refetch dos dados da tabela ao atualizar o foguete.

### Fluxo de usuário

1. Acessar a página de listagem de foguetes.
2. Clicar no botão "Editar" de um foguete existente.
3. O formulário abrirá com os dados atuais preenchidos.
4. Modificar os campos desejados (nome, preço, imagem, etc.).
5. Clicar em "Salvar".
6. Verificar se o toast de sucesso aparece.
7. Verificar se a tabela atualiza com os novos dados.