# Octa Technology — сайт студії

Головний сайт студії **Octa Technology**: усі застосунки на одній сторінці, відеоогляди,
окремі сторінки застосунків і політики конфіденційності для Android та iOS.

**Live:** https://vladyslav2525.github.io/twomeows-site/

## Стек

Чистий HTML + CSS + vanilla JS, без збірки. Запустити локально:

```
python -m http.server 8080
```

і відкрити http://localhost:8080. Щоб подивитися з телефона в тій самій Wi-Fi мережі —
http://<IP-комп'ютера>:8080.

## Структура

```
index.html                  — головна студії (застосунки, студія, політики, контакти)
css/octa.css                — стилі студії (палітра в CSS-змінних угорі файлу)
js/site.js                  — відео в картках, копіювання пошти
js/i18n.js                  — перемикач мов UA / SK / EN (спільний для всіх сторінок)
lang/*.json                 — тексти студії та сторінок застосунків

twomeows/index.html         — лендинг TwoMeows (колишня головна)
twomeows/lang/*.json        — тексти лендингу TwoMeows
twomeows/privacy-ios.html   — політика TwoMeows для iOS
privacy.html                — політика TwoMeows для Android (стара адреса, вже вказана в Google Play — не переносити!)
css/style.css, js/main.js   — стилі та анімації лендингу TwoMeows

drawing/  garage/  game/    — сторінки інших застосунків (робочі назви):
  index.html                — сторінка застосунку
  privacy-android.html      — політика для Android (поки заглушка)
  privacy-ios.html          — політика для iOS (поки заглушка)

assets/video/               — відеоогляди (див. нижче)
assets/cats/, assets/img/   — котики та обкладинки TwoMeows
```

## Відеоогляди

Поклади файл у `assets/video/` з такою назвою:

| Застосунок | Файл |
|---|---|
| TwoMeows | `assets/video/twomeows.mp4` |
| Малювалка | `assets/video/drawing.mp4` |
| Garage | `assets/video/garage.mp4` |
| Гра | `assets/video/game.mp4` |

Більше нічого міняти не треба: відео саме з'явиться в картці на головній (грає беззвучно,
по колу, коли картка на екрані) і на сторінці застосунку (з кнопками керування). Поки файлу
немає, показується кольорова заставка. Вертикальні відео (9:16) показуються цілком на
кольоровому фоні застосунку.

GitHub не приймає файли більші за 100 МБ, а для сайту краще тримати кожне відео до ~10 МБ.
Стиснути (ffmpeg, без звуку, 720p):

```
ffmpeg -i input.mp4 -vf "scale=-2:720" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart twomeows.mp4
```

Якщо звук на сторінці застосунку потрібен — прибери `-an`.

## Політики конфіденційності — адреси для Google Play / App Store

| Застосунок | Android | iOS |
|---|---|---|
| TwoMeows | `/privacy.html` | `/twomeows/privacy-ios.html` |
| Малювалка | `/drawing/privacy-android.html` | `/drawing/privacy-ios.html` |
| Garage | `/garage/privacy-android.html` | `/garage/privacy-ios.html` |
| Гра | `/game/privacy-android.html` | `/game/privacy-ios.html` |

Повна адреса = `https://vladyslav2525.github.io/twomeows-site` + шлях із таблиці.
У заглушках стоїть `noindex` — прибери його, коли вставиш справжній текст.

## Як додати/змінити тексти

Тексти студії та сторінок застосунків — у `lang/ua.json`, `lang/sk.json`, `lang/en.json`;
тексти лендингу TwoMeows — у `twomeows/lang/*.json`. Ключ прив'язаний до елемента через
`data-i18n="ключ"`. Українська також продубльована прямо в HTML (запасний варіант і версія
для пошуковиків). Назва й опис кожного застосунку — ключі `app.<slug>.name`, `.cat`, `.desc`.

## Котики TwoMeows 🎨

Авторські малюнки. Оригінали лежать у `pictures/` (повні полотна 2894×1472), робочі копії
з обрізаним viewBox — в `assets/cats/`. Розмір кожного котика — в `css/style.css`
(класи `.cat-hello`, `.cat-point`, `.cat-cool`, `.cat-book`, `.cat-sleep`). Прив'язка котика
до секції — атрибути `data-cat` / `data-cat-section` у `twomeows/index.html`.

## Деплой

Сайт хоститься на GitHub Pages з гілки `main` (корінь). Зміни з'являються на сайті приблизно
через хвилину після пушу в `main`.
