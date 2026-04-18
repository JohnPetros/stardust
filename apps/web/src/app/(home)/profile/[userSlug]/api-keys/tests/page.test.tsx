import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import { RestResponse } from '@stardust/core/global/responses'

import { AuthService, ProfileService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import Page from '../page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not found')
  }),
}))

jest.mock('@/rest/next/NextServerRestClient', () => ({
  NextServerRestClient: jest.fn(),
}))

jest.mock('@/rest/services', () => ({
  AuthService: jest.fn(),
  ProfileService: jest.fn(),
}))

jest.mock('@/ui/profile/widgets/pages/ApiKeys', () => ({
  ApiKeysPage: () => null,
}))

describe('API Keys Page', () => {
  const restClient = {} as Awaited<ReturnType<typeof NextServerRestClient>>
  const authService = {
    fetchAccount: jest.fn(),
  }
  const profileService = {
    fetchUserById: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(NextServerRestClient as jest.Mock).mockResolvedValue(restClient)
    ;(AuthService as jest.Mock).mockReturnValue(authService)
    ;(ProfileService as jest.Mock).mockReturnValue(profileService)
  })

  it('should render the page for the authenticated engineer owner', async () => {
    const userDto = UsersFaker.fakeDto({
      slug: 'john-doe',
      insigniaRoles: ['engineer'],
    })

    authService.fetchAccount.mockResolvedValue(
      new RestResponse({
        body: {
          id: userDto.id,
          email: userDto.email,
          name: userDto.name,
          isAuthenticated: true,
        },
      }),
    )
    profileService.fetchUserById.mockResolvedValue(new RestResponse({ body: userDto }))

    const result = await Page({ params: Promise.resolve({ userSlug: 'john-doe' }) })

    expect(NextServerRestClient).toHaveBeenCalled()
    expect(AuthService).toHaveBeenCalledWith(restClient)
    expect(ProfileService).toHaveBeenCalledWith(restClient)
    expect(profileService.fetchUserById).toHaveBeenCalled()
    expect(typeof result.type).toBe('function')
  })

  it('should call notFound when the account request fails', async () => {
    authService.fetchAccount.mockResolvedValue(
      new RestResponse({ statusCode: 401, errorMessage: 'Unauthorized' }),
    )

    await expect(
      Page({ params: Promise.resolve({ userSlug: 'john-doe' }) }),
    ).rejects.toThrow('Not found')

    expect(profileService.fetchUserById).not.toHaveBeenCalled()
  })

  it('should call notFound when the route slug does not belong to the authenticated user', async () => {
    const userDto = UsersFaker.fakeDto({
      slug: 'john-doe',
      insigniaRoles: ['engineer'],
    })

    authService.fetchAccount.mockResolvedValue(
      new RestResponse({
        body: {
          id: userDto.id,
          email: userDto.email,
          name: userDto.name,
          isAuthenticated: true,
        },
      }),
    )
    profileService.fetchUserById.mockResolvedValue(new RestResponse({ body: userDto }))

    await expect(
      Page({ params: Promise.resolve({ userSlug: 'mary-doe' }) }),
    ).rejects.toThrow('Not found')
  })

  it('should call notFound when the authenticated user is not an engineer', async () => {
    const userDto = UsersFaker.fakeDto({
      slug: 'john-doe',
      insigniaRoles: [],
    })

    authService.fetchAccount.mockResolvedValue(
      new RestResponse({
        body: {
          id: userDto.id,
          email: userDto.email,
          name: userDto.name,
          isAuthenticated: true,
        },
      }),
    )
    profileService.fetchUserById.mockResolvedValue(new RestResponse({ body: userDto }))

    await expect(
      Page({ params: Promise.resolve({ userSlug: 'john-doe' }) }),
    ).rejects.toThrow('Not found')
  })
})
