import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import type { ListingOrder } from '@stardust/core/global/structures'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Input } from '@/ui/shadcn/components/input'
import { Button } from '@/ui/shadcn/components/button'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { Badge } from '@/ui/shadcn/components/badge'
import { SortableColumn } from '@/ui/global/widgets/components/SortableColumn'
import { RocketForm } from './RocketForm'
import { DeleteRocketDialog } from './DeleteRocketDialog'
import { RocketsTableSkeleton } from './RocketsTableSkeleton'

type Props = {
  rockets: RocketDto[]
  isLoading: boolean
  searchInput: string
  priceOrder: ListingOrder
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  onItemsPerPageChange: (count: number) => void
  onPageChange: (page: number) => void
  onSearchChange: (value: string) => void
  onPriceOrderChange: (order: ListingOrder) => void
  onPrevPage: () => void
  onNextPage: () => void
  onCreateRocket: (dto: RocketDto) => Promise<void>
  onUpdateRocket: (dto: RocketDto) => Promise<void>
  onDeleteRocket: (id: string, imageName: string) => Promise<void>
}

export const RocketsTableView = ({
  rockets,
  isLoading,
  searchInput,
  priceOrder,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  onSearchChange,
  onPriceOrderChange,
  onPrevPage,
  onNextPage,
  onCreateRocket,
  onUpdateRocket,
  onDeleteRocket,
}: Props) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <Input
            placeholder='Buscar foguetes...'
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className='max-w-sm'
          />
        </div>

        <RocketForm onSubmit={onCreateRocket}>
          <Button>Criar foguete</Button>
        </RocketForm>
      </div>

      {isLoading ? (
        <RocketsTableSkeleton />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Imagem</TableHead>
                <SortableColumn
                  label='Preço'
                  order={priceOrder}
                  onOrderChange={onPriceOrderChange}
                />
                <TableHead>Adquirido por padrão</TableHead>
                <TableHead>Selecionado por padrão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rockets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-muted-foreground'>
                    Nenhum foguete encontrado
                  </TableCell>
                </TableRow>
              ) : (
                rockets.map((rocket) => (
                  <TableRow key={rocket.id}>
                    <TableCell className='font-medium'>{rocket.name}</TableCell>
                    <TableCell>
                      <StorageImage
                        folder='rockets'
                        src={rocket.image}
                        alt={rocket.name}
                        className='w-12 h-12 rounded'
                      />
                    </TableCell>
                    <TableCell>{rocket.price}</TableCell>
                    <TableCell>
                      {rocket.isAcquiredByDefault ? (
                        <Badge variant='default'>Sim</Badge>
                      ) : (
                        <Badge variant='outline'>Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {rocket.isSelectedByDefault ? (
                        <Badge variant='default'>Sim</Badge>
                      ) : (
                        <Badge variant='outline'>Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <RocketForm onSubmit={onUpdateRocket} initialValues={rocket}>
                          <Button variant='outline' size='sm'>
                            Editar
                          </Button>
                        </RocketForm>
                        <DeleteRocketDialog
                          onConfirm={() => {
                            if (rocket.id) {
                              onDeleteRocket(rocket.id, rocket.image)
                            }
                          }}
                        >
                          <Button variant='destructive' size='sm'>
                            Excluir
                          </Button>
                        </DeleteRocketDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItemsCount={totalItemsCount}
              itemsPerPage={itemsPerPage}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
