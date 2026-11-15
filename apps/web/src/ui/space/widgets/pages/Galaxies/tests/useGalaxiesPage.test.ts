import { act, renderHook } from '@testing-library/react'

import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'

import { ROUTES } from '@/constants'
import { type Params, useGalaxiesPage } from '../useGalaxiesPage'

function createGalaxy(overrides?: Partial<GalaxySummaryDto>): GalaxySummaryDto {
  return {
    id: 'galaxy-id',
    slug: 'galaxia-de-teste',
    name: 'Galáxia de Teste',
    description: 'Descrição',
    animation: 'galaxia-de-teste.json',
    position: 2,
    status: 'published',
    planetsCount: 1,
    completedPlanetsCount: 0,
    isCurrent: false,
    ...overrides,
  }
}

describe('useGalaxiesPage', () => {
  let enterGalaxy: jest.Mock
  let refetchUser: jest.Mock
  let refetchGalaxies: jest.Mock
  let showError: jest.Mock
  let goTo: jest.Mock

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useGalaxiesPage({
        galaxies: [],
        galaxiesError: '',
        isLoadingGalaxies: false,
        refetchGalaxies,
        enterGalaxy,
        isEnteringGalaxy: false,
        currentGalaxyName: 'Lógica de Programação',
        refetchUser,
        showError,
        navigation: { goTo },
        ...params,
      }),
    )

  beforeEach(() => {
    enterGalaxy = jest.fn().mockResolvedValue(undefined)
    refetchUser = jest.fn().mockResolvedValue(undefined)
    refetchGalaxies = jest.fn()
    showError = jest.fn()
    goTo = jest.fn()
  })

  describe('back action', () => {
    it('should label the back action with the current galaxy name', () => {
      const { result } = Hook()

      expect(result.current.backLabel).toBe('Voltar para Lógica de Programação')
    })

    it('should label the back action only with "Voltar" when there is no galaxy name', () => {
      const { result } = Hook({ currentGalaxyName: null })

      expect(result.current.backLabel).toBe('Voltar')
    })

    it('should go to the space route when going back', () => {
      const { result } = Hook()

      result.current.handleBack()

      expect(goTo).toHaveBeenCalledWith(ROUTES.space)
    })
  })

  describe('query states', () => {
    it('should flag the error state when the query failed and it is not loading', () => {
      const { result } = Hook({ galaxiesError: 'Falha' })

      expect(result.current.hasError).toBe(true)
    })

    it('should not flag the error state while the query is loading', () => {
      const { result } = Hook({ galaxiesError: 'Falha', isLoadingGalaxies: true })

      expect(result.current.hasError).toBe(false)
      expect(result.current.isLoading).toBe(true)
    })

    it('should only refetch the galaxies when retrying', () => {
      const { result } = Hook({ galaxiesError: 'Falha' })

      result.current.handleRetry()

      expect(refetchGalaxies).toHaveBeenCalledTimes(1)
      expect(enterGalaxy).not.toHaveBeenCalled()
      expect(goTo).not.toHaveBeenCalled()
    })
  })

  describe('entering a galaxy', () => {
    it('should enter the galaxy, reload the user and go to the galaxy route on success', async () => {
      const galaxy = createGalaxy()
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(galaxy)
      })

      expect(enterGalaxy).toHaveBeenCalledTimes(1)
      expect(enterGalaxy).toHaveBeenCalledWith('galaxia-de-teste')
      expect(refetchUser).toHaveBeenCalledTimes(1)
      expect(goTo).toHaveBeenCalledWith(ROUTES.galaxy('galaxia-de-teste'))
    })

    it('should mark the galaxy as pending while the request is in flight', async () => {
      let resolveEnter: () => void = () => undefined
      enterGalaxy.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveEnter = resolve
        }),
      )
      const { result } = Hook()

      act(() => {
        void result.current.handleEnter(createGalaxy())
      })

      expect(result.current.pendingGalaxySlug).toBe('galaxia-de-teste')

      await act(async () => {
        resolveEnter()
      })
    })

    it('should ignore new triggers while an entry is pending', async () => {
      let resolveEnter: () => void = () => undefined
      enterGalaxy.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveEnter = resolve
        }),
      )
      const { result } = Hook()

      act(() => {
        void result.current.handleEnter(createGalaxy())
        void result.current.handleEnter(createGalaxy())
        void result.current.handleEnter(createGalaxy({ slug: 'outra', name: 'Outra' }))
      })

      expect(enterGalaxy).toHaveBeenCalledTimes(1)

      await act(async () => {
        resolveEnter()
      })
    })

    it('should ignore the trigger when the action is already entering a galaxy', async () => {
      const { result } = Hook({ isEnteringGalaxy: true })

      await act(async () => {
        await result.current.handleEnter(createGalaxy())
      })

      expect(enterGalaxy).not.toHaveBeenCalled()
    })

    it('should show an error toast with the galaxy name, stay on the page and release the pending slug on failure', async () => {
      enterGalaxy.mockRejectedValue(new Error('falha'))
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(createGalaxy())
      })

      expect(showError).toHaveBeenCalledWith(
        'Não foi possível entrar em Galáxia de Teste. Tente de novo.',
      )
      expect(goTo).not.toHaveBeenCalled()
      expect(refetchUser).not.toHaveBeenCalled()
      expect(result.current.pendingGalaxySlug).toBeNull()
    })

    it('should allow a new attempt after a failure', async () => {
      enterGalaxy.mockRejectedValueOnce(new Error('falha'))
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(createGalaxy())
      })
      await act(async () => {
        await result.current.handleEnter(createGalaxy())
      })

      expect(enterGalaxy).toHaveBeenCalledTimes(2)
      expect(goTo).toHaveBeenCalledWith(ROUTES.galaxy('galaxia-de-teste'))
    })

    it('should still navigate when reloading the user fails after entering', async () => {
      refetchUser.mockRejectedValue(new Error('falha'))
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(createGalaxy())
      })

      expect(showError).not.toHaveBeenCalled()
      expect(goTo).toHaveBeenCalledWith(ROUTES.galaxy('galaxia-de-teste'))
    })

    it('should navigate to the galaxy without a request when it is the current one', async () => {
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(
          createGalaxy({ slug: 'logica-de-programacao', isCurrent: true }),
        )
      })

      expect(goTo).toHaveBeenCalledWith(ROUTES.galaxy('logica-de-programacao'))
      expect(enterGalaxy).not.toHaveBeenCalled()
      expect(refetchUser).not.toHaveBeenCalled()
    })

    it('should ignore an announced galaxy', async () => {
      const { result } = Hook()

      await act(async () => {
        await result.current.handleEnter(
          createGalaxy({
            status: 'announced',
            planetsCount: null,
            completedPlanetsCount: null,
          }),
        )
      })

      expect(enterGalaxy).not.toHaveBeenCalled()
      expect(goTo).not.toHaveBeenCalled()
    })
  })
})
