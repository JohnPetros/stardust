Em uma nave espacial, a tripulação está tentando enviar mensagens importantes para outras espaçonaves.

No entanto, o teclado principal da nave está com defeito e algumas teclas não estão funcionando corretamente. Isso dificulta a digitação correta das mensagens.Por exemplo, ao digitar "Olá, mundo", a mensagem pode ser enviada como "Oxá, zundo"

<Text>Sua tarefa é identificar quais teclas estão quebradas, ou seja, as teclas que foram digitadas incorretamente devido ao defeito do teclado.</Text>

<Text>Você receberá uma função chamada *"identificarTeclas"* recebendo dois parâmetros: a frase correta e a incorreta.</Text>

<Text>Você deve retornar uma lista contendo as letras que são diferentes entre os duas frases.</Text>

<Quote title="Exemplo 1">Entrada: `"missão em progresso"`, "Millão em progrello"`, Saída: `['s']`</Quote>

<Quote title="Exemplo 2">Entrada: `"alien encontrado"', `"Alien enzongrado"', Saída: `['c', 't']`</Quote>

<Quote title="Exemplo 2">Entrada: `"exploração bem-sucedida"', `"Excloração fem-xucedida"', Saída: `['p', 'b', 's']`</Quote>

<Alert>Note que no primeiro exemplo a lista de resultado tem apenas a letra "s" e não quatro letras "s". Isso porque você deve identificar apenas uma tecla quebrada por frase, ou seja, a lista retornado não pode conter letras repetidas.</Alert>

<Alert>Isso porque você deve identificar apenas uma tecla quebrada por frase, ou seja, a lista retornado não pode conter letras repetidas.</Alert>

<Alert>Todas as frases passadas para você estarão em letras minúsculas.</Alert>

<Alert>A ordem das letras da lista a ser retornado deve corresponder com a ordem em que elas são encontradas na frase correta.</Alert>
