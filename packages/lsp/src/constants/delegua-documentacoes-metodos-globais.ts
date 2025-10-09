export const DELEGUA_DOCUMENTACOES_METODOS_GLOBAIS = [
  {
    word: 'aleatorio',
    content: `### Descrição 

Retorna um número aleatório entre 0 e 1.

### Exemplo de Código 
    var numeroAleatorio = aleatorio();    
    escreva(numeroAleatorio);    
    // 0.8540051495195808    

### Formas de uso  `,
    example: 'aleatorio()',
  },
  {
    word: 'aleatorioEntre',
    content: `### Descrição 

Retorna um número inteiro aleatório entre os valores passados para a função.

### Exemplo de Código 
    var numeroAleatorio = aleatorioEntre(1, 9);    
    escreva(numeroAleatorio); // Retornará um valor entre 1 e 8.    

### Formas de uso  `,
    example: 'aleatorioEntre(numeroMinimo, numeroMaximo)',
  },
  {
    word: 'algum',
    content: `### Descrição 

Verifica se algum dos elementos do vetor satisfaz à condição passada por parâmetro.

### Exemplo de Código 
    var idades = [15, 18, 25, 30]    
    var funcaoMaiorIdade = funcao (idade) { retorna idade >= 18 }    
    escreva(algum(idades, funcaoMaiorIdade)) // verdadeiro    

### Formas de uso  `,
    example: 'algum(vetor, funcaoCondicao)',
  },
  {
    word: 'encontrar',
    content: `### Descrição 

Encontra o primeiro elemento de uma lista cuja função de pesquisa retorne verdadeiro.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(encontrar(numeros, funcaoPar)) // 2    

### Formas de uso  `,
    example: 'encontrar(vetor, funcaoPesquisa)',
  },
  {
    word: 'encontrarIndice',
    content: `### Descrição 

Encontra o índice do primeiro elemento de uma lista cuja função de pesquisa retorne verdadeiro.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(encontrarIndice(numeros, funcaoPar)) // 1    

### Formas de uso  `,
    example: 'encontrarIndice(vetor, funcaoPesquisa)',
  },
  {
    word: 'encontrarUltimo',
    content: `### Descrição 

Encontra o último elemento de uma lista cuja função de pesquisa retorne verdadeiro.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(encontrarUltimo(numeros, funcaoPar)) // 4    

### Formas de uso  `,
    example: 'encontrarUltimo(vetor, funcaoPesquisa)',
  },
  {
    word: 'encontrarUltimoIndice',
    content: `### Descrição 

Encontra o índice do último elemento de uma lista cuja função de pesquisa retorne verdadeiro.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(encontrarUltimoIndice(numeros, funcaoPar)) // 3    

### Formas de uso  `,
    example: 'encontrarUltimoIndice(vetor, funcaoPesquisa)',
  },
  {
    word: 'escreva',
    content: `### Descrição 

Escreve um ou mais argumentos na saída padrão da aplicação.

### Exemplo de Código 
    escreva("Olá mundo!")    
    escreva("Número:", 42)    

### Interpolação 
Delégua suporta interpolação de variáveis: 

    var comidaFavorita = 'strogonoff'     
    escreva("Minha comida favorita é \${comidaFavorita}")     

### Formas de uso  `,
    example: 'escreva(...argumentos)',
  },
  {
    word: 'filtrarPor',
    content: `### Descrição 

Retorna uma lista de elementos filtrados de uma lista.

### Exemplo de Código 
    var listaDeIdades = [91, 32, 15, 44, 12, 18, 101];     
    var funcaoChecarIdade = funcao (idade) { retorna idade >= 18 }    
    escreva(filtrarPor(listaDeIdades, funcaoChecarIdade)); // [91, 32, 44, 18, 101]     

### Formas de uso  `,
    example: 'filtrarPor(meuVetor, minhaFuncaoParaValidar)',
  },
  {
    word: 'incluido',
    content: `### Descrição 

Verifica se um valor está incluído em uma lista.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    escreva(incluido(numeros, 3)) // verdadeiro    
    escreva(incluido(numeros, 6)) // falso    

### Formas de uso  `,
    example: 'incluido(vetor, valor)',
  },
  {
    word: 'inteiro',
    content: `### Descrição 

Converte um número flutuante ou texto, que não apresente letras, em um número inteiro.

### Exemplo de Código 
    var testeTexto = "111";    
    escreva(111 + inteiro(testeTexto));    
    // 222    

### Formas de uso  `,
    example: 'inteiro("123")',
  },
  {
    word: 'mapear',
    content: `### Descrição 

Dado uma lista e uma função de mapeamento, executa a função de mapeamento passando como argumento cada elemento do vetor.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoDobro = funcao (n) { retorna n * 2 }    
    escreva(mapear(numeros, funcaoDobro)) // [2, 4, 6, 8, 10]    

### Formas de uso  `,
    example: 'mapear(vetor, funcaoMapeamento)',
  },
  {
    word: 'numero',
    content: `### Descrição 

Converte um número inteiro, ou texto, que não apresente letras, em um número com porção decimal.

### Exemplo de Código 
    var testeTexto = "111.11";    
    escreva(111 + numero(testeTexto)); // 222.11    

### Formas de uso  `,
    example: 'numero("123.45")',
  },
  {
    word: 'número',
    content: `### Descrição 

Converte um número inteiro, ou texto, que não apresente letras, em um número com porção decimal.

### Exemplo de Código 
    var testeTexto = "111.11";    
    escreva(111 + número(testeTexto)); // 222.11    

### Formas de uso  `,
    example: 'número("123.45")',
  },
  {
    word: 'ordenar',
    content: `### Descrição 

Ordena os elementos de uma lista em ordem crescente.

### Exemplo de Código 
    var numeros = [3, 1, 4, 1, 5]    
    escreva(ordenar(numeros)) // [1, 1, 3, 4, 5]    

### Formas de uso  `,
    example: 'ordenar(vetor)',
  },
  {
    word: 'paraCada',
    content: `### Descrição 

Executa uma função para cada elemento de uma lista.

### Exemplo de Código 
    var numeros = [1, 2, 3]    
    var funcaoImprimir = funcao (n) { escreva("Número:", n) }    
    paraCada(numeros, funcaoImprimir)    

### Formas de uso  `,
    example: 'paraCada(vetor, funcaoExecucao)',
  },
  {
    word: 'primeiroEmCondicao',
    content: `### Descrição 

Retorna o primeiro elemento de uma lista que satisfaz uma condição.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(primeiroEmCondicao(numeros, funcaoPar)) // 2    

### Formas de uso  `,
    example: 'primeiroEmCondicao(vetor, funcaoCondicao)',
  },
  {
    word: 'real',
    content: `### Descrição 

Converte um número inteiro ou texto, que não apresente letras, em um número flutuante.

### Exemplo de Código 
    var testeTexto = "504.69";    
    escreva(0.01 + real(testeTexto));    
    // 504.7    

### Formas de uso  `,
    example: 'real(texto)',
  },
  {
    word: 'reduzir',
    content: `### Descrição 

Reduz uma lista a um único valor usando uma função de redução.

### Exemplo de Código 
    var numeros = [1, 2, 3, 4, 5]    
    var funcaoSoma = funcao (acumulador, elemento) { retorna acumulador + elemento }    
    escreva(reduzir(numeros, funcaoSoma, 0)) // 15    

### Formas de uso  `,
    example: 'reduzir(vetor, funcaoReducao, valorInicial)',
  },
  {
    word: 'tamanho',
    content: `### Descrição 

Retorna o tamanho de uma lista, texto ou função.

### Exemplo de Código 
    var vetor = [1, 2, 3, 4, 5]    
    escreva(tamanho(vetor)) // 5    
    escreva(tamanho("olá")) // 3    

### Formas de uso  `,
    example: 'tamanho(objeto)',
  },
  {
    word: 'texto',
    content: `### Descrição 

Transforma qualquer valor em texto.

### Exemplo de Código 
    escreva(texto(7)) // "7"    
    escreva(texto(3.14)) // "3.14"    

### Formas de uso  `,
    example: 'texto(valor)',
  },
  {
    word: 'todosEmCondicao',
    content: `### Descrição 

Verifica se todos os elementos de uma lista satisfazem uma condição.

### Exemplo de Código 
    var numeros = [2, 4, 6, 8]    
    var funcaoPar = funcao (n) { retorna n % 2 == 0 }    
    escreva(todosEmCondicao(numeros, funcaoPar)) // verdadeiro    

### Formas de uso  `,
    example: 'todosEmCondicao(vetor, funcaoCondicao)',
  },
  {
    word: 'tupla',
    content: `### Descrição 

Transforma uma lista de elementos em uma tupla de N elementos (2 a 10 elementos).

### Exemplo de Código 
    var vetor = [1, 2, 3]    
    var minhaTupla = tupla(vetor)    
    escreva(minhaTupla) // (1, 2, 3)    

### Formas de uso  `,
    example: 'tupla(vetor)',
  },
]
