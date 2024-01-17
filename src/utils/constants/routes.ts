export const ROUTES = {
  private: {
    home: '/',
    dashboard: {
      home: '/dashboard',
    },
    lesson: '/lesson',
    shop: '/shop',
    challenges: '/challenges',
    challenge: '/challenge',
    ranking: '/ranking',
    profile: '/profile',
    playground: '/playground',
    challengeMaker: '/challenges/maker',
    solution: '/challenges/solution',
    authConfirmation: '/auth-confirmation',
    rewards: '/rewards'
  },
  public: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    landing: '/landing',
    resetPassword: '/reset-password',
  },
  server: {
    auth: {
      confirm: '/server/auth/confirm',
    },
    email: '/server/email',
    mdx: '/server/mdx',
    cookies: '/server/cookies',
  },
}
