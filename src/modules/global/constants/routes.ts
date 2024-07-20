export const ROUTES = {
  private: {
    app: {
      home: {
        space: '/space',
        shop: '/shop',
        challenges: '/challenges',
        ranking: '/ranking',
        profile: '/profile',
      },
      challenge: '/challenge',
      challengeMaker: '/challenge-maker',
      solution: '/solution',
      newSolution: '/solution/new',
      profileSettings: '/profile/settings',
      lesson: '/lesson',
      playground: '/playground',
      config: '/config',
      rewards: '/rewards',
      accountConfirmation: '/account-confirmation',
    },
  },
  public: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    resetPassword: '/reset-password',
    landing: '/landing',
  },
  server: {
    auth: {
      confirmEmail: '/server/auth/confirm-email',
      confirmPasswordReset: '/server/auth/confirm-password-reset',
    },
    achievements: '/server/achievements',
    ranking: '/server/ranking',
    updateRankings: '/server/ranking/update',
    planets: '/server/planets',
    shop: '/server/shop',
    email: '/server/email',
    mdx: '/server/mdx',
  },
}
