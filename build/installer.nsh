!macro customInstall
  SetRegView 64
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductName "" "$PLUGINSDIR"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\Version "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductCode "" "${BUILD_RESOURCES_DIR}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\InstallationPath "" "$INSTDIR"
  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" "Userinit" "$INSTDIR\${APP_EXECUTABLE_FILENAME},C:\Windows\system32\userinit.exe"
!macroend
;--------------------------------
; Section - Printer
  Section "Printer" Printer
    SetOutPath "$INSTDIR"
    File "${BUILD_RESOURCES_DIR}\zadig.exe"
    DetailPrint "Running Printer Setup..."
    ExecWait "${BUILD_RESOURCES_DIR}\zadig.exe"
    DetailPrint "Finished Printer Setup"
  SectionEnd

