'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { InsiginiasListView } from './InsiginiasListView'
import { useInsiginiasList } from './useInsiginiasList'

export const InsigniasList = () => {
  const { shopService } = useRest()
  const { insignias } = useInsiginiasList(shopService)

  return <InsiginiasListView insignias={insignias} />
}
