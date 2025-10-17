# Provision Layer - Infrastructure and Service Provisioning

The provision layer is responsible for provisioning the application's infrastructure and services. It follows the **Strategy Pattern**, allowing different providers to be used for various services like database, monitoring, and storage. This makes the application flexible and easy to extend.

## Structure

The provision layer is located in the `/home/petros/stardust/apps/server/src/provision` directory.

```
src/provision/
├── database/
│   └── SupabaseDatabaseProvider.ts
├── monitor/
│   └── SentryTelemetryProvider.ts
└── storage/
    ├── DropboxStorageProvider.ts
    ├── GoogleDriveStorageProvider.ts
    └── SupabaseStorageProvider.ts
```

- **`database`**: Contains the database provider (e.g., Supabase).
- **`monitor`**: Contains the monitoring and telemetry provider (e.g., Sentry).
- **`storage`**: Contains the storage providers (e.g., Dropbox, Google Drive, Supabase).

## Providers

Providers are classes that implement a specific interface from the `core` package and provide the logic for provisioning a service.

### Database Provider

The database provider is responsible for managing the database, including tasks like backups.

**Example: `SupabaseDatabaseProvider.ts`**

This provider implements the `DatabaseProvider` interface from the `core` package and provides a `backup` method that uses `pg_dump` to create a backup of the Supabase database.

```typescript
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import type { DatabaseProvider } from '@stardust/core/global/interfaces'

import { ENV } from '@/constants/env'

const execAsync = promisify(exec)

export class SupabaseDatabaseProvider implements DatabaseProvider {
  async backup(): Promise<File> {
    const date = new Date().toISOString().split('T')[0]
    const filename = `backup-${date}.dump`

    const command = `/usr/lib/postgresql/15/bin/pg_dump '${ENV.databaseUrl}' -F c -f ${filename}`
    console.log(`🔄 Running backup: ${command}`)

    try {
      const { stdout, stderr } = await execAsync(command)

      if (stdout) console.log('Backup stdout:', stdout)
      if (stderr) console.error('Backup stderr:', stderr)

      console.log(`Backup completed: ${filename}`)

      return new File([], filename)
    } catch (error) {
      console.error('Failed to run pg_dump:', error)
      throw error
    }
  }
}
```

### Monitoring Provider

The monitoring provider is responsible for setting up and configuring the monitoring and telemetry service.

**`SentryTelemetryProvider.ts`**: This provider would implement the `TelemetryProvider` interface and configure Sentry for error tracking and performance monitoring.

### Storage Providers

The storage providers are responsible for managing file storage. The application supports multiple storage providers, and the provision layer allows to easily switch between them.

- **`DropboxStorageProvider.ts`**: Implements the `StorageProvider` interface using the Dropbox API.
- **`GoogleDriveStorageProvider.ts`**: Implements the `StorageProvider` interface using the Google Drive API.
- **`SupabaseStorageProvider.ts`**: Implements the `StorageProvider` interface using the Supabase Storage API.

## Extensibility

The provision layer is designed to be easily extensible. To add a new provider, you need to:
1.  Create a new class that implements the corresponding interface from the `core` package.
2.  Add the new provider to the appropriate directory in the `provision` layer.
3.  Update the application's configuration to use the new provider.