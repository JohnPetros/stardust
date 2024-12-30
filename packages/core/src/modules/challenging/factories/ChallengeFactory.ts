import { Id, Integer, List, Logical, Name, Slug, TextBlock } from '#global/structs'
import { ChallengeDifficulty, TestCase } from '#challenging/structs'
import type { ChallengeDto } from '#challenging/dtos'
import { ChallengeCategory } from '#challenging/entities'

export class ChallengeFactory {
  static produce(dto: ChallengeDto) {
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
        'Quantidade de vezes que esse desafio foi completado',
        dto.completionsCount,
      ),
      functionName: dto.functionName ? Name.create(dto.functionName) : null,
      downvotesCount: Integer.create('Contagem de dowvotes', dto.downvotesCount),
      upvotesCount: Integer.create('Contagem de upvotes', dto.upvotesCount),
      description: dto.description,
      textBlocks: dto.textBlocks.map((dto) => {
        let textBlock = TextBlock.create(dto.type, dto.content)
        if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
        if (dto.title) textBlock = textBlock.setTitle(dto.title)
        if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)
        return textBlock
      }),
      categories: dto.categories.map(ChallengeCategory.create),
      incorrectAnswersCount: Integer.create('Contagem de respostas incorretas', 0),
      isCompleted: Logical.create('A resposta do desafio está completada?', false),
      results: List.create([]),
      userOutputs: List.create([]),
      createdAt: dto.createdAt,
    }
  }
}
