import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './views/main';
import WebRTC from './views/webrtc';
import Settings from './views/settings';
import Grpc from './views/grpc';
import Files from './views/files';

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Main />}>
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
