# Czas Niebezpieczny (Safari Extension)

**Wersja:** 1.8
**Data wydania:** 2026-01-06
**Autorzy:** 
* Piotr M 🚂
* Thundo ([GitHub](https://github.com/Thundo54))
* Gemini

## Opis
Rozszerzenie do przeglądarki Safari, stworzone w celu automatyzacji obliczania "czasu niebezpiecznego" w systemie kart pracy (Intercity). Wtyczka skanuje otwartą kartę, identyfikuje czynności uznawane za niebezpieczne, weryfikuje ich czas trwania zgodnie z regulaminem i sumuje minuty, które należy wpisać do raportu.

## Główne Funkcje

1.  **Automatyczne Wykrywanie:** Skanuje wszystkie ramki (frames) na stronie w poszukiwaniu listy czynności.
2.  **Inteligentna Kalkulacja:**
    * **DK Objęcie pociągu:** Czas rzeczywisty, ale nie więcej niż **20 minut**.
    * **DK Przekazanie pociągu:** Czas rzeczywisty, ale nie więcej niż **10 minut**.
    * **DK Próba hamulca:** Liczony pełny czas rzeczywisty.
3.  **Wizualizacja:** Podświetla wykryte czynności na liście kolorami (żółty, niebieski, fioletowy) dla łatwej weryfikacji.
4.  **Wstawianie Raportu:** Jednym kliknięciem wstawia sumę (np. `N: 25m`) do pola komentarza na karcie.

## Instalacja

1.  Upewnij się, że masz włączone menu "Programowanie" (Develop) w Safari.
2.  Zbuduj pakiet rozszerzenia przy użyciu Xcode lub odpowiedniego konwertera dla Safari Web Extensions.
3.  Załaduj rozszerzenie jako "Niespakowane rozszerzenie" (Unpacked) lub zainstaluj zbudowaną aplikację.

## Użycie

1.  Wejdź na stronę edycji karty w systemie `irena1.intercity.pl`.
2.  Kliknij ikonę rozszerzenia na pasku narzędzi.
3.  Kliknij przycisk **"Przelicz"**.
    * Lista czynności zostanie wyświetlona w oknie wtyczki.
    * Na stronie czynności zostaną podświetlone.
4.  Jeśli suma jest poprawna, kliknij **"Wstaw"**, aby dodać wpis do pola komentarza.

## Wymagania Techniczne
* Manifest V3
* Uprawnienia: `activeTab`, `scripting`
* Zgodność z WCAG i EAA (dostępność)

---
*Wygenerowano przy wsparciu AI.*