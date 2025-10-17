import type { ReactNode } from 'react'

import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ExpandableInput } from '@/ui/lesson/widgets/components/ExpandableInput'
import { CodeLineConfigurationDropdownMenu } from './CodeLineConfigurationDropdownMenu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/shadcn/components/tooltip'

type Props = {
  blocks: ReactNode[]
  indentation: number
  isAddInputDisabled: boolean
  onDelete: () => void
  onAddCodeLineText: (index: number) => void
  onAddCodeLineInput: (index: number) => void
  onTextChange: (text: string, textIndex: number) => void
  onIndentationChange: (indentation: number) => void
  onRemoveCodeLineBlock: (blockIndex: number) => void
  onReplaceCodeLineBlockWithText: (blockIndex: number) => void
  onReplaceCodeLineBlockWithInput: (blockIndex: number) => void
}

export const CodeLineEditorView = ({
  blocks,
  indentation,
  isAddInputDisabled,
  onDelete,
  onAddCodeLineText,
  onAddCodeLineInput,
  onTextChange,
  onIndentationChange,
  onRemoveCodeLineBlock,
  onReplaceCodeLineBlockWithText,
  onReplaceCodeLineBlockWithInput,
}: Props) => {
  return (
    <div
      className='flex items-center gap-6'
      style={{
        paddingLeft: `${indentation * 20}px`,
      }}
    >
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
            <div key={`${block}-${index.toString()}`} className='group flex items-center'>
              {typeof block === 'string' ? (
                <ExpandableInput
                  defaultValue={block}
                  onBlur={(value) => onTextChange(value, index)}
                  className='group-hover:border-green-400 transition-colors duration-300 outline-none border-b border-dashed border-zinc-200 text-zinc-200 px-2 w-max'
                />
              ) : (
                block
              )}
              <div className='group-hover:opacity-100 opacity-0 transition-opacity duration-300'>
                <CodeLineConfigurationDropdownMenu
                  isInput={typeof block !== 'string'}
                  indentation={indentation}
                  index={index}
                  isRemoveBlockDisabled={blocks.length === 1}
                  isAddInputDisabled={isAddInputDisabled}
                  onAddText={onAddCodeLineText}
                  onAddInput={onAddCodeLineInput}
                  onRemoveBlock={onRemoveCodeLineBlock}
                  onIndentationChange={onIndentationChange}
                  onReplaceWithText={onReplaceCodeLineBlockWithText}
                  onReplaceWithInput={onReplaceCodeLineBlockWithInput}
                />
              </div>
            </div>
          )
        })}
      </div>
      <Tooltip>
        <TooltipTrigger>{indentation}</TooltipTrigger>
        <TooltipContent>
          <p>Nível de identação ({indentation})</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
