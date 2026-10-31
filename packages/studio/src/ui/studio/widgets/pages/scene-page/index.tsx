import { useParams } from '@tanstack/react-router'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { CenteredContainer } from '@/ui/shared/widgets/components/centered-container'
import { StudioLayout } from '@/ui/studio/widgets/layouts/studio-layout'
import { NotFoundPage } from '@/ui/studio/widgets/pages/not-found-page'

export const ScenePage = () => {
  const params = useParams({ strict: false }) as { project?: string; scene?: string }
  const { findScene, ready } = useScenes()

  if (!ready) return <CenteredContainer>Loading scenes…</CenteredContainer>

  const isSceneAvailable =
    params.project && params.scene && findScene(params.project, params.scene)

  return isSceneAvailable ? <StudioLayout /> : <NotFoundPage />
}
