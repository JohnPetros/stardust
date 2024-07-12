export interface INumberValidation {
  min(minValue: number, message?: string): this
  max(maxValue: number, message?: string): this
  validate(): void
}
