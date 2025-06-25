export type NextParams<Params extends string = ''> = {
  params: {
    [key in Params]: string
  }
}
