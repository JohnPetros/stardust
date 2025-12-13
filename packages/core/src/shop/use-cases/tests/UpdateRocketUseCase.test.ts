import { mock, type Mock } from 'ts-jest-mocker'

import type { RocketsRepository } from '#shop/interfaces/RocketsRepository'
import { UpdateRocketUseCase } from '../UpdateRocketUseCase'
import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'
import { RocketNotFoundError } from '#shop/domain/errors/RocketNotFoundError'

describe('Update Rocket Use Case', () => {
  let repository: Mock<RocketsRepository>
  let useCase: UpdateRocketUseCase

  beforeEach(() => {
    repository = mock<RocketsRepository>()
    repository.findById.mockImplementation()
    repository.findSelectedByDefault.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateRocketUseCase(repository)
  })

  it('should throw an error if the rocket is not found', () => {
    const rocketDto = RocketsFaker.fake().dto
    repository.findById.mockResolvedValue(null)

    expect(useCase.execute({ rocketDto })).rejects.toThrow(RocketNotFoundError)
  })

  it('should update the rocket when isSelectedByDefault is false', async () => {
    const existingRocket = RocketsFaker.fake({ isSelectedByDefault: false })
    const rocketDto = RocketsFaker.fake({ isSelectedByDefault: false }).dto
    repository.findById.mockResolvedValue(existingRocket)

    await useCase.execute({ rocketDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).not.toHaveBeenCalled()
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should update current selected rocket by default when updating with isSelectedByDefault as true', async () => {
    const existingRocket = RocketsFaker.fake({ isSelectedByDefault: false })
    const currentSelectedRocket = RocketsFaker.fake({ isSelectedByDefault: true })
    const rocketDto = RocketsFaker.fake({ isSelectedByDefault: true }).dto
    repository.findById.mockResolvedValue(existingRocket)
    repository.findSelectedByDefault.mockResolvedValue(currentSelectedRocket)

    await useCase.execute({ rocketDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledTimes(2)
    expect(repository.replace).toHaveBeenNthCalledWith(1, currentSelectedRocket)
    expect(currentSelectedRocket.isSelectedByDefault.value).toBe(false)
  })

  it('should update rocket when isSelectedByDefault is true but no rocket is currently selected', async () => {
    const existingRocket = RocketsFaker.fake({ isSelectedByDefault: false })
    const rocketDto = RocketsFaker.fake({ isSelectedByDefault: true }).dto
    repository.findById.mockResolvedValue(existingRocket)
    repository.findSelectedByDefault.mockResolvedValue(null)

    await useCase.execute({ rocketDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledTimes(1)
  })

  it('should return the updated rocket dto', async () => {
    const existingRocket = RocketsFaker.fake()
    const rocketDto = RocketsFaker.fake().dto
    repository.findById.mockResolvedValue(existingRocket)

    const response = await useCase.execute({ rocketDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(response.id).toBe(rocketDto.id)
    expect(response.name).toBe(rocketDto.name)
    expect(response.image).toBe(rocketDto.image)
    expect(response.price).toBe(rocketDto.price)
    expect(response.isAcquiredByDefault).toBe(rocketDto.isAcquiredByDefault)
    expect(response.isSelectedByDefault).toBe(rocketDto.isSelectedByDefault)
  })
})
