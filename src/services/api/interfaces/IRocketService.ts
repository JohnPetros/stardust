import { FilterOptions } from '@/@types/filterOptions'
import { Order } from '@/@types/order'
import { Rocket } from '@/@types/rocket'

type SortingOptions = {
  priceOrder: Order
  userId: string
  shouldFetchUnlocked: boolean
}

export interface IRocketService {
  getRockets(
    filterAndSortingOptions: FilterOptions & SortingOptions
  ): Promise<{ rockets: Rocket[]; count: number | null }>
  getRocket(rocketId: string): Promise<Rocket>
  getUserAcquiredRocketsIds(userId: string): Promise<string[]>
  addUserAcquiredRocket(
    rocketId: string,
    userId: string
  ): Promise<string | undefined>
}
