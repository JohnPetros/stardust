import { mock, type Mock } from 'ts-jest-mocker'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '../../interfaces'
import { SearchEmbeddingsUseCase } from '../SearchEmbeddingsUseCase'
import { Text } from '#global/domain/structures/Text'
import { Integer } from '#global/domain/structures/Integer'
import { EmbeddingNamespace } from '#storage/domain/structures/EmbeddingNamespace'
import { Embedding } from '#storage/domain/structures/Embedding'

describe('Search Embeddings Use Case', () => {
  let generatorProvider: Mock<EmbeddingsGeneratorProvider>
  let storageProvider: Mock<EmbeddingsStorageProvider>
  let useCase: SearchEmbeddingsUseCase

  const validId = '123e4567-e89b-12d3-a456-426614174000'

  beforeEach(() => {
    generatorProvider = mock<EmbeddingsGeneratorProvider>()
    storageProvider = mock<EmbeddingsStorageProvider>()

    // Default mocks
    generatorProvider.generate.mockImplementation()
    storageProvider.search.mockImplementation()

    useCase = new SearchEmbeddingsUseCase(generatorProvider, storageProvider)
  })

  it('should search for embeddings and return results successfully', async () => {
    const request = {
      query: 'search query',
      namespace: 'guides',
      topK: 5,
    }

    const queryEmbedding = Embedding.create({
      id: validId,
      text: request.query,
      vector: [0.1, 0.2, 0.3],
    })

    const searchResultEmbedding = Embedding.create({
      id: '123e4567-e89b-12d3-a456-426614174001',
      text: 'result text',
      vector: [0.4, 0.5, 0.6],
    })

    generatorProvider.generate.mockResolvedValue([queryEmbedding])
    storageProvider.search.mockResolvedValue([searchResultEmbedding])

    const results = await useCase.execute(request)

    expect(results).toEqual(['result text'])

    expect(generatorProvider.generate).toHaveBeenCalledWith(Text.create(request.query))
    expect(storageProvider.search).toHaveBeenCalledWith(
      queryEmbedding.vector,
      Integer.create(request.topK),
      EmbeddingNamespace.create(request.namespace),
    )
  })

  it('should propagate errors from the generator provider', async () => {
    const request = {
      query: 'search query',
      namespace: 'guides',
      topK: 5,
    }

    const error = new Error('Generator failed')
    generatorProvider.generate.mockRejectedValue(error)

    await expect(useCase.execute(request)).rejects.toThrow('Generator failed')

    expect(storageProvider.search).not.toHaveBeenCalled()
  })

  it('should propagate errors from the storage provider', async () => {
    const request = {
      query: 'search query',
      namespace: 'guides',
      topK: 5,
    }

    const queryEmbedding = Embedding.create({
      id: validId,
      text: request.query,
      vector: [0.1, 0.2, 0.3],
    })

    generatorProvider.generate.mockResolvedValue([queryEmbedding])
    const error = new Error('Search failed')
    storageProvider.search.mockRejectedValue(error)

    await expect(useCase.execute(request)).rejects.toThrow('Search failed')
  })
})
