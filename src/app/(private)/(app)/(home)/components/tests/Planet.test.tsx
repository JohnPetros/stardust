import { createRef } from 'react'
import { ToastProvider } from '@radix-ui/react-toast'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { render, screen } from '@testing-library/react'

import { Planet } from '../Planet'

import { planetsMock } from '@/__tests__/mocks/core/planetsMock'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'
import { SpaceContext, SpaceContextValue } from '@/contexts/SpaceContext'

const setLastUnlockedStarPositionMock = jest.fn()

jest.mock('next/navigation')
jest.mock('../../../../../../services/api', () => ({
  useApi: jest.fn(),
}))

const toggleMock = jest.fn()

describe('Planet component', () => {
  it('should render correctly', () => {
    const planetMock = planetsMock[0]

    render(
      <ToastProvider>
        <SpaceContext.Provider
          value={
            {
              scrollIntoLastUnlockedStar: jest.fn(),
              setLastUnlockedStarPosition: setLastUnlockedStarPositionMock,
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
              <Planet data={planetMock} lastUnlockedStarId="42" />
            </TooltipProvider>
          </SidebarContext.Provider>
        </SpaceContext.Provider>
      </ToastProvider>
    )

    expect(screen.getByText(planetMock.name)).toBeInTheDocument()
  })
})
