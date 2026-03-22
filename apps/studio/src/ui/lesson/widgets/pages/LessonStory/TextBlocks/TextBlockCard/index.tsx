import type { TextBlockEditorItem } from '../../types'

import { TextBlockCardView } from './TextBlockCardView'
import { useTextBlockCard } from './useTextBlockCard'

type Props = {
  item: TextBlockEditorItem
  isExpanded: boolean
  onExpand: (blockId: string) => void
  onRemove: (blockId: string) => void
  onContentChange: (blockId: string, content: string) => void
  onPictureChange: (blockId: string, picture?: string) => void
  onRunnableChange: (blockId: string, isRunnable: boolean) => void
}

export const TextBlockCard = ({ item, ...props }: Props) => {
  const card = useTextBlockCard(item)

  return <TextBlockCardView item={item} {...card} {...props} />
}
