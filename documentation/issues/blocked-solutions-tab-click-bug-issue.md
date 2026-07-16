Título: Correção do clique na aba Soluções bloqueada

## Objetivo

Corrigir o comportamento da aba `Soluções` quando ela está bloqueada para usuário autenticado. Atualmente, ao clicar no botão bloqueado com ícone de cadeado, nada acontece: o diálogo de desbloqueio por starcoins não abre, não há toast, não há navegação e não há feedback visual.

O comportamento esperado é que o clique abra o diálogo de bloqueio/desbloqueio de soluções, permitindo que o usuário entenda a regra de acesso e confirme o desbloqueio quando tiver saldo suficiente.

## Requisitos de Produto

PRD: https://github.com/JohnPetros/stardust/milestone/17

- A aba `Soluções` deve aparecer bloqueada quando `canShowSolutions = false`.
- Para usuário autenticado com soluções bloqueadas, o clique deve abrir o `BlockedSolutionsAlertDialog`.
- O diálogo deve oferecer desbloqueio por 10 starcoins.
- Caso o usuário confirme com saldo suficiente, as moedas devem ser debitadas, a visibilidade de soluções deve ser atualizada e o usuário deve ser redirecionado para a listagem de soluções.
- Caso o usuário não tenha saldo suficiente, o fluxo deve exibir feedback de erro conforme regra atual.

## Requisitos Técnicos

Camadas impactadas: ui, web

Fluxo - clique na aba `Soluções` bloqueada:

1. O usuário autenticado acessa a página de desafio.
2. O estado de visibilidade indica `canShowSolutions = false`.
3. A aba `Soluções` é renderizada como bloqueada.
4. O usuário clica no botão bloqueado.
5. O sistema deve abrir o `BlockedSolutionsAlertDialog`.
6. Ao confirmar o desbloqueio, `handleShowSolutions` deve aplicar a regra atual de saldo, débito, atualização de usuário, atualização de visibilidade e navegação.

Contratos esperados:

- `ChallengeTabsView` deve renderizar o trigger de soluções bloqueadas de forma compatível com `BlockedSolutionsAlertDialog`.
- `BlockedSolutionsAlertDialogView` deve receber um trigger clicável capaz de abrir o `AlertDialog`.
- `ChallengeContentLink` e `ChallengeContentLinkView` não devem descartar props/event handlers necessários quando forem usados como filhos de componentes com `asChild`.

## Referências na Codebase

- `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/ChallengeTabsView.tsx` - renderiza a aba `Soluções` bloqueada dentro de `BlockedSolutionsAlertDialog` usando `TabButton asChild`.
- `apps/web/src/ui/challenging/widgets/components/BlockedSolutionsAlertDialog/BlockedSolutionsAlertDialogView.tsx` - encapsula o trigger recebido em `AlertDialog`, que depende do trigger para abrir o modal.
- `apps/web/src/ui/global/widgets/components/AlertDialog/index.tsx` - usa `AlertDialog.Trigger asChild`, exigindo que o filho final receba corretamente props/event handlers.
- `apps/web/src/ui/challenging/widgets/components/ChallengeContentLink/index.tsx` - componente intermediário usado como filho do trigger, mas hoje só repassa props próprias para a view.
- `apps/web/src/ui/challenging/widgets/components/ChallengeContentLink/ChallengeContentLinkView.tsx` - renderiza o botão bloqueado sem receber ou espalhar props/event handlers externos.
- `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/useChallengeTabs.ts` - contém a ação `handleShowSolutions`, que já implementa a regra de desbloqueio após confirmação.
- `apps/web/src/ui/challenging/widgets/layouts/Challenge/ChallengeTabs/tests/ChallengeTabsView.test.tsx` - o teste atual mocka o diálogo com um botão separado `show-solutions`, o que não cobre o clique real no botão bloqueado exibido ao usuário.
