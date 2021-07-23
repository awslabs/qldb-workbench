export {};

declare global {
  interface Window {
    // OS Theme from Electron is added to window object:
    // https://www.electronjs.org/docs/tutorial/dark-mode
    darkMode?: () => Promise<boolean>;
  }
}
