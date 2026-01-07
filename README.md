# Czas Niebezpieczny - Rozszerzenie dla systemów IVU (Irena)

Profesjonalne narzędzie wspomagające pracowników w automatycznym wyliczaniu tzw. **czasu niebezpiecznego** w systemie Irena (intercity.pl). Narzędzie dostępne jest jako pełne rozszerzenie dla przeglądarki Safari (macOS) oraz jako skrypt użytkownika (iOS/Android).

## 🚀 Kluczowe Funkcje
* **Automatyczne Obliczenia:** System rozpoznaje czynności i stosuje limity:
    * **DK Objęcie pociągu:** limit do 20 minut.
    * **DK Przekazanie pociągu:** limit do 10 minut.
    * **DK Próba hamulca:** pełny czas rzeczywisty.
    * **DK Prace Manewrowe KP:** pełny czas rzeczywisty (Nowość!).
* **Integracja:** Automatyczne wstawianie wyniku (np. `N: 25m`) do komentarza w karcie pracy.
* **Dostępność:** Pełna zgodność ze standardami WCAG i EAA. Interfejs dostosowany do urządzeń mobilnych.

---

## 📲 Instrukcja instalacji - Android (Prosty sposób)

Jeśli korzystasz z urządzenia z systemem Android, wykonaj poniższe kroki, aby zainstalować narzędzie:

1. **Zainstaluj przeglądarkę:** Pobierz i zainstaluj **Firefox** ze sklepu Google Play.
2. **Dodaj rozszerzenie:** Otwórz Firefox, wejdź w menu (trzy kropki) -> **Dodatki** i zainstaluj **Tampermonkey**.
3. **Dodaj skrypt:** * Skopiuj link do skryptu: `https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js`
   * Otwórz panel Tampermonkey w przeglądarce, wybierz "Dodaj nowy skrypt".
   * Wklej skopiowany kod (lub wybierz opcję instalacji z adresu URL) i zapisz.
4. **Gotowe!** Po wejściu na stronę systemu Irena, na ekranie zobaczysz ikonę stopera ⏱️.

---

## 💻 Instrukcja instalacji - macOS / iOS

### Safari (macOS)
1. Pobierz folder `macOS`.
2. Otwórz projekt w Xcode i uruchom, aby zainstalować rozszerzenie w Safari.
3. Włącz rozszerzenie w ustawieniach przeglądarki Safari (Zakładka "Rozszerzenia").

### Safari (iOS)
1. Zainstaluj aplikację **Userscripts** (dostępna w App Store).
2. Włącz rozszerzenie Userscripts w ustawieniach Safari.
3. Dodaj plik `czas-niebezpieczny_iOS-safari.js` do folderu skryptów aplikacji.

---

## 🛠️ Informacje techniczne
* **Wersja macOS:** v1.8
* **Wersja iOS/Android:** v2.6
* **Brak śledzenia:** Projekt nie wykorzystuje Google Tag Manager ani innych systemów analitycznych.

---

## 👥 Współautorzy
* **Piotr M** ([GitHub](https://github.com/piotrrgw))
* **Thundo** ([GitHub](https://github.com/Thundo54))
* **Gemini** (Model AI)

---
*Wersja aplikacji: v2.6 | Piotr M 🚂 & Gemini*