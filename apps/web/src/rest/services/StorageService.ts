import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import { MethodNotAllowedError } from '@stardust/core/global/errors'

export const StorageService = (_: RestClient): IStorageService => {
  return {
    async listFiles() {
      throw new MethodNotAllowedError('listFiles')
    },
  }
}
