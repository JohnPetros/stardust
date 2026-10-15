import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { AppError } from '@stardust/core/global/errors'

const seedConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOD_ACCOUNT_IDS: z.string().min(1),
})

export type SeedAccount = {
  id: string
  name: string
  email: string
  password: string
  slug: string
}

export function readSeedConfig(environment: NodeJS.ProcessEnv = process.env) {
  const result = seedConfigSchema.safeParse(environment)
  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join('.'))
    throw new AppError(`Configure root .env.local seed variables: ${keys.join(', ')}`)
  }
  const env = result.data
  const address = new URL(env.DATABASE_URL)
  if (
    environment.MODE === 'production' ||
    !['postgres:', 'postgresql:'].includes(address.protocol) ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(address.hostname) ||
    address.pathname !== '/postgres' ||
    address.username !== 'postgres' ||
    !address.port ||
    [...address.searchParams.keys()].some((key) => key !== 'sslmode') ||
    address.hash
  ) {
    throw new AppError(
      'Seed requires the local PostgreSQL database; remote reset is forbidden',
    )
  }
  // Public demo fixtures for the guarded local database only.
  const accounts: SeedAccount[] = JSON.parse(
    readFileSync(new URL('./data/seed-accounts.json', import.meta.url), 'utf8'),
  )
  if (
    !env.GOD_ACCOUNT_IDS.split(',')
      .map((id) => id.trim())
      .includes(accounts[1].id)
  ) {
    throw new AppError('GOD_ACCOUNT_IDS must include the fixed local Studio seed UUID')
  }
  return { databaseUrl: env.DATABASE_URL, accounts }
}
