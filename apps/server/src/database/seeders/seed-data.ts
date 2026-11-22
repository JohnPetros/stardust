import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { AppError } from '@stardust/core/global/errors'
import type { ModuleSeed } from './ModuleSeeder'
import type { SeedAccount } from './seed-config'

export const CATALOG_TABLES = [
  'avatars',
  'rockets',
  'insignias',
  'tiers',
  'achievements',
  'galaxies',
  'planets',
  'stars',
  'questions',
  'categories',
  'challenges',
  'challenges_categories',
  'guides',
] as const

export function readSeedCatalog(): ModuleSeed {
  const content = readFileSync(
    new URL('./data/seed-catalog.json', import.meta.url),
    'utf8',
  )
  const snapshot = z
    .object({
      source: z.literal('rveubqzvfbqbcpmuevnm'),
      exportedAt: z.string(),
      tables: z.record(z.array(z.record(z.unknown()))),
    })
    .safeParse(JSON.parse(content))
  if (!snapshot.success) throw new AppError('Invalid staging catalog snapshot')
  const catalog = snapshot.data.tables
  if (Object.keys(catalog).length !== CATALOG_TABLES.length) {
    throw new AppError('Unexpected staging catalog tables')
  }
  for (const table of CATALOG_TABLES) {
    if (!catalog[table] || (table !== 'questions' && !catalog[table].length)) {
      throw new AppError(`Missing staging catalog: ${table}`)
    }
  }
  return catalog
}

export function buildSeedProfiles(
  catalog: ModuleSeed,
  accounts: SeedAccount[],
): ModuleSeed {
  const avatar = catalog.avatars.find((row) => row.is_selected_by_default)
  const rocket = catalog.rockets.find((row) => row.is_selected_by_default)
  const tier = [...catalog.tiers].sort(
    (a, b) => Number(a.position) - Number(b.position),
  )[0]
  if (!avatar || !rocket || !tier)
    throw new AppError('Catalog is missing profile defaults')
  return {
    achievements: catalog.achievements,
    users: accounts.map((account, index) => ({
      id: account.id,
      name: account.name,
      email: account.email,
      slug: account.slug,
      avatar_id: avatar.id,
      rocket_id: rocket.id,
      tier_id: tier.id,
      coins: 500,
      xp: index ? 150 : 0,
      weekly_xp: index ? 150 : 0,
    })),
    users_acquired_avatars: accounts.flatMap((account) =>
      catalog.avatars
        .filter((row) => row.is_acquired_by_default)
        .map((row) => ({
          user_id: account.id,
          avatar_id: row.id,
        })),
    ),
    users_acquired_rockets: accounts.flatMap((account) =>
      catalog.rockets
        .filter((row) => row.is_acquired_by_default)
        .map((row) => ({
          user_id: account.id,
          rocket_id: row.id,
        })),
    ),
    users_acquired_insignias: catalog.insignias
      .filter((row) => row.role === 'god')
      .map((row) => ({
        user_id: accounts[1].id,
        insignia_id: row.id,
      })),
    notes: [
      {
        user_id: accounts[0].id,
        title: 'Minha jornada',
        content: 'Explorar o primeiro planeta.',
      },
    ],
  }
}
