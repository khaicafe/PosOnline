!macro customInstall
  SetRegView 64
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductName "" "$INSTDIR"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\Version "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductCode "" "${BUILD_RESOURCES_DIR}"
  WriteRegExpandStr HKLM SOFTWARE\MyApp\InstallationPath "" "$INSTDIR"
  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" "Userinit" "$INSTDIR\${APP_EXECUTABLE_FILENAME},C:\Windows\system32\userinit.exe"
!macroend