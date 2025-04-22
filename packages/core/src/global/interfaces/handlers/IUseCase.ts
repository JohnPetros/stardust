export interface IUseCase<Request = void, Response = void> {
  do(request: Request): Response
}
