import Image from 'next/image';

import { Heading, Text } from '@ignite-ui/react';
import previewImage from '@/assets/api-preview.png';
import { ClaimUsernameForm } from './components/ClaimUsernameForm';
import { Container, Hero, Preview } from './styles';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Ignite Call - Página Inicial</title>
      </Head>
      <Container>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre. Criar conta com Google
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação em funcionamento"
          />
        </Preview>
      </Container>
    </>
  );
}
