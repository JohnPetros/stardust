# Regras de Teste de Rotas da App Web

Esta documentacao define os padroes para testar entradas da aplicacao `apps/web`
baseadas em `Next.js App Router`, com foco em paginas, composicao de borda e
fluxos reais de navegador.

## 1. Visao Geral

Os testes de rotas da app web validam a borda do `Next.js` em dois niveis
complementares:

1. **Teste de pagina/composicao** com `Jest`, para garantir que a pagina em
   `apps/web/src/app/**/page.tsx` resolve dependencias corretamente, reage a
   `params`/`searchParams` e delega para o widget esperado.
2. **Teste de fluxo real no navegador** com `Playwright`, para validar a rota
   publicada ao usuario final, incluindo renderizacao, requests HTTP, eventos
   client-side e estados de UI observaveis.

Diferente dos testes de `widgets`, o foco aqui nao e a View isolada. Diferente
das rotas do `apps/server`, o foco nao e a app Hono nem a persistencia direta
no banco. O objetivo e validar a borda web do monorepo: paginas do App Router,
rotas test-only da propria web e jornadas reais do navegador.

## 2. Escopo Coberto

Esta rule se aplica a:

- paginas em `apps/web/src/app/**/page.tsx`
- slots/defaults do App Router quando tiverem comportamento proprio
- fluxos de navegador organizados em `apps/web/src/app/tests/**`
- rotas test-only ou handlers HTTP locais da app web quando forem suporte de um
  fluxo da propria web

Ela nao substitui:

- `widget-tests-rules.md` para `View`, `Hook` e `index.tsx`
- `handlers-testing-rules.md` para controllers REST da web
- `server-routes-testing-rules.md` para a borda HTTP do `apps/server`

## 3. Localizacao e Nomenclatura

### 3.1 Paginas e entradas do App Router

- **Localizacao:** co-localizada em `tests/` no diretorio da pagina.
- **Exemplo:**
  - pagina: `apps/web/src/app/(home)/profile/[userSlug]/api-keys/page.tsx`
  - teste: `apps/web/src/app/(home)/profile/[userSlug]/api-keys/tests/page.test.tsx`
- **Extensao:** `.test.tsx`

### 3.2 Fluxos reais de navegador

- **Localizacao:** `apps/web/src/app/tests/<dominio>/...`
- **Exemplo:** `apps/web/src/app/tests/auth/sign-up.test.ts`
- **Extensao:** `.test.ts`
- **Runner:** `@playwright/test`

## 4. Ferramentas e Stack

### 4.1 Testes de pagina/composicao

- Runner: `jest`
- Mocking: `jest.mock(...)`
- DTOs e payloads: `Fakers` do core quando fizer sentido
- Responses HTTP: `RestResponse`

### 4.2 Testes de fluxo real

- Runner: `@playwright/test`
- Browser inicial: `chromium`
- Infra test-only:
  - `apps/web/playwright.config.ts`
  - `apps/web/src/app/api/tests/server/**`
  - `ServerMock(page)`
  - `window.__STARDUST_PROFILE_CHANNEL_MOCK__`

## 5. Padrrao para Testes de Pagina

Os testes co-localizados em `page.test.tsx` devem tratar a pagina como uma
funcao async de composicao do App Router.

### 5.1 O que validar

1. Resolucao de dependencias de borda, como `NextServerRestClient`.
2. Instanciacao dos `services` corretos com o `restClient` resolvido.
3. Reacao a `params: Promise<...>` e `searchParams` quando existirem.
4. Caminhos de sucesso, `notFound()` e redirecionamentos observaveis.
5. Delegacao para o widget/pagina final, sem testar a implementacao interna do
   widget.

### 5.2 Padrrao observado

```tsx
import Page from '../page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not found')
  }),
}))

jest.mock('@/rest/next/NextServerRestClient', () => ({
  NextServerRestClient: jest.fn(),
}))

describe('API Keys Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the page for the authenticated engineer owner', async () => {
    const result = await Page({ params: Promise.resolve({ userSlug: 'john-doe' }) })

    expect(typeof result.type).toBe('function')
  })
})
```

### 5.3 Regras especificas

- Mantenha `params` no mesmo shape usado pelo App Router atual: `Promise.resolve(...)`.
- Mocke apenas a borda web imediata da pagina: `next/navigation`,
  `NextServerRestClient` e factories de `services` consumidos pela pagina.
- Nao reescreva a logica do widget em assertions de pagina; apenas confirme que
  a pagina chegou ao ponto correto de composicao.
- Para `notFound()`, use o padrao existente de mockar `next/navigation` e fazer
  o teste falhar por excecao controlada.

## 6. Padrrao para Testes de Fluxo Real com Playwright

Use Playwright quando a cobertura depender da rota publicada, do navegador real
e da interacao entre SSR, hidracao, requests client-side e eventos assincronos.

### 6.1 O que validar

1. Renderizacao inicial da rota real.
2. Requests HTTP disparadas pela pagina.
3. Estados de UI progressivos e mensagens visiveis.
4. Efeitos client-side baseados em eventos ou bridges test-only.
5. Contratos publicos observaveis, como links, loading e mensagens de sucesso.

### 6.2 Infra padrao

- A suite deve subir a app web local via `webServer` do Playwright.
- Requests da pagina devem apontar para `/api/tests/server` durante a suite.
- Cada teste deve configurar seu proprio cenario via `ServerMock(page)`.
- `ServerMock(page)` deve ser tratado como a factory function canonica para o mock server dos testes de integracao da web.
- Nao duplique helpers locais como `createServerMock(...)` nas suites; extraia ou reutilize a implementacao compartilhada em `apps/web/src/app/tests/shared/mocks/ServerMock.ts`.
- Eventos realtime fake devem ser disparados por
  `window.__STARDUST_PROFILE_CHANNEL_MOCK__`.

### 6.3 Regras de escrita

- Agrupe a suite por rota com `test.describe('/rota', ...)`.
- Prefira helpers locais da propria suite para manter o cenario legivel, como:
  - `goto<Route>Page(...)`
  - `fillValid<Form>(...)`
  - `emit<Event>(...)`
- Use `page.waitForRequest(...)` e `page.waitForResponse(...)` quando o teste
  depender explicitamente do ciclo da request.
- Use `getByTestId`, `getByRole` e `expect(locator)` com auto-waiting.
- Evite `waitForTimeout` como mecanismo principal de sincronizacao.

### 6.4 Exemplo observado

```ts
test.describe('/auth/sign-up', () => {
  test('waits for realtime user creation before showing success', async ({ page }) => {
    await gotoSignUpPage(page)

    const signUpResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().endsWith('/api/tests/server/auth/sign-up')
      )
    })

    await page.getByTestId('submit-button').click()
    await signUpResponsePromise

    await emitUserCreated(page, payload)

    await expect(page.getByTestId('sign-up-success-message')).toBeVisible()
  })
})
```

## 7. Regras para Infra Test-Only da Web

- Mocks stateful compartilhados devem ficar em `apps/web/src/app/tests/shared/mocks/`.
- Factories de suporte compartilhadas entre suites de Playwright devem ficar em `apps/web/src/app/tests/shared/mocks/` quando controlarem estado ou contratos HTTP test-only.
- Utils browser-safe e bridges globais devem ficar em
  `apps/web/src/app/tests/shared/utils/`.
- Tipos globais e tipos compartilhados de suporte devem ficar em
  `apps/web/src/app/tests/shared/types/`.
- Rotas test-only da web devem ser protegidas por `MODE=testing`.
- Quando a app tiver middleware global, a infraestrutura test-only deve escapar
  explicitamente dos fluxos de autenticacao que causariam recursao.

## 8. O Que Evitar

- Nao testar pagina do App Router renderizando internamente o widget inteiro com
  `render(...)` se o objetivo e validar composicao de borda.
- Nao usar Playwright para substituir testes de widget ja cobertos em Jest.
- Nao depender de websocket real, Supabase realtime real ou backend real quando
  a suite tiver boundary test-only definido.
- Nao acoplar o teste a detalhes cosmeticos do layout com seletores CSS
  estruturais.
- Nao compartilhar estado de rotas fake entre cenarios.
- Nao criar versoes paralelas de `ServerMock(page)` dentro de arquivos de teste; evolua a factory compartilhada para manter compatibilidade com todas as suites de integracao.

## 9. Checklist

1. O teste cobre uma entrada real da app web, e nao apenas um widget isolado.
2. A localizacao do arquivo segue `tests/page.test.tsx` ou `src/app/tests/**`.
3. Se for pagina App Router, `params`/`searchParams` foram simulados no shape real.
4. Se for Playwright, o cenario configurou explicitamente `ServerMock(page)`.
5. Se o teste precisou de mock server, reutilizou a factory compartilhada em vez de duplicar implementacao local.
6. O teste validou comportamento observavel da rota: renderizacao,
   redirecionamento, request, mensagem, link ou loading.
7. O teste nao duplicou responsabilidade que ja pertence a `widget` ou
   `controller` unitariamente testado em outra camada.

## Tooling

- Workspace web: `npm run test -w @stardust/web`
- Suite Playwright web: `npm run test:integration -w @stardust/web`
- Qualidade local: `npm run typecheck -w @stardust/web` e
  `npm run codecheck -w @stardust/web`
- Referencia geral: `documentation/tooling.md`
