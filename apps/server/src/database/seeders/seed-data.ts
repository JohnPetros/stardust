const JOURNEY_NOTE = { title: 'Minha jornada', content: 'Explorar o primeiro planeta.' }

import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { AppError } from '@stardust/core/global/errors'
import type { ModuleSeed, ModuleSeeder } from './ModuleSeeder'
import type { SeedAccount } from './seed-config'

export const CATALOG_TABLES = [
  'avatars',
  'rockets',
  'insignias',
  'tiers',
  'achievements',
  'planets',
  'stars',
  'questions',
  'categories',
  'challenges',
  'challenges_categories',
  'guides',
] as const

const catalogSnapshotSchema = z.object({
  source: z.literal('rveubqzvfbqbcpmuevnm'),
  exportedAt: z.string(),
  tables: z.record(z.array(z.record(z.unknown()))),
})

export function readSeedCatalog(): ModuleSeed {
  const snapshot = parseCatalogSnapshot()
  if (!snapshot.success) throw new AppError('Invalid staging catalog snapshot')
  const catalog = snapshot.data.tables
  validateCatalog(catalog)
  return catalog
}

function parseCatalogSnapshot() {
  const content = readFileSync(
    new URL('./data/seed-catalog.json', import.meta.url),
    'utf8',
  )
  return catalogSnapshotSchema.safeParse(JSON.parse(content))
}

function validateCatalog(catalog: ModuleSeed) {
  if (Object.keys(catalog).length !== CATALOG_TABLES.length) {
    throw new AppError('Unexpected staging catalog tables')
  }
  for (const table of CATALOG_TABLES) {
    validateCatalogTable(catalog, table)
  }
}

function validateCatalogTable(catalog: ModuleSeed, table: string) {
  if (!catalog[table] || (table !== 'questions' && !catalog[table].length))
    throw new AppError(`Missing staging catalog: ${table}`)
}

export function buildSeedProfiles(
  catalog: ModuleSeed,
  accounts: SeedAccount[],
): ModuleSeed {
  return {
    achievements: catalog.achievements,
    ...buildProfileUsers(accounts, profileDefaults(catalog)),
    ...buildInventory(catalog, accounts),
    notes: buildJourneyNotes(accounts[0]),
  }
}

function profileDefaults(catalog: ModuleSeed) {
  return {
    avatar: selectedDefault(catalog.avatars),
    rocket: selectedDefault(catalog.rockets),
    tier: profileDefault([...catalog.tiers].sort(comparePositions)[0]),
  }
}

function buildUsers(
  accounts: SeedAccount[],
  { avatar, rocket, tier }: ReturnType<typeof profileDefaults>,
) {
  return accounts.map((account, index) => ({
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
  }))
}

function buildInventory(catalog: ModuleSeed, accounts: SeedAccount[]): ModuleSeed {
  return {
    users_acquired_avatars: buildAcquiredItems(catalog.avatars, accounts, 'avatar_id'),
    users_acquired_rockets: buildAcquiredItems(catalog.rockets, accounts, 'rocket_id'),
    users_acquired_insignias: buildAdminInsignias(catalog, accounts[1]),
  }
}

export async function seedProfileProgress(
  seeder: ModuleSeeder,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  const firstStar = findFirstStar(catalog)
  const unlockedStars = buildUnlockedStars(accounts, firstStar.id)
  await seeder.run({
    users_unlocked_stars: unlockedStars,
    users_recently_unlocked_stars: unlockedStars,
  })
}

function findFirstStar(catalog: ModuleSeed) {
  const planet = [...catalog.planets].sort(comparePositions)[0]
  const firstStar = firstPlanetStar(catalog, planet.id)
  if (!firstStar) throw new AppError('Catalog is missing the first star')
  return firstStar
}

function profileDefault<T>(value: T): NonNullable<T> {
  if (!value) throw new AppError('Catalog is missing profile defaults')
  return value
}
function comparePositions(a: Record<string, unknown>, b: Record<string, unknown>) {
  return Number(a.position) - Number(b.position)
}

function buildAcquiredItems(
  items: readonly Record<string, unknown>[],
  accounts: SeedAccount[],
  key: string,
) {
  const defaults = items.filter((row) => row.is_acquired_by_default)
  return accounts.flatMap((account) =>
    defaults.map((row) => ({ user_id: account.id, [key]: row.id })),
  )
}

function firstPlanetStar(catalog: ModuleSeed, planetId: unknown) {
  return catalog.stars
    .filter((row) => row.planet_id === planetId)
    .sort((a, b) => Number(a.number) - Number(b.number))[0]
}

function buildUnlockedStars(accounts: SeedAccount[], starId: unknown) {
  return accounts.map((account) => ({ user_id: account.id, star_id: starId }))
}

function buildProfileUsers(
  accounts: SeedAccount[],
  defaults: ReturnType<typeof profileDefaults>,
) {
  return { users: buildUsers(accounts, defaults) }
}

function buildAdminInsignias(catalog: ModuleSeed, account: SeedAccount) {
  return catalog.insignias
    .filter((row) => row.role === 'god')
    .map((row) => ({ user_id: account.id, insignia_id: row.id }))
}

function buildJourneyNotes(account: SeedAccount) {
  return [{ ...JOURNEY_NOTE, user_id: account.id }]
}

function selectedDefault(rows: readonly Record<string, unknown>[]) {
  return profileDefault(rows.find((row) => row.is_selected_by_default))
}
