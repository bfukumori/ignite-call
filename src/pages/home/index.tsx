import Image from 'next/image';
import { Heading, Text } from '@ignite-ui/react';
import { Container, Hero, Preview } from './styles';

import previewImage from '@/assets/api-preview.png';

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre. Criar conta com Google
        </Text>
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
  );
}
