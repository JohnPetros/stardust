import { redirect } from 'next/navigation'

import { Slug } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
import { SpacePage } from '@/ui/space/widgets/pages/Space'

type PageProps = {
  params: Promise<{ galaxySlug: string }>
}

const Page = async ({ params }: PageProps) => {
  const { galaxySlug } = await params
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const spaceService = SpaceService(restClient)

  const currentGalaxyResponse = await spaceService.fetchCurrentGalaxy()
  if (currentGalaxyResponse.isFailure) currentGalaxyResponse.throwError()
  const currentGalaxy = currentGalaxyResponse.body

  if (galaxySlug !== currentGalaxy.galaxy.slug) {
    redirect(ROUTES.galaxy(currentGalaxy.galaxy.slug))
  }

  const planetsResponse = await spaceService.fetchGalaxyPlanets(Slug.create(galaxySlug))
  if (planetsResponse.isFailure) planetsResponse.throwError()

  return (
    <SpaceProvider planetsDto={planetsResponse.body} currentGalaxy={currentGalaxy}>
      <SpacePage />
    </SpaceProvider>
  )
}

export default Page
