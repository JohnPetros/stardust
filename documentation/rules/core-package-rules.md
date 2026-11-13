# What is the core package?

The `core` package is the main component of StarDust, on which all other packages and applications depend.

# Implementation

## 🌐 Domain

In DDD (Domain-Driven Design), the domain is the heart of the system — it is the area of knowledge or activity that the software is trying to solve. StarDust follows this same principle, representing the essential business rules and behaviors at the core of the system.

Thus, the domain (or `domain`) is the main layer of StarDust's `core`. For this reason, we value readability, standardization and high test coverage in this layer.

The domain implementation follows the principles of tactical DDD modeling (with some adaptations), obeying the rules of *[Object Calisthenics](https://developerhandbook.stakater.com/architecture/object-calisthenics.html)* and containing exclusively classes that represent the domain objects described below.

## 🔌 Decoupling between modules

The modules inside `packages/core` must remain **decoupled by default**. The fact that they all live in the same package does not mean they can freely depend on one another.

Mandatory rules:

- A module must not import repositories, services, use cases or entities from another module merely for convenience.
- When a flow requires coordination between modules, prefer communication through explicit contracts, domain events or composition at the app boundary, following the pattern that already exists in the codebase.
- Authentication, authorization, HTTP context assembly, transport-bound ownership checks and payload adaptation **must not be pushed into the core** when they are already responsibilities of the boundary (`middleware`, `controller`, `router`, `tool`, `job`, `action`).
- A `use case` may depend on interfaces of another module only when that collaboration is part of the domain's business rule and there is clear evidence of this pattern in the project.
- When in doubt, preserve the module that owns the responsibility. Example: validating an API key belongs to the `auth` module; validating the user's insignia/role belongs to the module that already resolves profile/permission in the real flow.
- When a rule depends only on the state and meaning of the domain object itself, prefer implementing it in the object itself (`entity`, `structure` or `aggregate`) instead of duplicating it in the `use case`. The `use case` must orchestrate the flow; the domain object must know how to answer about its own capabilities, restrictions and behaviors.

Warning signs:

- a `use case` of one module needing to import the `Repository` of another module just to resolve permission.
- a `use case` assuming transport details, such as headers, cookies, session, bearer token or HTTP context.
- creation of cross-domain dependencies in the core without a similar reference in the codebase.

When there is a real need to cross modules and there is not enough evidence to decide, record this as an architectural pending item and validate it before consolidating the implementation/spec.

---

### Entity

A class that represents something that can be identified by an `id`, and whose properties can change over time.

> Example: A Rocket being a store item may have its price changed.

An entity must follow the pattern:

- Have a private constructor.
- Be created from a `dto`, using a static method called `create`. Every entity needs a `dto`.
- Have a method that converts the entity back into a `dto`.
- Must not be an anemic class (with only getters and setters), but contain methods that execute rules or behaviors important to the business.
- Cannot be inherited by any subclass; for that, `abstracts` must be used.

---

### Structure

It is the value object described in DDD, a class that represents something immutable and identified by the set of its attributes (and not by an `id`).

> Example: There can be an object called `Level`, which encapsulates the algorithm of how a user levels up.

A structure must follow the pattern:

- Have a private constructor.
- Be created from primitive values or a `dto`, through a static method called `create`. Most `objects` do not require a `dto`, but there may be rare cases where it is necessary.
- Have all its attributes public and constant.
- Must not be an anemic class, but contain methods with relevant business logic.
- To change a property of an `object`, a new instance of the class must be created. Thus, almost all methods of an `object` return a new instance of itself.
- May contain other `objects` and `entities` as attributes. In the case of association with entities via aggregation, `aggregates` must be used.

Example of architectural preference:

- If the rule can be answered just by looking at the object itself, such as `canHaveAudio`, `isLocked`, `canBePublished` or `hasReachedLimit`, it must live in the domain object.
- Avoid spreading conditionals based on the object's internal details across the `use case`, such as manually comparing `type`, `status` or flags in several flows.
- Use the `use case` to decide **when** to perform an action; use the domain object to answer **whether** that action makes sense for its current state.

---

### Aggregate

In DDD, an *Aggregate* is a set of domain objects (entities and value objects) that form a unit of consistency and integrity. In StarDust, an `aggregate` is a class that encapsulates an entity that has a 1:1 aggregation relationship with another entity.

> Example: Every user has an avatar. However, to create a user, it is not necessary to provide all the avatar's attributes, only its `id`. In this case, the `User` entity has an `AvatarAggregate` as an attribute, instead of directly referencing the `Avatar` entity.

An `aggregate` must follow the pattern:

- Have an `id` attribute (mandatory) and an `entity` attribute (which may be `undefined`).
- Have the `id` attribute exactly equal to the `id` of the aggregated entity.
- Have the `entity` attribute with the type of the corresponding entity.

Each `aggregate` must have a corresponding `dto`, in which the `entity` attribute is represented as a `dto`, with the `dto` type of the original entity.

---

### Event

Domain events are classes that represent messages indicating that something important happened in the domain — something that has already occurred and that the business cares about. Every event carries a `payload`, that is, a set of primitive data describing what occurred and which may be relevant to other parts of the system.

Events are used to promote communication between StarDust's modules, keeping them independent from one another.

An `event` must follow the pattern:

- Be named in the past tense and end with the suffix `Event`, such as `UserCreatedEvent`, `StarUnlockedEvent`, `LastTierReachedEvent`.
- Ensure that all `payload` data is public and immutable.
- Contain a static property called `key`, of type `string`, that indicates the name of the event and the module where it was fired.

---

### Abstract

A base class that must be extended by domain elements, with the goal of sharing common behaviors, leaving the implementation of specific parts to the subclasses.

An `abstract` can also be used to apply the [Strategy](https://refactoring.guru/design-patterns/strategy) pattern, allowing the dynamic choice of algorithms or behaviors among several options, without modifying the class that uses them.

---

### Error

A class that represents an error related to a specific business rule, indicating that execution cannot continue.

An `error` class can be extended to create other specialized error classes.

It must follow the pattern:

- Inherit from the language's base `Error` class.
- Contain only attributes with primitive and immutable types.
- Have the suffix `Error`, such as `UserNotFoundError`, `StarLockedError`, `ChallengeNotPublicError`.
- Must not have methods, only attributes.

---

### Factory

A factory is a class that encapsulates the object creation logic, especially when that logic is complex or depends on other entities/services. It ensures that entities or aggregates are created in a consistent and valid way, without exposing that complexity to other parts of the system.

A `factory` must follow the pattern:

- Contain a single public method called `produce`, which creates and returns the expected type.
- Have the suffix `Factory`, such as `UserFactory`, `PlanetFactory`, `ChallengeFactory`.

## 📑 Interfaces

They are the contracts that define how a handler, gateway or protocol must behave exclusively through methods. An interface can be implemented by a class or a function. In the case of a function, it must return an object that contains the methods established by the interface in question.

The interface serves precisely to apply the dependency inversion principle to decouple applications, services and libraries.

Mandatory rules for `repository` interfaces and equivalent contracts:

- Methods must receive **domain objects/core structures** whenever that type already exists to represent the data with semantic meaning.
- Avoid primitive parameters in core contracts when the module already has a `structure` or another appropriate object for that value.
- The conversion between primitive and domain object must happen before the call to the contract, usually in the `use case` or at the application boundary.
- The concrete adapter may serialize the domain object to a primitive only at the moment of talking to the database, external API or SDK.

Examples:

- Correct: `findByHash(keyHash: Text): Promise<ApiKey | null>`
- Incorrect: `findByHash(keyHash: string): Promise<ApiKey | null>`
- Correct: `findById(userId: Id): Promise<User | null>`
- Incorrect: `findById(userId: string): Promise<User | null>`

## 📤 Responses

They are classes that establish the return format of a method with the goal of standardizing responses at scale. This type of class is inspired by the [Result Pattern](https://medium.com/@wgyxxbf/result-pattern-a01729f42f8c)

> For example: `RestResponse` can encapsulate the http response, containing status code, headers, body, etc. `PaginationResponse` encapsulates the total number of pages and items, and so on.

In addition, a `response` can contain another `response`. For example, following the example above, the `body` property of the `ApiResponse` can be of type `PaginationResponse`.

## 🛍️ Data Transfer Objects (DTOs)

They are simple objects used to carry data between layers of a system or between different systems, without containing business logic. They are generally used to create `entities`, `vos` and `aggregates`

A `dto` must follow the pattern:

- Contain only attributes of primitive type, all public and mutable.
- End with the suffix `Dto`, such as `UserDto`, `StarDto`, `PlanetDto`.
- Not have any method/behavior


## ✨ Use cases

They are classes that represent the actions the system performs from the business point of view. For example, “Create order”, “Send welcome email”, “Update user profile”, “Export report as PDF”. 

Therefore, they orchestrate the business logic, calling domain elements and interfaces.

A Use Case follows the pattern:

- A clear name, such as `CreateChallenge`, `SendConfirmationEmail`, `GenerateReport`, `ListRockets`, `GetAvatar`.
- A main method, usually called `do()`. All other methods of the `use case` must be private.
- A `use case` must not receive or return any domain element directly, only `dtos`.
- All dependencies of the `use cases` must be constants and interfaces.
- A `use case` must not reimplement a rule that can legitimately live in a domain object. If the decision depends only on the state of the object itself, the rule must be exposed by the object and merely consumed/orchestrated by the `use case`.

## 🥸 Domain object fakers

They are classes responsible for generating domain objects with fictitious data. Their main goal is to speed up the creation of tests, whether automated tests or visual tests, quickly providing realistic data, but without the need to use real information.

A faker follows the pattern:

- End with the suffix `Faker`, such as `CommentsFaker`, `UsersFaker`, `CategoriesFaker`.
- Have only static methods
- Have all or some of these methods:
`fake` -> Returns the domain object. Receives a dto as a base parameter, if necessary.
`fakeMany` -> Returns a list of objects of the same type as the domain object.
`fakeDto` -> Returns the dto of the domain object. Receives a dto as a base parameter, if necessary. 
`fakeManyDto` -> Returns a list of dtos of the domain object. Receives a dto as a base parameter, if necessary, and the number of items to be faked.


## 🤡 Mocks

A mock is a simulated object that imitates the behavior of real components in software systems, especially in tests. Therefore, it is used to isolate the part of the system being tested, avoiding the need to interact with external dependencies, such as databases, APIs or other services. In the core package, mocks implement interfaces to replace the real implementations in use cases and domain objects.

A mock follows the pattern:
- End with the suffix `Mock`, such as `ProfileServiceMock`, `ShopServiceMock`, `AuthServiceMock`.
- If persistence is needed, only in memory.

# Development

## Libraries

- [Faker.js](https://fakerjs.dev) - library used to generate fake data quickly.
- [Dayjs](https://day.js.org/) - library for working with dates in JavaScript.
- [UUID](https://www.npmjs.com/package/uuid) - library to generate [uuid](https://en.wikipedia.org/wiki/Universally_unique_identifier) ids.

## Running the tests

**Clone the repository**

```bash
git clone https://github.com/JohnPetros/stardust.git
```

**Navigate to the core package folder**

```bash
cd ./stardust/packages/core
```

**Install the dependencies**

```bash
pnpm install
```

**Run the tests**

```bash
pnpm run test
```
## Folder structure

```
📦 Core package
├─ <Module name>
├─ ✨ use-cases
├─ 📑 interfaces
📤 responses
🪨 constants
📖 libs
├─ 🛍️ dtos
└─ 🌐 domain
   ├─ abstracts
   ├─ entities
   ├─ structures
   ├─ events
   ├─ errors
   └─ factories
```
The number of folder types described above will depend on the module; some may have more, others fewer.

The test files for `entities`, `structures` and `use-cases` are placed inside a folder called `tests` inside their respective folders where the original code to be tested is. Likewise, the `faker` implementation files for `entities` and `structures` are placed inside a folder called `fakers` inside the `entities` and `structures` folders.

```
📦 
├─ use-cases
│  ├─ 🧪 tests
│  └─ ...
└─ domain
   ├─ entities
   │  ├─ 🧪 tests
   │  ├─ 🥸 fakers
   │  └─ ...
   └─ structures
      ├─ 🧪 tests
      ├─ 🥸 fakers
      └─ ...
```

## Tooling

- Scripts of the `@stardust/core` workspace:
  - Build: `pnpm --filter @stardust/core run build` (tsup)
  - Types: `pnpm --filter @stardust/core run check:types`
  - Quality: `pnpm --filter @stardust/core run check:code` (`lint` + `format`)
  - Tests: `pnpm --filter @stardust/core run test:unit`
- Orchestration (root): `pnpm run test`, `pnpm run check:types`, `pnpm run check:code` (Turbo) to run in all workspaces.
- General reference: `documentation/tooling.md`.
