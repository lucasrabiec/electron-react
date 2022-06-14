export enum Channel {
  GRPC_HELLO = 'grpc-hello',
  GRPC_COUNTER = 'grpc-counter',
  GRPC_ABORT = 'grpc-abort',
  FILES_SAVE_DIALOG = 'files-save-dialog',
  FILES_OPEN_DIALOG = 'files-open-dialog',
}

export enum SocketEvent {
  MESSAGE = 'message',
  INITIATE = 'initiate',
  SIGNAL = 'signal',
  CREATE_JOIN = 'create/join',
  HANGUP = 'hangup',
  DISCONNECT = 'disconnect',
  CREATED = 'created',
  JOIN = 'join',
  JOINED = 'joined',
  FULL = 'full',
  LOG = 'log',
}
