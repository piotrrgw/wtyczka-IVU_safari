/*
 * Version: 1.7
 * Created: 2026-01-04
 * Description: Fix: Uses Direct Injection to force scraping in all frames immediately.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnCalc = document.getElementById('btn-calc');
  const btnInsert = document.getElementById('btn-insert');
  const sumEl = document.getElementById('sum');
  const listEl = document.getElementById('list');

  // Zmienna globalna do przechowywania ID ramki, w której znaleźliśmy dane
  // Potrzebna, żeby wiedzieć gdzie wysłać polecenie "Wstaw"
  let foundDataFrameId = null;

  // --- FUNKCJA SKRAPUJĄCA (Działa wewnątrz strony) ---
  // Ta funkcja zostanie wstrzyknięta do każdej ramki na stronie
  function scrapeDataFromPage() {
    // Funkcja pomocnicza czasu (wewnątrz scope'u wstrzyknięcia)
    function timeToMinutes(t) {
      if (!t) return 0;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    }

    const listItems = document.querySelectorAll(".component-info.list-item");
    if (!listItems || listItems.length === 0) return null; // Brak danych w tej ramce

    const details = [];

    listItems.forEach(item => {
      // Reset tła (żeby nie nakładać kolorów wielokrotnie)
      item.style.background = "";

      // 1. Pobieranie typu (Input lub Label)
      let type = "";
      const typeInput = item.querySelector('.actual-duty-component-type input');
      if (typeInput && typeInput.value) {
        type = typeInput.value;
      } else {
        const typeLabel = item.querySelector('.actual-duty-component-type label.changed-label');
        if (typeLabel) type = typeLabel.textContent;
      }
      
      if (!type) return;
      type = type.trim();

      // 2. Filtrowanie
      const isObjecie = type.includes("DK Objęcie pociągu");
      const isPrzekazanie = type.includes("DK Przekazanie pociągu");
      const isProba = type.includes("DK Próba hamulca");

      if (!isObjecie && !isPrzekazanie && !isProba) return;

      // 3. Pobieranie czasu
      const startInput = item.querySelector('.actual-duty-time-field-start input[type="time"]');
      const endInput = item.querySelector('.actual-duty-time-field-end input[type="time"]');

      if (!startInput || !endInput) return;
      const start = startInput.value;
      const end = endInput.value;
      if (!start || !end) return;

      // 4. Obliczenia
      let realMinutes = timeToMinutes(end) - timeToMinutes(start);
      if (realMinutes < 0) realMinutes += 1440; 

      let countedMinutes = realMinutes;

      // 5. Kolorowanie i limity
      if (isObjecie) {
        countedMinutes = Math.min(realMinutes, 20);
        item.style.background = "rgba(255, 235, 59, 0.25)";
      } else if (isPrzekazanie) {
        countedMinutes = Math.min(realMinutes, 10);
        item.style.background = "rgba(33, 150, 243, 0.20)";
      } else if (isProba) {
        item.style.background = "rgba(79, 20, 241, 0.2)";
      }

      details.push({
        start, end, type, realMinutes, countedMinutes
      });
    });

    return details;
  }
  // --- KONIEC FUNKCJI SKRAPUJĄCEJ ---


  // Obsługa przycisku PRZELICZ
  btnCalc.addEventListener('click', (e) => {
    e.preventDefault();
    listEl.textContent = "Skanowanie ramek...";
    foundDataFrameId = null; // Reset

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;
      const tabId = tabs[0].id;

      // Wstrzykujemy funkcję scrapeDataFromPage do WSZYSTKICH ramek
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: scrapeDataFromPage
      }, (results) => {
        if (chrome.runtime.lastError || !results) {
          console.warn("Script error:", chrome.runtime.lastError);
          listEl.textContent = "Błąd dostępu do strony.";
          return;
        }

        // Szukamy ramki, która zwróciła tablicę z danymi (nie null)
        const validResult = results.find(r => r.result !== null && Array.isArray(r.result));

        if (validResult) {
          foundDataFrameId = validResult.frameId; // Zapisujemy ID ramki na później!
          const details = validResult.result;
          
          // Oblicz sumę
          const total = details.reduce((sum, d) => sum + d.countedMinutes, 0);
          sumEl.textContent = `Czas niebezpieczny: ${total} min`;
          listEl.innerHTML = "";

          if (details.length === 0) {
            listEl.textContent = "Znaleziono listę, ale brak czynności niebezpiecznych.";
          } else {
            details.forEach(item => {
              const div = document.createElement("div");
              div.className = "list-item-row";
              div.innerHTML = `
                <div class="list-item-header">${item.start} - ${item.end} (${item.type})</div>
                <div class="list-item-details">Rzeczywisty: ${item.realMinutes}m | Liczony: ${item.countedMinutes}m</div>
              `;
              listEl.appendChild(div);
            });
          }

        } else {
          listEl.textContent = "Brak danych. Upewnij się, że jesteś w edycji karty.";
          sumEl.textContent = "Czas niebezpieczny: -";
        }
      });
    });
  });

  // Obsługa przycisku WSTAW
  btnInsert.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Jeśli nie przeliczyliśmy wcześniej, nie wiemy gdzie wstawić
    if (foundDataFrameId === null) {
      alert("Najpierw kliknij PRZELICZ, aby znaleźć odpowiednią ramkę.");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Wysyłamy wiadomość TYLKO do znalezionej wcześniej ramki
      chrome.tabs.sendMessage(
        tabs[0].id, 
        { type: "INSERT_DATA" }, 
        { frameId: foundDataFrameId }, 
        (response) => {
          if (chrome.runtime.lastError) {
            alert("Błąd komunikacji: " + chrome.runtime.lastError.message);
          } else if (response && response.success) {
            const originalText = btnInsert.textContent;
            btnInsert.textContent = "Gotowe!";
            setTimeout(() => btnInsert.textContent = originalText, 1500);
          } else {
            alert(response && response.message ? response.message : "Błąd wstawiania.");
          }
        }
      );
    });
  });
});