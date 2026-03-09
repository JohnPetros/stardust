export type ChallengeSourceDto = {
  id: string
  url: string
  position: number
  challenge?: {
    id: string
    title: string
    slug: string
  } | null
}
