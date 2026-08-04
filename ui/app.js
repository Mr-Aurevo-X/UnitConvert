/**
 * UnitConvert — UI (proprietary)
 * © 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed
 * All rights reserved. Do not strip copyright notices.
 */
(() => {
  "use strict";
  // © 2026 Mr-Aurevo-X · UnitConvert · 100% local · free · updates not guaranteed

  const SUITE_I18N = {
    fr: {
      tagline: "Unités · 100 % local",
      copyright: "Copyright © 2026 Mr-Aurevo-X — tous droits réservés",
      title: "UnitConvert",
      subtitle: "Conversion live · facteurs locaux",
      featuresTitle: "Catégories",
      features:
        "Longueur, masse, température, surface, volume, données, vitesse, temps — conversion live, copie.",
      privacy:
        "Mr-Aurevo-X ne collecte aucune donnée. Conversions 100 % locales (facteurs embarqués). Seul appel réseau optionnel : vérif. de mise à jour GitHub.",
      badgeFree: "100 % gratuit",
      legalFree: "100 % gratuit",
      legalLocal: "100 % local — aucun cloud, aucune télémétrie",
      legalUpdates: "Mise à jour non garantie — vérif. optionnelle GitHub",
      aboutTitle: "À propos — UnitConvert",
      aboutBody:
        "Convertisseur d'unités Mr-Aurevo-X. 100 % gratuit, 100 % local (facteurs embarqués, aucun réseau pour convertir). Mise à jour non garantie (pas d'obligation). L'app peut vérifier GitHub Releases et proposer une mise à jour.",
      aboutRights:
        "Redistribution, reverse engineering ou suppression du copyright interdits sans accord écrit.",
      btnAbout: "À propos",
      btnClose: "Fermer",
      updateTitle: "Nouvelle version disponible",
      updateDetail: "v{local} → v{remote}",
      btnUpdate: "Mettre à jour",
      btnLater: "Plus tard",
      updateApplying: "Mise à jour des sources…",
      updateDone: "Sources à jour — relancez Lancer.bat",
      updateFail: "Mise à jour impossible",
      hostMissing: "Host indisponible",
      ready: "Prêt",
      fromLabel: "De",
      toLabel: "Vers",
      btnCopy: "Copier le résultat",
      btnCopyPair: "Copier « X = Y »",
      commonTitle: "Conversions courantes",
      copied: "Copié",
      copyFail: "Copie impossible",
      invalidNumber: "Nombre invalide",
      catLength: "Longueur",
      catMass: "Masse",
      catTemperature: "Température",
      catArea: "Surface",
      catVolume: "Volume",
      catData: "Données",
      catSpeed: "Vitesse",
      catTime: "Temps",
    },
    en: {
      tagline: "Units · 100% local",
      copyright: "Copyright © 2026 Mr-Aurevo-X — all rights reserved",
      title: "UnitConvert",
      subtitle: "Live conversion · local factors",
      featuresTitle: "Categories",
      features:
        "Length, mass, temperature, area, volume, data, speed, time — live conversion, copy.",
      privacy:
        "Mr-Aurevo-X does not collect your data. 100% local conversions (embedded factors). Only optional network call: GitHub update check.",
      badgeFree: "100% free",
      legalFree: "100% free",
      legalLocal: "100% local — no cloud, no telemetry",
      legalUpdates: "Updates not guaranteed — optional GitHub check",
      aboutTitle: "About — UnitConvert",
      aboutBody:
        "Mr-Aurevo-X unit converter. 100% free, 100% local (embedded factors, no network to convert). Updates not guaranteed (no obligation). The app can check GitHub Releases and offer an update.",
      aboutRights:
        "Redistribution, reverse engineering, or stripping copyright is forbidden without written consent.",
      btnAbout: "About",
      btnClose: "Close",
      updateTitle: "New version available",
      updateDetail: "v{local} → v{remote}",
      btnUpdate: "Update",
      btnLater: "Later",
      updateApplying: "Updating sources…",
      updateDone: "Sources updated — relaunch Lancer.bat",
      updateFail: "Update failed",
      hostMissing: "Host unavailable",
      ready: "Ready",
      fromLabel: "From",
      toLabel: "To",
      btnCopy: "Copy result",
      btnCopyPair: "Copy “X = Y”",
      commonTitle: "Common conversions",
      copied: "Copied",
      copyFail: "Copy failed",
      invalidNumber: "Invalid number",
      catLength: "Length",
      catMass: "Mass",
      catTemperature: "Temperature",
      catArea: "Area",
      catVolume: "Volume",
      catData: "Data",
      catSpeed: "Speed",
      catTime: "Time",
    },
  };

  const CAT_KEY = {
    length: "catLength", mass: "catMass", temperature: "catTemperature",
    area: "catArea", volume: "catVolume", data: "catData",
    speed: "catSpeed", time: "catTime",
  };

  const DEFAULT_PAIR = {
    length: ["m", "ft"], mass: ["kg", "lb"], temperature: ["C", "F"],
    area: ["m²", "ft²"], volume: ["L", "gal"], data: ["GB", "GiB"],
    speed: ["km/h", "mph"], time: ["h", "min"],
  };

  let suiteLang = "fr";
  const t = (key) => (SUITE_I18N[suiteLang] && SUITE_I18N[suiteLang][key]) || SUITE_I18N.fr[key] || key;

  const state = {
    registry: [],
    category: "length",
    fromUnit: "m",
    toUnit: "ft",
    value: "1",
    result: null,
  };

  const el = {
    status: document.getElementById("status"),
    categoryTabs: document.getElementById("categoryTabs"),
    fromValue: document.getElementById("fromValue"),
    toValue: document.getElementById("toValue"),
    fromUnit: document.getElementById("fromUnit"),
    toUnit: document.getElementById("toUnit"),
    btnSwap: document.getElementById("btnSwap"),
    btnCopy: document.getElementById("btnCopy"),
    btnCopyPair: document.getElementById("btnCopyPair"),
    convFormula: document.getElementById("convFormula"),
    commonGrid: document.getElementById("commonGrid"),
    btnAbout: document.getElementById("btnAbout"),
    aboutDialog: document.getElementById("aboutDialog"),
    updateBanner: document.getElementById("updateBanner"),
    updateTitle: document.getElementById("updateTitle"),
    updateDetail: document.getElementById("updateDetail"),
    btnUpdateNow: document.getElementById("btnUpdateNow"),
    btnUpdateLater: document.getElementById("btnUpdateLater"),
  };

  let pendingRemoteVersion = null;

  function apiReady() {
    return new Promise((resolve) => {
      if (window.pywebview && window.pywebview.api) return resolve(window.pywebview.api);
      window.addEventListener("pywebviewready", () => resolve(window.pywebview.api), { once: true });
      setTimeout(() => resolve(window.pywebview && window.pywebview.api), 2500);
    });
  }

  function setStatus(msg) {
    el.status.textContent = msg || "";
  }

  function currentCat() {
    return state.registry.find((c) => c.id === state.category) || state.registry[0];
  }

  function formatNum(n) {
    if (n == null || !isFinite(n)) return "—";
    if (n === 0) return "0";
    const abs = Math.abs(n);
    let s;
    if (abs < 1e-6 || abs >= 1e15) s = n.toExponential(6);
    else s = n.toPrecision(12);
    return String(parseFloat(s));
  }

  function localConvert(value, fromU, toU, cat) {
    // Local mirror of host math for instant common-grid rendering.
    if (cat.id === "temperature") return null; // done server-side
    const units = cat.unitFactors;
    if (!units || units[fromU] == null || units[toU] == null) return null;
    return (value * units[fromU]) / units[toU];
  }

  function renderCategoryTabs() {
    el.categoryTabs.innerHTML = "";
    state.registry.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-tab" + (state.category === c.id ? " active" : "");
      btn.textContent = t(CAT_KEY[c.id] || c.id);
      btn.addEventListener("click", () => {
        state.category = c.id;
        const pair = DEFAULT_PAIR[c.id] || [c.units[0], c.units[1] || c.units[0]];
        state.fromUnit = c.units.includes(pair[0]) ? pair[0] : c.units[0];
        state.toUnit = c.units.includes(pair[1]) ? pair[1] : (c.units[1] || c.units[0]);
        renderCategoryTabs();
        renderUnitSelects();
        convert();
      });
      el.categoryTabs.appendChild(btn);
    });
  }

  function fillSelect(sel, units, selected) {
    sel.innerHTML = "";
    units.forEach((u) => {
      const o = document.createElement("option");
      o.value = u;
      o.textContent = u;
      if (u === selected) o.selected = true;
      sel.appendChild(o);
    });
  }

  function renderUnitSelects() {
    const cat = currentCat();
    if (!cat) return;
    fillSelect(el.fromUnit, cat.units, state.fromUnit);
    fillSelect(el.toUnit, cat.units, state.toUnit);
  }

  async function convert() {
    const api = await apiReady();
    const cat = currentCat();
    if (!cat) return;
    const raw = String(el.fromValue.value || "").trim().replace(",", ".");
    if (raw === "" || raw === "-" || isNaN(Number(raw))) {
      el.toValue.value = "";
      el.convFormula.textContent = "";
      renderCommon(null);
      if (raw !== "") setStatus(t("invalidNumber"));
      return;
    }
    const value = Number(raw);
    state.value = raw;
    if (!api || !api.convert) {
      setStatus(t("hostMissing"));
      return;
    }
    try {
      const res = await api.convert(state.category, value, state.fromUnit, state.toUnit);
      if (!res || !res.ok) {
        setStatus((res && res.error) || "—");
        return;
      }
      state.result = res.result;
      el.toValue.value = formatNum(res.result);
      el.convFormula.textContent =
        `${formatNum(value)} ${state.fromUnit} = ${formatNum(res.result)} ${state.toUnit}`;
      setStatus(t("ready"));
      renderCommon(value);
    } catch (e) {
      setStatus(String((e && e.message) || e));
    }
  }

  async function renderCommon(value) {
    const cat = currentCat();
    el.commonGrid.innerHTML = "";
    if (!cat || value == null) return;
    const api = await apiReady();
    for (const u of cat.units) {
      let out;
      if (cat.id === "temperature") {
        try {
          const r = await api.convert(cat.id, value, state.fromUnit, u);
          out = r && r.ok ? r.result : null;
        } catch (_) { out = null; }
      } else {
        out = localConvert(value, state.fromUnit, u, cat);
      }
      const cell = document.createElement("div");
      cell.className = "common-cell" + (u === state.toUnit ? " active" : "");
      cell.innerHTML =
        `<span class="common-unit">${u}</span><span class="common-val">${formatNum(out)}</span>`;
      cell.title = `${formatNum(value)} ${state.fromUnit} = ${formatNum(out)} ${u}`;
      cell.addEventListener("click", () => {
        state.toUnit = u;
        renderUnitSelects();
        convert();
      });
      el.commonGrid.appendChild(cell);
    }
  }

  function swap() {
    const a = state.fromUnit;
    state.fromUnit = state.toUnit;
    state.toUnit = a;
    if (el.toValue.value) el.fromValue.value = el.toValue.value;
    renderUnitSelects();
    convert();
  }

  async function copyText(text) {
    const api = await apiReady();
    if (!text) return;
    try {
      if (api && api.copy_text) {
        const res = await api.copy_text(text);
        if (res && res.ok) { setStatus(t("copied")); return; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setStatus(t("copied"));
        return;
      }
      setStatus(t("copyFail"));
    } catch (_) {
      setStatus(t("copyFail"));
    }
  }

  function applyAccent(hex) {
    const accent = String(hex || "#3ec7ff").trim();
    if (!(accent.startsWith("#") && (accent.length === 4 || accent.length === 7))) return;
    let h = accent.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-dim", `rgba(${r}, ${g}, ${b}, 0.2)`);
    root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.4)`);
  }

  async function bootSuite(api) {
    const suite = window.MrAurevoXSuite;
    if (suite) {
      const settings = await suite.loadSuiteSettings(api);
      suiteLang = settings.language === "en" ? "en" : "fr";
      suite.applyAccent(settings.accent);
      suite.applyI18n(suiteLang, SUITE_I18N);
      return;
    }
    if (api && api.get_suite_settings) {
      try {
        const s = await api.get_suite_settings();
        if (s && s.accent) applyAccent(s.accent);
        if (s && s.language === "en") suiteLang = "en";
      } catch (_) {}
    }
  }

  function refreshChromeLabels() {
    el.btnCopy.textContent = t("btnCopy");
    el.btnCopyPair.textContent = t("btnCopyPair");
    el.btnAbout.textContent = t("btnAbout");
    if (el.updateTitle) el.updateTitle.textContent = t("updateTitle");
    if (el.btnUpdateNow) el.btnUpdateNow.textContent = t("btnUpdate");
    if (el.btnUpdateLater) el.btnUpdateLater.textContent = t("btnLater");
  }

  function showUpdateBanner(info) {
    if (!el.updateBanner || !info) return;
    pendingRemoteVersion = info.remote || null;
    const detail = t("updateDetail")
      .replace("{local}", info.local || "?")
      .replace("{remote}", info.remote || "?");
    if (el.updateDetail) el.updateDetail.textContent = detail;
    el.updateBanner.hidden = false;
  }

  function hideUpdateBanner() {
    if (el.updateBanner) el.updateBanner.hidden = true;
  }

  async function runUpdateCheck(api) {
    if (!api || !api.check_for_update) return;
    try {
      const info = await api.check_for_update();
      if (!info || !info.ok || !info.updateAvailable) return;
      if (info.autoUpdate && api.apply_update) {
        setStatus(t("updateApplying"));
        const res = await api.apply_update();
        if (res && res.ok && res.applied) { setStatus(t("updateDone")); return; }
      }
      showUpdateBanner(info);
    } catch (_) { /* offline / rate-limit — silent */ }
  }

  async function applyUpdateNow() {
    const api = await apiReady();
    if (!api || !api.apply_update) return;
    if (el.btnUpdateNow) el.btnUpdateNow.disabled = true;
    setStatus(t("updateApplying"));
    try {
      const res = await api.apply_update();
      if (res && res.ok && res.applied) { setStatus(t("updateDone")); hideUpdateBanner(); return; }
      setStatus((res && res.error) || t("updateFail"));
    } catch (e) {
      setStatus(String((e && e.message) || e) || t("updateFail"));
    } finally {
      if (el.btnUpdateNow) el.btnUpdateNow.disabled = false;
    }
  }

  async function dismissUpdateLater() {
    const api = await apiReady();
    hideUpdateBanner();
    try {
      if (api && api.dismiss_update) await api.dismiss_update(pendingRemoteVersion || "");
    } catch (_) {}
  }

  el.fromValue.addEventListener("input", convert);
  el.fromUnit.addEventListener("change", (e) => { state.fromUnit = e.target.value; convert(); });
  el.toUnit.addEventListener("change", (e) => { state.toUnit = e.target.value; convert(); });
  el.btnSwap.addEventListener("click", swap);
  el.btnCopy.addEventListener("click", () => copyText(el.toValue.value || ""));
  el.btnCopyPair.addEventListener("click", () =>
    copyText(`${formatNum(Number(state.value))} ${state.fromUnit} = ${el.toValue.value} ${state.toUnit}`));
  el.btnAbout.addEventListener("click", () => {
    if (el.aboutDialog && el.aboutDialog.showModal) el.aboutDialog.showModal();
  });
  if (el.btnUpdateNow) el.btnUpdateNow.addEventListener("click", applyUpdateNow);
  if (el.btnUpdateLater) el.btnUpdateLater.addEventListener("click", dismissUpdateLater);

  (async () => {
    const api = await apiReady();
    await bootSuite(api);
    refreshChromeLabels();
    if (api && api.get_registry) {
      try {
        const reg = await api.get_registry();
        if (reg && reg.ok) {
          // Fetch factors for local common-grid math.
          state.registry = reg.categories.map((c) => ({ ...c, unitFactors: null }));
        }
      } catch (_) {}
    }
    // Load raw factors for instant client-side common grid (non-temperature).
    await loadFactors(api);
    const first = state.registry[0];
    if (first) {
      state.category = first.id;
      const pair = DEFAULT_PAIR[first.id] || [first.units[0], first.units[1]];
      state.fromUnit = pair[0];
      state.toUnit = pair[1];
    }
    renderCategoryTabs();
    renderUnitSelects();
    await convert();
    setTimeout(() => runUpdateCheck(api), 800);
  })();

  // Pull factor tables once so the common grid renders without per-cell round-trips.
  async function loadFactors(api) {
    // Derive factors by asking host to convert 1 unit -> base for each unit.
    for (const cat of state.registry) {
      if (cat.id === "temperature") continue;
      const factors = {};
      // base factor is 1; compute others relative by converting 1 u -> base
      for (const u of cat.units) {
        try {
          const r = await api.convert(cat.id, 1, u, cat.base);
          factors[u] = r && r.ok ? r.result : null;
        } catch (_) { factors[u] = null; }
      }
      factors[cat.base] = 1;
      cat.unitFactors = factors;
    }
  }
})();
