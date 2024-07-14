export type SidebarContextValue = {
  isOpen: boolean
  toggle: VoidFunction
  isAchievementsListVisible: boolean
  setIsAchievementsListVisible: (isAchievementsListVisible: boolean) => void
}
