# Copyright (c) 2026 Mr-Aurevo-X. All rights reserved.
# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
# Author: Mr-Aurevo-X · https://github.com/Mr-Aurevo-X

"""Optional GitHub updater for UnitConvert.

Legal: updates are not guaranteed (no SLA). Frozen/exe mode prefers the
GitHub Release asset UnitConvert.exe; source mode uses git pull (clone) or the
release source zipball. Sole optional network call.
"""
# © 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import zipfile
from pathlib import Path
from typing import Any

APP_NAME = "UnitConvert"
APP_SLUG = "unitconvert"
RELEASE_REPO = f"Mr-Aurevo-X/{APP_NAME}"
API_LATEST = f"https://api.github.com/repos/{RELEASE_REPO}/releases/latest"
USER_AGENT = f"{APP_NAME}-Updater/1.0 (+https://github.com/{RELEASE_REPO})"
EXE_NAME = f"{APP_NAME}.exe"
VERSION_NAME = "VERSION"
SETTINGS_NAME = f"{APP_SLUG}-settings.json"
FINISH_SCRIPT = f"_{APP_SLUG}_update_finish.cmd"

# Paths refreshed from a source zip (never wipe .venv / local exe leftovers)
REFRESH_TOP = (
    "host",
    "ui",
    "VERSION",
    "requirements.txt",
    "Lancer.bat",
    f"{APP_NAME}.bat",
    "Lancer.cmd",
    "README.md",
    "LICENSE",
    "brand-icon.ico",
)


def _local_appdata() -> Path:
    local = os.environ.get("LOCALAPPDATA") or str(Path.home() / "AppData" / "Local")
    return Path(local) / "Mr-Aurevo-X"


def settings_path() -> Path:
    return _local_appdata() / SETTINGS_NAME


def load_settings() -> dict[str, Any]:
    path = settings_path()
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8-sig"))
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError, TypeError):
        return {}


def save_settings(patch: dict[str, Any]) -> dict[str, Any]:
    path = settings_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    data = load_settings()
    data.update(patch)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    return data


def is_frozen() -> bool:
    return bool(getattr(sys, "frozen", False))


def app_dir() -> Path:
    if is_frozen():
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent.parent


def read_local_version(root: Path | None = None) -> str:
    root = root or app_dir()
    candidates = [root / VERSION_NAME]
    if is_frozen():
        meipass = Path(getattr(sys, "_MEIPASS", root))
        candidates.append(meipass / VERSION_NAME)
    for path in candidates:
        if path.is_file():
            try:
                text = path.read_text(encoding="utf-8").strip()
                if text:
                    return _normalize_version(text)
            except OSError:
                continue
    return "0.0.0"


def _normalize_version(raw: str) -> str:
    s = (raw or "").strip()
    if s.lower().startswith("v"):
        s = s[1:]
    m = re.match(r"^(\d+(?:\.\d+)*)", s)
    return m.group(1) if m else s


def parse_version(raw: str) -> tuple[int, ...]:
    parts = _normalize_version(raw).split(".")
    out: list[int] = []
    for p in parts:
        try:
            out.append(int(p))
        except ValueError:
            out.append(0)
    while len(out) < 3:
        out.append(0)
    return tuple(out)


def is_newer(remote: str, local: str) -> bool:
    return parse_version(remote) > parse_version(local)


def _http_get(url: str, accept: str = "application/vnd.github+json") -> bytes:
    req = urllib.request.Request(
        url,
        headers={
            "Accept": accept,
            "User-Agent": USER_AGENT,
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    token = (os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or "").strip()
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read()


def is_git_clone(root: Path | None = None) -> bool:
    root = root or app_dir()
    return (root / ".git").is_dir()


def _git(args: list[str], root: Path | None = None) -> subprocess.CompletedProcess[str]:
    root = root or app_dir()
    return subprocess.run(  # noqa: S603
        ["git", *args],
        cwd=str(root),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )


def _pick_asset(release: dict) -> dict | None:
    assets = release.get("assets") or []
    if not isinstance(assets, list):
        return None
    exe = None
    zip_asset = None
    for asset in assets:
        if not isinstance(asset, dict):
            continue
        name = str(asset.get("name") or "").strip()
        lower = name.lower()
        if lower == EXE_NAME.lower():
            exe = asset
            break
        if lower.endswith(".zip") and zip_asset is None:
            zip_asset = asset
    return exe or zip_asset


def check_for_update() -> dict[str, Any]:
    """Non-blocking friendly: call from JS after UI boot."""
    settings = load_settings()
    if settings.get("checkUpdates") is False:
        local = read_local_version()
        mode = "exe" if is_frozen() else "sources"
        return {
            "ok": True,
            "updateAvailable": False,
            "local": local,
            "remote": None,
            "error": None,
            "reason": "check_disabled",
            "checkUpdates": False,
            "autoUpdate": bool(settings.get("autoUpdate")),
            "mode": mode,
            "gitClone": is_git_clone(),
            "repo": RELEASE_REPO,
        }
    local = read_local_version()
    settings = load_settings()
    skipped = str(settings.get("skipVersion") or "").strip()
    mode = "exe" if is_frozen() else "sources"
    base_meta = {
        "autoUpdate": bool(settings.get("autoUpdate")),
        "checkUpdates": settings.get("checkUpdates", True) is not False,
        "mode": mode,
        "gitClone": is_git_clone(),
        "repo": RELEASE_REPO,
    }
    try:
        raw = _http_get(API_LATEST)
        release = json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return {
                "ok": True, "updateAvailable": False, "local": local,
                "remote": None, "error": None, "reason": "no_releases", **base_meta,
            }
        return {
            "ok": False, "updateAvailable": False, "local": local,
            "remote": None, "error": f"HTTP {exc.code}", **base_meta,
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "ok": False, "updateAvailable": False, "local": local,
            "remote": None, "error": str(exc), **base_meta,
        }

    tag = str(release.get("tag_name") or release.get("name") or "").strip()
    remote = _normalize_version(tag)
    asset = _pick_asset(release)
    newer = bool(remote and is_newer(remote, local))
    if is_frozen():
        available = bool(newer and asset)
        err = None if asset or not newer else "no_asset"
    else:
        available = newer
        err = None
    if skipped and _normalize_version(skipped) == remote:
        available = False
    zipball = release.get("zipball_url") or (
        f"https://api.github.com/repos/{RELEASE_REPO}/zipball/{tag}" if tag else None
    )
    return {
        "ok": True,
        "updateAvailable": available,
        "local": local,
        "remote": remote or None,
        "tag": tag or None,
        "name": release.get("name"),
        "body": (release.get("body") or "")[:2000],
        "htmlUrl": release.get("html_url"),
        "assetName": (asset or {}).get("name"),
        "assetUrl": (asset or {}).get("browser_download_url"),
        "assetApiUrl": (asset or {}).get("url"),
        "zipballUrl": zipball,
        "error": err,
        **base_meta,
    }


def dismiss_update(version: str | None = None) -> dict[str, Any]:
    ver = _normalize_version(version or "")
    if ver:
        save_settings({"skipVersion": ver})
    return {"ok": True, "skipVersion": ver or None}


def set_auto_update(enabled: bool) -> dict[str, Any]:
    data = save_settings({"autoUpdate": bool(enabled)})
    return {"ok": True, "autoUpdate": bool(data.get("autoUpdate"))}


def set_check_updates(enabled: bool) -> dict[str, Any]:
    """Enable/disable the optional GitHub Releases version check (default: on)."""
    data = save_settings({"checkUpdates": bool(enabled)})
    return {"ok": True, "checkUpdates": bool(data.get("checkUpdates", True))}


def get_update_prefs() -> dict[str, Any]:
    settings = load_settings()
    return {
        "ok": True,
        "checkUpdates": settings.get("checkUpdates", True) is not False,
        "autoUpdate": bool(settings.get("autoUpdate")),
        "repo": RELEASE_REPO,
        "repoUrl": f"https://github.com/{RELEASE_REPO}",
    }


def about_local_paths() -> dict[str, Any]:
    """Labeled absolute paths for About — uninstall / manual cleanup.

    Never expose monorepo / SoT / clone paths (even via Lancer.cmd).
    """
    entries: list[dict[str, Any]] = []
    if is_frozen():
        entries.append(
            {
                "id": "app",
                "label": "Install (dossier de l’exe)",
                "labelEn": "Install (exe folder)",
                "path": str(Path(sys.executable).resolve().parent),
                "hint": f"Dossier portable {EXE_NAME} — supprimer ce dossier pour désinstaller.",
                "hintEn": f"Portable {EXE_NAME} folder — delete this folder to uninstall.",
            }
        )
    entries.append(
        {
            "id": "settings",
            "label": f"Préférences {APP_NAME} (vérif. maj)",
            "labelEn": f"{APP_NAME} prefs (update check)",
            "path": str(settings_path()),
            "hint": "Fichier propre à cette app — safe à supprimer (réinitialise les prefs locales).",
            "hintEn": "App-specific file — safe to delete (resets local prefs).",
        }
    )
    shared = _local_appdata() / "user-settings.json"
    entries.append(
        {
            "id": "shared",
            "label": "Préférences partagées (accent, langue)",
            "labelEn": "Shared prefs (accent, language)",
            "path": str(shared),
            "hint": "Partagé entre apps Mr-Aurevo-X — à garder si d’autres apps restent.",
            "hintEn": "Shared across Mr-Aurevo-X apps — keep if other apps remain.",
        }
    )
    return {"ok": True, "paths": entries}




def _download_asset(asset_api_url: str | None, browser_url: str | None, dest: Path) -> None:
    url = (asset_api_url or browser_url or "").strip()
    if not url:
        raise RuntimeError("Asset URL manquante")
    accept = "application/octet-stream" if asset_api_url else "*/*"
    data = _http_get(url if asset_api_url else (browser_url or url), accept=accept)
    dest.write_bytes(data)


def _extract_exe_from_zip(zip_path: Path, dest_exe: Path) -> None:
    with zipfile.ZipFile(zip_path, "r") as zf:
        members = [
            n for n in zf.namelist()
            if n.replace("\\", "/").rstrip("/").split("/")[-1].lower() == EXE_NAME.lower()
        ]
        if not members:
            raise RuntimeError(f"{EXE_NAME} introuvable dans le zip")
        members.sort(key=lambda n: n.count("/"))
        with zf.open(members[0]) as src, dest_exe.open("wb") as out:
            out.write(src.read())
        ver_members = [
            n for n in zf.namelist()
            if n.replace("\\", "/").rstrip("/").split("/")[-1].upper() == VERSION_NAME
        ]
        if ver_members:
            ver_members.sort(key=lambda n: n.count("/"))
            try:
                text = zf.read(ver_members[0]).decode("utf-8").strip()
                if text:
                    (dest_exe.parent / VERSION_NAME).write_text(text + "\n", encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                pass


def _write_finish_script(target_exe: Path, staged_exe: Path, version: str) -> Path:
    script = target_exe.parent / FINISH_SCRIPT
    pid = os.getpid()
    lines = [
        "@echo off",
        "setlocal",
        f'set "TARGET={target_exe}"',
        f'set "STAGED={staged_exe}"',
        f'set "VERFILE={target_exe.parent / VERSION_NAME}"',
        f'set "PID={pid}"',
        f'set "NEWVER={version}"',
        ":wait",
        'tasklist /FI "PID eq %PID%" 2>nul | find "%PID%" >nul',
        "if not errorlevel 1 (",
        "  timeout /t 1 /nobreak >nul",
        "  goto wait",
        ")",
        'copy /Y "%STAGED%" "%TARGET%" >nul',
        'if exist "%STAGED%" del /F /Q "%STAGED%" >nul 2>&1',
        'echo %NEWVER%>"%VERFILE%"',
        'start "" "%TARGET%"',
        'del /F /Q "%~f0" >nul 2>&1',
    ]
    script.write_text("\r\n".join(lines) + "\r\n", encoding="utf-8")
    return script


def _apply_via_git_pull(remote: str) -> dict[str, Any]:
    root = app_dir()
    local = read_local_version(root)
    fetch = _git(["fetch", "--tags", "origin"], root)
    if fetch.returncode != 0:
        return {
            "ok": False, "applied": False, "local": local, "remote": remote,
            "error": (fetch.stderr or fetch.stdout or "git fetch failed").strip()[:500],
            "method": "git_pull",
        }
    pull = _git(["pull", "--ff-only", "origin", "HEAD"], root)
    if pull.returncode != 0:
        branch = _git(["rev-parse", "--abbrev-ref", "HEAD"], root)
        br = (branch.stdout or "main").strip() or "main"
        pull = _git(["pull", "--ff-only", "origin", br], root)
    if pull.returncode != 0:
        return {
            "ok": False, "applied": False, "local": local, "remote": remote,
            "error": (pull.stderr or pull.stdout or "git pull failed").strip()[:500],
            "method": "git_pull",
        }
    save_settings({"skipVersion": ""})
    return {
        "ok": True, "applied": True, "restarting": False, "local": local,
        "remote": remote, "newLocal": read_local_version(root), "method": "git_pull",
        "error": None,
        "note": f"Sources mises a jour via git pull — relancez {EXE_NAME} ou Lancer.bat",
    }


def _copy_tree(src: Path, dest: Path) -> None:
    if dest.exists():
        if dest.is_dir():
            shutil.rmtree(dest)
        else:
            dest.unlink()
    if src.is_dir():
        shutil.copytree(src, dest)
    else:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


def _apply_via_source_zip(release: dict, remote: str) -> dict[str, Any]:
    root = app_dir()
    local = read_local_version(root)
    tag = str(release.get("tag_name") or "").strip()
    zip_url = str(release.get("zipball_url") or "").strip()
    if not zip_url and tag:
        zip_url = f"https://api.github.com/repos/{RELEASE_REPO}/zipball/{tag}"
    if not zip_url:
        return {
            "ok": False, "applied": False, "local": local, "remote": remote,
            "error": "zipball URL manquante", "method": "source_zip",
        }

    tmp_dir = Path(tempfile.mkdtemp(prefix=f"{APP_SLUG}-src-"))
    try:
        zip_path = tmp_dir / "source.zip"
        zip_path.write_bytes(_http_get(zip_url, accept="application/vnd.github+json"))
        extract_dir = tmp_dir / "extracted"
        extract_dir.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(extract_dir)
        tops = [p for p in extract_dir.iterdir() if p.is_dir()]
        if not tops:
            raise RuntimeError("Archive source vide")
        src_root = tops[0]
        for name in REFRESH_TOP:
            src = src_root / name
            if not src.exists():
                continue
            _copy_tree(src, root / name)
        (root / VERSION_NAME).write_text(remote + "\n", encoding="utf-8")
        save_settings({"skipVersion": ""})
        return {
            "ok": True, "applied": True, "restarting": False, "local": local,
            "remote": remote, "newLocal": read_local_version(root),
            "method": "source_zip", "error": None,
            "note": f"Sources rafraichies depuis GitHub — relancez {EXE_NAME} ou Lancer.bat",
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "ok": False, "applied": False, "local": local, "remote": remote,
            "error": str(exc), "method": "source_zip",
        }
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def _apply_via_exe_asset(release: dict, remote: str) -> dict[str, Any]:
    local = read_local_version()
    asset = _pick_asset(release)
    if not asset:
        return {
            "ok": True, "applied": False, "local": local, "remote": remote or None,
            "error": None, "reason": "no_asset",
        }

    asset_name = str(asset.get("name") or "")
    root = app_dir()
    target_exe = Path(sys.executable).resolve() if is_frozen() else root / EXE_NAME

    try:
        tmp_dir = Path(tempfile.mkdtemp(prefix=f"{APP_SLUG}-upd-"))
        staged = tmp_dir / EXE_NAME
        if asset_name.lower().endswith(".zip"):
            zip_path = tmp_dir / "release.zip"
            _download_asset(asset.get("url"), asset.get("browser_download_url"), zip_path)
            _extract_exe_from_zip(zip_path, staged)
        else:
            _download_asset(asset.get("url"), asset.get("browser_download_url"), staged)

        if not staged.is_file() or staged.stat().st_size < 1024:
            raise RuntimeError("Telechargement invalide")

        (root / VERSION_NAME).write_text(remote + "\n", encoding="utf-8")
        save_settings({"skipVersion": ""})

        if is_frozen() or target_exe.is_file():
            beside = target_exe.with_suffix(".exe.new")
            beside.write_bytes(staged.read_bytes())
            script = _write_finish_script(target_exe, beside, remote)
            creationflags = 0x08000000  # CREATE_NO_WINDOW
            subprocess.Popen(  # noqa: S603
                ["cmd.exe", "/c", str(script)],
                cwd=str(target_exe.parent),
                creationflags=creationflags,
                close_fds=True,
            )
            return {
                "ok": True, "applied": True, "restarting": True, "local": local,
                "remote": remote, "method": "exe_asset", "error": None,
            }

        target_exe.write_bytes(staged.read_bytes())
        return {
            "ok": True, "applied": True, "restarting": False, "local": local,
            "remote": remote, "path": str(target_exe), "method": "exe_asset",
            "error": None,
            "note": f"{EXE_NAME} mis a jour — relancez via {EXE_NAME} ou Lancer.bat",
        }
    except Exception as exc:  # noqa: BLE001
        return {
            "ok": False, "applied": False, "error": str(exc), "local": local,
            "remote": remote, "method": "exe_asset",
        }


def apply_update() -> dict[str, Any]:
    """Frozen: prefer Release asset exe. Source: git pull or zipball."""
    local = read_local_version()
    try:
        raw = _http_get(API_LATEST)
        release = json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as exc:
        return {"ok": False, "applied": False, "local": local, "error": f"HTTP {exc.code}"}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "applied": False, "local": local, "error": str(exc)}

    tag = str(release.get("tag_name") or release.get("name") or "").strip()
    remote = _normalize_version(tag)
    if not remote:
        return {
            "ok": True, "applied": False, "local": local, "remote": None,
            "error": None, "reason": "no_releases",
        }
    if not is_newer(remote, local):
        return {
            "ok": True, "applied": False, "updateAvailable": False, "local": local,
            "remote": remote, "error": None, "reason": "up_to_date",
        }

    if is_frozen():
        return _apply_via_exe_asset(release, remote)
    if is_git_clone():
        return _apply_via_git_pull(remote)
    asset = _pick_asset(release)
    if asset and str(asset.get("name") or "").lower().endswith(".exe"):
        return _apply_via_exe_asset(release, remote)
    return _apply_via_source_zip(release, remote)
