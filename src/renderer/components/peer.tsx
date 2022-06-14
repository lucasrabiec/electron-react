import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Text,
  HStack,
  VStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { useEffectOnce, useToggle } from 'react-use';
import { useInitPeer } from '../contexts/peer-context';
import { getPeer, useData } from '../../web-rtc/peer-client';

export interface PeerProps {
  name: string;
}

const schema = z.object({
  message: z.string().min(1),
});

interface MessageData {
  message: string;
}

export default function Peer({ name }: PeerProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const peerClient = useRef<any>(null!);
  const textArea = useRef<any>();
  const { initPeerId, updateInitPeerId } = useInitPeer();
  const [isConnected, setIsConnected] = useToggle(false);
  const messages = useData();

  useEffectOnce(() => {
    peerClient.current = getPeer(true);
  });

  useEffect(() => {
    textArea.current.scrollTop = textArea.current.scrollHeight;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageData>({
    resolver: zodResolver(schema),
  });

  const onConnectClick = () => {
    updateInitPeerId(peerClient.current.connect(initPeerId));
    setIsConnected(true);
  };

  const onSubmit = ({ message }: MessageData) => {
    const fullMsg = `${name}: ${message}`;
    peerClient.current?.sendMessage(fullMsg);
    reset();
  };

  return (
    <Flex
      align='center'
      flexDir='column'
      gap={3}
      borderWidth={1}
      borderRadius={4}
      boxShadow='xl'
      p={4}
      borderColor='orange'
    >
      <HStack justify='space-around' w='100%'>
        <Heading size='md'>Peer {name}</Heading>
        <Button onClick={onConnectClick} disabled={isConnected} colorScheme='orange'>
          Connect
        </Button>
      </HStack>
      <VStack align='left' w='100%'>
        <Text fontSize='lg'>Chat:</Text>
        <Textarea ref={textArea} disabled h='150' resize='none' color='black' bg='white' value={messages} />
        <Box as='form' onSubmit={handleSubmit(onSubmit)} w='100%'>
          <FormControl isInvalid={!!errors.message}>
            <InputGroup w='100%'>
              <Input {...register('message')} type='text' placeholder='Type a message...' />
              <InputRightElement>
                <IconButton
                  type='submit'
                  size='sm'
                  colorScheme='orange'
                  icon={<RiSendPlaneFill />}
                  aria-label='Send message'
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
          </FormControl>
        </Box>
      </VStack>
    </Flex>
  );
}
