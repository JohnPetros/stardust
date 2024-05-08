import { Solution } from '@/@types/Solution'

import type { Order } from '../../types/Order'
import type { Supabase } from '../types/Supabase'
import type { SupabaseSolution } from '../types/SupabaseSolution'

import { GetFilteredSolutionsParams, ISolutionsController } from '../../interfaces/ISolutionsController'

import { SupabaseSolutionAdapter } from '../adapters/SupabaseSolutionAdapter'

export const SupabaseSolutionsController = (
  supabase: Supabase
): ISolutionsController => {
  return {
    async getFilteredSolutions(
      { challengeId, title, sorter }: GetFilteredSolutionsParams
    ) {
      let query = supabase
        .from('solutions')
        .select(
          'id, content, challenge_id, created_at, user:users(slug, avatar_id), comments_count:comments(count), upvotes:users_upvoted_solutions(count)'
        )

      switch (sorter) {
        case 'date':
          {
            query = query.order('created_at', {
              ascending: false,
            })
          }
          break
        case 'upvotes': {
          query = query.order('count_comments_upvotes', {
            ascending: true,
          })

          break
        }
      }

      const { data, error } = await query
        .match({ challenge_id: challengeId, title })
        .returns<SupabaseSolution[]>()

      if (error) {
        throw new Error(error.message)
      }

      const solutions: Solution[] = data.map(SupabaseSolutionAdapter)

      return solutions
    },

    async getUserUpvotedSolutionsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_upvoted_solutions')
        .select('solution_id')
        .eq('user_id', userId)
        .returns<{ solution_id: string }[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data.map(({ solution_id }) => solution_id)
    },
  }
}
