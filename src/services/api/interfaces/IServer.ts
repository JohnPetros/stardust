export interface IServer {
  get<Data>(url: string): Promise<Data>
  post<Data>(url: string, body: unknown): Promise<Data>
}
