# Camada de Provisionamento - Provisionamento de Infraestrutura e Serviços

A camada de provisionamento é responsável por provisionar a infraestrutura e os serviços da aplicação. Ela segue o **Padrão de Estratégia**, permitindo que diferentes provedores sejam usados para vários serviços como banco de dados, monitoramento e armazenamento. Isso torna a aplicação flexível e fácil de estender.

## Estrutura

A camada de provisionamento está localizada no diretório `./apps/server/src/provision`.

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

- **`database`**: Contém o provedor de banco de dados (e.g., Supabase).
- **`monitor`**: Contém o provedor de monitoramento e telemetria (e.g., Sentry).
- **`storage`**: Contém os provedores de armazenamento (e.g., Dropbox, Google Drive, Supabase).

## Provedores

Os provedores são classes que implementam uma interface específica do pacote `core` e fornecem a lógica para provisionar um serviço.

### Provedor de Banco de Dados

O provedor de banco de dados é responsável por gerenciar o banco de dados, incluindo tarefas como backups.

**Exemplo: `SupabaseDatabaseProvider.ts`**

Este provedor implementa a interface `DatabaseProvider` do pacote `core` e fornece um método `backup` que usa `pg_dump` para criar um backup do banco de dados Supabase.

```typescript
import { exec } from "node:child_process";
import { promisify } from "node:util";

import type { DatabaseProvider } from "@stardust/core/global/interfaces";

import { ENV } from "@/constants/env";

const execAsync = promisify(exec);

export class SupabaseDatabaseProvider implements DatabaseProvider {
  async backup(): Promise<File> {
    const date = new Date().toISOString().split("T")[0];
    const filename = `backup-${date}.dump`;

    const command =
      `/usr/lib/postgresql/15/bin/pg_dump '${ENV.databaseUrl}' -F c -f ${filename}`;
    console.log(`🔄 Running backup: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command);

      if (stdout) console.log("Backup stdout:", stdout);
      if (stderr) console.error("Backup stderr:", stderr);

      console.log(`Backup completed: ${filename}`);

      return new File([], filename);
    } catch (error) {
      console.error("Failed to run pg_dump:", error);
      throw error;
    }
  }
}
```

### Provedor de Monitoramento

O provedor de monitoramento é responsável por configurar o serviço de monitoramento e telemetria.

**`SentryTelemetryProvider.ts`**: Este provedor implementaria a interface `TelemetryProvider` e configuraria o Sentry para rastreamento de erros and monitoramento de desempenho.

### Provedores de Armazenamento

Os provedores de armazenamento são responsáveis por gerenciar o armazenamento de arquivos. A aplicação suporta múltiplos provedores de armazenamento, e a camada de provisionamento permite alternar facilmente entre eles.

- **`DropboxStorageProvider.ts`**: Implementa a interface `StorageProvider` usando a API do Dropbox.
- **`GoogleDriveStorageProvider.ts`**: Implementa a interface `StorageProvider` usando a API do Google Drive.
- **`SupabaseStorageProvider.ts`**: Implementa a interface `StorageProvider` usando a API de Armazenamento do Supabase.

## Extensibilidade

A camada de provisionamento é projetada para ser facilmente extensível. Para adicionar um novo provedor, você precisa:

1. Criar uma nova classe que implementa a interface correspondente do pacote `core`.
2. Adicionar o novo provedor ao diretório apropriado na camada de `provisionamento`.
3. Atualizar a configuração da aplicação para usar o novo provedor.