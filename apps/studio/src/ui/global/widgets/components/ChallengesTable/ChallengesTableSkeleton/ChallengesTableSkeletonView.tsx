import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Skeleton } from '@/ui/shadcn/components/skeleton'

export const ChallengesTableSkeletonView = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Dificuldade</TableHead>
          <TableHead>Data de Postagem</TableHead>
          <TableHead>Visibilidade</TableHead>
          <TableHead>Downvotes</TableHead>
          <TableHead>Upvotes</TableHead>
          <TableHead>Qtd. de usuários que completaram</TableHead>
          <TableHead>Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-48' />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Skeleton className='w-8 h-8 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-16 rounded-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-36' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-16 rounded-full' />
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
              <Skeleton className='h-8 w-8 rounded-md' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
