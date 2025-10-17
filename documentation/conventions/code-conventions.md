# Nomeação de variáveis, tipos, objetos e funções

## Idioma

Todo o código do projeto é escrito em inglês, pois acredita-se que é mais fácil
escrever assim do que se fosse em português.

## Camel case

variáveis locais, propriedades de objetos, parâmetros de função e nomes de
funções/métodos deve ser escritas em
[camelCase](https://developer.mozilla.org/en-US/docs/Glossary/Camel_case)

## Pascal case

Nome de classes, interfaces, tipos e funções fábrica são escritos em
[PascalCase](https://www.theserverside.com/definition/Pascal-case).

## Descritividade e Clareza

Sempre opte por nomes que descrevam claramente o propósito da variável.
`productsList` é melhor que pl ou items, por exemplo.

## Menos redundância

Se você já tem o nome explicícito significa que, muitas vezes, você pode
simplicar o nome da variável.

ex.:

```ts
const controller = new FetchLastWeekRankingWinnersController();

// em vez de

const fetchLastWeekRankingWinnersController =
  new FetchLastWeekRankingWinnersController();
```

## Variáveis Booleanas:

Use prefixos como `is`, `has`, `can`, `should` para variáveis que armazenam
valores booleanos.

Exemplos: `isActive`, `hasPermission`, `canEdit`, `shouldRetry`.

> Diferença entre `can` e `should`: quando variável serve indica true para
> executar uma ação use `should`, nos demais casos opte por `can`.

## Variáveis de coleção

Use o plural para nomes de arrays ou listas.

Exemplos: `users`, `achievements`, `unlockedStars`.

## Variáveis de número

Use o sufixo `count` para indicar que uma variável é um número.

Exemplos: `upvotesCount`, `completedChallengesCount`, `unlockedStarsCount`

Essa regra não é necessária para substantivos que por natureza já são
representados como número, como `height`, `level`, `margin` etc.

## Constantes

São escritas em caixa alta e em
[snake_case](https://www.theserverside.com/definition/Snake-case).

Exemplos: `SUPABASE_URL`, `HEADER_HEIGHT`, `EVENT_KEY`.

## Interfaces

Caso a interface tenha o mesmo nome que a classe ou função fábrica, importe-a
via alias com I maiuscula como prefixo.

Exemplo: `import { ProfileService as IProfileService }`

## Funções

Funções sempre devem começar com um verbo no imperativo, exceto factory
functions, que devem ser substantivos.

Exemplos: `unlockStar`, `earnCoins`, `acquireAvatar`.

## Nomeação de arquivos

Um arquivo serve para exportar um classe, factory function, widget, função,
objeto de validação, tipo, interface e constante. Quase sempre a regras de
nomeação de objetos se aplicam também ao nome dos arquivos, excetos as contantes
que deve ser escritos em
[kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

Exemplos:

```
AppError.ts // Classe
ProfilePageView.tsx // Widget
usePagination.ts // função
special-characters.ts // constante
userSchema.ts // objeto de validação
```

# Barrel files

Um Barrel File é um arquivo (geralmente nomeado index.ts ou index.tsx) que tem a
função de exportar múltiplos módulos de uma pasta centralizada. Em vez de
importar cada módulo individualmente de sua respectiva localização, é possível
importar tudo diretamente do barrel file, simplificando as declarações de
importação.

## Exemplo prático

Considere uma pasta controllers contendo diversas classes de controladores:

```ts
// controllers/index.ts
export { Controller1 } from "./Controller1";
export { Controller2 } from "./Controller2";
export { Controller3 } from "./Controller3";
export { Controller4 } from "./Controller4";
```

Então, em outro arquivo, você pode importar esses componentes de forma
simplificada:

```ts
// Sua aplicação.ts
import { Controller1, Controller2 } from "./controllers";

const controller1 = new Controller1();
const controller2 = new Controller2();
```

> [!Caution]\
> Pastas dedicadas a exportar hooks e widgets não possuem um arquivo index.ts
> para evitar problemas execução indevida de código e para deixar mais explícito
> para qual hook ou widget está sendo criado um mock em testes automatizados.

# Factory functions

Em projetos React, o paradigma funcional é priorizado. Para manter a
consistência em toda a aplicação, as Factory Functions (Funções Fábrica) são
adotadas como padrão para a criação de "classes" e módulos que precisam
gerenciar estado ou dependências.

Uma Factory Function é uma função que retorna um novo objeto. Pode-se
considerá-las um "construtor" flexível que não exige a palavra-chave new. Elas
oferecem uma alternativa poderosa e mais idiomática ao uso de class ou funções
construtoras tradicionais em JavaScript moderno, especialmente em um contexto
funcional.

Para garantir a consistência e a legibilidade, as Factory Functions devem seguir
as seguintes convenções:

- Declaração: Devem ser declaradas como uma arrow function (=>) e associadas a
  uma constante (const).
- Retorno: Devem sempre retornar um objeto contendo os métodos e/ou propriedades
  que a função fábrica expõe.
- Tipagem: Se a função fábrica estiver implementando uma interface, a interface
  deve ser o tipo de retorno explícito da função.
- Nomenclatura: O nome da função deve ser escrito em
  [PascalCase](https://www.theserverside.com/definition/Pascal-case) (ex:
  MeuServico, GerenciadorDeDados).
- Inversão de Dependência: Seus argumentos devem ser dependências (como outros
  serviços, clientes HTTP, etc.), aplicando o princípio da
  [Inversão de Dependência](https://www.baeldung.com/cs/dip). Isso facilita a
  testabilidade e a manutenção.

## Exemplo prático

```ts
// Define a interface para garantir o contrato do serviço
interface ISpaceService {
  fetchPlanets(): Promise<any>;
  fetchStarBySlug(starSlug: Slug): Promise<any>;
  fetchStarById(starId: Id): Promise<any>;
}

const SpaceService = (restClient: RestClient): ISpaceService => {
  // A função retorna um objeto que implementa ISpaceService
  return {
    async fetchPlanets() {
      return await restClient.get("/space/planets");
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`);
    },
  };
};

// Exemplo de uso: instanciando o serviço (observa-se que não se utiliza 'new')
const myRestClient = new RestClient(); // Supondo uma instância de RestClient
const spaceServiceInstance = SpaceService(myRestClient);
```

Caso seja necessária lógica auxiliar que não precisa ser exposta publicamente, é
possível declarar funções internas dentro da Factory Function. Elas se
beneficiam do closure para acessar as dependências passadas para a fábrica.

```ts
export const AccessChallengeEditorPageAction = (
  service: ChallengingService,
) => {
  async function fetchChallenge(challengeSlug: string) {
    return await service.fetchChallengeBySlug(Slug.create(challengeSlug));
  }

  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest();
      return fetchChallenge(challengeSlug);
    },
  };
};
```
