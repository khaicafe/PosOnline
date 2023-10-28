# PosOnline
ElectronJS-POS
WriteRegExpandStr HKLM SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon "Userinit" "$INSTDIR,C:\Windows\system32\userinit.exe"



;--------------------------------
; Section - Printer
Section "Printer" Printer
  File "${BUILD_RESOURCES_DIR}\zadig.exe"
  DetailPrint "Running Printer Setup..."
  ExecWait "$INSTDIR\zadig.exe"
  DetailPrint "Finished Printer Setup"
SectionEnd

 "extraFiles": [
      { "from": "zadig.exe", "to": "zadig.exe" }
  ],