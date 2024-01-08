export type Email = {
  sender: string
  recipient: string
  subject: string
  template: string
}

export type EmailProvider = {
  send(email: Email): Promise<void>
}
