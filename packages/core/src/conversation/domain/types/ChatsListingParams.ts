import type { Id } from '#global/domain/structures/Id'
import type { FilteringParams } from '#global/domain/types/FilteringParams'

export type ChatsListingParams = { userId: Id } & FilteringParams
