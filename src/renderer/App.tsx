import {
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
  Link,
} from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

const Hello = () => {
  return (
    <Flex flexDir="column">
      <Heading>Super duper menu:</Heading>
      <List>
        <ListItem as={NavLink} to="/grpc">
          GRPC
        </ListItem>
      </List>
    </Flex>
  );
};

function Grpc() {
  const [message, setMessage] = useState<string>();
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    window.electron.ipcRenderer.on('grpc-hello', (arg) => {
      setMessage(arg as string);
    });
    window.electron.ipcRenderer.on('grpc-counter', (arg) => {
      setCounter(arg as number);
    });
    window.electron.ipcRenderer.sendMessage('grpc-hello', [{ name: 'Lucas' }]);
    window.electron.ipcRenderer.sendMessage('grpc-counter', [
      { countRange: 10 },
    ]);
  }, []);

  return (
    <Flex p={4} gap={4} flexDir="column">
      <Link to="/">
        <Heading>GRPC</Heading>
      </Link>
      <Text>Message: {message}</Text>
      <Text>Counter: {counter}</Text>
    </Flex>
  );
}

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/grpc" element={<Grpc />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
