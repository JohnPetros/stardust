const SEED_TIMESTAMP = '2026-01-01T12:00:00.000Z'
const FEEDBACK_REPORTS_SEED = {
  id: '00000000-0000-4000-8000-000000000040',
  title: 'Sugestão de exploração',
  content: 'Gostaria de mais exemplos nas lições.',
  intent: 'idea',
}

const FEEDBACK_MESSAGES_SEED = {
  id: '00000000-0000-4000-8000-000000000041',
  report_id: '00000000-0000-4000-8000-000000000040',
  author_role: 'user',
  content: 'Gostaria de mais exemplos nas lições.',
}

const CHATS_SEED = {
  id: '00000000-0000-4000-8000-000000000030',
  name: 'Exploração local',
}

const CHAT_MESSAGES_SEED = {
  chat_id: '00000000-0000-4000-8000-000000000030',
  sender: 'user',
  content: 'Quero aprender lógica de programação.',
}

const COMMENTS_SEED = {
  id: '00000000-0000-4000-8000-000000000020',
  content: 'Estou explorando este desafio no ambiente local.',
}

const CHALLENGES_COMMENTS_SEED = {
  comment_id: '00000000-0000-4000-8000-000000000020',
}

const SNIPPETS_SEED = {
  id: '00000000-0000-4000-8000-000000000010',
  title: 'Meu primeiro programa',
  is_public: false,
}

import { pathToFileURL } from 'node:url'
import postgres, { type TransactionSql } from 'postgres'
import { AppError } from '@stardust/core/global/errors'
import { SeedDatabase } from './seeders/SeedDatabase'
import type { ModuleSeed } from './seeders/ModuleSeeder'
import { AuthSeeder } from './seeders/AuthSeeder'
import { ChallengingSeeder } from './seeders/ChallengingSeeder'
import { ConversationSeeder } from './seeders/ConversationSeeder'
import { ForumSeeder } from './seeders/ForumSeeder'
import { LessonSeeder } from './seeders/LessonSeeder'
import { ManualSeeder } from './seeders/ManualSeeder'
import { PlaygroundSeeder } from './seeders/PlaygroundSeeder'
import { ProfileSeeder } from './seeders/ProfileSeeder'
import { RankingSeeder } from './seeders/RankingSeeder'
import { ReportingSeeder } from './seeders/ReportingSeeder'
import { ShopSeeder } from './seeders/ShopSeeder'
import { SpaceSeeder } from './seeders/SpaceSeeder'
import { readSeedConfig, type SeedAccount } from './seeders/seed-config'
import {
  buildSeedProfiles,
  readSeedCatalog,
  seedProfileProgress,
} from './seeders/seed-data'

function createSeeders(sql: TransactionSql, accounts: SeedAccount[]) {
  const database = new SeedDatabase(sql)
  return {
    ...createContentSeeders(database),
    auth: new AuthSeeder(database, sql, accounts),
    profile: new ProfileSeeder(database),
  }
}

function createContentSeeders(database: SeedDatabase) {
  return {
    challenging: new ChallengingSeeder(database),
    ...createActivitySeeders(database),
    lesson: new LessonSeeder(database),
    ...createReferenceSeeders(database),
    space: new SpaceSeeder(database),
  }
}

function createReferenceSeeders(database: SeedDatabase) {
  return {
    manual: new ManualSeeder(database),
    ranking: new RankingSeeder(database),
    shop: new ShopSeeder(database),
  }
}

function createActivitySeeders(database: SeedDatabase) {
  return {
    conversation: new ConversationSeeder(database),
    forum: new ForumSeeder(database),
    playground: new PlaygroundSeeder(database),
    reporting: new ReportingSeeder(database),
  }
}

async function populateDatabase(
  sql: TransactionSql,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  const seeders = createSeeders(sql, accounts)
  await clearSeedData(seeders)
  await seedCatalog(seeders, catalog, accounts)
  await seedActivity(seeders, catalog, accounts)
}

type Seeders = ReturnType<typeof createSeeders>

const SEED_CLEAR_ORDER = [
  'profile',
  'forum',
  'conversation',
  'reporting',
  'playground',
  'challenging',
  'lesson',
  'space',
  'shop',
  'ranking',
  'manual',
  'auth',
] as const

async function clearSeedData(seeders: Seeders) {
  // Delete profiles before their catalog dependencies; FK cascades remove owned activity.
  for (const name of SEED_CLEAR_ORDER) await seeders[name].clear()
}

async function seedCatalog(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seedCatalogDefaults(seeders, catalog)
  await seedProfiles(seeders.profile, catalog, accounts)
  await seedLearning(seeders, catalog, accounts[1])
  await seedProfileActivity(seeders, catalog, accounts)
}

async function seedProfileActivity(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seedProfileProgress(seeders.profile, catalog, accounts)
  await seedRankings(seeders.ranking, catalog, accounts)
  await seeders.manual.run(catalog)
}

async function seedLearning(seeders: Seeders, catalog: ModuleSeed, account: SeedAccount) {
  await seedLessons(seeders, catalog)
  await seedLessonContent(seeders.lesson, catalog)
  await seedChallenges(seeders.challenging, catalog, account)
}

async function seedCatalogDefaults(seeders: Seeders, catalog: ModuleSeed) {
  await seeders.shop.run(catalog)
  await seeders.ranking.run({ tiers: catalog.tiers })
  await seeders.auth.run()
}

async function seedProfiles(
  seeder: ProfileSeeder,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seeder.run(buildSeedProfiles(catalog, accounts))
}
async function seedChallenges(
  seeder: ChallengingSeeder,
  catalog: ModuleSeed,
  account: SeedAccount,
) {
  const challenges = catalog.challenges.map((row) => ({ ...row, user_id: account.id }))
  await seeder.run({ ...catalog, challenges })
}

async function seedLessons(seeders: Seeders, catalog: ModuleSeed) {
  await seeders.space.run({
    planets: catalog.planets,
    stars: catalog.stars.map(
      ({ texts: _texts, questions: _questions, story: _story, ...star }) => star,
    ),
  })
}

async function seedLessonContent(seeder: LessonSeeder, catalog: ModuleSeed) {
  await seeder.run({
    questions: catalog.questions,
    stars: catalog.stars.map(({ id, texts, questions, story }) => ({
      id,
      texts,
      questions,
      story,
    })),
  })
}

function comparePositions(a: Record<string, unknown>, b: Record<string, unknown>) {
  return Number(a.position) - Number(b.position)
}

async function seedRankings(
  seeder: RankingSeeder,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  const tier = [...catalog.tiers].sort(comparePositions)[0]
  await seeder.run({
    ranking_users: buildRankingUsers(accounts, tier.id),
  })
}

function buildRankingUsers(accounts: SeedAccount[], tierId: unknown) {
  return accounts.map((account, index) => ({
    id: account.id,
    tier_id: tierId,
    xp: index ? 150 : 0,
    position: accounts.length - index,
  }))
}

async function seedActivity(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seedPlayground(seeders.playground, catalog, accounts[0])
  await seedForum(seeders.forum, catalog, accounts[0])
  await seedConversation(seeders.conversation, accounts[0])
  await seedReporting(seeders.reporting, accounts[0])
}

async function seedPlayground(
  seeder: PlaygroundSeeder,
  catalog: ModuleSeed,
  account: SeedAccount,
) {
  await seeder.run(buildPlayground(catalog, account))
}

function buildPlayground(catalog: ModuleSeed, account: SeedAccount): ModuleSeed {
  return {
    snippets: [
      { ...SNIPPETS_SEED, user_id: account.id, code: catalog.challenges[0].initial_code },
    ],
  }
}

async function seedForum(seeder: ForumSeeder, catalog: ModuleSeed, account: SeedAccount) {
  await seeder.run(buildForum(catalog, account))
}

function buildForum(catalog: ModuleSeed, account: SeedAccount): ModuleSeed {
  return {
    comments: [{ ...COMMENTS_SEED, user_id: account.id }],
    challenges_comments: [
      { ...CHALLENGES_COMMENTS_SEED, challenge_id: catalog.challenges[0].id },
    ],
  }
}

async function seedConversation(seeder: ConversationSeeder, account: SeedAccount) {
  await seeder.run(buildConversation(account))
}

function buildConversation(account: SeedAccount): ModuleSeed {
  return {
    chats: [{ ...CHATS_SEED, user_id: account.id }],
    chat_messages: [{ ...CHAT_MESSAGES_SEED }],
  }
}

async function seedReporting(seeder: ReportingSeeder, account: SeedAccount) {
  await seeder.run(buildReporting(account))
}

function buildReporting(account: SeedAccount): ModuleSeed {
  return {
    feedback_reports: [buildFeedbackReport(account)],
    feedback_messages: [
      { ...FEEDBACK_MESSAGES_SEED, author_id: account.id, created_at: SEED_TIMESTAMP },
    ],
  }
}

function createSeedClient(databaseUrl: string) {
  return postgres(databaseUrl, { max: 1, connect_timeout: 10, onnotice: () => {} })
}

async function seedTransaction(
  sql: TransactionSql,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await sql`SELECT pg_advisory_xact_lock(736192004)`
  await populateDatabase(sql, catalog, accounts)
}

function reportSeedComplete() {
  console.log(
    'Local seed complete: staging catalog, two Auth accounts and fictional activity.',
  )
}

async function populateAndClose(
  client: ReturnType<typeof createSeedClient>,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  try {
    await client.begin((sql) => seedTransaction(sql, catalog, accounts))
  } finally {
    await client.end({ timeout: 5 })
  }
}

export async function seedDatabase(): Promise<void> {
  const config = readSeedConfig()
  const catalog = readSeedCatalog()
  const client = createSeedClient(config.databaseUrl)
  await populateAndClose(client, catalog, config.accounts)
  reportSeedComplete()
}

function checkSeedPreflight() {
  readSeedConfig()
  const catalog = readSeedCatalog()
  const counts = `${catalog.planets.length} planets, ${catalog.stars.length} stars, ${catalog.challenges.length} challenges`
  console.log(`Seed preflight passed: ${counts}. No database changes.`)
}

function seedArguments() {
  const args = process.argv.slice(2)
  if (!args.includes('--help') && args.some((argument) => argument !== '--check'))
    throw new AppError('Unknown seed argument')
  return args
}

function printSeedHelp() {
  console.log(
    'db:seed replaces local application data and Auth users. Configure root .env.local; staging is never contacted.',
  )
}

async function runSeedCli(): Promise<void> {
  const argumentsList = seedArguments()
  if (argumentsList.includes('--help')) return printSeedHelp()
  if (argumentsList.includes('--check')) return checkSeedPreflight()
  await seedDatabase()
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void runSeedCli().catch((error: unknown) => {
    // SQL/SDK errors may contain parameters: never print them or credential values.
    console.error(
      error instanceof AppError
        ? error.message
        : 'Local seed failed; the database transaction was rolled back. Check the local stack and schema.',
    )
    process.exitCode = 1
  })
}

function reportTimestamps(timestamp: string) {
  return {
    created_at: timestamp,
    last_activity_at: timestamp,
    last_user_message_at: timestamp,
  }
}

function buildFeedbackReport(account: SeedAccount) {
  return {
    ...FEEDBACK_REPORTS_SEED,
    user_id: account.id,
    ...reportTimestamps(SEED_TIMESTAMP),
  }
}
