import type { FilterOptions } from '../types/FilterOptions'
import type { Order } from '../types/Order'

import type { Avatar } from '@/@types/Avatar'

type SortingOptions = {
  priceOrder: Order
}

export interface IAvatarsController {
  getFilteredAvatars(
    filterAndSortingOptions: FilterOptions & SortingOptions
  ): Promise<{ avatars: Avatar[]; count: number | null }>
  getAvatar(avatarId: string): Promise<Avatar>
  getUserAcquiredAvatarsIds(userId: string): Promise<string[]>
  addUserAcquiredAvatar(
    avatarId: string,
    userId: string
  ): Promise<string | undefined>
}
