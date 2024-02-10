import type { FilterOptions } from '../types/FilterOptions'
import type { Order } from '../types/Order'

import type { Rocket } from '@/@types/Rocket'

type SortingOptions = {
  priceOrder: Order
  userId: string
  shouldFetchUnlocked: boolean | null
}

export interface IRocketsController {
  getFilteredRockets(
    filterAndSortingOptions: FilterOptions & SortingOptions
  ): Promise<{ rockets: Rocket[]; count: number | null }>
  getRocket(rocketId: string): Promise<Rocket>
  getUserAcquiredRocketsIds(userId: string): Promise<string[]>
  addUserAcquiredRocket(
    rocketId: string,
    userId: string
  ): Promise<string | undefined>
}
