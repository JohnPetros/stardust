import type { Id, Text } from '@stardust/core/global/structures'
import type { LessonService as ILessonService } from '@stardust/core/lesson/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

export const LessonService = (restClient: RestClient): ILessonService => {
  return {
    async fetchQuestions(starId: Id) {
      return await restClient.get(`/lesson/questions/star/${starId.value}`)
    },

    async fetchTextsBlocks(starId: Id) {
      return await restClient.get(`/lesson/text-blocks/star/${starId.value}`)
    },

    async fetchStarStory(starId: Id) {
      return await restClient.get(`/lesson/stories/star/${starId.value}`)
    },

    async updateStory(starId: Id, story: Text) {
      return await restClient.put(`/lesson/stories/star/${starId.value}`, {
        story: story.value,
      })
    },
  }
}
