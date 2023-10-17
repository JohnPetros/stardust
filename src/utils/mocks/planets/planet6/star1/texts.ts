import { Text } from '@/@types/text'

export const texts: Text[] = [
  {
    type: 'image',
    content: 'Novos planetas encontrados',
    picture: 'apollo-envolto-de-planetas.jpg',
  },
  {
    type: 'default',
    content:
      'Opa, agora que já encontramos vários planetas para explorar, podemos configurar a rota o mais próximo.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Mas, ainda mais importante que isso é verificar se os suprimentos do foguete estão tudo ok.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Como fazer isso?',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Primeiramente, vejamos o que temos de comida no momento.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]
escreva(alimentos)

// Resultado: maçã, batata, bife, geleia`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Que? Mas o que é isso na variável alimentos?',
  },
  {
    type: 'default',
    content: 'Isso nada mais é do que um vetor.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    title: 'Vetores',
    content:
      'Vetores são uma lista ordenada de valores, onde cada valor é identificado por um índice. Em outras palavras, um vetor é um conjunto de elementos que podem ser acessados ​​por sua posição numérica dentro do vetor.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Acesso por posição numérica?',
  },
  {
    type: 'default',
    content:
      'Sim! Por exemplo, caso queiramos pegar a maçã da variável `alimentos` devemos fazer da seguinte forma:',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[0])

// Resultado: maçã`,
    isRunnable: true,
  },
  {
    type: 'quote',
    content:
      'Como dito, para acessar qualquer elemento dentro de uma variável que é um vetor, temos que colocar entre colchetes ([]) ao lado da variável o número do seu índice, isto é, sua posição na lista de elementos conforme a ordem padrão de direção (esquerda para direita).',
    picture: 'panda.jpg',
  },
  {
    type: 'alert',
    content:
      'Veja que foi escrito apenas maçã, em vez de todos os alimentos, visto que estamos acessando apenas o primeiro elemento, o que é possível por meio do número que corresponde a sua posição no vetor, no caso, o zero.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Mas porque zero e não um?',
  },
  {
    type: 'default',
    content:
      'Isso porque a posição dos elementos sempre começa pelo zero, ou seja, se você quisesse pegar o segundo elemento de qualquer vetor, teríamos que colocar 1 entre colchetes.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[1])

// Resultado: maçã`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Dica: É possível acessar o último elemento de qualquer vetor, independentemente quantos elementos ele tenha. Para isso, basta colocar 1 negativo (-1)',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[-1])

// Resultado: geleia`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Isso acontece porque se você colocar números negativos como índice, você estará invertendo a ordem de padrão direção (que é esquerda para direita) para direita à esquerda.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, caso colocássemos -2 como índice, estaríamos pegando o penúltimo elemento de um vetor.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[-2])

// Resultado: geleia`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora você pode perguntar, como eu faço para adicionar um novo elemento ao vetor?',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'O que eu posso fazer para adicionar um novo elemento ao vetor?',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, basta colocar o elemento na posição que queremos que ele tenha dentro do vetor.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Como no momento temos 4 alimentos, podemos colocar uma goiabada na quinta posição desse vetor. Pensando nisso, teríamos que colocar qual número como índice?',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: '5?',
  },
  {
    type: 'default',
    content:
      'Não! Lembre-se os índices/posições de um vetor sempre começam do 0, logo o quinto índice corresponde ao 4.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

alimentos[4] = "goiabada"

escreva(alimentos)
// Resultado: maçã, batata, bife, geleia, goiabada`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Cuidado, dependendo da posição em que você colocar o novo elemento, poderá haver espaços vazios no vetor.',
    picture: 'panda.jpg',
  },
  {
    type: 'alert',
    content:
      'Por exemplo, se tivéssemos colocado a goiabada no índice 7, as posições 4, 5 e 6 ficariam vagas.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

alimentos[7] = "goiabada"

escreva(alimentos)
// Resultado: maçã, batata, bife, geleia, , , , goiabada`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Caso isso aconteça, podemos substituir essas posíções por alimentos de verdade.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Agora você pode me perguntar denovo, como eu faço para substituir um elemento de um vetor?',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Como eu faço para substituir um elemento de um vetor?',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Da mesma forma que colocamos novos elementos em um vetor. Só que caso já exista algum elemento na posição que especificarmos, esse elemento será substituído pelo o que colocamos.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = [
    "maçã", 
    "batata", 
    "bife", 
    "geleia"
]

alimentos[2] = "iogurte"

escreva(alimentos)
// Resultado: maçã, batata, iogurte, geleia`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Perceba que escrevi o vetor de um jeito diferenciado: Em vez de colocar os elementos um do lado do outro, coloquei um em baixo do outro separados por vírgulas, o que também é totalmente possível.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Existem outras formas de acrescentar novos elementos a um vetor, mas por agora já estamos bem em conhecimento novo.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Agora você pode me pergutar denovo, como eu faço para remover um elemento de um vetor?',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Como disse, já estamos bem em conhecimento novo, até a próxima.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Como disse, já estamos bem em conhecimento novo, até a próxima 👋.',
    picture: 'panda.jpg',
  },
]
