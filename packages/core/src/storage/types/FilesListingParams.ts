import type { Text } from '#global/domain/structures/Text'
import type { PaginationParams } from '../../global/domain/types/PaginationParams'
import type { FileStorageFolderPath } from '../domain/structures/FileStorageFolderPath'

export type FilesListingParams = {
  folder: FileStorageFolderPath
  search: Text
} & PaginationParams
