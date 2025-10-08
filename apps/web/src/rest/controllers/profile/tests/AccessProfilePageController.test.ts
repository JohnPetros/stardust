import { mock, type Mock } from 'ts-jest-mocker'

import { Id } from '@stardust/core/global/structures'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { RestResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { AccessProfilePageController } from '../AccessProfilePageController'
import { ROUTES } from '@/constants'

describe('Access Profile Page Controller', () => {
  let http: Mock<Http>
  let profileService: Mock<ProfileService>
  let controller: Controller
  const userDto = UsersFaker.fakeDto()
  const validUserId = '550e8400-e29b-41d4-a716-446655440000'

  beforeEach(() => {
    http = mock()
    profileService = mock<ProfileService>()
    http.getRouteParams.mockImplementation()
    http.redirect.mockImplementation()
    profileService.fetchUserById.mockImplementation()
    controller = AccessProfilePageController(profileService)
  })

  it('should fetch user by id and redirect to profile page', async () => {
    const successResponse = new RestResponse<UserDto>({ body: userDto })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(successResponse)

    await controller.handle(http)

    expect(profileService.fetchUserById).toHaveBeenCalledWith(Id.create(validUserId))
    expect(http.redirect).toHaveBeenCalledWith(
      ROUTES.profile.user(userDto.slug || 'test-slug'),
    )
  })

  it('should call service with correct Id structure', async () => {
    const successResponse = new RestResponse<UserDto>({ body: userDto })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(successResponse)

    await controller.handle(http)

    expect(profileService.fetchUserById).toHaveBeenCalledWith(
      expect.objectContaining({
        value: validUserId,
      }),
    )
  })

  it('should throw error when service returns failure response', async () => {
    const failureResponse = new RestResponse<UserDto>({
      statusCode: HTTP_STATUS_CODE.notFound,
      errorMessage: 'User not found',
    })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(failureResponse)

    await expect(controller.handle(http)).rejects.toThrow()
  })

  it('should extract userId from route params correctly', async () => {
    const successResponse = new RestResponse<UserDto>({ body: userDto })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(successResponse)

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
  })

  it('should redirect to correct profile URL with user slug', async () => {
    const successResponse = new RestResponse<UserDto>({ body: userDto })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(successResponse)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(
      ROUTES.profile.user(userDto.slug || 'test-slug'),
    )
  })

  it('should create User entity from response body before redirecting', async () => {
    const successResponse = new RestResponse<UserDto>({ body: userDto })
    http.getRouteParams.mockReturnValue({ userId: validUserId })
    profileService.fetchUserById.mockResolvedValue(successResponse)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(
      expect.stringContaining(userDto.slug || 'test-slug'),
    )
  })
})
