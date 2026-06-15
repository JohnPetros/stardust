---
description: Prompt para criar testes unitarios e de integracao seguindo os padroes de testes do projeto.
---

# Prompt: Criar testes

## Objetivo

Orientar a criacao de testes unitarios e de integracao **padronizados** e **eficientes**, garantindo:

- integridade da logica de negocio
- orquestracao correta de `handlers`
- fidelidade da borda HTTP nas rotas da aplicacao server
- fidelidade das entradas da app web baseadas em `Next.js App Router`
- fidelidade funcional de componentes de UI

## Escopo permitido

No StarDust, **so e permitido criar testes para**:

- objetos de dominio (`Entity`, `Structure`, `Aggregate`)
- `Use Case`
- `View` ou `Hook`
- `handlers` (`Controller`, `Job`, `Action`, `Tool`)
- rotas HTTP da app server (`apps/server`) via testes de integracao
- paginas e fluxos da app web (`apps/web/src/app/**`)

**Nao e permitido criar testes novos** para `repository`, `service`, `provider`,
`gateway`, `client`, `mapper`, `factory`, `config`, adaptadores de
infraestrutura ou arquivos de composicao. Se a entrada apontar para um arquivo
fora desse escopo, nao gere teste direto para ele; em vez disso, identifique o
objeto de dominio, use case, widget, handler ou rota responsavel pelo
comportamento e concentre a cobertura nele.

## Entrada

- **Codigo fonte:** arquivo a ser testado (`Entity`, `Structure`, `Use Case`, `Controller`, `Action`, `Tool`, `Hook`, `Widget` ou `Route`).

## Regras de execucao

- Se houver **mais de um** `Controller`, `Widget` ou objeto de dominio (`Entity`/`Structure`) na entrada, acione `subagents` (um por item) para trabalhar em paralelo.
- Cada `subagent` deve retornar:
  - arquivos de teste criados/alterados
  - `mocks` necessarios
  - lista de cenarios cobertos

> 💡 Ao final, consolide os resultados em uma unica resposta.

Para cada subagent envie o seguinte prompt:

<Prompt para subagent>

Cria testes para o arquivo <Nome>.test.ts

### Adesao as normas do projeto

Identifique o tipo de codigo e siga a regra correspondente em `documentation/rules/`:

- **Objetos de dominio:** [domain-objects-testing-rules.md](../rules/domain-objects-testing-rules.md)
- **Casos de uso:** [use-cases-testing-rules.md](../rules/use-cases-testing-rules.md)
- **Handlers** (`REST`, `RPC`, `AI`, `Queue`): [handlers-testing-rules.md](../rules/handlers-testing-rules.md)
- **Rotas HTTP da app server:** [server-routes-testing-rules.md](../rules/server-routes-testing-rules.md)
- **Rotas e paginas da app web:** [web-app-routes-testing-rules.md](../rules/web-app-routes-testing-rules.md)
- **Widgets** (UI): [widget-tests-rules.md](../rules/widget-tests-rules.md)

Se o arquivo nao pertencer a uma dessas categorias permitidas, interrompa a
criacao do teste direto e reporte claramente que o tipo de arquivo nao pode
receber testes dedicados segundo as regras do projeto.

### Estrutura e nomenclatura

- **Localizacao padrao:** crie testes **co-localizados** em uma subpasta `tests/` no diretorio do arquivo original.
- **Excecao para rotas do server:** crie os testes em `apps/server/src/tests/routes/<dominio>/...`, espelhando o dominio e o recurso testado.
- **Excecao para paginas da app web:** crie testes co-localizados em `tests/page.test.tsx` no diretorio da pagina; para fluxos de navegador, use `apps/web/src/app/tests/<dominio>/...`.
- **Extensao:**

| Tipo | Extensao |
| --- | --- |
| Logica e `handlers` | `.test.ts` |
| Rotas HTTP do server | `.test.ts` |
| Paginas e fluxos da app web | `.test.tsx` ou `.test.ts` |
| Componentes (`Widget`, `Page`) | `.test.tsx` |

- **Exemplo:**
  - Original: `src/auth/actions/SignInAction.ts`
  - Teste: `src/auth/actions/tests/SignInAction.test.ts`
  - Rota server: `apps/server/src/app/hono/routers/profile/achievements/CreateAchievementRoute.ts`
  - Teste: `apps/server/src/tests/routes/profile/achievements/CreateAchievementRoute.test.ts`

### Stack de testes

- **Runner:** `jest`
- **Mocking:** `ts-jest-mocker` (usar `mock<Interface>()` e `Mock<Interface>`)
- **Fakers:** `@faker-js/faker` via classes estaticas em `domain/entities/fakers/`
- **React:** `@testing-library/react` e `@testing-library/user-event`
- **Rotas server:** `supertest`, `HonoFixture`, `SupabaseFixture`, `AuthFixture` e fixtures de dominio quando necessario

### Preparacao de dados (`fakers`)

- Use sempre classes `Faker` (ex: `UsersFaker.fake()`) para instanciar entidades, DTOs e estruturas.
- Se o `Faker` necessario nao existir, **crie-o primeiro** seguindo o padrao do dominio.

### Estrategia por tipo de teste

- **Domain objects:** validacoes de regras no construtor/factory e metodos de comportamento.
- **Use cases:** 100% da logica de negocio, cobrindo `happy path` e todas as excecoes de dominio.
- **Handlers:** extracao de dados do contexto (`Http`, `Call`, `Amqp`, `Mcp`), orquestracao do caso de uso/servico e formatacao da resposta.
- **Rotas HTTP do server:** exercitar a app Hono real, cobrindo autenticacao, validacao, autorizacao, mapeamento de erros, payload de resposta e efeitos persistidos no banco sem mockar dependencias internas, salvo necessidade excepcional.
- **Paginas e fluxos da app web:** para `page.tsx`, validar composicao de borda do App Router com mocks da borda web; para fluxos reais do navegador, usar Playwright com `ServerMock(page)` e bridges test-only da propria web.
- **Widgets:**
  - testar `hooks` e `views` separadamente usando `Hook()` e `View()`
  - para formularios complexos, testar integracao no `Widget` (Index)

### Qualidade e `clean code`

- **Arrange-Act-Assert:** estruturar os testes nas 3 fases (sem comentarios; uma quebra de linha e suficiente).
- **Isolamento:** usar `beforeEach` para reiniciar `mocks` e garantir que cada `it` seja independente.
- **Assercoes especificas:** preferir `toHaveBeenCalledWith` com valores exatos ou `expect.objectContaining`.

### Workflow sugerido

1. Setup: criar `tests/` e o arquivo `<Nome>.test.ts(x)`.
   Para rotas do server, criar o arquivo em `apps/server/src/tests/routes/<dominio>/`.
2. Mocking: identificar interfaces de dependencia e instanciar `mocks`.
   Para rotas do server, preparar fixtures reais em vez de mockar a stack interna.
3. Implementacao: comecar pelo caminho de sucesso e depois cobrir cenarios de erro/excecao.
4. Validacao de testes: executar no escopo correto do monorepo.
5. Validacao de qualidade: executar `typecheck` e `codecheck` antes de concluir.

```bash
npm run test
npm run typecheck
npm run codecheck

npm run test -w @stardust/web
npm run test -w @stardust/server
npm run test -w @stardust/studio
npm run test -w @stardust/core

npm run test -w @stardust/web -- caminho/do/arquivo
npm run test -w @stardust/server -- caminho/do/arquivo
npm run test -w @stardust/studio -- caminho/do/arquivo
npm run test -w @stardust/core -- caminho/do/arquivo

npm run typecheck -w @stardust/web
npm run codecheck -w @stardust/web
npm run typecheck -w @stardust/server
npm run codecheck -w @stardust/server
npm run typecheck -w @stardust/studio
npm run codecheck -w @stardust/studio
npm run typecheck -w @stardust/core
npm run codecheck -w @stardust/core
```

<Prompt para subagent>
