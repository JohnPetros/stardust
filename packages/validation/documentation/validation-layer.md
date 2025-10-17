# Validation Layer - Data Validation with Zod

The validation layer is responsible for validating data throughout the application. It uses the **Zod** library to create and manage validation schemas.

## Structure

The validation layer is located in the `/home/petros/stardust/packages/validation` directory.

```
packages/validation/
└── src/
    ├── factories/
    │   └── ZodValidationErrorFactory.ts
    ├── modules/
    │   └── global/
    │       └── schemas/
    │           └── emailSchema.ts
    └── main.ts
```

- **`modules`**: Contains the validation schemas, organized by domain.
- **`factories`**: Contains factories for creating validation-related objects, such as validation errors.
- **`main.ts`**: The entry point of the package.

## Schemas

Validation schemas are defined using **Zod** and are organized by domain in the `modules` directory. This ensures that the validation logic is co-located with the domain it belongs to.

**Example: `emailSchema.ts`**

This file defines a Zod schema for validating email addresses. It extends a base `stringSchema` and adds an email-specific validation rule.

```typescript
import { GLOBAL_ERROR_MESSAGES } from '../constants'
import { stringSchema } from './stringSchema'

export const emailSchema = stringSchema.email(GLOBAL_ERROR_MESSAGES.email.regex)
```

## Error Handling

The `ZodValidationErrorFactory.ts` file is responsible for creating consistent validation error objects. This factory takes a Zod error and transforms it into a custom error object that can be used throughout the application. This ensures that validation errors are handled in a uniform way.