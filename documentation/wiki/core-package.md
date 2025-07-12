# O que é o pacote core?

O pacote `core` é o componente principal do StarDust, do qual todos os outros pacotes e aplicações dependem.

# Implementação

## 🌐 Domínio

Em DDD (Domain-Driven Design), o domínio é o coração do sistema — é a área de conhecimento ou atividade que o software está tentando resolver. O StarDust segue esse mesmo princípio, representando as regras de negócio e comportamentos essenciais no núcleo do sistema.

Dessa forma, o domínio (ou `domain`) é a camada principal do `core` do StarDust. Por isso, prezamos pela legibilidade, padronização e alta cobertura de testes nessa camada.

A implementação do domínio segue os princípios da modelagem do DDD tático (com algumas adaptações), obedecendo às regras de *[Object Calisthenics](https://developerhandbook.stakater.com/architecture/object-calisthenics.html)* e contendo exclusivamente classes que representam os objetos de domínio descritos a seguir.

---

### Entidade (Entity)

Classe que representa algo que pode ser identificado por um `id`, e cujas propriedades podem mudar ao longo do tempo.

> Exemplo: Um Foguete sendo um item da loja pode ter seu preço alterado.

Uma entidade deve seguir o padrão:

- Possuir construtor privado.
- Ser criada a partir de um `dto`, utilizando um método estático chamado `create`. Toda entidade necessita de um `dto`.
- Possuir um método que converta a entidade de volta para um `dto`.
- Não deve ser uma classe anêmica (com apenas getters e setters), mas conter métodos que executem regras ou comportamentos importantes para o negócio.
- Não pode ser herdada por nenhuma subclasse; para isso, devem ser utilizados `abstracts`.

---

### Estrutura (Structure)

É o value object descrito no DDD, um classe que representa algo imutável e identificado pelo conjunto de seus atributos (e não por um `id`).

> Exemplo: Pode existir um objeto chamado `Level`, que encapsula o algoritmo de como um usuário sobe de nível.

Uma estrutura deve seguir o padrão:

- Possuir construtor privado.
- Ser criado a partir de valores primitivos ou de um `dto`, por meio de um método estático chamado `create`. A maioria dos `objects` não requer um `dto`, mas podem haver casos raros em que isso seja necessário.
- Possuir todos os seus atributos públicos e constantes.
- Não deve ser uma classe anêmica, mas conter métodos com lógica de negócio relevante.
- Para alterar uma propriedade de um `object`, deve-se criar uma nova instância da classe. Assim, quase todos os métodos de um `object` retornam uma nova instância dele mesmo.
- Pode conter outros `objects` e `entities` como atributos. No caso de associação com entidades via agregação, devem ser usados `aggregates`.

---

### Agregado (Aggregate)

No DDD, um *Aggregate* é um conjunto de objetos do domínio (entidades e value objects) que formam uma unidade de consistência e integridade. No StarDust, um `aggregate` é uma classe que encapsula uma entidade que possui uma relação de agregação 1:1 com outra entidade.

> Exemplo: Todo usuário possui um avatar. No entanto, para criar um usuário, não é necessário fornecer todos os atributos do avatar, apenas o seu `id`. Nesse caso, a entidade `User` possui um `AvatarAggregate` como atributo, em vez de referenciar diretamente a entidade `Avatar`.

Um `aggregate` deve seguir o padrão:

- Possuir um atributo `id` (obrigatório) e um atributo `entity` (que pode ser `undefined`).
- Ter o atributo `id` exatamente igual ao `id` da entidade agregada.
- Ter o atributo `entity` com o tipo da entidade correspondente.

Cada `aggregate` deve possuir um `dto` correspondente, no qual o atributo `entity` é representado como `dto`, com o tipo do `dto` da entidade original.

---

### Evento (Event)

Eventos de domínio são classes que representam mensagens indicando que algo importante aconteceu no domínio — algo que já ocorreu e que o negócio se importa. Todo evento carrega um `payload`, ou seja, um conjunto de dados primitivos que descrevem o que ocorreu e que pode ser relevante para outras partes do sistema.

Os eventos são utilizados para promover a comunicação entre os módulos do StarDust, mantendo-os independentes entre si.

Um `event` deve seguir o padrão:

- Ser nomeado no pretérito (tempo passado) e terminar com o sufixo `Event`, como `UserCreatedEvent`, `StarUnlockedEvent`, `LastTierReachedEvent`.
- Assegurar que todos os dados do `payload` sejam públicos e imutáveis.
- Conter uma propriedade estática chamada `key`, do tipo `string`, que indica o nome do evento e o módulo onde ele foi disparado.

---

### Abstrato (Abstract)

Classe base que deve ser estendida por elementos de domínio, com o objetivo de compartilhar comportamentos comuns, deixando a implementação de partes específicas para as subclasses.

Um `abstract` também pode ser usado para aplicar o padrão [Strategy](https://refactoring.guru/design-patterns/strategy), permitindo a escolha dinâmica de algoritmos ou comportamentos entre várias opções, sem modificar a classe que os utiliza.

---

### Erro (Error)

Classe que representa um erro relacionado a uma regra específica de negócio, indicando que a execução não pode continuar.

Uma classe de `error` pode ser estendida para criar outras classes de erro especializadas.

Ela deve seguir o padrão:

- Herdar da classe base `Error` da linguagem.
- Conter apenas atributos com tipos primitivos e imutáveis.
- Ter sufixo `Error`, como `UserNotFoundError`, `StarLockedError`, `ChallengeNotPublicError`.
- Não deve possuir métodos, apenas atributos.

---

### Fábrica (Factory)

Uma fábrica é uma classe que encapsula a lógica de criação de objetos, especialmente quando essa lógica é complexa ou depende de outras entidades/serviços. Ela garante que entidades ou agregados sejam criados de forma consistente e válida, sem expor essa complexidade para outras partes do sistema.

Uma `factory` deve seguir o padrão:

- Conter um único método público chamado `produce`, que cria e retorna o tipo esperado.
- Ter o sufixo `Factory`, como `UserFactory`, `PlanetFactory`, `ChallengeFactory`.

## 📑 Interfaces

São os contratos que definem como um handler, gateway ou protocol deve se comportar através exclusivamente métodos. Uma interface pode se implementada por uma classe ou função. No caso da função ela deve retonar um objeto que atenda contenha os métodos estabelecidos pela interface em questão.

A interface serve justamente para aplicar o princípio de inversão de indepedância para desacoplar aplicações, serviços e bibliotecas.

## 📤 Respostas (Responses)

São classes que estabelecem o formato de retorno de um método com o objetivo de padronizar as respostas em larga escala. Esse tipo de classe é inspirado no [Padrão Result](https://medium.com/@wgyxxbf/result-pattern-a01729f42f8c)

> Por exemplo: `RestResponse` pode encapsular o response http, contento status code, headers, body etc. `PaginationResponse` encapsula o total de páginas e de itens e assim por diante.

Além disso, um `response` pode conter outro `response`. Por exemplo, seguindo o exemplo acima, a propriedade `body` do `ApiResponse` pode ser do tipo `PaginationResponse`.

## 🛍️ Objetos de transferência de dados (DTO's ou Data Transfer Object)

são objetos simples usados para transportar dados entre camadas de um sistema ou entre sistemas diferentes, sem conter lógica de negócio. Geralmente eles são usados para criar `entities`, `vos` e `aggregates`

Um `dto` deve seguir padrão:

- Conter apenas atributos do tipo primitivo e todos públicos e mutáveis.
- Terminar com o sufixo de `Dto`, como `UserDto`, `StarDto`, `PlanetDto`.
- Não possuir nenhum método/comportamento


## ✨ Casos de uso (Use cases)

São classes que representam as ações que o sistema executa do ponto de vista do negócio. Por exemplo, “Criar pedido”, “Enviar e-mail de boas-vindas”, “Atualizar perfil do usuário”, “Exportar relatório em PDF”. 

Logo, eles orquestram a lógica do negócio, chamando elementos de domínio e interfaces.

Um Use Case segue o padrão:

- Nome claro, como `CreateChallenge`, `SendConfirmationEmail`, `GenerateReport`, `ListRockets`, `GetAvatar`.
- Um método principal, geralmente chamado `do()`. Todos os demais métodos do `use case` devem ser privados.
- Um `use case` não deve receber ou retornar qualquer elemento de domínio diretamente, mas apenas `dtos`.
- Todas as dependências do `use cases` devem ser constantes e interfaces.

## 🥸 Falsificadores de objetos de domínio (fakers)

São classes responsáveis por gerar objetos de domínio com dados fictícios. Seu principal objetivo é agilizar a criação de testes, seja para testes automatizados ou testes visuais, fornecendo rapidamente dados realistas, mas sem a necessidade de utilizar informações reais.

Um faker segue o padrão:

- Terminar com o sufixo `Faker`, como `CommentsFaker`, `UsersFaker`, `CategoriesFaker`.
- Possuir apenas métodos estáticos
- Possuir todos ou alguns desses métodos:
`fake` -> Retorna o objeto de domínio. Recebe como parâmetro um dto como base, se necessário.
`fakeMany` -> Retorna uma lista de objetos do mesmo tipo do objeto de domínio.
`fakeDto` -> Retorna o dto do objeto de domínio. Recebe como parâmetro um dto como base, se necessário. 
`fakeManyDto` -> Retorna uma lista de dtos do objeto de domínio. Recebe como parâmetro um dto como base, se necessário e quantidade de itens a serem falsificados.


## 🤡 imitadores (mocks)

Um mock é um objeto simulado que imita o comportamento de componentes reais em sistemas de software, especialmente em testes. Portanto, ele é utilizado para isolar a parte do sistema que está sendo testada, evitando a necessidade de interagir com dependências externas, como bancos de dados, APIs, ou outros serviços. No Pacote core os mocks implementam interfaces para substituirem as implementações reais em use cases e objetos de domínio.

Um mock segue o padrão:
- Terminar com o sufixo `Mock`, como `ProfileServiceMock`, `ShopServiceMock`, `AuthServiceMock`.
- Se necessário persistência, apenas em memória.

# Desenvolvimento

## Bibliotecas

- [Faker.js](https://fakerjs.dev) - biblioteca usada para gerar dados falsos (fake data) de forma rápida.
- [Dayjs](https://day.js.org/) - biblioteca para trabalhar com datas em JavaScript.
- [UUID](https://www.npmjs.com/package/uuid) - biblioteca para gerar id's do tipo [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier).

## Executando os testes

**Clone o repositório**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navegue até a página do pacote core**

```bash
cd ./stardust/packages/core
```

**Instale as dependências**

```bash
npm install
```

**Execute os testes**

```bash
npm run tests
```
## Estruturação de pastas

```
📦 Pacote core
├─ <Nome do módulo>
├─ ✨ use-cases
├─ 📑 interfaces
📤 responses
🪨 constants
📖 libs
├─ 🛍️ dtos
└─ 🌐 domain
   ├─ abstracts
   ├─ entities
   ├─ structures
   ├─ events
   ├─ errors
   └─ factories
```
A quantidade de tipos de pastas descritos acima vai depender do módulo, alguns podem ter mais outros menos.

Os arquivos de teste para `entities`, `structures` e `use-cases` são colocados dentro uma pasta chamada `testes` dentro das suas respectivas pastas onde o código original a ser testado está. Assim como, os arquivos de implementações de `fakers` para `entities`e  `structures` são colocados dentro uma pasta chamada de `fakers` dentro das pastas `entities` e `structures`.

```
📦 
├─ use-cases
│  ├─ 🧪 tests
│  └─ ...
└─ domain
   ├─ entities
   │  ├─ 🧪 tests
   │  ├─ 🥸 fakers
   │  └─ ...
   └─ structures
      ├─ 🧪 tests
      ├─ 🥸 fakers
      └─ ...
```