export class AppError extends Error {
  constructor(
    public message: string = 'Erro interno da aplicação',
    public title: string = 'Erro interno da aplicação',
  ) {
    super(title)
  }
}
