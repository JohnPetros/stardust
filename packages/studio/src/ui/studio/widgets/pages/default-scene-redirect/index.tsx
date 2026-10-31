import { Navigate } from '@tanstack/react-router'
import { ROUTES } from '@/constants/routes'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { CenteredContainer } from '@/ui/shared/widgets/components/centered-container'

export const DefaultSceneRedirect = () => {
  const { defaultScene, ready } = useScenes()

  if (!ready) return <CenteredContainer>Loading scenes…</CenteredContainer>

  if (!defaultScene) {
    return <CenteredContainer>No projects found in public/projects.</CenteredContainer>
  }

  return (
    <Navigate
      to={ROUTES.scene}
      params={{ project: defaultScene.project.slug, scene: defaultScene.scene.slug }}
      replace
    />
  )
}
