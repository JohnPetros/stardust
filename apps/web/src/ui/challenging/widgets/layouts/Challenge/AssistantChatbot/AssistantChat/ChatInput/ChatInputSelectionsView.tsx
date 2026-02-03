import { Icon } from '@/ui/global/widgets/components/Icon'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import type { CodeSelection, TextSelection } from '@stardust/core/global/structures'
import { twMerge } from 'tailwind-merge'

type Props = {
  textSelection: TextSelection | null
  codeSelection: CodeSelection | null
  onRemoveTextSelection: () => void
  onRemoveCodeSelection: () => void
}

export const ChatInputSelectionsView = ({
  textSelection,
  codeSelection,
  onRemoveTextSelection,
  onRemoveCodeSelection,
}: Props) => {
  const hasAnySelection = textSelection || codeSelection

  if (!hasAnySelection) return null

  return (
    <div className='flex flex-wrap gap-2 mb-2'>
      {textSelection && (
        <Tooltip content={textSelection.content} direction='top'>
          <div
            className={twMerge(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
              'bg-blue-900/50 border border-blue-700 text-blue-200',
              'cursor-pointer hover:bg-blue-900/70 transition-colors',
            )}
          >
            <Icon name='description' className='w-3 h-3' />
            <span className='max-w-[120px] truncate'>{textSelection.preview}</span>
            <button
              type='button'
              onClick={onRemoveTextSelection}
              className='ml-1 p-0.5 hover:bg-blue-800 rounded transition-colors'
              aria-label='Remover seleção de texto'
            >
              <Icon name='close' className='w-3 h-3' />
            </button>
          </div>
        </Tooltip>
      )}

      {codeSelection && (
        <Tooltip content={codeSelection.content} direction='top'>
          <div
            className={twMerge(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
              'bg-green-900/50 border border-green-700 text-green-200',
              'cursor-pointer hover:bg-green-900/70 transition-colors',
            )}
          >
            <Icon name='code' className='w-3 h-3' />
            <span>
              Código: Linhas {codeSelection.startLine}-{codeSelection.endLine}
            </span>
            <button
              type='button'
              onClick={onRemoveCodeSelection}
              className='ml-1 p-0.5 hover:bg-green-800 rounded transition-colors'
              aria-label='Remover seleção de código'
            >
              <Icon name='close' className='w-3 h-3' />
            </button>
          </div>
        </Tooltip>
      )}
    </div>
  )
}
