import type { ComponentProps } from 'react'
import { FormProvider } from 'react-hook-form'

import { Button } from '@/ui/shadcn/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/shadcn/components/card'
import { Input } from '@/ui/shadcn/components/input'
import { cn } from '@/ui/shadcn/utils'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/ui/shadcn/components/form'
import { useSignInForm } from './useSignInForm'

export const SignInFormView = ({ className, ...props }: ComponentProps<'div'>) => {
  const { form, isLoading, handleSubmit } = useSignInForm()

  return (
    <div className={cn('flex flex-col gap-6 text-zinc-100', className)} {...props}>
      <Card className='bg-zinc-900 border-none'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl text-zinc-100'>Bem-vindo de volta.</CardTitle>
          <CardDescription className='text-zinc-400'>
            Faça login com seu email e senha para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className='py-6'>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6 text-zinc-100'>
                <div className='grid gap-6'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='m@example.com'
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type='password' required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
