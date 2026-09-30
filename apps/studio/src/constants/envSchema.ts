import { z } from 'zod'

export const envSchema = z.object({
  VITE_SERVER_APP_URL: z.string().url(),
  VITE_CDN_URL: z.string().url(),
  VITE_WEB_APP_URL: z.string().url(),
})

type LocalStudioEndpoints = Pick<
  z.infer<typeof envSchema>,
  'VITE_CDN_URL' | 'VITE_SERVER_APP_URL'
>

const isLoopbackHostname = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'

const isLocalEndpoint = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' && isLoopbackHostname(url.hostname)
  } catch {
    return false
  }
}

const validateLocalEndpoint = (value: string, variableName: string) => {
  if (!isLocalEndpoint(value)) {
    throw new Error(`${variableName} must use a local endpoint in development`)
  }
}

export const validateLocalStudioEndpoints = (input: LocalStudioEndpoints): void => {
  validateLocalEndpoint(input.VITE_SERVER_APP_URL, 'VITE_SERVER_APP_URL')
  validateLocalEndpoint(input.VITE_CDN_URL, 'VITE_CDN_URL')
}

const isDevelopmentMode = (mode: unknown) =>
  (mode ?? process.env.MODE ?? process.env.NODE_ENV ?? 'development') === 'development'

const parseStudioEnvironment = (env: Record<string, unknown>) =>
  envSchema.parse({
    VITE_SERVER_APP_URL: env.VITE_SERVER_APP_URL,
    VITE_CDN_URL: env.VITE_CDN_URL,
    VITE_WEB_APP_URL: env.VITE_WEB_APP_URL,
  })

export const parseEnv = (env: Record<string, unknown>) => {
  const parsedEnv = parseStudioEnvironment(env)

  if (isDevelopmentMode(env.MODE)) validateLocalStudioEndpoints(parsedEnv)

  return parsedEnv
}
