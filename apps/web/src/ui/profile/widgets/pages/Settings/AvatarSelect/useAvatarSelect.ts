import { useState } from 'react'

import type { AvatarAggregate } from '@stardust/core/profile/aggregates'

export function useAvatarSelect(defaultAvatar: AvatarAggregate | null) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarAggregate | null>(
    defaultAvatar,
  )

  function handleSelectChange(avatar: AvatarAggregate) {
    setSelectedAvatar(avatar)
  }

  return {
    selectedAvatar,
    handleSelectChange,
  }
}
