import type { Text } from '#global/domain/structures/Text'
import type { ManyItems } from '../../global/domain/types'
import type { StorageFolder } from '../structures'
import type { FilesListingParams } from '../types'

export interface StorageProvider {
  upload(folder: StorageFolder, file: File): Promise<File>
  findFile(folder: StorageFolder, fileName: Text): Promise<File | null>
  listFiles(params: FilesListingParams): Promise<ManyItems<File>>
  removeFile(folder: StorageFolder, fileName: Text): Promise<void>
}
