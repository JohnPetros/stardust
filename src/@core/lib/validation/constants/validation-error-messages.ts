export const VALIDATION_ERROR_MESSAGES = {
  nonempty: 'Campo obrigatório',
  name: {
    min: 'Seu nome deve conter pelo menos 3 letras',
  },
  email: {
    regex: 'Informe um e-mail válido!',
  },
  password: {
    min: 'Sua senha precica conter pelo menos 6 caracteres',
    regex:
      'Sua senha deve conter pelo menos uma letra minúscula, uma maiúscula, um número e um caractere especial.',
  },
  passwordConfirmation: {
    equal: 'As senhas precisam de iguais',
  },
  comment: {
    min: 'O seu comentário deve ter pelo menos 3 caracteres',
  },
}
