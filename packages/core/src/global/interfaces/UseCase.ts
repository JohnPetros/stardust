export interface UseCase<Request = void, Response = void> {
  execute(request: Request): Response
}
