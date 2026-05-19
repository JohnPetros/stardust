import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import type { TextBlockEditorItem } from '../../../types'
import { BlockAudioPlayer } from '../BlockAudioPlayer'
import { BlockVoiceSelector } from '../BlockVoiceSelector'
import { BlockAudioControlsView } from './BlockAudioControlsView'
import { useBlockAudioControls } from './useBlockAudioControls'

type Props = {
  item: TextBlockEditorItem
  voices: AudioVoiceDto[]
  isGenerateDisabled: boolean
  isGenerating: boolean
  onVoiceChange: (voice: AudioVoiceDto['value']) => void
  onGenerate: () => void
  onCancel: () => void
}

export const BlockAudioControls = ({
  item,
  voices,
  isGenerateDisabled,
  isGenerating,
  onVoiceChange,
  onGenerate,
  onCancel,
}: Props) => {
  const controls = useBlockAudioControls({ item })

  return (
    <BlockAudioControlsView
      isGenerating={isGenerating}
      isGenerateDisabled={isGenerateDisabled}
      canCancel={controls.canCancel}
      statusLabel={controls.statusLabel}
      statusVariant={controls.statusVariant}
      onGenerate={onGenerate}
      onCancel={onCancel}
      selector={
        <BlockVoiceSelector
          voices={voices}
          value={controls.voice}
          isDisabled={isGenerating}
          onChange={onVoiceChange}
        />
      }
      player={
        controls.canShowPlayer && item.audio?.fileName ? (
          <BlockAudioPlayer fileName={item.audio.fileName} />
        ) : null
      }
    />
  )
}
