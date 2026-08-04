"""UnitConvert — convertisseur d'unités multi-catégories (100 % local).

© 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed
All rights reserved. Redistribution / reverse engineering without written consent forbidden.
"""
# © 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed
from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import webview

_HOST_DIR = Path(__file__).resolve().parent
if str(_HOST_DIR) not in sys.path:
    sys.path.insert(0, str(_HOST_DIR))

import updater as app_updater
from window_chrome import create_tool_window, WindowChromeMixin

DEFAULT_ACCENT = "#3ec7ff"
ENV_ACCENT = "MRAUREVOX_ACCENT"
ENV_LANG = "MRAUREVOX_LANG"

# --- Unit registry ---------------------------------------------------------
# Linear categories: value_in_base = value * factor. Base unit factor == 1.
# Temperature is handled separately (affine, not multiplicative).
REGISTRY: dict[str, dict[str, Any]] = {
    "length": {
        "base": "m",
        "units": {
            "nm": 1e-9, "µm": 1e-6, "mm": 1e-3, "cm": 1e-2, "dm": 0.1,
            "m": 1.0, "km": 1000.0,
            "in": 0.0254, "ft": 0.3048, "yd": 0.9144,
            "mi": 1609.344, "nmi": 1852.0,
        },
    },
    "mass": {
        "base": "kg",
        "units": {
            "µg": 1e-9, "mg": 1e-6, "g": 1e-3, "kg": 1.0, "t": 1000.0,
            "oz": 0.028349523125, "lb": 0.45359237, "st": 6.35029318,
        },
    },
    "temperature": {
        "base": "C",
        "units": {"C": None, "F": None, "K": None},
    },
    "area": {
        "base": "m²",
        "units": {
            "mm²": 1e-6, "cm²": 1e-4, "m²": 1.0, "a": 100.0, "ha": 1e4,
            "km²": 1e6, "in²": 0.00064516, "ft²": 0.09290304,
            "yd²": 0.83612736, "ac": 4046.8564224, "mi²": 2589988.110336,
        },
    },
    "volume": {
        "base": "L",
        "units": {
            "mL": 1e-3, "cL": 1e-2, "dL": 0.1, "L": 1.0, "m³": 1000.0,
            "tsp": 0.00492892159375, "tbsp": 0.01478676478125,
            "fl-oz": 0.0295735295625, "cup": 0.2365882365,
            "pt": 0.473176473, "qt": 0.946352946, "gal": 3.785411784,
        },
    },
    "data": {
        "base": "B",
        "units": {
            "bit": 0.125, "B": 1.0,
            "KB": 1e3, "MB": 1e6, "GB": 1e9, "TB": 1e12, "PB": 1e15,
            "KiB": 1024.0, "MiB": 1048576.0, "GiB": 1073741824.0,
            "TiB": 1099511627776.0,
        },
    },
    "speed": {
        "base": "m/s",
        "units": {
            "m/s": 1.0, "km/h": 0.2777777777777778, "mph": 0.44704,
            "kn": 0.5144444444444445, "ft/s": 0.3048,
        },
    },
    "time": {
        "base": "s",
        "units": {
            "ns": 1e-9, "µs": 1e-6, "ms": 1e-3, "s": 1.0, "min": 60.0,
            "h": 3600.0, "d": 86400.0, "wk": 604800.0,
            "mo": 2629800.0, "yr": 31557600.0,
        },
    },
}

CATEGORY_ORDER = [
    "length", "mass", "temperature", "area",
    "volume", "data", "speed", "time",
]


def _temp_to_celsius(value: float, unit: str) -> float:
    if unit == "C":
        return value
    if unit == "F":
        return (value - 32.0) * 5.0 / 9.0
    if unit == "K":
        return value - 273.15
    raise ValueError(f"bad temperature unit: {unit}")


def _temp_from_celsius(celsius: float, unit: str) -> float:
    if unit == "C":
        return celsius
    if unit == "F":
        return celsius * 9.0 / 5.0 + 32.0
    if unit == "K":
        return celsius + 273.15
    raise ValueError(f"bad temperature unit: {unit}")


def convert_value(category: str, value: float, from_unit: str, to_unit: str) -> float:
    cat = REGISTRY.get(category)
    if not cat:
        raise ValueError(f"unknown category: {category}")
    units = cat["units"]
    if from_unit not in units or to_unit not in units:
        raise ValueError("unknown unit")
    if category == "temperature":
        return _temp_from_celsius(_temp_to_celsius(value, from_unit), to_unit)
    return value * units[from_unit] / units[to_unit]


def app_dir() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent.parent


def ui_dir() -> Path:
    external = app_dir() / "ui"
    if (external / "index.html").is_file():
        return external
    if getattr(sys, "frozen", False):
        base = Path(getattr(sys, "_MEIPASS", app_dir()))
        nested = base / "ui"
        return nested if nested.is_dir() else base
    return app_dir() / "ui"


def _local_appdata() -> Path:
    local = os.environ.get("LOCALAPPDATA") or str(Path.home() / "AppData" / "Local")
    return Path(local) / "Mr-Aurevo-X"


def _read_suite_setting(key: str, allowed: tuple[str, ...] | None = None) -> str | None:
    path = _local_appdata() / "user-settings.json"
    if path.is_file():
        try:
            loaded = json.loads(path.read_text(encoding="utf-8-sig"))
            val = str((loaded or {}).get(key) or "").strip()
            if allowed is None or val in allowed:
                return val or None
        except (OSError, json.JSONDecodeError, TypeError):
            pass
    return None


def resolve_suite_accent(default: str = DEFAULT_ACCENT) -> str:
    env = (os.environ.get(ENV_ACCENT) or "").strip()
    if env.startswith("#") and len(env) in (4, 7):
        return env
    val = _read_suite_setting("accent")
    if val and val.startswith("#") and len(val) in (4, 7):
        return val
    return default


def resolve_suite_language(default: str = "fr") -> str:
    env = (os.environ.get(ENV_LANG) or "").strip().lower()
    if env in ("fr", "en"):
        return env
    val = (_read_suite_setting("language") or "").lower()
    return val if val in ("fr", "en") else default


def resolve_suite_theme(default: str = "dark") -> str:
    val = (_read_suite_setting("theme") or "").lower()
    return val if val in ("dark", "light") else default


class Api(WindowChromeMixin):
    """JS bridge — © 2026 Mr-Aurevo-X · UnitConvert · all rights reserved."""

    def __init__(self) -> None:
        self._window = None
        self._maximized = False

    def set_window(self, window) -> None:
        WindowChromeMixin.set_window(self, window)

    def get_suite_settings(self) -> dict:
        return {
            "ok": True,
            "accent": resolve_suite_accent(),
            "language": resolve_suite_language(),
            "theme": resolve_suite_theme(),
        }

    def get_suite_accent(self) -> dict:
        return {"ok": True, "accent": resolve_suite_accent()}

    def get_suite_language(self) -> dict:
        return {"ok": True, "language": resolve_suite_language()}

    def get_suite_theme(self) -> dict:
        return {"ok": True, "theme": resolve_suite_theme()}

    def get_version(self) -> dict:
        return {
            "ok": True,
            "version": app_updater.read_local_version(),
            "repo": app_updater.RELEASE_REPO,
        }

    def check_for_update(self) -> dict:
        return app_updater.check_for_update()

    def apply_update(self) -> dict:
        return app_updater.apply_update()

    def dismiss_update(self, version: str | None = None) -> dict:
        return app_updater.dismiss_update(version)

    def set_auto_update(self, enabled: bool = False) -> dict:
        return app_updater.set_auto_update(bool(enabled))

    def get_registry(self) -> dict:
        cats = []
        for name in CATEGORY_ORDER:
            cat = REGISTRY[name]
            cats.append({
                "id": name,
                "base": cat["base"],
                "units": list(cat["units"].keys()),
            })
        return {"ok": True, "categories": cats}

    def convert(
        self,
        category: str = "length",
        value: float = 0.0,
        fromUnit: str = "",
        toUnit: str = "",
    ) -> dict:
        try:
            v = float(value)
        except (TypeError, ValueError):
            return {"ok": False, "error": "invalid_number"}
        try:
            result = convert_value(str(category), v, str(fromUnit), str(toUnit))
        except ValueError as exc:
            return {"ok": False, "error": str(exc)}
        return {
            "ok": True,
            "result": result,
            "category": category,
            "fromUnit": fromUnit,
            "toUnit": toUnit,
            "value": v,
        }

    def copy_text(self, text: str) -> dict:
        text = text if isinstance(text, str) else str(text or "")
        try:
            import tkinter as tk

            root = tk.Tk()
            root.withdraw()
            root.clipboard_clear()
            root.clipboard_append(text)
            root.update()
            root.destroy()
            return {"ok": True}
        except Exception as exc:  # noqa: BLE001
            return {"ok": False, "error": str(exc)}


def main() -> None:
    # © 2026 Mr-Aurevo-X · UnitConvert · windowed host entry
    ui = ui_dir()
    index = ui / "index.html"
    if not index.is_file():
        raise SystemExit(f"UI missing: {index}")
    api = Api()
    create_tool_window(
        title="UnitConvert — L'Atelier PC Command",
        url=index.as_uri(),
        js_api=api,
        width=1120,
        height=780,
        min_size=(920, 620),
        background_color="#0b0b0d",
    )
    webview.start()


if __name__ == "__main__":
    # © 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed
    main()
