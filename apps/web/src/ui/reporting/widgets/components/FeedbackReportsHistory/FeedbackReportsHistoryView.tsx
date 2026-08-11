import { Icon } from '@/ui/global/widgets/components/Icon'
import type { FeedbackFilter, FeedbackRequestState } from '@/ui/reporting/types'
import type { FeedbackReportHistoryItem } from './useFeedbackReportsHistory'

type Props = {
  items: FeedbackReportHistoryItem[]
  filters: Array<{ value: FeedbackFilter; label: string }>
  filter: FeedbackFilter
  state: FeedbackRequestState
  onFilterChange: (filter: FeedbackFilter) => void
  onSelect: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
  onRetry: () => void
}

export function FeedbackReportsHistoryView({
  items,
  filters,
  filter,
  state,
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
      <div className='mb-4 flex items-center justify-between gap-3'>
        <p className='text-[10px] text-gray-300'>{items.length} reportes</p>
        <label className='sr-only' htmlFor='feedback-history-filter'>
          Filtrar reportes
        </label>
        <select
          id='feedback-history-filter'
          aria-label='Filtrar reportes'
          value={filter}
          onChange={(event) => onFilterChange(event.target.value as FeedbackFilter)}
          className='rounded-full border-0 bg-[#263031] px-4 py-1 text-[10px] text-gray-300 outline-none'
        >
          {filters.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
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
          <div className='space-y-2.5'>
            {items.map(({ report, meta, dateLabel }) => {
              return (
                <button
                  key={report.id}
                  type='button'
                  onClick={() => report.id && onSelect(report.id)}
                  className='group flex min-h-24 w-full items-center gap-3 rounded-lg border border-transparent bg-[#1f2728] p-4 text-left transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-[#263031] focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400'
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
                        <span className='rounded-full bg-green-400 px-1.5 py-0.5 text-[8px] font-black uppercase text-gray-950'>
                          Nova resposta
                        </span>
                      )}
                    </span>
                    <span className='mt-1 block truncate text-[11px] text-gray-500'>
                      {report.preview ?? report.content}
                    </span>
                  </span>
                  <span className='flex shrink-0 flex-col items-end gap-1'>
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${report.status === 'closed' ? 'bg-gray-800 text-gray-500' : 'bg-green-950 text-green-400'}`}
                    >
                      {report.status === 'closed' ? 'Fechado' : 'Aberto'}
                    </span>
                    <span className='text-[10px] text-gray-600'>{dateLabel}</span>
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
      {state === 'content' && (
        <p className='mt-auto pt-5 text-center text-[10px] text-gray-500'>
          Selecione um reporte para abrir a conversa
        </p>
      )}
    </section>
  )
}
