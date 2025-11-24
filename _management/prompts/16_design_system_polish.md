Szia! A funkciók készen vannak, de a felület valószínűleg kicsit "kócos". Mielőtt tovább mennénk, egységesítsük a megjelenést egy Design System bevezetésével.

A feladatod a Frontend vizuális egységesítése és a "Cyberpunk/Gengszter" hangulat erősítése.

Feladatok:

Tailwind Config Bővítése (frontend/tailwind.config.js):

Definiálj szemantikus színeket, ne használd a beépített palettát közvetlenül!

colors:

primary: #dc2626 (Vérvörös - Akció gombok, kiemelések)

secondary: #eab308 (Arany - Pénz, Figyelem)

success: #22c55e (Zöld - Energia, Siker)

dark:

900: #0f1115 (Fő háttér)

800: #1f2937 (Kártya háttér)

700: #374151 (Border)

fontFamily:

tech: ['Orbitron', 'sans-serif'] (Címsoroknak)

sans: ['Inter', 'sans-serif'] (Szövegtörzsnek)

animation:

Adj hozzá fade-in, slide-in és pulse-slow animációkat.

Globális CSS (frontend/src/index.css):

Importáld a Google Fonts-ból az Inter és Orbitron betűtípusokat.

Állítsd be az alapértelmezett hátteret (bg-dark-900) és szövegszínt (text-gray-100).

Készíts egyedi osztályokat a gomboknak, hogy ne kelljen mindenhol ismételni:

.btn-primary: Piros, neon glow effekt, hover scale.

.btn-secondary: Szürke/Átlátszó, borderrel.

Készíts egy .neon-text osztályt (text-shadow effekt).

UI Komponensek Refaktorálása (Design System alapján):

Menj végig a src/components mappán, és cseréld le a random osztályokat az újakra.

Layout: Használd a font-tech fontot a címsoroknál.

Kártyák (Card): Legyen egységes rounded-xl, border-dark-700, bg-dark-800/50 (kicsit átlátszó + backdrop-blur).

Gombok: Cseréld le őket a .btn-primary osztályra.

Animációk Hozzáadása:

Amikor betöltődik a Dashboard vagy az Utca, az elemek ne "villanva" jelenjenek meg, hanem finom animate-fade-in effekttel.

A Toast üzenetek (Siker/Hiba) ússzanak be (slide-in).

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: style: implement global design system with tailwind config and animations.