export type NextSearchParams<Keys extends string> = {
  searchParams: Promise<{
    [key in Keys]: string
  }>
}
