# Provision Layer Rules

## Overview

The **Provision** layer encapsulates external SDKs and services as `providers` (gateways) that implement **core interfaces**, keeping the domain decoupled from third parties.

| Item | Definition |
| --- | --- |
| **Goal** | Adapt external infrastructure (SDKs/services) to core contracts. |
| **Responsibilities** | Implement `providers`; map errors to `AppError`; centralize configuration via `ENV`/`fromEnv` without leaking secrets. |
| **Does not** | Business rules; expose SDK types/clients; decide domain policies. |

## Directory Structure

Base directory: `apps/server/src/provision`.

| Folder | Purpose | Example |
| --- | --- | --- |
| `cache/` | Implements `CacheProvider` (core) without exposing Redis/Upstash. | `apps/server/src/provision/cache/UpstashCacheProvider.ts` |
| `storage/` | Implements `FileStorageProvider` (core) without exposing bucket/SDK. | `apps/server/src/provision/storage/SupabaseFileStorageProvider.ts` |
| `monitor/` | Implements `TelemetryProvider` (core). | `apps/server/src/provision/monitor/SentryTelemetryProvider.ts` |
| `database/` | Implements `DatabaseProvider` (core) for auxiliary operations (e.g., backup). | `apps/server/src/provision/database/SupabaseDatabaseProvider.ts` |

## Rules

- **Implementation**: a `provider` must only adapt the external SDK to the core interface.
- **Error mapping**: catch SDK errors and rethrow them as `AppError` (or an equivalent domain error) to avoid leaking details.
- **Types**: do not return SDK types; map them to core/domain types.
- **Configuration**: read environment variables (e.g., `ENV`) without logging/propagating secrets.

> ⚠️ Warning sign: any `import`/return of SDK types outside the `provider` indicates an infrastructure leak.

## Organization and Naming

- `provider`: `<Vendor><Capability>Provider` (e.g., `UpstashCacheProvider`).
- SDK `client`: internal detail of the `provider` (do not expose it through a public property).
- When there is more than one concrete implementation for the same capability, each provider must live in its own subfolder inside the capability. E.g.: `apps/server/src/provision/tts/open-ai/OpenAITtsProvider.ts`, `apps/server/src/provision/tts/eleven-labs/ElevenLabsTtsProvider.ts`.

## Integration with Other Layers

- **Allowed**: depend on third-party SDKs; depend on core interfaces/errors.
- **Forbidden**: the core importing `apps/server/src/provision/**`.
- **Dependency direction**: apps/adapters implement providers; the core consumes them through an interface.

## Testing Strategy

- Providers and internal helpers of the Provision layer do not receive dedicated
  tests. Do not create `*.test.*` or `*.spec.*` files in
  `apps/server/src/provision/**`.
- Validate the provider integration through the boundary that consumes it, using
  the applicable route, handler, or use case test and observing the external
  result.
- When the integration depends on real infrastructure, complement the validation
  on the local stack or in the corresponding manual flow, without testing internal
  SDK calls.
- If a business rule emerges inside a provider, move it to the appropriate layer
  and test that rule in that layer.

## Checklist (before the PR)

- A core interface exists for the provider.
- The provider implements the interface and does not expose the SDK.
- External errors are converted to `AppError`.
- Secrets live in environment variables (no credentials in code).
- There is no test dedicated to the provider or its internal helpers.

## Notes

- The current Provision layer lives in `apps/server/src/provision`.
