# 📖 Instrukcja instalacji skryptów IVU

Poniżej znajdziesz przewodnik krok po kroku, jak zainstalować skrypty (Czas Niebezpieczny oraz Ciemny Motyw) na swoim urządzeniu. Wybierz system, z którego korzystasz.

---

## 🍎 Urządzenia Apple (iPhone, iPad, komputer Mac)
*Narzędzia działają najlepiej w domyślnej przeglądarce Safari.*

**Krok 1: Pobierz darmową aplikację do obsługi skryptów**
1. Otwórz sklep **App Store** na swoim urządzeniu.
2. Wyszukaj i pobierz darmową aplikację o nazwie **Userscripts**.
3. Otwórz pobraną aplikację. Poprosi Cię ona o wskazanie "katalogu" (folderu), w którym będzie szukać skryptów. Wybierz opcję **Set Userscripts Directory** i utwórz nowy folder na swoim urządzeniu (np. o nazwie "Moje Skrypty").

**Krok 2: Włącz rozszerzenie w Safari**
1. Wejdź w **Ustawienia** swojego urządzenia (lub Preferencje na Macu).
2. Odszukaj zakładkę **Safari** -> **Rozszerzenia**.
3. Znajdź na liście **Userscripts** i włącz je. Zezwól rozszerzeniu na dostęp do stron internetowych (najlepiej ustaw opcję "Zawsze pozwalaj").

**Krok 3: Dodaj nasze skrypty**
1. Pobierz pliki skryptów z tego repozytorium:
   * `czas-niebezpieczny_iOS-safari.js`
   * `ciemny-motyw_iOS-macOS-safari.js`
2. Skopiuj lub przenieś te dwa pliki do folderu, który utworzyłeś w Kroku 1 (np. "Moje Skrypty").
3. Gotowe! Odśwież stronę systemu Irena lub Portal – na ekranie powinny pojawić się nowe przyciski (ikona stopera i ikona księżyca).

---

## 🤖 Urządzenia z Androidem oraz komputery z systemem Windows
*Na tych urządzeniach skrypty działają najlepiej w przeglądarkach takich jak Firefox, Chrome lub Edge.*

**Krok 1: Przygotuj przeglądarkę (Tylko dla Androida)**
* Jeśli używasz telefonu z Androidem, domyślna przeglądarka Chrome nie obsługuje dodatków. Musisz zainstalować darmową przeglądarkę **Firefox** ze sklepu Google Play i używać jej do logowania się do systemu IVU. Na komputerze Windows możesz używać swojej ulubionej przeglądarki (Chrome/Edge/Firefox).

**Krok 2: Zainstaluj dodatek Tampermonkey**
1. Otwórz swoją przeglądarkę i przejdź na stronę [tampermonkey.net](https://www.tampermonkey.net).
2. Kliknij przycisk **Download** (Pobierz) dla swojej przeglądarki i dodaj rozszerzenie.
3. W prawym górnym rogu przeglądarki lub w menu telefonu pojawi się nowa ikona (czarny kwadracik z dwoma kółkami na dole).

**Krok 3: Wgraj nasze skrypty**
1. Skopiuj poniższe linki (jeden po drugim):
   * **Czas niebezpieczny:** `https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js`
   * **Ciemny motyw:** `https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/ciemny-motyw_iOS-macOS-safari.js`
2. Otwórz menu dodatku **Tampermonkey** w przeglądarce.
3. Wybierz opcję **Dodaj nowy skrypt** (Add new script).
4. Jeśli widzisz jakiś kod na ekranie – skasuj go. Wklej w to miejsce kod skopiowany ze strony (otwierając powyższe linki) LUB użyj w Tampermonkey opcji instalacji z adresu URL i wklej tam link.
5. Zapisz skrypt (Plik -> Zapisz lub ikona dyskietki). Powtórz to dla drugiego linku.
6. Gotowe! Po wejściu na stronę systemu, zobaczysz nowe funkcje.

---
Współautorzy: Piotr M 🚂 & Gemini
Wersja aplikacji: v3.1