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
  const env = parseSeedConfig(environment)
  assertLocalDatabase(environment, new URL(env.DATABASE_URL))
  const accounts = readSeedAccounts(env.GOD_ACCOUNT_IDS)
  return { databaseUrl: env.DATABASE_URL, accounts }
}

function assertLocalDatabase(environment: NodeJS.ProcessEnv, address: URL) {
  if (environment.MODE === 'production' || !isLocalDatabase(address)) {
    throw new AppError(
      'Seed requires the local PostgreSQL database; remote reset is forbidden',
    )
  }
}

function isLocalAddress(address: URL) {
  return (
    ['postgres:', 'postgresql:'].includes(address.protocol) &&
    ['127.0.0.1', 'localhost', '[::1]'].includes(address.hostname) &&
    address.pathname === '/postgres' &&
    address.username === 'postgres'
  )
}

function hasSafeDatabaseOptions(address: URL) {
  const hasOnlySslMode = [...address.searchParams.keys()].every(
    (key) => key === 'sslmode',
  )
  return Boolean(address.port) && hasOnlySslMode && !address.hash
}

function invalidSeedConfig(error: z.ZodError) {
  const keys = error.issues.map((issue) => issue.path.join('.'))
  return new AppError(`Configure root .env.local seed variables: ${keys.join(', ')}`)
}

function readSeedAccounts(godAccountIds: string): SeedAccount[] {
  const accounts: SeedAccount[] = JSON.parse(
    readFileSync(new URL('./data/seed-accounts.json', import.meta.url), 'utf8'),
  )
  assertStudioAdmin(godAccountIds, accounts[1].id)
  return accounts
}
function assertStudioAdmin(godAccountIds: string, studioId: string) {
  const ids = godAccountIds.split(',').map((id) => id.trim())
  if (!ids.includes(studioId))
    throw new AppError('GOD_ACCOUNT_IDS must include the fixed local Studio seed UUID')
}

function isLocalDatabase(address: URL) {
  return isLocalAddress(address) && hasSafeDatabaseOptions(address)
}

function parseSeedConfig(environment: NodeJS.ProcessEnv) {
  const result = seedConfigSchema.safeParse(environment)
  if (!result.success) throw invalidSeedConfig(result.error)
  return result.data
}
