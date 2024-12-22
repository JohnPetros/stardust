export const ROUTES = {
  private: {
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
      settings: '/profile/settings',
      prefix: '/profile',
    },
    lesson: {
      prefix: '/lesson',
      rewarding: '/lesson/rewarding',
    },
    playground: '/playground',
    accountConfirmation: '/account-confirmation',
  },
  public: {
    auth: {
      signIn: '/sign-in',
      signUp: '/sign-up',
      resetPassword: '/reset-password',
    },
    landing: '/landing',
  },
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
    },
    ranking: {
      current: '/api/ranking/current',
      uptade: '/api/ranking/update',
    },
    lesson: {
      reward: '/api/reward',
    },
  },
}
