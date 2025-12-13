import { mock, type Mock } from 'ts-jest-mocker'

import { InsigniasFaker } from '#shop/domain/entities/fakers/InsigniasFaker'
import { UpdateInsigniaUseCase } from '../UpdateInsigniaUseCase'
import { InsigniaNotFoundError } from '#shop/domain/errors/InsigniaNotFoundError'
import { InsigniaAlreadyExistsError } from '#shop/domain/errors/InsigniaAlreadyExistsError'
import type { InsigniasRepository } from '#shop/interfaces/InsigniasRepository'

describe('Update Insignia Use Case', () => {
  let repository: Mock<InsigniasRepository>
  let useCase: UpdateInsigniaUseCase

  beforeEach(() => {
    repository = mock<InsigniasRepository>()
    repository.findById.mockImplementation()
    repository.findByRole.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateInsigniaUseCase(repository)
  })

  it('should throw an error if the insignia does not exist', async () => {
    const insignia = InsigniasFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        insigniaDto: insignia.dto,
      }),
    ).rejects.toThrow(InsigniaNotFoundError)
  })

  it('should update an insignia and replace it in the repository when role does not change', async () => {
    const existingInsignia = InsigniasFaker.fake()
    const updatedInsignia = InsigniasFaker.fake({
      id: existingInsignia.id.value,
      role: existingInsignia.role.value,
    })
    repository.findById.mockResolvedValue(existingInsignia)

    const result = await useCase.execute({
      insigniaDto: updatedInsignia.dto,
    })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(updatedInsignia.id)
    expect(repository.findByRole).not.toHaveBeenCalled()
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace.mock.calls[0][0].dto).toEqual(updatedInsignia.dto)
    expect(result).toEqual(updatedInsignia.dto)
  })
})
