export type Query<Data> = {
  data: Data
  error: unknown
  isLoading: boolean
  refetch: VoidFunction
  mutate: (newData: Data) => void
}
