import postgres from 'postgres'

import { ENV } from '@/constants'

export class PostgresClient {
  private readonly client: ReturnType<typeof postgres>

  constructor(connectionString = ENV.databaseUrl) {
    this.client = postgres(connectionString, {
      connect_timeout: 10,
      idle_timeout: 10,
      max: 10,
    })
  }

  async query<Row>(strings: TemplateStringsArray, ...values: unknown[]): Promise<Row[]> {
    return Array.from(
      await this.client(strings, ...(values as never[])),
    ) as unknown as Row[]
  }

  async end(): Promise<void> {
    await this.client.end({ timeout: 5 })
  }
}

export const postgresClient = new PostgresClient()

const closePostgresClient = () => {
  void postgresClient
    .end()
    .catch(() => {
      process.exitCode = 1
    })
    .finally(() => {
      process.exit(process.exitCode ?? 0)
    })
}

process.once('SIGINT', closePostgresClient)
process.once('SIGTERM', closePostgresClient)
