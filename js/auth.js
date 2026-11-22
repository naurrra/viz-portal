/** Toggle tampil/sembunyi password pada halaman login. */
(function () {
  "use strict";

  document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
    var input = document.getElementById(button.dataset.togglePassword);
    if (!input) return;

    button.addEventListener("click", function () {
      var hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      button.setAttribute("aria-label", hidden ? "Sembunyikan password" : "Tampilkan password");
      input.focus();
    });
  });

  // Demo statis: form apa pun langsung diarahkan ke dashboard tanpa validasi.
  // Tidak ada data yang dikirim ke mana pun.
  var demoForm = document.querySelector("[data-demo-login]");
  if (demoForm) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      window.location.href = "dashboard.html";
    });
  }
})();
