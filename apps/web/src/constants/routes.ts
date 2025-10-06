import { CLIENT_ENV } from './client-env'

export const ROUTES = {
  ranking: '/ranking',
  space: '/space',
  shop: '/shop',
  challenging: {
    challenges: {
      list: '/challenging/challenges',
      challenge: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/challenge`,
      challengeDescription: (challengeSlug: string) =>
        `/challenging/challenges/${challengeSlug}/challenge/description`,
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
      solution: (challengeSlug: string, solutionSlug?: string) =>
        solutionSlug
          ? `/challenging/challenges/${challengeSlug}/solution/${solutionSlug}`
          : `/challenging/challenges/${challengeSlug}/solution`,
    },
    challenge: (challengeSlug?: string) =>
      challengeSlug
        ? `/challenging/challenge/${challengeSlug}`
        : '/challenging/challenge',
  },
  profile: {
    user: (userSlug: string) => `/profile/${userSlug}`,
    settings: (userSlug: string) => `/profile/${userSlug}/settings`,
  },
  lesson: {
    star: (starSlug: string) => `/lesson/${starSlug}`,
    ending: '/lesson/ending',
  },
  rewarding: {
    star: '/rewarding/star',
    starChallenge: '/rewarding/star-challenge',
    challenge: '/rewarding/challenge',
  },
  playground: {
    snippets: '/playground/snippets',
    snippet: (snippetId?: string) =>
      snippetId ? `/playground/snippets/${snippetId}` : '/playground/snippets/new',
  },
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
    accountConfirmation: '/auth/account-confirmation',
    socialAccountConfirmation: '/auth/social-account-confirmation',
  },
  landing: '/',
  api: {
    auth: {
      confirmEmail: '/api/auth/confirm-email',
      confirmPasswordReset: '/api/auth/confirm-password-reset',
      confirmSocialSignIn: '/api/auth/confirm-social-sign-in',
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
      user: (userId: string) => `/api/profile/${userId}`,
    },
    ranking: {
      current: '/api/ranking/current',
      uptade: '/api/ranking/update',
      tiers: '/api/ranking/tiers',
    },
    challenging: {
      list: '/api/challenging/list',
      countByDifficultyLevel: '/api/challenging/count-by-difficulty-level',
      solution: (solutionSlug: string) => `/api/challenging/solution/${solutionSlug}`,
    },
    playground: {
      snippet: (snippetId: string) => `/api/playground/snippets/${snippetId}`,
    },
    serverless: '/api/serverless',
  },
  server: {
    auth: {
      signInWithGoogle: `${CLIENT_ENV.stardustServerUrl}/auth/sign-in/google`,
      signInWithGithub: `${CLIENT_ENV.stardustServerUrl}/auth/sign-in/github`,
    },
  },
} as const
