import { Center, ChakraProvider, Image } from '@chakra-ui/react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './views/main';
import WebRTC from './views/webrtc';
import Settings from './views/settings';
import Grpc from './views/grpc';
import Files from './views/files';
import electronImg from '../app-assets/electron-app.jpeg';
import { expandedTheme } from './configs/theme';

export default function App() {
  return (
    <ChakraProvider theme={expandedTheme}>
      <Router>
        <Routes>
          <Route element={<Main />}>
            <Route
              path='/'
              element={
                <Center h='100%'>
                  <Image src={electronImg} />
                </Center>
              }
            />
            <Route path='files' element={<Files />} />
            <Route path='grpc' element={<Grpc />} />
            <Route path='webrtc' element={<WebRTC />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
