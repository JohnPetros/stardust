import type { Challenge } from '@stardust/core/challenging/entities'
import type {
  ChallengeCategoryDto,
  ChallengeDto,
  TestCaseDto,
} from '@stardust/core/challenging/dtos'
import type { SupabaseChallenge } from '../types'
import type { TextBlockDto } from '@stardust/core/global/dtos'
import { Datetime } from '@stardust/core/libs'

export const SupabaseChallengeMapper = () => {
  return {
    toDto(supabaseChallenge: SupabaseChallenge): ChallengeDto {
      let textsBlocks: TextBlockDto[] = []
      if (supabaseChallenge.texts) {
        textsBlocks = (supabaseChallenge.texts as TextBlockDto[]).map((textBlock) => {
          return {
            type: textBlock.type,
            content: textBlock.content,
            isRunnable: textBlock.isRunnable,
            picture: textBlock.picture,
            title: textBlock.title,
          }
        })
      }

      const challengeDto: ChallengeDto = {
        id: supabaseChallenge.id ?? '',
        title: supabaseChallenge.title ?? '',
        code: supabaseChallenge.code ?? '',
        slug: supabaseChallenge.slug ?? '',
        difficultyLevel: supabaseChallenge.difficulty ?? '',
        docId: supabaseChallenge.doc_id,
        function: {
          name: supabaseChallenge.function_name ?? '',
          params:
            supabaseChallenge.function_params?.map((paramName) => ({
              name: paramName,
            })) ?? [],
        },
        author: {
          id: supabaseChallenge.user_id ?? '',
          dto: {
            slug: supabaseChallenge.author_slug ?? '',
            name: supabaseChallenge.author_name ?? '',
            avatar: {
              name: supabaseChallenge.author_avatar_name ?? '',
              image: supabaseChallenge.author_avatar_image ?? '',
            },
          },
        },
        upvotesCount: supabaseChallenge.upvotes ?? 0,
        downvotesCount: supabaseChallenge.downvotes ?? 0,
        completionsCount: supabaseChallenge.total_completitions ?? 0,
        description: supabaseChallenge.description ?? '',
        textBlocks: textsBlocks,
        testCases: (
          JSON.parse(supabaseChallenge.test_cases as string) as TestCaseDto[]
        ).map((supabaseTestCase) => {
          return {
            position: supabaseTestCase.position ?? '',
            inputs: supabaseTestCase.inputs ?? [],
            expectedOutput: supabaseTestCase.expectedOutput,
            isLocked: supabaseTestCase.isLocked,
          }
        }),
        categories: (supabaseChallenge.categories as ChallengeCategoryDto[]).map(
          (supabaseCategory) => {
            return {
              id: supabaseCategory.id,
              name: supabaseCategory.name,
            }
          },
        ),
        starId: supabaseChallenge.star_id,
        postedAt: new Datetime(supabaseChallenge.created_at).date(),
      }

      return challengeDto
    },

    toSupabase(challenge: Challenge): SupabaseChallenge {
      const challengeDto = challenge.dto

      // @ts-ignore
      const supabaseChallenge: SupabaseChallenge = {
        id: challenge.id,
        slug: challenge.slug.value,
        title: challengeDto.title,
        code: challengeDto.code,
        difficulty: challengeDto.difficultyLevel,
        test_cases: JSON.stringify(challengeDto.testCases),
        description: challengeDto.description,
        user_id: challengeDto.author.id,
        function_name: challengeDto.function?.name ?? null,
        function_params: challengeDto.function?.params.map((param) => param.name) ?? [],
        created_at: challenge.postedAt.toDateString(),
        texts: [],
        categories: [],
        star_id: '',
        doc_id: '',
      }

      return supabaseChallenge
    },
  }
}
