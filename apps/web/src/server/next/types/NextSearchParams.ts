export type NextSearchParams<Keys extends string> = {
  searchParams: {
    [key in Keys]: string
  }
}
