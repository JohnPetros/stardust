import type { Sorter } from '@stardust/core/global/structures'
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
  sorter: Sorter
  onSort: (sorter: Sorter) => void
  currentValue: string
  handleSortChange: (value: string) => void
}

export const SortableColumnView = ({
  label,
  sorter,
  currentValue,
  handleSortChange,
}: Props) => {
  return (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            className={cn(
              'flex items-center gap-2 hover:text-foreground transition-colors outline-hidden cursor-pointer w-full justify-start',
              sorter.isAscending.value || sorter.isDescending.value
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          >
            <span className='whitespace-nowrap'>{label}</span>
            {sorter.isAscending.value && <Icon name='sort-asc' size={16} />}
            {sorter.isDescending.value && <Icon name='sort-desc' size={16} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='w-40'>
          <DropdownMenuRadioGroup value={currentValue} onValueChange={handleSortChange}>
            <DropdownMenuRadioItem value='ascending'>Ascendente</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='descending'>Descendente</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='none'>Nenhum</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )
}
