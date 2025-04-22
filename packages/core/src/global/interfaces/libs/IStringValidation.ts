export interface IStringValidation {
  min(minValue: number, message?: string): this
  id(message?: string): this
  email(message?: string): this
  url(message?: string): this
  image(message?: string): this
  oneOf(strings: string[], message?: string): this
  validate(): void
}
