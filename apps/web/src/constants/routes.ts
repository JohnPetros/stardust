export const ROUTES = {
  ranking: '/ranking',
  space: '/space',
  shop: '/shop',
  challenging: {
    challenges: {
      challenge: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/challenge`,
      challengeResult: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/challenge/result`,
      challengeComments: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/challenge/comments`,
      challengeSolutions: {
        list: (challengeSlug: string) =>
          `/challenging/challenges/${challengeSlug}/challenge/solutions`,
        solution: (challengeSlug: string, solutionSlug: string) =>
          `/challenging/challenges/${challengeSlug}/challenge/solutions/${solutionSlug}`,
      },
      solution: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/solution`,
    },
  },
  profile: {
    user: (userSlug: string) => `/profile/${userSlug}`,
    settings: (userSlug: string) => `/profile/${userSlug}/settings`,
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
