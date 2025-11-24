import type { ShopService } from '@stardust/core/shop/interfaces'
import { Insignia } from '@stardust/core/shop/entities'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useInsigniasList(service: ShopService) {
  async function fetchInsignias() {
    const response = await service.fetchInsigniasList()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data } = useCache({
    key: CACHE.keys.shopInsignias,
    fetcher: fetchInsignias,
  })

  return {
    insignias: data ? data.map(Insignia.create) : [],
  }
}
