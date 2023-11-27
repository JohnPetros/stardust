import { createRef } from 'react'
import { ToastProvider } from '@radix-ui/react-toast'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Space } from '../Space'

import { planetsMock } from '@/__tests__/mocks/planetsMock'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'
import { SpaceContext, SpaceContextValue } from '@/contexts/SpaceContext'
import { usePlanets } from '@/hooks/usePlanets'

jest.mock('next/navigation')
jest.mock('../../../../../../hooks/usePlanets', () => ({
  usePlanets: jest.fn(),
}))

const scrollIntoLastUnlockedStarMock = jest.fn()
const toggleMock = jest.fn()
const lastUnlockedStarPositionMock = 'above'
const lastUnlockedStarIdMock = '424242'

function mockUsePlanet(hasPlanets: boolean = true) {
  ;(usePlanets as jest.Mock).mockImplementation(() => ({
    planets: hasPlanets ? planetsMock : [],
    lastUnlockedStarId: lastUnlockedStarIdMock,
  }))
}

function renderSpace() {
  render(
    <ToastProvider>
      <SpaceContext.Provider
        value={
          {
            scrollIntoLastUnlockedStar: scrollIntoLastUnlockedStarMock,
            lastUnlockedStarPosition: lastUnlockedStarPositionMock,
            lastUnlockedStarRef: createRef<HTMLLIElement>(),
          } as unknown as SpaceContextValue
        }
      >
        <SidebarContext.Provider
          value={
            {
              isOpen: true,
              toggle: toggleMock,
              setIsAchievementsListVisible: jest.fn(),
            } as unknown as SidebarContextValue
          }
        >
          <TooltipProvider>
            <Space planets={planetsMock} />
          </TooltipProvider>
        </SidebarContext.Provider>
      </SpaceContext.Provider>
    </ToastProvider>
  )
}

describe('Space component', () => {
  it('should toggle sidebar on click', async () => {
    mockUsePlanet()

    renderSpace()

    await userEvent.click(screen.getByRole('main'))

    expect(toggleMock).toHaveBeenCalled()
  })

  it('should show page transition animation while planets are not loaded', async () => {
    mockUsePlanet(false)
    renderSpace()

    await waitFor(() => {
      expect(screen.getByTestId('page transition')).toBeVisible()
    })
  })

  it.each(planetsMock)('should render $name planet', async ({ name }) => {
    mockUsePlanet(true)
    renderSpace()

    await waitFor(
      () => {
        expect(screen.getByText(name)).toBeInTheDocument()
      },
      { interval: 5000 }
    )
  })

  it('should show fab button when unlocked star is offscreen', async () => {
    mockUsePlanet(true)
    renderSpace()

    const fabButton = await screen.findByLabelText(
      /Ir até a última estrela desbloqueada/i
    )

    fireEvent.scroll(window, { target: { scrollY: 1000 } })

    await waitFor(() => {
      expect(fabButton).toBeVisible()
    })
  })

  it('should scroll to the last unlocked star', async () => {
    mockUsePlanet(true)
    renderSpace()

    const fabButton = await screen.findByLabelText(
      /Ir até a última estrela desbloqueada/i
    )

    await userEvent.click(fabButton)

    await waitFor(() => {
      expect(scrollIntoLastUnlockedStarMock).toHaveBeenCalled()
    })
  })
})
