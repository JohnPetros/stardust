import { useServer } from '../useServer'

import { ROUTES } from '@/utils/constants'

export const EmailsController = () => {
  const server = useServer()

  return {
    sendRequestPasswordResetEmail: async (recipient: string) => {
      await server.post(`${ROUTES.server.email}`, { recipient })
    },
  }
}
