const path = require('path');
module.exports = {
    packagerConfig: {
      // Cấu hình xây dựng cho Windows
      win: {
        target: 'nsis',
        icon: 'icon.ico'
      },
      // Cấu hình xây dựng cho macOS
      mac: {
        target: 'dmg',
        icon: 'icon.icns'
      },
      // Cấu hình xây dựng cho Linux
      linux: {
        target: 'AppImage',
        icon: 'icon.png'
      }
    },
    makers: [
      // Cấu hình các makers cho từng nền tảng
      {
        name: '@electron-forge/maker-zip',
        platforms: ['darwin', 'linux']
      },
      {
        name: '@electron-forge/maker-deb',
        config: {}
      },
      {
        name: '@electron-forge/maker-rpm',
        config: {}
      },
      {
        name: '@electron-forge/maker-squirrel',
        config: {
          name: 'my_app',
          // Cấu hình cho Windows
          config: {
            iconUrl: 'https://path/to/windows/icon.ico'
          }
        }
      }
    ],
    files: [
      {
        // Đường dẫn tệp tin hoặc thư mục muốn bao gồm
        from: path.resolve(__dirname, 'config.ini'),
        // Đường dẫn đích trong thư mục xây dựng
        to: '.',
      },
    ],
  };