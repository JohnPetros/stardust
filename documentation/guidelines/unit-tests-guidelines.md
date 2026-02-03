# Introdução

Testes automatizados são fundamentais para garantir a estabilidade, corretude e
manutenção do código a longo prazo. No Stardust, adotamos uma estratégia de
testes focada principalmente em testes unitários para a lógica de negócio e
testes de integração para pontos críticos.

Este guia define as convenções, ferramentas e padrões que devem ser seguidos ao
escrever testes no projeto.

# Stack de Testes

Utilizamos as seguintes ferramentas principais:

| Ferramenta          | Propósito                                                                      |
| ------------------- | ------------------------------------------------------------------------------ |
| **Jest**            | Runner de testes e biblioteca de asserção.                                     |
| **ts-jest-mocker**  | Biblioteca para criar mocks de interfaces e classes TypeScript com facilidade. |
| **@faker-js/faker** | Geração de dados falsos e aleatórios para testes.                              |

# Localização dos Arquivos

Os arquivos de teste devem ser co-localizados próximos ao código que estão
testando, mas dentro de uma subpasta chamada `tests`.

**Estrutura recomendada:**

```
src/
└── [dominio]/
    └── use-cases/
        ├── ListUsersUseCase.ts
        └── tests/
            └── ListUsersUseCase.test.ts
```

O nome do arquivo de teste deve ser o mesmo do arquivo sendo testado,
adicionando o sufixo `.test.ts`.

# Estrutura de um Teste Unitário

Seguimos o padrão `describe` e `it` do Jest.

1. **Describe principal**: Deve conter o nome da classe ou unidade sendo
   testada.
2. **Setup (beforeEach)**: Onde instanciamos os mocks e a classe sob teste
   (System Under Test - SUT).
3. **Casos de teste (it)**: Devem descrever o comportamento esperado, geralmente
   começando com "should" (deve).

## Exemplo Básico

```ts
import { type Mock, mock } from "ts-jest-mocker";
import { MeuService } from "../MeuService";
import { IRepository } from "../IRepository";
import { MinhaEntidadeFaker } from "../../domain/entities/fakers/MinhaEntidadeFaker";

describe("Meu Service", () => {
  let repository: Mock<IRepository>;
  let service: MeuService;

  beforeEach(() => {
    // 1. Criar o mock
    repository = mock<IRepository>();

    // 2. Inicializar comportamentos padrão se necessário (opcional)
    repository.save.mockImplementation();

    // 3. Instanciar o serviço injetando o mock
    service = new MeuService(repository);
  });

  it("should create a new entity successfully", async () => {
    // Arrange
    const entity = MinhaEntidadeFaker.fake();
    repository.exists.mockResolvedValue(false);

    // Act
    await service.execute(entity);

    // Assert
    expect(repository.save).toHaveBeenCalledWith(entity);
  });
});
```

# Mocking

Para mocks, utilizamos estritamente a biblioteca `ts-jest-mocker`. Ela permite
mockar interfaces TypeScript de forma type-safe.

**Regras:**

- Use o tipo `Mock<T>` para tipar a variável do mock.
- Use a função `mock<T>()` no `beforeEach` para criar uma instância limpa para
  cada teste.
- Configure os retornos dos métodos usando `.mockResolvedValue(val)` (para
  Promises) ou `.mockReturnValue(val)`.

```ts
// Tipagem
let repository: Mock<UsersRepository>;

// Instanciação
repository = mock<UsersRepository>();

// Configuração de retorno
repository.findById.mockResolvedValue(null); // Simula usuário não encontrado
repository.findById.mockResolvedValue(user); // Simula usuário encontrado
```

# Fakers

Para evitar a criação manual de objetos complexos nos testes, utilizamos o
padrão **Faker**. Cada entidade de domínio complexa deve ter uma classe `Faker`
correspondente em `domain/entities/fakers/`.

Essas classes utilizam a biblioteca `@faker-js/faker` para gerar dados
aleatórios válidos.

**Métodos Padrão:**

- `fake(overrides?: Partial<Dto>)`: Cria uma única instância da entidade.
- `fakeMany(count: number, overrides?: Partial<Dto>)`: Cria uma lista de
  instâncias.

Exemplo de uso:

```ts
// Criar um usuário aleatório
const user = UsersFaker.fake();

// Criar um usuário com email específico
const userSpecific = UsersFaker.fake({ email: "test@example.com" });

// Criar lista de 10 usuários
const usersList = UsersFaker.fakeMany(10);
```

# Testando Casos de Uso (Use Cases)

Os casos de uso contêm a lógica de negócio pura e devem ter cobertura total.

## Testando Caminhos de Sucesso

Verifique se o caso de uso chama as dependências corretamente e retorna o
resultado esperado.

```ts
it("should perform the action successfully", async () => {
  const result = await useCase.execute(payload);
  expect(repository.save).toHaveBeenCalled();
  expect(result).toBeDefined();
});
```

## Testando Erros

Verifique se o caso de uso lança as exceções corretas quando algo dá errado.

```ts
import { UserNotFoundError } from "#profile/domain/errors/UserNotFoundError";

it("should throw UserNotFoundError if user does not exist", async () => {
  repository.findById.mockResolvedValue(null);

  await expect(
    useCase.execute({ userId: "invalid-id" }),
  ).rejects.toThrow(UserNotFoundError);
});
```

# Testando Widgets (Frontend)

Ao testar componentes React (widgets), geralmente seguimos a separação entre
lógica (hook) e interface (view). No entanto, existem exceções para componentes
complexos de formulário.

## 1. Padrão: Separação de Responsabilidades

Na maioria dos casos, devemos testar o **Hook** e a **View** separadamente.

### Testando o Hook

Utilize `renderHook` da `@testing-library/react` para testar a lógica isolada.

```ts
import { act, renderHook } from "@testing-library/react";
import { useCounter } from "../useCounter";

describe("useCounter", () => {
  it("should increment count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### Testando a View

Utilize `render` e `screen` para testar a renderização e interações simples,
mockando os handlers.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounterView } from "../CounterView";

describe("CounterView", () => {
  it("should call onIncrement when button is clicked", async () => {
    const onIncrement = jest.fn();
    render(<CounterView count={0} onIncrement={onIncrement} />);

    await userEvent.click(screen.getByRole("button"));

    expect(onIncrement).toHaveBeenCalled();
  });
});
```

> O arquivo index.tsx do widget nunca deve ser testada.

## 2. Exceção: Widgets de Formulário (React Hook Form)

Widgets que dependem fortemente de bibliotecas de gerenciamento de estado local
complexo, como `react-hook-form`, tornam-se difíceis de testar separadamente (o
hook retornaria muitos métodos internos da lib, e a view precisaria de mocks
complexos do contexto do formulário).

Nesses casos, testamos o **Widget como um todo** (o componente exportado no
`index.tsx`), realizando um teste de integração de interface.

**O que testar:**

- Validação de campos (mensagens de erro).
- Comportamento de submissão (se a função `onSubmit` é chamada com os dados
  corretos).
- Estados visuais dependentes de inputs.

### Exemplo: Teste de Formulário

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../"; // Importa o widget principal (index)

describe("SignInForm", () => {
  const onSubmitMock = jest.fn();
  const fakeEmail = "user@example.com";

  const Widget = () => <SignInForm onSubmit={onSubmitMock} />;

  it("should render error when email is invalid", async () => {
    render(Widget());

    // Tenta submeter sem preencher
    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Verifica a mensagem de erro (aguardando a renderização assíncrona do hook form)
    await waitFor(() => {
      expect(screen.getByText("Email inválido")).toBeVisible();
    });
  });

  it("should call onSubmit with correct data when valid", async () => {
    render(Widget());

    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-button");

    // Preenche o formulário
    await userEvent.type(emailInput, fakeEmail);
    await userEvent.click(submitButton);

    // Verifica se a função de prop foi chamada
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: fakeEmail,
      });
    });
  });
});
```

**Dicas para Testes de Formulário:**

- Use `screen.getByTestId` para seletores estáveis.
- Use `userEvent` (e não `fireEvent`) para simular interações reais de usuário
  (digitação, clique).
- Use `waitFor` para asserções que dependem de mudanças de estado assíncronas do
  React Hook Form.

# Boas Práticas

1. **Nomes Descritivos**: O nome do teste deve explicar claramente O QUE está
   sendo testado e QUAL o resultado esperado.
   - Bom: `should throw error when user balance is insufficient`
   - Ruim: `should fail`
2. **Isolamento**: Cada teste deve ser independente. Nunca dependa do estado
   deixado por um teste anterior. O `beforeEach` é essencial para isso.
3. **Teste apenas a lógica da unidade**: Não teste se o mock funciona. Teste se
   sua unidade chama o mock corretamente.
4. **Arrange-Act-Assert**: Estruture mentalmente (ou com comentários, se ajudar
   na clareza) seus testes nessas três fases: Preparação, Ação e Verificação.
