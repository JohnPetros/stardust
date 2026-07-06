jest.mock('../app', () => ({
  app: {
    startServer: jest.fn(),
  },
}))

describe('main', () => {
  it('should start the server on bootstrap', async () => {
    await import('../main')
    const { app } = await import('../app')

    expect(app.startServer).toHaveBeenCalled()
  })
})
