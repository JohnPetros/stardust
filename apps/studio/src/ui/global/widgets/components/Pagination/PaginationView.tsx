import { Button } from '@/ui/shadcn/components/button'

type Props = {
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  onPrevPage: () => void
  onNextPage: () => void
}

export const PaginationView = ({
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  onPrevPage,
  onNextPage,
}: Props) => {
  const startItem = totalItemsCount > 0 ? (page - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(page * itemsPerPage, totalItemsCount)

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-muted-foreground'>
        Mostrando {startItem} a {endItem} de {totalItemsCount} itens
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='outline' onClick={onPrevPage} disabled={page === 1}>
          Anterior
        </Button>
        <span className='text-sm text-muted-foreground'>
          Página {page} de {totalPages}
        </span>
        <Button variant='outline' onClick={onNextPage} disabled={page >= totalPages}>
          Próxima
        </Button>
      </div>
    </div>
  )
}
