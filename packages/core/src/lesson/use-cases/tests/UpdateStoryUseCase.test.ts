import { mock, type Mock } from 'ts-jest-mocker'
import { UpdateStoryUseCase } from '../UpdateStoryUseCase'
import type { StoriesRepository } from '../../interfaces/StoriesRepository'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { Text } from '#global/domain/structures/Text'

describe('Update Story Use Case', () => {
  let repositoryMock: Mock<StoriesRepository>
  let useCase: UpdateStoryUseCase

  beforeEach(() => {
    repositoryMock = mock<StoriesRepository>()
    repositoryMock.update.mockImplementation()
    useCase = new UpdateStoryUseCase(repositoryMock)
  })

  it('should update the story and return the updated value', async () => {
    const starId = IdFaker.fake().value
    const story = 'A new story for the star.'
    repositoryMock.update.mockResolvedValue(undefined)

    const result = await useCase.execute({ starId, story })
    expect(result).toBe(story)
    expect(repositoryMock.update).toHaveBeenCalledWith(
      expect.any(Text),
      expect.objectContaining({ value: starId }),
    )
  })
})
