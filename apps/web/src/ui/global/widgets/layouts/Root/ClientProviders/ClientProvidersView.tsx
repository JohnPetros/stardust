import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'

import { AuthContextProvider } from '@/ui/auth/contexts/AuthContext'
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

function selectRealtimeProvider(isTestingMode: boolean) {
  return isTestingMode ? TestingRealtimeContextProvider : RealtimeContextProvider
}

type Props = PropsWithChildren<{
  isTestingMode: boolean
  accountDto: AccountDto | null
  accessToken: string | null
}>

export const ClientProvidersView = ({ children, isTestingMode, ...session }: Props) => {
  const RealtimeProvider = selectRealtimeProvider(isTestingMode)

  return (
    <TooltipProvider>
      <AuthContextProvider {...session}>
        <RestContextProvider>
          <RealtimeProvider>
            <EditorProvider>{children}</EditorProvider>
          </RealtimeProvider>
        </RestContextProvider>
      </AuthContextProvider>
    </TooltipProvider>
  )
}
