# Regras da Camada Provision

## Visao Geral

A camada **Provision** encapsula SDKs e servicos externos como `providers` (gateways) que implementam **interfaces do core**, mantendo o dominio desacoplado de terceiros.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Adaptar infraestrutura externa (SDKs/servicos) para contratos do core. |
| **Responsabilidades** | Implementar `providers`; mapear erros para `AppError`; centralizar configuracao via `ENV`/`fromEnv` sem vazar segredos. |
| **Nao faz** | Regra de negocio; expor tipos/clients do SDK; decidir politicas de dominio. |

## Estrutura de Diretorios

Diretorio base: `apps/server/src/provision`.

| Pasta | Finalidade | Exemplo |
| --- | --- | --- |
| `cache/` | Implementa `CacheProvider` (core) sem expor Redis/Upstash. | `apps/server/src/provision/cache/UpstashCacheProvider.ts` |
| `storage/` | Implementa `StorageProvider` (core) sem expor bucket/SDK. | `apps/server/src/provision/storage/SupabaseStorageProvider.ts` |
| `monitor/` | Implementa `TelemetryProvider` (core). | `apps/server/src/provision/monitor/SentryTelemetryProvider.ts` |
| `database/` | Implementa `DatabaseProvider` (core) para operacoes auxiliares (ex: backup). | `apps/server/src/provision/database/SupabaseDatabaseProvider.ts` |

## Regras

- **Implementacao**: `provider` deve apenas adaptar o SDK externo para a interface do core.
- **Error mapping**: capturar erros do SDK e relancar como `AppError` (ou erro equivalente do dominio) para evitar vazamento de detalhes.
- **Tipos**: nao retornar tipos do SDK; mapear para tipos do core/dominio.
- **Configuracao**: ler variaveis de ambiente (ex: `ENV`) sem registrar/propagar segredos.

> ⚠️ Sinal de alerta: qualquer `import`/retorno de tipos do SDK fora do `provider` indica vazamento de infraestrutura.

## Organizacao e Nomeacao

- `provider`: `<Vendor><Capability>Provider` (ex: `UpstashCacheProvider`).
- `client` do SDK: detalhe interno do `provider` (nao expor por propriedade publica).

## Integracao com Outras Camadas

- **Permitido**: depender de SDKs de terceiros; depender de interfaces/erros do core.
- **Proibido**: o core importar `apps/server/src/provision/**`.
- **Direcao de dependencia**: apps/adapters implementam providers; o core consome por interface.

## Checklist (antes do PR)

- Interface do core existe para o provider.
- Provider implementa a interface e nao expoe SDK.
- Erros externos sao convertidos para `AppError`.
- Segredos ficam em variaveis de ambiente (sem credenciais em codigo).

## Notas

- A camada Provision atual vive em `apps/server/src/provision`.
