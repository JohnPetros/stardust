import { mock, type Mock } from 'ts-jest-mocker'

import type { InsigniasRepository } from '#shop/interfaces/InsigniasRepository'
import { InsigniaNotFoundError } from '#shop/domain/errors/InsigniaNotFoundError'
import { InsigniasFaker } from '#shop/domain/entities/fakers/InsigniasFaker'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { DeleteInsigniaUseCase } from '../DeleteInsigniaUseCase'

describe('Delete Insignia Use Case', () => {
  let repository: Mock<InsigniasRepository>
  let useCase: DeleteInsigniaUseCase

  beforeEach(() => {
    repository = mock<InsigniasRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteInsigniaUseCase(repository)
  })

  it('should throw an error if the insignia does not exist', async () => {
    const nonExistentId = IdFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        insigniaId: nonExistentId.value,
      }),
    ).rejects.toThrow(InsigniaNotFoundError)
  })

  it('should remove the insignia from the repository', async () => {
    const insignia = InsigniasFaker.fake()
    repository.findById.mockResolvedValue(insignia)

    await useCase.execute({
      insigniaId: insignia.id.value,
    })

    expect(repository.remove).toHaveBeenCalledTimes(1)
    expect(repository.remove).toHaveBeenCalledWith(insignia.id)
  })
})
