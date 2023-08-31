const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let mainWindow;
let adWindow;
const windows = [];
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     // width: 800,
//     // height: 600,
//     // webPreferences: {
//     //   preload: path.join(__dirname, 'preload.js'),
//     // },
//   });
function createMainWindow() {
  const mainScreen = screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
    x: mainScreen.bounds.x,
    y: mainScreen.bounds.y,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // Thêm cửa sổ mới vào mảng windows
  windows.push(mainWindow); 
  mainWindow.loadURL('https://dev-pos.neomenu.vn/staff')

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.maximize();
  mainWindow.resizable = false;
  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
   // Bắt sự kiện khi cửa sổ được đóng
   mainWindow.on('close', (event) => {
    // Kiểm tra xem cửa sổ hiện tại có phải là cửa sổ cuối cùng không
    if (windows.length === 1) {
      // Đóng ứng dụng nếu cửa sổ hiện tại là cửa sổ cuối cùng
      app.quit();
    } else {
      // Nếu không, đóng tất cả các cửa sổ còn lại
      windows.forEach((window) => {
        if (window !== mainWindow) {
          try {
            window.close();
          } catch (error) {
            console.log(error)
          }
        }
      });
    }
  })
}
//   // Load a remote URL
//   mainWindow.loadURL('https://dev-pos.neomenu.vn/staff/')
// };

function createAdWindow() {
  const displays = screen.getAllDisplays();

  // Assuming there is at least one secondary display
  const secondaryDisplay = displays.find((display) => !display.primary);

  adWindow = new BrowserWindow({
    x: secondaryDisplay.bounds.x,
    y: secondaryDisplay.bounds.y,
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });
// Thêm cửa sổ mới vào mảng windows
windows.push(adWindow);
  adWindow.loadURL('https://dev-pos.neomenu.vn/miniweb')

  adWindow.on('closed', () => {
    adWindow = null;
  });
   // Bắt sự kiện khi cửa sổ được đóng
   adWindow.on('close', (event) => {
    // Kiểm tra xem cửa sổ hiện tại có phải là cửa sổ cuối cùng không
    if (windows.length === 1) {
      // Đóng ứng dụng nếu cửa sổ hiện tại là cửa sổ cuối cùng
      app.quit();
    } else {
      // Nếu không, đóng tất cả các cửa sổ còn lại
      windows.forEach((window) => {
        if (window !== adWindow) {
          try {
            window.close();
          } catch (error) {
            console.log(error)
          }
         
        }
      });
    }
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.on('ready', () => {
  createMainWindow();
  createAdWindow();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
  if (adWindow === null) {
    createAdWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.





