import type { RestClient } from '@stardust/core/global/interfaces'
import type { ManualService as IManualService } from '@stardust/core/manual/interfaces'

export const ManualService = (restClient: RestClient): IManualService => {
  return {
    async fetchAllGuides() {
      return await restClient.get('/manual/guides')
    },
  }
}
