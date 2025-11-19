export class AppError extends Error {
  constructor(
    public message: string = 'Erro interno da aplicação',
    public title: string = 'App Internal Error'
  ) {
    super(title)
  }
}
