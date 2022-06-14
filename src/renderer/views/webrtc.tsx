import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import Peer from '../components/peer';
import { InitPeerProvider } from '../contexts/peer-context';

export default function WebRTC() {
  return (
    <Flex flexDir='column' h='100%'>
      <Heading>WebRTC</Heading>
      <InitPeerProvider>
        <SimpleGrid columns={2} h='100%' spacingX='20px'>
          <Peer name='GAIA' />
          <Peer name='HEPHAESTUS' />
        </SimpleGrid>
      </InitPeerProvider>
    </Flex>
  );
}
