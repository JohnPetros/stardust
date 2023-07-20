'use client'
import Input from '@/app/components/Input'
import { Envelope, Lock } from '@phosphor-icons/react'
import { Title } from '../components/Title'
import { Button } from '@/app/components/Button'
import { Link } from '../components/Link'

export default function SignIn() {
  return (
    <div className="h-screen">
      <main className="flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-[320px]">
          <Title
            title="Entre na sua conta"
            text="Insira suas credenciais de cadastro."
          />
          <form action="/" className="mt-8">
            <div className="space-y-4">
              <Input
                label="E-mail"
                icon={Envelope}
                name="email"
                placeholder="Digite seu e-mail"
              />
              <Input
                label="Senha"
                icon={Lock}
                name="password"
                placeholder="Digite senha"
              />
            </div>
            <div className="mt-6">
              <Button className="">Entrar</Button>
            </div>
          </form>
          <div className="flex items-center justify-between w-full mt-4">
            <Link href="/forgot-password">Esqueci a senha</Link>
            <Link href="/sign-up">Criar conta</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
