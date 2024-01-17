'use client'

import { useServer } from '../api/server/server'

import { ROUTES } from '@/utils/constants'

export function useEmail() {
  const server = useServer()

  return {
    sendRequestPasswordResetEmail: async (recipient: string) => {
      const response = await server.post<{ message: string }>(
        `${ROUTES.server.email}/request-password-reset`,
        {
          recipient,
        }
      )

      if (response.message !== 'ok') {
        throw new Error()
      }
    },
  }
}
