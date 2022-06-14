import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Channel } from '../utils/consts';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channel, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channel, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: Channel) {
      ipcRenderer.removeAllListeners(channel);
    },
    invoke(channel: Channel, args: unknown[]) {
      return ipcRenderer.invoke(channel, args);
    },
  },
});
