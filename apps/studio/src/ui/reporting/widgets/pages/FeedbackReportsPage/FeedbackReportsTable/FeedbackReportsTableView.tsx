import type { FeedbackReport } from '@stardust/core/reporting/entities'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn/components/avatar'
import { Datetime } from '@stardust/core/global/libs'
import { FeedbackReportsTableSkeleton } from './FeedbackReportsTableSkeleton'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'

export type FeedbackReportsTableViewProps = {
  reports: FeedbackReport[]
  isLoading: boolean
  onView: (report: FeedbackReport) => void
  onDelete: (report: FeedbackReport) => void
}

export const FeedbackReportsTableView = ({
  reports,
  isLoading,
  onView,
  onDelete,
}: FeedbackReportsTableViewProps) => {
  if (isLoading) {
    return <FeedbackReportsTableSkeleton />
  }

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
        {reports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className='text-center text-muted-foreground'>
              Nenhum feedback encontrado
            </TableCell>
          </TableRow>
        ) : (
          reports.map((report) => {
            const authorDto = report.author?.dto?.entity
            const authorName = authorDto?.name ?? 'Anônimo'
            const authorAvatar = authorDto?.avatar?.image
            const intentVariant = report.intent.isBug.isTrue
              ? 'destructive'
              : report.intent.isIdea.isTrue
                ? 'default'
                : 'secondary'
            const intentLabel = report.intent.isBug.isTrue
              ? 'Bug'
              : report.intent.isIdea.isTrue
                ? 'Ideia'
                : 'Outro'

            return (
              <TableRow key={report.id.value}>
                <TableCell className='font-mono text-xs text-muted-foreground'>
                  {report.id.value.slice(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      {authorAvatar && (
                        <StorageImage
                          folder='avatars'
                          src={authorAvatar}
                          alt={authorName}
                          className='w-8 h-8 rounded-full object-cover border-2 border-zinc-700 shadow'
                        />
                      )}
                      <AvatarFallback>
                        {authorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium'>{authorName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={intentVariant}>{intentLabel}</Badge>
                </TableCell>
                <TableCell>
                  {new Datetime(report.sentAt).format('DD/MM/YYYY HH:mm:ss')}
                </TableCell>
                <TableCell>
                  {report.screenshot ? (
                    <img
                      src={report.screenshot.value}
                      alt='Screenshot'
                      loading='lazy'
                      className='w-16 h-10 rounded object-cover border border-zinc-800'
                    />
                  ) : (
                    <span className='text-sm text-muted-foreground'>
                      {report.content.value.slice(0, 40)}
                      {report.content.value.length > 40 ? '...' : ''}
                    </span>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button variant='outline' size='sm' onClick={() => onView(report)}>
                      Ver
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => onDelete(report)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
