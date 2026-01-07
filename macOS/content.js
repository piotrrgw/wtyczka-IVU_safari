/*
 * Wersja aplikacji: v1.8
 * Autorzy: Piotr M (https://github.com/piotrrgw), Thundo (https://github.com/Thundo54) & Gemini
 */

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calculateDangerDetails() {
  const listItems = document.querySelectorAll(".component-info.list-item");
  if (!listItems.length) return [];
  const details = [];

  listItems.forEach(item => {
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
    if (isObjecie) countedMinutes = Math.min(realMinutes, 20);
    else if (isPrzekazanie) countedMinutes = Math.min(realMinutes, 10);

    details.push({ countedMinutes });
  });

  return details;
}

function insertToComment(totalMinutes) {
  const textarea = document.querySelector("#comment");
  if (!textarea) return { success: false, message: "Brak pola komentarza." };

  let text = textarea.value || "";
  text = text.replace(/\n?N:\s*\d+m/g, "").trimEnd();

  if (totalMinutes > 0) {
    textarea.value = text ? `${text}\nN: ${totalMinutes}m` : `N: ${totalMinutes}m`;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    return { success: true };
  } else {
    return { success: false, message: "Suma minut wynosi 0." };
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "INSERT_DATA") {
    const details = calculateDangerDetails();
    const total = details.reduce((sum, d) => sum + d.countedMinutes, 0);
    const result = insertToComment(total);
    sendResponse(result);
  }
  return true;
});