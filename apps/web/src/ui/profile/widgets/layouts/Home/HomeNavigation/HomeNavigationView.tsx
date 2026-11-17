import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { Sidebar } from '../Sidebar'
import { Sidenav } from '../Sidenav'

export type HomeNavigationViewProps = {
  isSidenavExpanded: boolean
  onSidenavToggle: VoidFunction
  isSidebarOpen: boolean
  onSidebarToggle: VoidFunction
  isAchievementsListVisible: boolean
  links: Array<{
    route: string
    label: string
    icon: IconName
  }>
  isNotesActive: boolean
  rescueableAchievementsCount: number
  sidebarUser: {
    name: string
    email: string
    avatar: {
      image: string
      name: string
    }
  }
  onNotesClick: VoidFunction
  onAchievementsClick: VoidFunction
}

export function HomeNavigationView({
  isSidenavExpanded,
  onSidenavToggle,
  isSidebarOpen,
  onSidebarToggle,
  isAchievementsListVisible,
  links,
  isNotesActive,
  rescueableAchievementsCount,
  sidebarUser,
  onNotesClick,
  onAchievementsClick,
}: HomeNavigationViewProps) {
  return (
    <>
      <Sidenav
        isExpanded={isSidenavExpanded}
        isAchievementsListVisible={isAchievementsListVisible}
        links={links}
        isNotesActive={isNotesActive}
        rescueableAchievementsCount={rescueableAchievementsCount}
        onToggleSidenav={onSidenavToggle}
        onNotesClick={onNotesClick}
        onAchievementsClick={onAchievementsClick}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={onSidebarToggle}
        user={sidebarUser}
        onNotesClick={onNotesClick}
      />
    </>
  )
}
