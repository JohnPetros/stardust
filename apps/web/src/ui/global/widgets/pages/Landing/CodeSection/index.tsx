import { PlaygroundCodeEditor } from '../../../components/PlaygroundCodeEditor'
import { SectionTitle } from '../SectionTitle'
import { Feature } from './Feature'

export function CodeSection() {
  return (
    <section id='code'>
      <div className='sticky top-0 py-12 z-20'>
        <SectionTitle>Código criado para aprendizagem</SectionTitle>
      </div>

      <Feature
        title='Linguagem de programação em português'
        paragraph='Domine a arte da programação com uma linguagem desenvolvida especialmente para falantes de português. Simples, intuitiva e projetada para facilitar seu aprendizado desde o primeiro comando.'
      >
        <PlaygroundCodeEditor
          code={`funcao fala(mensagem) {
  escreva(mensagem)
}

funcao soma(a, b) {
  retorna a + b
}

escreva("Olá, mundo!") // Saída: Olá, mundo!
escreva('A soma de 5 e 3 é \${soma(5, 3)}.') // Saída: A soma de 5 e 3 é 8.`}
          height={400}
        />
      </Feature>
      <Feature
        title='Do básico ao avançado'
        paragraph='Comece com os conceitos mais básicos, como declarar variáveis, e evolua para a criação de programas complexos que resolvem problemas reais. Tudo em uma jornada contínua e estruturada.'
      >
        <PlaygroundCodeEditor
          code='var maximoDeElementos = 4
var indiceInicial = 0
var indiceFinal = 0
var indice = 0
var fila = []

funcao enfileirar (valorEntrada) {
  se (indiceFinal == maximoDeElementos) {
    escreva("Fila Cheia")
  } senao {
  fila[indiceFinal] = valorEntrada
  escreva("Valor inserido com sucesso: " + texto(fila[indiceFinal]))
    retorna indiceFinal = indiceFinal + 1
  }
}
função desenfileirar() {
  se (indiceInicial == indiceFinal) {
    escreva("Fila Vazia")
  } senao {
    para (indice = 0 indice <= indiceFinal indice = indice + 1){
      se (indice + 1 == indiceFinal) {
        indiceFinal = indiceFinal - 1
        escreva("Valor retirado com sucesso.")
      } senao {
        fila[indice] = fila[indice+1]
      }
    }
  }
}
enfileirar(1)'
          height={400}
        />
      </Feature>
      <Feature
        title='Desafios de código'
        paragraph='Teste suas habilidades com desafios de código práticos. Além de consolidar seu conhecimento, você pode criar e compartilhar desafios para outros viajantes, tornando-se parte de uma comunidade colaborativa.'
      >
        <PlaygroundCodeEditor
          code={`// Desafio: Verificar se uma palavra é um palíndromo
funcao verifiquePalindromo(frase) {
  var palavras = frase.dividir(" ")
  var fraseSemEspaco = palavras.juntar("")
  var fraseSemEspacoEInvertida = ''

  para (var letra = fraseSemEspaco.tamanho() - 1; letra >= 0; letra--) {
    fraseSemEspacoEInvertida += fraseSemEspaco[letra] 
  }
  retorna fraseSemEspaco.minusculo() == fraseSemEspacoEInvertida.minusculo()
}

// Testando o desafio
escreva(verifiquePalindromo("arara")) // Saída: verdadeiro
escreva(verifiquePalindromo("programação é legal")) // Saída: falso
escreva(verifiquePalindromo("Ame o poema")) // Saída: verdadeiro`}
          height={400}
        />
      </Feature>
    </section>
  )
}
