const path = require('path');
const { app, BrowserWindow, dialog, ipcMain } = require("electron");

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("src/index.html");
  // win.webContents.openDevTools();
  win.setMenu(null);

  ipcMain.on('open-folder-dialog', (event) => {
    const res = dialog.showOpenDialogSync(win, {
      properties: ['openDirectory']
    });
    if (Array.isArray(res)) {
      event.returnValue = res[0];
    } else {
      event.returnValue = res;
    }
  });

  ipcMain.on('open-file-dialog', (event) => {
    const res = dialog.showOpenDialogSync(win, {
      filters: [
        { name: 'json', extensions: ['json'] }
      ]
    });

    if (Array.isArray(res)) {
      event.returnValue = res[0];
    } else {
      event.returnValue = res;
    }
  });

  ipcMain.on('save-file-dialog', (event) => {
    let res = dialog.showSaveDialogSync(win, {
      filters: [
        { name: 'json', extensions: ['json'] }
      ]
    });

    if (!/.json$/i.test(res)) {
      res += '.json';
    }

    event.returnValue = res;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
