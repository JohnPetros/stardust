import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import { ListingOrder } from '@stardust/core/global/structures'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Input } from '@/ui/shadcn/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { Button } from '@/ui/shadcn/components/button'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { Badge } from '@/ui/shadcn/components/badge'
import { RocketForm } from './RocketForm'

type Props = {
  rockets: RocketDto[]
  isLoading: boolean
  searchInput: string
  order: ListingOrder
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  onSearchChange: (value: string) => void
  onOrderChange: (order: ListingOrder) => void
  onPrevPage: () => void
  onNextPage: () => void
  onCreateRocket: (dto: RocketDto) => Promise<void>
}

export const RocketsTableView = ({
  rockets,
  isLoading,
  searchInput,
  order,
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  onSearchChange,
  onOrderChange,
  onPrevPage,
  onNextPage,
  onCreateRocket,
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
          <Select
            value={order.value}
            onValueChange={(value) => onOrderChange(ListingOrder.create(value))}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Ordenar por' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ascending'>Preço: Menor para Maior</SelectItem>
              <SelectItem value='descending'>Preço: Maior para Menor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RocketForm onSubmit={onCreateRocket}>
          <Button>Criar foguete</Button>
        </RocketForm>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-[400px]'>
          <Loading size={48} />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead>Preço</TableHead>
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
                        <Button variant='outline' size='sm'>
                          Editar
                        </Button>
                        <Button variant='destructive' size='sm'>
                          Excluir
                        </Button>
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
            />
          )}
        </>
      )}
    </div>
  )
}
