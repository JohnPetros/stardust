import type { Scene } from './scene'

export interface Project {
  slug: string
  label: string
  scenes: Scene[]
}
