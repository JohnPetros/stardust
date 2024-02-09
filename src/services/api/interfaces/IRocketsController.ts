import { FilterOptions } from '@/@types/filterOptions'
import { Order } from '@/@types/Order'
import { Rocket } from '@/@types/Rocket'

type SortingOptions = {
  priceOrder: Order
  userId: string
  shouldFetchUnlocked: boolean | null
}

export interface IRocketsController {
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
