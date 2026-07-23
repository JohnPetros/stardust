import fs from 'node:fs'
import path from 'node:path'

export function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')) as T
}
