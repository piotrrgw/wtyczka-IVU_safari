# Czas Niebezpieczny - Rozszerzenie dla systemów IVU (Irena / Portal)

Profesjonalne narzędzie wspomagające pracowników w automatycznym wyliczaniu tzw. **czasu niebezpiecznego** w systemach Irena oraz Portal IVU. Narzędzie jest aplikacją w pełni zgodną z EAA i WCAG, przygotowaną do wyświetlania na urządzeniach z małymi ekranami. Dostępne jest jako pełne rozszerzenie dla przeglądarki Safari (macOS) oraz jako skrypt użytkownika (iOS/Android).

## 🚀 Kluczowe Funkcje
* **Automatyczne Obliczenia:** System rozpoznaje czynności i stosuje limity:
    * **DK Objęcie pociągu:** limit do 20 minut.
    * **DK Przekazanie pociągu:** limit do 10 minut.
    * **DK Próba hamulca:** pełny czas rzeczywisty.
    * **DK Prace Manewrowe KP:** pełny czas rzeczywisty.
* **Integracja:** Automatyczne wstawianie wyniku (np. `N: 25m`) do komentarza w karcie pracy.
* **Obsługiwane platformy:** Narzędzie działa na adresach `irena1.intercity.pl` oraz `portal.intercity.pl`.

---

## 📲 Instrukcja instalacji - Android (Firefox + Tampermonkey)

Skrypt napisany z myślą o iOS doskonale działa również na smartfonach z systemem Android. Aby go uruchomić, należy zainstalować przeglądarkę obsługującą dodatki:

1. **Zainstaluj przeglądarkę Firefox:** Pobierz i zainstaluj aplikację **Firefox** ze sklepu Google Play.
2. **Dodaj rozszerzenie Tampermonkey:** Otwórz przeglądarkę Firefox, wejdź w menu (trzy kropki) -> **Dodatki**, a następnie wyszukaj i zainstaluj rozszerzenie **Tampermonkey**.
3. **Zainstaluj skrypt:** * Skopiuj poniższy link do skryptu:
     `https://raw.githubusercontent.com/piotrrgw/wtyczka-IVU_safari/main/iOS/czas-niebezpieczny_iOS-safari.js`
   * Otwórz panel Tampermonkey w przeglądarce i wybierz opcję dodania nowego skryptu.
   * Wklej skopiowany kod lub użyj opcji instalacji z adresu URL, a następnie zapisz.
4. **Gotowe!** Po zalogowaniu do systemu na ekranie pojawi się pływająca ikona kalkulatora (stoper ⏱️).

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
* **Wersja macOS:** v1.9
* **Wersja iOS/Android:** v2.9
* **Prywatność:** Projekt nie wykorzystuje Google Tag Manager (GTM) ani żadnych innych systemów analitycznych.

---

* **Piotr M** ([GitHub](https://github.com/piotrrgw))
* **Thundo** ([GitHub](https://github.com/Thundo54))
* **Gemini** (Model AI)

---

Wersja aplikacji: v2.9
