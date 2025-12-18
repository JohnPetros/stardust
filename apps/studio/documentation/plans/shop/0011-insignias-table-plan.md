# Tabela de Insignias

## Objetivo

Implementar funcionalidade de tabela de insignias no sistema na página de gestão de loja.
Isso inclui listar as insígnias.

módulo: `shop`

## Status: Concluído

## Camada Core

- Interface `ShopService` (`packages/core/src/shop/interfaces/ShopService.ts`):
    - Remover duplicidade de `fetchInsigniasList`.
- Entidades já existentes: `Insignia`, `InsigniaDto`.

## Camada REST

- `fetchInsigniasList` já implementado (GET `/shop/insignias`).

## Camada UI

- Widget `InsigniasTable` (`apps/studio/src/ui/shop/widgets/pages/Shop/InsigniasTable`):
    - `index.tsx`: Componente container (Smart Component).
    - `InsigniasTableView.tsx`: Componente visual da tabela.
    - `useInsigniasTable.ts`: Hook para lógica de estado e busca.
    - Deve conter as colunas:
      - Nome
      - Imagem
      - Preço
      - Papel `engineer` (Engenheiro espacial) e `god` (Deus) - Exiba como Badge
      - Ações: Os botões de ação devem estar apenas visíveis, nada de integração com REST.
- Integração:
    - Adicionar aba "Insignias" em `ShopPage` (`apps/studio/src/ui/shop/pages/ShopPage/index.tsx`).

## Fluxo de alto nível

1. **Listagem**:
   - Ao acessar a aba, `useInsigniasTable` chama `shopService.fetchInsigniasList`.
   - Exibe tabela com colunas: Imagem, Nome, Preço, Role, Ações.