# Security Policy — UnitConvert

## Scope (EN)

**UnitConvert** is a **local Windows** desktop tool (portable `.exe` / local UI).  
There is **no** Mr-Aurevo-X backend and **no** telemetry.

Outbound network (when it happens):
- **Optional** read-only GitHub **Latest release** check when that preference is enabled
- **Support / donate links** only when the user clicks (allowlisted)
- **Currencies:** Frankfurter (ECB rates) over HTTPS when you refresh rates; local offline cache otherwise. Unit conversion stays fully local.

Official builds: only Releases on **https://github.com/Mr-Aurevo-X/UnitConvert**  
Forks / modified copies are **not** covered by this policy.

## Périmètre (FR)

Outil **local** Windows. Pas de serveur Mr-Aurevo-X, pas de télémétrie.

Sorties réseau possibles :
- vérif. version GitHub **optionnelle** (si activée)
- liens soutien / dons **au clic**
- **Devises :** Frankfurter (taux BCE) en HTTPS quand tu actualises les taux ; sinon cache local. Les **unités** restent 100 % locales.

Builds officiels uniquement : Releases de ce dépôt. Les forks modifiés ne sont **pas** couverts.

## Threat model

**In scope:** bugs in this repo / official release that cause unexpected network use, unsafe file handling, or code execution beyond the intended UI.

**Out of scope:** third-party modified builds, compromised user machines, SmartScreen warnings on unsigned binaries, accuracy of third-party FX rates (indicative only, not financial advice).

## Reporting / Signalement

Prefer a **private GitHub Security Advisory** on this repository.  
Do **not** post exploit details in public issues.  
Préférez une **advisory privée** GitHub.

## Hardening (high level)

- Local-first UI; no account; no forced cloud sync
- User-initiated actions only for browser / donate links and rate refresh

## Dependencies

Review dependency alerts when enabled on this repository.
