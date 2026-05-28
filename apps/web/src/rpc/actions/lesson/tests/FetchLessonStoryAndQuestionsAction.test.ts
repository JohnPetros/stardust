import { mock, type Mock } from 'ts-jest-mocker'

import type { Call } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import type { LessonService } from '@stardust/core/lesson/interfaces'
import { TextBlocksFaker } from '@stardust/core/lesson/entities/fakers'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'

import { FetchLessonStoryAndQuestionsAction } from '../FetchLessonStoryAndQuestionsAction'

describe('FetchLessonStoryAndQuestionsAction', () => {
  let call: Mock<Call<{ starId: string }>>
  let lessonService: Mock<LessonService>

  const starId = '5c71a8f2-d2db-4cc7-bc98-1dc7c9c34b76'
  const questions: QuestionDto[] = [
    {
      type: 'selection',
      stem: 'Qual resposta esta correta?',
      picture: 'question.png',
      options: ['A', 'B'],
      answer: 'A',
    },
  ]

  beforeEach(() => {
    call = mock<Call<{ starId: string }>>()
    lessonService = mock<LessonService>()

    call.getRequest.mockReturnValue({ starId })
  })

  it('should return only questions and text blocks', async () => {
    const textsBlocks = TextBlocksFaker.fakeManyDto(2, { type: 'default' })

    lessonService.fetchQuestions.mockResolvedValue(new RestResponse({ body: questions }))
    lessonService.fetchTextsBlocks.mockResolvedValue(
      new RestResponse({ body: textsBlocks }),
    )

    const response = await FetchLessonStoryAndQuestionsAction(lessonService).handle(call)

    expect(lessonService.fetchQuestions).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
    )
    expect(lessonService.fetchTextsBlocks).toHaveBeenCalledWith(
      expect.objectContaining({ value: starId }),
    )
    expect(response).toEqual({
      questions,
      textsBlocks,
    })
  })

  it('should propagate fetchQuestions failures', async () => {
    lessonService.fetchQuestions.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Questions failed' }),
    )
    lessonService.fetchTextsBlocks.mockResolvedValue(
      new RestResponse({ body: TextBlocksFaker.fakeManyDto(1, { type: 'default' }) }),
    )

    await expect(
      FetchLessonStoryAndQuestionsAction(lessonService).handle(call),
    ).rejects.toThrow('Questions failed')
  })

  it('should propagate fetchTextsBlocks failures', async () => {
    lessonService.fetchQuestions.mockResolvedValue(new RestResponse({ body: questions }))
    lessonService.fetchTextsBlocks.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Text blocks failed' }),
    )

    await expect(
      FetchLessonStoryAndQuestionsAction(lessonService).handle(call),
    ).rejects.toThrow('Text blocks failed')
  })
})
