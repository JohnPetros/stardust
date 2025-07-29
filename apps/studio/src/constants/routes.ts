import type { Slug } from '@stardust/core/global/structures'

export const ROUTES = {
  index: '/',
  profile: {
    users: '/profile/users',
    achievements: '/profile/achievements',
  },
  space: {
    planets: '/space/planets',
  },
  challenging: {
    challenges: '/challenging/challenges',
    challenge: (challengeSlug: Slug) => `/challenging/challenge/${challengeSlug.value}`,
  },
  lesson: {
    story: (starSlug?: Slug) =>
      `/lesson/story/${starSlug ? starSlug.value : ':starSlug'}`,
    questions: (starSlug: Slug) => `/lesson/questions/${starSlug.value}`,
  },
}
