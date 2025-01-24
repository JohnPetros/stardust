<Image picture='tubarao.jpg'>Haha! Eu voltei</Image>
---
<Text picture='panda-espantado.jpg'>O tubarãooo!</Text>
---
<Image picture='princesa-vomitando.jpg'>Acalme-se Sharkorno.</Image>
---
<Image picture='tubarao-acenando.jpg'>Sim, princesa!</Image>
---
<User>A princesa está falando a nossa língua.</User>
---
<Text picture='panda-espantado.jpg'>Aparentemente, o tubarão tinha sumido para buscar um tradutor para a princesa e, pelo visto, ele não é tão malvado assim.</Text>
---
<Text picture='panda-espantado.jpg'>Aparentemente, o tubarão tinha ido embora para buscar um tradutor e, pelo visto, ele não é tão malvado assim.</Text>
---
<Image picture='princesa-vomitando.jpg'>Peço perdão pelo meu tubarão de estimação, as vezes ele não jeito.</Image>
---
<Image picture='princesa-vomitando.jpg'>Não temos tempo a perder. Já já os salmonenses já estão perto de chegar ao meu mundo</Image>
---
<User>Salmonenses?</User>
---
<Image picture='princesa-vomitando.jpg'>Sim. são aliens parecidos com macacos que amam comer bananas</Image>
---
<Image picture='princesa-vomitando.jpg'>Ele percorrem pela galáxia a procura de bananas destruindos mundos no processo.</Image>
---
<Image picture='princesa-vomitando.jpg'>E agora eles agora estão atrás das minhas banana!</Image>
---
<User>O que você quer que a gente faça princesa?</User>
---
<Image picture='princesa-vomitando.jpg'>Por favor, sejam os guerreiros das minhas bananas e em troca poderão escolher uma das recompensas:</Image>
---
<Code>
  var dicionarioQualquer = {
    0: "ganhar 1 milhão de yaggs",
    1: "poder cuidar do meu tubarão para o resto da vida",
    2: "voltar para sua casa",
    3: "poder voar comigo no céu por 3 dias seguidos",
  }
</Code>
---
<Alert picture='princesa-vomitando.jpg'>Como pode bem ver, não é apenas possível definir as chaves de um dicionário usando tipo `texto`, mas `número` também.</Alert>
---
<Text picture='princesa-vomitando.jpg'>Com tanta opção ruim, é melhor escolher mais tarde.</Text>
---
<Image picture='princesa-vomitando.jpg'>Antes de partirem para a batalha, é melhor saberem como combater os salmonenses</Image>
---
<Code>
  var reservasDeBananas = {
    "reserva de bananas 1": ["banana", "banana", "banana", "banana"],
    "reserva de bananas 2 ": ["banana", "banana"],
    "reserva de bananas 3 ": ["banana", "banana", "banana"],
  }
</Code>
---
<User>Um dicionário contendo listas?</User>
---
<Text picture='princesa-vomitando.jpg'>Sim! O valor de um dicionário pode ser um tipo de dado mais complexo como listas ou ainda dicionários.</Text>
---
<Code exec>
  var notasDeAlunos = {
    "Alice": [9.0, 8.5, 7.5],
    "Bruno": [6.0, 7.0, 8.0],
    "Clara": [10.0, 9.5, 9.0]
  }

  escreva(notasDeAlunos)
</Code>
---
<Text picture='princesa-vomitando.jpg'>É claro que é possível utilizar tudo o que nós aprendemos sobre listas com um dicionário de listas</Text>
---
<Code exec>
  var notasDeAlunos = {
    "Alice": [9.0, 8.5, 7.5],
    "Bruno": [6.0, 7.0, 8.0],
    "Clara": [10.0, 9.5, 9.0]
  }

  var primeiraNotaDeBruno = notasDeAlunos["Bruno"][0]
  escreva(primeiraNotaDeBruno) // 6
  
  var ultimasNotasDeClara = notasDeAlunos["Clara"].fatiar(1)
  escreva(ultimasNotasDeClara) // [9.5, 9]
  
  var notasDaAliceEmDobro = notasDeAlunos["Alice"].mapear(funcao(nota) { 
    retorna nota
  })
  escreva(notasDaAliceEmDobro) // [18, 17, 15]
</Code>
---
<Image picture='princesa-vomitando.jpg'>O que vocês devem fazer é simples: substituir todas as bananas por tomates por que os salmonenses são alérgicos a tomates. Mas primeiro você saber a quantidades bananas que deverão ser substituidas.</Image>
---
<Code>
  var reservasDeBananas = {
    "reserva de bananas 1": ["banana", "banana", "banana", "banana"],
    "reserva de bananas 2 ": ["banana", "banana"],
    "reserva de bananas 3 ": ["banana", "banana", "banana"],
  }

  var totalDeBananas

  // Qual é a quantidade total de bananas?
</Code>
---
<Text picture='princesa-vomitando.jpg'>Há várias formas de resolve esse problema. Primeiro, vamos pegar todos os valores desse dicionário.</Text>
---
<Code exec>
  var reservasDeBananas = {
    "reserva de bananas 1": ["banana", "banana", "banana", "banana"],
    "reserva de bananas 2 ": ["banana", "banana"],
    "reserva de bananas 3 ": ["banana", "banana", "banana"],
  }

  var reservasDeBanana = reservasDeBananas.chaves()

  escreva(reservasDeBanana) // ["reserva de bananas 1", "reserva de bananas 2", "reserva de bananas 3"]
</Code>
---
<Quote picture='princesa-vomitando.jpg' title="Método chaves( )">O que acabei de fazer foi usar um método disponível para qualquer dicionário, `chaves()`, que justamente retorna todos os chaves de um dicionário dentro de uma `lista`.</Quote>
---
<Text picture='princesa-vomitando.jpg'>Agora utilizando o básico de laços com listas que já aprendemos...</Text>
---
<Code exec>
  var reservasDeBananas = {
    "reserva de bananas 1": ["banana", "banana", "banana", "banana"],
    "reserva de bananas 2 ": ["banana", "banana"],
    "reserva de bananas 3 ": ["banana", "banana", "banana"],
  }
  var nomesDeReservas = reservasDeBananas.chaves()

   para cada nomeDeReserva de nomesDeReservas {
    var tomates = reservasDeBananas[nomeDeReserva].mapear(funcao() {
      retorna "tomate"
    })
    reservasDeBananas[nomeDeReserva] = tomates
  }

  escreva(reservasDeBananas)
</Code>
---
<Text picture='princesa-vomitando.jpg'>Estou acessando cada lista de bananas pelo nome da reserva e transformando cada banana dessa lista em um tomate utilizando o método `mapear()`. No fim do laço, eu altero o valor da reserva atual passando a lista de tomates gerada no lugar da lista de bananas.</Text>
---
<Image picture='princesa-vomitando.jpg'>Muito bem!! Logicamente nós temos uma quantidade de tomates limitada, por isso mandei meu tubarão trazer uma lista de cofres contendo algumas coisas.</Image>
---
<Code>
  var cofres = [
    {
      "cofre de beterrabas": {
        "beterrabas": ["beterraba", "beterraba", "beterraba"],
        "quantidade": 3,
        "localizacao": "Zona A",
      },
    },
    {
      "cofre de tomates": {
        "tomate": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona B",
      },
    },
    {
      "cofre de batatas": {
        "batatas": ["batata", "batata"],
        "quantidade": 2,
        "localizacao": "Zona C",
      },
    },
  ]
</Code>
---
<User>Wow!! Uma lista contendo dicionários de dicionários</User>
---
<Text picture='princesa-vomitando.jpg'>Não priemos cânico! E sim é possível sim criar um dicionário de dicionários, como no exemplo a seguir</Text>
---
<Code>
  var biblioteca = {
    "Livro A": {"autor": "Autor 1", "ano": 1990, "genero": "Ficção"},
    "Livro B": {"autor": "Autor 2", "ano": 2005, "genero": "História"},
    "Livro C": {"autor": "Autor 3", "ano": 2020, "genero": "Tecnologia"}
  }
</Code>
---
<Quote picture='princesa-vomitando.jpg'>Para acessar o valor de um dicionário interno é preciso passar entre colchetes `[]` o valor da chave desse dicionario após a chave do dicionário maior.</Quote>
---
<Code exec>
  var biblioteca = {
    "Livro A": {"autor": "Autor 1", "ano": 1990, "genero": "Ficção"},
    "Livro B": {"autor": "Autor 2", "ano": 2005, "genero": "História"},
    "Livro C": {"autor": "Autor 3", "ano": 2020, "genero": "Tecnologia"}
  }

  escreva(biblioteca["Livro B"]["genero"]) // História
</Code>
---
<Quote picture='princesa-vomitando.jpg'>Claro, se houvesse um dicionário dentro do dicionário que está dentro do outro dicionário você repetiria o processo com os colchetes `["Chave 1"]["Chave 2"]["Chave 3"]` e assim vai.</Quote>
---
<Text picture='princesa-vomitando.jpg' title='Método valores( )'>Como temos uma lista primeiro, criemos um laço.</Text>
---
<Code>
  var cofres = [
    {
      "cofre de beterrabas": {
        "beterrabas": ["beterraba", "beterraba", "beterraba"],
        "quantidade": 3,
        "localizacao": "Zona A",
      },
    },
    {
      "cofre de tomates": {
        "tomate": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona B",
      },
    },
    {
      "cofre de batatas": {
        "batatas": ["batata", "batata"],
        "quantidade": 2,
        "localizacao": "Zona C",
      },
    },
  ]

  para cofre em cofres {

  }
</Code>
---
<Text picture='princesa-vomitando.jpg'>Agora, precisamos descobrir qual é o cofre de tomates. Podemos descobrir isso pelo nome do cofre utilizando o operador `em`.</Text>
---
<Quote picture='princesa-vomitando.jpg' title="operadore em">Ele retorna `verdadeiro` caso um determinado valor em `texto` seja igual a uma das chaves do dicionário, retorando `falso` caso contrário, claro.</Quote>
---
<Code exec>
  var zoologico = {
    "leão": {"habitat": "savanas", "dieta": "carnívoro"},
    "elefante": {"habitat": "florestas", "dieta": "herbívoro"},
    "pinguim": {"habitat": "regiões polares", "dieta": "carnívoro"}
  }

  escreva("elefante" em zoologico) // verdadeiro
  escreva("urso" em zoologico) // falso
</Code>
---
<Text picture='princesa-vomitando.jpg'>Vamos aplicar isso no nosso problema.</Text>
---
<Code>
  var cofres = [
    {
      "cofre de beterrabas": {
        "beterrabas": ["beterraba", "beterraba", "beterraba"],
        "quantidade": 3,
        "localizacao": "Zona A",
      },
    },
    {
      "cofre de tomates": {
        "tomates": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona B",
      },
    },
    {
      "cofre de batatas": {
        "batatas": ["batata", "batata"],
        "quantidade": 2,
        "localizacao": "Zona C",
      },
    },
  ]

  para cada cofre em cofres {
    se ("cofre de tomates" em cofre) {
      
    }
  }
</Code>