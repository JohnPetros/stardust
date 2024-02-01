## Funções

<Text>Funções são blocos de código que podem ou não devolver um valor ao final de sua execução.
</Text>

As funções podem ser identificadas por um nome ou não.

### Função com nome

<Text>Funções com nome podem ser criadas usando a palavra-chave *funcao* (ou *função*), seguida de um nome, e uma lista de parâmetros dentro de parênteses, sendo que cada parâmetro deve ser separado por vírgula. Além disso, bloco de código da função, que é delimitado entre chaves *{}*.</Text>

O nome da função pode ser qualquer coisa, desde que obedeça as regras de nomeação de variáveis (veja o tópico *básico*). Porém, uma boa prática de nomeação é começar o nome da função com um verbo.

<Code>
funcao exibaMensagem() {
  escreva("Olá!")
}
</Code>

Para executar uma função é preciso escrever, depois de declara-la, o nome dela seguido de parênteses.

<Code>
funcao exibaMensagem() {
  escreva("Olá!")
}

exibaMensagem()
// Resultado: Olá!
</Code>

<Alert>"Executar uma função" é sinônimo de " *chamar* uma função"</Alert>

### Parâmetros e Argumentos

<Text>As funções podem receber valores de entrada, que são chamadas de *parâmetros*. </Text>

<Text>Antes de chamar uma função , também é possível fornecer os valores de entrada, que são chamados de *argumentos*.</Text>

<Code>
funcao comprimente(nome) /* parâmetro */ {
  escreva("Olá, " + nome + "! Seja bem-vindo!")
}
              
comprimente("João") // argumento
// Resultado: Olá, João! Seja bem-vindo!
</Code>

<Alert>Uma função pode receber múltiplos argumentos e parâmetros separados por vírgula.</Alert>

<Code>
funcao someNumeros(numero1, numero2, numero3) {
  var resultado = numero1 + numero2 + numero3
  escreva(resultado)
}
              
someNumeros(1, 2, 3)
// Resultado: 6
</Code>

<Alert>Contudo, a quantidade de parâmetros e argumentos tem que ser igual, senão ocorrerá resultados inesperados.</Alert>

<Code>
funcao someNumeros(numero1, numero2, numero3) {
  var resultado = numero1 + numero2 + numero3
  escreva(resultado)
}
              
someNumeros(1)
// Resultado: 🤷‍♂️
</Code>

### Retorna

<Text>Uma função pode retornar um valor ou o resultado de uma expressão usando a palavra-chave *retorna*. O valor de retorno pode ser usado em outras partes do código.</Text>

<Code>
funcao someNumeros(a, b) {
  retorna a + b
}
            
var resultado = someNumeros(3, 4)

escreva(resultado)
// Resultado: 7
</Code>

<Alert>Funções com *retorna* podem ser usadas como qualquer outra variável dentro do programa.</Alert>

<Code>
funcao exibaMensagem(nome) {
  retorna nome
}
              
escreva("Olá, " + exibaMensagem('Leonel') + "! Seja bem-vindo!")
// Resultado: Olá, Leonel! Seja bem-vindo!
</Code>

### Escopo de função

<Text>De modo similar às *condicionais* (veja o tópico sobre condicionais) e aos *laços* (veja o tópico sobre laços), as variáveis declaradas dentro de uma função são chamadas de variáveis locais e só podem ser acessadas dentro da própria função. Porém, as variáveis globais podem ser acessadas dentro de qualquer função</Text>

<Code>
var global = "Variável global"
    
funcao execute() {
  var local = "Variável local"
  escreva(local) // Resultado: Variável local
  escreva(global) // Resultado: Variável global
}
            
escreva(local) 
// Resultado: Variável não definida: 'local'.
</Code>

### Função anônima

<Text>É possível criar funções sem um nome especificado. São normalmente usadas como argumentos de outras funções.</Text>

Porém, uma das maneiras de chamar uma função desse tipo, é associar essa função a uma variável.

<Code>
var conteUmaPiada = funcao() {
  escreva("O computador disse que meu nível é 101, mas ele quis dizer nível 5.")
}

conteUmaPiada()
// Resultado: 
// O computador disse que meu nível é 101, mas ele quis dizer nível 5.
</Code>

<Alert>Como dito, as funções anônimas são frequentemente usadas como argumentos de outras funções, especialmente *funções de ordem superior*, como *mapear()*, *filtrarPor()* etc, que serão explicadas mais a frente nesse tópico.</Alert>

### Funções Nativas

<Text>Funções nativas são funções incorporadas na linguagem que fornecem funcionalidades pré-definidas para realizar tarefas específicas.</Text>

Essas funções estão disponíveis globalmente e podem ser usadas em qualquer parte do código sem a necessidade de definição adicional. As funções nativas mais famosas são *escreva()* e *leia()* (veja o tópico *básico*).

<Code>
var mensagem= leia()
escreva(mensagem)
</Code>

<Alert>Por favor, não tente criar funções com nomes já utilizados pela linguagem.</Alert>

<code>
funcao escreva() { // ❌
  // ...
}

funcao leia() { // ❌
  // ...
}

funcao aleatorio() { // ❌
  // ...
}

funcao retorna() { // ❌
  // ...
}
</code>

### aleatorio()

<Text>Retorna um número decimal aleatório entre 0 e menor que 1.</Text>

<Code>
var numeroAleatorio = aleatorio()
    
escreva(numeroAleatorio)
// Resultado: Um número aleatório. Execute para comprovar 😜.
</Code>

### aleatorioEntre()

<Text>Retorna um número inteiro aleatório entre os valores passados para a função. O primeiro argumento é o número mínimo e o segundo é o máximo. Além disso, o valor gerado aleatoriamente nunca será igual ao número máximo passado para a função, ou seja, sempre será um a menos que o máximo definido.</Text>

<Code>
var numeroAleatorio = aleatorioEntre(1, 9)

escreva(numeroAleatorio)
// Resultado: 
// Um número aleatório entre 1 e 8. 
// Execute para comprovar 😜.
</Code>

### Funções de conversão

<Text>São funções que permitem converter valores de um determinado tipo de dado para outro tipo.</Text>

#### inteiro()

<Text>Converte um número decimal ou um texto que não apresenta letras em um número inteiro.</Text>

<Code>
var valorEmTexto = "111"
    
escreva(111 + inteiro(valorEmTexto))
// Resultado: 222
</Code>

### real()

<Text>Converte um número inteiro ou texto que não apresente letras, em um número decimal.</Text>

<Code>
  var valorEmTexto = "504.69"

  escreva(0.01 + real(valorEmTexto))
  // Resultado: 504.7
</Code>

<Text>Converte um número inteiro ou texto que não apresente letras, em um número decimal.</Text>

<Code>
  var valorEmTexto = "504.69"

  escreva(0.01 + real(valorEmTexto))
  // 504.7
</Code>

<Text>Transforma números decimais ou inteiros em texto.</Text>

<Alert>Lembre-se que textos numéricos que são "somados", são concatenados em vez disso.</Alert>

<Code>
  var valorEmNumero = 123

  escreva("123" + texto(valorEmNumero))
  // Resultado: 123123
</Code>

### Funções de ordem superior

*Funções de ordem superior* ou *funcções de alta ordem* são funções que podem receber outras funções como argumentos e/ou retornar funções como resultado.

<Code>
funcao comprimentePessoa(funcaoQueRetornaPessoa) {
  retorna funcaoQueRetornaPessoa()
}

funcao retornaPessoa() {
  retorna "Samuel"
}

var mensagem = comprimentePessoa(retornaPessoa)

escreva(mensagem)
</Code>

<Alert>Métodos são funções (veja o tópico sobre *listas*), logo elas também pode ser *funções de ordem superior*</Alert>

#### mapear()

<Text>Método de lista que cria um nova lista a partir de uma função que é executada usando cada elemento da lista original como parâmetro.</Text>

<Code>
var numeros = [1, 2, 3, 4, 5]

var numerosDobrados = numeros.mapear(funcao (numero) {
    retorna numero * 2
})

escreva(numerosDobrados)
// Resultado: [2, 4, 6, 8, 10]
</Code>

<Alert>*funções de alta ordem* também podem receber diretamente o nome da função como argumento, sendo que o resultado será o mesmo.</Alert>

<Code>
var numeros = [1, 2, 3, 4, 5]

funcao dobre(numero) {
  retorna numero * 2
}

var numerosDobrados = numeros.mapear(dobre)

escreva(numerosDobrados)
// Resultado: [2, 4, 6, 8, 10]
</Code>

#### filtrarPor()

<Text>Criar uma nova lista com base no valor lógico retornado pela função que terá como argumento cada elemento da lista original.</Text>

Se o valor retornado for *verdadeiro*, o elemento atual é colocado na nova lista, caso contrário ele será descartado.

<Code>
var numeros = [1, 2, 3, 4, 5, 6]

funcao verifiqueNumeroPar(numero) {
  retorna numero % 2 == 0
}

var numerosPares = numeros.filtrarPor(verifiqueNumeroPar)

escreva(numerosPares)
// Resultado: [ 2, 4, 6 ]
</Code>

#### ordenar()

<Text>Método de lista que pode também receber uma função para efetuar uma ordenação personalizada.</Text>

Por exemplo para ordernar numéros de forma decrescente.

A função de comparação passada para o método ordernar() deve retornar um número negativo, zero ou positivo, dependendo de como você quer ordenar os elementos. Aqui está o que cada valor retornado significa:

<Quote>*Número negativo:* Se a função de comparação retornar um número negativo, o primeiro elemento será colocado antes do segundo elemento na lista ordenada.</Quote>

<Quote>*Zero:* Se a função de comparação retornar zero, a ordem dos dois elementos será mantida. Em outras palavras, eles serão considerados iguais para fins de ordenação.</Quote>

<Quote>*Número positivo:* Se a função de comparação retornar um número positivo, o primeiro elemento será colocado depois do segundo elemento na lista ordenada.</Quote>

<Code>
var numeros = [4, 2, 5, 1, 3]

numeros.ordenar(funcao(a, b) {
    retorna b - a
})

escreva(numeros) 
// Resultado: [ 5, 4, 3, 2, 1 ]
</Code>

<Quote>No caso acima, a função de comparação retorna um número negativo se b for menor que a, zero se b for igual a a, e um número positivo se b for maior que a. Como resultado, os números são ordenados em ordem decrescente.</Quote>
