# Camada de Banco de Dados - Persistência de Dados

A camada de banco de dados é responsável por toda a comunicação com o banco de dados. Ela usa o **Supabase** como provedor de banco de dados e segue o **Padrão de Repositório** para desacoplar a aplicação da implementação do banco de dados. Este é outro exemplo do **Princípio da Inversão de Dependência** em ação.

## Estrutura

A camada de banco de dados está localizada no diretório `./apps/server/src/database`.

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

- **`repositories`**: Contém as implementações concretas das interfaces de repositório definidas no pacote `core`.
- **`mappers`**: Responsável por mapear os dados do banco de dados (Supabase) para as entidades de domínio definidas no pacote `core`, e vice-versa.
- **`migrations`**: Contém os scripts de migração do banco de dados.
- **`errors`**: Contém classes de erro customizadas relacionadas a operações de banco de dados.
- **`types`**: Contém tipos específicos do Supabase.
- **`config.toml`**: O arquivo de configuração para o Supabase.

## Repositórios

Os repositórios são o núcleo da camada de banco de dados. Eles são responsáveis por todas as consultas e mutações no banco de dados. Eles implementam as interfaces de repositório definidas no pacote `core`, o que permite que o resto da aplicação seja completamente ignorante sobre a implementação do banco de dados.

Os repositórios são organizados por domínio, assim como as outras camadas da aplicação.

**Exemplo: `SupabaseStarsRepository.ts`**

Este repositório implementa a interface `StarsRepository` do pacote `core` e usa o cliente Supabase para interagir com a tabela `stars` no banco de dados.

```typescript
import type { StarsRepository } from "@stardust/core/space/interfaces";
import type { Id, Slug } from "@stardust/core/global/structures";
import type { Star } from "@stardust/core/space/entities";

import { SupabaseRepository } from "../SupabaseRepository";
import { SupabaseStarMapper } from "../../mappers/space";

export class SupabaseStarsRepository extends SupabaseRepository
  implements StarsRepository {
  async findById(starId: Id): Promise<Star | null> {
    const { data, error } = await this.supabase
      .from("stars")
      .select("id, name, number, slug")
      .eq("id", starId.value)
      .single();

    if (error) {
      return null;
    }

    return SupabaseStarMapper.toEntity(data);
  }

  // ... outros métodos
}
```

## Mappers

Mappers são responsáveis por converter os dados entre o formato do banco de dados e as entidades de domínio. Esta é uma parte crucial da camada de banco de dados, pois garante que a camada de domínio não seja poluída com detalhes específicos do banco de dados.

No exemplo acima, `SupabaseStarMapper.toEntity(data)` é usado para converter os dados do cliente Supabase para uma entidade `Star`.

## Migrações

O diretório `migrations` contém os scripts SQL que são usados para gerenciar o esquema do banco de dados. Esses scripts são executados pela CLI do Supabase para aplicar alterações ao banco de dados.