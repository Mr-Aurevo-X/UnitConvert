:: Copyright (c) 2026 Mr-Aurevo-X. All rights reserved.
:: SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
:: Author: Mr-Aurevo-X

@echo off
REM (c) 2026 Mr-Aurevo-X - UnitConvert - 100% local - free - updates not guaranteed
REM Optional alias - same preference: exe first, then pythonw
cd /d "%~dp0"
if exist "%~dp0UnitConvert.exe" (
  start "" /D "%~dp0" "%~dp0UnitConvert.exe"
  exit /b 0
)
if exist "%~dp0.venv\Scripts\pythonw.exe" (
  start "" /D "%~dp0" "%~dp0.venv\Scripts\pythonw.exe" "%~dp0host\host.py"
) else (
  start "" /D "%~dp0" pythonw "%~dp0host\host.py"
)
