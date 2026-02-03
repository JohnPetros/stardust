# Diretrizes de Teste de Casos de Uso (Use Cases)

Esta documentação define os padrões e práticas para escrever testes unitários para os Casos de Uso (Use Cases) no projeto Stardust.

## 1. Localização e Nomenclatura

- **Localização:** Os testes devem ser colocados em uma pasta `tests/` dentro do diretório `use-cases/` correspondente.
- **Nomenclatura:** `[NomeDoUseCase].test.ts`.

Exemplo: `packages/core/src/profile/use-cases/tests/CreateUserUseCase.test.ts`.

## 2. Estrutura do Teste

Seguimos o padrão `describe`, `beforeEach` e `it`.

### 2.1. Mocking de Dependências

Utilizamos o `ts-jest-mocker` para criar mocks das interfaces dos repositórios ou outros serviços.

```ts
import { mock, type Mock } from 'ts-jest-mocker';
import type { UsersRepository } from '#profile/interfaces/UsersRepository';

describe('Create User Use Case', () => {
  let repositoryMock: Mock<UsersRepository>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // 1. Criar o mock da interface
    repositoryMock = mock<UsersRepository>();
    
    // 2. Definir implementações padrão se necessário
    repositoryMock.findByEmail.mockImplementation();
    repositoryMock.add.mockImplementation();

    // 3. Instanciar o Use Case com o mock
    useCase = new CreateUserUseCase(repositoryMock);
  });
});
```

## 3. Padrões de Teste

### 3.1. Testando Caminhos de Sucesso

Verifique se o Use Case chama os métodos corretos das dependências com os dados transformados adequadamente.

```ts
it('should create a user with the given request data', async () => {
  // Arrange
  const dto = UsersFaker.fakeDto();
  repositoryMock.findByEmail.mockResolvedValue(null);
  repositoryMock.findByName.mockResolvedValue(null);

  // Act
  await useCase.execute({
    userId: dto.id,
    userEmail: dto.email,
    userName: dto.name,
    // ...
  });

  // Assert
  expect(repositoryMock.add).toHaveBeenCalledWith(expect.any(User));
});
```

### 3.2. Testando Erros de Negócio

Utilize `expect(...).rejects.toThrow()` para validar se o Use Case lança as exceções corretas em cenários de erro.

```ts
it('should throw an error if the email is already in use', async () => {
  // Arrange
  const dto = UsersFaker.fakeDto();
  repositoryMock.findByEmail.mockResolvedValue(UsersFaker.fake());

  // Act & Assert
  await expect(
    useCase.execute({
      userId: dto.id,
      userEmail: dto.email,
      // ...
    })
  ).rejects.toThrow(UserEmailAlreadyInUseError);
});
```

## 4. Uso de Fakers

Sempre utilize os `Fakers` das entidades para gerar dados de teste. Isso evita a criação manual de objetos complexos e mantém o código de teste limpo.

```ts
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker';

const user = UsersFaker.fake(); // Retorna uma entidade User
const dto = UsersFaker.fakeDto(); // Retorna um DTO
```

## 5. Boas Práticas

1.  **Isolamento:** Cada `it` deve ser independente. Use `beforeEach` para garantir um estado limpo.
2.  **Mocks Type-Safe:** Sempre use `Mock<T>` para tipar as variáveis de mock.
3.  **Asserções Específicas:** Prefira `toHaveBeenCalledWith` com valores específicos em vez de apenas `toHaveBeenCalled`.
4.  **Async/Await:** A maioria dos Use Cases são assíncronos; certifique-se de usar `await` no `execute` e no `expect(...).rejects`.
