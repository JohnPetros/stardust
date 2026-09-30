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

const validateLocalEndpoint = (value: string, variableName: string) => {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${variableName} must use a local endpoint in development`)
  }

  if (url.protocol !== 'http:' || !isLoopbackHostname(url.hostname)) {
    throw new Error(`${variableName} must use a local endpoint in development`)
  }
}

export const validateLocalStudioEndpoints = (input: LocalStudioEndpoints): void => {
  validateLocalEndpoint(input.VITE_SERVER_APP_URL, 'VITE_SERVER_APP_URL')
  validateLocalEndpoint(input.VITE_CDN_URL, 'VITE_CDN_URL')
}

export const parseEnv = (env: Record<string, unknown>) => {
  const parsedEnv = envSchema.parse({
    VITE_SERVER_APP_URL: env.VITE_SERVER_APP_URL,
    VITE_CDN_URL: env.VITE_CDN_URL,
    VITE_WEB_APP_URL: env.VITE_WEB_APP_URL,
  })

  const mode = env.MODE ?? process.env.MODE ?? process.env.NODE_ENV ?? 'development'
  if (mode === 'development') validateLocalStudioEndpoints(parsedEnv)

  return parsedEnv
}
