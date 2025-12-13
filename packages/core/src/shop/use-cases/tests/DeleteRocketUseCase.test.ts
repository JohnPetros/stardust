import { mock, type Mock } from 'ts-jest-mocker'

import type { RocketsRepository } from '#shop/interfaces/RocketsRepository'
import { DeleteRocketUseCase } from '../DeleteRocketUseCase'
import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'
import { RocketNotFoundError } from '#shop/domain/errors/RocketNotFoundError'
import { Id } from '#global/domain/structures/Id'

describe('Delete Rocket Use Case', () => {
  let repository: Mock<RocketsRepository>
  let useCase: DeleteRocketUseCase

  beforeEach(() => {
    repository = mock<RocketsRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()
    useCase = new DeleteRocketUseCase(repository)
  })

  it('should throw an error if the rocket is not found', () => {
    repository.findById.mockResolvedValue(null)

    expect(useCase.execute({ rocketId: Id.create().value })).rejects.toThrow(
      RocketNotFoundError,
    )
  })

  it('should delete the rocket', async () => {
    const rocket = RocketsFaker.fake()
    repository.findById.mockResolvedValue(rocket)

    await useCase.execute({ rocketId: rocket.id.value })

    expect(repository.remove).toHaveBeenCalledWith(rocket.id)
  })
})
