import Peer, { DataConnection } from 'peerjs';
import { bind } from '@react-rxjs/core';
import { createSignal } from '@react-rxjs/utils';
import { scan } from 'rxjs/operators';

const [dataChange$, setData] = createSignal<string>();
export const [useData, data$] = bind<string>(dataChange$.pipe(scan((all, current) => `${all}\n${current}`)), '');

export class PeerClient {
  id: string | undefined;
  connection: DataConnection | undefined;

  private readonly isDebug: boolean;
  private peer: Peer;

  constructor(debug = false) {
    this.peer = new Peer({
      host: 'localhost',
      port: 50055,
      debug: debug ? 2 : 0,
    });
    this.isDebug = debug;

    this.initialize();
  }

  connect(peerId?: string) {
    if (peerId) {
      const peerConnection = this.peer.connect(peerId);
      this.handleConnection(peerConnection);
      return peerId;
    }
    return this.id;
  }

  sendMessage(message: string) {
    if (!this.connection) {
      this.log('No connection!');
      return;
    }
    this.connection.send(message);
  }

  private initialize() {
    this.peer.on('open', (data) => this.handleOpen(data));
    this.peer.on('connection', (conn) => this.handleConnection(conn));
  }

  private handleOpen(peerId: string) {
    this.log(peerId);
    this.id = peerId;
  }

  private handleConnection(conn: DataConnection) {
    this.connection = conn;
    this.log(`Connection established in: ${this.id} with: ${conn.peer}`);
    this.connection.on('data', (data) => setData(data as string));
  }

  private log(message: string) {
    if (this.isDebug) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }
}
