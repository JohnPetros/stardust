import type { Id, Integer, Text } from '#global/domain/structures/index'
import type { RestResponse } from '#global/responses/RestResponse'
import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'
import type { Question } from '../domain/abstracts'
import type { QuestionDto } from '../domain/entities/dtos'
import type { AudioVoice } from '../domain/structures/AudioVoice'
import type { AudioVoiceDto } from '../domain/structures/dtos'

export interface LessonService {
  fetchQuestions(starId: Id): Promise<RestResponse<QuestionDto[]>>
  fetchAudioVoices(): Promise<RestResponse<AudioVoiceDto[]>>
  fetchTextsBlocks(starId: Id): Promise<RestResponse<TextBlockDto[]>>
  fetchRemainingCodeExplanationUses(): Promise<RestResponse<{ remainingUses: number }>>
  explainCode(code: string): Promise<RestResponse<{ explanation: string }>>
  updateTextBlocks(
    starId: Id,
    textBlocks: TextBlockDto[],
  ): Promise<RestResponse<TextBlockDto[]>>
  triggerTextBlockAudioGeneration(
    starId: Id,
    blockIndex: Integer,
    voice: AudioVoice,
  ): Promise<RestResponse<TextBlockDto[]>>
  triggerTextBlocksAudioGenerationInBatch(
    starId: Id,
  ): Promise<RestResponse<TextBlockDto[]>>
  cancelTextBlockAudioGeneration(
    starId: Id,
    blockIndex: Integer,
  ): Promise<RestResponse<TextBlockDto[]>>
  cancelTextBlocksAudioGenerationInBatch(
    starId: Id,
  ): Promise<RestResponse<TextBlockDto[]>>
  updateStory(starId: Id, story: Text): Promise<RestResponse<void>>
  updateQuestions(starId: Id, questions: Question[]): Promise<RestResponse<void>>
}
