import {
  Id,
  Integer,
  List,
  Logical,
  Name,
  Slug,
  Text,
} from '#global/domain/structures/index'
import { AuthorAggregate } from '#global/domain/aggregates/index'
import { Datetime } from '#global/libs/index'
import { ChallengeDifficulty, ChallengeVote, TestCase } from '../structures'
import type { ChallengeDto } from '../entities/dtos'
import { ChallengeCategory } from '../entities'

export class ChallengeFactory {
  static produce(dto: ChallengeDto) {
    return {
      title: Name.create(dto.title),
      slug: Slug.create(dto.title),
      author: AuthorAggregate.create(dto.author),
      code: dto.code,
      difficulty: ChallengeDifficulty.create(dto.difficultyLevel),
      starId: dto.starId ? Id.create(dto.starId) : null,
      testCases: dto.testCases.map(TestCase.create),
      completionCount: Integer.create(
        dto.completionCount ?? 0,
        'Quantidade de vezes que esse desafio foi completado',
      ),
      downvotesCount: Integer.create(dto.downvotesCount ?? 0, 'Contagem de dowvotes'),
      upvotesCount: Integer.create(dto.upvotesCount ?? 0, 'Contagem de upvotes'),
      categories: dto.categories.map(ChallengeCategory.create),
      userVote: ChallengeVote.createAsNone(),
      description: Text.create(dto.description),
      isPublic: Logical.create(
        typeof dto.isPublic !== 'undefined' ? dto.isPublic : false,
        'O desafio é público?',
      ),
      isNew: Logical.create(dto.isNew ?? true, 'O desafio é novo?'),
      isCompleted: Logical.create(false, 'A resposta do desafio está completada?'),
      incorrectAnswersCount: Integer.create(0, 'Contagem de respostas incorretas'),
      results: List.create([]),
      userOutputs: List.create([]),
      postedAt: dto.postedAt ?? new Datetime().date(),
    }
  }
}
