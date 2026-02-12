# Camada RPC (Remote Procedure Call)

A camada RPC é responsável por abstrair a comunicação entre as rotas da API e os serviços de domínio, implementando o padrão de **Factory Functions** para criar actions reutilizáveis e testáveis.

## Conceitos Principais

### 1. Interface Call

A interface `Call<Request>` define o contrato para comunicação entre actions e rotas:

```typescript
interface Call<Request = void> {
  getFormData(): Promise<Request>
  redirect(route: string): void
}
```

### 2. Actions (Factory Functions)

As actions são implementadas como **Factory Functions** que recebem dependências e retornam objetos com métodos executáveis:

```typescript
export const CreateUserAction = (service: MembershipService) => {
  return {
    async execute(call: Call<Request>) {
      const userDto = await call.getFormData()
      const response = await service.createUser(userDto)
      if (response.isFailure) response.throwError()
      return call.redirect(ROUTES.users)
    },
  }
}
```

### 3. Padrão de Execução

Todas as actions seguem o mesmo padrão:

1. **Recebem dependências** via parâmetros da factory function
2. **Retornam um objeto** com método `execute`
3. **Processam dados** via `call.getFormData()`
4. **Executam operação** no serviço de domínio
5. **Tratam erros** verificando `response.isFailure`
6. **Redirecionam** via `call.redirect()`

## Vantagens da Arquitetura

### 1. **Inversão de Dependência**
- Actions recebem dependências como parâmetros
- Facilita testes unitários com mocks
- Desacopla actions de implementações específicas

### 2. **Reutilização**
- Actions podem ser usadas em diferentes contextos
- Mesma action funciona em diferentes frameworks (Remix, Express, etc.)
- Lógica de negócio centralizada

### 3. **Testabilidade**
- Fácil criação de mocks para dependências
- Testes isolados sem dependências externas
- Validação independente de frameworks

### 4. **Consistência**
- Padrão uniforme para todas as actions
- Tratamento de erro padronizado
- Estrutura previsível e manutenível

## Uso nas Rotas

```typescript
export const action = async (args: RouteArgs) => {
  const call = RemixCall<UserDto>(args, userSchema)
  const { membershipService } = args.context.get(restContext)
  const action = CreateUserAction(membershipService)
  return action.execute(call)
}
```

## Implementações de Call

### RemixCall
- Adapta a interface `Call` para o Remix
- Integra com `@conform-to/zod` para validação
- Suporta redirecionamentos do React Router

## Organização por Domínio

Actions são organizadas em pastas por domínio (ex: `membership/`) com:

- **Arquivos individuais** para cada action
- **Barrel file** (`index.ts`) para exportações centralizadas
- **Nomenclatura consistente** seguindo padrões do projeto

## Boas Práticas

1. **Sempre use Factory Functions** para actions
2. **Injete dependências** via parâmetros
3. **Mantenha actions focadas** em uma única responsabilidade
4. **Use barrel files** para exportações organizadas
5. **Siga convenções de nomenclatura** do projeto
6. **Trate erros** de forma consistente
7. **Documente tipos** de Request adequadamente# Camada RPC (Remote Procedure Call)

A camada RPC é responsável por abstrair a comunicação entre as rotas da API e os serviços de domínio, implementando o padrão de **Factory Functions** para criar actions reutilizáveis e testáveis.

## Estrutura

```
src/rpc/
├── actions/           # Actions organizadas por domínio
│   └── membership/    # Actions relacionadas a usuários
│       ├── create-user-action.ts
│       ├── update-user-action.ts
│       ├── activate-user-action.ts
│       ├── deactivate-user-action.ts
│       └── index.ts   # Barrel file para exportações
└── remix/            # Implementações específicas do Remix
    └── remix-call.ts # Adaptador para Remix
```

## Conceitos Principais

### 1. Interface Call

A interface `Call<Request>` define o contrato para comunicação entre actions e rotas:

```typescript
interface Call<Request = void> {
  getFormData(): Promise<Request>
  redirect(route: string): void
}
```

### 2. Actions (Factory Functions)

As actions são implementadas como **Factory Functions** que recebem dependências e retornam objetos com métodos executáveis:

```typescript
export const CreateUserAction = (service: MembershipService) => {
  return {
    async execute(call: Call<Request>) {
      const userDto = await call.getFormData()
      const response = await service.createUser(userDto)
      if (response.isFailure) response.throwError()
      return call.redirect(ROUTES.users)
    },
  }
}
```

### 3. Padrão de Execução

Todas as actions seguem o mesmo padrão:

1. **Recebem dependências** via parâmetros da factory function
2. **Retornam um objeto** com método `execute`
3. **Processam dados** via `call.getFormData()`
4. **Executam operação** no serviço de domínio
5. **Tratam erros** verificando `response.isFailure`
6. **Redirecionam** via `call.redirect()`

## Vantagens da Arquitetura

### 1. **Inversão de Dependência**
- Actions recebem dependências como parâmetros
- Facilita testes unitários com mocks
- Desacopla actions de implementações específicas

### 2. **Reutilização**
- Actions podem ser usadas em diferentes contextos
- Mesma action funciona em diferentes frameworks (Remix, Express, etc.)
- Lógica de negócio centralizada

### 3. **Testabilidade**
- Fácil criação de mocks para dependências
- Testes isolados sem dependências externas
- Validação independente de frameworks

### 4. **Consistência**
- Padrão uniforme para todas as actions
- Tratamento de erro padronizado
- Estrutura previsível e manutenível

## Uso nas Rotas

```typescript
export const action = async (args: RouteArgs) => {
  const call = RemixCall<UserDto>(args, userSchema)
  const { membershipService } = args.context.get(restContext)
  const action = CreateUserAction(membershipService)
  return action.execute(call)
}
```

## Implementações de Call

### RemixCall
- Adapta a interface `Call` para o Remix
- Integra com `@conform-to/zod` para validação
- Suporta redirecionamentos do React Router

## Organização por Domínio

Actions são organizadas em pastas por domínio (ex: `membership/`) com:

- **Arquivos individuais** para cada action
- **Barrel file** (`index.ts`) para exportações centralizadas
- **Nomenclatura consistente** seguindo padrões do projeto

## Boas Práticas

1. **Sempre use Factory Functions** para actions
2. **Injete dependências** via parâmetros
3. **Mantenha actions focadas** em uma única responsabilidade
4. **Use barrel files** para exportações organizadas
5. **Siga convenções de nomenclatura** do projeto
6. **Trate erros** de forma consistente
7. **Documente tipos** de Request adequadamente

## Tooling

- Typecheck:
  - Web (actions/Next Safe Action): `npm run typecheck -w @stardust/web`.
  - Studio (rotas tipadas): `npm run typecheck -w @stardust/studio` (inclui `react-router typegen`).
- Qualidade: `npm run lint -w @stardust/web` / `npm run lint -w @stardust/studio`.
- Testes: `npm run test -w @stardust/web` / `npm run test -w @stardust/studio`.
- Referencia geral: `documentation/tooling.md`.
