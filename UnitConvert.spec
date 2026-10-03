# -*- mode: python ; coding: utf-8 -*-
# Â© 2026 Mr-Aurevo-X Â· UnitConvert Â· 100% local Â· free Â· updates not guaranteed
# Proprietary binary â€” redistribution of sources/exe without written consent forbidden.

a = Analysis(
    ['host\\host.py'],
    pathex=['host'],
    binaries=[],
    datas=[('ui', 'ui'), ('VERSION', '.'), ('host/crypto_donations.json', '.')],
    hiddenimports=['clr', 'updater', 'window_chrome'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='UnitConvert',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['brand-icon.ico'],
)
