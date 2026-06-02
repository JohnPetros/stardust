import type { Id, Integer, Text } from '@stardust/core/global/structures'
import type { LessonService as ILessonService } from '@stardust/core/lesson/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Question } from '@stardust/core/lesson/abstracts'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { AudioVoice } from '@stardust/core/lesson/structures'

export const LessonService = (restClient: RestClient): ILessonService => {
  return {
    async fetchQuestions(starId: Id) {
      return await restClient.get(`/lesson/questions/star/${starId.value}`)
    },

    async fetchAudioVoices() {
      return await restClient.get('/lesson/audio-voices')
    },

    async fetchTextsBlocks(starId: Id) {
      return await restClient.get(`/lesson/text-blocks/star/${starId.value}`)
    },

    async fetchRemainingCodeExplanationUses() {
      return await restClient.get('/lesson/code-explanation/remaining-uses')
    },

    async explainCode(code: string) {
      return await restClient.post('/lesson/code-explanation', { code })
    },

    async updateTextBlocks(starId: Id, textBlocks: TextBlockDto[]) {
      return await restClient.put(`/lesson/text-blocks/star/${starId.value}`, {
        textBlocks,
      })
    },

    async triggerTextBlockAudioGeneration(
      starId: Id,
      blockIndex: Integer,
      voice: AudioVoice,
    ) {
      return await restClient.post(`/lesson/text-blocks/star/${starId.value}/audio`, {
        blockIndex: blockIndex.value,
        voice: voice.value,
      })
    },

    async triggerTextBlocksAudioGenerationInBatch(starId: Id) {
      return await restClient.post(`/lesson/text-blocks/star/${starId.value}/audio/batch`)
    },

    async cancelTextBlockAudioGeneration(starId: Id, blockIndex: Integer) {
      return await restClient.delete<TextBlockDto[]>(
        `/lesson/text-blocks/star/${starId.value}/audio`,
        {
          blockIndex: blockIndex.value,
        },
      )
    },

    async cancelTextBlocksAudioGenerationInBatch(starId: Id) {
      return await restClient.delete<TextBlockDto[]>(
        `/lesson/text-blocks/star/${starId.value}/audio/batch`,
      )
    },

    async updateStory(starId: Id, story: Text) {
      return await restClient.put(`/lesson/stories/star/${starId.value}`, { story })
    },

    async updateQuestions(starId: Id, questions: Question[]) {
      return await restClient.put(`/lesson/questions/star/${starId.value}`, {
        questions: questions.map((question) => question.dto),
      })
    },
  }
}
