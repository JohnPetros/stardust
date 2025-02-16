## Objetos e Classes

<Text>São estruturas intimamente ligadas entre si, sendo que objetos são estruturas de chave e valor que são criados a partir de estruturas chamada de classes.</Text>

### Classes

<Text>Para criar uma class é preciso escrever a palavra-chave `classe` e o nome da classe</Text>

<Code>
  classe MinhaClasse {

  }
</Code>

#### Regras de nomenclatura de classes

<Alert>Prefira nomear suas classes no estilo `camelo de cabeça erguida`. Isso significa que o nome da suas classes deve começar sempre com letra maiúscula, assim como as palavras que compõe esse nome</Alert>

<Code>
  classe Professor { // ✅

  }

  classe VendedorDeChurros { // ✅

  }

  classe MaquinaDeLavarRoupasAzuis { // ✅

  }

  classe camiseta { // ❌

  }
</Code>

#### Propriedades

<Text>Propriedades são variáveis dentro uma classe. Toda propriedade usada por uma classe precisa ser declarada com algum tipo.</Text>

<Code>
  classe Carteira {
    total: numero
    codigo: texto
  }
</Code>

<Alert>Veja a documentação para saber mais sobre os tipos de dados.</Alert>

#### Métodos

<Text>Métodos são funções de uma classe. Diferentemente de funções, são criados sem a palavra-chave de função.</Text>

<Code>
  classe Pessoa {
    digaOla() {
      escreva('Olá')
    }

    olheAlgo(algo) {
      escreva('Eu estou olhando para', algo)
    }
  }
</Code>

### Objetos

<Text>O objetivo de uma classe é criar objetos a partir dela, criando uma variável fora da classe e atribuindo a ela a chamada de uma classe utilizando parênteses de forma parecida com uma função</Text>

<Code>
  classe Pessoa {
    digaOla() {
      escreva('Olá')
    }

    olheAlgo(algo) {
      escreva('Eu estou olhando para', algo)
    }
  }

  var pessoa = Pessoa()
</Code>

Agora é possível utilizar os métodos e propriedas da classe escrevendo após o ponto `.` o nome do método ou propriedade.

<Code exec>
  classe Pessoa {
    digaOla() {
      escreva('Olá')
    }

    olheAlgo(algo) {
      escreva('Eu estou olhando para', algo)
    }
  }

  var pessoa = Pessoa()
  pessoa.digaOla()
  pessoa.olheAlgo('minha casa')

  /* Resultado:
    Olá
    Eu estou olhando para minha casa
  */ 
</Code>

<Text>Objetos também são chamados de instâncias. *Logo*, no exemplo acima `pessoa` é uma instância da class `Pessoa` O processo de criar um objeto como mostrado acima chama-se *instanciar*.</Text>

### Construtor de classes

<Text>Construtor é um método-padrão que é automaticamente chamado sempre que a classe está sendo instanciada. Esse método tem a palavra-chave `construtor` seguida de parênteses.</Text>

<Code exec>
  classe Pessoa {
    construtor() {
      escreva('Nova instância gerada')
    }
  }

  var pessoa = Pessoa()

  // Resultado: Nova instância gerada
</Code>

<Quote>Dessa forma é possível definir os valores das propriedades no momento da criação do objeto, passando esses valores para como argumentos para o construtor da classe.</Quote>

<Code exec>
  classe Pessoa {
    nome: texto
    idade: numero

    construtor(nome, idade) {
      isto.nome = nome
      isto.idade = idade
    }
  }

  var pessoa = Pessoa('Ítalo', 18)
  escreva(pessoa.nome, pessoa.idade)

  // Resultado: Ítalo 18
</Code>

### Isto

<Text>A palavra-chave `isto` como mostrado acima permite o acesso das propriedades e métodos internamente na classe</Text>

<Code exec>
  classe Carteira {
    saldo: numero

    construtor() {
      isto.saldo = -100
    }

    sacar() {
      var temDinheiro = isto.temDinheiro()

      se (temDinheiro) {
        retorna isto.dinheiro
      } senao {
        escreva('sem dinheiro 😢')
      }
    }

    temDinheiro() {
      retorna isto.dinheiro > 0
    }
  }

  var carteira = Carteira()
  carteira.sacar()
  // Resultado: sem dinheiro 😢
</Code>

<Quote>Uma propriedade de uma classe pode ser redefinida a qualquer momento no programa.</Quote>

<Code exec>
  classe Carteira {
    saldo: numero

    construtor() {
      isto.saldo = -100
    }

    depositar(dinheiro) {
      isto.saldo = isto.saldo + dinheiro
    }
  }

  var carteira = Carteira()
  carteira.depositar(200)
  escreva(carteira.saldo) // 100
</Code>

### Herança de classes

<Text>Classes podem ter os propriedades e as funções de outra classe sem necessidade de repetição de código utilizando a palavra-chave `herda`</Text>

<Code exec>
  classe Funcionario {
    nome: texto
    salario: numero

    construtor(nome, salario) {
      isto.nome = nome
      isto.salario = salario
    }
  }

  classe Vendedor herda Funcionario {
    
  }

  classe Gerente herda Funcionario {
    
  }

  var vendedor = Vendedor('Fernando', 1500)
  var gerente = Gerente('Rosana', 4500)
  escreva(vendedor.nome, vendedor.salario) // 'Fernando' 1500
  escreva(gerente.nome, gerente.salario) // 'Rosana' 4500
</Code>

<Quote>Uma classe filha pode ter seus próprios métodos e propriedades</Quote>

<Code exec>
  classe Funcionario {
    nome: texto
    salario: numero

    construtor(nome, salario) {
      isto.nome = nome
      isto.salario = salario
    }
  }

  classe Vendedor herda Funcionario {
    recebeCliente() {
      escreva('Olá, meu nome é', isto.nome, 'como posso lhe ajudar?')
    }
  }

  classe Gerente herda Funcionario {
    projetos: vetor

    adicionaProjeto(projeto) {
      se (isto.projetos == nulo) {
        isto.projetos = []
      }
      isto.projetos.adicionar(projeto)
    }    
  }

  var vendedor = Vendedor('Fernando', 1500)
  var gerente = Gerente('Rosana', 4500)

  escreva(vendedor.recebeCliente())

  gerente.adicionaProjeto('Delégua')
  escreva(gerente.projetos)
</Code>

#### Sobrecarga de métodos de classes

<Text>É possível sobrescrever um método da classe mãe na classe filha.</Text>

<Code>
classe Ave {
  voa() {
    escreva('voando..')
  }
}

class Aguia herda Ave {

}

classe Pinguim herda Ave {
  voa() {
    escreva('Não sei voar 😢')
  }
}

var penguim = Pinguim('Fernando')
penguim.voa()

Resultado // 'Não sei voar 😢'
</Code>

#### função super()

<Text>Para adicionar e definir novas propriedades a classe filha, porém mantendo as propriedades da class mãe utilize a função `super()` dentro da classe filha</Text>

<Code>
classe FiguraGeometrica {
  lados: numero

  construtor(lados) {
    isto.lados = lados
  }
}

classe Circulo herda FiguraGeometrica {
  raio: numero

  construtor(lados, numero) {
    super(lados)
    isto.raio = numero
  }
}

var circulo = Circulo(1, 12)

escreva(circulo.lados) // 1
escreva(circulo.raio) // 12
</Code>