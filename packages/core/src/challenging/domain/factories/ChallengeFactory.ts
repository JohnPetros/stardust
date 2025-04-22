import { Id, Integer, List, Logical, Name, Slug, Text } from '#global/structs'
import { ChallengeDifficulty, TestCase } from '../structs'
import type { ChallengeDto } from '../../dtos'
import { ChallengeCategory } from '../entities'
import { Author } from '../../../global/domain/entities'
import { Datetime } from '../../../global/libs'

export class ChallengeFactory {
  static produce(dto: ChallengeDto) {
    const categories: ChallengeCategory[] = []
    const includedCategoriesIds: string[] = []
    for (const category of dto.categories) {
      const challengeCategory = ChallengeCategory.create(category)
      if (!includedCategoriesIds.includes(challengeCategory.id)) {
        categories.push(challengeCategory)
        includedCategoriesIds.push(challengeCategory.id) // supabase's repeated categories bug fix
      }
    }

    return {
      title: Name.create(dto.title),
      slug: Slug.create(dto.title),
      author: {
        id: dto.author.id,
        entity: dto.author.dto && Author.create(dto.author.dto),
      },
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
