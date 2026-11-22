/**
 * Slider sederhana tanpa library.
 *
 * Markup yang dibutuhkan:
 *   <div data-slider data-autoplay="6000">
 *     <div class="slider-viewport">
 *       <div data-slider-track> ...slide... </div>
 *     </div>
 *     <button data-slider-prev></button>
 *     <button data-slider-next></button>
 *     <div data-slider-dots></div>
 *   </div>
 *
 * data-autoplay: jeda dalam milidetik. Hapus atribut atau isi 0 untuk mematikan.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSlider(root) {
    var track = root.querySelector("[data-slider-track]");
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    if (slides.length === 0) return;

    var dotsBox = root.querySelector("[data-slider-dots]");
    var prevBtn = root.querySelector("[data-slider-prev]");
    var nextBtn = root.querySelector("[data-slider-next]");
    var delay = parseInt(root.dataset.autoplay || "0", 10);
    var index = 0;
    var timer = null;
    var dots = [];

    function render() {
      track.style.transform = "translateX(" + index * -100 + "%)";
      slides.forEach(function (slide, i) {
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function goTo(next) {
      index = (next + slides.length) % slides.length;
      render();
    }

    // Dot indicator dibuat dari jumlah slide yang ada.
    if (dotsBox) {
      dotsBox.setAttribute("role", "tablist");
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          restart();
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); restart(); });

    // Navigasi keyboard saat slider difokuskan.
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { goTo(index - 1); restart(); }
      if (event.key === "ArrowRight") { goTo(index + 1); restart(); }
    });

    // Swipe pada perangkat sentuh.
    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 45) { goTo(index + (diff < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    function start() {
      if (!delay || reduceMotion || slides.length < 2) return;
      timer = window.setInterval(function () { goTo(index + 1); }, delay);
    }

    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function restart() { stop(); start(); }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    render();
    start();
  }

  document.querySelectorAll("[data-slider]").forEach(initSlider);
})();
