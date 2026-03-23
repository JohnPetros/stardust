import type { TextBlockEditorItem } from '../../types'

export function useTextBlockCard(item: TextBlockEditorItem) {
  const previewContent =
    item.content.length > 110 ? `${item.content.slice(0, 107)}...` : item.content

  return {
    previewContent,
    canShowPictureField: ['default', 'alert', 'quote', 'image'].includes(item.type),
    canShowRunnableField: item.type === 'code',
    contentLabel:
      item.type === 'code' ? 'Código' : item.type === 'image' ? 'Legenda' : 'Conteúdo',
  }
}
