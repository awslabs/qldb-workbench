// Setup integration point for access to OS Theme
// more: https://www.electronjs.org/docs/tutorial/dark-mode
window.onload = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("darkMode", () =>
    ipcRenderer.invoke("dark-mode")
  );
};
