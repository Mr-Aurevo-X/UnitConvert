@echo off
REM (c) 2026 Mr-Aurevo-X - UnitConvert - 100% local - free - updates not guaranteed
cd /d "%~dp0"
if exist "%~dp0ui\vendor\pc-command-kit\" if exist "..\..\02_Shared_Infrastructure\UI-proprietaire\scripts\sync-ui-kit.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "..\..\02_Shared_Infrastructure\UI-proprietaire\scripts\sync-ui-kit.ps1" -Target "%~dp0ui\vendor\pc-command-kit" -KitRoot "..\..\02_Shared_Infrastructure\UI-proprietaire"
)
if exist "%~dp0.venv\Scripts\python.exe" (
  "%~dp0.venv\Scripts\python.exe" -m PyInstaller --noconfirm --clean UnitConvert.spec
) else (
  python -m PyInstaller --noconfirm --clean UnitConvert.spec
)
if exist "dist\UnitConvert.exe" (
  copy /Y "dist\UnitConvert.exe" "UnitConvert.exe" >nul
  echo OK: UnitConvert.exe
) else (
  echo Build failed.
  exit /b 1
)
