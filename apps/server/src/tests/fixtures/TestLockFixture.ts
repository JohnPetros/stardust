import { mkdir, rm } from 'node:fs/promises'

const LOCKS_DIRECTORY = '/tmp'

export class TestLockFixture {
  private readonly lockPath: string

  constructor(name: string) {
    this.lockPath = `${LOCKS_DIRECTORY}/${name}.lock`
  }

  async acquire(): Promise<void> {
    await mkdir(LOCKS_DIRECTORY, { recursive: true })

    while (true) {
      try {
        await mkdir(this.lockPath)
        return
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw error
        }

        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
  }

  async release(): Promise<void> {
    await rm(this.lockPath, { recursive: true, force: true })
  }
}
