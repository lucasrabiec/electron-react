import { Box, Button, Center, Flex, Heading, HStack } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <Flex w='100vw' h='100vh' flexDir='column'>
      <Center m={2}>
        <Heading>Electron React Super Duper App</Heading>
      </Center>
      <HStack justify='space-evenly' align='center' w='100vw' p={2} spacing={2}>
        {['Files', 'GRPC', 'WebRTC', 'Settings'].map((name) => (
          <Button key={name} as={NavLink} to={name.toLowerCase()} mx='0px' w='100%' colorScheme='purple'>
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
