import { useState } from 'react'

import type { AvatarDto } from '@stardust/core/shop/entities/dtos'
import { ListingOrder, Id } from '@stardust/core/global/structures'

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
import { AvatarForm } from './AvatarForm'
import { DeleteAvatarDialog } from './DeleteAvatarDialog'

type Props = {
  avatars: AvatarDto[]
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
  onCreateAvatar: (dto: AvatarDto) => void
  onUpdateAvatar: (dto: AvatarDto) => void
  onDeleteAvatar: (avatarId: Id) => void
}

export const AvatarsTableView = ({
  avatars,
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
  onCreateAvatar,
  onUpdateAvatar,
  onDeleteAvatar,
}: Props) => {
  const [avatarToDelete, setAvatarToDelete] = useState<AvatarDto | null>(null)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <Input
            placeholder='Buscar avatares...'
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
        <AvatarForm onSubmit={onCreateAvatar}>
          <Button>Criar avatar</Button>
        </AvatarForm>
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
                        <AvatarForm
                          initialValues={{
                            name: avatar.name,
                            image: avatar.image,
                            price: avatar.price,
                            isAcquiredByDefault: avatar.isAcquiredByDefault,
                            isSelectedByDefault: avatar.isSelectedByDefault,
                          }}
                          onSubmit={(data) =>
                            onUpdateAvatar({
                              id: avatar.id,
                              ...data,
                            })
                          }
                        >
                          <Button variant='outline' size='sm'>
                            Editar
                          </Button>
                        </AvatarForm>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => setAvatarToDelete(avatar)}
                        >
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
      <DeleteAvatarDialog
        open={!!avatarToDelete}
        onOpenChange={(open) => !open && setAvatarToDelete(null)}
        onConfirm={() => {
          if (avatarToDelete?.id) {
            onDeleteAvatar(Id.create(avatarToDelete.id))
            setAvatarToDelete(null)
          }
        }}
      />
    </div>
  )
}
