import { existsSync } from 'node:fs'

const envFile = new URL('../../../../.env.local', import.meta.url)

if (existsSync(envFile)) process.loadEnvFile(envFile)
