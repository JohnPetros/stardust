;[
  {
    type: 'default',
    title: null,
    body: 'As condicionais permitem que o programa execute diferentes blocos de código, dependendo se uma determinada condição é verdadeira ou falsa',
  },
  {
    type: 'default',
    title: null,
    body: ' Existem duas principais formas de implementar condicionais: se-senao se/se-senao e escolha-caso.',
  },
  {
    type: 'list',
    title: 'Se Senao',
    body: 'Permite que o programa execute um bloco de código se uma determinada condição for verdadeira e outro bloco se ela for falsa',
  },
  {
    type: 'code',
    body: `se (verdadeiro) {
    escreva('sim');
}

// Resultado: sim`,
    isRunnable: false,
  },
  {
    type: 'default',
    title: null,
    body: 'Instruções senão se e senão são opcionais e devem ser anexadas a uma instrução se. Cada declaração é seguida por um bloco de escopo que é executado de acordo com a condição da declaração.',
  },
  {
    type: 'alert',
    body: 'O bloco de escopo de uma instrução se é executado se a condição for avaliada como verdadeira. Caso contrário, quaisquer instruções senão se anexadas serão avaliadas na ordem fornecida e, se qualquer uma dessas condições for avaliada como verdadeira, seus blocos de escopo serão executados.',
  },
  {
    type: 'default',
    title: null,
    body: 'Se a instrução se não for executada e nenhuma instrução senão se também não for, o bloco senão será executado, se fornecido.',
  },
  {
    type: 'code',
    body: `// Escreva "correspondente 2"
var a = 2;
se (a == 1) {
    escreva('correspondente 1');
} senao se (a == 2) {
    escreva('correspondente 2');
} senao {
    escreva('sem valor correspondente');
}
// Resultado: correspondente 2

var a = 3;
se (a == 1) {
    escreva('correspondente 1');
} senao se (a == 2) {
    escreva('correspondente 2');
} senao {
    escreva('Sem valor correspondente');
    
}

// Resultado: Sem valor correspondente`,
    isRunnable: false,
  },
  {
    type: 'list',
    title: 'Escolha Caso',
    body: 'E outra estrutura condicional que permite que o programa execute diferentes blocos de código dependendo do valor de uma variável.',
  },
  {
    type: 'alert',
    body: 'É uma maneira eficiente de encadear várias instruções se quando a comparação envolve uma variável e uma lista de valores possíveis.',
  },
  {
    type: 'default',
    title: null,
    body: 'A sintaxe requer um valor (que é comparado a cada caso), blocos de caso e um bloco padrao, que é opcional. No início da escolha, o valor é avaliado e comparado ao valor de cada expressão caso. Se os valores foram iguais, o bloco de escopo do caso em questão é executado.',
  },
  {
    type: 'default',
    title: null,
    body: 'Se nenhum caso for executado, o bloco de escopo padrao será executado, se fornecido.',
  },
  {
    type: 'code',
    body: `var diaDaSemana = "segunda-feira";

escolha (diaDaSemana) {
    caso "segunda-feira":
        escreva("Hoje é segunda-feira");
    caso "terça-feira":
        escreva("Hoje é terça-feira");
    caso "quarta-feira":
        escreva("Hoje é quarta-feira");
    caso "quinta-feira":
        escreva("Hoje é quinta-feira");
    caso "sexta-feira":
        escreva("Hoje é sexta-feira");
    caso "sábado":
        escreva("Hoje é sábado");
    caso "domingo":
        escreva("Hoje é domingo");
    padrao:
        escreva("Dia da semana inválido");
}
// Resultado: Hoje é segunda-feira`,
    isRunnable: false,
  },
  {
    type: 'default',
    title: null,
    body: 'Dois ou mais casos podem ter o mesmo bloco:',
  },
  {
    type: 'code',
    body: `var mesAtual = "fevereiro";
var diasNoMes;
        
escolha (mesAtual){
    caso "janeiro":
    caso "março":
    caso "maio":
    caso "julho":
    caso "agosto":
    caso "outubro":
    caso "dezembro":
        diasNoMes = 31;
    caso "abril":
    caso "junho":
    caso "setembro":
    caso "novembro":
        diasNoMes = 30;
    caso "fevereiro":
        diasNoMes = 28;
    padrao:
        diasNoMes = "Mês inválido"
}
escreva(diasNoMes);

// Resultado: 31`,
    isRunnable: false,
  },
  {
    type: 'default',
    title: null,
    body: 'Cada caso pode ter mais de uma instrução:',
  },
  {
    type: 'code',
    body: `var nivelPermissao = "admin";

escolha (nivelPermissao){
    caso "admin":
        escreva("Bem-vindo, administrador!");
        escreva("Você tem acesso total ao sistema.");
    caso "editor":
        escreva("Bem-vindo, editor!");
        escreva("Você pode apenas criar e editar conteúdo.");
    caso "convidado":
        escreva("Bem-vindo, convidado!");
        escreva("Você pode apenas visualizar o conteúdo.");
    padrao:
        escreva("Nível de permissão inválido!");
}

// Resultado: Bem-vindo, administrador! Você tem acesso total ao sistema.
`,
    isRunnable: false,
  },
]
