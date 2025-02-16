export type SidebarContextValue = {
  isOpen: boolean
  isAchievementsListVisible: boolean
  toggle: VoidFunction
  setIsAchievementsListVisible: (isAchievementsListVisible: boolean) => void
}
