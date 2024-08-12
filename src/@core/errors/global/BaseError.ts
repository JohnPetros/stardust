export class BaseError extends Error {
  constructor(
    public title = 'Internal Error',
    public message = 'Erro interno'
  ) {
    super(title)
  }
}
