---
app: web
status: closed
last_updated_at: 2026-03-11
---

## Resumo Executivo

- Total de findings: 6 (Critical: 0 | High: 2 | Medium: 3 | Low: 1 | Info: 0)
- Area de maior risco: fronteira de autenticacao/redirecionamento na camada REST/RPC do `apps/web`
- Acao imediata recomendada: corrigir o `fail-open` do middleware e bloquear redirecionamentos externos via `redirect_to`

---

## Findings

### [ISSUE-01] Middleware de autenticacao falha em modo fail-open

- **Severidade:** High
- **Camada:** rest
- **Arquivo:** `apps/web/src/middleware.ts` (linha 35)
- **Descricao:** a cadeia de controllers do middleware e protegida por um `try/catch` que libera a requisicao com `NextResponse.next()` em qualquer excecao. Isso transforma falhas de auth, parse ou integracao em bypass da borda de protecao.
- **Evidencia:**
  ```ts
  try {
    for (const controller of controllers) {
      const response = await controller.handle(http)
      if (response.isRedirecting) return response.body
    }
  } catch {
    return NextResponse.next()
  }
  ```
- **Impacto:** uma falha temporaria em `VerifyAuthRoutesController`, `SetAccessTokenController` ou qualquer dependencia do middleware pode permitir acesso nao redirecionado a rotas que dependem dessa barreira para exigir sessao.
- **Recomendacao:** aplicar fail-closed para rotas protegidas. No `catch`, registrar o erro e retornar redirect controlado para login/erro, liberando `NextResponse.next()` apenas para rotas explicitamente publicas.
- **Referencia:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-02] Parametro `redirect_to` permite open redirect

- **Severidade:** Medium
- **Camada:** rest
- **Arquivo:** `apps/web/src/rest/controllers/global/HandleRedirectController.ts` (linha 12)
- **Descricao:** o middleware aceita `redirect_to` como `string` arbitraria e a repassa diretamente para `http.redirect()`, sem validacao de origem, allowlist ou restricao a caminhos relativos.
- **Evidencia:**
  ```ts
  const queryParams = http.getQueryParams()
  if (queryParams?.redirect_to) return http.redirect(queryParams?.redirect_to)
  ```
- **Impacto:** um atacante pode construir URLs do dominio legitimo do StarDust que redirecionam o usuario para dominios externos, facilitando phishing, encadeamento com login social e abuso de confianca.
- **Recomendacao:** aceitar apenas rotas internas relativas ou validar o destino contra uma allowlist de origens/paths do StarDust antes de chamar `http.redirect()`.
- **Referencia:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-03] Cookie de sessao e derivado de header de entrada nao confiavel

- **Severidade:** Medium
- **Camada:** rest
- **Arquivo:** `apps/web/src/rest/controllers/auth/SetAccessTokenController.ts` (linha 8)
- **Descricao:** qualquer request que chegue ao `apps/web` com header `Authorization` faz o middleware gravar o token recebido em cookie HTTP-only, sem validar emissor, formato ou se o token veio de um fluxo de autenticacao confiavel.
- **Evidencia:**
  ```ts
  const header = http.getHeader('Authorization')
  if (!header) return http.pass()

  const token = header.split(' ')[1]
  if (!token) return http.pass()

  http.setCookie(
    COOKIES.accessToken.key,
    token,
    COOKIES.accessToken.durationInISSUEonds,
  )
  ```
- **Impacto:** o browser pode persistir um token arbitrario como sessao do app, abrindo espaco para fixation/confusao de sessao e estados inconsistentes entre web e backend.
- **Recomendacao:** remover essa promocao automatica de header para cookie e retirar `SetAccessTokenController` do middleware. Para handlers em `apps/web/src/app/api`, introduzir um `NextApiRestClient` que receba a request atual, procure primeiro o token no header `Authorization` e depois nos cookies, encaminhando-o apenas como credencial transitória para o backend. Cookies de autenticacao devem continuar sendo emitidos apenas em fluxos confiaveis de `sign-in`, `confirm-email` ou `refresh-session`.
- **Referencia:** `documentation/rules/rest-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-05] Erros internos sao devolvidos ao cliente com mensagens cruas

- **Severidade:** High
- **Camada:** rpc
- **Arquivo:** `apps/web/src/rpc/next-safe-action/clients/actionClient.ts` (linha 7)
- **Descricao:** o client global de server actions retorna `AppError.message` diretamente ao frontend e, para erros desconhecidos, monta uma resposta com `error.message`. Isso expoe detalhes internos da execucao em vez de mascarar a falha.
- **Evidencia:**
  ```ts
  handleServerError(error) {
    if (error instanceof AppError) {
      console.error('Action error message:', error.message)
      return error.message
    }
    console.error('Action error:', error)
    return `Erro interno do servidor: ${error.message}`
  }
  ```
- **Impacto:** mensagens de excecao do backend podem chegar a toasts, telas e responses do cliente, revelando detalhes de infraestrutura, regras internas ou estados inesperados.
- **Recomendacao:** padronizar mascaramento com mensagens seguras ao usuario e log estruturado apenas no servidor. Para `AppError`, devolver mensagens de negocio revisadas; para erros desconhecidos, responder com texto generico.
- **Referencia:** `documentation/rules/rpc-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-06] Cookies de autenticacao nao definem hardening explicito de `iSSUEure` e `sameSite`

- **Severidade:** Medium
- **Camada:** rpc
- **Arquivo:** `apps/web/src/rpc/next/NextCall.ts` (linha 32)
- **Descricao:** os setters centrais de cookie definem apenas `httpOnly`, `path` e `maxAge`. O mesmo padrao aparece em `apps/web/src/rest/next/NextHttp.ts` nos caminhos de `redirect()` e `send()`.
- **Evidencia:**
  ```ts
  cookieStore.set({
    name: key,
    value,
    httpOnly: true,
    path: '/',
    maxAge: durationInISSUEonds,
  })
  ```
- **Impacto:** a aplicacao nao explicita as garantias recomendadas para cookies de sessao em ambiente autenticado, reduzindo a defesa contra transporte inseguro e cenarios de cross-site request.
- **Recomendacao:** definir `iSSUEure: true` em ambientes HTTPS e `sameSite: 'lax'` (ou mais restritivo quando possivel) nos emissores centrais de cookie, mantendo a configuracao padronizada na borda.
- **Referencia:** `documentation/rules/rpc-layer-rules.md`
- **Status:** resolved

---

### [ISSUE-07] Logs de debug em codigo de producao registram payloads e URLs de feedback

- **Severidade:** Low
- **Camada:** ui
- **Arquivo:** `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts` (linha 230)
- **Descricao:** o fluxo de envio de feedback faz `console.log` do `uploadResponse`, do `filename` retornado e da `screenshotUrl` final. Esses dados pertencem a um fluxo que manipula imagens capturadas da tela do usuario.
- **Evidencia:**
  ```ts
  console.log('uploadResponse', uploadResponse)

  if (uploadResponse.isSuccessful) {
    console.log('uploadResponse.body.filename', uploadResponse.body.filename)
    screenshotUrl = uploadResponse.body.filename
  }

  console.log('screenshotUrl', screenshotUrl)
  ```
- **Impacto:** dados operacionais do upload ficam expostos no console do navegador, o que aumenta superficie de vazamento em ambientes compartilhados e contraria o hardening esperado para producao.
- **Recomendacao:** remover logs de debug e manter apenas telemetria controlada/anonimizada quando realmente necessaria.
- **Referencia:** `documentation/rules/ui-layer-rules.md`
- **Status:** resolved

---

## Pendencias

- Nenhuma pendencia aberta para o escopo `apps/web`.

## Esclarecimentos do Escopo

- `redirect_to` nao e mais usado legitimamente no app; portanto, qualquer suporte remanescente deve ser tratado como superficie desnecessaria.
- O `apps/web` nao contem jobs proprios em `apps/web/src/queue/jobs`; a revisao de idempotencia de jobs nao se aplica a este app.

---

## Recomendações Priorizadas


| #   | Acao                                                                                                                                                                                     | Finding(s)       | Severidade   | Esforco |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------ | ------- |
| 1   | Trocar o middleware para fail-closed e tratar excecoes de auth com redirect/control flow seguro                                                                                          | ISSUE-01          | High         | S       |
| 2   | Bloquear redirects externos em `redirect_to` e aceitar apenas caminhos internos ou allowlist assinada                                                                                    | ISSUE-02          | Medium       | S       |
| 3   | Remover `SetAccessTokenController` do middleware e criar `NextApiRestClient` para `apps/web/src/app/api`, usando `Authorization` ou cookie apenas como credencial transitória da request | ISSUE-03          | Medium       | S       |
| 4   | Padronizar mascaramento de erros nas server actions e helpers REST, removendo `error.message` da resposta ao cliente                                                                     | ISSUE-05          | High         | M       |
| 5   | Endurecer emissores de cookie com `iSSUEure` e `sameSite`, e remover logs de debug do fluxo de feedback                                                                                    | ISSUE-06, ISSUE-07 | Medium / Low | S       |


---

## Checklist de Verificacao Pós-Correção

- [x] `npm run codecheck -w @stardust/web` passa
- [x] `npm run typecheck -w @stardust/web` passa
- [x] `npm run test -w @stardust/web` passa
- [x] Nenhuma variavel de ambiente real exposta
- [x] Nenhum `console.log` de debug em codigo de producao
- [x] Middleware de auth aplicado em todas as rotas afetadas

---

## Resolucao Final

**Data de conclusao:** 2026-03-11

### Itens Resolvidos

| ID | Titulo | Abordagem Adotada |
|----|--------|-------------------|
| SEC-01 | Middleware de autenticacao falha em modo fail-open | O `catch` do middleware agora registra o erro e aplica fail-closed para rotas protegidas, com `401` para rotas de API e redirect controlado para login nas demais. |
| SEC-02 | Parametro `redirect_to` permite open redirect | Abordagem alternativa: o suporte a `redirect_to` foi mantido, mas agora o redirecionamento so aceita caminhos internos relativos e ignora URLs absolutas ou protocol-relative. |
| SEC-03 | Cookie de sessao e derivado de header de entrada nao confiavel | Conforme recomendacao original: `SetAccessTokenController` foi removido do middleware e as rotas em `apps/web/src/app/api` passaram a usar `NextApiRestClient` para encaminhar credenciais apenas no escopo da request atual. |
| SEC-05 | Erros internos sao devolvidos ao cliente com mensagens cruas | Abordagem alternativa: o client continua registrando detalhes do `AppError` no servidor, mas agora sempre responde ao frontend com mensagem segura e generica. |
| SEC-06 | Cookies de autenticacao nao definem hardening explicito de `secure` e `sameSite` | Conforme recomendacao original: `NextCall` e `NextHttp` passaram a definir `sameSite: 'lax'` e `secure` de forma centralizada conforme o ambiente. |
| SEC-07 | Logs de debug em codigo de producao registram payloads e URLs de feedback | Conforme recomendacao original: os `console.log` do fluxo de feedback foram removidos do widget afetado. |

### Observacoes

Todas as validacoes do `@stardust/web` passaram. Durante a suite completa, `src/ui/auth/widgets/pages/SignIn/AnimatedHero/tests/AnimatedHeroView.test.tsx` ainda emite um warning de `act(...)` no console do Jest, mas sem falha de teste nem exposicao ao usuario final.

---

## Referencias

- `documentation/architecture.md`
- `documentation/rules/rules.md`
- `documentation/rules/web-application-rules.md`
- `documentation/rules/ui-layer-rules.md`
- `documentation/rules/rpc-layer-rules.md`
- `documentation/rules/rest-layer-rules.md`
- `documentation/rules/queue-layer-rules.md`
- `apps/web/src/middleware.ts`
- `apps/web/src/rest/controllers/auth/SetAccessTokenController.ts`
- `apps/web/src/app/api`
- `apps/web/src/rest/controllers/global/HandleRedirectController.ts`
- `apps/web/src/rpc/next-safe-action/clients/actionClient.ts`
- `apps/web/src/rpc/next/NextCall.ts`
- `apps/web/src/rest/next/NextHttp.ts`
- `apps/web/src/ui/reporting/widgets/layouts/FeedbackLayout/FeedbackDialog/useFeedbackDialog.ts`
- `apps/web/src/queue/inngest/inngest.ts`
