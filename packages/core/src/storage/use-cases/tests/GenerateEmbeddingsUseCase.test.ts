import { mock, type Mock } from 'ts-jest-mocker'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '../../interfaces'
import { GenerateEmbeddingsUseCase } from '../GenerateEmbeddingsUseCase'
import { Text } from '#global/domain/structures/Text'
import { Id } from '#global/domain/structures/Id'
import { EmbeddingNamespace } from '#storage/structures/EmbeddingNamespace'
import { Embedding } from '#storage/structures/Embedding'

describe('Generate Embeddings Use Case', () => {
  let generatorProvider: Mock<EmbeddingsGeneratorProvider>
  let storageProvider: Mock<EmbeddingsStorageProvider>
  let useCase: GenerateEmbeddingsUseCase

  const validId1 = '123e4567-e89b-12d3-a456-426614174000'
  const validId2 = '123e4567-e89b-12d3-a456-426614174001'

  beforeEach(() => {
    generatorProvider = mock<EmbeddingsGeneratorProvider>()
    storageProvider = mock<EmbeddingsStorageProvider>()

    // Default mocks
    generatorProvider.generate.mockImplementation()
    storageProvider.delete.mockImplementation()
    storageProvider.store.mockImplementation()

    useCase = new GenerateEmbeddingsUseCase(generatorProvider, storageProvider)
  })

  it('should generate and store embeddings successfully', async () => {
    const request = {
      namespace: 'guides',
      documentId: validId1,
      content: 'This is some content to embed.',
    }

    const dummyEmbedding = Embedding.create({
      id: validId2,
      text: 'content',
      documentId: validId1,
      vector: [0.1, 0.2],
    })

    generatorProvider.generate.mockResolvedValue([dummyEmbedding])

    await useCase.execute(request)

    expect(generatorProvider.generate).toHaveBeenCalledWith(
      Text.create(request.content),
      Id.create(request.documentId),
    )

    expect(storageProvider.delete).toHaveBeenCalledWith(
      Id.create(request.documentId),
      EmbeddingNamespace.create(request.namespace),
    )

    expect(storageProvider.store).toHaveBeenCalledWith(
      [dummyEmbedding],
      EmbeddingNamespace.create(request.namespace),
    )
  })

  it('should ensure dependencies are called in the correct order', async () => {
    const request = {
      namespace: 'guides',
      documentId: validId1,
      content: 'content',
    }

    const dummyEmbedding = Embedding.create({
      id: validId2,
      text: 'content',
      documentId: validId1,
      vector: [0.1],
    })

    generatorProvider.generate.mockResolvedValue([dummyEmbedding])

    await useCase.execute(request)

    // Check call order
    const generateOrder = generatorProvider.generate.mock.invocationCallOrder[0]
    const deleteOrder = storageProvider.delete.mock.invocationCallOrder[0]
    const storeOrder = storageProvider.store.mock.invocationCallOrder[0]

    expect(generateOrder).toBeLessThan(deleteOrder)
    expect(deleteOrder).toBeLessThan(storeOrder)
  })

  it('should propagate errors from the generator provider', async () => {
    const request = {
      namespace: 'guides',
      documentId: validId1,
      content: 'content',
    }
    const error = new Error('Generator failed')
    generatorProvider.generate.mockRejectedValue(error)

    await expect(useCase.execute(request)).rejects.toThrow('Generator failed')

    expect(storageProvider.delete).not.toHaveBeenCalled()
    expect(storageProvider.store).not.toHaveBeenCalled()
  })

  it('should propagate errors from the storage provider (delete)', async () => {
    const request = {
      namespace: 'guides',
      documentId: validId1,
      content: 'content',
    }
    const dummyEmbedding = Embedding.create({
      id: validId2,
      text: 'content',
      documentId: validId1,
      vector: [0.1],
    })

    generatorProvider.generate.mockResolvedValue([dummyEmbedding])
    const error = new Error('Delete failed')
    storageProvider.delete.mockRejectedValue(error)

    await expect(useCase.execute(request)).rejects.toThrow('Delete failed')

    expect(generatorProvider.generate).toHaveBeenCalledTimes(1)
    expect(storageProvider.store).not.toHaveBeenCalled()
  })
})
