import { mock } from 'ts-jest-mocker'
import { EditStarAvailabilityUseCase } from '../EditStarAvailabilityUseCase'
import type { StarsRepository } from '../../interfaces'
import { StarsFaker } from '../../domain/entities/tests/fakers'
import { StarNotFoundError } from '../../domain/errors'
import { faker } from '@faker-js/faker'

describe('EditStarAvailabilityUseCase', () => {
  let useCase: EditStarAvailabilityUseCase
  let repository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    repository = mock<StarsRepository>()
    useCase = new EditStarAvailabilityUseCase(repository)
  })

  it('should edit the availability of a star', async () => {
    const star = StarsFaker.fake({ isAvailable: false })
    repository.findById.mockResolvedValue(star)
    repository.replace.mockResolvedValue()

    const result = await useCase.execute({ starId: star.id.value, isAvailable: true })

    expect(repository.findById).toHaveBeenCalledWith(star.id)
    expect(repository.replace).toHaveBeenCalledWith(expect.objectContaining({
      isAvailable: expect.objectContaining({ value: true })
    }))
    expect(result).toEqual(expect.objectContaining({ isAvailable: true }))
  })

  it('should throw an error if the star is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ starId: faker.string.uuid(), isAvailable: true })).rejects.toThrow(StarNotFoundError)
  })
})
