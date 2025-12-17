---
alwaysApply: false
---
# Camada de Banco de Dados (db)

A camada `db` cuida da persistência de dados da aplicação. Ela é composta exclusivamente por Gateways, chamados de **Repositories**, que isolam o domínio dos detalhes de implementação do banco de dados (SQL, NoSQL, ORMs, etc.).

## Estrutura de Arquivos

```
src/database/
├── supabase/               # Implementação específica (ex: Supabase/Postgres)
│   ├── repositories/       # Repositórios organizados por domínio
│   │   ├── profile/
│   │   │   ├── SupabaseUsersRepository.ts
│   │   │   └── ...
│   │   └── ...
│   ├── mappers/            # Mappers para converter entre DB e Entidades
│   │   ├── profile/
│   │   │   ├── SupabaseUserMapper.ts
│   │   │   └── ...
│   └── types/              # Tipos específicos do banco de dados
└── index.ts
```

## Componentes Principais

### **Repository (Gateway)**

O Repository é responsável por salvar, buscar, atualizar e deletar dados de entidades.

**Características:**
- Implementa interfaces de repositório definidas no `core` (ex: `UsersRepository`).
- Estende uma classe base (ex: `SupabaseRepository`) que fornece acesso ao cliente do banco e métodos utilitários.
- Utiliza **Mappers** para converter dados brutos do banco (linhas/documentos) em Entidades de Domínio e vice-versa.
- Lida com erros específicos do banco e os converte, se necessário.

**Exemplo de Implementação:**

```typescript
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseUserMapper } from '../../mappers/profile'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

export class SupabaseUsersRepository extends SupabaseRepository implements UsersRepository {
  
  async findById(userId: Id): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId.value)
      .single()

    if (error) {
       // Tratamento de erro ou retorno null
       return this.handleQueryPostgresError(error)
    }

    // Conversão de DB Type -> Entity
    return SupabaseUserMapper.toEntity(data)
  }

  async add(user: User): Promise<void> {
    // Conversão de Entity -> DB Type
    const supabaseUser = SupabaseUserMapper.toSupabase(user)

    const { error } = await this.supabase
      .from('users')
      .insert(supabaseUser)

    if (error) throw new SupabasePostgreError(error)
  }
}
```

### **Mapper**

Objetos ou classes responsáveis por traduzir dados entre o formato do banco de dados e as Entidades do Domínio. Isso garante que o Domínio não conheça a estrutura das tabelas.

- `toEntity`: DB Data -> Domain Entity
- `toSupabase` (ou `toPersistence`): Domain Entity -> DB Data

## Padrões e Convenções

1. **Separação de Modelos**: Nunca vaze tipos do banco de dados (ex: tipos gerados pelo ORM) para fora da camada `db`. Sempre retorne Entidades ou Primitivos.
2. **Mappers**: Use mappers explícitos. Não faça casting direto se houver diferença de estrutura ou regras de validação nas entidades.
3. **Tratamento de Strings/IDs**: As entidades usam Value Objects (ex: `Id`, `Email`, `Name`). O repositório deve desembrulhar esses valores (`.value`) para salvar e recriá-los (`Id.create(...)`) ao ler.
4. **Classe Base**: Utilize a classe base (`SupabaseRepository`) para compartilhar a instância do cliente e tratamento de erros comum.
