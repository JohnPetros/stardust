export type Email = {
  sender: string
  recipient: string
  subject: string
  template: string
}

export interface IEmailProvider {
  send(email: Email): Promise<void>
}
