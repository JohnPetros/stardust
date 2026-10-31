import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  casing: 'snake_case',
  schemaFilter: ['crew'],
  migrations: { schema: 'crew', table: '__drizzle_migrations' },
})
