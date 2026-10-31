import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import type { TextBlockEditorItem } from '../../types'

import { TextBlockCardView } from './TextBlockCardView'
import { useTextBlockCard } from './useTextBlockCard'

type Props = {
  item: TextBlockEditorItem
  isExpanded: boolean
  audioVoices: AudioVoiceDto[]
  hasStoredAudioFile: boolean
  isGeneratingAudio: boolean
  isRemovingAudio: boolean
  onExpand: (blockId: string) => void
  onRemove: (blockId: string) => void
  onContentChange: (blockId: string, content: string) => void
  onPictureChange: (blockId: string, picture?: string) => void
  onRunnableChange: (blockId: string, isRunnable: boolean) => void
  onAudioVoiceChange: (blockId: string, voice: AudioVoiceDto['value']) => void
  onGenerateAudio: (blockId: string) => void
  onCancelAudio: (blockId: string) => void
  onRemoveAudio: (blockId: string) => void
}

export const TextBlockCard = ({ item, ...props }: Props) => {
  const card = useTextBlockCard({ item, hasStoredAudioFile: props.hasStoredAudioFile })

  return <TextBlockCardView item={item} {...card} {...props} />
}
