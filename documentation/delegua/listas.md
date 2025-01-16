## Listas

<Text>Listas são variáveis com capacidade de armazenar 0 ou mais valores. São úteis em ocasiões em que é necessário executar uma lógica com múltiplos valores.</Text>

Para declarar uma lista é preciso usar colchetes *[]* e separar os elementos por vírgulas.

<code>var lista = [1, 2, 3, 4, 5]</code>

Listas podem conter valores de diferentes tipos:

<Code>
  var numeros = [1, 2, 3, 4, 5]

  var textos = ['maçã', 'banana', 'laranja']

  var misto = [10, 'texto', verdadeiro]
</Code>

O alinhamento dos itens pode ser arbitrário desde que eles sejam separados por uma virgula.

<Code>
  // ✅
  var filmes = [
    'O Poderoso Chefão', 'Titanic', 'Matrix', 'Star Wars', 'Harry Potter'
  ] 

  // ✅
  var livros = [
    '1984', 
    'O Senhor dos Anéis', 
    'O Hobbit', 'O Diário de Anne Frank', 
    'O Guia do Mochileiro das Galáxias'
  ]

</Code>

### Acessando elementos

<Text>É possível acessar elementos individuais de um lista ornecendo dentro de colchetes *[]* e o índice do elemento desejado.</Text>

<Quote>O índice de uma lista se trata do número que corresponde a posição em que o elemento se encontra na lista, porém sempre começando do número 0, ou seja, para acessar o primeiro elemento é preciso usar índice 0 o segundo, índice 1 o terceiro, índice 2 e assim por diante.</Quote>

<Code>
  var frutas = ['maçã', 'banana', 'cereja', 'damasco', 'mirtilo']
    
  escreva(frutas[0]) // maçã
  
  escreva(frutas[1]) // banana
  
  escreva(frutas[2])  // cereja
</Code>

<Alert>Se índice for zero ou positivo, a posição a ser acessada conta a partir do primeiro elemento da lista. Caso seja negativo, a posição a ser acessada conta a partir do último elemento da lista.</Alert>

<Code>
  var texto = "abc"
  var texto2 = "abc"

  escreva("abc"[0]) // Resultado: a
  escreva(texto[-1]) // Resultado: c
</Code>

<Alert>Se um índice fornecido não tiver um valor correspondente é retornado um erro.</Alert>

<Code>var lista = [1, 2]

escreva(lista[2])

// Resultado: Erro na linha 3: Índice da lista fora do intervalo.
</Code>

### Substituindo elementos

Pode-se alterar o valor de um elemento de uma lista atribuindo um novo valor ao índice correspondente.

<Code>
  var numeros = [1, 2, 3, 4, 5]
    
  numeros[1] = 10
        
  escreva(numeros)

  // Resultado: [ 1, 10, 3, 4, 5 ]
</Code>

### Métodos para manipulação de listas

É possível manipular listas utilizando os *métodos de lista*, que já vem incorporados na linguagem e fornecem funcionalidades úteis para adicionar, remover, ou copiar elementos de qualquer lista criada.

#### adicionar()

<Text>Adiciona um ou mais elementos ao final de uma lista.</Text>

<Code>
  var cores = ['vermelho', 'azul']
      
  cores.adicionar('amarelo')

  escreva(cores)
              
  // Resultado: [ 'vermelho', 'azul', 'amarelo' ]
</Code>

<Alert>Listas aumentam de tamanho dinamicamente, se necessário.</Alert>

<Code>
  var profissoes = ['engenheiro', 'médico']
  profissoes[2] = 'professor'

  escreva(profissoes)
              
  // Resultado: [ 'engenheiro', 'médico', 'professor' ]
</Code>

<Alert>Caso uma nova posição na lista seja maior que o tamanho, todas as posições entre o último elemento anterior e o novo último elemento são preenchidas com *nulo*</Alert>

<Code>
  var esportes = ['Futebol', 'Basquete']
  esportes[3] = 'Vôlei'
  escreva(esportes)

  // Resultado: [ 'Futebol', 'Basquete', nulo, 'Vôlei' ]
</Code>


#### remover()

<Text>Remove um elemento de uma lista. O item a ser removido deve ser especificado como argumento do método, ou seja, entre seus parênteses.</Text>

<Code>
  var empresas = ['Microsoft', 'Google', 'Facebook', 'Amazon']
    
  empresas.remover('Facebook')

  escreva(empresas)

  // [ 'Microsoft', 'Google', 'Amazon' ]
</Code>

#### removerUltimo()

Remove o último elemento de uma lista.

<Code>
  var numeros = [1, 2, 3, 4, 5]
    
  numeros.removerUltimo()

  escreva(numeros) 

  // Resultado: [ 1, 2, 3, 4 ]
</Code>

#### removerUltimo()

Remove o primeiro elemento de uma lista.

<Code>
  var bandas = ['Beatles', 'Queen']
    
  bandas.removerPrimeiro()

  escreva(bandas) 

  // Resultado: [ 'Queen' ]
</Code>

#### tamanho()

Retorna a quantidade de elementos presentes em uma lista.

<Code>
  var carros = [
    'Ferrari', 
    'Lamborghini', 
    'Bugatti', 
    'McLaren', 
    'Porsche'
  ]
    
  var quantidade = carros.tamanho()

  escreva(quantidade)

  // Resultado: 5
</Code>

#### concatenar()

<Text>Combina duas ou mais lista em uma nova lista.</Text>

<Code>
    var mamiferos = ['cachorro', 'gato', 'elefante']
    var aves = ['pássaro', 'pinguim', 'flamingo']

    var animais = mamiferos.concatenar(aves)

  escreva(animais)  
// [ 'cachorro', 'gato', 'elefante', 'pássaro', 'pinguim', 'flamingo' ]
</Code>

#### fatiar()

<Text>Retorna uma cópia de uma parte da lista, especificada por um índice inicial (obrigatório) e um índice final (opcional). Porém, o item que corresponde ao índice final nunca é incluído na fatia.</Text>

<Code>
  var pedacos = [
    'pedaço 1',
    'pedaço 2',
    'pedaço 3',
    'pedaço 4',
    'pedaço 5'
  ]
    
  var fatia = pedacos.fatiar(1, 3)

  escreva(fatia)
  // Resultado: [ 'pedaço 2', 'pedaço 3' ]
</Code>

<Alert>Se o índice final não for especificado, a cópia começará do índice inicial terminando no último elemento da lista.</Alert>

<Code>
  var lista = [1, 2, 3, 4, 5]
    
  var sublista = lista.fatiar(1)

  escreva(sublista)
  // Resultado: [2, 3, 4, 5]
</Code>

#### encaixar()

<Text>Permite remover, substituir ou adicionar elementos em posições específicas. Ele modifica a lista original e retorna uma novo lista contendo os elementos que foram removidos.</Text>

Ele possui três argumentos: o primeiro (obrigatório) é o índice inicial no qual a operação do *encaixar()* deve começar.

O segundo (opcional) é a quantidade de itens que vão ser removidos da lista a partir do índice inicial.

<Code>
  var times = ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool']

  times.encaixar(1, 2)

  escreva(times)

  // Resultado: [ 'Real Madrid', 'Liverpool' ]
</Code>

<Alert>Os elementos removidos são retornados como uma outra lista.</Alert>

<Code>
  var alunos = ['Ana', 'Beto', 'Carla', 'Daniel', 'Eduardo']
    
  var alunosRemovidos = alunos.encaixar(1, 3)

  escreva(alunos)
  // Resultado: [ 'Ana', 'Eduardo' ]

  escreva(alunosRemovidos)
  // Resultado: [ 'Beto', 'Carla', 'Daniel' ]
</Code>

Do terceiro argumento adiante (opcional) é definido os elementos que serão adicionados na lista a partir do ídice inicial.

<Code>
  var jogos = [
    'Among Us',
    'League of Legends', 
    'Valorant',
    'CS',
    'Minecraft',
  ] 

  jogos.encaixar(1, 3, "FIFA 23", "FIFA 24")
  
  escreva(jogos)
  
  /* Resultado: 
    [ "Among Us", "FIFA 23", "FIFA 24", 'Minecraft' ]
  */
</Code>

#### encaixar()

<Text>Verifica se um elemento está presente na lista, retornando um valor lógico (*verdadeiro* ou  *falso*).</Text>

<Code>
  var simpsons = [
    'Homer Simpson',
    'Marge Simpson',
    'Bart Simpson',
    'Lisa Simpson',
    'Maggie Simpson'
  ]

  var vovoSimpson = 'Abe Simpson'
    
  var vovoEstaPresente = simpsons.inclui(vovoSimpson)

  escreva(vovoEstaPresente)
  // Resultado: falso
</Code>

#### inverter()

<Text>Inverte a ordem dos elementos de uma lista.</Text>

<Code>
  var numeros = [1, 2, 3, 4, 5]
    
  numeros.inverter()

  escreva(numeros)
  // Resultado: [ 5, 4, 3, 2, 1 ]
</Code>

#### ordenar()

<Text>Cria uma nova lista com os números da lista original em ordem crescente.</Text>

<Code>
  var numeros = [5, 4, 3, 2, 1]
    
  var listaOrdenada = numeros.ordenar()

  escreva(listaOrdenada)
  // Resultado: [ 1, 2, 3, 4, 5 ]
</Code>

<Alert>Caso a lista contenha textos, a ordenação será por ordem alfabética.</Alert>

<Code>
  var nomes = ["Erika", "Ana", "Carlos", "Daniel", "Bianca"]
      
  var nomesEmOrdemAlfabetica = nomes.ordenar()

  escreva(nomesEmOrdemAlfabetica)
  // Resultado: [ "Ana", "Bianca", "Carlos", "Daniel", "Erika" ]
</Code>

<Alert>Se a lista possuir números e textos a ordenação dos numéros será feita primeiro.</Alert>

<Code>
  var elementos = ["Zé", 5, "Erika", 7, "Bianca"]
    
  elementos.ordenar()

  escreva(elementos) 
  // Resultado: [ 5, 7, Bianca, Erika, Zé ]
</Code>

#### somar()

<Text>Retorna a soma de uma lista de números.</Text>

<Code>
  var numeros = [1, 2, 3, 4, 5]
    
  var soma = numeros.somar()

  escreva(soma)
  // Resultado: 15
</Code>

#### Métodos para textos

<Text>Textos também podem ser tratados como listas.</Text>

<Code>
  var letras = "abc"
    
  escreva(letras[0])
  // Resultado: a
</Code>

Logo, é possível usar alguns métodos de vetor em textos, como *tamanho()*, *inverter()* e *concatenar()* e *inclui()*.

<Code>
  var letras = "abc"
    
  escreva(letras.tamanho())
  // Resultado: 3
  
  escreva(letras.inverter())
  // Resultado: cba
  
  escreva(letras.concatenar("def"))
  // Resultado: abcdef
  
  escreva(letras.inclui("z"))
  // Resultado: falso
</Code>

<Quote>Porém, há métodos próprios para manipular textos, como seguir:</Quote>

#### aparar()

<Text>Remove os espaços em branco qua estão no início e no final de um texto.</Text>

<Code>
  var frase = "   Olá, mundo   "

  escreva(frase.aparar())

  // Resultado: Olá, mundo
</Code>

#### apararFim()

<Text>Remove os espaços em branco que estão no final de um texto.</Text>

<Code>
  var frase = "Olá, mundo   "

  escreva(frase.apararFim())

  // Resultado: Olá, mundo
</Code>

#### apararInicio()

<Text>Remove os espaços em branco no início de um texto.</Text>

<Code>
  var frase = "        Olá, mundo"

  escreva(frase.apararInicio())

  // Resultado: Olá, mundo
</Code>

#### dividir()

<Text>Divide uma texto em uma lista de subtextos com base em um separador especificado nos seus parênteses.</Text>

<Code>
  var frase = "Olá, Mundo!"
  var palavras = frase.dividir(",")
   
  escreva(palavras)
  // Resultado: [ "Olá", " Mundo!" ]
</Code>

<Code>        
  var data = '2022-12-31'

  var numeros = data.dividir('-')

  escreva(partesData) // ['2022', '12', '31']
  // Resultado: [ '2022', '12', '31' ]

</Code>

<Code>        
  var frase = "Olá, Mundo! Como você está?"
  var palavras = frase.dividir(" ") 

  escreva(palavras)
  // Resultado: [ "Olá,", "Mundo!", "Como", "você", "está?" ]
</Code>

<Alert>Se um texto vazio for definido como separador, o texto executando *dividir()* será dividido em uma lista contendo cada caractere desse texto.</Alert>

<Code>        
  var palavra = 'programação'

  var letras = palavra.dividir('')


  escreva(letras)
  // Resutado: [ 'p', 'r', 'o', 'g', 'r', 'a', 'm', 'a', 'ç', 'ã', 'o' ]
</Code>

#### subtexto()

<Text>Extrai uma parte específica de um texto.</Text>

Ele recebe dois parâmetros: o índice inicial (obrigatório) e o índice final (opcional) do subtexto desejado. O caractere no índice inicial está incluído no subtexto, enquanto o caractere no índice final não está incluído.

<Code>        
  var textoCompleto = "Olá, Mundo"
  
  var textoFatiado = textoCompleto.subtexto(0, 3)
  
  escreva(textoFatiado)
   
  // Resultado: "Olá"
</Code>

Se o inídice final for omitido, o método *subtexto()* extrairá do índice fornecido até o final do texto original.

<Code>        
  var textoCompleto = "Olá, Mundo"

  var textoFatiado = textoCompleto.subtexto(5)

  escreva(textoFatiado)

  // Resultado: "Mundo"
</Code>

#### maiusculo()

Retorna um novo texto com todos os caracteres do texto original em letras maiúsculas.

<Code>        
  var frase = "olá, mundo"
  var fraseEmMaiusculo = frase.maiusculo()
  
  escreva(fraseEmMaiusculo) 
  // Resultado: "OLÁ, MUNDO"
</Code>

#### minusculo()

<Text>Retorna um novo texto com todos os caracteres do texto original em letras minúsculas.</Text>

<Code>        
  var frase = "OLÁ, MUNDO"
  var fraseEmMinusculo = frase.minusculo()

  escreva(fraseEmMinusculo) 
  // Resultado: "olá, mundo"
</Code>

