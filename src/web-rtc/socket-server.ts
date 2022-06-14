import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketEvent } from '../utils/consts';

export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export function runSocketServer(port: number, debug: boolean) {
  const rooms: string[] = [];
  const ioServer = new Server(port, {
    cors: {
      origin: 'http://localhost:1212',
    },
  });
  let freeRoom: string;

  (function initServer() {
    ioServer.on('connection', (socket) => {
      socket.on(SocketEvent.MESSAGE, (message) => handleMessage(message, socket));
      socket.on(SocketEvent.INITIATE, (room) => handleInitiatePeer(room, socket));
      socket.on(SocketEvent.SIGNAL, (message) => handleSendSignal(message, socket));
      socket.on(SocketEvent.CREATE_JOIN, () => handleCreateOrJoin(socket));
      socket.on(SocketEvent.HANGUP, () => handleHangup());
      socket.on(SocketEvent.DISCONNECT, (reason) => handleDisconnect(reason));
    });
  })();

  function handleMessage(message: string, socket: SocketType) {
    debugLog(`Client message: ${message}`, debug);
    socket.broadcast.emit(SocketEvent.MESSAGE, message);
  }

  function handleInitiatePeer(room: string, socket: SocketType) {
    debugLog(`Server initiating peer in room: ${room}`, debug);
    socket.to(room).emit(SocketEvent.INITIATE, room);
  }

  function handleSendSignal(message: { room: string }, socket: SocketType) {
    debugLog(`Handling signal to room: ${message.room}`, debug);
    socket.to(message.room).emit(SocketEvent.SIGNAL, message);
  }

  function handleCreateOrJoin(socket: SocketType) {
    const clientIds = Array.from(ioServer.sockets.sockets.keys());
    const clientsCount = clientIds.length;

    debugLog(`Number of clients: ${clientsCount}`, debug);

    if (freeRoom) {
      handleEvenClient(socket);
    } else {
      handleOddClient(socket);
    }
  }

  function handleOddClient(socket: SocketType) {
    const room = createRoom();
    socket.join(room);
    socket.emit(SocketEvent.CREATED, room, socket.id);
    debugLog(`Client ID ${socket.id} created room ${room}`, debug);
    freeRoom = room;
  }

  function handleEvenClient(socket: SocketType) {
    const room = freeRoom;
    ioServer.sockets.in(room).emit(SocketEvent.JOIN, room);
    socket.join(room);
    socket.emit(SocketEvent.JOINED, room, socket.id);
    debugLog(`Client ID ${socket.id} joined room ${room}`, debug);
    freeRoom = '';
  }

  function handleHangup() {
    debugLog(`Received hangup`, debug);
  }

  function handleDisconnect(reason: string) {
    debugLog(`Disconnecting because: ${reason}`, debug);
  }

  function createRoom() {
    const room = `room${rooms.length}`;
    rooms.push(room);
    debugLog(`Number of rooms: ${rooms.length}`, debug);

    return room;
  }
}

function debugLog(message: string, debug: boolean) {
  if (debug) {
    console.log(message);
  }
}
