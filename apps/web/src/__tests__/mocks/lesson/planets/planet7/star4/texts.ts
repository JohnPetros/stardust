import type { TextBlockDto } from '@stardust/core/global/dtos'

export const texts: TextBlockDto[] = [
  {
    type: 'image',
    content: 'O próximo desafio é dobrar cada número de uma lista.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, uma lista sendo *[1, 2, 3, 4]*, deve gerar uma lista com *[2, 4, 6, 8]*.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4]
var novaLista = []

para (var i = 0; i < numeros.tamanho(); i++) {
  var novoNumero = numeros[i] * 2
  novaLista.adicionar(novoNumero)
}

escreva(novaLista)
// Resultado: [2,4,6,8]`,
    isRunnable: true,
  },
  {
    type: 'user',
    content: 'Pronto 😎.',
  },
  {
    type: 'default',
    content: 'Muito bem!!',
    picture: 'panda-pulando-de-alegria.jpg',
  },
  {
    type: 'default',
    content: 'Só que, há uma maneira de fazer exatamente isso em bem menos linhas.',
    picture: 'panda-dando-risadinha.jpg',
  },
  {
    type: 'user',
    content: 'Como?',
  },
  {
    type: 'default',
    content: 'Usando funções de alta ordem!',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'quote',
    title: 'Funções de alta ordem',
    content:
      'Funções de alta ordem ou funções de ordem superior (vamos chamar de apenas funções avançadas), são funções que recebem outras funções como parâmetro.',
    picture: 'panda-oferecendo-bambu.jpg',
  },
  {
    type: 'code',
    content: `funcao cumprimente() {
  escreva("Olá!")
}

funcao souOutraFuncao(funcaoCumprimente) {
  funcaoCumprimente()
}

souOutraFuncao(cumprimente)
// Resultado: Olá!`,
    isRunnable: true,
  },
  {
    type: 'quote',
    content:
      'Nesse exemplo, a função *cumprimente()* foi passado como parâmetro para a funcao *souOutraFuncao()*. Assim, a função *cumprimente()* foi executada dentro de *souOutraFuncao()*.',
    picture: 'panda.jpg',
  },
  {
    type: 'quote',
    content:
      'Uma função avançada também é aquela que retorna uma função que foi passada como parâmetro.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'code',
    content: `funcao somar(num1, num2) {
  retorna num1 + num2
}

funcao executeSomar(num1, num2, somar) {
 retorna somar(num1, num2)
}

escreva(executeSomar(1, 2, somar))
// Resultado: 3`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Neste exemplo, a funcao *executeSomar()* recebe 3 parâmetros. Os dois primeiros são números e o terceiro é uma função que soma dois números.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content:
      'A função *somar()* é executada dentro da funcao *executeSomar()* usando os parâmetros que foram originalmente passados para a funcao *executeSomar()*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content: 'E o retorno de *somar()* é retornado pela funcao *executeSomar()*.',
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Parece complicado? Com certeza é.',
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    type: 'default',
    content:
      'Contudo, você percebeu que a forma de escrever uma função desse tipo não é diferente de escrever uma função normal.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Então, no final das contas, *função de ordem superior* acaba sendo um nome chique de funções que recebem ou que retornam outras funções.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'Mas porque eu estou explicando isso? Porque a função nativa que iremos usar agora é uma função desse tipo.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content:
      'Existem algumas funções avançadas que devem ser usadas especificamente para listas, e uma delas é o *mapear()*.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'quote',
    title: 'Método mapear()',
    content:
      'O método *mapear()* transforma cada elemento de uma lista por meio de um laço, retornando um nova lista.',
    picture: 'panda-amando-bambu.jpg',
  },
  {
    type: 'default',
    content: 'Para escrevê-la é simples:',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: 'var novaLista = listaOriginal.mapear(funcaoTranformadora)',
    isRunnable: false,
  },
  {
    type: 'quote',
    content:
      'O *mapear()* recebe como parâmetro uma função transformadora, ou seja, uma que transformará cada elemento da lista original.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'Quando o *mapear()* for executado essa função transformadora será aplicada a cada elemento da lista original. E cada retorno dessa função será incluído em um nova lista.',
    picture: 'panda-de-oculos.jpg',
  },
  {
    type: 'default',
    content:
      'No nosso caso, a função transformadora será que função que dobra um número. Então vamos criá-la.',
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    type: 'code',
    content: ` var numeros = [1, 2, 3, 4]

funcao dobre(numero) {
  retorna numero * 2
}
      
var novosNumeros = mapear(numeros, dobre)

escreva(novosNumeros)

// Resultado: 2, 4, 6, 8`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'A função transformadora, no caso *dobre()*, está recebendo o parâmetro *numero*. Mas de onde esse parâmetro está vindo?',
    picture: 'panda-pensando.jpg',
  },
  {
    type: 'default',
    content:
      'Lembra que eu disse que *mapear()* faz um laço na lista original passado cada item da lista como parâmetro para a função transformadora?',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'default',
    content:
      'A cada iteração desse laço a função *dobrar()* é executada recebendo como parâmetro o número atual da lista *numeros*.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'user',
    content: 'Que?',
  },
  {
    type: 'default',
    content:
      'Bugou agora? Aqui temos uma função que mostra o funcionamento do *mapear()* por baixo dos panos.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: `funcao meuMapear(lista, funcaoTrasnformadora) {
  var novaLista = []
        
  para (var i = 0; i < lista.tamanho(); i++) {
    var elementoTransformado = funcaoTrasnformadora(lista[i])
    novaLista.adicionar(elementoTransformado)
  }
        
  retorna novaLista
}`,
    isRunnable: false,
  },
  {
    type: 'user',
    content: 'Hmm...',
  },
  {
    type: 'default',
    content:
      'É bem parecido com o laço que criamos logo no começo, não é? Só que o *mapear()* faz isso automaticamente, veja de novo.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [1, 2, 3, 4]

funcao dobre(numero) {
  retorna numero * 2
}
      
var novosNumeros = mapear(numeros, dobre)

escreva(novosNumeros)
// Resultado: [2,4,6,8]`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'image',
    content:
      'Ok, vocês passaram nesse desafio. O próximo é criar uma lista com os números de outra lista que são maiores que 10.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, uma lista *[1, 4, 9, 12, 45, 60]* deve gerar uma lista *[12, 45, 60]*.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'default',
    content:
      'Ok, não será possível resolver esse desafio com *mapear()*, porque esse método de lista retorna obrigatoriamente uma lista com a mesma quantidade de itens da lista original.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content: 'E a lista gerada nesse desafio pode ter bem menos, não é?',
    picture: 'panda-triste.jpg',
  },
  {
    type: 'default',
    content:
      'Então teremos que usar outra função avançada, no caso uma que filtre os elementos de uma lista.',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Esse é um trabalho para a função *filtrarPor()*.',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'quote',
    title: 'Método filtrarPor()',
    content:
      'Esse método cria uma outra lista contendo apenas os elementos da lista original que passarem em uma condição fornecida.',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'quote',
    content:
      'E já que ele é uma função avançada, assim como o *mapear()*, ele cria um laço na lista, onde cada elemento da lista é passado como parâmetro para função filtradora.',
    picture: 'panda.jpg',
  },
  {
    type: 'code',
    content: 'var novaLista = listaOriginal.filtrarPor(funcaoFiltradora)',
    isRunnable: false,
  },
  {
    type: 'default',
    content: 'Então, no nosso caso:',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [5, 10, 15, 20]

funcao verifiqueSeEMaiorQue10(numero) {
  retorna numero > 10
}
              
var numerosFiltrados = filtrarPor(numeros, verifiqueSeEMaiorQue10)
      
escreva(numerosFiltrados)
// Resultado: 15, 20`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content: 'Está vendo que a função *verifiqueSeEMaiorQue10()* retorna um lógico?',
    picture: 'panda.jpg',
  },
  {
    type: 'default',
    content:
      'Isso porque a função filtradora deve obrigatoriamente retornar um lógico, que:\nse for *verdadeiro*, o elemento atual é colocado no nova lista, caso falso ele é excluído.',
    picture: 'panda-sorrindo-sentado.jpg',
  },
  {
    type: 'default',
    content:
      'Por exemplo, se em uma outra situação o retorno da função filtradora fosse sempre *verdadeiro*, nenhum elemento da lista original seria excluído.',
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [5, 10, 15, 20]

funcao verifiqueSeEMaiorQue10(numero) {
  retorna verdadeiro
}
              
var numerosFiltrados = numeros.filtrarPor(verifiqueSeEMaiorQue10)
      
escreva(numerosFiltrados)
// Resultado:[5, 10, 15, 20]`,
    isRunnable: true,
  },
  {
    type: 'default',
    content: 'E se fosse falso...',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [5, 10, 15, 20]

funcao verifiqueSeEMaiorQue10(numero) {
  retorna falso
}
              
var numerosFiltrados = numeros.filtrarPor(verifiqueSeEMaiorQue10)
      
escreva(numerosFiltrados)
// Resultado: Nada`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Talvez você ache que o nome da função filtradora grande demais (o que não é problema nenhum, quanto mais descritivo melhor). Você pode usar uma função anônima no lugar.',
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'default',
    content: 'Assim ó:',
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'code',
    content: `var numeros = [5, 10, 15, 20]

var numerosFiltrados = filtrarPor(numeros, funcao(numero) {
  retorna numero > 10
})
      
escreva(numerosFiltrados)
// Resultado: 15, 20`,
    isRunnable: true,
  },
  {
    type: 'default',
    content:
      'Essa é uma das vantagens da função anônima que eu disse antes, de criar a função diretamente como parâmetro de outra função.',
    picture: 'panda-deslumbrado.jpg',
  },
  {
    type: 'default',
    content:
      'E antes que pergunte, sim, também dá para usar uma função anônima no *mapear()*.',
    picture: 'panda-comemorando.jpg',
  },
  {
    type: 'code',
    content: `
var numeros = [1, 2, 3, 4]

var novosNumeros = mapear(numeros, funcao(numero) {
  retorna numero * 2
})

escreva(novosNumeros)
// Resultado: [2,4,6,8]`,
    isRunnable: true,
    picture: 'panda.jpg',
  },
  //   {
  //     type: "image",
  //     content:
  //       "Aqui está o último: Ordenar uma lista de números em ordem decrescente.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "image",
  //     content:
  //       "Por exemplo, uma lista *[12, 8, 2, 25, 16]* deve gerar uma lista *[25, 16, 12, 8, 2]*",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Ok, você sabe qual método de lista devemos utilizar para ordernar listas?",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "user",
  //     content: "Use o método *ordernar()*",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Sim! Porém, o método *ordernar()* por padrão só ordena números em ordem crescente",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `
  // escreva([12, 8, 2, 25, 16].ordenar())

  // // resultado: [2,8,12,16,25]
  //     `,
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "alert",
  //     content:
  //       "antes que pergunte, é possível sim utlizar qualquer método de lista diretamente na lista em vez na variável que armazena essa lista.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `
  // escreva(['a', 'b', 'c'].tamanho()

  // escreva([1, 2, 3].inverter())

  // escreva([1, 2, 3].somar())

  // escreva([1, 2, 3].concatenar([4]))

  // escreva([1, 2, 3].remover(1))`,
  //     isRunnable: true,
  //   },
  //   {
  //     type: "alert",
  //     content: "Isso vale para textos também.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content: "Lembra que eu disse que é possível customizar o método *ordenar()*?",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "user",
  //     content: "Então essa é a hora perfeita!",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "A customização é possível, pois o método *ordenar()* também pode ser utilizada como uma função de alta ordem.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Desse modo, poderemos passar uma função como parâmetro de *ordenar()*, que terá como papel personalizar a ordenação em si",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [1, 2, 3, 4, 5, 6]

  // funcao ordeneEmOrdemDecrescente() {

  // }

  // escreva(numeros.ordenar(ordeneEmOrdemDecrescente))`,
  //     isRunnable: false,
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "A função passada como parâmetro de ordenar, nesse caso a função *ordeneEmOrdemDecrescente* receberá 2 parâmetros em cada iteração, que chamaremos de *primeiroNumero* e *segundoNumero*",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [1, 2, 3, 4, 5, 6]

  // funcao ordeneEmOrdemDecrescente(primeiroNumero, segundoNumero) {

  // }

  // escreva(numeros.ordenar(ordeneEmOrdemDecrescente))`,
  //     isRunnable: false,
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Veja que *primeiroNumero* e *segundoNumero* sempre vão mudar de valor a cada iteração.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [1, 2, 3, 4, 5, 6]

  // funcao ordeneEmOrdemDecrescente(primeiroNumero, segundoNumero) {
  //   escreva(primeiroNumero)
  //   escreva(segundoNumero)
  // }`,
  //     isRunnable: true,
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Na primeira iteração, *primeiroNumero* e *segundoNumero* terão, respectivamente, os valores *1* e *2*, na próxima *3* e *4* e, por fim, *5* e *6*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "user",
  //     content:
  //       "Entendi!",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Mas assim não estamos ordenando nada! Para ordenar de fato a função ordernadora deve retornar 0, um número positivo ou um número negativo.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "quote",
  //     content:
  //       "Se retornar um número positivo: o valor de *primeiroNumero* assumirá a posição que está à direita do *segundoNumero*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "quote",
  //     content:
  //       "Se retornar um número negativo: o valor de *segundoNumero* assumirá a posição que está à esquerda do *primeiroNumero*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "quote",
  //     content: "Se retornar zero: Nada acontece.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "quote",
  //     content: "Então, por exemplo, se eu retornar -1",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [1, 2, 3, 4, 5, 6]

  // funcao ordeneEmOrdemDecrescente(primeiroNumero, segundoNumero) {
  //   retorna -1
  // }

  // escreva(numeros.ordenar(ordeneEmOrdemDecrescente))

  // // Resultado: [6,5,4,1,2,3]`,
  //     isRunnable: false,
  //   },
  //   {
  //     type: "default",
  //     content: "A lista será ordenada de forma decrescente, visto que retornando um número o *primeiroNumero* sempre será reposicionado na posição à direita de *segundoNumero*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "user",
  //     content: "Então já concluímos com sucesso esse desafio!",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Não não não. Na verdade deu certo porque os números já estavam em uma ordem favorável.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Mas e se fosse aplicado a uma lista com números desordenados como a do desafio.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [12, 8, 2, 25, 16]

  // funcao ordeneEmOrdemDecrescente(primeiroNumero, segundoNumero) {
  //   retorna -1
  // }

  // escreva(numeros.ordenar(ordeneEmOrdemDecrescente))

  // // Resultado: [12,8,2,25,16]`,
  //     isRunnable: false,
  //   },
  //   {
  //     type: "user",
  //     content:
  //       "Não deu nada certo 🙄.",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Exatamente! Precisamos arrumar um jeito de deixar o retorno da função ordenadora de forma dinâmica. Para isso podemos fazer o seguinte.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "code",
  //     content: `var numeros = [12, 8, 2, 25, 16]

  // funcao ordeneEmOrdemDecrescente(primeiroNumero, segundoNumero) {
  //   retorna segundoNumero - primeiroNumero
  // }

  // escreva(numeros.ordenar(ordeneEmOrdemDecrescente))

  // // Resultado: [25,16,12,8,2]`,
  //     isRunnable: false,
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Mas porque agora deu certo.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Lembre-se que é preciso retorna um número positivo ou negativo. Se o *segundoNumero* for maior que *primeiroNumero*, a subtração resultará em um número positivo, o *segundoNumero* sempre estará uma posição antes de *primeiroNumero*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Isso acontece, por exemplo, quando *segundoNumero* é 8 e *primeiroNumero* é 12.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Agora, se o resultado da subtração for um número positivo, o *primeiroNumero* sempre será reposicionado antes de *segundoNumero*.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Isso acontece, por exemplo, quando *segundoNumero* é 25 e *primeiroNumero* é 2.",
  //     picture: "panda.jpg",
  //   },
  //   {
  //     type: "user",
  //     content:
  //       "Agora sim, eu realmente entendi!",
  //   },
  //   {
  //     type: "default",
  //     content:
  //       "Ótimo! Agora vamos para o proxímo desafio.",
  //     picture: "panda.jpg",
  //   },
  {
    type: 'image',
    content: 'Puxa, vocês conseguiram resolver todos os desafios.',
    picture: 'tubarao-malvado.jpg',
  },
  {
    type: 'image',
    content: 'Vocês podem ver a princesa, ela está no castelo logo à frente.',
    picture: 'castelo-alien.jpg',
  },
  {
    type: 'default',
    content: 'Espera aí! A pessoa que pediu nossa ajuda é uma princesa?',
    picture: 'panda-espantado.jpg',
  },
]
