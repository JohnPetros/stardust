# Deleção de insígnia

## Objetivo

Implementar funcionalidade de deleção de insígnia no sistema na página de
gestão de loja.

módulo: `shop`

## Status: Concluído

### Camada Core

- [x] Interface `ShopService` possui o método `deleteInsignia` para deletar uma insígnia.
- [x] `Insignia` é a entidade usada para representar uma insígnia.
- [x] `ToastProvider` é usado para exibir mensagens de sucesso ou erro.

## Camada REST

### [ShopService](/home/petros/stardust/apps/studio/src/rest/services/ShopService.ts)

- [x] Implementar o método `deleteInsignia` no service `ShopService`.
  - Deve realizar uma chamada `DELETE` para o endpoint `/shop/insignias/:id`.

## Camada UI

### [InsigniasTableView](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/InsigniasPage/InsigniasTable/InsigniasTableView.tsx)

- [x] Importar e adicionar `AlertDialog` (deve ser criado/importado de components) para confirmação de deleção.
- [x] Passar prop `onDeleteInsignia` do tipo `(id: string, imageName: string) => Promise<void>`.
- [x] O botão de excluir deve abrir o `AlertDialog`.
- [x] Ao confirmar, chamar `onDeleteInsignia` passando o `id` e o `imageName` da insígnia.

### [useInsigniasTable](/home/petros/stardust/apps/studio/src/ui/shop/widgets/pages/InsigniasPage/InsigniasTable/useInsigniasTable.ts)

- [x] Implementar `handleDeleteInsignia`.
- [x] Chamar `shopService.deleteInsignia`.
- [x] Tratar sucesso/erro com `toastProvider`.
- [x] Em caso de erro, remover a imagem da insígnia do storage usando `removeImageFile`.
- [x] Recarregar a lista após sucesso.

### Fluxo de usuário

1. Acessar a página de listagem de insígnias.
2. Clicar no botão "Excluir" de uma insígnia existente.
3. Verificar se o dialog de confirmação é exibido.
4. Clicar em "Cancelar" e verificar se nada acontece e o dialog fecha.
5. Clicar em "Excluir" novamente e confirmar.
6. Verificar se o toast de sucesso aparece.
7. Verificar se a insígnia foi removida da lista (lista atualizada).