import type { ListingOrder } from '@stardust/core/global/structures'
import { TableHead } from '@/ui/shadcn/components/table'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { cn } from '@/ui/shadcn/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'

type Props = {
  label: string
  order: ListingOrder
  currentValue: string
  onOrderChange: (order: ListingOrder) => void
  handleOrderChange: (value: string) => void
}

export const SortableColumnView = ({
  label,
  order,
  currentValue,
  handleOrderChange,
}: Props) => {
  return (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            className={cn(
              'flex items-center gap-2 hover:text-foreground transition-colors outline-hidden cursor-pointer w-full justify-start',
              order.isAscending.value || order.isDescending.value
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          >
            <span className='whitespace-nowrap'>{label}</span>
            {order.isAscending.value && <Icon name='sort-asc' size={16} />}
            {order.isDescending.value && <Icon name='sort-desc' size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-40'>
          <DropdownMenuRadioGroup value={currentValue} onValueChange={handleOrderChange}>
            <DropdownMenuRadioItem value='ascending'>Ascendente</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='descending'>Descendente</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='any'>Nenhum</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )
}
