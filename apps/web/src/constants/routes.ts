export const ROUTES = {
  ranking: '/ranking',
  space: '/space',
  shop: '/shop',
  challenging: {
    prefix: '/challenging',
    challenge: '/challenging/challenge',
    challenges: '/challenging/challenges',
    challengeMaker: '/challenging/challenge-maker',
    solutions: '/solutions',
    comments: '/solutions',
    newSolution: '/challenging/solution/new',
  },
  profile: {
    prefix: '/profile',
    settings: '/profile/settings',
  },
  lesson: {
    prefix: '/lesson',
  },
  rewarding: '/rewarding',
  playground: '/playground',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
    accountConfirmation: '/auth/account-confirmation',
  },
  landing: '/landing',
  api: {
    auth: {
      confirmEmail: '/api/auth/confirm-email',
      confirmPasswordReset: '/api/auth/confirm-password-reset',
    },
    space: {
      planets: '/api/space/planets',
    },
    shop: {
      items: '/api/shop/items',
    },
    profile: {
      achievements: '/api/profile/achievements',
      reward: '/api/profile/reward',
    },
    ranking: {
      current: '/api/ranking/current',
      uptade: '/api/ranking/update',
    },
  },
}
