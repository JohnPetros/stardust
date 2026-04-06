---
title: Falha no redirecionamento apos sign in no Studio
apps: studio
status: closed
last_updated_at: 2026-04-06
---

# Bug Report: Falha no redirecionamento apos sign in no Studio

## Problema Identificado

Após um sign in bem-sucedido no Studio, o usuário recebe feedback de sucesso, mas em parte das tentativas não permanece na navegação para a home autenticada. Em vez de concluir a entrada em `/dashboard`, a aplicação volta para `/`, fazendo a tela de sign in parecer ter sido recarregada.

## Causas

- O fluxo de sucesso em `apps/studio/src/ui/auth/widgets/pages/SignIn/SignInForm/useSignInForm.ts` considera o login concluído assim que recebe `accessToken`, grava esse valor em `sessionStorage` e navega imediatamente para `ROUTES.dashboard`.
- A rota de destino depende de uma segunda validação obrigatória em `apps/studio/src/app/middlewares/RestMiddleware.ts`, que chama `/auth/account` e redireciona para `/` em qualquer falha, sem retry, sem refresh de sessão e sem expor o motivo ao usuário.
- O Studio já possui contrato para `refreshSession` em `apps/studio/src/rest/services/AuthService.ts`, mas não persiste nem reutiliza `refreshToken` em nenhum ponto do fluxo de autenticação.
- Hipótese principal: a intermitência ocorre quando a validação imediata de `/auth/account` falha logo após o sign in por estado transitório de autenticação ou erro temporário de rede/API; como o middleware trata toda falha como logout, a navegação retorna para a tela inicial.

## Contexto e Análise

### Camada UI

- **Arquivo:** `apps/studio/src/app/routes/SignInRoute.tsx`
- **Diagnóstico:** Este é o ponto de entrada da feature. A rota pública renderiza a página de sign in, mas não possui lógica para redirecionar um usuário já autenticado para a home do Studio.

- **Arquivo:** `apps/studio/src/ui/auth/widgets/pages/SignIn/SignInForm/useSignInForm.ts`
- **Diagnóstico:** O hook grava apenas `response.body.accessToken` em `sessionStorage`, exibe toast de sucesso e chama `navigationProvider.goTo(ROUTES.dashboard)`. O fluxo ignora `response.body.refreshToken`, embora o contrato de `SessionDto` o forneça.

- **Arquivo:** `apps/studio/src/ui/global/hooks/useNavigationProvider.ts`
- **Diagnóstico:** A navegação pós-login é client-side via `navigate(route)`, portanto o sucesso percebido pelo usuário depende integralmente dos middlewares da rota de destino aceitarem a sessão recém-criada.

### Camada Aplicação Studio

- **Arquivo:** `apps/studio/src/app/routes/DashboardRoute.tsx`
- **Diagnóstico:** `/dashboard` é a primeira rota privada após o sign in e sempre executa `AuthMiddleware` e `RestMiddleware`, o que transforma a abertura da home em uma segunda etapa obrigatória de validação da sessão.

- **Arquivo:** `apps/studio/src/app/middlewares/AuthMiddleware.ts`
- **Diagnóstico:** O middleware lê o token bruto de `sessionStorage` e apenas verifica sua presença para liberar a rota privada. Ele não diferencia token recém-criado, token expirado ou token inválido, e também não redireciona usuários autenticados quando a rota atual é `/`.

- **Arquivo:** `apps/studio/src/app/middlewares/RestMiddleware.ts`
- **Diagnóstico:** O middleware monta o `RestClient`, injeta o header `Authorization`, chama `authService.fetchAccount()` e executa `throw redirect(ROUTES.index)` em qualquer resposta malsucedida. Esse ponto concentra a falha percebida pelo usuário, porque converte toda indisponibilidade temporária ou falha de autenticação em retorno silencioso para a tela de sign in.

- **Arquivo:** `apps/studio/src/rest/services/AuthService.ts`
- **Diagnóstico:** A camada REST já expõe `signInGodAccount`, `fetchAccount` e `refreshSession`, mas a aplicação Studio usa apenas a primeira chamada no bootstrap do login e descarta o mecanismo de recuperação já previsto no contrato.

### Camada Server/Auth

- **Arquivo:** `apps/server/src/app/hono/HonoApp.ts`
- **Diagnóstico:** O servidor cria o client do Supabase a partir do header `Authorization` e deriva `account` do JWT recebido. Isso confirma que o ponto de verdade da sessão autenticada no Studio depende do token enviado pelo cliente para a API.

- **Arquivo:** `apps/server/src/rest/services/SupabaseAuthService.ts`
- **Diagnóstico:** `fetchAccount()` usa `supabase.auth.getUser()` e responde `401` para cenários como `no_authorization`, `bad_jwt` e `session_expired`. O comportamento do Studio hoje colapsa todos esses casos em um único redirecionamento para `/`, sem tentativa de recuperação.

- **Arquivo:** `packages/core/src/auth/domain/structures/dtos/SessionDto.ts`
- **Diagnóstico:** O contrato de sessão inclui `accessToken` e `refreshToken`. O Studio consome apenas parte do DTO, ficando inconsistente com a capacidade de refresh já suportada pela arquitetura.

## Plano de Correção (Spec)

### 1. O que já existe?

- **Camada UI:** `useSignInForm` — Executa o sign in, persiste o token atual e dispara a navegação para `/dashboard`.
- **Camada Aplicação Studio:** `AuthMiddleware` — Faz o gate inicial da rota privada usando `sessionStorage`.
- **Camada Aplicação Studio:** `RestMiddleware` — Valida a sessão com `/auth/account` antes de popular `restContext`.
- **Camada REST Studio:** `AuthService.refreshSession` — Contrato já disponível para recuperar sessão sem acoplar a UI ao servidor.
- **Camada Server/Auth:** `SupabaseAuthService.fetchAccount` — Ponto de verdade da sessão autenticada consumido pelo Studio.
- **Camada Core:** `SessionDto` — Contrato que já entrega `refreshToken` junto com `accessToken`.

### 2. O que deve ser criado?

- **Camada Aplicação Studio:** `SESSION_STORAGE_KEYS.refreshToken` — Chave explícita para persistir o `refreshToken` recebido no sign in.

### 3. O que deve ser modificado?

Liste mudanças pontuais em código existente, explicando o motivo da alteração.

- **Camada UI:** `apps/studio/src/ui/auth/widgets/pages/SignIn/SignInForm/useSignInForm.ts` — Persistir também `response.body.refreshToken` e alinhar o fluxo de sucesso com o contrato completo de `SessionDto`.
- **Camada Aplicação Studio:** `apps/studio/src/app/middlewares/RestMiddleware.ts` — Trocar o redirecionamento imediato por uma tentativa de recuperação de sessão via `authService.refreshSession(...)` quando `fetchAccount()` falhar por autenticação, atualizando o contexto apenas após a recuperação ou redirecionando somente na falha definitiva.
- **Camada Aplicação Studio:** `apps/studio/src/app/middlewares/AuthMiddleware.ts` — Redirecionar usuários já autenticados para `ROUTES.dashboard` ao acessar `/`, evitando que um usuário com sessão válida permaneça na tela de sign in.
- **Camada REST Studio:** `apps/studio/src/rest/services/AuthService.ts` — Reutilizar o método `refreshSession` no bootstrap de autenticação do Studio, sem criar um novo contrato REST.

### 4. O que deve ser removido?

Liste código redundante, legado ou incorreto que deve ser eliminado como parte da correção.

- **Camada Aplicação Studio:** `apps/studio/src/app/middlewares/RestMiddleware.ts` — Remover o comportamento de tratar qualquer falha de `fetchAccount()` como redirecionamento imediato para `/`, porque ele mascara erros transitórios e quebra o fluxo de entrada mesmo após autenticação bem-sucedida.
