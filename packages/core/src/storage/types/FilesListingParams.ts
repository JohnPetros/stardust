import type { PaginationParams } from '../../global/domain/types/PaginationParams'
import type { Text } from '../../global/structures'
import type { StorageFolder } from './StorageFolder'

export type FilesListingParams = {
  folder: StorageFolder
  search: Text
} & PaginationParams
