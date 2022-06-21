/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { PeerServer } from 'peer';
import Store from 'electron-store';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { startGrpcHandler } from './handlers/grpc-handler';
import { startFilesHandler } from './handlers/files-handler';
import { startGrpcServer } from '../grpc/greeter-server';
import { startStoreHandler } from './handlers/store-handler';
import { MinResolution } from '../utils/consts';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { width, height } = getResolution();

  mainWindow = new BrowserWindow({
    show: false,
    width,
    height,
    minWidth: MinResolution.WIDTH,
    minHeight: MinResolution.HEIGHT,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

const getResolution = () => {
  const store = new Store();
  if (!store.has('resolution')) {
    return { width: MinResolution.WIDTH, height: MinResolution.HEIGHT };
  }
  const resolution = store.get('resolution') as string;
  if (resolution === 'max') {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return { width, height };
  }
  const [loadedWidth, loadedHeight] = resolution.split(',').map((val) => (Number.isNaN(val) ? undefined : Number(val)));
  return { width: loadedWidth ?? MinResolution.WIDTH, height: loadedHeight ?? MinResolution.HEIGHT };
};

const runUtils = () => {
  startGrpcServer().catch((err) => console.log(err));
  startGrpcHandler().catch((err) => console.error(err));
  startFilesHandler().catch((err) => console.error(err));
  startStoreHandler();
  PeerServer({ port: 50055 });
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    runUtils();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
