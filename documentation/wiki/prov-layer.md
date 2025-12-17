---
alwaysApply: false
---
# Camada de Provision (prov)

A camada `prov` (Provision) é responsável por prover recursos que dependem de serviços externos, bibliotecas de terceiros ou funcionalidades de infraestrutura que não se encaixam estritamente como banco de dados ou chamadas HTTP/REST de APIs de negócio.

Exemplos comuns incluem: armazenamento de arquivos (Storage), serviços de e-mail, processamento de pagamentos, ferramentas de monitoramento, etc.

## Estrutura de Arquivos

```
src/provision/
├── storage/              # Provedores de armazenamento
│   ├── SupabaseStorageProvider.ts
│   ├── GoogleDriveStorageProvider.ts
│   └── index.ts
├── monitor/              # Provedores de monitoramento/logs
│   └── ...
├── email/                # Provedores de e-mail (exemplo)
└── index.ts
```

## Componentes Principais

### **Provider (Gateway)**

Um `Provider` é um `gateway` que encapsula a interação com uma ferramenta externa. Ele implementa uma interface definida no `core`, garantindo que o domínio não dependa da ferramenta específica.

**Características:**
- Implementa uma interface do `core` (ex: `StorageProvider`).
- Encapsula clientes de SDKs externos (ex: Supabase Client, AWS SDK, Stripe).
- Converte erros da biblioteca externa em erros de domínio (`AppError`).
- Mapeia tipos externos para tipos de domínio.

**Exemplo de Implementação (Storage):**

```typescript
import { createClient } from '@supabase/supabase-js'
import { AppError } from '@stardust/core/global/errors'
import type { StorageProvider } from '@stardust/core/storage/interfaces'

export class SupabaseStorageProvider implements StorageProvider {
  private readonly supabase

  constructor() {
    this.supabase = createClient(ENV.supabaseUrl, ENV.supabaseKey)
  }

  async upload(folder: StorageFolder, file: File): Promise<File> {
    const { data, error } = await this.supabase.storage
      .from('bucket-name')
      .upload(`${folder.name}/${file.name}`, file)

    if (error) {
      this.handleError(error) // Converte e lança erro tratável
    }

    return file
  }

  private handleError(error: Error): never {
    console.error('Provider Error:', error)
    throw new AppError(error.message, 'ProviderError')
  }
}
```

## Padrões e Convenções

1. **Gateways Puros**: Providers não devem conter regras de negócio, apenas lógica de adaptação e comunicação com a ferramenta externa.
2. **Tratamento de Erros**: Sempre capture erros da biblioteca externa e relance como erros da aplicação (ex: `AppError`) para evitar vazamento de detalhes de implementação.
3. **Interfaces do Core**: Sempre implemente uma interface definida no `core`. O `core` define "O que eu preciso" (ex: salvar arquivo), e o `prov` define "Como eu faço" (ex: usar Supabase S3).
4. **Variáveis de Ambiente**: Configure clientes externos utilizando constantes de ambiente (`ENV`).
