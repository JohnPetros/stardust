<Text picture='foquete-comemorando.jpg'>Muito bem!</Text>
---
<Text picture='foquete-comemorando.jpg'>Achamos a princesa e parece que ela está são e salva.</Text>
---
<Text picture='foquete-confuso.jpg'>Parece também que aquele tubarão foi embora...</Text>
---
<Image picture='princesa-sorrindo.jpg'>+>>+ +>+++!</Image>
---
<User>Mas o que ela disse?</User>
---
<Image picture='princesa-sorrindo.jpg'>+>>+ +>+++ +++>+ ++ +>+>+</Image>
---
<User>What?</User>
---
<Text picture='foquete-triste.jpg'>A princesa fala um idioma completamente desconhecido até mesmo para o nosso tradutor</Text>
---
<User>E agora?</User>
---
<Text picture='panda-sorrindo-sentado.jpg'>Não se preocupe, acabo de achar um dicionário por perto</Text>
---
<Code>
  var dicionario = {
     "+>+++": "obrigada",
  }
</Code>
---
<Quote picture='foquete-sorrindo.jpg'>Essa é a estrutura que chamamos de `dicionário` em progrogramacão</Quote>
---
<Quote picture='panda-oferecendo-bambu.jpg'>Ela parece complicada de início, então vamos com calma.</Quote>
---
<Text picture='panda-de-oculos.jpg'>Primeiro, um dicionário nada mais é que um conjunto de chaves e valores. Sempre separados por dois pontos `:` colocados entre chaves `{}`</Text>
---
<Code>
  var dicionarioQualquer = {
    "primeira chave": "valor 1",
    "segunda chave": "valor 2",
    "terceira chave": "valor 3",
  }
</Code>
---
<Alert picture='panda-de-oculos.jpg'>Importante dizer: os conjunto de chave e valor do dicionário são sempre separados por vírgula.</Alert>
---
<Text picture='panda-olhando-computador.jpg'>Por exemplo, pense em uma lista telefônica:</Text>
---
<Code>
  var listaTelefonica = {
    "Leonel Sanches": "7777-7777",
    "Ítalo Brandão": "1111-1111",
    "Samuel Gonçalves": "5555-5555",
  }
</Code>
---
<Text picture='panda-de-oculos.jpg'>Nessa estrutura em vez de procurar diretamente pelo número da pessoa, eu posso procurar pelo nome dela.</Text>
---
<Text picture='foquete-sorrindo.jpg' title='Acessando valores de um dicionário'>E para acessar o valor contido em dicionário preciso colocar sua chave entre colchetes após o nome da variável que contém o dicionário</Text>
---
<Code exec>
   var listaTelefonica = {
    "Leonel Sanches": "7777-7777",
    "Ítalo Brandão": "1111-1111",
    "Samuel Gonçalves": "5555-5555",
  }

  var telefone = listaTelefonica['Ítalo Brandão']
  escreva(telefone) // 1111-1111
</Code>
---
<User>Mas e se o nome da pessoa não estivesse no dicionário?</User>
---
<Text picture='panda-sorrindo.jpg'>Seria retornado `nulo`, veja só:</Text>
---
<Code exec>
   var listaTelefonica = {
    "Leonel Sanches": "7777-7777",
    "Ítalo Brandão": "1111-1111",
    "Samuel Gonçalves": "5555-5555",
  }

  var telefone = listaTelefonica["Aristides da Costa"]
  escreva(telefone) // nulo
</Code>
---
<Text picture='panda-deslumbrado.jpg'>Viu só? É uma mão na roda quando você quer encontrar um valor sem usar `laços` com `listas`, visto que com uma lista você seria obrigado a verificar cada elemento para encontrar o que você quer.</Text>
---
<Text picture='panda-meditando.jpg'>Mas voltando para o nosso problema.</Text>
---
<Code>
  var frase = "+>>+ +>+++ +++>+ ++ +>+>+"

  var dicionario = {
        "+++>+": "por",
  }
</Code>
---
<Text picture='panda-olhando-computador.jpg'>Temos um belo dicionário e uma frase. Podemos, primeiro, transformar a frase em uma lista de palavras.</Text>
---
<Code exec>
  var frase = "+>>+ +>+++ +++>+ ++ +>+>+"
  var palavras = frase.dividir(' ')
  escreva(palavras) // ['+>>+', '+>+++', '+++>+', '++', '+>+>+']

  var dicionario = {
        "+>+>+": "salvarem",
  }
</Code>
---
<Alert picture='panda-de-oculos.jpg'>Lembre-se do método lista `dividir()`. Eu coloquei um texto vazio como argumento para o método `dividir` para separar as palavras com nos espaços na frase.</Alert>
---
<Text picture='panda-olhando-computador.jpg'>Agora, criamos uma variável chamada `traducao` e escrevemos um laço `para cada` que percorre cada palavra na lista.</Text>
---
<Code>
  var frase = "+>>+ +>+++ +++>+ ++ +>+>+"
  var palavras = frase.dividir(' ')
  var traducao = ''

  var dicionario = {
        "+>>+": "muito",
  }

   for cada palavra em palavras {

  }
</Code>
---
<User picture='foquete-viajando.jpg'>Acho que sei onde você quer chegar.</User>
---
<Code>
  var frase = "+>>+ +>+++ +++>+ ++ +>+>+"
  var palavras = frase.dividir(' ')
  var traducao = ''

  var dicionario = {
        "++": "me",
  }

  for cada palavra em palavras {
    traducao += "dicionario[palavra] "
  }
</Code>
---
<Text picture='panda-comemorando.jpg'>Isso mesmo! Cada palavra pode ser usada como chave para acessar o seu valor correspondente</Text>
---
<Text picture='panda-olhando-computador.jpg'>E concatenando o valor da chave + um espaço vazio à variável `traducao` a cada iteração</Text>
---
<Code exec>
  var frase = "+>>+ +>+++ +++>+ ++ +>+>+"
  var palavras = frase.dividir(' ')
  var traducao = ''

  var dicionario = {
    "+>+++": "obrigada",
    "+++>+": "por",
    "+>+>+": "salvarem",
    "+>>+": "muito",
    "++": "me",
  }

  para cada palavra de palavras {
    var palavraTraduzida = dicionario[palavra]
    traducao += "${palavraTraduzida} "
  }

  escreva(traducao) // muito obrigada por me salvarem
</Code>
---
<Text picture='foquete-deslumbrado.jpg'>Bom demais!</Text>
---
<Image picture='princesa-sorrindo.jpg'>++ +++ ++>>++ +>>> +>>+</Image>
---
<Text picture='panda-amando-bambu.jpg'>A princesa está falando de novo, vamos utilizar nossa estratégia novamente.</Text>
---
<Code exec>
  var frase = "++ +++ ++>>++ +>>> +>>+"
  var palavras = frase.dividir(' ')
  var traducao = ''

  var dicionario = {
    "+>>>": "uma",
    "+++": "lhes",
    "++>>++": "gar",
    "+>>+": "recompensa",
    "++": "vou",
  }

  para cada palavra de palavras {
    var palavraTraduzida = dicionario[palavra]
    traducao += "${palavraTraduzida} "
  }

  escreva(traducao) // vou lhes gar uma recompensa
</Code>
---
<User>'Gar' uma recompensa?.</User>
---
<Text picture='panda-chorando.jpg'>Pultz! Parece que uma palavra no dicionário deles está errada.</Text>
---
<Text picture='panda-piscando.jpg'>Mas ainda bem que é possível alterar qualquer um dos valores de um dicionário.</Text>
---
<Text title='Alterando o valor de um dicionário' picture='panda-de-oculos.jpg'>Suponhamos um boletim de um estudante com notas de 0 até 10.</Text>
---
<Code>
  var boletim = {
    "1º ano": 8,
    "2º ano": 6.5,
    "3º ano": 100,
  }
</Code>
---
<Text picture='panda-pensando.jpg'>O valor do `3º ano` está claramente errado porquê o máximo possível é 10.</Text>
---
<Quote title='Alterando o valor de um dicionário' picture='panda-olhando-computador.jpg'>Podemos mudar o valor da chave "3º ano" passando nome dessa chave entre colchetes e atribuindo um novo valor.</Quote>
---
<Code exec>
  var boletim = {
    "1º ano": 8,
    "2º ano": 6.5,
    "3º ano": 100,
  }

  boletim["3º ano"] = 10

  escreva(boletim["3º ano"]) // 10
</Code>
---
<User>E se acha chave `3º ano` não existisse no dicionário?</User>
---
<Quote title='Adicionando um valor a um dicionário' picture='foquete-viajando.jpg'>Seria criado um novo conjunto de chave e valor no dicionário `boletim`.</Quote>
---
<Code exec>
  var boletim = {
    "1º ano": 8,
    "2º ano": 6.5,
  }

  escreva(boletim["3º ano"]) // nulo

  boletim["3º ano"] = 10

  escreva(boletim["3º ano"]) // 10
</Code>
---
<Text picture='panda-sorrindo-sentado.jpg'>Muito bem. Agora, fazemos o mesmo com o dicionário da princesa corrigindo a palavra.</Text>
---
<Code exec>
  var frase = "++ +++ ++>>++ +>>> +>>+"
  var palavras = frase.dividir(' ')
  var traducao = ''

  var dicionario = {
    "+>>>": "uma",
    "+++": "lhes",
    "++>>++": "gar",
    "+>>+": "recompensa",
    "++": "vou",
  }

  dicionario["++>>++"] = "dar"

  para cada palavra de palavras {
    var palavraTraduzida = dicionario[palavra]
    traducao += "${palavraTraduzida} "
  }

  escreva(traducao) // vou lhes dar uma recompensa
</Code>
---
<Text picture='panda-olhando-de-lado.jpg'>Que recompensa é essa, princesa?</Text>
---
<Image picture='princess-floating.jpg'>...</Image>
---
<Text picture='panda-pensando.jpg'>Pensando bem. Porque a princesa agradeceu a genter por ter a salvado sendo que nó apenas a encotramos?</Text>
---
