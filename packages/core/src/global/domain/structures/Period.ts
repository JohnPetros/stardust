export class Period {
  private constructor(
    readonly startDate: Date,
    readonly endDate: Date,
  ) {}

  static create(startDate: string, endDate: string) {
    return new Period(new Date(startDate), new Date(endDate))
  }
}
