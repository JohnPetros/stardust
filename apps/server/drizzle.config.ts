import { defineConfig } from 'drizzle-kit'
import { AppError } from '@stardust/core/global/errors'

const databaseUrl = process.env.SUPABASE_DATABASE_URL
if (!databaseUrl) throw new AppError('A URL do banco de dados não foi configurada')

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/drizzle/schema.ts',
  out: './src/database/drizzle/migrations',
  dbCredentials: { url: databaseUrl },
  migrations: { prefix: 'index', table: '__drizzle_migrations', schema: 'drizzle' },
})
