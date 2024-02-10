import { Server } from '../server'

import { ROUTES } from '@/global/constants'

export const EmailsController = () => {
  const server = Server()

  return {
    sendRequestPasswordResetEmail: async (recipient: string) => {
      await server.post(`${ROUTES.server.email}`, { recipient })
    },
  }
}
