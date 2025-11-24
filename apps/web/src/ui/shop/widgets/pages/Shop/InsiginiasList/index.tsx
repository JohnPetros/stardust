'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { InsiginiasListView } from './InsigniasListView'
import { useInsigniasList } from './useInsigniasList'

export const InsigniasList = () => {
  const { shopService } = useRest()
  const { insignias } = useInsigniasList(shopService)

  return <InsiginiasListView insignias={insignias} />
}
