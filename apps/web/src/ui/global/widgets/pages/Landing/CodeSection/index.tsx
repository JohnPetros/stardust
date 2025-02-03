import { CodeSnippet } from '../../../components/CodeSnippet'
import { SectionTitle } from '../SectionTitle'
import { AnimatedFeature } from './AnimatedFeature'

export function CodeSection() {
  return (
    <section id='code' className='max-w-6xl mx-auto'>
      <div className='sticky top-0 py-12 z-20'>
        <SectionTitle>Código criado para aprendizagem</SectionTitle>
      </div>

      <div className='mt-6'>
        <AnimatedFeature
          title='Linguagem de programação em português'
          paragraph='Domine a arte da programação com uma linguagem desenvolvida especialmente para falantes de português. Simples, intuitiva e projetada para facilitar seu aprendizado desde o primeiro comando.'
        >
          <CodeSnippet
            isRunnable={true}
            code={`funcao fala(mensagem) {
  escreva(mensagem)
}

funcao soma(a, b) {
  retorna a + b
}

escreva("Olá, mundo!") // Saída: Olá, mundo!
escreva('A soma de 5 e 3 é \${soma(5, 3)}.') // Saída: A soma de 5 e 3 é 8.`}
          />
        </AnimatedFeature>
        <AnimatedFeature
          title='Do básico ao avançado'
          paragraph='Comece com os conceitos mais básicos, como declarar variáveis, e evolua para a criação de programas complexos que resolvem problemas reais. Tudo em uma jornada contínua e estruturada.'
        >
          <CodeSnippet
            isRunnable={true}
            code={` funcao fibonacci(maximo) {
    var a, b = 0, 1
    
    enquanto (a < maximo) {
        escreva(a)
        var aAtual = a
        a = b
        b = aAtual + b
    }
 }
    
fibonacci(1000)

`}
          />
        </AnimatedFeature>
        <AnimatedFeature
          title='Desafios de código'
          paragraph='Teste suas habilidades com desafios de código práticos. Além de consolidar seu conhecimento, você pode criar e compartilhar desafios para outros viajantes, tornando-se parte de uma comunidade colaborativa.'
        >
          <CodeSnippet
            isRunnable={true}
            code={`// Desafio: Verificar se uma palavra é um palíndromo
funcao verifiquePalindromo(frase) {
  var palavras = frase.dividir(" ")
  var fraseSemEspaco = palavras.juntar("")
  var fraseSemEspacoEInvertida = ''
  var fraseTamanho = fraseSemEspaco.tamanho()

  para (var letra = fraseTamanho - 1; letra >= 0; letra--) {
    fraseSemEspacoEInvertida += fraseSemEspaco[letra] 
  }
  retorna fraseSemEspaco.minusculo() == fraseSemEspacoEInvertida.minusculo()
}

// Testando o desafio
escreva(verifiquePalindromo("arara")) // Saída: verdadeiro
escreva(verifiquePalindromo("programação é legal")) // Saída: falso
escreva(verifiquePalindromo("Ame o poema")) // Saída: verdadeiro
`}
          />
        </AnimatedFeature>
      </div>
    </section>
  )
}
