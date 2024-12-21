export type RankingUserDto = {
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
