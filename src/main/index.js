import { app, BrowserWindow, globalShortcut } from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 465
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  globalShortcut.register('VolumeUp', () => {
    mainWindow.webContents.send('mp-volume-up');
  })

  globalShortcut.register('VolumeDown', () => {
    mainWindow.webContents.send('mp-volume-down');
  })

  globalShortcut.register('VolumeMute', () => {
    mainWindow.webContents.send('mp-volume-mute');
  })

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('mp-media-next');
  })

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('mp-media-prev');
  })

  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('mp-play-pause');
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
