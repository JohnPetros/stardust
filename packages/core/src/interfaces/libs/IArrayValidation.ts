export interface IArrayValidation {
  string(message?: string): this
  id(message?: string): this
  validate(): void
}
