# What is the core package?

The `core` package is the main component of StarDust, upon which all other packages and applications depend.

# Implementation

## 🌐 Domain

In DDD (Domain-Driven Design), the domain is the heart of the system—it's the area of knowledge or activity that the software aims to solve. StarDust follows this same principle, representing business rules and essential behaviors at the system's core.

Thus, the domain is the main layer of StarDust's `core`. For this reason, we prioritize legibility, standardization, and high test coverage in this layer.

The domain implementation follows the principles of tactical DDD modeling (with some adaptations), adhering to the rules of *[Object Calisthenics](https://developerhandbook.stakater.com/architecture/object-calisthenics.html)* and exclusively containing classes that represent the domain objects described below.

-----

### Entity

A class that represents something identifiable by an `id`, whose properties can change over time.

> Example: A Rocket as a store item might have its price changed.

An entity must follow this pattern:

  - Have a private constructor.
  - Be created from a `dto` using a static method called `create`. Every entity requires a `dto`.
  - Have a method that converts the entity back into a `dto`.
  - Must not be an anemic class (with only getters and setters) but should contain methods that execute important business rules or behaviors.
  - Cannot be inherited by any subclass; for this, `abstracts` should be used.

-----

### Structure

This is the value object described in DDD, a class that represents something immutable and identified by the combination of its attributes (rather than an `id`).

> Example: There could be an object called `Level`, which encapsulates the algorithm for how a user levels up.

A structure must follow this pattern:

  - Have a private constructor.
  - Be created from primitive values or a `dto` through a static method called `create`. Most `objects` do not require a `dto`, but there may be rare cases where it is necessary.
  - Have all its attributes public and constant (readonly).
  - Must not be an anemic class, but should contain methods with relevant business logic.
  - To change a property of an `object`, a new instance of the class must be created. Thus, almost all methods of an `object` return a new instance of itself.
  - May contain other `objects` and `entities` as attributes. When associating with entities via aggregation, `aggregates` must be used.

-----

### Aggregate

In DDD, an *Aggregate* is a cluster of domain objects (entities and value objects) that form a unit of consistency and integrity. In StarDust, an `aggregate` is a class that encapsulates an entity that has a 1:1 aggregation relationship with another entity.

> Example: Every user has an avatar. However, to create a user, it's not necessary to provide all of the avatar's attributes, only its `id`. In this case, the `User` entity has an `AvatarAggregate` as an attribute, instead of directly referencing the `Avatar` entity.

An `aggregate` must follow this pattern:

  - Have an `id` attribute (required) and an `entity` attribute (which can be `undefined`).
  - The `id` attribute must be exactly the same as the `id` of the aggregated entity.
  - The `entity` attribute must have the type of the corresponding entity.

Each `aggregate` must have a corresponding `dto`, in which the `entity` attribute is represented as a `dto` with the type of the original entity's `dto`.

-----

### Event

Domain events are classes that represent messages indicating that something important has happened in the domain—something that has already occurred and that the business cares about. Every event carries a `payload`, a set of primitive data that describes what happened and may be relevant to other parts of the system.

Events are used to promote communication between StarDust's modules, keeping them independent of each other.

An `event` must follow this pattern:

  - Be named in the past tense and end with the `Event` suffix, such as `UserCreatedEvent`, `StarUnlockedEvent`, `LastTierReachedEvent`.
  - Ensure all `payload` data is public and immutable.
  - Contain a static property called `key`, of type `string`, which indicates the event name and the module where it was dispatched.

-----

### Abstract

A base class intended to be extended by domain elements to share common behaviors, leaving the implementation of specific parts to subclasses.

An `abstract` can also be used to apply the [Strategy pattern](https://refactoring.guru/design-patterns/strategy), allowing for the dynamic selection of algorithms or behaviors from various options without modifying the class that uses them.

-----

### Error

A class that represents an error related to a specific business rule, indicating that execution cannot continue.

An `error` class can be extended to create other specialized error classes.

It must follow this pattern:

  - Inherit from the language's base `Error` class.
  - Contain only attributes with primitive and immutable types.
  - Have the `Error` suffix, such as `UserNotFoundError`, `StarLockedError`, `ChallengeNotPublicError`.
  - Should not have methods, only attributes.

-----

### Factory

A factory is a class that encapsulates the logic for creating objects, especially when this logic is complex or depends on other entities/services. It ensures that entities or aggregates are created consistently and validly, without exposing this complexity to other parts of the system.

A `factory` must follow this pattern:

  - Contain a single public method called `produce`, which creates and returns the expected type.
  - Have the `Factory` suffix, such as `UserFactory`, `PlanetFactory`, `ChallengeFactory`.

## 📑 Interfaces

These are contracts that define how a handler, gateway, or protocol should behave, exclusively through methods. An interface can be implemented by a class or a function. In the case of a function, it must return an object that contains the methods established by the interface in question.

Interfaces are used to apply the dependency inversion principle to decouple applications, services, and libraries.

## 📤 Responses

These are classes that establish the return format of a method with the goal of standardizing responses on a large scale. This type of class is inspired by the [Result Pattern](https://medium.com/@wgyxxbf/result-pattern-a01729f42f8c).

> For example: `RestResponse` can encapsulate the HTTP response, containing status code, headers, body, etc. `PaginationResponse` encapsulates the total number of pages and items, and so on.

Furthermore, a `response` can contain another `response`. For example, following the example above, the `body` property of `ApiResponse` could be of type `PaginationResponse`.

## 🛍️ Data Transfer Objects (DTOs)

These are simple objects used to transport data between layers of a system or between different systems, without containing any business logic. They are generally used to create `entities`, `structures` (value objects), and `aggregates`.

A `dto` must follow this pattern:

  - Contain only attributes of primitive types, all of which are public and mutable.
  - End with the `Dto` suffix, such as `UserDto`, `StarDto`, `PlanetDto`.
  - Have no methods/behaviors.

## ✨ Use cases

These are classes that represent the actions the system performs from a business perspective. For example, "Create order," "Send welcome email," "Update user profile," "Export report in PDF."

They orchestrate business logic by calling domain elements and interfaces.

A Use Case follows this pattern:

  - A clear name, such as `CreateChallenge`, `SendConfirmationEmail`, `GenerateReport`, `ListRockets`, `GetAvatar`.
  - A main method, usually called `do()`. All other methods in the `use case` must be private.
  - A `use case` should not receive or return any domain element directly, but only `dtos`.
  - All dependencies of a `use case` must be constants and interfaces.

## 🥸 Fakers

These are classes responsible for generating domain objects with fictitious data. Their main purpose is to streamline the creation of tests, whether for automated or visual testing, by quickly providing realistic data without the need to use real information.

A faker follows this pattern:

  - End with the `Faker` suffix, such as `CommentsFaker`, `UsersFaker`, `CategoriesFaker`.
  - Contain only static methods.
  - Have some or all of the following methods:
    `fake` -> Returns the domain object. Accepts a DTO as a base, if necessary.
    `fakeMany` -> Returns a list of objects of the same type as the domain object.
    `fakeDto` -> Returns the DTO of the domain object. Accepts a DTO as a base, if necessary.
    `fakeManyDto` -> Returns a list of DTOs of the domain object. Accepts a base DTO and the number of items to fake as parameters.

## 🤡 Mocks

A mock is a simulated object that mimics the behavior of real components in software systems, especially in tests. It is used to isolate the part of the system being tested, avoiding the need to interact with external dependencies like databases, APIs, or other services. In the core package, mocks implement interfaces to replace real implementations in use cases and domain objects.

A mock follows this pattern:

  - End with the `Mock` suffix, such as `ProfileServiceMock`, `ShopServiceMock`, `AuthServiceMock`.
  - If persistence is needed, it should be in-memory only.

# Development

## Libraries

  - [Faker.js](https://fakerjs.dev) - A library used to quickly generate fake data.
  - [Dayjs](https://day.js.org/) - A library for working with dates in JavaScript.
  - [UUID](https://www.npmjs.com/package/uuid) - A library for generating [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier).

## Running the tests

**Clone the repository**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navigate to the core package directory**

```bash
cd ./stardust/packages/core
```

**Install dependencies**

```bash
npm install
```

**Run the tests**

```bash
npm run tests
```

## Folder Structure

```
📦 core package
└─ src
   └─ <Module name>
      ├─ ✨ use-cases
      ├─ 📑 interfaces
      ├─ 📤 responses
      ├─ 🪨 constants
      ├─ 📖 libs
      └─ 🌐 domain
         ├─ abstracts
         ├─ entities
         ├─ structures
         ├─ events
         ├─ errors
         └─ factories
```

Note that the folder structure shown above is a superset of all possible folders within a module. Each module will have a subset of these folders, depending on its specific needs. For example, some modules might not have a `use-cases` folder if they only define domain objects.

Test files for `entities`, `structures`, and `use-cases` are placed inside a folder named `tests` within their respective folders where the original code to be tested is located. Similarly, `faker` implementation files for `entities` and `structures` are placed inside a folder named `fakers` within the `entities` and `structures` folders.

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