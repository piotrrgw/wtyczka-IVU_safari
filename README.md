# Czas Niebezpieczny (Safari Extension)

![Wersja](https://img.shields.io/badge/wersja-v2.4-blue)
![Zgodność](https://img.shields.io/badge/zgodność-WCAG%20%2F%20EAA-green)
![Platforma](https://img.shields.io/badge/platforma-iOS%20%7C%20macOS-lightgrey)

Profesjonalne rozszerzenie do przeglądarki Safari wspomagające pracowników w automatycznym wyliczaniu tzw. **czasu niebezpiecznego** w systemie Irena. Aplikacja inteligentnie analizuje wpisy w karcie pracy i przygotowuje gotowe podsumowanie do raportu.

## 🚀 Główne Funkcje

* **Automatyczne Rozpoznawanie Czynności:** System identyfikuje wpisy takie jak *Objęcie pociągu*, *Przekazanie pociągu* oraz *Próba hamulca*.
* **Inteligentne Limity:** * **DK Objęcie:** automatyczne ograniczenie do **20 min**.
    * **DK Przekazanie:** automatyczne ograniczenie do **10 min**.
    * **DK Próba hamulca:** liczone w pełnym wymiarze czasu rzeczywistego.
* **Integracja z Raportem:** Jednym kliknięciem wstawia zsumowany wynik (np. `N: 25m`) do pola komentarza, dbając o czystość poprzednich wpisów.
* **Mobile First:** Specjalny interfejs dla iOS z pływającym przyciskiem ⏱️, który nie zasłania danych na stronie i jest łatwy w obsłudze kciukiem.

## 🛠 Instalacja

### 📱 iOS (iPhone / iPad) - Metoda Userscripts
To najprostsza metoda nie wymagająca komputera Mac i konta deweloperskiego.

1.  Zainstaluj darmową aplikację **Userscripts** z App Store.
2.  Włącz rozszerzenie: `Ustawienia` -> `Safari` -> `Rozszerzenia` -> `Userscripts` (ustaw na *Pozwól*).
3.  Skopiuj zawartość pliku: `iOS/czas-niebezpieczny_iOS-safari.js`.
4.  W aplikacji Userscripts utwórz nowy skrypt dla domeny `irena1.intercity.pl` i wklej skopiowany kod.

### 💻 macOS (Safari)
1.  Pobierz repozytorium i otwórz folder `macOS/` w programie **Xcode**.
2.  W Safari włącz menu `Programowanie` (`Ustawienia` -> `Zaawansowane`).
3.  W menu `Programowanie` zaznacz opcję **Zezwalaj na nierozpoznane rozszerzenia**.
4.  Uruchom projekt w Xcode (Build & Run). Rozszerzenie pojawi się w Safari.

## 📖 Instrukcja Użycia

1.  Otwórz system **Irena** i wejdź w edycję wybranej karty pracy.
2.  Kliknij ikonę **⏱️** (na iOS) lub ikonę rozszerzenia w pasku Safari (macOS).
3.  Kliknij przycisk **PRZELICZ** – wtyczka wyświetli listę znalezionych czynności i ich zsumowany czas.
4.  Kliknij **WSTAW** – suma zostanie automatycznie dodana do Twojego komentarza na dole strony.

## 🔒 Prywatność i Bezpieczeństwo
* Wszystkie obliczenia wykonywane są lokalnie w przeglądarce użytkownika.
* Kod jest w pełni otwarty i bezpieczny.

## 👥 Współautorzy
Projekt powstał przy współpracy:
* [Piotr M 🚂](https://github.com/piotrrgw)
* [Thundo](https://github.com/Thundo)
* Gemini (Model AI)
