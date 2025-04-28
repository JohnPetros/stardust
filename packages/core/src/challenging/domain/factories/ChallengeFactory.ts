import { ChallengeDifficulty, TestCase } from '../structures'
import type { ChallengeDto } from '../entities/dtos'
import { ChallengeCategory } from '../entities'
import { Id, Integer, List, Logical, Name, Slug, Text } from '@/global/domain/structures'
import { AuthorAggregate } from '@/global/domain/aggregates'
import { Datetime } from '@/global/libs'

export class ChallengeFactory {
  static produce(dto: ChallengeDto) {
    const categories: ChallengeCategory[] = []
    const includedCategoriesIds: string[] = []
    for (const category of dto.categories) {
      const challengeCategory = ChallengeCategory.create(category)
      if (!includedCategoriesIds.includes(challengeCategory.id.value)) {
        categories.push(challengeCategory)
        includedCategoriesIds.push(challengeCategory.id.value) // supabase's repeated categories bug fix
      }
    }

    return {
      title: Name.create(dto.title),
      slug: Slug.create(dto.title),
      author: AuthorAggregate.create(dto.author),
      code: dto.code,
      difficulty: ChallengeDifficulty.create(dto.difficultyLevel),
      starId: dto.starId ? Id.create(dto.starId) : null,
      testCases: dto.testCases.map(TestCase.create),
      completionsCount: Integer.create(
        dto.completionsCount ?? 0,
        'Quantidade de vezes que esse desafio foi completado',
      ),
      downvotesCount: Integer.create(dto.downvotesCount ?? 0, 'Contagem de dowvotes'),
      upvotesCount: Integer.create(dto.upvotesCount ?? 0, 'Contagem de upvotes'),
      categories,
      userVote: null,
      description: Text.create(dto.description),
      isPublic: Logical.create(
        typeof dto.isPublic !== 'undefined' ? dto.isPublic : false,
        'O desafio é público?',
      ),
      isCompleted: Logical.create(false, 'A resposta do desafio está completada?'),
      incorrectAnswersCount: Integer.create(0, 'Contagem de respostas incorretas'),
      results: List.create([]),
      userOutputs: List.create([]),
      postedAt: dto.postedAt ?? new Datetime().date(),
    }
  }
}
