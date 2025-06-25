import type { ChallengingService as IChallengingService } from '@stardust/core/challenging/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'
import type {
  ChallengesListParams,
  SolutionsListingParams,
} from '@stardust/core/challenging/types'
import type { ChallengeVote } from '@stardust/core/challenging/structures'
import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

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
      return await restClient.get('/challenging/categories')
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

    async fetchChallengeCommentsList(params: CommentsListParams, challengeId: Id) {
      restClient.setQueryParam('page', params.page.value.toString())
      restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      restClient.setQueryParam('sorter', params.sorter.value)
      restClient.setQueryParam('order', params.order.value)
      return await restClient.get(`/challenging/comments/challenge/${challengeId.value}`)
    },

    async fetchSolutionCommentsList(params: CommentsListParams, solutionId: Id) {
      restClient.setQueryParam('page', params.page.value.toString())
      restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      restClient.setQueryParam('sorter', params.sorter.value)
      restClient.setQueryParam('order', params.order.value)
      return await restClient.get(`/challenging/comments/solution/${solutionId.value}`)
    },

    async postChallengeComment(challengeId: Id, comment: Comment) {
      return await restClient.post(
        `/challenging/comments/challenge/${challengeId.value}`,
        comment.dto,
      )
    },

    async fetchSolutionById(solutionId: Id) {
      return await restClient.get(`/challenging/solutions/id/${solutionId.value}`)
    },

    async fetchSolutionBySlug(solutionSlug: Slug) {
      return await restClient.get(`/challenging/solutions/slug/${solutionSlug.value}`)
    },

    async fetchChallengeByStarId(starId: Id) {
      return await restClient.get(`/challenging/challenges/star/${starId.value}`)
    },

    async fetchChallengeBySolutionId(solutionId: Id) {
      return await restClient.get(`/challenging/challenges/solution/${solutionId.value}`)
    },

    async fetchDocs() {
      return await restClient.get('/challenging/docs')
    },

    async voteChallenge(challengeId: Id, challengeVote: ChallengeVote) {
      return await restClient.post(`/challenging/challenges/${challengeId.value}/vote`, {
        challengeVote: challengeVote.value,
      })
    },

    async viewSolution(solutionSlug: Slug) {
      return await restClient.patch(`/challenging/solutions/${solutionSlug.value}/view`)
    },
  } as unknown as IChallengingService
}
