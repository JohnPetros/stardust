export interface Database {
  run<Result>(operation: () => Promise<Result>): Promise<Result>
}
