import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import { BlockVoiceSelectorView } from './BlockVoiceSelectorView'

type Props = {
  voices: AudioVoiceDto[]
  value: AudioVoiceDto['value']
  isDisabled?: boolean
  onChange: (voice: AudioVoiceDto['value']) => void
}

export const BlockVoiceSelector = (props: Props) => {
  return <BlockVoiceSelectorView {...props} />
}
