export type Playground = {
  id: string
  title: string
  code: string | null
  is_public: boolean
  user_id: string
  user?: {
    slug: string
    avatar_id: string
  }
}
