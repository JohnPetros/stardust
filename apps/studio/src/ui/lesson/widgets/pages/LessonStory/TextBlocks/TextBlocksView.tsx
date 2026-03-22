import { useMemo, useState } from 'react'

import { SortableList } from '@/ui/global/widgets/components/SortableList'
import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'
import { Button } from '@/ui/shadcn/components/button'
import { Input } from '@/ui/shadcn/components/input'
import type { TextBlockEditorItem, SupportedTextBlockType } from '../types'
import { TextBlockCard } from './TextBlockCard'

type Props = {
  textBlocks: TextBlockEditorItem[]
  expandedBlockId: string | null
  sortableItems: SortableItem<TextBlockEditorItem>[]
  onAddBlock: (type: SupportedTextBlockType) => void
  onExpandBlock: (blockId: string) => void
  onRemoveBlock: (blockId: string) => void
  onContentChange: (blockId: string, content: string) => void
  onPictureChange: (blockId: string, picture?: string) => void
  onRunnableChange: (blockId: string, isRunnable: boolean) => void
  onReorder: (reorderedTextBlocks: TextBlockEditorItem[]) => void
}

const BLOCK_TYPES: Array<{ type: SupportedTextBlockType; label: string }> = [
  { type: 'default', label: 'default' },
  { type: 'user', label: 'user' },
  { type: 'alert', label: 'alert' },
  { type: 'code', label: 'code' },
  { type: 'image', label: 'image' },
  { type: 'quote', label: 'quote' },
]

export const TextBlocksView = ({
  textBlocks,
  expandedBlockId,
  sortableItems,
  onAddBlock,
  onExpandBlock,
  onRemoveBlock,
  onContentChange,
  onPictureChange,
  onRunnableChange,
  onReorder,
}: Props) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [search, setSearch] = useState('')

  const filteredSortableItems = useMemo(() => {
    if (!search.trim()) return sortableItems

    const normalizedSearch = search.toLowerCase().trim()

    return sortableItems.filter(({ data }) => {
      const searchable =
        `${data.type} ${data.content} ${data.picture ?? ''}`.toLowerCase()
      return searchable.includes(normalizedSearch)
    })
  }, [search, sortableItems])

  function handleSearchToggle() {
    setIsSearchVisible((current) => {
      const next = !current
      if (!next) setSearch('')
      return next
    })
  }

  return (
    <div className='space-y-5'>
      <div className='sticky top-0 z-20 -mx-1 space-y-4 border-b border-zinc-800 bg-zinc-900/95 px-1 pb-4 backdrop-blur supports-backdrop-filter:bg-zinc-900/80'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-lg font-semibold'>Blocos</h2>
            <p className='text-sm text-zinc-400'>
              {textBlocks.length} bloco(s) na narrativa
            </p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button type='button' variant='ghost' onClick={handleSearchToggle}>
            {isSearchVisible ? 'Ocultar busca' : 'Buscar bloco'}
          </Button>
          {BLOCK_TYPES.map(({ type, label }) => (
            <Button
              key={type}
              type='button'
              variant='outline'
              onClick={() => onAddBlock(type)}
            >
              {label}
            </Button>
          ))}
        </div>

        {isSearchVisible && (
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Buscar por tipo, conteúdo ou imagem...'
            className='border-zinc-800 bg-zinc-950 text-zinc-100'
          />
        )}
      </div>

      {textBlocks.length > 0 ? (
        <SortableList.Container
          items={filteredSortableItems}
          onDragEnd={(newItems) => onReorder(newItems.map((item) => item.data))}
        >
          {(items) => {
            if (items.length === 0) {
              return (
                <div className='rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center text-sm text-zinc-500'>
                  Nenhum bloco encontrado para a busca atual.
                </div>
              )
            }

            return (
              <ul className='space-y-4'>
                {items.map((item) => (
                  <li key={item.id}>
                    <SortableList.Item id={item.id} className='left-4'>
                      <TextBlockCard
                        item={item.data}
                        isExpanded={expandedBlockId === item.data.id}
                        onExpand={onExpandBlock}
                        onRemove={onRemoveBlock}
                        onContentChange={onContentChange}
                        onPictureChange={onPictureChange}
                        onRunnableChange={onRunnableChange}
                      />
                    </SortableList.Item>
                  </li>
                ))}
              </ul>
            )
          }}
        </SortableList.Container>
      ) : (
        <div className='rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 text-center text-sm text-zinc-500'>
          Escolha um tipo acima para criar o primeiro bloco da história.
        </div>
      )}
    </div>
  )
}
