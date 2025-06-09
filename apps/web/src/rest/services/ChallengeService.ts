import type { ChallengingService as IChallengingService } from '@stardust/core/challenging/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'
import type {
  ChallengesListParams,
  SolutionsListingParams,
} from '@stardust/core/challenging/types'

export const ChallengingService = (restClient: RestClient): IChallengingService => {
  return {
    async fetchChallengeById(challengeId: Id) {
      return await restClient.get(`/challenging/challenges/id/${challengeId.value}`)
    },

    async fetchChallengeBySlug(challengeSlug: Slug) {
      return await restClient.get(`/challenging/challenges/slug/${challengeSlug.value}`)
    },

    async fetchCompletedChallengesByDifficultyLevel() {
      return await restClient.get('/challenging/challenges/completed-by-difficulty-level')
    },

    async fetchChallengesList({
      page,
      itemsPerPage,
      title,
      difficulty,
      completionStatus,
      upvotesCountOrder,
      postingOrder,
      userId,
    }: ChallengesListParams) {
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('title', title.value)
      restClient.setQueryParam('difficulty', difficulty.level)
      restClient.setQueryParam('completionStatus', completionStatus.value)
      restClient.setQueryParam('upvotesCountOrder', upvotesCountOrder.value)
      restClient.setQueryParam('postingOrder', postingOrder.value)
      if (userId) restClient.setQueryParam('userId', userId.value)
      return await restClient.get('/challenging/challenges')
    },

    async fetchSolutionsList({
      page,
      itemsPerPage,
      title,
      challengeId,
      sorter,
      userId,
    }: SolutionsListingParams) {
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('title', title.value)
      restClient.setQueryParam('sorter', sorter.value)
      if (challengeId) restClient.setQueryParam('challengeId', challengeId.value)
      if (userId) restClient.setQueryParam('userId', userId.value)
      return await restClient.get('/challenging/solutions')
    },

    async fetchCategories() {
      return await restClient.get('/challenging/categories')
    },

    async fetchChallengeVote(challengeId: Id, userId: Id) {
      return await restClient.get(
        `/challenging/challenges/${challengeId.value}/vote/${userId.value}`,
      )
    },
  } as IChallengingService
}
