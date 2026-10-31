import type { Image, Text } from '@stardust/core/global/structures'

import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AddItemButton } from '@/ui/lesson/widgets/components/AddItemButton'
import { SortableList } from '@/ui/global/widgets/components/SortableList'
import type { SortableItem } from '@/ui/global/widgets/components/SortableList/types'
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

        <SortableList.Container
          key={items.map((item) => item.data).join()}
          items={items}
          onDragEnd={onDragItemEnd}
        >
          {(items) =>
            items.map((item) => (
              <SortableList.Item key={item.id} id={item.id}>
                <div className='flex items-center gap-2 rounded-md w-full px-4 pl-10 py-1 bg-purple-700'>
                  <input
                    defaultValue={item.data}
                    onBlur={(event) =>
                      onItemLabelChange(Number(item.id), event.target.value)
                    }
                    className='w-full text-sm text-zinc-100 bg-transparent border-none ring-0 outline-none'
                  />

                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onItemRemove(Number(item.id))}
                    >
                      <Icon name='trash' className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </SortableList.Item>
            ))
          }
        </SortableList.Container>

        <div className='w-max mx-auto'>
          <AddItemButton onClick={onItemAdd}>Adicionar opção</AddItemButton>
        </div>
      </div>
    </div>
  )
}
