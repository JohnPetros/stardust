export type GalaxySummaryDto = {
  id: string
  slug: string
  name: string
  description: string
  animation: string
  position: number
  status: 'published' | 'announced'
  planetsCount: number | null
  completedPlanetsCount: number | null
  isCurrent: boolean
}
