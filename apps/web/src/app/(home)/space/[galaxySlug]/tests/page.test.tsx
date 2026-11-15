import { PlanetsFaker } from '@stardust/core/space/entities/fakers'
import { RestResponse } from '@stardust/core/global/responses'

import { redirect } from 'next/navigation'

import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'
import { SpacePage } from '@/ui/space/widgets/pages/Space'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
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

jest.mock('@/ui/space/contexts/SpaceContext', () => ({
  SpaceProvider: () => null,
}))

jest.mock('@/ui/space/widgets/pages/Space', () => ({
  SpacePage: () => null,
}))

describe('Galaxy Page', () => {
  const restClient = {} as Awaited<ReturnType<typeof NextServerRestClient>>
  const spaceService = {
    fetchCurrentGalaxy: jest.fn(),
    fetchGalaxyPlanets: jest.fn(),
  }
  const currentGalaxy = {
    galaxy: { id: 'id', slug: 'galaxia-de-teste', name: 'Galáxia de Teste' },
    isFirstGalaxy: false,
    hasGalaxyChoice: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(NextServerRestClient as jest.Mock).mockResolvedValue(restClient)
    ;(SpaceService as jest.Mock).mockReturnValue(spaceService)
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ body: currentGalaxy }),
    )
  })

  it('should render the space page with the planets of the current galaxy', async () => {
    const planetsDto = PlanetsFaker.fakeManyDto(2)
    spaceService.fetchGalaxyPlanets.mockResolvedValue(
      new RestResponse({ body: planetsDto }),
    )

    const result = await Page({
      params: Promise.resolve({ galaxySlug: 'galaxia-de-teste' }),
    })

    expect(result.type).toBe(SpaceProvider)
    expect(result.props.planetsDto).toEqual(planetsDto)
    expect(result.props.currentGalaxy).toEqual(currentGalaxy)
    expect(result.props.children.type).toBe(SpacePage)
    expect(spaceService.fetchGalaxyPlanets.mock.calls[0][0].value).toBe(
      'galaxia-de-teste',
    )
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should resolve the current galaxy without cache', async () => {
    spaceService.fetchGalaxyPlanets.mockResolvedValue(new RestResponse({ body: [] }))

    await Page({ params: Promise.resolve({ galaxySlug: 'galaxia-de-teste' }) })

    expect(NextServerRestClient).toHaveBeenCalledWith({ isCacheEnabled: false })
  })

  it('should redirect to the current galaxy when the slug is different', async () => {
    await expect(
      Page({ params: Promise.resolve({ galaxySlug: 'logica-de-programacao' }) }),
    ).rejects.toThrow('Redirect: /space/galaxia-de-teste')

    expect(redirect).toHaveBeenCalledWith('/space/galaxia-de-teste')
    expect(spaceService.fetchGalaxyPlanets).not.toHaveBeenCalled()
  })

  it('should throw the response error when the current galaxy request fails', async () => {
    spaceService.fetchCurrentGalaxy.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Galáxia não encontrada' }),
    )

    await expect(
      Page({ params: Promise.resolve({ galaxySlug: 'galaxia-de-teste' }) }),
    ).rejects.toThrow('Galáxia não encontrada')
  })

  it('should throw the response error when the planets request fails', async () => {
    spaceService.fetchGalaxyPlanets.mockResolvedValue(
      new RestResponse({ statusCode: 404, errorMessage: 'Galáxia não encontrada' }),
    )

    await expect(
      Page({ params: Promise.resolve({ galaxySlug: 'galaxia-de-teste' }) }),
    ).rejects.toThrow('Galáxia não encontrada')
  })
})
