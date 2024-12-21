import type { ILessonService } from '@stardust/core/interfaces'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { ApiResponse } from '@stardust/core/responses'
import type { TextBlockDto } from '@stardust/core/global/dtos'
import type { QuestionDto } from '@stardust/core/lesson/dtos'

export const SupabaseLessonService = (supabase: Supabase): ILessonService => {
  return {
    async fetchQuestionsByStar(starId: string) {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('star_id', starId)
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao buscar textos')
      }

      const questions = data.map(({ id, content }) => ({
        id,
        ...Object(content),
      })) as QuestionDto[]

      return new ApiResponse({ body: questions })
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

      return new ApiResponse({ body: textsBlocks })
    },
  }
}
