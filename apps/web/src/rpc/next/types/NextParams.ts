export type NextParams<Params extends string = ''> = {
  params: Promise<{
    [key in Params]: string
  }>
}
