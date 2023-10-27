import { SignUpError } from "@/@types/signupError"

export const SIGN_UP_ERRORS: Record<SignUpError, string> = {
  'For security purposes, you can only request this after 50 seconds.':
    'Por questões de segurança, espere 50 segundos para tentar cadastrar novamente',
  'Email rate limit exceeded':
    'Você execedeu o limite permitido de tentativas de cadastro',
}
