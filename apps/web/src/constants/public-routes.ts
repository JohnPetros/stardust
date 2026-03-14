import { ROUTES } from './routes'

export const PUBLIC_ROUTES = [
  ROUTES.landing,
  ROUTES.playground.snippets,
  ...Object.values(ROUTES.seo),
  ...Object.values(ROUTES.auth),
  ...Object.values(ROUTES.api.auth),
]
