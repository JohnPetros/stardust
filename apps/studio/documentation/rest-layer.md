# Camada REST - Comunicação com a API (Aplicação Studio)

A camada REST na aplicação Studio é responsável pela comunicação com a API REST do servidor backend. Ela segue o **Princípio da Inversão de Dependência**, onde o pacote `core` define as interfaces de serviço, e esta camada fornece as implementações concretas.

## Estrutura

```
src/rest/
├── axios/
│   └── AxiosRestClient.ts
└── services/
    ├── AuthService.ts
    └── ...
```

- **`services`**: Implementações das interfaces de serviço do `core`. Eles usam um `RestClient` para fazer requisições ao servidor backend.
- **`axios`**: Contém a implementação específica do `axios` do `RestClient`.

## Serviços

Os serviços são factory functions que recebem um `RestClient` como dependência e retornam uma implementação de uma interface de serviço do `core`.

**Exemplo: `AuthService.ts`**

```typescript
export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async signIn(email: Email, password: Password) {
      return await restClient.post("/auth/sign-in", {
        email: email.value,
        password: password.value,
      });
    },
    // ... outros métodos
  };
};
```

## RestClient

O `RestClient` é uma interface do pacote `core` que define o contrato para fazer requisições HTTP. A aplicação `studio` fornece uma implementação concreta desta interface chamada `AxiosRestClient`, que é baseada na biblioteca `axios`.

## Fluxo de Comunicação

1. A **camada de UI** chama um método em um serviço da camada `rest` (e.g., `AuthService.signIn()`).
2. O **serviço** usa o `RestClient` (`AxiosRestClient`) para fazer uma requisição HTTP para o servidor backend.
3. O servidor backend processa a requisição e retorna uma resposta.
4. A resposta é retornada pela mesma cadeia para a camada de UI.