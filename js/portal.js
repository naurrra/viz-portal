/** Buka/tutup sidebar portal pada layar kecil. */
(function () {
  "use strict";

  var sidebar = document.querySelector("[data-sidebar]");
  var toggle = document.querySelector("[data-sidebar-toggle]");
  if (!sidebar || !toggle) return;

  function close() { sidebar.classList.remove("is-open"); }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    sidebar.classList.toggle("is-open");
  });

  document.addEventListener("click", function (event) {
    if (sidebar.classList.contains("is-open") && !sidebar.contains(event.target)) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
