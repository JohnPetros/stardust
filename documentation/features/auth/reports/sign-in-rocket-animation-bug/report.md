---
title: Animação de foguete não aparece após login
issue: https://github.com/JohnPetros/stardust/issues/572
milestone: https://github.com/JohnPetros/stardust/milestone/20
prd: null
apps:
  - web
status: closed
last_updated_at: 2026-08-30
---

# Bug Report: Animação de foguete não aparece após login

## Diagnóstico

### Falha observada

Na aplicação Web, em `/auth/sign-in`, um login bem-sucedido com e-mail e senha faz o usuário avançar para `/space`, mas a transição com `RocketAnimation` não fica visível ou não permanece tempo suficiente para ser observada. No mesmo fluxo, a animação de saída do formulário podia ser interrompida antes de completar. O problema ocorre no fluxo de usuários com perfil existente e foi reportado como reproduzível em todos os ambientes.

O fluxo de sucesso altera `isRocketVisible` para `true`, mas a página pode ser remontada enquanto a Server Action atualiza os cookies de sessão. Além disso, o wrapper do foguete estava em uma camada negativa, atrás da composição visível da página, e o Lottie mantinha 640 px mesmo em viewports menores, podendo ampliar o canvas horizontal do documento.

### Comportamento esperado

Conforme a milestone `Sign In` (#20), requisito `REQ-01`, credenciais válidas com perfil existente devem autenticar o usuário e encaminhá-lo para `nextRoute`, quando informado, ou para a experiência autenticada principal. Nesse fluxo já implementado, a animação de foguete deve permanecer visualmente observável durante a transição antes da navegação para `/space`.

### Causa raiz

Há três condições que compunham a falha: (1) `RocketAnimationView` montava o foguete em um elemento `fixed` com `z-index: -20` (`-z-20`), enquanto `SignInPageView` coloca o conteúdo em `z-50` sobre um `body` com fundo `bg-gray-900`; (2) a `VerifyAuthRoutesController` tratava as requisições da Server Action de login, identificadas pelo header `next-action`, como navegações comuns. Depois que a ação grava os cookies, essa verificação podia responder `307` para `/space` ou provocar um remount da rota antes de a transição terminar. O provider de autenticação também iniciava o fetch do perfil antes de receber o token server-side atualizado, disparando um ciclo de refresh e novos remounts; e (3) `AnimatedForm` dependia de um `AnimatePresence` condicional para executar `exit="hidden"`. Quando a Server Action remontava a página, esse `AnimatePresence` podia ser desmontado antes do fim da animação de saída de 1500 ms, deixando a transição incompleta. A montagem inicial do componente também podia reaplicar o estado oculto sem permitir a progressão visual esperada.

O diagnóstico é sustentado pela inspeção do fluxo real: a API de login retorna `201`, `/auth/account` autenticado retorna `200`, mas a requisição da Server Action podia ser redirecionada antes da animação. A inspeção também identificou o atraso de 1500 ms usado tanto no fade quanto no reinício do Lottie. Os testes anteriores verificavam somente a opacidade do wrapper (`RocketAnimationView.test.tsx`) e a navegação final (`sign-in.test.ts`), sem verificar a visibilidade efetiva no navegador, o overflow do viewport nem o comportamento durante o remount.

Após o primeiro push da correção, o CI identificou uma regressão nos consumidores compartilhados: com `z-[60]`, o SVG do foguete passou a interceptar eventos de ponteiro. A execução `Web app CI #573` falhou nos três cenários de `account-confirmation` que clicam em `retry-user-creation-button`; o Playwright registrou que o SVG dentro de `rocket-animation` interceptava o clique. Esse achado não invalida a correção de visibilidade, mas exige que a camada visual seja não interativa.

Não há evidência de erro de nomenclatura do asset: `rocket-lauching` é o nome interno usado pelo componente e está mapeado para `/lotties/rocket-launching.json`, que existe em `apps/web/public/lotties`. A falha de carregamento desse asset permanece um risco independente, pois `LottieAnimation` retorna `null` e suprime o erro quando o fetch falha, mas não é a causa sustentada pela issue.

### Áreas afetadas

- `apps/web/src/ui/auth/widgets/components/RocketAnimation/RocketAnimationView.tsx` — renderiza o wrapper fixo da animação e define a ordem de empilhamento que a torna invisível.
- `apps/web/src/ui/auth/widgets/pages/SignIn/SignInPageView.tsx` — compõe `RocketAnimation` com a página de entrada e mantém o conteúdo principal em `z-50`.
- `apps/web/src/ui/auth/widgets/pages/SignIn/useSignInPage.ts` — controla o estado, atraso, reinício da animação e navegação após o sign-in.
- `apps/web/src/middleware.ts` — executa a verificação de autenticação sobre as requisições de Server Action do login.
- `apps/web/src/ui/auth/contexts/AuthContext/index.tsx` — fornece o token server-side ao provider de autenticação.
- `apps/web/src/ui/auth/contexts/AuthContext/hooks/useAuthContextProvider.ts` — controla quando o fetch do perfil autenticado pode começar.
- `apps/web/src/ui/auth/constants/rocker-animation-delay.ts` — define o atraso compartilhado do início da transição do foguete.
- `apps/web/src/ui/global/widgets/components/Animation/LottieAnimation/LottieAnimationView.tsx` — limita dimensões numéricas do Lottie ao viewport.
- `apps/web/src/ui/global/widgets/layouts/Root/RootLayoutView.tsx` — fornece o fundo `bg-gray-900` do `body`, relevante para a camada negativa do foguete.
- `apps/web/src/app/tests/auth/sign-in.test.ts` — cobre autenticação, requests, visibilidade da animação durante a transição e destino final.
- `apps/web/src/ui/auth/widgets/components/RocketAnimation/tests/RocketAnimationView.test.tsx` — cobre a opacidade inicial, a camada visual e a ausência de captura de eventos do wrapper.
- `apps/web/src/ui/auth/widgets/components/AnimatedForm/index.tsx` — mantém o formulário montado e alterna explicitamente entre os estados visível e oculto para que a saída não seja interrompida por remount.
- `apps/web/src/ui/auth/widgets/components/AnimatedForm/tests/AnimatedForm.test.tsx` — cobre a permanência do formulário no DOM e o estado oculto durante a transição.

### Risco de regressão

A correção deve manter o estado inicial oculto, o atraso e o reinício da animação, o redirecionamento para `nextRoute` ou `/space` e o comportamento de erro do formulário. O fluxo autenticado não deve iniciar chamadas de perfil sem token nem submeter a Server Action de login a um redirecionamento prematuro. O formulário deve permanecer montado enquanto oculta, sem aceitar interação por baixo da transição. O wrapper visual do `RocketAnimation` deve ignorar eventos de ponteiro para não bloquear os controles dos fluxos de confirmação de conta e confirmação de conta social, nos quais o componente também é reutilizado.

### Limite da correção

Corrigir o fluxo Web de sign-in para que a Server Action conclua sem redirecionamento intermediário, o perfil só seja consultado com o token disponível, a camada de `RocketAnimation` permaneça efetivamente visível durante a transição, a animação não ultrapasse o viewport e a animação de saída do `AnimatedForm` seja concluída mesmo quando a sessão provocar remount. Preservar o contrato da API, os destinos de navegação, o carregamento do asset e os demais consumidores dos componentes.

## Encerramento

A correção foi aplicada no middleware, no provider de autenticação, no estado de transição do sign-in, no `AnimatedForm`, no atraso da animação, na camada visual do foguete e no dimensionamento responsivo do Lottie. O `AnimatedForm` agora permanece montado e anima explicitamente para o estado `hidden`, com `aria-hidden` e `pointer-events-none` durante a saída. O wrapper do `RocketAnimation` mantém a camada visível, mas ignora eventos de ponteiro para preservar os controles dos consumidores compartilhados.

A inspeção autenticada com Playwright confirmou login com resposta `200`, permanência do formulário no DOM e progressão gradual de `opacity` e `transform` durante a saída. A suíte direcionada do `AnimatedForm` e do sign-in passou; os detectores de código e tipos passaram. A execução global de testes unitários ficou limitada a quatro testes do servidor que não conseguiram iniciar porque a porta `3334` já estava ocupada por um processo existente. Após a correção complementar, o Web app CI #573 passou integralmente no SHA `89eaeb944`, incluindo Integration tests, Check code, Check types, Tests e Build; os três cenários de `account-confirmation` também passaram sem interceptação de ponteiros.
