## Operadores

<Text>Operadores, assim como na matemática, são símbolos ou palavras-chave que indicam uma operação a ser realizada com um ou mais valores.</Text>

Eles podem ser classificados em diferentes categorias, como *operadores aritméticos*, *operadores de atribuição*, *operadores de comparação (ou relacionais)*, *operadores lógicos* e *operadores de pertencimento* (veja o tópico de *dicionários* para enteder esse último).

### Operador de atribuição

Usado para atribuir valores a variáveis. É representado pelo símbolo *=*.

<Code exec>
  var numero = 1
  escreva(numero) // 1
  
  var numero = numero + 1
  escreva(numero) // 2
</Code>

<Alert>Para atribuir múltiplos valores na mesma linha, separe os valores por vírgula.</Alert>

<Code exec>
  var a, b, c = 1, 2, 3

  escreva(a) // 1
  escreva(b) // 2
  escreva(c) // 3
</Code>

### Operadores Aritiméticos
<Text>Realizam operações matemáticas em valores numéricos, como *adição (+)*, *subtração (-)*, *multiplicação (*)*, *divisão (/)*, *resto (%)*.</Text>

#### Adição (+)

<Code exec>
  escreva(2 + 2) // Resultado: 4
</Code>

Também há a adição combinada com a atribuição *(+=)*:

<Code exec>
  var a = 2
  a += 2 
  escreva(a) // Resultado: 4
</Code>

#### Subtração (-)

<Code exec>
  escreva(10 - 7) // Resultado: 3
</Code>

Também há a subtração combinada com a atribuição *(-=)*:

<Code exec>
  var b = 10
  b -= 3 
  escreva(b) // Resultado: 7
</Code>

#### Multiplicação (*)

<Code exec>
  escreva(10 * 3) // Resultado: 30
</Code>

Também há a multiplicação combinada com a atribuição *(<span>*</span>=)*:

<Code exec>
  var b = 10
  b *= 3 
  escreva(b) // Resultado: 30
</Code>

#### Divisão (/)

<Code exec>
  escreva(100 / 5) // Resultado: 20
</Code>

Também há a divisão combinada com a atribuição *(/=)*:

<Code exec>
  var b = 100
  b /= 5
  escreva(b) // Resultado: 20
</Code>

#### Resto da divisão/módulo (%)
Retorna o resto da divisão entre dois números.

<Code exec>
  escreva(25 % 4) // Resultado: 1
</Code>

#### Exponenciação ou Potência (<span>*</span><span>*</span>)
Retorna o primeiro operando elevado à potência do segundo operando.


<Code exec>
  escreva(2 <span>*</span><span>*</span> 5) // Resultado: 32
</Code>

### Prioridade de operadores de incremento/decremento

<Text>Operadores que incrementa *(++)* ou decrementa *(--)* em 1 uma variável que contém um número ou um valor que é do tipo número.</Text>

<Code exec>
  var a = 5

  a++
  escreva(a) // Resultado: 6

  var b = 10
  b--
  escreva(b) // Resultado: 9
</Code>

<Alert>Esses operadores são um caso especial. Por serem operadores unários, ou seja, só necessitam de um operando, podem aparecer antes da variável ou valor numérico:</Alert>

<Code exec>
  var a = 2
  escreva(++a) // Resultado: 3
</Code>

<Code exec>
  var a = 2
  escreva(a++) // Escreve 2
  escreva(a) // Escreve 3
</Code>

Em resumo, quando o operador aparece antes da variável, o *incremento/decremento* é feito antes do valor da variável ou número ser escrito. Quando aparece depois, o valor é escrito primeiro e o incremento ocorre depois.

Por isso, especificamente para literais, a construção abaixo não existe:

<Code exec>var b = 3++</Code>

Mas a linha embaixo é válida:

<Code exec>var b = ++3</Code>

### Operadores relacionais

<Text>São usados para comparar valores, retornando um valor lógico (*verdadeiro* ou *falso*)</Text>

<Quote>*==* -> Igual a</Quote>
<Quote>*!=* -> Diferente de</Quote>

<Alert>Os operadores a seguir requerem que ambos os operandos sejam números, diferentemente dos operadores de cima:</Alert>

<Quote>*>=* -> Maior ou igual que</Quote>
<Quote>*<=* -> Menor ou igual que</Quote>
<Quote>*>* -> Maior que</Quote>
<Quote>*<* -> Menor que</Quote>

#### Igual a
<Code exec>
  escreva(1 == 1) // verdadeiro
  escreva(1 == 2) // falso
</Code>

#### Diferente de
<Code exec>
  escreva(1 != 1) // falso
  escreva(1 != 2) // verdadeiro
</Code>

#### Maior ou igual que
<Code exec>
  escreva(1 >= 1) // verdadeiro
  escreva(2 >= 1) // verdadeiro
  escreva(2 >= 3) // falso
</Code>

#### Maior que
<Code exec>
  escreva(1 > 1) // falso
  escreva(2 > 1) // verdadeiro
  escreva(2 > 2) // falso
</Code>

#### Menor ou igual que
<Code exec>
  escreva(1 <= 1) // verdadeiro
  escreva(1 <= 2) // verdadeiro
  escreva(3 <= 2) // falso
</Code>

#### Menor que
<Code exec>
  escreva(1 < 1) // falso
  escreva(1 < 2) // verdadeiro
  escreva(2 < 2) // falso
</Code>

### Avaliação da verdade em variáveis que não armazenam valores do tipo lógico

<Text>Todos os tipos de dados, exceto nulos e falsos, possuem valor lógico verdadeiro:</Text>

<Code exec>
  {} // verdadeiro
  1 // verdadeiro
  verdadeiro // verdadeiro
  [] // verdadeiro

  1 == '1' // falso, porque pertencem a tipos diferentes (o primeiro é número, enquanto o segundo é texto)
  nulo // falso
  falso // falso
</Code>

### Operadores lógicos
<Text>
  São usados para combinar expressões, resultando em um valor lógico (*verdadeiro* ou *falso*).
</Text>

<Quote>
  *e* -> Retorna *verdadeiro* se ambos os valores são verdadeiros. Caso contrário, retorna *falso*.
</Quote>

<Quote>
  *ou* -> Retorna *verdadeiro* se um dos valores for verdadeiro. Caso contrário, retorna   *falso*.
</Quote>

<Code exec>
  escreva(verdadeiro e falso) // falso
  escreva(verdadeiro e verdadeiro) // verdadeiro
  escreva(falso e falso) // falso

  escreva(verdadeiro ou falso) // verdadeiro
  escreva(verdadeiro ou verdadeiro) // verdadeiro
  escreva(falso ou falso) // falso
</Code>

### Operador de pertencimento (em)

<Text>
  O operador `em` é usado para indicar se um valor está contindo em uma `lista` ou `texto`, restornando `verdadeiro` se sim e `falso` caso contrário
</Text>

<Code exec>
  escreva('item 2' em ['item 1', 'item 2', 'item 3']) // verdadeiro
  escreva('item 4' em ['item 1', 'item 2', 'item 3']) // falso
  escreva('b' 'abacate') // verdadeiro
</Code>

<Quote>
  Também pode ser utilizado para saber se uma chave está contida em um dicionário. Funciona somente para chaves.
</Quote>

<Code exec>
  escreva('chave 2' em { 'chave 1': 1, 'chave 2': 2, }) // verdadeiro
  escreva('chave 3' em { 'chave 1': 1, 'chave 2': 2, }) // falso
</Code>

<Alert>
  Veja a documentação sobre `dicionários` para saber mais sobre essa estrutura.
</Alert>

### Operador de tipo de dado (tipo de)

<Text>
  O operador `tipo de` é usado para saber qual é o tipo de um valor, retornando o nome do tipo como `texto` 
</Text>

<Code exec>
  escreva(tipo de 42) // número
  escreva(tipo de 'uma frase') // texto
  escreva(tipo de falso) // lógico
  escreva(tipo de { 'valor': 100 }) // dicionário
  escreva(tipo de ['item 1', 'item 2', 'item 3']) // vetor
</Code>

<Alert>
  O nome `vetor` é sinônimo para `lista`.
</Alert>

<Quote>
  O valor pode estar dentro uma variável. 
</Quote>

<Code exec>
  var respostaParaTudo = 42

  escreva(tipo de respostaParaTudo) // número 
</Code>

CAESbENnMVVaWGgwWDI0MGQzZGxabmQzR0FJaU9oSWxRQWFvQVFEU0FSMEtHek14TGlCTllXeGxMaUJPWlhjZ1dXOXlheXdnVGxrc0lGVlRRZm9EQVBJRkRSSUpDUUFBQUFBQUFQQS9HZ0RDQVFBPQ==