export enum Channel {
  GRPC_HELLO = 'grpc-hello',
  GRPC_COUNTER = 'grpc-counter',
  GRPC_ABORT = 'grpc-abort',
  FILES_SAVE_DIALOG = 'files-save-dialog',
  FILES_OPEN_DIALOG = 'files-open-dialog',
  STORE_GET = 'store-get',
  STORE_SET = 'store-set',
  STORE_GET_ALL = 'store-get-all',
}

export interface StoreType {
  resolution: string;
}

export const MinResolution = {
  WIDTH: 1280,
  HEIGHT: 720,
};
