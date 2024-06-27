import { ArrowRight } from 'phosphor-react'
import { Form, FormAnnotation } from './styles'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Usuário deve conter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usário pode ter apenas letras e hífens',
    })
    .transform((value) => value.toLowerCase()),
})

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>

export const ClaimUsernameForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const handleClaimUsername = (data: ClaimUsernameFormSchema) => {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="call.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight weight="bold" />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : null}
        </Text>
      </FormAnnotation>
    </>
  )
}
