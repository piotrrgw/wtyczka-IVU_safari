# Czas Niebezpieczny (Safari Extension)

![Wersja](https://img.shields.io/badge/wersja-v2.5-blue)
![Zgodność](https://img.shields.io/badge/zgodność-WCAG%20%2F%20EAA-green)
![Platforma](https://img.shields.io/badge/platforma-iOS%20%7C%20macOS-lightgrey)

Profesjonalne rozszerzenie do przeglądarki Safari wspomagające pracowników w automatycznym wyliczaniu tzw. **czasu niebezpiecznego** w systemie Irena. Aplikacja inteligentnie analizuje wpisy w karcie pracy i przygotowuje gotowe podsumowanie do raportu.

## 🚀 Główne Funkcje

* **Automatyczne Rozpoznawanie Czynności:** System identyfikuje wpisy takie jak *Objęcie pociągu*, *Przekazanie pociągu* oraz *Próba hamulca*.
* **Inteligentne Limity:** * **DK Objęcie:** automatyczne ograniczenie do **20 min**.
    * **DK Przekazanie:** automatyczne ograniczenie do **10 min**.
    * **DK Próba hamulca:** liczone w pełnym wymiarze czasu rzeczywistego.
* **Integracja z Raportem:** Jednym kliknięciem wstawia zsumowany wynik (np. `N: 25m`) do pola komentarza.
* **Auto-aktualizacja (iOS):** Skrypt automatycznie sprawdza dostępność nowej wersji na GitHubie.

## 🛠 Instalacja

### 📱 iOS (iPhone / iPad) - Metoda Userscripts
Zalecana metoda z obsługą automatycznych aktualizacji.

1.  Zainstaluj darmową aplikację **Userscripts** z App Store.
2.  Włącz rozszerzenie: `Ustawienia` -> `Safari` -> `Rozszerzenia` -> `Userscripts` (ustaw na *Pozwól*).
3.  **Instalacja skryptu:**
    * Kliknij w link do surowego pliku skryptu na GitHubie: `https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js`.
    * Aplikacja Userscripts powinna automatycznie wykryć skrypt i zapytać o instalację.
    * *Alternatywnie:* Skopiuj zawartość pliku `iOS/czas-niebezpieczny_iOS-safari.js` i wklej go ręcznie w aplikacji.

### 💻 macOS (Safari)
1.  Pobierz repozytorium i otwórz folder `macOS/` w programie **Xcode**.
2.  W Safari włącz menu `Programowanie` (`Ustawienia` -> `Zaawansowane`).
3.  W menu `Programowanie` zaznacz opcję **Zezwalaj na nierozpoznane rozszerzenia**.
4.  Uruchom projekt w Xcode (Build & Run).

## 📖 Instrukcja Użycia

1.  Otwórz system **Irena** i wejdź w edycję wybranej karty pracy.
2.  Kliknij ikonę **⏱️** (na iOS) lub ikonę rozszerzenia w pasku Safari (macOS).
3.  Kliknij przycisk **PRZELICZ**.
4.  Kliknij **WSTAW** – suma zostanie dodana do komentarza.

## 👥 Współautorzy
Projekt powstał przy współpracy:
* [Piotr M 🚂](https://github.com/piotrrgw)
* [Thundo](https://github.com/Thundo)
* Gemini (Model AI)
