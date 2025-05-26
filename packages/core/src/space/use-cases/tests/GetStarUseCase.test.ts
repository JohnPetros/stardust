import { mock, type Mock } from 'ts-jest-mocker'

import type { StarsRepository } from '#space/interfaces/StarsRepository'
import { GetStarUseCase } from '../GetStarUseCase'
import { StarNotFoundError } from '#space/domain/errors/StarNotFoundError'
import { Slug } from '#global/domain/structures/Slug'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'

describe('Get Star Use Case', () => {
  let repository: Mock<StarsRepository>
  let useCase: GetStarUseCase

  beforeEach(() => {
    repository = mock<StarsRepository>()
    repository.findBySlug.mockImplementation()
    useCase = new GetStarUseCase(repository)
  })

  it('should throw an error if no star is found', async () => {
    await expect(
      useCase.execute({ starSlug: Slug.create('random-slug').value }),
    ).rejects.toThrow(StarNotFoundError)
  })

  it('should return the star found', async () => {
    const star = StarsFaker.fake()
    repository.findBySlug.mockResolvedValue(star)

    const starDto = await useCase.execute({ starSlug: star.slug.value })

    expect(starDto).toEqual(star.dto)
  })
})
