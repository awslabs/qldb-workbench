import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import * as electronIsDev from "electron-is-dev";
const path = require("path");

if (electronIsDev.valueOf()) {
  console.log("Electron started in development mode");
  console.log("__dirname:", __dirname);
  console.log("process.platform:", process.platform);
}

async function loadFile(win: BrowserWindow): Promise<void> {
  await win.loadFile("../assets/index.html");
}

async function loadDevUrl(win: BrowserWindow): Promise<void> {
  const url = "http://localhost:9000";

  // Wait 2s for the webpack server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    await win.loadURL(url);
  } catch {
    // Fallback to loading file if webpack server is not running
    await loadFile(win);
  }

  win.webContents.openDevTools();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1680,
    height: 1050,
    webPreferences: {
      preload: path.join(__dirname, "electron-preload.js"),
    },
  });

  // Setup integration point for access to OS Theme
  // more: https://www.electronjs.org/docs/tutorial/dark-mode
  ipcMain.handle("dark-mode", () => {
    return nativeTheme.shouldUseDarkColors;
  });

  if (electronIsDev) {
    loadDevUrl(win);
  } else {
    loadFile(win);
  }

  return win;
}

// Create myWindow, load the rest of the app, etc...
app.whenReady().then(() => {
  if (electronIsDev) {
    installExtension(REACT_DEVELOPER_TOOLS, { forceDownload: true })
      .then((name) => {
        console.log(`Added Extension: ${name}`);
        createWindow();
      })
      .catch((err) => console.log("An error occurred: ", err));
  } else {
    createWindow();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
