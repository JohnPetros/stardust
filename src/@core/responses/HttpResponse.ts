export class HttpResponse {
  readonly body: unknown
  readonly statusCode: number

  constructor(body: unknown, statusCode = 200) {
    this.body = body
    this.statusCode = statusCode
  }
}
