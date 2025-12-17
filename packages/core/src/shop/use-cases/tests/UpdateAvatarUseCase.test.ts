import { mock, type Mock } from 'ts-jest-mocker'

import type { AvatarsRepository } from '#shop/interfaces/AvatarsRepository'
import { UpdateAvatarUseCase } from '../UpdateAvatarUseCase'
import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'
import { AvatarNotFoundError } from '#shop/domain/errors/AvatarNotFoundError'

describe('Update Avatar Use Case', () => {
  let repository: Mock<AvatarsRepository>
  let useCase: UpdateAvatarUseCase

  beforeEach(() => {
    repository = mock<AvatarsRepository>()
    repository.findById.mockImplementation()
    repository.findSelectedByDefault.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateAvatarUseCase(repository)
  })

  it('should throw an error if the avatar is not found', () => {
    const avatarDto = AvatarsFaker.fake().dto
    repository.findById.mockResolvedValue(null)

    expect(useCase.execute({ avatarDto })).rejects.toThrow(AvatarNotFoundError)
  })

  it('should update the avatar when isSelectedByDefault is false', async () => {
    const existingAvatar = AvatarsFaker.fake({ isSelectedByDefault: false })
    const avatarDto = AvatarsFaker.fake({ isSelectedByDefault: false }).dto
    repository.findById.mockResolvedValue(existingAvatar)

    await useCase.execute({ avatarDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).not.toHaveBeenCalled()
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should update current selected avatar by default when updating with isSelectedByDefault as true', async () => {
    const existingAvatar = AvatarsFaker.fake({ isSelectedByDefault: false })
    const currentSelectedAvatar = AvatarsFaker.fake({ isSelectedByDefault: true })
    const avatarDto = AvatarsFaker.fake({ isSelectedByDefault: true }).dto
    repository.findById.mockResolvedValue(existingAvatar)
    repository.findSelectedByDefault.mockResolvedValue(currentSelectedAvatar)

    await useCase.execute({ avatarDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledTimes(2)
    expect(repository.replace).toHaveBeenNthCalledWith(1, currentSelectedAvatar)
    expect(currentSelectedAvatar.isSelectedByDefault.value).toBe(false)
  })

  it('should update avatar when isSelectedByDefault is true but no avatar is currently selected', async () => {
    const existingAvatar = AvatarsFaker.fake({ isSelectedByDefault: false })
    const avatarDto = AvatarsFaker.fake({ isSelectedByDefault: true }).dto
    repository.findById.mockResolvedValue(existingAvatar)
    repository.findSelectedByDefault.mockResolvedValue(null)

    await useCase.execute({ avatarDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findSelectedByDefault).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledTimes(1)
  })

  it('should return the updated avatar dto', async () => {
    const existingAvatar = AvatarsFaker.fake()
    const avatarDto = AvatarsFaker.fake().dto
    repository.findById.mockResolvedValue(existingAvatar)

    const response = await useCase.execute({ avatarDto })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(response.id).toBe(avatarDto.id)
    expect(response.name).toBe(avatarDto.name)
    expect(response.image).toBe(avatarDto.image)
    expect(response.price).toBe(avatarDto.price)
    expect(response.isAcquiredByDefault).toBe(avatarDto.isAcquiredByDefault)
    expect(response.isSelectedByDefault).toBe(avatarDto.isSelectedByDefault)
  })
})
