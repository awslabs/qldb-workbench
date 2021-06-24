import { app, BrowserWindow } from "electron";
import * as electronIsDev from "electron-is-dev";
import * as path from "path";

let myWindow: BrowserWindow | null = null;

if (electronIsDev.valueOf()) {
  console.log("Electron started in development mode");
  console.log("__dirname:", __dirname);
  console.log("process.platform:", process.platform);
}

require("electron-reload")(path.join(__dirname, ".."), {
  electron: undefined // this is deliberately not set because it causes SIGABRTs on MacOS
});

function createWindow() {
  if (myWindow) {
    return myWindow;
  }

  const win = new BrowserWindow({
    width: 1680,
    height: 1050,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("../assets/index.html").then(() => {
    if (electronIsDev.valueOf()) {
      win.webContents.toggleDevTools();
    }
  });

  return win;
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow!.isMinimized()) myWindow!.restore()
      myWindow.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    myWindow = createWindow()
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      myWindow = createWindow();
    }
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

}
