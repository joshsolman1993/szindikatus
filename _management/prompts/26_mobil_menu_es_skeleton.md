Szia! A funkciók szuperek, de a felhasználói élményen (UX) csiszolnunk kell. Jelenleg mobilon eltűnik a menü, és a betöltés is csak egy egyszerű szöveg.

A feladatod a Mobil Navigáció (Hamburger Menü) javítása és a Skeleton Loading bevezetése.

Feladatok:

UI - Skeleton Komponens (src/components/ui/Skeleton.tsx):

Készíts egy egyszerű, újrahasznosítható komponenst.

Stílus: Szürke háttér (bg-gray-800), lekerekített sarkok, animate-pulse animáció.

Props: className, height, width.

Dashboard Layout Javítása - Mobil Menü (src/components/dashboard/DashboardLayout.tsx):

Állapot: Adj hozzá egy isMobileMenuOpen state-et.

Topbar: A bal felső sarokban (a logó mellett) jeleníts meg egy "Hamburger" ikont (Menu a lucide-react-ból), ami csak mobilon (md:hidden) látszik.

Sidebar:

Alapállapotban (hidden md:block): Maradjon a bal oldali sáv desktopon.

Mobil nézetben: Legyen egy fixed inset-0 z-50 réteg.

Backdrop: Egy sötétített háttér, amire kattintva bezáródik a menü.

Drawer: Maga a menü csússzon be balról (animate-slide-in-left vagy transition), és foglalja el a képernyő 80%-át.

Navigáció: Ha a felhasználó rákattint egy menüpontra mobilon, a menü záródjon be automatikusan.

Skeletonok Integrálása az Oldalakba:

DashboardPage:

A StatCard helyett készíts egy StatCardSkeleton-t (vagy használd a Skeleton-t a layoutban).

Ha loading van, ne a "Betöltés..." szöveget írd ki, hanem a Skeleton kártyákat (pl. 4 db-ot).

CrimesPage:

Ha loading van, jeleníts meg 6 db CrimeCard méretű Skeletont.

TheStreetsPage:

Ha loading van, jeleníts meg PlayerCard méretű Skeletonokat.

Design:

A mobil menü legyen stílusos: glass-panel hatás, sötét háttérrel.

Adminisztráció:

Frissítsd a PROJEKT_NAPLO.md fájlt.

Git commit: fix: implement mobile hamburger menu and skeleton loading states.