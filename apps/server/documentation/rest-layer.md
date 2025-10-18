# Camada REST - Comunicação com a API

A camada REST é responsável por lidar com toda a comunicação da API, tanto no lado do servidor quanto no lado do cliente. Ela segue o **Princípio da Inversão de Dependência**, onde o pacote `core` define as interfaces de serviço, e a camada `rest` fornece as implementações concretas.

## Estrutura

A camada `rest` está presente tanto nas aplicações `server` quanto `web`, com uma clara separação de responsabilidades.

### Lado do Servidor (`apps/server/src/rest`)

```
src/rest/
├── axios/
├── controllers/
│   └── auth/
│       └── SignInController.ts
└── services/
    ├── DiscordNotificationService.ts
    └── SupabaseAuthService.ts
```

- **`controllers`**: Lidam com as requisições HTTP de entrada, chamam os serviços apropriados e retornam a resposta. Eles são organizados por domínio.
- **`services`**: Implementações concretas de serviços que interagem com APIs externas (e.g., Discord, Supabase). Eles usam `axios` para fazer requisições HTTP.

### Lado do Cliente (`apps/web/src/rest`)

```
src/rest/
├── controllers/
├── next/
│   └── NextServerRestClient.ts
└── services/
    ├── AuthService.ts
    └── ...
```

- **`services`**: Implementações das interfaces de serviço do `core`. Eles usam um `RestClient` (neste caso, `NextServerRestClient`) para fazer requisições ao servidor backend.
- **`controllers`**: Lidam com as requisições do lado do cliente da camada de UI e chamam os serviços.
- **`next`**: Contém a implementação específica do `Next.js` do `RestClient`.

## Camada REST do Lado do Servidor

A camada REST do lado do servidor é responsável por expor a funcionalidade da aplicação para o mundo exterior através de uma API REST.

### Controladores

Os controladores são o ponto de entrada para todas as requisições de entrada. Eles são responsáveis por:
1.  Analisar a requisição.
2.  Chamar o serviço apropriado.
3.  Retornar uma resposta.

Os controladores são implementados como classes que implementam a interface `Controller` do pacote `core`.

**Exemplo: `SignInController.ts`**
```typescript
export class SignInController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password } = await http.getBody()
    return await this.service.signIn(Email.create(email), Password.create(password))
  }
}
```

### Serviços

Os serviços contêm a lógica de negócios que é específica do lado do servidor. Eles interagem com serviços externos e bancos de dados.

**Exemplo: `SupabaseAuthService.ts`**
Este serviço implementaria a interface `AuthService` do pacote `core` e usaria o cliente Supabase para interagir com o serviço de autenticação do Supabase.

## Camada REST do Lado do Cliente (Aplicação Web)

A camada REST do lado do cliente é responsável pela comunicação com a API REST do servidor backend.

### Serviços

Os serviços no lado do cliente são factory functions que recebem um `RestClient` como dependência e retornam uma implementação de uma interface de serviço do `core`.

**Exemplo: `AuthService.ts`**
```typescript
export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async signIn(email: Email, password: Password) {
      return await restClient.post('/auth/sign-in', {
        email: email.value,
        password: password.value,
      })
    },
    // ... outros métodos
  }
}
```

### RestClient

O `RestClient` é uma interface do pacote `core` que define o contrato para fazer requisições HTTP. A aplicação `web` fornece uma implementação concreta desta interface chamada `NextServerRestClient`, que é adaptada para o Next.js.

## Fluxo de Comunicação

1.  A **camada de UI** chama um método em um serviço da camada `rest` (e.g., `AuthService.signIn()`).
2.  O **serviço** do lado do cliente usa o `RestClient` (`NextServerRestClient`) para fazer uma requisição HTTP para o servidor backend.
3.  O **controlador** do servidor backend recebe a requisição.
4.  O controlador chama o **serviço** apropriado do lado do servidor.
5.  O serviço do lado do servidor interage com bancos de dados ou APIs externas.
6.  A resposta é retornada pela mesma cadeia para a camada de UI.