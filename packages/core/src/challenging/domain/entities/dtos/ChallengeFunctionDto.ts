export type ChallengeFunctionDto = {
  name: string
  params: Array<{
    name: string
    value?: unknown
  }>
}
