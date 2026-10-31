import { useLoaderData } from 'react-router'
import { AchievementsPageView } from './AchievementsPageView'
import type { clientLoader } from '@/app/routes/AchievementsRoute'
import { useAchievementsPage } from './useAchievementsPage'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { useUiProvider } from '@/ui/global/hooks/useUiProvider'

export const AchievementsPage = () => {
  const { achievementsDto } = useLoaderData<typeof clientLoader>()
  const { profileService } = useRestContext()
  const toastProvider = useToastProvider()
  const uiProvider = useUiProvider()
  const {
    achievements,
    handleCreateAchievement,
    handleUpdate,
    handleDelete,
    handleDragEnd,
  } = useAchievementsPage({
    achievementsDto,
    profileService,
    toastProvider,
    uiProvider,
  })

  return (
    <AchievementsPageView
      achievements={achievements}
      onCreateAchievement={handleCreateAchievement}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onDragEnd={handleDragEnd}
    />
  )
}
