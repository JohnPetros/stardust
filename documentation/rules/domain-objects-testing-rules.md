# Domain Object Testing Rules

The domain is the heart of StarDust. Since it encapsulates the essential business rules, we ensure that this layer has high test coverage and follows strict quality standards.

This document details how to test **Entities**, **Structures (Value Objects)**, and **Aggregates**.

## 📍 Location and Naming

Test files must be placed in a `tests` subfolder inside the corresponding object's directory.

- **Entities**: `packages/core/src/[module]/domain/entities/tests/[EntityName].test.ts`
- **Structures**: `packages/core/src/[module]/domain/structures/tests/[StructureName].test.ts`

The suffix must always be `.test.ts`.

## 🥸 The Role of Fakers

To speed up test creation and avoid coupling to the internal structure of DTOs, we use **Fakers**. Every complex domain object must have its corresponding Faker.

- **Usage**: Always prefer `EntityFaker.fake()` over instantiating manually in the test.
- **Overrides**: Use the overrides parameter to define only the data relevant to the test scenario.

```ts
// Good: Focuses only on what matters for the test
const user = UsersFaker.fake({ coins: 0 });

// Bad: Verbose and prone to breaking on DTO changes
const user = User.create({
  id: 'any-id',
  name: 'Any Name',
  email: 'any@email.com',
  coins: 0,
  // ... dozens of other fields
});
```

---

## 🏗️ Testing Entities

Entities are mutable and identified by an `id`. Tests must focus on **behavior** and **state changes**.

### What to test:
1.  **Business Methods**: Verify that the internal state (`props`) changes correctly after a method runs.
2.  **Validation Rules**: Verify that exceptions (Domain Errors) are thrown when preconditions are not met.
3.  **Identity Guarantee**: Verify that identity is preserved.
4.  **DTO Conversion**: Ensure that the `dto` method or `dto` getter returns the correct representation.

### Example:
```ts
describe('User Entity', () => {
  it('should increase coins when user earns coins', () => {
    const user = UsersFaker.fake({ coins: 100 });
    
    user.earnCoins(Integer.create(50));
    
    expect(user.coins.value).toBe(150);
  });

  it('should throw NotEnoughCoinsError when losing more coins than available', () => {
    const user = UsersFaker.fake({ coins: 10 });
    
    expect(() => user.loseCoins(Integer.create(20)))
      .toThrow(NotEnoughCoinsError);
  });
});
```

---

## 💎 Testing Structures

Structures (Value Objects) are immutable. Tests must focus on **validation at creation** and **correctness of operations**.

### What to test:
1.  **Creation (Factory Method)**: Test the `static create()` method with valid and invalid values.
2.  **Immutability**: Ensure that methods that "change" the value return a **new instance**, without modifying the original.
3.  **Comparison**: Test equality methods such as `isEqualTo`.
4.  **Internal Logic**: Test encapsulated algorithms (e.g., XP calculation, formatting).

### Example:
```ts
describe('Email Structure', () => {
  it('should be created from a valid email string', () => {
    expect(() => Email.create('valid@email.com')).not.toThrow();
  });

  it('should throw ValidationError for invalid email formats', () => {
    expect(() => Email.create('invalid-email')).toThrow(ValidationError);
  });
});

describe('Level Structure', () => {
  it('should return a new instance when leveling up', () => {
    const level = Level.create(1);
    const nextLevel = level.up(currentXp, earnedXp);
    
    expect(nextLevel).not.toBe(level); // Immutability
    expect(nextLevel.value).toBe(2);
  });
});
```

---

## 🧩 Testing Aggregates

Since aggregates only encapsulate a relationship between entities, their tests are usually simple and focus on ensuring that the aggregated entity is being loaded or referenced correctly.

---

## 🚀 Best Practices

1.  **Isolation**: Domain tests must **never** depend on infrastructure (database, APIs).
2.  **Strong Typing**: Use the domain types (such as `Integer`, `Id`, `Logical`) in assertions whenever possible.
3.  **Arrange-Act-Assert**:
    - **Arrange**: Prepare the state using Fakers.
    - **Act**: Call the domain method.
    - **Assert**: Verify the result or the state change.
4.  **Use Spies sparingly**: If a domain object interacts with another complex object passed as a parameter, use `jest.spyOn` to verify the interaction if needed.

## Tooling

- Test runner: Jest (mainly in the `@stardust/core` package).
- Data generation: core fakers + `@faker-js/faker` (when applicable).
- Commands:
  - `pnpm --filter @stardust/core run test:unit`
  - `pnpm --filter @stardust/core run check:types`
- General reference: `documentation/tooling.md`.
