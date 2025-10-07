import { mock, type Mock } from 'ts-jest-mocker'

import { User } from '@stardust/core/global/entities'
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
  let service: Mock<ProfileService>
  let controller: Controller

  const userId = 'test-user-id'
  const user: UserDto = UsersFaker.fakeDto({
    id: userId,
    slug: 'test-user-slug',
    name: 'Test User',
    email: 'test@example.com',
  })

  beforeEach(() => {
    http = mock()
    service = mock<ProfileService>()
    controller = AccessProfilePageController(service)
  })

  it('should fetch user by id and redirect to profile page', async () => {
    http.getRouteParams.mockReturnValue({ userId })
    service.fetchUserById.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: user }),
    )

    await controller.handle(http)

    expect(service.fetchUserById).toHaveBeenCalledWith(Id.create(userId))
    expect(http.redirect).toHaveBeenCalledWith(ROUTES.profile.user(user.slug as string))
  })

  it('should call service with correct Id structure', async () => {
    http.getRouteParams.mockReturnValue({ userId })
    service.fetchUserById.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: user }),
    )

    await controller.handle(http)

    const expectedUser = User.create(user)
    expect(service.fetchUserById).toHaveBeenCalledWith(expectedUser.id)
  })

  it('should throw error when user is not found', async () => {
    http.getRouteParams.mockReturnValue({ userId })
    const errorResponse = new RestResponse<UserDto>({
      statusCode: HTTP_STATUS_CODE.notFound,
      errorMessage: 'User not found',
    })
    service.fetchUserById.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(service.fetchUserById).toHaveBeenCalledWith(Id.create(userId))
  })

  it('should throw error when service returns failure response', async () => {
    http.getRouteParams.mockReturnValue({ userId })
    const errorResponse = new RestResponse<UserDto>({
      statusCode: HTTP_STATUS_CODE.serverError,
      errorMessage: 'Internal server error',
    })
    service.fetchUserById.mockResolvedValue(errorResponse)

    await expect(controller.handle(http)).rejects.toThrow()
    expect(service.fetchUserById).toHaveBeenCalledWith(Id.create(userId))
  })

  it('should extract userId from route params correctly', async () => {
    const customUserId = 'custom-user-id-123'
    http.getRouteParams.mockReturnValue({ userId: customUserId })
    service.fetchUserById.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: user }),
    )

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(service.fetchUserById).toHaveBeenCalledWith(Id.create(customUserId))
  })

  it('should redirect to correct profile URL with user slug', async () => {
    const userWithCustomSlug = UsersFaker.fakeDto({
      id: userId,
      slug: 'custom-user-slug-123',
    })

    http.getRouteParams.mockReturnValue({ userId })
    service.fetchUserById.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: userWithCustomSlug }),
    )

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(
      ROUTES.profile.user(userWithCustomSlug.slug as string),
    )
  })

  it('should create User entity from response body before redirecting', async () => {
    http.getRouteParams.mockReturnValue({ userId })
    service.fetchUserById.mockResolvedValue(
      new RestResponse({ statusCode: HTTP_STATUS_CODE.ok, body: user }),
    )

    await controller.handle(http)

    // Verify that the redirect uses the slug from the User entity
    const expectedUser = User.create(user)
    expect(http.redirect).toHaveBeenCalledWith(
      ROUTES.profile.user(expectedUser.slug.value),
    )
  })
})
