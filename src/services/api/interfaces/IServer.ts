export interface IServer {
  get<Response>(url: string): Promise<Response>
  post<Response>(url: string, body: unknown): Promise<Response>
  delete<Response>(url: string): Promise<Response>
}
