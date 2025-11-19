export class AppError extends Error {
  constructor(
    readonly message: string = 'Erro interno da aplicação',
    readonly title: string = 'App Internal Error'
  ) {
    super(title)
  }
}
