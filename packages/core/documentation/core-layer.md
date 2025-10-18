# O que é o pacote core?

O pacote `core` é o principal componente do StarDust, do qual todos os outros pacotes e aplicações dependem.

# Implementação

## 🌐 Domínio

No DDD (Domain-Driven Design), o domínio é o coração do sistema - é a área de conhecimento ou atividade que o software visa resolver. O StarDust segue este mesmo princípio, representando regras de negócio e comportamentos essenciais no núcleo do sistema.

Assim, o domínio é a principal camada do `core` do StarDust. Por esta razão, priorizamos a legibilidade, a padronização e a alta cobertura de testes nesta camada.

A implementação do domínio segue os princípios da modelagem tática do DDD (com algumas adaptações), aderindo às regras do *[Object Calisthenics](https://developerhandbook.stakater.com/architecture/object-calisthenics.html)* e contendo exclusivamente classes que representam os objetos de domínio descritos abaixo.

-----

### Entidade

Uma classe que representa algo identificável por um `id`, cujas propriedades podem mudar ao longo do tempo.

> Exemplo: Um Foguete como item de loja pode ter seu preço alterado.

Uma entidade deve seguir este padrão:

  - Ter um construtor privado.
  - Ser criada a partir de um `dto` usando um método estático chamado `create`. Toda entidade requer um `dto`.
  - Ter um método que converte a entidade de volta para um `dto`.
  - Não deve ser uma classe anêmica (com apenas getters e setters), mas deve conter métodos que executam regras de negócio ou comportamentos importantes.
  - Não pode ser herdada por nenhuma subclasse; para isso, `abstracts` devem ser usados.

-----

### Estrutura

Este é o objeto de valor descrito no DDD, uma classe que representa algo imutável e identificado pela combinação de seus atributos (em vez de um `id`).

> Exemplo: Poderia haver um objeto chamado `Level`, que encapsula o algoritmo de como um usuário sobe de nível.

Uma estrutura deve seguir este padrão:

  - Ter um construtor privado.
  - Ser criada a partir de valores primitivos ou de um `dto` através de um método estático chamado `create`. A maioria dos `objetos` não requer um `dto`, mas pode haver casos raros em que seja necessário.
  - Ter todos os seus atributos públicos e constantes (readonly).
  - Não deve ser uma classe anêmica, mas deve conter métodos com lógica de negócios relevante.
  - Para alterar uma propriedade de um `objeto`, uma nova instância da classe deve ser criada. Assim, quase todos os métodos de um `objeto` retornam uma nova instância de si mesmo.
  - Pode conter outros `objetos` e `entidades` como atributos. Ao se associar a entidades via agregação, `aggregates` devem ser usados.

-----

### Agregado

No DDD, um *Agregado* é um cluster de objetos de domínio (entidades e objetos de valor) que formam uma unidade de consistência e integridade. No StarDust, um `agregado` é uma classe que encapsula uma entidade que tem uma relação de agregação 1:1 com outra entidade.

> Exemplo: Todo usuário tem um avatar. No entanto, para criar um usuário, não é necessário fornecer todos os atributos do avatar, apenas seu `id`. Neste caso, a entidade `User` tem um `AvatarAggregate` como atributo, em vez de referenciar diretamente a entidade `Avatar`.

Um `agregado` deve seguir este padrão:

  - Ter um atributo `id` (obrigatório) e um atributo `entity` (que pode ser `undefined`).
  - O atributo `id` deve ser exatamente o mesmo que o `id` da entidade agregada.
  - O atributo `entity` deve ter o tipo da entidade correspondente.

Cada `agregado` deve ter um `dto` correspondente, no qual o atributo `entity` é representado como um `dto` com o tipo do `dto` da entidade original.

-----

### Evento

Eventos de domínio são classes que representam mensagens indicando que algo importante aconteceu no domínio - algo que já ocorreu e que o negócio se importa. Todo evento carrega um `payload`, um conjunto de dados primitivos que descreve o que aconteceu e pode ser relevante para outras partes do sistema.

Os eventos são usados para promover a comunicação entre os módulos do StarDust, mantendo-os independentes uns dos outros.

Um `evento` deve seguir este padrão:

  - Ser nomeado no tempo passado e terminar com o sufixo `Event`, como `UserCreatedEvent`, `StarUnlockedEvent`, `LastTierReachedEvent`.
  - Garantir que todos os dados do `payload` sejam públicos e imutáveis.
  - Conter uma propriedade estática chamada `key`, do tipo `string`, que indica o nome do evento e o módulo onde foi despachado.

-----

### Abstrato

Uma classe base destinada a ser estendida por elementos de domínio para compartilhar comportamentos comuns, deixando a implementação de partes específicas para as subclasses.

Um `abstrato` também pode ser usado para aplicar o [padrão Strategy](https://refactoring.guru/design-patterns/strategy), permitindo a seleção dinâmica de algoritmos ou comportamentos de várias opções sem modificar a classe que os utiliza.

-----

### Erro

Uma classe que representa um erro relacionado a uma regra de negócio específica, indicando que a execução não pode continuar.

Uma classe de `erro` pode ser estendida para criar outras classes de erro especializadas.

Deve seguir este padrão:

  - Herdar da classe base `Error` da linguagem.
  - Conter apenas atributos com tipos primitivos e imutáveis.
  - Ter o sufixo `Error`, como `UserNotFoundError`, `StarLockedError`, `ChallengeNotPublicError`.
  - Não deve ter métodos, apenas atributos.

-----

### Fábrica

Uma fábrica é uma classe que encapsula a lógica para criar objetos, especialmente quando essa lógica é complexa ou depende de outras entidades/serviços. Ela garante que entidades ou agregados sejam criados de forma consistente e válida, sem expor essa complexidade a outras partes do sistema.

Uma `fábrica` deve seguir este padrão:

  - Conter um único método público chamado `produce`, que cria e retorna o tipo esperado.
  - Ter o sufixo `Factory`, como `UserFactory`, `PlanetFactory`, `ChallengeFactory`.

## 📑 Interfaces

São contratos que definem como um manipulador, gateway ou protocolo deve se comportar, exclusivamente através de métodos. Uma interface pode ser implementada por uma classe ou uma função. No caso de uma função, ela deve retornar um objeto que contém os métodos estabelecidos pela interface em questão.

As interfaces são usadas para aplicar o princípio da inversão de dependência para desacoplar aplicações, serviços e bibliotecas.

## 📤 Respostas

São classes que estabelecem o formato de retorno de um método com o objetivo de padronizar as respostas em grande escala. Este tipo de classe é inspirado no [Padrão Result](https://medium.com/@wgyxxbf/result-pattern-a01729f42f8c).

> Por exemplo: `RestResponse` pode encapsular a resposta HTTP, contendo código de status, cabeçalhos, corpo, etc. `PaginationResponse` encapsula o número total de páginas e itens, e assim por diante.

Além disso, uma `resposta` pode conter outra `resposta`. Por exemplo, seguindo o exemplo acima, a propriedade `body` de `ApiResponse` poderia ser do tipo `PaginationResponse`.

## 🛍️ Data Transfer Objects (DTOs)

São objetos simples usados para transportar dados entre camadas de um sistema ou entre sistemas diferentes, sem conter nenhuma lógica de negócios. Eles são geralmente usados para criar `entidades`, `estruturas` (objetos de valor) e `agregados`.

Um `dto` deve seguir este padrão:

  - Conter apenas atributos de tipos primitivos, todos públicos e mutáveis.
  - Terminar com o sufixo `Dto`, como `UserDto`, `StarDto`, `PlanetDto`.
  - Não ter métodos/comportamentos.

## ✨ Casos de uso

São classes que representam as ações que o sistema executa do ponto de vista do negócio. Por exemplo, "Criar pedido", "Enviar email de boas-vindas", "Atualizar perfil do usuário", "Exportar relatório em PDF".

Eles orquestram a lógica de negócios chamando elementos de domínio e interfaces.

Um Caso de Uso segue este padrão:

  - Um nome claro, como `CreateChallenge`, `SendConfirmationEmail`, `GenerateReport`, `ListRockets`, `GetAvatar`.
  - Um método principal, geralmente chamado `do()`. Todos os outros métodos no `caso de uso` devem ser privados.
  - Um `caso de uso` não deve receber ou retornar nenhum elemento de domínio diretamente, mas apenas `dtos`.
  - Todas as dependências de um `caso de uso` devem ser constantes e interfaces.

## 🥸 Fakers

São classes responsáveis por gerar objetos de domínio com dados fictícios. Seu principal objetivo é agilizar a criação de testes, seja para testes automatizados ou visuais, fornecendo rapidamente dados realistas sem a necessidade de usar informações reais.

Um faker segue este padrão:

  - Terminar com o sufixo `Faker`, como `CommentsFaker`, `UsersFaker`, `CategoriesFaker`.
  - Conter apenas métodos estáticos.
  - Ter alguns ou todos os seguintes métodos:
    `fake` -> Retorna o objeto de domínio. Aceita um DTO como base, se necessário.
    `fakeMany` -> Retorna uma lista de objetos do mesmo tipo do objeto de domínio.
    `fakeDto` -> Retorna o DTO do objeto de domínio. Aceita um DTO como base, se necessário.
    `fakeManyDto` -> Retorna uma lista de DTOs do objeto de domínio. Aceita um DTO base e o número de itens a serem falsificados como parâmetros.

## 🤡 Mocks

Um mock é um objeto simulado que imita o comportamento de componentes reais em sistemas de software, especialmente em testes. É usado para isolar a parte do sistema que está sendo testada, evitando a necessidade de interagir com dependências externas como bancos de dados, APIs ou outros serviços. No pacote core, os mocks implementam interfaces para substituir implementações reais em casos de uso e objetos de domínio.

Um mock segue este padrão:

  - Terminar com o sufixo `Mock`, como `ProfileServiceMock`, `ShopServiceMock`, `AuthServiceMock`.
  - Se a persistência for necessária, deve ser apenas em memória.

# Desenvolvimento

## Bibliotecas

  - [Faker.js](https://fakerjs.dev) - Uma biblioteca usada para gerar rapidamente dados falsos.
  - [Dayjs](https://day.js.org/) - Uma biblioteca para trabalhar com datas em JavaScript.
  - [UUID](https://www.npmjs.com/package/uuid) - Uma biblioteca para gerar [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier).

## Executando os testes

**Clone o repositório**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navegue para o diretório do pacote core**

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

## Estrutura de Pastas

```
📦 pacote core
└─ src
   └─ <Nome do Módulo>
      ├─ ✨ casos de uso
      ├─ 📑 interfaces
      ├─ 📤 respostas
      ├─ 🪨 constantes
      ├─ 📖 libs
      └─ 🌐 domínio
         ├─ abstracts
         ├─ entities
         ├─ structures
         ├─ events
         ├─ errors
         └─ factories
```

Note que a estrutura de pastas mostrada acima é um superconjunto de todas as pastas possíveis dentro de um módulo. Cada módulo terá um subconjunto dessas pastas, dependendo de suas necessidades específicas. Por exemplo, alguns módulos podem não ter uma pasta `use-cases` se definirem apenas objetos de domínio.

Os arquivos de teste para `entities`, `structures` e `use-cases` são colocados dentro de uma pasta chamada `tests` dentro de suas respectivas pastas onde o código original a ser testado está localizado. Da mesma forma, os arquivos de implementação de `faker` para `entities` e `structures` são colocados dentro de uma pasta chamada `fakers` dentro das pastas `entities` e `structures`.

```
📦
├─ use-cases
│  ├─ 🧪 tests
│  └─ ...
└─ domain
   ├─ entities
   │  ├─ 🛍️ dtos
   │  ├─ 🧪 tests
   │  ├─ 🥸 fakers
   │  └─ ...
   └─ structures
      ├─ 🧪 tests
      ├─ 🥸 fakers
      └─ ...
```