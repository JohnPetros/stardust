'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function WarningMessage() {
  const { user } = useAuthContext()

  if (user?.hasCompletedSpace.isFalse)
    return (
      <p className='p-6 rounded-md border-dashed border border-yellow-400 text-yellow-400'>
        É recomendado que você complete todos os planetas antes de prosseguir para fazer
        desafios de código.
      </p>
    )
}
