import { Channels } from '../utils/consts';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        removeAllListeners(channel: string): void;
        invoke(channel: Channels, args: unknown[]): Promise<unknown>;
      };
    };
  }
}

export {};
