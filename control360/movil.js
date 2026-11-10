// Ajustes de comportamiento para la versión de celular de Control 360.
// - Al cambiar de módulo: vuelve arriba y centra el botón activo en la barra inferior.
// - «Salir» de la cabecera móvil usa el mismo cierre de sesión seguro del menú lateral.
(function () {
  "use strict";
  var mobile = window.matchMedia ? window.matchMedia("(max-width: 860px)") : { matches: false };
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".nav [data-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!mobile.matches) return;
        window.scrollTo({ top: 0, behavior: "auto" });
        try { button.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); } catch (e) { /* navegadores antiguos */ }
      });
    });
    var logoutMobile = document.getElementById("logout-mobile");
    var logout = document.getElementById("logout");
    if (logoutMobile && logout) logoutMobile.addEventListener("click", function () { logout.click(); });
  });
})();
