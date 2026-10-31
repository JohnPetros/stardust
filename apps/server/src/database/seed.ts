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
    auth: new AuthSeeder(database, sql, accounts),
    challenging: new ChallengingSeeder(database),
    conversation: new ConversationSeeder(database),
    forum: new ForumSeeder(database),
    lesson: new LessonSeeder(database),
    manual: new ManualSeeder(database),
    playground: new PlaygroundSeeder(database),
    profile: new ProfileSeeder(database),
    ranking: new RankingSeeder(database),
    reporting: new ReportingSeeder(database),
    shop: new ShopSeeder(database),
    space: new SpaceSeeder(database),
  }
}

async function populateDatabase(
  sql: TransactionSql,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  const seeders = createSeeders(sql, accounts)
  await clearDatabase(seeders)
  await seedCatalog(seeders, catalog, accounts)
  await seedRanking(seeders, catalog, accounts)
  await seedCommunityActivity(seeders, catalog, accounts)
  await seedFeedback(seeders, accounts)
}

type Seeders = ReturnType<typeof createSeeders>

async function clearDatabase(seeders: Seeders) {
  // Delete profiles before their catalog dependencies; FK cascades remove owned activity.
  for (const seeder of [
    seeders.profile,
    seeders.forum,
    seeders.conversation,
    seeders.reporting,
    seeders.playground,
    seeders.challenging,
    seeders.lesson,
    seeders.space,
    seeders.shop,
    seeders.ranking,
    seeders.manual,
    seeders.auth,
  ])
    await seeder.clear()
}

async function seedCatalog(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seeders.shop.run(catalog)
  await seeders.ranking.run({ tiers: catalog.tiers })
  await seeders.auth.run()
  await seeders.profile.run(buildSeedProfiles(catalog, accounts))
  await seeders.space.run({
    planets: catalog.planets,
    stars: catalog.stars.map(
      ({ texts: _texts, questions: _questions, story: _story, ...star }) => star,
    ),
  })
  await seeders.lesson.run({
    questions: catalog.questions,
    stars: catalog.stars.map(({ id, texts, questions, story }) => ({
      id,
      texts,
      questions,
      story,
    })),
  })
  await seeders.challenging.run({
    ...catalog,
    challenges: catalog.challenges.map((row) => ({ ...row, user_id: accounts[1].id })),
  })
  await seedProfileProgress(seeders.profile, catalog, accounts)
}

async function seedRanking(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  const tier = [...catalog.tiers].sort(
    (a, b) => Number(a.position) - Number(b.position),
  )[0]
  await seeders.ranking.run({
    ranking_users: accounts.map((account, index) => ({
      id: account.id,
      tier_id: tier.id,
      xp: index ? 150 : 0,
      position: accounts.length - index,
    })),
  })
  await seeders.manual.run(catalog)
}

async function seedCommunityActivity(
  seeders: Seeders,
  catalog: ModuleSeed,
  accounts: SeedAccount[],
) {
  await seeders.playground.run({
    snippets: [
      {
        id: '00000000-0000-4000-8000-000000000010',
        user_id: accounts[0].id,
        title: 'Meu primeiro programa',
        code: catalog.challenges[0].initial_code,
        is_public: false,
      },
    ],
  })
  await seeders.forum.run({
    comments: [
      {
        id: '00000000-0000-4000-8000-000000000020',
        user_id: accounts[0].id,
        content: 'Estou explorando este desafio no ambiente local.',
      },
    ],
    challenges_comments: [
      {
        challenge_id: catalog.challenges[0].id,
        comment_id: '00000000-0000-4000-8000-000000000020',
      },
    ],
  })
  await seeders.conversation.run({
    chats: [
      {
        id: '00000000-0000-4000-8000-000000000030',
        user_id: accounts[0].id,
        name: 'Exploração local',
      },
    ],
    chat_messages: [
      {
        chat_id: '00000000-0000-4000-8000-000000000030',
        sender: 'user',
        content: 'Quero aprender lógica de programação.',
      },
    ],
  })
}

async function seedFeedback(seeders: Seeders, accounts: SeedAccount[]) {
  const timestamp = '2026-01-01T12:00:00.000Z'
  await seeders.reporting.run({
    feedback_reports: [
      {
        id: '00000000-0000-4000-8000-000000000040',
        user_id: accounts[0].id,
        title: 'Sugestão de exploração',
        content: 'Gostaria de mais exemplos nas lições.',
        intent: 'idea',
        created_at: timestamp,
        last_activity_at: timestamp,
        last_user_message_at: timestamp,
      },
    ],
    feedback_messages: [
      {
        id: '00000000-0000-4000-8000-000000000041',
        report_id: '00000000-0000-4000-8000-000000000040',
        author_id: accounts[0].id,
        author_role: 'user',
        content: 'Gostaria de mais exemplos nas lições.',
        created_at: timestamp,
      },
    ],
  })
}

export async function seedDatabase(): Promise<void> {
  const config = readSeedConfig()
  const catalog = readSeedCatalog()
  const client = postgres(config.databaseUrl, {
    max: 1,
    connect_timeout: 10,
    onnotice: () => {},
  })
  try {
    await client.begin(async (sql) => {
      await sql`SELECT pg_advisory_xact_lock(736192004)`
      await populateDatabase(sql, catalog, config.accounts)
    })
  } finally {
    await client.end({ timeout: 5 })
  }
  console.log(
    'Local seed complete: staging catalog, two Auth accounts and fictional activity.',
  )
}

async function runSeedCli(): Promise<void> {
  const argumentsList = process.argv.slice(2)
  if (argumentsList.includes('--help')) {
    console.log(
      'db:seed replaces local application data and Auth users. Configure root .env.local; staging is never contacted.',
    )
    return
  }
  if (argumentsList.some((argument) => argument !== '--check'))
    throw new AppError('Unknown seed argument')
  if (argumentsList.includes('--check')) {
    readSeedConfig()
    const catalog = readSeedCatalog()
    console.log(
      `Seed preflight passed: ${catalog.planets.length} planets, ${catalog.stars.length} stars, ${catalog.challenges.length} challenges. No database changes.`,
    )
    return
  }
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
