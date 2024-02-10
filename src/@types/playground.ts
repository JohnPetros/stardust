export type Playground = {
  id: string
  title: string
  code: string | null
  isPublic: boolean
  user?: {
    slug: string
    avatarId: string
  }
}
