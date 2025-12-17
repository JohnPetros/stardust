import { mock, type Mock } from 'ts-jest-mocker'

import type { AvatarsRepository } from '#shop/interfaces/AvatarsRepository'
import { CreateAvatarUseCase } from '../CreateAvatarUseCase'
import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'

describe('Create Avatar Use Case', () => {
  let repository: Mock<AvatarsRepository>
  let useCase: CreateAvatarUseCase

  beforeEach(() => {
    repository = mock<AvatarsRepository>()
    repository.add.mockImplementation()
    useCase = new CreateAvatarUseCase(repository)
  })

  it('should create an avatar', async () => {
    const avatarDto = AvatarsFaker.fake().dto

    await useCase.execute({ avatarDto })

    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should always create avatar with isAcquiredByDefault and isSelectedByDefault as false', async () => {
    const avatarDto = AvatarsFaker.fake({
      isAcquiredByDefault: true,
      isSelectedByDefault: true,
    }).dto

    const response = await useCase.execute({ avatarDto })

    expect(response.isAcquiredByDefault).toBe(false)
    expect(response.isSelectedByDefault).toBe(false)
  })

  it('should return the created avatar dto', async () => {
    const avatarDto = AvatarsFaker.fake().dto

    const response = await useCase.execute({ avatarDto })

    expect(response.id).toBe(avatarDto.id)
    expect(response.name).toBe(avatarDto.name)
    expect(response.image).toBe(avatarDto.image)
    expect(response.price).toBe(avatarDto.price)
    expect(response.isAcquiredByDefault).toBe(false)
    expect(response.isSelectedByDefault).toBe(false)
  })
})
