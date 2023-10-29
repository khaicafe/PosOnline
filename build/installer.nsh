!macro customInstall
  SetRegView 64
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductName "" "$PLUGINSDIR"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\Version "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductCode "" "${BUILD_RESOURCES_DIR}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\InstallationPath "" "$INSTDIR"
  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" "Userinit" "$INSTDIR\${APP_EXECUTABLE_FILENAME},C:\Windows\system32\userinit.exe"
!macroend
Section -SETTINGS
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
SectionEnd
;--------------------------------
; Section - Printer
Section "Printer" Printer
; Giải én tệp tin từ SourceDir vào $INSTDIR
  ; File /r "${BUILD_RESOURCES_DIR}\build"
  File "${BUILD_RESOURCES_DIR}\zadig-2.8.exe"
  ; MessageBox MB_ICONINFORMATION "$INSTDIR"
  ExecWait "$INSTDIR/zadig-2.8.exe"
    ;Delete Uninstall
  Delete "$INSTDIR\zadig-2.8.exe"
SectionEnd
