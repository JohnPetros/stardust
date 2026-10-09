import { execFileSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const composeArgs = [
  'compose',
  '--parallel',
  '1',
  '--env-file',
  '../../.env.local',
  '-f',
  '../../docker-compose.yml',
  '-f',
  '../../docker-compose.ci.yml',
]

const services = [
  'inngest',
  'redis',
  'supabase-postgres',
  'supabase-mailpit',
  'supabase-templates',
  'minio',
  'supabase-auth',
  'supabase-rest',
  'supabase-realtime',
  'supabase-envoy',
  'minio-init',
]

for (const [index, service] of services.entries()) {
  execFileSync('docker', [...composeArgs, 'pull', service], { stdio: 'inherit' })

  if (index < services.length - 1) {
    await delay(2000)
  }
}
