# Prompt: Criar testes 🧪

**Objetivo:** Orientar a criação de testes unitários e de integração padronizados e eficientes, garantindo a integridade da lógica de negócios, a orquestração correta dos handlers e a fidelidade funcional dos componentes de UI.

**Entrada:**

- **Código Fonte:** Arquivo a ser testado (`Entity`, `Structure`, `Use Case`, `Controller`, `Action`, `Tool`, `Hook` ou `Widget`).

---

## 📋 Regras de Execução

### 1. Adesão às Normas do Projeto

Identifique o tipo de código que está sendo testado e leia e siga a regra correspondente em `documentation/rules/`: 

- **Objetos de Domínio:** [domain-objects-testing-rules.md](./documentation/rules/domain-objects-testing-rules.md)
- **Casos de Uso:** [use-cases-testing-rules.md](./documentation/rules/use-cases-testing-rules.md)
- **Handlers (REST, RPC, AI):** [handlers-testing-rules.md](./documentation/rules/handlers-testing-rules.md)
- **Widgets (UI):** [widget-tests-rules.md](./documentation/rules/widget-tests-rules.md)

### 2. Estrutura e Nomenclatura 📁

- **Localização:** Crie os testes **co-localizados** em uma subpasta `tests/` dentro do diretório do arquivo original.
- **Extensão:**
  - Lógica e Handlers: `.test.ts`
  - Componentes (Widgets, Pages): `.test.tsx`
- **Exemplo:**
  - Original: `src/auth/actions/SignInAction.ts`
  - Teste: `src/auth/actions/tests/SignInAction.test.ts`

### 3. Stack de Testes 🛠️

- **Runner:** Jest
- **Mocking:** `ts-jest-mocker` (Use `mock<Interface>()` e `Mock<Interface>`)
- **Fakers:** `@faker-js/faker` via classes estáticas em `domain/entities/fakers/`
- **React:** `@testing-library/react` e `@testing-library/user-event`

### 4. Preparação de Dados (Fakers)

- **Uso de Fakers:** Utilize sempre as classes `Faker` (ex: `UsersFaker.fake()`) para instanciar Entidades, DTOs e Estruturas.
- **Ação Pró-ativa:** Se o `Faker` necessário não existir, **crie-o primeiro** seguindo o padrão do domínio.

### 5. Estratégia por Tipo de Teste 🎯

- **Domain Objects:** Foco em validações de regras no construtor/factory e métodos de comportamento.
- **Use Cases:** Teste 100% da lógica de negócio, cobrindo "Happy Path" e todas as exceções de domínio.
- **Handlers:** Foco na extração de dados do contexto (`Http`, `Call`, `Mcp`), orquestração do Caso de Uso/Serviço e formatação da resposta.
- **Widgets:**
  - Teste **Hooks** e **Views** separadamente utilizando as funções auxiliares `Hook()` e `View()`.
  - Para **Formulários complexos**, realize o teste de integração no **Widget (Index)**.

### 6. Qualidade e Clean Code

- **Arrange-Act-Assert:** Estruture os testes claramente nestas 3 fases (Não adicione comentários, uma quebra de linha já é o suficiente).
- **Isolamento:** Use `beforeEach` para reiniciar mocks e garantir que cada `it` seja independente.
- **Asserções Específicas:** Prefira `toHaveBeenCalledWith` com valores exatos ou `expect.objectContaining`.

---

## 🚀 Workflow Sugerido

1. **🔍 Setup:** Crie a pasta `tests/` e o arquivo `<Nome>.test.ts(x)`.
2. **🎭 Mocking:** Identifique as interfaces de dependência e instancie os mocks.
3. **🛠️ Implementação:** Comece pelo caminho de sucesso e depois cubra os cenários de erro/exceção.
4. **✅ Validação:** Execute o teste no escopo correto do monorepo:
  - `npm run test:web` para executar todos os testes da app web.
  - `npm run test:server` para executar todos os testes da app server.
  - `npm run test:studio` para executar todos os testes da app studio.
  - `npm run test:core` para executar todos os testes do package core.
  - `cd apps/web && npm run test -- caminho/do/arquivo` para executar um teste específico dentro da app web.
  - `cd apps/server && npm run test -- caminho/do/arquivo` para executar um teste específico da app server.
  - `cd apps/studio && npm run test -- caminho/do/arquivo` para executar um teste específico da app studio.
  - `cd packages/core && npm run test -- caminho/do/arquivo` para executar um teste específico da app core.

