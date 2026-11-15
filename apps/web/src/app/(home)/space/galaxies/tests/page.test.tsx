import { RestResponse } from '@stardust/core/global/responses'

import { redirect } from 'next/navigation'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'
import { GalaxiesPage } from '@/ui/space/widgets/pages/Galaxies'
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

jest.mock('@/ui/space/widgets/pages/Galaxies', () => ({
  GalaxiesPage: () => null,
}))

describe('Galaxies Page', () => {
  const restClient = {} as Awaited<ReturnType<typeof NextServerRestClient>>
  const spaceService = {
    fetchCurrentGalaxy: jest.fn(),
  }

  function createCurrentGalaxyResponse(hasGalaxyChoice: boolean) {
    return new RestResponse({
      body: {
        galaxy: {
          id: 'id',
          slug: 'logica-de-programacao',
          name: 'Lógica de Programação',
        },
        isFirstGalaxy: true,
        hasGalaxyChoice,
      },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(NextServerRestClient as jest.Mock).mockResolvedValue(restClient)
    ;(SpaceService as jest.Mock).mockReturnValue(spaceService)
  })

  it('should render the galaxies page when there are two or more visible galaxies', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(createCurrentGalaxyResponse(true))

    const result = await Page()

    expect(result.type).toBe(GalaxiesPage)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should redirect to the space route on the server when there is a single visible galaxy', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(createCurrentGalaxyResponse(false))

    await expect(Page()).rejects.toThrow('Redirect: /space')

    expect(redirect).toHaveBeenCalledWith('/space')
  })

  it('should resolve the current galaxy without cache', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(createCurrentGalaxyResponse(true))

    await Page()

    expect(NextServerRestClient).toHaveBeenCalledWith({ isCacheEnabled: false })
  })

  it('should render the galaxies page so the client handles the failure when the request fails', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Erro interno' }),
    )

    const result = await Page()

    expect(result.type).toBe(GalaxiesPage)
    expect(redirect).not.toHaveBeenCalled()
  })
})
