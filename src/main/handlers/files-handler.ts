import { app, dialog, ipcMain } from 'electron';
import fs from 'fs';
import fsPromise from 'fs/promises';
import { Channel } from '../../utils/consts';

export async function startFilesHandler() {
  ipcMain.handle(Channel.FILES_SAVE_DIALOG, async (_, [fileContent]) => {
    const saveDialogReturnValue = await dialog.showSaveDialog({ defaultPath: `${app.getPath('desktop')}/example.txt` });
    if (!saveDialogReturnValue.filePath || saveDialogReturnValue.canceled) {
      return;
    }

    fs.writeFile(saveDialogReturnValue.filePath, fileContent, () => {});
  });

  ipcMain.handle(Channel.FILES_OPEN_DIALOG, async () => {
    const openDialogReturnValue = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text', extensions: ['txt'] }],
    });
    if (!openDialogReturnValue.filePaths || openDialogReturnValue.canceled) {
      return '';
    }

    return fsPromise.readFile(openDialogReturnValue.filePaths[0], { encoding: 'utf8' });
  });
}
