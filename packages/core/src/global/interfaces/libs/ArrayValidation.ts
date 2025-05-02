export interface ArrayValidation {
  string(message?: string): this
  id(message?: string): this
  validate(): void
}
