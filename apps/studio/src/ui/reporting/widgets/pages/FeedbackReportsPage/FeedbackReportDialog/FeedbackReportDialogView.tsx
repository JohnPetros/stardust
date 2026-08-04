import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'
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
import { Textarea } from '@/ui/shadcn/components/textarea'
import { Datetime } from '@stardust/core/global/libs'

export type FeedbackReportDialogViewProps = {
  detail: FeedbackReportDetailsDto | null
  isOpen: boolean
  isLoading: boolean
  error: string | null
  content: string
  files: File[]
  isSending: boolean
  isMutatingStatus: boolean
  onContentChange: (value: string) => void
  onFilesChange: (files: File[]) => void
  onSend: () => void
  onStatusChange: () => void
  onClose: () => void
}

export const FeedbackReportDialogView = ({
  detail,
  isOpen,
  isLoading,
  error,
  content,
  files,
  isSending,
  isMutatingStatus,
  onContentChange,
  onFilesChange,
  onSend,
  onStatusChange,
  onClose,
}: FeedbackReportDialogViewProps) => {
  const author = detail?.author.entity
  const closed = detail?.status === 'closed'
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby='feedback-dialog-description'
        className='max-h-[92vh] max-w-3xl overflow-hidden border-zinc-800 bg-zinc-950 p-0 text-zinc-100'
      >
        <DialogHeader className='border-b border-zinc-800 bg-zinc-900/90 px-6 py-5 text-left'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <DialogTitle tabIndex={-1} className='text-xl'>
                {detail?.title ?? 'Feedback'}
              </DialogTitle>
              <DialogDescription id='feedback-dialog-description' className='mt-1'>
                {author?.name ?? 'Anônimo'} ·{' '}
                {detail
                  ? new Datetime(detail.createdAt ?? detail.sentAt).format(
                      'DD/MM/YYYY HH:mm:ss',
                    )
                  : ''}
              </DialogDescription>
            </div>
            {detail && (
              <Badge variant={closed ? 'secondary' : 'outline'}>
                {closed ? 'Fechado' : 'Aberto'}
              </Badge>
            )}
          </div>
        </DialogHeader>
        {isLoading && (
          <div role='status' className='p-8 text-center text-zinc-400'>
            Carregando conversa…
          </div>
        )}
        {error && (
          <div
            role='alert'
            className='m-6 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-200'
          >
            {error}
          </div>
        )}
        {detail && !isLoading && (
          <div className='flex min-h-0 flex-col overflow-y-auto px-6 py-5'>
            <div className='rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4'>
              <p className='text-xs font-semibold uppercase tracking-widest text-cyan-300'>
                Relato original
              </p>
              <p className='mt-3 whitespace-pre-wrap text-sm leading-6'>
                {detail.content}
              </p>
              {detail.screenshot && (
                <img
                  src={detail.screenshot}
                  alt='Screenshot anexado ao relato original'
                  className='mt-4 max-h-64 w-full rounded-lg object-contain'
                />
              )}
            </div>
            <div className='my-5 space-y-4'>
              {detail.messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-xl border p-4 ${message.authorRole === 'admin' ? 'ml-8 border-emerald-900/60 bg-emerald-950/15' : 'mr-8 border-zinc-800 bg-zinc-900/60'}`}
                >
                  <div className='flex items-center justify-between gap-3 text-xs text-zinc-500'>
                    <span className='font-medium text-zinc-300'>
                      {message.authorRole === 'admin' ? 'Studio' : 'Usuário'}
                    </span>
                    <time>
                      {message.createdAt
                        ? new Datetime(message.createdAt).format('DD/MM/YYYY HH:mm:ss')
                        : ''}
                    </time>
                  </div>
                  <p className='mt-2 whitespace-pre-wrap text-sm leading-6'>
                    {message.content}
                  </p>
                  {message.attachments.length > 0 && (
                    <ul className='mt-3 flex flex-wrap gap-2'>
                      {message.attachments.map((attachment) => (
                        <li
                          key={attachment.id}
                          className='rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400'
                        >
                          {attachment.originalName}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
            {closed ? (
              <div className='rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 text-sm text-amber-200'>
                Esta conversa está fechada. Reabra para continuar respondendo.
              </div>
            ) : (
              <section
                aria-label='Responder ao feedback'
                className='rounded-xl border border-zinc-800 bg-zinc-900/70 p-4'
              >
                <Textarea
                  aria-label='Resposta'
                  value={content}
                  onChange={(event) => onContentChange(event.target.value)}
                  placeholder='Escreva uma resposta…'
                  maxLength={2000}
                  disabled={isSending}
                />
                <div className='mt-3 flex flex-wrap items-center justify-between gap-3'>
                  <label className='cursor-pointer text-sm text-zinc-400 hover:text-zinc-200'>
                    <span>Anexar imagens (até 3)</span>
                    <input
                      className='sr-only'
                      type='file'
                      accept='image/png,image/jpeg'
                      multiple
                      onChange={(event) =>
                        onFilesChange(Array.from(event.target.files ?? []).slice(0, 3))
                      }
                    />
                  </label>
                  <span className='text-xs text-zinc-500'>
                    {content.length}/2000 · {files.length} anexo(s)
                  </span>
                </div>
              </section>
            )}
          </div>
        )}
        <DialogFooter className='border-t border-zinc-800 bg-zinc-900/80 px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            Fechar
          </Button>
          {detail && (
            <Button
              variant='outline'
              onClick={onStatusChange}
              disabled={isMutatingStatus}
            >
              {closed ? 'Reabrir conversa' : 'Fechar conversa'}
            </Button>
          )}
          {detail && !closed && (
            <Button onClick={onSend} disabled={isSending || !content.trim()}>
              {isSending ? 'Enviando…' : 'Enviar resposta'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
