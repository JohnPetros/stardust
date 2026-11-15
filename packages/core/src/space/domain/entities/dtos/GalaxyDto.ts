export type GalaxyDto = {
  id?: string
  slug: string
  name: string
  description: string
  animation: string
  position: number
  status: 'published' | 'announced' | 'unpublished'
  planetsIds: string[]
}
