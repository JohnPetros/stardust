import { mock, type Mock } from 'ts-jest-mocker'

import type { TextBlocksRepository } from '../../interfaces/TextBlocksRepository'
import { UpdateTextBlocksUseCase } from '../UpdateTextBlocksUseCase'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { TextBlock } from '#global/domain/structures/TextBlock'

describe('Update Text Blocks Use Case', () => {
  let repositoryMock: Mock<TextBlocksRepository>
  let useCase: UpdateTextBlocksUseCase

  beforeEach(() => {
    repositoryMock = mock<TextBlocksRepository>()
    repositoryMock.updateMany.mockImplementation()
    useCase = new UpdateTextBlocksUseCase(repositoryMock)
  })

  it('should update text blocks and return the updated dtos', async () => {
    const starId = IdFaker.fake().value
    const textBlocks = [
      {
        type: 'default',
        content: 'Texto do bloco padrão',
        picture: 'story-picture.png',
      },
      {
        type: 'code',
        content: 'escreva("Oi")',
        isRunnable: true,
      },
    ]

    repositoryMock.updateMany.mockResolvedValue(undefined)

    const result = await useCase.execute({ starId, textBlocks })

    expect(result).toEqual([
      {
        type: 'default',
        content: 'Texto do bloco padrão',
        picture: 'story-picture.png',
        isRunnable: false,
        title: undefined,
      },
      {
        type: 'code',
        content: 'escreva("Oi")',
        isRunnable: true,
        picture: undefined,
        title: undefined,
      },
    ])
    expect(repositoryMock.updateMany).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(TextBlock), expect.any(TextBlock)]),
      expect.objectContaining({ value: starId }),
    )
  })
})
