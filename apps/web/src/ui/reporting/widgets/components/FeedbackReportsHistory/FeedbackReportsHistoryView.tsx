import { Icon } from '@/ui/global/widgets/components/Icon'
import { FeedbackUnreadBadge } from '../FeedbackUnreadBadge'
import type { FeedbackFilter, FeedbackRequestState } from '@/ui/reporting/types'
import type { FeedbackReportDto } from '@stardust/core/reporting/entities/dtos'

type Props = {
  reports: FeedbackReportDto[]
  filter: FeedbackFilter
  state: FeedbackRequestState
  unreadCount: number
  onFilterChange: (filter: FeedbackFilter) => void
  onSelect: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
  onRetry: () => void
}

const filters: Array<{ value: FeedbackFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abertos' },
  { value: 'closed', label: 'Fechados' },
]

const intentMeta = {
  bug: {
    label: 'Problema',
    icon: 'bug' as const,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  idea: {
    label: 'Ideia',
    icon: 'lightbulb' as const,
    color: 'text-yellow-300',
    bg: 'bg-yellow-400/10',
  },
  other: {
    label: 'Outro',
    icon: 'comment' as const,
    color: 'text-blue-300',
    bg: 'bg-blue-400/10',
  },
}

function formatDate(value?: string) {
  if (!value) return 'sem data'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
    new Date(value),
  )
}

export function FeedbackReportsHistoryView({
  reports,
  filter,
  state,
  unreadCount,
  onFilterChange,
  onSelect,
  onLoadMore,
  hasMore,
  onRetry,
}: Props) {
  return (
    <section
      aria-labelledby='feedback-history-title'
      className='flex min-h-0 flex-1 flex-col'
    >
      <div className='mb-5 flex items-end justify-between gap-3'>
        <div>
          <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400'>
            Canal privado
          </p>
          <h2
            id='feedback-history-title'
            className='text-2xl font-black tracking-tight text-gray-100'
          >
            Meus reportes
          </h2>
          <p className='mt-1 text-xs text-gray-500'>
            Acompanhe o que acontece depois do envio.
          </p>
        </div>
        <FeedbackUnreadBadge count={unreadCount} />
      </div>
      <div
        role='tablist'
        aria-label='Filtrar reportes'
        className='mb-4 flex gap-1 rounded-xl border border-gray-800 bg-gray-950/70 p-1'
      >
        {filters.map((item) => (
          <button
            key={item.value}
            type='button'
            role='tab'
            aria-selected={filter === item.value}
            onClick={() => onFilterChange(item.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${filter === item.value ? 'bg-gray-800 text-gray-100 shadow-sm' : 'text-gray-600 hover:text-gray-300'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
        {state === 'loading' && (
          <div role='status' className='space-y-3'>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='h-20 animate-pulse rounded-xl border border-gray-800 bg-gray-900/80'
              />
            ))}
          </div>
        )}
        {state === 'error' && (
          <div
            role='alert'
            className='rounded-xl border border-red-900/60 bg-red-950/20 p-5 text-center'
          >
            <p className='text-sm text-red-200'>
              Não foi possível carregar seus reportes.
            </p>
            <button
              type='button'
              onClick={onRetry}
              className='mt-3 text-xs font-bold text-green-400 underline'
            >
              Tentar novamente
            </button>
          </div>
        )}
        {state === 'empty' && (
          <div
            role='status'
            className='rounded-xl border border-dashed border-gray-800 px-6 py-12 text-center'
          >
            <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-gray-600'>
              <Icon name='comment' size={22} />
            </div>
            <p className='text-sm font-bold text-gray-300'>Ainda não há reportes aqui.</p>
            <p className='mt-1 text-xs text-gray-600'>
              Quando você enviar algo, a conversa aparecerá nesta lista.
            </p>
          </div>
        )}
        {state === 'content' && (
          <div className='space-y-2'>
            {reports.map((report) => {
              const meta =
                intentMeta[report.intent as keyof typeof intentMeta] ?? intentMeta.other
              return (
                <button
                  key={report.id}
                  type='button'
                  onClick={() => report.id && onSelect(report.id)}
                  className='group flex w-full items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400'
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}
                  >
                    <Icon name={meta.icon} size={19} />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-2'>
                      <span className='truncate text-sm font-bold text-gray-200'>
                        {report.title ?? meta.label}
                      </span>
                      {report.hasUnreadAdminReply && (
                        <span className='rounded-full bg-green-400 px-2 py-0.5 text-[9px] font-black uppercase text-gray-950'>
                          Nova resposta
                        </span>
                      )}
                    </span>
                    <span className='mt-1 block truncate text-xs text-gray-500'>
                      {report.preview ?? report.content}
                    </span>
                  </span>
                  <span className='flex shrink-0 flex-col items-end gap-1'>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${report.status === 'closed' ? 'bg-gray-800 text-gray-500' : 'bg-green-950 text-green-400'}`}
                    >
                      {report.status === 'closed' ? 'Fechado' : 'Aberto'}
                    </span>
                    <span className='text-[10px] text-gray-600'>
                      {formatDate(report.lastActivityAt ?? report.createdAt)}
                    </span>
                  </span>
                  <Icon
                    name='arrow-right'
                    size={15}
                    className='text-gray-700 transition group-hover:text-green-400'
                  />
                </button>
              )
            })}
            {hasMore && (
              <button
                type='button'
                onClick={onLoadMore}
                className='mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 py-3 text-xs font-bold text-gray-400 transition hover:border-gray-600 hover:text-gray-200'
              >
                <Icon name='arrow-down' size={14} /> Carregar mais
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
