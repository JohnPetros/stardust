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

## Transição aprovada: Drizzle e SSE (Issue #602)

As convenções Supabase acima descrevem o adapter legado. Para a entrega da Issue #602, prevalecem as seguintes convenções aprovadas; elas não autorizam alterar contratos de domínio:

- Implementações em `apps/server/src/database/drizzle/`, chamadas `Drizzle<Entidade>Repository`; schemas e tipos SQL ficam nessa camada. Os novos paths constam como Create no mapa da Spec.
- Organização adaptada de Scoops para StarDust: models/<domínio> declara constantes pgTable/pgEnum em arquivos kebab-case; types/entities/<domínio> deriva rows/inserts desses models; mappers/<domínio> e repositories/<domínio> preservam classes/ports. schema.ts apenas agrega os models; DrizzleRepository fica na raiz do adapter. Classes/tipos seguem PascalCase. SQL identifiers e fronteiras Core permanecem intactos.
- Constructor recebe conexão Drizzle e contexto de acesso explícito, composto pelo Server. Não derive identidade do payload, de JWT apenas decodificado ou da conexão privilegiada; não use contexto system como fallback.
- Interfaces de repository existentes no Core permanecem intactas, com os mesmos métodos, entradas e retornos. Mappers explícitos traduzem rows/projeções para domínio e usam `toEntity`/`toPersistence`; nenhum row, query builder ou transaction client atravessa para o Core.
- Ownership é aplicado nas consultas privadas usando a identidade verificada. God Account é verificado antes da composição administrativa. Jobs recebem system explicitamente. Filtros de autorização não substituem regras de negócio dos use cases.
- Bootstrap de API key preserva AuthenticateApiKeyUseCase: contexto public admite apenas findByHash com hash produzido pelo provider, internamente à borda de autenticação; não concede listagem/escrita de chaves ou acesso a repositories privados. Chave inválida/revogada falha antes da composição de negócio, e não há fallback system.
- Replacements de relações e persistência de um agregado usam transação local; SQL é parametrizado. Efeitos externos não entram na transação. Erros SQL são convertidos para os erros públicos existentes sem revelar SQL ou credenciais.
- Migrations versionadas em `apps/server/src/database/drizzle/migrations/` representam o schema final legado, incluindo constraints, índices, FKs, defaults, views, funções e triggers necessários. Drizzle Kit gera artefatos de schema; SQL de objetos não representáveis e segurança é versionado em migrations customizadas. Não edite manualmente snapshots/SQL classificados como Generate.
- Dev/produção adotam a baseline apenas após preflight de catálogo e histórico; não há reset remoto nem backfill implícito. Remoção de RLS exige revogar acesso direto, inclusive funções SECURITY DEFINER e grants de PUBLIC/default privileges; Auth, storage de infraestrutura e cron não são redesenhados.
- Um pool por processo, fechamento no shutdown e migrations no pipeline. Validação por testes reais de rota e scripts; não criar testes dedicados de repositories, mappers, tipos ou fixtures.
