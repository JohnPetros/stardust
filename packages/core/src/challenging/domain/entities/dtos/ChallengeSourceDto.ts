export type ChallengeSourceDto = {
  id: string
  url: string
  isUsed: boolean
  position: number
  challenge: {
    id: string
    title: string
    slug: string
  }
}
