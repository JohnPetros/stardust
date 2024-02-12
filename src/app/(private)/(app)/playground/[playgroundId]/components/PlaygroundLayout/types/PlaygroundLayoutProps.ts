export type PlaygroundLayoutProps = {
  playgroundId: string
  playgroundTitle: string
  playgroundCode: string
  isPlaygroundPublic: boolean
  playgroundUser: { slug: string; avatarId: string } | null
}
