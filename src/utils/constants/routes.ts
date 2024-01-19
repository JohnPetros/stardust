export const ROUTES = {
  private: {
    home: {
      space: '/',
      shop: '/shop',
      challenges: '/challenges',
      ranking: '/ranking',
      profile: '/profile',
    },
    challengeMaker: '/challenge-maker',
    lesson: '/lesson',
    playground: '/playground',
    config: '/config',
    authConfirmation: '/auth-confirmation',
    rewards: '/rewards',
  },
  public: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    resetPassword: '/reset-password',
  },
  server: {
    auth: {
      confirm: '/server/auth/confirm',
    },
    email: '/server/email',
    mdx: '/server/mdx',
  },
}
