import { _getSpacePageData } from '@/modules/app/actions/_getSpacePageData'
import { SpacePage } from '@/modules/app/components/pages/Space'
import { SpaceProvider } from '@/modules/app/contexts/SpaceContext'

export default async function Space() {
  const { planetsDTO, userUnlockedStarsIds } = await _getSpacePageData()

  return (
    <SpaceProvider planetsDTO={planetsDTO} userUnlockedStarsIds={userUnlockedStarsIds}>
      <SpacePage />
    </SpaceProvider>
  )
}
