import type { AvatarAggregate } from '@stardust/core/profile/aggregates'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { Integer } from '@stardust/core/global/structures'

import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAudioContext } from '@/ui/global/contexts/AudioContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useAvatarItem(
  avatar: AvatarAggregate,
  avatarPrice: Integer,
  profileService: ProfileService,
) {
  const toast = useToastContext()
  const { playAudio } = useAudioContext()
  const { user, updateUserCache } = useAuthContext()

  async function handleAvatarAcquire() {
    if (!user) return false

    const response = await profileService.acquireAvatar(avatar, avatarPrice)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return false
    }

    const hasAcquiredAvatar =
      Number(response.body.acquiredAvatarsIds?.length) > user.acquiredAvatarsCount.value

    if (response.isSuccessful && !hasAcquiredAvatar) {
      playAudio('switch.wav')
      updateUserCache(response.body)
      return false
    }

    return true
  }

  return {
    handleAvatarAcquire,
  }
}
