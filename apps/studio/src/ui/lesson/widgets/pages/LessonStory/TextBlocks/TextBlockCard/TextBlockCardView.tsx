import { Collapsible, CollapsibleContent } from '@/ui/shadcn/components/collapsible'
import type { TextBlockEditorItem } from '../../types'
import { BlockActions } from './BlockActions'
import { BlockContentField } from './BlockContentField'
import { BlockPictureField } from './BlockPictureField'
import { BlockPreview } from './BlockPreview'
import { BlockRunnableField } from './BlockRunnableField'
import { BlockTypeBadge } from './BlockTypeBadge'

type Props = {
  item: TextBlockEditorItem
  isExpanded: boolean
  previewContent: string
  canShowPictureField: boolean
  canShowRunnableField: boolean
  contentLabel: string
  onExpand: (blockId: string) => void
  onRemove: (blockId: string) => void
  onContentChange: (blockId: string, content: string) => void
  onPictureChange: (blockId: string, picture?: string) => void
  onRunnableChange: (blockId: string, isRunnable: boolean) => void
}

export const TextBlockCardView = ({
  item,
  isExpanded,
  previewContent,
  canShowPictureField,
  canShowRunnableField,
  contentLabel,
  onExpand,
  onRemove,
  onContentChange,
  onPictureChange,
  onRunnableChange,
}: Props) => {
  return (
    <Collapsible
      open={isExpanded}
      className='w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 pl-10'
    >
      <div className='flex items-start justify-between gap-4 p-4'>
        <button
          type='button'
          className='flex flex-1 flex-col items-start gap-3 text-left'
          onClick={() => onExpand(item.id)}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <BlockTypeBadge type={item.type} />
            <BlockPreview preview={previewContent} picture={item.picture} />
          </div>
        </button>
        <BlockActions
          isExpanded={isExpanded}
          hasPicture={Boolean(item.picture)}
          onExpand={() => onExpand(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      </div>

      <CollapsibleContent className='border-t border-zinc-800 px-4 py-4'>
        <div className='space-y-4'>
          <BlockContentField
            label={contentLabel}
            value={item.content}
            onChange={(content) => onContentChange(item.id, content)}
          />
          {canShowPictureField && (
            <BlockPictureField
              picture={item.picture}
              isRequired={item.type === 'image'}
              onChange={(picture) => onPictureChange(item.id, picture)}
            />
          )}
          {canShowRunnableField && (
            <BlockRunnableField
              isRunnable={Boolean(item.isRunnable)}
              onChange={(isRunnable) => onRunnableChange(item.id, isRunnable)}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
