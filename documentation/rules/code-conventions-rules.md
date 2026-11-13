# Introduction

In a few words, code conventions are a set of rules and best practices that
developers follow when writing code. Think of them as a "style guide" for
programming. The main goal is to ensure that the code is consistent, readable
and easy to maintain by anyone on the project.

The main conventions to follow when writing code are listed below.

# Naming of variables, types, objects and functions

## Language

All the project's code is written in English, because it is believed to be easier
to write that way than if it were in Portuguese.

## Camel case

Local variables, object properties, function parameters and names of
functions/methods must be written in
[camelCase](https://developer.mozilla.org/en-US/docs/Glossary/Camel_case).

## Pascal case

Names of classes, interfaces, types and factory functions are written in
[PascalCase](https://www.theserverside.com/definition/Pascal-case).

## Descriptiveness and Clarity

Always opt for names that clearly describe the purpose of the variable.
`productsList` is better than pl or items, for example.

## Less redundancy

If you already have the name explicit, it often means you can
simplify the variable name.

e.g.:

```ts
const controller = new FetchLastWeekRankingWinnersController();

// instead of

const fetchLastWeekRankingWinnersController =
  new FetchLastWeekRankingWinnersController();
```

## Boolean variables:

Use prefixes such as `is`, `has`, `can`, `should` for variables that store
boolean values.

Examples: `isActive`, `hasPermission`, `canEdit`, `shouldRetry`.

> Difference between `can` and `should`: when the variable indicates true to
> execute an action use `should`, in the other cases opt for `can`.

## Collection variables

Use the plural for names of arrays or lists.

Examples: `users`, `achievements`, `unlockedStars`.

## Number variables

Use the suffix `count` to indicate that a variable is a number.

Examples: `upvotesCount`, `completedChallengesCount`, `unlockedStarsCount`

This rule is not necessary for nouns that by nature are already
represented as a number, such as `height`, `level`, `margin` etc.

## Constants

They are written in upper case and in
[snake_case](https://www.theserverside.com/definition/Snake-case).

Examples: `SUPABASE_URL`, `HEADER_HEIGHT`, `EVENT_KEY`.

Constants are declarations consumed by the application's behavior and do not
receive dedicated tests. Do not create `*.test.*` or `*.spec.*` files inside
`constants/` folders, nor isolated tests whose purpose is to repeat the literal
value of a constant. Validate the value through the relevant consuming boundary.

If a constants module acquires transformations, decisions or other logic
that requires its own test, move that logic to the appropriate layer and keep only
the declarations in the module.

## Interfaces

If the interface has the same name as the class or factory function, import it
via an alias with an uppercase I as a prefix.

Example: `import { ProfileService as IProfileService }`

## Functions

Functions must always start with a verb in the imperative, except factory
functions, which must be nouns.

Examples: `unlockStar`, `earnCoins`, `acquireAvatar`.

## File naming

A file serves to export a class, factory function, widget, function,
validation object, type, interface or constant. The object naming rules
almost always also apply to file names, except for constants,
which must be written in
[kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

Examples:

```
AppError.ts // Class
ProfilePageView.tsx // Widget
usePagination.ts // function
special-characters.ts // constant
userSchema.ts // validation object
```

# Barrel files

## Internal application errors

Internal application errors must be represented by `AppError` or by a
domain error class that inherits from `AppError`. Do not use `new Error()` or
`throw Error()` in production code; this loses the handling contract and the
classification used by the application. SDK/infrastructure errors must be
converted to `AppError` at the provider or adapter boundary.

Allowed exceptions: `Error` types required by external APIs (for example,
React error boundaries) and `new Error` used only to make a test fixture
or matcher fail. These exceptions do not represent internal application
errors.

A Barrel File is a file (usually named index.ts or index.tsx) whose
role is to export multiple modules from a folder in a centralized way. Instead of
importing each module individually from its respective location, it is possible to
import everything directly from the barrel file, simplifying the import
statements.

## Practical example

Consider a controllers folder containing several controller classes:

```ts
// controllers/index.ts
export { Controller1 } from "./Controller1";
export { Controller2 } from "./Controller2";
export { Controller3 } from "./Controller3";
export { Controller4 } from "./Controller4";
```

Then, in another file, you can import these components in a simplified way:

```ts
// Your application.ts
import { Controller1, Controller2 } from "./controllers";

const controller1 = new Controller1();
const controller2 = new Controller2();
```

> [!Caution]\
> Folders dedicated to exporting hooks and widgets do not have an index.ts file
> to avoid problems of improper code execution and to make it more explicit
> which hook or widget is being mocked in automated tests.

# Factory functions

In React projects, the functional paradigm is prioritized. To maintain
consistency throughout the application, Factory Functions are
adopted as the standard for creating "classes" and modules that need to
manage state or dependencies.

A Factory Function is a function that returns a new object. They can be
considered a flexible "constructor" that does not require the new keyword. They
offer a powerful and more idiomatic alternative to the use of class or traditional
constructor functions in modern JavaScript, especially in a functional
context.

To ensure consistency and readability, Factory Functions must follow
the following conventions:

- Declaration: They must be declared as an arrow function (=>) and assigned to
  a constant (const).
- Return: They must always return an object containing the methods and/or properties
  that the factory function exposes.
- Typing: If the factory function is implementing an interface, the interface
  must be the function's explicit return type.
- Naming: The function name must be written in
  [PascalCase](https://www.theserverside.com/definition/Pascal-case) (e.g.:
  MyService, DataManager).
- Dependency Inversion: Its arguments must be dependencies (such as other
  services, HTTP clients, etc.), applying the
  [Dependency Inversion](https://www.baeldung.com/cs/dip) principle. This makes
  testability and maintenance easier.

## Practical example

```ts
// Defines the interface to guarantee the service contract
interface ISpaceService {
  fetchPlanets(): Promise<any>;
  fetchStarBySlug(starSlug: Slug): Promise<any>;
  fetchStarById(starId: Id): Promise<any>;
}

const SpaceService = (restClient: RestClient): ISpaceService => {
  // The function returns an object that implements ISpaceService
  return {
    async fetchPlanets() {
      return await restClient.get("/space/planets");
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`);
    },
  };
};

// Usage example: instantiating the service (note that 'new' is not used)
const myRestClient = new RestClient(); // Assuming a RestClient instance
const spaceServiceInstance = SpaceService(myRestClient);
```

If auxiliary logic is needed that does not have to be publicly exposed, it is
possible to declare internal functions inside the Factory Function. They
benefit from the closure to access the dependencies passed to the factory.

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

# Tooling

- Monorepo quality standard:
  - Lint/format: Biome (via the `lint`, `format`, `codecheck` scripts).
  - Typecheck: TypeScript (`tsc`).
  - Tests: Jest.
- Recommended execution:
  - Global: `pnpm run check:code`, `pnpm run check:types`, `pnpm run test` (at the root, via Turbo).
  - Specific workspace: `pnpm --filter <workspace> run check:code`.
- Commit/release hooks:
  - Husky and commitlint are used at the root (see `/package.json`).
- General reference: `documentation/tooling.md`.
