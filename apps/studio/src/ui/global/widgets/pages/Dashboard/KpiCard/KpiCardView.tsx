import { Badge } from '@/ui/shadcn/components/badge'
import { Icon } from '../../../components/Icon'
import type { Kpi } from '@stardust/core/global/structures'
import { Tooltip } from '../../../components/Tooltip'

type Props = {
  title: string
  kpi: Kpi
}

export const KpiCardView = ({ title, kpi }: Props) => {
  return (
    <article className='flex flex-col gap-2 bg-zinc-900 border border-zinc-700 rounded-md p-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm text-zinc-400'>{title}</h2>
       <Tooltip content='Porcentagem de variação do mês atual em relação ao mês anterior'>
          <Badge variant="outline" className='border-zinc-700'>
            <Icon name={kpi.isTrendingUp.isTrue ? 'trending-up' : 'trending-down'} />
            {kpi.trendPercentage.value}%
          </Badge>
       </Tooltip>
      </div>


      <strong className='text-4xl font-bold text-zinc-50'>{kpi.value.value}</strong>

      <div className='mt-3'>
        {kpi.isTrendingUp.isTrue && (
          <span className='flex items-center gap-2 text-md font-bold text-zinc-50'>
            {kpi.currentMonthValue.value - kpi.previousMonthValue.value} registrado(s)
            neste mês
            <Icon name='trending-up' size={16} />
          </span>
        )}
        {kpi.isTrendingDown.isTrue && (
          <span className='flex items-center gap-2 text-md font-bold text-zinc-50'>
            {kpi.currentMonthValue.value - kpi.previousMonthValue.value} removido(s)
            neste mês
            <Icon name='trending-down' size={16} />
          </span>
        )}
          {kpi.hasNoTrend.isTrue && (
          <span className='flex items-center gap-2 text-md font-bold text-zinc-50'>
            Nenhuma alteração desde o mês anterior
            <Icon name='trending-down' size={16} />
          </span>
        )}
      </div>

      <div className='flex items-center gap-4'>
        <p className='text-sm text-zinc-400'>
          No mês atual: {kpi.currentMonthValue.value}
        </p>
        <p className='text-sm text-zinc-400'>
          No mês anterior: {kpi.previousMonthValue.value}
        </p>
      </div>
    </article>
  )
}
