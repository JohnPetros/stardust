import type { Slug } from '@stardust/core/global/structures'
import type { Guide } from '@stardust/core/manual/entities'

export const ROUTES = {
  index: '/',
  dashboard: '/dashboard',
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
    questions: (starSlug?: Slug) =>
      `/lesson/questions/${starSlug ? starSlug.value : ':starSlug'}`,
  },
  shop: {
    insignias: '/shop/insignias',
    rockets: '/shop/rockets',
    avatars: '/shop/avatars',
  },
  manual: {
    guide: (guide: Guide) => `/manual/guides/${guide.category.value}/${guide.id.value}`,
    lspGuides: '/manual/guides/lsp',
    mdxGuides: '/manual/guides/mdx',
  },
}
