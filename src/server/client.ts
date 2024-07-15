import type { IClient } from '@/@core/interfaces/handlers'
import { ENV } from '@/modules/global/constants'

type CacheConfig = {
  isCacheEnable?: boolean
  refetchInterval?: number
}

export const NextClient = ({ isCacheEnable = true }: CacheConfig = {}): IClient => {
  const requestInit: RequestInit = {
    cache: !isCacheEnable ? 'force-cache' : 'no-store',
  }

  return {
    async get<Response = unknown>(route: string): Promise<Response> {
      const response = await fetch(`${ENV.url}${route}`, requestInit)
      const data = await response.json()

      return data as Response
    },
  }
}
