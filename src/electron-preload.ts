// Setup integration point for access to OS Theme
// more: https://www.electronjs.org/docs/tutorial/dark-mode
window.onload = () => {
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("darkMode", () =>
    ipcRenderer.invoke("dark-mode")
  );
};
