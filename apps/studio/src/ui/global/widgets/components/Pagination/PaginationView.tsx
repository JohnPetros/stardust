import { Button } from '@/ui/shadcn/components/button'
import { Input } from '@/ui/shadcn/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'

export type PaginationProps = {
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  itemsPerPageOptions?: number[]
  onPrevPage: () => void
  onNextPage: () => void
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

type ViewProps = PaginationProps & {
  pageInput: string
  startItem: number
  endItem: number
  handlePageInputChange: (value: string) => void
  handlePageInputSubmit: () => void
  handlePageInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const PaginationView = ({
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  itemsPerPageOptions = [10, 25, 50, 100],
  onPrevPage,
  onNextPage,
  onItemsPerPageChange,
  pageInput,
  startItem,
  endItem,
  handlePageInputChange,
  handlePageInputSubmit,
  handlePageInputKeyDown,
}: ViewProps) => {
  return (
    <div className='flex items-center justify-between gap-4 flex-wrap'>
      <div className='text-sm text-muted-foreground'>
        Mostrando {startItem} a {endItem} de {totalItemsCount} itens
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Itens por página:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={onPrevPage} disabled={page === 1}>
            Anterior
          </Button>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Página</span>
            <Input
              type='number'
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => handlePageInputChange(e.target.value)}
              onBlur={handlePageInputSubmit}
              onKeyDown={handlePageInputKeyDown}
              className='w-16 text-center'
            />
            <span className='text-sm text-muted-foreground'>de {totalPages}</span>
          </div>

          <Button variant='outline' onClick={onNextPage} disabled={page >= totalPages}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
