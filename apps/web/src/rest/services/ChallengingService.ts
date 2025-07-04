import type { ChallengingService as IChallengingService } from '@stardust/core/challenging/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug, Text } from '@stardust/core/global/structures'
import type {
  ChallengesListParams,
  SolutionsListingParams,
} from '@stardust/core/challenging/types'
import type { ChallengeVote } from '@stardust/core/challenging/structures'

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
      categoriesIds,
      userId,
    }: ChallengesListParams) {
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('title', title.value)
      restClient.setQueryParam('difficulty', difficulty.level)
      restClient.setQueryParam('completionStatus', completionStatus.value)
      restClient.setQueryParam('upvotesCountOrder', upvotesCountOrder.value)
      restClient.setQueryParam('postingOrder', postingOrder.value)
      restClient.setQueryParam('categoriesIds', categoriesIds.dto)
      if (userId) restClient.setQueryParam('userId', userId.value)
      return await restClient.get('/challenging/challenges')
    },

    async fetchChallengeVote(challengeId: Id) {
      return await restClient.get(`/challenging/challenges/${challengeId.value}/vote`)
    },

    async fetchAllChallengeCategories() {
      return await restClient.get('/challenging/challenges/categories')
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

    async fetchSolutionBySlug(solutionSlug: Slug) {
      return await restClient.get(`/challenging/solutions/${solutionSlug.value}`)
    },

    async fetchChallengeByStarId(starId: Id) {
      return await restClient.get(`/challenging/challenges/star/${starId.value}`)
    },

    async fetchChallengeBySolutionId(solutionId: Id) {
      return await restClient.get(`/challenging/challenges/solution/${solutionId.value}`)
    },

    async voteChallenge(challengeId: Id, challengeVote: ChallengeVote) {
      return await restClient.post(`/challenging/challenges/${challengeId.value}/vote`, {
        challengeVote: challengeVote.value,
      })
    },

    async viewSolution(solutionSlug: Slug) {
      return await restClient.patch(`/challenging/solutions/${solutionSlug.value}/view`)
    },

    async postSolution(solutionTitle: Text, solutionContent: Text, challengeId: Id) {
      return await restClient.post('/challenging/solutions', {
        solutionTitle: solutionTitle.value,
        solutionContent: solutionContent.value,
        challengeId: challengeId.value,
      })
    },

    async editSolution(solutionId: Id, solutionTitle: Text, solutionContent: Text) {
      return await restClient.put(`/challenging/solutions/${solutionId.value}`, {
        solutionTitle: solutionTitle.value,
        solutionContent: solutionContent.value,
      })
    },

    async deleteSolution(solutionId: Id) {
      return await restClient.delete(`/challenging/solutions/${solutionId.value}`)
    },
  } as unknown as IChallengingService
}
