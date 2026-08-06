import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'
import { Badge } from '@/ui/shadcn/components/badge'
import { Button } from '@/ui/shadcn/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { Textarea } from '@/ui/shadcn/components/textarea'
import { Datetime } from '@stardust/core/global/libs'
import { Bell } from 'lucide-react'
import { Icon } from '@/ui/global/widgets/components/Icon'

export type FeedbackReportDetailPageViewProps = {
  detail: FeedbackReportDetailsDto | null
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
  onBack: () => void
}

export const FeedbackReportDetailPageView = ({
  detail,
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
  onBack,
}: FeedbackReportDetailPageViewProps) => {
  const author = detail?.author.entity
  const closed = detail?.status === 'closed'
  return (
    <main className='min-h-full bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-10'>
      <div className='mx-auto flex flex-col gap-6'>
        <header className='flex flex-col gap-4'>
          <Button variant='ghost' className='w-fit px-0 text-zinc-400' onClick={onBack}>
            ← Voltar para relatórios
          </Button>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400'>
              Conversa de feedback
            </p>
            <h1 className='mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'>
              {detail?.title ?? 'Feedback'}
            </h1>
          </div>
        </header>
        {isLoading && (
          <div
            role='status'
            className='flex min-h-96 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-zinc-400'
          >
            Carregando conversa…
          </div>
        )}
        {error && (
          <div
            role='alert'
            className='flex min-h-32 items-center rounded-xl border border-red-900 bg-red-950/30 p-6 text-sm text-red-200'
          >
            {error}
          </div>
        )}
        {detail && !isLoading && (
          <section className='grid min-h-[min(72vh,760px)] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm lg:grid-cols-[minmax(0,1fr)_20rem]'>
            <div className='flex min-h-0 min-w-0 flex-col'>
              <div className='border-b border-zinc-800 bg-zinc-900/90 px-7 py-6'>
                <div className='flex items-start justify-between gap-4 pr-8'>
                  <div className='min-w-0'>
                    <p className='text-sm text-zinc-400'>
                      {author?.name ?? 'Anônimo'} ·{' '}
                      {new Datetime(detail.createdAt ?? detail.sentAt).format(
                        'DD/MM/YYYY HH:mm:ss',
                      )}
                    </p>
                  </div>
                  <Badge variant={closed ? 'secondary' : 'outline'}>
                    {closed ? 'Fechado' : 'Aberto'}
                  </Badge>
                </div>
              </div>
              <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-7 py-6'>
                <div className='rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-5'>
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
                      className='mt-4 max-h-72 w-full rounded-lg object-contain'
                    />
                  )}
                </div>
                <div className='my-6 space-y-4'>
                  {detail.messages.map((message) => {
                    const isAdmin = message.authorRole === 'admin'

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <article
                          className={`max-w-[86%] border px-4 py-3 shadow-sm sm:max-w-[78%] ${isAdmin ? 'rounded-2xl rounded-br-md border-emerald-800/70 bg-emerald-950/45' : 'rounded-2xl rounded-bl-md border-zinc-800 bg-zinc-900/80'}`}
                        >
                          <div className='flex items-center gap-2 text-[11px] text-zinc-500'>
                            <span
                              className={`flex size-5 items-center justify-center rounded-full text-[9px] font-bold uppercase ${isAdmin ? 'bg-emerald-400/20 text-emerald-300' : 'bg-zinc-700 text-zinc-300'}`}
                            >
                              {isAdmin ? 'S' : 'U'}
                            </span>
                            <span className='font-medium text-zinc-300'>
                              {isAdmin ? 'Studio' : 'Usuário'}
                            </span>
                            <span aria-hidden='true'>·</span>
                            <time>
                              {message.createdAt
                                ? new Datetime(message.createdAt).format(
                                    'DD/MM/YYYY HH:mm:ss',
                                  )
                                : ''}
                            </time>
                          </div>
                          <p className='mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-100'>
                            {message.content}
                          </p>
                          {message.attachments.length > 0 && (
                            <ul className='mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3'>
                              {message.attachments.map((attachment) => (
                                <li
                                  key={attachment.id}
                                  className='rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-xs text-zinc-400'
                                >
                                  {attachment.originalName}
                                </li>
                              ))}
                            </ul>
                          )}
                        </article>
                      </div>
                    )
                  })}
                </div>
              </div>
              {closed ? (
                <div className='mx-7 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-900/60 bg-amber-950/20 p-5 text-sm text-amber-200'>
                  <span>
                    Esta conversa está fechada. Reabra para continuar respondendo.
                  </span>
                  <Button
                    variant='outline'
                    onClick={onStatusChange}
                    disabled={isMutatingStatus}
                  >
                    Reabrir conversa
                  </Button>
                </div>
              ) : (
                <section
                  aria-label='Responder ao feedback'
                  className='mx-7 mb-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70'
                >
                  <div className='p-5'>
                    <Textarea
                      aria-label='Resposta'
                      value={content}
                      onChange={(event) => onContentChange(event.target.value)}
                      placeholder='Escreva uma resposta…'
                      maxLength={2000}
                      disabled={isSending}
                      className='min-h-32 resize-none'
                    />
                    <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
                      <label className='cursor-pointer text-sm text-zinc-400 hover:text-zinc-200'>
                        <Icon name='image' size={14} className='mr-1 inline-block' />
                        <span>Anexar imagens (até 3)</span>
                        <input
                          className='sr-only'
                          type='file'
                          accept='image/png,image/jpeg'
                          multiple
                          onChange={(event) =>
                            onFilesChange(
                              Array.from(event.target.files ?? []).slice(0, 3),
                            )
                          }
                        />
                      </label>
                      <span className='text-xs text-zinc-500'>
                        {content.length}/2000 · {files.length} anexo(s)
                      </span>
                    </div>
                  </div>
                  <footer className='flex flex-wrap justify-end gap-2 border-t border-zinc-800 bg-zinc-950/40 px-5 py-4'>
                    <Button
                      variant='outline'
                      onClick={onStatusChange}
                      disabled={isMutatingStatus}
                    >
                      Fechar conversa
                    </Button>
                    <Button onClick={onSend} disabled={isSending || !content.trim()}>
                      {isSending ? 'Enviando…' : 'Enviar resposta'}
                    </Button>
                  </footer>
                </section>
              )}
            </div>
            <aside className='border-t border-zinc-800 bg-zinc-900/60 px-6 py-7 lg:border-l lg:border-t-0'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-widest text-zinc-500'>
                  Status do relatório
                </p>
                <Select
                  value={closed ? 'closed' : 'open'}
                  onValueChange={onStatusChange}
                  disabled={isMutatingStatus}
                >
                  <SelectTrigger className='mt-3 w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='open'>Aberto</SelectItem>
                    <SelectItem value='closed'>Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='mt-6 space-y-5 border-t border-zinc-800 pt-6'>
                <div>
                  <p className='text-xs text-zinc-500'>ID do relato</p>
                  <p className='mt-1 break-all font-mono text-xs text-zinc-300'>
                    {detail.id?.toUpperCase() ?? '—'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-zinc-500'>Tipo</p>
                  <p className='mt-1 text-sm text-zinc-200'>{detail.intent ?? '—'}</p>
                </div>
                <div>
                  <p className='text-xs text-zinc-500'>Autor</p>
                  <p className='mt-1 text-sm font-medium text-zinc-100'>
                    {author?.name ?? 'Anônimo'}
                  </p>
                  {detail?.authorEmail && (
                    <p className='mt-1 break-words text-xs text-zinc-400'>
                      {detail.authorEmail}
                    </p>
                  )}
                </div>
                <div>
                  <p className='text-xs text-zinc-500'>Enviado em</p>
                  <p className='mt-1 text-sm text-zinc-200'>
                    {detail
                      ? new Datetime(detail.createdAt ?? detail.sentAt).format(
                          'DD/MM/YYYY HH:mm:ss',
                        )
                      : '—'}
                  </p>
                </div>
                <div className='border-t border-zinc-800 pt-5'>
                  <div className='flex items-center gap-2'>
                    <Bell className='size-4 text-cyan-400' aria-hidden='true' />
                    <p className='text-xs font-semibold uppercase tracking-widest text-zinc-500'>
                      Notificações automáticas
                    </p>
                  </div>
                  <p className='mt-3 text-xs leading-5 text-zinc-500'>
                    O autor receberá um e-mail quando uma nova resposta for enviada.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  )
}
