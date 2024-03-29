# PosOnline
ElectronJS-POS
{
  "name": "posonline",
  "productName": "NEOCAFE-POS v1.0.3",
  "description": "Phần mềm Order trên POS",
  "keywords": [],
  "main": "./main.js",
  "types": "libPOS/index.d.ts",
  "version": "1.0.3",
  "author": "khaicafe",
  "scripts": {
    "dev": "electron-forge start",
    "start": "electron .",
    "package": "electron-builder -w --ia32 -p always",
    "dist_all": "electron-builder -mwl",
    "build_mac_win": "electron-builder -mw -p always",
    "lint": "echo \"No linting configured\""
  },
  "license": "MIT",
  "build": {
    "afterPack": "setup_client.js",
    "extraFiles": {
      "from": "build",
      "to": "./resources/app.asar.unpacked/"
      },
    "nsis": {
      "include": "build/installer.nsh",
      "oneClick": true,
      "installerIcon": "icon.ico",
      "uninstallerIcon": "icon.ico",
      "allowToChangeInstallationDirectory": false,
      "perMachine": true
    },
    "publish": [
      {
        "provider": "github",
        "owner": "khaicafe",
        "repo": "PosOnline"      
      }
    ],
    "win": {
      "requestedExecutionLevel": "requireAdministrator",
      "target": {
        "target": "default",
        "arch": [
          "x64",
          "ia32"
        ]
      },
      "publisherName": "NeoCafe",
      "icon": "./icon.ico",
      "signingHashAlgorithms": [
        "sha256"
      ],
      "signAndEditExecutable": true,
      "signDlls": false,
      "verifyUpdateCodeSignature": false,
      "certificateFile": "ca.pfx",
      "certificatePassword": "1"
    },
    "mac": {
      "target": {
        "target": "default",
        "arch": [
          "x64",
          "universal"
        ]
      }
    }
  },
  "dependencies": {
    "@electron/remote": "^2.0.8",
    "@types/node": "^18.7.15",
    "@types/qrcode": "^1.5.0",
    "bundle-declarations-webpack-plugin": "^3.1.1",
    "chai": "^4.2.0",
    "chai-as-promised": "^7.1.1",
    "css-loader": "^6.7.1",
    "css-minimizer-webpack-plugin": "^4.2.2",
    "html-webpack-plugin": "^5.5.0",
    "keyv": "^4.5.2",
    "mini-css-extract-plugin": "^2.6.1",
    "mocha": "^6.2.3",
    "shx": "^0.3.4",
    "spectron": "19.0.0",
    "terser-webpack-plugin": "^5.3.6",
    "ts-loader": "^9.4.1",
    "typescript": "^4.8.2",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-node-externals": "^1.7.2",
    "axios": "1.3.4",
    "electron-is-dev": "^2.0.0",
    "electron-log": "^4.4.8",
    "electron-updater": "^6.1.1",
    "fs-extra": "^11.1.1",
    "fs.realpath": "1.0.0"
  },
  "devDependencies": {
    "@electron-forge/cli": "^6.4.1",
    "@electron-forge/maker-deb": "^6.4.1",
    "@electron-forge/maker-rpm": "^6.4.1",
    "@electron-forge/maker-squirrel": "^6.4.1",
    "@electron-forge/maker-zip": "^6.4.1",
    "@electron-forge/plugin-auto-unpack-natives": "^6.4.1",
    "electron": "^26.1.0",
    "electron-builder": "^24.6.3"
  }
}
