import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Usuário deve conter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'Nome deve conter pelo menos 3 letras' }),
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function Register() {
  const router = useRouter()
  const username = String(router.query?.username || '')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  })

  const handleRegister = async ({ name, username }: RegisterFormSchema) => {
    try {
      await api.post('/users', {
        username,
        name,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        alert(error.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    if (username) {
      setValue('username', username)
    }
  }, [setValue, username])

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="call.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />

          {errors.username ? (
            <FormError size="sm">{errors.username.message}</FormError>
          ) : null}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name ? (
            <FormError size="sm">{errors.name.message}</FormError>
          ) : null}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight weight="bold" />
        </Button>
      </Form>
    </Container>
  )
}
