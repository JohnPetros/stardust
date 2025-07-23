import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { ROUTES } from '../constants/routes'

export default [
  index('routes/SignInRoute.tsx'),
  layout('layouts/AppLayout.tsx', [
    route(ROUTES.space.planets, 'routes/PlanetsRoute.tsx'),
    route(ROUTES.profile.users, 'routes/UsersRoute.tsx'),
    route(ROUTES.challenging.challenges, 'routes/ChallengesRoute.tsx'),
    route(ROUTES.profile.achievements, 'routes/AchievementsRoute.tsx'),
  ]),
] satisfies RouteConfig
