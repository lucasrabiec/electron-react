// import { SocketClientWrapper, SocketClientWrapperProps } from './socket-client-wrapper';
// import { SimplePeerWrapper } from './simple-peer-wrapper';

// export class PeerClient {
//   peerClient: SimplePeerWrapper;
//
//   constructor(options: SocketClientWrapperProps) {
//     const socketClient = new SocketClientWrapper(options);
//     this.peerClient = socketClient.peerClient;
//   }
//
//   connect() {
//     console.log('coon');
//     this.peerClient.init();
//   }
//
//   isConnectionStarted() {
//     return this.peerClient.isPeerStarted();
//   }
//
//   send(data: any) {
//     this.peerClient.sendData(data);
//   }
//
//   on(event: any, callback: any) {
//     this.peerClient.setEventCallback(event, callback);
//   }
//
//   close() {
//     this.peerClient.terminateSession();
//   }
// }

import Peer, { DataConnection } from 'peerjs';

type DataCallback = (value: string) => void;

// export class PeerClient {
//   id: string | undefined;
//   connection: DataConnection | undefined;
//
//   dataCallback: DataCallback;
//   connectionCallback: any;
//
//   private readonly isDebug: boolean;
//   private peer: Peer;
//
//   constructor(connectionCallback: any, dataCallback: DataCallback, debug = false) {
//     this.peer = new Peer({
//       host: 'localhost',
//       port: 50055,
//       debug: debug ? 2 : 0,
//     });
//     this.isDebug = debug;
//     this.dataCallback = dataCallback;
//     this.connectionCallback = connectionCallback;
//
//     this.initialize();
//   }
//
//   connect(peerId?: string) {
//     if (peerId) {
//       const conn = this.peer.connect(peerId);
//       console.log('peer id ' + this.peer.id);
//       this.id = this.peer.id;
//       this.initializeConnection(conn);
//       return peerId;
//     }
//     return this.id as string;
//   }
//
//   private initialize() {
//     this.peer.on('open', (id: string) => {
//       this.id = id;
//       this.debug(`ID: ${id}`);
//     });
//     this.peer.on('connection', (conn) => {
//       this.initializeConnection(conn);
//     });
//   }
//
//   private initializeConnection(connection: DataConnection) {
//     if (!this.connection) {
//       this.connection = connection;
//       this.debug(`Connection established in: ${this.id} with: ${connection.peer}`);
//     }
//     this.connection.on('data', (data) => {
//       if (typeof data === 'string') {
//         this.dataCallback(data);
//       } else {
//         this.debug('Incompatible data type');
//       }
//     });
//   }
//
//   private debug(message: string) {
//     if (this.isDebug) {
//       console.log(message);
//     }
//   }
// }

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
