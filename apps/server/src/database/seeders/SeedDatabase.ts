import type { TransactionSql } from 'postgres'
import { AppError } from '@stardust/core/global/errors'

export type SeedRow = Record<string, unknown>

/** Administrative persistence for the local seed, never composed into HTTP or jobs. */
export class SeedDatabase {
  constructor(private readonly sql: TransactionSql) {}

  async clear(tables: readonly string[]): Promise<void> {
    for (const table of tables) {
      await this.sql.unsafe(`DELETE FROM public.${this.identifier(table)}`)
    }
  }

  async insert(table: string, rows: readonly SeedRow[]): Promise<void> {
    for (const row of rows) {
      const columns = Object.keys(row)
        .map((column) => this.identifier(column))
        .join(', ')
      if (!columns) throw new AppError('Seed row has no columns')
      const relation = `public.${this.identifier(table)}`
      await this.sql.unsafe(
        `INSERT INTO ${relation} (${columns}) SELECT ${columns} FROM jsonb_populate_recordset(NULL::${relation}, $1::text::jsonb)`,
        [JSON.stringify([row])],
      )
    }
  }

  async update(table: string, key: string, row: SeedRow): Promise<void> {
    const relation = `public.${this.identifier(table)}`
    const assignments = Object.keys(row)
      .filter((column) => column !== key)
      .map((column) => `${this.identifier(column)} = source.${this.identifier(column)}`)
      .join(', ')
    await this.sql.unsafe(
      `UPDATE ${relation} AS target SET ${assignments} FROM jsonb_populate_record(NULL::${relation}, $1::text::jsonb) AS source WHERE target.${this.identifier(key)} = source.${this.identifier(key)}`,
      [JSON.stringify(row)],
    )
  }

  private identifier(value: string): string {
    if (!/^[a-z][a-z0-9_]*$/.test(value)) throw new AppError('Invalid seed identifier')
    return `"${value}"`
  }
}
