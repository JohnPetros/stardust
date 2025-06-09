import type { PropsWithChildren } from 'react'

import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import { AnimatedContainer } from './AnimatedContainer'
import { HomeHeader } from './HomeHeader'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'
import { TabNav } from './TabNav'
import { StreakBreakDialog } from './StreakBreakDialog'

type Props = {
  isSidenavExpanded: boolean
  isTransitionVisible: boolean
  currentRoute: string
  onContainerClick: () => void
  onSidenavToggle: () => void
}

export function HomeLayoutView({
  children,
  isSidenavExpanded,
  isTransitionVisible,
  currentRoute,
  onContainerClick,
  onSidenavToggle,
}: PropsWithChildren<Props>) {
  const isChallengeRoute = currentRoute.startsWith('/challenging')

  if (isChallengeRoute)
    return (
      <>
        <PageTransitionAnimation isVisible={isTransitionVisible} />
        {children}
      </>
    )

  return (
    <>
      <HomeHeader />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={onSidenavToggle} />
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <StreakBreakDialog />
      <Sidebar />
      <AnimatedContainer isSidenavExpanded={isSidenavExpanded} onClick={onContainerClick}>
        {children}
      </AnimatedContainer>
      <TabNav />
    </>
  )
}
