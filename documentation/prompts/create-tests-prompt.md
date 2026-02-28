---
description: Prompt para criar testes unitarios e de integracao seguindo os padroes de testes do projeto.
---

# Prompt: Criar testes

## Objetivo

Orientar a criacao de testes unitarios e de integracao **padronizados** e **eficientes**, garantindo:

- integridade da logica de negocio
- orquestracao correta de `handlers`
- fidelidade funcional de componentes de UI

## Entrada

- **Codigo fonte:** arquivo a ser testado (`Entity`, `Structure`, `Use Case`, `Controller`, `Action`, `Tool`, `Hook` ou `Widget`).

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
- **Handlers** (`REST`, `RPC`, `AI`): [handlers-testing-rules.md](../rules/handlers-testing-rules.md)
- **Widgets** (UI): [widget-tests-rules.md](../rules/widget-tests-rules.md)

### Estrutura e nomenclatura

- **Localizacao:** crie testes **co-localizados** em uma subpasta `tests/` no diretorio do arquivo original.
- **Extensao:**

| Tipo | Extensao |
| --- | --- |
| Logica e `handlers` | `.test.ts` |
| Componentes (`Widget`, `Page`) | `.test.tsx` |

- **Exemplo:**
  - Original: `src/auth/actions/SignInAction.ts`
  - Teste: `src/auth/actions/tests/SignInAction.test.ts`

### Stack de testes

- **Runner:** `jest`
- **Mocking:** `ts-jest-mocker` (usar `mock<Interface>()` e `Mock<Interface>`)
- **Fakers:** `@faker-js/faker` via classes estaticas em `domain/entities/fakers/`
- **React:** `@testing-library/react` e `@testing-library/user-event`

### Preparacao de dados (`fakers`)

- Use sempre classes `Faker` (ex: `UsersFaker.fake()`) para instanciar entidades, DTOs e estruturas.
- Se o `Faker` necessario nao existir, **crie-o primeiro** seguindo o padrao do dominio.

### Estrategia por tipo de teste

- **Domain objects:** validacoes de regras no construtor/factory e metodos de comportamento.
- **Use cases:** 100% da logica de negocio, cobrindo `happy path` e todas as excecoes de dominio.
- **Handlers:** extracao de dados do contexto (`Http`, `Call`, `Mcp`), orquestracao do caso de uso/servico e formatacao da resposta.
- **Widgets:**
  - testar `hooks` e `views` separadamente usando `Hook()` e `View()`
  - para formularios complexos, testar integracao no `Widget` (Index)

### Qualidade e `clean code`

- **Arrange-Act-Assert:** estruturar os testes nas 3 fases (sem comentarios; uma quebra de linha e suficiente).
- **Isolamento:** usar `beforeEach` para reiniciar `mocks` e garantir que cada `it` seja independente.
- **Assercoes especificas:** preferir `toHaveBeenCalledWith` com valores exatos ou `expect.objectContaining`.

### Workflow sugerido

1. Setup: criar `tests/` e o arquivo `<Nome>.test.ts(x)`.
2. Mocking: identificar interfaces de dependencia e instanciar `mocks`.
3. Implementacao: comecar pelo caminho de sucesso e depois cobrir cenarios de erro/excecao.
4. Validacao: executar no escopo correto do monorepo.

```bash
npm run test:web
npm run test:server
npm run test:studio
npm run test:core

cd apps/web && npm run test -- caminho/do/arquivo
cd apps/server && npm run test -- caminho/do/arquivo
cd apps/studio && npm run test -- caminho/do/arquivo
cd packages/core && npm run test -- caminho/do/arquivo
```

<Prompt para subagent>
