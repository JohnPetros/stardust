# App Layer - React Router and Application Entry Point

The app layer is the entry point of the Studio application. It is built with **React** and uses **React Router** for navigation. It is responsible for setting up the application's root structure, routing, and global context providers.

## Structure

The app layer is located in the `/home/petros/stardust/apps/studio/src/app` directory.

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

- **`routes.ts`**: Defines the application's routes using `@react-router/dev/routes`.
- **`routes/`**: Contains the components for each route (e.g., `SignInRoute.tsx`).
- **`layouts/`**: Contains the layout components for the application (e.g., `AppLayout.tsx`).
- **`root.tsx`**: The main entry point of the application, where the router is configured and the root layout is rendered.
- **`contexts/`**: Contains global context providers for the application.
- **`middlewares/`**: Contains middlewares for the application.

## Routing

Routing is handled by **React Router**. The `routes.ts` file defines the route configuration for the application, mapping paths to specific route components.

**Example: `routes.ts`**
```typescript
import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { ROUTES } from '../constants/routes'

export default [
  index('routes/SignInRoute.tsx'),
  layout('layouts/AppLayout.tsx', [
    route(ROUTES.space.planets, 'routes/PlanetsRoute.tsx'),
    // ... other routes
  ]),
] satisfies RouteConfig
```

## Layouts

The `layouts` directory contains the layout components for the application. These components are used to create a consistent layout across multiple pages. For example, `AppLayout.tsx` could define the main application layout with a sidebar and a header.

## Root Component

The `root.tsx` file is the main entry point of the application. It is responsible for:
- Setting up the root HTML structure.
- Rendering the `Outlet` component from React Router, which renders the matched route component.
- Wrapping the application with global context providers, such as `QueryClientProvider` for data fetching and `AuthContextProvider` for authentication.

**Example: `root.tsx`**
```typescript
export const App = () => {
  return (
    <div className='w-full h-screen dark'>
      <QueryClientProvider client={queryClient}>
        <Toaster position='top-right' richColors />
        <AuthContextProvider>
          <Outlet />
        </AuthContextProvider>
      </QueryClientProvider>
    </div>
  )
}
```