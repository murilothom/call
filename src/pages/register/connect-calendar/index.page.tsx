import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  const handleConnectCalendar = async () => {
    await signIn('google')
  }

  const handleNavigateToNextStep = async () => {
    await router.push('/register/time-intervals')
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>

        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Agenda</Text>
          {isSignedIn ? (
            <Button size="sm" disabled>
              Conectado <Check weight="bold" />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar <ArrowRight weight="bold" />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button
          onClick={handleNavigateToNextStep}
          type="submit"
          disabled={!isSignedIn}
        >
          Próximo passo <ArrowRight weight="bold" />
        </Button>
      </ConnectBox>
    </Container>
  )
}
