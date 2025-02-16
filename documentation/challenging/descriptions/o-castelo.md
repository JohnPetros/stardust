<Image picture="castelo-alien.jpg">Chegamos ao castelo.</Image>

<Text picture="tubarao-malvado.jpg">Vamos supor que eu não faço a menor ideia de qual parte do castelo a pricesa está.</Text>

<Text picture="tubarao-malvado.jpg">O desafio é encontrar qual parte do castelo ela está.</Text>

<Text picture="tubarao-malvado.jpg">O castelo em questão é basicamente dividido em trê partes, representado por três listas: *topo*, *meio* e *baixo*. Logo, o castelo é uma lista de listas.</Text>

<Text picture="tubarao-malvado.jpg">Só que a parte do meio pode ser composta por mais ou menos listas, assim como cada parte pode ter mais ou menos cômodos. Cada parte ou cômodo pode ser representado por um número.</Text>

<Code>
var castelo = [
  [0, 0], // Parte do topo do castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0, 0, 0], // Parte de baixo do castelo 
]
</Code>

<Text picture="tubarao-malvado.jpg">A princesa é representada pelo número 1. Então, a lista que tiver esse número será onde está a princesa.</Text>

<Code>
var castelo = var castelo = [
  [0, 0], 
  [0, 0, 0],
  [0, 1, 0], // É aqui onde está a princesa
  [0, 0, 0, 0],  
]
</Code>

<Text title="O desafio" picture="tubarao-malvado.jpg">Sua missão é localizar a princesa. Você deve pegar a lista correta, substituir o número zero pela palavra 'princesa' em minúsculo e, por fim, retornar a lista modificada.</Text>

<Text picture="tubarao-malvado.jpg">Aqui está um exemplo para entender o desafio.</Text>

<Quote title="Exemplo 1">Entrada: `[[0,0,0], [0,1,0], [0,0,0]]`, Saída: `[0, "princesa", 0]`</Quote>

<Quote title="Exemplo 2">Entrada: `[[0,0,0], [0,0,0], [1,0,0,0]]`, Saída: `["princesa", 0, 0, 0]`</Quote>

<Quote title="Exemplo 3">Entrada: `[[0,0,0], [0,0,0], [1,0,0]]`, Saída: `["princesa", 0, 0]`</Quote>

<Quote title="Exemplo 4">Entrada: `[[0,1], [0,0], [0,0], [0]]`, Saída: `[0, "princesa"]`</Quote>

<Alert picture="tubarao-malvado.jpg">Já armei a função *acheAPrincesa()* onde você deve colocar o "retorna" para retornar o resultado. Então, nem tente alterar o nome dessa função, nem mesmo o parâmetro *castelo* dela.</Alert>

<Alert picture="panda.jpg">Entendi, podemos resolver esse desafio usando apenas laços comuns, mas recomendo usar a função *filtrarPor()* e em seguida *mapear()*, pois assim será mais fácil.</Alert>

<Alert picture="panda-sorrindo.jpg">Dica do panda: lembre-se de que os métodos de lista que são funções avançadas, como *filtrarPor* e *mapear* sempre retornarão uma nova lista.</Alert>
