import { ReactNode } from 'react'

import { Client } from './Client'
import { Server } from './Server'

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
