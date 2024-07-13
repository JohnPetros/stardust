export interface IClient {
  get<Response>(route: string): Promise<Response>
}
