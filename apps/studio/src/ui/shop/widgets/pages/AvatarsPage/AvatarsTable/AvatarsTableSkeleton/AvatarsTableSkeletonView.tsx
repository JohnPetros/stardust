import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Skeleton } from '@/ui/shadcn/components/skeleton'

export const AvatarsTableSkeletonView = () => {
  return (
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
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='w-12 h-12 rounded' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-12' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-10 rounded-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-10 rounded-full' />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-16 rounded-md' />
                <Skeleton className='h-8 w-16 rounded-md' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
