export const ERROR_MESSAGES = {
  nonempty: 'Campo obrigatório',
  name: {
    min: 'Seu nome deve conter pelo menos 3 letras',
  },
  email: {
    regex: 'Informe um e-mail válido!',
  },
  password: {
    regex:
      'Sua senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial.',
  },
  password_confirmation: {
    equal: 'As senhas precisam de iguais',
  },
  comment: {
    min: 'O seu comentário deve ter pelo menos 3 caracteres',
  },
} as const
