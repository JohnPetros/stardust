import { mock, type Mock } from 'ts-jest-mocker'

import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { Integer } from '#global/domain/structures/Integer'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { AcquireInsigniaUseCase } from '../AcquireInsigniaUseCase'
import type { UsersRepository } from '../../interfaces'

describe('Acquire Insignia Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: AcquireInsigniaUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.addAcquiredInsignia.mockImplementation()
    useCase = new AcquireInsigniaUseCase(repository)
  })

  it('should throw an error if the user is not found', () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        userId: user.id.value,
        insigniaRole: 'engineer',
        insigniaPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should make the user acquire the insignia', async () => {
    const user = UsersFaker.fake()
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(user.acquireInsignia).toHaveBeenCalledTimes(1)
    expect(user.acquireInsignia).toHaveBeenCalledWith(insigniaRole, insigniaPrice)
  })

  it('should replace the user in the repository', async () => {
    const user = UsersFaker.fake()
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(user)
  })

  it('should add the acquired insignia to the repository', async () => {
    const user = UsersFaker.fake()
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(repository.addAcquiredInsignia).toHaveBeenCalledTimes(1)
    expect(repository.addAcquiredInsignia).toHaveBeenCalledWith(insigniaRole, user.id)
  })
})
