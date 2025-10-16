import { Icon } from '@/ui/global/widgets/components/Icon'
import { ExpandableInput } from '@/ui/lesson/widgets/components/ExpandableInput'

type Params = {
  items: string[]
  onAddItem: () => void
  onRemoveItem: (itemIndex: number) => void
  onItemChange: (itemIndex: number, value: string) => void
}

export const DragAndDropItemsControlView = ({
  items,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: Params) => {
  return (
    <div className='flex flex-wrap items-center justify-center gap-3 max-w-sm mx-auto'>
      {items.map((item, index) => (
        <div key={`${item}-${index + 1}`} className='relative group'>
          <ExpandableInput
            key={item}
            defaultValue={item}
            onBlur={(value) => onItemChange(index, value)}
            className='px-3 py-2 border border-zinc-300 rounded-md bg-purple-700 text-zinc-100'
          />
          <button
            type='button'
            onClick={() => onRemoveItem(index)}
            className='absolute -top-4 -right-2 opacity-0 group-hover:opacity-100 cursor-pointer'
          >
            <Icon name='x' size={14} />
          </button>
        </div>
      ))}
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
