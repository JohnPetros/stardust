export interface IUseCase<Request, Response> {
  do(request: Request): Response
}
