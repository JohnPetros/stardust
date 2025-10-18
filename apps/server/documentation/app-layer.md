# Camada de Aplicação - Hono Web Framework

A camada de aplicação é o ponto de entrada da aplicação do servidor. Ela é construída com o framework web **Hono** e é responsável por lidar com as requisições HTTP de entrada, roteá-las para os controladores apropriados e retornar as respostas.

## Estrutura

A camada de aplicação está localizada no diretório `./apps/server/src/app`.

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

- **`hono/`**: Contém toda a implementação específica do Hono.
- **`routers/`**: Contém as definições de rota para a aplicação, organizadas por domínio.
- **`middlewares/`**: Contém middlewares customizados para a aplicação Hono.
- **`HonoApp.ts`**: A instância principal da aplicação Hono.
- **`HonoHttp.ts`**: Um adaptador para lidar com requisições e respostas HTTP com o Hono.
- **`HonoRouter.ts`**: Uma classe base customizada para os roteadores.
- **`HonoServer.ts`**: O servidor que executa a aplicação Hono.
- **`index.ts`**: O ponto de entrada da camada de aplicação.

## Roteadores

Os roteadores são responsáveis por definir as rotas da aplicação e conectá-las aos controladores da camada `rest`. Eles são organizados por domínio, e cada roteador é uma classe que estende `HonoRouter`.

**Exemplo: `AuthRouter.ts`**

Este roteador define todas as rotas relacionadas à autenticação. Ele usa middlewares para validação e autenticação, e então chama o controlador apropriado para lidar com a requisição.

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
    // ... outras rotas
    return this.router;
  }
}
```

## Middlewares

Os middlewares são usados para interceptar e processar requisições antes que elas cheguem ao manipulador de rota. Isso é útil para tarefas como:

- **Autenticação**: Verificar se o usuário está autenticado.
- **Validação**: Validar o corpo, parâmetros ou query da requisição.
- **Logging**: Registrar informações sobre a requisição.

## Servidor

O arquivo `HonoServer.ts` é responsável por criar e executar o servidor Hono. Ele importa todos os roteadores e os registra com a instância principal da aplicação Hono.