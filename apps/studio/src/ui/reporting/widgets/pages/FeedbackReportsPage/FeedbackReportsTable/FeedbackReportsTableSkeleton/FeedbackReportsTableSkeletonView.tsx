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
          <TableHead>Data</TableHead>
          <TableHead>Preview</TableHead>
          <TableHead className='text-right'>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((id) => (
          <TableRow key={id}>
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
            <TableCell className='text-right'>
              <div className='flex items-center justify-end gap-2'>
                <Skeleton className='h-8 w-12' />
                <Skeleton className='h-8 w-16' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
