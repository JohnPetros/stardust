import { Icon } from '@/ui/global/widgets/components/Icon'
import { ExpandableInput } from '@/ui/lesson/widgets/components/ExpandableInput'
import { cn } from '@/ui/shadcn/utils/index'
import { useState } from 'react'

type Params = {
  items: string[]
  item: string
  index: number
  isCorrect: boolean
  onRemoveItem: (index: number) => void
  onItemChange: (index: number, value: string) => void
}

export const DragAndDropItemView = ({
  items,
  item,
  index,
  isCorrect,
  onRemoveItem,
  onItemChange,
}: Params) => {
  const [isRepeated, setIsRepeated] = useState(false)

  function handleItemChange(value: string) {
    if (item === value) return
    const isRepeated = items.includes(value)
    setIsRepeated(isRepeated)
    if (!isRepeated) {
      onItemChange(index, value)
    }
  }

  return (
    <div className='relative group'>
      <ExpandableInput
        key={item}
        defaultValue={item}
        onBlur={handleItemChange}
        className={cn(
          'px-3 py-2 border border-zinc-300 rounded-md bg-purple-700 text-zinc-100',
          {
            'border-red-700 bg-red-700/10': isRepeated,
          },
        )}
      />
      {!isCorrect && (
        <button
          type='button'
          onClick={() => onRemoveItem(index)}
          className='absolute -top-4 -right-2 opacity-0 group-hover:opacity-100 cursor-pointer'
        >
          <Icon name='x' size={14} />
        </button>
      )}
    </div>
  )
}
