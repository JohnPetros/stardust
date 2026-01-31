# Create Unit/Widget Test Skill 🧪

**Objetivo:**
Orientar a criação de testes unitários e de integração (widgets) padronizados e eficientes, garantindo a integridade da lógica de negócios e a fidelidade funcional dos componentes React.

**Entrada:**
*   **Código Fonte:** Arquivo do `Use Case`, `Hook`, `Entity` ou `Widget` (Componente React) a ser testado.

---

## 📋 Diretrizes de Execução

### 1. Adesão às Normas do Projeto
*   **Obrigatório:** Siga rigorosamente as diretrizes em [unit-tests-guidelines.md](../guidelines/unit-tests-guidelines.md).
*   **Consulta:** Verifique também [ui-later-guidelines.md](../guidelines/ui-later-guidelines.md) para convenções de componentes.

### 2. Estrutura e Nomenclatura 📁
*   **Localização:** Crie os testes **co-localizados** em uma subpasta `tests/` dentro do diretório do arquivo original.
*   **Extensão:**
    *   Lógica (Use Cases, Hooks, Utils): `.test.ts`
    *   Componentes (Widgets, Pages): `.test.tsx`
*   **Exemplo:**
    *   Original: `src/profile/use-cases/ListUsersUseCase.ts`
    *   Teste: `src/profile/use-cases/tests/ListUsersUseCase.test.ts`

### 3. Stack de Testes 🛠️
*   **Runner:** Jest
*   **Mocking:** `ts-jest-mocker` (Use `mock<Interface>()` e `Mock<Interface>`)
*   **Fakers:** `@faker-js/faker` via classes estáticas em `domain/entities/fakers/`
*   **React:** `@testing-library/react` e `@testing-library/user-event`

### 4. Preparação de Dados (Fakers)
*   **Uso de Fakers:** Utilize classes `Faker` estáticas (ex: `UsersFaker.fake()`) para instanciar Entidades e DTOs.
*   **Ação Pró-ativa:** Se o `Faker` para uma entidade específica não existir, **crie-o primeiro** seguindo o padrão das outras entidades.

### 5. Estratégia de Teste 🎯
*   **Use Cases:** Teste 100% da lógica de negócio, cobrindo caminhos de sucesso e exceções de domínio.
*   **Hooks:** Use `renderHook` para testar lógica de estado encapsulada.
*   **Widgets:**
    *   Geralmente teste a **View** isolada mockando seus handlers.
    *   Para **Formulários complexos** (React Hook Form), teste o **Widget completo (Index)**.

### 6. Qualidade e Clean Code
*   **Arrange-Act-Assert:** Estruture seus testes claramente nestas 3 fases.
*   **Isolamento:** Use `beforeEach` para reiniciar mocks e estado.
*   **Legibilidade:** Nomes de testes devem ser frases descritivas ("should do something when condition").
*   **Comentários**: Evite usar comentários desnecessários, mas use-os para explicar o propósito de um teste ou uma estratégia de teste caso seja necessário.

---

## 🚀 Workflow Sugerido

1.  **🔍 Setup:**
    *   Crie a pasta `tests/` se não existir.
    *   Crie o arquivo `<Nome>.test.ts(x)`.
    *   Configure o `describe` e o `beforeEach` com os mocks necessários.

2.  **🎭 Mocking & Faking:**
    *   Instancie as dependências usando `mock<T>()`.
    *   Gere dados de entrada usando `<Entity>Faker.fake()`.
    *   Se precisar cria um Id, use o `IdFaker.fake()`.

3.  **🛠️ Implementação:**
    *   Escreva casos `it('should ...')` para o "Happy Path".
    *   Escreva casos para erros de validação e exceções.
    *   Verifique chamadas de métodos de repositórios/serviços (`toHaveBeenCalledWith`).

4.  **✅ Validação:**
    *   Execute o teste criado: `npm run test -- caminho/do/arquivo.test.ts`.
    *   **Contexto de Monorepo:** Lembre-se de rodar o comando **dentro do diretório do projeto específico** (ex: `packages/core` ou `apps/web`), pois cada um possui seu próprio `package.json`.
