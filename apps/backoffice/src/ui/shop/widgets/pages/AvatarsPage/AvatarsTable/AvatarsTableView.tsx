import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
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
import { AvatarForm } from './AvatarForm'
import { DeleteAvatarDialog } from './DeleteAvatarDialog'
import { AvatarsTableSkeleton } from './AvatarsTableSkeleton'

type Props = {
  avatars: AvatarDto[]
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
  onOrderChange: (order: ListingOrder) => void
  onPrevPage: () => void
  onNextPage: () => void
  onCreateAvatar: (dto: AvatarDto) => void
  onUpdateAvatar: (dto: AvatarDto) => void
  onDeleteAvatar: (id: string, imageName: string) => void
}

export const AvatarsTableView = ({
  avatars,
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
  onOrderChange,
  onPrevPage,
  onNextPage,
  onCreateAvatar,
  onUpdateAvatar,
  onDeleteAvatar,
}: Props) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <Input
          placeholder='Buscar avatares...'
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='max-w-sm'
        />
        <AvatarForm onSubmit={onCreateAvatar}>
          <Button>Criar avatar</Button>
        </AvatarForm>
      </div>

      {isLoading ? (
        <AvatarsTableSkeleton />
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
                  onOrderChange={onOrderChange}
                />
                <TableHead>Adquirido por padrão</TableHead>
                <TableHead>Selecionado por padrão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {avatars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-muted-foreground'>
                    Nenhum avatar encontrado
                  </TableCell>
                </TableRow>
              ) : (
                avatars.map((avatar) => (
                  <TableRow key={avatar.id}>
                    <TableCell className='font-medium'>{avatar.name}</TableCell>
                    <TableCell>
                      <StorageImage
                        folder='avatars'
                        src={avatar.image}
                        alt={avatar.name}
                        className='w-12 h-12 rounded'
                      />
                    </TableCell>
                    <TableCell>{avatar.price}</TableCell>
                    <TableCell>
                      {avatar.isAcquiredByDefault ? (
                        <Badge variant='default'>Sim</Badge>
                      ) : (
                        <Badge variant='outline'>Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {avatar.isSelectedByDefault ? (
                        <Badge variant='default'>Sim</Badge>
                      ) : (
                        <Badge variant='outline'>Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <AvatarForm initialValues={avatar} onSubmit={onUpdateAvatar}>
                          <Button variant='outline' size='sm'>
                            Editar
                          </Button>
                        </AvatarForm>
                        <DeleteAvatarDialog
                          onConfirm={() => {
                            if (avatar.id) {
                              onDeleteAvatar(avatar.id, avatar.image)
                            }
                          }}
                        >
                          <Button variant='destructive' size='sm'>
                            Excluir
                          </Button>
                        </DeleteAvatarDialog>
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
