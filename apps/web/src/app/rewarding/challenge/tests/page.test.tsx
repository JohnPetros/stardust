import { notFound } from 'next/navigation'

import { COOKIES } from '@/constants'
import * as cookieActions from '@/rpc/next-safe-action/cookieActions'
import * as rewardingActions from '@/rpc/next-safe-action/rewardingActions'
import { RewardingPage } from '@/ui/lesson/widgets/pages/Rewarding'

import Page from '../page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('Not found')
  }),
}))

jest.mock('@/rpc/next-safe-action/cookieActions', () => ({
  getCookie: jest.fn(),
}))

jest.mock('@/rpc/next-safe-action/rewardingActions', () => ({
  accessRewardForChallengeCompletionPage: jest.fn(),
}))

jest.mock('@/ui/lesson/widgets/pages/Rewarding', () => ({
  RewardingPage: jest.fn(() => null),
}))

describe('Challenge rewarding page', () => {
  const accessRewardForChallengeCompletionPageMock = jest.mocked(
    rewardingActions.accessRewardForChallengeCompletionPage,
  ) as jest.Mock
  const rewardingPayload = {
    secondsCount: 42,
    challengeId: 'challenge-id',
  }
  const rewardingResponse = {
    nextRoute: '/space',
    newLevel: 4,
    newCoins: 100,
    newStreak: 3,
    newWeekStatus: 'completed' as const,
    newXp: 200,
    accuracyPercentage: 80,
    secondsCount: 42,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the rewarding page with the challenge completion response', async () => {
    jest.mocked(cookieActions.getCookie).mockResolvedValue({
      data: JSON.stringify(rewardingPayload),
    })
    accessRewardForChallengeCompletionPageMock.mockResolvedValue({
      data: rewardingResponse,
    })

    const result = await Page()

    expect(cookieActions.getCookie).toHaveBeenCalledWith(COOKIES.keys.rewardingPayload)
    expect(accessRewardForChallengeCompletionPageMock).toHaveBeenCalledWith(
      rewardingPayload,
    )
    expect(result.type).toBe(RewardingPage)
    expect(result.props).toEqual(rewardingResponse)
  })

  it('should call notFound when the rewarding payload cookie is missing', async () => {
    jest.mocked(cookieActions.getCookie).mockResolvedValue({ data: null })

    await expect(Page()).rejects.toThrow('Not found')

    expect(accessRewardForChallengeCompletionPageMock).not.toHaveBeenCalled()
    expect(notFound).toHaveBeenCalled()
  })

  it('should call notFound when the rewarding action has no data', async () => {
    jest.mocked(cookieActions.getCookie).mockResolvedValue({
      data: JSON.stringify(rewardingPayload),
    })
    accessRewardForChallengeCompletionPageMock.mockResolvedValue({ data: undefined })

    await expect(Page()).rejects.toThrow('Not found')

    expect(notFound).toHaveBeenCalled()
  })
})
