Em uma galáxia muito distante, existe uma frota de naves espaciais que patrulham o espaço em busca de ameaças alienígenas.

O código de cada uma dessas naves é composto por três números de 1 a N e são equipadas com um dispositivo que pode detectar a presença de outras naves em um raio de alcance.

<Text>Aqui está o desafio: escreva uma função conteBumerangues que retorne o número de vezes que uma nave do tipo *"bumerangue"* é detectada em uma determinada patrulha. O código de uma nave *"bumerangue"* possui uma sequência de três números consecutivos em que a primeiro e a terceiro são o mesmo, mas o segundo número é diferente.</Text>

<Text>Por exemplo, se a lista de entrada for `[1, 2, 1, 3, 1, 4, 2, 5, 2, 6]`, a função deve retornar 2, porque existem duas sequências de três números consecutivos em que a primeira e a terceiro número são iguais: `[1, 2, 1]` e `[2, 5, 2]`.</Text>

<Quote title="Exemplo 3">Entrada: `[3, 7, 3, 2, 1, 5, 1, 2, 2, -2, 2]`, Saída: ``3`</Quote>

> Explicacao: a partir da lista de entrada é possível extrair 3 naves bumerangues: [3, 7, 3], [1, 5, 1], [2, -2, 2]

<Quote title="Exemplo 3">Entrada: `[9, 5, 9, 5, 1, 1, 1]`, Saída: `2`</Quote>

> Explicacao: Explicacao: a partir da lista de entrada é possível extrair 2 naves bumerangues: [9, 5, 9], [5, 9, 4]

<Quote title="Exemplo 3">Entrada: `[1, 7, 1, 7, 1, 7, 1]`, Saída: `5`</Quote>

> Explicacao: a partir da lista de entrada é possível extrair 5 naves bumerangues: [1, 7, 1], [7, 1, 7], [1, 7, 1], [7, 1, 7], e [1, 7, 1]

<Alert>Observe que [5, 5, 5] (lista com 3 dígitos identicos) não é considerado uma nave bumerangue porque o valor do meio é identico ao primeiro e o terceiro.</Alert>
