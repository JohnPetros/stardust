export type ChallengeSourceDto = {
  id: string
  url: string
  position: number
  additionalInstructions: string | null
  challenge?: {
    id: string
    title: string
    slug: string
  } | null
}
