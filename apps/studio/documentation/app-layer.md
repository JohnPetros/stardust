# Camada de Aplicação - React Router e Ponto de Entrada da Aplicação

A camada de aplicação é o ponto de entrada da aplicação Studio. Ela é construída com
**React** e usa o **React Router** para navegação. É responsável por
configurar a estrutura raiz da aplicação, o roteamento e os provedores de contexto
globais.

## Estrutura

A camada de aplicação está localizada no diretório `./apps/studio/src/app`.

```
src/app/
├── contexts/
├── layouts/
├── middlewares/
├── routes/
│   └── SignInRoute.tsx
├── root.tsx
└── routes.ts
```

- **`routes.ts`**: Define as rotas da aplicação usando
  `@react-router/dev/routes`.
- **`routes/`**: Contém os componentes para cada rota (por exemplo,
  `SignInRoute.tsx`).
- **`layouts/`**: Contém os componentes de layout para a aplicação (por exemplo,
  `AppLayout.tsx`).
- **`root.tsx`**: O ponto de entrada principal da aplicação, onde o roteador é
  configurado e o layout raiz é renderizado.
- **`contexts/`**: Contém provedores de contexto globais para a aplicação.
- **`middlewares/`**: Contém middlewares para a aplicação.

## Roteamento

O roteamento é tratado pelo **React Router**. O arquivo `routes.ts` define a
configuração de rotas para a aplicação, mapeando caminhos para componentes de rota
específicos.

**Exemplo: `routes.ts`**

```typescript
import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

import { ROUTES } from "../constants/routes";

export default [
  index("routes/SignInRoute.tsx"),
  layout("layouts/AppLayout.tsx", [
    route(ROUTES.space.planets, "routes/PlanetsRoute.tsx"),
    // ... outras rotas
  ]),
] satisfies RouteConfig;
```

## Layouts

O diretório `layouts` contém os componentes de layout para a aplicação.
Esses componentes são usados para criar um layout consistente em várias páginas.
Por exemplo, `AppLayout.tsx` poderia definir o layout principal da aplicação com uma
barra lateral e um cabeçalho.

## Componente Raiz

O arquivo `root.tsx` é o ponto de entrada principal da aplicação. Ele é
responsável por:

- Configurar a estrutura HTML raiz.
- Renderizar o componente `Outlet` do React Router, que renderiza o componente
  de rota correspondente.
- Envolver a aplicação com provedores de contexto globais, como
  `QueryClientProvider` para busca de dados e `AuthContextProvider` para
  autenticação.

**Exemplo: `root.tsx`**

```typescript
export const App = () => {
  return (
    <div className="w-full h-screen dark">
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <AuthContextProvider>
          <Outlet />
        </AuthContextProvider>
      </QueryClientProvider>
    </div>
  );
};
```