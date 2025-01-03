export const ROUTES = {
  ranking: '/ranking',
  space: '/space',
  shop: '/shop',
  challenging: {
    challenges: '/challenging/challenges',
    challengeMaker: '/challenging/challenge-maker',
    newSolution: '/challenging/solution/new',
  },
  profile: {
    user: '/profile',
    settings: '/profile/settings',
  },
  lesson: '/lesson',
  rewarding: {
    star: '/rewarding/star',
    starChallenge: '/rewarding/star-challenge',
    challenge: '/rewarding/challenge',
  },
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
    challenging: {
      list: '/api/challenging/list',
      countByDifficultyLevel: '/api/challenging/count-by-difficulty-level',
    },
  },
} as const
