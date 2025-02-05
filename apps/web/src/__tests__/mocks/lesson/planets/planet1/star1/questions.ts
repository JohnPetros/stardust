import type {
  DragAndDropListQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropListQuestionDto,
]

export const questions: Questions = [
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
    answer: 'Colocar os passos de forma desordenada',
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
      { position: 1, indentation: 0, label: 'Retirar o traje do compartimento' },
      { position: 2, indentation: 0, label: 'Abrir zíper do traje' },
      { position: 3, indentation: 0, label: 'Colocar o traje' },
      { position: 4, indentation: 0, label: 'Fechar o zíper do traje' },
    ],
  },
  {
    stem: 'Agora ordene a sequência correta de se ligar um foguete (Pressione e arraste o item)',
    type: 'drag-and-drop-list',
    picture: 'panda.jpg',
    items: [
      { position: 1, indentation: 0, label: 'Ir para o painel de controle' },
      { position: 2, indentation: 0, label: 'Encontrar o botão de ligar' },
      { position: 3, indentation: 0, label: 'Pressionar o botão' },
      { position: 4, indentation: 0, label: 'Esperar o foguete decolar' },
    ],
  },
  {
    stem: 'Por fim, coloque o foguete no modo automático (já que você não sabe pilotar, não é mesmo?)',
    type: 'drag-and-drop-list',
    picture: 'panda.jpg',
    items: [
      { position: 1, indentation: 0, label: 'Acessar painel de controle' },
      { position: 2, indentation: 0, label: 'Pressionar o botão do piloto automático' },
      {
        position: 3,
        indentation: 0,
        label: 'Aguardar piloto automático responder',
      },
      { position: 4, indentation: 0, label: 'Curtir a viagem 🚀' },
    ],
  },
]
