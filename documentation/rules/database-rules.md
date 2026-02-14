---
alwaysApply: false
---
# Regras da Camada Database (db)

## Visao Geral

A camada **Database (db)** implementa persistencia no server atraves de `repositories` (gateways) que isolam o dominio dos detalhes do banco.

| Item | Definicao |
| --- | --- |
| **Objetivo** | Persistir/consultar dados sem vazar detalhes de Supabase/PostgreSQL para o core. |
| **Responsabilidades** | Implementar `repositories` do core; manter `mappers` DB <-> dominio; encapsular erros do banco. |
| **Nao faz** | Regra de negocio; retornar tipos gerados do banco para fora da camada. |

## Estrutura de Diretorios

| Caminho | Finalidade |
| --- | --- |
| `apps/server/src/database/` | Raiz da camada. |
| `apps/server/src/database/supabase/` | Integracao Supabase/PostgreSQL. |
| `apps/server/src/database/supabase/repositories/` | Implementacoes concretas (ex: `apps/server/src/database/supabase/repositories/SupabaseRepository.ts`). |
| `apps/server/src/database/supabase/types/Database.ts` | Tipos gerados do banco (nao devem vazar). |
| `apps/server/supabase/migrations` | Migracoes. |
| `apps/server/supabase/schemas/schema.sql` | Schema SQL. |

## Regras

- **Contracts first**: `repository` implementa interfaces definidas no core.
- **Mappers explicitos**
  - Ao ler: DB shape -> entidade/estrutura do dominio.
  - Ao escrever: entidade/estrutura -> DB shape.
- **Erros**: encapsular/converter erros do Postgres/Supabase quando necessario.

> ⚠️ Proibido: retornar tipos gerados (ex: `Database.ts`) fora de `apps/server/src/database/**`.

## Organizacao e Nomeacao

- Repositories: `Supabase<Entidade>Repository` quando a implementacao for especifica.
- Mappers: metodos como `toEntity` e `toSupabase` (ou `toPersistence`).

## Exemplo

```ts
// Exemplo ilustrativo (nomes concretos variam por dominio)
export class SupabaseUsersRepository /* extends SupabaseRepository */ {
  async findById(userId) {
    // query no supabase
    // mapper: toEntity
    return null
  }
}
```

## Integracao com Outras Camadas

- **Permitido**: depender do client do Supabase e tipos gerados; depender de entidades/estruturas e interfaces do core.
- **Proibido**: o core importar `apps/server/src/database/**`.
- **Contrato**: interfaces de repository no core.
- **Direcao**: controllers/jobs/tools instanciam repositories e injetam em use-cases.

## Checklist (antes do PR)

- Interface de repository no core existe.
- Repository retorna dominio (nao tipos do banco).
- Mapper cobre leitura e escrita.
- Erros de banco sao tratados/convertidos.

## Notas

- O server usa Supabase como integracao principal.
- Tooling: `documentation/tooling.md`.
