/**
 * Copyright (c) 2026 Mr-Aurevo-X. All rights reserved.
 * SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * Author: Mr-Aurevo-X · https://github.com/Mr-Aurevo-X
 */
/**
 * Hub-style frameless chrome wiring (L'Atelier PC Command launcher pattern).
 * Requires pywebview js_api from WindowChromeMixin:
 * window_start_drag, window_start_resize, get_window_bounds, set_window_bounds,
 * window_minimize, window_toggle_maximize, window_close.
 * Skips when ?embed=1 / body.pcd-embed.
 *
 * Resize prefers pointer-driven SetWindowPos (async-bridge safe). WM_NCLBUTTONDOWN
 * alone fails on FormBorderStyle.None / delayed bridge — same as PC Command hub.
 */
(function () {
  "use strict";

  const MIN_W = 960;
  const MIN_H = 640;

  function isEmbed() {
    try {
      if (document.documentElement.classList.contains("pcd-embed")) return true;
      if (document.body && document.body.classList.contains("pcd-embed")) return true;
      return /(?:^|[?&])embed=1(?:&|$)/.test(location.search || "");
    } catch (_) {
      return false;
    }
  }

  function ensureResizeEdges() {
    if (document.querySelector(".hub-resize-edges")) return;
    const edges = document.createElement("div");
    edges.className = "hub-resize-edges";
    edges.setAttribute("aria-hidden", "true");
    edges.innerHTML =
      '<div class="hub-resize-edge n" data-edge="top"></div>' +
      '<div class="hub-resize-edge s" data-edge="bottom"></div>' +
      '<div class="hub-resize-edge e" data-edge="right"></div>' +
      '<div class="hub-resize-edge w" data-edge="left"></div>' +
      '<div class="hub-resize-edge nw" data-edge="top-left"></div>' +
      '<div class="hub-resize-edge ne" data-edge="top-right"></div>' +
      '<div class="hub-resize-edge sw" data-edge="bottom-left"></div>' +
      '<div class="hub-resize-edge se" data-edge="bottom-right"></div>';
    document.body.appendChild(edges);
  }

  function wire() {
    if (isEmbed()) return;
    document.body.classList.add("frameless");
    ensureResizeEdges();

    let apiRef = null;
    const ensureApi = () => {
      if (apiRef) return Promise.resolve(apiRef);
      return new Promise((resolve) => {
        let tries = 0;
        const tick = () => {
          const api = window.pywebview && window.pywebview.api;
          if (api) {
            apiRef = api;
            resolve(api);
            return;
          }
          if (++tries > 80) {
            resolve(null);
            return;
          }
          setTimeout(tick, 50);
        };
        tick();
      });
    };

    const call = async (method, ...args) => {
      try {
        const api = await ensureApi();
        if (api && typeof api[method] === "function") await api[method](...args);
      } catch (_) {}
    };

    const callSync = (method, ...args) => {
      if (apiRef && typeof apiRef[method] === "function") {
        try {
          apiRef[method](...args);
          return true;
        } catch (_) {}
      }
      if (window.pywebview?.api && typeof window.pywebview.api[method] === "function") {
        try {
          window.pywebview.api[method](...args);
          apiRef = window.pywebview.api;
          return true;
        } catch (_) {}
      }
      call(method, ...args);
      return false;
    };

    ensureApi().catch(() => {});

    document.getElementById("winMin")?.addEventListener("click", () => call("window_minimize"));
    document.getElementById("winMax")?.addEventListener("click", () => call("window_toggle_maximize"));
    document.getElementById("winClose")?.addEventListener("click", () => call("window_close"));

    const titlebar = document.getElementById("hubTitlebar");
    if (titlebar) {
      titlebar.addEventListener("dblclick", (ev) => {
        const t = ev.target;
        if (t && t.closest("a,button,input,.win-controls,.win-btn")) return;
        call("window_toggle_maximize");
      });

      titlebar.addEventListener("mousedown", (ev) => {
        if (ev.button !== 0) return;
        const t = ev.target;
        if (t && t.closest("a,button,input,.win-controls,.win-btn,.hub-resize-edge")) return;
        callSync("window_start_drag");
      });
    }

    // Pointer-driven frameless resize — async js_api safe (SetWindowPos per move).
    const applyEdgeDelta = (edge, geo, dx, dy) => {
      let x = geo.x;
      let y = geo.y;
      let w = geo.w;
      let h = geo.h;
      if (edge === "right" || edge === "top-right" || edge === "bottom-right") w = geo.w + dx;
      if (edge === "left" || edge === "top-left" || edge === "bottom-left") {
        x = geo.x + dx;
        w = geo.w - dx;
      }
      if (edge === "bottom" || edge === "bottom-left" || edge === "bottom-right") h = geo.h + dy;
      if (edge === "top" || edge === "top-left" || edge === "top-right") {
        y = geo.y + dy;
        h = geo.h - dy;
      }
      if (w < MIN_W) {
        if (edge.includes("left")) x = geo.x + geo.w - MIN_W;
        w = MIN_W;
      }
      if (h < MIN_H) {
        if (edge.includes("top")) y = geo.y + geo.h - MIN_H;
        h = MIN_H;
      }
      return { x, y, w, h };
    };

    let resizeSession = null;
    const endResize = () => {
      if (!resizeSession) return;
      const s = resizeSession;
      resizeSession = null;
      try {
        if (s.pointerId != null) s.el.releasePointerCapture(s.pointerId);
      } catch (_) {}
      window.removeEventListener("pointermove", onResizeMove);
      window.removeEventListener("pointerup", endResize);
      window.removeEventListener("pointercancel", endResize);
    };
    const onResizeMove = (ev) => {
      if (!resizeSession || !resizeSession.geo) return;
      const dx = ev.screenX - resizeSession.startX;
      const dy = ev.screenY - resizeSession.startY;
      const next = applyEdgeDelta(resizeSession.edge, resizeSession.geo, dx, dy);
      const api = apiRef || window.pywebview?.api;
      if (api && typeof api.set_window_bounds === "function") {
        try {
          api.set_window_bounds(next.x, next.y, next.w, next.h);
        } catch (_) {}
      }
    };

    document.querySelectorAll(".hub-resize-edge").forEach((el) => {
      el.addEventListener("pointerdown", (ev) => {
        if (ev.button !== 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        const edge = el.getAttribute("data-edge") || "right";
        try {
          el.setPointerCapture(ev.pointerId);
        } catch (_) {}
        resizeSession = {
          el,
          edge,
          geo: null,
          startX: ev.screenX,
          startY: ev.screenY,
          pointerId: ev.pointerId,
        };
        window.addEventListener("pointermove", onResizeMove);
        window.addEventListener("pointerup", endResize);
        window.addEventListener("pointercancel", endResize);
        ensureApi()
          .then((api) => (api && api.get_window_bounds ? api.get_window_bounds() : null))
          .then((res) => {
            if (!resizeSession || resizeSession.el !== el) return;
            if (res?.ok) {
              resizeSession.geo = { x: res.x, y: res.y, w: res.w, h: res.h };
              return;
            }
            callSync("window_start_resize", edge);
            endResize();
          })
          .catch(() => {
            callSync("window_start_resize", edge);
            endResize();
          });
      });
    });

    // Optional support strip (Discord / PayPal / Revolut) — same as hubs
    document.querySelector(".hub-support")?.addEventListener("click", async (ev) => {
      const supportBtn = ev.target.closest("[data-support]");
      if (!supportBtn) return;
      const kind = supportBtn.dataset.support;
      try {
        const api = await ensureApi();
        if (api && typeof api.open_support_url === "function") {
          await api.open_support_url(kind);
          return;
        }
      } catch (_) {}
      try {
        const url =
          (globalThis.MrAurevoXSupport && MrAurevoXSupport.url(kind)) || "";
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      } catch (_) {}
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
