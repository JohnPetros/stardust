# Validation Layer Rules

## Overview

The **Validation** layer centralizes the Zod schemas shared across the monorepo apps. It defines input contracts at the application edge and standardizes reusable validations without carrying domain business rules.

| Item | Definition |
| --- | --- |
| **Goal** | Validate and normalize input data with Zod before it reaches the core or the adapters. |
| **Responsibilities** | Declare reusable schemas, compose schemas per module and translate Zod errors into `ValidationError`. |
| **Does not do** | Implement domain business rules; access the database; call external services; depend on `apps/**`. |

## Directory Structure

| Path | Purpose |
| --- | --- |
| `packages/validation/src/main.ts` | Main barrel of the package. |
| `packages/validation/src/factories/` | Layer factory/utilities, such as `ZodError` translation. |
| `packages/validation/src/modules/global/schemas/` | Primitives and base schemas reusable across modules. |
| `packages/validation/src/modules/<module>/` | Schemas specific to each domain context. |
| `packages/validation/src/modules/<module>/schemas/index.ts` | Module barrel when it exposes schemas. |

## Rules

- **Zod as the standard**: every shared validation must be implemented with `zod`.
- **Composition first**: prefer composing schemas from reusable bases such as `stringSchema`, `idSchema`, `nameSchema` and similar.
- **Messages in the schema itself**: error messages must be defined inline in the schema, in PT-BR (they are shown to end users and stay in Portuguese), close to the rule that triggers them.
- **No global message catalog**: do not create generic constants such as `GLOBAL_ERROR_MESSAGES` to centralize validation texts.
- **Global schemas in `global/schemas`**: cross-cutting validations and reusable primitives must live in the `global` module.
- **Domain schemas per module**: validations specific to a context must live inside the module itself (`auth`, `challenging`, `lesson`, etc.).
- **Small, focused files**: each file must export one main schema.
- **Exports through barrels**: every new schema must be exposed in the module's `index.ts` and, when applicable, in `src/main.ts`.
- **Explicit transformations**: use `.transform()` only when the layer really needs to normalize input, such as query params or lists.
- **No app dependency**: the package may depend on `@stardust/core`, but never on `apps/web`, `apps/server` or `apps/backoffice`.

## Patterns

### Reusable base schemas

Low-level schemas must capture the most common rule of that type and serve as a building block for other schemas.

Real example:

```ts
import { z } from 'zod'

export const stringSchema = z.string({ required_error: 'Campo obrigatório' })
```

(`'Campo obrigatório'` means "Required field"; the message stays in PT-BR.)

### Extension and composition

When a schema represents a larger structure, it must reuse existing schemas instead of rewriting the same rules.

Real example:

```ts
export const nameSchema = stringSchema
  .min(3, 'Nome deve conter pelo menos 3 caracteres')
  .max(100, 'Nome deve conter no máximo 100 caracteres')
```

(The messages mean "Name must contain at least 3 characters" and "Name must contain at most 100 characters".)

Example of composition across modules:

```ts
export const challengeFormSchema = challengeSchema.extend({
  title: titleSchema,
  description: contentSchema,
  author: z.object({
    id: idSchema,
  }),
  difficultyLevel: challengeDifficultyLevelSchema,
})
```

### Input normalization

Transformations are allowed when the layer needs to convert transport formats into types that are more convenient for later consumption.

Real example:

```ts
export const queryParamBooleanSchema = z
  .enum(['true', 'false'])
  .transform((val) => val === 'true')
```

## Error Handling

Zod errors must be converted to the project's standard format via `ZodValidationErrorFactory`.

Factory responsibilities:

- Group messages by field from `zodError.issues`.
- Produce an instance of the core's `ValidationError`.
- Keep error translation outside the schemas, keeping the schemas focused only on validating and transforming data.

## Anti-patterns

### Anti-pattern: centralizing all messages in a global object

**What to avoid:**
Creating files such as `GLOBAL_ERROR_MESSAGES` and referencing the messages by key in all the schemas.

**Why it is wrong:**
It moves the message away from the rule that uses it, worsens schema readability, increases unnecessary coupling and makes localized maintenance harder.

**How to do it:**
Define the message directly in the schema method call.

Correct example:

```ts
export const passwordSchema = stringSchema.min(
  6,
  'Sua senha deve conter pelo menos 6 caracteres',
)
```

(The message means "Your password must contain at least 6 characters".)

### Anti-pattern: rewriting base validations in domain schemas

**What to avoid:**
Declaring `z.string()` with the same rules in several modules when an equivalent global schema already exists.

**How to do it:**
Reuse the base schema and add only the restrictions specific to that case.

## Integration with Other Layers

- **Core**: may import types/errors from the core, such as `ValidationError`.
- **Apps**: `web`, `server` and `studio` consume the schemas of this package, but the package imports nothing from them.
- **Edge**: controllers, actions, routes, tools and forms must use these schemas to validate input.
- **Dependency direction**: `apps/** -> packages/validation -> @stardust/core`.

## Checklist (before the PR)

- The new schema is in the correct module.
- The error message is in the schema itself and in PT-BR.
- The schema reuses global bases when it makes sense.
- The file exports a single main schema with a clear name.
- The module's `index.ts` was updated.
- `src/main.ts` was updated when the module is part of the package's public API.
- No dependency on `apps/**` was introduced.

## Notes

- The package exposes its public contracts through `packages/validation/src/main.ts` and through subpaths defined in `packages/validation/package.json`.
- `global/schemas` must remain the main source of shared primitives.
