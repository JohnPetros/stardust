import type { RocketAggregate } from '@stardust/core/profile/aggregates'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { Integer } from '@stardust/core/global/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAudioContext } from '@/ui/global/hooks/useAudioContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useRocketItem(
  rocket: RocketAggregate,
  rocketPrice: Integer,
  profileService: ProfileService,
) {
  const toast = useToastContext()
  const { playAudio } = useAudioContext()
  const { user, updateUserCache } = useAuthContext()

  async function handleRocketAcquire() {
    if (!user) return false

    const response = await profileService.acquireRocket(rocket, rocketPrice)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return false
    }

    const hasAcquiredRocket =
      Number(response.body.acquiredRocketsIds?.length) > user.acquiredRocketsCount.value

    if (response.isSuccessful && !hasAcquiredRocket) {
      playAudio('switch.wav')
      updateUserCache(response.body)
      return false
    }

    return true
  }

  return {
    handleRocketAcquire,
  }
}
