import { redirect } from 'next/navigation'

import { ROUTES } from '@/constants'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'

const Page = async () => {
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const spaceService = SpaceService(restClient)
  const response = await spaceService.fetchCurrentGalaxy()
  if (response.isFailure) response.throwError()

  redirect(ROUTES.galaxy(response.body.galaxy.slug))
}

export default Page
