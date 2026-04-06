# PRD - Sign In

## Contexto
Garantir que o fluxo de entrada no StarDust Studio seja confiavel desde a autenticacao ate a abertura do dashboard, evitando retorno indevido para a tela inicial logo apos um login bem-sucedido.

Referencia de produto: https://github.com/JohnPetros/stardust/milestone/20

## Objetivos
- Reduzir falhas perceptiveis no primeiro acesso autenticado ao Studio.
- Reaproveitar a sessao criada no sign in sem exigir uma nova tentativa do usuario.
- Tornar a navegacao entre rota publica e rota privada consistente quando ja existir sessao ativa.
- Melhorar a recuperacao de sessao no bootstrap autenticado do Studio usando o contrato ja disponivel no backend.

## Escopo entregue
- Studio UI: o login agora persiste `accessToken` e `refreshToken`, permitindo recuperacao de sessao no carregamento do dashboard.
- Studio App: a rota `/` redireciona usuarios ja autenticados para `/dashboard`, evitando permanencia indevida na tela de sign in.
- Studio App: a validacao inicial de sessao no dashboard tenta recuperar a autenticacao com `refreshToken` antes de encerrar a sessao e voltar para `/`.
- Studio App: o sign out passou a limpar tambem o `refreshToken`, encerrando a sessao local de forma completa.

## Checklist de requisitos
- [x] Persistir `refreshToken` junto com o `accessToken` no sucesso do sign in do Studio.
- [x] Redirecionar para o dashboard quando um usuario autenticado acessar a rota `/`.
- [x] Tentar refresh de sessao quando a validacao inicial de `/auth/account` falhar com erro de autenticacao e houver `refreshToken` disponivel.
- [x] Atualizar a sessao local com os tokens retornados pelo refresh antes de repetir a validacao da conta.
- [x] Redirecionar para `/` apenas quando a autenticacao falhar de forma definitiva.
- [x] Limpar `accessToken` e `refreshToken` no sign out do Studio.

## Decisoes finais de implementacao
- O Studio reutiliza o contrato existente de `refreshSession`, sem introduzir novo endpoint ou novo service.
- A recuperacao de sessao fica concentrada no bootstrap autenticado do Studio, preservando a UI de login simples.
- O fluxo de logout foi ajustado para limpar os dois tokens locais e evitar sobras de sessao entre navegacoes.

## Validacao final
- [x] `npm run codecheck` na raiz.
- [x] `npm run typecheck` na raiz.
- [x] `npm run test` na raiz.

## Status
**Concluido**

## Ultima atualizacao
2026-04-06
