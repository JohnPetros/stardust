export const questions = [
  {
    stem: 'Muito bem, você acaba de embarcar no foguete. Antes de proseguirmos quero que responda primeiro: O que é lógica de programação mesmo?',
    picture: 'panda.jpg',
    type: 'selection',
    answer: 'sequência lógica de instruções',
    options: [
      'Sequência lógica de instruções',
      'Falar em código binário com os ETs',
      'Uma linguagem de programação',
      'Preparar café para o computador ☕',
    ],
  },
  {
    stem: 'Muito bem, então na hora de escrever uma programa o que você NÃO deve pensar em fazer é:',
    picture: 'panda.jpg',
    type: 'selection',
    answer: 'desordem',
    options: [
      'Usar raciocínio lógico',
      'Colocar os passos de forma desordenada',
      'Fazer a análise de um problema',
      'Realizar um encadeamento de etapas',
    ],
  },
  {
    stem: 'Para mostrar para você que tudo pode ser pensado como um programa, ordene a sequência correta de se vestir um traje espacial (Pressione e arraste o item)',
    picture: 'panda.jpg',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'Retirar o traje do compartimento' },
      { id: 2, label: 'Abrir zíper do traje' },
      { id: 3, label: 'Colocar o traje' },
      { id: 4, label: 'Fechar o zíper do traje' },
    ],
  },
  {
    stem: 'Agora ordene a sequência correta de se ligar um foguete (Pressione e arraste o item)',
    type: 'drag-and-drop-list',
    picture: 'panda.jpg',
    items: [
      { id: 1, label: 'Ir para o painel de controle' },
      { id: 2, label: 'Encontrar o botão de ligar' },
      { id: 3, label: 'Pressionar o botão' },
      { id: 4, label: 'Esperar o foguete decolar' },
    ],
  },
  {
    stem: 'Por fim, coloque o foguete no modo automático (já que você não sabe pilotar, não é mesmo)',
    type: 'drag-and-drop-list',
    picture: 'panda.jpg',
    items: [
      { id: 1, label: 'Acessar painel de controle' },
      { id: 2, label: 'Pressionar o botão o piloto automático' },
      { id: 3, label: 'Confirmar que a nave está seguindo a rota desejada' },
      { id: 4, label: 'Corrigir desvios na trajetória, se necessário' },
      { id: 5, label: 'Curtir a viagem 🚀' },
    ],
  },
]
