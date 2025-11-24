import type { AudioProvider, ToastProvider } from '@stardust/core/global/interfaces'
import type { InsigniaRole, Integer } from '@stardust/core/global/structures'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { AUDIO_FILES } from '@/constants'

type Params = {
  insigniaRole: InsigniaRole
  insigniaPrice: Integer
  service: ProfileService
  toastProvider: ToastProvider
  audioProvider: AudioProvider
  acquiredInsigniaRoleCount?: Integer
  onAcquireInsignia: (userDto: UserDto) => void
}

export function useInsigniaItem({
  insigniaRole,
  insigniaPrice,
  service,
  toastProvider,
  audioProvider,
  acquiredInsigniaRoleCount,
  onAcquireInsignia,
}: Params) {
  async function handleInsigniaAcquire() {
    if (!acquiredInsigniaRoleCount) return false

    const response = await service.acquireInsignia(insigniaRole, insigniaPrice)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return false
    }

    const hasAcquiredInsignia = response.body.insigniaRoles
      ? response.body.insigniaRoles.length > acquiredInsigniaRoleCount.value
      : false

    if (response.isSuccessful && !hasAcquiredInsignia) {
      audioProvider.playAudio(AUDIO_FILES.switch)
      onAcquireInsignia(response.body)
      return false
    }

    return true
  }

  return {
    handleInsigniaAcquire,
  }
}
