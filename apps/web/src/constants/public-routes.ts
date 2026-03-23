import { ROUTES } from './routes'

export const PUBLIC_ROUTES = [
  ROUTES.landing,
  ROUTES.playground.snippets,
  ROUTES.auth.signIn,
  ROUTES.auth.signUp,
  ROUTES.auth.resetPassword,
  ROUTES.auth.socialAccountConfirmation,
  ...Object.values(ROUTES.seo),
  ...Object.values(ROUTES.api.auth),
]
