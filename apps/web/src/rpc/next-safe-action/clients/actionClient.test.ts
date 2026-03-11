import { AppError } from '@stardust/core/global/errors'

const createSafeActionClient = jest.fn((config) => config)
const notFound = jest.fn()

jest.mock('next-safe-action', () => ({
  createSafeActionClient: (config: unknown) => createSafeActionClient(config),
}))

jest.mock('next/navigation', () => ({
  notFound: () => notFound(),
}))

describe('actionClient', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  async function getHandleServerError() {
    const module = await import('./actionClient')
    return (
      module.actionClient as unknown as {
        handleServerError: (error: Error) => string | void
      }
    ).handleServerError
  }

  it('should redirect to not found flow for NEXT_NOT_FOUND errors', async () => {
    const handleServerError = await getHandleServerError()

    handleServerError(new Error('NEXT_NOT_FOUND'))

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it('should mask AppError messages from the client response', async () => {
    const handleServerError = await getHandleServerError()
    const error = new AppError('segredo interno', 'Sensitive Error')

    const response = handleServerError(error)

    expect(response).toBe('Nao foi possivel concluir sua solicitacao.')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Action error:', {
      title: 'Sensitive Error',
      message: 'segredo interno',
    })
  })

  it('should return a generic message for unknown errors', async () => {
    const handleServerError = await getHandleServerError()

    const response = handleServerError(new Error('database exploded'))

    expect(response).toBe('Erro interno do servidor.')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Action error:', expect.any(Error))
  })
})
