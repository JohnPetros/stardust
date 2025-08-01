import type { Text } from '#global/domain/structures/Text'
import type { PaginationParams } from '../../global/domain/types/PaginationParams'
import type { StorageFolder } from '../structures/StorageFolder'

export type FilesListingParams = {
  folder: StorageFolder
  search: Text
} & PaginationParams
