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
  accountConfirmation: '/account-confirmation',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  landing: '/landing',
  api: {
    auth: {
      confirmEmail: '/api/auth/confirm-email',
      confirmPasswordReset: '/api/auth/confirm-password-reset',
    },
    space: {
      planets: '/api/planets',
    },
    shop: {
      items: '/shop/items',
    },
    profile: {
      achievements: '/api/achievements',
      reward: '/api/user',
    },
    ranking: {
      current: '/api/ranking/current',
      uptade: '/api/ranking/update',
    },
  },
}
