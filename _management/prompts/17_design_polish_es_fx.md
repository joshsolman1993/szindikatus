Szia! Megnéztem a jelenlegi UI állapotot. Az alapok nagyon erősek, de a megjelenés kicsit "steril". Most vigyünk bele életet és hangulatot!

Cél: A "Flat" designból lépjünk át egy modern, "Glassmorphism" és "Neon" elemekkel tarkított stílusba.

Feladatok:

Globális Stílusok (index.css):

Háttér: Cseréld le a sima sötétszürke hátteret egy finom radiális gradiensre.

background: radial-gradient(circle at 50% 0%, #1f2937 0%, #0f1115 100%);

Scrollbar: Szabd testre a görgetősávot (legyen vékony, sötétszürke, lekerekített), hogy passzoljon a designhoz.

Kártyák "Glass" Effektje:

A jelenlegi tömör szürke kártyák helyett használj áttetszőbb hátteret backdrop-blur effekttel.

Új osztály (.card-glass): bg-gray-900/60 backdrop-blur-md border border-white/5 shadow-xl.

Alkalmazd ezt a CrimeCard, StatCard és PlayerCard komponenseken.

Dashboard Stat Kártyák Színezése (StatCard.tsx):

Ne legyenek egyformák! A kártya kapjon egy nagyon halvány színezett keretet vagy belső fényt (glow) a stat típusa szerint:

Erő: Vörös (border-red-500/20, shadow-red-900/20)

Védekezés: Zöld/Kék (border-emerald-500/20)

Gyorsaság: Sárga (border-yellow-500/20)

Intelligencia: Lila (border-purple-500/20)

Interaktív Elemek (Gombok és Hover):

Gombok: Adj hozzájuk transition-all duration-300 osztályt. Hover állapotban ne csak a szín változzon, hanem kicsit emelkedjen is ki (hover:-translate-y-0.5) és kapjon erősebb árnyékot (hover:shadow-lg hover:shadow-red-600/40).

Bűntény Kártyák: Hover-re a keret színe váltson szürkéből a bűntény nehézsége szerinti színre (Zöld=Könnyű, Piros=Nehéz).

Toast (Értesítések) Szépítése:

Ha használsz react-hot-toast-ot vagy hasonlót, stílusozd át sötét témára, vékony neon kerettel.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md-t.

Git commit: style: apply glassmorphism, gradients and interactive hover effects.