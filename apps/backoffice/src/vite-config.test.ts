import type { UserConfig } from 'vite'
import { loadEnv } from 'vite'

import viteConfig from '../vite.config'

jest.mock('vite', () => ({
  defineConfig: (config: unknown) => config,
  loadEnv: jest.fn(),
}))

jest.mock('@react-router/dev/vite', () => ({ reactRouter: jest.fn() }))
jest.mock('vite-tsconfig-paths', () => jest.fn())
jest.mock('@tailwindcss/vite', () => jest.fn())
jest.mock('vite-plugin-node-polyfills', () => ({ nodePolyfills: jest.fn(() => []) }), {
  virtual: true,
})

const mockLoadEnv = loadEnv as jest.MockedFunction<typeof loadEnv>
const resolveViteConfig = viteConfig as unknown as (environment: {
  mode: string
}) => UserConfig

const localEnvironment = {
  VITE_SERVER_APP_URL: 'http://127.0.0.1:3334',
  VITE_CDN_URL: 'http://127.0.0.1:9000/stardust',
  VITE_WEB_APP_URL: 'http://127.0.0.1:3000',
}

const loadConfig = (
  mode: string,
  environment: Record<string, string> = localEnvironment,
) => {
  mockLoadEnv.mockReturnValue(environment)
  return resolveViteConfig({ mode })
}

const getConfigErrorMessage = (mode: string, environment: Record<string, string>) => {
  try {
    loadConfig(mode, environment)
  } catch (error) {
    return (error as Error).message
  }

  return ''
}

describe('Vite environment configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('accepts loopback API and CDN endpoints in development', () => {
    expect(() =>
      loadConfig('development', { ...localEnvironment, MODE: 'development' }),
    ).not.toThrow()
    expect(mockLoadEnv).toHaveBeenCalledWith('development', process.cwd(), '')
  })

  it('accepts configured loopback API and CDN ports in development', () => {
    expect(() =>
      loadConfig('development', {
        ...localEnvironment,
        MODE: 'development',
        VITE_SERVER_APP_URL: 'http://127.0.0.1:54323',
        VITE_CDN_URL: 'http://localhost:9002/stardust',
      }),
    ).not.toThrow()
  })

  it('rejects a remote Server API endpoint in development without echoing its value', () => {
    const errorMessage = getConfigErrorMessage('development', {
      ...localEnvironment,
      MODE: 'development',
      VITE_SERVER_APP_URL: 'https://server.remote.invalid',
    })

    expect(errorMessage).toContain('VITE_SERVER_APP_URL')
    expect(errorMessage).not.toContain('https://server.remote.invalid')
  })

  it('rejects a remote CDN endpoint in development without echoing its value', () => {
    const errorMessage = getConfigErrorMessage('development', {
      ...localEnvironment,
      MODE: 'development',
      VITE_CDN_URL: 'https://cdn.remote.invalid',
    })

    expect(errorMessage).toContain('VITE_CDN_URL')
    expect(errorMessage).not.toContain('https://cdn.remote.invalid')
  })

  it('rejects a loopback endpoint with a non-local scheme in development', () => {
    const errorMessage = getConfigErrorMessage('development', {
      ...localEnvironment,
      MODE: 'development',
      VITE_CDN_URL: 'https://localhost:9002/stardust',
    })

    expect(errorMessage).toContain('VITE_CDN_URL')
    expect(errorMessage).not.toContain('https://localhost:9002/stardust')
  })

  it('allows remote endpoints outside development', () => {
    expect(() =>
      loadConfig('production', {
        MODE: 'production',
        VITE_SERVER_APP_URL: 'https://server.remote.invalid',
        VITE_CDN_URL: 'https://cdn.remote.invalid',
        VITE_WEB_APP_URL: 'https://web.remote.invalid',
      }),
    ).not.toThrow()
  })
})
