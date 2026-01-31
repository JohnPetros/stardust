import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { DatabaseProvider } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'
import { AppError } from '@stardust/core/global/errors'

const execAsync = promisify(exec)

export class SupabaseDatabaseProvider implements DatabaseProvider {
  async backup(): Promise<File> {
    const date = new Date().toISOString().split('T')[0]
    const filename = `backup-${date}.dump`

    const filePath = path.resolve(filename)

    const command = `pg_dump '${ENV.databaseUrl}' -F c -f '${filePath}'`

    console.log(`🔄 Running backup: ${command}`)

    try {
      const { stdout, stderr } = await execAsync(command)

      if (stdout) console.log('Backup stdout:', stdout)
      if (stderr) console.error('Backup stderr:', stderr)

      console.log(`Backup file created on disk: ${filePath}`)

      const fileBuffer = await fs.readFile(filePath)

      const file = new File([fileBuffer as any], filename, {
        type: 'application/octet-stream',
        lastModified: Date.now(),
      })

      await fs.unlink(filePath)
      console.log('Temporary file removed from disk')

      return file
    } catch (error) {
      console.error('Failed to run pg_dump:', error)

      try {
        await fs.unlink(filePath)
      } catch (cleanupError) {
        console.error('cleanup error:', cleanupError)
        throw new AppError('Falha ao limpar arquivo de backup')
      }

      throw error
    }
  }
}
