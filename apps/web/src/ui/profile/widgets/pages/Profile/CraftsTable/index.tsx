'use client'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { CraftsTableView } from './CraftsTableView'
import { useCraftsTable } from './useCraftsTable'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext/hooks/useAuthContext'

type Props = {
  userId: string
}

export function CraftsTable({ userId }: Props) {
  const { currentRoute } = useNavigationProvider()
  const { user } = useAuthContext()
  const {
    activeTabListSorter,
    activeTabContent,
    isAccountUser,
    handleTabContentChange,
    handleTabListSorterChange,
  } = useCraftsTable(currentRoute, String(user?.slug.value))

  return (
    <CraftsTableView
      userId={userId}
      isAccountUser={isAccountUser}
      activeTabContent={activeTabContent}
      activeTabListSorter={activeTabListSorter}
      onTabContentChange={handleTabContentChange}
      onTabListSorterChange={handleTabListSorterChange}
    />
  )
}
