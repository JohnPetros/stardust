## Arquivos

- documentation/overview.md
- documentation/architecture.md
- documentation/tooling.md
- documentation/rules/rules.md

### Ambiente local e credenciais

- Para desenvolvimento local e validações reais no navegador, use sempre o
  `.env.development` da raiz como fonte das variáveis de ambiente e credenciais.
- Carregue essas variáveis com o script de exportação correspondente antes de
  executar comandos ou ferramentas; nunca escreva valores de credenciais em
  testes, documentação versionada, comandos persistentes ou logs.
- O `.env.development` é ignorado pelo Git e deve permanecer apenas na máquina
  local.

## MCPS

- Context7 para buscar informações atualizadas
- Serena para navegar pela codebase de forma otimizada
- Pencil para editar ou saber o contexto de frames de design estilo Figma
- Playwright para inspecionar e validar fluxos reais no navegador
- browser-use para exploração interativa e tarefas pontuais no navegador real
- Supabase Dev para interagir com o projeto Supabase de desenvolvimento 
- Supabase Prod para interagir com o projeto Supabase de produção

### browser-use e Playwright

- Use `browser-use` para exploração manual assistida, inspeção visual e tarefas
  pontuais em uma sessão real do navegador conectada via CDP.
- Use Playwright para validações formais, testes automatizados repetíveis,
  asserções, mocks, traces, execução cross-browser e CI.
- `browser-use` não substitui o Playwright nas validações obrigatórias de
  frontend nem na suíte de testes versionada.

### Supabase Dev como padrão

- Use o MCP **Supabase Dev** para consultar, diagnosticar e alterar o banco de
  desenvolvimento remoto.
- Não use a instância Supabase local, `psql` local ou `supabase db reset` como
  fonte de verdade para validar a aplicação, salvo quando a tarefa solicitar
  explicitamente um teste local de infraestrutura.
- Para alterações de schema, aplique migrations pelo MCP Supabase Dev e valide
  a assinatura, grants e comportamento no mesmo projeto remoto usado pelo
  Server.
- Se o MCP estiver desconectado, informe o bloqueio e não conclua a validação
  dizendo que o banco local representa o ambiente Dev.

## Playwright no Studio

Use o Playwright para validar o Studio em um navegador real, incluindo o login
e pelo menos uma rota protegida. Não considere a tela de login suficiente para
declarar a aplicação funcional.

### Pré-requisitos

- Inicie o servidor local e o Studio em terminais separados:

  ```bash
  npm --workspace @stardust/server run dev
  ```

  ```bash
  npm --workspace @stardust/studio run dev
  ```

- O servidor de desenvolvimento do projeto usa `http://localhost:3334`.
  Confirme que `apps/studio/.env.development` contém:

  ```dotenv
  VITE_SERVER_APP_URL=http://localhost:3334
  VITE_CDN_URL=<url-do-cdn>
  VITE_WEB_APP_URL=http://localhost:3000
  ```

- Se a porta `8000` estiver ocupada, inicie o Studio em outra porta e use essa
  mesma porta no `baseURL` do teste. Não altere a URL do servidor para resolver
  um conflito de porta do Studio.

- Configure as credenciais e a URL do Studio no `.env.development` da raiz:

  ```dotenv
  STUDIO_APP_E2E_EMAIL=<email-da-conta-de-teste>
  STUDIO_APP_E2E_PASSWORD=<senha-da-conta-de-teste>
  ```

  Carregue-as no terminal antes de iniciar o Playwright. O comando precisa ser
  `source` para que os `export`s permaneçam no shell atual:

  ```bash
  source ./scripts/export-studio-app-e2e-env.sh
  ```

  O arquivo `.env.development` é ignorado pelo Git; nunca coloque essas
  credenciais em testes, documentação versionada ou logs.

### Fluxo obrigatório

1. Abra `http://localhost:8000/` (ou a porta alternativa escolhida).
2. Preencha os campos de email e senha usando variáveis de ambiente, nunca
   credenciais escritas no teste ou no repositório.
3. Clique no botão `Login` e aguarde a navegação para `/dashboard` com
   `page.waitForURL`, em vez de usar apenas `waitForTimeout`.
4. Acesse `/profile/users` no mesmo contexto do navegador para confirmar que a
   sessão foi persistida entre rotas protegidas.
5. Verifique a presença do título `Usuários` e aguarde a resposta da listagem.

Exemplo mínimo:

```ts
const studioUrl = 'http://localhost:8000'
const page = await browser.newPage()
const consoleErrors: string[] = []
const failedRequests: string[] = []

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})
page.on('pageerror', (error) => consoleErrors.push(error.message))
page.on('requestfailed', (request) => failedRequests.push(request.url()))

await page.goto(`${studioUrl}/`)
await page.getByLabel(/email/i).fill(process.env.STUDIO_APP_E2E_EMAIL!)
await page.getByLabel(/senha|password/i).fill(process.env.STUDIO_APP_E2E_PASSWORD!)
await page.getByRole('button', { name: 'Login' }).click()
await page.waitForURL('**/dashboard')

await page.goto(`${studioUrl}/profile/users`)
await page.getByRole('heading', { name: 'Usuários' }).waitFor()

expect(consoleErrors).toEqual([])
expect(failedRequests).toEqual([])
```

### Diagnóstico de falhas

- Registre `page.on('response')` e confirme que o login retorna `2xx`/`201`,
  `/auth/account` retorna `200` e as requisições da rota protegida também
  retornam `2xx`.
- Erro `module is not defined` em `stream-browserify` indica falha de
  compatibilidade do bundle SSR/Vite; investigue o erro do servidor antes de
  depurar autenticação.
- Erro de variável de ambiente deve impedir o Studio de subir. Confira
  `VITE_SERVER_APP_URL`, `VITE_CDN_URL` e `VITE_WEB_APP_URL` antes de abrir o
  navegador; não prossiga com o teste se a validação inicial falhar.
- Erros de CORS normalmente indicam mistura de origem local com API de
  produção ou uma porta incorreta. Confirme a origem do navegador e a URL da
  API nas requisições capturadas.
- Depois de qualquer correção no código, execute os detectores definidos neste
  arquivo e repita o fluxo autenticado completo.

## Playwright na Web App

A Web App possui um fluxo de integração separado do Studio. Esses testes usam
o ambiente `testing`, o servidor de testes da própria aplicação e mocks de
backend; não usam a conta real do Studio nem devem apontar para produção.

### Execução

- Instale o navegador, se necessário:

  ```bash
  npm --workspace @stardust/web run test:integration:install
  ```

- Execute todos os testes de integração:

  ```bash
  npm --workspace @stardust/web run test:integration
  ```

- Para investigar uma falha, use `test:integration:debug` ou
  `test:integration:ui`.

O arquivo `apps/web/playwright.config.ts` inicia automaticamente a Web App em
`http://127.0.0.1:3100`, aguarda `http://127.0.0.1:3100/api/tests/server` e
carrega `apps/web/.env.testing`. Não inicie manualmente `next dev` ou o
servidor da API para esse fluxo, pois isso pode causar conflito de porta e
misturar ambientes.

### Autenticação e mocks

- Os testes de autenticação usam `ServerMock` e dados determinísticos. As
  credenciais presentes em `apps/web/src/app/tests/auth/sign-in.test.ts` são
  apenas fixtures de teste; não são credenciais válidas para a aplicação real.
- Use os `data-testid` já definidos nos componentes, como `email-input`,
  `password-input` e `submit-button`, e aguarde `page.waitForRequest`,
  `page.waitForResponse` ou `expect(page).toHaveURL(...)`.
- Para validar um fluxo autenticado, registre primeiro as respostas de
  `/auth/account`, `/auth/sign-in`, `/auth/refresh-session` e das rotas da tela
  em `ServerMock`. Depois confirme a navegação para `/space` ou para a rota
  protegida esperada.
- Não use `STUDIO_APP_E2E_*` nos testes da Web App. Essas variáveis pertencem
  exclusivamente ao fluxo real do Studio.

### Acesso a rotas autenticadas

É possível acessar rotas autenticadas na Web App. No ambiente de integração,
faça isso simulando a sessão, sem depender de uma conta real:

1. Limpe o contexto e adicione o cookie `@stardust:access-token` para o domínio
   `127.0.0.1`.
2. Registre no `ServerMock` um `GET /auth/account` com `isAuthenticated: true`.
3. Registre também todas as respostas que a rota protegida consome, como
   `/space/planets` ou os endpoints do desafio.
4. Navegue para a rota e valide a URL e o conteúdo visível.

Exemplo de rota autenticada:

```ts
await context.clearCookies()
await context.addCookies([
  {
    name: '@stardust:access-token',
    value: 'web-e2e-test-token',
    domain: '127.0.0.1',
    path: '/',
  },
])

await ServerMock(page).register([
  {
    method: 'GET',
    path: '/auth/account',
    status: 200,
    body: { isAuthenticated: true },
  },
  {
    method: 'GET',
    path: '/space/planets',
    status: 200,
    body: [],
  },
])

await page.goto('/space')
await expect(page).toHaveURL(/\/space$/)
```

O teste `apps/web/src/app/tests/challenging/assistant-history.test.ts` contém
um exemplo completo desse padrão. Para testar o login em si, use o fluxo de
`apps/web/src/app/tests/auth/sign-in.test.ts`, que registra `/auth/sign-in`,
`/auth/account` e `/auth/refresh-session` no `ServerMock` antes de navegar para
`/space`.

### Inspeção visual autenticada fora da suíte

Para verificar visualmente uma página real com o Playwright, fora de
`test:integration`, use a Web App e a API locais em terminais separados:

```bash
# terminal 1
npm --workspace @stardust/server run dev
```

```bash
# terminal 2
npm --workspace @stardust/web run dev
```

Depois, no navegador Playwright:

1. Acesse `http://localhost:3000/auth/sign-in`.
2. Preencha `email-input` e `password-input` com uma conta de teste real,
   fornecida por variáveis locais; não use as fixtures do `ServerMock`.
3. Clique em `submit-button` e aguarde a navegação para `/space` com
   `waitForURL`.
4. Acesse `/space` ou outra rota protegida no mesmo contexto do navegador.
5. Confirme visualmente a página e verifique que `GET /auth/account` e os
   endpoints da tela, como `GET /space/planets`, retornam `2xx`.

Nesse fluxo, a Web App usa `http://localhost:3000` e a API usa
`http://localhost:3334`, conforme `apps/web/.env.development`. Não use
`apps/web/playwright.config.ts`, `/api/tests/server` ou `ServerMock`, pois eles
pertencem exclusivamente aos testes de integração.

Configure as credenciais reais da Web App no `.env.development` da raiz:

```dotenv
WEB_APP_E2E_EMAIL=<email-da-conta-da-web-app>
WEB_APP_E2E_PASSWORD=<senha-da-conta-da-web-app>
```

Carregue-as no mesmo terminal que inicia o navegador Playwright:

```bash
source ./scripts/export-web-app-e2e-env.sh
```

O script falha se alguma variável estiver ausente e não imprime os valores das
credenciais. Não reutilize `STUDIO_APP_E2E_*`: as contas do Studio e da Web App
são independentes.

## Regra obrigatória de validação manual do Frontend

Toda implementação que envolva frontend, UI, rotas client-side ou interação
com o navegador deve passar por validação manual em um navegador real, além dos
testes automatizados.

- Inicie o frontend e os serviços locais dos quais a tela depende em terminais
  separados. Para a Web App, use `apps/server` em `http://localhost:3334` e
  `apps/web` em `http://localhost:3000`; para o Studio, use o servidor local e
  o Studio conforme a seção específica acima.
- Use Playwright para autenticar quando a rota for protegida, acessar a tela
  implementada e exercitar o fluxo completo observável, incluindo estados de
  sucesso, erro, carregamento e navegação relevantes.
- Não considere a tela de login, uma renderização isolada ou uma suíte baseada
  somente em mocks suficiente para declarar a implementação funcional.
- Registre `console`, `pageerror`, `requestfailed` e `response` durante a
  inspeção; confirme respostas `2xx` nos endpoints de autenticação e da tela.
- Use credenciais somente por variáveis de ambiente e nunca as escreva em
  testes, documentação versionada ou logs.
- Depois de qualquer correção, repita a validação manual completa no mesmo
  fluxo autenticado.

Se o login redirecionar novamente para `/auth/sign-in`, registre `console`,
`pageerror`, `requestfailed` e `response` antes de tentar outra rota. Isso
separa falha visual da página de falha de autenticação, CORS ou API.

### Diagnóstico

- Valide que as requisições estão indo para `/api/tests/server`, não para uma
  API local ou de produção.
- Preserve `127.0.0.1` no `baseURL`; alguns testes validam URLs de retorno com
  essa origem exata.
- Em falhas intermitentes, capture `console`, `pageerror`, `requestfailed` e
  `response`, mantendo `trace: 'on-first-retry'` para obter o trace sem gerar
  artefatos desnecessários em toda execução.
- Após alterar a Web App ou seus testes, execute os detectores deste arquivo e
  também `npm --workspace @stardust/web run test:integration`.

## Detectores de erros

Após fazer qualquer alteração no código, execute os comandos:

- `npm run check:code`
- `npm run check:types`
- `npm run test:unit`

Em workflows SDD, execute também os sensores aplicáveis definidos em
`documentation/rules/sdd-rules.md`.

# Instruções para revisão de pull request

Leia o arquivo `documentation/prompts/review-pr-prompt.md` antes de começar a revisão.
