## Laços de Repetição

<Text>Laços de repetição, ou apenas laços, são estruturas de controle que permitem executar *repetidamente* um bloco de código (delimitado entre chaves *{}*) até que uma determinada condição seja atendida.</Text>

As três principais estruturas de repetição são o *para*, *enquanto* e *fazer-enquanto*.

### Para

<Text>Para escrever o laço  *para* é preciso colocar entre parênteses antes do bloco de código três expressões separadas por ponto e vírgula, que são: *inicializador*, *condição* e *passo*.<Text>

#### Inicialização 

É a primeira parte, sendo executada apenas uma vez, no início do laço. Ela serve para inicializar uma variável de controle. Por exemplo: *var i = 0;*

#### Condição 

É a segunda parte, sendo a condição que será avaliada a cada iteração do laço. Enquanto essa condição for verdadeira, o laço continuará executando o seu bloco de código. Por exemplo: *i < 10;*

#### Passo 

É a terceira parte, sendo executada ao final de cada iteração do laço e é usada para atualizar a variável de controle, podendo ser um incremento, decremento ou atribuição de variável (veja o tópico sobre operadores). *Por exemplo: i++*.

<Code exec>
  para (var i = 0; i < 5; i = i + 1) {
    escreva("Esse é o número ${i}");
  }

  /* Resultado:
    Esse é o número 0
    Esse é o número 1
    Esse é o número 2
    Esse é o número 3
    Esse é o número 4
    Esse é o número 5
  */
</Code>

Na inicialização a variável de controle pode ser definida fora do laço *para*.

<Code exec>
  var contador = 0 

  para (; contador < 3; contador++) {
    escreva("Esse é o número ${i}");
  }

  /* Resultado:
    Esse é o número 0
    Esse é o número 1
    Esse é o número 2
  */
</Code>

<Alert>Qualquer um das três partes do *para* pode ficar em branco.</Alert>

<Code exec>
  para (; verdadeiro; ) {
    escreva("Olá, mundo");
  }

// Resultado: Laço infinito devido à condição (segunda parte) ser sempre verdadeira.
</Code>

### Enquanto

<Text>O laço *Enquanto* necessita apenas de uma condição que, equanto for verdadeira seu bloco de código continuará sendo executado.</Text>

<Code exec>
  var total = 5

  enquanto (total > 0) {
    escreva("total é maior que zero")
    total--
}

/* Resultado:
total é maior que zero
total é maior que zero
total é maior que zero
total é maior que zero
total é maior que zero
total é maior que zero
*/
</Code>

### Fazer enquanto

<Text>O "fazer-enquanto" é um laço muito parecido com o "enquanto", só com uma diferença crucial: a condição de execução do bloco de código é verificada no final ao invés no início.</Text>

<Code exec>
  var numero = 0
  
  fazer {
    escreva(numero)
    numero++
  } enquanto (numero < 3)

  /* Resultado:
    1
    2
    3
  */
</Code>

Dessa forma, o *fazer enquanto* sempre executará seu bloco de código pelo menos uma vez.

<Code exec>
  fazer {
    escreva("sim")
  } enquanto (falso)
</Code>

### Para cada

<Text>*para cada* é uma variação da instrução *para* que pega cada elemento de uma lista (Veja o tópico sobre listas) e, para cada elemento pego, executa o seu bloco de código com este elemento definido em uma variável com nome arbitrário.</Text>

<Code exec>
  var numeros = [1, 2, 3]

  para cada numero de numeros {
      escreva(numero)
  }

  /* Resultado:
    1
    2
    3
  */
</Code>

### Interrupção de execução em laços de repetição

<Text>É possível interromper *laços de repetição* utilizando as palavras-chaves, como *pausa* e *continua*</Text>

#### Pausa

Interrompe qualquer laço de repetição.

<Code exec>
  var i = 0
  var messagem = "Ah não, esse laço foi executado mil vezes!"

  enquanto (i < 1000) {
  if (i === 5) {
    escreva("Haha, foi executado apenas 2 vezes!")
    i++
    pausa
  }

  escreva(messagem)
  i++
}

// Resultado: Haha, foi executado apenas 2 vezes!
</Code>

#### Continua

Permite pular a excução de um laço:

<Code exec>
  para (var i = 0; i < 5; i = i + 1) {
    se (i == 3) {
        escreva("O três foi pulado, haha!")
        continua
    }
    
    escreva(i)
  }

  /* Resultado:
    1
    2
    O três foi pulado, haha!
    4
    5
  */
</Code>

