import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class FeedbackReportNotFoundError extends NotFoundError {
  constructor() {
    super('Relatório de feedback não encontrado')
  }
}
