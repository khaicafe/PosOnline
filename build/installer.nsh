!macro customInstall
  SetRegView 64
  ; WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductName "" "$PLUGINSDIR"
  ; WriteRegExpandStr HKLM SOFTWARE\MyApp\Version "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  ; WriteRegExpandStr HKLM SOFTWARE\MyApp\ProductCode "" "${BUILD_RESOURCES_DIR}"
  ; WriteRegExpandStr HKLM SOFTWARE\MyApp\InstallationPath "" "$INSTDIR"
  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" "Userinit" "$INSTDIR\${APP_EXECUTABLE_FILENAME},C:\Windows\system32\userinit.exe"
  
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "PromptOnSecureDesktop" "00000000"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "EnableLUA" "00000000"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "ConsentPromptBehaviorAdmin" "00000000"

  WriteRegDWORD HKLM "SOFTWARE\Policies\Microsoft\Windows\System" "EnableSmartScreen" "00000000"
  WriteRegStr HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer" "SmartScreenEnabled" "Off"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Internet Explorer\PhishingFilter" "EnabledV9" "00000000"
  ; speed up
  WriteRegDWORD HKLM "SYSTEM\ControlSet001\Control\Session Manager\Memory Management\PrefetchParameters" "EnableSuperfetch" "00000000"
  WriteRegDWORD HKLM "SYSTEM\ControlSet001\Control\Session Manager\Memory Management\PrefetchParameters" "EnablePrefetcher" "00000000"
  WriteRegDWORD HKLM "SYSTEM\ControlSet001\Control\Session Manager\Memory Management\PrefetchParameters" "EnableBootTrace" "00000001"

  WriteRegDWORD HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Power" "HiberbootEnabled" "00000000"
  WriteRegDWORD HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Power" "HBFlagsSwitch" "00000001"

  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "PromptOnSecureDesktop" "00000000"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "EnableLUA" "00000000"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "ConsentPromptBehaviorAdmin" "00000000"

  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" "StartupDelayInMSec" "00000000"

  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" "EnableFirstLogonAnimation" "00000000"
  WriteRegDWORD HKLM "Software\Policies\Microsoft\Internet Explorer\Restrictions" "NoExtensionManagement" "00000001"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Policies" "NoLowDiskSpaceChecks" "00000000"
  WriteRegDWORD HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\DriverSearching" "SearchOrderConfig" "00000000"
  
  WriteRegStr HKCU "Control Panel\Mouse" "MouseHoverTime" "10"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" "Start_ShowRun" "00000001"
  ; power off
  WriteRegStr HKCU "Control Panel\PowerCfg" "CurrentPowerPolicy" "4"
  ; sleep
  WriteRegDWORD HKCU "SOFTWARE\Policies\Microsoft\Power\PowerSettings\abfc2519-3608-4c2a-94ea-171b0ed546ab" "ACSettingIndex" "00000000"
  WriteRegDWORD HKCU "SOFTWARE\Policies\Microsoft\Power\PowerSettings\abfc2519-3608-4c2a-94ea-171b0ed546ab" "DCSettingIndex" "00000000"

!macroend
Section -SETTINGS
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  File "${BUILD_RESOURCES_DIR}\powerSleep.bat"
  ExecWait '"$INSTDIR\powerSleep.bat" /S _?=$INSTDIR'
  Delete "$INSTDIR\powerSleep.bat"
SectionEnd
;--------------------------------
; Section - Printer
Section "Printer" Printer
; Giải én tệp tin từ SourceDir vào $INSTDIR
  ; File /r "${BUILD_RESOURCES_DIR}\build"
  File "${BUILD_RESOURCES_DIR}\zadig-2.8.exe"
  ; MessageBox MB_ICONINFORMATION "$INSTDIR"
  ExecWait "$INSTDIR\zadig-2.8.exe"
  ExecWait "$INSTDIR\zadig-2.8.exe"
    ;Delete Uninstall
  ; Delete "$INSTDIR\zadig-2.8.exe"
SectionEnd

;--------------------------------
; Section - anydesk
Section "anydesk" anydesk
; Giải én tệp tin từ SourceDir vào $INSTDIR
  ; File /r "${BUILD_RESOURCES_DIR}\build"
  File "${BUILD_RESOURCES_DIR}\AnyDesk.exe"
  File "${BUILD_RESOURCES_DIR}\runAnydesk.bat"
  ExecWait '"$INSTDIR\runAnydesk.bat" /S _?=$INSTDIR'
  ; MessageBox MB_ICONINFORMATION "$INSTDIR"
  ; ExecWait "$INSTDIR\AnyDesk.exe"
    ;Delete Uninstall
  ; Delete "$INSTDIR\AnyDesk.exe"
SectionEnd
