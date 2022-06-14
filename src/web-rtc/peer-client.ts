import Peer, { DataConnection } from 'peerjs';

type DataCallback = (value: string) => void;

export function getPeer(dataCallback: DataCallback, debug = false) {
  let id: string | undefined;
  let connection: DataConnection | undefined;

  const peer = new Peer({
    host: 'localhost',
    port: 50055,
    debug: debug ? 2 : 0,
  });

  (function init() {
    peer.on('open', handleOpen);
    peer.on('connection', handleConnection);
  })();

  function connect(peerId?: string) {
    if (peerId) {
      const peerConnection = peer.connect(peerId);
      handleConnection(peerConnection);
      return peerId;
    }
    return id;
  }

  function sendMessage(message: string) {
    if (!connection) {
      log('No connection!');
      return;
    }
    connection.send(message);
  }

  function handleOpen(peerId: string) {
    log(peerId);
    id = peerId;
  }

  function handleConnection(conn: DataConnection) {
    connection = conn;
    log(`Connection established in: ${id} with: ${conn.peer}`);
    connection.on('data', (data) => {
      dataCallback(data as string);
    });
  }

  function log(message: string) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }

  return { id, connect, sendMessage };
}
