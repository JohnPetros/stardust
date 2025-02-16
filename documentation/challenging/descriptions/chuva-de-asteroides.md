<Image picture="foquete-viajando.jpg">...</Image>

<Text picture="panda.jpg">Faz alguns minutos que seu foguete saiu para o espaço,
mas ele já encontrou um planeta à vista!.</Text>

<Text picture="panda-triste.jpg">Porém, há três asteroides gigantes vindo em sua
direção.</Text>

<Quote picture="panda-abracando-bambu.jpg">Seu dever é testar se o escudo protetor do foguete está ativo (valor *verdadeiro*) e que a resistência (valor *700*) é maior que a soma das forças dos três asteroides: A, B e C</Quote>

<Quote title="Exemplo 1">Entrada: `100, 200, 300, verdadeiro`, Saída: `verdadeiro`</Quote>

> Explicação: a soma das forças dá 600 e a resistencia é 700. Como o escudo está ativo (verdadeiro) e essa soma é menor que 700, logo, o resultado é verdadeiro

<Quote title="Exemplo 2">Entrada: `500, 500, 500, verdadeiro`, Saída: `falso`</Quote>

> Explicação: a soma é 1500 e a resitência é 700 logo, o resultado já é de cara falso

<Quote title="Exemplo 3">Entrada: `50, 100, 150, falso`, Saída: `falso`</Quote>

> Explicação: a soma é 300 e a resitência é 700, porém o escudo não está ativo, então, o resultado é falso

<Quote title="Exemplo 3">Entrada: `50, 100, 150, falso`, Saída: `falso`</Quote>

<Alert title="Dica">Coloque a soma das forças em uma variável chamada *soma* e depois compare se ela é maior ou não que a resistência.</Alert>

<Alert>Não se esqueça de comparar também se o escudo está ativo ou não.</Alert>