export interface UseCase<Request = void, Response = void> {
  do(request: Request): Response
}
