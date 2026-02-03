import type { FeedbackReport } from '@stardust/core/reporting/entities'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/components/dialog'
import { Badge } from '@/ui/shadcn/components/badge'
import { Button } from '@/ui/shadcn/components/button'
import { Datetime } from '@stardust/core/global/libs'

export type FeedbackReportDialogViewProps = {
  report: FeedbackReport | null
  isOpen: boolean
  onClose: () => void
  onDelete: (report: FeedbackReport) => void
}

export const FeedbackReportDialogView = ({
  report,
  isOpen,
  onClose,
  onDelete,
}: FeedbackReportDialogViewProps) => {
  const intentVariant = report?.intent.isBug.isTrue
    ? 'destructive'
    : report?.intent.isIdea.isTrue
      ? 'default'
      : 'secondary'

  const intentLabel = report?.intent.isBug.isTrue
    ? 'Bug'
    : report?.intent.isIdea.isTrue
      ? 'Ideia'
      : 'Outro'

  const authorDto = report?.author.dto.entity

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-3xl p-0 overflow-hidden'>
        <div className='px-6 pt-6 pb-4 bg-linear-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800'>
          <DialogHeader className='gap-3'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <DialogTitle>Detalhes do feedback</DialogTitle>
                <DialogDescription>
                  {report
                    ? new Datetime(report.sentAt).format('DD/MM/YYYY HH:mm:ss')
                    : ''}
                </DialogDescription>
              </div>
              {report && (
                <Badge variant={intentVariant} className='self-start'>
                  {intentLabel}
                </Badge>
              )}
            </div>
            {report && (
              <div className='flex flex-wrap items-center gap-2 text-sm text-zinc-400'>
                <span className='px-2 py-1 rounded-full bg-zinc-800/60 border border-zinc-700'>
                  Enviado por {authorDto?.name ?? 'Anônimo'}
                </span>
                <span className='px-2 py-1 rounded-full bg-zinc-800/60 border border-zinc-700'>
                  ID {report.id.value.slice(0, 8).toUpperCase()}
                </span>
              </div>
            )}
          </DialogHeader>
        </div>

        {report && (
          <div className='flex flex-col gap-5 px-6 py-5'>
            <div className='rounded-lg border border-zinc-800 bg-zinc-900/60 p-4'>
              <div className='text-xs uppercase tracking-wide text-zinc-400'>
                Conteúdo
              </div>
              <div className='mt-2 text-sm leading-relaxed whitespace-pre-wrap'>
                {report.content.value}
              </div>
            </div>

            <div className='rounded-lg border border-zinc-800 bg-zinc-900/40 p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-xs uppercase tracking-wide text-zinc-400'>
                  Screenshot
                </span>
                {!report.screenshot && (
                  <span className='text-xs text-zinc-400'>Sem anexo</span>
                )}
              </div>
              {report.screenshot && (
                <div className='mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-2'>
                  <img
                    src={report.screenshot.value}
                    alt='Screenshot do feedback'
                    className='w-full max-h-105 rounded object-contain'
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className='px-6 pb-6'>
          <Button variant='outline' onClick={onClose}>
            Fechar
          </Button>
          {report && (
            <Button variant='destructive' onClick={() => onDelete(report)}>
              Deletar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
