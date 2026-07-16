---
title: Clique na aba Solucoes bloqueada nao abre dialogo
prd: https://github.com/JohnPetros/stardust/milestone/40
issue: https://github.com/JohnPetros/stardust/issues/491
apps: web
status: open
last_updated_at: 2026-07-16
---

# Bug Report: Clique na aba Solucoes bloqueada nao abre dialogo

## Problema Identificado

Ao acessar um desafio como usuario autenticado sem permissao para ver solucoes (`canShowSolutions = false`), a aba `Solucoes` aparece bloqueada com icone de cadeado, mas o clique no botao bloqueado nao abre o dialogo de desbloqueio. O usuario permanece na mesma tela sem modal, toast, navegacao ou feedback visual.

O comportamento esperado e abrir o `BlockedSolutionsAlertDialog`, explicar a regra de acesso e permitir que o usuario confirme o desbloqueio por `10` starcoins quando tiver saldo suficiente.

## Causas

- O `trigger` do `AlertDialog` depende de `AlertDialog.Trigger asChild`, mas as props/event handlers injetados pelo Radix nao chegam ao elemento DOM final.
- `ChallengeContentLink` aceita apenas props de dominio da aba (`contentType`, `isActive`, `title`, `isBlocked`) e descarta props externas recebidas por composicao.
- `ChallengeContentLinkView` renderiza o botao bloqueado sem espalhar props externas e sem encaminhar `ref`, impedindo que o `AlertDialog` controle a abertura pelo clique.
- O teste de `ChallengeTabsView` aciona `onShowSolutions` por um botao mockado separado, sem cobrir a interacao real no botao bloqueado da aba `Solucoes`.

## Contexto e Analise

### Camada UI (Widgets)

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/ChallengeTabsView.tsx`
- **Diagnostico:** Fato: quando `isAccountAuthenticated` e verdadeiro e `craftsVislibility?.canShowSolutions.isFalse`, a view envolve `TabButton value='solutions' asChild` com `BlockedSolutionsAlertDialog` e renderiza `ChallengeContentLink` bloqueado como filho. Essa composicao depende da propagacao de props/event handlers do Radix ate o botao final.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/components/BlockedSolutionsAlertDialog/BlockedSolutionsAlertDialogView.tsx`
- **Diagnostico:** Fato: a view passa o `trigger` recebido como filho de `AlertDialog`. A acao `onShowSolutions` fica vinculada ao botao de confirmacao do dialogo, entao o clique inicial na aba bloqueada deve apenas abrir o `AlertDialog`.

- **Arquivo:** `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx`
- **Diagnostico:** Fato: o dialogo usa `AlertDialog.Trigger asChild`, que clona o filho e injeta props/event handlers no elemento recebido. Quando esse filho nao repassa as props ao DOM final, o trigger fica visualmente clicavel, mas perde o comportamento de abertura.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/components/ChallengeContentLink/index.tsx`
- **Diagnostico:** Fato: o entry point tipa e repassa apenas `contentType`, `isActive`, `title` e `isBlocked` para a view. Props externas vindas de `asChild`, como handlers de clique, atributos ARIA e `ref`, nao fazem parte do contrato atual e sao descartadas.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/components/ChallengeContentLink/ChallengeContentLinkView.tsx`
- **Diagnostico:** Fato: no estado bloqueado, a view renderiza um `<button type='button'>` sem receber ou espalhar props externas. Hipotese tecnica: o handler do `AlertDialog.Trigger` nao e anexado ao botao bloqueado, resultando no clique sem efeito observado.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/useChallengeTabs.ts`
- **Diagnostico:** Fato: `handleShowSolutions` ja concentra a regra posterior a confirmacao: valida saldo, exibe toast de saldo insuficiente, debita starcoins, atualiza usuario, libera visibilidade e navega para a listagem. O bug ocorre antes dessa funcao ser acionada, na abertura do dialogo.

- **Arquivo:** `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/tests/ChallengeTabsView.test.tsx`
- **Diagnostico:** Fato: o mock de `BlockedSolutionsAlertDialog` cria um botao `data-testid='show-solutions'` separado e o teste clica nele para validar `onShowSolutions`. Esse teste nao reproduz a composicao real entre `AlertDialog.Trigger asChild`, `TabButton asChild`, `ChallengeContentLink` e o botao bloqueado.

## Direcionamento de Correcao

A correcao deve atuar na camada UI, principalmente em `ChallengeContentLink` e `ChallengeContentLinkView`, para que o componente usado como `trigger` aceite e propague props/ref externas ate o elemento DOM final em composicoes `asChild`. A validacao deve cobrir o clique real no botao bloqueado da aba `Solucoes`, garantindo que ele abra o `BlockedSolutionsAlertDialog` antes de executar `handleShowSolutions` pela acao de confirmacao.
