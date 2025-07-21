import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

import { ROUTES } from '../constants/routes'

export default [
  layout('layouts/AppLayout.tsx', [
    index('routes/DashboardRoute.tsx'),
    route(ROUTES.planets, 'routes/PlanetsRoute.tsx'),
    route(ROUTES.users, 'routes/UsersRoute.tsx'),
    route(ROUTES.challenges, 'routes/ChallengesRoute.tsx'),
    route(ROUTES.achievements, 'routes/AchievementsRoute.tsx'),
  ]),
] satisfies RouteConfig
