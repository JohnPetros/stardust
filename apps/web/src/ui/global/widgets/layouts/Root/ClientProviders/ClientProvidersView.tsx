import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { EditorProvider } from '@/ui/global/contexts/EditorContext'
import { RealtimeContextProvider } from '@/ui/global/contexts/RealtimeContext'
import { RestContextProvider } from '@/ui/global/contexts/RestContext'

const TestingRealtimeContextProvider = dynamic(
  () =>
    import('@/app/tests/shared/utils/TestingRealtimeContextProvider').then(
      (module) => module.TestingRealtimeContextProvider,
    ),
  { ssr: false },
)

type Props = PropsWithChildren<{
  isTestingMode: boolean
}>

export const ClientProvidersView = ({ children, isTestingMode }: Props) => {
  const editor = <EditorProvider>{children}</EditorProvider>

  return (
    <TooltipProvider>
      <RestContextProvider>
        {isTestingMode ? (
          <TestingRealtimeContextProvider>{editor}</TestingRealtimeContextProvider>
        ) : (
          <RealtimeContextProvider>{editor}</RealtimeContextProvider>
        )}
      </RestContextProvider>
    </TooltipProvider>
  )
}
