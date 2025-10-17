import { Icon } from '@/ui/global/widgets/components/Icon'
import { DragAndDropItemView } from './DragAndDropItem/DragAndDropItemView'

type Params = {
  items: string[]
  correctItems: string[]
  onAddItem: () => void
  onRemoveItem: (itemIndex: number) => void
  onItemChange: (itemIndex: number, value: string) => void
}

export const DragAndDropItemsControlView = ({
  items,
  correctItems,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: Params) => {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3 max-w-sm mx-auto'>
      {items.map((item, index) => {
        return (
          <DragAndDropItemView
            key={`${item}-${index + 1}`}
            item={item}
            items={items}
            index={index}
            isCorrect={correctItems.includes(item)}
            onRemoveItem={onRemoveItem}
            onItemChange={onItemChange}
          />
        )
      })}
      <button
        type='button'
        className='px-6 py-2 border border-dashed border-zinc-300 rounded-md bg-transparent text-zinc-100 cursor-pointer hover:opacity-80 transition-opacity'
        onClick={onAddItem}
      >
        <Icon name='plus' />
      </button>
    </div>
  )
}
