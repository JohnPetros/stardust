import { mock, type Mock } from 'ts-jest-mocker'

import { GuidesFaker } from '#manual/domain/entities/fakers/GuidesFaker'
import { EditGuideContentUseCase } from '../EditGuideContentUseCase'
import { GuideNotFoundError } from '#manual/domain/errors/GuideNotFoundError'
import type { GuidesRepository } from '#manual/interfaces/GuidesRepository'
import type { EmbeddingProvider } from '#global/interfaces/index'

describe('Edit Guide Content Use Case', () => {
  let repository: Mock<GuidesRepository>
  let embeddingProvider: Mock<EmbeddingProvider>
  let useCase: EditGuideContentUseCase

  beforeEach(() => {
    repository = mock<GuidesRepository>()
    embeddingProvider = mock<EmbeddingProvider>()

    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.addManyEmbeddings.mockImplementation()
    embeddingProvider.generate.mockImplementation()

    useCase = new EditGuideContentUseCase(repository, embeddingProvider)
  })

  it('should throw an error if the guide does not exist', async () => {
    const guide = GuidesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        guideId: guide.id.value,
        guideContent: 'New Content',
      }),
    ).rejects.toThrow(GuideNotFoundError)
  })

  it('should update the guide content', async () => {
    const existingGuide = GuidesFaker.fake()
    const newContent = 'New Guide Content'
    const embeddings = [0.1, 0.2, 0.3]

    repository.findById.mockResolvedValue(existingGuide)
    embeddingProvider.generate.mockResolvedValue(embeddings)

    const result = await useCase.execute({
      guideId: existingGuide.id.value,
      guideContent: newContent,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(existingGuide.id)

    expect(embeddingProvider.generate).toHaveBeenCalledTimes(1)
    expect(embeddingProvider.generate).toHaveBeenCalledWith(
      expect.objectContaining({ value: newContent }),
    )

    expect(repository.replace).toHaveBeenCalledTimes(1)
    const replacedGuide = repository.replace.mock.calls[0][0]
    expect(replacedGuide.id.value).toBe(existingGuide.id.value)
    expect(replacedGuide.content.value).toBe(newContent)

    expect(repository.addManyEmbeddings).toHaveBeenCalledTimes(1)
    expect(repository.addManyEmbeddings).toHaveBeenCalledWith(
      existingGuide.id,
      embeddings,
    )

    expect(result.content).toBe(newContent)
  })
})
