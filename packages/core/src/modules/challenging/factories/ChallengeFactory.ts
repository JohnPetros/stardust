import { Id, Integer, List, Logical, Name, Slug, TextBlock } from '#global/structs'
import { ChallengeDifficulty, TestCase } from '#challenging/structs'
import type { ChallengeDto } from '#challenging/dtos'
import { ChallengeCategory } from '#challenging/entities'

export class ChallengeFactory {
  static produce(dto: ChallengeDto) {
    const includedCategoriesIds: string[] = []
    const categories: ChallengeCategory[] = []
    for (const category of dto.categories) {
      const challengeCategory = ChallengeCategory.create(category)
      if (!includedCategoriesIds.includes(challengeCategory.id)) {
        categories.push(challengeCategory)
        includedCategoriesIds.push(challengeCategory.id)
      }
    }

    return {
      title: Name.create(dto.title),
      slug: Slug.create(dto.slug),
      authorSlug: Slug.create(dto.authorSlug),
      code: dto.code,
      difficulty: ChallengeDifficulty.create(dto.difficulty),
      docId: dto.docId ? Id.create(dto.docId) : null,
      starId: dto.starId ? Id.create(dto.starId) : null,
      testCases: dto.testCases.map(TestCase.create),
      completionsCount: Integer.create(
        dto.completionsCount,
        'Quantidade de vezes que esse desafio foi completado',
      ),
      functionName: dto.functionName ? Name.create(dto.functionName) : null,
      downvotesCount: Integer.create(dto.downvotesCount, 'Contagem de dowvotes'),
      upvotesCount: Integer.create(dto.upvotesCount, 'Contagem de upvotes'),
      description: dto.description,
      textBlocks: dto.textBlocks.map((dto) => {
        let textBlock = TextBlock.create(dto.type, dto.content)
        if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
        if (dto.title) textBlock = textBlock.setTitle(dto.title)
        if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)
        return textBlock
      }),
      categories,
      userVote: null,
      incorrectAnswersCount: Integer.create(0, 'Contagem de respostas incorretas'),
      isCompleted: Logical.create(false, 'A resposta do desafio está completada?'),
      results: List.create([]),
      userOutputs: List.create([]),
      createdAt: dto.createdAt,
    }
  }
}
