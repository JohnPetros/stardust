export type RankingUserDTO = {
  id: string
  name: string
  slug: string
  xp: number
  avatar: {
    image: string
    name: string
  }
  position: number
  tierId: string
}
