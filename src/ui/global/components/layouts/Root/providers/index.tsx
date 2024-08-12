import type { ReactNode } from 'react'

import { ClientProvider } from './ClientProvider'
import { ServerProvider } from './ServerProvider'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ServerProvider>
      <ClientProvider>{children}</ClientProvider>
    </ServerProvider>
  )
}
