// yarn make --arch=ia32 // old dùng electron forge
// yarn package // electron build
// require("@electron/remote/main").initialize();
// const mainRemote = require("@electron/remote/main");
// // 


const { app, BrowserWindow, dialog, ipcMain, screen } = require('electron');
const {PosPrinter} = require("./dist/index");
app.commandLine.appendSwitch ("disable-http-cache");
const path = require('path');
const fs = require('fs-extra');
const {autoUpdater} = require('electron-updater')
autoUpdater.setFeedURL({
  "provider": "github",
  "owner": "khaicafe",
  "repo": "PosOnline",
  "token": "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"
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
app.setLoginItemSettings({
  openAtLogin: true,
  // openAsHidden: true,
  path: app.getPath('exe'),
});

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createMainWindow () {
  const mainScreen = screen.getPrimaryDisplay();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    // width: 350,
    // height: 225,
    width: 650,
    height: 430,
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
  // console.log(mainWindow)
  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL('https://dev-pos.neomenu.vn/staff/')
  // hủy event minimize
  mainWindow.on('minimize',function(event){
    event.preventDefault();
  });
  // anti close
  // mainWindow.on('close', function (event) {
  //     event.preventDefault();
  // });
  // mainWindow.maximize();
  // mainWindow.resizable = false;
  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)
  mainWindow.resizable = false;
  // Thêm cửa sổ mới vào mảng windows
  windows.push(mainWindow); 
  // Open the DevTools.
  // mainWindow.webContents.openDevTools({ mode: "detach" });
  isDev ? mainWindow.webContents.openDevTools({ mode: "detach" }) : autoUpdater.checkForUpdates();

  // Get info Printer
  printers = await mainWindow.webContents.getPrintersAsync()
  printers.forEach(printer => {
    console.log('Name:', printer.name);
    console.log('Description:', printer.description);
    console.log('Is Default Printer:', printer.isDefault);
    console.log('----------------------');
  });

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
  return mainWindow
}

function createAdWindow() {
  const displays = screen.getAllDisplays();
  adWindow = new BrowserWindow({
    x: displays[1].bounds.x,
    y: displays[1].bounds.y,
    width: displays[1].size.width,
    height: displays[1].size.height,
    frame: false, // Ẩn thanh title
    skipTaskbar: true, // hide taskbar
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
app.whenReady().then(() => {
  createMainWindow();
  createAdWindow();
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())
  })
  
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

/////////////////////// event autoupdate ////////////////
autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.autoDownload = false

autoUpdater.on("checking-for-update", () => {
    log.info('checking-for-update...')
    // dispatch('checking-for-update.')
})
autoUpdater.on("update-available", (info) => {
  log.info('update-available...NeoMusic v' + info.version)
   // Hiển thị một hộp thoại xác nhận cho người dùng
   const dialogOptions = {
    type: 'info',
    buttons: ['Yes', 'No'],
    title: `Update NeoMusic v${info.version}`,
    message: 'An update is available. Do you want to download it?',
  };

  dialog.showMessageBox(dialogOptions).then((result) => {
    // Nếu người dùng chọn "Yes"
    if (result.response === 0) {
      mainWindow.webContents.send('Update_available', 'test')
      // Tiến hành tải xuống bản cập nhật
      autoUpdater.downloadUpdate();
    }
  });
    // log.info('update-available')
    // const dialogOpts = {
    //   type: 'info',
    //   buttons: ['Ok', 'Cancel'],
    //   title: 'Application Update',
    //   message: process.platform === 'win32' ? releaseNotes : releaseName,
    //   detail: 'A new version is being downloaded.'
    // }
    // dialog.showMessageBox(dialogOpts, (response) => {
    //   log.info('response', response)
    //   if (response.response === 0){
    //     autoUpdater.on("download-progress", (progressTrack) => {
    //       log.info('\n\ndownload-progress')
    //       // log.info(progressTrack)
    //       mainWindow.webContents.send('download-progress', progressTrack.percent)
    //      })
    //   }
    // });
})
autoUpdater.on('update-not-available', (info) => {
    dispatch('Update not available.')
  })
autoUpdater.on("error", (err) => {
    log.warn('Error in auto-updater' + err)
})
autoUpdater.on("download-progress", (progressObj) => {
    // log.info('\ndownload-progress')
    // log.info(progressObj)
    mainWindow.webContents.send('download-progress', progressObj.percent)
})
autoUpdater.on("update-downloaded", (info) => {
  if (!updateDownloaded) {
    // Đánh dấu sự kiện đã được gọi
    updateDownloaded = true;
    log.info('update_downloaded')
    mainWindow.webContents.send('update_downloaded', 'test')
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title:  `NeoMusic v${info.version}`,
      // message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
      // else autoUpdater.autoInstallOnAppQuit = false
    })
  }
})

/////////////////////// event nhận value từ renderer.js ///////////
ipcMain.on('test-print', testPrint);
function testPrint() {
    const options = {
        preview: false,              //  width of content body
        silent: true,
        margin: 'auto',            // margin of content body
        copies: 1,                    // Number of copies to print
        printerName: 'RONGTA 58mm Series Printer',        // printerName: string, check with webContent.getPrinters()
        timeOutPerLine: 1000,
        pageSize: '80mm'  // page size
    }

    const data = [
        {
            type: 'table',
            style: {border: '1px solid #ddd'},             // style the table
            // list of the columns to be rendered in the table header
            tableHeader: [{type: 'text', value: 'People'}, {
                type: 'image',
                url: 'https://randomuser.me/api/portraits/men/13.jpg'
            }],
            // multidimensional array depicting the rows and columns of the table body
            tableBody: [
                [{type: 'text', value: 'Marcus'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/43.jpg'
                }],
                [{type: 'text', value: 'Boris'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/41.jpg'
                }],
                [{type: 'text', value: 'Andrew'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/23.jpg'
                }],
                [{type: 'text', value: 'Tyresse'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/53.jpg'
                }],
            ],
            // list of columns to be rendered in the table footer
            tableFooter: [{type: 'text', value: 'People'}, 'Image'],
            // custom style for the table header
            tableHeaderStyle: {backgroundColor: 'red', color: 'white'},
            // custom style for the table body
            tableBodyStyle: {'border': '0.5px solid #ddd'},
            // custom style for the table footer
            tableFooterStyle: {backgroundColor: '#000', color: 'white'},
        },
        {
            type: 'image',
            url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
            position: 'center',                                  // position of image: 'left' | 'center' | 'right'
            width: '60px',                                           // width of image in px; default: auto
            height: '60px',
        },
        {
            type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
            value: 'SAMPLE HEADING',
            style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
        },
        {
            type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value: 'Secondary text',
            style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
        },
        {
            type: 'barCode',
            value: '023456789010',
            height: 40,                     // height of barcode, applicable only to bar and QR codes
            width: 2,                       // width of barcode, applicable only to bar and QR codes
            displayValue: true,             // Display value below barcode
            fontsize: 12,
        },
        {
            type: 'qrCode',
            value: 'https://github.com/Hubertformin/electron-pos-printer',
            height: 55,
            width: 55,
            position: 'right'
        },
        {
            type: 'table',
            // style the table
            style: {border: '1px solid #ddd'},
            // list of the columns to be rendered in the table header
            tableHeader: ['Animal', 'Age'],
            // multidimensional array depicting the rows and columns of the table body
            tableBody: [
                ['Cat', 2],
                ['Dog', 4],
                ['Horse', 12],
                ['Pig', 4],
            ],
            // list of columns to be rendered in the table footer
            tableFooter: ['Animal', 'Age'],
            // custom style for the table header
            tableHeaderStyle: {backgroundColor: '#000', color: 'white'},
            // custom style for the table body
            tableBodyStyle: {'border': '0.5px solid #ddd'},
            // custom style for the table footer
            tableFooterStyle: {backgroundColor: '#000', color: 'white'},
        }
    ]

    try {
        PosPrinter.print(data, options)
            .then(() => console.log('done'))
            .catch((error) => {
                console.error(error);
            });
    } catch (e) {
        console.log(PosPrinter)
        console.log(e);
    }
}