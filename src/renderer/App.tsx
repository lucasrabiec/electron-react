import {
  Button,
  ChakraProvider,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import './App.css';
import { useCallback, useEffect, useState } from 'react';

const Hello = () => {
  return (
    <Flex flexDir='column'>
      <Heading>Super duper menu:</Heading>
      <List>
        <ListItem as={NavLink} to='/grpc'>
          GRPC
        </ListItem>
      </List>
    </Flex>
  );
};

const { ipcRenderer } = window.electron;

function Grpc() {
  const [message, setMessage] = useState<string>();
  const [counter, setCounter] = useState<number>();

  useEffect(() => {
    ipcRenderer.on('grpc-hello', (helloMessage) => {
      setMessage(helloMessage as string);
    });
    ipcRenderer.on('grpc-counter', (countVal) => {
      setCounter(countVal as number);
    });

    return () => {
      ipcRenderer.removeAllListeners('grpc-hello');
      ipcRenderer.removeAllListeners('grpc-counter');
    };
  });

  const onGetDataClick = useCallback(() => {
    ipcRenderer.sendMessage('grpc-hello', [{ name: 'Lucas' }]);
    ipcRenderer.sendMessage('grpc-counter', [{ countRange: 10 }]);
  }, []);

  const onBackClick = useCallback(() => {
    ipcRenderer.sendMessage('abort', ['grpc-counter']);
  }, []);

  return (
    <Flex p={4} gap={4} flexDir='column'>
      <NavLink to='/' onClick={onBackClick}>
        <Heading>GRPC</Heading>
      </NavLink>
      <Text>Message: {message}</Text>
      <Text>Counter: {counter}</Text>
      <Button onClick={onGetDataClick}>Get data</Button>
    </Flex>
  );
}

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Hello />} />
          <Route path='/grpc' element={<Grpc />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
