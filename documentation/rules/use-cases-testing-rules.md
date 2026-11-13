# Use Case Testing Rules

This documentation defines the standards and practices for writing unit tests for Use Cases in the Stardust project.

## 1. Location and Naming

- **Location:** Tests must be placed in a `tests/` folder inside the corresponding `use-cases/` directory.
- **Naming:** `[UseCaseName].test.ts`.

Example: `packages/core/src/profile/use-cases/tests/CreateUserUseCase.test.ts`.

## 2. Test Structure

We follow the `describe`, `beforeEach` and `it` pattern.

### 2.1. Mocking Dependencies

We use `ts-jest-mocker` to create mocks of the repository interfaces or other services.

```ts
import { mock, type Mock } from 'ts-jest-mocker';
import type { UsersRepository } from '#profile/interfaces/UsersRepository';

describe('Create User Use Case', () => {
  let repositoryMock: Mock<UsersRepository>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    // 1. Create the interface mock
    repositoryMock = mock<UsersRepository>();
    
    // 2. Define default implementations if necessary
    repositoryMock.findByEmail.mockImplementation();
    repositoryMock.add.mockImplementation();

    // 3. Instantiate the Use Case with the mock
    useCase = new CreateUserUseCase(repositoryMock);
  });
});
```

## 3. Test Patterns

### 3.1. Testing Success Paths

Verify that the Use Case calls the correct methods of the dependencies with appropriately transformed data.

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

### 3.2. Testing Business Errors

Use `expect(...).rejects.toThrow()` to validate that the Use Case throws the correct exceptions in error scenarios.

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

## 4. Using Fakers

Always use the entity `Fakers` to generate test data. This avoids manually creating complex objects and keeps the test code clean.

```ts
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker';

const user = UsersFaker.fake(); // Returns a User entity
const dto = UsersFaker.fakeDto(); // Returns a DTO
```

## 5. Best Practices

1.  **Isolation:** Each `it` must be independent. Use `beforeEach` to guarantee a clean state.
2.  **Type-Safe Mocks:** Always use `Mock<T>` to type the mock variables.
3.  **Specific Assertions:** Prefer `toHaveBeenCalledWith` with specific values instead of just `toHaveBeenCalled`.
4.  **Async/Await:** Most Use Cases are asynchronous; make sure to use `await` on `execute` and on `expect(...).rejects`.

## Tooling

- Test runner: Jest.
- Type-safe mocks: `ts-jest-mocker`.
- Commands:
  - Core package: `pnpm --filter @stardust/core run test:unit`.
  - Global (Turbo): `pnpm run test`.
- Types and quality (before opening a PR): `pnpm --filter @stardust/core run check:types` and `pnpm --filter @stardust/core run check:code`.
- General reference: `documentation/tooling.md`.
