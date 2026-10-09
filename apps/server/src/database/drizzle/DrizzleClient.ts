import postgres from 'postgres'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { AppError } from '@stardust/core/global/errors'

import * as schema from './schema'

type DrizzleConnection = PostgresJsDatabase<typeof schema>
export type DrizzleTransaction = Parameters<
  Parameters<DrizzleConnection['transaction']>[0]
>[0]
export type DrizzleDatabase = DrizzleConnection | DrizzleTransaction

type ConnectionState = {
  pool: ReturnType<typeof postgres>
  database: DrizzleConnection
  databaseUrl: string
}

const POOL_OPTIONS = { max: 10, connect_timeout: 10, idle_timeout: 10 }

export class DrizzleClient {
  private static connection: ConnectionState | undefined
  private static closing: Promise<void> | undefined
  private static hasShutdownHandlers = false

  static create(databaseUrl: string): DrizzleDatabase {
    DrizzleClient.assertConfiguration(databaseUrl)
    DrizzleClient.connection ??= DrizzleClient.connect(databaseUrl)
    return DrizzleClient.connection.database
  }

  private static assertConfiguration(databaseUrl: string): void {
    if (!databaseUrl || DrizzleClient.closing)
      throw new AppError('A conexão com o banco de dados não está disponível')
    if (DrizzleClient.connection && DrizzleClient.connection.databaseUrl !== databaseUrl)
      throw new AppError('A conexão com o banco de dados já foi configurada')
  }

  private static connect(databaseUrl: string): ConnectionState {
    const pool = postgres(databaseUrl, POOL_OPTIONS)
    DrizzleClient.registerShutdown()
    return { pool, database: drizzle(pool, { schema }), databaseUrl }
  }

  private static registerShutdown(): void {
    if (DrizzleClient.hasShutdownHandlers) return
    process.once('SIGINT', DrizzleClient.shutdown)
    process.once('SIGTERM', DrizzleClient.shutdown)
    DrizzleClient.hasShutdownHandlers = true
  }

  private static shutdown(): void {
    void DrizzleClient.close().catch(() => {
      process.exitCode = 1
    })
  }

  static getInstance(): DrizzleDatabase {
    if (!DrizzleClient.connection || DrizzleClient.closing)
      throw new AppError('A conexão com o banco de dados não foi inicializada')
    return DrizzleClient.connection.database
  }

  static close(): Promise<void> {
    if (DrizzleClient.closing) return DrizzleClient.closing
    if (!DrizzleClient.connection) return Promise.resolve()
    DrizzleClient.closing = DrizzleClient.endConnection(DrizzleClient.connection)
    return DrizzleClient.closing
  }

  private static endConnection(connection: ConnectionState): Promise<void> {
    return connection.pool.end({ timeout: 5 }).finally(() => {
      DrizzleClient.connection = undefined
      DrizzleClient.closing = undefined
    })
  }
}
