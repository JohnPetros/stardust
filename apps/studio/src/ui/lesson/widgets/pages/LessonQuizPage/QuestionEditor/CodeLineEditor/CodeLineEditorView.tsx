import type { ReactNode } from 'react'

import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { LineConfigurationDropdown } from './LineConfigurationDropdown'
import { TextInput } from './TextInput'

type Props = {
  blocks: ReactNode[]
  indentation: number
  onDelete: () => void
  onAddCodeLineText: (index: number) => void
  onAddCodeLineInput: (index: number) => void
  onTextChange: (text: string, textIndex: number) => void
  onIndentationChange: (indentation: number) => void
}

export const CodeLineEditorView = ({
  blocks,
  indentation,
  onDelete,
  onAddCodeLineText,
  onAddCodeLineInput,
  onTextChange,
  onIndentationChange,
}: Props) => {
  return (
    <div className='flex items-center gap-6'>
      <Button
        variant='outline'
        size='icon'
        className='hover:text-red-700'
        onClick={onDelete}
      >
        <Icon name='trash' />
      </Button>
      <div className='flex items-center gap-2'>
        {blocks.map((block, index) => {
          return (
            <div key={block?.toString()} className='group flex items-center gap-2'>
              {typeof block === 'string' ? (
                <TextInput
                  defaultValue={block}
                  onBlur={(value) => onTextChange(value, index)}
                />
              ) : (
                block
              )}
              <div className='group-hover:opacity-100 opacity-0 transition-opacity duration-300'>
                <LineConfigurationDropdown
                  isInput={typeof block !== 'string'}
                  indentation={indentation}
                  index={index}
                  onAddText={onAddCodeLineText}
                  onAddInput={onAddCodeLineInput}
                  onIndentationChange={onIndentationChange}
                />
              </div>
            </div>
          )
        })}
      </div>
      <span>{indentation}</span>
    </div>
  )
}
