/*
 * Wersja aplikacji: v1.8
 * Autorzy: Piotr M, Thundo & Gemini
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnCalc = document.getElementById('btn-calc');
  const btnInsert = document.getElementById('btn-insert');
  const sumEl = document.getElementById('sum');
  const listEl = document.getElementById('list');
  const footerEl = document.querySelector('.footer');

  // Dynamiczna stopka
  if (footerEl) {
    footerEl.innerHTML = `Współautorzy: Piotr M 🚂, Thundo & Gemini<br>Wersja aplikacji: v1.8`;
  }

  let foundDataFrameId = null;

  function scrapeDataFromPage() {
    function timeToMinutes(t) {
      if (!t) return 0;
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    }

    const listItems = document.querySelectorAll(".component-info.list-item");
    if (!listItems || listItems.length === 0) return null;

    const details = [];

    listItems.forEach(item => {
      item.style.background = "";
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

      const isObjecie = type.includes("DK Objęcie pociągu");
      const isPrzekazanie = type.includes("DK Przekazanie pociągu");
      const isProba = type.includes("DK Próba hamulca");
      const isManewry = type.includes("DK Prace Manewrowe KP");

      if (!isObjecie && !isPrzekazanie && !isProba && !isManewry) return;

      const startInput = item.querySelector('.actual-duty-time-field-start input[type="time"]');
      const endInput = item.querySelector('.actual-duty-time-field-end input[type="time"]');

      if (!startInput || !endInput) return;
      const start = startInput.value;
      const end = endInput.value;
      if (!start || !end) return;

      let realMinutes = timeToMinutes(end) - timeToMinutes(start);
      if (realMinutes < 0) realMinutes += 1440; 

      let countedMinutes = realMinutes;
      if (isObjecie) {
        countedMinutes = Math.min(realMinutes, 20);
        item.style.background = "rgba(255, 235, 59, 0.2)";
      } else if (isPrzekazanie) {
        countedMinutes = Math.min(realMinutes, 10);
        item.style.background = "rgba(33, 150, 243, 0.15)";
      } else if (isProba || isManewry) {
        item.style.background = "rgba(76, 175, 80, 0.15)";
      }

      details.push({ start, end, type, realMinutes, countedMinutes });
    });

    return details;
  }

  btnCalc.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        func: scrapeDataFromPage
      }, (results) => {
        const validResult = results.find(r => r.result !== null);
        if (validResult) {
          foundDataFrameId = validResult.frameId;
          const details = validResult.result;
          const total = details.reduce((sum, d) => sum + d.countedMinutes, 0);
          sumEl.textContent = `Suma: ${total} min`;
          listEl.innerHTML = details.map(d => `
            <div class="list-item-row">
              <strong>${d.start}-${d.end}</strong>: ${d.countedMinutes}m<br><small>${d.type}</small>
            </div>`).join('');
        } else {
          listEl.textContent = "Brak danych do przeliczenia.";
        }
      });
    });
  });

  btnInsert.addEventListener('click', (e) => {
    e.preventDefault();
    if (foundDataFrameId === null) return alert("Najpierw kliknij Przelicz.");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "INSERT_DATA" }, { frameId: foundDataFrameId }, (resp) => {
        if (resp && resp.success) btnInsert.textContent = "Wstawiono!";
      });
    });
  });
});