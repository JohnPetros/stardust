import { Form, FormField, FormItem, FormControl } from '@/ui/shadcn/components/form'
import { Input } from '@/ui/shadcn/components/input'
import { Button } from '@/ui/shadcn/components/button'
import { useGuideForm } from './useGuideForm'

type Props = {
  defaultTitle?: string
  onSubmit: (title: string) => void
  onCancel: () => void
  submitLabel?: string
}

export const GuideFormView = ({
  defaultTitle,
  onSubmit,
  onCancel,
  submitLabel = 'Criar',
}: Props) => {
  const { form, isSubmitting, handleSubmit, handleCancel } = useGuideForm({
    defaultTitle,
    onSubmit,
    onCancel,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-8 w-full h-full justify-center'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder='Título da guia'
                  className='bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500'
                  autoFocus
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex items-center gap-6'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='flex-1 text-zinc-400 bg-zinc-800'
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            size='sm'
            className='flex-1'
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
