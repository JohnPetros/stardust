import { exec } from 'node:child_process'
import { promisify } from 'node:util'

import type { DatabaseProvider } from '@stardust/core/global/interfaces'

import { ENV } from '@/constants/env'

const execAsync = promisify(exec)

export class SupabaseDatabaseProvider implements DatabaseProvider {
  async backup(): Promise<File> {
    const date = new Date().toISOString().split('T')[0]
    const filename = `backup-${date}.dump`

    const command = `/usr/lib/postgresql/15/bin/pg_dump '${ENV.databaseUrl}' -F c -f ${filename}`
    console.log(`🔄 Running backup: ${command}`)

    try {
      const { stdout, stderr } = await execAsync(command)

      if (stdout) console.log('Backup stdout:', stdout)
      if (stderr) console.error('Backup stderr:', stderr)

      console.log(`Backup completed: ${filename}`)

      return new File([], filename)
    } catch (error) {
      console.error('Failed to run pg_dump:', error)
      throw error
    }
  }
}
