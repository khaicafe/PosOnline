// yarn make --arch=ia32 // old dùng electron forge
// yarn package // electron build
// require("@electron/remote/main").initialize();
// const mainRemote = require("@electron/remote/main");
// const { app, BrowserWindow, dialog, ipcMain, screen } = require('electron');
const { app, BrowserWindow, dialog, ipcMain, screen } = require('electron');
// const {PosPrinter} = require("./libPOS/index");
app.commandLine.appendSwitch ("disable-http-cache");
const path = require('path');
const fs = require('fs-extra');
const {autoUpdater} = require('electron-updater')
autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "khaicafe",
  "repo": "PosOnline"
  // "token": "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"
});

const isDev = require("electron-is-dev");
// make log electron cmd
const log = require('electron-log')
var pjson = require('./package.json');

log.log("Application version = " + pjson.version);
// log.log("Application version =" + app.getVersion())

const localAppDataPath = path.join(app.getPath('appData'), '..', 'Local'); // Đường dẫn đến thư mục cần xóa
const folderD = localAppDataPath + '\\' +pjson.name + '-updater'
const folderLog = `${path.join(localAppDataPath)}/log`
// log.transports.file.resolvePath = () => path.join('G:/NeoCafe Music V2/PosMusic-Autoupdate/', 'log/main.log')
log.transports.file.resolvePath = () => path.join(localAppDataPath, '/log/NeoMusic.log')

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let mainWindow, printers, adWindow
const windows = [];
let updateDownloaded = false;

// run this as early in the main process as possible.
// if (require('electron-squirrel-startup')) app.quit();

// khởi động cùng window ds
// app.setLoginItemSettings({
//   openAtLogin: true,
//   // openAsHidden: true,
//   path: app.getPath('exe'),
// });


// Delete folder update
fs.remove(folderD, (err) => {
  if (err) {
    console.error('Error deleting folder:', err);
  } else {
    console.log('Folder deleted successfully');
  }
});
// Delete folder Log
fs.remove(folderLog, (err) => {
  if (err) {
    console.error('Error deleting folder:', err);
  } else {
    console.log('Folder deleted successfully');
  }
});


// send value for ui
const dispatch = (data) => {
    mainWindow.webContents.send('message', data)
  }

// Handle creating/removing shortcuts on Windows when installing/uninstalling
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }
///////////////////////// power shell //////////////////////
// powershell -command "&{$p='HKCU:SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3';$v=(Get-ItemProperty -Path $p).Settings;$v[8]=2;&Set-ItemProperty -Path $p -Name Settings -Value $v;&Stop-Process -f -ProcessName explorer}"
// var spawn = require("child_process").spawn,child;
// child = spawn("powershell.exe",["Set-UserPhoto -Identity 'NeoCafe' -PictureData ([System.IO.File]::ReadAllBytes('logo.jpg'))"]);
// child.stdout.on("data",function(data){
//     console.log("Powershell Data: " + data);
// });
// child.stderr.on("data",function(data){
//     console.log("Powershell Errors: " + data);
// });
// child.on("exit",function(){
//     console.log("Powershell Script finished");
// });
// child.stdin.end(); //end input   
// /////////////////////////////////// cmd ///////////////////
// const exec = require('child_process').exec;

// function execute(command, callback) {
//     exec(command, (error, stdout, stderr) => { 
//         callback(stdout); 
//     });
// };

// // call the function
// execute('ping -c 4 0.0.0.0', (output) => {
//     console.log(output);
// });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createMainWindow () {
  const mainScreen = screen.getPrimaryDisplay();
  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  mainWindow = new BrowserWindow({
    // x: 0,
    // y: 0,
    // // width: 350,
    // // height: 225,
    width: width,
    height: height,
    // width, height,
    // backgroundColor: "#363636",
    // enableLargerThanScreen: true,
    // skipTaskbar: true,
    // disableAutoHideCursor: false,
    // fullscreen: true,
    frame: false,
    maximizable: false,
    minimizable: false,
    center: true,
    autoHideMenuBar: true,
    icon: __dirname + '/icon.ico',
    maximizable: false, // Vô hiệu hóa maximize
    webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true
    }
  })
 // Tạo một vòng lặp để kiểm tra kết nối với server
 const serverCheckInterval = setInterval(() => {
  // Thực hiện một HTTP request đến server
  // Ở đây, sử dụng module `http` để gửi một GET request
  const http = require('http');
  const options = {
    hostname: 't.pos.imenu.tech', // Thay bằng địa chỉ server thực tế
    port: 80, // Port của server
    path: '/staff/', // Đường dẫn trang bạn muốn kiểm tra
    method: 'GET',
  };

  const request = http.request(options, (response) => {
    if (response.statusCode === 200) {
      clearInterval(serverCheckInterval); // Dừng vòng lặp khi kết nối thành công
      mainWindow.loadURL('https://t.pos.imenu.tech/staff/'); // Tải trang web khi kết nối thành công
    }
    else {
      console.log('Không thể kết nối với server:', response.statusCode);
    }
    });

    request.on('error', (error) => {
      mainWindow.webContents.reloadIgnoringCache();
      // Xử lý lỗi nếu không thể kết nối với server
      console.log('Không thể kết nối với server:', error.message);
    });

    request.end();
  }, 5000); // Kiểm tra mỗi 5 giây (có thể điều chỉnh thời gian kiểm tra)

  // console.log(mainWindow)
  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.loadURL('https://dev-pos.neomenu.vn/staff/')
  // mainWindow.loadURL('https://t.pos.imenu.tech/')
  
  // hủy event minimize
  mainWindow.on('minimize',function(event){
    event.preventDefault();
  });

  // anti close
  // mainWindow.on('close', function (event) {
  //     event.preventDefault();
  // });

  // mainWindow.maximize();
  mainWindow.resizable = false;
  // mainWindow.setMenu(null)
  // mainWindow.setMenuBarVisibility(false)
  // mainWindow.setAlwaysOnTop(true, "level");

  // Thêm cửa sổ mới vào mảng windows
  windows.push(mainWindow); 
  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: "detach" });
  isDev ? mainWindow.webContents.openDevTools({ mode: "detach" }) : autoUpdater.checkForUpdates();

  // Get info Printer
  // printers = await mainWindow.webContents.getPrintersAsync()
  // printers.forEach(printer => {
  //   console.log('Name:', printer.name);
  //   console.log('Description:', printer.description);
  //   console.log('Is Default Printer:', printer.isDefault);
  //   console.log('----------------------');
  // });
  let grantedDeviceThroughPermHandler
  mainWindow.webContents.on('select-usb-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-usb-device` is called.
    mainWindow.webContents.on('usb-device-added', (event, device) => {
      console.log('usb-device-added FIRED WITH', device)
      // Optionally update details.deviceList
    })

    mainWindow.webContents.session.on('usb-device-removed', (event, device) => {
      console.log('usb-device-removed FIRED WITH', device)
      // Optionally update details.deviceList
    })

    event.preventDefault()
    // if (details.deviceList && details.deviceList.length > 0) {
    //   const deviceToReturn = details.deviceList.find((device) => {
    //     return !grantedDeviceThroughPermHandler || (device.deviceId !== grantedDeviceThroughPermHandler.deviceId)
    //   })
    //   if (deviceToReturn) {
    //     callback(deviceToReturn.deviceId)
    //   } else {
    //     callback()
    //   }
    // }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    console.log('check permission', requestingOrigin, details)
    return true
    // if (permission === 'usb' && details.securityOrigin === 'file:///') {
    //   return true
    // }
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    return true
    // if (details.deviceType === 'usb' && details.origin === 'file://') {
    //   if (!grantedDeviceThroughPermHandler) {
    //     grantedDeviceThroughPermHandler = details.device
    //     console.log('permission Device', grantedDeviceThroughPermHandler)
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  })
  // mainRemote.enable(mainWindow.webContents);
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
  // return mainWindow
}

function createAdWindow() {
  const displays = screen.getAllDisplays();
  adWindow = new BrowserWindow({
    x: displays[1].bounds.x,
    y: displays[1].bounds.y,
    width: displays[1].size.width,
    height: displays[1].size.height,
    maximizable: false,
    minimizable: false,
    autoHideMenuBar: true,
    fullscreen: true, // full
    frame: false, // Ẩn thanh title
    skipTaskbar: true, // hide taskbar
    titleBarStyle: 'hidden', // Ẩn thanh title trên macOS
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // Thêm cửa sổ mới vào mảng windows
  windows.push(adWindow);
  // adWindow.loadURL('https://dev-pos.neomenu.vn/miniweb')
  adWindow.loadURL('https://t.pos.imenu.tech/miniweb')
  adWindow.maximize();
  adWindow.resizable = false;
  adWindow.setMenu(null)
  adWindow.setMenuBarVisibility(false)
  adWindow.setAlwaysOnTop(true, "level");
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
  // adWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
  //   console.log('list', details, event)
  //   // Add events to handle devices being added or removed before the callback on
  //   // `select-usb-device` is called.
  //   adWindow.webContents.session.on('usb-device-added', (event, device) => {
  //     console.log('list', details)
  //     console.log('usb-device-added FIRED WITH', device)
  //     // Optionally update details.deviceList
  //   })

  //   adWindow.webContents.session.on('usb-device-removed', (event, device) => {
  //     console.log('list', details)
  //     console.log('usb-device-removed FIRED WITH', device)
  //     // Optionally update details.deviceList
  //   })
  //   console.log('list', details.deviceList)
  //   event.preventDefault();


  //   // if (details.deviceList && details.deviceList.length > 0) {
  //   //   const deviceToReturn = details.deviceList.find((device) => {
  //   //     return !grantedDeviceThroughPermHandler || (device.deviceId !== grantedDeviceThroughPermHandler.deviceId)
  //   //   })
  //   //   if (deviceToReturn) {
  //   //     callback(deviceToReturn.deviceId)
  //   //   } else {
  //   //     callback()
  //   //   }
  //   // }
  // })

  // adWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
  //   console.log('setPermissionCheckHandler', permission,details)
  //   return true
  //   // if (permission === 'usb' && details.securityOrigin === 'file:///') {
  //   //   return true
  //   // }
  // })
}

// check app đã run hay chưa
// let myWindow = null
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  // app.on('second-instance', (event, commandLine, workingDirectory) => {
  //   // Someone tried to run a second instance, we should focus our window.
  //   if (myWindow) {
  //     if (myWindow.isMinimized()) myWindow.restore()
  //     myWindow.focus()
  //   }
  // })
  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {
    createMainWindow();
    try {
      createAdWindow();
    } catch (error) {
      console.log('khong co man 2')
    }
    // mainWindow.webContents.on('did-finish-load', () => {
    //   mainWindow.webContents.send('version', app.getVersion())
    // })
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// app.whenReady().then(() => {
//   createMainWindow();
//   try {
//     createAdWindow();
//   } catch (error) {
//     console.log('khong co man 2')
//   }
//   mainWindow.webContents.on('did-finish-load', () => {
//     mainWindow.webContents.send('version', app.getVersion())
//   })
  
// })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/////////////////////// event autoupdate ////////////////
autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoDownload = true

// autoUpdater.on("checking-for-update", () => {
//     log.info('checking-for-update...')
//     // dispatch('checking-for-update.')
// })
// autoUpdater.on("update-available", (info) => {
//   log.info('update-available...NeoMusic v' + info.version)
//    // Hiển thị một hộp thoại xác nhận cho người dùng
//    const dialogOptions = {
//     type: 'info',
//     buttons: ['Yes', 'No'],
//     title: `Update NeoMusic v${info.version}`,
//     message: 'An update is available. Do you want to download it?',
//   };

//   dialog.showMessageBox(dialogOptions).then((result) => {
//     // Nếu người dùng chọn "Yes"
//     if (result.response === 0) {
//       mainWindow.webContents.send('Update_available', 'test')
//       // Tiến hành tải xuống bản cập nhật
//       autoUpdater.downloadUpdate();
//     }
//   });
//     // log.info('update-available')
//     // const dialogOpts = {
//     //   type: 'info',
//     //   buttons: ['Ok', 'Cancel'],
//     //   title: 'Application Update',
//     //   message: process.platform === 'win32' ? releaseNotes : releaseName,
//     //   detail: 'A new version is being downloaded.'
//     // }
//     // dialog.showMessageBox(dialogOpts, (response) => {
//     //   log.info('response', response)
//     //   if (response.response === 0){
//     //     autoUpdater.on("download-progress", (progressTrack) => {
//     //       log.info('\n\ndownload-progress')
//     //       // log.info(progressTrack)
//     //       mainWindow.webContents.send('download-progress', progressTrack.percent)
//     //      })
//     //   }
//     // });
// })
// autoUpdater.on('update-not-available', (info) => {
//     dispatch('Update not available.')
//   })
// autoUpdater.on("error", (err) => {
//     log.warn('Error in auto-updater' + err)
// })
// autoUpdater.on("download-progress", (progressObj) => {
//     // log.info('\ndownload-progress')
//     // log.info(progressObj)
//     mainWindow.webContents.send('download-progress', progressObj.percent)
// })
// autoUpdater.on("update-downloaded", (info) => {
//   if (!updateDownloaded) {
//     // Đánh dấu sự kiện đã được gọi
//     updateDownloaded = true;
//     log.info('update_downloaded')
//     mainWindow.webContents.send('update_downloaded', 'test')
//     const dialogOpts = {
//       type: 'info',
//       buttons: ['Restart', 'Later'],
//       title:  `NeoMusic v${info.version}`,
//       // message: process.platform === 'win32' ? releaseNotes : releaseName,
//       detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//     };
//     dialog.showMessageBox(dialogOpts).then((returnValue) => {
//       if (returnValue.response === 0) autoUpdater.quitAndInstall()
//       // else autoUpdater.autoInstallOnAppQuit = false
//     })
//   }
// })

// /////////////////////// event nhận value từ renderer.js ///////////
// ipcMain.on("test-print", (event, data) => {
//   console.log('name print')
//   testPrint()
// });
// function testPrint() {
//     const options = {
//         preview: false,              //  width of content body
//         silent: true,
//         margin: 'auto',            // margin of content body
//         copies: 1,                    // Number of copies to print
//         printerName: 'RONGTA 58mm Series Printer',        // printerName: string, check with webContent.getPrinters()
//         timeOutPerLine: 1000,
//         pageSize: '80mm'  // page size
//     }

//     const data = [
//         {
//             type: 'table',
//             style: {border: '1px solid #ddd'},             // style the table
//             // list of the columns to be rendered in the table header
//             tableHeader: [{type: 'text', value: 'People'}, {
//                 type: 'image',
//                 url: 'https://randomuser.me/api/portraits/men/13.jpg'
//             }],
//             // multidimensional array depicting the rows and columns of the table body
//             tableBody: [
//                 [{type: 'text', value: 'Marcus'}, {
//                     type: 'image',
//                     url: 'https://randomuser.me/api/portraits/men/43.jpg'
//                 }],
//                 [{type: 'text', value: 'Boris'}, {
//                     type: 'image',
//                     url: 'https://randomuser.me/api/portraits/men/41.jpg'
//                 }],
//                 [{type: 'text', value: 'Andrew'}, {
//                     type: 'image',
//                     url: 'https://randomuser.me/api/portraits/men/23.jpg'
//                 }],
//                 [{type: 'text', value: 'Tyresse'}, {
//                     type: 'image',
//                     url: 'https://randomuser.me/api/portraits/men/53.jpg'
//                 }],
//             ],
//             // list of columns to be rendered in the table footer
//             tableFooter: [{type: 'text', value: 'People'}, 'Image'],
//             // custom style for the table header
//             tableHeaderStyle: {backgroundColor: 'red', color: 'white'},
//             // custom style for the table body
//             tableBodyStyle: {'border': '0.5px solid #ddd'},
//             // custom style for the table footer
//             tableFooterStyle: {backgroundColor: '#000', color: 'white'},
//         },
//         {
//             type: 'image',
//             url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
//             position: 'center',                                  // position of image: 'left' | 'center' | 'right'
//             width: '60px',                                           // width of image in px; default: auto
//             height: '60px',
//         },
//         {
//             type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//             value: 'SAMPLE HEADING',
//             style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
//         },
//         {
//             type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//             value: 'Secondary text',
//             style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
//         },
//         {
//             type: 'barCode',
//             value: '023456789010',
//             height: 40,                     // height of barcode, applicable only to bar and QR codes
//             width: 2,                       // width of barcode, applicable only to bar and QR codes
//             displayValue: true,             // Display value below barcode
//             fontsize: 12,
//         },
//         {
//             type: 'qrCode',
//             value: 'https://github.com/Hubertformin/electron-pos-printer',
//             height: 55,
//             width: 55,
//             position: 'right'
//         },
//         {
//             type: 'table',
//             // style the table
//             style: {border: '1px solid #ddd'},
//             // list of the columns to be rendered in the table header
//             tableHeader: ['Animal', 'Age'],
//             // multidimensional array depicting the rows and columns of the table body
//             tableBody: [
//                 ['Cat', 2],
//                 ['Dog', 4],
//                 ['Horse', 12],
//                 ['Pig', 4],
//             ],
//             // list of columns to be rendered in the table footer
//             tableFooter: ['Animal', 'Age'],
//             // custom style for the table header
//             tableHeaderStyle: {backgroundColor: '#000', color: 'white'},
//             // custom style for the table body
//             tableBodyStyle: {'border': '0.5px solid #ddd'},
//             // custom style for the table footer
//             tableFooterStyle: {backgroundColor: '#000', color: 'white'},
//         }
//     ]

//     try {
//         printers.print(data, options)
//             .then(() => console.log('done'))
//             .catch((error) => {
//                 console.error(error);
//             });
//     } catch (e) {
//         console.log(printers)
//         console.log(e);
//     }
// }