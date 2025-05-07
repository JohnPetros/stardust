import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'image',
    content: 'Novos planetas encontrados.',
    picture: 'apollo-envolto-de-planetas.jpg',
  },
  {
    type: 'default',
    content:
      'Opa, agora que já encontramos vários planetas para explorar, podemos configurar a rota para o mais próximo.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content:
      'Mas ainda mais importante que isso é verificar se os suprimentos do foguete estão ok.',
    picture: 'panda.jpg',
  },
  {
    type: 'user',
    content: 'Como fazer isso?',
  },
  {
    type: 'default',
    content: 'Primeiramente, vejamos o que temos de comida no momento.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]
escreva(alimentos)

// Resultado: ['maçã', 'batata', 'bife', 'geleia']`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Que? Mas o que é isso na variável alimentos?',
  },
  {
    type: 'default',
    content: 'Isso nada mais é do que uma *lista*.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'quote',
    title: 'Listas',
    content:
      'Listas nada mais são do que um conjunto ordenado de valores, onde cada valor pode ser acessado pela sua posição numérica dentro da lista.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'user',
    content: 'Acesso por posição numérica?',
  },
  {
    type: 'image',
    content:
      'Sim! Por exemplo, caso queiramos pegar a maçã da variável `alimentos` devemos fazer da seguinte forma:',
    picture: 'maca.jpg',
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
      'Como dito, para acessar qualquer elemento dentro de uma variável que é uma lista, temos que colocar entre colchetes `[]` ao lado da variável o número do seu índice, isto é, sua posição na lista de elementos na orderm crescente (esquerda para direita).',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'alert',
    content:
      'Veja que foi escrito apenas maçã, em vez de todos os alimentos, visto que estamos acessando apenas o primeiro elemento, o que é possível por meio do número que corresponde a sua posição na lista, no caso, o zero.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'user',
    content: 'Mas porque zero e não um?',
  },
  {
    type: 'default',
    content:
      'Isso porque a posição dos elementos sempre começa pelo zero, ou seja, se você quisesse pegar o segundo elemento de qualquer lista, teríamos que colocar 1 entre colchetes.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[1])

// Resultado: batata`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Dica: É possível acessar o último elemento de qualquer lista, independentemente quantos elementos ela tenha. Para isso, basta colocar 1 negativo (-1)',
    picture: 'panda-sorrindo.jpg',
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
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, caso colocássemos -2 como índice, estaríamos pegando o penúltimo elemento de uma lista.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

escreva(alimentos[-2])

// Resultado: bife`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Agora você pode perguntar, como eu faço para adicionar um novo elemento à lista?',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'user',
    content: 'Como faço para adicionar um novo elemento à lista?',
  },
  {
    type: 'default',
    content:
      'Para fazer isso, basta colocar o elemento na posição que queremos que ele tenha dentro da lista.',
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content:
      'Como no momento temos 4 alimentos, podemos colocar um abacaxi na quinta posição desse lista.',
    picture: 'abacaxi.jpg',
  },
  {
    type: 'default',
    content: 'Pensando nisso, teríamos que colocar qual número como índice?',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'user',
    content: '5?',
  },
  {
    type: 'default',
    content:
      'Não! Lembre-se os índices/posições de uma lista sempre começam do 0, logo o quinto índice corresponde ao 4.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

alimentos[4] = "abacaxi"

escreva(alimentos)
// Resultado: ['maçã', 'batata', 'bife', 'geleia', 'abacaxi']`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Cuidado, dependendo da posição em que você colocar o novo elemento, poderá haver espaços vazios na lista.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'alert',
    content:
      'Por exemplo, se tivéssemos colocado o abacaxi no índice 7, as posições 4, 5 e 6 ficariam vagas.',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = ["maçã", "batata", "bife", "geleia"]

alimentos[7] = "abacaxi"

escreva(alimentos)
// Resultado: ['maçã', 'batata', 'bife', 'geleia', nulo, nulo, nulo, 'abacaxi']`,
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
      'Agora você pode me perguntar denovo, como eu faço para substituir um elemento de uma lista?',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'user',
    content: 'Como eu faço para substituir um elemento de uma lista?',
  },
  {
    type: 'default',
    content:
      'Da mesma forma que colocamos novos elementos em uma lista. Só que caso já exista algum elemento na posição que especificarmos, esse elemento será substituído pelo o que colocamos.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var alimentos = [
    "maçã", 
    "batata", 
    "bife", 
    "geleia",
    "abacaxi"
]

alimentos[2] = "iogurte"

escreva(alimentos)
// Resultado: ['maçã', 'batata', 'iogurte', 'geleia', 'abacaxi']`,
    isRunnable: true,
  },
  {
    type: 'alert',
    content:
      'Perceba que escrevi a lista de um jeito diferenciado: Em vez de colocar os elementos um do lado do outro, coloquei um em baixo do outro separando-os por vírgulas, o que também é totalmente possível.',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    type: 'default',
    content:
      'Existem outras formas de acrescentar novos elementos a uma lista, mas por agora já estamos bem em conhecimento novo.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Agora você pode me pergutar denovo, como eu faço para remover um elemento de uma lista?',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'user',
    content: 'Como eu faço para para remover um elemento de uma lista?',
  },
  {
    type: 'default',
    content: 'Como disse, já estamos bem em conhecimento novo, até a próxima 👋.',
    picture: 'panda.jpg',
  },
]
