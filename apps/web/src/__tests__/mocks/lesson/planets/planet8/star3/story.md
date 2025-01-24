<Image picture='princesa-flutuando.jpg'>Estamos quase lá!</Image>
---
<Code>
  var bombas = {
    "tomatomica": ["tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate"],
    "granatom": ["tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate"],
    "pomatox": ["tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate", "tomate"],
  }
</Code>
---
<Image picture='princesa-animada.jpg'>Bombas de tomates!</Image>
---
<Text picture='panda-pensando.jpg'>Podemos jogar essas bombas nos locais estratégicos que nos foram enviados por aquele pessoa desconhecida.</Text>
---
<Text picture='panda-segurando-bambu-de-pe.jpg'>Primeiro, permita-te colocá-los em variáveis</Text>
---
<Code exec>
  var bombas = {
    "tomatomica": ["tomate", "tomate", "tomate", "tomate"],
    "granatom": ["tomate", "tomate", "tomate", "tomate"],
    "pomatox": ["tomate", "tomate", "tomate", "tomate"],
  }

  var bomba1, bomba2, bomba3 = bombas["tomatomica"], bombas["granatom"], bombas["pomatox"]

  escreva(bomba1, bomba2, bomba3)
</Code>
---
<User>Mas o que você acabou e fazer?</User>
---
<Text picture='panda-sorrindo.jpg'>O que eu fiz é chamado de *atribuição de múltiplas variaveis*.</Text>
---
<Quote picture='panda-sorrindo-sentado.jpg' title='Atribuição de múltiplas variaveis'>É uma capacidade dos dicionários permitirem atribuir os valores de um dicionário a varias variáveis em uma única linha e com único uso da palavra-chave `var`.</Quote>
---
<Code exec>
var pessoa = {"nome": "Alice", "idade": 25, "cidade": "São Paulo"}

// Atribuição de múltiplas variaveis
var nome, idade = pessoa["nome"], pessoa["idade"]

escreva(nome) // Alice
escreva(idade) // 25
</Code>
---
<Alert picture='panda-olhando-de-lado.jpg'>Para aplicar essa técnica, as variáveis precisam estar sempre separadas por vírgula.</Alert>
---
<Image picture='princesa-flutuando.jpg'>Eu não faço a menor ideia como vocês conseguiram essa informação, mas antes de enviarmos essas bombas precisamos calcular a distância total até o nosso alvo principal.</Image>
---
<Code>
var distancias = {
  "estacaoTerraAteColoniaSolis": 2000, // Distância entre Estação Terra e Colônia Solis
  "vilaOmegaAteCidadeNova": 500, // Distância entre Vila Omega e Cidade Nova
  "luaZetAteBaseDelta": 850, // Distância entre Lua Zeta e Base Delta
}
</Code>
---
<Image picture='princesa-lendo.jpg'>Por favor, calculem a distancia total para mim.</Image>
---
<Text picture='panda-piscando.jpg'>É pra já!</Text>
---
<Text picture='panda-olhando-de-lado.jpg'>Primeiro, coloquemos todos esses números em variáveis.</Text>
---
<Code exec>
var { estacaoTerraAteColoniaSolis, vilaOmegaAteCidadeNova, luaZetAteBaseDelta } = {
  "estacaoTerraAteColoniaSolis": 2000,
  "vilaOmegaAteCidadeNova": 500,
  "luaZetAteBaseDelta": 850,
}

escreva(estacaoTerraAteColoniaSolis) // 2000
escreva(vilaOmegaAteCidadeNova) // 500
escreva(luaZetAteBaseDelta) // 850
</Code>
---
<User>Outra bruxaria com variáveis?</User>
---
<Text picture='panda-sorrindo.jpg'>O que eu fiz é chamado de *desestruturação*.</Text>
---
<Quote picture='panda-sorrindo-deitado.jpg' title='Desestruturação'>Desestruturação é uma forma de "desmontar" dicionários para extrair valores específicos de forma rápida e prática.</Quote>
---
<Code exec>
var panda = {
  "nome": "Panda",
  "idade": 2500,
  "planeta": "Planeta dos Pandas"
}

// Desestruturação
var { nome, idade, planeta } = panda

escreva(nome)   // Panda
escreva(idade)  // 2500
escreva(planeta) // Planeta dos Pandas
</Code>
---
<Quote picture='panda-deslumbrado.jpg'>É como abrir uma caixa organizada e pegar só o que você precisa, sem carregar a caixa inteira. E o nome das variáveis nem precisa estar em ordem.</Quote>
---
<Alert picture='panda-espantado.jpg'>Cuidado! os nomes das variáveis têm que estar iguaizinhos as chaves do dicionário senão a variável terá valor `nulo`!</Alert>
---
<Code exec>
var panda = {
  "nome": "Panda",
  "idade": 2500,
  "planeta": "Planeta dos Pandas",
}

// Desestruturação
var { nome, idade, cidade } = panda

escreva(nome)   // Panda
escreva(idade)  // 2500
escreva(cidade) // nulo
</Code>
---
<Text picture='panda-sorrindo.jpg'>Agora com as variáveis prontas só precisamos somá-las.</Text>
---
<Code exec>
var { estacaoTerraAteColoniaSolis, vilaOmegaAteCidadeNova, luaZetAteBaseDelta } = {
  "estacaoTerraAteColoniaSolis": 2000,
  "vilaOmegaAteCidadeNova": 500,
  "luaZetAteBaseDelta": 850,
}

var distanciaTotal = [
  estacaoTerraAteColoniaSolis, 
  vilaOmegaAteCidadeNova, 
  luaZetAteBaseDelta
].somar()

escreva(distanciaTotal) // 3350
</Code>
---
<Text picture='panda-piscando-sentado.jpg'>Antes que pergunte, sim é possível utilizar `métodos` sem a necessidade de variáveis</Text>
---
<Code exec>
escreva("texto em maiusculo".maiusculo()) // TEXTO EM MAIUSCULO

escreva([1, 2, 3].fatiar(1)) // [2, 3]

escreva([1, 2, 3].mapear(funcao (numero) {
  retorna numero * 2
})) // [2, 4, 6]
</Code>
---
<Image picture='princesa-animada.jpg'>Muto bem! As bombas já estão chegando no alvo perfeito.</Image>
---
<Text picture='panda-espantado.jpg'>Acertou em cheio! E os macacos parecem estar fugindo</Text>
---
<Image picture='salmonense-dando-tchau.jpg'>Já bricamos suficiente com vocês. Tchau tchau.</Image>
---
<User>Mas tão fácil assim?</User>
---
<Text picture='panda-pensando.jpg'>E tudo graças àquele ser desconhecido. Quem será que nos ajudou e por quê?</Text>
---
<Image picture='princesa-soltando-fogos.jpg'>Não sei como agradecer vocês. Por favor, aceitam um dos presentes que mostrei.</Image>
---
<Code>
var dicionarioQualquer = {
  0: "ganhar 1 milhão de yaggs, mas perder todos os seus órgãos",
  1: "poder cuidar do meu tubarão para o resto da vida",
  2: "voltar para sua casa",
  3: "poder voar comigo no céu por 3 dias seguidos, mas depois ficar preso no espaço por 3 meses",
}
</Code>
---
<Text picture='panda-triste.jpg'>Acho que não há outra escolha melhor a não ser voltar para casa.</Text>
---
<Text picture='panda-sentado-com-mochila.jpg'>A jornada pelo espaço foi mais incrível do que qualquer um poderia imaginar. Cada estrela, cada planeta, cada conceito aprendido...</Text>
---
<Text picture='panda-pulando-de-alegria.jpg'>Tudo ficará gravado na minha memória. Agora, está na hora de voltarmos para casa, mas o que vivemos aqui vai permanecer conosco para sempre.</Text>
---
<Text picture='panda-fazendo-coracao.jpg'>Quem sabe um dia nossos caminhos se cruzem novamente, mas por enquanto, vou sentir falta da imensidão ao nosso redor. Até logo. Nossa aventura nunca vai ser esquecida.</Text>
---
<Text picture='panda.jpg'>Mas não antes de praticarmos o que aprendemos aqui ;).</Text>