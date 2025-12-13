import { mock, type Mock } from 'ts-jest-mocker'

import type { AvatarsRepository } from '#shop/interfaces/AvatarsRepository'
import { DeleteAvatarUseCase } from '../DeleteAvatarUseCase'
import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'
import { AvatarNotFoundError } from '#shop/domain/errors/AvatarNotFoundError'
import { Id } from '#global/domain/structures/Id'

describe('Delete Avatar Use Case', () => {
  let repository: Mock<AvatarsRepository>
  let useCase: DeleteAvatarUseCase

  beforeEach(() => {
    repository = mock<AvatarsRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()
    useCase = new DeleteAvatarUseCase(repository)
  })

  it('should throw an error if the avatar is not found', () => {
    repository.findById.mockResolvedValue(null)

    expect(useCase.execute({ avatarId: Id.create().value })).rejects.toThrow(
      AvatarNotFoundError,
    )
  })

  it('should delete the avatar', async () => {
    const avatar = AvatarsFaker.fake()
    repository.findById.mockResolvedValue(avatar)

    await useCase.execute({ avatarId: avatar.id.value })

    expect(repository.remove).toHaveBeenCalledWith(avatar.id)
  })
})
