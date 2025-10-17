import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'

type Props = {
  items: string[]
  correctItems: string[]
  selectedItem: string
  index: number
  onChange: (selectedItem: string, index: number) => void
}

export const DropZoneSelectView = ({
  items,
  correctItems,
  selectedItem,
  index,
  onChange,
}: Props) => {
  const isItemEmpty = selectedItem === ''
  return (
    <Select value={isItemEmpty ? 'não selecionado' : selectedItem} onValueChange={(value) => onChange(value, index)}>
      <SelectTrigger className='outline-none border border-zinc-300 rounded-md px-2 py-1 w-max'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className='bg-zinc-800'>
        {items.map((item, index) => (
          <SelectItem key={item} value={ item ? item : index.toString()} disabled={correctItems.includes(item)} className='text-zinc-100 hover:bg-zinc-600'>
            {item ? item : `Item vazio (${index})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
