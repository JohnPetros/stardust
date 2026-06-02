import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'

const LOCKS_DIRECTORY = '/tmp'
const OWNER_FILE_NAME = 'owner.pid'
const STALE_LOCK_MAX_AGE_IN_MS = 60_000

export class TestLockFixture {
  private readonly lockPath: string
  private readonly ownerFilePath: string

  constructor(name: string) {
    this.lockPath = `${LOCKS_DIRECTORY}/${name}.lock`
    this.ownerFilePath = `${this.lockPath}/${OWNER_FILE_NAME}`
  }

  async acquire(): Promise<void> {
    await mkdir(LOCKS_DIRECTORY, { recursive: true })

    while (true) {
      try {
        await mkdir(this.lockPath)
        await writeFile(this.ownerFilePath, String(process.pid))
        return
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw error
        }

        if (await this.tryReleaseStaleLock()) {
          continue
        }

        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
  }

  async release(): Promise<void> {
    await rm(this.lockPath, { recursive: true, force: true })
  }

  private async tryReleaseStaleLock(): Promise<boolean> {
    const ownerPid = await this.readOwnerPid()

    if (ownerPid && this.isProcessAlive(ownerPid)) {
      return false
    }

    const isFreshLock = await this.isFreshLock()
    if (!ownerPid && isFreshLock) {
      return false
    }

    await rm(this.lockPath, { recursive: true, force: true })
    return true
  }

  private async readOwnerPid(): Promise<number | null> {
    try {
      const ownerPid = await readFile(this.ownerFilePath, 'utf-8')
      const parsedOwnerPid = Number.parseInt(ownerPid, 10)

      return Number.isNaN(parsedOwnerPid) ? null : parsedOwnerPid
    } catch {
      return null
    }
  }

  private async isFreshLock(): Promise<boolean> {
    try {
      const lockStats = await stat(this.lockPath)
      return Date.now() - lockStats.mtimeMs < STALE_LOCK_MAX_AGE_IN_MS
    } catch {
      return false
    }
  }

  private isProcessAlive(pid: number): boolean {
    try {
      process.kill(pid, 0)
      return true
    } catch {
      return false
    }
  }
}
