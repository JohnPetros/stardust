import type { Insignia } from '@stardust/core/shop/entities'

import { Pagination } from '@/ui/global/widgets/components/Pagination'
import { InsigniaItem } from './InsigniaItem'

type Props = {
  totalInsigniasCount: number
  insigniasPerPage: number
  page: number
  insignias: Insignia[]
  onPageChange: (value: number) => void
}

export const InsiginiasListView = ({
  totalInsigniasCount,
  insigniasPerPage,
  page,
  insignias,
  onPageChange,
}: Props) => {
  return (
    <section id='insignias'>
      <h2 className='text-lg font-semibold text-white'>Insíginias</h2>
      <ul className='mt-6 grid min-h-[36rem] grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {insignias.map((insignia) => (
          <li key={insignia.id.value}>
            <InsigniaItem
              id={insignia.id.value}
              image={insignia.image.value}
              name={insignia.name.value}
              price={insignia.price.value}
            />
          </li>
        ))}
      </ul>

      {totalInsigniasCount && (
        <div className='mt-3'>
          <Pagination
            totalItemsCount={totalInsigniasCount}
            page={page}
            itemsPerPage={insigniasPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  )
}
