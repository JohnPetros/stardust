import { RestResponse } from '@stardust/core/global/responses'

import { redirect } from 'next/navigation'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'
import Page from '../page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((route: string) => {
    throw new Error(`Redirect: ${route}`)
  }),
}))

jest.mock('@/rest/next/NextServerRestClient', () => ({
  NextServerRestClient: jest.fn(),
}))

jest.mock('@/rest/services', () => ({
  SpaceService: jest.fn(),
}))

describe('Space Page', () => {
  const restClient = {} as Awaited<ReturnType<typeof NextServerRestClient>>
  const spaceService = {
    fetchCurrentGalaxy: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(NextServerRestClient as jest.Mock).mockResolvedValue(restClient)
    ;(SpaceService as jest.Mock).mockReturnValue(spaceService)
  })

  it('should redirect to the current galaxy route', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({
        body: {
          galaxy: {
            id: 'id',
            slug: 'logica-de-programacao',
            name: 'Lógica de Programação',
          },
          isFirstGalaxy: true,
          hasGalaxyChoice: true,
        },
      }),
    )

    await expect(Page()).rejects.toThrow('Redirect: /space/logica-de-programacao')

    expect(redirect).toHaveBeenCalledWith('/space/logica-de-programacao')
  })

  it('should resolve the current galaxy without cache', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({
        body: {
          galaxy: {
            id: 'id',
            slug: 'logica-de-programacao',
            name: 'Lógica de Programação',
          },
          isFirstGalaxy: true,
          hasGalaxyChoice: false,
        },
      }),
    )

    await expect(Page()).rejects.toThrow('Redirect')

    expect(NextServerRestClient).toHaveBeenCalledWith({ isCacheEnabled: false })
    expect(SpaceService).toHaveBeenCalledWith(restClient)
  })

  it('should throw the response error when the current galaxy request fails', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Galáxia não encontrada' }),
    )

    await expect(Page()).rejects.toThrow('Galáxia não encontrada')

    expect(redirect).not.toHaveBeenCalled()
  })
})
