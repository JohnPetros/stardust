import { AppError } from '@/errors/app-error'
import { z } from 'zod'

export const envSchema = z.object({
  CREW_ENV: z.enum(['dev', 'prod']).default('dev'),
  CREW_PORT: z.coerce.number().int().positive().default(4111),
  CREW_HOST: z.string().min(1).default('0.0.0.0'),
  CREW_DATABASE_URL: z.url(),
  ANTHROPIC_API_KEY: z.string().min(1),
  COMPOSIO_API_KEY: z.string().min(1),
  PR_REVIEWER_API_KEY: z.string().min(32),
  COMPOSIO_USER_ID: z.string().min(1),
  COMPOSIO_GITHUB_CONNECTED_ACCOUNT_ID: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source)

  if (result.success) return result.data

  const variables = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))]

  throw new AppError(
    `Variáveis de ambiente ausentes ou inválidas: ${variables.join(', ')}.`,
    'Erro de Configuração',
    { code: 'invalid_env', variables },
  )
}

export const env = parseEnv(process.env)
