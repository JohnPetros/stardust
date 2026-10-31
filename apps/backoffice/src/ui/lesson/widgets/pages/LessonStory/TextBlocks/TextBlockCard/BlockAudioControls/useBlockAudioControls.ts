import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

import type { TextBlockEditorItem } from '../../../types'

type Params = {
  item: TextBlockEditorItem
  hasStoredAudioFile: boolean
}

export function useBlockAudioControls({ item, hasStoredAudioFile }: Params) {
  const voice: AudioVoiceDto['value'] =
    (item.audio?.voice as AudioVoiceDto['value'] | undefined) ?? 'panda'
  const status = item.audio?.status ?? 'idle'
  const canShowPlayer =
    status === 'done' && Boolean(item.audio?.fileName) && hasStoredAudioFile
  const canCancel = status === 'pending'
  const canRemove = Boolean(item.audio?.fileName) && status !== 'pending'
  const statusLabel =
    status === 'pending'
      ? 'Gerando audio...'
      : status === 'error'
        ? 'Erro na geracao'
        : status === 'cancelled'
          ? 'Geracao cancelada'
          : null
  const statusVariant: 'secondary' | 'destructive' =
    status === 'error' ? 'destructive' : 'secondary'

  return {
    voice,
    status,
    canShowPlayer,
    canCancel,
    canRemove,
    statusLabel,
    statusVariant,
  }
}
