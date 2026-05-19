import type { TextBlockEditorItem } from '../../types'

export function useTextBlockCard(item: TextBlockEditorItem) {
  const previewContent =
    item.content.length > 110 ? `${item.content.slice(0, 107)}...` : item.content
  const canHaveAudio = ['default', 'alert', 'quote'].includes(item.type)
  const audioStatus = item.audio?.status ?? 'idle'
  const isAudioPending = audioStatus === 'pending'
  const isAudioDone = audioStatus === 'done'
  const isAudioError = audioStatus === 'error'
  const isAudioCancelled = audioStatus === 'cancelled'
  const audioVoice = item.audio?.voice ?? 'panda'
  const isGenerateAudioDisabled = isAudioPending || item.content.trim().length === 0

  return {
    previewContent,
    canShowPictureField: ['default', 'alert', 'quote', 'image'].includes(item.type),
    canShowRunnableField: item.type === 'code',
    canHaveAudio,
    audioStatus,
    isAudioPending,
    isAudioDone,
    isAudioError,
    isAudioCancelled,
    audioVoice,
    isGenerateAudioDisabled,
    contentLabel:
      item.type === 'code' ? 'Código' : item.type === 'image' ? 'Legenda' : 'Conteúdo',
  }
}
