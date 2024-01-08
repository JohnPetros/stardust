import { ReactNode } from 'react'

import { Client } from './Client'
import { Server } from './Server'

// import { resendProvider } from '@/libs/resend'
import { initializeEmailProvider } from '@/services/email'

// initializeEmailProvider(resendProvider)

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Server>
      <Client>{children}</Client>
    </Server>
  )
}
