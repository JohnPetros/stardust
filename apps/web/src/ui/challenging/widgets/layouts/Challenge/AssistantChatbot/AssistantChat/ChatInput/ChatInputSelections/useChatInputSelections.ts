import type { CodeSelection, TextSelection } from '@stardust/core/global/structures'

export type ChatInputSelectionsParams = {
  textSelection: TextSelection | null
  codeSelection: CodeSelection | null
  onRemoveTextSelection: () => void
  onRemoveCodeSelection: () => void
}

export type ChatInputSelectionItem = {
  id: 'text' | 'code'
  iconName: 'description' | 'code'
  tooltipContent: string
  label: string
  badgeClassName: string
  labelClassName?: string
  removeButtonClassName: string
  removeAriaLabel: string
  onRemove: () => void
}

export function useChatInputSelections({
  textSelection,
  codeSelection,
  onRemoveTextSelection,
  onRemoveCodeSelection,
}: ChatInputSelectionsParams) {
  function handleRemoveTextSelection() {
    onRemoveTextSelection()
  }

  function handleRemoveCodeSelection() {
    onRemoveCodeSelection()
  }

  const selectionItems: ChatInputSelectionItem[] = []

  if (textSelection) {
    selectionItems.push({
      id: 'text',
      iconName: 'description',
      tooltipContent: textSelection.content,
      label: textSelection.preview,
      badgeClassName:
        'bg-blue-900/50 border border-blue-700 text-blue-200 hover:bg-blue-900/70',
      labelClassName: 'block max-w-[120px] truncate',
      removeButtonClassName: 'hover:bg-blue-800',
      removeAriaLabel: 'Remover seleção de texto',
      onRemove: handleRemoveTextSelection,
    })
  }

  if (codeSelection) {
    selectionItems.push({
      id: 'code',
      iconName: 'code',
      tooltipContent: codeSelection.content,
      label: `Linha - ${codeSelection.startLine}-${codeSelection.endLine}`,
      badgeClassName:
        'bg-green-900/50 border border-green-700 text-green-200 hover:bg-green-900/70',
      labelClassName: 'block',
      removeButtonClassName: 'hover:bg-green-800',
      removeAriaLabel: 'Remover seleção de código',
      onRemove: handleRemoveCodeSelection,
    })
  }

  return {
    selectionItems,
  }
}
