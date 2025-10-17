# App Layer - Hono Web Framework

The app layer is the entry point of the server application. It is built with the
**Hono** web framework and is responsible for handling incoming HTTP requests,
routing them to the appropriate controllers, and returning responses.

## Structure

The app layer is located in the `./apps/server/src/app` directory.

```
src/app/
├── hono/
│   ├── middlewares/
│   ├── routers/
│   │   └── auth/
│   │       └── AuthRouter.ts
│   ├── types/
│   ├── HonoApp.ts
│   ├── HonoHttp.ts
│   ├── HonoRouter.ts
│   └── HonoServer.ts
└── index.ts
```

- **`hono/`**: Contains all the Hono-specific implementation.
- **`routers/`**: Contains the route definitions for the application, organized
  by domain.
- **`middlewares/`**: Contains custom middlewares for the Hono application.
- **`HonoApp.ts`**: The main Hono application instance.
- **`HonoHttp.ts`**: An adapter to handle HTTP requests and responses with Hono.
- **`HonoRouter.ts`**: A custom base class for routers.
- **`HonoServer.ts`**: The server that runs the Hono application.
- **`index.ts`**: The entry point of the app layer.

## Routers

Routers are responsible for defining the application's routes and connecting
them to the controllers from the `rest` layer. They are organized by domain, and
each router is a class that extends `HonoRouter`.

**Example: `AuthRouter.ts`**

This router defines all the routes related to authentication. It uses
middlewares for validation and authentication, and then calls the appropriate
controller to handle the request.

```typescript
export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath(ROUTE_PREFIX);
  private readonly authMiddleware = new AuthMiddleware();
  private readonly validationMiddleware = new ValidationMiddleware();

  private registerSignInRoute(): void {
    this.router.post(
      AuthRouter.ROUTES.signIn,
      this.validationMiddleware.validate(
        "json",
        z.object({
          email: emailSchema,
          password: passwordSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context);
        const service = new SupabaseAuthService(http.getSupabase());
        const controller = new SignInController(service);
        const response = await controller.handle(http);
        return http.sendResponse(response);
      },
    );
  }

  registerRoutes(): Hono {
    this.registerSignInRoute();
    // ... other routes
    return this.router;
  }
}
```

## Middlewares

Middlewares are used to intercept and process requests before they reach the
route handler. This is useful for tasks like:

- **Authentication**: Verifying that the user is authenticated.
- **Validation**: Validating the request body, params, or query.
- **Logging**: Logging information about the request.

## Server

The `HonoServer.ts` file is responsible for creating and running the Hono
server. It imports all the routers and registers them with the main Hono
application instance.
