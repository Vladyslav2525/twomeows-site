/* Octa Technology — перемикач мов (UA / SK / EN), спільний для всіх сторінок.
   Папка зі словниками задається атрибутом data-lang-base на тегу <script>
   (за замовчуванням "lang/" відносно сторінки). Українська вже є в HTML,
   тож словник довантажується лише для іншої мови. */
(function () {
  "use strict";

  const script = document.currentScript;
  const BASE = (script && script.dataset.langBase) || "lang/";
  const STORAGE_KEY = "octa_lang";
  const LEGACY_KEY = "twomeows_lang";
  const DEFAULT_LANG = "ua";
  const HTML_LANG = { ua: "uk", sk: "sk", en: "en" };
  const cache = {};

  function readSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* приватний режим */ }
  }

  async function loadLang(lang) {
    if (cache[lang]) return cache[lang];
    const res = await fetch(BASE + lang + ".json");
    if (!res.ok) throw new Error("Не вдалося завантажити мову: " + lang);
    cache[lang] = await res.json();
    return cache[lang];
  }

  function apply(dict) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    const titleKey = (script && script.dataset.titleKey) || "meta.title";
    if (dict[titleKey]) document.title = dict[titleKey];
  }

  async function setLang(lang) {
    try {
      const dict = await loadLang(lang);
      apply(dict);
      document.documentElement.lang = HTML_LANG[lang] || lang;
      save(lang);
      document.querySelectorAll(".lang-switch button").forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    } catch (err) {
      console.error(err);
    }
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const saved = readSaved();
  if (saved && saved !== DEFAULT_LANG && HTML_LANG[saved]) setLang(saved);
})();
