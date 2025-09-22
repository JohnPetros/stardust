export const DELEGUA_DOCUMENTACOES = [
  {
    nome: 'aleatorio',
    conteudo: `### Descrição 

Retorna um número aleatório entre 0 e 1.

### Exemplo de Código 
    var numeroAleatorio = aleatorio();    
    escreva(numeroAleatorio);    
    // 0.8540051495195808    

### Formas de uso  `,
    exemploCodigo: 'aleatorio()',
  },
  {
    nome: 'aleatorioEntre',
    conteudo: `### Descrição 

Retorna um número inteiro aleatório entre os valores passados para a função.

### Exemplo de Código 
    var numeroAleatorio = aleatorioEntre(1, 9);    
    escreva(numeroAleatorio); // Retornará um valor entre 1 e 8.    

### Formas de uso  `,
    exemploCodigo: 'aleatorioEntre(numero minimo, numero maximo)',
  },
  {
    nome: 'escreva',
    conteudo: `Escreve um ou mais argumentos na saída padrão da aplicação. 
## Interpolação 
Delégua suporta interpolação de variáveis: 

    var comidaFavorita = 'strogonoff'     
    escreva("Minha comida favorita é \${comidaFavorita}")     `,
    exemploCodigo: 'função escreva(...argumentos)',
  },
  {
    nome: 'filtrarPor',
    conteudo: `### Descrição 

Retorna uma lista de elementos filtrados de um vetor.

### Exemplo de Código 
    javascript var listaDeIdades = [91, 32, 15, 44, 12, 18, 101];     
    funcao checarIdade(idade) { retorna(idade >= 18); }    
    escreva(filtrarPor(listaDeIdades, checarIdade)); // [91, 32, 44, 18, 101]     

### Formas de uso  `,
    exemploCodigo: 'filtrarPor(meuVetor, minhaFuncaoParaValidar)',
  },
  {
    nome: 'inteiro',
    conteudo: `### Descrição 

Converte um número flutuante ou texto, que não apresente letras, em um número inteiro.

### Exemplo de Código 
    var testeTexto = "111";    
    escreva(111 + inteiro(testeTexto));    
    // 222    

### Formas de uso  `,
    exemploCodigo: 'inteiro("123")',
  },
  {
    nome: 'numero',
    assinaturas: [
      {
        formato: 'numero(valor: inteiro ou texto)',
        parametros: [
          {
            nome: 'valor',
            conteudo: 'O valor a ser convertido em número (real, ou com porção decimal).',
          },
        ],
      },
    ],
    conteudo: `### Descrição 

Converte um número inteiro, ou texto, que não apresente letras, em um número com porção decimal.

### Exemplo de Código

\`\`\`delegua
var testeTexto = "111.11";

escreva(111 + numero(testeTexto)); // 222.11
\`\`\`

### Formas de uso  `,
    exemploCodigo: 'função numero("123.45")',
  },
  {
    nome: 'número',
    assinaturas: [
      {
        formato: 'número(valor: inteiro ou texto)',
        parametros: [
          {
            nome: 'valor',
            conteudo: 'O valor a ser convertido em número (real, ou com porção decimal).',
          },
        ],
      },
    ],
    conteudo: `### Descrição 

Converte um número inteiro, ou texto, que não apresente letras, em um número com porção decimal.

### Exemplo de Código

\`\`\`delegua
var testeTexto = "111.11";

escreva(111 + número(testeTexto)); // 222.11
\`\`\`

### Formas de uso  `,
    exemploCodigo: 'função número("123.45")',
  },
  {
    nome: 'real',
    conteudo: `### Descrição 

Converte um número inteiro ou texto, que não apresente letras, em um número flutuante.

### Exemplo de Código 
    var testeTexto = "504.69";    
    escreva(0.01 + real(testeTexto));    
    // 504.7    

### Formas de uso  `,
    exemploCodigo: 'real(texto)',
  },
  {
    nome: 'texto',
    conteudo: `### Descrição 

Transforma números flutuantes ou inteiros em texto.

### Exemplo de Código 
    texto(7)    

### Formas de uso  `,
    exemploCodigo: 'texto(1234)',
  },
]
