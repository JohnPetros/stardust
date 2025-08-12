export const GLOBAL_ERROR_MESSAGES = {
  nonempty: 'Campo obrigatório',
  name: {
    min: 'Seu nome deve conter pelo menos 3 letras',
  },
  email: {
    regex: 'Informe um e-mail válido!',
  },
  password: {
    min: 'Sua senha deve conter pelo menos 6 caracteres',
  },
  password_confirmation: {
    equal: 'As senhas precisam de iguais',
  },
  comment: {
    min: 'O seu comentário deve ter pelo menos 3 caracteres',
  },
} as const
