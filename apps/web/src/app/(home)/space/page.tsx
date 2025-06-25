import { SpacePage } from '@/ui/space/widgets/pages/Space'
import { SpaceProvider } from '@/ui/space/contexts/SpaceContext'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { SpaceService } from '@/rest/services/SpaceService'

const Page = async () => {
  const restClient = await NextServerRestClient({ isCacheEnabled: true })
  const spaceService = SpaceService(restClient)
  const response = await spaceService.fetchPlanets()
  if (response.isFailure) response.throwError()

  return (
    <SpaceProvider planetsDto={response.body}>
      <SpacePage />
    </SpaceProvider>
  )
}

export default Page
