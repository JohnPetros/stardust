import { mock, type Mock } from 'ts-jest-mocker'

import type { RocketsRepository } from '#shop/interfaces/RocketsRepository'
import { CreateRocketUseCase } from '../CreateRocketUseCase'
import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'

describe('Create Rocket Use Case', () => {
  let repository: Mock<RocketsRepository>
  let useCase: CreateRocketUseCase

  beforeEach(() => {
    repository = mock<RocketsRepository>()
    repository.add.mockImplementation()
    repository.replace.mockImplementation()
    repository.findSelectedByDefault.mockResolvedValue(null)
    useCase = new CreateRocketUseCase(repository)
  })

  it('should create a rocket', async () => {
    const rocketDto = RocketsFaker.fake().dto

    await useCase.execute({ rocketDto })

    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should create rocket with isAcquiredByDefault and isSelectedByDefault as true', async () => {
    const rocketDto = RocketsFaker.fake({
      isAcquiredByDefault: true,
      isSelectedByDefault: true,
    }).dto

    const response = await useCase.execute({ rocketDto })

    expect(response.isAcquiredByDefault).toBe(true)
    expect(response.isSelectedByDefault).toBe(true)
  })

  it('should return the created rocket dto', async () => {
    const rocketDto = RocketsFaker.fake().dto

    const response = await useCase.execute({ rocketDto })

    expect(response.id).toBe(rocketDto.id)
    expect(response.name).toBe(rocketDto.name)
    expect(response.image).toBe(rocketDto.image)
    expect(response.price).toBe(rocketDto.price)
    expect(response.isAcquiredByDefault).toBe(false)
    expect(response.isSelectedByDefault).toBe(false)
  })
})
