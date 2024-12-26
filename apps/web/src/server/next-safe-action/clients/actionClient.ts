import { AppError } from '@stardust/core/global/errors'
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action'

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof AppError) {
      console.error('Action error title:', error.title)
      console.error('Action error message:', error.message)
      return error.message
    }
    console.error('Action error:', error)

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})
