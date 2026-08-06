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
}

export const FeedbackReportsTableView = ({
  reports,
  isLoading,
  onView,
}: FeedbackReportsTableViewProps) => {
  if (isLoading) {
    return <FeedbackReportsTableSkeleton />
  }

  return (
    <div className='overflow-x-auto rounded-xl border border-zinc-800'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-25'>ID</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atividade</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Respostas admin</TableHead>
            <TableHead className='text-right'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className='text-center text-muted-foreground'>
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
                  <TableCell
                    className={
                      report.isUnread ? 'border-l-2 border-amber-400' : undefined
                    }
                  >
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
                      <div>
                        <span className='font-medium'>{authorName}</span>
                        {report.authorEmail && (
                          <div className='text-xs text-muted-foreground'>
                            {report.authorEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={intentVariant}>{intentLabel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={report.status.isOpen.isTrue ? 'outline' : 'secondary'}
                    >
                      {report.status.isOpen.isTrue ? 'Aberto' : 'Fechado'}
                    </Badge>
                    {report.isUnread && (
                      <span className='ml-2 text-xs font-medium text-amber-300'>
                        Não lido
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Datetime(report.lastActivityAt).format('DD/MM/YYYY HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    {report.preview.value ? (
                      <span className='line-clamp-2 text-sm text-muted-foreground'>
                        {report.preview.value}
                      </span>
                    ) : report.screenshot ? (
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
                  <TableCell
                    className='text-center'
                    aria-label={`${report.adminMessageCount} respostas admin`}
                  >
                    {report.adminMessageCount}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='outline' size='sm' onClick={() => onView(report)}>
                      Ver conversa
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
