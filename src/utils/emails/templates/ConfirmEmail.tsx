import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'

export const ConfirmEmail = () => (
  <Tailwind>
    <Html className="font-default text-lg">
      <Head />
      <Preview className="text-green-900">Confirmação de cadastro</Preview>
      <Body className="rounded-md bg-black/90 p-8 font-sans">
        <Container>
          <Img
            width={100}
            height={20}
            src="https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/utils/logo.png"
          />

          <Text className="font-semibold text-green-400">
            Seja bem-vindo(a) ao nosso incrível universo de aprendizado! Estamos
            muito felizes por você ter se juntado a nós.
          </Text>

          <Container className="mt-4 rounded-md bg-zinc-800 p-6">
            <Text className="font-semibold text-gray-100">
              Estamos ansiosos para ver você alcançar novos patamares e
              desbravar os desafios que preparamos para você. Lembre-se de
              manter o foco e a dedicação!
            </Text>
            <Text className="font-semibold text-gray-100">
              Clique no botão abaixo para confirmar o seu cadastro. Ah, é melhor
              você clicar o quanto antes porque esse link expira em 1 hora.
            </Text>
            <Text className="mt-3 font-semibold text-gray-100"></Text>
            <Text className="font-semibold text-gray-100">
              Desejamos a você uma jornada incrível!
            </Text>
            <Text className=" font-semibold text-gray-100">
              - Equipe StarDust! 🚀
            </Text>
            <Button
              style={{ textAlign: 'center' }}
              className="mt-4 h-8 w-full rounded-md bg-green-400 text-lg font-bold text-gray-900 transition-opacity duration-200 hover:opacity-40"
              href="{{ .ConfirmationURL }}"
            >
              Confirmar cadastro
            </Button>
          </Container>
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

export default ConfirmEmail
