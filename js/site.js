/* Octa Technology — відео в картках і копіювання пошти */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Відео ──
     Кожне <video> лежить у .media поверх заставки (.poster).
     Поки файл не завантажився (або його ще немає в assets/video/), видно заставку.
     Відео з data-autoplay грають беззвучно, лише коли видимі на екрані. */
  const videos = document.querySelectorAll(".media video");

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting && !reduceMotion) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          } else if (!v.controls || !e.isIntersecting) {
            v.pause();
          }
        });
      }, { threshold: 0.35 })
    : null;

  videos.forEach((v) => {
    const media = v.closest(".media");
    v.muted = true;

    // метадані могли завантажитися ще до запуску скрипта — перевіряємо й одразу
    const checkPortrait = () => {
      if (v.videoHeight > v.videoWidth) media.classList.add("is-portrait");
    };
    v.addEventListener("loadedmetadata", checkPortrait);
    if (v.readyState >= 1) checkPortrait();
    v.addEventListener("loadeddata", () => media.classList.add("has-video"));
    if (v.readyState >= 2) media.classList.add("has-video");

    if (v.hasAttribute("data-autoplay")) {
      if (io) io.observe(v);
      if (reduceMotion) {
        // без автозапуску: граємо лише при наведенні / фокусі
        const card = v.closest("a, .media");
        const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
        card.addEventListener("pointerenter", play);
        card.addEventListener("pointerleave", () => v.pause());
        card.addEventListener("focusin", play);
        card.addEventListener("focusout", () => v.pause());
      }
    }
  });

  /* ── Копіювання адреси пошти ── */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const status = document.getElementById(btn.getAttribute("aria-describedby"));
    btn.addEventListener("click", () => {
      const text = btn.dataset.copy;
      const msg = document.getElementById("copied-msg"); // перекладається через i18n
      const done = () => { if (status) status.textContent = msg ? msg.textContent : "✓"; };
      const fallback = () => {
        const el = document.querySelector(btn.dataset.copyTarget || ".email");
        if (!el) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });
})();
