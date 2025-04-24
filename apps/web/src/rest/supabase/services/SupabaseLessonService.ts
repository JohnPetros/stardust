import type { LessonService } from '@stardust/core/global/interfaces'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { RestResponse } from '@stardust/core/global/responses'
import type { TextBlockDto } from '@stardust/core/global/dtos'
import type { QuestionDto } from '@stardust/core/lesson/dtos'

export const SupabaseLessonService = (supabase: Supabase): LessonService => {
  return {
    async fetchQuestionsByStar(starId: string) {
      const { data, error, status } = await supabase
        .from('stars')
        .select('questions')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar as questões dessa estrela',
          status,
        )
      }

      return new RestResponse({
        body: data.questions as QuestionDto[],
      })
    },

    async fetchTextsBlocksByStar(starId) {
      const { data, error } = await supabase
        .from('stars')
        .select('texts')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar textos')
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

      return new RestResponse({ body: textsBlocks })
    },

    async fetchStarStory(starId) {
      const { data, error } = await supabase
        .from('stars')
        .select('story')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar história dessa estrela',
        )
      }

      return new RestResponse({ body: { story: data.story ?? '' } })
    },
  }
}
