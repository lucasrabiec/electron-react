import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Channels } from '../../utils/consts';
import grpcImage from '../../images/grpc.jpeg';

const { ipcRenderer } = window.electron;

const schema = z.object({
  name: z.string().min(1),
  countRange: z.number().min(5),
});

interface GrpcFormData {
  name: string;
  countRange: number;
}

export default function Grpc() {
  const [message, setMessage] = useState<string>();
  const [counter, setCounter] = useState<number>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GrpcFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    ipcRenderer.once(Channels.GRPC_HELLO, (helloMessage) => {
      setMessage(helloMessage as string);
    });
    ipcRenderer.on(Channels.GRPC_COUNTER, (countVal) => {
      setCounter(countVal as number);
    });

    return function cleanup() {
      abortCounter();
      ipcRenderer.removeAllListeners(Channels.GRPC_HELLO);
      ipcRenderer.removeAllListeners(Channels.GRPC_COUNTER);
    };
  }, []);

  const onAbortClick = useCallback(() => abortCounter(), []);
  const onSubmit = ({ name, countRange }: GrpcFormData) => {
    abortCounter();
    ipcRenderer.sendMessage(Channels.GRPC_HELLO, [{ name }]);
    ipcRenderer.sendMessage(Channels.GRPC_COUNTER, [{ countRange }]);
  };

  return (
    <Flex gap={4} flexDir='column' h='100%'>
      <Heading>GRPC</Heading>
      <SimpleGrid
        as='form'
        columns={2}
        spacingX='40px'
        spacingY='20px'
        alignItems='center'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input {...register('name')} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <Text fontSize='xl'>Message: {message}</Text>
        <FormControl isInvalid={!!errors.countRange}>
          <FormLabel>Count range</FormLabel>
          <NumberInput defaultValue={10} min={5}>
            <NumberInputField {...register('countRange', { valueAsNumber: true })} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>{errors.countRange?.message}</FormErrorMessage>
        </FormControl>
        <Text fontSize='xl'>Counter: {counter}</Text>
        <Button type='submit'>Send</Button>
        <Button onClick={onAbortClick}>Abort</Button>
      </SimpleGrid>
      <Image src={grpcImage} fit='scale-down' flex='auto' h='100px' />
    </Flex>
  );
}

function abortCounter() {
  ipcRenderer.sendMessage(Channels.GRPC_ABORT, []);
}
