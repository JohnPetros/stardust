# REST Layer - API Communication

The REST layer is responsible for handling all API communication, both on the server-side and the client-side. It follows the **Dependency Inversion Principle**, where the `core` package defines the service interfaces, and the `rest` layer provides the concrete implementations.

## Structure

The `rest` layer is present in both the `server` and `web` applications, with a clear separation of concerns.

### Server-side (`apps/server/src/rest`)

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

- **`controllers`**: Handle incoming HTTP requests, call the appropriate services, and return the response. They are organized by domain.
- **`services`**: Concrete implementations of services that interact with external APIs (e.g., Discord, Supabase). They use `axios` to make HTTP requests.

### Client-side (`apps/web/src/rest`)

```
src/rest/
├── controllers/
├── next/
│   └── NextServerRestClient.ts
└── services/
    ├── AuthService.ts
    └── ...
```

- **`services`**: Implementations of the `core` service interfaces. They use a `RestClient` (in this case, `NextServerRestClient`) to make requests to the backend server.
- **`controllers`**: Handle client-side requests from the UI layer and call the services.
- **`next`**: Contains the `Next.js` specific implementation of the `RestClient`.

## Server-side REST Layer

The server-side REST layer is responsible for exposing the application's functionality to the outside world through a REST API.

### Controllers

Controllers are the entry point for all incoming requests. They are responsible for:
1.  Parsing the request.
2.  Calling the appropriate service.
3.  Returning a response.

Controllers are implemented as classes that implement the `Controller` interface from the `core` package.

**Example: `SignInController.ts`**
```typescript
export class SignInController implements Controller<Schema> {
  constructor(private readonly service: AuthService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { email, password } = await http.getBody()
    return await this.service.signIn(Email.create(email), Password.create(password))
  }
}
```

### Services

Services contain the business logic that is specific to the server-side. They interact with external services and databases.

**Example: `SupabaseAuthService.ts`**
This service would implement the `AuthService` interface from the `core` package and use the Supabase client to interact with the Supabase authentication service.

## Client-side REST Layer (Web App)

The client-side REST layer is responsible for communicating with the backend server's REST API.

### Services

Services on the client-side are factory functions that take a `RestClient` as a dependency and return an implementation of a `core` service interface.

**Example: `AuthService.ts`**
```typescript
export const AuthService = (restClient: RestClient): IAuthService => {
  return {
    async signIn(email: Email, password: Password) {
      return await restClient.post('/auth/sign-in', {
        email: email.value,
        password: password.value,
      })
    },
    // ... other methods
  }
}
```

### RestClient

The `RestClient` is an interface from the `core` package that defines the contract for making HTTP requests. The `web` app provides a concrete implementation of this interface called `NextServerRestClient`, which is adapted for Next.js.

## Communication Flow

1.  The **UI layer** calls a method on a service from the `rest` layer (e.g., `AuthService.signIn()`).
2.  The client-side **service** uses the `RestClient` (`NextServerRestClient`) to make an HTTP request to the backend server.
3.  The backend server's **controller** receives the request.
4.  The controller calls the appropriate server-side **service**.
5.  The server-side service interacts with databases or external APIs.
6.  The response is returned back through the same chain to the UI layer.