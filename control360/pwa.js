// Instalación de YACUSOL Control 360 en celulares (Android e iPhone) y computadoras.
// - Android/Chrome/Edge/Samsung Internet: usa el aviso nativo de instalación (beforeinstallprompt).
// - iPhone/iPad: Apple no permite un botón de instalación; se muestran los pasos de «Agregar a inicio».
// - No genera HTML dinámico: todo el contenido es estático en index.html.
(function () {
  "use strict";
  var deferredPrompt = null;
  var ua = navigator.userAgent || "";
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /android/i.test(ua);
  var inAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line\/|TikTok|; wv\)/i.test(ua);

  function byId(id) { return document.getElementById(id); }
  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  function installButtons() { return [byId("install-login"), byId("install-app")].filter(Boolean); }
  function refreshButtons() {
    var hide = isStandalone();
    installButtons().forEach(function (b) { b.hidden = hide; });
  }
  function showSection(which) {
    var ios = byId("install-steps-ios"), android = byId("install-steps-android"), warn = byId("install-inapp");
    if (ios) ios.hidden = which === "android";
    if (android) android.hidden = which === "ios";
    if (warn) warn.hidden = !inAppBrowser;
  }
  function openDialog() {
    var dialog = byId("install-dialog");
    if (!dialog) return;
    showSection(isIOS ? "ios" : (isAndroid ? "android" : "both"));
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function closeDialog() {
    var dialog = byId("install-dialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
  }
  async function install() {
    if (deferredPrompt) {
      var promptEvent = deferredPrompt;
      deferredPrompt = null;
      promptEvent.prompt();
      try { await promptEvent.userChoice; } catch (e) { /* el usuario cerró el aviso */ }
      refreshButtons();
      return;
    }
    openDialog();
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    refreshButtons();
  });
  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    closeDialog();
    refreshButtons();
  });

  document.addEventListener("DOMContentLoaded", function () {
    installButtons().forEach(function (b) { b.addEventListener("click", install); });
    var close = byId("install-close");
    if (close) close.addEventListener("click", closeDialog);
    var showAll = byId("install-show-all");
    if (showAll) showAll.addEventListener("click", function () { showSection("both"); });
    refreshButtons();
  });

  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" }).catch(function () {
        /* Sin service worker el panel sigue funcionando en el navegador. */
      });
    });
  }
})();
