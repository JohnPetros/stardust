import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach } from 'node:test'

const temporaryDirectories: string[] = []

export function temporaryDirectory(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'stardust-harness-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const directory = temporaryDirectories.pop()
    if (directory) fs.rmSync(directory, { recursive: true, force: true })
  }
})
