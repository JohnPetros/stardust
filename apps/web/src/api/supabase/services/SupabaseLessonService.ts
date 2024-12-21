import type { ILessonService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'
import {
  QuestionsByStarNotFoundError,
  TextsBlocksByStarNotFoundError,
} from '@/@core/errors/lesson'
import type { TextBlockDto, QuestionDto } from '#dtos'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'

export const SupabaseLessonService = (supabase: Supabase): ILessonService => {
  return {
    async fetchQuestionsByStar(starId: string) {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('star_id', starId)
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, QuestionsByStarNotFoundError)
      }

      const questions = data.map(({ id, content }) => ({
        id,
        ...Object(content),
      })) as QuestionDto[]

      return new ServiceResponse(questions)
    },

    async fetchTextsBlocksByStar(starId) {
      const { data, error } = await supabase
        .from('stars')
        .select('texts')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, TextsBlocksByStarNotFoundError)
      }

      const textsBlocks: TextBlockDto[] = (data.texts as TextBlockDto[]).map(
        (textBlock) => {
          return {
            type: textBlock.type,
            content: textBlock.content,
            isRunnable: textBlock.isRunnable,
            picture: textBlock.picture,
            title: textBlock.title,
          }
        },
      )

      return new ServiceResponse(textsBlocks)
    },
  }
}
