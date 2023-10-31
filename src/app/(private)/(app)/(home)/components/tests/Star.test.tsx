import { createRef } from 'react'
import { ToastProvider } from '@radix-ui/react-toast'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { useRouter } from 'next/navigation'

import { Star } from '../Star'

import { rocketsMock } from '@/__tests__/mocks/rocketsMock'
import { starsMock } from '@/__tests__/mocks/starsMock'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'
import { SpaceContext, SpaceContextValue } from '@/contexts/SpaceContext'
import { useApi } from '@/services/api'

const starMock = starsMock[0]
const rocketMock = rocketsMock[0]
const challengeIdMock = 'challenge id mock'
const setLastUnlockedStarPositionMock = jest.fn()

jest.mock('next/navigation')
jest.mock('../../../../../../services/api', () => ({
  useApi: jest.fn(),
}))

const toggleMock = jest.fn()

function mockUseRouter() {
  const useRouterMock = jest.mocked(useRouter)
  const pushMock = jest.fn()

  useRouterMock.mockReturnValueOnce({
    push: pushMock,
  } as unknown as AppRouterInstance)

  return { pushMock }
}

function mockUseApi() {
  const getChallengeIdMock = jest.fn()

  ;(useApi as jest.Mock).mockImplementation(() => ({
    getChallengeId: getChallengeIdMock.mockResolvedValueOnce(challengeIdMock),
  }))

  return { getChallengeIdMock }
}

function renderStar(
  isUnlocked: boolean = true,
  isChallenge: boolean = false,
  isLastUnlockedStar: boolean = false
) {
  const scrollIntoLastUnlockedStarMock = jest.fn()

  render(
    <ToastProvider>
      <SpaceContext.Provider
        value={
          {
            spaceRocket: rocketMock,
            scrollIntoLastUnlockedStar: scrollIntoLastUnlockedStarMock,
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
            <Star
              data={{ ...starMock, isUnlocked, isChallenge }}
              isLastUnlockedStar={isLastUnlockedStar}
            />
          </TooltipProvider>
        </SidebarContext.Provider>
      </SpaceContext.Provider>
    </ToastProvider>
  )

  return { scrollIntoLastUnlockedStarMock }
}

describe('Space component', () => {
  it('should render number and name', async () => {
    mockUseApi()
    mockUseRouter()

    renderStar(false)

    expect(screen.getByText(starMock.name)).toBeVisible()
    expect(screen.getByText(starMock.number)).toBeVisible()
  })

  it('should be disable when is not the unlocked', async () => {
    mockUseApi()
    mockUseRouter()

    renderStar(false)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should redirect user to lesson page when is not a challenge', async () => {
    mockUseApi()
    const { pushMock } = mockUseRouter()

    renderStar(true, false)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/lesson/' + starMock.id)
    })
  })

  it('should redirect user to challenge page when is a challenge', async () => {
    mockUseApi()
    const { pushMock } = mockUseRouter()

    renderStar(true, true)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/challenges/' + challengeIdMock)
    })
  })

  it('should render rocket when is the last unlocked star', async () => {
    mockUseApi()
    mockUseRouter()

    renderStar(true, true, true)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(
        screen.getByAltText(`Foguete ${rocketMock.name}`)
      ).toBeInTheDocument()
    })
  })
})
