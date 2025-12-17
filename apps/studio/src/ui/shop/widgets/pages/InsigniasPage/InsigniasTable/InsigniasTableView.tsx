import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Badge } from '@/ui/shadcn/components/badge'
import { Button } from '@/ui/shadcn/components/button'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { InsigniaForm } from './InsigniaForm'
import { DeleteInsigniaDialog } from './DeleteInsigniaDialog'

import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'

type Props = {
  insignias: InsigniaDto[]
  isLoading: boolean
  handleCreateInsignia: (dto: InsigniaDto) => Promise<void>
  handleUpdateInsignia: (dto: InsigniaDto) => Promise<void>
  handleDeleteInsignia: (id: string, imageName: string) => Promise<void>
}

export const InsigniasTableView = ({
  insignias,
  isLoading,
  handleCreateInsignia,
  handleUpdateInsignia,
  handleDeleteInsignia,
}: Props) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end'>
        <InsigniaForm onSubmit={handleCreateInsignia}>
          <Button>Criar insígnia</Button>
        </InsigniaForm>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-8'>
          <Loading />
        </div>
      ) : insignias.length === 0 ? (
        <div className='py-8 text-center text-muted-foreground'>
          Nenhuma insígnia encontrada.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insignias.map((insignia) => (
              <TableRow key={insignia.id}>
                <TableCell>
                  <StorageImage
                    folder='insignias'
                    src={insignia.image}
                    alt={insignia.name}
                    className='w-10 h-10 object-contain'
                  />
                </TableCell>
                <TableCell className='font-medium text-white'>{insignia.name}</TableCell>
                <TableCell className='text-gray-400'>{insignia.price}</TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {insignia.role === 'god' ? 'Deus' : 'Engenheiro Espacial'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <InsigniaForm
                      onSubmit={handleUpdateInsignia}
                      initialValues={insignia}
                    >
                      <Button variant='outline' size='sm'>
                        Editar
                      </Button>
                    </InsigniaForm>
                    <DeleteInsigniaDialog
                      onConfirm={() =>
                        insignia.id && handleDeleteInsignia(insignia.id, insignia.image)
                      }
                    >
                      <Button variant='destructive' size='sm'>
                        Excluir
                      </Button>
                    </DeleteInsigniaDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
