## Organização dos Arquivos

- Cada estrutura de domínio possui seu próprio arquivo de teste, nomeado com o
  mesmo nome da estrutura seguido de `.test.ts` (ex: `Id.test.ts`,
  `Email.test.ts`, `List.test.ts`).
- Todos os arquivos de teste estão agrupados em uma pasta `tests` dentro do
  diretório.

## Estrutura dos Testes

- Os testes utilizam o framework Jest, com blocos `describe` para agrupar testes
  relacionados a uma estrutura específica.
- O bloco `describe` recebe o nome do objeto e o tipo de objeto. Ex.:
  `Level Structure`, `User Entity`, `Create User Use Case`, `useToast hook`,
  `Sign In Form View`.
- Cada funcionalidade ou método da estrutura recebe um ou mais blocos `it`,
  descrevendo o comportamento esperado.
- Os nomes dos testes são descritivos, geralmente em inglês, explicando
  claramente o que está sendo testado (ex: "should create a valid Id", "should
  throw error for invalid value").

## Cobertura de Casos

- Os testes cobrem tanto casos de sucesso (valores válidos, comportamentos
  esperados) quanto casos de erro (valores inválidos, exceções lançadas).

## Assertividade

- Utilização de matchers do Jest como `expect(...).toBe(...)`,
  `expect(...).toThrow(...)`, `expect(...).toEqual(...)` para verificar os
  resultados.
- Em casos de erro, é comum testar se a exceção correta é lançada ao passar
  valores inválidos.

## Setup Explícito

É comum encontrar blocos de setup no início de cada teste ou dentro de um
`beforeEach`, onde as dependências são instanciadas e o ambiente do teste é
preparado. O setup é feito de forma explícita, evitando efeitos colaterais entre
testes.

Exemplo:

```ts
describe("Update Story Use Case", () => {
  let repositoryMock: Mock<StoriesRepository>; // Mock do repository
  let useCase: UpdateStoryUseCase; // Use Case que está sendo testado

  beforeEach(() => {
    repositoryMock = mock<StoriesRepository>();
    repositoryMock.update.mockImplementation();
    useCase = new UpdateStoryUseCase(repositoryMock);
  });

  // ...
});
```

## Uso de Fakes e Mocks

- Os testes de use cases frequentemente utilizam fakes ou mocks para
  dependências externas, como serviços, repositórios ou gateways. Isso permite
  isolar o comportamento do caso de uso, garantindo que o teste foque apenas na
  lógica do use case.
- Os fakes/mocks são geralmente criados manualmente ou importados de
  implementações específicas para testes.

## Princípios de Isolamento

- Cada teste é independente, não dependendo do estado de outros testes.
- Em objetos de domínio não há mocks ou fakes complexos nesses testes de
  estruturas, pois são objetos de valor simples.

## Clareza e Simplicidade

- Os testes são curtos, diretos e focados em um único comportamento por vez.
- Não há lógica desnecessária ou setups complexos, refletindo a simplicidade das
  estruturas testadas.

---

**Exemplo de um teste unitário de uma structure:**

```ts
describe("Id Struture", () => {
  it("should create a valid Id", () => {
    const id = Id.create("valid-uuid");
    expect(id.value).toBe("valid-uuid");
  });

  it("should throw an error for invalid value", () => {
    expect(() => Id.create("invalid")).toThrow();
  });
});
```
