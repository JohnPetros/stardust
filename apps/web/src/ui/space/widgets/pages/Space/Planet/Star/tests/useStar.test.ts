import { act, renderHook } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { ROUTES } from '@/constants'
import { useStar } from '../useStar'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'

const useNavigationProviderMock = jest.fn()
const useAudioContextMock = jest.fn()

jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: () => useNavigationProviderMock(),
}))

jest.mock('@/ui/global/hooks/useAudioContext', () => ({
  useAudioContext: () => useAudioContextMock(),
}))

describe('useStar', () => {
  let challengingService: Mock<ChallengingService>
  let playAudio: jest.Mock
  let goTo: jest.Mock
  let scrollIntoLastUnlockedStar: jest.Mock
  let setLastUnlockedStarPosition: jest.Mock
  let starAnimationRef: React.RefObject<AnimationRef | null>
  let lastUnlockedStarPosition: 'above' | 'in' | 'bellow'

  const star = ChallengesFaker.fake()
  const starId = IdFaker.fake()
  const starSlug = star.slug
  const lastUnlockedStarRef = { current: document.createElement('div') }

  const Hook = (isLastUnlockedStar = true) =>
    renderHook(() =>
      useStar({
        starId,
        starSlug,
        isLastUnlockedStar,
        starAnimationRef,
        challengingService,
        lastUnlockedStarRef,
        lastUnlockedStarPosition,
        scrollIntoLastUnlockedStar,
        setLastUnlockedStarPosition,
      }),
    )

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()

    challengingService = mock<ChallengingService>()
    playAudio = jest.fn()
    goTo = jest.fn()
    scrollIntoLastUnlockedStar = jest.fn()
    setLastUnlockedStarPosition = jest.fn()
    lastUnlockedStarPosition = 'in'
    starAnimationRef = {
      current: {
        restart: jest.fn(),
        setSpeed: jest.fn(),
        stopAt: jest.fn(),
      },
    }

    challengingService.fetchChallengeByStarId.mockResolvedValue(
      new RestResponse({ body: star.dto, statusCode: 200 }),
    )

    useNavigationProviderMock.mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '',
    })

    useAudioContextMock.mockReturnValue({
      isAudioDisabled: false,
      playAudio,
      toggleAudioDisability: jest.fn(),
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should play audio and restart animation when star is clicked', () => {
    const { result } = Hook()

    act(() => {
      result.current.handleStarClick()
    })

    expect(playAudio).toHaveBeenCalledWith('star.wav')
    expect(starAnimationRef.current?.restart).toHaveBeenCalled()
  })

  it('should navigate to challenge route when challenge is found', async () => {
    const { result } = Hook()

    act(() => {
      result.current.handleStarClick()
      jest.advanceTimersByTime(50)
    })

    await act(async () => Promise.resolve())

    expect(challengingService.fetchChallengeByStarId).toHaveBeenCalledWith(starId)
    expect(goTo).toHaveBeenCalledWith(
      ROUTES.challenging.challenges.challenge(star.slug.value),
    )
  })

  it('should navigate to lesson route when challenge is not found', async () => {
    challengingService.fetchChallengeByStarId.mockResolvedValueOnce(
      new RestResponse({ statusCode: 404, errorMessage: 'not found' }),
    )

    const { result } = Hook()

    act(() => {
      result.current.handleStarClick()
      jest.advanceTimersByTime(50)
    })

    await act(async () => Promise.resolve())

    expect(goTo).toHaveBeenCalledWith(ROUTES.lesson.star(starSlug.value))
  })

  it('should set last unlocked star position when it is visible', () => {
    Hook(true)

    expect(setLastUnlockedStarPosition).toHaveBeenCalledWith('in')
  })

  it('should scroll into last unlocked star only on first mount', () => {
    Hook(true)

    act(() => {
      jest.advanceTimersByTime(1500)
    })

    expect(scrollIntoLastUnlockedStar).toHaveBeenCalledTimes(1)
  })

  it('should clear pending scroll timeout on unmount', () => {
    const { unmount } = Hook(true)

    unmount()

    act(() => {
      jest.advanceTimersByTime(1500)
    })

    expect(scrollIntoLastUnlockedStar).not.toHaveBeenCalled()
  })
})
