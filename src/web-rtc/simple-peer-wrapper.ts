import SimplePeer, { Options } from 'simple-peer';
import { Socket } from 'socket.io-client';
import { SocketEvent } from '../utils/consts';

export type SimplePeerOptions = Options;

export interface ConnectionType {
  room: string;
  initiator: boolean;
  peerStarted: boolean;
  roomReady: boolean;
  peer?: any;
}

export class SimplePeerWrapper {
  private readonly debug: boolean;
  private readonly simplePeerOptions: SimplePeerOptions;
  private socket: Socket;
  private onConnectCallback: any;
  private onErrorCallback: any;
  private onDataCallback: any;
  private onCloseCallback: any;

  connections: ConnectionType[];
  initPeerRequest: boolean;

  constructor(socket: Socket, debug: boolean, simplePeerOptions: SimplePeerOptions) {
    this.socket = socket;
    this.debug = debug;
    this.connections = [];
    this.simplePeerOptions = simplePeerOptions;
    this.initPeerRequest = false;
  }

  init() {
    debugLog(`Running init Peer Client. Number of connections: ${this.connections.length}`, this.debug);
    this.initPeerRequest = true;
    this.connections.forEach((connection: ConnectionType) => {
      this.socket.emit(SocketEvent.INITIATE, connection.room);
      // if (connection.initiator) {
      //   this.attemptPeerStart(connection);
      // }
    });
  }

  attemptPeerStart(connection?: ConnectionType | null) {
    if (!connection) {
      debugLog('Not creating peer connection', this.debug);
      return;
    }

    debugLog(`Attempting peer start ${connection.peerStarted} ${connection.roomReady}`, this.debug);
    if (!connection.peerStarted && connection.roomReady) {
      debugLog('Creating peer connection', this.debug);
      this.createPeerConnection(connection);
    } else {
      debugLog('Not creating peer connection', this.debug);
    }
  }

  createPeerConnection(connection: ConnectionType) {
    debugLog('Creating simple peer', this.debug);

    const options = this.getPeerOptions(connection.initiator);
    const peer = new SimplePeer(options);

    peer.on('signal', (data) => this.sendSignal(data, connection));
    peer.on('connect', () => this.handleConnection());
    peer.on('error', (err) => this.handleError(err));
    // peer.on('stream', (stream) => this.handleStream(stream));
    peer.on('data', (data) => this.handleData(data));
    peer.on('close', () => this.handleClose());

    connection.peerStarted = true;
    connection.peer = peer;
  }

  isPeerStarted() {
    return this.connections.some((connection) => connection.peerStarted);
  }

  setEventCallback(event: any, callback: any) {
    switch (event) {
      case 'connect':
        this.onConnectCallback = callback;
        break;
      case 'data':
        this.onDataCallback = callback;
        break;
      // case 'stream':
      //   this.onStreamCallback = callback;
      //   break;
      case 'close':
        this.onCloseCallback = callback;
        break;
      case 'error':
        this.onErrorCallback = callback;
        break;
      default:
        break;
    }
  }

  sendData(data: any) {
    const msg = JSON.stringify({ data, userId: this.socket.id });
    console.log(msg);
    this.connections.forEach((connection) => {
      const peer = connection;
      console.log(peer);
      if (peer.peerStarted) {
        const peerConn = peer.peer;
        if (peerConn.connected) {
          peerConn.write(msg);
        }
      }
    });
  }

  terminateSession() {
    this.connections.forEach((connection) => {
      const { peer } = connection;
      peer?.destroy();
      connection.peer = null;
      connection.peerStarted = false;
    });

    this.socket.emit(SocketEvent.HANGUP);
    this.socket.close();
  }

  private sendSignal(data: any, connection: ConnectionType) {
    debugLog('Sending signal', this.debug);

    const message = {
      room: connection.room,
      data: JSON.stringify(data),
    };

    this.socket.emit(SocketEvent.SIGNAL, message);
  }

  private handleConnection() {
    debugLog('Simple peer connected', this.debug);
    if (this.onConnectCallback) {
      this.onConnectCallback();
    }
  }

  private handleError(err: any) {
    if (this.onErrorCallback) {
      this.onErrorCallback(err);
    }
  }

  private handleData(data: any) {
    const decodedString = new TextDecoder('utf8').decode(data);
    const decodedJSON = JSON.parse(decodedString);
    this.onDataCallback(decodedJSON);
  }

  private handleClose() {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }

    debugLog('Closing connection', this.debug);
  }

  private getPeerOptions(initiator: boolean) {
    const options = {
      initiator,
    } as any;

    // if (typeof this.localStream !== 'undefined') {
    //   options.stream = this.localStream;
    // }

    const spOptions = Object.entries(this.simplePeerOptions);

    if (spOptions.length > 0) {
      for (const [key, value] of spOptions) {
        options[key] = value;
      }
    }

    return options;
  }
}

function debugLog(message: string, debug: boolean) {
  if (debug) {
    console.log(message);
  }
}
