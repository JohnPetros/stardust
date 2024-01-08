import { Avatar } from '@/@types/avatar'
import { FilterOptions } from '@/@types/filterOptions'
import { Order } from '@/@types/order'

type SortingOptions = {
  priceOrder: Order
}

export interface IAvatarsController {
  getAvatars(
    filterAndSortingOptions: FilterOptions & SortingOptions
  ): Promise<{ avatars: Avatar[]; count: number | null }>
  getAvatar(avatarId: string): Promise<Avatar>
  getUserAcquiredAvatarsIds(userId: string): Promise<string[]>
  addUserAcquiredAvatar(
    avatarId: string,
    userId: string
  ): Promise<string | undefined>
}
