# UnitConvert

**[Download UnitConvert.exe](https://github.com/Mr-Aurevo-X/UnitConvert/releases/latest/download/UnitConvert.exe)** · **[All releases](https://github.com/Mr-Aurevo-X/UnitConvert/releases)**

> Direct Windows binary (latest). Open [Releases](https://github.com/Mr-Aurevo-X/UnitConvert/releases) if the right-sidebar “Releases” link is scrolled away — downloads are **not** under “Tags”.

**© 2026 Mr-Aurevo-X — UnitConvert — 100% local — free — updates not guaranteed**

Convertisseur d'unités multi-catégories — 100 % local, 100 % gratuit.  
Multi-category unit converter — 100% local, 100% free.

## Download / Téléchargement

- **One-click:** [UnitConvert.exe](https://github.com/Mr-Aurevo-X/UnitConvert/releases/latest/download/UnitConvert.exe)
- **Release notes / all versions:** [github.com/Mr-Aurevo-X/UnitConvert/releases](https://github.com/Mr-Aurevo-X/UnitConvert/releases)

Double-cliquer sur `UnitConvert.exe` pour lancer (pas d'installation).  
Double-click `UnitConvert.exe` to run (no install).

## Fonctions / Features (v1)

- Catégories : **longueur, masse, température, surface, volume, données (bit/B/KB/MB/GB/TB + KiB/MiB/GiB), vitesse, temps**
- Conversion **live** (saisie → résultat instantané), inversion des unités, table « conversions courantes »
- Copier le résultat ou « X unité = Y unité »
- **100 % local** — facteurs embarqués, aucun réseau pour convertir. **Pas de devises** (voir DeviseConvert)

## Legal / Légal

| FR | EN |
|:--|:--|
| **100 % gratuit** | **100% free** |
| **100 % local** — aucun cloud, aucune télémétrie | **100% local** — no cloud, no telemetry |
| **Mise à jour non garantie** — pas d’obligation / pas de SLA ; l’app *peut* vérifier GitHub Releases | **Updates not guaranteed** — no obligation / no SLA; the app *can* check GitHub Releases |
| **Copyright © 2026 Mr-Aurevo-X** — tous droits réservés | **Copyright © 2026 Mr-Aurevo-X** — all rights reserved |

Licence : **proprietary / all rights reserved** (voir `LICENSE`).  
Redistribution, reverse engineering ou suppression des mentions de copyright **interdits** sans accord écrit.

## Lancer (exe primary)

**Double-clic `UnitConvert.exe`** — lancement principal, sans flash CMD.

| Fichier | Usage |
|:--|:--|
| `UnitConvert.exe` | **Principal** — binaire windowed (après `Build.cmd`) |
| `Lancer.bat` / `UnitConvert.bat` | Si l'exe est présent → `start` l'exe puis exit ; sinon fallback `pythonw` détaché |
| `Lancer.cmd` | Même logique (alias optionnel) |

Dev / sans exe :

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\Lancer.bat
```

## Build .exe

```powershell
cd "C:\Users\aurel\Documents\Dev Central Tree\Git Vitrine Public\UnitConvert"
.\Build.cmd
```

Produit `dist\UnitConvert.exe` puis copie vers `UnitConvert.exe` à la racine.  
Le `.exe` peut être gitignoré — rebuild via `Build.cmd`.  
Pour publier une màj : bumper `VERSION`, build, créer une **GitHub Release** avec l’asset `UnitConvert.exe`.

## Version & mises à jour (optionnel)

- Fichier version : `VERSION` à la racine (ex. `1.0.0`).
- Au démarrage, vérif. **non bloquante** de `https://api.github.com/repos/Mr-Aurevo-X/UnitConvert/releases/latest`.
- **Seul appel réseau optionnel** : cette vérif. / màj. La conversion reste 100 % locale.

## UI kit

Chrome propriétaire : SoT `Dev Central Tree\UI proprietaire\` → `ui\vendor\pc-command-kit`  
Sync : `.\scripts\Sync-All-UiKit.ps1` depuis la racine Dev Central Tree (**ne pas** éditer le vendor à la main).

## Stack

Python · pywebview · PyInstaller · PC Command kit
