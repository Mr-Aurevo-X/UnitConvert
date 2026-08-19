/**
 * Copyright (c) 2026 Mr-Aurevo-X. All rights reserved.
 * SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * Author: Mr-Aurevo-X · https://github.com/Mr-Aurevo-X
 */
/**
 * UnitConvert — UI (proprietary)
 * © 2026 Mr-Aurevo-X · UnitConvert · free · updates not guaranteed
 * Units 100% local · currencies via Frankfurter (ex-DeviseConvert)
 * All rights reserved. Do not strip copyright notices.
 */
(() => {
  "use strict";
  // © 2026 Mr-Aurevo-X · UnitConvert · free · updates not guaranteed

  const SUITE_I18N = {
    fr: {
      tagline: "Unités · 100 % local",
      taglineCurrency: "Devises · taux BCE",
      copyright: "Copyright © 2026 Mr-Aurevo-X — tous droits réservés",
      title: "UnitConvert",
      subtitle: "Conversion live · facteurs locaux",
      subtitleCurrency: "Conversion de devises · taux BCE",
      tabUnits: "Unités",
      tabCurrency: "Devises",
      featuresTitle: "Catégories",
      features:
        "Longueur, masse, température, surface, volume, données, vitesse, temps — conversion live, copie.",
      featuresTitleCurrency: "Devises",
      featuresCurrency:
        "EUR, USD, GBP, CHF, CAD, AUD, JPY, CNY… — taux BCE en direct (Frankfurter), cache hors ligne, inversion, copie.",
      privacy:
        "Mr-Aurevo-X ne collecte aucune donnée. Conversions unités 100 % locales. Devises : taux Frankfurter (BCE) en HTTPS, cache local. Vérif. màj GitHub optionnelle.",
      badgeFree: "100 % gratuit",
      badgeEcb: "Taux BCE",
      legalFree: "100 % gratuit",
      legalLocal: "Unités 100 % locales — aucune télémétrie",
      legalRates: "Devises : taux indicatifs BCE via Frankfurter (HTTPS)",
      legalOffline: "Devises : réseau optionnel — cache local hors ligne",
      legalUpdates: "Mise à jour non garantie — vérif. optionnelle GitHub",
      aboutTitle: "À propos — UnitConvert",
      aboutBody:
        "Convertisseur d'unités et de devises Mr-Aurevo-X. Unités 100 % locales ; devises via Frankfurter (BCE), cache hors ligne. Gratuit, sans compte ni clé API. Mise à jour non garantie.",
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
      amountLabel: "Montant",
      resultLabel: "Résultat",
      btnCopy: "Copier le résultat",
      btnCopyPair: "Copier « X = Y »",
      btnRefresh: "Actualiser",
      refreshing: "Actualisation…",
      commonTitle: "Conversions courantes",
      copied: "Copié",
      copyFail: "Copie impossible",
      invalidNumber: "Nombre invalide",
      invalidAmount: "Montant invalide",
      rateLive: "Taux en direct du {date}",
      rateCache: "Cache — taux du {date}",
      rateSnapshot: "Taux embarqués (démo) — {date}",
      offline: "hors ligne",
      disclaimer:
        "Taux indicatifs BCE (via Frankfurter). Ceci n'est pas un conseil financier. La disponibilité et la mise à jour des taux ne sont pas garanties.",
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
      taglineCurrency: "Currencies · ECB rates",
      copyright: "Copyright © 2026 Mr-Aurevo-X — all rights reserved",
      title: "UnitConvert",
      subtitle: "Live conversion · local factors",
      subtitleCurrency: "Currency conversion · ECB rates",
      tabUnits: "Units",
      tabCurrency: "Currencies",
      featuresTitle: "Categories",
      features:
        "Length, mass, temperature, area, volume, data, speed, time — live conversion, copy.",
      featuresTitleCurrency: "Currencies",
      featuresCurrency:
        "EUR, USD, GBP, CHF, CAD, AUD, JPY, CNY… — live ECB rates (Frankfurter), offline cache, invert, copy.",
      privacy:
        "Mr-Aurevo-X does not collect your data. Unit conversions are 100% local. Currencies: Frankfurter (ECB) rates over HTTPS, local cache. Optional GitHub update check.",
      badgeFree: "100% free",
      badgeEcb: "ECB rates",
      legalFree: "100% free",
      legalLocal: "Units 100% local — no telemetry",
      legalRates: "Currencies: indicative ECB rates via Frankfurter (HTTPS)",
      legalOffline: "Currencies: network optional — local offline cache",
      legalUpdates: "Updates not guaranteed — optional GitHub check",
      aboutTitle: "About — UnitConvert",
      aboutBody:
        "Mr-Aurevo-X unit and currency converter. Units 100% local; currencies via Frankfurter (ECB), offline cache. Free, no account or API key. Updates not guaranteed.",
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
      amountLabel: "Amount",
      resultLabel: "Result",
      btnCopy: "Copy result",
      btnCopyPair: "Copy “X = Y”",
      btnRefresh: "Refresh",
      refreshing: "Refreshing…",
      commonTitle: "Common conversions",
      copied: "Copied",
      copyFail: "Copy failed",
      invalidNumber: "Invalid number",
      invalidAmount: "Invalid amount",
      rateLive: "Live rates as of {date}",
      rateCache: "Cache — rates of {date}",
      rateSnapshot: "Bundled (demo) rates — {date}",
      offline: "offline",
      disclaimer:
        "Indicative ECB rates (via Frankfurter). This is not financial advice. Rate availability and updates are not guaranteed.",
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
    topMode: "units",
    registry: [],
    category: "length",
    fromUnit: "m",
    toUnit: "ft",
    value: "1",
    result: null,
    currencies: [],
    rates: {},
    currencyDate: null,
    currencySource: "snapshot",
    currencyFrom: "EUR",
    currencyTo: "USD",
    currencyAmount: "100",
    currencyResult: null,
  };

  const el = {
    status: document.getElementById("status"),
    topModeTabs: document.getElementById("topModeTabs"),
    unitsPanel: document.getElementById("unitsPanel"),
    currencyPanel: document.getElementById("currencyPanel"),
    badgeRow: document.getElementById("badgeRow"),
    featureDesc: document.getElementById("featureDesc"),
    legalStrip: document.getElementById("legalStrip"),
    meta: document.getElementById("meta"),
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
    rateInfo: document.getElementById("rateInfo"),
    offlineBadge: document.getElementById("offlineBadge"),
    btnRefresh: document.getElementById("btnRefresh"),
    amount: document.getElementById("amount"),
    result: document.getElementById("result"),
    fromCode: document.getElementById("fromCode"),
    toCode: document.getElementById("toCode"),
    btnSwapCurrency: document.getElementById("btnSwapCurrency"),
    btnCopyCurrency: document.getElementById("btnCopyCurrency"),
    btnCopyPairCurrency: document.getElementById("btnCopyPairCurrency"),
    convFormulaCurrency: document.getElementById("convFormulaCurrency"),
    btnAbout: document.getElementById("btnAbout"),
    aboutDialog: document.getElementById("aboutDialog"),
    updateBanner: document.getElementById("updateBanner"),
    updateTitle: document.getElementById("updateTitle"),
    updateDetail: document.getElementById("updateDetail"),
    btnUpdateNow: document.getElementById("btnUpdateNow"),
    btnUpdateLater: document.getElementById("btnUpdateLater"),
  };

  let pendingRemoteVersion = null;
  let currencyBooted = false;

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

  function formatMoney(n) {
    if (n == null || !isFinite(n)) return "—";
    return new Intl.NumberFormat(suiteLang === "en" ? "en-US" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(n);
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
    if (cat.id === "temperature") return null;
    const units = cat.unitFactors;
    if (!units || units[fromU] == null || units[toU] == null) return null;
    return (value * units[fromU]) / units[toU];
  }

  function updateSidebarForMode() {
    const taglineEl = document.querySelector(".brand-text p[data-i18n='tagline']");
    if (state.topMode === "currency") {
      if (taglineEl) taglineEl.textContent = t("taglineCurrency");
      if (el.meta) el.meta.textContent = t("subtitleCurrency");
      if (el.featureDesc) {
        el.featureDesc.innerHTML =
          `<strong>${t("featuresTitleCurrency")}</strong> <span>${t("featuresCurrency")}</span>`;
      }
      if (el.badgeRow) {
        el.badgeRow.innerHTML =
          `<span class="badge free">${t("badgeFree")}</span>` +
          `<span class="badge ecb">${t("badgeEcb")}</span>`;
      }
      if (el.legalStrip) {
        el.legalStrip.innerHTML =
          `<li>${t("legalFree")}</li>` +
          `<li>${t("legalRates")}</li>` +
          `<li>${t("legalOffline")}</li>` +
          `<li>${t("legalUpdates")}</li>`;
      }
    } else {
      if (taglineEl) taglineEl.textContent = t("tagline");
      if (el.meta) el.meta.textContent = t("subtitle");
      if (el.featureDesc) {
        el.featureDesc.innerHTML =
          `<strong>${t("featuresTitle")}</strong> <span>${t("features")}</span>`;
      }
      if (el.badgeRow) {
        el.badgeRow.innerHTML =
          `<span class="badge">LOCAL</span>` +
          `<span class="badge free">${t("badgeFree")}</span>`;
      }
      if (el.legalStrip) {
        el.legalStrip.innerHTML =
          `<li>${t("legalFree")}</li>` +
          `<li>${t("legalLocal")}</li>` +
          `<li>${t("legalUpdates")}</li>`;
      }
    }
  }

  function setTopMode(mode) {
    state.topMode = mode;
    el.topModeTabs.querySelectorAll(".top-mode-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
    el.unitsPanel.hidden = mode !== "units";
    el.currencyPanel.hidden = mode !== "currency";
    updateSidebarForMode();
    setStatus(t("ready"));
    if (mode === "currency" && !currencyBooted) {
      currencyBooted = true;
      bootCurrency();
    }
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
        convertUnits();
      });
      el.categoryTabs.appendChild(btn);
    });
  }

  function fillSelect(sel, items, selected, labelFn) {
    sel.innerHTML = "";
    items.forEach((item) => {
      const o = document.createElement("option");
      if (typeof item === "string") {
        o.value = item;
        o.textContent = labelFn ? labelFn(item) : item;
      } else {
        o.value = item.code || item;
        o.textContent = labelFn ? labelFn(item) : `${item.code} — ${item.name}`;
      }
      const val = typeof item === "string" ? item : item.code;
      if (val === selected) o.selected = true;
      sel.appendChild(o);
    });
  }

  function renderUnitSelects() {
    const cat = currentCat();
    if (!cat) return;
    fillSelect(el.fromUnit, cat.units, state.fromUnit);
    fillSelect(el.toUnit, cat.units, state.toUnit);
  }

  async function convertUnits() {
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
        convertUnits();
      });
      el.commonGrid.appendChild(cell);
    }
  }

  function swapUnits() {
    const a = state.fromUnit;
    state.fromUnit = state.toUnit;
    state.toUnit = a;
    if (el.toValue.value) el.fromValue.value = el.toValue.value;
    renderUnitSelects();
    convertUnits();
  }

  function applyCurrencyState(s) {
    if (!s || !s.ok) return;
    state.currencies = s.currencies || [];
    state.rates = s.rates || {};
    state.currencyDate = s.date;
    state.currencySource = s.source || "snapshot";
    if (!state.rates[state.currencyFrom]) state.currencyFrom = "EUR";
    if (!state.rates[state.currencyTo]) state.currencyTo = "USD";
    renderRateBar();
  }

  function renderRateBar() {
    const dateStr = state.currencyDate || "—";
    let key = "rateSnapshot";
    if (state.currencySource === "live") key = "rateLive";
    else if (state.currencySource === "cache") key = "rateCache";
    el.rateInfo.textContent = t(key).replace("{date}", dateStr);
    if (state.currencySource !== "live") {
      el.offlineBadge.textContent = t("offline");
      el.offlineBadge.hidden = false;
    } else {
      el.offlineBadge.hidden = true;
    }
  }

  function renderCurrencySelects() {
    fillSelect(el.fromCode, state.currencies, state.currencyFrom, (c) => `${c.code} — ${c.name}`);
    fillSelect(el.toCode, state.currencies, state.currencyTo, (c) => `${c.code} — ${c.name}`);
  }

  function convertCurrency() {
    const raw = String(el.amount.value || "").trim().replace(",", ".");
    if (raw === "" || raw === "-" || isNaN(Number(raw))) {
      el.result.value = "";
      el.convFormulaCurrency.textContent = "";
      if (raw !== "") setStatus(t("invalidAmount"));
      return;
    }
    const amt = Number(raw);
    state.currencyAmount = raw;
    const rf = state.rates[state.currencyFrom];
    const rt = state.rates[state.currencyTo];
    if (rf == null || rt == null) {
      el.result.value = "";
      return;
    }
    const res = (amt / rf) * rt;
    const unit = (1 / rf) * rt;
    state.currencyResult = res;
    el.result.value = formatMoney(res);
    el.convFormulaCurrency.textContent =
      `${formatMoney(amt)} ${state.currencyFrom} = ${formatMoney(res)} ${state.currencyTo}  ·  1 ${state.currencyFrom} = ${formatMoney(unit)} ${state.currencyTo}`;
    setStatus(t("ready"));
  }

  async function refreshRates() {
    const api = await apiReady();
    const refreshFn = (api && (api.refresh_rates || api.refresh)) || null;
    if (!refreshFn) return;
    el.btnRefresh.disabled = true;
    setStatus(t("refreshing"));
    try {
      const s = await refreshFn.call(api);
      applyCurrencyState(s);
      renderCurrencySelects();
      convertCurrency();
      setStatus(t("ready"));
    } catch (_) {
      setStatus(t("ready"));
    } finally {
      el.btnRefresh.disabled = false;
    }
  }

  function swapCurrency() {
    const a = state.currencyFrom;
    state.currencyFrom = state.currencyTo;
    state.currencyTo = a;
    if (el.result.value) {
      const cleaned = el.result.value.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
      if (cleaned && !isNaN(Number(cleaned))) el.amount.value = cleaned;
    }
    renderCurrencySelects();
    convertCurrency();
  }

  async function bootCurrency() {
    const api = await apiReady();
    const getState = (api && (api.get_currency_state || api.get_state)) || null;
    if (getState) {
      try {
        const s = await getState.call(api);
        applyCurrencyState(s);
      } catch (_) {}
    }
    renderCurrencySelects();
    convertCurrency();
    setTimeout(() => refreshRates(), 200);
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
    el.btnCopyCurrency.textContent = t("btnCopy");
    el.btnCopyPairCurrency.textContent = t("btnCopyPair");
    el.btnRefresh.textContent = t("btnRefresh");
    el.btnAbout.textContent = t("btnAbout");
    el.topModeTabs.querySelectorAll(".top-mode-tab").forEach((btn) => {
      const key = btn.dataset.mode === "currency" ? "tabCurrency" : "tabUnits";
      btn.textContent = t(key);
    });
    if (el.updateTitle) el.updateTitle.textContent = t("updateTitle");
    if (el.btnUpdateNow) el.btnUpdateNow.textContent = t("btnUpdate");
    if (el.btnUpdateLater) el.btnUpdateLater.textContent = t("btnLater");
    updateSidebarForMode();
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

  async function loadFactors(api) {
    for (const cat of state.registry) {
      if (cat.id === "temperature") continue;
      const factors = {};
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

  el.topModeTabs.querySelectorAll(".top-mode-tab").forEach((btn) => {
    btn.addEventListener("click", () => setTopMode(btn.dataset.mode));
  });
  el.fromValue.addEventListener("input", convertUnits);
  el.fromUnit.addEventListener("change", (e) => { state.fromUnit = e.target.value; convertUnits(); });
  el.toUnit.addEventListener("change", (e) => { state.toUnit = e.target.value; convertUnits(); });
  el.btnSwap.addEventListener("click", swapUnits);
  el.btnCopy.addEventListener("click", () => copyText(el.toValue.value || ""));
  el.btnCopyPair.addEventListener("click", () =>
    copyText(`${formatNum(Number(state.value))} ${state.fromUnit} = ${el.toValue.value} ${state.toUnit}`));
  el.amount.addEventListener("input", convertCurrency);
  el.fromCode.addEventListener("change", (e) => { state.currencyFrom = e.target.value; convertCurrency(); });
  el.toCode.addEventListener("change", (e) => { state.currencyTo = e.target.value; convertCurrency(); });
  el.btnSwapCurrency.addEventListener("click", swapCurrency);
  el.btnRefresh.addEventListener("click", refreshRates);
  el.btnCopyCurrency.addEventListener("click", () => copyText(el.result.value || ""));
  el.btnCopyPairCurrency.addEventListener("click", () =>
    copyText(`${formatMoney(Number(state.currencyAmount))} ${state.currencyFrom} = ${el.result.value} ${state.currencyTo}`));
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
          state.registry = reg.categories.map((c) => ({ ...c, unitFactors: null }));
        }
      } catch (_) {}
    }
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
    await convertUnits();
    setTimeout(() => runUpdateCheck(api), 800);
  })();
})();
