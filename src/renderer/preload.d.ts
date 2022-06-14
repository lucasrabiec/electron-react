import { Channel } from '../utils/consts';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channel, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        removeAllListeners(channel: string): void;
        invoke(channel: Channel, args: unknown[]): Promise<unknown>;
      };
    };
  }
}

export {};
