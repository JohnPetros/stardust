import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import type { TextBlockEditorItem } from '../../../types'
import { BlockAudioPlayer } from '../BlockAudioPlayer'
import { BlockVoiceSelector } from '../BlockVoiceSelector'
import { BlockAudioControlsView } from './BlockAudioControlsView'
import { useBlockAudioControls } from './useBlockAudioControls'

type Props = {
  item: TextBlockEditorItem
  voices: AudioVoiceDto[]
  hasStoredAudioFile: boolean
  isGenerateDisabled: boolean
  isGenerating: boolean
  isRemoving: boolean
  onVoiceChange: (voice: AudioVoiceDto['value']) => void
  onGenerate: () => void
  onCancel: () => void
  onRemove: () => void
}

export const BlockAudioControls = ({
  item,
  voices,
  hasStoredAudioFile,
  isGenerateDisabled,
  isGenerating,
  isRemoving,
  onVoiceChange,
  onGenerate,
  onCancel,
  onRemove,
}: Props) => {
  const controls = useBlockAudioControls({ item, hasStoredAudioFile })

  return (
    <BlockAudioControlsView
      isGenerating={isGenerating}
      isRemoving={isRemoving}
      isGenerateDisabled={isGenerateDisabled}
      canCancel={controls.canCancel}
      canRemove={controls.canRemove}
      statusLabel={controls.statusLabel}
      statusVariant={controls.statusVariant}
      onGenerate={onGenerate}
      onCancel={onCancel}
      onRemove={onRemove}
      selector={
        <BlockVoiceSelector
          voices={voices}
          value={controls.voice}
          isDisabled={isGenerating || isRemoving}
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
