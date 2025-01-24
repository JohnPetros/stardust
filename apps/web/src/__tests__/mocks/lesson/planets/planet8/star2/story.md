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
<Text picture='panda-segurando-bambu-de-pe.jpg'>Aparentemente, o tubarão tinha sumido para buscar um tradutor para a princesa e, pelo visto, ele não é tão malvado assim.</Text>
---
<Image picture='princesa-smilling.jpg'>Peço perdão pelo meu tubarão de estimação, as vezes ele não jeito.</Image>
---
<Image picture='princesa-animada.jpg'>Não temos tempo a perder. Já já os salmonenses já estão perto de chegar ao meu mundo</Image>
---
<User>Salmonenses?</User>
---
<Image picture='princesa-lendo.jpg'>Sim. são aliens parecidos com macacos que amam comer bananas</Image>
---
<Image picture='princesa-lendo.jpg'>Ele percorrem pela galáxia a procura de bananas destruindos mundos no processo.</Image>
---
<Image picture='princesa-animada.jpg'>E agora eles agora estão atrás das minhas banana!</Image>
---
<User>O que você quer que a gente faça, princesa?</User>
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
<Alert picture='princesa-deslumbrada.png'>Como pode bem ver, não é apenas possível definir as chaves de um dicionário usando tipo `texto`, mas `número` também.</Alert>
---
<Text picture='panda-rindo-deitado.jpg'>Com tanta opção ruim, é melhor escolher mais tarde.</Text>
---
<Image picture='princesa-lendo.jpg'>Antes de partirem para a batalha, é melhor saberem como combater os salmonenses</Image>
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
<Text picture='panda-sorrindo.jpg'>Sim! O valor de um dicionário pode ser um tipo de dado mais complexo como listas ou ainda dicionários.</Text>
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
<Text picture='panda-sorrindo.jpg'>É claro que é possível utilizar tudo o que nós aprendemos sobre listas com um dicionário de listas</Text>
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
<Image picture='princesa-sorrindo.jpg'>O que vocês devem fazer é simples: substituir todas as bananas por tomates por que os salmonenses são alérgicos a tomates. Mas primeiro você saber a quantidades bananas que deverão ser substituidas.</Image>
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
<Text picture='panda-pensando.jpg'>Há várias formas de resolve esse problema. Primeiro, vamos pegar todos os valores desse dicionário.</Text>
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
<Quote picture='panda-piscando.jpg' title="Método chaves( )">O que acabei de fazer foi usar um método disponível para qualquer dicionário, `chaves()`, que justamente retorna todos os chaves de um dicionário dentro de uma `lista`.</Quote>
---
<Text picture='panda-segurando-bambu-de-pe.jpg'>Agora utilizando o básico de laços com listas que já aprendemos...</Text>
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
<Text picture='panda-olhando-computador.jpg'>Estou acessando cada lista de bananas pelo nome da reserva e transformando cada banana dessa lista em um tomate utilizando o método `mapear()`. No fim do laço, eu altero o valor da reserva atual passando a lista de tomates gerada no lugar da lista de bananas.</Text>
---
<Image picture='princesa-deslumbrada.png'>Muito bem!! Logicamente nós temos uma quantidade de tomates limitada, por isso mandei meu tubarão trazer todas minhas de reservas de tomate</Image>
---
<Image picture='princesa-flutuando.jpg'>Muito bem!! Logicamente nós temos uma quantidade de tomates limitada, por isso mandei meu tubarão trazer todas minhas de reservas de tomate</Image>
---
<Code>
  var reservasDeTomates = {
    "reserva de tomates 1": {
        "tomates": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona A",
    },
    "reserva de tomates 2": {
        "tomates": ["tomate", "tomate"],
        "quantidade": 2,
        "localizacao": "Zona B",
    },
    "reserva de tomates 3": {
        "tomates": ["tomate", "tomate", "tomate"],
        "quantidade": 3,
        "localizacao": "Zona C",
    }
  }
</Code>
---
<User>Wow!! Um dicionário de dicionários.</User>
---
<Image picture='princesa-lendo.jpg'>Sua tarefa é criar uma lista única contendo todos o tomates que eu tenho em reserva.</Image>
---
<Text picture='panda-piscando-sentado.jpg'>Não priemos cânico! E sim, é possível criar um dicionário de dicionários, como no exemplo a seguir</Text>
---
<Code>
  var biblioteca = {
    "Livro A": {"autor": "Autor 1", "ano": 1990, "genero": "Ficção"},
    "Livro B": {"autor": "Autor 2", "ano": 2005, "genero": "História"},
    "Livro C": {"autor": "Autor 3", "ano": 2020, "genero": "Tecnologia"}
  }
</Code>
---
<Quote picture='panda-segurando-bambu-de-pe.jpg'>Para acessar o valor de um dicionário interno é preciso passar entre colchetes `[]` o valor da chave desse dicionario após a chave do dicionário maior.</Quote>
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
<Text picture='panda-sorrindo.jpg'>Claro, se houvesse um dicionário dentro do dicionário que está dentro do outro dicionário você repetiria o processo com os colchetes `["Chave 1"]["Chave 2"]["Chave 3"]` e assim vai.</Text>
---
<Quote picture='panda-segurando-bambu-de-pe.jpg' title='Método valores( )'>Para desafio proposto pela princesa pode utilizar o método `valores()`.</Quote>
---
<User>Deixa eu adivinhar, ele retorna todos os valores do dicionário.</User>
---
<Text picture='panda-olhando-de-lado.jpg'>Isso mesmo, mas somente do dicionário mais externo nesse caso.</Text>
---
<Code exec>
   var reservasDeTomates = {
    "reserva de tomates 1": {
        "tomates": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona A",
    },
    "reserva de tomates 2": {
        "tomates": ["tomate", "tomate"],
        "quantidade": 2,
        "localizacao": "Zona B",
    },
    "reserva de tomates 3": {
        "tomates": ["tomate", "tomate", "tomate"],
        "quantidade": 3,
        "localizacao": "Zona C",
    }
  }

  var reservas = reservasDeTomates.valores()
  escreva(reservas)
</Code>
---
<Text picture='panda-deslumbrado.jpg'>Perceba que temos uma lista de dicionários agora.</Text>
---
<Text picture='panda-olhando-de-lado.jpg'>Podemos utilizar um laço `para cada` para criar uma nova lista de tomates.</Text>
---
<Code exec>
  var reservasDeTomates = {
    "reserva de tomates 1": {
        "tomates": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona A",
    },
    "reserva de tomates 2": {
        "tomates": ["tomate", "tomate"],
        "quantidade": 2,
        "localizacao": "Zona B",
    },
    "reserva de tomates 3": {
        "tomates": ["tomate", "tomate", "tomate"],
        "quantidade": 3,
        "localizacao": "Zona C",
    }
  }

  var reservas = reservasDeTomates.valores()
  var todosTomates = []

  para cada reserva de reservas {
    todosTomates.adiciona(reservas["tomates"])
  }

  escreva(todosTomates)
</Code>
---
<Image picture='princesa-chocada.jpg'>Quero uma lista simples e não uma lista de listas.</Image>
---
<Text picture='panda-sorrindo.jpg'>Ok, criemos mais um laço `para cada` então</Text>
---
<Code exec>
  var reservasDeTomates = {
    "reserva de tomates 1": {
        "tomates": ["tomate", "tomate", "tomate", "tomate"],
        "quantidade": 4,
        "localizacao": "Zona A",
    },
    "reserva de tomates 2": {
        "tomates": ["tomate", "tomate"],
        "quantidade": 2,
        "localizacao": "Zona B",
    },
    "reserva de tomates 3": {
        "tomates": ["tomate", "tomate", "tomate"],
        "quantidade": 3,
        "localizacao": "Zona C",
    }
  }

  var reservas = reservasDeTomates.valores()
  var todosTomates = []

  para cada reserva de reservas {
    para cada tomate de reserva["tomates"] {
      todosTomates.adiciona(tomate)
    }
  }

  escreva(todosTomates)
</Code>
---
<Image picture='princesa-deslumbrada.png'>Eba!! Agora temos um monte de tomates. Estamos prontos para guerrear, vamos lá</Image>
---
<Image picture='princesa-pulando.jpg'>Estamos prontos para guerrear, vamos lá!</Image>
---
<Text picture='panda-espantado.jpg'>Mas já?</Text>