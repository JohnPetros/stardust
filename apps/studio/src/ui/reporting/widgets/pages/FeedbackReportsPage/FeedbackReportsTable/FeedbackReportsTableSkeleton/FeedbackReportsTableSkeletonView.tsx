import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/shadcn/components/table'
import { Skeleton } from '@/ui/shadcn/components/skeleton'

export const FeedbackReportsTableSkeletonView = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-25'>ID</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Atividade</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead>Respostas</TableHead>
          <TableHead className='text-right'>Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((id) => (
          <TableRow key={id}>
            <TableCell>
              <Skeleton className='h-5 w-16 rounded-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-12' />
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-5 w-16 rounded-full' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-32' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-10 w-16 rounded' />
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-8' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='ml-auto h-8 w-24' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
