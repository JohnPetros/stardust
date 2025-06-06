'use client'

import { useRouter } from '@/ui/global/hooks/useRouter'
import { CraftsTableView } from './CraftsTableView'
import { useCraftsTable } from './useCraftsTable'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext/hooks/useAuthContext'

type Props = {
  userId: string
}

export function CraftsTable({ userId }: Props) {
  const { currentRoute } = useRouter()
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
