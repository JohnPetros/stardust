export type Category = {
  id: string
  name: string
  challenges_categories: { challenge_id: string }[]
}
