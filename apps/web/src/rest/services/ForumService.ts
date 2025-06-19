import type { ForumService as IForumService } from '@stardust/core/forum/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Text } from '@stardust/core/global/structures'
import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'

export const ForumService = (restClient: RestClient): IForumService => {
  return {
    async fetchChallengeCommentsList(params: CommentsListParams, challengeId: Id) {
      restClient.setQueryParam('page', params.page.value.toString())
      restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      restClient.setQueryParam('sorter', params.sorter.value)
      restClient.setQueryParam('order', params.order.value)
      return await restClient.get(`/forum/comments/challenge/${challengeId.value}`)
    },

    async fetchSolutionCommentsList(params: CommentsListParams, solutionId: Id) {
      restClient.setQueryParam('page', params.page.value.toString())
      restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      restClient.setQueryParam('sorter', params.sorter.value)
      restClient.setQueryParam('order', params.order.value)
      return await restClient.get(`/forum/comments/solution/${solutionId.value}`)
    },

    async fetchCommentReplies(commentId: Id) {
      return await restClient.get(`/forum/comments/${commentId.value}/replies`)
    },

    async postChallengeComment(comment: Comment, challengeId: Id) {
      return await restClient.post(
        `/forum/comments/challenge/${challengeId.value}`,
        comment.dto,
      )
    },

    async postSolutionComment(comment: Comment, solutionId: Id) {
      return await restClient.post(
        `/forum/comments/solution/${solutionId.value}`,
        comment.dto,
      )
    },

    async replyComment(reply: Comment, commentId: Id) {
      return await restClient.post(
        `/forum/comments/${commentId.value}/replies`,
        reply.dto,
      )
    },

    async editComment(commentContent: Text, commentId: Id) {
      return await restClient.patch(`/forum/comments/${commentId.value}`, {
        content: commentContent.value,
      })
    },

    async deleteComment(commentId: Id) {
      return await restClient.delete(`/forum/comments/${commentId.value}`)
    },
  }
}
