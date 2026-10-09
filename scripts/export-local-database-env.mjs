import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

function readEnvValue(content, key) {
  const line = content.split(/\r?\n/).find((item) => {
    const match = item.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/)
    return match?.[1] === key
  })

  if (!line) return undefined

  const value = line.slice(line.indexOf('=') + 1).trim()
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.at(-1) === quote) {
    return value.slice(1, -1)
  }

  return value.replace(/\s+#.*$/, '').trim()
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = resolve(root, '.env.local')

if (!existsSync(envFile)) {
  console.error('Root .env.local is required for local database configuration.')
  process.exit(1)
}

const content = readFileSync(envFile, 'utf8')
const password = readEnvValue(content, 'SUPABASE_DATABASE_PASSWORD')
const portValue = readEnvValue(content, 'SUPABASE_DATABASE_PORT') ?? '54322'
const port = Number(portValue)
const minioUser = readEnvValue(content, 'MINIO_ROOT_USER')
const minioPassword = readEnvValue(content, 'MINIO_ROOT_PASSWORD')
const minioPortValue = readEnvValue(content, 'MINIO_API_PORT') ?? '9000'
const minioPort = Number(minioPortValue)

if (!password) {
  console.error('SUPABASE_DATABASE_PASSWORD is required in root .env.local.')
  process.exit(1)
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('SUPABASE_DATABASE_PORT must be a valid TCP port.')
  process.exit(1)
}

if ((minioUser && !minioPassword) || (!minioUser && minioPassword)) {
  console.error('MINIO_ROOT_USER and MINIO_ROOT_PASSWORD must be configured together.')
  process.exit(1)
}

if (!Number.isInteger(minioPort) || minioPort < 1 || minioPort > 65535) {
  console.error('MINIO_API_PORT must be a valid TCP port.')
  process.exit(1)
}

const databaseUrl = new URL('postgresql://postgres@127.0.0.1/postgres')
databaseUrl.password = password
databaseUrl.port = String(port)
databaseUrl.searchParams.set('sslmode', 'disable')

const exports = [`export DATABASE_URL=${shellQuote(databaseUrl.toString())}`]

if (minioUser && minioPassword) {
  exports.push(
    `export S3_ACCESS_KEY_ID=${shellQuote(minioUser)}`,
    `export S3_SECRET_ACCESS_KEY=${shellQuote(minioPassword)}`,
    `export S3_ENDPOINT=${shellQuote(`http://127.0.0.1:${minioPort}`)}`,
  )
}

console.log(exports.join('\n'))
