import { AuthError } from '@supabase/supabase-js'

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Credenciais inválidas.')
  }
}
