import { mock, type Mock } from 'ts-jest-mocker'

import { Slug } from '#global/domain/structures/Slug'
import type { GalaxiesRepository } from '../../interfaces'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { GalaxyNotEnterableError, GalaxyNotFoundError } from '../../domain/errors'
import { GetGalaxyUseCase } from '../GetGalaxyUseCase'

describe('Get Galaxy Use Case', () => {
  let galaxiesRepository: Mock<GalaxiesRepository>
  let useCase: GetGalaxyUseCase

  beforeEach(() => {
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findBySlug.mockImplementation()
    useCase = new GetGalaxyUseCase(galaxiesRepository)
  })

  it('should return the published galaxy by its slug', async () => {
    const galaxy = GalaxiesFaker.fake({ status: 'published' })
    galaxiesRepository.findBySlug.mockResolvedValue(galaxy)

    const response = await useCase.execute({
      galaxySlug: galaxy.slug.value,
      shouldBeEnterable: true,
    })

    expect(galaxiesRepository.findBySlug).toHaveBeenCalledWith(
      Slug.create(galaxy.slug.value),
    )
    expect(response).toEqual(galaxy.dto)
  })

  it('should throw GalaxyNotFoundError when the galaxy does not exist', async () => {
    galaxiesRepository.findBySlug.mockResolvedValue(null)

    await expect(
      useCase.execute({ galaxySlug: 'inexistente', shouldBeEnterable: true }),
    ).rejects.toThrow(GalaxyNotFoundError)
  })

  it('should throw GalaxyNotFoundError when the galaxy is unpublished', async () => {
    const galaxy = GalaxiesFaker.fake({ status: 'unpublished' })
    galaxiesRepository.findBySlug.mockResolvedValue(galaxy)

    await expect(
      useCase.execute({ galaxySlug: galaxy.slug.value, shouldBeEnterable: true }),
    ).rejects.toThrow(GalaxyNotFoundError)
    await expect(
      useCase.execute({ galaxySlug: galaxy.slug.value, shouldBeEnterable: false }),
    ).rejects.toThrow(GalaxyNotFoundError)
  })

  it('should throw GalaxyNotEnterableError when the galaxy is announced and should be enterable', async () => {
    const galaxy = GalaxiesFaker.fake({ status: 'announced' })
    galaxiesRepository.findBySlug.mockResolvedValue(galaxy)

    await expect(
      useCase.execute({ galaxySlug: galaxy.slug.value, shouldBeEnterable: true }),
    ).rejects.toThrow(GalaxyNotEnterableError)
  })

  it('should return the announced galaxy when it does not need to be enterable', async () => {
    const galaxy = GalaxiesFaker.fake({ status: 'announced' })
    galaxiesRepository.findBySlug.mockResolvedValue(galaxy)

    const response = await useCase.execute({
      galaxySlug: galaxy.slug.value,
      shouldBeEnterable: false,
    })

    expect(response).toEqual(galaxy.dto)
  })
})
