import { redirect } from 'next/navigation'

import { ROUTES } from '@/constants'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'
import { GalaxiesPage } from '@/ui/space/widgets/pages/Galaxies'

const Page = async () => {
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const spaceService = SpaceService(restClient)
  const response = await spaceService.fetchCurrentGalaxy()

  if (response.isSuccessful && !response.body.hasGalaxyChoice) {
    redirect(ROUTES.space)
  }

  return <GalaxiesPage />
}

export default Page
