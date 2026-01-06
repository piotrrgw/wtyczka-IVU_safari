# Czas Niebezpieczny (Safari Extension)

**Wersja:** 1.8
**Autorzy:** [Piotr M 🚂](https://github.com/piotrrgw), [Thundo](https://github.com/Thundo) & Gemini

## Opis
Rozszerzenie do przeglądarki Safari stworzone w celu automatyzacji obliczania "czasu niebezpiecznego" w systemie kart pracy. Wtyczka skanuje aktywną kartę, identyfikuje czynności niebezpieczne (Objęcie, Przekazanie, Próba hamulca), weryfikuje ich czas trwania zgodnie z regulaminem i sumuje minuty gotowe do wpisania w raporcie.

Aplikacja jest w pełni zgodna z wytycznymi **EAA** oraz **WCAG**, a jej interfejs został zoptymalizowany do wyświetlania zarówno na komputerach Mac, jak i urządzeniach mobilnych (iPhone/iPad).

## Główne Funkcje
1.  **Inteligentna Kalkulacja:**
    * **DK Objęcie pociągu:** Czas rzeczywisty, limitowany do **20 minut**.
    * **DK Przekazanie pociągu:** Czas rzeczywisty, limitowany do **10 minut**.
    * **DK Próba hamulca:** Liczony pełny czas rzeczywisty.
2.  **Wizualizacja:** Podświetla wykryte czynności na liście kolorami w celu łatwej weryfikacji bezpośrednio na stronie.
3.  **Wstawianie Raportu:** Automatycznie dodaje sumę (np. `N: 25m`) do pola komentarza, usuwając poprzednie wpisy tego typu.

## Instalacja na macOS (Safari)

1.  Pobierz repozytorium na dysk.
2.  Otwórz **Safari** i wejdź w `Ustawienia` (Cmd + ,).
3.  W karcie `Zaawansowane` zaznacz na dole opcję: **"Pokazuj menu Programowanie w pasku menu"**.
4.  Z nowego menu `Programowanie` wybierz **"Zezwalaj na nierozpoznane rozszerzenia"**.
5.  Uruchom **Xcode** (dostępny w App Store), wybierz `File -> Open` i wskaż folder z wtyczką.
6.  Kliknij przycisk **Run** (Play) w Xcode. Rozszerzenie zostanie zbudowane i dodane do Safari.
7.  Wróć do Safari, wejdź w `Ustawienia -> Rozszerzenia` i zaznacz checkbox przy **"Czas Niebezpieczny"**.

## Instalacja na iOS (Safari)

### Metoda 1: Aplikacja Userscripts (Najszybsza)
1.  Pobierz aplikację **Userscripts** z App Store.
2.  Włącz rozszerzenie w `Ustawienia -> Safari -> Rozszerzenia -> Userscripts`.
3.  Utwórz nowy skrypt dla domeny `irena1.intercity.pl`.
4.  Wklej połączony kod z plików `content.js` oraz `popup.js`.

### Metoda 2: Xcode (Natywne Rozszerzenie)
1.  Uruchom terminal na komputerze Mac w folderze projektu.
2.  Użyj konwertera Apple:
    ```bash
    xcrun safari-web-extension-converter .
    ```
3.  W Xcode wybierz cel (Target) dla **iOS** i uruchom go na podłączonym iPhonie.
4.  Włącz wtyczkę w `Ustawienia -> Safari -> Rozszerzenia` na telefonie.

## Użycie
1.  Otwórz edycję karty pracy w systemie Irena.
2.  Uruchom rozszerzenie z menu Safari (ikona puzzla lub `Aa`).
3.  Kliknij **Przelicz**, aby pobrać dane.
4.  Sprawdź poprawność na liście i kliknij **Wstaw**, aby zaktualizować pole komentarza.

