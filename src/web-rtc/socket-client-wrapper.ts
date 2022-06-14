import { io, Socket } from 'socket.io-client';
import { SimplePeerOptions, SimplePeerWrapper, ConnectionType } from './simple-peer-wrapper';
import { SocketEvent } from '../utils/consts';

export interface SocketClientWrapperProps {
  serverUrl: string;
  debug: boolean;
  simplePeerOptions: SimplePeerOptions;
}

export class SocketClientWrapper {
  private readonly debug: boolean;
  private readonly socket: Socket;

  peerClient: SimplePeerWrapper;

  constructor({ serverUrl, debug = false, simplePeerOptions = {} }: SocketClientWrapperProps) {
    this.debug = debug;

    debugLog(`Connecting socket to: ${serverUrl}`, this.debug);
    this.socket = io(serverUrl);

    this.peerClient = new SimplePeerWrapper(this.socket, this.debug, simplePeerOptions);

    // if (typeof stream !== 'undefined') {
    //   this.peerClient.setlocalStream(stream);
    // }

    this.initSocket();
  }

  private initSocket() {
    this.socket.on(SocketEvent.CREATED, (room) => this.handleCreated(room));
    this.socket.on(SocketEvent.FULL, (room) => this.handleFullRoom(room));
    this.socket.on(SocketEvent.JOIN, (room) => this.handleJoinRoom(room));
    this.socket.on(SocketEvent.JOINED, (room) => this.handleJoinedRoom(room));
    this.socket.on(SocketEvent.INITIATE, (room) => this.handleInitPeer(room));
    this.socket.on(SocketEvent.SIGNAL, (room) => this.handleSendSignal(room));
    this.socket.on(SocketEvent.MESSAGE, (message) => this.handleMessage(message));

    this.startSocketCommunication();
  }

  private startSocketCommunication() {
    this.socket.emit(SocketEvent.CREATE_JOIN);
    debugLog('Attempted to create or join a room', this.debug);
  }

  private handleCreated(room: string) {
    debugLog(`Created room: ${room}`, this.debug);
  }

  private handleFullRoom(room: string) {
    debugLog(`Room ${room} is full`, this.debug);
  }

  private handleJoinRoom(room: string) {
    debugLog(`Another peer made a request to join room: ${room}`, this.debug);
    debugLog(`This peer is the initiator of room: ${room}!`, this.debug);

    this.logConnection(room, { initiator: true, roomReady: true, peerStarted: false });
    if (this.peerClient.initPeerRequest) {
      debugLog('Initiating peer from handle join', this.debug);
      this.peerClient.init();
    }
  }

  private handleJoinedRoom(room: string) {
    debugLog(`Joined ${room}`, this.debug);

    this.logConnection(room, { initiator: false, roomReady: true, peerStarted: false });
    if (this.peerClient.initPeerRequest) {
      debugLog('Initiating peer from handle joined', this.debug);
      this.peerClient.init();
    }
  }

  private handleInitPeer(room: string) {
    const connection = this.findConnection(room);
    this.peerClient.attemptPeerStart(connection);
  }

  private handleSendSignal(message: { room: string; data: any }) {
    const connection = this.findConnection(message.room);
    if (!connection) {
      return;
    }

    debugLog('Receiving simple signal data', this.debug);
    if (!connection.peerStarted) {
      debugLog('Creating peer from message', this.debug);
      this.peerClient.createPeerConnection(connection);
      connection.peer.signal(message.data);
    } else {
      connection.peer.signal(message.data);
    }
  }

  private handleMessage(message: { type: string }) {
    debugLog(`Message: ${JSON.stringify(message)}`, this.debug);
  }

  private logConnection(
    room: string,
    { initiator, roomReady, peerStarted }: { initiator: boolean; roomReady: boolean; peerStarted: boolean },
  ) {
    debugLog('Logging connection', this.debug);
    const newConnection = {
      room,
      initiator,
      roomReady,
      peerStarted,
    };

    this.peerClient.connections.push(newConnection);
  }

  private findConnection(room: string): ConnectionType | null {
    let connection = null;

    this.peerClient.connections.forEach((peerConnection) => {
      if (peerConnection.room === room) {
        connection = peerConnection;
      }
    });

    if (connection) {
      debugLog(`Found the connection for room: ${room}`, this.debug);
    } else {
      debugLog(`Connection for room: ${room} doesn't exist`, this.debug);
    }

    return connection;
  }
}

function debugLog(message: string, debug: boolean) {
  if (debug) {
    console.log(message);
  }
}
