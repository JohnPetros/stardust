import { mock, type Mock } from 'ts-jest-mocker'

import { InsigniasFaker } from '#shop/domain/entities/fakers/InsigniasFaker'
import { CreateInsigniaUseCase } from '../CreateInsigniaUseCase'
import { InsigniaAlreadyExistsError } from '#shop/domain/errors/InsigniaAlreadyExistsError'
import type { InsigniasRepository } from '#shop/interfaces/InsigniasRepository'

describe('Create Insignia Use Case', () => {
  let repository: Mock<InsigniasRepository>
  let useCase: CreateInsigniaUseCase

  beforeEach(() => {
    repository = mock<InsigniasRepository>()
    repository.findByRole.mockImplementation()
    repository.add.mockImplementation()
    useCase = new CreateInsigniaUseCase(repository)
  })

  it('should throw an error if an insignia with the same role already exists', async () => {
    const existingInsignia = InsigniasFaker.fake()
    const newInsignia = InsigniasFaker.fake({ role: existingInsignia.role.value })
    repository.findByRole.mockResolvedValue(existingInsignia)

    await expect(
      useCase.execute({
        insigniaDto: newInsignia.dto,
      }),
    ).rejects.toThrow(InsigniaAlreadyExistsError)
  })

  it('should create an insignia and add it to the repository', async () => {
    const insignia = InsigniasFaker.fake()
    const insigniaDto = insignia.dto
    repository.findByRole.mockResolvedValue(null)

    const result = await useCase.execute({
      insigniaDto,
    })

    expect(repository.findByRole).toHaveBeenCalledTimes(1)
    expect(repository.findByRole).toHaveBeenCalledWith(insignia.role)
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add.mock.calls[0][0].dto).toEqual(insigniaDto)
    expect(result).toEqual(insigniaDto)
  })
})
