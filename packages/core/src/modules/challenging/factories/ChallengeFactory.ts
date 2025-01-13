import { Id, Integer, List, Logical, Name, Slug, TextBlock } from '#global/structs'
import { ChallengeDifficulty, ChallengeFunction, TestCase } from '#challenging/structs'
import type { ChallengeDto } from '#challenging/dtos'
import { ChallengeCategory } from '#challenging/entities'
import { Author } from '#global/entities'
import { Datetime } from '#libs'

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
      docId: dto.docId ? Id.create(dto.docId) : null,
      starId: dto.starId ? Id.create(dto.starId) : null,
      testCases: dto.testCases.map(TestCase.create),
      completionsCount: Integer.create(
        dto.completionsCount ?? 0,
        'Quantidade de vezes que esse desafio foi completado',
      ),
      downvotesCount: Integer.create(dto.downvotesCount ?? 0, 'Contagem de dowvotes'),
      upvotesCount: Integer.create(dto.upvotesCount ?? 0, 'Contagem de upvotes'),
      description: dto.description, // this will be a Text in the future
      function: dto.function
        ? ChallengeFunction.create({
            name: dto.function.name,
            params: dto.function?.params.map((param, index) => ({
              name: param.name,
              value: dto.testCases[0]?.inputs[index],
            })),
          })
        : null,
      textBlocks:
        dto.textBlocks?.map((dto) => {
          let textBlock = TextBlock.create(dto.type, dto.content)
          if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
          if (dto.title) textBlock = textBlock.setTitle(dto.title)
          if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)
          return textBlock
        }) ?? [],
      categories,
      userVote: null,
      isCompleted: Logical.create(false, 'A resposta do desafio está completada?'),
      incorrectAnswersCount: Integer.create(0, 'Contagem de respostas incorretas'),
      results: List.create([]),
      userOutputs: List.create([]),
      postedAt: dto.postedAt ?? new Datetime().date(),
    }
  }
}
