import type { Image, Text } from '@stardust/core/global/structures'

import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'
import { Sortable } from '@/ui/global/widgets/components/Sortable'
import type { SortableItem } from '@/ui/global/widgets/components/Sortable/types'
import { QuestionHeaderInput } from '../QuestionHeaderInput'

type Props = {
  stem: string
  picture: Image
  items: SortableItem<string>[]
  onStemChange: (stem: Text) => void
  onPictureChange: (picture: Image) => void
  onItemRemove: (itemIndex: number) => void
  onItemAdd: () => void
  onItemLabelChange: (itemIndex: number, item: string) => void
  onDragItemEnd: (newItems: SortableItem<string>[]) => void
}

export const DragAndDropListQuestionEditorView = ({
  stem,
  picture,
  items,
  onStemChange,
  onPictureChange,
  onItemRemove,
  onItemAdd,
  onItemLabelChange,
  onDragItemEnd,
}: Props) => {
  return (
    <div className='space-y-8'>
      <QuestionHeaderInput
        stem={stem}
        picture={picture}
        onPictureChange={onPictureChange}
        onStemChange={onStemChange}
      />

      <div className='mt-6 space-y-3 w-full'>
        <h3>Itens (ordem colocada será considerada como a correta)</h3>

        <Sortable.Container
          key={items.map((item) => item.value).join()}
          items={items}
          onDragEnd={onDragItemEnd}
        >
          {(items) =>
            items.map((item) => (
              <Sortable.Item key={item.index} id={item.index.toString()}>
                <div className='flex items-center gap-2 rounded-md w-full px-4 pl-10 py-1 bg-purple-700'>
                  <input
                    defaultValue={item.value}
                    onBlur={(event) => onItemLabelChange(item.index, event.target.value)}
                    className='w-full text-sm text-zinc-100 bg-transparent border-none ring-0 outline-none'
                  />

                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onItemRemove(item.index)}
                    >
                      <Icon name='trash' className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </Sortable.Item>
            ))
          }
        </Sortable.Container>

        <div className='w-max mx-auto'>
          <AddItemButton onClick={onItemAdd}>Adicionar opção</AddItemButton>
        </div>
      </div>
    </div>
  )
}
