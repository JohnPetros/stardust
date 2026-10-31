import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { ROUTES } from '@/constants/routes'
import { RootLayout } from '@/ui/shared/widgets/layouts/root-layout'
import { DefaultSceneRedirect } from '@/ui/studio/widgets/pages/default-scene-redirect'
import { NotFoundPage } from '@/ui/studio/widgets/pages/not-found-page'
import { ScenePage } from '@/ui/studio/widgets/pages/scene-page'

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

const defaultSceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.root,
  component: DefaultSceneRedirect,
})

const sceneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.scene,
  component: ScenePage,
})

const routeTree = rootRoute.addChildren([defaultSceneRoute, sceneRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
