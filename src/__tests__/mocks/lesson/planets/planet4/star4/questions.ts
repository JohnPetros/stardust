import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  OpenQuestion,
  CheckboxQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Entramos no portal, momento perfeito para treinarmos o *escolha-caso*. Veja que aqui perto há um planeta chamado chamado Tatooine. Que tipo de planeta ele é?',
    code: `var planeta = "Tatooine"

escolha (planeta) {
  caso "Coruscant":
    escreva("Planeta central da galáxia");
  caso "Tatooine":
    escreva("Planeta desértico")
  caso "Dagobah":
    escreva("Planeta idílico")
  padrao: 
    escreva("Planeta desconhecido")
}`,
    type: 'selection',
    answer: 'Planeta desértico',
    options: [
      'Planeta idílico',
      'Planeta desértico',
      'Planeta central da galáxia',
      'Planeta desconhecido',
    ],
    picture: 'panda-deslumbrado.jpg',
  },
  {
    title:
      'Só para lembrar: qual é o nome do bloco do *escolha caso* que sempre será executado quando o valor dentro dos parêteses do *escolha* não corresponder a nenhum *caso*?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['var senha = 222'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['escolha (senha) {'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['caso 42:'],
        indentation: 1,
      },
      {
        id: 4,
        texts: ['escreva("Abre salão de festas")'],
        indentation: 2,
      },
      {
        id: 5,
        texts: ['caso 999:'],
        indentation: 1,
      },
      {
        id: 6,
        texts: ['escreva("Abre banheiro")'],
        indentation: 2,
      },
      {
        id: 7,
        texts: ['input-1', ':'],
        indentation: 1,
      },
      {
        id: 8,
        texts: ['("Senha inválida")'],
        indentation: 2,
      },
      {
        id: 9,
        texts: ['}'],
        indentation: 0,
      },
    ],
    answers: ['padrao'],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    title:
      'O clima dentro desse portal é agradável. Quais *casos* abaixo podem resultar em "Clima agradável"?',
    code: `escolha (estacao) {
  caso 'Outono':
  caso 'Inverno':
    escreva("Clima frio")
  caso 'Verão':
  caso 'Primavera':
    escreva("Clima agradável")
  padrao:
    escreva("Estação desconhecida")
}`,
    type: 'checkbox',
    options: ['Outono', 'Verão', 'Inverno', 'Primavera'],
    correctOptions: ['Verão', 'Primavera'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    code: `escolha (nave) {
  caso "X-wing": 
    escreva("Nave de combate")
  caso "TIE Fighter":
    escreva("Nave imperial")
  caso "Millennium Falcon": 
    escreva("Nave lendária")
  padrao:
    escreva("Nave desconhecida")
}`,
    title:
      'Há uma nave passando perto de nós, porém ela é desconhecida. Qual opção resultaria em "Nave desconhecida"?',
    type: 'selection',
    answer: 'Star Destroyer',
    options: ['X-wing', 'TIE Fighter', 'Millennium Falcon', 'Star Destroyer'],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    title:
      'Para sairmos dentro desse portal, precisamos ligar o motor turbo. Complete o código abaixo para que resulte em "Motor turbo ativado desativado".',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var comando = "ativarMotorTurbo"'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['dropZone', '(comando) {'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['caso', 'dropZone', ':'],
        indentation: 1,
      },
      {
        id: 4,
        texts: ['escreva("Motor turbo ativado")'],
        indentation: 3,
      },
      {
        id: 5,
        texts: ['dropZone', ' "desativarMotorTurbo": '],
        indentation: 1,
      },
      {
        id: 6,
        texts: ['escreva("Motor turbo desativado")'],
        indentation: 3,
      },
      {
        id: 7,
        texts: ['dropZone', ':'],
        indentation: 1,
      },
      {
        id: 8,
        texts: ['escreva("Comando inválido")'],
        indentation: 3,
      },
      {
        id: 9,
        texts: ['}'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'escolha',
      },
      {
        id: 2,
        label: 'caso',
      },
      {
        id: 3,
        label: 'padrao',
      },
      {
        id: 4,
        label: '"ativarMotorTurbo"',
      },
    ],
    correctDragItemsIdsSequence: [1, 4, 2, 3],
    picture: 'panda-amando-bambu.jpg',
  },
]
