import { createSafeActionClient } from 'next-safe-action'
import { notFound } from 'next/navigation'

import { AppError } from '@stardust/core/global/errors'

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof AppError) {
      console.error('Action error title:', error.title)
      console.error('Action error message:', error.message)
      return error.message
    }
    console.error('Action error:', error)

    if (error.message === 'NEXT_NOT_FOUND') {
      notFound()
    }

    return `Erro interno do servidor: ${error.message}`
  },
})
