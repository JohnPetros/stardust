import { registerApiRoute } from '@mastra/core/server'

export class NotFoundController {
  route() {
    return registerApiRoute('*', {
      method: 'ALL',
      handler: async (c) => c.json({ error: { code: 'not_found' } }, 404),
    })
  }
}
