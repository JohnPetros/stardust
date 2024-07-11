import type { FilteringSettings } from './FilteringSettings'
import type { SortingSettings } from './SortingSettings'

export type ShopItemsListingSettings = FilteringSettings &
  SortingSettings & { shouldFetchUnlocked: boolean | null }
