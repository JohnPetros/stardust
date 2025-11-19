'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { InsiginiasListView } from './InsiginiasListView'
import { useInsiginiasList } from './useInsiginiasList'

export const InsigniasList = () => {
  const { shopService } = useRest()
  const { totalInsigniasCount, insigniasPerPage, insignias, page, handlePageChange } =
    useInsiginiasList(shopService)

  return (
    <InsiginiasListView
      onPageChange={handlePageChange}
      totalInsigniasCount={totalInsigniasCount}
      insigniasPerPage={insigniasPerPage}
      page={page}
      insignias={insignias}
    />
  )
}
