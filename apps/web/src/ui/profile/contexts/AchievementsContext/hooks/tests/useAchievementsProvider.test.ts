import { fireEvent, renderHook, waitFor } from '@testing-library/react'

import { AchievementsFaker, UsersFaker } from '@stardust/core/fakers/entities'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AppError } from '@stardust/core/global/errors'
import { ApiResponse } from '@stardust/core/global/responses'

import { alertDialogRefMock } from '@/ui/global/widgets/components/AlertDialog/tests/mocks/alertDialogRefMock'
import { useAuthContextMock } from '@/ui/auth/contexts/AuthContext/tests/mocks'
import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { useApiMock } from '@/ui/global/hooks/tests/mocks/useApiMock'
import { useAchivementsProvider } from '../useAchievementsProvider'

jest.mock('@/ui/global/contexts/AuthContext')
jest.mock('@/ui/global/contexts/ToastContext')
jest.mock('@/ui/global/hooks')

const observeNewUnlockedAchievementsMock = jest.fn()

describe('useAchievementsProvider hook', () => {
  beforeAll(() => {
    useAuthContextMock()
    useToastContextMock()
    useApiMock()
  })

  it('should open the new unlocked achievements alert dialog on set the new unlocked achievements state', async () => {
    renderHook(() => useAchivementsProvider(alertDialogRefMock))

    await waitFor(() => {
      expect(alertDialogRefMock.current.open).not.toHaveBeenCalled()
    })

    observeNewUnlockedAchievementsMock.mockResolvedValue({
      user: UsersFaker.fake(),
      newUnlockedAchievements: AchievementsFaker.fakeMany(),
    })

    renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      expect(alertDialogRefMock.current.open).toHaveBeenCalled()
    })
  })

  it('should set the new unlocked achievements state to the achievements returned by server action obserser on listen to user changes', async () => {
    const fakeUnlockedAchievements = AchievementsFaker.fakeMany()

    observeNewUnlockedAchievementsMock.mockResolvedValue({
      user: UsersFaker.fake(),
      newUnlockedAchievements: fakeUnlockedAchievements,
    })

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      expect(result.current.newUnlockedAchievements).toEqual(fakeUnlockedAchievements)
    })
  })

  it('should update user cache with the date returned by server action obserser on listen to user changes', async () => {
    const { updateUserMock } = useAuthContextMock()

    const fakeUpdatedUser = UsersFaker.fake()

    observeNewUnlockedAchievementsMock.mockResolvedValue({
      user: fakeUpdatedUser,
      newUnlockedAchievements: AchievementsFaker.fakeMany(),
    })

    renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(fakeUpdatedUser)
    })
  })

  it('should show toast if there is an error on observe new unlocked achievements', async () => {
    const { showMock } = useToastContextMock()

    observeNewUnlockedAchievementsMock.mockRejectedValue(
      new AppError('fake error message'),
    )

    renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('fake error message')
    })
  })

  it('should close the new unlocked achievements dialog on close', async () => {
    observeNewUnlockedAchievementsMock.mockResolvedValue({
      user: UsersFaker.fake(),
      newUnlockedAchievements: AchievementsFaker.fakeMany(),
    })

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      result.current.handleNewUnlockedAchievementsAlertDialogClose(false)
      expect(alertDialogRefMock.current.close).toHaveBeenCalled()
    })
  })

  it('should reset new unlocked achievements state on close the new unlocked achievements alert dialog', async () => {
    observeNewUnlockedAchievementsMock.mockResolvedValue({
      user: UsersFaker.fake(),
      newUnlockedAchievements: AchievementsFaker.fakeMany(),
    })

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    fireEvent(window, new Event('userChange'))

    await waitFor(() => {
      result.current.handleNewUnlockedAchievementsAlertDialogClose(false)
      expect(result.current.newUnlockedAchievements).toEqual([])
    })
  })

  it('should delete rescuable achievement using api', async () => {
    const { fakeUser } = useAuthContextMock()

    const apiMock = useApiMock({
      deleteRescuableAchievement: jest.fn().mockResolvedValue(new ApiResponse()),
    })

    const fakeRescuableAchievement = AchievementsFaker.fake()

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    await result.current.rescueAchivement(
      fakeRescuableAchievement.id,
      fakeRescuableAchievement.reward.value,
    )

    expect(apiMock.deleteRescuableAchievement).toHaveBeenCalledWith(
      fakeRescuableAchievement.id,
      fakeUser.id,
    )
  })

  it('should show toast if there is an error on delete rescuable achievement using api', async () => {
    const { updateUserMock } = useAuthContextMock()
    const { showMock } = useToastContextMock()

    useApiMock({
      deleteRescuableAchievement: jest
        .fn()
        .mockResolvedValue(new ApiResponse({ statusCode: HTTP_STATUS_CODE.serverError })),
    })

    const fakeRescuableAchievement = AchievementsFaker.fake()

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    await result.current.rescueAchivement(
      fakeRescuableAchievement.id,
      fakeRescuableAchievement.reward.value,
    )

    expect(showMock).toHaveBeenCalledWith(new AppError().message, expect.anything())
    expect(updateUserMock).not.toHaveBeenCalled()
  })

  it('should update user chache on delete rescuable achievement', async () => {
    const fakeUser = UsersFaker.fake({ coins: 0, rescuableAchievementsIds: [] })
    const fakeRescuableAchievement = AchievementsFaker.fake()

    fakeUser.unlockAchievement(fakeRescuableAchievement.id)
    expect(fakeUser.rescueableAchievementsCount.value).toBe(1)

    const { updateUserMock } = useAuthContextMock({ user: fakeUser })

    useApiMock({
      deleteRescuableAchievement: jest.fn().mockResolvedValue(new ApiResponse()),
    })

    const { result } = renderHook(() => useAchivementsProvider(alertDialogRefMock))

    await result.current.rescueAchivement(
      fakeRescuableAchievement.id,
      fakeRescuableAchievement.reward.value,
    )

    expect(fakeUser.rescueableAchievementsCount.value).toBe(0)
    expect(fakeUser.coins.value).toBe(fakeRescuableAchievement.reward.value)

    expect(updateUserMock).toHaveBeenCalledWith(fakeUser)
  })
})
