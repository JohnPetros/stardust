---
alwaysApply: false
---
# Database Layer Rules (db)

## Overview

The **Database (db)** layer implements persistence on the server through `repositories` (gateways) that isolate the domain from database details.

| Item | Definition |
| --- | --- |
| **Goal** | Persist/query data without leaking Supabase/PostgreSQL details into the core. |
| **Responsibilities** | Implement the core's `repositories`; maintain DB <-> domain `mappers`; encapsulate database errors. |
| **Does not do** | Business rules; return database-generated types outside the layer. |

## Directory Structure

| Path | Purpose |
| --- | --- |
| `apps/server/src/database/` | Layer root. |
| `apps/server/src/database/supabase/` | Supabase/PostgreSQL integration. |
| `apps/server/src/database/supabase/repositories/` | Concrete implementations (e.g.: `apps/server/src/database/supabase/repositories/SupabaseRepository.ts`). |
| `apps/server/src/database/supabase/types/Database.ts` | Database-generated types (must not leak). |
| `apps/server/supabase/migrations` | Migrations. |
| `apps/server/supabase/schemas/schema.sql` | SQL schema. |

## Rules

- **Contracts first**: `repository` implements interfaces defined in the core.
- **Explicit mappers**
  - When reading: DB shape -> domain entity/structure.
  - When writing: entity/structure -> DB shape.
- **Errors**: encapsulate/convert Postgres/Supabase errors when necessary.

> ⚠️ Forbidden: returning generated types (e.g.: `Database.ts`) outside `apps/server/src/database/**`.

## Organization and Naming

- Repositories: `Supabase<Entity>Repository` when the implementation is specific.
- Mappers: methods such as `toEntity` and `toSupabase` (or `toPersistence`).

## Example

```ts
// Illustrative example (concrete names vary by domain)
export class SupabaseUsersRepository /* extends SupabaseRepository */ {
  async findById(userId) {
    // supabase query
    // mapper: toEntity
    return null
  }
}
```

## Integration with Other Layers

- **Allowed**: depend on the Supabase client and generated types; depend on core entities/structures and interfaces.
- **Forbidden**: the core importing `apps/server/src/database/**`.
- **Contract**: repository interfaces in the core.
- **Direction**: controllers/jobs/tools instantiate repositories and inject them into use-cases.

## Checklist (before the PR)

- Repository interface exists in the core.
- Repository returns domain objects (not database types).
- Mapper covers reading and writing.
- Database errors are handled/converted.

## Notes

- The server uses Supabase as its main integration.
- Tooling: `documentation/tooling.md`.

## Approved transition: Drizzle and SSE (Issue #602)

The Supabase conventions above describe the legacy adapter. For the delivery of Issue #602, the following approved conventions prevail; they do not authorize changing domain contracts:

- Implementations in `apps/server/src/database/drizzle/`, named `Drizzle<Entity>Repository`; SQL schemas and types live in that layer. The new paths are listed as Create in the Spec's map.
- Organization adapted from Scoops to StarDust: models/<domain> declares pgTable/pgEnum constants in kebab-case files; types/entities/<domain> derives rows/inserts from those models; mappers/<domain> and repositories/<domain> preserve classes/ports. schema.ts only aggregates the models; DrizzleRepository lives at the adapter root. Classes/types follow PascalCase. SQL identifiers and Core boundaries remain intact.
- The constructor receives a Drizzle connection and an explicit access context, composed by the Server. Do not derive identity from the payload, from a merely decoded JWT or from the privileged connection; do not use the system context as a fallback.
- Existing repository interfaces in the Core remain intact, with the same methods, inputs and returns. Explicit mappers translate rows/projections to the domain and use `toEntity`/`toPersistence`; no row, query builder or transaction client crosses into the Core.
- Ownership is applied in private queries using the verified identity. God Account is verified before administrative composition. Jobs receive system explicitly. Authorization filters do not replace the use cases' business rules.
- API key bootstrap preserves AuthenticateApiKeyUseCase: the public context only admits findByHash with a hash produced by the provider, internally to the authentication boundary; it does not grant key listing/writing or access to private repositories. An invalid/revoked key fails before business composition, and there is no system fallback.
- Relation replacements and the persistence of an aggregate use a local transaction; SQL is parameterized. External effects do not enter the transaction. SQL errors are converted to the existing public errors without revealing SQL or credentials.
- Migrations versioned in `apps/server/src/database/drizzle/migrations/` represent the final legacy schema, including required constraints, indexes, FKs, defaults, views, functions and triggers. Drizzle Kit generates schema artifacts; SQL for non-representable objects and security is versioned in custom migrations. Do not manually edit snapshots/SQL classified as Generate.
- Dev/production adopt the baseline only after a catalog and history preflight; there is no remote reset nor implicit backfill. Removing RLS requires revoking direct access, including SECURITY DEFINER functions and PUBLIC grants/default privileges; Auth, infrastructure storage and cron are not redesigned.
- One pool per process, closing on shutdown and migrations in the pipeline. Validation through real route tests and scripts; do not create dedicated tests for repositories, mappers, types or fixtures.
