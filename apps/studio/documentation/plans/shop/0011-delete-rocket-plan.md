# Deleção de foguete

## Objetivo

Implementar funcionalidade de deleção de foguete no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- [x] Interface `ShopService` possui o método `deleteRocket` para deletar um foguete.
- [x] `Rocket` é a entidade usada para representar um foguete.
- [x] `RocketDto` é o DTO usado para criar uma entidade foguete.
- [x] `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

### [ShopService](/home/petros/stardust/apps/studio/src/rest/services/ShopService.ts)

- [x] Implementar o método `deleteRocket` no service `ShopService`.
  - Deve realizar uma chamada `DELETE` para o endpoint `/shop/rockets/:id`.

## Camada UI

### [RocketsTableView](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/RocketsTable/RocketsTableView.tsx)

- [x] Importar e adicionar `AlertDialog` (deve ser criado/importado de components) para confirmação de deleção.
- [x] Passar prop `onDeleteRocket` do tipo `(id: string) => Promise<void>`.
- [x] O botão de excluir deve abrir o `AlertDialog`.
- [x] Ao confirmar, chamar `onDeleteRocket`.

### [useRocketsTable](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/Shop/RocketsTable/useRocketsTable.ts)

- [x] Implementar `handleDeleteRocket`.
- [x] Chamar `shopService.deleteRocket`.
- [x] Tratar sucesso/erro com `toastProvider`.
- [x] Recarregar a lista após sucesso.

## Plano de Verificação

### Verificação Manual

1. Acessar a página de listagem de foguetes.
2. Clicar no botão "Excluir" de um foguete existente.
3. Verificar se o dialog de confirmação é exibido.
4. Clicar em "Cancelar" e verificar se nada acontece e o dialog fecha.
5. Clicar em "Excluir" novamente e confirmar.
6. Verificar se o toast de sucesso aparece.
7. Verificar se o foguete foi removido da lista (lista atualizada).