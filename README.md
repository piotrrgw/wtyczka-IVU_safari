# Czas Niebezpieczny (Safari Extension)

**Wersja:** 2.2
**Autorzy:** [Piotr M 🚂](https://github.com/piotrrgw), [Thundo](https://github.com/Thundo) & Gemini

## Opis
Rozszerzenie do przeglądarki Safari stworzone w celu automatyzacji obliczania "czasu niebezpiecznego" w systemie kart pracy. Wtyczka skanuje aktywną kartę, identyfikuje czynności niebezpieczne, weryfikuje ich czas trwania zgodnie z regulaminem i sumuje minuty gotowe do wpisania w raporcie.

Aplikacja jest w pełni zgodna z wytycznymi **EAA** oraz **WCAG**, a jej interfejs został zoptymalizowany pod kątem urządzeń mobilnych (iPhone/iPad) – panel nie zasłania danych, a sterowanie jest dostosowane do dotyku.

## Główne Funkcje
1.  **Inteligentna Kalkulacja:**
    * **DK Objęcie pociągu:** Czas rzeczywisty, limitowany do **20 minut**.
    * **DK Przekazanie pociągu:** Czas rzeczywisty, limitowany do **10 minut**.
    * **DK Próba hamulca:** Liczony pełny czas rzeczywisty.
2.  **Wizualizacja:** Podświetla wykryte czynności na liście kolorami w celu łatwej weryfikacji bezpośrednio na stronie.
3.  **Wstawianie Raportu:** Automatycznie dodaje sumę (np. `N: 25m`) do pola komentarza, usuwając poprzednie wpisy tego typu.

## Instalacja na iOS (Safari) - Zalecana

### Metoda 1: Aplikacja Userscripts (Najszybsza)
1.  Pobierz aplikację **Userscripts** z App Store.
2.  Włącz rozszerzenie w `Ustawienia -> Safari -> Rozszerzenia -> Userscripts`.
3.  Otwórz aplikację Userscripts i ustaw folder dla skryptów.
4.  Skopiuj zawartość gotowego pliku z repozytorium: `iOS/czas-niebezpieczny_iOS-safari.js`.
5.  Utwórz nowy skrypt w aplikacji Userscripts dla domeny `irena1.intercity.pl` i wklej tam skopiowany kod.

### Metoda 2: Xcode (Natywne Rozszerzenie)
1.  Uruchom terminal na Macu w folderze `macOS/`.
2.  Użyj konwertera: `xcrun safari-web-extension-converter .`
3.  W Xcode wybierz cel (Target) dla **iOS** i uruchom go na iPhonie.

## Instalacja na macOS (Safari)

1.  Włącz menu `Programowanie` w ustawieniach Safari.
2.  W menu `Programowanie` zaznacz **"Zezwalaj na nierozpoznane rozszerzenia"**.
3.  Otwórz projekt z folderu `macOS/` w Xcode i kliknij **Run**.
4.  Aktywuj wtyczkę w `Ustawienia -> Rozszerzenia`.

## Użycie
1.  Otwórz edycję karty pracy.
2.  Kliknij ikonę **⏱️** (na iOS) lub uruchom rozszerzenie z menu Safari.
3.  Kliknij **Przelicz**, sprawdź listę i kliknij **Wstaw**.

