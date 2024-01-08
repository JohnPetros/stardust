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
      resetPassword: '/server/auth/reset-password',
      generatePasswordToken: '/server/auth/generate-password-token',
    },
    email: {
      send: '/server/email/send',
    },
    mdx: '/server/mdx',
    cookies: '/server/cookies',
  },
}
