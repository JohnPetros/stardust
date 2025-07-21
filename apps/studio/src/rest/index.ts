import { ENV } from '@/constants'
import { AxiosRestClient } from './axios/AxiosRestClient'
import { SpaceService } from './services'

const restClient = AxiosRestClient()
restClient.setBaseUrl(ENV.serverAppUrl)

export const spaceService = SpaceService(restClient)
