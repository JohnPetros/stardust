import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { AppError } from '@stardust/core/global/errors'

export type SeedEnvironment = 'local' | 'staging'

const STAGING_PROJECT_REF = 'rveubqzvfbqbcpmuevnm'
const PRODUCTION_PROJECT_REF = 'aukqejqsiqsqowafpppb'

const localSeedConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOD_ACCOUNT_IDS: z.string().min(1),
})

const stagingSeedConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  SEED_EXPLORER_PASSWORD: z.string().min(12),
  SEED_ADMIN_PASSWORD: z.string().min(12),
})

export type SeedAccount = {
  id: string
  name: string
  email: string
  password: string
  slug: string
}

function validateSeedDatabase(environment: NodeJS.ProcessEnv, databaseUrl: string) {
  const address = new URL(databaseUrl)
  if (environment.MODE === 'production' || !isLocalDatabase(address)) {
    throw new AppError(
      'Seed requires the local PostgreSQL database; remote reset is forbidden',
    )
  }
}

function referencesProject(address: URL, projectRef: string): boolean {
  return [address.hostname, decodeURIComponent(address.username)].some((value) =>
    value.split('.').includes(projectRef),
  )
}

function validateStagingDatabase(environment: NodeJS.ProcessEnv, databaseUrl: string) {
  const address = new URL(databaseUrl)
  if (
    environment.MODE === 'production' ||
    environment.NODE_ENV === 'production' ||
    referencesProject(address, PRODUCTION_PROJECT_REF) ||
    !referencesProject(address, STAGING_PROJECT_REF) ||
    !['postgres:', 'postgresql:'].includes(address.protocol)
  ) {
    throw new AppError(
      'Staging seed requires the staging Supabase project; production and other databases are forbidden',
    )
  }
}

function isLocalDatabase(address: URL): boolean {
  return (
    ['postgres:', 'postgresql:'].includes(address.protocol) &&
    ['127.0.0.1', 'localhost', '[::1]'].includes(address.hostname) &&
    address.pathname === '/postgres' &&
    address.username === 'postgres' &&
    Boolean(address.port) &&
    [...address.searchParams.keys()].every((key) => key === 'sslmode') &&
    !address.hash
  )
}

function readAccounts(): SeedAccount[] {
  return JSON.parse(
    readFileSync(new URL('./data/seed-accounts.json', import.meta.url), 'utf8'),
  )
}

function failWithMissingKeys(error: z.ZodError, hint: string): never {
  const keys = error.issues.map((issue) => issue.path.join('.'))
  throw new AppError(`${hint}: ${keys.join(', ')}`)
}

function readStagingSeedConfig(environment: NodeJS.ProcessEnv) {
  const result = stagingSeedConfigSchema.safeParse(environment)
  if (!result.success)
    failWithMissingKeys(result.error, 'Configure the staging seed variables')
  const env = result.data
  validateStagingDatabase(environment, env.DATABASE_URL)
  const [explorer, admin] = readAccounts()
  const accounts: SeedAccount[] = [
    { ...explorer, password: env.SEED_EXPLORER_PASSWORD },
    { ...admin, password: env.SEED_ADMIN_PASSWORD },
  ]
  return { databaseUrl: env.DATABASE_URL, accounts }
}

function readLocalSeedConfig(environment: NodeJS.ProcessEnv) {
  const result = localSeedConfigSchema.safeParse(environment)
  if (!result.success)
    failWithMissingKeys(result.error, 'Configure root .env.local seed variables')
  const env = result.data
  validateSeedDatabase(environment, env.DATABASE_URL)
  // Public demo fixtures for the guarded local database only.
  const accounts = readAccounts()
  if (
    !env.GOD_ACCOUNT_IDS.split(',')
      .map((id) => id.trim())
      .includes(accounts[1].id)
  ) {
    throw new AppError('GOD_ACCOUNT_IDS must include the fixed local Studio seed UUID')
  }
  return { databaseUrl: env.DATABASE_URL, accounts }
}

export function readSeedConfig(
  seedEnvironment: SeedEnvironment = 'local',
  environment: NodeJS.ProcessEnv = process.env,
) {
  return seedEnvironment === 'staging'
    ? readStagingSeedConfig(environment)
    : readLocalSeedConfig(environment)
}
