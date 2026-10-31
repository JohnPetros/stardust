import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Skeleton } from '@/ui/shadcn/components/skeleton'

export const UsersTableSkeletonView = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Nível</TableHead>
          <TableHead>XP Semanal</TableHead>
          <TableHead>Estrelas Desbloqueadas</TableHead>
          <TableHead>Conquistas Desbloqueadas</TableHead>
          <TableHead>Desafios Completados</TableHead>
          <TableHead>Status do Espaço</TableHead>
          <TableHead>Insígnias</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className='text-right'>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TableRow key={index}>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                <Skeleton className='w-8 h-8 rounded-full' />
                <Skeleton className='h-4 w-32' />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-12' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-24 rounded-full' />
            </TableCell>
            <TableCell>
              <div className='flex flex-wrap gap-1'>
                <Skeleton className='h-5 w-16 rounded-full' />
                <Skeleton className='h-5 w-16 rounded-full' />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-36' />
            </TableCell>
            <TableCell className='text-right'>
              <div className='flex justify-end'>
                <Skeleton className='h-8 w-8 rounded-md' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
