import { useEffect, useState } from 'react'
import { OrdinalNumber } from '@stardust/core/global/structures'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { SidebarView } from './SidebarView'

export const Sidebar = () => {
  const { reportingService } = useRestContext()
  const [unreadCount, setUnreadCount] = useState(0)
  useEffect(() => {
    void reportingService
      .listFeedbackReports({
        page: OrdinalNumber.create(1),
        itemsPerPage: OrdinalNumber.create(1),
      })
      .then((response) => {
        if (response.isSuccessful) setUnreadCount(response.body.summary.unread)
      })
  }, [reportingService])
  return <SidebarView unreadCount={unreadCount} />
}
