---
title: Insígnia "God" na página da loja
prd: documentation/features/shop/shop-page/prd.md
apps: web, server
status: closed
last_updated_at: 2026-02-28
---

## 🐛 Bug Report: Insígnia "God" Exibida Incorretamente na Página da Loja

**Problema Identificado:**
A insígnia com role `"god"` está sendo exibida na listagem da página da loja (`/shop`), tornando-a
visualmente disponível para compra. Esta insígnia é uma distinção especial concedida apenas por
critérios específicos do sistema (ex: contas administrativas) e não deveria aparecer como um item
adquirível por qualquer usuário na loja.

**Causas:**
- Ausência de critério de filtragem em todas as camadas da stack: a insígnia `"god"` é armazenada
  na tabela `insignias` junto com insígnias compráveis comuns, e nenhuma camada (DB, repositório,
  controller, serviço REST ou UI) aplica filtro para excluí-la da listagem pública da loja.
- A entidade `Insignia` não possui propriedade que sinalize se um item pode ou não ser adquirido
  via loja (ausência de `isPurchasable` ou similar).
- O repositório utiliza `findAll()` sem discriminação de tipo ou disponibilidade, e o
  `FetchInsigniasListController` expõe toda a coleção retornada diretamente ao cliente.

**Contexto e Análise:**

### Camada Core (Domínio)

- Arquivo: `packages/core/src/global/domain/structures/InsigniaRole.ts`
- Diagnóstico: O value-object `InsigniaRole` define os dois valores válidos de role (`'engineer'`
  e `'god'`) e expõe getters `isGod` e `isEngineer`. Essa distinção existe no domínio, mas não é
  utilizada em nenhum lugar para restringir a disponibilidade de venda na loja. A semântica de
  "comprável" simplesmente não foi modelada.

- Arquivo: `packages/core/src/shop/domain/entities/Insignia.ts`
- Diagnóstico: A entidade `Insignia` estende `ShopItem<Props>` e não possui campo `isPurchasable`,
  `isAvailable` ou equivalente. Não existe forma de distinguir no domínio se uma insígnia pode ser
  comprada livremente ou é reservada para concessão especial.

- Arquivo: `packages/core/src/shop/domain/abstracts/ShopItem.ts`
- Diagnóstico: A classe abstrata `ShopItem` também não define `isPurchasable`. O contrato base de
  item de loja não contempla a distinção entre "item disponível para venda" e "item existente no
  sistema".

- Arquivo: `packages/core/src/shop/interfaces/InsigniasRepository.ts`
- Diagnóstico: A interface define apenas `findAll()`, que retorna todas as insígnias sem qualquer
  critério de filtragem. Não existe contrato `findAllPurchasable()` ou equivalente, impossibilitando
  consultas segmentadas por disponibilidade de compra.

---

### Camada Server (Hono API)

- Arquivo: `apps/server/src/rest/controllers/shop/FetchInsigniasListController.ts`
- Diagnóstico: O controller chama `repository.findAll()` e mapeia **todas** as entidades para DTOs
  sem qualquer filtro. A insígnia `"god"` passa integralmente para a resposta HTTP enviada ao cliente.

- Arquivo: `apps/server/src/app/hono/routers/shop/InsigniasRouter.ts`
- Diagnóstico: O endpoint `GET /shop/insignias` não possui middleware de autenticação nem parâmetros
  de filtragem. Qualquer cliente pode solicitar a lista completa de insígnias, incluindo as que não
  deveriam estar disponíveis para compra.

---

### Camada de Banco de Dados

- Arquivo: `apps/server/src/database/supabase/repositories/shop/SupabaseInsigniasRepository.ts`
- Diagnóstico: O método `findAll()` executa `SELECT * FROM insignias` sem cláusula `WHERE`. Todas
  as insígnias cadastradas na tabela — incluindo a de role `"god"` — são retornadas indiscriminadamente.

---

### Camada REST (Client)

- Arquivo: `apps/web/src/rest/services/ShopService.ts`
- Diagnóstico: O método `fetchInsigniasList()` realiza `GET /shop/insignias` sem parâmetros de
  filtragem, recebendo e repassando integralmente o payload do servidor para a camada de UI.

---

### Camada UI

- Arquivo: `apps/web/src/ui/shop/widgets/pages/Shop/InsiginiasList/useInsigniasList.ts`
- Diagnóstico: O hook mapeia todos os DTOs retornados pela API para entidades `Insignia.create(dto)`
  sem qualquer filtro client-side. Não há verificação de `role` ou `isPurchasable` antes de popular
  a lista exibida na tela.

- Arquivo: `apps/web/src/ui/shop/widgets/pages/Shop/InsiginiasList/InsigniasListView.tsx`
- Diagnóstico: A view renderiza **todos** os itens recebidos via props sem condição de exclusão. A
  insígnia `"god"` é renderizada visualmente como qualquer outra insígnia disponível na loja.

---

**Plano de Correção (Spec):**

### 1. O que já existe? (Contexto/Impacto)

- **Core**
  - `InsigniaRole` — `packages/core/src/global/domain/structures/InsigniaRole.ts` — Value-object com
    getters `isGod` e `isEngineer`. Será utilizado para derivar a propriedade `isPurchasable` na
    entidade `Insignia` sem introduzir conhecimento externo no domínio.
  - `Insignia` — `packages/core/src/shop/domain/entities/Insignia.ts` — Entidade que será modificada
    para expor o getter `isPurchasable`, encapsulando a regra de negócio no domínio.
  - `InsigniasRepository` — `packages/core/src/shop/interfaces/InsigniasRepository.ts` — Interface
    que receberá o novo contrato `findAllPurchasable()`.

- **Server**
  - `FetchInsigniasListController` — `apps/server/src/rest/controllers/shop/FetchInsigniasListController.ts`
    — Controller que será atualizado para consumir `findAllPurchasable()` ao invés de `findAll()`.
  - `SupabaseInsigniasRepository` — `apps/server/src/database/supabase/repositories/shop/SupabaseInsigniasRepository.ts`
    — Repositório que implementará o novo método `findAllPurchasable()`.

- **UI (sem alteração necessária)**
  - `useInsigniasList` — `apps/web/src/ui/shop/widgets/pages/Shop/InsiginiasList/useInsigniasList.ts`
    — Hook de busca. Não necessita alteração, pois a correção na origem (API) garante que apenas
    insígnias compráveis sejam retornadas.
  - `InsigniasListView` — `apps/web/src/ui/shop/widgets/pages/Shop/InsiginiasList/InsigniasListView.tsx`
    — View de listagem. Não necessita alteração pelo mesmo motivo acima.

---

### 2. O que deve ser criado?

- **Core**
  - `InsigniasRepository.findAllPurchasable()` — Novo contrato na interface
    `packages/core/src/shop/interfaces/InsigniasRepository.ts`. Assinatura: `findAllPurchasable(): Promise<Insignia[]>`.
    Responsável por garantir que apenas insígnias disponíveis para compra sejam retornadas.

---

### 3. O que deve ser modificado?

- **Core**
  - `Insignia` — `packages/core/src/shop/domain/entities/Insignia.ts` — Adicionar getter
    `isPurchasable` que retorna `Logical` indicando se a insígnia pode ser comprada:
    `get isPurchasable(): Logical { return this.role.isEngineer }`. Isso encapsula no domínio a
    regra de que insígnias `"god"` não são vendáveis na loja.

- **Core (Interface)**
  - `InsigniasRepository` — `packages/core/src/shop/interfaces/InsigniasRepository.ts` — Adicionar
    assinatura: `findAllPurchasable(): Promise<Insignia[]>`.

- **Server (Controller)**
  - `FetchInsigniasListController` — `apps/server/src/rest/controllers/shop/FetchInsigniasListController.ts`
    — Substituir a chamada `repository.findAll()` por `repository.findAllPurchasable()`.

- **Server (Database)**
  - `SupabaseInsigniasRepository` — `apps/server/src/database/supabase/repositories/shop/SupabaseInsigniasRepository.ts`
    — Implementar `findAllPurchasable()` com filtro no Supabase SDK priorizando o campo
    `is_purchasable` e mantendo compatibilidade com registros legados sem essa coluna populada:
    `.from('insignias').select('*').or('is_purchasable.eq.true,and(is_purchasable.is.null,role.neq.god)')`.
    Isso garante que a consulta pública respeite a semântica de comprável e continue excluindo a
    insígnia `"god"` em cenários de fallback.

---

### 4. O que deve ser removido?

- Nada deve ser removido. A insígnia `"god"` deve permanecer na tabela `insignias` do banco de
  dados, pois ela é concedida por outros fluxos do sistema (ex: `AcquireInsigniaUseCase` e
  `addAcquiredInsignia`). A correção isola o problema na camada de consulta pública, sem impactar
  a lógica de concessão administrativa.

---

## ✅ Resolução Final

- `FetchInsigniasListController` foi atualizado para usar `repository.findAllPurchasable()`.
- `InsigniasRepository` agora expõe explicitamente o contrato `findAllPurchasable()`.
- `SupabaseInsigniasRepository.findAllPurchasable()` foi implementado priorizando
  `is_purchasable = true`, com fallback para excluir role `"god"` em dados legados.
- A modelagem de item de loja foi evoluída com `isPurchasable` no `ShopItem`, propagada para
  `Insignia`, `Avatar` e `Rocket`, além de mappers/DTOs de suporte.
- Foram adicionados testes de regressão cobrindo:
  - regra de domínio para `Insignia.isPurchasable` por role;
  - orquestração do controller para garantir consumo do método `findAllPurchasable()`.

### Observação sobre causa raiz

A causa raiz inicial foi confirmada parcialmente: o problema não estava apenas na ausência de filtro
na consulta pública, mas também na falta de uma semântica explícita de "comprável" no modelo de
domínio/base de itens da loja. Durante a implementação, essa lacuna foi endereçada com a introdução
de `isPurchasable` no contrato compartilhado (`ShopItem`/DTOs/mappers), reduzindo risco de regressão
em outros fluxos de listagem.
