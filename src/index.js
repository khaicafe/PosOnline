const { app, BrowserWindow, screen, ipcRenderer } = require('electron');
const path = require('path');
// const { Printer } = require('electron-printer');
// const printers = ipcRenderer.invoke('serivce-printer-list');
// console.log(printers)
// import { app, protocol, BrowserWindow, ipcMain } from 'electron'
// const { PosPrinter } = require('electron-pos-printer');


// ipcMain.on('getPrinters', (event) => {
//   const printers = Printer.getPrinters();

//   const printerNames = printers.map(printer => printer.name);

//   const mainWindow = BrowserWindow.fromWebContents(event.sender);
//   mainWindow.webContents.send('printerList', printerNames);
// });

let mainWindow;
let adWindow;
const windows = [];
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }
// run this as early in the main process as possible.
if (require('electron-squirrel-startup')) app.quit();

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
  // mainWindow.loadURL('https://dev-pos.neomenu.vn/staff')
  mainWindow.loadURL(' https://a3ca-116-110-40-48.ngrok-free.app')

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.maximize();
  mainWindow.resizable = false;
  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)
  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
  // const displays = screen.getAllDisplays();

  // // Assuming there is at least one secondary display
  // const secondaryDisplay = displays.find((display) => !display.primary);

  const displays = screen.getAllDisplays();
  // const secondaryDisplay = displays.find((display) => {
  //   return display.bounds.x !== 0 || display.bounds.y !== 0;
  // });


  adWindow = new BrowserWindow({
    x: displays[1].bounds.x,
    y: displays[1].bounds.y,
    width: displays[1].size.width,
    height: displays[1].size.height,
    frame: false, // Ẩn thanh title
    titleBarStyle: 'hidden', // Ẩn thanh title trên macOS
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // Thêm cửa sổ mới vào mảng windows
  windows.push(adWindow);
  adWindow.loadURL('https://dev-pos.neomenu.vn/miniweb')
  adWindow.maximize();
  adWindow.resizable = false;
  adWindow.setMenu(null)
  adWindow.setMenuBarVisibility(false)
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
  // createAdWindow();
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

// Kiểm tra xem trình duyệt có hỗ trợ USB API hay không
// if ('usb' in navigator) {
//   // Yêu cầu quyền truy cập vào USB
//   navigator.usb.requestDevice({ filters: [{ usagePage: 0x07, usage: 0x01 }] })
//     .then(devices => {
//       // Lấy danh sách các máy in USB
//       devices.forEach(device => {
//         console.log('Device name:', device.productName);
//         console.log('Vendor ID:', device.vendorId);
//         console.log('Product ID:', device.productId);
//         console.log('------------------------------------');
//       });
//     })
//     .catch(error => {
//       console.log('Không thể truy cập vào USB:', error);
//     });
// } else {
//   console.log('Trình duyệt không hỗ trợ USB API.');
// }



