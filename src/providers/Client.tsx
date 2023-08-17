'use client'
import { ReactNode } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Provider as ToastProvider } from '@radix-ui/react-toast'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { SpaceProvider } from '@/contexts/SpaceContext'
import { ChallengesListProvider } from '@/contexts/ChallengesListContext'
import { LessonProvider } from '@/contexts/LessonContext'
import { AchivementsProvider } from '@/contexts/AchievementsContext'
import '../libs/dayjs'

interface ClientProps {
  children: ReactNode
}

export function Client({ children }: ClientProps) {
  return (
    <TooltipProvider>
      <ToastProvider swipeDirection="right">
        <AchivementsProvider>
          <LessonProvider>
            <SidebarProvider>
              <SpaceProvider>
                <ChallengesListProvider>{children}</ChallengesListProvider>
              </SpaceProvider>
            </SidebarProvider>
          </LessonProvider>
        </AchivementsProvider>
      </ToastProvider>
    </TooltipProvider>
  )
}
