import { Box, Button, Center, Flex, Heading, HStack } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <Flex w='100vw' h='100vh' bg='darkgray' flexDir='column'>
      <Center m={2}>
        <Heading>Electron React Super Duper App</Heading>
      </Center>
      <HStack justify='space-evenly' align='center' w='100vw' p={2} spacing={2}>
        {['Files', 'GRPC', 'WebRTC', 'Settings'].map((name) => (
          <Button key={name} mx='0px' w='100%' as={NavLink} to={name.toLowerCase()}>
            {name}
          </Button>
        ))}
      </HStack>
      <Box m={4} h='100%'>
        <Outlet />
      </Box>
    </Flex>
  );
}
