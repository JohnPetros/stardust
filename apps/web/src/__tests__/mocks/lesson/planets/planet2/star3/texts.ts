import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'default',
    content:
      'Como já aprendemos sobre o tipo *número*, vamos agora enviar uma mensagem para o planeta Datahon que seja do tipo *número*.',
    picture: 'panda-olhando-computador.jpg',
  },
  {
    type: 'image',
    picture: 'apollo-teclando.jpg',
    content: 'Enviando mensagem...',
  },
  {
    type: 'image',
    picture: 'computador-piscando.jpg',
    content: 'Mensagem recebida de volta.',
  },
  {
    type: 'default',
    content: 'Opa! Parece que a mensagem foi entendida com sucesso 🎉!',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'default',
    content: 'E também eles enviaram uma resposta!',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    content: 'Porém, a resposta é do tipo diferente do que já vimos antes.',
    type: 'default',
    picture: 'panda-triste.jpg',
  },
  {
    content: 'E qual é?',
    type: 'user',
  },
  {
    content: 'A mensagem de resposta é do *tipo lógico*.',
    type: 'default',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    content: '???',
    type: 'user',
  },
  {
    title: 'Tipo lógico',
    content:
      'Dados do tipo *lógico* nada mais são do que valores que correspondem uma única opção entre apenas duas possibilidades possíveis: *verdadeiro* ou *falso*.',
    type: 'default',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    content:
      'Para declarar um dado do tipo *lógico*, basta atribuir valor *verdadeiro* ou valor *falso* a uma variável.',
    type: 'quote',
    picture: 'panda-segurando-bambu-de-pe.jpg',
    title: 'Declaração de dado do tipo lógico',
  },
  {
    content: `var respostaEnviada = verdadeiro
var inimigo = falso`,
    type: 'code',
    isRunnable: false,
  },
  {
    content:
      'No exemplo acima, a primeira variável indica se a resposta foi enviada *(verdadeiro)* ou não foi enviada *(falso)*. A segunda variável indica se quem enviou é amigo *(verdadeiro)* ou inimigo *(falso)*.',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content:
      'Não confunda. Nesse caso, tanto *verdadeiro*, quanto *falso* não são escritos entre aspas porque eles não são dados do tipo *texto*, mas sim do tipo *lógico*.',
    picture: 'panda.jpg',
    type: 'alert',
  },
  {
    content: 'Mas então, o que eu faço com essa resposta enviada?',
    type: 'user',
  },
  {
    content:
      'O planeta proíbe a entrada de pessoas com armas, então é bom deixar claro que você não tem nenhuma:',
    type: 'default',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    content: `var armas = nulo`,
    type: 'code',
    isRunnable: false,
  },
  {
    content: 'Mas o que raios é esse nulo?',
    type: 'user',
  },
  {
    content:
      'Esqueci de dizer, mas existe um tipo de dado especial chamado *nulo* que basicamente quer dizer que a variável não tem nenhum valor.',
    type: 'default',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    content:
      'Isso quer dizer, também, que *nulo* é atribuído automaticamente a uma variável quando ela é criada sem nunhum valor atribuído a ela.',
    type: 'default',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    content: `var espaco
escreva(espaco)
//  Resultado: nulo`,
    type: 'code',
    isRunnable: true,
  },
  {
    content: 'Há outros, além de *verdadeiro*, *falso* e *nulo*?',
    type: 'user',
  },
  {
    content:
      'Não! Um valor do tipo lógico só pode ser *verdadeiro* ou *falso*. Você verá mais para frente que o valor *nulo* pode ser considerado como valor *falso* também.',
    type: 'default',
    picture: 'panda-piscando.jpg',
  },
  {
    content:
      'Porém, agora que você aprendeu um pouco mais sobre valores lógicos, que tal praticar esse conhecimento?',
    picture: 'panda-andando-com-bambu.jpg',
    type: 'quote',
  },
]
