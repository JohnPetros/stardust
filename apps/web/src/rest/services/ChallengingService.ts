import type { ChallengingService as IChallengingService } from '@stardust/core/challenging/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug, Text } from '@stardust/core/global/structures'
import type {
  ChallengesListParams,
  SolutionsListingParams,
} from '@stardust/core/challenging/types'
import type { ChallengeVote } from '@stardust/core/challenging/structures'
import type { Challenge } from '@stardust/core/challenging/entities'
import type { PaginationResponse } from '@stardust/core/global/responses'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

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

    async fetchAllChallenges({
      page,
      itemsPerPage,
      title,
      difficulty,
      completionStatus,
      upvotesCountOrder,
      postingOrder,
      categoriesIds,
      shouldIncludePrivateChallenges,
      shouldIncludeOnlyAuthorChallenges,
      shouldIncludeStarChallenges,
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
      restClient.setQueryParam(
        'shouldIncludePrivateChallenges',
        shouldIncludePrivateChallenges.value.toString(),
      )
      restClient.setQueryParam(
        'shouldIncludeOnlyAuthorChallenges',
        shouldIncludeOnlyAuthorChallenges.value.toString(),
      )
      restClient.setQueryParam(
        'shouldIncludeStarChallenges',
        shouldIncludeStarChallenges.value.toString(),
      )
      if (userId) restClient.setQueryParam('userId', userId.value)
      const response = await restClient.get<PaginationResponse<ChallengeDto>>(
        '/challenging/challenges',
      )
      restClient.clearQueryParams()
      return response
    },

    async fetchChallengesList({
      page,
      itemsPerPage,
      title,
      difficulty,
      completionStatus,
      isNewStatus,
      upvotesCountOrder,
      postingOrder,
      categoriesIds,
      userId,
      shouldIncludePrivateChallenges,
      shouldIncludeOnlyAuthorChallenges,
      shouldIncludeStarChallenges,
    }: ChallengesListParams) {
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      restClient.setQueryParam('title', title.value)
      restClient.setQueryParam('difficulty', difficulty.level)
      restClient.setQueryParam('completionStatus', completionStatus.value)
      restClient.setQueryParam('isNewStatus', isNewStatus.value)
      restClient.setQueryParam('upvotesCountOrder', upvotesCountOrder.value)
      restClient.setQueryParam('postingOrder', postingOrder.value)
      restClient.setQueryParam('categoriesIds', categoriesIds.dto)
      restClient.setQueryParam(
        'shouldIncludePrivateChallenges',
        shouldIncludePrivateChallenges.value.toString(),
      )
      restClient.setQueryParam(
        'shouldIncludeOnlyAuthorChallenges',
        shouldIncludeOnlyAuthorChallenges.value.toString(),
      )
      restClient.setQueryParam(
        'shouldIncludeStarChallenges',
        shouldIncludeStarChallenges.value.toString(),
      )
      if (userId) restClient.setQueryParam('userId', userId.value)
      const response = await restClient.get<PaginationResponse<ChallengeDto>>(
        '/challenging/challenges/list',
      )
      restClient.clearQueryParams()
      return response
    },

    async fetchChallengeVote(challengeId: Id) {
      return await restClient.get(`/challenging/challenges/${challengeId.value}/vote`)
    },

    async fetchAllChallengeCategories() {
      return await restClient.get('/challenging/challenges/categories')
    },

    async fetchPostedChallengesKpi() {
      return await restClient.get('/challenging/challenges/posted-challenges-kpi')
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

    async postChallenge(challenge: Challenge) {
      return await restClient.post('/challenging/challenges', challenge.dto)
    },

    async updateChallenge(challenge: Challenge) {
      return await restClient.put(
        `/challenging/challenges/${challenge.id.value}`,
        challenge.dto,
      )
    },

    async deleteChallenge(challenge: Challenge) {
      return await restClient.delete(`/challenging/challenges/${challenge.id.value}`)
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

    async upvoteSolution(solutionId: Id) {
      return await restClient.post(`/challenging/solutions/${solutionId.value}/upvote`)
    },

    async deleteChallengeCategories(challengeId: Id) {
      return await restClient.delete(
        `/challenging/challenges/${challengeId.value}/categories`,
      )
    },

    async deleteSolution(solutionId: Id) {
      return await restClient.delete(`/challenging/solutions/${solutionId.value}`)
    },
  }
}
