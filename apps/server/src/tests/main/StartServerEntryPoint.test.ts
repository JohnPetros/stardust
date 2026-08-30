jest.mock('../../app', () => ({
  app: {
    startServer: jest.fn(),
  },
}))

import { app } from '../../app'

describe('main entry point', () => {
  it('should start the server on module load', async () => {
    await import('../../main')

    expect(app.startServer).toHaveBeenCalledTimes(1)
  })
})
