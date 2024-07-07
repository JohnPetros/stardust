export class AppError extends Error {
  constructor(
    public message = 'Erro interno da aplicação',
    public title = 'App Internal Error'
  ) {
    super(title)
  }
}
