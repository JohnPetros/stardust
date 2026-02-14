# Regras de Testes de Objetos de Domínio

O domínio é o coração do StarDust. Como ele encapsula as regras de negócio essenciais, garantimos que essa camada possua uma alta cobertura de testes e siga padrões rigorosos de qualidade.

Este documento detalha como testar **Entidades**, **Estruturas (Value Objects)** e **Agregados**.

## 📍 Localização e Nomenclatura

Os arquivos de teste devem ser colocados em uma subpasta `tests` dentro do diretório do objeto correspondente.

- **Entidades**: `packages/core/src/[modulo]/domain/entities/tests/[NomeEntidade].test.ts`
- **Estruturas**: `packages/core/src/[modulo]/domain/structures/tests/[NomeEstrutura].test.ts`

O sufixo deve ser sempre `.test.ts`.

## 🥸 O Papel dos Fakers

Para agilizar a criação de testes e evitar o acoplamento com a estrutura interna de DTOs, utilizamos **Fakers**. Cada objeto de domínio complexo deve ter seu Faker correspondente.

- **Uso**: Sempre prefira `EntidadeFaker.fake()` em vez de instanciar manualmente no teste.
- **Sobrescrita**: Utilize o parâmetro de overrides para definir apenas os dados relevantes para o cenário do teste.

```ts
// Bom: Foca apenas no que importa para o teste
const user = UsersFaker.fake({ coins: 0 });

// Ruim: Verboso e propenso a quebras por mudanças no DTO
const user = User.create({
  id: 'any-id',
  name: 'Any Name',
  email: 'any@email.com',
  coins: 0,
  // ... dezenas de outros campos
});
```

---

## 🏗️ Testando Entidades (Entities)

Entidades são mutáveis e identificadas por um `id`. Os testes devem focar no **comportamento** e nas **mudanças de estado**.

### O que testar:
1.  **Métodos de Negócio**: Verifique se o estado interno (`props`) muda corretamente após a execução de um método.
2.  **Regras de Validação**: Verifique se exceções (Domain Errors) são lançadas quando pré-condições não são atendidas.
3.  **Garantia de Identidade**: Verifique se a identidade é preservada.
4.  **Conversão para DTO**: Garanta que o método `dto` ou getter `dto` retorna a representação correta.

### Exemplo:
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

## 💎 Testando Estruturas (Structures)

Estruturas (Value Objects) são imutáveis. O foco dos testes deve ser a **validação na criação** e a **corretude das operações**.

### O que testar:
1.  **Criação (Factory Method)**: Teste o método `static create()` com valores válidos e inválidos.
2.  **Imutabilidade**: Garanta que métodos que "alteram" o valor retornem uma **nova instância**, sem modificar a original.
3.  **Comparação**: Teste métodos de igualdade como `isEqualTo`.
4.  **Lógica Interna**: Teste algoritmos encapsulados (ex: cálculo de XP, formatação).

### Exemplo:
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
    
    expect(nextLevel).not.toBe(level); // Imutabilidade
    expect(nextLevel.value).toBe(2);
  });
});
```

---

## 🧩 Testando Agregados (Aggregates)

Como agregados apenas encapsulam uma relação entre entidades, seus testes geralmente são simples e focam em garantir que a entidade agregada está sendo carregada ou referenciada corretamente.

---

## 🚀 Boas Práticas

1.  **Isolamento**: Testes de domínio **nunca** devem depender de infraestrutura (banco de dados, APIs).
2.  **Tipagem Forte**: Utilize os tipos de domínio (como `Integer`, `Id`, `Logical`) nas asserções sempre que possível.
3.  **Arrange-Act-Assert**:
    - **Arrange**: Prepare o estado usando Fakers.
    - **Act**: Chame o método de domínio.
    - **Assert**: Verifique o resultado ou a mudança de estado.
4.  **Use Spies com moderação**: Se um objeto de domínio interage com outro objeto complexo passado por parâmetro, use `jest.spyOn` para verificar a interação se necessário.

## Tooling

- Runner de testes: Jest (principalmente no pacote `@stardust/core`).
- Geracao de dados: fakers do core + `@faker-js/faker` (quando aplicavel).
- Comandos:
  - `npm run test -w @stardust/core`
  - `npm run typecheck -w @stardust/core`
- Referencia geral: `documentation/tooling.md`.
