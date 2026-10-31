export class AppError extends Error {
  constructor(
    public message = 'Erro interno da aplicação',
    public title = 'Erro interno da aplicação',
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
  }
}
