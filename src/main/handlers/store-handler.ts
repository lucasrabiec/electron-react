import Store from 'electron-store';
import { ipcMain } from 'electron';
import { Channel, StoreType } from '../../utils/consts';

export function startStoreHandler() {
  const store = new Store<StoreType>();

  (() => {
    if (!store.has('resolution')) {
      store.set('resolution', '1280,720');
    }
  })();

  ipcMain.handle(Channel.STORE_GET, (_, val) => {
    return store.get(val);
  });
  ipcMain.on(Channel.STORE_SET, (_, key, val) => {
    store.set(key, val);
  });
  ipcMain.handle(Channel.STORE_GET_ALL, () => {
    return store.store;
  });
}
