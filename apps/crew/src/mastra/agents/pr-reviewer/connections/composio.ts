import { defineComposio } from '@/composio/define-composio'
import { env } from '@/env'
import { PR_REVIEWER_RESULT_TRANSFORMS } from '@/mastra/agents/pr-reviewer/connections/result-transforms'
import { REVIEW_REPOSITORY } from '@/mastra/agents/pr-reviewer/constants/review-repository'

export const PR_REVIEWER_COMPOSIO = defineComposio({
  userId: env.COMPOSIO_USER_ID,
  toolkits: ['github'],
  tools: {
    github: [
      'GITHUB_LIST_REVIEW_COMMENTS_ON_A_PULL_REQUEST',
      'GITHUB_GET_REPOSITORY_CONTENT',
    ],
  },
  connectedAccounts: { github: env.COMPOSIO_GITHUB_CONNECTED_ACCOUNT_ID },
  allowedRepository: REVIEW_REPOSITORY,
  resultTransforms: PR_REVIEWER_RESULT_TRANSFORMS,
})
