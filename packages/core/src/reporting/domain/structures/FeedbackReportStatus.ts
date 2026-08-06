import { Logical } from '#global/domain/structures/Logical'
import { AppError } from '#global/domain/errors/AppError'

export type FeedbackReportStatusValue = 'open' | 'closed'

export class FeedbackReportStatus {
  private constructor(readonly value: FeedbackReportStatusValue) {}

  static create(value: string): FeedbackReportStatus {
    if (!FeedbackReportStatus.isValid(value)) {
      throw new AppError(`Status do relatório de feedback inválido: ${value}`)
    }

    return new FeedbackReportStatus(value as FeedbackReportStatusValue)
  }

  static createAsOpen() {
    return new FeedbackReportStatus('open')
  }

  static createAsClosed() {
    return new FeedbackReportStatus('closed')
  }

  static isValid(value: string): value is FeedbackReportStatusValue {
    return value === 'open' || value === 'closed'
  }

  get isOpen() {
    return Logical.create(this.value === 'open')
  }

  get isClosed() {
    return Logical.create(this.value === 'closed')
  }
}
