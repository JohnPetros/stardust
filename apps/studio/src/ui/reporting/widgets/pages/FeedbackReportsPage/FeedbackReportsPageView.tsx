import { Input } from '@/ui/shadcn/components/input'
import { Button } from '@/ui/shadcn/components/button'
import { PeriodPicker } from '@/ui/global/widgets/components/PeriodPicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { FeedbackReportsTable } from './FeedbackReportsTable'
import type { FeedbackReportsFilters } from './useFeedbackReportsPage'
import type { FeedbackReport } from '@stardust/core/reporting/entities'

export type FeedbackReportsPageViewProps = {
  reports: FeedbackReport[]
  summary: { total: number; open: number; closed: number; unread: number }
  isLoading: boolean
  error: string | null
  totalItemsCount: number
  totalPages: number
  filters: FeedbackReportsFilters
  onSearch: (value: string) => void
  onIntent: (value: string) => void
  onStatus: (value: string) => void
  onPeriod: (period: { startDate?: Date; endDate?: Date }) => void
  onView: (report: FeedbackReport) => void
  onClearFilters: () => void
  onRetry: () => void
  onPage: (page: number) => void
  onItemsPerPage: (count: number) => void
}

export const FeedbackReportsPageView = (props: FeedbackReportsPageViewProps) => {
  const { reports, summary, filters, isLoading, error, totalItemsCount, totalPages } =
    props
  const noResults = !isLoading && !error && reports.length === 0
  return (
    <main className='min-h-full bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-10'>
      <div className='mx-auto flex flex-col gap-7'>
        <header className='flex flex-col gap-2'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400'>
            Central administrativa
          </p>
          <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            Relatórios de feedback
          </h1>
          <p className='max-w-2xl text-sm text-zinc-400'>
            Acompanhe o que a comunidade está dizendo e mantenha cada conversa em
            movimento.
          </p>
        </header>
        <section
          aria-label='Resumo dos relatórios'
          className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'
        >
          {[
            ['Total', summary.total, 'text-zinc-100'],
            ['Abertos', summary.open, 'text-emerald-300'],
            ['Fechados', summary.closed, 'text-zinc-300'],
            ['Não lidos', summary.unread, 'text-amber-300'],
          ].map(([label, value, color]) => (
            <div
              key={String(label)}
              className='rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm'
            >
              <p className='text-xs uppercase tracking-widest text-zinc-500'>{label}</p>
              <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </section>
        <section
          aria-label='Filtros'
          className='rounded-xl border border-zinc-800 bg-zinc-900/50 p-4'
        >
          <div className='grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_10rem_10rem_auto]'>
            <Input
              aria-label='Buscar feedbacks'
              placeholder='Buscar por ID ou e-mail'
              value={filters.search}
              onChange={(e) => props.onSearch(e.target.value)}
            />
            <Select value={filters.intent} onValueChange={props.onIntent}>
              <SelectTrigger aria-label='Filtrar por intenção'>
                <SelectValue placeholder='Intenção' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas as intenções</SelectItem>
                <SelectItem value='bug'>Bug</SelectItem>
                <SelectItem value='idea'>Ideia</SelectItem>
                <SelectItem value='other'>Outro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={props.onStatus}>
              <SelectTrigger aria-label='Filtrar por status'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os status</SelectItem>
                <SelectItem value='open'>Aberto</SelectItem>
                <SelectItem value='closed'>Fechado</SelectItem>
              </SelectContent>
            </Select>
            <PeriodPicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              label='Criado em'
              onChange={props.onPeriod}
            />
          </div>
        </section>
        {error ? (
          <div
            role='alert'
            className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-900/70 bg-red-950/30 p-5 text-sm text-red-200'
          >
            <span>{error}</span>
            <Button variant='outline' onClick={props.onRetry}>
              Tentar novamente
            </Button>
          </div>
        ) : noResults ? (
          <div className='rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-12 text-center'>
            <h2 className='text-lg font-medium'>
              {filters.search || filters.intent !== 'all' || filters.status !== 'all'
                ? 'Nenhum resultado para estes filtros'
                : 'Nenhum feedback recebido'}
            </h2>
            <p className='mt-2 text-sm text-zinc-500'>
              A fila ficará disponível aqui quando houver novas conversas.
            </p>
            {(filters.search || filters.intent !== 'all' || filters.status !== 'all') && (
              <Button className='mt-5' variant='outline' onClick={props.onClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <FeedbackReportsTable
            reports={reports}
            isLoading={isLoading}
            onView={props.onView}
          />
        )}
        <div className='flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500'>
          <span>
            {totalItemsCount} relatório(s) · página {filters.page} de {totalPages}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => props.onPage(filters.page - 1)}
              disabled={filters.page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => props.onPage(filters.page + 1)}
              disabled={filters.page >= totalPages}
            >
              Próxima
            </Button>
            <Select
              value={String(filters.itemsPerPage)}
              onValueChange={(value) => props.onItemsPerPage(Number(value))}
            >
              <SelectTrigger aria-label='Itens por página' className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  )
}
