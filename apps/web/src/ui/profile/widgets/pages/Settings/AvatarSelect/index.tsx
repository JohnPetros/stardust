'use client'

import type { AvatarAggregateDto } from '@stardust/core/profile/aggregates/dtos'
import { AvatarAggregate } from '@stardust/core/profile/aggregates'

import { AvatarSelectView } from './AvatarSelectView'
import { useAvatarSelect } from './useAvatarSelect'

type Props = {
  defaultValue: AvatarAggregateDto
}

export const AvatarSelect = ({ defaultValue }: Props) => {
  const { selectedAvatar } = useAvatarSelect(AvatarAggregate.create(defaultValue))

  if (selectedAvatar) return <AvatarSelectView selectedAvatar={selectedAvatar} />
}
