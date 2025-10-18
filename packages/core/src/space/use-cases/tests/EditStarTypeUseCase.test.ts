import { mock } from 'ts-jest-mocker'
import { EditStarTypeUseCase } from '../EditStarTypeUseCase'
import type { StarsRepository } from '../../interfaces'
import { StarsFaker } from '../../domain/entities/tests/fakers'
import { StarNotFoundError } from '../../domain/errors'
import { faker } from '@faker-js/faker'

describe('Edit Star Type Use Case', () => {
  let useCase: EditStarTypeUseCase
  let repository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    repository = mock<StarsRepository>()
    useCase = new EditStarTypeUseCase(repository)
  })

  it('should edit the type of a star', async () => {
    const star = StarsFaker.fake({ isChallenge: false })
    repository.findById.mockResolvedValue(star)
    repository.replace.mockResolvedValue()

    const result = await useCase.execute({ starId: star.id.value, isChallenge: true })

    expect(repository.findById).toHaveBeenCalledWith(star.id)
    expect(repository.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        isChallenge: expect.objectContaining({ value: true }),
      }),
    )
    expect(result).toEqual(expect.objectContaining({ isChallenge: true }))
  })

  it('should throw an error if the star is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ starId: faker.string.uuid(), isChallenge: true }),
    ).rejects.toThrow(StarNotFoundError)
  })
})
