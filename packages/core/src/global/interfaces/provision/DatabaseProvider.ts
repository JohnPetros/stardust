export interface DatabaseProvider {
  backup(): Promise<File>
}
