'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { InsiginiasListView } from './InsigniasListView'
import { useInsigniasList } from './useInsigniasList'

export const InsigniasList = () => {
  const { shopService } = useRestContext()
  const { insignias } = useInsigniasList(shopService)

  return <InsiginiasListView insignias={insignias} />
}
