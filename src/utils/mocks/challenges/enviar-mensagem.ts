export default {
  title: 'Enviar mensagem',
  difficulty: 'easy',
  downvotes: 0,
  upvotes: 0,
  total_completitions: 0,
  user_id: '38976417-7c77-44ff-9e26-5dc8b457f768',
  topic_id: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  code: `var msg = leia()
// Escreva seu código abaixo`,
  function_name: null,
  tests_cases: [
    {
      input: ["'Olá, mundo!'"],
      expectedOutput: 'Olá, mundo!',
      isLocked: false,
    },
  ],
  texts: [
    {
      type: 'default',
      content: 'Parece que finalmente você encontrou um planeta à vista!',
      picture: 'panda.jpg',
    },
    {
      type: 'default',
      content:
        'Para verifcar se há vida inteligente, você pode enviar uma mensagem dizendo: "Olá, mundo!".',
      picture: 'panda.jpg',
    },
    {
      type: 'default',
      content:
        'Para fazer isso você deve fazer um programa na aba de `código` que receba essa mensagem e a escreva, sendo a entrada e saída de dados respectivamente.',
      picture: 'panda.jpg',
    },
    {
      type: 'default',
      content: 'Veja o exemplo para entender melhor:',
      picture: 'panda.jpg',
    },
    {
      type: 'code',
      content: `Entrada: "Olá, mundo!"
Saída: "Olá, mundo!"`,
      isRunnable: false,
    },
    {
      type: 'default',
      content:
        'Se o resultado do seu código passar no teste de caso na aba de `resultado`, você conclui o desafio 🎉.',
      picture: 'panda.jpg',
    },
    {
      type: 'alert',
      content:
        'Lembre-se de manter o comando `leia()` (que já está no código) para capturar os dados de entrada.',
      picture: 'panda.jpg',
    },
  ],
}

type User = {
  name?: string
  age: number
}

const user: User = {
  name: 'Jonas',
  age: 25
}

delete user.name