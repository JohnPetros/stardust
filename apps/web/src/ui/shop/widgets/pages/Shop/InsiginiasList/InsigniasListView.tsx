import type { Insignia } from '@stardust/core/shop/entities'

import { InsigniaItem } from './InsigniaItem'

type Props = {
  insignias: Insignia[]
}

export const InsiginiasListView = ({ insignias }: Props) => {
  return (
    <section id='insignias'>
      <h2 className='text-lg font-semibold text-white'>Insígnias</h2>
      <ul className='grid grid-cols-1 items-start justify-center mt-6 sm:grid-cols-2 lg:grid-cols-3'>
        {insignias.map((insignia) => (
          <li key={insignia.id.value}>
            <InsigniaItem insignia={insignia} />
          </li>
        ))}
      </ul>
    </section>
  )
}
