# Database Layer - Data Persistence

The database layer is responsible for all communication with the database. It uses **Supabase** as the database provider and follows the **Repository Pattern** to decouple the application from the database implementation. This is another example of the **Dependency Inversion Principle** in action.

## Structure

The database layer is located in the `/home/petros/stardust/apps/server/src/database` directory.

```
src/database/
├── supabase/
│   ├── errors/
│   ├── mappers/
│   ├── migrations/
│   ├── repositories/
│   │   └── space/
│   │       └── SupabaseStarsRepository.ts
│   ├── types/
│   └── config.toml
└── index.ts
```

- **`repositories`**: Contains the concrete implementations of the repository interfaces defined in the `core` package.
- **`mappers`**: Responsible for mapping the data from the database (Supabase) to the domain entities defined in the `core` package, and vice-versa.
- **`migrations`**: Contains the database migration scripts.
- **`errors`**: Contains custom error classes related to database operations.
- **`types`**: Contains Supabase-specific types.
- **`config.toml`**: The configuration file for Supabase.

## Repositories

Repositories are the core of the database layer. They are responsible for all the queries and mutations to the database. They implement the repository interfaces defined in the `core` package, which allows the rest of the application to be completely unaware of the database implementation.

Repositories are organized by domain, just like the other layers of the application.

**Example: `SupabaseStarsRepository.ts`**

This repository implements the `StarsRepository` interface from the `core` package and uses the Supabase client to interact with the `stars` table in the database.

```typescript
import type { StarsRepository } from '@stardust/core/space/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'
import type { Star } from '@stardust/core/space/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseStarMapper } from '../../mappers/space'

export class SupabaseStarsRepository
  extends SupabaseRepository
  implements StarsRepository
{
  async findById(starId: Id): Promise<Star | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('id, name, number, slug')
      .eq('id', starId.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseStarMapper.toEntity(data)
  }

  // ... other methods
}
```

## Mappers

Mappers are responsible for converting the data between the database format and the domain entities. This is a crucial part of the database layer, as it ensures that the domain layer is not polluted with database-specific details.

In the example above, `SupabaseStarMapper.toEntity(data)` is used to convert the data from the Supabase client to a `Star` entity.

## Migrations

The `migrations` directory contains the SQL scripts that are used to manage the database schema. These scripts are executed by the Supabase CLI to apply changes to the database.