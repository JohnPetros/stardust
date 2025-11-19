import { useState } from 'react'

import { ListingOrder, OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { ShopService } from '@stardust/core/shop/interfaces'

import { CACHE } from '@/constants'
import { Insignia } from '@stardust/core/shop/entities'
import { useCache } from '@/ui/global/hooks/useCache'


export function useInsiginiasList(service: ShopService) {
  async function fetchInsignias() {
    const response = await service.fetchInsigniasList()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data,  } = useCache({
    key: CACHE.keys.shopInsignias,
    fetcher: fetchInsignias,
  })

  return {
    insignias: data ? data.map(Insignia.create) : []
  }
}
