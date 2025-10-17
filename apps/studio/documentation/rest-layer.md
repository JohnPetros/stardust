# REST Layer - API Communication (Studio App)

The REST layer in the Studio application is responsible for communicating with
the backend server's REST API. It follows the **Dependency Inversion
Principle**, where the `core` package defines the service interfaces, and this
layer provides the concrete implementations.

## Structure

```
src/rest/
├── axios/
│   └── AxiosRestClient.ts
└── services/
    ├── AuthService.ts
    └── ...
```

- **`services`**: Implementations of the `core` service interfaces. They use a
  `RestClient` to make requests to the backend server.
- **`axios`**: Contains the `axios` specific implementation of the `RestClient`.

## Services

Services are factory functions that take a `RestClient` as a dependency and
return an implementation of a `core` service interface.

**Example: `AuthService.ts`**

```typescript
export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async signIn(email: Email, password: Password) {
      return await restClient.post("/auth/sign-in", {
        email: email.value,
        password: password.value,
      });
    },
    // ... other methods
  };
};
```

## RestClient

The `RestClient` is an interface from the `core` package that defines the
contract for making HTTP requests. The `studio` app provides a concrete
implementation of this interface called `AxiosRestClient`, which is based on the
`axios` library.

## Communication Flow

1. The **UI layer** calls a method on a service from the `rest` layer (e.g.,
   `AuthService.signIn()`).
2. The **service** uses the `RestClient` (`AxiosRestClient`) to make an HTTP
   request to the backend server.
3. The backend server processes the request and returns a response.
4. The response is returned back through the same chain to the UI layer.
