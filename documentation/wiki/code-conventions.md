# Introdução

Em poucas palavras, convenções de código são um conjunto de diretrizes e boas práticas que desenvolvedores seguem ao escrever código. Pense nelas como um "guia de estilo" para a programação. O objetivo principal é garantir que o código seja consistente, legível e fácil de manter por qualquer pessoa no projeto.

A seguir serão listadas as principais conveções na hora de escrever código

# Nomeação de variáveis, tipos, objetos e funções

## Idioma

Todo o código do projeto é escrito em inglês, pois acredita-se que é mais fácil escrever assim do que se fosse em português.

## Camel case

variáveis locais, propriedades de objetos, parâmetros de função e nomes de funções/métodos deve ser escritas em [camelCase](https://developer.mozilla.org/en-US/docs/Glossary/Camel_case)

## Pascal case

Nome de classes, interfaces, tipos e funções fábrica são escritos em [PascalCase](https://www.theserverside.com/definition/Pascal-case).

## Descritividade e Clareza

Sempre opte por nomes que descrevam claramente o propósito da variável. `productsList` é melhor que pl ou items, por exemplo.

## Menos redundância

Se você já tem o nome explicícito significa que, muitas vezes, você pode simplicar o nome da variável.

ex.:

```ts
const controller = new FetchLastWeekRankingWinnersController()

// em vez de

const fetchLastWeekRankingWinnersController = new FetchLastWeekRankingWinnersController()

```

## Variáveis Booleanas:

Use prefixos como `is`, `has`, `can`, `should` para variáveis que armazenam valores booleanos.

Exemplos: `isActive`, `hasPermission`, `canEdit`, `shouldRetry`.

> Diferença entre `can` e `should`: quando variável serve indica true para executar uma ação use `should`, nos demais casos opte por `can`.

## Variáveis de coleção

Use o plural para nomes de arrays ou listas.

Exemplos: `users`, `achievements`, `unlockedStars`.

## Variáveis de número

Use o sufixo `count` para indicar que uma variável é um número.

Exemplos: `upvotesCount`, `completedChallengesCount`, `unlockedStarsCount`

Essa regra não é necessária para substantivos que por natureza já são representados como número, como `height`, `level`, `margin` etc.

## Constantes

São escritas em caixa alta e em [snake_case](https://www.theserverside.com/definition/Snake-case).

Exemplos: `SUPABASE_URL`, `HEADER_HEIGHT`, `EVENT_KEY`. 

## Interfaces

Caso a interface tenha o mesmo nome que a classe ou função fábrica, importe-a via alias com I maiuscula como prefixo.

Exemplo: `import { ProfileService as IProfileService }`

## Funções

Funções sempre devem começar com um verbo no imperativo, exceto factory functions, que devem ser substantivos.

Exemplos: `unlockStar`, `earnCoins`, `acquireAvatar`.

## Nomeação de arquivos

Um arquivo serve para exportar um classe, factory function, widget, função, objeto de validação, tipo, interface e constante. Quase sempre a regras de nomeação de objetos se aplicam também ao nome dos arquivos, excetos as contantes que deve ser escritos em [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

Exemplos:

```
AppError.ts // Classe
ProfilePageView.tsx // Widget
usePagination.ts // função
special-characters.ts // constante
userSchema.ts // objeto de validação
```

# Barrel files

Um Barrel File é um arquivo (geralmente nomeado index.ts ou index.tsx) que tem a função de exportar múltiplos módulos de uma pasta centralizada. Em vez de importar cada módulo individualmente de sua respectiva localização, é possível importar tudo diretamente do barrel file, simplificando as declarações de importação.

## Exemplo prático

Considere uma pasta controllers contendo diversas classes de controladores:

```ts
// controllers/index.ts
export { Controller1 } from './Controller1'
export { Controller2 } from './Controller2'
export { Controller3 } from './Controller3'
export { Controller4 } from './Controller4'
```

Então, em outro arquivo, você pode importar esses componentes de forma simplificada:

```ts
// Sua aplicação.ts
import { Controller1, Controller2 } from './controllers'

const controller1 = new Controller1()
const controller2 = new Controller2()
```

> [!Caution]  
> Pastas dedicadas a exportar hooks e widgets não possuem um arquivo index.ts para evitar problemas execução indevida de código e para deixar mais explícito para qual hook ou widget está sendo criado um mock em testes automatizados.

# Factory functions

Em projetos React, o paradigma funcional é priorizado. Para manter a consistência em toda a aplicação, as Factory Functions (Funções Fábrica) são adotadas como padrão para a criação de "classes" e módulos que precisam gerenciar estado ou dependências.

Uma Factory Function é uma função que retorna um novo objeto. Pode-se considerá-las um "construtor" flexível que não exige a palavra-chave new. Elas oferecem uma alternativa poderosa e mais idiomática ao uso de class ou funções construtoras tradicionais em JavaScript moderno, especialmente em um contexto funcional.

Para garantir a consistência e a legibilidade, as Factory Functions devem seguir as seguintes convenções:

- Declaração: Devem ser declaradas como uma arrow function (=>) e associadas a uma constante (const).
- Retorno: Devem sempre retornar um objeto contendo os métodos e/ou propriedades que a função fábrica expõe.
- Tipagem: Se a função fábrica estiver implementando uma interface, a interface deve ser o tipo de retorno explícito da função.
- Nomenclatura: O nome da função deve ser escrito em [PascalCase](https://www.theserverside.com/definition/Pascal-case) (ex: MeuServico, GerenciadorDeDados).
- Inversão de Dependência: Seus argumentos devem ser dependências (como outros serviços, clientes HTTP, etc.), aplicando o princípio da [Inversão de Dependência](https://www.baeldung.com/cs/dip). Isso facilita a testabilidade e a manutenção.

## Exemplo prático

```ts
// Define a interface para garantir o contrato do serviço
interface ISpaceService {
  fetchPlanets(): Promise<any>
  fetchStarBySlug(starSlug: Slug): Promise<any>
  fetchStarById(starId: Id): Promise<any>
}

const SpaceService = (restClient: RestClient): ISpaceService => {
  // A função retorna um objeto que implementa ISpaceService
  return {
    async fetchPlanets() {
      return await restClient.get('/space/planets')
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`)
    },
  };
};

// Exemplo de uso: instanciando o serviço (observa-se que não se utiliza 'new')
const myRestClient = new RestClient() // Supondo uma instância de RestClient
const spaceServiceInstance = SpaceService(myRestClient)
```

Caso seja necessária lógica auxiliar que não precisa ser exposta publicamente, é possível declarar funções internas dentro da Factory Function. Elas se beneficiam do closure para acessar as dependências passadas para a fábrica.

```ts
export const AccessChallengeEditorPageAction = (
  service: ChallengingService,
) => {
  async function fetchChallenge(challengeSlug: string) {
    return await service.fetchChallengeBySlug(Slug.create(challengeSlug))
  }

  return {
    async handle(call: Call<Request>) {
      const { challengeSlug } = call.getRequest()
      return fetchChallenge(challengeSlug)
    },
  }
}
```

# Domain objects

Os objetos de Domínio são os elementos centrais que representam e encapsulam a lógica de negócio do sistema. Esse objetos são criados a partir de classes no mais puro orientação de objetos, e devido a sua importancia as regras a seguir devem ser estritamente seguidas:

- Encapsulamento forte: As propriedades de um objeto de domínio devem ser acessíveis apenas através de métodos bem definidos que implementam as regras de negócio. Isso significa usar modificadores de acesso como private ou protected (somente quando for preciso) para os campos internos e expor apenas o necessário.
- Comportamento é prioridade: Prefira que os objetos façam coisas (comportamento) a que simplesmente exponham dados para que outros façam coisas com eles. Por exemplo, em vez de um método setPreco(novoPreco), se Preco tem regras de negócio (sempre positivo, etc.), o objeto Produto pode ter um método
- Responsabilidade única: Uma classe deve ter apenas uma razão para mudar. Ou seja, ela deve ser responsável por apenas uma parte da lógica de negócio. Se uma classe Pedido também lida com o envio de e-mails, por exemplo, ela está com responsabilidades demais.

## Classes de entidade (entity)

Uma classe entidade deve sempre extender a classe abstrata `Entity`, visto que é ela fornece o `id` para quem a extende. Assim, a tipaga das demais propriedades da entidade são declaradas separadamente e passadas como generic para a classe abstrata.

Exemplo:

```ts
type UserProps = {
  email: Email
  name: Name
  level: Level  
}

class User extends Entity<UserProps> {
  // demais métodos da entidade...
}
```

Perceba que o tipo de propriedades começa com a nome da entidade e que ela não possui `id`, como também todos as propriedades também são objetos de domínio, obrigatoriamente. Além disso, um objeto será igual a outro objeto se tiverem o mesmo id, mesmo se amobs tiverem atributos diferentes.

Para criar um objeto de uma entidade é preciso usar uma ´factory method´, em que um método estático `create` receberá as propriedades com tipos primitivos para criar o objeto no construtor.

```ts
class User extends Entity<UserProps> { // o construtor é omitido por que é utilizado o construtor da classe abstrata Entity
  static create(dto: UserDto) {
    return new User({
      email: Email.create(dto.email),
      name: Name.create(dto.name),
      level: Level.create(dto.level)
    }, dto.id)
  }
}
```

Perceba que `create` recebe um dto, isso porque uma das funções desse objeto chamado dto é justamente isso: criar objetos de domínio a partir de dados primitivos.

Métodos que servem apenas para retornar dados (mesmo no caso de possuir lógica de negócio) devem ser declarados como getters quando possível

```ts
class User extends Entity<UserProps> { // o construtor é omitido por que é utilizado o construtor da classe abstrata Entity
  get name(): Name { // Sempre que possível adicione tipos de retorno para todos os métodos
    return this.props.name
  }

  get dto(): UserDto {
    return {
      id: this.id.value,
      email: this.props.email.value,
      name: this.props.name.value,
      level: this.props.level.value
    }
  }
}
```

Perceba que as propriedades da entidade `User` são acessadas pela propriedade `props`. Isso é herdado de `Entity` e serve para fortalecer o encapsulamento e evitar declaração desnecessária de propriedades dentro da classe `User`.
Perceba também que `User` retorna seu próprio `dto` através de um getter, esse padrão se repete para todas as demais entidades.

Além disso, os métodos de uma classe de domínio (exceto `create` e `get dto`) devem receber e retornar objetos de domínio.

```ts
class User extends Entity<UserProps> {
  canAcquireRocket(): Logical {
    // ...  
  }

  unlockStar(id: Id): void {
    // ...  
  }
}
```

## Classes de estrutura (structure)

Estrutura são definidos por seus atributos, e não por uma identidade única. Logo, não possuem id e se todos os seus atributos são iguais, eles são o mesmo objeto.


Para criar um objeto de uma entidade é preciso usar uma ´factory method´, em que um método estático `create` receberá as propriedades com tipos primitivos para criar o objeto no construtor.

```ts
class Email {
  readonly value: string

  private constructor(value: string) { // Perceba que o construtor sempre será privado
    this.value = value
  }

  static create(value: string) {
    return new Email(value)
  }
}
```

Uma vez que são definidos por seus atributos imutáveis, todas as propriedades de uma classe de estrutura devem ser `readonly`, públicas e serem do tipo de outros objetos de valor.

```ts
class Pagination {
  readonly currentPage: Integer
  readonly totalItems: Integer
  readonly itemsPerPage: Integer
}
```

Então, caso seja necessário atualizar o valor de uma propriedade, será preciso criar um clone desse objeto.

```ts
class Integer {
  private constructor(readonly value: number) {}

  plus(integer: Integer): Integer {
    return Integer.create(this.value + integer.value)
  }
}
```

## Classes de agregado (aggregate)

Um objeto agregado é responsável em encapsular uma entidade que possui uma relação de agregação 1:1 com outra entidade.

Toda classe `aggregate` deve extender a classe abstrata `Aggregate`, que deve receber como generic do TypeScript o tipo da entidade a qual se agregará com outra entidade.

```ts
class AuthorAggregate extends Aggregate<Author> {
  // ...
}
```

Contudo, o tipo da entidade pode ser customizado, contendo apenas a propriedades necessárias da entidade original.

```ts
type AvatarAggregateEntity = { // Entidade Avatar customizada
  name: Name
  image: Image
}

class AvatarAggregate extends Aggregate<AvatarAggregateEntity> {
  // ...
}
```

Para criar um objeto de uma agregado é preciso usar uma ´factory method´, em que um método estático `create` receberá o nome, o id e as demais propriedades (opcional) da entidade original.

```ts
class AuthorAggregate extends Aggregate<Author> {
  private static readonly ENTITY_NAME = 'Autor'

  static create(dto: AuthorAggregateDto) {
    if (dto.entity) {
      const entity = Author.create(dto.entity)
      return new AuthorAggregate(AuthorAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new AuthorAggregate(AuthorAggregate.ENTITY_NAME, dto.id)
  }
}
```

Perceba que toda classe agregado também possui seu próprio `dto`.

```ts
class AuthorAggregate extends Aggregate<Author> {
  private static readonly ENTITY_NAME = 'Autor'

  static create(dto: AuthorAggregateDto) {
    // ...
  }

  get dto(): AuthorAggregateDto { // Toda classe agregado deve poder retornar seu dto
    return {
      id: this.id.value,
      entity: this.hasEntity.isTrue ? this.entity.dto : undefined,
    }
  }
}
```

Dessa maneira, ao criar uma entidade que possui um agregado como uma propriedade, será necessário apenas o `id` da entidade do agregado.

```ts
const user = User.create({
  avatar: {
    id: avatarId,
  },
  rocket: {
    id: rocketId,
  },
  tier: {
    id: tierId,
  },
})
```

## Classes de evento (event)

Uma classe de evento sempre deve extender da classe abstrata event, que deve receber como generic o tipo do Payload do evento.

```ts
type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export class UserCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/user.created' // Toda classe evento deve possuir a propriedade _NAME para identificar esse evento

  constructor(readonly payload: Payload) {
    super(UserCreatedEvent._NAME, payload)
  }
}
```

## Classe de erro (error)

Uma classe de error sempre deve extender da classe global [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) do JavaScript ou pelo menos de uma outra que classe que extenda de `Error`.

```ts
class UserNotFoundError extends NotFoundError { // A classe NotFoundError extende de AppError, que, por sua vez, extende Error do JavaScript
  constructor() {
    super('Usuário não encontrado')
  }
}
```

O construtor de uma classe error também pode receber parâmetros.

```ts
class MethodNotImplementedError extends AppError {
  constructor(methodName: string) {
    super(`O método ${methodName} não foi implementado`, 'Method Not Implemented Error')
  }
}
```

## Widgets

Um widget é como um pequeno bloco de construção independente e reutilizável que forma a interface de usuário de uma aplicação React. Em projetos React, pense nele como uma função JavaScript que retorna elementos React, descrevendo o que deve aparecer na tela.

No projeto, componentes React sempre deverão ser criados como [functional components](https://www.robinwieruch.de/react-function-component), sendo declaradas por meio de uma arrow function.

```tsx
export const Checkbox = () => {
  return (
    // ..
  )
}
```

Caso o widget receba propriedades, um type deve ser declarado em cima da arrow function e sempre nomeado como `Props`.


```tsx
type Props = {
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

export const Checkbox = ({ isChecked, onChange }: Props) => { // Procure desestruturar o objeto props
  return (
    // ..
  )
}
```

Um widget é geralmente composto por três arquivos: view, hook e index

### View

View: É a interface do usuário. É a parte que renderiza o HTML (ou JSX, que é transformado em HTML utilizando React) e reage às interações do usuário. A View deve ser o mais "burra" possível, ou seja, ela apenas exibe dados e dispara eventos.

```tsx
const CheckboxView = ({ isChecked, onChange }: Props) => { // O nome da view sempre vai terminar com sufixo View
  return (
    <Input
      isChecked={isChecked}
      onChange={onChange}
    >
      <AnimatedIndicator>
        <Icon name='check' size={14} className='text-green-900' weight='bold' />
      </AnimatedIndicator>
    </Input>
  )
}
```

### Hook

É uma função que expõe dados de uma forma que a View possa consumir facilmente, e também expõe comandos (funções) que a View pode chamar para atualizar o Model. O hook abstrai a lógica da View e a prepara para ser exibida. No React, o hook sempre começa com prefixo `use`.

```tsx
function useCheckbox() {
  const [isChecked, setIsChecked] = useState(false) // Um hook pode chamar e usar outros hooks (seja do próprio React ou customizados)
  
  function handleChange() {
    setIsChecked((isChecked) => !isChecked)
  }

  return { // O hook exões seus dados retornado um objeto
    isDisable,
    handleChange,
  }
}
```

Sendo uma função, naturalmente, o hook pode receber parâmentros para usá-los internamente ou aplicar inversão de independência no caso de receber interfaces.

```tsx
function useCheckbox(profileService: ProfileService) {
  const [isChecked, setIsChecked] = useState(false) 

  const updateUser = useCallback(async (dto: UserDto) => {
    await profileService.updateUser(dto)
  }, [])
  
  async function handleChange() {
    setIsChecked((isChecked) => !isChecked)
  }

  return {
    isDisable,
    handleChange,
  }
}
```

No exemplo de código acima, é possível perceber outro padrão utilizado: um hook pode expor dois tipos de função.

#### Funções manipuladoras de evento de interface

Funções executadas em resposta a uma interação do usuário ou a um evento específico que ocorre na interface. São sempre declaradas com a palavra `function` e seu nome é prefixado com `handle`, como `handleClick`, `handleSubmit`, `handleChange`, `handleKeyDown`, `handleKeyUp` etc.

> [!NOTE]  
> Caso uma proprieade de um componente react seja uma função manipuladora de evento de interface, a propriedade em questão terá `on` como prefixo.

#### Funções executoras de ações

Executadas de forma imperativa por outra parte do código. Por serem geralmente dependências de outros hooks, eles são delcarados com [useCallback](https://react.dev/reference/react/useCallback) para fins de otimização.


### Index

O arquivo index do widget é um componente React, assim como a view, porém atua como um agregador, unindo o hook à view. Ou seja, ele é o ponto onde o useEditableTitle (ViewModel) é consumido e seus valores e funções retornados são passados como props para a view.

```tsx
type Props = {
  initialTitle: string
  onEditTitle: (title: string) => Promise<void>
}

const EditableTitle = ({ initialTitle, onEditTitle }: Props) => {
  const { title, handleTitleChange, handleButtonClick } =
    useEditableTitle(initialTitle, onEditTitle)

  return (
    <EditableTitleView
      title={title}
      canEditTitle={canEditTitle}
      inputRef={inputRef}
      onTitleChange={handleTitleChange}
      onButtonClick={handleButtonClick}
    />
  )
}
```